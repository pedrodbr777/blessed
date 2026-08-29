import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import CheckoutPage from "@/components/CheckoutPage";
import { getSiteConfig } from "@/lib/config";
import { getUsuarioAtual } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Checkout() {
  const config = await getSiteConfig();
  const usuario = await getUsuarioAtual();

  if (!usuario) {
    redirect("/entrar");
  }

  const pagamentoAtivo = Boolean(process.env.STRIPE_PUBLISHABLE_KEY);

  return (
    <>
      <Navbar titulo={config.tituloSite} corDestaque={config.corDestaque} usuarioNome={usuario.nome} usuarioNivel={usuario.nivel} />
      <CheckoutPage config={config} pagamentoAtivo={pagamentoAtivo} />
    </>
  );
}
