import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import LoginForm from "@/components/LoginForm";
import { getSiteConfig } from "@/lib/config";
import { getUsuarioAtual } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
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
          <h2 className="secao-titulo">Entrar</h2>
          <LoginForm />
        </div>
      </section>
    </>
  );
}
