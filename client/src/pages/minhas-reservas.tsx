import { ArrowLeft, CalendarDays, MapPin, Loader2, Home, Search, User } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";

type Reserva = {
  id: string;
  hotel: string;
  dates: string;
  status: "Confirmada" | "Pendente" | "Cancelada";
  location: string;
};

export default function MinhasReservasPage() {
  const { user, isLoading: authLoading } = useAuth();

  const { data, isLoading } = useQuery<{ items: Reserva[] }>({
    queryKey: ["/api/reservas/minhas"],
    enabled: !!user,
  });

  const reservas = data?.items ?? [];

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
        <p style={{ fontSize: 16, color: "#6B7280", marginBottom: 16 }}>Faça login para ver suas reservas</p>
        <Link href="/entrar">
          <button data-testid="button-entrar-reservas" style={{
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
            <ArrowLeft style={{ width: 24, height: 24 }} data-testid="button-voltar-reservas" />
          </Link>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Minhas Reservas</h1>
        </div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: 0 }}>{reservas.length} reserva{reservas.length !== 1 ? "s" : ""} encontrada{reservas.length !== 1 ? "s" : ""}</p>
      </div>

      <div style={{ padding: 16 }}>
        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
            <Loader2 style={{ width: 24, height: 24, color: "#2563EB", animation: "spin 1s linear infinite" }} />
          </div>
        ) : reservas.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <CalendarDays style={{ width: 48, height: 48, color: "#D1D5DB", margin: "0 auto 12px" }} />
            <p style={{ fontSize: 15, fontWeight: 600, color: "#6B7280", margin: "0 0 4px" }}>Nenhuma reserva ainda</p>
            <p style={{ fontSize: 13, color: "#9CA3AF", margin: "0 0 16px" }}>Explore nossos destinos e faça sua primeira reserva!</p>
            <Link href="/catalogo-excursoes">
              <button data-testid="button-explorar" style={{
                padding: "10px 24px", borderRadius: 10,
                background: "linear-gradient(135deg, #1e3a5f, #2563EB)",
                color: "#fff", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer",
              }}>Explorar excursões</button>
            </Link>
          </div>
        ) : (
          reservas.map((res) => (
            <div key={res.id} data-testid={`card-reserva-${res.id}`} style={{
              background: "#fff", borderRadius: 16, padding: 16, marginBottom: 12,
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)", display: "flex", gap: 14,
            }}>
              <div style={{
                width: 64, height: 56, borderRadius: 12, flexShrink: 0,
                background: "linear-gradient(135deg, #1e3a5f, #2563EB)",
                display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
              }}>
                <MapPin style={{ width: 20, height: 20, color: "rgba(255,255,255,0.5)" }} />
                <div style={{
                  position: "absolute", top: -4, right: -4,
                  background: res.status === "Confirmada" ? "#22C55E" : res.status === "Cancelada" ? "#EF4444" : "#F57C00",
                  color: "#fff", padding: "2px 8px", borderRadius: 6, fontSize: 9, fontWeight: 700,
                }}>{res.status}</div>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", margin: "0 0 4px" }}>{res.hotel}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <CalendarDays style={{ width: 12, height: 12, color: "#9CA3AF" }} />
                  <span style={{ fontSize: 12, color: "#6B7280" }}>{res.dates}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <MapPin style={{ width: 12, height: 12, color: "#9CA3AF" }} />
                  <span style={{ fontSize: 12, color: "#6B7280" }}>{res.location}</span>
                </div>
              </div>
            </div>
          ))
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
          { icon: CalendarDays, label: "Reservas", href: "/minhas-reservas", active: true },
          { icon: User, label: "Perfil", href: "/perfil" },
        ].map((tab, i) => (
          <Link key={i} href={tab.href} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", gap: 2 }}>
            <tab.icon style={{ width: 22, height: 22, color: (tab as any).active ? "#2563EB" : "#9CA3AF" }} />
            <span style={{ fontSize: 10, fontWeight: (tab as any).active ? 700 : 500, color: (tab as any).active ? "#2563EB" : "#9CA3AF" }}>{tab.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
