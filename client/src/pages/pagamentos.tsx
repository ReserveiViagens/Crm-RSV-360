import { useState } from "react";
import { ArrowLeft, CreditCard, Home, Search, CalendarDays, User, TrendingUp, Clock, CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp, Filter, Download, type LucideIcon } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

type StatusPag = "pago" | "pendente" | "parcelado" | "cancelado";

type Transacao = {
  id: string;
  descricao: string;
  data: string;
  valor: number;
  parcelas?: number;
  parcelaAtual?: number;
  status: StatusPag;
  tipo: "reserva" | "ingresso" | "excursao" | "reembolso";
  referencia: string;
};

type BottomTab = {
  icon: LucideIcon;
  label: string;
  href: string;
  active: boolean;
};

const BOTTOM_TABS: BottomTab[] = [
  { icon: Home, label: "Home", href: "/", active: false },
  { icon: Search, label: "Busca", href: "/catalogo-excursoes", active: false },
  { icon: CalendarDays, label: "Reservas", href: "/minhas-reservas", active: false },
  { icon: User, label: "Perfil", href: "/perfil", active: false },
];

const MOCK_TRANSACOES: Transacao[] = [
  {
    id: "TXN-2024-001",
    descricao: "Hot Park - Rio Quente (2 ingressos)",
    data: "2024-03-15",
    valor: 299.80,
    status: "pago",
    tipo: "ingresso",
    referencia: "RSV-001",
  },
  {
    id: "TXN-2024-002",
    descricao: "Excursão Caldas Novas + Hospedagem 3 noites",
    data: "2024-03-10",
    valor: 1899.00,
    parcelas: 6,
    parcelaAtual: 2,
    status: "parcelado",
    tipo: "excursao",
    referencia: "RSV-002",
  },
  {
    id: "TXN-2024-003",
    descricao: "Resort Termas Paradise - 2 noites",
    data: "2024-02-28",
    valor: 1199.00,
    parcelas: 3,
    parcelaAtual: 3,
    status: "pago",
    tipo: "reserva",
    referencia: "RSV-003",
  },
  {
    id: "TXN-2024-004",
    descricao: "DiRoma Acqua Park - Família (4 ingressos)",
    data: "2024-02-20",
    valor: 559.60,
    status: "pendente",
    tipo: "ingresso",
    referencia: "RSV-004",
  },
  {
    id: "TXN-2024-005",
    descricao: "Reembolso - Cancelamento Pousada Recanto",
    data: "2024-02-10",
    valor: -480.00,
    status: "pago",
    tipo: "reembolso",
    referencia: "RSV-005",
  },
  {
    id: "TXN-2024-006",
    descricao: "Lagoa Quente Flat Hotel - 1 noite",
    data: "2024-01-22",
    valor: 649.00,
    status: "cancelado",
    tipo: "reserva",
    referencia: "RSV-006",
  },
  {
    id: "TXN-2024-007",
    descricao: "City Tour Caldas Novas - 2 pessoas",
    data: "2024-01-15",
    valor: 139.80,
    status: "pago",
    tipo: "excursao",
    referencia: "RSV-007",
  },
];

const STATUS_CONFIG: Record<StatusPag, { label: string; cor: string; bg: string; icon: LucideIcon }> = {
  pago: { label: "Pago", cor: "#22C55E", bg: "#F0FDF4", icon: CheckCircle2 },
  pendente: { label: "Pendente", cor: "#F57C00", bg: "#FFF7ED", icon: Clock },
  parcelado: { label: "Parcelado", cor: "#2563EB", bg: "#EFF6FF", icon: CreditCard },
  cancelado: { label: "Cancelado", cor: "#EF4444", bg: "#FEF2F2", icon: XCircle },
};

const TIPO_LABEL: Record<string, string> = {
  reserva: "Hospedagem",
  ingresso: "Ingresso",
  excursao: "Excursão",
  reembolso: "Reembolso",
};

const fmt = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Math.abs(v));

const fmtData = (d: string) => {
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
};

const PERIODOS = ["Todos", "Últimos 30 dias", "Últimos 3 meses", "2024", "2023"];
const STATUS_FILTROS = ["Todos", "pago", "pendente", "parcelado", "cancelado"] as const;

export default function PagamentosPage() {
  const { user } = useAuth();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filtroStatus, setFiltroStatus] = useState<string>("Todos");
  const [filtroPeriodo, setFiltroPeriodo] = useState("Todos");
  const [showFiltros, setShowFiltros] = useState(false);

  const transacoesFiltradas = MOCK_TRANSACOES.filter((t) => {
    if (filtroStatus !== "Todos" && t.status !== filtroStatus) return false;
    const hoje = new Date();
    const data = new Date(t.data);
    if (filtroPeriodo === "Últimos 30 dias") {
      const limite = new Date();
      limite.setDate(hoje.getDate() - 30);
      if (data < limite) return false;
    }
    if (filtroPeriodo === "Últimos 3 meses") {
      const limite = new Date();
      limite.setMonth(hoje.getMonth() - 3);
      if (data < limite) return false;
    }
    if (filtroPeriodo === "2024" && !t.data.startsWith("2024")) return false;
    if (filtroPeriodo === "2023" && !t.data.startsWith("2023")) return false;
    return true;
  });

  const totalPago = MOCK_TRANSACOES.filter((t) => t.status === "pago" && t.valor > 0).reduce((a, t) => a + t.valor, 0);
  const totalPendente = MOCK_TRANSACOES.filter((t) => t.status === "pendente").reduce((a, t) => a + t.valor, 0);
  const totalParcelado = MOCK_TRANSACOES.filter((t) => t.status === "parcelado").reduce((a, t) => a + t.valor, 0);

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: "#F9FAFB", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <CreditCard style={{ width: 48, height: 48, color: "#D1D5DB", marginBottom: 16 }} />
        <p style={{ fontSize: 15, color: "#6B7280", marginBottom: 16 }}>Faça login para ver seus pagamentos</p>
        <Link href="/entrar">
          <button data-testid="button-entrar-pagamentos" style={{ padding: "12px 32px", borderRadius: 10, background: "linear-gradient(135deg, #1e3a5f, #2563EB)", color: "#fff", border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
            Entrar
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div data-testid="page-pagamentos" style={{ background: "#F9FAFB", minHeight: "100vh" }}>
      <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2563EB 100%)", padding: "16px 16px 24px", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <Link href="/perfil" style={{ color: "#fff", display: "flex" }}>
            <ArrowLeft style={{ width: 24, height: 24 }} data-testid="button-voltar-pagamentos" />
          </Link>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Meus Pagamentos</h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <div data-testid="card-total-pago" style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
            <TrendingUp style={{ width: 18, height: 18, margin: "0 auto 4px", color: "#86EFAC" }} />
            <div style={{ fontSize: 13, fontWeight: 700, color: "#86EFAC" }}>{fmt(totalPago)}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>Total pago</div>
          </div>
          <div data-testid="card-total-pendente" style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
            <Clock style={{ width: 18, height: 18, margin: "0 auto 4px", color: "#FCD34D" }} />
            <div style={{ fontSize: 13, fontWeight: 700, color: "#FCD34D" }}>{fmt(totalPendente)}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>Pendente</div>
          </div>
          <div data-testid="card-total-parcelado" style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
            <CreditCard style={{ width: 18, height: 18, margin: "0 auto 4px", color: "#93C5FD" }} />
            <div style={{ fontSize: 13, fontWeight: 700, color: "#93C5FD" }}>{fmt(totalParcelado)}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>Parcelado</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>
            {transacoesFiltradas.length} transaç{transacoesFiltradas.length !== 1 ? "ões" : "ão"}
          </span>
          <button
            data-testid="button-filtros"
            onClick={() => setShowFiltros(!showFiltros)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "1px solid #E5E7EB", background: showFiltros ? "#EFF6FF" : "#fff", color: showFiltros ? "#2563EB" : "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            <Filter style={{ width: 14, height: 14 }} />
            Filtros
            {showFiltros ? <ChevronUp style={{ width: 14, height: 14 }} /> : <ChevronDown style={{ width: 14, height: 14 }} />}
          </button>
        </div>

        {showFiltros && (
          <div data-testid="painel-filtros" style={{ background: "#fff", borderRadius: 14, padding: 16, marginBottom: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 8 }}>Período</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {PERIODOS.map((p) => (
                  <button
                    key={p}
                    data-testid={`filtro-periodo-${p}`}
                    onClick={() => setFiltroPeriodo(p)}
                    style={{
                      padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
                      background: filtroPeriodo === p ? "#2563EB" : "#F3F4F6",
                      color: filtroPeriodo === p ? "#fff" : "#374151",
                    }}
                  >{p}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 8 }}>Status</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {STATUS_FILTROS.map((s) => {
                  const cfg = s !== "Todos" ? STATUS_CONFIG[s as StatusPag] : null;
                  return (
                    <button
                      key={s}
                      data-testid={`filtro-status-${s}`}
                      onClick={() => setFiltroStatus(s)}
                      style={{
                        padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
                        background: filtroStatus === s ? (cfg?.cor ?? "#2563EB") : "#F3F4F6",
                        color: filtroStatus === s ? "#fff" : "#374151",
                      }}
                    >{cfg ? cfg.label : "Todos"}</button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: "0 16px 100px" }}>
        {transacoesFiltradas.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 20px" }}>
            <CreditCard style={{ width: 48, height: 48, color: "#D1D5DB", margin: "0 auto 12px" }} />
            <p style={{ fontSize: 14, fontWeight: 600, color: "#6B7280" }}>Nenhuma transação encontrada</p>
            <p style={{ fontSize: 12, color: "#9CA3AF" }}>Tente ajustar os filtros acima</p>
          </div>
        ) : (
          transacoesFiltradas.map((t) => {
            const cfg = STATUS_CONFIG[t.status];
            const StatusIcon = cfg.icon;
            const isExpanded = expandedId === t.id;
            const isReembolso = t.tipo === "reembolso";

            return (
              <div key={t.id} data-testid={`card-transacao-${t.id}`} style={{ background: "#fff", borderRadius: 14, marginBottom: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                <div
                  onClick={() => setExpandedId(isExpanded ? null : t.id)}
                  style={{ padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}
                  data-testid={`row-transacao-${t.id}`}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <StatusIcon style={{ width: 20, height: 20, color: cfg.cor }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#1F2937", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.descricao}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11, color: "#9CA3AF" }}>{fmtData(t.data)}</span>
                      <span style={{ fontSize: 10, fontWeight: 600, color: cfg.cor, background: cfg.bg, padding: "1px 7px", borderRadius: 6 }}>{cfg.label}</span>
                      <span style={{ fontSize: 10, color: "#9CA3AF", background: "#F3F4F6", padding: "1px 7px", borderRadius: 6 }}>{TIPO_LABEL[t.tipo]}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: isReembolso ? "#22C55E" : "#1F2937" }}>
                      {isReembolso ? "+" : ""}{fmt(t.valor)}
                    </div>
                    {isExpanded ? <ChevronUp style={{ width: 14, height: 14, color: "#9CA3AF", marginTop: 2 }} /> : <ChevronDown style={{ width: 14, height: 14, color: "#9CA3AF", marginTop: 2 }} />}
                  </div>
                </div>

                {isExpanded && (
                  <div data-testid={`detalhes-transacao-${t.id}`} style={{ padding: "0 16px 14px", borderTop: "1px solid #F3F4F6" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 12, color: "#6B7280" }}>ID da transação</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{t.id}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 12, color: "#6B7280" }}>Reserva</span>
                        <Link
                          href={`/minhas-reservas?ref=${t.referencia}`}
                          data-testid={`link-reserva-${t.id}`}
                          style={{ fontSize: 12, fontWeight: 600, color: "#2563EB", textDecoration: "underline" }}
                        >
                          {t.referencia}
                        </Link>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 12, color: "#6B7280" }}>Data</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{fmtData(t.data)}</span>
                      </div>
                      {t.parcelas && (
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 12, color: "#6B7280" }}>Parcelamento</span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
                            {t.parcelaAtual}x de {t.parcelas}x ({fmt(t.valor / t.parcelas)}/mês)
                          </span>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 12, color: "#6B7280" }}>Valor total</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: isReembolso ? "#22C55E" : "#1F2937" }}>
                          {isReembolso ? "+" : ""}{fmt(t.valor)}
                        </span>
                      </div>
                    </div>
                    <button
                      data-testid={`button-comprovante-${t.id}`}
                      style={{ marginTop: 12, width: "100%", padding: "9px 0", borderRadius: 8, border: "1px solid #E5E7EB", background: "#F9FAFB", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                    >
                      <Download style={{ width: 14, height: 14 }} />
                      Baixar comprovante
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: 480, margin: "0 auto", background: "#fff", borderTop: "1px solid #E5E7EB", display: "flex", padding: "8px 0 12px", zIndex: 30 }}>
        {BOTTOM_TABS.map((tab, i) => (
          <Link key={i} href={tab.href} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", gap: 2 }}>
            <tab.icon style={{ width: 22, height: 22, color: tab.active ? "#2563EB" : "#9CA3AF" }} />
            <span style={{ fontSize: 10, fontWeight: tab.active ? 700 : 500, color: tab.active ? "#2563EB" : "#9CA3AF" }}>{tab.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
