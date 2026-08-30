export const EMAIL_MASTER = "paula.ascomig@hotmail.com";
export const SENHA_MASTER = "1204";

export type Nivel = "cliente" | "admin" | "admin_master" | "dev";

export const NOME_NIVEL: Record<Nivel, string> = {
  cliente: "Cliente",
  admin: "Admin",
  admin_master: "Admin Master",
  dev: "Dev",
};

export function senhaRecrutamento(): string {
  return process.env.SENHA_RECRUTAMENTO || "1204";
}