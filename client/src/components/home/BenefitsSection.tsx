import { Tag, MessageCircle, Map, ShoppingBag, Users, Building } from "lucide-react"

const BENEFITS = [
  {
    icon: Tag,
    title: "Descontos em ingressos e combos",
    description: "Acesso a preços exclusivos que você não encontra nas bilheterias.",
    color: "#F57C00",
  },
  {
    icon: MessageCircle,
    title: "Suporte rápido no WhatsApp",
    description: "Nossa equipe responde rápido para tirar qualquer dúvida antes e depois da compra.",
    color: "#25D366",
  },
  {
    icon: Map,
    title: "Escolha guiada — não erre o parque",
    description: "Identificamos o parque ideal para o seu perfil de viagem, para você não se arrepender.",
    color: "#2563EB",
  },
  {
    icon: ShoppingBag,
    title: "Compra simples e sem complicação",
    description: "Processo direto ao ponto. Reserve em minutos com poucos cliques.",
    color: "#7C3AED",
  },
  {
    icon: Users,
    title: "Ofertas para famílias, casais e grupos",
    description: "Opções pensadas para cada tamanho e perfil de grupo.",
    color: "#0891B2",
  },
  {
    icon: Building,
    title: "Combine parque + hotel",
    description: "Solução completa: parque e hospedagem num único lugar.",
    color: "#EA580C",
  },
]

export function BenefitsSection() {
  return (
    <section
      data-testid="landing-benefits"
      style={{ background: "#fff", padding: "64px 20px" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span style={{
            display: "inline-block",
            background: "#F5F3FF", color: "#7C3AED",
            fontWeight: 700, fontSize: 12, letterSpacing: 1,
            padding: "5px 14px", borderRadius: 20, marginBottom: 12,
            textTransform: "uppercase",
          }}>
            Nossos diferenciais
          </span>
          <h2
            data-testid="benefits-section-title"
            style={{ fontSize: 32, fontWeight: 900, color: "#111827", marginBottom: 12, letterSpacing: -0.5 }}
          >
            Por que reservar com a Reservei Viagens?
          </h2>
          <p style={{ fontSize: 16, color: "#6B7280", maxWidth: 560, margin: "0 auto" }}>
            Aqui você não precisa perder tempo comparando tudo sozinho. Nós organizamos as melhores opções para sua viagem.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
          className="benefits-grid"
        >
          {BENEFITS.map(b => (
            <div
              key={b.title}
              data-testid={`benefit-item-${b.title.slice(0, 20).replace(/\s/g, "-").toLowerCase()}`}
              style={{
                display: "flex", gap: 16,
                padding: "20px 22px", borderRadius: 16,
                border: "1.5px solid #F3F4F6",
                background: "#FAFAFA",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = `${b.color}40`
                e.currentTarget.style.boxShadow = `0 4px 20px ${b.color}14`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "#F3F4F6"
                e.currentTarget.style.boxShadow = ""
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${b.color}15`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, marginTop: 2,
              }}>
                <b.icon style={{ width: 20, height: 20, color: b.color }} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#111827", marginBottom: 4 }}>{b.title}</div>
                <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.55 }}>{b.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .benefits-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
