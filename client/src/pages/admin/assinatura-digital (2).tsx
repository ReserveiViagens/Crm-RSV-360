import { useState } from "react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  Eye,
  Award,
  Link2,
  FilePen,
  KeyRound,
  FileWarning
} from "lucide-react";

interface Certificate {
  id: string;
  name: string;
  type: string;
  status: "active" | "expired" | "not_configured";
  validUntil: string;
  provider: string;
  daysUntilExpiry: number;
}

interface SignedDocument {
  id: string;
  title: string;
  date: string;
  signatory: string;
  status: "signed" | "pending" | "expired";
  type: string;
}

export default function AssinaturaDigital() {
  const { toast } = useToast();

  const [certificates] = useState<Certificate[]>([
    {
      id: "1",
      name: "e-CNPJ A3",
      type: "e-CNPJ",
      status: "active",
      validUntil: "2026-11-15",
      provider: "Certisign",
      daysUntilExpiry: 530
    },
    {
      id: "2",
      name: "Certificado NF-e",
      type: "NF-e",
      status: "active",
      validUntil: "2026-04-20",
      provider: "Serasa Experian",
      daysUntilExpiry: 22
    },
    {
      id: "3",
      name: "Integração SuperSign/Clicksign",
      type: "API",
      status: "active",
      validUntil: "2027-01-01",
      provider: "Clicksign",
      daysUntilExpiry: 580
    }
  ]);

  const [signedDocuments] = useState<SignedDocument[]>([
    { id: "1", title: "Contrato de Excursão — Caldas Novas Jul/2026", date: "2026-06-10", signatory: "João Silva", status: "signed", type: "Contrato" },
    { id: "2", title: "Termo de Responsabilidade — Hot Park", date: "2026-06-12", signatory: "Maria Santos", status: "signed", type: "Termo" },
    { id: "3", title: "Autorização de Menor — Lucas Oliveira", date: "2026-06-14", signatory: "Ana Oliveira", status: "pending", type: "Autorização" },
    { id: "4", title: "Contrato de Excursão — Porto Seguro Ago/2026", date: "2026-06-15", signatory: "Pedro Costa", status: "pending", type: "Contrato" },
    { id: "5", title: "Termo de Responsabilidade — Rafting", date: "2026-05-20", signatory: "Carlos Mendes", status: "signed", type: "Termo" },
    { id: "6", title: "Autorização de Menor — Sofia Almeida", date: "2026-05-25", signatory: "Fernanda Almeida", status: "expired", type: "Autorização" },
    { id: "7", title: "Contrato de Excursão — Gramado Set/2026", date: "2026-06-18", signatory: "Roberto Lima", status: "pending", type: "Contrato" },
    { id: "8", title: "Termo de Responsabilidade — Tirolesa", date: "2026-06-01", signatory: "Paula Ferreira", status: "signed", type: "Termo" }
  ]);

  const [sendForm, setSendForm] = useState({
    documentType: "",
    passenger: ""
  });
  const [isSending, setIsSending] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "signed":
        return { bg: "#DCFCE7", color: "#166534", label: status === "active" ? "Ativo" : "Assinado" };
      case "pending":
        return { bg: "#FEF9C3", color: "#854D0E", label: "Pendente" };
      case "expired":
        return { bg: "#FEE2E2", color: "#991B1B", label: "Expirado" };
      case "not_configured":
        return { bg: "#F3F4F6", color: "#374151", label: "Não configurado" };
      default:
        return { bg: "#F3F4F6", color: "#374151", label: status };
    }
  };

  const getCertIcon = (type: string) => {
    switch (type) {
      case "e-CNPJ": return <KeyRound style={{ width: 28, height: 28, color: "#2563EB" }} />;
      case "NF-e": return <FileText style={{ width: 28, height: 28, color: "#F57C00" }} />;
      case "API": return <Link2 style={{ width: 28, height: 28, color: "#22C55E" }} />;
      default: return <ShieldCheck style={{ width: 28, height: 28, color: "#2563EB" }} />;
    }
  };

  const handleViewPdf = (docTitle: string) => {
    toast({
      title: "Abrindo documento...",
      description: `Carregando: ${docTitle}`
    });
  };

  const handleSendForSignature = async () => {
    if (!sendForm.documentType || !sendForm.passenger) {
      toast({
        title: "Preencha todos os campos",
        description: "Selecione o tipo de documento e informe o passageiro.",
        variant: "destructive"
      });
      return;
    }
    setIsSending(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsSending(false);
    toast({
      title: "Documento enviado para assinatura!",
      description: `${sendForm.documentType} enviado para ${sendForm.passenger} via Clicksign.`
    });
    setSendForm({ documentType: "", passenger: "" });
  };

  const hasExpiringCertificate = certificates.some((c) => c.daysUntilExpiry < 30 && c.status !== "not_configured");

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB" }}>
      <header
        style={{
          background: "linear-gradient(135deg, #1e3a5f, #2563EB)",
          padding: "20px 24px",
          color: "#fff"
        }}
        data-testid="header-assinatura-digital"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <Link href="/admin/dashboard" data-testid="link-voltar-dashboard">
            <button
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: 8,
                padding: "8px 12px",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 14
              }}
              data-testid="button-voltar"
            >
              <ArrowLeft style={{ width: 18, height: 18 }} />
              Voltar
            </button>
          </Link>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }} data-testid="text-page-title">
              Assinatura Digital e Certificados
            </h1>
            <p style={{ margin: 0, fontSize: 14, opacity: 0.85 }}>
              Gerencie certificados digitais e documentos assinados
            </p>
          </div>
        </div>
      </header>

      <main style={{ padding: "24px", maxWidth: 1200, margin: "0 auto" }}>
        {hasExpiringCertificate && (
          <div
            style={{
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: 8,
              padding: "14px 18px",
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 12
            }}
            data-testid="alert-certificate-expiring"
          >
            <AlertTriangle style={{ width: 22, height: 22, color: "#DC2626", flexShrink: 0 }} />
            <div>
              <p style={{ margin: 0, fontWeight: 600, color: "#991B1B", fontSize: 14 }}>
                Atenção: Certificado próximo do vencimento!
              </p>
              <p style={{ margin: 0, color: "#B91C1C", fontSize: 13 }}>
                {certificates.filter((c) => c.daysUntilExpiry < 30 && c.status !== "not_configured").map((c) => `${c.name} vence em ${c.daysUntilExpiry} dias`).join("; ")}
              </p>
            </div>
          </div>
        )}

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#1e3a5f", marginBottom: 16 }} data-testid="text-section-certificates">
            <Award style={{ width: 20, height: 20, display: "inline", verticalAlign: "middle", marginRight: 8 }} />
            Certificados Digitais
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            {certificates.map((cert) => {
              const badge = getStatusBadge(cert.status);
              const isExpiringSoon = cert.daysUntilExpiry < 30 && cert.status !== "not_configured";
              return (
                <div
                  key={cert.id}
                  style={{
                    background: "#fff",
                    borderRadius: 10,
                    padding: 20,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    border: isExpiringSoon ? "2px solid #EF4444" : "1px solid #E5E7EB",
                    position: "relative"
                  }}
                  data-testid={`card-certificate-${cert.id}`}
                >
                  {isExpiringSoon && (
                    <div
                      style={{
                        position: "absolute",
                        top: -10,
                        right: 12,
                        background: "#EF4444",
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "3px 10px",
                        borderRadius: 12
                      }}
                      data-testid={`badge-expiring-${cert.id}`}
                    >
                      Vence em {cert.daysUntilExpiry} dias
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <div style={{ background: "#F0F4FF", borderRadius: 10, padding: 12 }}>
                      {getCertIcon(cert.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#111827" }} data-testid={`text-cert-name-${cert.id}`}>
                        {cert.name}
                      </h3>
                      <p style={{ margin: "4px 0", fontSize: 13, color: "#6B7280" }}>
                        Provedor: {cert.provider}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                        <span
                          style={{
                            background: badge.bg,
                            color: badge.color,
                            fontSize: 12,
                            fontWeight: 600,
                            padding: "3px 10px",
                            borderRadius: 12
                          }}
                          data-testid={`badge-status-${cert.id}`}
                        >
                          {badge.label}
                        </span>
                        <span style={{ fontSize: 12, color: "#6B7280", display: "flex", alignItems: "center", gap: 4 }}>
                          <Clock style={{ width: 13, height: 13 }} />
                          Válido até {new Date(cert.validUntil).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#1e3a5f", marginBottom: 16 }} data-testid="text-section-documents">
            <FilePen style={{ width: 20, height: 20, display: "inline", verticalAlign: "middle", marginRight: 8 }} />
            Documentos Assinados
          </h2>
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              border: "1px solid #E5E7EB",
              overflowX: "auto"
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }} data-testid="table-documents">
              <thead>
                <tr style={{ background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Título</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Tipo</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Data</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Signatário</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Status</th>
                  <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, color: "#374151", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Ação</th>
                </tr>
              </thead>
              <tbody>
                {signedDocuments.map((doc) => {
                  const badge = getStatusBadge(doc.status);
                  return (
                    <tr key={doc.id} style={{ borderBottom: "1px solid #F3F4F6" }} data-testid={`row-document-${doc.id}`}>
                      <td style={{ padding: "12px 16px", color: "#111827", fontWeight: 500 }} data-testid={`text-doc-title-${doc.id}`}>
                        {doc.title}
                      </td>
                      <td style={{ padding: "12px 16px", color: "#6B7280" }}>{doc.type}</td>
                      <td style={{ padding: "12px 16px", color: "#6B7280" }}>
                        {new Date(doc.date).toLocaleDateString("pt-BR")}
                      </td>
                      <td style={{ padding: "12px 16px", color: "#374151" }}>{doc.signatory}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            background: badge.bg,
                            color: badge.color,
                            fontSize: 12,
                            fontWeight: 600,
                            padding: "3px 10px",
                            borderRadius: 12,
                            whiteSpace: "nowrap"
                          }}
                          data-testid={`badge-doc-status-${doc.id}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <button
                          onClick={() => handleViewPdf(doc.title)}
                          style={{
                            background: "transparent",
                            border: "1px solid #D1D5DB",
                            borderRadius: 6,
                            padding: "6px 12px",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            fontSize: 13,
                            color: "#2563EB"
                          }}
                          data-testid={`button-view-pdf-${doc.id}`}
                        >
                          <Eye style={{ width: 14, height: 14 }} />
                          Ver PDF
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#1e3a5f", marginBottom: 16 }} data-testid="text-section-send">
            <Send style={{ width: 20, height: 20, display: "inline", verticalAlign: "middle", marginRight: 8 }} />
            Enviar para Assinatura
          </h2>
          <div
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: 24,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              border: "1px solid #E5E7EB"
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                  Tipo de Documento
                </label>
                <select
                  value={sendForm.documentType}
                  onChange={(e) => setSendForm({ ...sendForm, documentType: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #D1D5DB",
                    borderRadius: 8,
                    fontSize: 14,
                    color: "#111827",
                    background: "#fff",
                    outline: "none"
                  }}
                  data-testid="select-document-type"
                >
                  <option value="">Selecione o tipo...</option>
                  <option value="Contrato de Serviços Turísticos">Contrato de Serviços Turísticos</option>
                  <option value="Termo de Responsabilidade">Termo de Responsabilidade</option>
                  <option value="Autorização para Menores">Autorização para Menores</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                  Passageiro
                </label>
                <input
                  type="text"
                  placeholder="Nome do passageiro"
                  value={sendForm.passenger}
                  onChange={(e) => setSendForm({ ...sendForm, passenger: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: "1px solid #D1D5DB",
                    borderRadius: 8,
                    fontSize: 14,
                    color: "#111827",
                    outline: "none"
                  }}
                  data-testid="input-passenger-name"
                />
              </div>
            </div>
            <button
              onClick={handleSendForSignature}
              disabled={isSending}
              style={{
                background: isSending ? "#93C5FD" : "#2563EB",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "10px 24px",
                fontSize: 14,
                fontWeight: 600,
                cursor: isSending ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8
              }}
              data-testid="button-send-signature"
            >
              {isSending ? (
                <>
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      border: "2px solid #fff",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 1s linear infinite"
                    }}
                  />
                  Enviando...
                </>
              ) : (
                <>
                  <Send style={{ width: 16, height: 16 }} />
                  Enviar para Assinatura Digital
                </>
              )}
            </button>
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#1e3a5f", marginBottom: 16 }} data-testid="text-section-summary">
            <ShieldCheck style={{ width: 20, height: 20, display: "inline", verticalAlign: "middle", marginRight: 8 }} />
            Resumo
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {[
              {
                label: "Certificados Ativos",
                value: certificates.filter((c) => c.status === "active").length,
                icon: <CheckCircle style={{ width: 22, height: 22, color: "#22C55E" }} />,
                bg: "#F0FDF4"
              },
              {
                label: "Docs Assinados",
                value: signedDocuments.filter((d) => d.status === "signed").length,
                icon: <FileText style={{ width: 22, height: 22, color: "#2563EB" }} />,
                bg: "#EFF6FF"
              },
              {
                label: "Docs Pendentes",
                value: signedDocuments.filter((d) => d.status === "pending").length,
                icon: <Clock style={{ width: 22, height: 22, color: "#F59E0B" }} />,
                bg: "#FFFBEB"
              },
              {
                label: "Docs Expirados",
                value: signedDocuments.filter((d) => d.status === "expired").length,
                icon: <XCircle style={{ width: 22, height: 22, color: "#EF4444" }} />,
                bg: "#FEF2F2"
              }
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: "#fff",
                  borderRadius: 10,
                  padding: 20,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  border: "1px solid #E5E7EB",
                  display: "flex",
                  alignItems: "center",
                  gap: 14
                }}
                data-testid={`card-summary-${idx}`}
              >
                <div style={{ background: item.bg, borderRadius: 10, padding: 10 }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#111827" }}>{item.value}</p>
                  <p style={{ margin: 0, fontSize: 13, color: "#6B7280" }}>{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}