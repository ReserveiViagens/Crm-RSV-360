import { useState, useEffect, useRef, useCallback } from "react"
import { ArrowLeft, MapPin, Shield, CheckCircle, Award, Calendar, Star, Users, Heart, MessageCircle, Phone, ChevronRight, Lock, FileCheck, BadgeCheck, TrendingUp, Building, Sparkles } from "lucide-react"
import { Link } from "wouter";
import { SiWhatsapp } from "react-icons/si"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const TIMELINE = [
  { year: "2010", title: "Fundacao", desc: "Inicio das operacoes em Caldas Novas com foco em turismo local e parcerias com hoteis da regiao.", color: "#2563EB", icon: Building },
  { year: "2015", title: "Crescimento", desc: "Alcancamos 1.000 clientes atendidos e firmamos parcerias com os principais resorts.", color: "#8B5CF6", icon: TrendingUp },
  { year: "2020", title: "Expansao Digital", desc: "Lancamento da plataforma online com reservas digitais e atendimento 24h.", color: "#F57C00", icon: Sparkles },
  { year: "2023", title: "IA Integrada", desc: "Lancamento do CaldasAI para atendimento inteligente e personalizado com recomendacoes por perfil.", color: "#2563EB", icon: Star },
  { year: "2025", title: "RSV360", desc: "Plataforma completa com leiloes, flash deals, mapa interativo e viagens em grupo.", color: "#22C55E", icon: Award },
]

const STATS = [
  { target: 5000, label: "Clientes satisfeitos", prefix: "+", suffix: "" },
  { target: 50, label: "Hoteis parceiros", prefix: "+", suffix: "" },
  { target: 15, label: "Parques conveniados", prefix: "+", suffix: "" },
  { target: 15, label: "Anos de experiencia", prefix: "", suffix: "" },
]

const TESTIMONIALS = [
  {
    name: "Mariana Costa",
    city: "Sao Paulo, SP",
    stars: 5,
    text: "Viagem incrivel! A equipe da Reservei cuidou de tudo, desde o hotel ate os ingressos dos parques. Voltarei com certeza!",
    initials: "MC",
    color: "#2563EB",
  },
  {
    name: "Carlos Silva",
    city: "Belo Horizonte, MG",
    stars: 5,
    text: "Melhor agencia para Caldas Novas! Precos imbativeis e atendimento excepcional. Recomendo para toda a familia.",
    initials: "CS",
    color: "#F57C00",
  },
  {
    name: "Ana Rodrigues",
    city: "Goiania, GO",
    stars: 5,
    text: "A IA do CaldasAI me ajudou a montar o roteiro perfeito. Economizei mais de 40% comparado a outros sites!",
    initials: "AR",
    color: "#22C55E",
  },
  {
    name: "Pedro Santos",
    city: "Brasilia, DF",
    stars: 4,
    text: "Organizei a viagem do meu grupo de 20 pessoas com a plataforma de grupos. Tudo saiu perfeito e sem estresse.",
    initials: "PS",
    color: "#8B5CF6",
  },
]

const TEAM = [
  { name: "Ricardo Mendes", role: "CEO & Fundador", initials: "RM", color: "#2563EB" },
  { name: "Juliana Ferreira", role: "Diretora de Operacoes", initials: "JF", color: "#F57C00" },
  { name: "Lucas Oliveira", role: "Head de Tecnologia", initials: "LO", color: "#22C55E" },
  { name: "Camila Rocha", role: "Atendimento VIP", initials: "CR", color: "#8B5CF6" },
]

const TRUST_BADGES = [
  { icon: Lock, label: "SSL Seguro", desc: "Conexao criptografada", color: "#2563EB" },
  { icon: FileCheck, label: "LGPD Conforme", desc: "Dados protegidos", color: "#22C55E" },
  { icon: BadgeCheck, label: "Parceiro Oficial", desc: "Caldas Novas", color: "#F57C00" },
  { icon: Star, label: "+5.000 Avaliacoes", desc: "Nota media 4.8", color: "#8B5CF6" },
]

function useCountUp(target: number, isVisible: boolean, duration: number = 2000) {
  const [count, setCount] = useState(0)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    if (!isVisible) return
    const startTime = performance.now()
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [isVisible, target, duration])

  return count
}

function AnimatedStat({ stat, index }: { stat: typeof STATS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const count = useCountUp(stat.target, isVisible)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-testid={`stat-card-${index}`}
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 20,
        textAlign: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        opacity: isVisible ? 1 : 0,
        transition: `all 0.6s ease ${index * 0.1}s`,
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 900, color: "#2563EB", marginBottom: 4 }}>
        {stat.prefix}{count}{stat.suffix}
      </div>
      <p style={{ fontSize: 13, color: "#6B7280", margin: 0, fontWeight: 500 }}>{stat.label}</p>
    </div>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          style={{
            width: 14,
            height: 14,
            fill: i < rating ? "#F59E0B" : "none",
            color: i < rating ? "#F59E0B" : "#D1D5DB",
          }}
        />
      ))}
    </div>
  )
}

export default function QuemSomosPage() {
  const [activeTimeline, setActiveTimeline] = useState<number | null>(null)
  const [testimonialIndex, setTestimonialIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleWhatsApp = useCallback(() => {
    window.open("https://wa.me/5564993197555?text=Ol%C3%A1!%20Quero%20come%C3%A7ar%20a%20planejar%20minha%20viagem%20para%20Caldas%20Novas!", "_blank")
  }, [])

  return (
    <div className="rsv-subpage" style={{ background: "#F9FAFB", minHeight: "100vh" }}>
      <div style={{
        background: "#fff", padding: "12px 16px",
        display: "flex", alignItems: "center", gap: 12,
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 40,
      }}>
        <Link href="/" style={{ color: "#1F2937", display: "flex" }} data-testid="link-back-home">
          <ArrowLeft style={{ width: 24, height: 24 }} />
        </Link>
        <span style={{ fontSize: 18, fontWeight: 900, color: "#1F2937" }}>RSV<span style={{ color: "#F57C00" }}>360</span></span>
      </div>

      <div style={{
        background: "linear-gradient(135deg, #1e3a5f 0%, #2563EB 100%)",
        padding: "40px 16px 48px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -40, right: -40,
          width: 160, height: 160, borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
        }} />
        <div style={{
          position: "absolute", bottom: -20, left: -20,
          width: 100, height: 100, borderRadius: "50%",
          background: "rgba(255,255,255,0.03)",
        }} />
        <h1 data-testid="text-page-title" style={{
          fontSize: 28, fontWeight: 900, color: "#fff",
          marginBottom: 8, position: "relative",
        }}>
          Quem Somos
        </h1>
        <p style={{
          fontSize: 15, color: "rgba(255,255,255,0.85)",
          lineHeight: 1.6, maxWidth: 360, margin: "0 auto",
          position: "relative",
        }}>
          Transformando sonhos de viagem em realidade desde 2010. Somos a maior plataforma de turismo de Caldas Novas.
        </p>
      </div>

      <div style={{ padding: "24px 16px 120px" }}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "#4B5563", marginBottom: 0 }}>
            A Reservei Viagens nasceu com o sonho de tornar Caldas Novas acessivel para todos.
            Com mais de uma decada de experiencia no turismo goiano, conectamos viajantes aos
            melhores hoteis, resorts e parques aquaticos da regiao, sempre com os melhores precos
            e atendimento humanizado.
          </p>
        </div>

        <div style={{ marginBottom: 40 }}>
          <h2 data-testid="text-stats-title" style={{ fontSize: 20, fontWeight: 800, color: "#1F2937", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <TrendingUp style={{ width: 22, height: 22, color: "#2563EB" }} />
            Nossos Numeros
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {STATS.map((stat, i) => (
              <AnimatedStat key={i} stat={stat} index={i} />
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 40 }}>
          <h2 data-testid="text-timeline-title" style={{ fontSize: 20, fontWeight: 800, color: "#1F2937", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
            <Calendar style={{ width: 22, height: 22, color: "#2563EB" }} />
            Nossa Historia
          </h2>
          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute", left: 24, top: 0, bottom: 0,
              width: 3, background: "linear-gradient(to bottom, #2563EB, #22C55E)",
              borderRadius: 2,
            }} />
            {TIMELINE.map((item, i) => {
              const isActive = activeTimeline === i
              const IconComp = item.icon
              return (
                <div
                  key={i}
                  data-testid={`timeline-item-${i}`}
                  onClick={() => setActiveTimeline(isActive ? null : i)}
                  style={{
                    display: "flex", gap: 16, marginBottom: 20, position: "relative",
                    cursor: "pointer",
                  }}
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
                    background: isActive ? item.color : "#fff",
                    border: `3px solid ${item.color}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    zIndex: 1, boxShadow: isActive ? `0 4px 16px ${item.color}40` : "0 2px 8px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                  }}>
                    <IconComp style={{ width: 18, height: 18, color: isActive ? "#fff" : item.color }} />
                  </div>
                  <div style={{
                    paddingTop: 2, flex: 1,
                    background: isActive ? "#fff" : "transparent",
                    borderRadius: 12,
                    padding: isActive ? "12px 16px" : "4px 0",
                    boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.08)" : "none",
                    transition: "all 0.3s ease",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{
                        fontSize: 12, fontWeight: 800, color: "#fff",
                        background: item.color, borderRadius: 20,
                        padding: "2px 10px", letterSpacing: 0.5,
                      }}>{item.year}</span>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: 0 }}>{item.title}</h3>
                    </div>
                    <p style={{
                      fontSize: 13, color: "#6B7280", margin: 0, lineHeight: 1.6,
                      maxHeight: isActive ? 100 : 0,
                      overflow: "hidden",
                      opacity: isActive ? 1 : 0,
                      transition: "all 0.3s ease",
                    }}>{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ marginBottom: 40 }}>
          <h2 data-testid="text-testimonials-title" style={{ fontSize: 20, fontWeight: 800, color: "#1F2937", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <MessageCircle style={{ width: 22, height: 22, color: "#2563EB" }} />
            O Que Nossos Clientes Dizem
          </h2>

          <div style={{ position: "relative", overflow: "hidden", borderRadius: 16 }}>
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                data-testid={`testimonial-card-${i}`}
                style={{
                  display: testimonialIndex === i ? "block" : "none",
                  background: "#fff",
                  borderRadius: 16,
                  padding: 20,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: "50%",
                    background: t.color, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>{t.initials}</span>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#1F2937" }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "#9CA3AF" }}>{t.city}</div>
                  </div>
                </div>
                <StarRating rating={t.stars} />
                <p style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.7, marginTop: 12, marginBottom: 0, fontStyle: "italic" }}>
                  "{t.text}"
                </p>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                data-testid={`testimonial-dot-${i}`}
                onClick={() => setTestimonialIndex(i)}
                style={{
                  width: testimonialIndex === i ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: testimonialIndex === i ? "#2563EB" : "#D1D5DB",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 40 }}>
          <h2 data-testid="text-team-title" style={{ fontSize: 20, fontWeight: 800, color: "#1F2937", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Users style={{ width: 22, height: 22, color: "#2563EB" }} />
            Nossa Equipe
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {TEAM.map((member, i) => (
              <div
                key={i}
                data-testid={`team-member-${i}`}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: 20,
                  textAlign: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: member.color, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  margin: "0 auto 12px",
                  boxShadow: `0 4px 12px ${member.color}30`,
                }}>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>{member.initials}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#1F2937", marginBottom: 4 }}>{member.name}</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{member.role}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #2563EB 100%)",
          borderRadius: 20,
          padding: "32px 20px",
          textAlign: "center",
          marginBottom: 40,
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -30, right: -30,
            width: 120, height: 120, borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }} />
          <Heart style={{ width: 36, height: 36, color: "#F57C00", margin: "0 auto 12px", display: "block" }} />
          <h3 data-testid="text-cta-title" style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 8 }}>
            Comece Sua Viagem Conosco
          </h3>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.6, marginBottom: 20, maxWidth: 300, margin: "0 auto 20px" }}>
            Fale com nossos especialistas e monte o roteiro perfeito para Caldas Novas!
          </p>
          <button
            data-testid="button-whatsapp-cta"
            onClick={handleWhatsApp}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#25D366", color: "#fff",
              border: "none", borderRadius: 12,
              padding: "14px 28px", fontSize: 16, fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(37,211,102,0.3)",
            }}
          >
            <SiWhatsapp style={{ width: 20, height: 20 }} />
            Falar no WhatsApp
          </button>
        </div>

        <div style={{ marginBottom: 32 }}>
          <h2 data-testid="text-trust-title" style={{ fontSize: 20, fontWeight: 800, color: "#1F2937", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Shield style={{ width: 22, height: 22, color: "#2563EB" }} />
            Selos de Confianca
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {TRUST_BADGES.map((badge, i) => (
              <div
                key={i}
                data-testid={`trust-badge-${i}`}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: 16,
                  textAlign: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: `${badge.color}12`, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  margin: "0 auto 8px",
                }}>
                  <badge.icon style={{ width: 22, height: 22, color: badge.color }} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#1F2937", marginBottom: 2 }}>{badge.label}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>{badge.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          textAlign: "center", padding: "16px 0",
          borderTop: "1px solid #E5E7EB",
        }}>
          <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>
            Reservei Viagens - RSV360 - Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  )
}
