"use server";

import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUsuarioAtual } from "@/lib/auth";
import { enviarEmailRedefinirSenha } from "@/lib/emails";
import { redirect } from "next/navigation";

const SECRET = new TextEncoder().encode(
  process.env.SECRETO_SESSAO || "blessed-dev-segredo-mudar-em-producao"
);
const TOKEN_PREFIXO = "reset_";

export interface FormState {
  erro?: string;
  sucesso?: string;
}

function urlBase(): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL ||
    "http://localhost:3000";
  return base.startsWith("http") ? base : "https://" + base;
}

export async function esqueciSenhaAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!email) return { erro: "Informe seu email." };

  const usuario = await db.get<{ id: number; email: string; nome: string }>(
    "SELECT id, email, nome FROM usuarios WHERE email = ?",
    email
  );

  if (usuario) {
    const token = await new SignJWT({ id: usuario.id, email: usuario.email })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(SECRET);

    const link = `${urlBase()}/redefinir-senha?token=${TOKEN_PREFIXO}${token}`;
    await enviarEmailRedefinirSenha({
      para: usuario.email,
      nome: usuario.nome,
      link,
    });
  }

  return {
    sucesso:
      "Se este email existir, enviamos um link de redefinição. Confira sua caixa de entrada.",
  };
}

export async function redefinirSenhaAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const tokenCompleto = String(formData.get("token") || "");
  const senha = String(formData.get("senha") || "");

  if (!tokenCompleto.startsWith(TOKEN_PREFIXO)) {
    return { erro: "Link inválido. Solicite um novo link de redefinição." };
  }
  if (senha.length < 6) {
    return { erro: "A nova senha deve ter pelo menos 6 caracteres." };
  }

  try {
    const token = tokenCompleto.slice(TOKEN_PREFIXO.length);
    const { payload } = await jwtVerify(token, SECRET);
    const id = Number(payload.id);
    if (!id) throw new Error("id inválido");

    const hash = bcrypt.hashSync(senha, 10);
    await db.run("UPDATE usuarios SET senha_hash = ? WHERE id = ?", hash, id);

    return { sucesso: "Senha redefinida com sucesso! Faça login com a nova senha." };
  } catch {
    return {
      erro: "Link inválido ou expirado. Solicite um novo link de redefinição.",
    };
  }
}

export async function atualizarContaAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const usuario = await getUsuarioAtual();
  if (!usuario) return { erro: "Você precisa estar logado." };

  const nome = String(formData.get("nome") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const senhaAtual = String(formData.get("senhaAtual") || "");

  if (!nome || !email) return { erro: "Preencha nome e email." };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { erro: "Email inválido." };

  const usuarioCompleto = await db.get<{ senha_hash: string }>(
    "SELECT senha_hash FROM usuarios WHERE id = ?",
    usuario.id
  );
  if (!usuarioCompleto || !bcrypt.compareSync(senhaAtual, usuarioCompleto.senha_hash)) {
    return { erro: "Senha atual incorreta." };
  }

  const outro = await db.get<{ id: number }>(
    "SELECT id FROM usuarios WHERE email = ? AND id <> ?",
    email,
    usuario.id
  );
  if (outro) return { erro: "Este email já está em uso por outra conta." };

  await db.run("UPDATE usuarios SET nome = ?, email = ? WHERE id = ?", nome, email, usuario.id);

  return { sucesso: "Dados atualizados com sucesso!" };
}