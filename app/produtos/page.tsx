import Navbar from "@/components/Navbar";
import ProductGrid from "@/components/ProductGrid";
import { db } from "@/lib/db";
import { getSiteConfig } from "@/lib/config";
import { getUsuarioAtual } from "@/lib/auth";

export const dynamic = "force-dynamic";

export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  imagem: string;
  estoque: number;
}

function getProducts() {
  return db
    .all(
      "SELECT id, nome, descricao, preco, categoria, imagem, estoque FROM produtos WHERE ativo = 1"
    ) as unknown as Promise<Produto[]>;
}

export const metadata = { title: "Loja - Blessed" };

export default async function ProductsPage() {
  const config = await getSiteConfig();
  const produtos = await getProducts();
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
      <section className="secao">
<div className="container">
          <h2 className="secao-titulo">{config.tituloLoja}</h2>
          <p className="secao-sub">{config.subtituloLoja}</p>

          <ProductGrid produtos={produtos} corDestaque={config.corDestaque} />
        </div>
      </section>
    </>
  );
}