import { Phone } from "lucide-react"

const WA_URL = "https://wa.me/5564993197555?text=Olá! Preciso de uma sugestão de parque para minha viagem."

export function WhatsAppHelpSection() {
  return (
    <section
      data-testid="landing-whatsapp-help"
      style={{
        background: "linear-gradient(135deg, #064E3B 0%, #065F46 100%)",
        padding: "60px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: -40, right: -40,
        width: 200, height: 200, borderRadius: "50%",
        background: "rgba(37,211,102,0.08)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -60, left: -20,
        width: 180, height: 180, borderRadius: "50%",
        background: "rgba(255,255,255,0.04)", pointerEvents: "none",
      }} />

      <div style={{
        maxWidth: 700, margin: "0 auto",
        textAlign: "center",
        position: "relative", zIndex: 1,
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "#25D366",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
          boxShadow: "0 4px 24px rgba(37,211,102,0.40)",
        }}>
          <Phone style={{ width: 28, height: 28, color: "#fff" }} />
        </div>

        <h2
          data-testid="whatsapp-help-title"
          style={{
            fontSize: 30, fontWeight: 900, color: "#fff",
            marginBottom: 14, letterSpacing: -0.5,
          }}
        >
          Está em dúvida sobre qual parque escolher?
        </h2>
        <p style={{
          fontSize: 16, color: "rgba(255,255,255,0.80)",
          marginBottom: 28, lineHeight: 1.65, maxWidth: 500, margin: "0 auto 28px",
        }}>
          Fale com nossa equipe no WhatsApp e receba uma sugestão rápida e personalizada para sua viagem.
        </p>
        <a
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="whatsapp-help-cta"
          style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "16px 36px", borderRadius: 12,
            background: "#25D366", color: "#fff",
            fontWeight: 800, fontSize: 16, textDecoration: "none",
            boxShadow: "0 4px 24px rgba(37,211,102,0.40)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-2px)"
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(37,211,102,0.50)"
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = ""
            e.currentTarget.style.boxShadow = "0 4px 24px rgba(37,211,102,0.40)"
          }}
        >
          <Phone style={{ width: 20, height: 20 }} />
          Falar com especialista
        </a>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.50)", marginTop: 16 }}>
          Resposta rápida · Sem compromisso · Só boa conversa
        </p>
      </div>
    </section>
  )
}
