import { Link } from "wouter"
import { Phone } from "lucide-react"

const WA_URL = "https://wa.me/5564993197555?text=Olá! Quero informações sobre ingressos para os parques."

export function MobileCTABar() {
  return (
    <>
      <div
        data-testid="mobile-cta-bar"
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          zIndex: 90,
          display: "flex", gap: 10,
          padding: "10px 16px 14px",
          background: "#fff",
          boxShadow: "0 -2px 16px rgba(0,0,0,0.10)",
          borderTop: "1px solid #F3F4F6",
        }}
        className="mobile-cta-bar"
      >
        <Link href="/ingressos" style={{ flex: 1 }}>
          <button
            data-testid="mobile-cta-ingressos"
            style={{
              width: "100%", padding: "13px 0",
              border: "none", borderRadius: 12,
              background: "linear-gradient(135deg, #F57C00, #EA580C)",
              color: "#fff", fontWeight: 800, fontSize: 14,
              cursor: "pointer",
            }}
          >
            🎟️ Ver ingressos
          </button>
        </Link>
        <a
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="mobile-cta-whatsapp"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 50, height: 50, borderRadius: 12, flexShrink: 0,
            background: "#25D366", textDecoration: "none",
          }}
        >
          <Phone style={{ width: 22, height: 22, color: "#fff" }} />
        </a>
      </div>

      <style>{`
        @media (min-width: 769px) {
          .mobile-cta-bar { display: none !important; }
        }
        @media (max-width: 768px) {
          .mobile-cta-bar { display: flex !important; }
        }
      `}</style>
    </>
  )
}
