"use client";

import { useActionState } from "react";
import { atualizarContaAction, type FormState } from "@/lib/acoesConta";

const inputStyle: React.CSSProperties = {
  padding: "13px 14px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  fontSize: "1rem",
  width: "100%",
};

export default function ContaDados({ nome, email }: { nome: string; email: string }) {
  const [state, formAction] = useActionState<FormState, FormData>(atualizarContaAction, {});

  return (
    <form
      action={formAction}
      style={{
        background: "#fff",
        borderRadius: "14px",
        padding: "20px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
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

      <div>
        <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", fontSize: "0.95rem" }}>Nome</label>
        <input name="nome" type="text" defaultValue={nome} required style={inputStyle} />
      </div>

      <div>
        <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", fontSize: "0.95rem" }}>Email</label>
        <input name="email" type="email" defaultValue={email} required style={inputStyle} />
      </div>

      <div>
        <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", fontSize: "0.95rem" }}>
          Senha atual (para confirmar)
        </label>
        <input name="senhaAtual" type="password" required placeholder="Digite sua senha atual" style={inputStyle} />
      </div>

      <button
        type="submit"
        style={{
          padding: "14px",
          borderRadius: "10px",
          border: "none",
          background: "#0f0f0f",
          color: "#fff",
          fontWeight: 800,
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        Salvar alterações
      </button>
    </form>
  );
}