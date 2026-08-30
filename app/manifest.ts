import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const config = await getSiteConfig();

  const temIcone = Boolean(config.appIcone);

  return {
    name: `${config.tituloSite} - ${config.slogan}`,
    short_name: config.tituloSite,
    description: `Loja ${config.tituloSite} - ${config.slogan}`,
    start_url: "/",
    display: "standalone",
    background_color: config.corFundo || "#faf7f2",
    theme_color: config.corPrincipal || "#0f0f0f",
    lang: "pt-BR",
    icons: temIcone
      ? [
          { src: "/api/icone?t=192", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/api/icone?t=192", sizes: "192x192", type: "image/png", purpose: "maskable" },
          { src: "/api/icone?t=512", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/api/icone?t=512", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ]
      : [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
  };
}