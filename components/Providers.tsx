"use client";

import { CarrinhoProvider } from "@/components/CarrinhoContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <CarrinhoProvider>{children}</CarrinhoProvider>;
}
