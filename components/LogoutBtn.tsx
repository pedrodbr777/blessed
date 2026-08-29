"use client";

import { useRouter } from "next/navigation";

export default function LogoutBtn() {
  const router = useRouter();

  async function sair() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={sair}
      className="logout-btn"
      style={{
        padding: "10px 12px",
        borderRadius: "8px",
        border: "none",
        background: "#c0392b",
        color: "#fff",
        fontWeight: 600,
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      Sair
    </button>
  );
}
