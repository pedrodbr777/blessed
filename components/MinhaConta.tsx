"use client";

import { useState } from "react";
import Link from "next/link";
import ContaDados from "@/components/ContaDados";
import FormTroca from "@/components/FormTroca";

interface PedidoResumo {
  id: number;
  criado_em: string;
  total: number;
  status: string;
  itens: { nome: string; quantidade: number; preco: number; tamanho: string }[];
}

interface TrocaResumo {
  id: number;
  pedido_id: number;
  motivo: string;
  imagem: string;
  status: string;
  resposta: string;
  criado_em: string;
}

interface Props {
  nome: string;
  email: string;
  pedidos: PedidoResumo[];
  trocas: TrocaResumo[];
}

const statusLabel: Record<string, { texto: string; cor: string }> = {
  pendente: { texto: "Pendente", cor: "#b7791f" },
  aprovado: { texto: "Aprovada", cor: "#1a7f37" },
  recusado: { texto: "Recusada", cor: "#c0392b" },
};

export default function MinhaConta({ nome, email, pedidos, trocas }: Props) {
  const [aba, setAba] = useState<"dados" | "pedidos" | "troca">("dados");

  function botaoAba(tipo: "dados" | "pedidos" | "troca", label: string) {
    const ativa = aba === tipo;
    return (
      <button
        onClick={() => setAba(tipo)}
        style={{
          padding: "10px 16px",
          borderRadius: "10px",
          border: ativa ? "2px solid #0f0f0f" : "1px solid #ddd",
          background: ativa ? "#0f0f0f" : "#fff",
          color: ativa ? "#fff" : "#222",
          fontWeight: 700,
          fontSize: "0.95rem",
          cursor: "pointer",
        }}
      >
        {label}
      </button>
    );
  }

  return (
    <section className="secao" style={{ minHeight: "70vh" }}>
      <div className="container" style={{ maxWidth: "680px" }}>
        <h2 className="secao-titulo">Minha conta</h2>
        <p className="secao-sub">Olá, {nome}!</p>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "24px",
          }}
        >
          {botaoAba("dados", "Meus dados")}
          {botaoAba("pedidos", "Meus pedidos")}
          {botaoAba("troca", "🔄 Solicitar troca")}
        </div>

        {aba === "dados" && <ContaDados nome={nome} email={email} />}

        {aba === "pedidos" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {pedidos.length === 0 && (
              <p style={{ color: "#888" }}>
                Você ainda não fez pedidos.{" "}
                <Link href="/produtos" style={{ color: "#111", fontWeight: 700 }}>
                  Ver produtos
                </Link>
              </p>
            )}
            {pedidos.map((p) => (
              <div
                key={p.id}
                style={{
                  background: "#fff",
                  borderRadius: "14px",
                  padding: "18px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
                  <strong>Pedido #{p.id}</strong>
                  <span style={{ background: "#f0f0f0", borderRadius: "20px", padding: "4px 12px", fontSize: "0.85rem", fontWeight: 600 }}>
                    {statusLabel[p.status]?.texto || p.status}
                  </span>
                </div>
                <div style={{ fontSize: "0.88rem", color: "#666", marginBottom: "8px" }}>{p.criado_em}</div>
                {p.itens.map((i, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.92rem", padding: "4px 0", borderBottom: "1px solid #f5f5f5" }}>
                    <span>
                      {i.quantidade}x {i.nome}
                      {i.tamanho && <span style={{ color: "#999" }}> (Tamanho {i.tamanho})</span>}
                    </span>
                    <span>R$ {(i.preco * i.quantidade).toFixed(2).replace(".", ",")}</span>
                  </div>
                ))}
                <div style={{ textAlign: "right", fontWeight: 800, marginTop: "8px" }}>
                  Total: R$ {p.total.toFixed(2).replace(".", ",")}
                </div>
              </div>
            ))}
          </div>
        )}

        {aba === "troca" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div
              style={{
                background: "#fff",
                borderRadius: "14px",
                padding: "20px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              }}
            >
              <h3 style={{ marginBottom: "14px" }}>Solicitar troca de um pedido</h3>
              {pedidos.length === 0 ? (
                <p style={{ color: "#888" }}>
                  Para solicitar uma troca, você precisa primeiro ter um pedido.{" "}
                  <Link href="/produtos" style={{ color: "#111", fontWeight: 700 }}>
                    Conhecer a loja
                  </Link>
                </p>
              ) : (
                <FormTroca pedidos={pedidos} />
              )}
            </div>

            <div>
              <h3 style={{ marginBottom: "12px" }}>Minhas solicitações</h3>
              {trocas.length === 0 ? (
                <p style={{ color: "#888" }}>Nenhuma solicitação de troca ainda.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {trocas.map((t) => {
                    const st = statusLabel[t.status] || {
                      texto: t.status,
                      cor: "#555",
                    };
                    return (
                      <div
                        key={t.id}
                        style={{
                          background: "#fff",
                          borderRadius: "12px",
                          padding: "16px",
                          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                          <strong>Solicitação #{t.id} · Pedido #{t.pedido_id}</strong>
                          <span style={{ background: "#f0f0f0", borderRadius: "20px", padding: "4px 12px", fontSize: "0.85rem", fontWeight: 700, color: st.cor }}>
                            {st.texto}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.88rem", color: "#666", margin: "6px 0" }}>{t.criado_em}</div>
                        <p style={{ fontSize: "0.95rem", marginBottom: "10px" }}>{t.motivo}</p>
                        {t.imagem && (
                          <img
                            src={t.imagem}
                            alt="foto da peça"
                            style={{ width: "110px", height: "110px", objectFit: "cover", borderRadius: "10px", border: "1px solid #ddd" }}
                          />
                        )}
                        {t.resposta && (
                          <div style={{ background: "#f7f7f7", borderRadius: "8px", padding: "10px", marginTop: "10px", fontSize: "0.9rem" }}>
                            <strong style={{ color: st.cor }}>Resposta da loja: </strong>
                            {t.resposta}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}