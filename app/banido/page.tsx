import Link from "next/link";
import { getSiteConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function BanidoPage() {
  const config = await getSiteConfig();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: config.corPrincipal,
        color: config.corTextoClaro,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div style={{ maxWidth: "480px", width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "12px" }}>🚫</div>
        <h1 style={{ margin: "0 0 10px", fontSize: "1.6rem" }}>
          Sua conta foi banida
        </h1>
        <p style={{ opacity: 0.85, marginBottom: "28px", lineHeight: 1.6 }}>
          Se desejar, você pode criar outra conta.
        </p>
        <Link
          href="/cadastro"
          style={{
            display: "inline-block",
            background: config.corDestaque,
            color: "#111",
            fontWeight: 800,
            padding: "14px 28px",
            borderRadius: "10px",
            textDecoration: "none",
          }}
        >
          Criar outra conta
        </Link>
        <div style={{ marginTop: "14px" }}>
          <Link href="/" style={{ color: "inherit", opacity: 0.7 }}>
            Voltar para a loja
          </Link>
        </div>
      </div>
    </div>
  );
}