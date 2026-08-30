"use client";

import { useRef, useState } from "react";
import EditorImagem from "@/components/EditorImagem";

interface Props {
  logoAtual?: string;
}

export default function LogoUpload({ logoAtual = "" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [logo, setLogo] = useState(logoAtual);
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
      const nome = `logo-${Date.now()}.png`;
      formData.append("arquivo", new File([blob], nome, { type: "image/png" }));
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.erro || "Falha ao enviar a logo.");
        return;
      }
      setLogo(data.url);
      const ups = new FormData();
      ups.append("logo_imagem", data.url);
      const r2 = await fetch("/api/dev/logo", { method: "POST", body: ups });
      if (!r2.ok) {
        const d2 = await r2.json().catch(() => ({}));
        setErro(d2.erro || "Logo enviada, mas não foi salva no site.");
      }
    } catch {
      setErro("Erro ao enviar a logo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <input type="hidden" name="logo_imagem" value={logo} />
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
        {enviando ? "Salvando logo..." : "🖼️ Enviar logo da marca"}
      </button>

      {logo ? (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src={logo}
            alt="logo da marca"
            style={{
              height: "44px",
              maxWidth: "160px",
              objectFit: "contain",
              background: "#0f0f0f",
              borderRadius: "8px",
              padding: "4px",
            }}
          />
          <span style={{ fontSize: "0.8rem", color: "#1a7f37" }}>Logo da marca ✓</span>
        </div>
      ) : (
        <span style={{ fontSize: "0.8rem", color: "#aaa" }}>
          Nenhuma logo definida. Ao enviar, ela aparece no topo do site.
        </span>
      )}

      {erro && <div style={{ color: "#c0392b", fontSize: "0.85rem" }}>{erro}</div>}

      {arquivoEditar && (
        <EditorImagem
          arquivo={arquivoEditar}
          onCancelar={() => setArquivoEditar(null)}
          onSalvar={enviarBlob}
          rotulo="Ajustar a logo da marca"
        />
      )}
    </div>
  );
}
