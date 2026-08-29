import { db } from "@/lib/db";

export interface SiteConfig {
  corPrincipal: string;
  corDestaque: string;
  tituloSite: string;
  slogan: string;
  bannerImagem: string;
  bannerTexto: string;
  bannerLink: string;
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const rows = await db.all("SELECT chave, valor FROM config_site") as {
    chave: string;
    valor: string;
  }[];

  const map: Record<string, string> = {};
  for (const r of rows) {
    map[r.chave] = r.valor;
  }

  return {
    corPrincipal: map["cor_principal"] || "#0f0f0f",
    corDestaque: map["cor_destaque"] || "#e0b84f",
    tituloSite: map["titulo_site"] || "BLESSED",
    slogan: map["slogan"] || "Moda e atitude",
    bannerImagem: map["banner_imagem"] || "",
    bannerTexto: map["banner_texto"] || "Ver a Loja",
    bannerLink: map["banner_link"] || "/produtos",
  };
}
