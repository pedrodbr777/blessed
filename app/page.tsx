import Navbar from "@/components/Navbar";
import { getSiteConfig } from "@/lib/config";
import { getUsuarioAtual } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const config = await getSiteConfig();
  const usuario = await getUsuarioAtual();

  return (
    <>
      <Navbar
        titulo={config.tituloSite}
        corDestaque={config.corDestaque}
        logo={config.logoImagem}
        usuarioNome={usuario?.nome}
        usuarioNivel={usuario?.nivel}
      />

      <header
        className="hero"
        style={
          config.bannerImagem
            ? { backgroundImage: `url(${config.bannerImagem})`, backgroundSize: "cover", backgroundPosition: "center" }
            : undefined
        }
      >
        <div className="container">
          <h1 className="hero-titulo">{config.tituloSite}</h1>
          <p className="hero-slogan">{config.slogan}</p>
          <a className="hero-botao" href={config.bannerLink}>
            {config.bannerTexto}
          </a>
        </div>
      </header>

      {/* Diferenciais */}
      <section className="secao">
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
              gap: "20px",
            }}
          >
            {[
              { icon: "🚚", titulo: "Envio para todo Brasil", desc: "Entrega segura e rápida" },
              { icon: "🧵", titulo: "Qualidade premium", desc: "Materiais selecionados" },
              { icon: "🔁", titulo: "Troca fácil", desc: "Até 7 dias após receber" },
            ].map((d) => (
              <div
                key={d.titulo}
                style={{
                  background: "#fff",
                  borderRadius: "14px",
                  padding: "22px",
                  textAlign: "center",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "8px" }}>{d.icon}</div>
                <div style={{ fontWeight: 700 }}>{d.titulo}</div>
                <div style={{ fontSize: "0.85rem", color: "#888", marginTop: "4px" }}>
                  {d.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}