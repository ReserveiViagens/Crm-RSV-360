import { useState } from "react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Shield,
  Search,
  X,
  Edit,
  CheckCircle,
  Loader2,
  UserCheck,
  User,
  Crown,
  ToggleLeft,
  ToggleRight,
  Save,
} from "lucide-react";

type Role = "admin" | "LIDER" | "cliente";

interface UsuarioPermissao {
  id: string;
  nome: string;
  email: string;
  role: Role;
  ativo: boolean;
  criado: string;
  ultimoAcesso: string;
}

const MOCK_USUARIOS: UsuarioPermissao[] = [
  { id: "1", nome: "Admin Sistema", email: "admin@reserveiviagens.com.br", role: "admin", ativo: true, criado: "2024-01-15", ultimoAcesso: "2026-03-26" },
  { id: "2", nome: "João Silva", email: "joao@email.com", role: "LIDER", ativo: true, criado: "2024-06-10", ultimoAcesso: "2026-03-24" },
  { id: "3", nome: "Maria Santos", email: "maria@email.com", role: "cliente", ativo: true, criado: "2025-01-20", ultimoAcesso: "2026-03-20" },
  { id: "4", nome: "Pedro Costa", email: "pedro@email.com", role: "cliente", ativo: false, criado: "2025-03-05", ultimoAcesso: "2025-11-10" },
  { id: "5", nome: "Ana Oliveira", email: "ana@email.com", role: "LIDER", ativo: true, criado: "2024-09-18", ultimoAcesso: "2026-03-22" },
  { id: "6", nome: "Carlos Mendes", email: "carlos@email.com", role: "cliente", ativo: true, criado: "2025-07-30", ultimoAcesso: "2026-02-28" },
  { id: "7", nome: "Fernanda Lima", email: "fernanda@email.com", role: "cliente", ativo: true, criado: "2025-11-12", ultimoAcesso: "2026-03-15" },
  { id: "8", nome: "Ricardo Souza", email: "ricardo@email.com", role: "LIDER", ativo: false, criado: "2024-04-22", ultimoAcesso: "2025-12-01" },
  { id: "9", nome: "Juliana Pereira", email: "juliana@email.com", role: "cliente", ativo: true, criado: "2026-01-08", ultimoAcesso: "2026-03-18" },
  { id: "10", nome: "Roberto Alves", email: "roberto@email.com", role: "admin", ativo: true, criado: "2024-02-01", ultimoAcesso: "2026-03-25" },
];

const PAGE_SIZE = 7;

const ROLE_CONFIG: Record<Role, { label: string; bg: string; color: string; icon: React.ReactNode }> = {
  admin: { label: "Administrador", bg: "#EFF6FF", color: "#1D4ED8", icon: <Crown style={{ width: 12, height: 12 }} /> },
  LIDER: { label: "Líder", bg: "#F0FDF4", color: "#166534", icon: <UserCheck style={{ width: 12, height: 12 }} /> },
  cliente: { label: "Cliente", bg: "#F9FAFB", color: "#4B5563", icon: <User style={{ width: 12, height: 12 }} /> },
};

export default function PermissoesPage() {
  const { toast } = useToast();
  const [usuarios, setUsuarios] = useState<UsuarioPermissao[]>(MOCK_USUARIOS);
  const [busca, setBusca] = useState("");
  const [filtroRole, setFiltroRole] = useState<string>("todos");
  const [filtroAtivo, setFiltroAtivo] = useState<string>("todos");
  const [pagina, setPagina] = useState(0);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<Role>("cliente");
  const [editAtivo, setEditAtivo] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const filtrados = usuarios.filter((u) => {
    const matchBusca =
      u.nome.toLowerCase().includes(busca.toLowerCase()) ||
      u.email.toLowerCase().includes(busca.toLowerCase());
    const matchRole = filtroRole === "todos" || u.role === filtroRole;
    const matchAtivo =
      filtroAtivo === "todos" ||
      (filtroAtivo === "ativo" && u.ativo) ||
      (filtroAtivo === "inativo" && !u.ativo);
    return matchBusca && matchRole && matchAtivo;
  });

  const totalPaginas = Math.ceil(filtrados.length / PAGE_SIZE);
  const paginados = filtrados.slice(pagina * PAGE_SIZE, (pagina + 1) * PAGE_SIZE);

  const abrirEdicao = (u: UsuarioPermissao) => {
    setEditandoId(u.id);
    setEditRole(u.role);
    setEditAtivo(u.ativo);
  };

  const fecharEdicao = () => {
    setEditandoId(null);
  };

  const salvarEdicao = async () => {
    setSalvando(true);
    await new Promise((r) => setTimeout(r, 800));
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === editandoId ? { ...u, role: editRole, ativo: editAtivo } : u
      )
    );
    setSalvando(false);
    setEditandoId(null);
    toast({ title: "Permissões atualizadas!", description: "As alterações foram salvas com sucesso." });
  };

  const toggleAtivo = (id: string) => {
    setUsuarios((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        const novoStatus = !u.ativo;
        toast({
          title: novoStatus ? "Usuário ativado" : "Usuário desativado",
          description: `${u.nome} foi ${novoStatus ? "ativado" : "desativado"}.`,
        });
        return { ...u, ativo: novoStatus };
      })
    );
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  };

  const editando = editandoId ? usuarios.find((u) => u.id === editandoId) : null;

  const statsCards = [
    { label: "Total de Usuários", value: usuarios.length, color: "#2563EB", bg: "#DBEAFE" },
    { label: "Administradores", value: usuarios.filter((u) => u.role === "admin").length, color: "#7c3aed", bg: "#EDE9FE" },
    { label: "Líderes", value: usuarios.filter((u) => u.role === "LIDER").length, color: "#16a34a", bg: "#DCFCE7" },
    { label: "Usuários Ativos", value: usuarios.filter((u) => u.ativo).length, color: "#0284c7", bg: "#E0F2FE" },
  ];

  return (
    <div data-testid="page-permissoes" style={{ minHeight: "100vh", background: "#F9FAFB" }}>
      <header style={{ background: "linear-gradient(135deg, #1e3a5f, #2563EB)", padding: "20px 24px", color: "#fff", display: "flex", alignItems: "center", gap: 16 }}>
        <Link href="/admin/dashboard">
          <button data-testid="button-voltar" style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: "8px 14px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 500 }}>
            <ArrowLeft style={{ width: 18, height: 18 }} /> Voltar
          </button>
        </Link>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}>
            <Shield style={{ width: 28, height: 28 }} /> Permissões e Acesso
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, opacity: 0.85 }}>Gerencie roles e nível de acesso dos usuários</p>
        </div>
      </header>

      <div style={{ padding: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 24 }}>
          {statsCards.map((card) => (
            <div key={card.label} style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: card.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Shield style={{ width: 20, height: 20, color: card.color }} />
                </div>
                <div>
                  <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>{card.label}</p>
                  <p style={{ fontSize: 22, fontWeight: 700, color: card.color, margin: 0 }} data-testid={`stat-${card.label.toLowerCase().replace(/\s+/g, "-")}`}>{card.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 240, position: "relative" }}>
            <Search style={{ position: "absolute", left: 12, top: 11, width: 16, height: 16, color: "#9ca3af" }} />
            <input
              data-testid="input-busca-usuarios"
              value={busca}
              onChange={(e) => { setBusca(e.target.value); setPagina(0); }}
              placeholder="Buscar por nome ou e-mail..."
              style={{ ...inputStyle, paddingLeft: 36 }}
            />
          </div>
          <select
            data-testid="select-filtro-role"
            value={filtroRole}
            onChange={(e) => { setFiltroRole(e.target.value); setPagina(0); }}
            style={{ ...inputStyle, width: "auto", minWidth: 150 }}
          >
            <option value="todos">Todos os roles</option>
            <option value="admin">Administrador</option>
            <option value="LIDER">Líder</option>
            <option value="cliente">Cliente</option>
          </select>
          <select
            data-testid="select-filtro-ativo"
            value={filtroAtivo}
            onChange={(e) => { setFiltroAtivo(e.target.value); setPagina(0); }}
            style={{ ...inputStyle, width: "auto", minWidth: 140 }}
          >
            <option value="todos">Todos os status</option>
            <option value="ativo">Ativos</option>
            <option value="inativo">Inativos</option>
          </select>
        </div>

        <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>{filtrados.length} usuário{filtrados.length !== 1 ? "s" : ""} encontrado{filtrados.length !== 1 ? "s" : ""}</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table data-testid="table-usuarios" style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Usuário", "E-mail", "Role", "Status", "Último Acesso", "Ações"].map((col) => (
                    <th key={col} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #e5e7eb" }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginados.map((u) => {
                  const roleInfo = ROLE_CONFIG[u.role];
                  return (
                    <tr key={u.id} data-testid={`row-usuario-${u.id}`} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: u.ativo ? "#DBEAFE" : "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: u.ativo ? "#2563EB" : "#9ca3af" }}>{u.nome[0]}</span>
                          </div>
                          <span style={{ fontWeight: 500, color: u.ativo ? "#111827" : "#9ca3af" }}>{u.nome}</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#6b7280", fontSize: 13 }}>{u.email}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: roleInfo.bg, color: roleInfo.color }}>
                          {roleInfo.icon} {roleInfo.label}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <button
                          data-testid={`toggle-ativo-${u.id}`}
                          onClick={() => toggleAtivo(u.id)}
                          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: 0 }}
                        >
                          {u.ativo ? (
                            <><ToggleRight style={{ width: 28, height: 28, color: "#22c55e" }} /><span style={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}>Ativo</span></>
                          ) : (
                            <><ToggleLeft style={{ width: 28, height: 28, color: "#d1d5db" }} /><span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>Inativo</span></>
                          )}
                        </button>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#6b7280", fontSize: 13 }}>
                        {new Date(u.ultimoAcesso).toLocaleDateString("pt-BR")}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <button
                          data-testid={`button-editar-usuario-${u.id}`}
                          onClick={() => abrirEdicao(u)}
                          style={{ background: "none", border: "1px solid #d1d5db", borderRadius: 6, padding: "4px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#2563EB" }}
                        >
                          <Edit style={{ width: 14, height: 14 }} /> Editar
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {paginados.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>Nenhum usuário encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {totalPaginas > 1 && (
            <div style={{ padding: "12px 20px", display: "flex", justifyContent: "center", gap: 8, borderTop: "1px solid #e5e7eb" }}>
              {Array.from({ length: totalPaginas }).map((_, i) => (
                <button
                  key={i}
                  data-testid={`button-pagina-${i}`}
                  onClick={() => setPagina(i)}
                  style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #d1d5db", background: pagina === i ? "#2563EB" : "#fff", color: pagina === i ? "#fff" : "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {editando && (
        <div
          data-testid="modal-editar-permissao"
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
          onClick={(e) => { if (e.target === e.currentTarget) fecharEdicao(); }}
        >
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: 440, maxWidth: "90vw", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e3a5f", margin: 0 }}>Editar Permissões</h3>
              <button data-testid="button-fechar-modal" onClick={fecharEdicao} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X style={{ width: 20, height: 20, color: "#9ca3af" }} />
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, background: "#F9FAFB", borderRadius: 10, marginBottom: 24 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: "#2563EB" }}>{editando.nome[0]}</span>
              </div>
              <div>
                <p style={{ fontWeight: 600, color: "#111827", margin: 0 }}>{editando.nome}</p>
                <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{editando.email}</p>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8, display: "block" }}>Role / Nível de Acesso</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(["admin", "LIDER", "cliente"] as Role[]).map((r) => {
                  const cfg = ROLE_CONFIG[r];
                  return (
                    <label
                      key={r}
                      data-testid={`radio-role-${r}`}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, border: `2px solid ${editRole === r ? "#2563EB" : "#e5e7eb"}`, background: editRole === r ? "#EFF6FF" : "#fff", cursor: "pointer" }}
                    >
                      <input type="radio" name="role" value={r} checked={editRole === r} onChange={() => setEditRole(r)} style={{ accentColor: "#2563EB" }} />
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 600, fontSize: 14, color: cfg.color }}>
                        {cfg.icon} {cfg.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8, display: "block" }}>Status da Conta</label>
              <label
                data-testid="toggle-ativo-modal"
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, border: `2px solid ${editAtivo ? "#22c55e" : "#e5e7eb"}`, background: editAtivo ? "#F0FDF4" : "#F9FAFB", cursor: "pointer" }}
              >
                <input type="checkbox" checked={editAtivo} onChange={(e) => setEditAtivo(e.target.checked)} style={{ width: 18, height: 18, accentColor: "#22c55e" }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: editAtivo ? "#16a34a" : "#9ca3af" }}>
                  {editAtivo ? "Conta Ativa" : "Conta Inativa"}
                </span>
              </label>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                data-testid="button-cancelar-edicao"
                onClick={fecharEdicao}
                style={{ flex: 1, padding: "12px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", color: "#6b7280", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
              >
                Cancelar
              </button>
              <button
                data-testid="button-salvar-permissao"
                onClick={salvarEdicao}
                disabled={salvando}
                style={{ flex: 1, padding: "12px", borderRadius: 8, border: "none", background: salvando ? "#93c5fd" : "linear-gradient(135deg, #1e3a5f, #2563EB)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: salvando ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
              >
                {salvando ? <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> : <Save style={{ width: 16, height: 16 }} />}
                {salvando ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
