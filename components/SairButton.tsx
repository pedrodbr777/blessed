"use client";

import { useRouter } from "next/navigation";

export default function SairButton() {
  const router = useRouter();

  async function sair() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={sair}
      style={{
        background: "none",
        border: "none",
        color: "#ff6b6b",
        fontSize: "0.95rem",
        fontWeight: 700,
        cursor: "pointer",
        padding: 0,
      }}
    >
      Sair
    </button>
  );
}
