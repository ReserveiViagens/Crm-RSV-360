import { ArrowLeft, User, Star, MapPin, Settings, ChevronRight, Shield, Award, Bell, LogOut, Home, Search, CalendarDays, Mail, Phone, Loader2 } from "lucide-react"
import { Link } from "wouter";
import { useAuth, useLogout } from "@/hooks/use-auth";

const RESERVATIONS = [
  { id: 1, hotel: "Resort Termas Paradise", dates: "13/05/2026", status: "Confirmada", location: "Caldas Novas" },
  { id: 2, hotel: "Hot Park - Ingresso Família", dates: "15/05/2026", status: "Pendente", location: "Rio Quente" },
];

const MENU_ITEMS = [
  { icon: CalendarDays, label: "Minhas Reservas", href: "#", badge: "2" },
  { icon: Star, label: "Avaliações", href: "#" },
  { icon: Award, label: "Programa de Fidelidade", href: "#" },
  { icon: Bell, label: "Notificações", href: "#", badge: "3" },
  { icon: Shield, label: "Privacidade e Segurança", href: "/politica-de-privacidade" },
  { icon: Settings, label: "Configurações", href: "#" },
];

export default function PerfilPage() {
  const { user, isLoading } = useAuth();
  const logout = useLogout();

  const displayName = user?.nome ?? "Visitante";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="rsv-subpage" style={{ background: "#F9FAFB", minHeight: "100vh" }}>
      <div style={{
        background: "linear-gradient(135deg, #1e3a5f 0%, #2563EB 100%)",
        padding: "16px 16px 40px", color: "#fff", position: "relative",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <Link href="/" style={{ color: "#fff", display: "flex" }}>
            <ArrowLeft style={{ width: 24, height: 24 }} />
          </Link>
          <span style={{ fontSize: 16, fontWeight: 900 }}>RSV<span style={{ color: "#F57C00" }}>360</span></span>
          <button style={{
            width: 32, height: 32, borderRadius: "50%", border: "none",
            background: "rgba(255,255,255,0.15)", color: "#fff", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Settings style={{ width: 16, height: 16 }} />
          </button>
        </div>

        <div style={{ textAlign: "center" }}>
          {isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
              <Loader2 style={{ width: 32, height: 32, color: "rgba(255,255,255,0.6)", animation: "spin 1s linear infinite" }} />
            </div>
          ) : (
            <>
              <div style={{
                width: 80, height: 80, borderRadius: "50%", margin: "0 auto 12px",
                background: user ? "linear-gradient(135deg, #F57C00, #EF4444)" : "rgba(255,255,255,0.2)",
                border: "3px solid rgba(255,255,255,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {user ? (
                  <span style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>{initials}</span>
                ) : (
                  <User style={{ width: 36, height: 36, color: "#fff" }} />
                )}
              </div>
              <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }} data-testid="text-username">
                {displayName}
              </h1>
              {user?.email && (
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", margin: "0 0 8px" }}>{user.email}</p>
              )}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                background: "rgba(255,215,0,0.3)", padding: "4px 12px",
                borderRadius: 12, fontSize: 12, fontWeight: 700, color: "#FFD700",
              }}>
                <Star style={{ width: 12, height: 12, fill: "#FFD700", color: "#FFD700" }} />
                {user ? "Membro RSV360" : "Visitante"}
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ padding: "0 16px", marginTop: -20 }}>
        {!user && !isLoading && (
          <div style={{
            background: "#fff", borderRadius: 16, padding: 20, marginBottom: 16,
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)", textAlign: "center",
          }}>
            <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 14px" }}>
              Faça login para acessar suas reservas e benefícios exclusivos
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <Link href="/entrar" style={{ flex: 1 }}>
                <button data-testid="button-entrar-perfil" style={{
                  width: "100%", padding: "12px 0", borderRadius: 10,
                  background: "linear-gradient(135deg, #1e3a5f, #2563EB)",
                  color: "#fff", border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer",
                }}>
                  Entrar
                </button>
              </Link>
              <Link href="/cadastrar" style={{ flex: 1 }}>
                <button data-testid="button-cadastrar-perfil" style={{
                  width: "100%", padding: "12px 0", borderRadius: 10,
                  background: "#F9FAFB", color: "#1e3a5f",
                  border: "1px solid #E5E7EB", fontWeight: 700, fontSize: 14, cursor: "pointer",
                }}>
                  Cadastrar
                </button>
              </Link>
            </div>
          </div>
        )}

        {user && (
          <div style={{
            background: "#fff", borderRadius: 16, padding: 16, marginBottom: 16,
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", margin: "0 0 12px" }}>Dados da conta</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Mail style={{ width: 16, height: 16, color: "#9CA3AF" }} />
                <span style={{ fontSize: 13, color: "#374151" }} data-testid="text-email">{user.email}</span>
              </div>
              {user.telefone && (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Phone style={{ width: 16, height: 16, color: "#9CA3AF" }} />
                  <span style={{ fontSize: 13, color: "#374151" }} data-testid="text-telefone">{user.telefone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{
          background: "#fff", borderRadius: 16, padding: 20, marginBottom: 16,
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: 0 }}>Minhas Reservas</h2>
            <span style={{ fontSize: 13, color: "#2563EB", fontWeight: 600 }}>Ver todos</span>
          </div>
          {RESERVATIONS.map((res) => (
            <div key={res.id} style={{
              display: "flex", gap: 12, padding: 12, background: "#F9FAFB",
              borderRadius: 12, marginBottom: 8,
            }}>
              <div style={{
                width: 60, height: 50, borderRadius: 8, flexShrink: 0,
                background: "linear-gradient(135deg, #1e3a5f, #2563EB)",
                display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
              }}>
                <MapPin style={{ width: 16, height: 16, color: "rgba(255,255,255,0.5)" }} />
                <div style={{
                  position: "absolute", top: -4, right: -4,
                  background: res.status === "Confirmada" ? "#22C55E" : "#F57C00",
                  color: "#fff", padding: "1px 6px", borderRadius: 4, fontSize: 8, fontWeight: 700,
                }}>{res.status === "Confirmada" ? "OK" : "..."}</div>
              </div>
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "#1F2937", margin: "0 0 2px" }}>{res.hotel}</h3>
                <p style={{ fontSize: 11, color: "#6B7280", margin: "0 0 2px" }}>{res.dates} - {res.location}</p>
                <span style={{ fontSize: 10, fontWeight: 600, color: res.status === "Confirmada" ? "#22C55E" : "#F57C00" }}>{res.status}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          background: "#fff", borderRadius: 16, padding: 20, marginBottom: 16,
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: "0 0 12px" }}>Meus Pontos</h2>
          <div style={{
            display: "flex", alignItems: "center", gap: 12, padding: 16,
            background: "linear-gradient(135deg, #FFF7ED, #FFEDD5)", borderRadius: 12,
          }}>
            <div style={{ fontSize: 28 }}>🪙</div>
            <div>
              <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 2px" }}>Balance pontos</p>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#F57C00" }}>1.500</div>
            </div>
            <ChevronRight style={{ width: 20, height: 20, color: "#9CA3AF", marginLeft: "auto" }} />
          </div>
        </div>

        <div style={{
          background: "#fff", borderRadius: 16, overflow: "hidden", marginBottom: 16,
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: 0, padding: "16px 20px 8px" }}>Configurações</h2>
          {MENU_ITEMS.map((item, i) => (
            <Link key={i} href={item.href} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "14px 20px", borderBottom: i < MENU_ITEMS.length - 1 ? "1px solid #F3F4F6" : "none",
              }}>
                <item.icon style={{ width: 20, height: 20, color: "#2563EB" }} />
                <span style={{ flex: 1, fontSize: 14, color: "#1F2937", fontWeight: 500 }}>{item.label}</span>
                {item.badge && (
                  <span style={{
                    background: "#EF4444", color: "#fff", padding: "1px 8px",
                    borderRadius: 10, fontSize: 11, fontWeight: 700,
                  }}>{item.badge}</span>
                )}
                <ChevronRight style={{ width: 16, height: 16, color: "#D1D5DB" }} />
              </div>
            </Link>
          ))}
        </div>

        {user && (
          <button
            data-testid="button-sair"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            style={{
              width: "100%", padding: "14px 0", borderRadius: 12, border: "1px solid #FEE2E2",
              background: "#FFF5F5", color: "#DC2626", fontSize: 14, fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              marginBottom: 24,
            }}
          >
            {logout.isPending ? <Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} /> : <LogOut style={{ width: 18, height: 18 }} />}
            {logout.isPending ? "Saindo..." : "Sair da conta"}
          </button>
        )}

        <div style={{ height: 80 }} />
      </div>

      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        maxWidth: 480, margin: "0 auto",
        background: "#fff", borderTop: "1px solid #E5E7EB",
        display: "flex", padding: "8px 0 12px", zIndex: 30,
      }}>
        {[
          { icon: Home, label: "Home", href: "/" },
          { icon: Search, label: "Busca", href: "#" },
          { icon: CalendarDays, label: "Reservas", href: "#" },
          { icon: User, label: "Perfil", href: "/perfil", active: true },
        ].map((tab, i) => (
          <Link key={i} href={tab.href} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            textDecoration: "none", gap: 2,
          }}>
            <tab.icon style={{ width: 22, height: 22, color: (tab as any).active ? "#2563EB" : "#9CA3AF" }} />
            <span style={{
              fontSize: 10, fontWeight: (tab as any).active ? 700 : 500,
              color: (tab as any).active ? "#2563EB" : "#9CA3AF",
            }}>{tab.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
