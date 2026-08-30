import { exigeNivel } from "@/lib/protecao";
import {
  autorizarRecrutamento,
  criarAdmin,
  recrutamentoAutorizado,
} from "@/lib/acoesRecrutamento";

export const dynamic = "force-dynamic";

const labelStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "#555",
};

const inputStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  fontSize: "1rem",
  width: "100%",
};

const botaoStyle: React.CSSProperties = {
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "#0f0f0f",
  color: "#fff",
  fontWeight: 700,
  fontSize: "1rem",
  cursor: "pointer",
};

const mensagemStyle = (tipo: "erro" | "ok"): React.CSSProperties => ({
  background: tipo === "erro" ? "#fdecea" : "#eafaf1",
  color: tipo === "erro" ? "#b3261e" : "#1b7a3d",
  padding: "12px",
  borderRadius: "10px",
  fontSize: "0.95rem",
  marginBottom: "16px",
});

export default async function NovoAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; ok?: string }>;
}) {
  await exigeNivel(["admin_master"]);
  const autorizado = await recrutamentoAutorizado();
  const { erro, ok } = await searchParams;

  return (
    <div>
      <h1 style={{ marginBottom: "8px" }}>Novo Admin</h1>

      {erro && <div style={mensagemStyle("erro")}>{erro}</div>}
      {ok && <div style={mensagemStyle("ok")}>{ok}</div>}

      {!autorizado ? (
        <div
          style={{
            background: "#fff",
            borderRadius: "14px",
            padding: "24px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            maxWidth: "420px",
          }}
        >
          <h2 style={{ fontSize: "1.1rem", marginBottom: "6px" }}>
            Coloque a senha
          </h2>
          <p style={{ color: "#888", fontSize: "0.9rem", marginBottom: "16px" }}>
            Para liberar esta área, digite a senha de acesso.
          </p>
          <form
            action={autorizarRecrutamento}
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            <input type="hidden" name="destino" value="/admin/recrutar/novo" />
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={labelStyle}>Senha</span>
              <input name="senha" type="password" required style={inputStyle} placeholder="Digite a senha" />
            </div>
            <button type="submit" style={botaoStyle}>
              Liberar
            </button>
          </form>
        </div>
      ) : (
        <div
          style={{
            background: "#fff",
            borderRadius: "14px",
            padding: "24px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            maxWidth: "520px",
          }}
        >
          <h2 style={{ fontSize: "1.1rem", marginBottom: "16px" }}>
            Adicionar funcionário (admin)
          </h2>
          <form
            action={criarAdmin}
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={labelStyle}>Nome *</span>
              <input name="nome" required style={inputStyle} placeholder="Nome do funcionário" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={labelStyle}>Email *</span>
              <input name="email" type="email" required style={inputStyle} placeholder="email@exemplo.com" />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={labelStyle}>Senha * (mín. 6 caracteres)</span>
              <input name="senha" type="password" required minLength={6} style={inputStyle} placeholder="Crie uma senha" />
            </div>
            <button type="submit" style={botaoStyle}>
              Criar admin
            </button>
          </form>
        </div>
      )}
    </div>
  );
}