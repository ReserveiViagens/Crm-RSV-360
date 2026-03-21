import { TrendingUp, Users, Star, Sparkles } from "lucide-react"

type QuickPick = "custo" | "familia" | "popular" | "combo"

interface QuickDecisionSectionProps {
  onPick: (pick: QuickPick) => void
  activePick?: QuickPick | null
}

const OPTIONS: {
  key: QuickPick
  label: string
  desc: string
  icon: typeof TrendingUp
  testId: string
  color: string
  bg: string
}[] = [
  {
    key: "custo",
    label: "Melhor custo-benefício",
    desc: "Mais desconto pelo preço",
    icon: TrendingUp,
    testId: "quick-custo",
    color: "#16A34A",
    bg: "#F0FDF4",
  },
  {
    key: "familia",
    label: "Vou com crianças",
    desc: "Ideal para família",
    icon: Users,
    testId: "quick-familia",
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    key: "popular",
    label: "Mais popular",
    desc: "O favorito dos viajantes",
    icon: Star,
    testId: "quick-popular",
    color: "#D97706",
    bg: "#FFFBEB",
  },
  {
    key: "combo",
    label: "Quero combo",
    desc: "Economize combinando",
    icon: Sparkles,
    testId: "quick-combo",
    color: "#0891B2",
    bg: "#F0F9FF",
  },
]

export function QuickDecisionSection({ onPick, activePick }: QuickDecisionSectionProps) {
  return (
    <div style={{ padding: "0 16px 4px" }}>
      <p style={{
        fontSize: 11,
        fontWeight: 700,
        color: "#6B7280",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        marginBottom: 8,
      }}>
        Escolha rápida
      </p>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 8,
      }}
        className="sm:grid-cols-4"
      >
        {OPTIONS.map(({ key, label, desc, icon: Icon, testId, color, bg }) => {
          const isActive = activePick === key
          return (
            <button
              key={key}
              data-testid={testId}
              onClick={() => onPick(key)}
              style={{
                background: isActive ? color : bg,
                border: `1.5px solid ${isActive ? color : "transparent"}`,
                borderRadius: 12,
                padding: "10px 12px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: isActive ? "rgba(255,255,255,0.25)" : `${color}20`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <Icon style={{ width: 16, height: 16, color: isActive ? "#fff" : color }} />
              </div>
              <div>
                <div style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: isActive ? "#fff" : "#1F2937",
                  lineHeight: 1.2,
                }}>
                  {label}
                </div>
                <div style={{
                  fontSize: 10,
                  color: isActive ? "rgba(255,255,255,0.8)" : "#6B7280",
                  marginTop: 1,
                }}>
                  {desc}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
