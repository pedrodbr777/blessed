"use client";

import Link from "next/link";
import { useCarrinho } from "@/components/CarrinhoContext";

export default function CarrinhoDrawer() {
  const {
    itens,
    remover,
    mudarQuantidade,
    total,
    aberto,
    fechar,
  } = useCarrinho();

  const formatar = (v: number) => "R$ " + v.toFixed(2).replace(".", ",");

  return (
    <>
      <div
        className={`cart-overlay ${aberto ? "ativa" : ""}`}
        onClick={fechar}
      />
      <div className={`cart-drawer ${aberto ? "ativa" : ""}`}>
        <div className="cart-header">
          <span>Carrinho</span>
          <button className="cart-fechar" onClick={fechar} aria-label="Fechar">
            ×
          </button>
        </div>

        <div className="cart-lista">
          {itens.length === 0 && (
            <div className="cart-vazio">Seu carrinho está vazio.</div>
          )}
          {itens.map((item) => (
            <div className="cart-item" key={`${item.produtoId}-${item.tamanho}`}>
              <div className="cart-item-info">
                <div className="cart-item-nome">{item.nome}</div>
                <div className="cart-item-det">
                  {item.tamanho && <>Tamanho: {item.tamanho} · </>}
                  {formatar(item.preco)}
                </div>
                <div className="cart-qtd">
                  <button onClick={() => mudarQuantidade(item.produtoId, item.tamanho, -1)}>
                    −
                  </button>
                  <span>{item.quantidade}</span>
                  <button onClick={() => mudarQuantidade(item.produtoId, item.tamanho, 1)}>
                    +
                  </button>
                  <button
                    onClick={() => remover(item.produtoId, item.tamanho)}
                    style={{ marginLeft: "8px", width: "auto", border: "none", background: "none", color: "#c0392b", fontWeight: 700 }}
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-rodape">
          <div className="cart-total">
            <span>Total</span>
            <span>{formatar(total)}</span>
          </div>
          <Link href="/checkout">
            <button className="cart-botao">Finalizar compra</button>
          </Link>
        </div>
      </div>
    </>
  );
}
