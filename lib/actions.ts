"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { criarSessao, verificarSenha } from "@/lib/auth";
import bcrypt from "bcryptjs";

export interface FormState {
  erro?: string;
  sucesso?: boolean;
}

export async function loginAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const senha = String(formData.get("senha") || "");

  if (!email || !senha) {
    return { erro: "Preencha email e senha." };
  }

  const row = await db.get<{
    id: number;
    nome: string;
    email: string;
    senha_hash: string;
  }>("SELECT id, nome, email, senha_hash FROM usuarios WHERE email = ?", email);

  if (!row || !verificarSenha(senha, row.senha_hash)) {
    return { erro: "Email ou senha incorretos." };
  }

  await criarSessao(row.id);
  redirect("/");
}

export async function cadastroAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const nome = String(formData.get("nome") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const senha = String(formData.get("senha") || "");

  if (!nome || !email || senha.length < 6) {
    return {
      erro: "Preencha nome, email e uma senha de pelo menos 6 caracteres.",
    };
  }

  const existente = await db.get("SELECT id FROM usuarios WHERE email = ?", email);
  if (existente) {
    return { erro: "Este email já está cadastrado." };
  }

  const hash = bcrypt.hashSync(senha, 10);
  const result = await db.run(
    "INSERT INTO usuarios (nome, email, senha_hash, nivel) VALUES (?, ?, ?, 'cliente')",
    nome,
    email,
    hash
  );

  await criarSessao(Number(result.lastInsertRowid));
  redirect("/");
}
