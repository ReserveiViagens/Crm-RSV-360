import { useState, useEffect, useRef, useCallback } from "react"
import { MapPin, Shield, CheckCircle, Award, Calendar, Star, Users, Heart, MessageCircle, Phone, Lock, FileCheck, BadgeCheck, TrendingUp, Building, Sparkles } from "lucide-react"
import { SiWhatsapp } from "react-icons/si"
import { HomeHeader } from "@/components/home/HomeHeader"
import { HomeFooter } from "@/components/home/HomeFooter"
import { MobileCTABar } from "@/components/home/MobileCTABar"
import { PublicPageShell, SectionContainer } from "@/components/layouts"
import { Link } from "wouter"

const TIMELINE = [
  { year: "2010", title: "Fundação", desc: "Início das operações em Caldas Novas com foco em turismo local e parcerias com hotéis da região.", color: "#2563EB", icon: Building },
  { year: "2015", title: "Crescimento", desc: "Alcançamos 1.000 clientes atendidos e firmamos parcerias com os principais resorts.", color: "#8B5CF6", icon: TrendingUp },
  { year: "2020", title: "Expansão Digital", desc: "Lançamento da plataforma online com reservas digitais e atendimento 24h.", color: "#F57C00", icon: Sparkles },
  { year: "2023", title: "IA Integrada", desc: "Lançamento do CaldasAI para atendimento inteligente e personalizado com recomendações por perfil.", color: "#2563EB", icon: Star },
  { year: "2025", title: "RSV360", desc: "Plataforma completa com leilões, flash deals, mapa interativo e viagens em grupo.", color: "#22C55E", icon: Award },
]

const STATS = [
  { target: 5000, label: "Clientes satisfeitos", prefix: "+", suffix: "" },
  { target: 50, label: "Hotéis parceiros", prefix: "+", suffix: "" },
  { target: 15, label: "Parques conveniados", prefix: "+", suffix: "" },
  { target: 15, label: "Anos de experiência", prefix: "", suffix: "" },
]

const TESTIMONIALS = [
  {
    name: "Mariana Costa",
    city: "São Paulo, SP",
    stars: 5,
    text: "Viagem incrível! A equipe da Reservei cuidou de tudo, desde o hotel até os ingressos dos parques. Voltarei com certeza!",
    initials: "MC",
    color: "#2563EB",
  },
  {
    name: "Carlos Silva",
    city: "Belo Horizonte, MG",
    stars: 5,
    text: "Melhor agência para Caldas Novas! Preços imbatíveis e atendimento excepcional. Recomendo para toda a família.",
    initials: "CS",
    color: "#F57C00",
  },
  {
    name: "Ana Rodrigues",
    city: "Goiânia, GO",
    stars: 5,
    text: "A IA do CaldasAI me ajudou a montar o roteiro perfeito. Economizei mais de 40% comparado a outros sites!",
    initials: "AR",
    color: "#22C55E",
  },
  {
    name: "Pedro Santos",
    city: "Brasília, DF",
    stars: 4,
    text: "Organizei a viagem do meu grupo de 20 pessoas com a plataforma de grupos. Tudo saiu perfeito e sem estresse.",
    initials: "PS",
    color: "#8B5CF6",
  },
]

const TRUST_BADGES = [
  { icon: Lock, label: "SSL Seguro", desc: "Conexão criptografada", color: "#2563EB" },
  { icon: FileCheck, label: "LGPD Conforme", desc: "Dados protegidos", color: "#22C55E" },
  { icon: BadgeCheck, label: "CADASTUR", desc: "Cadastro Turismo MT/GO", color: "#F57C00" },
  { icon: Star, label: "+5.000 Avaliações", desc: "Nota média 4.8", color: "#8B5CF6" },
]

const VALUES = [
  { icon: Heart, title: "Missão", desc: "Transformar sonhos de viagem em realidade, conectando pessoas aos melhores destinos com preços justos e atendimento humanizado.", color: "#2563EB" },
  { icon: Shield, title: "Valores", desc: "Transparência, segurança e compromisso com a satisfação do cliente em cada etapa da jornada.", color: "#22C55E" },
  { icon: Star, title: "Visão", desc: "Ser a maior e mais confiável plataforma de turismo termal do Brasil até 2030.", color: "#F57C00" },
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
        borderRadius: 16,
        padding: 24,
        textAlign: "center",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        border: "1px solid #F3F4F6",
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        opacity: isVisible ? 1 : 0,
        transition: `all 0.6s ease ${index * 0.1}s`,
      }}
    >
      <div style={{ fontSize: 36, fontWeight: 900, color: "#2563EB", marginBottom: 6 }}>
        {stat.prefix}{count.toLocaleString("pt-BR")}{stat.suffix}
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

function QuemSomosHero() {
  return (
    <div style={{
      background: "linear-gradient(135deg, #1e3a5f 0%, #2563EB 100%)",
      padding: "100px 20px 56px", textAlign: "center", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
      <div style={{ position: "absolute", bottom: -30, left: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />

      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: "rgba(245,124,0,0.18)", border: "1px solid rgba(245,124,0,0.35)",
        borderRadius: 20, padding: "4px 14px", marginBottom: 18,
      }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#F57C00", animation: "pulse 2s infinite" }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: "#F57C00", letterSpacing: 0.5 }}>QUEM SOMOS</span>
      </div>

      <div style={{
        width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center",
        border: "1px solid rgba(255,255,255,0.25)", margin: "0 auto 16px",
      }}>
        <Heart size={24} style={{ color: "#fff" }} />
      </div>

      <h1 data-testid="text-page-title" style={{ color: "#fff", fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.2 }}>
        A Maior Plataforma de Turismo<br />de Caldas Novas
      </h1>
      <p style={{ color: "rgba(255,255,255,0.82)", fontSize: 16, margin: "0 auto 28px", lineHeight: 1.6, maxWidth: 520 }}>
        Transformando sonhos de viagem em realidade desde 2010
      </p>

      <div style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
        {[
          { value: "+5.000", label: "Clientes satisfeitos" },
          { value: "+50", label: "Hotéis parceiros" },
          { value: "15 anos", label: "de experiência" },
        ].map(({ value, label }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#F57C00" }}>{value}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{label}</div>
          </div>
        ))}
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
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
    <PublicPageShell
      header={<HomeHeader />}
      heroSlot={<QuemSomosHero />}
      footer={<HomeFooter />}
      background="#F9FAFB"
    >
      <SectionContainer size="md">
        <p style={{ fontSize: 15, lineHeight: 1.85, color: "#4B5563", maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          A Reservei Viagens nasceu com o sonho de tornar Caldas Novas acessível para todos.
          Com mais de uma década de experiência no turismo goiano, conectamos viajantes aos
          melhores hotéis, resorts e parques aquáticos da região, sempre com os melhores preços
          e atendimento humanizado.
        </p>
      </SectionContainer>

      <SectionContainer size="md">
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1F2937", marginBottom: 8, textAlign: "center" }}>
          Missão, Visão e Valores
        </h2>
        <p style={{ fontSize: 14, color: "#6B7280", textAlign: "center", marginBottom: 32 }}>Os pilares que guiam nossa jornada</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="values-grid">
          {VALUES.map((v, i) => {
            const IconComp = v.icon
            return (
              <div key={i} style={{
                background: "#fff", borderRadius: 20, padding: 28,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #F3F4F6",
                textAlign: "center",
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: `${v.color}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px",
                }}>
                  <IconComp style={{ width: 26, height: 26, color: v.color }} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "#1F2937", marginBottom: 10 }}>{v.title}</h3>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7, margin: 0 }}>{v.desc}</p>
              </div>
            )
          })}
        </div>
      </SectionContainer>

      <SectionContainer size="md">
        <h2 data-testid="text-stats-title" style={{ fontSize: 24, fontWeight: 800, color: "#1F2937", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <TrendingUp style={{ width: 26, height: 26, color: "#2563EB" }} />
          Nossos Números
        </h2>
        <p style={{ fontSize: 14, color: "#6B7280", textAlign: "center", marginBottom: 32 }}>Resultados que falam por si</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="stats-grid">
          {STATS.map((stat, i) => (
            <AnimatedStat key={i} stat={stat} index={i} />
          ))}
        </div>
      </SectionContainer>

      <SectionContainer size="md">
        <h2 data-testid="text-timeline-title" style={{ fontSize: 24, fontWeight: 800, color: "#1F2937", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <Calendar style={{ width: 26, height: 26, color: "#2563EB" }} />
          Nossa História
        </h2>
        <p style={{ fontSize: 14, color: "#6B7280", textAlign: "center", marginBottom: 36 }}>Uma jornada de 15 anos transformando o turismo goiano</p>
        <div style={{ position: "relative", maxWidth: 720, margin: "0 auto" }}>
          <div style={{
            position: "absolute", left: 28, top: 0, bottom: 0,
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
                  display: "flex", gap: 20, marginBottom: 24, position: "relative",
                  cursor: "pointer",
                }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
                  background: isActive ? item.color : "#fff",
                  border: `3px solid ${item.color}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  zIndex: 1, boxShadow: isActive ? `0 4px 16px ${item.color}40` : "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                }}>
                  <IconComp style={{ width: 20, height: 20, color: isActive ? "#fff" : item.color }} />
                </div>
                <div style={{
                  paddingTop: 4, flex: 1,
                  background: isActive ? "#fff" : "transparent",
                  borderRadius: 16,
                  padding: isActive ? "16px 20px" : "4px 0",
                  boxShadow: isActive ? "0 4px 16px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.3s ease",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{
                      fontSize: 12, fontWeight: 800, color: "#fff",
                      background: item.color, borderRadius: 20,
                      padding: "2px 12px", letterSpacing: 0.5,
                    }}>{item.year}</span>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1F2937", margin: 0 }}>{item.title}</h3>
                  </div>
                  <p style={{
                    fontSize: 14, color: "#6B7280", margin: 0, lineHeight: 1.6,
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
      </SectionContainer>

      <SectionContainer size="md">
        <h2 data-testid="text-testimonials-title" style={{ fontSize: 24, fontWeight: 800, color: "#1F2937", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <MessageCircle style={{ width: 26, height: 26, color: "#2563EB" }} />
          O Que Nossos Clientes Dizem
        </h2>
        <p style={{ fontSize: 14, color: "#6B7280", textAlign: "center", marginBottom: 32 }}>Histórias reais de viajantes satisfeitos</p>

        <div style={{ position: "relative", overflow: "hidden", borderRadius: 20, maxWidth: 640, margin: "0 auto" }}>
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              data-testid={`testimonial-card-${i}`}
              style={{
                display: testimonialIndex === i ? "block" : "none",
                background: "#fff",
                borderRadius: 20,
                padding: 28,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                border: "1px solid #F3F4F6",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: "50%",
                  background: t.color, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <span style={{ color: "#fff", fontWeight: 700, fontSize: 17 }}>{t.initials}</span>
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: "#1F2937" }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF" }}>{t.city}</div>
                </div>
              </div>
              <StarRating rating={t.stars} />
              <p style={{ fontSize: 15, color: "#4B5563", lineHeight: 1.75, marginTop: 14, marginBottom: 0, fontStyle: "italic" }}>
                "{t.text}"
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              data-testid={`testimonial-dot-${i}`}
              onClick={() => setTestimonialIndex(i)}
              style={{
                width: testimonialIndex === i ? 28 : 8,
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
      </SectionContainer>

      <SectionContainer size="md">
        <h2 data-testid="text-trust-title" style={{ fontSize: 24, fontWeight: 800, color: "#1F2937", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <Shield style={{ width: 26, height: 26, color: "#2563EB" }} />
          Selos de Confiança
        </h2>
        <p style={{ fontSize: 14, color: "#6B7280", textAlign: "center", marginBottom: 32 }}>Comprometidos com a sua segurança e privacidade</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }} className="trust-grid">
          {TRUST_BADGES.map((badge, i) => (
            <div
              key={i}
              data-testid={`trust-badge-${i}`}
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: 20,
                textAlign: "center",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                border: "1px solid #F3F4F6",
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: "50%",
                background: `${badge.color}12`, display: "flex",
                alignItems: "center", justifyContent: "center",
                margin: "0 auto 10px",
              }}>
                <badge.icon style={{ width: 24, height: 24, color: badge.color }} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#1F2937", marginBottom: 3 }}>{badge.label}</div>
              <div style={{ fontSize: 11, color: "#9CA3AF" }}>{badge.desc}</div>
            </div>
          ))}
        </div>
      </SectionContainer>

      <SectionContainer size="lg">
        <div style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #2563EB 100%)",
          borderRadius: 24,
          padding: "48px 32px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -30, right: -30,
            width: 140, height: 140, borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }} />
          <Heart style={{ width: 40, height: 40, color: "#F57C00", margin: "0 auto 16px", display: "block" }} />
          <h3 data-testid="text-cta-title" style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 10 }}>
            Comece Sua Viagem Conosco
          </h3>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", lineHeight: 1.65, marginBottom: 28, maxWidth: 400, margin: "0 auto 28px" }}>
            Fale com nossos especialistas e monte o roteiro perfeito para Caldas Novas!
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              data-testid="button-whatsapp-cta"
              onClick={handleWhatsApp}
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: "#25D366", color: "#fff",
                border: "none", borderRadius: 14,
                padding: "15px 32px", fontSize: 16, fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 20px rgba(37,211,102,0.35)",
              }}
            >
              <SiWhatsapp style={{ width: 20, height: 20 }} />
              Falar no WhatsApp
            </button>
            <Link href="/contato">
              <button
                data-testid="button-contato-cta"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  background: "rgba(255,255,255,0.15)", color: "#fff",
                  border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 14,
                  padding: "15px 32px", fontSize: 16, fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Enviar mensagem
              </button>
            </Link>
          </div>
        </div>
      </SectionContainer>

      <MobileCTABar />

      <style>{`
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .trust-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .values-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </PublicPageShell>
  )
}
