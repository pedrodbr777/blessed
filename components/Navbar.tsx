"use client";

import { useState } from "react";
import Link from "next/link";
import { useCarrinho } from "@/components/CarrinhoContext";
import CarrinhoDrawer from "@/components/CarrinhoDrawer";
import SairButton from "@/components/SairButton";

interface NavbarProps {
  titulo: string;
  corDestaque: string;
  logo?: string;
  usuarioNome?: string;
  usuarioNivel?: string;
}

export default function Navbar({ titulo, corDestaque, logo, usuarioNome, usuarioNivel }: NavbarProps) {
  const { quantidadeTotal, abrir } = useCarrinho();
  const [menuAberto, setMenuAberto] = useState(false);
  const ehAdmin =
    usuarioNivel === "admin" || usuarioNivel === "admin_master" || usuarioNivel === "dev";
  const ehDev = usuarioNivel === "dev";

  function fechar() {
    setMenuAberto(false);
  }

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-inner">
          <Link href="/" className="navbar-logo" style={{ color: corDestaque }} onClick={fechar}>
            {logo ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
                <img
                  src={logo}
                  alt={titulo}
                  style={{ height: "34px", maxWidth: "160px", objectFit: "contain" }}
                />
              </span>
            ) : (
              titulo
            )}
          </Link>

          <button
            className="navbar-hamburguer"
            onClick={() => setMenuAberto(!menuAberto)}
            aria-label="Abrir menu"
            aria-expanded={menuAberto}
          >
            <span className={menuAberto ? "hamburguer-line linha-ativa" : "hamburguer-line"}></span>
            <span className={menuAberto ? "hamburguer-line linha-ativa" : "hamburguer-line"}></span>
            <span className={menuAberto ? "hamburguer-line linha-ativa" : "hamburguer-line"}></span>
          </button>

          <div className="navbar-links">
            <Link href="/" onClick={fechar}>Início</Link>
            <Link href="/produtos" onClick={fechar}>Loja</Link>
            {ehAdmin && (
              <>
                <Link href="/admin" onClick={fechar}>Produtos</Link>
                <Link href="/admin/pedidos" onClick={fechar}>Pedidos</Link>
              </>
            )}
            {ehDev && <Link href="/admin/dev" onClick={fechar}>Customizar</Link>}
            {usuarioNome ? (
              <>
                <Link href="/minha-conta" onClick={fechar} style={{ opacity: 0.9, fontSize: "0.9rem" }}>
                  Olá, {usuarioNome}
                </Link>
                <SairButton />
              </>
            ) : (
              <Link href="/entrar" onClick={fechar}>Entrar</Link>
            )}
            <button className="cart-badge" onClick={abrir} aria-label="Carrinho">
              🛒
              {quantidadeTotal > 0 && (
                <span className="cart-badge-count">{quantidadeTotal}</span>
              )}
            </button>
          </div>
        </div>

        {menuAberto && (
          <div className="navbar-menu-mobile">
            <Link href="/" onClick={fechar}>🏠 Início</Link>
            <Link href="/produtos" onClick={fechar}>🛍️ Loja</Link>
            {ehAdmin && (
              <>
                <Link href="/admin" onClick={fechar}>📦 Produtos</Link>
                <Link href="/admin/pedidos" onClick={fechar}>📋 Pedidos</Link>
              </>
            )}
            {ehDev && <Link href="/admin/dev" onClick={fechar}>🎨 Customizar</Link>}
            <div className="navbar-menu-mobile-sep"></div>
            {usuarioNome ? (
              <>
                <Link href="/minha-conta" onClick={fechar}>👤 Minha conta</Link>
                <div onClick={fechar}>
                  <SairButton />
                </div>
              </>
            ) : (
              <Link href="/entrar" onClick={fechar}>🔑 Entrar</Link>
            )}
          </div>
        )}
      </nav>
      <CarrinhoDrawer />
    </>
  );
}
