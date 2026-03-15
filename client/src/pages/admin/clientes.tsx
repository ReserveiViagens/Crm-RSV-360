import { useState } from "react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Users,
  Plus,
  Search,
  X,
  CheckCircle,
  Loader2,
  Phone,
  Mail,
  FileText,
  Calendar,
  Eye,
} from "lucide-react";

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  nascimento: string;
  status: "ativo" | "lead" | "inativo";
  reservas: number;
  ultimaReserva: string;
}

const mockClientes: Cliente[] = [
  { id: "1", nome: "João Silva", email: "joao@email.com", telefone: "(62) 99999-1234", cpf: "123.456.789-00", nascimento: "1985-03-15", status: "ativo", reservas: 5, ultimaReserva: "2026-02-20" },
  { id: "2", nome: "Maria Santos", email: "maria@email.com", telefone: "(62) 99999-5678", cpf: "234.567.890-11", nascimento: "1990-07-22", status: "ativo", reservas: 3, ultimaReserva: "2026-03-01" },
  { id: "3", nome: "Pedro Costa", email: "pedro@email.com", telefone: "(34) 99999-9012", cpf: "345.678.901-22", nascimento: "1978-11-08", status: "lead", reservas: 0, ultimaReserva: "—" },
  { id: "4", nome: "Ana Oliveira", email: "ana@email.com", telefone: "(11) 99999-3456", cpf: "456.789.012-33", nascimento: "1992-01-30", status: "ativo", reservas: 8, ultimaReserva: "2026-03-10" },
  { id: "5", nome: "Carlos Mendes", email: "carlos@email.com", telefone: "(61) 99999-7890", cpf: "567.890.123-44", nascimento: "1988-06-14", status: "inativo", reservas: 1, ultimaReserva: "2025-08-05" },
  { id: "6", nome: "Fernanda Lima", email: "fernanda@email.com", telefone: "(21) 99999-2345", cpf: "678.901.234-55", nascimento: "1995-09-25", status: "ativo", reservas: 4, ultimaReserva: "2026-02-28" },
  { id: "7", nome: "Ricardo Souza", email: "ricardo@email.com", telefone: "(62) 99999-6789", cpf: "789.012.345-66", nascimento: "1983-04-12", status: "lead", reservas: 0, ultimaReserva: "—" },
  { id: "8", nome: "Juliana Pereira", email: "juliana@email.com", telefone: "(62) 99999-0123", cpf: "890.123.456-77", nascimento: "1991-12-03", status: "ativo", reservas: 2, ultimaReserva: "2026-01-15" },
];

const PAGE_SIZE = 6;

export default function ClientesPage() {
  const { toast } = useToast();
  const [clientes, setClientes] = useState<Cliente[]>(mockClientes);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [pagina, setPagina] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detalheId, setDetalheId] = useState<string | null>(null);

  const [novoCliente, setNovoCliente] = useState({ nome: "", email: "", telefone: "", cpf: "", nascimento: "" });

  const filtrados = clientes.filter((c) => {
    const matchBusca = c.nome.toLowerCase().includes(busca.toLowerCase()) || c.cpf.includes(busca) || c.email.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === "todos" || c.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  const totalPaginas = Math.ceil(filtrados.length / PAGE_SIZE);
  const paginados = filtrados.slice(pagina * PAGE_SIZE, (pagina + 1) * PAGE_SIZE);

  const handleNovoCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoCliente.nome || !novoCliente.email || !novoCliente.telefone) {
      toast({ title: "Campos obrigatórios", description: "Preencha nome, e-mail e telefone.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    const novo: Cliente = {
      id: String(clientes.length + 1),
      ...novoCliente,
      status: "lead",
      reservas: 0,
      ultimaReserva: "—",
    };
    setClientes([novo, ...clientes]);
    setNovoCliente({ nome: "", email: "", telefone: "", cpf: "", nascimento: "" });
    setShowForm(false);
    setIsSubmitting(false);
    setPagina(0);
    toast({ title: "Cliente cadastrado!", description: `${novo.nome} adicionado com sucesso.` });
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { bg: string; color: string; label: string }> = {
      ativo: { bg: "#dcfce7", color: "#166534", label: "Ativo" },
      lead: { bg: "#fef9c3", color: "#854d0e", label: "Lead" },
      inativo: { bg: "#f3f4f6", color: "#6b7280", label: "Inativo" },
    };
    const s = map[status] ?? map.inativo;
    return (
      <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color }}>
        {s.label}
      </span>
    );
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4,
  };

  const detalhe = detalheId ? clientes.find((c) => c.id === detalheId) : null;

  return (
    <div data-testid="page-clientes" style={{ minHeight: "100vh", background: "#F9FAFB" }}>
      <header style={{ background: "linear-gradient(135deg, #1e3a5f, #2563EB)", padding: "20px 24px", color: "#fff", display: "flex", alignItems: "center", gap: 16 }}>
        <Link href="/admin/dashboard">
          <button data-testid="button-voltar" style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: "8px 14px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 500 }}>
            <ArrowLeft style={{ width: 18, height: 18 }} /> Voltar
          </button>
        </Link>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}>
            <Users style={{ width: 28, height: 28 }} /> Clientes
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, opacity: 0.85 }}>Cadastro e gerenciamento de clientes</p>
        </div>
        <button
          data-testid="button-novo-cliente"
          onClick={() => setShowForm(true)}
          style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, padding: "8px 16px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600 }}
        >
          <Plus style={{ width: 16, height: 16 }} /> Novo Cliente
        </button>
      </header>

      <div style={{ padding: 24 }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 250, position: "relative" }}>
            <Search style={{ position: "absolute", left: 12, top: 11, width: 16, height: 16, color: "#9ca3af" }} />
            <input
              data-testid="input-busca-clientes"
              value={busca}
              onChange={(e) => { setBusca(e.target.value); setPagina(0); }}
              placeholder="Buscar por nome, CPF ou e-mail..."
              style={{ ...inputStyle, paddingLeft: 36 }}
            />
          </div>
          <select
            data-testid="select-filtro-status"
            value={filtroStatus}
            onChange={(e) => { setFiltroStatus(e.target.value); setPagina(0); }}
            style={{ ...inputStyle, width: "auto", minWidth: 150 }}
          >
            <option value="todos">Todos os status</option>
            <option value="ativo">Ativo</option>
            <option value="lead">Lead</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>

        {showForm && (
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: 20, border: "2px solid #2563EB" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e3a5f", margin: 0 }}>Novo Cliente</h3>
              <button data-testid="button-fechar-form" onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X style={{ width: 20, height: 20, color: "#9ca3af" }} />
              </button>
            </div>
            <form onSubmit={handleNovoCliente} data-testid="form-novo-cliente">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
                <div>
                  <label style={labelStyle}>Nome *</label>
                  <input data-testid="input-novo-nome" value={novoCliente.nome} onChange={(e) => setNovoCliente({ ...novoCliente, nome: e.target.value })} placeholder="Nome completo" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}><Mail style={{ width: 14, height: 14 }} /> E-mail *</label>
                  <input data-testid="input-novo-email" type="email" value={novoCliente.email} onChange={(e) => setNovoCliente({ ...novoCliente, email: e.target.value })} placeholder="email@exemplo.com" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}><Phone style={{ width: 14, height: 14 }} /> Telefone *</label>
                  <input data-testid="input-novo-telefone" value={novoCliente.telefone} onChange={(e) => setNovoCliente({ ...novoCliente, telefone: e.target.value })} placeholder="(00) 00000-0000" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}><FileText style={{ width: 14, height: 14 }} /> CPF</label>
                  <input data-testid="input-novo-cpf" value={novoCliente.cpf} onChange={(e) => setNovoCliente({ ...novoCliente, cpf: e.target.value })} placeholder="000.000.000-00" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}><Calendar style={{ width: 14, height: 14 }} /> Data de Nascimento</label>
                  <input data-testid="input-novo-nascimento" type="date" value={novoCliente.nascimento} onChange={(e) => setNovoCliente({ ...novoCliente, nascimento: e.target.value })} style={inputStyle} />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
                <button type="button" data-testid="button-cancelar-novo" onClick={() => setShowForm(false)} style={{ padding: "10px 20px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", color: "#6b7280", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancelar</button>
                <button type="submit" data-testid="button-salvar-cliente" disabled={isSubmitting} style={{ padding: "10px 20px", borderRadius: 8, border: "none", background: isSubmitting ? "#93c5fd" : "linear-gradient(135deg, #1e3a5f, #2563EB)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: isSubmitting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  {isSubmitting ? <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> : <CheckCircle style={{ width: 16, height: 16 }} />}
                  Salvar
                </button>
              </div>
            </form>
          </div>
        )}

        <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>{filtrados.length} clientes encontrados</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table data-testid="table-clientes" style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Nome", "E-mail", "Telefone", "CPF", "Status", "Reservas", "Ações"].map((col) => (
                    <th key={col} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #e5e7eb" }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginados.map((c) => (
                  <tr key={c.id} data-testid={`row-cliente-${c.id}`} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 500, color: "#111827" }}>{c.nome}</td>
                    <td style={{ padding: "12px 16px", color: "#374151" }}>{c.email}</td>
                    <td style={{ padding: "12px 16px", color: "#374151" }}>{c.telefone}</td>
                    <td style={{ padding: "12px 16px", color: "#374151", fontFamily: "monospace" }}>{c.cpf}</td>
                    <td style={{ padding: "12px 16px" }}>{getStatusBadge(c.status)}</td>
                    <td style={{ padding: "12px 16px", color: "#374151", textAlign: "center" }}>{c.reservas}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <button data-testid={`button-ver-cliente-${c.id}`} onClick={() => setDetalheId(detalheId === c.id ? null : c.id)} style={{ background: "none", border: "1px solid #d1d5db", borderRadius: 6, padding: "4px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#2563EB" }}>
                        <Eye style={{ width: 14, height: 14 }} /> Ver
                      </button>
                    </td>
                  </tr>
                ))}
                {paginados.length === 0 && (
                  <tr><td colSpan={7} style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>Nenhum cliente encontrado.</td></tr>
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
                  style={{
                    padding: "6px 12px", borderRadius: 6, border: "1px solid #d1d5db",
                    background: pagina === i ? "#2563EB" : "#fff",
                    color: pagina === i ? "#fff" : "#374151",
                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                  }}
                >{i + 1}</button>
              ))}
            </div>
          )}
        </div>

        {detalhe && (
          <div data-testid={`detalhe-cliente-${detalhe.id}`} style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginTop: 20, border: "1px solid #DBEAFE" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e3a5f", margin: 0 }}>{detalhe.nome}</h3>
              {getStatusBadge(detalhe.status)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              <div><span style={{ fontSize: 12, color: "#6b7280" }}>E-mail</span><p style={{ fontWeight: 500, color: "#1f2937", margin: "4px 0 0" }}>{detalhe.email}</p></div>
              <div><span style={{ fontSize: 12, color: "#6b7280" }}>Telefone</span><p style={{ fontWeight: 500, color: "#1f2937", margin: "4px 0 0" }}>{detalhe.telefone}</p></div>
              <div><span style={{ fontSize: 12, color: "#6b7280" }}>CPF</span><p style={{ fontWeight: 500, color: "#1f2937", margin: "4px 0 0", fontFamily: "monospace" }}>{detalhe.cpf}</p></div>
              <div><span style={{ fontSize: 12, color: "#6b7280" }}>Nascimento</span><p style={{ fontWeight: 500, color: "#1f2937", margin: "4px 0 0" }}>{detalhe.nascimento ? new Date(detalhe.nascimento).toLocaleDateString("pt-BR") : "—"}</p></div>
              <div><span style={{ fontSize: 12, color: "#6b7280" }}>Total de Reservas</span><p style={{ fontWeight: 700, color: "#2563EB", margin: "4px 0 0", fontSize: 18 }}>{detalhe.reservas}</p></div>
              <div><span style={{ fontSize: 12, color: "#6b7280" }}>Última Reserva</span><p style={{ fontWeight: 500, color: "#1f2937", margin: "4px 0 0" }}>{detalhe.ultimaReserva !== "—" ? new Date(detalhe.ultimaReserva).toLocaleDateString("pt-BR") : "—"}</p></div>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
