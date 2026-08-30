"use client";

import { useActionState } from "react";
import Link from "next/link";
import { esqueciSenhaAction, type FormState } from "@/lib/acoesConta";

const inputStyle: React.CSSProperties = {
  padding: "14px 16px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  fontSize: "1rem",
  width: "100%",
};

const botaoStyle: React.CSSProperties = {
  padding: "14px",
  borderRadius: "10px",
  border: "none",
  background: "#0f0f0f",
  color: "#fff",
  fontWeight: 700,
  fontSize: "1rem",
  cursor: "pointer",
};

export default function EsqueciSenhaForm() {
  const [state, formAction] = useActionState<FormState, FormData>(esqueciSenhaAction, {});

  return (
    <form
      action={formAction}
      style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "30px" }}
    >
      {state?.erro && (
        <div style={{ background: "#fdecea", color: "#b3261e", padding: "12px", borderRadius: "10px", fontSize: "0.95rem" }}>
          {state.erro}
        </div>
      )}
      {state?.sucesso && (
        <div style={{ background: "#e6f4ea", color: "#1a7f37", padding: "12px", borderRadius: "10px", fontSize: "0.95rem" }}>
          {state.sucesso}
        </div>
      )}
      <p style={{ color: "#888", fontSize: "0.95rem", lineHeight: 1.5 }}>
        Digite o email da sua conta. Enviaremos um link para você redefinir a senha.
      </p>
      <input name="email" type="email" placeholder="Seu email" required style={inputStyle} />
      <button type="submit" style={{ ...botaoStyle, opacity: state?.sucesso ? 0.6 : 1 }} disabled={Boolean(state?.sucesso)}>
        Enviar link
      </button>
      <p style={{ textAlign: "center", marginTop: "6px", color: "#888" }}>
        Lembrou a senha?{" "}
        <Link href="/entrar" style={{ color: "#111", fontWeight: 700 }}>
          Entrar
        </Link>
      </p>
    </form>
  );
}