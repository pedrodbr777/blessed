import Link from "next/link";
import LogoutBtn from "@/components/LogoutBtn";
import { exigeNivel } from "@/lib/protecao";
import { getSiteConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const usuario = await exigeNivel(["admin", "dev"]);
  const config = await getSiteConfig();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-logo">PAINEL</div>
        <nav className="admin-menu">
          <Link href="/admin">📦 Produtos</Link>
          <Link href="/admin/pedidos">📋 Pedidos</Link>
          <Link href="/admin/trocas">🔄 Trocas</Link>
          {usuario.nivel === "dev" && (
            <Link href="/admin/dev">🎨 Customizar</Link>
          )}
        </nav>
        <div className="admin-usuario">
          Logado: {usuario.nome}
          <span className="admin-nivel">{usuario.nivel}</span>
          <LogoutBtn />
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}