import { db } from "@/lib/db";
import { criarProduto, atualizarProduto, excluirProduto } from "@/lib/acoesProduto";
import { exigeNivel } from "@/lib/protecao";
import SeletorFoto from "@/components/SeletorFoto";

export const dynamic = "force-dynamic";

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  imagem: string;
  estoque: number;
  ativo: number;
}

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

  const produtos = (await db.all("SELECT * FROM produtos ORDER BY id DESC")) as unknown as Produto[];

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

      {/* Lista de produtos */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {produtos.map((p) => (
          <div
            key={p.id}
            style={{
              background: p.ativo ? "#fff" : "#f5f5f5",
              borderRadius: "14px",
              padding: "20px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              opacity: p.ativo ? 1 : 0.6,
            }}
          >
            <form action={atualizarProduto} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: "12px" }}>
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
    </div>
  );
}
