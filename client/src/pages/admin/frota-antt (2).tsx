import { useState } from "react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Truck,
  Bus,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Download,
  Printer,
  User,
  CreditCard,
  Calculator,
  RefreshCw,
} from "lucide-react";

interface Veiculo {
  id: string;
  tipo: "Van" | "Micro-ônibus" | "Ônibus";
  placa: string;
  capacidade: number;
  motorista: string;
  rntrc: string;
  rntrcValidade: string;
  seguroValidade: string;
  autorizacaoInterestadual: string;
}

interface Certificacao {
  id: string;
  veiculoPlaca: string;
  tipoDoc: "RNTRC" | "Seguro" | "ANTT" | "MOPP";
  numero: string;
  emissao: string;
  vencimento: string;
  status: "Ativo" | "Vence em breve" | "Vencido";
}

interface PassageiroANTT {
  id: string;
  nome: string;
  rg: string;
  cpf: string;
  orgaoEmissor: string;
  dataNascimento: string;
  assento: number;
}

interface Motorista {
  id: string;
  nome: string;
  cnhCategoria: string;
  cnhValidade: string;
  moppValidade: string;
  foto: string;
  status: "Ativo" | "Vence em breve" | "Vencido";
}

const veiculosMock: Veiculo[] = [
  {
    id: "v1",
    tipo: "Van",
    placa: "ABC-1D23",
    capacidade: 15,
    motorista: "Carlos Almeida",
    rntrc: "RNTRC-001234567",
    rntrcValidade: "2026-11-15",
    seguroValidade: "2026-08-20",
    autorizacaoInterestadual: "2026-12-01",
  },
  {
    id: "v2",
    tipo: "Micro-ônibus",
    placa: "DEF-4G56",
    capacidade: 28,
    motorista: "Roberto Santos",
    rntrc: "RNTRC-002345678",
    rntrcValidade: "2026-06-10",
    seguroValidade: "2026-04-15",
    autorizacaoInterestadual: "2026-09-30",
  },
  {
    id: "v3",
    tipo: "Ônibus",
    placa: "GHI-7J89",
    capacidade: 46,
    motorista: "Fernando Lima",
    rntrc: "RNTRC-003456789",
    rntrcValidade: "2026-03-20",
    seguroValidade: "2026-05-10",
    autorizacaoInterestadual: "2025-07-01",
  },
  {
    id: "v4",
    tipo: "Van",
    placa: "JKL-0M12",
    capacidade: 15,
    motorista: "Marcos Pereira",
    rntrc: "RNTRC-004567890",
    rntrcValidade: "2026-09-05",
    seguroValidade: "2026-10-25",
    autorizacaoInterestadual: "2026-11-15",
  },
];

const certificacoesMock: Certificacao[] = [
  { id: "c1", veiculoPlaca: "ABC-1D23", tipoDoc: "RNTRC", numero: "RNTRC-001234567", emissao: "2024-11-15", vencimento: "2026-11-15", status: "Ativo" },
  { id: "c2", veiculoPlaca: "ABC-1D23", tipoDoc: "Seguro", numero: "SEG-2026-00123", emissao: "2025-08-20", vencimento: "2026-08-20", status: "Ativo" },
  { id: "c3", veiculoPlaca: "DEF-4G56", tipoDoc: "RNTRC", numero: "RNTRC-002345678", emissao: "2024-06-10", vencimento: "2026-06-10", status: "Ativo" },
  { id: "c4", veiculoPlaca: "DEF-4G56", tipoDoc: "Seguro", numero: "SEG-2026-00234", emissao: "2025-04-15", vencimento: "2026-04-15", status: "Vence em breve" },
  { id: "c5", veiculoPlaca: "DEF-4G56", tipoDoc: "MOPP", numero: "MOPP-2026-00345", emissao: "2024-01-10", vencimento: "2026-07-10", status: "Ativo" },
  { id: "c6", veiculoPlaca: "GHI-7J89", tipoDoc: "RNTRC", numero: "RNTRC-003456789", emissao: "2024-03-20", vencimento: "2026-03-20", status: "Vence em breve" },
  { id: "c7", veiculoPlaca: "GHI-7J89", tipoDoc: "Seguro", numero: "SEG-2026-00456", emissao: "2024-05-10", vencimento: "2026-05-10", status: "Ativo" },
  { id: "c8", veiculoPlaca: "GHI-7J89", tipoDoc: "ANTT", numero: "ANTT-2025-00789", emissao: "2023-07-01", vencimento: "2025-07-01", status: "Vencido" },
  { id: "c9", veiculoPlaca: "JKL-0M12", tipoDoc: "RNTRC", numero: "RNTRC-004567890", emissao: "2024-09-05", vencimento: "2026-09-05", status: "Ativo" },
  { id: "c10", veiculoPlaca: "JKL-0M12", tipoDoc: "Seguro", numero: "SEG-2026-00567", emissao: "2025-10-25", vencimento: "2026-10-25", status: "Ativo" },
];

const passageirosMock: PassageiroANTT[] = [
  { id: "p1", nome: "João Silva", rg: "12.345.678-9", cpf: "123.456.789-00", orgaoEmissor: "SSP/GO", dataNascimento: "1985-03-12", assento: 1 },
  { id: "p2", nome: "Maria Santos", rg: "23.456.789-0", cpf: "234.567.890-11", orgaoEmissor: "SSP/SP", dataNascimento: "1990-07-22", assento: 2 },
  { id: "p3", nome: "Pedro Costa", rg: "34.567.890-1", cpf: "345.678.901-22", orgaoEmissor: "SSP/MG", dataNascimento: "1978-11-05", assento: 3 },
  { id: "p4", nome: "Ana Oliveira", rg: "45.678.901-2", cpf: "456.789.012-33", orgaoEmissor: "SSP/RJ", dataNascimento: "1995-01-18", assento: 4 },
  { id: "p5", nome: "Carlos Mendes", rg: "56.789.012-3", cpf: "567.890.123-44", orgaoEmissor: "SSP/BA", dataNascimento: "1982-09-30", assento: 5 },
  { id: "p6", nome: "Fernanda Lima", rg: "67.890.123-4", cpf: "678.901.234-55", orgaoEmissor: "SSP/PR", dataNascimento: "1988-04-14", assento: 6 },
  { id: "p7", nome: "Ricardo Alves", rg: "78.901.234-5", cpf: "789.012.345-66", orgaoEmissor: "SSP/SC", dataNascimento: "1972-12-25", assento: 7 },
  { id: "p8", nome: "Juliana Rocha", rg: "89.012.345-6", cpf: "890.123.456-77", orgaoEmissor: "SSP/GO", dataNascimento: "1993-06-08", assento: 8 },
];

const motoristasMock: Motorista[] = [
  { id: "m1", nome: "Carlos Almeida", cnhCategoria: "D", cnhValidade: "2027-05-20", moppValidade: "2026-11-10", foto: "", status: "Ativo" },
  { id: "m2", nome: "Roberto Santos", cnhCategoria: "D", cnhValidade: "2026-08-15", moppValidade: "2026-04-05", foto: "", status: "Vence em breve" },
  { id: "m3", nome: "Fernando Lima", cnhCategoria: "E", cnhValidade: "2026-12-30", moppValidade: "2026-09-18", foto: "", status: "Ativo" },
  { id: "m4", nome: "Marcos Pereira", cnhCategoria: "D", cnhValidade: "2025-06-01", moppValidade: "2025-03-15", foto: "", status: "Vencido" },
];

function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getVeiculoStatus(v: Veiculo): "ok" | "warning" | "danger" {
  const dates = [v.rntrcValidade, v.seguroValidade, v.autorizacaoInterestadual];
  const minDays = Math.min(...dates.map(getDaysUntil));
  if (minDays < 0) return "danger";
  if (minDays < 30) return "warning";
  return "ok";
}

function getVeiculoIcon(tipo: string) {
  if (tipo === "Van") return <Truck style={{ width: 32, height: 32 }} />;
  if (tipo === "Micro-ônibus") return <Bus style={{ width: 32, height: 32 }} />;
  return <Bus style={{ width: 36, height: 36 }} />;
}

export default function FrotaANTT() {
  const { toast } = useToast();
  const [simuladorPassageiros, setSimuladorPassageiros] = useState<number>(10);

  const statusColors: Record<string, { bg: string; text: string; border: string }> = {
    ok: { bg: "#DCFCE7", text: "#166534", border: "#22C55E" },
    warning: { bg: "#FEF9C3", text: "#854D0E", border: "#F59E0B" },
    danger: { bg: "#FEE2E2", text: "#991B1B", border: "#EF4444" },
  };

  const certStatusColors: Record<string, { bg: string; text: string }> = {
    Ativo: { bg: "#DCFCE7", text: "#166534" },
    "Vence em breve": { bg: "#FEF9C3", text: "#854D0E" },
    Vencido: { bg: "#FEE2E2", text: "#991B1B" },
  };

  function getSugestaoVeiculo(qtd: number): string {
    if (qtd <= 15) return "Van (até 15 passageiros)";
    if (qtd <= 28) return "Micro-ônibus (16-28 passageiros)";
    return "Ônibus (29+ passageiros)";
  }

  const handleExportarListaANTT = () => {
    toast({
      title: "Exportando Lista ANTT",
      description: "A lista de passageiros foi exportada em formato Excel.",
    });
  };

  const handleImprimir = () => {
    toast({
      title: "Imprimindo Lista ANTT",
      description: "A lista de passageiros foi enviada para impressão.",
    });
  };

  const handleRenovar = (numero: string) => {
    toast({
      title: "Solicitação de Renovação",
      description: `Renovação solicitada para o documento ${numero}.`,
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB" }} data-testid="page-frota-antt">
      <header
        style={{
          background: "linear-gradient(135deg, #1e3a5f, #2563EB)",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Link href="/admin/dashboard">
          <button
            data-testid="button-voltar-dashboard"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 6,
              color: "#fff",
              padding: "8px 12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
            }}
          >
            <ArrowLeft style={{ width: 16, height: 16 }} />
            Voltar
          </button>
        </Link>
        <div>
          <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 700, margin: 0 }}>ANTT e Gestão de Frota</h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, margin: 0 }}>
            Gerenciamento de veículos, certificações e lista de passageiros
          </p>
        </div>
      </header>

      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 32 }}>
        {/* Veículos */}
        <section data-testid="section-veiculos">
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1e3a5f", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Truck style={{ width: 22, height: 22 }} />
            Veículos
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            {veiculosMock.map((v) => {
              const status = getVeiculoStatus(v);
              const sc = statusColors[status];
              const rntrcDays = getDaysUntil(v.rntrcValidade);
              const seguroDays = getDaysUntil(v.seguroValidade);
              const anttDays = getDaysUntil(v.autorizacaoInterestadual);
              return (
                <div
                  key={v.id}
                  data-testid={`card-veiculo-${v.id}`}
                  style={{
                    background: "#fff",
                    borderRadius: 8,
                    border: `2px solid ${sc.border}`,
                    padding: 20,
                    position: "relative",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ color: "#1e3a5f" }}>{getVeiculoIcon(v.tipo)}</div>
                      <div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e3a5f", margin: 0 }}>{v.tipo}</h3>
                        <p style={{ fontSize: 14, color: "#64748B", margin: 0 }}>Placa: {v.placa}</p>
                      </div>
                    </div>
                    <span
                      data-testid={`badge-status-${v.id}`}
                      style={{
                        padding: "4px 10px",
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 600,
                        background: sc.bg,
                        color: sc.text,
                      }}
                    >
                      {status === "ok" ? "Tudo OK" : status === "warning" ? "Atenção" : "Irregular"}
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#64748B" }}>Capacidade</span>
                      <span style={{ fontWeight: 600, color: "#1e3a5f" }}>{v.capacidade} passageiros</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#64748B" }}>Motorista</span>
                      <span style={{ fontWeight: 600, color: "#1e3a5f" }}>{v.motorista}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#64748B" }}>RNTRC</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontWeight: 500, color: "#1e3a5f", fontSize: 12 }}>{v.rntrc}</span>
                        {rntrcDays < 30 && (
                          <AlertTriangle style={{ width: 14, height: 14, color: rntrcDays < 0 ? "#EF4444" : "#F59E0B" }} />
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#64748B" }}>RNTRC Validade</span>
                      <span style={{ fontWeight: 500, color: rntrcDays < 0 ? "#EF4444" : rntrcDays < 30 ? "#F59E0B" : "#166534", fontSize: 13 }}>
                        {new Date(v.rntrcValidade).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#64748B" }}>Seguro Validade</span>
                      <span style={{ fontWeight: 500, color: seguroDays < 0 ? "#EF4444" : seguroDays < 30 ? "#F59E0B" : "#166534", fontSize: 13 }}>
                        {new Date(v.seguroValidade).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#64748B" }}>Autoriz. Interestadual</span>
                      <span style={{ fontWeight: 500, color: anttDays < 0 ? "#EF4444" : anttDays < 30 ? "#F59E0B" : "#166534", fontSize: 13 }}>
                        {new Date(v.autorizacaoInterestadual).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>

                  {status !== "ok" && (
                    <div
                      style={{
                        marginTop: 12,
                        padding: "8px 12px",
                        borderRadius: 6,
                        background: sc.bg,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 13,
                        color: sc.text,
                        fontWeight: 500,
                      }}
                    >
                      <AlertTriangle style={{ width: 16, height: 16, flexShrink: 0 }} />
                      {status === "warning"
                        ? "Certificação vence em menos de 30 dias!"
                        : "Documentação vencida — regularize imediatamente!"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Certificações */}
        <section data-testid="section-certificacoes">
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1e3a5f", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Shield style={{ width: 22, height: 22 }} />
            Certificações
          </h2>
          <div style={{ background: "#fff", borderRadius: 8, overflow: "hidden", border: "1px solid #E2E8F0" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ background: "#F1F5F9" }}>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#475569" }}>Veículo</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#475569" }}>Tipo Doc</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#475569" }}>Número</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#475569" }}>Emissão</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#475569" }}>Vencimento</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#475569" }}>Status</th>
                    <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, color: "#475569" }}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {certificacoesMock.map((c) => {
                    const cs = certStatusColors[c.status] || certStatusColors["Ativo"];
                    return (
                      <tr key={c.id} style={{ borderTop: "1px solid #E2E8F0" }} data-testid={`row-certificacao-${c.id}`}>
                        <td style={{ padding: "12px 16px", fontWeight: 500, color: "#1e3a5f" }}>{c.veiculoPlaca}</td>
                        <td style={{ padding: "12px 16px", color: "#475569" }}>{c.tipoDoc}</td>
                        <td style={{ padding: "12px 16px", color: "#475569", fontFamily: "monospace", fontSize: 13 }}>{c.numero}</td>
                        <td style={{ padding: "12px 16px", color: "#475569" }}>{new Date(c.emissao).toLocaleDateString("pt-BR")}</td>
                        <td style={{ padding: "12px 16px", color: "#475569" }}>{new Date(c.vencimento).toLocaleDateString("pt-BR")}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span
                            data-testid={`badge-cert-status-${c.id}`}
                            style={{
                              padding: "3px 10px",
                              borderRadius: 12,
                              fontSize: 12,
                              fontWeight: 600,
                              background: cs.bg,
                              color: cs.text,
                            }}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", textAlign: "center" }}>
                          {c.status !== "Ativo" && (
                            <button
                              data-testid={`button-renovar-${c.id}`}
                              onClick={() => handleRenovar(c.numero)}
                              style={{
                                padding: "6px 14px",
                                borderRadius: 6,
                                border: "1px solid #2563EB",
                                background: "#EFF6FF",
                                color: "#2563EB",
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <RefreshCw style={{ width: 14, height: 14 }} />
                              Renovar
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Lista de Passageiros ANTT */}
        <section data-testid="section-lista-antt">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1e3a5f", display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
              <FileText style={{ width: 22, height: 22 }} />
              Lista de Passageiros ANTT
            </h2>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                data-testid="button-exportar-lista-antt"
                onClick={handleExportarListaANTT}
                style={{
                  padding: "8px 16px",
                  borderRadius: 6,
                  border: "none",
                  background: "#22C55E",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Download style={{ width: 16, height: 16 }} />
                Exportar Lista ANTT (Excel)
              </button>
              <button
                data-testid="button-imprimir-lista-antt"
                onClick={handleImprimir}
                style={{
                  padding: "8px 16px",
                  borderRadius: 6,
                  border: "1px solid #CBD5E1",
                  background: "#fff",
                  color: "#475569",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Printer style={{ width: 16, height: 16 }} />
                Imprimir
              </button>
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: 8, overflow: "hidden", border: "1px solid #E2E8F0" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ background: "#F1F5F9" }}>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#475569" }}>Assento</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#475569" }}>Nome</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#475569" }}>RG</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#475569" }}>CPF</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#475569" }}>Órgão Emissor</th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#475569" }}>Data Nascimento</th>
                  </tr>
                </thead>
                <tbody>
                  {passageirosMock.map((p) => (
                    <tr key={p.id} style={{ borderTop: "1px solid #E2E8F0" }} data-testid={`row-passageiro-${p.id}`}>
                      <td style={{ padding: "12px 16px", fontWeight: 700, color: "#2563EB", textAlign: "center" }}>{String(p.assento).padStart(2, "0")}</td>
                      <td style={{ padding: "12px 16px", fontWeight: 500, color: "#1e3a5f" }}>{p.nome}</td>
                      <td style={{ padding: "12px 16px", color: "#475569", fontFamily: "monospace" }}>{p.rg}</td>
                      <td style={{ padding: "12px 16px", color: "#475569", fontFamily: "monospace" }}>{p.cpf}</td>
                      <td style={{ padding: "12px 16px", color: "#475569" }}>{p.orgaoEmissor}</td>
                      <td style={{ padding: "12px 16px", color: "#475569" }}>{new Date(p.dataNascimento).toLocaleDateString("pt-BR")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Motoristas */}
        <section data-testid="section-motoristas">
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1e3a5f", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <User style={{ width: 22, height: 22 }} />
            Motoristas
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {motoristasMock.map((m) => {
              const ms = certStatusColors[m.status] || certStatusColors["Ativo"];
              const cnhDays = getDaysUntil(m.cnhValidade);
              const moppDays = getDaysUntil(m.moppValidade);
              return (
                <div
                  key={m.id}
                  data-testid={`card-motorista-${m.id}`}
                  style={{
                    background: "#fff",
                    borderRadius: 8,
                    border: "1px solid #E2E8F0",
                    padding: 20,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #1e3a5f, #2563EB)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 18,
                      }}
                    >
                      {m.nome.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e3a5f", margin: 0 }}>{m.nome}</h3>
                      <span
                        data-testid={`badge-motorista-status-${m.id}`}
                        style={{
                          padding: "2px 8px",
                          borderRadius: 10,
                          fontSize: 11,
                          fontWeight: 600,
                          background: ms.bg,
                          color: ms.text,
                        }}
                      >
                        {m.status}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#64748B" }}>CNH Categoria</span>
                      <span style={{ fontWeight: 600, color: "#1e3a5f" }}>{m.cnhCategoria}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#64748B" }}>CNH Validade</span>
                      <span style={{ fontWeight: 500, color: cnhDays < 0 ? "#EF4444" : cnhDays < 30 ? "#F59E0B" : "#166534", fontSize: 13 }}>
                        {new Date(m.cnhValidade).toLocaleDateString("pt-BR")}
                        {cnhDays < 30 && <AlertTriangle style={{ width: 14, height: 14, marginLeft: 4, display: "inline", verticalAlign: "middle" }} />}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#64748B" }}>MOPP Validade</span>
                      <span style={{ fontWeight: 500, color: moppDays < 0 ? "#EF4444" : moppDays < 30 ? "#F59E0B" : "#166534", fontSize: 13 }}>
                        {new Date(m.moppValidade).toLocaleDateString("pt-BR")}
                        {moppDays < 30 && <AlertTriangle style={{ width: 14, height: 14, marginLeft: 4, display: "inline", verticalAlign: "middle" }} />}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Simulador de Veículo */}
        <section data-testid="section-simulador">
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1e3a5f", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Calculator style={{ width: 22, height: 22 }} />
            Simulador de Veículo
          </h2>
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              border: "1px solid #E2E8F0",
              padding: 24,
              display: "flex",
              alignItems: "center",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: "#475569" }}>Quantidade de passageiros:</label>
              <input
                data-testid="input-simulador-passageiros"
                type="number"
                min={1}
                max={100}
                value={simuladorPassageiros}
                onChange={(e) => setSimuladorPassageiros(Math.max(1, parseInt(e.target.value) || 1))}
                style={{
                  width: 80,
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #CBD5E1",
                  fontSize: 16,
                  fontWeight: 600,
                  textAlign: "center",
                  color: "#1e3a5f",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 20px",
                borderRadius: 8,
                background: "linear-gradient(135deg, #1e3a5f, #2563EB)",
                color: "#fff",
              }}
            >
              <Truck style={{ width: 24, height: 24 }} />
              <div>
                <p style={{ fontSize: 12, opacity: 0.8, margin: 0 }}>Veículo recomendado</p>
                <p data-testid="text-sugestao-veiculo" style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
                  {getSugestaoVeiculo(simuladorPassageiros)}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { label: "Van", max: 15, icon: <Truck style={{ width: 16, height: 16 }} /> },
                { label: "Micro-ônibus", max: 28, icon: <Bus style={{ width: 16, height: 16 }} /> },
                { label: "Ônibus", max: 999, icon: <Bus style={{ width: 18, height: 18 }} /> },
              ].map((v) => {
                const isActive =
                  (v.label === "Van" && simuladorPassageiros <= 15) ||
                  (v.label === "Micro-ônibus" && simuladorPassageiros > 15 && simuladorPassageiros <= 28) ||
                  (v.label === "Ônibus" && simuladorPassageiros > 28);
                return (
                  <div
                    key={v.label}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 6,
                      border: isActive ? "2px solid #2563EB" : "1px solid #E2E8F0",
                      background: isActive ? "#EFF6FF" : "#F9FAFB",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 13,
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "#2563EB" : "#64748B",
                    }}
                  >
                    {v.icon}
                    {v.label}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
