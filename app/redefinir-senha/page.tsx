import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import RedefinirSenhaForm from "@/components/RedefinirSenhaForm";
import { getSiteConfig } from "@/lib/config";
import { getUsuarioAtual } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function RedefinirSenhaPage({
  params,
  searchParams,
}: {
  params: Promise<Record<string, string>>;
  searchParams: Promise<{ token?: string }>;
}) {
  const config = await getSiteConfig();
  const usuario = await getUsuarioAtual();
  if (usuario) {
    redirect("/minha-conta");
  }

  const sp = await searchParams;
  if (!sp.token) {
    redirect("/esqueci-senha");
  }

  return (
    <>
      <Navbar titulo={config.tituloSite} corDestaque={config.corDestaque} logo={config.logoImagem} />
      <section className="secao" style={{ minHeight: "70vh" }}>
        <div className="container" style={{ maxWidth: "420px" }}>
          <h2 className="secao-titulo">Redefinir senha</h2>
          <RedefinirSenhaForm token={sp.token} />
        </div>
      </section>
    </>
  );
}