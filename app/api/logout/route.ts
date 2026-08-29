import { NextResponse } from "next/server";
import { destruirSessao } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  await destruirSessao();
  return NextResponse.json({ ok: true });
}
