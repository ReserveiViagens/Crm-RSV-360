import { ArrowLeft, Star, MessageSquare, Loader2, Home, Search, CalendarDays, User } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

const AVALIACOES_MOCK = [
  { id: "av-1", destino: "Resort Termas Paradise", nota: 5, comentario: "Experiência incrível! Águas termais maravilhosas e atendimento impecável.", data: "10/04/2026" },
  { id: "av-2", destino: "Hot Park", nota: 4, comentario: "Parque muito divertido, mas estava lotado no fim de semana.", data: "22/03/2026" },
  { id: "av-3", destino: "Di Roma Acqua Park", nota: 5, comentario: "Perfeito para toda família. Vou voltar com certeza!", data: "15/02/2026" },
];

export default function MinhasAvaliacoesPage() {
  const { user, isLoading: authLoading } = useAuth();

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
        <p style={{ fontSize: 16, color: "#6B7280", marginBottom: 16 }}>Faça login para ver suas avaliações</p>
        <Link href="/entrar">
          <button data-testid="button-entrar-avaliacoes" style={{
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
            <ArrowLeft style={{ width: 24, height: 24 }} data-testid="button-voltar-avaliacoes" />
          </Link>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Minhas Avaliações</h1>
        </div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", margin: 0 }}>{AVALIACOES_MOCK.length} avaliações realizadas</p>
      </div>

      <div style={{ padding: 16 }}>
        {AVALIACOES_MOCK.map((av) => (
          <div key={av.id} data-testid={`card-avaliacao-${av.id}`} style={{
            background: "#fff", borderRadius: 16, padding: 16, marginBottom: 12,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", margin: 0 }}>{av.destino}</h3>
              <span style={{ fontSize: 11, color: "#9CA3AF" }}>{av.data}</span>
            </div>
            <div style={{ display: "flex", gap: 2, marginBottom: 8 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  style={{
                    width: 16, height: 16,
                    color: i < av.nota ? "#FFD700" : "#E5E7EB",
                    fill: i < av.nota ? "#FFD700" : "none",
                  }}
                />
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <MessageSquare style={{ width: 14, height: 14, color: "#9CA3AF", marginTop: 2, flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: "#6B7280", margin: 0, lineHeight: 1.5 }}>{av.comentario}</p>
            </div>
          </div>
        ))}

        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 12 }}>Avalie suas experiências para ganhar pontos!</p>
          <Link href="/catalogo-excursoes">
            <button data-testid="button-explorar-avaliacoes" style={{
              padding: "10px 24px", borderRadius: 10,
              background: "linear-gradient(135deg, #1e3a5f, #2563EB)",
              color: "#fff", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer",
            }}>Explorar destinos</button>
          </Link>
        </div>
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
