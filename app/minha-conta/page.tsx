import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import MinhaConta from "@/components/MinhaConta";
import { getSiteConfig } from "@/lib/config";
import { getUsuarioAtual } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

interface PedidoItem {
  nome: string;
  quantidade: number;
  preco: number;
  tamanho: string;
}

export default async function MinhaContaPage() {
  const config = await getSiteConfig();
  const usuario = await getUsuarioAtual();
  if (!usuario) {
    redirect("/entrar");
  }

  const pedidos = (await db.all(
    "SELECT id, criado_em, total, status FROM pedidos WHERE cliente_id = ? ORDER BY id DESC",
    usuario.id
  )) as unknown as { id: number; criado_em: string; total: number; status: string }[];

  const pedidosCast = await Promise.all(
    pedidos.map(async (p) => {
      const itens = (await db.all(
        "SELECT nome_produto AS nome, quantidade, preco, tamanho FROM itens_pedido WHERE pedido_id = ?",
        p.id
      )) as unknown as PedidoItem[];
      return { ...p, itens };
    })
  );

  const trocas = (await db.all(
    "SELECT * FROM trocas WHERE cliente_id = ? ORDER BY id DESC",
    usuario.id
  )) as unknown as {
    id: number;
    pedido_id: number;
    motivo: string;
    imagem: string;
    status: string;
    resposta: string;
    criado_em: string;
  }[];

  return (
    <>
      <Navbar
        titulo={config.tituloSite}
        corDestaque={config.corDestaque}
        logo={config.logoImagem} 
        usuarioNome={usuario.nome}
        usuarioNivel={usuario.nivel}
      />
      <MinhaConta
        nome={usuario.nome}
        email={usuario.email}
        pedidos={pedidosCast}
        trocas={trocas}
      />
    </>
  );
}