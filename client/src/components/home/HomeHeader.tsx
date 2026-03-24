import { useState } from "react"
import { Link } from "wouter"
import { Menu, X, Phone } from "lucide-react"

const WA_URL = "https://wa.me/5564993197555?text=Olá! Quero informações sobre ingressos para os parques."

export function HomeHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header
        data-testid="landing-header"
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: "#fff",
          boxShadow: "0 1px 16px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          padding: "0 20px",
          height: 64,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }} data-testid="header-logo">
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "linear-gradient(135deg, #1E3A5F, #2563EB)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 900, fontSize: 13, letterSpacing: -0.5,
              }}>
                RSV
              </div>
              <span style={{ fontWeight: 800, fontSize: 17, color: "#1E3A5F", letterSpacing: -0.5 }}>
                Reservei<span style={{ color: "#F57C00" }}>360</span>
              </span>
            </div>
          </Link>

          <nav
            data-testid="header-nav"
            style={{ display: "flex", gap: 32, alignItems: "center" }}
            className="hidden-mobile"
          >
            {[
              { label: "Parques", href: "/#parques" },
              { label: "Combos", href: "/#combos" },
              { label: "Hotéis", href: "/hoteis" },
              { label: "Dúvidas", href: "/#faq" },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                data-testid={`header-nav-${link.label.toLowerCase()}`}
                style={{
                  color: "#374151", fontWeight: 600, fontSize: 14,
                  textDecoration: "none", transition: "color 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#2563EB")}
                onMouseLeave={e => (e.currentTarget.style.color = "#374151")}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="header-btn-whatsapp"
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 14px", borderRadius: 8,
                background: "#25D366", color: "#fff",
                fontWeight: 700, fontSize: 13, textDecoration: "none",
                border: "none", cursor: "pointer",
              }}
              className="hidden-mobile"
            >
              <Phone style={{ width: 14, height: 14 }} />
              WhatsApp
            </a>
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="header-btn-whatsapp-mobile"
              style={{
                display: "none", alignItems: "center", justifyContent: "center",
                width: 36, height: 36, borderRadius: 8,
                background: "#25D366", textDecoration: "none", flexShrink: 0,
              }}
              className="show-mobile"
            >
              <Phone style={{ width: 16, height: 16, color: "#fff" }} />
            </a>
            <Link href="/ingressos">
              <button
                data-testid="header-btn-ingressos"
                style={{
                  padding: "8px 18px", borderRadius: 8,
                  background: "linear-gradient(135deg, #2563EB, #1E40AF)",
                  color: "#fff", fontWeight: 700, fontSize: 13,
                  border: "none", cursor: "pointer",
                }}
              >
                Ver ingressos
              </button>
            </Link>
            <button
              data-testid="header-menu-toggle"
              onClick={() => setMenuOpen(v => !v)}
              style={{
                display: "none", background: "none", border: "none",
                cursor: "pointer", padding: 4, color: "#374151",
              }}
              className="show-mobile"
            >
              {menuOpen ? <X style={{ width: 24, height: 24 }} /> : <Menu style={{ width: 24, height: 24 }} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div
            data-testid="header-mobile-menu"
            style={{
              background: "#fff", borderTop: "1px solid #F3F4F6",
              padding: "12px 20px 20px",
              display: "flex", flexDirection: "column", gap: 4,
            }}
          >
            {[
              { label: "Parques", href: "/#parques" },
              { label: "Combos", href: "/#combos" },
              { label: "Hotéis", href: "/hoteis" },
              { label: "Dúvidas", href: "/#faq" },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  color: "#374151", fontWeight: 600, fontSize: 15,
                  padding: "10px 0", textDecoration: "none",
                  borderBottom: "1px solid #F3F4F6",
                }}
              >
                {link.label}
              </a>
            ))}
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "12px 16px", borderRadius: 10,
                background: "#25D366", color: "#fff",
                fontWeight: 700, fontSize: 15, textDecoration: "none",
              }}
            >
              <Phone style={{ width: 16, height: 16 }} />
              Falar no WhatsApp
            </a>
          </div>
        )}
      </header>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>

      <div style={{ height: 64 }} />
    </>
  )
}
