"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { exigeNivel } from "@/lib/protecao";

async function guard() {
  await exigeNivel(["admin", "dev"]);
}

export async function criarProduto(formData: FormData) {
  await guard();
  const nome = String(formData.get("nome") || "").trim();
  const descricao = String(formData.get("descricao") || "").trim();
  const preco = Number(formData.get("preco") || 0);
  const categoria = String(formData.get("categoria") || "").trim() || "geral";
  const estoque = Number(formData.get("estoque") || 0);
  const imagem = String(formData.get("imagem") || "").trim();

  if (!nome || !preco || preco <= 0) {
    return;
  }

  await db.run(
    "INSERT INTO produtos (nome, descricao, preco, categoria, estoque, imagem) VALUES (?, ?, ?, ?, ?, ?)",
    nome,
    descricao,
    preco,
    categoria,
    estoque,
    imagem
  );

  revalidatePath("/");
  revalidatePath("/produtos");
  revalidatePath("/admin");
}

export async function atualizarProduto(formData: FormData) {
  await guard();
  const id = Number(formData.get("id"));
  const nome = String(formData.get("nome") || "").trim();
  const descricao = String(formData.get("descricao") || "").trim();
  const preco = Number(formData.get("preco") || 0);
  const categoria = String(formData.get("categoria") || "").trim() || "geral";
  const estoque = Number(formData.get("estoque") || 0);
  const imagem = String(formData.get("imagem") || "").trim();
  const ativo = formData.get("ativo") === "on" ? 1 : 0;

  if (!nome || !preco || preco <= 0) {
    return;
  }

  await db.run(
    "UPDATE produtos SET nome=?, descricao=?, preco=?, categoria=?, estoque=?, imagem=?, ativo=? WHERE id=?",
    nome,
    descricao,
    preco,
    categoria,
    estoque,
    imagem,
    ativo,
    id
  );

  revalidatePath("/");
  revalidatePath("/produtos");
  revalidatePath("/admin");
}

export async function excluirProduto(formData: FormData) {
  await guard();
  const id = Number(formData.get("id"));
  await db.run("DELETE FROM produtos WHERE id=?", id);
  revalidatePath("/");
  revalidatePath("/produtos");
  revalidatePath("/admin");
}
