import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  FileText,
  Users,
  Eye,
  Trash2,
  RefreshCw,
  Edit,
  ExternalLink,
  Lock,
  UserCheck,
  BarChart3
} from "lucide-react";

interface ComplianceItem {
  id: string;
  title: string;
  description: string;
  compliant: boolean;
}

interface TreatmentRecord {
  activity: string;
  dataCollected: string;
  legalBasis: string;
  sharing: string;
  retentionPeriod: string;
}

interface SubjectRequest {
  id: string;
  titular: string;
  type: "Acesso" | "Exclusão" | "Portabilidade" | "Correção";
  date: string;
  status: "Atendida" | "Pendente" | "Em análise";
}

export default function LGPDDashboard() {
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([
    { id: "1", title: "Política de Privacidade publicada", description: "Política de privacidade publicada e acessível no site conforme Art. 9º da LGPD", compliant: true },
    { id: "2", title: "DPO (Encarregado) definido", description: "Encarregado de Proteção de Dados nomeado e comunicado à ANPD conforme Art. 41", compliant: true },
    { id: "3", title: "Canal de Direitos dos Titulares", description: "Canal disponível para titulares exercerem seus direitos (acesso, exclusão, portabilidade)", compliant: true },
    { id: "4", title: "Consentimento coletado adequadamente", description: "Mecanismo de consentimento implementado com registro e possibilidade de revogação", compliant: false },
    { id: "5", title: "Registro de Tratamento de Dados", description: "Registro completo das atividades de tratamento conforme Art. 37", compliant: true },
    { id: "6", title: "Auditoria de Segurança realizada", description: "Última auditoria de segurança e privacidade realizada nos últimos 12 meses", compliant: false },
  ]);

  const treatmentRecords: TreatmentRecord[] = [
    { activity: "FNRH (Ficha Nacional de Registro de Hóspedes)", dataCollected: "Nome, CPF, endereço, telefone, e-mail", legalBasis: "Obrigação legal (Lei 11.771/2008)", sharing: "MTur (obrigatório)", retentionPeriod: "5 anos" },
    { activity: "Reserva de Hospedagem", dataCollected: "Nome, CPF, e-mail, telefone, dados de pagamento", legalBasis: "Execução de contrato", sharing: "Hotel parceiro, gateway de pagamento", retentionPeriod: "5 anos" },
    { activity: "Embarque em Excursões", dataCollected: "Nome, RG, CPF, assento, foto (opcional)", legalBasis: "Execução de contrato / Obrigação legal (ANTT)", sharing: "ANTT (lista de passageiros)", retentionPeriod: "2 anos" },
    { activity: "Marketing e Comunicações", dataCollected: "Nome, e-mail, telefone, preferências", legalBasis: "Consentimento (Art. 7º, I)", sharing: "Plataformas de e-mail marketing", retentionPeriod: "Até revogação" },
    { activity: "Atendimento via WhatsApp", dataCollected: "Nome, telefone, mensagens", legalBasis: "Legítimo interesse", sharing: "WhatsApp Business API", retentionPeriod: "1 ano" },
  ];

  const [subjectRequests, setSubjectRequests] = useState<SubjectRequest[]>([
    { id: "1", titular: "João Silva", type: "Acesso", date: "2026-03-10", status: "Atendida" },
    { id: "2", titular: "Maria Santos", type: "Exclusão", date: "2026-03-12", status: "Pendente" },
    { id: "3", titular: "Pedro Costa", type: "Portabilidade", date: "2026-03-14", status: "Em análise" },
    { id: "4", titular: "Ana Oliveira", type: "Correção", date: "2026-03-15", status: "Pendente" },
    { id: "5", titular: "Carlos Mendes", type: "Acesso", date: "2026-03-16", status: "Atendida" },
    { id: "6", titular: "Fernanda Lima", type: "Exclusão", date: "2026-03-18", status: "Em análise" },
  ]);

  const consentMetrics = {
    total: 2847,
    revocations: 43,
    acceptanceRate: 94.2,
  };

  const compliantCount = complianceItems.filter(item => item.compliant).length;
  const totalItems = complianceItems.length;
  const compliancePercent = Math.round((compliantCount / totalItems) * 100);

  const toggleCompliance = (id: string) => {
    setComplianceItems(prev =>
      prev.map(item => item.id === id ? { ...item, compliant: !item.compliant } : item)
    );
  };

  const handleAttend = (id: string) => {
    setSubjectRequests(prev =>
      prev.map(req => req.id === id ? { ...req, status: "Atendida" as const } : req)
    );
  };

  const getRequestTypeIcon = (type: string) => {
    switch (type) {
      case "Acesso": return <Eye style={{ width: 16, height: 16, color: "#2563EB" }} />;
      case "Exclusão": return <Trash2 style={{ width: 16, height: 16, color: "#EF4444" }} />;
      case "Portabilidade": return <RefreshCw style={{ width: 16, height: 16, color: "#8B5CF6" }} />;
      case "Correção": return <Edit style={{ width: 16, height: 16, color: "#F59E0B" }} />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string }> = {
      "Atendida": { bg: "#DCFCE7", color: "#166534" },
      "Pendente": { bg: "#FEF9C3", color: "#854D0E" },
      "Em análise": { bg: "#DBEAFE", color: "#1E40AF" },
    };
    const s = styles[status] || { bg: "#F3F4F6", color: "#374151" };
    return (
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 12px",
        borderRadius: 9999,
        fontSize: 12,
        fontWeight: 600,
        backgroundColor: s.bg,
        color: s.color,
      }}>
        {status}
      </span>
    );
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      <header style={{
        background: "linear-gradient(135deg, #1e3a5f, #2563EB)",
        color: "#fff",
        padding: "24px 32px",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}>
        <Link href="/admin/dashboard">
          <button
            data-testid="button-back-dashboard"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "none",
              borderRadius: 8,
              padding: 8,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              color: "#fff",
            }}
          >
            <ArrowLeft style={{ width: 20, height: 20 }} />
          </button>
        </Link>
        <Shield style={{ width: 28, height: 28 }} />
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>LGPD — Conformidade e Privacidade</h1>
          <p style={{ margin: 0, fontSize: 14, opacity: 0.85 }}>Dashboard de proteção de dados pessoais</p>
        </div>
      </header>

      <div style={{ padding: "32px", display: "flex", flexDirection: "column", gap: 32 }}>

        {/* Compliance Checklist */}
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <CheckCircle style={{ width: 24, height: 24, color: "#22C55E" }} />
            <h2 data-testid="text-compliance-title" style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1e3a5f" }}>Status de Conformidade LGPD</h2>
          </div>

          {/* Progress Bar */}
          <div style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 20,
            marginBottom: 16,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span data-testid="text-compliance-count" style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>
                {compliantCount}/{totalItems} itens em conformidade
              </span>
              <span data-testid="text-compliance-percent" style={{ fontSize: 14, fontWeight: 700, color: compliancePercent >= 80 ? "#22C55E" : compliancePercent >= 50 ? "#F59E0B" : "#EF4444" }}>
                {compliancePercent}% concluído
              </span>
            </div>
            <div style={{ width: "100%", height: 12, backgroundColor: "#E5E7EB", borderRadius: 6, overflow: "hidden" }}>
              <div
                data-testid="progress-compliance"
                style={{
                  width: `${compliancePercent}%`,
                  height: "100%",
                  backgroundColor: compliancePercent >= 80 ? "#22C55E" : compliancePercent >= 50 ? "#F59E0B" : "#EF4444",
                  borderRadius: 6,
                  transition: "width 0.5s ease",
                }}
              />
            </div>
          </div>

          {/* Checklist Items */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 12 }}>
            {complianceItems.map(item => (
              <div
                key={item.id}
                data-testid={`card-compliance-${item.id}`}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  padding: 16,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  border: `2px solid ${item.compliant ? "#22C55E" : "#FCA5A5"}`,
                  cursor: "pointer",
                  transition: "border-color 0.3s ease",
                }}
                onClick={() => toggleCompliance(item.id)}
              >
                <div style={{ flexShrink: 0, marginTop: 2 }}>
                  {item.compliant ? (
                    <CheckCircle style={{ width: 24, height: 24, color: "#22C55E" }} />
                  ) : (
                    <XCircle style={{ width: 24, height: 24, color: "#EF4444" }} />
                  )}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#111827" }}>{item.title}</h3>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Treatment Records */}
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <FileText style={{ width: 24, height: 24, color: "#2563EB" }} />
            <h2 data-testid="text-treatment-title" style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1e3a5f" }}>Registro de Tratamento de Dados</h2>
          </div>
          <div style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}>
            <div style={{ overflowX: "auto" }}>
              <table data-testid="table-treatment" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ backgroundColor: "#F3F4F6" }}>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "2px solid #E5E7EB" }}>Atividade</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "2px solid #E5E7EB" }}>Dados Coletados</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "2px solid #E5E7EB" }}>Base Legal</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "2px solid #E5E7EB" }}>Compartilhamento</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "2px solid #E5E7EB" }}>Prazo Retenção</th>
                  </tr>
                </thead>
                <tbody>
                  {treatmentRecords.map((record, idx) => (
                    <tr
                      key={idx}
                      data-testid={`row-treatment-${idx}`}
                      style={{ borderBottom: "1px solid #F3F4F6" }}
                    >
                      <td style={{ padding: "12px 16px", fontWeight: 500, color: "#111827" }}>{record.activity}</td>
                      <td style={{ padding: "12px 16px", color: "#6B7280" }}>{record.dataCollected}</td>
                      <td style={{ padding: "12px 16px", color: "#6B7280" }}>{record.legalBasis}</td>
                      <td style={{ padding: "12px 16px", color: "#6B7280" }}>{record.sharing}</td>
                      <td style={{ padding: "12px 16px", color: "#6B7280", whiteSpace: "nowrap" }}>{record.retentionPeriod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Subject Requests */}
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <Users style={{ width: 24, height: 24, color: "#F57C00" }} />
            <h2 data-testid="text-requests-title" style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1e3a5f" }}>Solicitações de Titulares</h2>
          </div>
          <div style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}>
            <div style={{ overflowX: "auto" }}>
              <table data-testid="table-requests" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ backgroundColor: "#F3F4F6" }}>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "2px solid #E5E7EB" }}>Titular</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "2px solid #E5E7EB" }}>Tipo</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "2px solid #E5E7EB" }}>Data</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "2px solid #E5E7EB" }}>Status</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "2px solid #E5E7EB" }}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {subjectRequests.map(req => (
                    <tr
                      key={req.id}
                      data-testid={`row-request-${req.id}`}
                      style={{ borderBottom: "1px solid #F3F4F6" }}
                    >
                      <td style={{ padding: "12px 16px", fontWeight: 500, color: "#111827" }}>{req.titular}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {getRequestTypeIcon(req.type)}
                          <span style={{ color: "#374151" }}>{req.type}</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#6B7280" }}>
                        {new Date(req.date).toLocaleDateString("pt-BR")}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        {getStatusBadge(req.status)}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        {req.status !== "Atendida" ? (
                          <button
                            data-testid={`button-attend-${req.id}`}
                            onClick={() => handleAttend(req.id)}
                            style={{
                              backgroundColor: "#2563EB",
                              color: "#fff",
                              border: "none",
                              borderRadius: 6,
                              padding: "6px 16px",
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: "pointer",
                              transition: "background-color 0.2s",
                            }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#1D4ED8")}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#2563EB")}
                          >
                            Atender
                          </button>
                        ) : (
                          <span style={{ fontSize: 12, color: "#22C55E", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                            <CheckCircle style={{ width: 14, height: 14 }} /> Concluída
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Consent Metrics */}
        <section>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <UserCheck style={{ width: 24, height: 24, color: "#22C55E" }} />
            <h2 data-testid="text-consents-title" style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1e3a5f" }}>Consentimentos</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            <div
              data-testid="card-total-consents"
              style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 24,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Users style={{ width: 24, height: 24, color: "#2563EB" }} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 13, color: "#6B7280" }}>Total de Consentimentos</p>
                <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#111827" }}>{consentMetrics.total.toLocaleString("pt-BR")}</p>
              </div>
            </div>

            <div
              data-testid="card-revocations"
              style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 24,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <XCircle style={{ width: 24, height: 24, color: "#EF4444" }} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 13, color: "#6B7280" }}>Revogações</p>
                <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#111827" }}>{consentMetrics.revocations}</p>
              </div>
            </div>

            <div
              data-testid="card-acceptance-rate"
              style={{
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 24,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <BarChart3 style={{ width: 24, height: 24, color: "#22C55E" }} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 13, color: "#6B7280" }}>Taxa de Aceitação</p>
                <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#111827" }}>{consentMetrics.acceptanceRate}%</p>
              </div>
            </div>
          </div>
        </section>

        {/* Link to Privacy Policy */}
        <section style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 24,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Lock style={{ width: 24, height: 24, color: "#2563EB" }} />
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#111827" }}>Política de Privacidade</h3>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6B7280" }}>Visualize a política de privacidade completa publicada no site</p>
            </div>
          </div>
          <Link href="/politica-de-privacidade">
            <button
              data-testid="link-privacy-policy"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                backgroundColor: "#2563EB",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "10px 20px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#1D4ED8")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#2563EB")}
            >
              Ver Política Completa
              <ExternalLink style={{ width: 16, height: 16 }} />
            </button>
          </Link>
        </section>

      </div>
    </div>
  );
}
