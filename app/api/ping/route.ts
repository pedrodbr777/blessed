import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const db = await import("@/lib/db");
    const t = Date.now();
    await db.db.get("SELECT 1");
    return NextResponse.json({ ok: true, tempo_ms: Date.now() - t });
  } catch (e: unknown) {
    return NextResponse.json(
      { ok: false, erro: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
