import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const diag: Record<string, unknown> = {};
  diag["TURSO_DATABASE_URL.presente"] = Boolean(process.env.TURSO_DATABASE_URL);
  diag["TURSO_DATABASE_URL.prefixo"] = (process.env.TURSO_DATABASE_URL || "VAZIO").slice(0, 20);
  try {
    const db = await import("@/lib/db");
    diag["isCloud"] = db.isCloud;
    const t = Date.now();
    const rows = await db.db.all("SELECT * FROM produtos WHERE ativo = 1 LIMIT 3");
    diag["produtos"] = rows.length;
    diag["tempo_ms"] = Date.now() - t;
  } catch (e: unknown) {
    diag["ERRO"] = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
    diag["stack"] = e instanceof Error ? e.stack?.split("\n").slice(0, 6) : [];
  }
  return NextResponse.json(diag);
}
