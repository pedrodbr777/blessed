"use client";

import { useState } from "react";
import type { Produto } from "@/app/produtos/page";
import ProductImage from "@/components/ProductImage";
import AdicionarAoCarrinho from "@/components/AdicionarAoCarrinho";
import FilterProdutos from "@/components/FilterProdutos";

interface Props {
  produtos: Produto[];
  corDestaque: string;
}

export default function ProductGrid({ produtos, corDestaque }: Props) {
  const [categoria, setCategoria] = useState("");
  const [busca, setBusca] = useState("");

  const categorias = Array.from(new Set(produtos.map((p) => p.categoria)));

  const termo = busca.trim().toLowerCase();
  const base = termo
    ? produtos.filter(
        (p) =>
          p.nome.toLowerCase().includes(termo) ||
          p.categoria.toLowerCase().includes(termo) ||
          (p.descricao || "").toLowerCase().includes(termo)
      )
    : produtos;

  const filtrados = categoria
    ? base.filter((p) => p.categoria === categoria)
    : base;

  return (
    <>
      <div
        style={{
          position: "relative",
          maxWidth: "480px",
          margin: "0 auto 24px",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "1.1rem",
            pointerEvents: "none",
          }}
        >
          🔍
        </span>
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Pesquisar no catálogo..."
          style={{
            width: "100%",
            padding: "14px 16px 14px 46px",
            borderRadius: "12px",
            border: `2px solid ${corDestaque}`,
            fontSize: "1rem",
            outline: "none",
            background: "#fff",
          }}
        />
        {busca && (
          <button
            type="button"
            onClick={() => setBusca("")}
            aria-label="Limpar busca"
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: "1rem",
              color: "#999",
            }}
          >
            ✕
          </button>
        )}
      </div>

      <FilterProdutos
        categorias={categorias}
        corDestaque={corDestaque}
        categoriaAtiva={categoria}
        onMudar={setCategoria}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "24px",
        }}
      >
        {filtrados.length === 0 && (
          <p style={{ color: "#999", textAlign: "center", gridColumn: "1 / -1" }}>
            {busca
              ? "Nenhum produto encontrado para essa busca."
              : "Nenhum produto nesta categoria ainda."}
          </p>
        )}
        {filtrados.map((p) => (
          <div key={p.id} className="produto-card">
            <ProductImage imagem={p.imagem} categoria={p.categoria} altura={220} />
            <div className="produto-corpo">
              <div style={{ fontSize: "0.8rem", color: "#999" }}>{p.categoria}</div>
              <h3 style={{ fontSize: "1.05rem" }}>{p.nome}</h3>
              <div className="produto-preco">
                R$ {p.preco.toFixed(2).replace(".", ",")}
              </div>
              <AdicionarAoCarrinho
                produtoId={p.id}
                nome={p.nome}
                preco={p.preco}
                imagem={p.imagem}
                estoque={p.estoque}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}