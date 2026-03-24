import { useQuery } from "@tanstack/react-query";
import { Loader2, Crown, Medal, Users, Trophy, BarChart3, Target, Star, Zap, TrendingUp, Award } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { HomeHeader } from "@/components/home/HomeHeader"
import { HomeFooter } from "@/components/home/HomeFooter"
import { MobileCTABar } from "@/components/home/MobileCTABar"

type RankingItem = { nome: string; vagas: number };

const PODIUM_COLORS = ["#F59E0B", "#9CA3AF", "#CD7F32"];
const PODIUM_ICONS = ["🥇", "🥈", "🥉"];
const TIER_LABELS = ["Ouro", "Prata", "Bronze"];
const TIER_BG = ["linear-gradient(135deg,#F59E0B,#D97706)", "linear-gradient(135deg,#9CA3AF,#6B7280)", "linear-gradient(135deg,#CD7F32,#92400E)"];

const BENEFICIOS = [
  { icon: TrendingUp, color: "#F59E0B", title: "Comissões Exclusivas", desc: "Ganhe até 15% de comissão por vaga vendida acima da meta mensal." },
  { icon: Award, color: "#2563EB", title: "Selo de Líder", desc: "Exiba o selo oficial no seu perfil e atraia mais passageiros." },
  { icon: Zap, color: "#22C55E", title: "Prioridade nas Vagas", desc: "Acesso antecipado a novas excursões antes de abrir para o público." },
  { icon: Star, color: "#8B5CF6", title: "Visibilidade no App", desc: "Seu nome aparece em destaque nos resultados de busca." },
]

export default function RankingOrganizadoresPage() {
  const { user } = useAuth();
  const isOrganizador = user?.role === "LIDER" || user?.role === "admin";
  const isAdmin = user?.role === "admin";

  const { data, isLoading } = useQuery<{ ranking: RankingItem[] }>({
    queryKey: ["/api/gamification/ranking-organizadores"],
  });

  const ranking = data?.ranking ?? [];

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }} data-testid="ranking-loading">
        <Loader2 style={{ width: 32, height: 32, color: "#2563EB" }} className="animate-spin" />
      </div>
    );
  }

  const podium = ranking.slice(0, 3);
  const restantes = ranking.slice(3);

  return (
    <div style={{ background: "#F9FAFB", minHeight: "100vh" }} data-testid="ranking-organizadores-page">
      <HomeHeader />
      <div style={{ height: 64 }} />

      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        @keyframes floatUp{0%{transform:translateY(8px);opacity:0}100%{transform:translateY(0);opacity:1}}
      `}</style>

      {/* HERO */}
      <div style={{
        background: "linear-gradient(135deg, #1e3a5f 0%, #2563EB 100%)",
        padding: "40px 16px 48px", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", bottom: -20, left: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />

        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(245,124,0,0.18)", border: "1px solid rgba(245,124,0,0.35)",
          borderRadius: 20, padding: "4px 12px", marginBottom: 14,
        }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#F57C00", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#F57C00", letterSpacing: 0.5 }}>RANKING • MÊS ATUAL</span>
        </div>

        <div style={{
          width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "1px solid rgba(255,255,255,0.25)", margin: "0 auto 14px",
        }}>
          <Crown size={26} style={{ color: "#F59E0B" }} />
        </div>

        <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 900, margin: "0 0 8px", lineHeight: 1.2 }}>
          Ranking de Organizadores
        </h1>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, margin: "0 0 20px", lineHeight: 1.5 }}>
          {ranking.length > 0
            ? `${ranking.length} organizador${ranking.length > 1 ? "es" : ""} participando este mês`
            : "Seja o primeiro a entrar no ranking este mês"}
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="https://wa.me/5564993197555?text=Ol%C3%A1!%20Quero%20participar%20do%20programa%20de%20lideran%C3%A7a%20da%20RSV360!"
            target="_blank" rel="noopener noreferrer"
            data-testid="button-quero-participar"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#F57C00", color: "#fff",
              borderRadius: 10, padding: "12px 22px",
              fontSize: 14, fontWeight: 700, textDecoration: "none",
              boxShadow: "0 4px 14px rgba(245,124,0,0.35)",
            }}
          >
            🚀 Quero participar
          </a>
          <Link
            href="/criar-excursao"
            data-testid="link-criar-excursao-hero"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.15)", color: "#fff",
              borderRadius: 10, padding: "12px 22px",
              fontSize: 14, fontWeight: 700, textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
          >
            + Nova excursão
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px" }}>

        {/* PODIUM */}
        {ranking.length === 0 ? (
          <div style={{
            background: "#fff", borderRadius: 16, padding: "48px 24px", textAlign: "center",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)", marginBottom: 32,
          }} data-testid="empty-ranking">
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
            <p style={{ fontWeight: 700, fontSize: 16, color: "#1F2937", marginBottom: 6 }}>Ranking ainda vazio este mês</p>
            <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 20 }}>Os dados aparecem quando houver reservas confirmadas. Crie sua primeira excursão e entre no ranking!</p>
            <Link href="/criar-excursao" data-testid="link-criar-excursao-empty">
              <button style={{
                background: "linear-gradient(135deg,#2563EB,#1E40AF)", color: "#fff",
                border: "none", borderRadius: 10, padding: "12px 24px",
                fontWeight: 700, fontSize: 14, cursor: "pointer",
              }}>
                Criar excursão agora
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Top 3 podium */}
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1F2937", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <Trophy size={18} style={{ color: "#F59E0B" }} /> Pódio do Mês
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {[0, 1, 2].map((i) => {
                  const item = podium[i]
                  return item ? (
                    <div
                      key={i}
                      data-testid={`podium-${i + 1}`}
                      style={{
                        background: i === 0 ? "linear-gradient(135deg,#FFFBEB,#FEF3C7)" : "#fff",
                        borderRadius: 16,
                        padding: "20px 12px",
                        textAlign: "center",
                        boxShadow: i === 0 ? "0 4px 16px rgba(245,158,11,0.25)" : "0 2px 8px rgba(0,0,0,0.06)",
                        border: i === 0 ? "2px solid #F59E0B" : "2px solid #E5E7EB",
                        position: "relative",
                      }}
                    >
                      <div style={{ fontSize: 32, marginBottom: 8 }}>{PODIUM_ICONS[i]}</div>
                      <div style={{
                        display: "inline-block",
                        background: TIER_BG[i],
                        borderRadius: 20, padding: "2px 10px",
                        fontSize: 10, fontWeight: 800, color: "#fff",
                        marginBottom: 8,
                      }}>{TIER_LABELS[i]}</div>
                      <p style={{ fontWeight: 700, fontSize: 13, color: "#1F2937", margin: "0 0 6px", wordBreak: "break-word" }}>{item.nome}</p>
                      <p style={{ fontSize: 24, fontWeight: 900, color: PODIUM_COLORS[i], margin: 0 }}>{item.vagas}</p>
                      <p style={{ fontSize: 10, color: "#9CA3AF", margin: 0 }}>vagas vendidas</p>
                    </div>
                  ) : (
                    <div
                      key={`empty-${i}`}
                      data-testid={`podium-empty-${i + 1}`}
                      style={{
                        background: "#fff", borderRadius: 16, padding: "20px 12px",
                        textAlign: "center", opacity: 0.35,
                        border: "2px dashed #E5E7EB",
                      }}
                    >
                      <div style={{ fontSize: 32, marginBottom: 8 }}>{PODIUM_ICONS[i]}</div>
                      <div style={{
                        display: "inline-block",
                        background: TIER_BG[i],
                        borderRadius: 20, padding: "2px 10px",
                        fontSize: 10, fontWeight: 800, color: "#fff",
                        marginBottom: 8,
                      }}>{TIER_LABELS[i]}</div>
                      <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>Vaga disponível</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Restantes */}
            {restantes.length > 0 && (
              <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: 28 }} data-testid="tabela-ranking-restantes">
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: 8 }}>
                  <Medal size={16} style={{ color: "#2563EB" }} />
                  <span style={{ fontWeight: 700, fontSize: 14, color: "#1F2937" }}>Posições 4–{3 + restantes.length}</span>
                </div>
                <div style={{ padding: "8px 12px" }}>
                  {restantes.map((item, i) => (
                    <div
                      key={i}
                      data-testid={`ranking-row-${i + 4}`}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "10px 8px", borderRadius: 10,
                        background: i % 2 === 0 ? "#F9FAFB" : "#fff",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontWeight: 800, fontSize: 13, color: "#9CA3AF", width: 24, textAlign: "center" }}>{i + 4}º</span>
                        <span style={{ fontWeight: 600, fontSize: 14, color: "#1F2937" }}>{item.nome}</span>
                      </div>
                      <span style={{ fontWeight: 800, fontSize: 14, color: "#2563EB" }}>{item.vagas} vagas</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* BENEFÍCIOS */}
        <div style={{ marginBottom: 28 }} data-testid="section-beneficios">
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1F2937", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Star size={18} style={{ color: "#F57C00" }} /> Benefícios do Programa
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {BENEFICIOS.map((b, i) => (
              <div
                key={i}
                data-testid={`beneficio-${i}`}
                style={{
                  background: "#fff", borderRadius: 14, padding: 16,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  borderLeft: `3px solid ${b.color}`,
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `${b.color}18`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 10,
                }}>
                  <b.icon size={18} style={{ color: b.color }} />
                </div>
                <p style={{ fontWeight: 700, fontSize: 13, color: "#1F2937", margin: "0 0 4px" }}>{b.title}</p>
                <p style={{ fontSize: 12, color: "#6B7280", margin: 0, lineHeight: 1.5 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ORGANIZADOR */}
        {isOrganizador && (
          <div style={{
            background: "linear-gradient(135deg,#FFFBEB,#FEF3C7)",
            borderRadius: 16, padding: 20, marginBottom: 16,
            border: "1px solid #FDE68A",
          }} data-testid="section-organizador-ranking">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Trophy size={18} style={{ color: "#F59E0B" }} />
              <span style={{ fontWeight: 800, fontSize: 15, color: "#92400E" }}>Área do Organizador</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link href="/organizer/metas" style={{ textDecoration: "none" }} data-testid="link-minhas-metas">
                <div style={{
                  display: "flex", alignItems: "center", gap: 12,
                  background: "#fff", borderRadius: 12, padding: "12px 16px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}>
                  <Target size={18} style={{ color: "#F59E0B" }} />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 13, color: "#1F2937", margin: 0 }}>Minhas Metas</p>
                    <p style={{ fontSize: 11, color: "#6B7280", margin: 0 }}>Acompanhe progresso e resgate recompensas</p>
                  </div>
                </div>
              </Link>
              <Link href="/criar-excursao" style={{ textDecoration: "none" }} data-testid="link-criar-excursao-ranking">
                <div style={{
                  display: "flex", alignItems: "center", gap: 12,
                  background: "#fff", borderRadius: 12, padding: "12px 16px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}>
                  <Users size={18} style={{ color: "#F59E0B" }} />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 13, color: "#1F2937", margin: 0 }}>Criar Nova Excursão</p>
                    <p style={{ fontSize: 11, color: "#6B7280", margin: 0 }}>Monte sua viagem e suba no ranking</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* ADMIN */}
        {isAdmin && (
          <div style={{
            background: "#FEF2F2", borderRadius: 16, padding: 20,
            border: "1px solid #FECACA", marginBottom: 16,
          }} data-testid="section-admin-ranking">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <BarChart3 size={18} style={{ color: "#EF4444" }} />
              <span style={{ fontWeight: 800, fontSize: 15, color: "#991B1B" }}>Painel Administrativo</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link href="/admin/super-financeiro" style={{ textDecoration: "none" }} data-testid="link-admin-financeiro-ranking">
                <div style={{
                  display: "flex", alignItems: "center", gap: 12,
                  background: "#fff", borderRadius: 12, padding: "12px 16px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}>
                  <BarChart3 size={18} style={{ color: "#EF4444" }} />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 13, color: "#1F2937", margin: 0 }}>Relatório Financeiro</p>
                    <p style={{ fontSize: 11, color: "#6B7280", margin: 0 }}>KPIs, gráficos e exportação CSV</p>
                  </div>
                </div>
              </Link>
              <Link href="/admin/dashboard" style={{ textDecoration: "none" }} data-testid="link-admin-painel-ranking">
                <div style={{
                  display: "flex", alignItems: "center", gap: 12,
                  background: "#fff", borderRadius: 12, padding: "12px 16px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}>
                  <Users size={18} style={{ color: "#EF4444" }} />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 13, color: "#1F2937", margin: 0 }}>Painel Admin Completo</p>
                    <p style={{ fontSize: 11, color: "#6B7280", margin: 0 }}>Gerenciar passageiros, excursões e mais</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>

      <HomeFooter />
      <MobileCTABar />
    </div>
  );
}
