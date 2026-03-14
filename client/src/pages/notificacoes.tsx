import { ArrowLeft, Bell, CheckCircle2, AlertTriangle, Info, Tag, Loader2, Home, Search, CalendarDays, User } from "lucide-react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";

type Notificacao = {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: "info" | "sucesso" | "alerta" | "promo";
  lida: boolean;
  criadoEm: string;
};

const TIPO_CONFIG: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  info: { icon: Info, color: "#2563EB", bg: "#EFF6FF" },
  sucesso: { icon: CheckCircle2, color: "#22C55E", bg: "#F0FDF4" },
  alerta: { icon: AlertTriangle, color: "#F57C00", bg: "#FFF7ED" },
  promo: { icon: Tag, color: "#8B5CF6", bg: "#F5F3FF" },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Agora mesmo";
  if (hours < 24) return `${hours}h atrás`;
  const days = Math.floor(hours / 24);
  return `${days}d atrás`;
}

export default function NotificacoesPage() {
  const { user, isLoading: authLoading } = useAuth();

  const { data, isLoading } = useQuery<{ items: Notificacao[]; naoLidas: number }>({
    queryKey: ["/api/notificacoes"],
    enabled: !!user,
  });

  const marcarLida = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("PATCH", `/api/notificacoes/${id}/lida`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notificacoes"] });
    },
  });

  const notificacoes = data?.items ?? [];
  const naoLidas = data?.naoLidas ?? 0;

  if (authLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#F9FAFB" }}>
        <Loader2 style={{ width: 32, height: 32, color: "#2563EB", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: "#F9FAFB", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <p style={{ fontSize: 16, color: "#6B7280", marginBottom: 16 }}>Faça login para ver suas notificações</p>
        <Link href="/entrar">
          <button data-testid="button-entrar-notif" style={{
            padding: "12px 32px", borderRadius: 10,
            background: "linear-gradient(135deg, #1e3a5f, #2563EB)",
            color: "#fff", border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer",
          }}>Entrar</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="rsv-subpage" style={{ background: "#F9FAFB", minHeight: "100vh" }}>
      <div style={{
        background: "linear-gradient(135deg, #1e3a5f 0%, #2563EB 100%)",
        padding: "16px 16px 24px", color: "#fff",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <Link href="/perfil" style={{ color: "#fff", display: "flex" }}>
            <ArrowLeft style={{ width: 24, height: 24 }} data-testid="button-voltar-notif" />
          </Link>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Notificações</h1>
          {naoLidas > 0 && (
            <span style={{ background: "#EF4444", color: "#fff", padding: "2px 10px", borderRadius: 10, fontSize: 12, fontWeight: 700 }}>{naoLidas}</span>
          )}
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
            <Loader2 style={{ width: 24, height: 24, color: "#2563EB", animation: "spin 1s linear infinite" }} />
          </div>
        ) : notificacoes.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <Bell style={{ width: 48, height: 48, color: "#D1D5DB", margin: "0 auto 12px" }} />
            <p style={{ fontSize: 15, fontWeight: 600, color: "#6B7280" }}>Nenhuma notificação</p>
            <p style={{ fontSize: 13, color: "#9CA3AF" }}>Você será avisado sobre suas reservas e promoções</p>
          </div>
        ) : (
          notificacoes.map((notif) => {
            const config = TIPO_CONFIG[notif.tipo] ?? TIPO_CONFIG.info;
            const Icon = config.icon;
            return (
              <div
                key={notif.id}
                data-testid={`card-notificacao-${notif.id}`}
                onClick={() => !notif.lida && marcarLida.mutate(notif.id)}
                style={{
                  background: notif.lida ? "#fff" : config.bg,
                  borderRadius: 16, padding: 16, marginBottom: 12,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  border: notif.lida ? "1px solid #F3F4F6" : `1px solid ${config.color}30`,
                  cursor: notif.lida ? "default" : "pointer",
                  opacity: notif.lida ? 0.7 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: config.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    border: `1px solid ${config.color}30`,
                  }}>
                    <Icon style={{ width: 18, height: 18, color: config.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", margin: 0 }}>{notif.titulo}</h3>
                      {!notif.lida && (
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: config.color, flexShrink: 0 }} />
                      )}
                    </div>
                    <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 6px", lineHeight: 1.4 }}>{notif.mensagem}</p>
                    <span style={{ fontSize: 11, color: "#9CA3AF" }}>{timeAgo(notif.criadoEm)}</span>
                  </div>
                </div>
              </div>
            );
          })
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
