import { ArrowLeft, Star, Gift, Trophy, ChevronRight, Loader2, Home, Search, CalendarDays, User } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";

const NIVEIS = [
  { nome: "Bronze", pontos: 0, cor: "#CD7F32", beneficios: ["Acúmulo de pontos em reservas", "Acesso ao catálogo de excursões"] },
  { nome: "Prata", pontos: 500, cor: "#C0C0C0", beneficios: ["5% de desconto em ingressos", "Prioridade no embarque", "Suporte prioritário"] },
  { nome: "Ouro", pontos: 2000, cor: "#FFD700", beneficios: ["10% de desconto em hotéis", "Upgrade de quarto (sujeito a disponibilidade)", "Acesso a ofertas exclusivas"] },
  { nome: "Diamante", pontos: 5000, cor: "#B9F2FF", beneficios: ["15% de desconto em tudo", "Ingresso VIP para parques", "Concierge exclusivo", "Brinde de boas-vindas"] },
];

const COMO_GANHAR = [
  { acao: "Reservar uma excursão", pontos: "+1 pt por R$ 1 gasto" },
  { acao: "Avaliar uma experiência", pontos: "+50 pts" },
  { acao: "Indicar um amigo", pontos: "+100 pts" },
  { acao: "Completar perfil", pontos: "+30 pts" },
  { acao: "Selfie de verificação", pontos: "+20 pts" },
];

export default function ProgramaFidelidadePage() {
  const { user, isLoading: authLoading } = useAuth();

  const { data: pontosData } = useQuery<{ pontos: number; streak: number }>({
    queryKey: ["/api/gamification/pontos"],
    enabled: !!user,
  });

  const pontos = pontosData?.pontos ?? 0;
  const nivelAtual = NIVEIS.filter((n) => pontos >= n.pontos).pop() ?? NIVEIS[0];
  const proximoNivel = NIVEIS[NIVEIS.indexOf(nivelAtual) + 1];

  if (authLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#F9FAFB" }}>
        <Loader2 style={{ width: 32, height: 32, color: "#2563EB", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  return (
    <div className="rsv-subpage" style={{ background: "#F9FAFB", minHeight: "100vh" }}>
      <div style={{
        background: "linear-gradient(135deg, #1e3a5f 0%, #2563EB 100%)",
        padding: "16px 16px 40px", color: "#fff",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <Link href="/perfil" style={{ color: "#fff", display: "flex" }}>
            <ArrowLeft style={{ width: 24, height: 24 }} data-testid="button-voltar-fidelidade" />
          </Link>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Programa de Fidelidade</h1>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🏆</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 4px" }} data-testid="text-nivel-atual">Nível {nivelAtual.nome}</h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", margin: 0 }}>
            {pontos.toLocaleString("pt-BR")} pontos acumulados
          </p>
        </div>
      </div>

      <div style={{ padding: "0 16px", marginTop: -20 }}>
        {proximoNivel && (
          <div style={{
            background: "#fff", borderRadius: 16, padding: 20, marginBottom: 16,
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#1F2937" }}>Próximo nível: {proximoNivel.nome}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#2563EB" }}>{pontos}/{proximoNivel.pontos}</span>
            </div>
            <div style={{ background: "#E5E7EB", borderRadius: 10, height: 10, overflow: "hidden" }}>
              <div
                data-testid="progress-nivel"
                style={{
                  height: "100%", borderRadius: 10,
                  background: "linear-gradient(90deg, #2563EB, #F57C00)",
                  width: `${Math.min((pontos / proximoNivel.pontos) * 100, 100)}%`,
                  transition: "width 0.5s ease",
                }}
              />
            </div>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: "8px 0 0", textAlign: "center" }}>
              Faltam {(proximoNivel.pontos - pontos).toLocaleString("pt-BR")} pontos
            </p>
          </div>
        )}

        <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: "0 0 16px" }}>Níveis de Fidelidade</h2>
          {NIVEIS.map((nivel, i) => {
            const ativo = nivel.nome === nivelAtual.nome;
            return (
              <div key={i} data-testid={`card-nivel-${nivel.nome.toLowerCase()}`} style={{
                padding: 14, borderRadius: 12, marginBottom: 10,
                background: ativo ? "linear-gradient(135deg, #FFF7ED, #FFEDD5)" : "#F9FAFB",
                border: ativo ? "1.5px solid #F57C00" : "1px solid #F3F4F6",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: nivel.cor, display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Star style={{ width: 16, height: 16, color: "#fff" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", margin: 0 }}>{nivel.nome}</h3>
                    <span style={{ fontSize: 11, color: "#6B7280" }}>{nivel.pontos.toLocaleString("pt-BR")}+ pontos</span>
                  </div>
                  {ativo && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#F57C00", background: "#FFF7ED", padding: "2px 10px", borderRadius: 8 }}>Atual</span>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingLeft: 42 }}>
                  {nivel.beneficios.map((b, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Gift style={{ width: 12, height: 12, color: "#9CA3AF", flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: "#6B7280" }}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: "0 0 16px" }}>Como ganhar pontos</h2>
          {COMO_GANHAR.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < COMO_GANHAR.length - 1 ? "1px solid #F3F4F6" : "none" }}>
              <span style={{ fontSize: 13, color: "#374151" }}>{item.acao}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#22C55E" }}>{item.pontos}</span>
            </div>
          ))}
        </div>

        {user && (
          <Link href="/minha-jornada" style={{ textDecoration: "none" }}>
            <div style={{
              background: "linear-gradient(135deg, #F57C00, #EF4444)", borderRadius: 16,
              padding: 20, marginBottom: 16, display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
            }}>
              <Trophy style={{ width: 28, height: 28, color: "#fff" }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: "0 0 2px" }}>Minha Jornada RSV</h3>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", margin: 0 }}>Veja suas conquistas e histórico completo</p>
              </div>
              <ChevronRight style={{ width: 20, height: 20, color: "rgba(255,255,255,0.6)" }} />
            </div>
          </Link>
        )}
      </div>

      <div style={{ height: 80 }} />

      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: 480, margin: "0 auto",
        background: "#fff", borderTop: "1px solid #E5E7EB",
        display: "flex", padding: "8px 0 12px", zIndex: 30,
      }}>
        {[
          { icon: Home, label: "Home", href: "/" },
          { icon: Search, label: "Busca", href: "/catalogo-excursoes" },
          { icon: CalendarDays, label: "Reservas", href: "/minhas-reservas" },
          { icon: User, label: "Perfil", href: "/perfil" },
        ].map((tab, i) => (
          <Link key={i} href={tab.href} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", gap: 2 }}>
            <tab.icon style={{ width: 22, height: 22, color: "#9CA3AF" }} />
            <span style={{ fontSize: 10, fontWeight: 500, color: "#9CA3AF" }}>{tab.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
