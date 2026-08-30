import type { Metadata } from "next";
import "./globals.css";
import { getSiteConfig } from "@/lib/config";
import Providers from "@/components/Providers";
import Footer from "@/components/Footer";
import PwaRegistrar from "@/components/PwaRegistrar";

export const metadata: Metadata = {
  title: "Blessed",
  description: "Loja Blessed - Moda e atitude",
  manifest: "/manifest.webmanifest",
  applicationName: "Blessed",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Blessed",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-touch-icon.png",
    shortcut: "/icon-192.png",
  },
};

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
            --cor-fundo: #faf7f2;
            --cor-texto: #1a1a1a;
            --cor-texto-claro: #f5f5f5;
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
