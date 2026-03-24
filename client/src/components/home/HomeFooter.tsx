import { Link } from "wouter"
import { Phone } from "lucide-react"

const WA_URL = "https://wa.me/5564993197555"

export function HomeFooter() {
  return (
    <footer
      data-testid="landing-footer"
      style={{
        background: "#0F1F38",
        color: "#fff",
        padding: "48px 20px 32px",
      }}
    >
      <div style={{
        maxWidth: 1200, margin: "0 auto",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 40,
          marginBottom: 40,
        }}
          className="footer-grid"
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "linear-gradient(135deg, #1E3A5F, #2563EB)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 900, fontSize: 12,
              }}>
                RSV
              </div>
              <span style={{ fontWeight: 800, fontSize: 16 }}>
                Reservei<span style={{ color: "#F57C00" }}>360</span>
              </span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.60)", lineHeight: 1.7, marginBottom: 18 }}>
              Ingressos e combos com desconto para os melhores parques de Caldas Novas e Rio Quente. Suporte pelo WhatsApp.
            </p>
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="footer-whatsapp-btn"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "10px 18px", borderRadius: 10,
                background: "#25D366", color: "#fff",
                fontWeight: 700, fontSize: 13, textDecoration: "none",
              }}
            >
              <Phone style={{ width: 14, height: 14 }} />
              Falar no WhatsApp
            </a>
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.40)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>
              Destinos
            </div>
            {[
              "Caldas Novas",
              "Rio Quente",
              "Goiás",
            ].map(item => (
              <div key={item} style={{ marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>
                  📍 {item}
                </span>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.40)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>
              Links rápidos
            </div>
            {[
              { label: "Parques", href: "/#parques" },
              { label: "Combos", href: "/#combos" },
              { label: "Hotéis", href: "/hoteis" },
              { label: "Dúvidas", href: "/#faq" },
              { label: "Ver ingressos", href: "/ingressos" },
            ].map(link => (
              <div key={link.label} style={{ marginBottom: 10 }}>
                <a
                  href={link.href}
                  style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", textDecoration: "none", lineHeight: 1.6 }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
                >
                  {link.label}
                </a>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.40)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>
              Institucional
            </div>
            {[
              { label: "Quem somos", href: "/quem-somos" },
              { label: "Política de privacidade", href: "/politica-de-privacidade" },
              { label: "Contato", href: "/contato" },
              { label: "Entrar", href: "/entrar" },
            ].map(link => (
              <div key={link.label} style={{ marginBottom: 10 }}>
                <Link
                  href={link.href}
                  style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", textDecoration: "none", lineHeight: 1.6 }}
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.10)",
          paddingTop: 20,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 10,
        }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.40)" }}>
            © 2025 Reservei Viagens. Todos os direitos reservados.
          </span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.30)" }}>
            Caldas Novas & Rio Quente — GO, Brasil
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 28px !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}
