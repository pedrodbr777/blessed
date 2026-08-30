import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { getSiteConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

const TAMANHOS = [144, 180, 192, 512];

const PADRAO: Record<number, string> = {
  144: "/icon-192.png",
  180: "/apple-touch-icon.png",
  192: "/icon-192.png",
  512: "/icon-512.png",
};

export async function GET(req: NextRequest) {
  const t = Math.trunc(Number(req.nextUrl.searchParams.get("t") || "512"));
  const tamanho = TAMANHOS.includes(t) ? t : 512;

  const origem = req.nextUrl.origin;
  const padrao = `${origem}${PADRAO[tamanho]}`;

  try {
    const config = await getSiteConfig();
    const urlIcone = config.appIcone;
    if (!urlIcone) {
      return NextResponse.redirect(padrao, 302);
    }

    const fonte = new URL(urlIcone, origem).toString();
    const resposta = await fetch(fonte, { cache: "no-store" });
    if (!resposta.ok) {
      return NextResponse.redirect(padrao, 302);
    }

    const buffer = Buffer.from(await resposta.arrayBuffer());
    const png = await sharp(buffer)
      .resize(tamanho, tamanho, { fit: "cover" })
      .png()
      .toBuffer();

    return new NextResponse(png, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=86400",
        "Content-Length": String(png.byteLength),
      },
    });
  } catch {
    return NextResponse.redirect(padrao, 302);
  }
}