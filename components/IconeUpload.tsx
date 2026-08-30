"use client";

import { useRef, useState } from "react";
import EditorImagem from "@/components/EditorImagem";

interface Props {
  iconeAtual?: string;
}

export default function IconeUpload({ iconeAtual = "" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [icone, setIcone] = useState(iconeAtual);
  const [arquivoEditar, setArquivoEditar] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  function handleFile(file: File | undefined) {
    if (!file) return;
    setArquivoEditar(file);
  }

  async function enviarBlob(blob: Blob) {
    setArquivoEditar(null);
    setEnviando(true);
    setErro("");
    try {
      const formData = new FormData();
      const nome = `icone-${Date.now()}.png`;
      formData.append("arquivo", new File([blob], nome, { type: "image/png" }));
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.erro || "Falha ao enviar o ícone.");
        return;
      }
      setIcone(data.url);
      const ups = new FormData();
      ups.append("app_icone", data.url);
      const r2 = await fetch("/api/dev/icone", { method: "POST", body: ups });
      if (!r2.ok) {
        const d2 = await r2.json().catch(() => ({}));
        setErro(d2.erro || "Ícone enviado, mas não foi salvo no site.");
      }
    } catch {
      setErro("Erro ao enviar o ícone.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <input type="hidden" name="app_icone" value={icone} />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files?.[0])}
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
        }}
      >
        {enviando ? "Salvando ícone..." : "📱 Enviar ícone do app"}
      </button>

      {icone ? (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src={icone}
            alt="ícone do app"
            style={{
              width: "48px",
              height: "48px",
              objectFit: "cover",
              borderRadius: "12px",
              background: "#0f0f0f",
              padding: "4px",
            }}
          />
          <span style={{ fontSize: "0.8rem", color: "#1a7f37" }}>Ícone do app ✓</span>
        </div>
      ) : (
        <span style={{ fontSize: "0.8rem", color: "#aaa" }}>
          Nenhum ícone definido. Use uma imagem quadrada — ela vira o ícone do app no celular.
        </span>
      )}

      {erro && <div style={{ color: "#c0392b", fontSize: "0.85rem" }}>{erro}</div>}

      {arquivoEditar && (
        <EditorImagem
          arquivo={arquivoEditar}
          onCancelar={() => setArquivoEditar(null)}
          onSalvar={enviarBlob}
          rotulo="Ajustar o ícone do app"
          aspecto={1}
          tamanhoSaida={512}
          formato="png"
        />
      )}
    </div>
  );
}