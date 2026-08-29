import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getUsuarioAtual } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const usuario = await getUsuarioAtual();
  if (!usuario) {
    return NextResponse.json({ erro: "Não autenticado." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const totalCentavos = body?.totalCentavos;

  if (typeof totalCentavos !== "number" || totalCentavos <= 0) {
    return NextResponse.json({ erro: "Valor inválido." }, { status: 400 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { erro: "Pagamento não configurado." },
      { status: 500 }
    );
  }

  try {
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(totalCentavos),
      currency: "brl",
      receipt_email: usuario.email,
      metadata: {
        usuarioId: String(usuario.id),
        usuario: usuario.email,
      },
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: intent.client_secret });
  } catch (e: any) {
    return NextResponse.json(
      { erro: e?.message || "Erro no pagamento." },
      { status: 500 }
    );
  }
}
