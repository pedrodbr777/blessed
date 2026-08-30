import { createClient, type InValue } from "@libsql/client/http";
import type { Client } from "@libsql/client";
import path from "node:path";
import fs from "node:fs";
import bcrypt from "bcryptjs";
import { EMAIL_MASTER, SENHA_MASTER } from "@/lib/permissoes";

const TURSO_URL = (process.env.TURSO_DATABASE_URL || "").trim();
const TURSO_TOKEN = (process.env.TURSO_AUTH_TOKEN || "").trim();

export const isCloud = TURSO_URL.startsWith("http") || TURSO_URL.startsWith("libsql");

// No servidorless (Vercel) o filesystem é somente-leitura e não há arquivo local.
// Só trabalha com o disco quando não está no modo nuvem.
const dataDir = path.join(process.cwd(), "data");
if (!isCloud) {
  fs.mkdirSync(dataDir, { recursive: true });
}
export const dbPath = isCloud ? "" : path.join(dataDir, "blessed.db");

const client: Client = isCloud
  ? createClient({ url: TURSO_URL, authToken: TURSO_TOKEN })
  : createClient({ url: `file:${dbPath}` });

let initPromise: Promise<void> | null = null;

function ensureInit(): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      await client.batch(
        [
          `CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            senha_hash TEXT NOT NULL,
            nivel TEXT NOT NULL DEFAULT 'cliente',
            bloqueado INTEGER NOT NULL DEFAULT 0,
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
        ],
        "write"
      );

      try {
        await client.execute(
          "ALTER TABLE usuarios ADD COLUMN bloqueado INTEGER NOT NULL DEFAULT 0"
        );
      } catch {
        // Coluna já existe em bancos criados antes da migração.
      }

      const defaultConfig: Record<string, string> = {
        cor_principal: "#0f0f0f",
        cor_destaque: "#e0b84f",
        titulo_site: "BLESSED",
        slogan: "Moda e atitude",
        banner_imagem: "",
        banner_texto: "Ver a Loja",
        banner_link: "/produtos",
      };

      await client.batch(
        Object.entries(defaultConfig).map(([chave, valor]) => ({
          sql: "INSERT OR IGNORE INTO config_site (chave, valor) VALUES (?, ?)",
          args: [chave, valor],
        })),
        "write"
      );

      const count = await client.execute({
        sql: "SELECT COUNT(*) AS total FROM usuarios WHERE nivel = 'dev'",
      });
      if (Number(count.rows[0]?.total || 0) === 0) {
        const email = process.env.DEV_EMAIL || "pedrolopesieq2024@gmail.com";
        const senha = process.env.DEV_SENHA || "05249315690As#";
        const hash = bcrypt.hashSync(senha, 10);
        await client.execute({
          sql: "INSERT INTO usuarios (nome, email, senha_hash, nivel) VALUES (?, ?, ?, 'dev')",
          args: ["Dev Pedro", email, hash],
        });
        console.log("Usuário Dev criado:", email);
      }

      // Conta Admin Master nunca pode ser removida nem banida.
      const master = await client.execute({
        sql: "SELECT id FROM usuarios WHERE email = ?",
        args: [EMAIL_MASTER],
      });
      if (master.rows.length === 0) {
        const hash = bcrypt.hashSync(SENHA_MASTER, 10);
        await client.execute({
          sql: "INSERT INTO usuarios (nome, email, senha_hash, nivel) VALUES (?, ?, ?, 'admin_master')",
          args: ["Admin Master", EMAIL_MASTER, hash],
        });
        console.log("Admin Master criado:", EMAIL_MASTER);
      } else {
        await client.execute({
          sql: "UPDATE usuarios SET nivel = 'admin_master', bloqueado = 0 WHERE email = ?",
          args: [EMAIL_MASTER],
        });
      }
    })().catch((err) => {
      initPromise = null;
      throw err;
    });
  }
  return initPromise;
}

export type Row = Record<string, unknown>;

export const db = {
  async all(sql: string, ...params: InValue[]): Promise<Row[]> {
    await ensureInit();
    const r = await client.execute({ sql, args: params });
    return r.rows as Row[];
  },
  async get<T = Row>(sql: string, ...params: InValue[]): Promise<T | undefined> {
    await ensureInit();
    const r = await client.execute({ sql, args: params });
    return r.rows[0] as T | undefined;
  },
  async run(
    sql: string,
    ...params: InValue[]
  ): Promise<{ changes: number; lastInsertRowid: number }> {
    await ensureInit();
    const r = await client.execute({ sql, args: params });
    return {
      changes: r.rowsAffected,
      lastInsertRowid: Number(r.lastInsertRowid || 0),
    };
  },
};

export async function getDbClient(): Promise<Client> {
  await ensureInit();
  return client;
}