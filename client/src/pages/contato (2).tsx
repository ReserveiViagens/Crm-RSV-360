import { useState, useEffect } from "react"
import { Phone, Mail, MapPin, Clock, MessageCircle, Calendar, Sparkles, Users, Send } from "lucide-react"
import { HomeHeader } from "@/components/home/HomeHeader"
import { HomeFooter } from "@/components/home/HomeFooter"
import { MobileCTABar } from "@/components/home/MobileCTABar"
import { PublicPageShell, SectionContainer } from "@/components/layouts"
import { useToast } from "@/hooks/use-toast"
import { useCMSContent, getCMSHeroTyped, getCMSSeo, getCMSTheme, useCMSThemeEffect, getCMSHeroBg } from "@/hooks/useCMSContent"

const WA_URL = "https://wa.me/5564993197555"

const ASSUNTOS = [
  "Reserva de hotel",
  "Ingresso para parque",
  "Pacote completo",
  "Excursão em grupo",
  "Dúvidas gerais",
  "Reclamação",
  "Outro",
]

function ContatoHero({ headline, subheadline, bgColor }: { headline?: string; subheadline?: string; bgColor?: string }) {
  return (
    <div style={{
      background: bgColor ?? "linear-gradient(135deg, #1e3a5f 0%, #2563EB 100%)",
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
        <span style={{ fontSize: 11, fontWeight: 700, color: "#F57C00", letterSpacing: 0.5 }}>FALE CONOSCO</span>
      </div>

      <div style={{
        width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center",
        border: "1px solid rgba(255,255,255,0.25)", margin: "0 auto 16px",
      }}>
        <Phone size={24} style={{ color: "#fff" }} />
      </div>

      <h1 style={{ color: "#fff", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.2 }}>
        {headline ?? "Fale com a Reservei Viagens"}
      </h1>
      <p style={{ color: "rgba(255,255,255,0.82)", fontSize: 15, margin: "0 0 24px", lineHeight: 1.6, maxWidth: 500, marginLeft: "auto", marginRight: "auto" }}>
        {subheadline ?? "Atendimento especializado para planejar sua viagem dos sonhos em Caldas Novas e Rio Quente"}
      </p>

      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        {[
          { label: "Consulta gratuita", icon: Sparkles },
          { label: "Resposta em minutos", icon: MessageCircle },
          { label: "Equipe especializada", icon: Users },
        ].map(({ label, icon: Icon }) => (
          <div key={label} style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 20, padding: "6px 14px",
          }}>
            <Icon size={12} style={{ color: "#F57C00" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{label}</span>
          </div>
        ))}
      </div>

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
    </div>
  )
}

export default function ContatoPage() {
  const { data: cmsContent } = useCMSContent("contato")
  const seo = getCMSSeo(cmsContent)
  const theme = getCMSTheme(cmsContent)
  const cmsHero = getCMSHeroTyped(cmsContent)

  useEffect(() => {
    if (seo?.metaTitle) document.title = seo.metaTitle
    return () => { document.title = "RSV360 — Caldas Novas e Rio Quente" }
  }, [seo?.metaTitle])

  useCMSThemeEffect(theme)

  const { toast } = useToast()
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: "",
  })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nome || !formData.email || !formData.mensagem) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome, e-mail e mensagem para continuar.",
        variant: "destructive",
      })
      return
    }
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setFormData({ nome: "", email: "", telefone: "", assunto: "", mensagem: "" })
      toast({
        title: "Mensagem enviada! ✅",
        description: "Recebemos sua mensagem e responderemos em breve pelo e-mail ou WhatsApp.",
      })
    }, 1200)
  }

  return (
    <PublicPageShell
      header={<HomeHeader />}
      heroSlot={
        <div data-cms-section="hero">
          <ContatoHero headline={cmsHero?.headline ?? undefined} subheadline={cmsHero?.subheadline ?? undefined} bgColor={getCMSHeroBg(cmsHero, "linear-gradient(135deg, #1e3a5f 0%, #2563EB 100%)")} />
        </div>
      }
      footer={<HomeFooter />}
      background={theme?.backgroundColor ?? "#F9FAFB"}
    >
      <SectionContainer size="lg">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }} className="contato-grid">

          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1F2937", marginBottom: 6 }}>Envie uma mensagem</h2>
            <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 28, lineHeight: 1.6 }}>
              Preencha o formulário e nossa equipe entrará em contato rapidamente.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label htmlFor="nome" style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                  Nome completo *
                </label>
                <input
                  id="nome"
                  name="nome"
                  data-testid="input-nome"
                  type="text"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 10,
                    border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none",
                    background: "#fff", boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = "#2563EB"}
                  onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"}
                />
              </div>

              <div>
                <label htmlFor="email" style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                  E-mail *
                </label>
                <input
                  id="email"
                  name="email"
                  data-testid="input-email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 10,
                    border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none",
                    background: "#fff", boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = "#2563EB"}
                  onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"}
                />
              </div>

              <div>
                <label htmlFor="telefone" style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                  Telefone / WhatsApp
                </label>
                <input
                  id="telefone"
                  name="telefone"
                  data-testid="input-telefone"
                  type="tel"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 10,
                    border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none",
                    background: "#fff", boxSizing: "border-box",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = "#2563EB"}
                  onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"}
                />
              </div>

              <div>
                <label htmlFor="assunto" style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                  Assunto
                </label>
                <select
                  id="assunto"
                  name="assunto"
                  data-testid="select-assunto"
                  value={formData.assunto}
                  onChange={handleChange}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 10,
                    border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none",
                    background: "#fff", boxSizing: "border-box", cursor: "pointer",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = "#2563EB"}
                  onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"}
                >
                  <option value="">Selecione o assunto...</option>
                  {ASSUNTOS.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="mensagem" style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                  Mensagem *
                </label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  data-testid="input-mensagem"
                  value={formData.mensagem}
                  onChange={handleChange}
                  placeholder="Conte-nos como podemos ajudar..."
                  rows={5}
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 10,
                    border: "1.5px solid #E5E7EB", fontSize: 14, outline: "none",
                    background: "#fff", boxSizing: "border-box", resize: "vertical",
                    transition: "border-color 0.2s", fontFamily: "inherit",
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = "#2563EB"}
                  onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"}
                />
              </div>

              <button
                type="submit"
                data-testid="button-submit-contato"
                disabled={submitting}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "13px 24px", borderRadius: 12,
                  background: submitting ? "#93C5FD" : "linear-gradient(135deg, #2563EB, #1E40AF)",
                  color: "#fff", fontWeight: 700, fontSize: 15,
                  border: "none", cursor: submitting ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                }}
              >
                <Send style={{ width: 16, height: 16 }} />
                {submitting ? "Enviando..." : "Enviar mensagem"}
              </button>
            </form>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1F2937", marginBottom: 6 }}>Informações de atendimento</h2>
              <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 24, lineHeight: 1.6 }}>
                Nossa equipe está pronta para te atender pelos canais abaixo.
              </p>
            </div>

            <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#D1FAE5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Phone style={{ width: 18, height: 18, color: "#22C55E" }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1F2937" }}>WhatsApp</div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>Atendimento imediato</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { num: "(64) 99319-7555", wa: "5564993197555" },
                  { num: "(64) 99306-8752", wa: "5564993068752" },
                  { num: "(65) 99235-1207", wa: "5565992351207" },
                  { num: "(65) 99204-8814", wa: "5565992048814" },
                ].map(({ num, wa }) => (
                  <a
                    key={wa}
                    href={`https://wa.me/${wa}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`link-whatsapp-${wa}`}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      padding: "8px 10px", borderRadius: 8,
                      background: "#F0FDF4", color: "#22C55E",
                      fontWeight: 700, fontSize: 12, textDecoration: "none",
                      border: "1px solid #D1FAE5",
                    }}
                  >
                    {num}
                  </a>
                ))}
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Mail style={{ width: 18, height: 18, color: "#2563EB" }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1F2937" }}>E-mail</div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>Respondemos em até 24h</div>
                </div>
              </div>
              <a
                href="mailto:reservas@reserveiviagens.com.br"
                data-testid="link-email"
                style={{ fontSize: 14, color: "#2563EB", fontWeight: 600, textDecoration: "none" }}
              >
                reservas@reserveiviagens.com.br
              </a>
            </div>

            <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#FFF7ED", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <MapPin style={{ width: 18, height: 18, color: "#F57C00" }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1F2937" }}>Nossas Unidades</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13, color: "#374151" }}>
                {[
                  { title: "Sede — Caldas Novas, GO", lines: ["Rua RP5, Residencial Primavera 2"] },
                  { title: "Filial — Cuiabá, MT", lines: ["Av. Manoel José de Arruda, Porto"] },
                ].map((u, i) => (
                  <div key={i} style={{ paddingLeft: 8, borderLeft: "3px solid #F57C00" }}>
                    <p style={{ fontWeight: 600, margin: "0 0 2px" }}>{u.title}</p>
                    {u.lines.map((l, j) => <p key={j} style={{ margin: 0, color: "#6B7280" }}>{l}</p>)}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Clock style={{ width: 18, height: 18, color: "#374151" }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1F2937" }}>Horário de Atendimento</div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.8 }}>
                <p style={{ margin: 0 }}>Segunda a Sexta: <strong style={{ color: "#374151" }}>8h às 18h</strong></p>
                <p style={{ margin: 0 }}>Sábado: <strong style={{ color: "#374151" }}>8h às 12h</strong></p>
                <p style={{ margin: 0, fontSize: 11, marginTop: 6, color: "#9CA3AF" }}>WhatsApp disponível fora do horário comercial</p>
              </div>
            </div>

            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-whatsapp-cta"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "14px 24px", borderRadius: 12,
                background: "#25D366", color: "#fff",
                fontWeight: 700, fontSize: 15, textDecoration: "none",
                boxShadow: "0 4px 16px rgba(37,211,102,0.3)",
              }}
            >
              <MessageCircle style={{ width: 18, height: 18 }} />
              Falar diretamente pelo WhatsApp
            </a>
          </div>
        </div>
      </SectionContainer>

      <MobileCTABar />

      <style>{`
        @media (max-width: 768px) {
          .contato-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </PublicPageShell>
  )
}
