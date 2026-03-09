import { useState, useEffect } from "react"
import { ArrowLeft, Phone, Mail, MapPin, Clock, MessageCircle, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "wouter";
export default function ContatoPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-600 to-blue-600 flex flex-col items-center justify-center z-50">
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full bg-white/20 animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-bounce">📞</div>
          </div>
        </div>
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Carregando Contatos</h2>
          <p className="text-purple-100">Conectando você com nossos especialistas...</p>
        </div>
        <div className="mt-8 w-48 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)', minHeight: '100vh', position: 'relative' }}>
      <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
        <header style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2563EB 100%)',
          color: '#fff', padding: '16px', position: 'sticky', top: 0, zIndex: 40,
        }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <Link href="/" style={{ color: '#fff', display: 'flex' }} data-testid="button-back">
                <ArrowLeft style={{ width: 24, height: 24 }} />
              </Link>
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon-reservei-viagens-VVm0zxcolWbkv9Lf5Yj0PUoxLJrARl.png"
                alt="Reservei Viagens"
                style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', padding: 4 }}
              />
              <div>
                <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Reservei Viagens</h1>
                <p style={{ fontSize: 12, opacity: 0.8, margin: 0 }}>Especialistas em Caldas Novas</p>
              </div>
            </div>
          </div>
        </header>

        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '20px 16px 100px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>

            <div data-testid="card-consultoria" style={{
              background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', borderRadius: 16,
              overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
              transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'pointer',
            }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(37,99,235,0.3)' }}
               onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ flex: 1, padding: 24 }}>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Consultoria</h3>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 12 }}>de Viagens</h3>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 16 }}>Planejamento personalizado para sua viagem dos sonhos</p>
                  <button data-testid="button-consultoria" onClick={() => window.open("https://wa.me/5564993197555?text=Olá! Quero uma consultoria personalizada para minha viagem!", "_blank")}
                    style={{ background: '#fff', color: '#3B82F6', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                    Consultar Agora
                  </button>
                </div>
                <div style={{ width: 120, height: 120, background: 'rgba(255,255,255,0.2)', borderRadius: '50% 0 0 50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                  <div style={{ width: 72, height: 72, background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MessageCircle style={{ width: 32, height: 32, color: '#3B82F6' }} />
                  </div>
                </div>
              </div>
            </div>

            <div data-testid="card-catalogos" style={{
              background: 'linear-gradient(135deg, #F97316, #EF4444)', borderRadius: 16,
              overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
              transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'pointer',
            }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(249,115,22,0.3)' }}
               onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: 120, height: 120, background: 'rgba(255,255,255,0.2)', borderRadius: '0 50% 50% 0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 16 }}>
                  <div style={{ width: 72, height: 72, background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar style={{ width: 32, height: 32, color: '#F97316' }} />
                  </div>
                </div>
                <div style={{ flex: 1, padding: 24 }}>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Catálogos</h3>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 12 }}>de Pacotes</h3>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 16 }}>Receba via WhatsApp</p>
                  <button data-testid="button-catalogo" onClick={() => window.open("https://wa.me/5564993197555?text=Olá! Quero receber o catálogo completo de pacotes!", "_blank")}
                    style={{ background: '#fff', color: '#F97316', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                    Receber Catálogo
                  </button>
                </div>
              </div>
            </div>

            <div data-testid="card-whatsapp" style={{
              background: 'linear-gradient(135deg, #22C55E, #059669)', borderRadius: 16,
              overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.15)', padding: 24, textAlign: 'center',
              transition: 'transform 0.3s, box-shadow 0.3s',
            }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(34,197,94,0.3)' }}
               onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 56, height: 56, background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone style={{ width: 24, height: 24, color: '#22C55E' }} />
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <MessageCircle style={{ width: 28, height: 28, color: '#fff' }} />
                  <MessageCircle style={{ width: 28, height: 28, color: '#fff' }} />
                </div>
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Contato e</h3>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 12 }}>WhatsApp</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 16 }}>Atendimento personalizado via WhatsApp</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { num: '(64) 99319-7555', wa: '5564993197555' },
                  { num: '(64) 99306-8752', wa: '5564993068752' },
                  { num: '(65) 99235-1207', wa: '5565992351207' },
                  { num: '(65) 99204-8814', wa: '5565992048814' },
                ].map(({ num, wa }) => (
                  <button key={wa} data-testid={`button-whatsapp-${wa}`} onClick={() => window.open(`https://wa.me/${wa}`, '_blank')}
                    style={{ background: '#fff', color: '#22C55E', border: 'none', padding: '10px 12px', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div data-testid="card-agendamento" style={{
              background: 'linear-gradient(135deg, #6B7280, #4B5563)', borderRadius: 16,
              overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
              transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'pointer',
            }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(107,114,128,0.3)' }}
               onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ flex: 1, padding: 24 }}>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Agendamentos</h3>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 12 }}>e Reservas</h3>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 16 }}>Agende sua viagem com facilidade</p>
                  <button data-testid="button-agendar" onClick={() => window.open("https://wa.me/5564993197555?text=Olá! Quero agendar minha viagem para Caldas Novas!", "_blank")}
                    style={{ background: '#fff', color: '#4B5563', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                    Agendar Agora
                  </button>
                </div>
                <div style={{ width: 120, height: 120, background: 'rgba(255,255,255,0.2)', borderRadius: '50% 0 0 50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                  <div style={{ width: 72, height: 72, background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar style={{ width: 32, height: 32, color: '#4B5563' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginTop: 16 }}>
            <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 16, padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 16, textAlign: 'center', color: '#1F2937' }}>
                <MapPin style={{ width: 18, height: 18, display: 'inline', verticalAlign: 'middle', marginRight: 6, color: '#2563EB' }} />
                Nossas Unidades
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: 14, color: '#374151' }}>
                {[
                  { title: 'Sede Caldas Novas:', lines: ['Rua RP5, Residencial Primavera 2', 'Caldas Novas, Goiás'], icon: MapPin },
                  { title: 'Filial Cuiabá:', lines: ['Av. Manoel José de Arruda, Porto', 'Cuiabá, Mato Grosso'], icon: MapPin },
                ].map((u, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <u.icon style={{ width: 18, height: 18, color: '#2563EB', marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <p style={{ fontWeight: 600, margin: 0 }}>{u.title}</p>
                      {u.lines.map((l, j) => <p key={j} style={{ margin: 0 }}>{l}</p>)}
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Mail style={{ width: 18, height: 18, color: '#2563EB', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontWeight: 600, margin: 0 }}>E-mail:</p>
                    <a href="mailto:reservas@reserveiviagens.com.br" style={{ color: '#2563EB' }} data-testid="link-email">reservas@reserveiviagens.com.br</a>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Phone style={{ width: 18, height: 18, color: '#2563EB', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontWeight: 600, margin: 0 }}>Telefone:</p>
                    <a href="tel:+556521270415" style={{ color: '#2563EB' }} data-testid="link-phone">(65) 2127-0415</a>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Clock style={{ width: 18, height: 18, color: '#2563EB', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontWeight: 600, margin: 0 }}>Horário de Atendimento:</p>
                    <p style={{ margin: 0 }}>Segunda a Sexta: 8h às 18h</p>
                    <p style={{ margin: 0 }}>Sábado: 8h às 12h</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 16, padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 16, color: '#1F2937' }}>Siga-nos nas Redes</h3>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                {[
                  { label: 'Facebook', color: '#1877F2', url: 'https://www.facebook.com/comercialreservei' },
                  { label: 'Instagram', color: '#E4405F', url: 'https://www.instagram.com/reserveiviagens' },
                  { label: 'Site', color: '#4B5563', url: 'https://www.reserveiviagens.com.br' },
                ].map(s => (
                  <button key={s.label} data-testid={`button-social-${s.label.toLowerCase()}`} onClick={() => window.open(s.url, '_blank')}
                    style={{ width: 48, height: 48, borderRadius: '50%', background: s.color, color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 11, transition: 'transform 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                    {s.label.charAt(0)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 24 }}>
            <Link href="/">
              <button data-testid="button-voltar" style={{
                background: 'transparent', color: '#fff', border: '2px solid #fff', padding: '10px 24px',
                borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                transition: 'all 0.2s',
              }} onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#7C3AED' }}
                 onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff' }}>
                <ArrowLeft style={{ width: 16, height: 16 }} />
                Voltar ao Início
              </button>
            </Link>
          </div>
        </div>
      </div>

      <a href="https://wa.me/5564993197555?text=Olá! Gostaria de mais informações sobre as ofertas da Reservei Viagens."
        target="_blank" rel="noopener noreferrer" data-testid="button-whatsapp-float"
        style={{
          position: 'fixed', bottom: 80, right: 16, width: 56, height: 56, background: '#22C55E',
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(34,197,94,0.4)', zIndex: 50, transition: 'transform 0.2s',
        }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
           onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
        <Phone style={{ width: 28, height: 28, color: '#fff' }} />
      </a>
    </div>
  )
}
