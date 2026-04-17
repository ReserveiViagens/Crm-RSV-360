/**
 * =============================================================================
 * CONTATO PAGE - FAMILIA A (Public)
 * =============================================================================
 * Pagina de contato com formulario e informacoes
 * Max width interno: 1280px | Spacing consistente
 */
import { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  CheckCircle,
  Instagram,
  Facebook,
  Youtube,
  HelpCircle,
} from 'lucide-react';
import { PublicPageShell, PublicSection } from '@/components/layout-system';
import { PublicHeader, PublicFooter } from '@/components/public';
import { CTAButton } from '@/components/ui/cta-button';
import { cn } from '@/lib/utils';

const WA_URL = 'https://wa.me/5564993197555?text=Olá! Gostaria de mais informações.';

const CONTACT_INFO = [
  {
    icon: Phone,
    label: 'Telefone',
    value: '(64) 99319-7555',
    href: 'tel:+5564993197555',
    description: 'Atendimento de seg a sab, 8h as 20h',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '(64) 99319-7555',
    href: WA_URL,
    description: 'Resposta em ate 5 minutos',
    highlight: true,
  },
  {
    icon: Mail,
    label: 'E-mail',
    value: 'contato@reservei360.com.br',
    href: 'mailto:contato@reservei360.com.br',
    description: 'Resposta em ate 24 horas',
  },
  {
    icon: MapPin,
    label: 'Endereco',
    value: 'Caldas Novas, GO',
    href: '#',
    description: 'Maior polo termal do Brasil',
  },
];

const FAQ_ITEMS = [
  {
    question: 'Como faco para reservar?',
    answer: 'Voce pode reservar diretamente pelo site, escolhendo o produto desejado e finalizando o pagamento. Tambem atendemos via WhatsApp.',
  },
  {
    question: 'Quais formas de pagamento?',
    answer: 'Aceitamos cartao de credito (ate 12x), PIX, boleto bancario e transferencia.',
  },
  {
    question: 'Posso cancelar minha reserva?',
    answer: 'Sim, oferecemos cancelamento gratuito ate 7 dias antes da data da reserva. Consulte nossa politica completa.',
  },
  {
    question: 'Como recebo meus ingressos?',
    answer: 'Os ingressos sao enviados por e-mail e WhatsApp em formato digital (QR Code) apos a confirmacao do pagamento.',
  },
];

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envio
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <PublicPageShell
      header={<PublicHeader />}
      footer={<PublicFooter />}
      background="white"
    >
      {/* ====== HERO ====== */}
      <PublicSection spacing="lg" variant="default">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">
            Fale Conosco
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
            Estamos aqui para ajudar
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Tire suas duvidas, faca sugestoes ou entre em contato com nossa equipe.
            Responderemos o mais rapido possivel!
          </p>
        </div>
      </PublicSection>

      {/* ====== CONTACT CARDS ====== */}
      <PublicSection spacing="md" variant="alt">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CONTACT_INFO.map((info) => (
            <a
              key={info.label}
              href={info.href}
              target={info.href.startsWith('http') ? '_blank' : undefined}
              rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className={cn(
                'block p-6 rounded-xl border transition-all',
                info.highlight
                  ? 'bg-green-50 border-green-200 hover:border-green-300 hover:shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
              )}
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-lg flex items-center justify-center mb-4',
                  info.highlight ? 'bg-green-100' : 'bg-slate-100'
                )}
              >
                <info.icon
                  size={24}
                  className={info.highlight ? 'text-green-600' : 'text-slate-600'}
                />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{info.label}</h3>
              <p
                className={cn(
                  'font-medium mb-2',
                  info.highlight ? 'text-green-600' : 'text-blue-600'
                )}
              >
                {info.value}
              </p>
              <p className="text-sm text-slate-500">{info.description}</p>
            </a>
          ))}
        </div>
      </PublicSection>

      {/* ====== CONTACT FORM + FAQ ====== */}
      <PublicSection spacing="lg" variant="default">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Form */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Envie uma mensagem
            </h2>

            {isSubmitted ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Mensagem enviada!
                </h3>
                <p className="text-slate-600 mb-6">
                  Recebemos sua mensagem e responderemos em breve.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                  }}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nome completo
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      E-mail
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Assunto
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors bg-white"
                    >
                      <option value="">Selecione</option>
                      <option value="reserva">Duvida sobre reserva</option>
                      <option value="pagamento">Pagamento</option>
                      <option value="cancelamento">Cancelamento</option>
                      <option value="sugestao">Sugestao</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Mensagem
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors resize-none"
                    placeholder="Como podemos ajudar?"
                  />
                </div>

                <CTAButton
                  label={isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isSubmitting}
                  icon={<Send size={18} />}
                  rightIcon={null}
                />
              </form>
            )}
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Perguntas frequentes
            </h2>

            <div className="space-y-4">
              {FAQ_ITEMS.map((item, index) => (
                <div
                  key={index}
                  className="bg-slate-50 rounded-xl p-5 border border-slate-100"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <HelpCircle size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">
                        {item.question}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Contact */}
            <div className="mt-8 p-6 bg-green-50 rounded-xl border border-green-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={24} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Prefere atendimento rapido?
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Fale diretamente com nossa equipe pelo WhatsApp
                  </p>
                  <CTAButton
                    label="Chamar no WhatsApp"
                    href={WA_URL}
                    variant="primary"
                    size="md"
                    icon={<Phone size={16} />}
                    rightIcon={null}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </PublicSection>

      {/* ====== BUSINESS HOURS ====== */}
      <PublicSection spacing="md" variant="alt">
        <div className="max-w-3xl mx-auto text-center">
          <Clock size={32} className="mx-auto text-slate-400 mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Horario de Atendimento
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h3 className="font-medium text-slate-900 mb-1">Segunda a Sexta</h3>
              <p className="text-slate-600">08:00 - 20:00</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h3 className="font-medium text-slate-900 mb-1">Sabado</h3>
              <p className="text-slate-600">08:00 - 18:00</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200">
              <h3 className="font-medium text-slate-900 mb-1">Domingo</h3>
              <p className="text-slate-600">Fechado</p>
            </div>
          </div>
        </div>
      </PublicSection>

      {/* ====== SOCIAL ====== */}
      <PublicSection spacing="lg" variant="default">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Siga-nos nas redes sociais
          </h2>
          <p className="text-slate-600 mb-6">
            Acompanhe novidades, promocoes e dicas de viagem
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white hover:scale-105 transition-transform"
            >
              <Instagram size={24} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white hover:scale-105 transition-transform"
            >
              <Facebook size={24} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white hover:scale-105 transition-transform"
            >
              <Youtube size={24} />
            </a>
          </div>
        </div>
      </PublicSection>
    </PublicPageShell>
  );
}
