"use client";

import { useRef, useState } from "react";

interface Props {
  rotulo?: string;
  aoEnviar?: (url: string) => void;
}

export default function EnviarImagem({ rotulo = "Enviar imagem", aoEnviar }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setErro("");
    setEnviando(true);
    setPreview("");

    const formData = new FormData();
    formData.append("arquivo", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.erro || "Falha ao enviar.");
        return;
      }
      setUrl(data.url);
      setPreview(data.url);
      aoEnviar?.(data.url);
    } catch {
      setErro("Erro ao enviar a imagem.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
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
        }}
      >
        {enviando ? "Enviando..." : `📁 ${rotulo}`}
      </button>

      {erro && <div style={{ color: "#c0392b", fontSize: "0.85rem" }}>{erro}</div>}

      {preview && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src={preview}
            alt="preview"
            style={{ width: "56px", height: "56px", objectFit: "cover", borderRadius: "8px", border: "1px solid #ddd" }}
          />
          <code
            style={{
              fontSize: "0.8rem",
              background: "#f0f0f0",
              padding: "6px 8px",
              borderRadius: "6px",
              wordBreak: "break-all",
            }}
          >
            {url}
          </code>
        </div>
      )}
    </div>
  );
}