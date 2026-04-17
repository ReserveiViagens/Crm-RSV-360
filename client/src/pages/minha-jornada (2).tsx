import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Trophy, Flame, Gift, Clock, Rocket, Star, Target, Zap } from "lucide-react";
import { Link } from "wouter";
import { HomeHeader } from "@/components/home/HomeHeader"
import { HomeFooter } from "@/components/home/HomeFooter"
import { MobileCTABar } from "@/components/home/MobileCTABar"

type PontosData = { pontos: number; streak: number; nome: string };
type HistoricoItem = { data: string; motivo: string; valor: number };
type Conquista = { id: string; titulo: string; descricao: string; icone: string; desbloqueada: boolean };

const NIVEIS = [
  { nome: "Explorador", min: 0, max: 200, cor: "#6B7280", icone: "🌱" },
  { nome: "Aventureiro", min: 200, max: 500, cor: "#22C55E", icone: "🌿" },
  { nome: "Viajante", min: 500, max: 1000, cor: "#3B82F6", icone: "✈️" },
  { nome: "Embaixador", min: 1000, max: 2500, cor: "#8B5CF6", icone: "🌟" },
  { nome: "Lenda RSV", min: 2500, max: Infinity, cor: "#F59E0B", icone: "👑" },
]

function getNivel(pontos: number) {
  return NIVEIS.find(n => pontos >= n.min && pontos < n.max) ?? NIVEIS[NIVEIS.length - 1]
}

function getProgressoNivel(pontos: number) {
  const nivel = getNivel(pontos)
  if (nivel.max === Infinity) return 100
  const faixa = nivel.max - nivel.min
  const progresso = pontos - nivel.min
  return Math.min(Math.round((progresso / faixa) * 100), 100)
}

function getProximoNivel(pontos: number) {
  const idx = NIVEIS.findIndex(n => pontos >= n.min && pontos < n.max)
  return idx < NIVEIS.length - 1 ? NIVEIS[idx + 1] : null
}

const DESAFIOS = [
  { icon: Star, color: "#F59E0B", title: "Primeira Reserva", desc: "Faça sua primeira reserva e ganhe 50 pontos bônus.", acao: "Explorar viagens", href: "/", pts: 50 },
  { icon: Zap, color: "#2563EB", title: "Indique um Amigo", desc: "Indique alguém que reserve e ganhe 100 pontos.", acao: "Compartilhar link", href: "https://wa.me/5564993197555?text=Ol%C3%A1!%20Quero%20indicar%20um%20amigo%20para%20a%20RSV360!", pts: 100 },
  { icon: Target, color: "#22C55E", title: "Complete 3 Viagens", desc: "Viaje 3 vezes com a RSV e desbloqueie o selo Explorador.", acao: "Ver pacotes", href: "/ingressos", pts: 200 },
]

export default function MinhaJornadaPage() {
  const { user } = useAuth();

  const { data: pontosData, isLoading: loadingPontos } = useQuery<PontosData>({
    queryKey: ["/api/gamification/pontos"],
  });

  const { data: historicoData, isLoading: loadingHist } = useQuery<{ historico: HistoricoItem[] }>({
    queryKey: ["/api/gamification/historico"],
  });

  const { data: conquistasData, isLoading: loadingConq } = useQuery<{ conquistas: Conquista[] }>({
    queryKey: ["/api/gamification/conquistas"],
  });

  const pontos = pontosData?.pontos ?? 0;
  const streak = pontosData?.streak ?? 0;
  const historico = historicoData?.historico ?? [];
  const conquistas = conquistasData?.conquistas ?? [];
  const isLoading = loadingPontos || loadingHist || loadingConq;

  const nivel = getNivel(pontos);
  const progresso = getProgressoNivel(pontos);
  const proximoNivel = getProximoNivel(pontos);
  const conquistasDesbloqueadas = conquistas.filter(c => c.desbloqueada).length;

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }} data-testid="minha-jornada-loading">
        <Loader2 style={{ width: 32, height: 32, color: "#2563EB" }} className="animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ background: "#F9FAFB", minHeight: "100vh" }} data-testid="minha-jornada-page">
      <HomeHeader />
      <div style={{ height: 64 }} />

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>

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
          <span style={{ fontSize: 11, fontWeight: 700, color: "#F57C00", letterSpacing: 0.5 }}>MINHA JORNADA</span>
        </div>

        <div style={{
          width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "1px solid rgba(255,255,255,0.25)", margin: "0 auto 14px",
        }}>
          <Trophy size={26} style={{ color: "#F59E0B" }} />
        </div>

        <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 900, margin: "0 0 6px", lineHeight: 1.2 }}>
          {user ? `Olá, ${user.nome.split(" ")[0]}!` : "Comece sua Jornada"}
        </h1>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, margin: "0 0 24px", lineHeight: 1.5 }}>
          {user ? "Acompanhe seus pontos, conquistas e próximos desafios." : "Faça login para acompanhar seus pontos e conquistas."}
        </p>

        {/* Stats chips */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: "#F57C00" }}>{pontos.toLocaleString("pt-BR")}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>Pontos totais</div>
          </div>
          <div style={{ width: 1, background: "rgba(255,255,255,0.15)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: "#EF4444" }}>{streak}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>Sequência</div>
          </div>
          <div style={{ width: 1, background: "rgba(255,255,255,0.15)" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: "#22C55E" }}>{conquistasDesbloqueadas}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>Conquistas</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "28px 16px" }}>

        {/* BIG STAT CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          <div
            style={{
              borderRadius: 18, padding: "20px 16px", textAlign: "center",
              background: "linear-gradient(135deg, #FFF7ED, #FFEDD5)",
              boxShadow: "0 2px 8px rgba(245,124,0,0.12)",
            }}
            data-testid="card-saldo-pontos"
          >
            <div style={{ fontSize: 32, marginBottom: 6 }}>🪙</div>
            <p style={{ fontSize: 11, color: "#92400E", fontWeight: 600, margin: "0 0 4px" }}>Saldo de Pontos</p>
            <p style={{ fontSize: 32, fontWeight: 900, color: "#D97706", margin: 0 }}>
              {pontos.toLocaleString("pt-BR")}
            </p>
          </div>
          <div
            style={{
              borderRadius: 18, padding: "20px 16px", textAlign: "center",
              background: "linear-gradient(135deg, #FEF2F2, #FEE2E2)",
              boxShadow: "0 2px 8px rgba(239,68,68,0.12)",
            }}
            data-testid="card-streak"
          >
            <Flame style={{ width: 32, height: 32, margin: "0 auto 6px", display: "block", color: "#EF4444" }} />
            <p style={{ fontSize: 11, color: "#991B1B", fontWeight: 600, margin: "0 0 4px" }}>Sequência Consecutiva</p>
            <p style={{ fontSize: 32, fontWeight: 900, color: "#EF4444", margin: 0 }}>{streak}</p>
          </div>
        </div>

        {/* NÍVEL + BARRA DE PROGRESSO */}
        <div
          style={{
            background: "#fff", borderRadius: 18, padding: "20px 20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: 24,
          }}
          data-testid="card-nivel-progresso"
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${nivel.cor}18`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22,
              }}>{nivel.icone}</div>
              <div>
                <p style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500, margin: 0 }}>Nível atual</p>
                <p style={{ fontSize: 16, fontWeight: 800, color: "#1F2937", margin: 0 }}>{nivel.nome}</p>
              </div>
            </div>
            {proximoNivel && (
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 500, margin: 0 }}>Próximo nível</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: proximoNivel.cor, margin: 0 }}>
                  {proximoNivel.icone} {proximoNivel.nome}
                </p>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div style={{ background: "#F3F4F6", borderRadius: 8, height: 10, overflow: "hidden", marginBottom: 8 }}>
            <div style={{
              height: "100%", borderRadius: 8,
              background: `linear-gradient(90deg, ${nivel.cor}, ${proximoNivel?.cor ?? nivel.cor})`,
              width: `${progresso}%`,
              transition: "width 1s ease",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, color: "#6B7280" }}>{pontos.toLocaleString("pt-BR")} pts</span>
            {proximoNivel ? (
              <span style={{ fontSize: 11, color: "#6B7280" }}>
                Faltam {(proximoNivel.min - pontos).toLocaleString("pt-BR")} pts para {proximoNivel.nome}
              </span>
            ) : (
              <span style={{ fontSize: 11, color: "#F59E0B", fontWeight: 700 }}>Nível máximo! 🎉</span>
            )}
          </div>
        </div>

        {/* CONQUISTAS */}
        <div
          style={{
            background: "#fff", borderRadius: 18,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: 24,
          }}
          data-testid="section-conquistas"
        >
          <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: 8 }}>
            <Gift size={17} style={{ color: "#2563EB" }} />
            <span style={{ fontWeight: 800, fontSize: 15, color: "#1F2937" }}>Conquistas</span>
          </div>
          <div style={{ padding: "16px 16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {conquistas.map((c) => (
                <div
                  key={c.id}
                  data-testid={`conquista-${c.id}`}
                  style={{
                    borderRadius: 14, padding: "14px 8px", textAlign: "center",
                    border: c.desbloqueada ? "2px solid #F59E0B" : "2px solid #E5E7EB",
                    background: c.desbloqueada ? "linear-gradient(135deg,#FFFBEB,#FEF3C7)" : "#F9FAFB",
                    opacity: c.desbloqueada ? 1 : 0.55,
                    boxShadow: c.desbloqueada ? "0 2px 8px rgba(245,158,11,0.18)" : "none",
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{c.icone}</div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#1F2937", margin: "0 0 3px", lineHeight: 1.3 }}>{c.titulo}</p>
                  <p style={{ fontSize: 10, color: "#9CA3AF", margin: 0, lineHeight: 1.4 }}>{c.descricao}</p>
                  {c.desbloqueada && (
                    <div style={{
                      marginTop: 6, display: "inline-block",
                      background: "#F59E0B", color: "#fff",
                      borderRadius: 20, padding: "2px 8px",
                      fontSize: 9, fontWeight: 800,
                    }}>Desbloqueada</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PRÓXIMOS DESAFIOS */}
        <div style={{ marginBottom: 24 }} data-testid="section-proximos-desafios">
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1F2937", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Rocket size={18} style={{ color: "#2563EB" }} /> Próximos Desafios
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {DESAFIOS.map((d, i) => (
              <div
                key={i}
                data-testid={`desafio-${i}`}
                style={{
                  background: "#fff", borderRadius: 14, padding: "16px 16px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  display: "flex", alignItems: "center", gap: 14,
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: `${d.color}18`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <d.icon size={20} style={{ color: d.color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 13, color: "#1F2937", margin: "0 0 3px" }}>{d.title}</p>
                  <p style={{ fontSize: 11, color: "#6B7280", margin: 0, lineHeight: 1.4 }}>{d.desc}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 900, color: d.color, marginBottom: 6 }}>+{d.pts} pts</div>
                  {d.href.startsWith("http") ? (
                    <a
                      href={d.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid={`btn-desafio-${i}`}
                      style={{
                        display: "inline-block",
                        background: d.color, color: "#fff",
                        borderRadius: 8, padding: "6px 12px",
                        fontSize: 11, fontWeight: 700, textDecoration: "none",
                      }}
                    >
                      {d.acao}
                    </a>
                  ) : (
                    <Link
                      href={d.href}
                      data-testid={`btn-desafio-${i}`}
                      style={{
                        display: "inline-block",
                        background: d.color, color: "#fff",
                        borderRadius: 8, padding: "6px 12px",
                        fontSize: 11, fontWeight: 700, textDecoration: "none",
                      }}
                    >
                      {d.acao}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HISTÓRICO DE PONTOS */}
        <div
          style={{
            background: "#fff", borderRadius: 18,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: 24,
          }}
          data-testid="section-historico-pontos"
        >
          <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", gap: 8 }}>
            <Clock size={17} style={{ color: "#2563EB" }} />
            <span style={{ fontWeight: 800, fontSize: 15, color: "#1F2937" }}>Histórico de Pontos</span>
          </div>
          <div style={{ padding: "16px 20px" }}>
            {historico.length === 0 ? (
              <p style={{ fontSize: 13, color: "#9CA3AF", textAlign: "center", padding: "16px 0", margin: 0 }}>
                Nenhum ponto acumulado ainda. Faça sua primeira reserva!
              </p>
            ) : (
              <div style={{ position: "relative", paddingLeft: 28 }}>
                <div style={{
                  position: "absolute", left: 10, top: 8, bottom: 8,
                  width: 2, background: "linear-gradient(to bottom, #2563EB, #93C5FD)",
                  borderRadius: 2,
                }} />
                {historico.map((item, i) => (
                  <div
                    key={i}
                    data-testid={`historico-item-${i}`}
                    style={{
                      position: "relative",
                      display: "flex", alignItems: "flex-start", justifyContent: "space-between",
                      marginBottom: i < historico.length - 1 ? 16 : 0,
                    }}
                  >
                    <div style={{
                      position: "absolute", left: -22, top: 3,
                      width: 10, height: 10, borderRadius: "50%",
                      background: "#2563EB", border: "2px solid #fff",
                      boxShadow: "0 0 0 2px #2563EB",
                    }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#1F2937", margin: "0 0 2px" }}>{item.motivo}</p>
                      <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>
                        {new Date(item.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <span style={{
                      fontSize: 13, fontWeight: 900, color: "#D97706",
                      background: "#FEF3C7", borderRadius: 20,
                      padding: "2px 10px", marginLeft: 8, whiteSpace: "nowrap",
                    }}>+{item.valor} pts</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CTA FINAL */}
        <div style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #2563EB 100%)",
          borderRadius: 18, padding: "28px 20px", textAlign: "center",
          position: "relative", overflow: "hidden",
        }} data-testid="card-cta-pontos">
          <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          <Rocket style={{ width: 32, height: 32, color: "#F57C00", margin: "0 auto 10px", display: "block" }} />
          <p style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: "0 0 6px" }}>Acumule mais pontos!</p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", margin: "0 0 18px", lineHeight: 1.6 }}>
            Cada R$1 pago via PIX = 1 ponto. Viaje com a RSV360 e desbloqueie conquistas exclusivas.
          </p>
          <Link href="/" style={{ textDecoration: "none" }} data-testid="link-explorar-viagens">
            <button style={{
              background: "#F57C00", color: "#fff", border: "none",
              borderRadius: 10, padding: "12px 24px",
              fontWeight: 800, fontSize: 14, cursor: "pointer",
              boxShadow: "0 4px 14px rgba(245,124,0,0.35)",
            }}>
              🎒 Explorar viagens
            </button>
          </Link>
        </div>
      </div>

      <HomeFooter />
      <MobileCTABar />
    </div>
  );
}
