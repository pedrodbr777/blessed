import { db } from "@/lib/db";

export async function seedProducts() {
  const count = (await db.get("SELECT COUNT(*) AS total FROM produtos")) as {
    total: number;
  };

  if (count.total > 0) {
    return;
  }

  const produtos = [
    {
      nome: "Camiseta Blessed Básica Branca",
      descricao: "Camiseta 100% algodão premium, caimento regular. Unissex.",
      preco: 79.9,
      categoria: "Camisetas",
      estoque: 25,
    },
    {
      nome: "Moletom Blessed Hoodie Cinza",
      descricao: "Moletom com capuz, forro peluciado e bolso canguru.",
      preco: 159.9,
      categoria: "Moletons",
      estoque: 15,
    },
    {
      nome: "Calça Cargo Blessed Bege",
      descricao: "Calça cargo de tecido resistente com bolsos laterais.",
      preco: 189.9,
      categoria: "Calças",
      estoque: 12,
    },
    {
      nome: "Boné Blessed Bordado Preto",
      descricao: "Boné aba reta com bordado frontal do logo Blessed.",
      preco: 59.9,
      categoria: "Acessórios",
      estoque: 40,
    },
  ];

  for (const p of produtos) {
    await db.run(
      `INSERT INTO produtos (nome, descricao, preco, categoria, estoque)
       VALUES (?, ?, ?, ?, ?)`,
      p.nome,
      p.descricao,
      p.preco,
      p.categoria,
      p.estoque
    );
  }

  return produtos.length;
}