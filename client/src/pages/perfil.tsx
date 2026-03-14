import { useState } from "react";
import { ArrowLeft, User, Star, MapPin, Settings, ChevronRight, Shield, Award, Bell, LogOut, Home, Search, CalendarDays, Mail, Phone, Loader2, Camera, CheckCircle2, Trophy, Plus, BarChart3, Users, FileText, type LucideIcon } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { SelfieModal } from "@/components/selfie/SelfieModal";

type Reserva = {
  id: string;
  hotel: string;
  dates: string;
  status: "Confirmada" | "Pendente" | "Cancelada";
  location: string;
};

type MenuItem = {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: string;
};

type BottomTab = {
  icon: LucideIcon;
  label: string;
  href: string;
  active: boolean;
};

const getRoleBadge = (role?: string) => {
  switch (role) {
    case "admin":
      return { label: "Administrador RSV360", bg: "rgba(220,38,38,0.2)", color: "#F87171", icon: Shield };
    case "LIDER":
      return { label: "Organizador RSV360", bg: "rgba(245,124,0,0.3)", color: "#FFD700", icon: Trophy };
    case "user":
      return { label: "Passageiro RSV360", bg: "rgba(255,215,0,0.3)", color: "#FFD700", icon: Star };
    default:
      return { label: "Visitante", bg: "rgba(255,215,0,0.3)", color: "#FFD700", icon: Star };
  }
};

const MENU_PASSAGEIRO: MenuItem[] = [
  { icon: CalendarDays, label: "Minhas Reservas", href: "/minhas-reservas" },
  { icon: Trophy, label: "Minha Jornada RSV", href: "/minha-jornada" },
  { icon: Star, label: "Minhas Avaliações", href: "/minhas-avaliacoes" },
  { icon: Award, label: "Programa de Fidelidade", href: "/programa-fidelidade" },
  { icon: Bell, label: "Notificações", href: "/notificacoes" },
  { icon: Shield, label: "Privacidade e Segurança", href: "/politica-de-privacidade" },
  { icon: Settings, label: "Configurações", href: "/configuracoes" },
];

const MENU_ORGANIZADOR: MenuItem[] = [
  { icon: Plus, label: "Criar Excursão", href: "/criar-excursao" },
  { icon: BarChart3, label: "Metas do Organizador", href: "/organizer/metas" },
  { icon: Users, label: "Ranking Organizadores", href: "/ranking-organizadores" },
];

const MENU_ADMIN: MenuItem[] = [
  { icon: BarChart3, label: "Painel Admin", href: "/admin/dashboard" },
  { icon: FileText, label: "Financeiro", href: "/admin/financeiro" },
  { icon: Users, label: "Passageiros", href: "/admin/passageiros" },
  { icon: Shield, label: "LGPD", href: "/admin/lgpd" },
];

const BOTTOM_TABS: BottomTab[] = [
  { icon: Home, label: "Home", href: "/", active: false },
  { icon: Search, label: "Busca", href: "/catalogo-excursoes", active: false },
  { icon: CalendarDays, label: "Reservas", href: "/minhas-reservas", active: false },
  { icon: User, label: "Perfil", href: "/perfil", active: true },
];

export default function PerfilPage() {
  const { user, isLoading } = useAuth();
  const logout = useLogout();
  const [selfieAberto, setSelfieAberto] = useState(false);
  const [fotoLocal, setFotoLocal] = useState<string | null>(null);

  const { data: pontosData } = useQuery<{ pontos: number; streak: number; nome: string }>({
    queryKey: ["/api/gamification/pontos"],
    enabled: !!user,
  });

  const { data: reservasData } = useQuery<{ items: Reserva[] }>({
    queryKey: ["/api/reservas/minhas"],
    enabled: !!user,
  });

  const { data: notifData } = useQuery<{ items: unknown[]; naoLidas: number }>({
    queryKey: ["/api/notificacoes"],
    enabled: !!user,
  });

  const pontosReais = pontosData?.pontos ?? 0;
  const reservas = reservasData?.items ?? [];
  const naoLidas = notifData?.naoLidas ?? 0;

  const displayName = user?.nome ?? "Visitante";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  const fotoAtual = fotoLocal || user?.fotoUrl || "";
  const temFoto = !!fotoAtual;
  const temVerificacao = temFoto;

  const roleBadge = getRoleBadge(user?.role);
  const RoleIcon = roleBadge.icon;

  const isOrganizador = user?.role === "LIDER" || user?.role === "admin";
  const isAdmin = user?.role === "admin";

  const menuPassageiro: MenuItem[] = MENU_PASSAGEIRO.map((item) => {
    if (item.label === "Notificações" && naoLidas > 0) {
      return { ...item, badge: String(naoLidas) };
    }
    if (item.label === "Minhas Reservas" && reservas.length > 0) {
      return { ...item, badge: String(reservas.length) };
    }
    return item;
  });

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
          {user ? (
            <Link href="/configuracoes" style={{ textDecoration: "none" }}>
              <button data-testid="button-configuracoes-header" style={{
                width: 32, height: 32, borderRadius: "50%", border: "none",
                background: "rgba(255,255,255,0.15)", color: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Settings style={{ width: 16, height: 16 }} />
              </button>
            </Link>
          ) : (
            <div style={{ width: 32 }} />
          )}
        </div>

        <div style={{ textAlign: "center" }}>
          {isLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}>
              <Loader2 style={{ width: 32, height: 32, color: "rgba(255,255,255,0.6)", animation: "spin 1s linear infinite" }} />
            </div>
          ) : (
            <>
              <div
                style={{ position: "relative", display: "inline-block", margin: "0 auto 12px", cursor: user ? "pointer" : "default" }}
                onClick={() => user && setSelfieAberto(true)}
                data-testid="avatar-selfie-trigger"
                title={user ? "Clique para atualizar sua foto de perfil" : ""}
              >
                <div style={{
                  width: 84, height: 84, borderRadius: "50%",
                  border: "3px solid rgba(255,255,255,0.4)",
                  overflow: "hidden", position: "relative",
                  background: temFoto ? "transparent" : user ? "linear-gradient(135deg, #F57C00, #EF4444)" : "rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {temFoto ? (
                    <img src={fotoAtual} alt="Foto de perfil" style={{ width: "100%", height: "100%", objectFit: "cover" }} data-testid="img-perfil" />
                  ) : user ? (
                    <span style={{ fontSize: 26, fontWeight: 900, color: "#fff" }}>{initials}</span>
                  ) : (
                    <User style={{ width: 36, height: 36, color: "#fff" }} />
                  )}
                </div>
                {user && (
                  <div style={{
                    position: "absolute", bottom: 0, right: 0,
                    width: 26, height: 26, borderRadius: "50%",
                    background: "#F57C00", border: "2px solid #fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Camera style={{ width: 13, height: 13, color: "#fff" }} />
                  </div>
                )}
              </div>

              <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }} data-testid="text-username">
                {displayName}
              </h1>
              {user?.email && (
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", margin: "0 0 8px" }}>{user.email}</p>
              )}
              <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
                <div data-testid="badge-role" style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  background: roleBadge.bg, padding: "4px 12px",
                  borderRadius: 12, fontSize: 12, fontWeight: 700, color: roleBadge.color,
                }}>
                  <RoleIcon style={{ width: 12, height: 12, fill: roleBadge.color, color: roleBadge.color }} />
                  {roleBadge.label}
                </div>
                {temVerificacao && (
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    background: "rgba(52,211,153,0.3)", padding: "4px 12px",
                    borderRadius: 12, fontSize: 12, fontWeight: 700, color: "#34D399",
                  }}>
                    <CheckCircle2 style={{ width: 12, height: 12 }} />
                    Identidade verificada
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ padding: "0 16px", marginTop: -20 }}>
        {user && !temFoto && (
          <div style={{
            background: "#fff", borderRadius: 16, padding: 16, marginBottom: 16,
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            border: "1.5px dashed #F57C00",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: "linear-gradient(135deg, #F57C00, #EF4444)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Camera style={{ width: 20, height: 20, color: "#fff" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1F2937", margin: "0 0 2px" }}>
                  Adicione sua foto de perfil
                </p>
                <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
                  Tire uma selfie para personalizar sua conta e verificar sua identidade
                </p>
              </div>
              <button
                onClick={() => setSelfieAberto(true)}
                data-testid="button-tirar-selfie"
                style={{
                  background: "linear-gradient(135deg, #F57C00, #EF4444)",
                  color: "#fff", border: "none", borderRadius: 10,
                  padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Tirar selfie
              </button>
            </div>
          </div>
        )}

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
                }}>Entrar</button>
              </Link>
              <Link href="/cadastrar" style={{ flex: 1 }}>
                <button data-testid="button-cadastrar-perfil" style={{
                  width: "100%", padding: "12px 0", borderRadius: 10,
                  background: "#F9FAFB", color: "#1e3a5f",
                  border: "1px solid #E5E7EB", fontWeight: 700, fontSize: 14, cursor: "pointer",
                }}>Cadastrar</button>
              </Link>
            </div>
          </div>
        )}

        {user && (
          <>
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
                {user.cpf && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Shield style={{ width: 16, height: 16, color: "#9CA3AF" }} />
                    <span style={{ fontSize: 13, color: "#374151" }}>CPF: {user.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}</span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: 0 }}>Minhas Reservas</h2>
                <Link href="/minhas-reservas" style={{ textDecoration: "none" }}>
                  <span style={{ fontSize: 13, color: "#2563EB", fontWeight: 600, cursor: "pointer" }} data-testid="link-ver-reservas">Ver todos</span>
                </Link>
              </div>
              {reservas.length === 0 ? (
                <p style={{ fontSize: 13, color: "#9CA3AF", textAlign: "center", padding: "12px 0" }}>Nenhuma reserva encontrada</p>
              ) : (
                reservas.slice(0, 2).map((res) => (
                  <div key={res.id} data-testid={`card-reserva-${res.id}`} style={{ display: "flex", gap: 12, padding: 12, background: "#F9FAFB", borderRadius: 12, marginBottom: 8 }}>
                    <div style={{
                      width: 60, height: 50, borderRadius: 8, flexShrink: 0,
                      background: "linear-gradient(135deg, #1e3a5f, #2563EB)",
                      display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
                    }}>
                      <MapPin style={{ width: 16, height: 16, color: "rgba(255,255,255,0.5)" }} />
                      <div style={{
                        position: "absolute", top: -4, right: -4,
                        background: res.status === "Confirmada" ? "#22C55E" : res.status === "Cancelada" ? "#EF4444" : "#F57C00",
                        color: "#fff", padding: "1px 6px", borderRadius: 4, fontSize: 8, fontWeight: 700,
                      }}>{res.status === "Confirmada" ? "OK" : res.status === "Cancelada" ? "X" : "..."}</div>
                    </div>
                    <div>
                      <h3 style={{ fontSize: 13, fontWeight: 700, color: "#1F2937", margin: "0 0 2px" }}>{res.hotel}</h3>
                      <p style={{ fontSize: 11, color: "#6B7280", margin: "0 0 2px" }}>{res.dates} - {res.location}</p>
                      <span style={{ fontSize: 10, fontWeight: 600, color: res.status === "Confirmada" ? "#22C55E" : res.status === "Cancelada" ? "#EF4444" : "#F57C00" }}>{res.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Link href="/minha-jornada" style={{ textDecoration: "none" }}>
              <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", cursor: "pointer" }} data-testid="card-meus-pontos">
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: "0 0 12px" }}>Meus Pontos</h2>
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, background: "linear-gradient(135deg, #FFF7ED, #FFEDD5)", borderRadius: 12 }}>
                  <div style={{ fontSize: 28 }}>🪙</div>
                  <div>
                    <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 2px" }}>Saldo de pontos</p>
                    <div style={{ fontSize: 24, fontWeight: 900, color: "#F57C00" }} data-testid="text-pontos-saldo">{pontosReais.toLocaleString("pt-BR")}</div>
                  </div>
                  <ChevronRight style={{ width: 20, height: 20, color: "#9CA3AF", marginLeft: "auto" }} />
                </div>
              </div>
            </Link>

            <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: 0, padding: "16px 20px 8px" }}>Minha Conta</h2>
              {menuPassageiro.map((item, i) => (
                <Link key={i} href={item.href} style={{ textDecoration: "none" }}>
                  <div data-testid={`menu-item-${item.label.toLowerCase().replace(/\s+/g, "-")}`} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: i < menuPassageiro.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                    <item.icon style={{ width: 20, height: 20, color: "#2563EB" }} />
                    <span style={{ flex: 1, fontSize: 14, color: "#1F2937", fontWeight: 500 }}>{item.label}</span>
                    {item.badge && (
                      <span style={{ background: "#EF4444", color: "#fff", padding: "1px 8px", borderRadius: 10, fontSize: 11, fontWeight: 700 }}>{item.badge}</span>
                    )}
                    <ChevronRight style={{ width: 16, height: 16, color: "#D1D5DB" }} />
                  </div>
                </Link>
              ))}
            </div>

            {isOrganizador && (
              <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: "1px solid #FFF7ED" }}>
                <div style={{ padding: "16px 20px 8px", display: "flex", alignItems: "center", gap: 8 }}>
                  <Trophy style={{ width: 18, height: 18, color: "#F57C00" }} />
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: 0 }}>Organizador</h2>
                </div>
                {MENU_ORGANIZADOR.map((item, i) => (
                  <Link key={i} href={item.href} style={{ textDecoration: "none" }}>
                    <div data-testid={`menu-org-${item.label.toLowerCase().replace(/\s+/g, "-")}`} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: i < MENU_ORGANIZADOR.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                      <item.icon style={{ width: 20, height: 20, color: "#F57C00" }} />
                      <span style={{ flex: 1, fontSize: 14, color: "#1F2937", fontWeight: 500 }}>{item.label}</span>
                      <ChevronRight style={{ width: 16, height: 16, color: "#D1D5DB" }} />
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {isAdmin && (
              <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: "1px solid #FEE2E2" }}>
                <div style={{ padding: "16px 20px 8px", display: "flex", alignItems: "center", gap: 8 }}>
                  <Shield style={{ width: 18, height: 18, color: "#DC2626" }} />
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: 0 }}>Administração</h2>
                </div>
                {MENU_ADMIN.map((item, i) => (
                  <Link key={i} href={item.href} style={{ textDecoration: "none" }}>
                    <div data-testid={`menu-admin-${item.label.toLowerCase().replace(/\s+/g, "-")}`} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: i < MENU_ADMIN.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                      <item.icon style={{ width: 20, height: 20, color: "#DC2626" }} />
                      <span style={{ flex: 1, fontSize: 14, color: "#1F2937", fontWeight: 500 }}>{item.label}</span>
                      <ChevronRight style={{ width: 16, height: 16, color: "#D1D5DB" }} />
                    </div>
                  </Link>
                ))}
              </div>
            )}

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
          </>
        )}

        <div style={{ height: 80 }} />
      </div>

      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: 480, margin: "0 auto",
        background: "#fff", borderTop: "1px solid #E5E7EB",
        display: "flex", padding: "8px 0 12px", zIndex: 30,
      }}>
        {BOTTOM_TABS.map((tab, i) => (
          <Link key={i} href={tab.href} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", gap: 2 }}>
            <tab.icon style={{ width: 22, height: 22, color: tab.active ? "#2563EB" : "#9CA3AF" }} />
            <span style={{ fontSize: 10, fontWeight: tab.active ? 700 : 500, color: tab.active ? "#2563EB" : "#9CA3AF" }}>{tab.label}</span>
          </Link>
        ))}
      </div>

      {user && (
        <SelfieModal
          aberto={selfieAberto}
          onFechar={() => setSelfieAberto(false)}
          contexto="perfil"
          onSucesso={(fotoUrl) => setFotoLocal(fotoUrl)}
        />
      )}
    </div>
  );
}
