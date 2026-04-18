import { Shield, Eye, Lock, Phone, Mail, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "wouter"
import { HomeHeader } from "@/components/home/HomeHeader"
import { HomeFooter } from "@/components/home/HomeFooter"
import { MobileCTABar } from "@/components/home/MobileCTABar"

export default function PoliticaPrivacidadePage() {
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
          <span style={{ fontSize: 11, fontWeight: 700, color: "#F57C00", letterSpacing: 0.5 }}>LGPD • POLÍTICA DE PRIVACIDADE</span>
        </div>

        <div style={{
          width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "1px solid rgba(255,255,255,0.25)", margin: "0 auto 12px",
        }}>
          <Shield size={22} style={{ color: "#fff" }} />
        </div>

        <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 900, margin: "0 0 8px", lineHeight: 1.25 }}>
          Sua Privacidade é Nossa Prioridade
        </h1>
        <p style={{ color: "rgba(255,255,255,0.82)", fontSize: 13, margin: "0 0 20px", lineHeight: 1.5, maxWidth: 420, marginLeft: "auto", marginRight: "auto" }}>
          Conformidade total com a Lei Geral de Proteção de Dados (Lei 13.709/2018)
        </p>

        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "🇧🇷 Conforme LGPD", color: "#22C55E" },
            { label: "🔒 SSL Seguro", color: "#2563EB" },
            { label: "✅ Dados Protegidos", color: "#8B5CF6" },
          ].map(({ label, color }) => (
            <div key={label} style={{
              background: `${color}25`, border: `1px solid ${color}50`,
              borderRadius: 20, padding: "4px 12px",
              fontSize: 11, fontWeight: 600, color: "#fff",
            }}>{label}</div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px 32px" }}>

        <Card style={{ marginBottom: 16 }}>
          <CardContent style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Shield style={{ width: 20, height: 20, color: "#2563EB" }} />
              <h2 style={{ fontWeight: 700, fontSize: 16, margin: 0, color: "#1F2937" }}>Compromisso com sua Privacidade</h2>
            </div>
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: 0 }}>
              A <strong>Reservei Viagens</strong> está comprometida em proteger e respeitar sua privacidade. Esta
              política explica como coletamos, usamos e protegemos suas informações pessoais em conformidade com a Lei
              Geral de Proteção de Dados (LGPD).
            </p>
          </CardContent>
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <CardContent style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Eye style={{ width: 20, height: 20, color: "#22C55E" }} />
              <h2 style={{ fontWeight: 700, fontSize: 16, margin: 0, color: "#1F2937" }}>Dados que Coletamos</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13, color: "#374151" }}>
              <div>
                <h3 style={{ fontWeight: 600, color: "#2563EB", marginBottom: 6 }}>📋 Dados Fornecidos por Você:</h3>
                <ul style={{ paddingLeft: 16, margin: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                  <li>Nome, telefone e e-mail para reservas</li>
                  <li>Preferências de viagem e destinos</li>
                  <li>Informações de pagamento (processadas com segurança)</li>
                  <li>Comunicações via WhatsApp e formulários</li>
                </ul>
              </div>
              <div>
                <h3 style={{ fontWeight: 600, color: "#2563EB", marginBottom: 6 }}>🔍 Dados Coletados Automaticamente:</h3>
                <ul style={{ paddingLeft: 16, margin: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                  <li>Informações de navegação e cookies</li>
                  <li>Endereço IP e localização aproximada</li>
                  <li>Dispositivo e navegador utilizado</li>
                  <li>Páginas visitadas e tempo de permanência</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <CardContent style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Lock style={{ width: 20, height: 20, color: "#8B5CF6" }} />
              <h2 style={{ fontWeight: 700, fontSize: 16, margin: 0, color: "#1F2937" }}>Como Usamos seus Dados</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13, color: "#374151" }}>
              <div style={{ background: "#EFF6FF", padding: 12, borderRadius: 8 }}>
                <h3 style={{ fontWeight: 600, color: "#1D4ED8", marginBottom: 6 }}>🎯 Finalidades Principais:</h3>
                <ul style={{ paddingLeft: 16, margin: 0, display: "flex", flexDirection: "column", gap: 3 }}>
                  <li>Processar e confirmar suas reservas</li>
                  <li>Fornecer atendimento personalizado</li>
                  <li>Enviar confirmações e atualizações de viagem</li>
                  <li>Melhorar nossos serviços e experiência</li>
                </ul>
              </div>
              <div style={{ background: "#F0FDF4", padding: 12, borderRadius: 8 }}>
                <h3 style={{ fontWeight: 600, color: "#15803D", marginBottom: 6 }}>📈 Marketing e Comunicação:</h3>
                <ul style={{ paddingLeft: 16, margin: 0, display: "flex", flexDirection: "column", gap: 3 }}>
                  <li>Ofertas personalizadas de viagens</li>
                  <li>Newsletter com promoções especiais</li>
                  <li>Comunicação via WhatsApp (com seu consentimento)</li>
                  <li>Pesquisas de satisfação</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <CardContent style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Shield style={{ width: 20, height: 20, color: "#F97316" }} />
              <h2 style={{ fontWeight: 700, fontSize: 16, margin: 0, color: "#1F2937" }}>Seus Direitos LGPD</h2>
            </div>
            <div style={{ background: "#FFF7ED", padding: 12, borderRadius: 8, fontSize: 13, color: "#374151" }}>
              <h3 style={{ fontWeight: 600, color: "#C2410C", marginBottom: 8 }}>⚖️ Você tem direito a:</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { right: "Acesso", desc: "Saber quais dados temos sobre você" },
                  { right: "Correção", desc: "Atualizar informações incorretas" },
                  { right: "Exclusão", desc: "Solicitar remoção dos seus dados" },
                  { right: "Portabilidade", desc: "Receber seus dados em formato legível" },
                  { right: "Revogação", desc: "Retirar consentimento a qualquer momento" },
                  { right: "Informação", desc: "Saber com quem compartilhamos seus dados" },
                ].map(({ right, desc }) => (
                  <div key={right} style={{ display: "flex", gap: 8 }}>
                    <CheckCircle style={{ width: 14, height: 14, color: "#F97316", flexShrink: 0, marginTop: 1 }} />
                    <span><strong>{right}:</strong> {desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <CardContent style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Lock style={{ width: 20, height: 20, color: "#EF4444" }} />
              <h2 style={{ fontWeight: 700, fontSize: 16, margin: 0, color: "#1F2937" }}>Segurança dos Dados</h2>
            </div>
            <p style={{ fontSize: 13, color: "#374151", marginBottom: 10 }}>Implementamos medidas técnicas e organizacionais para proteger seus dados:</p>
            <div style={{ background: "#FEF2F2", padding: 12, borderRadius: 8 }}>
              <ul style={{ paddingLeft: 16, margin: 0, display: "flex", flexDirection: "column", gap: 4, fontSize: 13, color: "#374151" }}>
                <li>Criptografia SSL/TLS para transmissão de dados</li>
                <li>Servidores seguros com acesso restrito</li>
                <li>Treinamento regular da equipe sobre privacidade</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Backup regular e seguro dos dados</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <CardContent style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Eye style={{ width: 20, height: 20, color: "#6366F1" }} />
              <h2 style={{ fontWeight: 700, fontSize: 16, margin: 0, color: "#1F2937" }}>Cookies e Tecnologias</h2>
            </div>
            <div style={{ background: "#EEF2FF", padding: 12, borderRadius: 8, fontSize: 13, color: "#374151" }}>
              <h3 style={{ fontWeight: 600, color: "#4338CA", marginBottom: 6 }}>🍪 Tipos de Cookies:</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  { type: "Essenciais", desc: "Necessários para funcionamento básico" },
                  { type: "Funcionais", desc: "Melhoram sua experiência de navegação" },
                  { type: "Analíticos", desc: "Nos ajudam a entender como você usa o site" },
                  { type: "Marketing", desc: "Personalizam ofertas e anúncios" },
                ].map(({ type, desc }) => (
                  <div key={type}><strong>{type}:</strong> {desc}</div>
                ))}
              </div>
              <p style={{ fontSize: 12, color: "#6B7280", margin: "8px 0 0" }}>
                Você pode gerenciar suas preferências de cookies nas configurações do seu navegador.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card style={{ marginBottom: 16, background: "#EFF6FF" }}>
          <CardContent style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Phone style={{ width: 20, height: 20, color: "#2563EB" }} />
              <h2 style={{ fontWeight: 700, fontSize: 16, margin: 0, color: "#1F2937" }}>Contato — Privacidade</h2>
            </div>
            <p style={{ fontSize: 13, color: "#374151", marginBottom: 12 }}>Para exercer seus direitos ou esclarecer dúvidas sobre privacidade:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Mail style={{ width: 16, height: 16, color: "#2563EB" }} />
                <a href="mailto:privacidade@reserveiviagens.com.br" style={{ color: "#2563EB", fontSize: 13, textDecoration: "none" }}
                  data-testid="link-email-privacidade">
                  privacidade@reserveiviagens.com.br
                </a>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Phone style={{ width: 16, height: 16, color: "#22C55E" }} />
                <a href="https://wa.me/5564993197555" style={{ color: "#22C55E", fontSize: 13, textDecoration: "none" }}
                  data-testid="link-whatsapp-privacidade">
                  (64) 99319-7555 — WhatsApp
                </a>
              </div>
              <div style={{ background: "#fff", padding: 10, borderRadius: 8, border: "1px solid #BFDBFE" }}>
                <p style={{ fontWeight: 600, color: "#1D4ED8", fontSize: 12, marginBottom: 4 }}>📍 Endereço:</p>
                <p style={{ fontSize: 12, color: "#374151", margin: 0 }}>
                  Rua RP5, Residencial Primavera 2<br />
                  Caldas Novas — GO, CEP: 75690-000
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <CardContent style={{ padding: 24 }}>
            <h2 style={{ fontWeight: 700, fontSize: 16, margin: "0 0 10px", color: "#1F2937" }}>📅 Atualizações desta Política</h2>
            <p style={{ fontSize: 13, color: "#374151", marginBottom: 10, lineHeight: 1.6 }}>
              Esta política pode ser atualizada periodicamente. Notificaremos sobre mudanças significativas através
              do nosso site e por e-mail.
            </p>
            <div style={{ background: "#F3F4F6", padding: 12, borderRadius: 8 }}>
              <p style={{ fontSize: 12, color: "#374151", margin: 0 }}>
                <strong>Última atualização:</strong> Janeiro de 2025<br />
                <strong>Versão:</strong> 2.0 — Conforme LGPD
              </p>
            </div>
          </CardContent>
        </Card>

        <div style={{ display: "flex", justifyContent: "center", paddingBottom: 8 }}>
          <Link href="/">
            <button data-testid="button-voltar" style={{
              background: "#2563EB", color: "#fff", border: "none",
              padding: "10px 24px", borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer",
              transition: "background 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#1D4ED8"}
              onMouseLeave={e => e.currentTarget.style.background = "#2563EB"}>
              Voltar ao Início
            </button>
          </Link>
        </div>
      </div>

      <HomeFooter />
      <MobileCTABar />
    </div>
  )
}
