import { redirect } from "next/navigation";
import { getUsuarioAtual, type UsuarioSessao } from "@/lib/auth";

export async function exigeNivel(
  niveis: Array<"cliente" | "admin" | "dev">
): Promise<UsuarioSessao> {
  const usuario = await getUsuarioAtual();
  if (!usuario) {
    redirect("/entrar");
  }
  if (!niveis.includes(usuario.nivel)) {
    redirect("/");
  }
  return usuario;
}
