"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface ItemCarrinho {
  produtoId: number;
  nome: string;
  preco: number;
  imagem: string;
  tamanho: string;
  quantidade: number;
}

interface CarrinhoContextValue {
  itens: ItemCarrinho[];
  adicionar: (item: ItemCarrinho) => void;
  remover: (produtoId: number, tamanho: string) => void;
  mudarQuantidade: (produtoId: number, tamanho: string, delta: number) => void;
  limpar: () => void;
  total: number;
  quantidadeTotal: number;
  aberto: boolean;
  abrir: () => void;
  fechar: () => void;
}

const CarrinhoContext = createContext<CarrinhoContextValue | null>(null);

const STORAGE_KEY = "blessed_carrinho";

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setItens(JSON.parse(raw));
      }
    } catch {
      setItens([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
    } catch {
      /* ignora */
    }
  }, [itens]);

  function adicionar(item: ItemCarrinho) {
    setItens((prev) => {
      const existente = prev.find(
        (i) => i.produtoId === item.produtoId && i.tamanho === item.tamanho
      );
      if (existente) {
        return prev.map((i) =>
          i.produtoId === item.produtoId && i.tamanho === item.tamanho
            ? { ...i, quantidade: i.quantidade + item.quantidade }
            : i
        );
      }
      return [...prev, item];
    });
  }

  function remover(produtoId: number, tamanho: string) {
    setItens((prev) =>
      prev.filter(
        (i) => !(i.produtoId === produtoId && i.tamanho === tamanho)
      )
    );
  }

  function mudarQuantidade(produtoId: number, tamanho: string, delta: number) {
    setItens((prev) =>
      prev
        .map((i) =>
          i.produtoId === produtoId && i.tamanho === tamanho
            ? { ...i, quantidade: i.quantidade + delta }
            : i
        )
        .filter((i) => i.quantidade > 0)
    );
  }

  function limpar() {
    setItens([]);
  }

  const quantidadeTotal = itens.reduce((s, i) => s + i.quantidade, 0);
  const total = itens.reduce((s, i) => s + i.preco * i.quantidade, 0);

  return (
    <CarrinhoContext.Provider
      value={{
        itens,
        adicionar,
        remover,
        mudarQuantidade,
        limpar,
        total,
        quantidadeTotal,
        aberto,
        abrir: () => setAberto(true),
        fechar: () => setAberto(false),
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const ctx = useContext(CarrinhoContext);
  if (!ctx) {
    throw new Error("useCarrinho deve ser usado dentro de CarrinhoProvider");
  }
  return ctx;
}
