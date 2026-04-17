import { ShieldCheck, MessageCircle, Tag, Star } from "lucide-react"

const ITEMS = [
  { icon: ShieldCheck, label: "Compra rápida e segura", color: "#2563EB" },
  { icon: MessageCircle, label: "Atendimento no WhatsApp", color: "#25D366" },
  { icon: Tag, label: "Descontos exclusivos", color: "#F57C00" },
  { icon: Star, label: "Escolha fácil por perfil", color: "#7C3AED" },
]

export function TrustBar() {
  return (
    <section
      data-testid="landing-trust-bar"
      style={{
        background: "#F8FAFF",
        borderBottom: "1px solid #E8EEF8",
        padding: "0 20px",
      }}
    >
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 0,
      }}
        className="trust-grid"
      >
        {ITEMS.map((item, idx) => (
          <div
            key={item.label}
            data-testid={`trust-item-${idx}`}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "18px 20px",
              borderRight: idx < ITEMS.length - 1 ? "1px solid #E8EEF8" : "none",
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `${item.color}15`,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <item.icon style={{ width: 18, height: 18, color: item.color }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#1F2937", lineHeight: 1.3 }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .trust-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .trust-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
