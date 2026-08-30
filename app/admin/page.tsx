import { db } from "@/lib/db";
import { criarProduto } from "@/lib/acoesProduto";
import { exigeNivel } from "@/lib/protecao";
import SeletorFoto from "@/components/SeletorFoto";
import BuscaProduto, { type ProdutoAdmin } from "@/components/BuscaProduto";

export const dynamic = "force-dynamic";

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  fontSize: "0.95rem",
  width: "100%",
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "#555",
};

export default async function AdminPage() {
  await exigeNivel(["admin", "dev"]);

  const produtos = (await db.all("SELECT * FROM produtos ORDER BY id DESC")) as unknown as ProdutoAdmin[];

  return (
    <div>
      <h1 style={{ marginBottom: "24px" }}>Produtos</h1>

      {/* Formulário novo produto */}
      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          padding: "20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          marginBottom: "28px",
        }}
      >
        <h2 style={{ fontSize: "1.1rem", marginBottom: "16px" }}>
          Adicionar novo produto
        </h2>
        <form action={criarProduto} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: "12px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={labelStyle}>Nome *</span>
            <input name="nome" required style={inputStyle} placeholder="Ex: Camiseta Blessed" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={labelStyle}>Categoria</span>
            <input name="categoria" style={inputStyle} placeholder="Ex: Camisetas" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={labelStyle}>Preço (R$) *</span>
            <input name="preco" type="number" step="0.01" min="0.01" required style={inputStyle} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={labelStyle}>Estoque</span>
            <input name="estoque" type="number" min="0" defaultValue="0" style={inputStyle} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", gridColumn: "1 / -1" }}>
            <span style={labelStyle}>Descrição</span>
            <input name="descricao" style={inputStyle} placeholder="Breve descrição" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", gridColumn: "1 / -1" }}>
            <span style={labelStyle}>Foto do produto</span>
            <SeletorFoto />
          </div>
          <button
            type="submit"
            style={{
              gridColumn: "1 / -1",
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              background: "#0f0f0f",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            + Adicionar produto
          </button>
        </form>
      </div>

      {/* Lista de produtos com busca */}
      <BuscaProduto produtos={produtos} />
    </div>
  );
}
