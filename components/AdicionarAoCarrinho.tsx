"use client";

import { useState } from "react";
import { useCarrinho } from "@/components/CarrinhoContext";

interface Props {
  produtoId: number;
  nome: string;
  preco: number;
  imagem: string;
  estoque: number;
}

const TAMANHOS = ["P", "M", "G", "GG"];

export default function AdicionarAoCarrinho({
  produtoId,
  nome,
  preco,
  imagem,
  estoque,
}: Props) {
  const { adicionar, abrir } = useCarrinho();
  const [tamanho, setTamanho] = useState<string>(TAMANHOS[0]);
  const [adicionado, setAdicionado] = useState(false);

  function handle() {
    if (estoque <= 0) return;
    adicionar({ produtoId, nome, preco, imagem, tamanho, quantidade: 1 });
    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 1200);
    abrir();
  }

  if (estoque <= 0) {
    return (
      <div
        style={{
          textAlign: "center",
          color: "#c0392b",
          fontWeight: 700,
          padding: "10px",
          border: "1px solid #f0c0c0",
          borderRadius: "10px",
        }}
      >
        Esgotado
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {TAMANHOS.map((t) => (
          <button
            key={t}
            onClick={() => setTamanho(t)}
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              border: tamanho === t ? "2px solid #111" : "1px solid #ccc",
              background: tamanho === t ? "#111" : "#fff",
              color: tamanho === t ? "#fff" : "#333",
              fontWeight: 700,
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <button
        onClick={handle}
        style={{
          padding: "13px",
          borderRadius: "10px",
          border: "none",
          background: adicionado ? "#3a8a53" : "#0f0f0f",
          color: "#fff",
          fontWeight: 700,
          fontSize: "0.95rem",
        }}
      >
        {adicionado ? "✓ Adicionado" : "Adicionar ao carrinho"}
      </button>
    </div>
  );
}
