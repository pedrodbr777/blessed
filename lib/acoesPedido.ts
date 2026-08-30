"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { exigeNivel } from "@/lib/protecao";
import { enviarEmailPedidoAprovado } from "@/lib/emails";

export async function atualizarStatusPedido(formData: FormData) {
  await exigeNivel(["admin", "dev"]);
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") || "novo");

  const pedido = await db.get<{
    id: number;
    cliente_id: number | null;
    nome_cliente: string;
    total: number;
  }>("SELECT id, cliente_id, nome_cliente, total FROM pedidos WHERE id = ?", id);

  await db.run("UPDATE pedidos SET status = ? WHERE id = ?", status, id);

  if (status === "confirmado" && pedido?.cliente_id) {
    const cliente = await db.get<{ email: string; nome: string }>(
      "SELECT email, nome FROM usuarios WHERE id = ?",
      pedido.cliente_id
    );
    const itens = (await db.all(
      "SELECT i.nome_produto AS nome, i.quantidade, i.preco, i.tamanho FROM itens_pedido i WHERE i.pedido_id = ?",
      id
    )) as unknown as { nome: string; quantidade: number; preco: number; tamanho: string }[];

    if (cliente?.email) {
      await enviarEmailPedidoAprovado({
        para: cliente.email,
        nomeCliente: pedido.nome_cliente || cliente.nome,
        pedidoId: id,
        total: pedido.total,
        itens,
      });
    }
  }

  revalidatePath("/admin/pedidos");
}
