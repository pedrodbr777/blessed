"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { exigeNivel } from "@/lib/protecao";

const CHAVES = [
  "cor_principal",
  "cor_destaque",
  "cor_fundo",
  "cor_texto",
  "cor_texto_claro",
  "titulo_site",
  "slogan",
  "titulo_loja",
  "subtitulo_loja",
  "rodape_texto",
"logo_imagem",
  "app_icone",
  "banner_imagem",
  "banner_texto",
  "banner_link",
];

export async function salvarConfig(formData: FormData) {
  await exigeNivel(["dev"]);

  for (const chave of CHAVES) {
    const valor = String(formData.get(chave) || "").trim();
    await db.run(
      `INSERT INTO config_site (chave, valor) VALUES (?, ?)
       ON CONFLICT(chave) DO UPDATE SET valor = excluded.valor`,
      chave,
      valor
    );
  }

  revalidatePath("/");
  revalidatePath("/produtos");
  revalidatePath("/admin/dev");
}

export async function salvarBannerImagem(url: string) {
  await exigeNivel(["dev"]);
  if (!url) return;
  await db.run(
    `INSERT INTO config_site (chave, valor) VALUES ('banner_imagem', ?)
     ON CONFLICT(chave) DO UPDATE SET valor = excluded.valor`,
    url
  );
  revalidatePath("/");
  revalidatePath("/admin/dev");
}
