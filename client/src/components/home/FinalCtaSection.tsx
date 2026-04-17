import { Link } from "wouter"
import { Phone } from "lucide-react"

const WA_URL = "https://wa.me/5564993197555?text=Olá! Quero garantir minha viagem para os parques de Caldas Novas e Rio Quente."

export function FinalCtaSection() {
  return (
    <section
      data-testid="landing-final-cta"
      style={{
        background: "linear-gradient(135deg, #0F2744 0%, #1E3A5F 60%, #2563EB 100%)",
        padding: "72px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: -80, right: -80,
        width: 320, height: 320, borderRadius: "50%",
        background: "rgba(245,124,0,0.07)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -100, left: -60,
        width: 280, height: 280, borderRadius: "50%",
        background: "rgba(37,99,235,0.10)", pointerEvents: "none",
      }} />

      <div style={{
        maxWidth: 680, margin: "0 auto",
        textAlign: "center", position: "relative", zIndex: 1,
      }}>
        <div style={{
          fontSize: 40, marginBottom: 16,
        }}>🏖️</div>
        <h2
          data-testid="final-cta-headline"
          style={{
            fontSize: 36, fontWeight: 900, color: "#fff",
            marginBottom: 16, lineHeight: 1.2, letterSpacing: -1,
          }}
        >
          Pronto para escolher seu parque e garantir sua viagem?
        </h2>
        <p style={{
          fontSize: 17, color: "rgba(255,255,255,0.75)",
          marginBottom: 40, lineHeight: 1.65,
        }}>
          Compare opções, veja datas e encontre a melhor oferta para seu perfil. Em poucos passos você garante sua experiência.
        </p>
        <div style={{
          display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap",
        }}>
          <Link href="/ingressos">
            <button
              data-testid="final-cta-ingressos"
              style={{
                padding: "16px 32px", borderRadius: 12,
                background: "linear-gradient(135deg, #F57C00, #EA580C)",
                color: "#fff", fontWeight: 800, fontSize: 16,
                border: "none", cursor: "pointer",
                boxShadow: "0 4px 24px rgba(245,124,0,0.40)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(245,124,0,0.50)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = ""
                e.currentTarget.style.boxShadow = "0 4px 24px rgba(245,124,0,0.40)"
              }}
            >
              🎟️ Ver ingressos agora
            </button>
          </Link>
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="final-cta-whatsapp"
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "16px 28px", borderRadius: 12,
              background: "rgba(255,255,255,0.12)",
              border: "1.5px solid rgba(255,255,255,0.25)",
              color: "#fff", fontWeight: 700, fontSize: 16,
              textDecoration: "none",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
          >
            <Phone style={{ width: 18, height: 18 }} />
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
