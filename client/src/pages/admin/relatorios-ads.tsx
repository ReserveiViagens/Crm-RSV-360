import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Target,
  MousePointerClick,
  Eye,
  Zap,
  Lightbulb,
  BarChart3,
  Share2,
  Heart,
  Play
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

type TabKey = "google" | "meta" | "tiktok";

const googleCtrData = [
  { dia: "Seg", ctr: 6.2 },
  { dia: "Ter", ctr: 7.1 },
  { dia: "Qua", ctr: 5.8 },
  { dia: "Qui", ctr: 8.3 },
  { dia: "Sex", ctr: 9.1 },
  { dia: "Sáb", ctr: 7.5 },
  { dia: "Dom", ctr: 6.9 }
];

const googleCampaigns = [
  { nome: "Caldas Novas - Hotéis", cliques: 1240, impressoes: 18500, ctr: "6.7%", conversoes: 89 },
  { nome: "Pacotes Família", cliques: 980, impressoes: 14200, ctr: "6.9%", conversoes: 72 },
  { nome: "Hot Park Ingressos", cliques: 1560, impressoes: 21000, ctr: "7.4%", conversoes: 134 },
  { nome: "Excursões Grupo", cliques: 720, impressoes: 11800, ctr: "6.1%", conversoes: 48 },
  { nome: "Remarketing Geral", cliques: 890, impressoes: 9500, ctr: "9.4%", conversoes: 177 }
];

const metaWeeklyData = [
  { semana: "Sem 1", gastos: 2450, retorno: 22800 },
  { semana: "Sem 2", gastos: 2380, retorno: 28500 },
  { semana: "Sem 3", gastos: 2520, retorno: 31200 },
  { semana: "Sem 4", gastos: 2450, retorno: 26700 }
];

const metaAds = [
  { nome: "Carrossel Hotéis Premium", impressoes: 145000, cliques: 4200, ctr: "2.9%", conversoes: 380 },
  { nome: "Vídeo Hot Park 15s", impressoes: 220000, cliques: 6800, ctr: "3.1%", conversoes: 520 },
  { nome: "Stories Promoção Flash", impressoes: 98000, cliques: 3100, ctr: "3.2%", conversoes: 290 },
  { nome: "Reels Caldas Novas", impressoes: 310000, cliques: 8400, ctr: "2.7%", conversoes: 640 },
  { nome: "Lookalike Viajantes", impressoes: 180000, cliques: 5200, ctr: "2.9%", conversoes: 410 }
];

const tiktokViewsData = [
  { dia: "Seg", views: 12400 },
  { dia: "Ter", views: 15800 },
  { dia: "Qua", views: 11200 },
  { dia: "Qui", views: 18900 },
  { dia: "Sex", views: 22100 },
  { dia: "Sáb", views: 8600 },
  { dia: "Dom", views: 3400 }
];

const tiktokVideos = [
  { nome: "Tour Caldas Novas em 60s", views: 45200, likes: 3200, shares: 890, conversoes: 124 },
  { nome: "Top 5 Hotéis com Piscina", views: 38900, likes: 2800, shares: 720, conversoes: 98 },
  { nome: "Hot Park Vale a Pena?", views: 62100, likes: 5100, shares: 1340, conversoes: 210 },
  { nome: "Dicas Viagem em Grupo", views: 28400, likes: 1900, shares: 450, conversoes: 67 },
  { nome: "Antes e Depois Resort", views: 31800, likes: 2400, shares: 610, conversoes: 89 }
];

const recommendations = [
  {
    title: "Escalar criativos com CTR > 8%",
    description: "Campanhas de remarketing e Hot Park apresentam CTR acima de 8%. Recomenda-se aumentar o orçamento dessas campanhas em 30% para maximizar conversões.",
    priority: "alta"
  },
  {
    title: "Testar A/B de thumbnails no TikTok",
    description: "Os vídeos com thumbnails mostrando pessoas têm 2.3x mais views. Criar variações de thumbnail para os 3 vídeos de menor performance.",
    priority: "media"
  },
  {
    title: "Priorizar remarketing no Meta Ads",
    description: "O público de remarketing converte 4.2x mais que público frio. Alocar 40% do orçamento Meta para campanhas de remarketing.",
    priority: "alta"
  },
  {
    title: "Expandir para YouTube Shorts",
    description: "Conteúdos curtos de viagem têm alta performance. Reaproveitar os melhores TikToks como YouTube Shorts para ampliar alcance sem custo adicional.",
    priority: "media"
  }
];

export default function RelatoriosAds() {
  const [activeTab, setActiveTab] = useState<TabKey>("google");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "google", label: "Google Ads" },
    { key: "meta", label: "Meta Ads" },
    { key: "tiktok", label: "TikTok Ads" }
  ];

  const headerStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #1e3a5f, #2563EB)",
    padding: "24px 32px",
    color: "#fff"
  };

  const cardStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: 8,
    padding: 20,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
  };

  const metricCardStyle = (color: string): React.CSSProperties => ({
    ...cardStyle,
    borderLeft: `4px solid ${color}`
  });

  const tabBtnStyle = (isActive: boolean): React.CSSProperties => ({
    padding: "10px 24px",
    border: "none",
    borderBottom: isActive ? "3px solid #2563EB" : "3px solid transparent",
    background: isActive ? "#EFF6FF" : "transparent",
    color: isActive ? "#2563EB" : "#6B7280",
    fontWeight: isActive ? 600 : 400,
    cursor: "pointer",
    fontSize: 14,
    transition: "all 0.2s"
  });

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: 14
  };

  const thStyle: React.CSSProperties = {
    textAlign: "left",
    padding: "12px 16px",
    borderBottom: "2px solid #E5E7EB",
    color: "#6B7280",
    fontWeight: 600,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.05em"
  };

  const tdStyle: React.CSSProperties = {
    padding: "12px 16px",
    borderBottom: "1px solid #F3F4F6",
    color: "#111827"
  };

  const priorityBadge = (priority: string): React.CSSProperties => ({
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 600,
    background: priority === "alta" ? "#FEE2E2" : "#FEF3C7",
    color: priority === "alta" ? "#DC2626" : "#D97706"
  });

  return (
    <div data-testid="page-relatorios-ads" style={{ minHeight: "100vh", background: "#F9FAFB" }}>
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
          <Link href="/admin/dashboard" data-testid="link-back-dashboard">
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff", cursor: "pointer", textDecoration: "none" }}>
              <ArrowLeft style={{ width: 20, height: 20 }} />
              <span style={{ fontSize: 14 }}>Voltar ao Dashboard</span>
            </div>
          </Link>
        </div>
        <h1 data-testid="text-page-title" style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
          Relatórios de Ads
        </h1>
        <p style={{ fontSize: 14, opacity: 0.85, marginTop: 4 }}>
          Performance de campanhas publicitárias por plataforma
        </p>
      </div>

      <div style={{ padding: "24px 32px" }}>
        <div style={{ display: "flex", borderBottom: "1px solid #E5E7EB", marginBottom: 24 }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              data-testid={`tab-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              style={tabBtnStyle(activeTab === tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "google" && (
          <div data-testid="panel-google-ads">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
              <div style={metricCardStyle("#2563EB")} data-testid="metric-google-orcamento">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <DollarSign style={{ width: 18, height: 18, color: "#2563EB" }} />
                  <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>Orçamento</span>
                </div>
                <p style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>R$ 1.680</p>
              </div>
              <div style={metricCardStyle("#22C55E")} data-testid="metric-google-leads">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <Target style={{ width: 18, height: 18, color: "#22C55E" }} />
                  <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>Leads</span>
                </div>
                <p style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>520</p>
              </div>
              <div style={metricCardStyle("#F57C00")} data-testid="metric-google-cpl">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <MousePointerClick style={{ width: 18, height: 18, color: "#F57C00" }} />
                  <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>CPL</span>
                </div>
                <p style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>R$ 3,23</p>
              </div>
              <div style={metricCardStyle("#7C3AED")} data-testid="metric-google-roas">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <TrendingUp style={{ width: 18, height: 18, color: "#7C3AED" }} />
                  <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>ROAS</span>
                </div>
                <p style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>23,4x</p>
              </div>
            </div>

            <div style={{ ...cardStyle, marginBottom: 24 }}>
              <h3 data-testid="text-google-chart-title" style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 16 }}>
                CTR por Dia (Últimos 7 dias)
              </h3>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={googleCtrData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} unit="%" />
                    <Tooltip formatter={(value: number) => [`${value}%`, "CTR"]} />
                    <Line type="monotone" dataKey="ctr" stroke="#2563EB" strokeWidth={2} dot={{ fill: "#2563EB", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={cardStyle}>
              <h3 data-testid="text-google-campaigns-title" style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 16 }}>
                Campanhas
              </h3>
              <div style={{ overflowX: "auto" }}>
                <table style={tableStyle} data-testid="table-google-campaigns">
                  <thead>
                    <tr>
                      <th style={thStyle}>Campanha</th>
                      <th style={thStyle}>Cliques</th>
                      <th style={thStyle}>Impressões</th>
                      <th style={thStyle}>CTR</th>
                      <th style={thStyle}>Conversões</th>
                    </tr>
                  </thead>
                  <tbody>
                    {googleCampaigns.map((c, i) => (
                      <tr key={i} data-testid={`row-google-campaign-${i}`}>
                        <td style={{ ...tdStyle, fontWeight: 500 }}>{c.nome}</td>
                        <td style={tdStyle}>{c.cliques.toLocaleString("pt-BR")}</td>
                        <td style={tdStyle}>{c.impressoes.toLocaleString("pt-BR")}</td>
                        <td style={tdStyle}>{c.ctr}</td>
                        <td style={tdStyle}>
                          <span style={{ fontWeight: 600, color: "#22C55E" }}>{c.conversoes}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "meta" && (
          <div data-testid="panel-meta-ads">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
              <div style={metricCardStyle("#2563EB")} data-testid="metric-meta-orcamento">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <DollarSign style={{ width: 18, height: 18, color: "#2563EB" }} />
                  <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>Orçamento</span>
                </div>
                <p style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>R$ 9.800</p>
              </div>
              <div style={metricCardStyle("#22C55E")} data-testid="metric-meta-leads">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <Target style={{ width: 18, height: 18, color: "#22C55E" }} />
                  <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>Leads</span>
                </div>
                <p style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>4.680</p>
              </div>
              <div style={metricCardStyle("#F57C00")} data-testid="metric-meta-cpl">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <MousePointerClick style={{ width: 18, height: 18, color: "#F57C00" }} />
                  <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>CPL</span>
                </div>
                <p style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>R$ 2,09</p>
              </div>
              <div style={metricCardStyle("#7C3AED")} data-testid="metric-meta-roas">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <TrendingUp style={{ width: 18, height: 18, color: "#7C3AED" }} />
                  <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>ROAS</span>
                </div>
                <p style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>36,1x</p>
              </div>
            </div>

            <div style={{ ...cardStyle, marginBottom: 24 }}>
              <h3 data-testid="text-meta-chart-title" style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 16 }}>
                Gastos vs Retorno por Semana
              </h3>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={metaWeeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="semana" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, ""]} />
                    <Legend />
                    <Bar dataKey="gastos" name="Gastos" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="retorno" name="Retorno" fill="#22C55E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={cardStyle}>
              <h3 data-testid="text-meta-ads-title" style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 16 }}>
                Anúncios
              </h3>
              <div style={{ overflowX: "auto" }}>
                <table style={tableStyle} data-testid="table-meta-ads">
                  <thead>
                    <tr>
                      <th style={thStyle}>Anúncio</th>
                      <th style={thStyle}>Impressões</th>
                      <th style={thStyle}>Cliques</th>
                      <th style={thStyle}>CTR</th>
                      <th style={thStyle}>Conversões</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metaAds.map((a, i) => (
                      <tr key={i} data-testid={`row-meta-ad-${i}`}>
                        <td style={{ ...tdStyle, fontWeight: 500 }}>{a.nome}</td>
                        <td style={tdStyle}>{a.impressoes.toLocaleString("pt-BR")}</td>
                        <td style={tdStyle}>{a.cliques.toLocaleString("pt-BR")}</td>
                        <td style={tdStyle}>{a.ctr}</td>
                        <td style={tdStyle}>
                          <span style={{ fontWeight: 600, color: "#22C55E" }}>{a.conversoes}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tiktok" && (
          <div data-testid="panel-tiktok-ads">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
              <div style={metricCardStyle("#2563EB")} data-testid="metric-tiktok-alcance">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <Eye style={{ width: 18, height: 18, color: "#2563EB" }} />
                  <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>Alcance</span>
                </div>
                <p style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>92,4K</p>
              </div>
              <div style={metricCardStyle("#22C55E")} data-testid="metric-tiktok-cliques">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <MousePointerClick style={{ width: 18, height: 18, color: "#22C55E" }} />
                  <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>Cliques</span>
                </div>
                <p style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>3.840</p>
              </div>
              <div style={metricCardStyle("#F57C00")} data-testid="metric-tiktok-cpl">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <DollarSign style={{ width: 18, height: 18, color: "#F57C00" }} />
                  <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>CPL</span>
                </div>
                <p style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>R$ 3,05</p>
              </div>
            </div>

            <div style={{ ...cardStyle, marginBottom: 24 }}>
              <h3 data-testid="text-tiktok-chart-title" style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 16 }}>
                Views por Dia
              </h3>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={tiktokViewsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value: number) => [value.toLocaleString("pt-BR"), "Views"]} />
                    <Line type="monotone" dataKey="views" stroke="#000000" strokeWidth={2} dot={{ fill: "#000000", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={cardStyle}>
              <h3 data-testid="text-tiktok-videos-title" style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 16 }}>
                Vídeos
              </h3>
              <div style={{ overflowX: "auto" }}>
                <table style={tableStyle} data-testid="table-tiktok-videos">
                  <thead>
                    <tr>
                      <th style={thStyle}>Vídeo</th>
                      <th style={thStyle}>Views</th>
                      <th style={thStyle}>Likes</th>
                      <th style={thStyle}>Shares</th>
                      <th style={thStyle}>Conversões</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tiktokVideos.map((v, i) => (
                      <tr key={i} data-testid={`row-tiktok-video-${i}`}>
                        <td style={{ ...tdStyle, fontWeight: 500 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Play style={{ width: 14, height: 14, color: "#6B7280" }} />
                            {v.nome}
                          </div>
                        </td>
                        <td style={tdStyle}>{v.views.toLocaleString("pt-BR")}</td>
                        <td style={tdStyle}>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <Heart style={{ width: 12, height: 12, color: "#EF4444" }} />
                            {v.likes.toLocaleString("pt-BR")}
                          </div>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <Share2 style={{ width: 12, height: 12, color: "#2563EB" }} />
                            {v.shares.toLocaleString("pt-BR")}
                          </div>
                        </td>
                        <td style={tdStyle}>
                          <span style={{ fontWeight: 600, color: "#22C55E" }}>{v.conversoes}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div style={{ ...cardStyle, marginTop: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg, #7C3AED, #2563EB)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Lightbulb style={{ width: 20, height: 20, color: "#fff" }} />
            </div>
            <h3 data-testid="text-recommendations-title" style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>
              Recomendações IA
            </h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {recommendations.map((rec, i) => (
              <div
                key={i}
                data-testid={`card-recommendation-${i}`}
                style={{
                  padding: 16,
                  borderRadius: 8,
                  border: "1px solid #E5E7EB",
                  background: "#FAFAFA"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Zap style={{ width: 16, height: 16, color: "#F57C00" }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{rec.title}</span>
                  </div>
                  <span style={priorityBadge(rec.priority)}>
                    {rec.priority === "alta" ? "Alta" : "Média"}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.5, margin: 0 }}>
                  {rec.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
