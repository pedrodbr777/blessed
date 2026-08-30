import { redirect } from "next/navigation";
import { getUsuarioAtual, type UsuarioSessao } from "@/lib/auth";

export async function exigeNivel(
  niveis: Array<"cliente" | "admin" | "admin_master" | "dev">
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
