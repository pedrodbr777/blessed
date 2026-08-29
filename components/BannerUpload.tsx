"use client";

import { useTransition } from "react";
import EnviarImagem from "@/components/EnviarImagem";
import { salvarBannerImagem } from "@/lib/acoesConfig";
import { useRouter } from "next/navigation";

export default function BannerUpload() {
  const [pendente, startTransition] = useTransition();
  const router = useRouter();

  function aoEnviar(url: string) {
    if (!url) return;
    startTransition(async () => {
      await salvarBannerImagem(url);
      router.refresh();
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <EnviarImagem
        rotulo="Enviar imagem do banner (do computador)"
        aoEnviar={aoEnviar}
      />
      {pendente && (
        <span style={{ fontSize: "0.85rem", color: "#888" }}>
          Salvando no banco...
        </span>
      )}
    </div>
  );
}