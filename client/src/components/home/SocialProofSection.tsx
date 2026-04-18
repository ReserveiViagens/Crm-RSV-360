import { Star } from "lucide-react"

const TESTIMONIALS = [
  {
    id: 1,
    name: "Juliana M.",
    city: "Goiânia, GO",
    avatar: "JM",
    color: "#7C3AED",
    stars: 5,
    text: "Foi super fácil escolher. Já cheguei com tudo resolvido e não precisei me preocupar com nada. Recomendo muito!",
  },
  {
    id: 2,
    name: "Rafael S.",
    city: "Brasília, DF",
    avatar: "RS",
    color: "#2563EB",
    stars: 5,
    text: "O combo compensou muito para nossa família. Economia real e atendimento rápido pelo WhatsApp quando precisei.",
  },
  {
    id: 3,
    name: "Ana Paula L.",
    city: "Uberlândia, MG",
    avatar: "AL",
    color: "#16A34A",
    stars: 5,
    text: "Nunca tinha comprado assim. Foi muito prático e recebemos os ingressos digitais rapidinho. Voltamos ano que vem!",
  },
]

const COUNTERS = [
  { value: "+5.000", label: "Clientes atendidos" },
  { value: "98%", label: "Satisfação" },
  { value: "+200", label: "Reservas nesta semana" },
  { value: "4.9★", label: "Avaliação média" },
]

export function SocialProofSection() {
  return (
    <section
      data-testid="landing-social-proof"
      style={{ background: "#F9FAFB", padding: "64px 20px" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{
            display: "inline-block",
            background: "#FEF9C3", color: "#CA8A04",
            fontWeight: 700, fontSize: 12, letterSpacing: 1,
            padding: "5px 14px", borderRadius: 20, marginBottom: 12,
            textTransform: "uppercase",
          }}>
            Depoimentos reais
          </span>
          <h2
            data-testid="social-proof-title"
            style={{ fontSize: 32, fontWeight: 900, color: "#111827", letterSpacing: -0.5, maxWidth: 640, margin: "0 auto" }}
          >
            Quem viaja para Caldas Novas e Rio Quente escolhe com a gente
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
          marginBottom: 48,
        }}
          className="testimonials-grid"
        >
          {TESTIMONIALS.map(t => (
            <div
              key={t.id}
              data-testid={`testimonial-${t.id}`}
              style={{
                background: "#fff",
                border: "1.5px solid #F3F4F6",
                borderRadius: 20,
                padding: "24px 22px",
                display: "flex", flexDirection: "column", gap: 14,
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: `${t.color}18`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 800, fontSize: 14, color: t.color,
                }}>
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: "#111827" }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF" }}>{t.city}</div>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", gap: 2 }}>
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} style={{ width: 13, height: 13, fill: "#FACC15", color: "#FACC15" }} />
                  ))}
                </div>
              </div>
              <p style={{
                fontSize: 14, color: "#374151", lineHeight: 1.65, margin: 0,
                fontStyle: "italic",
              }}>
                "{t.text}"
              </p>
            </div>
          ))}
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          background: "linear-gradient(135deg, #1E3A5F, #2563EB)",
          borderRadius: 20,
          padding: "28px 32px",
        }}
          className="counters-grid"
        >
          {COUNTERS.map((c, idx) => (
            <div
              key={c.label}
              data-testid={`counter-${idx}`}
              style={{
                textAlign: "center",
                borderRight: idx < COUNTERS.length - 1 ? "1px solid rgba(255,255,255,0.15)" : "none",
                paddingRight: idx < COUNTERS.length - 1 ? 16 : 0,
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{c.value}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.70)", marginTop: 4 }}>{c.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .testimonials-grid { grid-template-columns: 1fr !important; }
          .counters-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  )
}
