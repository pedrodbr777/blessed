import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import CadastroForm from "@/components/CadastroForm";
import { getSiteConfig } from "@/lib/config";
import { getUsuarioAtual } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function CadastroPage() {
  const config = await getSiteConfig();
  const usuario = await getUsuarioAtual();
  if (usuario) {
    redirect("/");
  }

  return (
    <>
      <Navbar titulo={config.tituloSite} corDestaque={config.corDestaque} />
      <section className="secao" style={{ minHeight: "70vh" }}>
        <div className="container" style={{ maxWidth: "420px" }}>
          <h2 className="secao-titulo">Criar conta</h2>
          <CadastroForm />
        </div>
      </section>
    </>
  );
}
