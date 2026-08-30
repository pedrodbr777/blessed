// Script de migração: copia os dados do banco local (SQLite)
// para o banco na nuvem Turso.
//
// Uso:
//  1. Defina as variáveis de ambiente ANTES de rodar (no terminal):
//     - TURSO_DATABASE_URL  (endereço libsql do seu banco)
//     - TURSO_AUTH_TOKEN    (token de acesso)
//     Exemplo (Prompt do seu PC):
//       $env:TURSO_DATABASE_URL = "libsql://seunome-org.turso.io"
//       $env:TURSO_AUTH_TOKEN = "eyJ..."
//       node scripts/migrar-para-nuvem.cjs
//
//  Este script NÃO apaga o banco local. Ele só acrescenta/copia dados.

const { createClient } = require("@libsql/client");
const { DatabaseSync } = require("node:sqlite");
const path = require("node:path");

async function main() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  if (!tursoUrl || !tursoToken) {
    console.error("ERRO: Defina TURSO_DATABASE_URL e TURSO_AUTH_TOKEN antes de rodar.");
    console.error("Exemplo:");
    console.error('  $env:TURSO_DATABASE_URL = "libsql://seunome-org.turso.io"');
    console.error('  $env:TURSO_AUTH_TOKEN = "eyJ..."');
    process.exit(1);
  }

  // Banco local (origem)
  const local = new DatabaseSync(path.join(process.cwd(), "data", "blessed.db"));

  // Banco na nuvem (destino)
  const remoto = createClient({ url: tursoUrl, authToken: tursoToken });

  // Cria as tabelas no banco remoto
  const schema = [
    `CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha_hash TEXT NOT NULL,
      nivel TEXT NOT NULL DEFAULT 'cliente',
      criado_em TEXT NOT NULL DEFAULT (datetime('now'))
    );`,
    `CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT NOT NULL DEFAULT '',
      preco REAL NOT NULL,
      categoria TEXT NOT NULL DEFAULT 'geral',
      imagem TEXT NOT NULL DEFAULT '',
      estoque INTEGER NOT NULL DEFAULT 0,
      ativo INTEGER NOT NULL DEFAULT 1,
      criado_em TEXT NOT NULL DEFAULT (datetime('now'))
    );`,
    `CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER,
      nome_cliente TEXT NOT NULL,
      endereco TEXT NOT NULL,
      contato TEXT NOT NULL,
      total REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'novo',
      criado_em TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (cliente_id) REFERENCES usuarios(id)
    );`,
    `CREATE TABLE IF NOT EXISTS itens_pedido (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pedido_id INTEGER NOT NULL,
      produto_id INTEGER NOT NULL,
      nome_produto TEXT NOT NULL,
      preco REAL NOT NULL,
      quantidade INTEGER NOT NULL,
      tamanho TEXT NOT NULL DEFAULT '',
      FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
    );`,
    `CREATE TABLE IF NOT EXISTS config_site (
      chave TEXT PRIMARY KEY,
      valor TEXT NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS trocas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pedido_id INTEGER NOT NULL,
      cliente_id INTEGER NOT NULL,
      motivo TEXT NOT NULL,
      imagem TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pendente',
      resposta TEXT NOT NULL DEFAULT '',
      criado_em TEXT NOT NULL DEFAULT (datetime('now')),
      atualizado_em TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
      FOREIGN KEY (cliente_id) REFERENCES usuarios(id)
    );`,
  ];
  await remoto.batch(schema, "write");
  console.log("Tabelas criadas no banco remoto.");

  // Usuários
  const usuarios = local.prepare("SELECT id, nome, email, senha_hash, nivel, criado_em FROM usuarios").all();
  for (const u of usuarios) {
    const existe = await remoto.execute({
      sql: "SELECT id FROM usuarios WHERE email = ?",
      args: [u.email],
    });
    if (existe.rows.length === 0) {
      await remoto.execute({
        sql: "INSERT INTO usuarios (nome, email, senha_hash, nivel, criado_em) VALUES (?, ?, ?, ?, ?)",
        args: [u.nome, u.email, u.senha_hash, u.nivel, u.criado_em],
      });
      console.log("  + usuário:", u.email, `(${u.nivel})`);
    } else {
      console.log("  = já existe:", u.email);
    }
  }

  // Produtos
  const produtos = local.prepare("SELECT * FROM produtos").all();
  for (const p of produtos) {
    await remoto.execute({
      sql: "INSERT OR IGNORE INTO produtos (id, nome, descricao, preco, categoria, imagem, estoque, ativo, criado_em) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      args: [p.id, p.nome, p.descricao, p.preco, p.categoria, p.imagem, p.estoque, p.ativo, p.criado_em],
    });
    console.log("  + produto:", p.nome);
  }

  // Pedidos e itens
  const pedidos = local.prepare("SELECT * FROM pedidos").all();
  for (const ped in pedidos) {
    const p = pedidos[ped];
    const existe = await remoto.execute({ sql: "SELECT id FROM pedidos WHERE id = ?", args: [p.id] });
    if (existe.rows.length === 0) {
      await remoto.execute({
        sql: "INSERT INTO pedidos (id, cliente_id, nome_cliente, endereco, contato, total, status, criado_em) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        args: [p.id, p.cliente_id, p.nome_cliente, p.endereco, p.contato, p.total, p.status, p.criado_em],
      });
      const itens = local.prepare("SELECT * FROM itens_pedido WHERE pedido_id = ?").all(p.id);
      for (const i of itens) {
        await remoto.execute({
          sql: "INSERT OR IGNORE INTO itens_pedido (id, pedido_id, produto_id, nome_produto, preco, quantidade, tamanho) VALUES (?, ?, ?, ?, ?, ?, ?)",
          args: [i.id, i.pedido_id, i.produto_id, i.nome_produto, i.preco, i.quantidade, i.tamanho],
        });
      }
      console.log("  + pedido #" + p.id);
    } else {
      console.log("  = pedido #" + p.id + " já existe");
    }
  }

  // Configurações
  const configs = local.prepare("SELECT chave, valor FROM config_site").all();
  for (const c of configs) {
    await remoto.execute({
      sql: "INSERT OR IGNORE INTO config_site (chave, valor) VALUES (?, ?)",
      args: [c.chave, c.valor],
    });
  }
  console.log("Configurações copiadas.");

  // Trocas
  const trocas = local.prepare("SELECT * FROM trocas").all();
  for (const t of trocas) {
    const existe = await remoto.execute({ sql: "SELECT id FROM trocas WHERE id = ?", args: [t.id] });
    if (existe.rows.length === 0) {
      await remoto.execute({
        sql: "INSERT INTO trocas (id, pedido_id, cliente_id, motivo, imagem, status, resposta, criado_em, atualizado_em) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        args: [t.id, t.pedido_id, t.cliente_id, t.motivo, t.imagem, t.status, t.resposta, t.criado_em, t.atualizado_em],
      });
      console.log("  + troca #" + t.id);
    }
  }

  console.log("\nMigração concluída com sucesso!");
}

main().catch((e) => {
  console.error("ERRO na migração:", e);
  process.exit(1);
});