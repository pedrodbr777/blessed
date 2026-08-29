"use client";

import Link from "next/link";
import { useActionState } from "react";
import { cadastroAction, type FormState } from "@/lib/actions";

const inputStyle: React.CSSProperties = {
  padding: "14px 16px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  fontSize: "1rem",
};

const botaoStyle: React.CSSProperties = {
  padding: "14px",
  borderRadius: "10px",
  border: "none",
  background: "#0f0f0f",
  color: "#fff",
  fontWeight: 700,
  fontSize: "1rem",
};

export default function CadastroForm() {
  const [state, formAction] = useActionState<FormState, FormData>(
    cadastroAction,
    {}
  );

  return (
    <form
      action={formAction}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        marginTop: "30px",
      }}
    >
      {state.erro && (
        <div
          style={{
            background: "#fdecea",
            color: "#b3261e",
            padding: "12px",
            borderRadius: "10px",
            fontSize: "0.95rem",
          }}
        >
          {state.erro}
        </div>
      )}
      <input
        name="nome"
        type="text"
        placeholder="Seu nome"
        required
        style={inputStyle}
      />
      <input
        name="email"
        type="email"
        placeholder="Seu email"
        required
        style={inputStyle}
      />
      <input
        name="senha"
        type="password"
        placeholder="Crie uma senha (mín. 6)"
        required
        minLength={6}
        style={inputStyle}
      />
      <button type="submit" style={botaoStyle}>
        Criar conta
      </button>
      <p style={{ textAlign: "center", marginTop: "6px", color: "#888" }}>
        Já tem conta?{" "}
        <Link href="/entrar" style={{ color: "#111", fontWeight: 700 }}>
          Entrar
        </Link>
      </p>
    </form>
  );
}
