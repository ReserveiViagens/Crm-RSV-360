import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Users,
  CreditCard,
  Receipt,
  Calculator,
  CheckCircle,
  Clock,
  AlertCircle,
  Percent,
  Building2,
  Wallet,
  BarChart3
} from "lucide-react";

interface Fornecedor {
  nome: string;
  valor: number;
  status: "Pago" | "Pendente";
}

interface PagamentoIndividual {
  id: string;
  passageiro: string;
  valor: number;
  metodo: "Pix" | "Cartão" | "Boleto";
  status: "Pago" | "Pendente" | "Atrasado";
  data: string;
}

export default function Financeiro() {
  const [simuladorQtd, setSimuladorQtd] = useState(1);

  const totalExcursao = 45000;
  const comissaoRSV = totalExcursao * 0.15;
  const repasseFornecedores = totalExcursao * 0.85;

  const fornecedores: Fornecedor[] = [
    { nome: "Hotel Termas DiRoma", valor: 18500, status: "Pago" },
    { nome: "Hot Park", valor: 12000, status: "Pago" },
    { nome: "Transporte Goiânia Tur", valor: 5800, status: "Pendente" },
    { nome: "Seguro GTA", valor: 1950, status: "Pago" },
  ];

  const descontos = [
    { min: 3, desconto: 5 },
    { min: 5, desconto: 8 },
    { min: 10, desconto: 15 },
    { min: 20, desconto: 25 },
  ];

  const pagamentos: PagamentoIndividual[] = [
    { id: "1", passageiro: "João Silva", valor: 1500, metodo: "Pix", status: "Pago", data: "2026-03-10" },
    { id: "2", passageiro: "Maria Santos", valor: 1500, metodo: "Cartão", status: "Pago", data: "2026-03-11" },
    { id: "3", passageiro: "Pedro Costa", valor: 1500, metodo: "Boleto", status: "Pendente", data: "2026-03-12" },
    { id: "4", passageiro: "Ana Oliveira", valor: 1500, metodo: "Pix", status: "Pago", data: "2026-03-13" },
    { id: "5", passageiro: "Carlos Mendes", valor: 1500, metodo: "Cartão", status: "Atrasado", data: "2026-03-05" },
    { id: "6", passageiro: "Fernanda Lima", valor: 1500, metodo: "Pix", status: "Pago", data: "2026-03-14" },
    { id: "7", passageiro: "Roberto Alves", valor: 1500, metodo: "Boleto", status: "Pendente", data: "2026-03-15" },
    { id: "8", passageiro: "Juliana Rocha", valor: 1500, metodo: "Cartão", status: "Pago", data: "2026-03-16" },
  ];

  const totalArrecadado = pagamentos.reduce((acc, p) => acc + (p.status === "Pago" ? p.valor : 0), 0);
  const mdr = totalArrecadado * 0.025;
  const iss = totalArrecadado * 0.05;
  const lucroLiquido = comissaoRSV - mdr - iss;

  const getDescontoAtual = (qtd: number) => {
    let desc = 0;
    for (const d of descontos) {
      if (qtd >= d.min) desc = d.desconto;
    }
    return desc;
  };

  const descontoAtual = getDescontoAtual(simuladorQtd);
  const valorBase = 1500;
  const valorComDesconto = valorBase * (1 - descontoAtual / 100);
  const economiaTotal = (valorBase - valorComDesconto) * simuladorQtd;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pago":
        return { bg: "#dcfce7", color: "#166534", icon: <CheckCircle style={{ width: 14, height: 14 }} /> };
      case "Pendente":
        return { bg: "#fef9c3", color: "#854d0e", icon: <Clock style={{ width: 14, height: 14 }} /> };
      case "Atrasado":
        return { bg: "#fecaca", color: "#991b1b", icon: <AlertCircle style={{ width: 14, height: 14 }} /> };
      default:
        return { bg: "#f3f4f6", color: "#374151", icon: null };
    }
  };

  const headerGradient = "linear-gradient(135deg, #1e3a5f, #2563EB)";

  return (
    <div data-testid="page-financeiro" style={{ minHeight: "100vh", background: "#F9FAFB" }}>
      <header
        data-testid="header-financeiro"
        style={{
          background: headerGradient,
          padding: "24px 32px",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Link href="/admin/dashboard" data-testid="link-voltar-dashboard">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#fff",
              cursor: "pointer",
              background: "rgba(255,255,255,0.15)",
              padding: "8px 16px",
              borderRadius: 8,
            }}
          >
            <ArrowLeft style={{ width: 20, height: 20 }} />
            <span style={{ fontSize: 14, fontWeight: 500 }}>Voltar</span>
          </div>
        </Link>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>Split de Pagamento e Estrutura Fiscal</h1>
          <p style={{ margin: "4px 0 0", opacity: 0.85, fontSize: 14 }}>
            Módulo 5 — Gestão financeira, splits e descontos progressivos
          </p>
        </div>
        <DollarSign style={{ width: 36, height: 36, opacity: 0.7 }} />
      </header>

      <div style={{ padding: "32px", display: "grid", gap: 32 }}>
        {/* SPLIT DE PAGAMENTO */}
        <section data-testid="section-split-pagamento">
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1e3a5f", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
            <Wallet style={{ width: 24, height: 24, color: "#2563EB" }} />
            Split de Pagamento
          </h2>

          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              marginBottom: 24,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
              <div
                data-testid="display-valor-total"
                style={{
                  background: "#1e3a5f",
                  color: "#fff",
                  padding: "16px 24px",
                  borderRadius: 10,
                  textAlign: "center",
                  minWidth: 160,
                }}
              >
                <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Valor Total</div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>R$ {totalExcursao.toLocaleString("pt-BR")}</div>
              </div>
              <div style={{ fontSize: 28, color: "#9ca3af", fontWeight: 300 }}>→</div>
              <div
                data-testid="display-comissao-rsv"
                style={{
                  background: "#2563EB",
                  color: "#fff",
                  padding: "16px 24px",
                  borderRadius: 10,
                  textAlign: "center",
                  minWidth: 160,
                }}
              >
                <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Comissão RSV (15%)</div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>R$ {comissaoRSV.toLocaleString("pt-BR")}</div>
              </div>
              <div style={{ fontSize: 28, color: "#9ca3af", fontWeight: 300 }}>→</div>
              <div
                data-testid="display-repasse-fornecedores"
                style={{
                  background: "#22C55E",
                  color: "#fff",
                  padding: "16px 24px",
                  borderRadius: 10,
                  textAlign: "center",
                  minWidth: 160,
                }}
              >
                <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Repasse Fornecedores (85%)</div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>R$ {repasseFornecedores.toLocaleString("pt-BR")}</div>
              </div>
            </div>

            <div
              data-testid="display-barra-split"
              style={{
                height: 32,
                borderRadius: 16,
                overflow: "hidden",
                display: "flex",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: "15%",
                  background: "#2563EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                15%
              </div>
              <div
                style={{
                  width: "85%",
                  background: "#22C55E",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                85%
              </div>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#374151", marginBottom: 12 }}>Fornecedores</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
              {fornecedores.map((f, i) => {
                const badge = getStatusBadge(f.status);
                return (
                  <div
                    key={i}
                    data-testid={`card-fornecedor-${i}`}
                    style={{
                      background: "#f9fafb",
                      border: "1px solid #e5e7eb",
                      borderRadius: 10,
                      padding: 16,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: "#1f2937", fontSize: 14 }}>{f.nome}</div>
                      <div style={{ color: "#6b7280", fontSize: 13, marginTop: 2 }}>
                        R$ {f.valor.toLocaleString("pt-BR")}
                      </div>
                    </div>
                    <span
                      data-testid={`badge-fornecedor-status-${i}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "4px 10px",
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                        background: badge.bg,
                        color: badge.color,
                      }}
                    >
                      {badge.icon}
                      {f.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* DESCONTOS PROGRESSIVOS */}
        <section data-testid="section-descontos-progressivos">
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1e3a5f", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
            <Percent style={{ width: 24, height: 24, color: "#F57C00" }} />
            Descontos Progressivos
          </h2>

          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: 12,
                marginBottom: 28,
              }}
            >
              {descontos.map((d, i) => (
                <div
                  key={i}
                  data-testid={`card-desconto-${d.min}`}
                  style={{
                    background: simuladorQtd >= d.min ? "#2563EB" : "#f3f4f6",
                    color: simuladorQtd >= d.min ? "#fff" : "#374151",
                    borderRadius: 10,
                    padding: "20px 16px",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    border: simuladorQtd >= d.min ? "2px solid #2563EB" : "2px solid #e5e7eb",
                  }}
                >
                  <div style={{ fontSize: 28, fontWeight: 800 }}>{d.desconto}%</div>
                  <div style={{ fontSize: 13, marginTop: 4, opacity: 0.85 }}>{d.min}+ pessoas</div>
                </div>
              ))}
            </div>

            <div
              style={{
                background: "#f0f9ff",
                borderRadius: 10,
                padding: 24,
                border: "1px solid #bae6fd",
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1e3a5f", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <Calculator style={{ width: 20, height: 20 }} />
                Simulador de Desconto
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <div>
                  <label
                    htmlFor="input-simulador-qtd"
                    style={{ fontSize: 13, color: "#6b7280", display: "block", marginBottom: 6 }}
                  >
                    Quantidade de pessoas
                  </label>
                  <input
                    id="input-simulador-qtd"
                    data-testid="input-simulador-qtd"
                    type="number"
                    min={1}
                    max={100}
                    value={simuladorQtd}
                    onChange={(e) => setSimuladorQtd(Math.max(1, parseInt(e.target.value) || 1))}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 8,
                      border: "1px solid #d1d5db",
                      fontSize: 16,
                      width: 120,
                      fontWeight: 600,
                    }}
                  />
                </div>
                <div style={{ fontSize: 28, color: "#9ca3af" }}>→</div>
                <div data-testid="display-desconto-resultado" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 10,
                      padding: "12px 20px",
                      border: "1px solid #e5e7eb",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: 12, color: "#6b7280" }}>Desconto</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#F57C00" }}>{descontoAtual}%</div>
                  </div>
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 10,
                      padding: "12px 20px",
                      border: "1px solid #e5e7eb",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: 12, color: "#6b7280" }}>Valor p/ pessoa</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#1e3a5f" }}>
                      R$ {valorComDesconto.toLocaleString("pt-BR")}
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 10,
                      padding: "12px 20px",
                      border: "1px solid #e5e7eb",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: 12, color: "#6b7280" }}>Economia total</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#22C55E" }}>
                      R$ {economiaTotal.toLocaleString("pt-BR")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PAGAMENTOS INDIVIDUAIS */}
        <section data-testid="section-pagamentos-individuais">
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1e3a5f", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
            <CreditCard style={{ width: 24, height: 24, color: "#2563EB" }} />
            Pagamentos Individuais
          </h2>

          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              overflow: "hidden",
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table data-testid="table-pagamentos" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f9fafb" }}>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Passageiro
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Valor
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Método
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Status
                    </th>
                    <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pagamentos.map((p) => {
                    const badge = getStatusBadge(p.status);
                    return (
                      <tr
                        key={p.id}
                        data-testid={`row-pagamento-${p.id}`}
                        style={{ borderTop: "1px solid #f3f4f6" }}
                      >
                        <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 500, color: "#1f2937" }}>
                          {p.passageiro}
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: 14, color: "#374151", fontWeight: 600 }}>
                          R$ {p.valor.toLocaleString("pt-BR")}
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: 14, color: "#6b7280" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              padding: "3px 10px",
                              borderRadius: 6,
                              background: "#f3f4f6",
                              fontSize: 12,
                              fontWeight: 500,
                            }}
                          >
                            {p.metodo === "Pix" && <Wallet style={{ width: 12, height: 12 }} />}
                            {p.metodo === "Cartão" && <CreditCard style={{ width: 12, height: 12 }} />}
                            {p.metodo === "Boleto" && <Receipt style={{ width: 12, height: 12 }} />}
                            {p.metodo}
                          </span>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span
                            data-testid={`badge-pagamento-status-${p.id}`}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              padding: "4px 10px",
                              borderRadius: 20,
                              fontSize: 12,
                              fontWeight: 600,
                              background: badge.bg,
                              color: badge.color,
                            }}
                          >
                            {badge.icon}
                            {p.status}
                          </span>
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280" }}>
                          {new Date(p.data).toLocaleDateString("pt-BR")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* RESUMO FISCAL */}
        <section data-testid="section-resumo-fiscal">
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1e3a5f", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
            <BarChart3 style={{ width: 24, height: 24, color: "#22C55E" }} />
            Resumo Fiscal
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div
              data-testid="card-total-arrecadado"
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 24,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                borderLeft: "4px solid #2563EB",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <DollarSign style={{ width: 20, height: 20, color: "#2563EB" }} />
                <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>Total Arrecadado</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#1e3a5f" }}>
                R$ {totalArrecadado.toLocaleString("pt-BR")}
              </div>
            </div>

            <div
              data-testid="card-mdr"
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 24,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                borderLeft: "4px solid #F57C00",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <CreditCard style={{ width: 20, height: 20, color: "#F57C00" }} />
                <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>MDR (Taxa Cartão 2,5%)</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#F57C00" }}>
                R$ {mdr.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div
              data-testid="card-iss"
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 24,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                borderLeft: "4px solid #ef4444",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <Building2 style={{ width: 20, height: 20, color: "#ef4444" }} />
                <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>ISS (5%)</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#ef4444" }}>
                R$ {iss.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div
              data-testid="card-lucro-liquido"
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 24,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                borderLeft: "4px solid #22C55E",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <TrendingUp style={{ width: 20, height: 20, color: "#22C55E" }} />
                <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>Lucro Líquido</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#22C55E" }}>
                R$ {lucroLiquido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          <div
            data-testid="display-barra-composicao-fiscal"
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#374151", marginBottom: 16 }}>
              Composição de Custos
            </h3>
            <div style={{ height: 40, borderRadius: 20, overflow: "hidden", display: "flex", marginBottom: 16 }}>
              {(() => {
                const total = comissaoRSV;
                const lucroPerc = (lucroLiquido / total) * 100;
                const mdrPerc = (mdr / total) * 100;
                const issPerc = (iss / total) * 100;
                return (
                  <>
                    <div
                      style={{
                        width: `${lucroPerc}%`,
                        background: "#22C55E",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      Lucro {lucroPerc.toFixed(1)}%
                    </div>
                    <div
                      style={{
                        width: `${mdrPerc}%`,
                        background: "#F57C00",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      MDR
                    </div>
                    <div
                      style={{
                        width: `${issPerc}%`,
                        background: "#ef4444",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      ISS
                    </div>
                  </>
                );
              })()}
            </div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: "#22C55E" }} />
                <span style={{ fontSize: 13, color: "#6b7280" }}>
                  Lucro Líquido: R$ {lucroLiquido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: "#F57C00" }} />
                <span style={{ fontSize: 13, color: "#6b7280" }}>
                  MDR: R$ {mdr.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: "#ef4444" }} />
                <span style={{ fontSize: 13, color: "#6b7280" }}>
                  ISS: R$ {iss.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
