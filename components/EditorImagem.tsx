"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import type { Area, Point } from "react-easy-crop";

interface Props {
  arquivo: File | Blob;
  onCancelar: () => void;
  onSalvar: (blob: Blob) => void;
  rotulo?: string;
}

export default function EditorImagem({ arquivo, onCancelar, onSalvar, rotulo = "Ajustar imagem" }: Props) {
  const src = useMemo(() => URL.createObjectURL(arquivo), [arquivo]);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotacao, setRotacao] = useState(0);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const croppedAreaRef = useRef<Area | null>(null);

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    croppedAreaRef.current = areaPixels;
  }, []);

  async function recortarEExportar() {
    const area = croppedAreaRef.current;
    if (!area || !src) return;
    setSalvando(true);
    setErro("");
    try {
      const image = await carregarImagem(src);
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Sem contexto de desenho");
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotacao * Math.PI) / 180);
      ctx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);

      const saidaCanvas = document.createElement("canvas");
      saidaCanvas.width = area.width;
      saidaCanvas.height = area.height;
      const sctx = saidaCanvas.getContext("2d");
      if (!sctx) throw new Error("Sem contexto de saída");
      sctx.drawImage(canvas, area.x, area.y, area.width, area.height, 0, 0, area.width, area.height);

      const blob = await new Promise<Blob | null>((resolve) => {
        saidaCanvas.toBlob((b) => resolve(b), "image/jpeg", 0.9);
      });
      if (!blob) throw new Error("Falha ao gerar imagem");
      onSalvar(blob);
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro ao recortar imagem.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.92)",
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ color: "#fff", fontWeight: 700, textAlign: "center", marginBottom: "10px" }}>
        {rotulo} — arraste para mover, rode a rolagem para dar zoom
      </div>

      <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
        <Cropper image={src} crop={crop} zoom={zoom} rotation={rotacao} aspect={4 / 4} onCropChange={setCrop} onZoomChange={setZoom} onRotationChange={setRotacao} onCropComplete={onCropComplete} />
      </div>

      <div style={{ padding: "12px 0", color: "#fff", display: "flex", flexDirection: "column", gap: "8px" }}>
        <label style={{ fontSize: "0.85rem" }}>
          Zoom
          <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} style={{ width: "100%" }} />
        </label>
        <label style={{ fontSize: "0.85rem" }}>
          Girar
          <input type="range" min={-180} max={180} step={1} value={rotacao} onChange={(e) => setRotacao(Number(e.target.value))} style={{ width: "100%" }} />
        </label>

        <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
          <button type="button" onClick={onCancelar} disabled={salvando} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "none", background: "#555", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
            Cancelar
          </button>
          <button type="button" onClick={recortarEExportar} disabled={salvando} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "none", background: "#2ecc71", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
            {salvando ? "Salvando..." : "Aplicar recorte"}
          </button>
        </div>

        {erro && <div style={{ color: "#ff6b6b", fontSize: "0.85rem", textAlign: "center" }}>{erro}</div>}
      </div>
    </div>
  );
}

function carregarImagem(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Não foi possível carregar a imagem."));
    img.src = src;
  });
}
