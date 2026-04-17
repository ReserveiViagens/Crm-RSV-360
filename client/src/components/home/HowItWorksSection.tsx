import { Compass, CalendarCheck, BarChart2, CheckCircle } from "lucide-react"

const STEPS = [
  {
    number: "01",
    icon: Compass,
    title: "Escolha o parque ou perfil",
    description: "Selecione o parque que quer visitar ou informe o perfil da sua viagem.",
  },
  {
    number: "02",
    icon: CalendarCheck,
    title: "Selecione a melhor data",
    description: "Veja disponibilidade e o clima previsto para aproveitar ao máximo.",
  },
  {
    number: "03",
    icon: BarChart2,
    title: "Compare opções e combos",
    description: "Ingressos individuais, família, VIP ou combos — compare tudo em um só lugar.",
  },
  {
    number: "04",
    icon: CheckCircle,
    title: "Finalize sua reserva",
    description: "Reserve em minutos com suporte rápido no WhatsApp para tirar dúvidas.",
  },
]

export function HowItWorksSection() {
  return (
    <section
      data-testid="landing-how-it-works"
      style={{
        background: "linear-gradient(135deg, #0F2744 0%, #1E3A5F 100%)",
        padding: "64px 20px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{
            display: "inline-block",
            background: "rgba(245,124,0,0.15)", color: "#FDBA74",
            fontWeight: 700, fontSize: 12, letterSpacing: 1,
            padding: "5px 14px", borderRadius: 20, marginBottom: 12,
            textTransform: "uppercase",
          }}>
            Simples e rápido
          </span>
          <h2
            data-testid="how-it-works-title"
            style={{ fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: -0.5 }}
          >
            Reserve em poucos passos
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 24,
          position: "relative",
        }}
          className="steps-grid"
        >
          {STEPS.map((step, idx) => (
            <div
              key={step.number}
              data-testid={`step-${idx + 1}`}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                textAlign: "center", gap: 14,
                position: "relative",
              }}
            >
              {idx < STEPS.length - 1 && (
                <div
                  className="step-connector"
                  style={{
                    position: "absolute", top: 28, left: "60%",
                    width: "80%", height: 1,
                    background: "rgba(255,255,255,0.15)",
                    pointerEvents: "none",
                  }}
                />
              )}
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "linear-gradient(135deg, #F57C00, #EA580C)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 20px rgba(245,124,0,0.35)",
                position: "relative", zIndex: 1,
              }}>
                <step.icon style={{ width: 24, height: 24, color: "#fff" }} />
              </div>
              <div style={{
                fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.40)",
                letterSpacing: 2, textTransform: "uppercase",
              }}>
                PASSO {step.number}
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>{step.title}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{step.description}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .steps-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
          .step-connector { display: none !important; }
        }
        @media (max-width: 480px) {
          .steps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
