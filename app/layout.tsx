import type { Metadata } from "next";
import "./globals.css";
import { getSiteConfig } from "@/lib/config";
import Providers from "@/components/Providers";
import Footer from "@/components/Footer";
import PwaRegistrar from "@/components/PwaRegistrar";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  const temIcone = Boolean(config.appIcone);
  return {
    title: config.tituloSite,
    description: `Loja ${config.tituloSite} - ${config.slogan}`,
    manifest: "/manifest.webmanifest",
    applicationName: config.tituloSite,
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: config.tituloSite,
    },
    icons: {
      icon: temIcone ? "/api/icone?t=192" : "/icon-192.png",
      apple: temIcone ? "/api/icone?t=180" : "/apple-touch-icon.png",
      shortcut: temIcone ? "/api/icone?t=192" : "/icon-192.png",
    },
  };
}

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getSiteConfig();

  return (
    <html lang="pt-BR">
      <head>
        <style>{`
          :root {
            --cor-principal: ${config.corPrincipal};
            --cor-destaque: ${config.corDestaque};
            --cor-fundo: ${config.corFundo};
            --cor-texto: ${config.corTexto};
            --cor-texto-claro: ${config.corTextoClaro};
            --sombra: 0 8px 30px rgba(0,0,0,0.12);
          }
        `}</style>
      </head>
      <body>
        <Providers>{children}</Providers>
        <PwaRegistrar />
        <Footer />
      </body>
    </html>
  );
}
