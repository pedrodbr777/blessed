import { getSiteConfig } from "@/lib/config";
import { salvarConfig } from "@/lib/acoesConfig";
import { exigeNivel } from "@/lib/protecao";
import BannerUpload from "@/components/BannerUpload";
import { list } from "@vercel/blob";
import fs from "node:fs";
import path from "node:path";

export const dynamic = "force-dynamic";

const labelStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "#555",
};

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  fontSize: "0.95rem",
  width: "100%",
};

const campoStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

export default async function DevPage() {
  await exigeNivel(["dev"]);
  const config = await getSiteConfig();

  let imagens: string[] = [];

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const resultado = await list({ prefix: "uploads/" });
    imagens = resultado.blobs
      .map((b) => b.url)
      .sort()
      .reverse();
  } else {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    try {
      imagens = fs
        .readdirSync(uploadDir)
        .filter((f) => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
        .map((f) => `/uploads/${f}`)
        .sort()
        .reverse();
    } catch {
      imagens = [];
    }
  }

  return (
    <div>
      <h1 style={{ marginBottom: "8px" }}>Customização do site</h1>
      <p style={{ color: "#888", marginBottom: "24px" }}>
        As alterações aqui aparecem na hora no site da loja.
      </p>

      <form
        action={salvarConfig}
        style={{
          background: "#fff",
          borderRadius: "14px",
          padding: "24px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
          gap: "18px",
        }}
      >
        {/* Cores */}
        <div style={campoStyle}>
          <span style={labelStyle}>Cor principal (fundo escuro)</span>
          <input name="cor_principal" type="color" defaultValue={config.corPrincipal} style={{ width: "80px", height: "44px", border: "1px solid #ddd", borderRadius: "8px", padding: "4px" }} />
        </div>
        <div style={campoStyle}>
          <span style={labelStyle}>Cor de destaque (dourado)</span>
          <input name="cor_destaque" type="color" defaultValue={config.corDestaque} style={{ width: "80px", height: "44px", border: "1px solid #ddd", borderRadius: "8px", padding: "4px" }} />
        </div>

        {/* Textos */}
        <div style={campoStyle}>
          <span style={labelStyle}>Título do site (logo)</span>
          <input name="titulo_site" defaultValue={config.tituloSite} style={inputStyle} />
        </div>
        <div style={campoStyle}>
          <span style={labelStyle}>Slogan</span>
          <input name="slogan" defaultValue={config.slogan} style={inputStyle} />
        </div>

        {/* Banner */}
        <div style={campoStyle}>
          <span style={labelStyle}>Imagem do banner (salva no banco)</span>
          <BannerUpload />
        </div>
        <div style={campoStyle}>
          <span style={labelStyle}>Ou cole a URL do banner</span>
          <input name="banner_imagem" defaultValue={config.bannerImagem} placeholder="https://..." style={inputStyle} />
        </div>
        <div style={campoStyle}>
          <span style={labelStyle}>Texto do botão do banner</span>
          <input name="banner_texto" defaultValue={config.bannerTexto} style={inputStyle} />
        </div>
        <div style={campoStyle}>
          <span style={labelStyle}>Link do botão do banner</span>
          <input name="banner_link" defaultValue={config.bannerLink} style={inputStyle} />
        </div>

        <button
          type="submit"
          style={{
            gridColumn: "1 / -1",
            padding: "14px",
            borderRadius: "10px",
            border: "none",
            background: config.corDestaque,
            color: "#111",
            fontWeight: 800,
            fontSize: "1rem",
          }}
        >
          Salvar alterações
        </button>
      </form>

      {/* Imagens salvas */}
      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          padding: "24px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          marginTop: "24px",
        }}
      >
        <h2 style={{ fontSize: "1.1rem", marginBottom: "6px" }}>Minhas imagens enviadas</h2>
        <p style={{ color: "#888", fontSize: "0.9rem", marginBottom: "16px" }}>
          Imagens que você enviou pelo computador. Copie o link para usar no banner
          ou nos produtos.
        </p>
        {imagens.length === 0 && (
          <p style={{ color: "#aaa" }}>Nenhuma imagem enviada ainda. Envie uma acima.</p>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px,1fr))", gap: "14px" }}>
          {imagens.map((img) => (
            <div key={img} style={{ border: "1px solid #eee", borderRadius: "10px", overflow: "hidden" }}>
              <img src={img} alt={img} style={{ width: "100%", height: "120px", objectFit: "cover" }} />
              <div style={{ padding: "8px" }}>
                <code style={{ fontSize: "0.72rem", wordBreak: "break-all", color: "#555" }}>{img}</code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}