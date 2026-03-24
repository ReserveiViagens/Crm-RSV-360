import { useState } from "react"
import { ChevronDown } from "lucide-react"

const FAQS = [
  {
    q: "O ingresso é digital?",
    a: "Sim! Todos os ingressos são digitais e enviados diretamente para o seu WhatsApp ou e-mail. Você não precisa imprimir nada.",
  },
  {
    q: "Preciso imprimir o ingresso?",
    a: "Não é necessário. Basta apresentar o ingresso digital na tela do seu celular na entrada do parque.",
  },
  {
    q: "Posso comprar para o mesmo dia?",
    a: "Sim, dependendo da disponibilidade. Recomendamos comprar com antecedência para garantir seu ingresso, especialmente em feriados e finais de semana.",
  },
  {
    q: "Como recebo meu ingresso?",
    a: "Após a confirmação da sua reserva, enviamos o ingresso por WhatsApp e e-mail em até poucos minutos.",
  },
  {
    q: "Posso falar com alguém no WhatsApp?",
    a: "Com certeza! Nossa equipe está disponível no WhatsApp para tirar dúvidas, ajudar na escolha do parque e confirmar sua reserva.",
  },
  {
    q: "É seguro comprar?",
    a: "Sim, totalmente seguro. Trabalhamos com parceiros confiáveis e garantimos que você receberá seu ingresso após a confirmação do pagamento.",
  },
  {
    q: "Tem combo com desconto?",
    a: "Sim! Temos combos especiais que permitem visitar 2 ou 3 parques diferentes com descontos de até 21% em relação à compra individual.",
  },
  {
    q: "Como escolher o melhor parque para crianças?",
    a: "Para famílias com crianças, recomendamos o Hot Park (área kids completa), o diRoma Acqua Park e o Kawana Park. Nossa equipe no WhatsApp pode te ajudar com a melhor escolha conforme a idade das crianças.",
  },
]

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <section
      id="faq"
      data-testid="landing-faq"
      style={{ background: "#F9FAFB", padding: "64px 20px" }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <span style={{
            display: "inline-block",
            background: "#FEF9C3", color: "#CA8A04",
            fontWeight: 700, fontSize: 12, letterSpacing: 1,
            padding: "5px 14px", borderRadius: 20, marginBottom: 12,
            textTransform: "uppercase",
          }}>
            Dúvidas frequentes
          </span>
          <h2
            data-testid="faq-title"
            style={{ fontSize: 32, fontWeight: 900, color: "#111827", letterSpacing: -0.5 }}
          >
            Perguntas frequentes
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              data-testid={`faq-item-${idx}`}
              style={{
                background: "#fff",
                border: `1.5px solid ${openIdx === idx ? "#2563EB" : "#F3F4F6"}`,
                borderRadius: 14,
                overflow: "hidden",
                transition: "border-color 0.2s",
              }}
            >
              <button
                data-testid={`faq-toggle-${idx}`}
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                style={{
                  width: "100%", padding: "18px 20px",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                  background: "none", border: "none", cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 700, color: "#111827", flex: 1 }}>
                  {faq.q}
                </span>
                <ChevronDown
                  style={{
                    width: 18, height: 18, color: "#6B7280", flexShrink: 0,
                    transform: openIdx === idx ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                />
              </button>
              {openIdx === idx && (
                <div
                  data-testid={`faq-answer-${idx}`}
                  style={{
                    padding: "0 20px 18px",
                    fontSize: 14, color: "#4B5563", lineHeight: 1.65,
                  }}
                >
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
