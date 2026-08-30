import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { put } from "@vercel/blob";
import { getUsuarioAtual } from "@/lib/auth";

export const dynamic = "force-dynamic";

const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 5 * 1024 * 1024;

function extrairExt(type: string): string {
  if (type === "image/jpeg") return ".jpg";
  if (type === "image/png") return ".png";
  if (type === "image/webp") return ".webp";
  return ".gif";
}

export async function POST(req: NextRequest) {
  const usuario = await getUsuarioAtual();
  if (!usuario) {
    return NextResponse.json({ erro: "Não autenticado." }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const arquivo = form?.get("arquivo");

  if (!arquivo || !(arquivo instanceof File)) {
    return NextResponse.json({ erro: "Nenhum arquivo enviado." }, { status: 400 });
  }

  if (!TIPOS_PERMITIDOS.includes(arquivo.type)) {
    return NextResponse.json(
      { erro: "Formato não permitido. Use JPG, PNG, WEBP ou GIF." },
      { status: 400 }
    );
  }

  if (arquivo.size > MAX_BYTES) {
    return NextResponse.json(
      { erro: "Imagem muito grande. Máximo de 5 MB." },
      { status: 400 }
    );
  }

  const ext = extrairExt(arquivo.type);
  const nome = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext}`;

  // Em produção (Vercel), armazena no Vercel Blob (nuvem).
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`uploads/${nome}`, arquivo, {
      access: "public",
      addRandomSuffix: false,
    });
    return NextResponse.json({ url: blob.url });
  }

  // Em desenvolvimento local, salva na pasta public/uploads.
  const bytes = Buffer.from(await arquivo.arrayBuffer());
  const dir = path.join(process.cwd(), "public", "uploads");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, nome), bytes);

  return NextResponse.json({ url: `/uploads/${nome}` });
}

export async function GET() {
  return NextResponse.json({});
}