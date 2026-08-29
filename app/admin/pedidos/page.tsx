import { db } from "@/lib/db";
import { atualizarStatusPedido } from "@/lib/acoesPedido";
import { exigeNivel } from "@/lib/protecao";

export const dynamic = "force-dynamic";

interface Pedido {
  id: number;
  nome_cliente: string;
  contato: string;
  endereco: string;
  total: number;
  status: string;
  criado_em: string;
}

interface ItemPedido {
  id: number;
  nome_produto: string;
  quantidade: number;
  preco: number;
  tamanho: string;
}

async function PedidoCard({ pedido }: { pedido: Pedido }) {
  const itens = (await db.all(
    "SELECT * FROM itens_pedido WHERE pedido_id = ?",
    pedido.id
  )) as unknown as ItemPedido[];

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
          <strong>Pedido #{pedido.id}</strong>
          <span style={{ color: "#999", fontSize: "0.85rem" }}>
            {" "}· {pedido.criado_em}
          </span>
        </div>
        <form action={atualizarStatusPedido}>
          <input type="hidden" name="id" value={pedido.id} />
          <select
            name="status"
            defaultValue={pedido.status}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          >
            <option value="novo">Novo</option>
            <option value="confirmado">Confirmado</option>
            <option value="enviado">Enviado</option>
            <option value="concluido">Concluído</option>
            <option value="cancelado">Cancelado</option>
          </select>
          <button
            type="submit"
            style={{
              marginLeft: "8px",
              padding: "8px 14px",
              borderRadius: "8px",
              border: "none",
              background: "#0f0f0f",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            Atualizar
          </button>
        </form>
      </div>
      <div style={{ fontSize: "0.92rem", marginBottom: "8px" }}>
        <strong>Cliente:</strong> {pedido.nome_cliente} · {pedido.contato}
      </div>
      <div style={{ fontSize: "0.92rem", marginBottom: "12px" }}>
        <strong>Endereço:</strong> {pedido.endereco}
      </div>
      <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: "10px" }}>
        {itens.map((i) => (
          <div
            key={i.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.92rem",
              padding: "4px 0",
            }}
          >
            <span>
              {i.quantidade}x {i.nome_produto}
              {i.tamanho && (
                <span style={{ color: "#999" }}> (Tamanho {i.tamanho})</span>
              )}
            </span>
            <span>R$ {(i.preco * i.quantidade).toFixed(2).replace(".", ",")}</span>
          </div>
        ))}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 800,
            marginTop: "8px",
            fontSize: "1rem",
          }}
        >
          <span>Total</span>
          <span>R$ {pedido.total.toFixed(2).replace(".", ",")}</span>
        </div>
      </div>
    </div>
  );
}

export default async function PedidosPage() {
  await exigeNivel(["admin", "dev"]);

  const pedidos = (await db.all(
    "SELECT * FROM pedidos ORDER BY id DESC"
  )) as unknown as Pedido[];

  return (
    <div>
      <h1 style={{ marginBottom: "24px" }}>Pedidos</h1>
      {pedidos.length === 0 && (
        <p style={{ color: "#888" }}>Nenhum pedido ainda.</p>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {pedidos.map((p) => (
          <PedidoCard key={p.id} pedido={p} />
        ))}
      </div>
    </div>
  );
}