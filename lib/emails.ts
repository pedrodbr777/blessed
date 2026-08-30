import { enviarEmail, escapar } from "@/lib/email";

export interface ItemEmail {
  nome: string;
  quantidade: number;
  preco: number;
  tamanho?: string;
}

function formatar(valor: number): string {
  return "R$ " + valor.toFixed(2).replace(".", ",");
}

export async function enviarEmailPedidoAprovado(input: {
  para: string;
  nomeCliente: string;
  pedidoId: number;
  total: number;
  itens: ItemEmail[];
}): Promise<{ enviado: boolean; erro?: string }> {
  const lista = input.itens
    .map(
      (i) => `
        <tr>
          <td style="padding:8px 0; border-bottom:1px solid #f0f0f0;">
            ${i.quantidade}x ${escapar(i.nome)}
            ${i.tamanho ? `<span style="color:#999"> (Tamanho ${escapar(i.tamanho)})</span>` : ""}
          </td>
          <td style="padding:8px 0; border-bottom:1px solid #f0f0f0; text-align:right;">
            ${formatar(i.preco * i.quantidade)}
          </td>
        </tr>
      `
    )
    .join("");

  return enviarEmail(
    input.para,
    `✅ Pedido #${input.pedidoId} aprovado!`,
    `
      <p>Olá, <strong>${escapar(input.nomeCliente)}</strong>!</p>
      <p>Boa notícia: seu pedido <strong>#${input.pedidoId}</strong> foi <strong>aprovado</strong> e confirmado. Já está sendo preparado para envio. 🎉</p>

      <h3 style="margin:20px 0 10px; font-size:15px;">Seus itens:</h3>
      <table style="width:100%; border-collapse:collapse;">
        ${lista}
      </table>

      <p style="margin-top:14px; font-weight:bold; font-size:16px;">
        Total: ${formatar(input.total)}
      </p>

      <p style="margin-top:20px;">Assim que o pedido for postado, você recebe um novo email. Qualquer dúvida, responda a este email.</p>
      <p>Obrigado pela compra! 💛</p>
    `
  );
}

export async function enviarEmailRedefinirSenha(input: {
  para: string;
  nome: string;
  link: string;
}): Promise<{ enviado: boolean; erro?: string }> {
  return enviarEmail(
    input.para,
    "🔑 Redefinição de senha - BLESSED",
    `
      <p>Olá, <strong>${escapar(input.nome)}</strong>!</p>
      <p>Recebemos um pedido para redefinir a sua senha. Se foi você, clique no botão abaixo:</p>

      <p style="text-align:center; margin:28px 0;">
        <a href="${input.link}"
           style="background:#0f0f0f; color:#e0b84f; padding:14px 28px; border-radius:10px;
                  text-decoration:none; font-weight:bold; display:inline-block;">
          Redefinir minha senha
        </a>
      </p>

      <p style="color:#999; font-size:13px;">
        Este link é válido por 1 hora. Se não foi você quem pediu, pode ignorar este email — sua senha continua a mesma.
      </p>
    `
  );
}