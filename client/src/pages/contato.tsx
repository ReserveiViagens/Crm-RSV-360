import { Phone, Mail, MapPin, Clock, MessageCircle, Calendar, Sparkles, Users } from "lucide-react"
import { Link } from "wouter"
import { HomeHeader } from "@/components/home/HomeHeader"
import { HomeFooter } from "@/components/home/HomeFooter"
import { MobileCTABar } from "@/components/home/MobileCTABar"

export default function ContatoPage() {
  return (
    <div style={{ background: "#F9FAFB", minHeight: "100vh" }}>
      <HomeHeader />
      <div style={{ height: 64 }} />

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>

      <div style={{
        background: "linear-gradient(135deg, #1e3a5f 0%, #2563EB 100%)",
        padding: "36px 16px 40px", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", bottom: -20, left: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />

        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(245,124,0,0.18)", border: "1px solid rgba(245,124,0,0.35)",
          borderRadius: 20, padding: "4px 12px", marginBottom: 14,
        }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#F57C00", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#F57C00", letterSpacing: 0.5 }}>FALE CONOSCO</span>
        </div>

        <div style={{
          width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "1px solid rgba(255,255,255,0.25)", margin: "0 auto 12px",
        }}>
          <Phone size={22} style={{ color: "#fff" }} />
        </div>

        <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 900, margin: "0 0 8px", lineHeight: 1.25 }}>
          Fale com a Reservei Viagens
        </h1>
        <p style={{ color: "rgba(255,255,255,0.82)", fontSize: 13, margin: "0 0 20px", lineHeight: 1.5 }}>
          Atendimento especializado para planejar sua viagem dos sonhos
        </p>

        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "Consulta gratuita", icon: Sparkles },
            { label: "Resposta em minutos", icon: MessageCircle },
            { label: "Equipe especializada", icon: Users },
          ].map(({ label, icon: Icon }) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 20, padding: "5px 12px",
            }}>
              <Icon size={11} style={{ color: "#F57C00" }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 16 }}>

          <div data-testid="card-consultoria" style={{
            background: "linear-gradient(135deg, #3B82F6, #06B6D4)", borderRadius: 16,
            overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
            transition: "transform 0.3s, box-shadow 0.3s", cursor: "pointer",
          }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(37,99,235,0.3)" }}
             onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1, padding: 24 }}>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Consultoria</h3>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 12 }}>de Viagens</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginBottom: 16 }}>Planejamento personalizado para sua viagem dos sonhos</p>
                <button data-testid="button-consultoria" onClick={() => window.open("https://wa.me/5564993197555?text=Ol%C3%A1!%20Quero%20uma%20consultoria%20personalizada%20para%20minha%20viagem!", "_blank")}
                  style={{ background: "#fff", color: "#3B82F6", border: "none", padding: "10px 20px", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                  Consultar Agora
                </button>
              </div>
              <div style={{ width: 120, height: 120, background: "rgba(255,255,255,0.2)", borderRadius: "50% 0 0 50%", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 16 }}>
                <div style={{ width: 72, height: 72, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MessageCircle style={{ width: 32, height: 32, color: "#3B82F6" }} />
                </div>
              </div>
            </div>
          </div>

          <div data-testid="card-catalogos" style={{
            background: "linear-gradient(135deg, #F97316, #EF4444)", borderRadius: 16,
            overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
            transition: "transform 0.3s, box-shadow 0.3s", cursor: "pointer",
          }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(249,115,22,0.3)" }}
             onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: 120, height: 120, background: "rgba(255,255,255,0.2)", borderRadius: "0 50% 50% 0", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 16 }}>
                <div style={{ width: 72, height: 72, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Calendar style={{ width: 32, height: 32, color: "#F97316" }} />
                </div>
              </div>
              <div style={{ flex: 1, padding: 24 }}>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Catálogos</h3>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 12 }}>de Pacotes</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginBottom: 16 }}>Receba via WhatsApp</p>
                <button data-testid="button-catalogo" onClick={() => window.open("https://wa.me/5564993197555?text=Ol%C3%A1!%20Quero%20receber%20o%20cat%C3%A1logo%20completo%20de%20pacotes!", "_blank")}
                  style={{ background: "#fff", color: "#F97316", border: "none", padding: "10px 20px", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                  Receber Catálogo
                </button>
              </div>
            </div>
          </div>

          <div data-testid="card-whatsapp" style={{
            background: "linear-gradient(135deg, #22C55E, #059669)", borderRadius: 16,
            overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.15)", padding: 24, textAlign: "center",
            transition: "transform 0.3s, box-shadow 0.3s",
          }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(34,197,94,0.3)" }}
             onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 56, height: 56, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Phone style={{ width: 24, height: 24, color: "#22C55E" }} />
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <MessageCircle style={{ width: 28, height: 28, color: "#fff" }} />
                <MessageCircle style={{ width: 28, height: 28, color: "#fff" }} />
              </div>
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Contato e</h3>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 12 }}>WhatsApp</h3>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginBottom: 16 }}>Atendimento personalizado via WhatsApp</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { num: "(64) 99319-7555", wa: "5564993197555" },
                { num: "(64) 99306-8752", wa: "5564993068752" },
                { num: "(65) 99235-1207", wa: "5565992351207" },
                { num: "(65) 99204-8814", wa: "5565992048814" },
              ].map(({ num, wa }) => (
                <button key={wa} data-testid={`button-whatsapp-${wa}`} onClick={() => window.open(`https://wa.me/${wa}`, "_blank")}
                  style={{ background: "#fff", color: "#22C55E", border: "none", padding: "10px 12px", borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div data-testid="card-agendamento" style={{
            background: "linear-gradient(135deg, #6B7280, #4B5563)", borderRadius: 16,
            overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
            transition: "transform 0.3s, box-shadow 0.3s", cursor: "pointer",
          }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(107,114,128,0.3)" }}
             onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1, padding: 24 }}>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Agendamentos</h3>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 12 }}>e Reservas</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginBottom: 16 }}>Agende sua viagem com facilidade</p>
                <button data-testid="button-agendar" onClick={() => window.open("https://wa.me/5564993197555?text=Ol%C3%A1!%20Quero%20agendar%20minha%20viagem%20para%20Caldas%20Novas!", "_blank")}
                  style={{ background: "#fff", color: "#4B5563", border: "none", padding: "10px 20px", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                  Agendar Agora
                </button>
              </div>
              <div style={{ width: 120, height: 120, background: "rgba(255,255,255,0.2)", borderRadius: "50% 0 0 50%", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 16 }}>
                <div style={{ width: 72, height: 72, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Calendar style={{ width: 32, height: 32, color: "#4B5563" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, color: "#1F2937", display: "flex", alignItems: "center", gap: 8 }}>
              <MapPin style={{ width: 18, height: 18, color: "#2563EB" }} />
              Nossas Unidades
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, fontSize: 14, color: "#374151" }}>
              {[
                { title: "Sede Caldas Novas:", lines: ["Rua RP5, Residencial Primavera 2", "Caldas Novas, Goiás"] },
                { title: "Filial Cuiabá:", lines: ["Av. Manoel José de Arruda, Porto", "Cuiabá, Mato Grosso"] },
              ].map((u, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <MapPin style={{ width: 16, height: 16, color: "#2563EB", marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontWeight: 600, margin: 0 }}>{u.title}</p>
                    {u.lines.map((l, j) => <p key={j} style={{ margin: 0, color: "#6B7280" }}>{l}</p>)}
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Mail style={{ width: 16, height: 16, color: "#2563EB", flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: 600, margin: 0 }}>E-mail:</p>
                  <a href="mailto:reservas@reserveiviagens.com.br" style={{ color: "#2563EB", fontSize: 13 }} data-testid="link-email">
                    reservas@reserveiviagens.com.br
                  </a>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Phone style={{ width: 16, height: 16, color: "#2563EB", flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: 600, margin: 0 }}>Telefone:</p>
                  <a href="tel:+556521270415" style={{ color: "#2563EB", fontSize: 13 }} data-testid="link-phone">(65) 2127-0415</a>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <Clock style={{ width: 16, height: 16, color: "#2563EB", marginTop: 2, flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: 600, margin: 0 }}>Horário de Atendimento:</p>
                  <p style={{ margin: 0, color: "#6B7280", fontSize: 13 }}>Segunda a Sexta: 8h às 18h</p>
                  <p style={{ margin: 0, color: "#6B7280", fontSize: 13 }}>Sábado: 8h às 12h</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", textAlign: "center" }}>
            <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 20, color: "#1F2937" }}>Siga-nos nas Redes</h3>
            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 16 }}>
              {[
                { label: "Facebook", color: "#1877F2", url: "https://www.facebook.com/comercialreservei" },
                { label: "Instagram", color: "#E4405F", url: "https://www.instagram.com/reserveiviagens" },
                { label: "Site", color: "#4B5563", url: "https://www.reserveiviagens.com.br" },
              ].map(s => (
                <button key={s.label} data-testid={`button-social-${s.label.toLowerCase()}`}
                  onClick={() => window.open(s.url, "_blank")}
                  style={{ width: 52, height: 52, borderRadius: "50%", background: s.color, color: "#fff", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 12, transition: "transform 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                  {s.label.charAt(0)}
                </button>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>Acompanhe nossas novidades e promoções</p>
          </div>
        </div>
      </div>

      <HomeFooter />
      <MobileCTABar />
    </div>
  )
}
