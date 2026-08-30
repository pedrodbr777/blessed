import Link from "next/link";
import { exigeNivel } from "@/lib/protecao";

export const dynamic = "force-dynamic";

export default async function RecrutarPage() {
  await exigeNivel(["admin_master"]);

  const cartao: React.CSSProperties = {
    background: "#fff",
    borderRadius: "14px",
    padding: "28px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    textDecoration: "none",
    color: "inherit",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    textAlign: "center",
  };

  return (
    <div>
      <h1 style={{ marginBottom: "8px" }}>Recrutar ou banir</h1>
      <p style={{ color: "#888", marginBottom: "24px" }}>
        Gerencie os funcionários e contas da loja.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: "18px" }}>
        <Link href="/admin/recrutar/novo" style={cartao}>
          <div style={{ fontSize: "2.2rem" }}>➕</div>
          <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>Novo Admin</div>
          <div style={{ fontSize: "0.85rem", color: "#888" }}>
            Adicionar um funcionário como admin
          </div>
        </Link>
        <Link href="/admin/recrutar/banir" style={cartao}>
          <div style={{ fontSize: "2.2rem" }}>🚫</div>
          <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>Banir Admin</div>
          <div style={{ fontSize: "0.85rem", color: "#888" }}>
            Ver todas as contas e banir admins ou clientes
          </div>
        </Link>
      </div>
    </div>
  );
}