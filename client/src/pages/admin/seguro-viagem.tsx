import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  Shield,
  Heart,
  Plane,
  Briefcase,
  XCircle,
  AlertTriangle,
  Users,
  Calculator,
  FileCheck,
  CheckCircle,
  Clock,
  Ban,
} from "lucide-react";

interface Apolice {
  id: string;
  passageiro: string;
  numeroApolice: string;
  seguradora: string;
  vigenciaInicio: string;
  vigenciaFim: string;
  cobertura: string;
  status: "ativa" | "expirada" | "pendente";
}

const mockApolices: Apolice[] = [
  { id: "1", passageiro: "João Silva", numeroApolice: "APL-2026-38291", seguradora: "GTA", vigenciaInicio: "2026-03-15", vigenciaFim: "2026-03-22", cobertura: "Completa", status: "ativa" },
  { id: "2", passageiro: "Maria Santos", numeroApolice: "APL-2026-38292", seguradora: "GTA", vigenciaInicio: "2026-03-15", vigenciaFim: "2026-03-22", cobertura: "Completa", status: "ativa" },
  { id: "3", passageiro: "Pedro Costa", numeroApolice: "APL-2026-38293", seguradora: "GTA", vigenciaInicio: "2026-04-01", vigenciaFim: "2026-04-08", cobertura: "Básica", status: "pendente" },
  { id: "4", passageiro: "Ana Oliveira", numeroApolice: "APL-2026-38294", seguradora: "GTA", vigenciaInicio: "2026-02-10", vigenciaFim: "2026-02-17", cobertura: "Completa", status: "expirada" },
  { id: "5", passageiro: "Carlos Mendes", numeroApolice: "APL-2026-38295", seguradora: "Universal Assistance", vigenciaInicio: "2026-03-20", vigenciaFim: "2026-03-27", cobertura: "Completa", status: "ativa" },
  { id: "6", passageiro: "Fernanda Lima", numeroApolice: "APL-2026-38296", seguradora: "GTA", vigenciaInicio: "2026-01-05", vigenciaFim: "2026-01-12", cobertura: "Básica", status: "expirada" },
  { id: "7", passageiro: "Roberto Alves", numeroApolice: "APL-2026-38297", seguradora: "Universal Assistance", vigenciaInicio: "2026-04-10", vigenciaFim: "2026-04-17", cobertura: "Completa", status: "pendente" },
];

const coberturas = [
  { titulo: "Assistência Médica", valor: "R$ 30.000", icon: Heart, cor: "#EF4444", descricao: "Cobertura para emergências médicas e hospitalares durante toda a viagem" },
  { titulo: "Repatriamento Sanitário", valor: "Incluso", icon: Plane, cor: "#3B82F6", descricao: "Transporte de retorno em caso de impossibilidade de continuação da viagem" },
  { titulo: "Bagagem", valor: "R$ 2.000", icon: Briefcase, cor: "#F59E0B", descricao: "Indenização por extravio, roubo ou danos à bagagem despachada" },
  { titulo: "Cancelamento", valor: "R$ 5.000", icon: XCircle, cor: "#8B5CF6", descricao: "Reembolso de despesas em caso de cancelamento por motivo justificado" },
  { titulo: "Morte Acidental", valor: "R$ 50.000", icon: Shield, cor: "#1e3a5f", descricao: "Indenização aos beneficiários em caso de morte acidental durante a viagem" },
];

const exclusoes = [
  "Lesões ou condições médicas pré-existentes não declaradas",
  "Prática de esportes radicais ou de risco sem contratação de cobertura adicional",
  "Sinistros decorrentes de estado de embriaguez ou uso de substâncias ilícitas",
  "Danos causados por guerras, terrorismo ou catástrofes nucleares",
  "Tratamentos estéticos ou eletivos não emergenciais",
];

export default function SeguroViagem() {
  const [qtdPassageiros, setQtdPassageiros] = useState(1);
  const [emitindo, setEmitindo] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const custoPorPessoa = qtdPassageiros >= 20 ? 12 : qtdPassageiros >= 10 ? 15 : qtdPassageiros >= 5 ? 18 : 25;
  const custoTotal = custoPorPessoa * qtdPassageiros;

  const apolicesAtivas = mockApolices.filter(a => a.status === "ativa").length;
  const custoMedio = 18.5;
  const totalInvestido = 1480;

  const handleEmitirGrupo = () => {
    setEmitindo(true);
    setTimeout(() => {
      setEmitindo(false);
      const inicio = 38300;
      const fim = inicio + qtdPassageiros - 1;
      setToastMsg(`${qtdPassageiros} apólices emitidas! Nº APL-2026-${inicio} a APL-2026-${fim}`);
      setTimeout(() => setToastMsg(""), 5000);
    }, 2000);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "ativa": return { background: "#DCFCE7", color: "#166534" };
      case "pendente": return { background: "#FEF9C3", color: "#854D0E" };
      case "expirada": return { background: "#FEE2E2", color: "#991B1B" };
      default: return { background: "#F3F4F6", color: "#374151" };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ativa": return "Ativa";
      case "pendente": return "Pendente";
      case "expirada": return "Expirada";
      default: return status;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB" }} data-testid="page-seguro-viagem">
      <header style={{ background: "linear-gradient(135deg, #1e3a5f, #2563EB)", padding: "20px 24px", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <Link href="/admin/dashboard" data-testid="link-voltar-dashboard">
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#fff", cursor: "pointer", textDecoration: "none" }}>
              <ArrowLeft style={{ width: 20, height: 20 }} />
              <span style={{ fontSize: "14px" }}>Voltar</span>
            </div>
          </Link>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: "24px", fontWeight: 700, margin: 0 }} data-testid="text-page-title">Seguro de Viagem</h1>
            <p style={{ fontSize: "14px", opacity: 0.85, margin: "4px 0 0" }}>Gestão de apólices e coberturas do grupo</p>
          </div>
        </div>
      </header>

      {toastMsg && (
        <div data-testid="toast-emissao" style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, background: "#22C55E", color: "#fff", padding: "16px 24px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", maxWidth: 400 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CheckCircle style={{ width: 20, height: 20 }} />
            {toastMsg}
          </div>
        </div>
      )}

      <div style={{ padding: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          <div style={{ background: "#fff", borderRadius: "8px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} data-testid="metric-apolices-ativas">
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ background: "#DCFCE7", borderRadius: "8px", padding: "10px" }}>
                <FileCheck style={{ width: 24, height: 24, color: "#16A34A" }} />
              </div>
              <div>
                <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>Apólices Ativas</p>
                <p style={{ fontSize: "28px", fontWeight: 700, color: "#111827", margin: 0 }}>{apolicesAtivas}</p>
              </div>
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: "8px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} data-testid="metric-custo-medio">
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ background: "#DBEAFE", borderRadius: "8px", padding: "10px" }}>
                <Calculator style={{ width: 24, height: 24, color: "#2563EB" }} />
              </div>
              <div>
                <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>Custo Médio</p>
                <p style={{ fontSize: "28px", fontWeight: 700, color: "#111827", margin: 0 }}>R$ {custoMedio.toFixed(2).replace(".", ",")}</p>
              </div>
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: "8px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} data-testid="metric-total-investido">
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ background: "#FEF3C7", borderRadius: "8px", padding: "10px" }}>
                <Shield style={{ width: 24, height: 24, color: "#D97706" }} />
              </div>
              <div>
                <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>Total Investido</p>
                <p style={{ fontSize: "28px", fontWeight: 700, color: "#111827", margin: 0 }}>R$ {totalInvestido.toLocaleString("pt-BR")}</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "32px" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #E5E7EB" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#111827", margin: 0 }} data-testid="text-section-apolices">Apólices Ativas</h2>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }} data-testid="table-apolices">
              <thead>
                <tr style={{ background: "#F9FAFB" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Passageiro</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Nº Apólice</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Seguradora</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Vigência</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Cobertura</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#6B7280", textTransform: "uppercase" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockApolices.map((apolice) => (
                  <tr key={apolice.id} style={{ borderBottom: "1px solid #F3F4F6" }} data-testid={`row-apolice-${apolice.id}`}>
                    <td style={{ padding: "14px 16px", fontSize: "14px", fontWeight: 500, color: "#111827" }}>{apolice.passageiro}</td>
                    <td style={{ padding: "14px 16px", fontSize: "14px", color: "#374151", fontFamily: "monospace" }}>{apolice.numeroApolice}</td>
                    <td style={{ padding: "14px 16px", fontSize: "14px", color: "#374151" }}>{apolice.seguradora}</td>
                    <td style={{ padding: "14px 16px", fontSize: "14px", color: "#374151" }}>
                      {new Date(apolice.vigenciaInicio).toLocaleDateString("pt-BR")} — {new Date(apolice.vigenciaFim).toLocaleDateString("pt-BR")}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "14px", color: "#374151" }}>{apolice.cobertura}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{ ...getStatusStyle(apolice.status), padding: "4px 12px", borderRadius: "9999px", fontSize: "12px", fontWeight: 600 }}
                        data-testid={`status-apolice-${apolice.id}`}
                      >
                        {getStatusLabel(apolice.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", padding: "24px", marginBottom: "32px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#111827", marginBottom: "20px" }} data-testid="text-section-coberturas">Coberturas do Plano</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            {coberturas.map((cob, idx) => {
              const Icon = cob.icon;
              return (
                <div
                  key={idx}
                  style={{ border: "1px solid #E5E7EB", borderRadius: "8px", padding: "20px", textAlign: "center" }}
                  data-testid={`card-cobertura-${idx}`}
                >
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: `${cob.cor}15`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                    <Icon style={{ width: 24, height: 24, color: cob.cor }} />
                  </div>
                  <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#111827", margin: "0 0 4px" }}>{cob.titulo}</h3>
                  <p style={{ fontSize: "20px", fontWeight: 700, color: cob.cor, margin: "0 0 8px" }}>{cob.valor}</p>
                  <p style={{ fontSize: "13px", color: "#6B7280", margin: 0, lineHeight: 1.4 }}>{cob.descricao}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", padding: "24px", marginBottom: "32px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#111827", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }} data-testid="text-section-exclusoes">
            <Ban style={{ width: 20, height: 20, color: "#EF4444" }} />
            Exclusões
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {exclusoes.map((exc, idx) => (
              <div
                key={idx}
                style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px 16px", background: "#FEF2F2", borderRadius: "8px", border: "1px solid #FECACA" }}
                data-testid={`exclusao-${idx}`}
              >
                <AlertTriangle style={{ width: 18, height: 18, color: "#EF4444", flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: "14px", color: "#991B1B" }}>{exc}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", marginBottom: "32px" }}>
          <div style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", padding: "24px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#111827", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }} data-testid="text-section-simulador">
              <Calculator style={{ width: 20, height: 20, color: "#2563EB" }} />
              Simulador de Custo
            </h2>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#374151", marginBottom: "8px" }}>
                Quantidade de passageiros
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={qtdPassageiros}
                onChange={(e) => setQtdPassageiros(Math.max(1, parseInt(e.target.value) || 1))}
                style={{ width: "100%", padding: "10px 14px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "16px", outline: "none", boxSizing: "border-box" }}
                data-testid="input-qtd-passageiros"
              />
            </div>
            <div style={{ background: "#F0F9FF", borderRadius: "8px", padding: "16px", marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "14px", color: "#6B7280" }}>Custo por pessoa:</span>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#111827" }} data-testid="text-custo-pessoa">R$ {custoPorPessoa.toFixed(2).replace(".", ",")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "14px", color: "#6B7280" }}>Passageiros:</span>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#111827" }} data-testid="text-qtd-display">{qtdPassageiros}</span>
              </div>
              <div style={{ borderTop: "1px solid #BAE6FD", paddingTop: "8px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "16px", fontWeight: 600, color: "#1e3a5f" }}>Total:</span>
                <span style={{ fontSize: "20px", fontWeight: 700, color: "#2563EB" }} data-testid="text-custo-total">R$ {custoTotal.toFixed(2).replace(".", ",")}</span>
              </div>
            </div>
            <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "16px" }}>
              <p style={{ margin: "0 0 4px" }}>Descontos por volume:</p>
              <p style={{ margin: "0 0 2px" }}>1-4 pessoas: R$ 25,00/pessoa</p>
              <p style={{ margin: "0 0 2px" }}>5-9 pessoas: R$ 18,00/pessoa</p>
              <p style={{ margin: "0 0 2px" }}>10-19 pessoas: R$ 15,00/pessoa</p>
              <p style={{ margin: 0 }}>20+ pessoas: R$ 12,00/pessoa</p>
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#111827", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Users style={{ width: 20, height: 20, color: "#22C55E" }} />
                Emitir Apólice para Grupo
              </h2>
              <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.6, marginBottom: "16px" }}>
                Emita apólices de seguro viagem para todos os passageiros do grupo de uma só vez. As apólices serão geradas com numeração sequencial e enviadas por e-mail.
              </p>
              <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "8px", padding: "14px", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <CheckCircle style={{ width: 16, height: 16, color: "#16A34A" }} />
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "#166534" }}>Seguradora: GTA / Universal Assistance</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <CheckCircle style={{ width: 16, height: 16, color: "#16A34A" }} />
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "#166534" }}>Cobertura completa inclusa</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle style={{ width: 16, height: 16, color: "#16A34A" }} />
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "#166534" }}>Vigência conforme datas da excursão</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleEmitirGrupo}
              disabled={emitindo}
              style={{
                width: "100%",
                padding: "14px",
                background: emitindo ? "#9CA3AF" : "linear-gradient(135deg, #1e3a5f, #2563EB)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: emitindo ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              data-testid="button-emitir-grupo"
            >
              {emitindo ? (
                <>
                  <Clock style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} />
                  Emitindo apólices...
                </>
              ) : (
                <>
                  <FileCheck style={{ width: 18, height: 18 }} />
                  Emitir {qtdPassageiros} Apólice{qtdPassageiros > 1 ? "s" : ""} para o Grupo
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
