import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import EsqueciSenhaForm from "@/components/EsqueciSenhaForm";
import { getSiteConfig } from "@/lib/config";
import { getUsuarioAtual } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function EsqueciSenhaPage() {
  const config = await getSiteConfig();
  const usuario = await getUsuarioAtual();
  if (usuario) {
    redirect("/minha-conta");
  }

  return (
    <>
      <Navbar titulo={config.tituloSite} corDestaque={config.corDestaque} logo={config.logoImagem} />
      <section className="secao" style={{ minHeight: "70vh" }}>
        <div className="container" style={{ maxWidth: "420px" }}>
          <h2 className="secao-titulo">Esqueci minha senha</h2>
          <EsqueciSenhaForm />
        </div>
      </section>
    </>
  );
}