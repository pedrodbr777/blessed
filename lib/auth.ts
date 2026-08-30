import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const SECRET = new TextEncoder().encode(
  process.env.SECRETO_SESSAO || "blessed-dev-segredo-mudar-em-producao"
);

export type Nivel = "cliente" | "admin" | "admin_master" | "dev";

export interface UsuarioSessao {
  id: number;
  nome: string;
  email: string;
  nivel: Nivel;
}

const COOKIE_NOME = "blessed_sessao";

export async function criarSessao(usuarioId: number) {
  const token = await new SignJWT({ id: usuarioId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(SECRET);

  const store = await cookies();
  store.set(COOKIE_NOME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destruirSessao() {
  const store = await cookies();
  store.delete(COOKIE_NOME);
}

export async function getUsuarioAtual(): Promise<UsuarioSessao | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NOME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET);
    const id = Number(payload.id);
    const row = await db.get<{ id: number; nome: string; email: string; nivel: string }>(
      "SELECT id, nome, email, nivel FROM usuarios WHERE id = ? AND bloqueado = 0",
      id
    );
    if (!row) return null;
    return {
      id: row.id,
      nome: row.nome,
      email: row.email,
      nivel: row.nivel as Nivel,
    };
  } catch {
    return null;
  }
}

export function verificarSenha(senha: string, hash: string): boolean {
  return bcrypt.compareSync(senha, hash);
}
