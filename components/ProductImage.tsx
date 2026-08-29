"use client";

import { useState } from "react";

interface Props {
  imagem: string;
  categoria: string;
  altura?: number;
  estilo?: React.CSSProperties;
}

const PALETA: Record<string, string[]> = {
  Camisetas: ["#3a3a3a", "#111111"],
  Moletons: ["#5a5a5a", "#222222"],
  Calças: ["#6b5a3e", "#2a2418"],
  Acessórios: ["#3a2a1a", "#16100a"],
};

export default function ProductImage({
  imagem,
  categoria,
  altura = 180,
  estilo,
}: Props) {
  const [erro, setErro] = useState(false);

  if (imagem && !erro) {
    return (
      <div style={{ height: altura, overflow: "hidden", ...estilo }}>
        <img
          src={imagem}
          alt={categoria}
          onError={() => setErro(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    );
  }

  const cores = PALETA[categoria] || ["#2a2a2a", "#111111"];

  return (
    <div
      style={{
        height: altura,
        background: `linear-gradient(135deg, ${cores[0]}, ${cores[1]})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(255,255,255,0.55)",
        fontSize: "1.6rem",
        fontWeight: 800,
        letterSpacing: "0.25em",
        ...estilo,
      }}
    >
      BLESSED
    </div>
  );
}