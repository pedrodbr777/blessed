"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getUsuarioAtual } from "@/lib/auth";
import { exigeNivel } from "@/lib/protecao";

export interface FormState {
  erro?: string;
  sucesso?: string;
}

export async function solicitarTrocaAction(
  previousState: unknown,
  formData: FormData
): Promise<FormState> {
  const usuario = await getUsuarioAtual();
  if (!usuario) return { erro: "Você precisa estar logado." };

  const pedidoId = Number(formData.get("pedidoId"));
  const motivo = String(formData.get("motivo") || "").trim();
  const imagem = String(formData.get("imagem") || "").trim();

  if (!pedidoId) return { erro: "Selecione o pedido da troca." };
  if (motivo.length < 5) return { erro: "Escreva o motivo da troca (mín. 5 caracteres)." };

  const pedido = await db.get<{ id: number; cliente_id: number }>(
    "SELECT id, cliente_id FROM pedidos WHERE id = ?",
    pedidoId
  );
  if (!pedido || pedido.cliente_id !== usuario.id) {
    return { erro: "Este pedido não pertence à sua conta." };
  }

  await db.run(
    "INSERT INTO trocas (pedido_id, cliente_id, motivo, imagem) VALUES (?, ?, ?, ?)",
    pedidoId,
    usuario.id,
    motivo,
    imagem
  );

  revalidatePath("/minha-conta");
  revalidatePath("/admin/trocas");
  return { sucesso: "Solicitação de troca enviada! A loja vai avaliar." };
}

export async function avaliarTrocaAction(formData: FormData): Promise<void> {
  await exigeNivel(["admin", "dev"]);

  const id = Number(formData.get("id"));
  const status = String(formData.get("status") || "pendente");
  const resposta = String(formData.get("resposta") || "").trim();

  if (!id) throw new Error("Solicitação inválida.");
  if (!["pendente", "aprovado", "recusado"].includes(status)) {
    throw new Error("Status inválido.");
  }

  await db.run(
    "UPDATE trocas SET status = ?, resposta = ?, atualizado_em = datetime('now') WHERE id = ?",
    status,
    resposta,
    id
  );

  revalidatePath("/admin/trocas");
  revalidatePath("/minha-conta");
}