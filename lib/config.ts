import { db } from "@/lib/db";

export interface SiteConfig {
  corPrincipal: string;
  corDestaque: string;
  corFundo: string;
  corTexto: string;
  corTextoClaro: string;
  tituloSite: string;
  slogan: string;
  tituloLoja: string;
  subtituloLoja: string;
rodapeTexto: string;
  logoImagem: string;
  appIcone: string;
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
    corFundo: map["cor_fundo"] || "#faf7f2",
    corTexto: map["cor_texto"] || "#1a1a1a",
    corTextoClaro: map["cor_texto_claro"] || "#f5f5f5",
    tituloSite: map["titulo_site"] || "BLESSED",
    slogan: map["slogan"] || "Moda e atitude",
    tituloLoja: map["titulo_loja"] || "Nossa Loja",
    subtituloLoja: map["subtitulo_loja"] || "Escolha a peça que combina com você",
    rodapeTexto: map["rodape_texto"] || "Blessed © Todos os direitos reservados.",
logoImagem: map["logo_imagem"] || "",
    appIcone: map["app_icone"] || "",
    bannerImagem: map["banner_imagem"] || "",
    bannerTexto: map["banner_texto"] || "Ver a Loja",
    bannerLink: map["banner_link"] || "/produtos",
  };
}
