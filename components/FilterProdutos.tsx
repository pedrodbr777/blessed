"use client";

interface Props {
  categorias: string[];
  corDestaque: string;
  categoriaAtiva: string;
  onMudar: (c: string) => void;
}

export default function FilterProdutos({
  categorias,
  corDestaque,
  categoriaAtiva,
  onMudar,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        justifyContent: "center",
        marginBottom: "32px",
      }}
    >
      <button
        onClick={() => onMudar("")}
        style={{
          padding: "9px 18px",
          borderRadius: "30px",
          border: "1px solid #ddd",
          background: categoriaAtiva === "" ? corDestaque : "#fff",
          color: categoriaAtiva === "" ? "#111" : "#333",
          fontWeight: 700,
          transition: "all 0.2s",
        }}
      >
        Todos
      </button>
      {categorias.map((c) => (
        <button
          key={c}
          onClick={() => onMudar(c)}
          style={{
            padding: "9px 18px",
            borderRadius: "30px",
            border: "1px solid #ddd",
            background: categoriaAtiva === c ? corDestaque : "#fff",
            color: categoriaAtiva === c ? "#111" : "#333",
            fontWeight: 700,
            transition: "all 0.2s",
          }}
        >
          {c}
        </button>
      ))}
    </div>
  );
}