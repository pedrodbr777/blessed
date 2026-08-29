"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCarrinho } from "@/components/CarrinhoContext";
import { finalizarPedidoAction } from "@/lib/checkoutActions";

interface Config {
  corDestaque: string;
  tituloSite: string;
}

interface Props {
  config: Config;
  pagamentoAtivo: boolean;
}

const inputStyle: React.CSSProperties = {
  padding: "13px 14px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  fontSize: "1rem",
  width: "100%",
};

export default function CheckoutPage({ config, pagamentoAtivo }: Props) {
  const { itens, total, limpar } = useCarrinho();
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [contato, setContato] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const formatar = (v: number) => "R$ " + v.toFixed(2).replace(".", ",");
  const totalCentavos = Math.round(total * 100);

  async function finalizar() {
    if (!nome || !endereco || !contato) {
      setErro("Preencha nome, endereço e contato.");
      return;
    }
    setErro("");
    setEnviando(true);

    const res = await finalizarPedidoAction({
      nomeCliente: nome,
      endereco,
      contato,
      totalCentavos,
      itens: itens.map((i) => ({
        produtoId: i.produtoId,
        nome: i.nome,
        preco: i.preco,
        quantidade: i.quantidade,
        tamanho: i.tamanho,
      })),
    });

    setEnviando(false);

    if (res.erro) {
      setErro(res.erro);
      return;
    }

    limpar();
    setSucesso(true);
    setTimeout(() => router.push("/"), 2500);
  }

  if (sucesso) {
    return (
      <section className="secao" style={{ minHeight: "60vh" }}>
        <div className="container" style={{ maxWidth: "520px", textAlign: "center" }}>
          <div style={{ fontSize: "3.5rem" }}>✓</div>
          <h2 className="secao-titulo">Pedido recebido!</h2>
          <p style={{ color: "#888" }}>
            Seu pedido foi registrado. Obrigado por comprar na {config.tituloSite}!
          </p>
        </div>
      </section>
    );
  }

  if (itens.length === 0) {
    return (
      <section className="secao" style={{ minHeight: "60vh" }}>
        <div className="container" style={{ maxWidth: "520px", textAlign: "center" }}>
          <h2 className="secao-titulo">Checkout</h2>
          <p style={{ color: "#888", marginTop: "20px" }}>
            Seu carrinho está vazio.{" "}
            <Link href="/produtos" style={{ color: "#111", fontWeight: 700 }}>
              Ver produtos
            </Link>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="secao" style={{ minHeight: "60vh" }}>
      <div className="container" style={{ maxWidth: "640px" }}>
        <h2 className="secao-titulo">Checkout</h2>
        <p className="secao-sub">Confirme seus dados e o pagamento</p>

        {erro && (
          <div
            style={{
              background: "#fdecea",
              color: "#b3261e",
              padding: "12px",
              borderRadius: "10px",
              marginBottom: "16px",
              fontSize: "0.95rem",
            }}
          >
            {erro}
          </div>
        )}

        {/* Resumo do carrinho */}
        <div
          style={{
            background: "#fff",
            borderRadius: "14px",
            padding: "20px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ marginBottom: "12px" }}>Resumo do pedido</h3>
          {itens.map((i) => (
            <div
              key={`${i.produtoId}-${i.tamanho}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <span>
                {i.quantidade}x {i.nome}
                {i.tamanho && <span style={{ color: "#888", fontSize: "0.85rem" }}> (Tamanho {i.tamanho})</span>}
              </span>
              <span style={{ fontWeight: 600 }}>
                {formatar(i.preco * i.quantidade)}
              </span>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "12px",
              fontWeight: 800,
              fontSize: "1.1rem",
            }}
          >
            <span>Total</span>
            <span>{formatar(total)}</span>
          </div>
        </div>

        {/* Dados do cliente */}
        <div
          style={{
            background: "#fff",
            borderRadius: "14px",
            padding: "20px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            marginBottom: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <h3>Seus dados</h3>
          <input style={inputStyle} placeholder="Nome completo" value={nome} onChange={(e) => setNome(e.target.value)} />
          <input style={inputStyle} placeholder="Endereço completo" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
          <input style={inputStyle} placeholder="WhatsApp / telefone" value={contato} onChange={(e) => setContato(e.target.value)} />
        </div>

        {/* Pagamento */}
        <div
          style={{
            background: "#fff",
            borderRadius: "14px",
            padding: "20px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          {pagamentoAtivo ? (
            <StripeCheckoutBox totalCentavos={totalCentavos} onPago={finalizar} />
          ) : (
            <>
              <h3 style={{ marginBottom: "10px" }}>Pagamento</h3>
              <p style={{ color: "#888", fontSize: "0.95rem", marginBottom: "14px" }}>
                ⚠️ O pagamento online ainda não está configurado. Seu pedido será
                registrado e o pagamento combinado por outro canal.
              </p>
              <button
                onClick={finalizar}
                disabled={enviando}
                style={{
                  width: "100%",
                  padding: "15px",
                  border: "none",
                  borderRadius: "10px",
                  background: config.corDestaque,
                  color: "#111",
                  fontWeight: 800,
                  fontSize: "1rem",
                }}
              >
                {enviando ? "Processando..." : "Confirmar pedido"}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect } from "react";

function StripeCheckoutBox({
  totalCentavos,
  onPago,
}: {
  totalCentavos: number;
  onPago: () => void;
}) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ totalCentavos }),
        });
        const data = await res.json();
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setErro(data.erro || "Não foi possível iniciar o pagamento.");
        }
      } catch {
        setErro("Erro ao iniciar o pagamento.");
      } finally {
        setCarregando(false);
      }
    })();
  }, [totalCentavos]);

  const publishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (carregando) return <p style={{ color: "#888" }}>Carregando pagamento...</p>;
  if (erro || !clientSecret || !publishable) {
    return (
      <>
        <h3 style={{ marginBottom: "10px" }}>Pagamento</h3>
        <p style={{ color: "#c0392b" }}>{erro || "Pagamento indisponível no momento."}</p>
        <button
          onClick={onPago}
          style={{
            width: "100%",
            marginTop: "14px",
            padding: "15px",
            border: "none",
            borderRadius: "10px",
            background: "#0f0f0f",
            color: "#fff",
            fontWeight: 800,
            fontSize: "1rem",
          }}
        >
          Confirmar pedido (pagamento à combinar)
        </button>
      </>
    );
  }

  return (
    <Elements
      stripe={loadStripe(publishable)}
      options={{ clientSecret }}
    >
      <StripeForm totalCentavos={totalCentavos} onSucesso={onPago} />
    </Elements>
  );
}

function StripeForm({
  totalCentavos,
  onSucesso,
}: {
  totalCentavos: number;
  onSucesso: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [pagando, setPagando] = useState(false);
  const [erro, setErro] = useState("");

  async function pagar() {
    if (!stripe || !elements) return;
    setPagando(true);
    setErro("");
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {},
      redirect: "if_required",
    });
    setPagando(false);
    if (result.error) {
      setErro(result.error.message || "Erro no pagamento.");
      return;
    }
    if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
      onSucesso();
    }
  }

  return (
    <>
      <h3 style={{ marginBottom: "10px" }}>
        Pagamento ({totalCentavos > 0 ? "R$ " + (totalCentavos / 100).toFixed(2).replace(".", ",") : ""})
      </h3>
      <div style={{ padding: "14px", border: "1px solid #eee", borderRadius: "10px", marginBottom: "14px" }}>
        <PaymentElement />
      </div>
      {erro && (
        <div
          style={{
            background: "#fdecea",
            color: "#b3261e",
            padding: "10px",
            borderRadius: "10px",
            marginBottom: "12px",
            fontSize: "0.9rem",
          }}
        >
          {erro}
        </div>
      )}
      <button
        onClick={pagar}
        disabled={!stripe || pagando}
        style={{
          width: "100%",
          padding: "15px",
          border: "none",
          borderRadius: "10px",
          background: pagando ? "#999" : "#0f0f0f",
          color: "#fff",
          fontWeight: 800,
          fontSize: "1rem",
        }}
      >
        {pagando ? "Processando..." : "Pagar"}
      </button>
    </>
  );
}
