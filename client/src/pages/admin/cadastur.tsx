import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Shield,
  Award,
  Clock,
  FileText,
  Building2,
  CreditCard,
  Globe,
  BadgeCheck,
  Landmark
} from "lucide-react";

interface ChecklistItem {
  id: number;
  title: string;
  description: string;
  status: "green" | "yellow" | "red";
  link: string;
  linkLabel: string;
  expanded: boolean;
}

interface PendingAction {
  id: number;
  title: string;
  description: string;
  priority: "alta" | "media" | "baixa";
  deadline: string;
}

const initialChecklist: ChecklistItem[] = [
  {
    id: 1,
    title: "CNAE 7911-2/00 atualizado no CNPJ",
    description:
      "O CNAE (Classificação Nacional de Atividades Econômicas) 7911-2/00 corresponde a 'Agências de viagens'. É obrigatório que este código esteja registrado no CNPJ da empresa junto à Receita Federal para operar legalmente como agência de turismo. Verifique no cartão CNPJ se o código principal ou secundário inclui esta classificação.",
    status: "green",
    link: "https://servicos.receita.fazenda.gov.br/servicos/cnpjreva/cnpjreva_solicitacao.asp",
    linkLabel: "Consultar CNPJ na Receita Federal",
    expanded: false,
  },
  {
    id: 2,
    title: "Cadastro no Cadastur como Agência de Turismo",
    description:
      "O Cadastur é o sistema de cadastro de pessoas físicas e jurídicas que atuam no setor de turismo. O registro como Agência de Turismo é obrigatório conforme a Lei 11.771/2008 (Lei Geral do Turismo). O cadastro deve ser renovado a cada 2 anos e garante o exercício legal da atividade.",
    status: "green",
    link: "https://cadastur.turismo.gov.br",
    linkLabel: "Acessar Cadastur",
    expanded: false,
  },
  {
    id: 3,
    title: "Atividade: Venda comissionada de viagens e excursões",
    description:
      "Esta atividade deve constar no objeto social da empresa e no registro do Cadastur. Inclui a intermediação e venda de pacotes turísticos, excursões, passagens aéreas e terrestres. A comissão é a principal forma de remuneração da agência nesta modalidade.",
    status: "green",
    link: "https://cadastur.turismo.gov.br",
    linkLabel: "Verificar atividades no Cadastur",
    expanded: false,
  },
  {
    id: 4,
    title: "Atividade: Intermediação de hospedagem",
    description:
      "Autorização para intermediar reservas em estabelecimentos hoteleiros. Esta atividade permite à agência negociar tarifas, fazer reservas e receber comissões dos hotéis parceiros. Deve estar registrada tanto no contrato social quanto no Cadastur.",
    status: "yellow",
    link: "https://cadastur.turismo.gov.br",
    linkLabel: "Atualizar atividades",
    expanded: false,
  },
  {
    id: 5,
    title: "Atividade: Venda de ingressos",
    description:
      "Permissão para comercializar ingressos de parques temáticos, atrações turísticas, shows e eventos. Requer acordos comerciais com os fornecedores e registro da atividade nos órgãos competentes. Inclui venda presencial e online.",
    status: "green",
    link: "https://cadastur.turismo.gov.br",
    linkLabel: "Verificar no Cadastur",
    expanded: false,
  },
  {
    id: 6,
    title: "Selo Cadastur ativo e visível no site",
    description:
      "O selo Cadastur deve estar visível no site da agência, preferencialmente no rodapé ou na página 'Sobre'. O selo comprova que a empresa está regularmente cadastrada no Ministério do Turismo e transmite confiança aos consumidores. Deve conter o número de registro e QR Code de verificação.",
    status: "yellow",
    link: "https://cadastur.turismo.gov.br/hotsite/#!/public/sou-cadastrado/inicio",
    linkLabel: "Baixar selo Cadastur",
    expanded: false,
  },
  {
    id: 7,
    title: "Fungetur consultado para linhas de crédito",
    description:
      "O FUNGETUR (Fundo Geral de Turismo) oferece linhas de crédito especiais para empresas do setor turístico cadastradas no Cadastur. As condições incluem taxas de juros reduzidas, prazos estendidos e carência. Consulte as linhas disponíveis para capital de giro, investimento e modernização.",
    status: "red",
    link: "https://www.gov.br/turismo/pt-br/acoes-e-programas/fungetur",
    linkLabel: "Consultar Fungetur",
    expanded: false,
  },
];

const pendingActions: PendingAction[] = [
  {
    id: 1,
    title: "Consultar linhas de crédito Fungetur",
    description:
      "Acessar o portal do Fungetur e verificar linhas disponíveis para agências de turismo em Goiás. Prazo para próxima chamada: março/2026.",
    priority: "alta",
    deadline: "15/03/2026",
  },
  {
    id: 2,
    title: "Atualizar selo Cadastur no site",
    description:
      "Baixar versão atualizada do selo e inserir no rodapé do site com link de verificação.",
    priority: "media",
    deadline: "30/01/2026",
  },
  {
    id: 3,
    title: "Registrar atividade de intermediação de hospedagem",
    description:
      "Adicionar formalmente a atividade de intermediação de hospedagem no registro do Cadastur.",
    priority: "media",
    deadline: "28/02/2026",
  },
  {
    id: 4,
    title: "Renovação do cadastro bienal",
    description:
      "Preparar documentação para renovação do Cadastur que vence em junho/2026.",
    priority: "baixa",
    deadline: "01/06/2026",
  },
];

export default function CadasturPage() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist);

  const completedCount = checklist.filter((i) => i.status === "green").length;
  const totalCount = checklist.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const toggleStatus = (id: number) => {
    setChecklist((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const order: Array<"green" | "yellow" | "red"> = ["red", "yellow", "green"];
        const currentIndex = order.indexOf(item.status);
        const nextStatus = order[(currentIndex + 1) % order.length];
        return { ...item, status: nextStatus };
      })
    );
  };

  const toggleExpand = (id: number) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, expanded: !item.expanded } : item
      )
    );
  };

  const getStatusIcon = (status: "green" | "yellow" | "red") => {
    switch (status) {
      case "green":
        return <CheckCircle style={{ width: 24, height: 24, color: "#22C55E" }} />;
      case "yellow":
        return <AlertTriangle style={{ width: 24, height: 24, color: "#F59E0B" }} />;
      case "red":
        return <XCircle style={{ width: 24, height: 24, color: "#EF4444" }} />;
    }
  };

  const getStatusLabel = (status: "green" | "yellow" | "red") => {
    switch (status) {
      case "green":
        return "Conforme";
      case "yellow":
        return "Em andamento";
      case "red":
        return "Pendente";
    }
  };

  const getStatusBg = (status: "green" | "yellow" | "red") => {
    switch (status) {
      case "green":
        return "#DCFCE7";
      case "yellow":
        return "#FEF9C3";
      case "red":
        return "#FEE2E2";
    }
  };

  const getStatusTextColor = (status: "green" | "yellow" | "red") => {
    switch (status) {
      case "green":
        return "#166534";
      case "yellow":
        return "#854D0E";
      case "red":
        return "#991B1B";
    }
  };

  const getPriorityStyle = (priority: "alta" | "media" | "baixa") => {
    switch (priority) {
      case "alta":
        return { bg: "#FEE2E2", color: "#991B1B", label: "Alta" };
      case "media":
        return { bg: "#FEF9C3", color: "#854D0E", label: "Média" };
      case "baixa":
        return { bg: "#DBEAFE", color: "#1E40AF", label: "Baixa" };
    }
  };

  const getItemIcon = (id: number) => {
    const icons = [Building2, Shield, CreditCard, Building2, FileText, Globe, Landmark];
    const Icon = icons[(id - 1) % icons.length];
    return <Icon style={{ width: 20, height: 20, color: "#6B7280" }} />;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB" }}>
      <header
        style={{
          background: "linear-gradient(135deg, #1e3a5f, #2563EB)",
          padding: "20px 24px",
          color: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/admin/dashboard">
              <button
                data-testid="button-back-dashboard"
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
                }}
              >
                <ArrowLeft style={{ width: 20, height: 20 }} />
                Voltar
              </button>
            </Link>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }} data-testid="text-page-title">
                Cadastur — Checklist de Conformidade
              </h1>
              <p style={{ margin: 0, fontSize: 14, opacity: 0.85 }}>
                Módulo 3 — Gestão de conformidade com o Cadastro Nacional de Turismo
              </p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.1)",
              borderRadius: 12,
              padding: "8px 16px",
            }}
          >
            <BadgeCheck style={{ width: 24, height: 24 }} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>Registro Cadastur Ativo</span>
          </div>
        </div>
      </header>

      <div style={{ padding: "24px", maxWidth: 1200, margin: "0 auto" }}>
        <div
          data-testid="progress-bar-section"
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 24,
            marginBottom: 24,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" }}>
                Progresso de Conformidade
              </h2>
              <p style={{ margin: "4px 0 0", fontSize: 14, color: "#6B7280" }}>
                {completedCount}/{totalCount} itens completos — {progressPercent}% concluído
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#22C55E" }} />
                <span style={{ fontSize: 13, color: "#6B7280" }}>Conforme</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#F59E0B" }} />
                <span style={{ fontSize: 13, color: "#6B7280" }}>Em andamento</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#EF4444" }} />
                <span style={{ fontSize: 13, color: "#6B7280" }}>Pendente</span>
              </div>
            </div>
          </div>

          <div
            style={{
              width: "100%",
              height: 12,
              background: "#E5E7EB",
              borderRadius: 6,
              overflow: "hidden",
            }}
          >
            <div
              data-testid="progress-bar-fill"
              style={{
                width: `${progressPercent}%`,
                height: "100%",
                background:
                  progressPercent === 100
                    ? "#22C55E"
                    : progressPercent >= 70
                    ? "#2563EB"
                    : "#F59E0B",
                borderRadius: 6,
                transition: "width 0.5s ease",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <Shield style={{ width: 24, height: 24, color: "#2563EB" }} />
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>
            Checklist de Conformidade
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
          {checklist.map((item) => (
            <div
              key={item.id}
              data-testid={`checklist-item-${item.id}`}
              style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                overflow: "hidden",
                borderLeft: `4px solid ${
                  item.status === "green"
                    ? "#22C55E"
                    : item.status === "yellow"
                    ? "#F59E0B"
                    : "#EF4444"
                }`,
              }}
            >
              <div
                style={{
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                <button
                  data-testid={`toggle-status-${item.id}`}
                  onClick={() => toggleStatus(item.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 4,
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                  title={`Status: ${getStatusLabel(item.status)}. Clique para alterar.`}
                >
                  {getStatusIcon(item.status)}
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  {getItemIcon(item.id)}
                </div>

                <div style={{ flex: 1, minWidth: 200 }}>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 15,
                      fontWeight: 600,
                      color: "#111827",
                    }}
                  >
                    {item.title}
                  </h3>
                  <span
                    data-testid={`status-badge-${item.id}`}
                    style={{
                      display: "inline-block",
                      marginTop: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "2px 10px",
                      borderRadius: 999,
                      background: getStatusBg(item.status),
                      color: getStatusTextColor(item.status),
                    }}
                  >
                    {getStatusLabel(item.status)}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`link-external-${item.id}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 13,
                      color: "#2563EB",
                      textDecoration: "none",
                    }}
                  >
                    <ExternalLink style={{ width: 14, height: 14 }} />
                    {item.linkLabel}
                  </a>

                  <button
                    data-testid={`toggle-expand-${item.id}`}
                    onClick={() => toggleExpand(item.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 4,
                      color: "#6B7280",
                      display: "flex",
                      alignItems: "center",
                    }}
                    title={item.expanded ? "Recolher" : "Expandir"}
                  >
                    {item.expanded ? (
                      <ChevronUp style={{ width: 20, height: 20 }} />
                    ) : (
                      <ChevronDown style={{ width: 20, height: 20 }} />
                    )}
                  </button>
                </div>
              </div>

              {item.expanded && (
                <div
                  data-testid={`description-${item.id}`}
                  style={{
                    padding: "0 20px 16px 64px",
                    fontSize: 14,
                    color: "#4B5563",
                    lineHeight: 1.6,
                    borderTop: "1px solid #F3F4F6",
                    paddingTop: 12,
                  }}
                >
                  {item.description}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <Clock style={{ width: 24, height: 24, color: "#F57C00" }} />
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>
            Próximas Ações
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
            marginBottom: 32,
          }}
        >
          {pendingActions.map((action) => {
            const prStyle = getPriorityStyle(action.priority);
            return (
              <div
                key={action.id}
                data-testid={`pending-action-${action.id}`}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: 20,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 12,
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#111827" }}>
                    {action.title}
                  </h3>
                  <span
                    data-testid={`priority-badge-${action.id}`}
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "2px 10px",
                      borderRadius: 999,
                      background: prStyle.bg,
                      color: prStyle.color,
                      textTransform: "uppercase",
                    }}
                  >
                    {prStyle.label}
                  </span>
                </div>
                <p style={{ margin: "0 0 12px", fontSize: 13, color: "#6B7280", lineHeight: 1.5 }}>
                  {action.description}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#9CA3AF" }}>
                  <Clock style={{ width: 14, height: 14 }} />
                  Prazo: {action.deadline}
                </div>
              </div>
            );
          })}
        </div>

        <div
          data-testid="selo-cadastur"
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 24,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #1e3a5f, #2563EB)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <Award style={{ width: 40, height: 40, marginBottom: 4 }} />
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                Cadastur
              </span>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" }}>
                Selo Cadastur Verificado
              </h3>
              <p style={{ margin: "4px 0 0", fontSize: 14, color: "#6B7280" }}>
                Registro n.º 26.123.456/0001-78 — Ministério do Turismo
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 13, color: "#9CA3AF" }}>
                Válido até 30/06/2026
              </p>
            </div>
            <a
              href="https://cadastur.turismo.gov.br"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-verify-selo"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginTop: 8,
                padding: "8px 20px",
                background: "#2563EB",
                color: "#fff",
                borderRadius: 8,
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              <ExternalLink style={{ width: 16, height: 16 }} />
              Verificar Autenticidade
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
