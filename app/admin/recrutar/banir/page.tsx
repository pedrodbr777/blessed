import { exigeNivel } from "@/lib/protecao";
import { db } from "@/lib/db";
import { EMAIL_MASTER, NOME_NIVEL, type Nivel } from "@/lib/permissoes";
import {
  autorizarRecrutamento,
  banirUsuario,
  recrutamentoAutorizado,
} from "@/lib/acoesRecrutamento";

export const dynamic = "force-dynamic";

interface LinhaUsuario {
  id: number;
  nome: string;
  email: string;
  nivel: string;
  bloqueado: number;
}

const labelStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "#555",
};

const inputStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  fontSize: "1rem",
  width: "100%",
};

const botaoStyle: React.CSSProperties = {
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "#0f0f0f",
  color: "#fff",
  fontWeight: 700,
  fontSize: "1rem",
  cursor: "pointer",
};

const mensagemStyle = (tipo: "erro" | "ok"): React.CSSProperties => ({
  background: tipo === "erro" ? "#fdecea" : "#eafaf1",
  color: tipo === "erro" ? "#b3261e" : "#1b7a3d",
  padding: "12px",
  borderRadius: "10px",
  fontSize: "0.95rem",
  marginBottom: "16px",
});

const corNivel: Record<string, string> = {
  dev: "#6b4fbb",
  admin_master: "#0f0f0f",
  admin: "#1b6aa8",
  cliente: "#7a7a7a",
};

export default async function BanirAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; ok?: string }>;
}) {
  await exigeNivel(["admin_master"]);
  const autorizado = await recrutamentoAutorizado();
  const { erro, ok } = await searchParams;

  const usuarios: LinhaUsuario[] = autorizado
    ? ((await db.all(
        `SELECT id, nome, email, nivel, bloqueado FROM usuarios
         ORDER BY CASE nivel
           WHEN 'dev' THEN 0
           WHEN 'admin_master' THEN 1
           WHEN 'admin' THEN 2
           ELSE 3
         END, nome COLLATE NOCASE`
      )) as unknown as LinhaUsuario[])
    : [];

  return (
    <div>
      <h1 style={{ marginBottom: "8px" }}>Banir Admin</h1>

      {erro && <div style={mensagemStyle("erro")}>{erro}</div>}
      {ok && <div style={mensagemStyle("ok")}>{ok}</div>}
      {autorizado && (
        <p style={{ color: "#888", fontSize: "0.9rem", marginBottom: "20px" }}>
          Você só pode banir admins ou clientes. Contas de dev e do admin master
          não podem ser banidas.
        </p>
      )}

      {!autorizado ? (
        <div
          style={{
            background: "#fff",
            borderRadius: "14px",
            padding: "24px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            maxWidth: "420px",
          }}
        >
          <h2 style={{ fontSize: "1.1rem", marginBottom: "6px" }}>
            Digite a senha
          </h2>
          <p style={{ color: "#888", fontSize: "0.9rem", marginBottom: "16px" }}>
            Para liberar esta área, digite a senha de acesso.
          </p>
          <form
            action={autorizarRecrutamento}
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            <input type="hidden" name="destino" value="/admin/recrutar/banir" />
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={labelStyle}>Senha</span>
              <input name="senha" type="password" required style={inputStyle} placeholder="Digite a senha" />
            </div>
            <button type="submit" style={botaoStyle}>
              Liberar
            </button>
          </form>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {usuarios.map((u) => {
            const nivel = (u.nivel || "cliente") as Nivel;
            const podeBanir = u.nivel === "admin" || u.nivel === "cliente";
            const isMaster = u.email === EMAIL_MASTER;
            return (
              <div
                key={u.id}
                style={{
                  background: "#fff",
                  borderRadius: "12px",
                  padding: "14px 18px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontWeight: 600 }}>{u.nome}</div>
                  <div style={{ fontSize: "0.85rem", color: "#666" }}>{u.email}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "#fff",
                        background: corNivel[nivel] || "#7a7a7a",
                        borderRadius: "6px",
                        padding: "2px 8px",
                      }}
                    >
                      {NOME_NIVEL[nivel] || nivel}
                    </span>
                    {u.bloqueado === 1 && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "#b3261e",
                          background: "#fdecea",
                          borderRadius: "6px",
                          padding: "2px 8px",
                        }}
                      >
                        Banida
                      </span>
                    )}
                  </div>
                </div>
                {podeBanir && !isMaster ? (
                  <form action={banirUsuario}>
                    <input type="hidden" name="id" value={u.id} />
                    <button
                      type="submit"
                      style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        border: "none",
                        background: u.bloqueado === 1 ? "#eee" : "#fdecea",
                        color: u.bloqueado === 1 ? "#999" : "#b3261e",
                        fontWeight: 600,
                        cursor: u.bloqueado === 1 ? "not-allowed" : "pointer",
                      }}
                      disabled={u.bloqueado === 1}
                    >
                      {u.bloqueado === 1 ? "Banida" : "Banir"}
                    </button>
                  </form>
                ) : (
                  <span style={{ fontSize: "0.8rem", color: "#999", fontWeight: 600 }}>
                    {isMaster ? "Conta fixa, não pode ser banida" : "Não pode ser banida"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}