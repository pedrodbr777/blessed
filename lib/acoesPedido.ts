"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { exigeNivel } from "@/lib/protecao";

export async function atualizarStatusPedido(formData: FormData) {
  await exigeNivel(["admin", "dev"]);
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") || "novo");
  await db.run("UPDATE pedidos SET status = ? WHERE id = ?", status, id);
  revalidatePath("/admin/pedidos");
}
