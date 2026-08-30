"use client";

import { useRef, useState } from "react";
import { useActionState } from "react";
import { solicitarTrocaAction } from "@/lib/acoesTroca";

interface PedidoResumo {
  id: number;
  criado_em: string;
  total: number;
}

const inputStyle: React.CSSProperties = {
  padding: "13px 14px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  fontSize: "1rem",
  width: "100%",
};

export default function FormTroca({ pedidos }: { pedidos: PedidoResumo[] }) {
  const [state, formAction] = useActionState<FormState, FormData>(solicitarTrocaAction, {});
  const inputRef = useRef<HTMLInputElement>(null);
  const [imagemUrl, setImagemUrl] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erroFoto, setErroFoto] = useState("");

  async function enviarFoto(file: File | undefined) {
    if (!file) return;
    setErroFoto("");
    setEnviando(true);
    const fd = new FormData();
    fd.append("arquivo", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setErroFoto(data.erro || "Falha ao enviar a foto.");
        return;
      }
      setImagemUrl(data.url);
    } catch {
      setErroFoto("Erro ao enviar a foto.");
    } finally {
      setEnviando(false);
    }
  }

  const novoEnviado = Boolean((state as any)?.sucesso);

  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {state?.erro && (
        <div style={{ background: "#fdecea", color: "#b3261e", padding: "12px", borderRadius: "10px", fontSize: "0.95rem" }}>
          {state.erro}
        </div>
      )}
      {novoEnviado && (
        <div style={{ background: "#e6f4ea", color: "#1a7f37", padding: "12px", borderRadius: "10px", fontSize: "0.95rem" }}>
          {(state as any).sucesso}
        </div>
      )}

      <div>
        <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", fontSize: "0.95rem" }}>
          Qual pedido você quer trocar?
        </label>
        <select name="pedidoId" required style={inputStyle} defaultValue="">
          <option value="" disabled>Selecione um pedido...</option>
          {pedidos.map((p) => (
            <option key={p.id} value={p.id}>
              Pedido #{p.id} · {p.criado_em} · R$ {p.total.toFixed(2).replace(".", ",")}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", fontSize: "0.95rem" }}>
          Motivo da troca
        </label>
        <textarea
          name="motivo"
          required
          placeholder="Ex: o tamanho não serviu, veio com defeito, quero outra cor..."
          rows={4}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      <div>
        <label style={{ display: "block", fontWeight: 700, marginBottom: "6px", fontSize: "0.95rem" }}>
          Foto da peça
        </label>
        <input type="hidden" name="imagem" value={imagemUrl} />
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => enviarFoto(e.target.files?.[0])}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={enviando}
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px dashed #aaa",
            background: "#f9f9f9",
            fontWeight: 600,
            cursor: "pointer",
            textAlign: "center",
            width: "100%",
          }}
        >
          {enviando ? "Enviando foto..." : "📸 Selecione a foto da peça"}
        </button>
        {imagemUrl && (
          <div style={{ marginTop: "10px" }}>
            <img
              src={imagemUrl}
              alt="foto da peça"
              style={{ width: "90px", height: "90px", objectFit: "cover", borderRadius: "8px", border: "1px solid #ddd" }}
            />
            <span style={{ fontSize: "0.85rem", color: "#1a7f37", marginLeft: "10px" }}>Foto enviada ✓</span>
          </div>
        )}
        {erroFoto && <div style={{ color: "#c0392b", fontSize: "0.85rem", marginTop: "6px" }}>{erroFoto}</div>}
      </div>

      <button
        type="submit"
        disabled={novoEnviado}
        style={{
          padding: "15px",
          borderRadius: "10px",
          border: "none",
          background: novoEnviado ? "#999" : "#0f0f0f",
          color: "#fff",
          fontWeight: 800,
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        Enviar solicitação de troca
      </button>
    </form>
  );
}

interface FormState {
  erro?: string;
  sucesso?: string;
}