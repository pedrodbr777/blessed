import { getSiteConfig } from "@/lib/config";

export default async function Footer() {
  const config = await getSiteConfig();

  return (
    <footer
      style={{
        background: config.corPrincipal,
        color: config.corTextoClaro,
        padding: "50px 20px 30px",
        marginTop: "60px",
      }}
    >
      <div
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
          gap: "30px",
        }}
      >
        <div>
          <div
            style={{
              fontWeight: 800,
              letterSpacing: "0.25em",
              color: config.corDestaque,
              fontSize: "1.2rem",
              marginBottom: "10px",
            }}
          >
            {config.tituloSite}
          </div>
          <p style={{ opacity: 0.8, fontSize: "0.92rem", lineHeight: 1.6 }}>
            {config.slogan}. Moda com identidade e atitude para o seu estilo.
          </p>
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: "10px" }}>Atendimento</div>
          <p style={{ opacity: 0.8, fontSize: "0.92rem", lineHeight: 1.8 }}>
            Enviamos para todo o Brasil<br />
            Segunda a sábado, 9h às 18h
          </p>
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: "10px" }}>Formas de pagamento</div>
          <p style={{ opacity: 0.8, fontSize: "0.92rem", lineHeight: 1.8 }}>
            PIX · Cartão de crédito<br />
            Boleto
          </p>
        </div>
      </div>

      <div
        className="container"
        style={{ borderTop: "1px solid rgba(255,255,255,0.15)", marginTop: "30px", paddingTop: "20px", textAlign: "center", opacity: 0.6 }}
      >
        {config.rodapeTexto}
      </div>
    </footer>
  );
}
