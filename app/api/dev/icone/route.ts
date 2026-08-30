import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { exigeNivel } from "@/lib/protecao";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    await exigeNivel(["dev"]);
    const form = await req.formData();
    const valor = String(form.get("app_icone") || "").trim();
    if (!valor) return NextResponse.json({ erro: "URL do ícone vazia." }, { status: 400 });
    await db.run(
      `INSERT INTO config_site (chave, valor) VALUES ('app_icone', ?)
       ON CONFLICT(chave) DO UPDATE SET valor = excluded.valor`,
      valor
    );
    revalidatePath("/admin/dev");
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erro ao salvar ícone.";
    return NextResponse.json({ erro: msg }, { status: 401 });
  }
}