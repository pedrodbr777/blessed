"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SeletorFoto from "@/components/SeletorFoto";
import { atualizarProduto, excluirProduto } from "@/lib/acoesProduto";

export interface ProdutoAdmin {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  imagem: string;
  estoque: number;
  ativo: number;
}

const labelStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "#555",
};

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  fontSize: "0.95rem",
  width: "100%",
};

function brl(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function BuscaProduto({
  produtos,
  linkMode = false,
}: {
  produtos: ProdutoAdmin[];
  linkMode?: boolean;
}) {
  const [busca, setBusca] = useState("");

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return produtos;
    return produtos.filter((p) =>
      (p.nome + " " + (p.categoria || "")).toLowerCase().includes(termo)
    );
  }, [busca, produtos]);

  return (
    <div>
      <div style={{ position: "relative", marginBottom: "16px" }}>
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "1.1rem",
            color: "#999",
            pointerEvents: "none",
          }}
        >
          🔍
        </span>
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Procurar produto por nome ou categoria..."
          style={{
            ...inputStyle,
            paddingLeft: "40px",
            paddingRight: "36px",
            background: "#fafafa",
          }}
        />
        {busca && (
          <button
            type="button"
            onClick={() => setBusca("")}
            aria-label="Limpar busca"
            style={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              border: "none",
              background: "none",
              color: "#999",
              fontSize: "1rem",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            ✕
          </button>
        )}
      </div>

      {busca.trim() && (
        <p style={{ fontSize: "0.85rem", color: "#888", marginBottom: "12px" }}>
          {filtrados.length} produto{filtrados.length === 1 ? "" : "s"} encontrado
          {filtrados.length === 1 ? "" : "s"}
        </p>
      )}

      {filtrados.length === 0 && (
        <p style={{ color: "#aaa", padding: "12px 0" }}>
          Nenhum produto encontrado com esse termo.
        </p>
      )}

      {linkMode && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtrados.map((p) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: "#fff",
                borderRadius: "10px",
                padding: "10px 14px",
                border: "1px solid #eee",
              }}
            >
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "#bbb",
                  minWidth: "34px",
                }}
              >
                #{p.id}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{ fontWeight: 600, fontSize: "0.95rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  {p.nome}
                </div>
                <div style={{ fontSize: "0.8rem", color: "#888" }}>
                  {p.categoria || "geral"} · {brl(p.preco)} · estoque {p.estoque}
                  {p.ativo ? "" : " · inativo"}
                </div>
              </div>
              <Link
                href="/admin"
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "#0f0f0f",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Editar →
              </Link>
            </div>
          ))}
        </div>
      )}

      {!linkMode &&
        filtrados.map((p) => (
          <div
            key={p.id}
            style={{
              background: p.ativo ? "#fff" : "#f5f5f5",
              borderRadius: "14px",
              padding: "20px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              opacity: p.ativo ? 1 : 0.6,
              marginBottom: "16px",
            }}
          >
            <form
              action={atualizarProduto}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))",
                gap: "12px",
              }}
            >
              <input type="hidden" name="id" value={p.id} />
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={labelStyle}>Nome</span>
                <input name="nome" defaultValue={p.nome} style={inputStyle} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={labelStyle}>Categoria</span>
                <input name="categoria" defaultValue={p.categoria} style={inputStyle} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={labelStyle}>Preço (R$)</span>
                <input name="preco" type="number" step="0.01" defaultValue={p.preco} style={inputStyle} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={labelStyle}>Estoque</span>
                <input name="estoque" type="number" min="0" defaultValue={p.estoque} style={inputStyle} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", gridColumn: "1 / -1" }}>
                <span style={labelStyle}>Descrição</span>
                <input name="descricao" defaultValue={p.descricao} style={inputStyle} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", gridColumn: "1 / -1" }}>
                <span style={labelStyle}>Foto do produto</span>
                <SeletorFoto valorInicial={p.imagem} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.9rem" }}>
                  <input type="checkbox" name="ativo" defaultChecked={p.ativo === 1} /> Ativo (visível)
                </label>
                <button
                  type="submit"
                  style={{
                    padding: "10px 18px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#0f0f0f",
                    color: "#fff",
                    fontWeight: 600,
                  }}
                >
                  Salvar
                </button>
                <button
                  formAction={excluirProduto}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#fdecea",
                    color: "#b3261e",
                    fontWeight: 600,
                  }}
                >
                  Excluir
                </button>
              </div>
            </form>
          </div>
        ))}
    </div>
  );
}