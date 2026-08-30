"use client";

import { useActionState } from "react";
import Link from "next/link";
import { redefinirSenhaAction, type FormState } from "@/lib/acoesConta";

const inputStyle: React.CSSProperties = {
  padding: "14px 16px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  fontSize: "1rem",
  width: "100%",
};

export default function RedefinirSenhaForm({ token }: { token: string }) {
  const [state, formAction] = useActionState<FormState, FormData>(redefinirSenhaAction, {});

  return (
    <form
      action={formAction}
      style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "30px" }}
    >
      <input type="hidden" name="token" value={token} />
      {state?.erro && (
        <div style={{ background: "#fdecea", color: "#b3261e", padding: "12px", borderRadius: "10px", fontSize: "0.95rem" }}>
          {state.erro}
        </div>
      )}
      {state?.sucesso && (
        <div style={{ background: "#e6f4ea", color: "#1a7f37", padding: "12px", borderRadius: "10px", fontSize: "0.95rem" }}>
          {state.sucesso}
          <p style={{ marginTop: "10px", textAlign: "center" }}>
            <Link href="/entrar" style={{ color: "#111", fontWeight: 700 }}>
              Fazer login
            </Link>
          </p>
        </div>
      )}
      <input
        name="senha"
        type="password"
        required
        minLength={6}
        placeholder="Nova senha (mín. 6)"
        style={inputStyle}
      />
      <button
        type="submit"
        disabled={Boolean(state?.sucesso)}
        style={{
          padding: "14px",
          borderRadius: "10px",
          border: "none",
          background: "#0f0f0f",
          color: "#fff",
          fontWeight: 700,
          fontSize: "1rem",
          cursor: "pointer",
          opacity: state?.sucesso ? 0.6 : 1,
        }}
      >
        Redefinir senha
      </button>
    </form>
  );
}