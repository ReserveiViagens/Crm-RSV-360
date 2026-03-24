import { useState } from "react"
import { Link, useSearch } from "wouter"
import {
  Bus, Users, Star, ArrowRight, Shield, Headphones,
  Zap, Thermometer, Waves, Share2, CheckCircle2,
  Plus, Sparkles, Crown, Rocket, Search, MapPin,
  Phone, Calendar, Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { LiderApplicationDialog } from "@/components/lider-application-dialog"
import { HomeHeader } from "@/components/home/HomeHeader"
import { HomeFooter } from "@/components/home/HomeFooter"
import { MobileCTABar } from "@/components/home/MobileCTABar"

const WA_URL = "https://wa.me/5564993197555?text=Olá! Quero informações sobre excursões para Caldas Novas."

const PERFIS = [
  { id: "família", label: "Família", emoji: "👨‍👩‍👧‍👦", desc: "Crianças bem-vindas", cor: "#EF4444", bg: "rgba(239,68,68,0.12)" },
  { id: "aventura", label: "Aventura", emoji: "🏄", desc: "Radical & adrenalina", cor: "#F57C00", bg: "rgba(245,124,0,0.12)" },
  { id: "luxo", label: "Luxo", emoji: "👑", desc: "Resort 5★ & all-inclusive", cor: "#7C3AED", bg: "rgba(124,58,237,0.12)" },
  { id: "econômico", label: "Econômico", emoji: "💰", desc: "A partir de R$ 290", cor: "#16A34A", bg: "rgba(22,163,74,0.12)" },
]

const TOP_EXCURSOES = [
  {
    id: "1",
    titulo: "Caldas Novas Família Total",
    destino: "Caldas Novas, GO",
    saida: "Goiânia, GO",
    data: "18–21 Abr",
    dias: 4,
    preco: 890,
    precoOriginal: 1190,
    vagas: 7,
    rating: 4.9,
    avaliacoes: 312,
    tag: "Mais vendida",
    imagem: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
    inclui: ["Transporte", "Hotel 4★", "Café da manhã", "Guia"],
    slug: "caldas-novas-familia-total",
  },
  {
    id: "2",
    titulo: "Hot Park & Rio Quente Fest",
    destino: "Rio Quente, GO",
    saida: "Brasília, DF",
    data: "25–27 Abr",
    dias: 3,
    preco: 720,
    precoOriginal: 950,
    vagas: 11,
    rating: 4.8,
    avaliacoes: 184,
    tag: "Ingresso incluso",
    imagem: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80",
    inclui: ["Transporte", "Hotel 5★", "Hot Park", "Jantar"],
    slug: "hot-park-rio-quente-fest",
  },
  {
    id: "11",
    titulo: "Caldas All Inclusive Deluxe",
    destino: "Caldas Novas, GO",
    saida: "Goiânia, GO",
    data: "30 Mai–3 Jun",
    dias: 5,
    preco: 1680,
    precoOriginal: 2100,
    vagas: 5,
    rating: 5.0,
    avaliacoes: 152,
    tag: "Premium",
    imagem: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    inclui: ["Transporte VIP", "Resort 5★", "All Inclusive", "Spa"],
    slug: "caldas-all-inclusive-deluxe",
  },
]

export default function Excursoes() {
  const [liderDialogOpen, setLiderDialogOpen] = useState(false)
  const [perfilAtivo, setPerfilAtivo] = useState<string | null>(null)
  const { user } = useAuth()
  const search = useSearch()
  const params = new URLSearchParams(search)
  const perfilParam = params.get("perfil")
  const perfil = perfilAtivo ?? perfilParam

  const isLider = user?.role === "LIDER" || user?.role === "admin"

  function getCatalogoLink() {
    if (perfil) return `/catalogo-excursoes?perfil=${perfil}`
    return "/catalogo-excursoes"
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FA" }}>
      <HomeHeader />

      {/* ── HERO ─────────────────────────────────────── */}
      <section
        data-testid="excursoes-hero"
        style={{
          position: "relative", overflow: "hidden",
          background: "#0F1F38",
          minHeight: 520,
        }}
      >
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1510525009512-ad7fc13d8422?w=1600&q=60')",
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.25,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(15,31,56,0.6) 0%, rgba(15,31,56,0.85) 100%)",
        }} />

        <div style={{
          position: "relative", maxWidth: 1100, margin: "0 auto",
          padding: "60px 20px 40px",
          display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
        }}>
          {/* Live badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 999, padding: "6px 16px", marginBottom: 24,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "#22C55E", display: "inline-block",
              boxShadow: "0 0 0 2px rgba(34,197,94,0.3)",
            }} />
            <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>
              {TOP_EXCURSOES.reduce((a, e) => a + e.vagas, 0)} vagas abertas agora
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 900,
            color: "#fff", lineHeight: 1.15, marginBottom: 14, letterSpacing: -1,
          }}>
            Excursões em grupo com<br />
            <span style={{ color: "#F59E0B" }}>tudo incluso</span>
          </h1>

          <p style={{
            fontSize: 16, color: "rgba(255,255,255,0.75)",
            maxWidth: 560, lineHeight: 1.7, marginBottom: 32,
          }}>
            Viaje com conforto e segurança para Caldas Novas e Rio Quente. Ônibus, hotel, passeios e guia — tudo organizado para você.
          </p>

          {/* Profile quick-picks */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 32 }}>
            {PERFIS.map(p => (
              <button
                key={p.id}
                data-testid={`btn-perfil-excursoes-${p.id}`}
                onClick={() => setPerfilAtivo(prev => prev === p.id ? null : p.id)}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  gap: 4, padding: "10px 18px", borderRadius: 14,
                  background: perfil === p.id ? p.bg : "rgba(255,255,255,0.10)",
                  border: `2px solid ${perfil === p.id ? p.cor : "rgba(255,255,255,0.18)"}`,
                  cursor: "pointer", transition: "all 0.18s",
                  backdropFilter: "blur(6px)",
                  minWidth: 90,
                }}
              >
                <span style={{ fontSize: 22 }}>{p.emoji}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: perfil === p.id ? p.cor : "#fff" }}>{p.label}</span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>{p.desc}</span>
              </button>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href={getCatalogoLink()}>
              <button
                data-testid="btn-hero-ver-excursoes"
                style={{
                  padding: "14px 32px", borderRadius: 12,
                  background: "linear-gradient(135deg, #F57C00, #EA580C)",
                  color: "#fff", fontWeight: 800, fontSize: 15,
                  border: "none", cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(245,124,0,0.4)",
                  display: "flex", alignItems: "center", gap: 8,
                }}
              >
                Ver excursões disponíveis
                <ArrowRight style={{ width: 18, height: 18 }} />
              </button>
            </Link>
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="btn-hero-whatsapp"
              style={{
                padding: "14px 28px", borderRadius: 12,
                background: "#25D366", color: "#fff",
                fontWeight: 700, fontSize: 15, textDecoration: "none",
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              <Phone style={{ width: 16, height: 16 }} />
              Falar no WhatsApp
            </a>
          </div>

          {/* Stats bar */}
          <div style={{
            display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center",
            marginTop: 40, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.12)",
          }}>
            {[
              { icon: Users, value: "12.400+", label: "Viajantes satisfeitos" },
              { icon: Bus, value: "280+", label: "Excursões realizadas" },
              { icon: Star, value: "4.9", label: "Avaliação média" },
              { icon: Shield, value: "100%", label: "Seguro e garantido" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <Icon style={{ width: 18, height: 18, color: "#F59E0B" }} />
                <span style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>{value}</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ─────────────────────────────────── */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #E5E7EB",
        padding: "16px 20px",
      }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center",
        }}>
          {[
            { emoji: "🛡️", text: "Pagamento seguro e protegido" },
            { emoji: "✅", text: "Organizadores verificados" },
            { emoji: "📞", text: "Suporte via WhatsApp 7 dias" },
            { emoji: "🎯", text: "Melhores preços garantidos" },
          ].map(item => (
            <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>{item.emoji}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── TOP EXCURSÕES ─────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "52px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: "#1E3A5F", marginBottom: 4 }}>
              Excursões em destaque
            </h2>
            <p style={{ fontSize: 14, color: "#6B7280" }}>Vagas limitadas — garanta a sua hoje</p>
          </div>
          <Link href="/catalogo-excursoes">
            <button
              data-testid="btn-ver-todas-excursoes"
              style={{
                padding: "10px 20px", borderRadius: 10,
                background: "transparent", border: "2px solid #1E3A5F",
                color: "#1E3A5F", fontWeight: 700, fontSize: 13, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              Ver todas <ArrowRight style={{ width: 14, height: 14 }} />
            </button>
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {TOP_EXCURSOES.map(exc => {
            const desconto = Math.round(((exc.precoOriginal - exc.preco) / exc.precoOriginal) * 100)
            return (
              <div
                key={exc.id}
                data-testid={`card-excursao-destaque-${exc.id}`}
                style={{
                  background: "#fff", borderRadius: 16,
                  border: "1px solid #E5E7EB", overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  display: "flex", flexDirection: "column",
                }}
              >
                <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
                  <img
                    src={exc.imagem}
                    alt={exc.titulo}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)",
                  }} />
                  <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6 }}>
                    <span style={{
                      background: "#F57C00", color: "#fff",
                      fontSize: 11, fontWeight: 700,
                      padding: "3px 10px", borderRadius: 999,
                    }}>{exc.tag}</span>
                    <span style={{
                      background: "#16A34A", color: "#fff",
                      fontSize: 11, fontWeight: 700,
                      padding: "3px 10px", borderRadius: 999,
                    }}>-{desconto}%</span>
                  </div>
                  <div style={{ position: "absolute", bottom: 12, left: 12, right: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#fff", fontSize: 13 }}>
                      <MapPin style={{ width: 12, height: 12 }} />
                      {exc.destino}
                    </div>
                  </div>
                </div>

                <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1E3A5F", lineHeight: 1.3 }}>
                    {exc.titulo}
                  </h3>

                  <div style={{ display: "flex", gap: 14, fontSize: 12, color: "#6B7280" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Calendar style={{ width: 12, height: 12 }} /> {exc.data}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock style={{ width: 12, height: 12 }} /> {exc.dias} dias
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Star style={{ width: 12, height: 12, fill: "#F59E0B", color: "#F59E0B" }} />
                      {exc.rating} ({exc.avaliacoes})
                    </span>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {exc.inclui.map(item => (
                      <span key={item} style={{
                        fontSize: 11, background: "#F0FDF4",
                        color: "#16A34A", border: "1px solid #BBF7D0",
                        borderRadius: 999, padding: "2px 8px",
                        display: "flex", alignItems: "center", gap: 3,
                      }}>
                        <CheckCircle2 style={{ width: 10, height: 10 }} />
                        {item}
                      </span>
                    ))}
                  </div>

                  {/* Urgency */}
                  <div style={{
                    fontSize: 12, color: exc.vagas <= 5 ? "#DC2626" : "#D97706",
                    fontWeight: 600,
                  }}>
                    🔥 Apenas {exc.vagas} vagas restantes
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: "auto" }}>
                    <div>
                      <div style={{ fontSize: 12, color: "#9CA3AF", textDecoration: "line-through" }}>
                        R$ {exc.precoOriginal.toLocaleString("pt-BR")}
                      </div>
                      <div style={{ fontSize: 24, fontWeight: 900, color: "#1E3A5F" }}>
                        R$ {exc.preco.toLocaleString("pt-BR")}
                      </div>
                      <div style={{ fontSize: 11, color: "#6B7280" }}>por pessoa</div>
                    </div>
                    <Link href={`/excursoes/${exc.slug}`}>
                      <button
                        data-testid={`btn-reservar-destaque-${exc.id}`}
                        style={{
                          padding: "10px 20px", borderRadius: 10,
                          background: "linear-gradient(135deg, #F57C00, #EA580C)",
                          color: "#fff", fontWeight: 700, fontSize: 13,
                          border: "none", cursor: "pointer",
                        }}
                      >
                        Reservar
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Link href="/catalogo-excursoes">
            <button
              data-testid="btn-catalogo-completo"
              style={{
                padding: "14px 40px", borderRadius: 12,
                background: "linear-gradient(135deg, #1E3A5F, #2563EB)",
                color: "#fff", fontWeight: 700, fontSize: 15,
                border: "none", cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 8,
              }}
            >
              Ver catálogo completo ({18} excursões)
              <ArrowRight style={{ width: 18, height: 18 }} />
            </button>
          </Link>
        </div>
      </section>

      {/* ── COMO FUNCIONA ─────────────────────────────── */}
      <section style={{ background: "#F0F4FF", borderTop: "1px solid #E5E7EB", marginTop: 52, padding: "52px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 26, fontWeight: 900, color: "#1E3A5F", marginBottom: 8 }}>
            Como funciona
          </h2>
          <p style={{ textAlign: "center", color: "#6B7280", marginBottom: 40 }}>
            Simples assim — você foca no prazer, a gente cuida do resto
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {[
              { icon: Search, step: "1", titulo: "Escolha a excursão", desc: "Filtre por data, destino e categoria. Compare preços e o que está incluso.", cor: "#2563EB", bg: "#EFF6FF" },
              { icon: Users, step: "2", titulo: "Reserve sua vaga", desc: "Garanta seu lugar com pagamento seguro. Parcelamos em até 12x sem juros.", cor: "#16A34A", bg: "#F0FDF4" },
              { icon: Thermometer, step: "3", titulo: "Receba confirmação", desc: "Você recebe todos os detalhes da viagem por WhatsApp e e-mail.", cor: "#F57C00", bg: "#FFF7ED" },
              { icon: Waves, step: "4", titulo: "Aproveite sem preocupação", desc: "Tudo organizado. Você só aparece para embarcar e curtir!", cor: "#7C3AED", bg: "#F5F3FF" },
            ].map(({ icon: Icon, step, titulo, desc, cor, bg }) => (
              <div key={step} style={{
                background: "#fff", borderRadius: 16,
                border: "1px solid #E5E7EB",
                padding: 20,
                display: "flex", gap: 16,
                boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  background: bg, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon style={{ width: 22, height: 22, color: cor }} />
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                    Passo {step}
                  </p>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1E3A5F", marginBottom: 4 }}>{titulo}</h3>
                  <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.5 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POR QUE RESERVAR ─────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "52px 20px" }}>
        <h2 style={{ textAlign: "center", fontSize: 26, fontWeight: 900, color: "#1E3A5F", marginBottom: 40 }}>
          Por que reservar com a Reservei?
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {[
            { icon: Shield, titulo: "Pagamento 100% seguro", desc: "Seus dados e dinheiro protegidos com criptografia de ponta.", cor: "#2563EB" },
            { icon: Rocket, titulo: "Confirmação imediata", desc: "Reserva confirmada na hora. Sem burocracia, sem espera.", cor: "#16A34A" },
            { icon: Zap, titulo: "Melhor preço garantido", desc: "Encontrou mais barato? Te devolvemos a diferença.", cor: "#F57C00" },
            { icon: Share2, titulo: "Compartilhe com amigos", desc: "Leve mais pessoas e ganhe descontos adicionais no grupo.", cor: "#7C3AED" },
          ].map(({ icon: Icon, titulo, desc, cor }) => (
            <div key={titulo} style={{
              background: "#fff", borderRadius: 16,
              border: "1px solid #E5E7EB",
              padding: 24, textAlign: "center",
              boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16, margin: "0 auto 14px",
                background: `${cor}18`, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon style={{ width: 24, height: 24, color: cor }} />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: "#1E3A5F", marginBottom: 8 }}>{titulo}</h3>
              <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA LIDERANÇA ─────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: "0 0 52px", padding: "0 20px" }} data-testid="cta-lideranca">
        {isLider ? (
          <div style={{
            borderRadius: 20, overflow: "hidden", position: "relative",
            background: "linear-gradient(135deg, #F59E0B, #EA580C)",
            padding: "48px 40px", textAlign: "center", color: "#fff",
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.2)", borderRadius: 999,
              padding: "6px 16px", fontSize: 13, marginBottom: 16,
              border: "1px solid rgba(255,255,255,0.3)",
            }}>
              <Crown style={{ width: 14, height: 14, color: "#FDE68A" }} />
              Você é um Líder Reservei ✓
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 10 }}>Pronto para criar sua excursão?</h2>
            <p style={{ fontSize: 15, opacity: 0.85, marginBottom: 24 }}>Acesse o wizard completo e monte seu roteiro profissional.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/criar-excursao">
                <button
                  data-testid="btn-criar-excursao-cta"
                  style={{
                    padding: "13px 32px", borderRadius: 12,
                    background: "#fff", color: "#D97706",
                    fontWeight: 800, fontSize: 15, border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 8,
                  }}
                >
                  <Plus style={{ width: 18, height: 18 }} /> Criar minha excursão
                </button>
              </Link>
              <Link href="/viagens-grupo">
                <button
                  data-testid="btn-meus-grupos-cta"
                  style={{
                    padding: "13px 32px", borderRadius: 12,
                    background: "transparent", color: "#fff",
                    fontWeight: 700, fontSize: 15,
                    border: "1px solid rgba(255,255,255,0.4)", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 8,
                  }}
                >
                  <Users style={{ width: 18, height: 18 }} /> Meus Grupos
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div style={{
            borderRadius: 20, overflow: "hidden",
            background: "linear-gradient(135deg, #1E3A5F, #2563EB)",
            padding: "48px 40px", textAlign: "center", color: "#fff",
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.3)",
              borderRadius: 999, padding: "6px 16px", fontSize: 13, marginBottom: 16,
            }}>
              <Crown style={{ width: 14, height: 14, color: "#FCD34D" }} />
              <span style={{ color: "#FCD34D", fontWeight: 700 }}>Programa Líder</span>
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 10 }}>Quer organizar sua própria excursão?</h2>
            <p style={{ fontSize: 15, opacity: 0.8, marginBottom: 28, maxWidth: 520, margin: "0 auto 28px" }}>
              Crie e gerencie excursões com ferramentas profissionais — de graça, sem comissões escondidas.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, maxWidth: 700, margin: "0 auto 28px" }}>
              {[
                { icon: Rocket, title: "Wizard de criação", desc: "Monte roteiro completo em minutos" },
                { icon: Users, title: "Gestão de grupo", desc: "Controle de vagas em tempo real" },
                { icon: Share2, title: "Link direto", desc: "Compartilhe via WhatsApp" },
                { icon: Sparkles, title: "CaldasAI Insights", desc: "Sugestões inteligentes de preço" },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} style={{
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 12, padding: "14px 16px", textAlign: "left",
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: "rgba(252,211,77,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8,
                  }}>
                    <Icon style={{ width: 16, height: 16, color: "#FCD34D" }} />
                  </div>
                  <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{title}</p>
                  <p style={{ fontSize: 12, opacity: 0.7 }}>{desc}</p>
                </div>
              ))}
            </div>
            <button
              data-testid="btn-tornar-lider-cta"
              onClick={() => setLiderDialogOpen(true)}
              style={{
                padding: "14px 40px", borderRadius: 12,
                background: "linear-gradient(135deg, #F59E0B, #F57C00)",
                color: "#7C2D12", fontWeight: 800, fontSize: 15,
                border: "none", cursor: "pointer",
                boxShadow: "0 4px 20px rgba(245,124,0,0.4)",
              }}
            >
              <Crown style={{ width: 18, height: 18, display: "inline", marginRight: 8 }} />
              Quero criar minha excursão — É grátis!
            </button>
            <p style={{ fontSize: 12, opacity: 0.55, marginTop: 10 }}>
              Sem taxas de adesão · Ative em 1 clique
            </p>
          </div>
        )}
      </section>

      {/* ── DEPOIMENTOS ───────────────────────────────── */}
      <section style={{ background: "#F0F4FF", borderTop: "1px solid #E5E7EB", padding: "52px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#1E3A5F" }}>O que dizem nossos viajantes</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {[1,2,3,4,5].map(i => (
                <Star key={i} style={{ width: 16, height: 16, fill: "#F59E0B", color: "#F59E0B" }} />
              ))}
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1E3A5F", marginLeft: 6 }}>4.9/5</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {[
              { nome: "Mariana R.", cidade: "Goiânia", avatar: "MR", nota: 5, texto: "Melhor excursão que já fiz! Tudo muito organizado, guia atencioso e hotel excelente. Já reservei para o próximo mês.", excursao: "Caldas Novas Família Total" },
              { nome: "Ricardo S.", cidade: "Brasília", avatar: "RS", nota: 5, texto: "Viagem incrível ao Hot Park! O ônibus saiu no horário e o hotel era ainda melhor do que esperávamos. Recomendo!", excursao: "Hot Park & Rio Quente Fest" },
              { nome: "Carla M.", cidade: "Uberlândia", avatar: "CM", nota: 5, texto: "Fui na Semana Santa e superou todas as expectativas. All inclusive de verdade, atendimento impecável. Nota 10!", excursao: "Semana Santa Caldas Premium" },
            ].map(d => (
              <div key={d.nome}
                data-testid={`card-depoimento-${d.nome.replace(" ", "")}`}
                style={{
                  background: "#fff", borderRadius: 16,
                  border: "1px solid #E5E7EB", padding: 20,
                  boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: "#EFF6FF", color: "#2563EB",
                    fontWeight: 800, fontSize: 13,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{d.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: 14, color: "#1E3A5F" }}>{d.nome}</p>
                    <p style={{ fontSize: 12, color: "#9CA3AF" }}>{d.cidade}</p>
                  </div>
                  <div style={{ display: "flex", gap: 2 }}>
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} style={{ width: 13, height: 13, fill: i <= d.nota ? "#F59E0B" : "none", color: "#F59E0B" }} />
                    ))}
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.6, marginBottom: 12 }}>"{d.texto}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#2563EB", fontWeight: 600 }}>
                  <Bus style={{ width: 13, height: 13 }} />
                  {d.excursao}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUPORTE ───────────────────────────────────── */}
      <div style={{ borderTop: "1px solid #E5E7EB", background: "#fff", padding: "24px 20px" }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Headphones style={{ width: 32, height: 32, color: "#2563EB" }} />
            <div>
              <p style={{ fontWeight: 700, fontSize: 15, color: "#1E3A5F" }}>Precisa de ajuda para escolher?</p>
              <p style={{ fontSize: 13, color: "#6B7280" }}>Nosso time está disponível de segunda a sábado, 8h–20h</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link href="/caldas-ai">
              <button
                data-testid="btn-caldas-ai-suporte"
                style={{
                  padding: "10px 20px", borderRadius: 10,
                  background: "transparent", border: "2px solid #E5E7EB",
                  color: "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                <Sparkles style={{ width: 14, height: 14, color: "#2563EB" }} />
                Falar com CaldasAI
              </button>
            </Link>
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="btn-whatsapp-suporte"
              style={{
                padding: "10px 20px", borderRadius: 10,
                background: "#25D366", color: "#fff",
                fontWeight: 700, fontSize: 13, textDecoration: "none",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              <Phone style={{ width: 14, height: 14 }} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <HomeFooter />
      <MobileCTABar />

      <LiderApplicationDialog open={liderDialogOpen} onOpenChange={setLiderDialogOpen} user={user} />
    </div>
  )
}
