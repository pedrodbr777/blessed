"use server";

import { getStripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { getUsuarioAtual } from "@/lib/auth";

export interface ItemCheckout {
  produtoId: number;
  nome: string;
  preco: number;
  quantidade: number;
  tamanho: string;
}

export interface PaymentResult {
  erro?: string;
  clientSecret?: string;
  pedidoId?: number;
}

export async function criarPagamentoAction(
  totalCentavos: number,
  reservas: { paymentIntentId?: string; pedidoId?: number } = {}
): Promise<PaymentResult> {
  const usuario = await getUsuarioAtual();
  if (!usuario) {
    return { erro: "Você precisa estar logado para comprar." };
  }

  const stripe = getStripe();
  if (!stripe) {
    return { erro: "Pagamento ainda não está configurado." };
  }

  if (!reservas.paymentIntentId) {
    const intent = await stripe.paymentIntents.create({
      amount: totalCentavos,
      currency: "brl",
      receipt_email: usuario.email,
      metadata: {
        usuarioId: String(usuario.id),
        usuario: usuario.email,
      },
      automatic_payment_methods: { enabled: true },
    });
    return { clientSecret: intent.client_secret || undefined, pedidoId: reservas.pedidoId };
  }

  return {};
}

export async function finalizarPedidoAction(input: {
  nomeCliente: string;
  endereco: string;
  contato: string;
  totalCentavos: number;
  itens: ItemCheckout[];
}): Promise<{ erro?: string; pedidoId?: number }> {
  const usuario = await getUsuarioAtual();
  if (!usuario) {
    return { erro: "Você precisa estar logado para comprar." };
  }

  if (!input.itens || input.itens.length === 0) {
    return { erro: "Seu carrinho está vazio." };
  }

  const total = input.totalCentavos / 100;

  const insertion = await db.run(
    `INSERT INTO pedidos (cliente_id, nome_cliente, endereco, contato, total, status)
     VALUES (?, ?, ?, ?, ?, 'novo')`,
    usuario.id,
    input.nomeCliente,
    input.endereco,
    input.contato,
    total
  );

  const pedidoId = Number(insertion.lastInsertRowid);
  for (const item of input.itens) {
    await db.run(
      `INSERT INTO itens_pedido (pedido_id, produto_id, nome_produto, preco, quantidade, tamanho)
       VALUES (?, ?, ?, ?, ?, ?)`,
      pedidoId,
      item.produtoId,
      item.nome,
      item.preco,
      item.quantidade,
      item.tamanho
    );
  }

  return { pedidoId };
}
