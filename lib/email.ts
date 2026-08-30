import { Resend } from "resend";

const REMETENTE = process.env.EMAIL_REMETENTE || "BLESSED <onboarding@resend.dev>";

export interface EmailResultado {
  enviado: boolean;
  erro?: string;
}

function escapar(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function moldura(html: string): string {
  return `
    <div style="font-family: Arial, Helvetica, sans-serif; background:#f5f5f5; padding:24px;">
      <div style="max-width:520px; margin:0 auto; background:#fff; border-radius:14px; overflow:hidden; border:1px solid #eee;">
        <div style="background:#0f0f0f; color:#e0b84f; padding:18px 24px; font-size:20px; font-weight:bold; letter-spacing:2px;">
          BLESSED
        </div>
        <div style="padding:24px; color:#222; font-size:15px; line-height:1.6;">
          ${html}
        </div>
        <div style="background:#fafafa; padding:14px 24px; color:#999; font-size:12px; text-align:center;">
          Blessed · Moda e atitude
        </div>
      </div>
    </div>
  `;
}

export async function enviarEmail(
  para: string,
  assunto: string,
  html: string
): Promise<EmailResultado> {
  if (!process.env.RESEND_API_KEY) {
    console.warn(
      "[email] RESEND_API_KEY não configurada. Email não enviado para " + para
    );
    return {
      enviado: false,
      erro: "Serviço de email não configurado.",
    };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: REMETENTE,
      to: [para],
      subject: assunto,
      html: moldura(html),
    });
    return { enviado: true };
  } catch (e: any) {
    console.error("[email] Erro ao enviar:", e?.message || e);
    return { enviado: false, erro: "Não foi possível enviar o email." };
  }
}

export { escapar };