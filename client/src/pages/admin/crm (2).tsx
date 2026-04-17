import { useState } from "react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  UserCheck,
  Search,
  Phone,
  Mail,
  MessageSquare,
  Video,
  Send,
  Clock,
  User,
  Plus,
} from "lucide-react";

interface Interacao {
  id: string;
  data: string;
  tipo: "Ligação" | "WhatsApp" | "E-mail" | "Reunião";
  texto: string;
}

interface ClienteCRM {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  status: "ativo" | "lead" | "inativo";
  ultimoContato: string;
  interacoes: Interacao[];
}

const tipoIcons: Record<string, React.ReactNode> = {
  "Ligação": <Phone style={{ width: 14, height: 14 }} />,
  "WhatsApp": <MessageSquare style={{ width: 14, height: 14 }} />,
  "E-mail": <Mail style={{ width: 14, height: 14 }} />,
  "Reunião": <Video style={{ width: 14, height: 14 }} />,
};

const tipoColors: Record<string, string> = {
  "Ligação": "#2563EB",
  "WhatsApp": "#22C55E",
  "E-mail": "#F57C00",
  "Reunião": "#8B5CF6",
};

const mockCRM: ClienteCRM[] = [
  {
    id: "1", nome: "João Silva", email: "joao@email.com", telefone: "(62) 99999-1234", status: "ativo", ultimoContato: "2026-03-12",
    interacoes: [
      { id: "i1", data: "2026-03-12", tipo: "WhatsApp", texto: "Cliente confirmou interesse na excursão de abril para Caldas Novas." },
      { id: "i2", data: "2026-03-10", tipo: "Ligação", texto: "Ligação de follow-up. Cliente solicitou orçamento para grupo de 8 pessoas." },
      { id: "i3", data: "2026-03-05", tipo: "E-mail", texto: "Enviado catálogo de excursões e promoções do mês." },
    ],
  },
  {
    id: "2", nome: "Maria Santos", email: "maria@email.com", telefone: "(62) 99999-5678", status: "ativo", ultimoContato: "2026-03-11",
    interacoes: [
      { id: "i4", data: "2026-03-11", tipo: "Reunião", texto: "Reunião presencial para fechar pacote família (4 pessoas)." },
      { id: "i5", data: "2026-03-08", tipo: "WhatsApp", texto: "Enviado link de pagamento PIX." },
    ],
  },
  {
    id: "3", nome: "Pedro Costa", email: "pedro@email.com", telefone: "(34) 99999-9012", status: "lead", ultimoContato: "2026-03-09",
    interacoes: [
      { id: "i6", data: "2026-03-09", tipo: "E-mail", texto: "Lead veio pelo site. Demonstrou interesse em excursões para Rio Quente." },
    ],
  },
  {
    id: "4", nome: "Ana Oliveira", email: "ana@email.com", telefone: "(11) 99999-3456", status: "ativo", ultimoContato: "2026-03-13",
    interacoes: [
      { id: "i7", data: "2026-03-13", tipo: "Ligação", texto: "Cliente ligou para alterar datas da reserva RSV-2026-042." },
      { id: "i8", data: "2026-03-07", tipo: "WhatsApp", texto: "Confirmação de pagamento recebida." },
      { id: "i9", data: "2026-03-01", tipo: "E-mail", texto: "Enviado voucher de reserva por e-mail." },
      { id: "i10", data: "2026-02-25", tipo: "Reunião", texto: "Primeira reunião — apresentação dos pacotes disponíveis." },
    ],
  },
  {
    id: "5", nome: "Carlos Mendes", email: "carlos@email.com", telefone: "(61) 99999-7890", status: "inativo", ultimoContato: "2025-12-20",
    interacoes: [
      { id: "i11", data: "2025-12-20", tipo: "E-mail", texto: "Tentativa de reativação — enviado promoção de Natal." },
    ],
  },
  {
    id: "6", nome: "Fernanda Lima", email: "fernanda@email.com", telefone: "(21) 99999-2345", status: "lead", ultimoContato: "2026-03-14",
    interacoes: [
      { id: "i12", data: "2026-03-14", tipo: "WhatsApp", texto: "Novo lead via Instagram. Pediu informações sobre Hot Park." },
    ],
  },
];

export default function CRMPage() {
  const { toast } = useToast();
  const [clientes, setClientes] = useState<ClienteCRM[]>(mockCRM);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [selecionadoId, setSelecionadoId] = useState<string>("1");
  const [novaInteracao, setNovaInteracao] = useState({ tipo: "WhatsApp" as Interacao["tipo"], texto: "" });

  const filtrados = clientes.filter((c) => {
    const matchBusca = c.nome.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === "todos" || c.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  const selecionado = clientes.find((c) => c.id === selecionadoId);

  const handleAddInteracao = () => {
    if (!novaInteracao.texto.trim()) {
      toast({ title: "Texto obrigatório", description: "Escreva uma nota sobre a interação.", variant: "destructive" });
      return;
    }
    const newI: Interacao = {
      id: `i${Date.now()}`,
      data: new Date().toISOString().split("T")[0],
      tipo: novaInteracao.tipo,
      texto: novaInteracao.texto.trim(),
    };
    setClientes(clientes.map((c) =>
      c.id === selecionadoId
        ? { ...c, interacoes: [newI, ...c.interacoes], ultimoContato: newI.data }
        : c
    ));
    setNovaInteracao({ tipo: "WhatsApp", texto: "" });
    toast({ title: "Interação registrada!", description: `${newI.tipo} adicionada ao histórico.` });
  };

  const statusColors: Record<string, { bg: string; color: string; dot: string }> = {
    ativo: { bg: "#dcfce7", color: "#166534", dot: "#22C55E" },
    lead: { bg: "#fef9c3", color: "#854d0e", dot: "#F59E0B" },
    inativo: { bg: "#f3f4f6", color: "#6b7280", dot: "#9CA3AF" },
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box",
  };

  return (
    <div data-testid="page-crm" style={{ minHeight: "100vh", background: "#F9FAFB" }}>
      <header style={{ background: "linear-gradient(135deg, #1e3a5f, #2563EB)", padding: "20px 24px", color: "#fff", display: "flex", alignItems: "center", gap: 16 }}>
        <Link href="/admin/dashboard">
          <button data-testid="button-voltar" style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: "8px 14px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 500 }}>
            <ArrowLeft style={{ width: 18, height: 18 }} /> Voltar
          </button>
        </Link>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}>
            <UserCheck style={{ width: 28, height: 28 }} /> CRM — Atendimento
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, opacity: 0.85 }}>Sistema de gestão de relacionamento com clientes</p>
        </div>
      </header>

      <div style={{ display: "flex", height: "calc(100vh - 88px)" }}>
        <div style={{ width: 340, borderRight: "1px solid #e5e7eb", background: "#fff", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: 16, borderBottom: "1px solid #e5e7eb" }}>
            <div style={{ position: "relative", marginBottom: 10 }}>
              <Search style={{ position: "absolute", left: 10, top: 10, width: 16, height: 16, color: "#9ca3af" }} />
              <input data-testid="input-busca-crm" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar cliente..." style={{ ...inputStyle, paddingLeft: 34 }} />
            </div>
            <select data-testid="select-filtro-crm" value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} style={{ ...inputStyle, fontSize: 13 }}>
              <option value="todos">Todos</option>
              <option value="ativo">Ativo</option>
              <option value="lead">Lead</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
          <div style={{ flex: 1, overflow: "auto" }}>
            {filtrados.map((c) => {
              const sc = statusColors[c.status] ?? statusColors.inativo;
              const isSelected = c.id === selecionadoId;
              return (
                <button
                  key={c.id}
                  data-testid={`crm-cliente-${c.id}`}
                  onClick={() => setSelecionadoId(c.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "14px 16px",
                    border: "none", borderBottom: "1px solid #f3f4f6", cursor: "pointer", textAlign: "left",
                    background: isSelected ? "#EFF6FF" : "transparent",
                  }}
                >
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: sc.dot, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: isSelected ? 700 : 500, color: "#1f2937", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.nome}</p>
                    <p style={{ fontSize: 12, color: "#9ca3af", margin: "2px 0 0" }}>{c.interacoes.length} interações</p>
                  </div>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 10, background: sc.bg, color: sc.color, fontWeight: 600 }}>
                    {c.status === "ativo" ? "Ativo" : c.status === "lead" ? "Lead" : "Inativo"}
                  </span>
                </button>
              );
            })}
            {filtrados.length === 0 && (
              <p style={{ padding: 20, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>Nenhum cliente encontrado.</p>
            )}
          </div>
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
          {selecionado ? (
            <>
              <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <h2 data-testid="crm-nome-selecionado" style={{ fontSize: 22, fontWeight: 700, color: "#1e3a5f", margin: 0 }}>{selecionado.nome}</h2>
                    <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#6b7280" }}><Mail style={{ width: 14, height: 14 }} /> {selecionado.email}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#6b7280" }}><Phone style={{ width: 14, height: 14 }} /> {selecionado.telefone}</span>
                    </div>
                  </div>
                  <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: statusColors[selecionado.status]?.bg, color: statusColors[selecionado.status]?.color }}>
                    {selecionado.status === "ativo" ? "Ativo" : selecionado.status === "lead" ? "Lead" : "Inativo"}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                  <div style={{ padding: "12px 20px", background: "#f9fafb", borderRadius: 10, border: "1px solid #e5e7eb" }}>
                    <span style={{ fontSize: 12, color: "#6b7280" }}>Último contato</span>
                    <p style={{ fontSize: 16, fontWeight: 600, color: "#1f2937", margin: "4px 0 0" }}>{new Date(selecionado.ultimoContato).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <div style={{ padding: "12px 20px", background: "#f9fafb", borderRadius: 10, border: "1px solid #e5e7eb" }}>
                    <span style={{ fontSize: 12, color: "#6b7280" }}>Total de interações</span>
                    <p style={{ fontSize: 16, fontWeight: 600, color: "#2563EB", margin: "4px 0 0" }}>{selecionado.interacoes.length}</p>
                  </div>
                </div>
              </div>

              <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: 20, border: "1px solid #DBEAFE" }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e3a5f", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 6 }}>
                  <Plus style={{ width: 16, height: 16 }} /> Nova Interação
                </h3>
                <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  {(["Ligação", "WhatsApp", "E-mail", "Reunião"] as const).map((tipo) => (
                    <button
                      key={tipo}
                      data-testid={`button-tipo-${tipo.toLowerCase().replace("ã", "a")}`}
                      onClick={() => setNovaInteracao({ ...novaInteracao, tipo })}
                      style={{
                        padding: "6px 14px", borderRadius: 20, border: "1px solid",
                        borderColor: novaInteracao.tipo === tipo ? tipoColors[tipo] : "#d1d5db",
                        background: novaInteracao.tipo === tipo ? tipoColors[tipo] : "transparent",
                        color: novaInteracao.tipo === tipo ? "#fff" : "#374151",
                        fontSize: 12, fontWeight: 600, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 4,
                      }}
                    >
                      {tipoIcons[tipo]} {tipo}
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <textarea
                    data-testid="input-nova-interacao"
                    value={novaInteracao.texto}
                    onChange={(e) => setNovaInteracao({ ...novaInteracao, texto: e.target.value })}
                    placeholder="Descreva a interação com o cliente..."
                    rows={2}
                    style={{ ...inputStyle, flex: 1, resize: "vertical" }}
                  />
                  <button
                    data-testid="button-enviar-interacao"
                    onClick={handleAddInteracao}
                    style={{
                      padding: "10px 18px", borderRadius: 8, border: "none",
                      background: "linear-gradient(135deg, #1e3a5f, #2563EB)",
                      color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, alignSelf: "flex-end",
                    }}
                  >
                    <Send style={{ width: 16, height: 16 }} /> Enviar
                  </button>
                </div>
              </div>

              <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e3a5f", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
                  <Clock style={{ width: 18, height: 18 }} /> Timeline de Interações
                </h3>
                <div style={{ position: "relative", paddingLeft: 24 }}>
                  <div style={{ position: "absolute", left: 7, top: 0, bottom: 0, width: 2, background: "#e5e7eb" }} />
                  {selecionado.interacoes.map((inter) => (
                    <div key={inter.id} data-testid={`interacao-${inter.id}`} style={{ position: "relative", marginBottom: 20, paddingLeft: 16 }}>
                      <div style={{
                        position: "absolute", left: -20, top: 4,
                        width: 16, height: 16, borderRadius: "50%",
                        background: tipoColors[inter.tipo] ?? "#9ca3af",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />
                      </div>
                      <div style={{ background: "#f9fafb", borderRadius: 10, padding: "12px 16px", border: "1px solid #e5e7eb" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: tipoColors[inter.tipo] }}>
                            {tipoIcons[inter.tipo]} {inter.tipo}
                          </span>
                          <span style={{ fontSize: 12, color: "#9ca3af" }}>{new Date(inter.data).toLocaleDateString("pt-BR")}</span>
                        </div>
                        <p style={{ fontSize: 14, color: "#374151", margin: 0, lineHeight: 1.5 }}>{inter.texto}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#9ca3af" }}>
              <div style={{ textAlign: "center" }}>
                <User style={{ width: 48, height: 48, marginBottom: 12 }} />
                <p style={{ fontSize: 16 }}>Selecione um cliente para ver detalhes</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
