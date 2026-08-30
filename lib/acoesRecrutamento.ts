"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { exigeNivel } from "@/lib/protecao";
import { EMAIL_MASTER, senhaRecrutamento } from "@/lib/permissoes";
import { SECRET } from "@/lib/auth";

const COOKIE_PERMISSAO = "blessed_recrutamento";

export async function recrutamentoAutorizado(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_PERMISSAO)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload.ok === true;
  } catch {
    return false;
  }
}

export async function autorizarRecrutamento(formData: FormData) {
  await exigeNivel(["admin_master"]);
  const senha = String(formData.get("senha") || "");
  const destino = String(formData.get("destino") || "/admin/recrutar");

  if (senha !== senhaRecrutamento()) {
    redirect(
      `${destino}?erro=${encodeURIComponent("Senha incorreta.")}`
    );
  }

  const token = await new SignJWT({ ok: true })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("60m")
    .sign(SECRET);

  const store = await cookies();
  store.set(COOKIE_PERMISSAO, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });

  redirect(destino);
}

export async function criarAdmin(formData: FormData) {
  await exigeNivel(["admin_master"]);
  if (!(await recrutamentoAutorizado())) {
    redirect("/admin/recrutar/novo");
  }

  const nome = String(formData.get("nome") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const senha = String(formData.get("senha") || "");

  if (!nome || !email || senha.length < 6) {
    redirect(
      `/admin/recrutar/novo?erro=${encodeURIComponent(
        "Preencha nome, email e uma senha de pelo menos 6 caracteres."
      )}`
    );
  }

  const existente = await db.get("SELECT id FROM usuarios WHERE email = ?", email);
  if (existente) {
    redirect(
      `/admin/recrutar/novo?erro=${encodeURIComponent(
        "Este email já está cadastrado."
      )}`
    );
  }

  const hash = bcrypt.hashSync(senha, 10);
  await db.run(
    "INSERT INTO usuarios (nome, email, senha_hash, nivel) VALUES (?, ?, ?, 'admin')",
    nome,
    email,
    hash
  );

  redirect(
    `/admin/recrutar/novo?ok=${encodeURIComponent(
      "Novo admin criado com sucesso."
    )}`
  );
}

export async function banirUsuario(formData: FormData) {
  await exigeNivel(["admin_master"]);
  if (!(await recrutamentoAutorizado())) {
    redirect("/admin/recrutar/banir");
  }

  const id = Number(formData.get("id"));

  const alvo = await db.get<{ email: string; nivel: string }>(
    "SELECT email, nivel FROM usuarios WHERE id = ?",
    id
  );

  if (!alvo) {
    redirect(
      `/admin/recrutar/banir?erro=${encodeURIComponent("Usuário não encontrado.")}`
    );
  }
  if (alvo.email === EMAIL_MASTER) {
    redirect(
      `/admin/recrutar/banir?erro=${encodeURIComponent(
        "Esta conta não pode ser banida."
      )}`
    );
  }
  if (alvo.nivel === "dev" || alvo.nivel === "admin_master") {
    redirect(
      `/admin/recrutar/banir?erro=${encodeURIComponent(
        "Só é permitido banir admins ou clientes."
      )}`
    );
  }

  await db.run("UPDATE usuarios SET bloqueado = 1 WHERE id = ?", id);
  revalidatePath("/admin/recrutar/banir");
  redirect(
    `/admin/recrutar/banir?ok=${encodeURIComponent("Conta banida com sucesso.")}`
  );
}