import { db } from "@/lib/db";
import { avaliarTrocaAction } from "@/lib/acoesTroca";
import { exigeNivel } from "@/lib/protecao";

export const dynamic = "force-dynamic";

interface Troca {
  id: number;
  pedido_id: number;
  cliente_id: number;
  motivo: string;
  imagem: string;
  status: string;
  resposta: string;
  criado_em: string;
}

interface Cliente {
  nome: string;
  email: string;
  contato: string;
}

const cores: Record<string, string> = {
  pendente: "#b7791f",
  aprovado: "#1a7f37",
  recusado: "#c0392b",
};

const labels: Record<string, string> = {
  pendente: "Pendente",
  aprovado: "Aprovada",
  recusado: "Recusada",
};

async function TrocaCard({ troca, cliente }: { troca: Troca; cliente: Cliente }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "14px",
        padding: "20px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "12px",
        }}
      >
        <div>
          <strong>Solicitação de troca #{troca.id}</strong>
          <span style={{ color: "#999", fontSize: "0.85rem" }}> · {troca.criado_em}</span>
        </div>
        <span
          style={{
            background: "#f0f0f0",
            borderRadius: "20px",
            padding: "4px 12px",
            fontSize: "0.85rem",
            fontWeight: 700,
            color: cores[troca.status] || "#555",
          }}
        >
          {labels[troca.status] || troca.status}
        </span>
      </div>

      <div style={{ fontSize: "0.92rem", marginBottom: "8px" }}>
        <strong>Pedido:</strong> #{troca.pedido_id}
      </div>
      <div style={{ fontSize: "0.92rem", marginBottom: "8px" }}>
        <strong>Cliente:</strong> {cliente.nome} · {cliente.email}
        {cliente.contato ? ` · ${cliente.contato}` : ""}
      </div>
      <div
        style={{
          fontSize: "0.95rem",
          background: "#f9f9f9",
          borderRadius: "8px",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        <strong>Motivo:</strong> {troca.motivo}
      </div>
      {troca.imagem && (
        <div style={{ marginBottom: "10px" }}>
          <img
            src={troca.imagem}
            alt="foto da peça"
            style={{
              maxWidth: "180px",
              maxHeight: "180px",
              objectFit: "cover",
              borderRadius: "10px",
              border: "1px solid #ddd",
            }}
          />
        </div>
      )}

      <form
        action={avaliarTrocaAction}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          borderTop: "1px solid #f0f0f0",
          paddingTop: "14px",
        }}
      >
        <input type="hidden" name="id" value={troca.id} />
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <select
            name="status"
            defaultValue={troca.status}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          >
            <option value="pendente">Pendente</option>
            <option value="aprovado">Aprovar troca</option>
            <option value="recusado">Recusar troca</option>
          </select>
          <button
            type="submit"
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              background: "#0f0f0f",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Salvar avaliação
          </button>
        </div>
        <textarea
          name="resposta"
          defaultValue={troca.resposta}
          rows={2}
          placeholder="Resposta para o cliente (ex: aprovado, envie no seu endereço; ou recusado, explique o motivo)..."
          style={{
            padding: "10px 12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: "0.92rem",
            resize: "vertical",
          }}
        />
      </form>
    </div>
  );
}

export default async function TrocasPage() {
  await exigeNivel(["admin", "dev"]);

  const trocas = (await db.all(
    "SELECT * FROM trocas ORDER BY id DESC"
  )) as unknown as Troca[];

  return (
    <div>
      <h1 style={{ marginBottom: "24px" }}>Trocas</h1>
      {trocas.length === 0 && (
        <p style={{ color: "#888" }}>Nenhuma solicitação de troca ainda.</p>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {trocas.map(async (t) => {
          const [cliente, pedido] = await Promise.all([
            db.get<{ nome: string; email: string }>(
              "SELECT u.nome, u.email FROM usuarios u WHERE u.id = ?",
              t.cliente_id
            ),
            db.get<{ contato: string }>(
              "SELECT contato FROM pedidos WHERE id = ?",
              t.pedido_id
            ),
          ]);
          return (
            <TrocaCard
              key={t.id}
              troca={t}
              cliente={{
                nome: cliente?.nome || "Cliente",
                email: cliente?.email || "",
                contato: pedido?.contato || "",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}