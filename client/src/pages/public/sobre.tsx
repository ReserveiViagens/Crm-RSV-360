/**
 * =============================================================================
 * SOBRE/INSTITUCIONAL PAGE - FAMILIA A (Public)
 * =============================================================================
 * Pagina institucional da empresa
 * Max width interno: 1280px | Spacing consistente | Visual premium
 */
import {
  Users,
  Award,
  Shield,
  Heart,
  Target,
  Eye,
  Star,
  CheckCircle,
  TrendingUp,
  MapPin,
  Phone,
  Zap,
  Globe,
} from 'lucide-react';
import { PublicPageShell, PublicSection } from '@/components/layout-system';
import { PublicHeader, PublicFooter } from '@/components/public';
import { CTAButton } from '@/components/ui/cta-button';
import { cn } from '@/lib/utils';

const STATS = [
  { value: '50k+', label: 'Clientes atendidos', icon: Users },
  { value: '4.9', label: 'Avaliacao media', icon: Star },
  { value: '500+', label: 'Parques e hoteis', icon: MapPin },
  { value: '8+', label: 'Anos de experiencia', icon: Award },
];

const VALUES = [
  {
    icon: Heart,
    title: 'Paixao pelo cliente',
    description: 'Colocamos o cliente no centro de tudo. Cada decisao e tomada pensando em proporcionar a melhor experiencia possivel.',
  },
  {
    icon: Shield,
    title: 'Transparencia',
    description: 'Precos claros, sem taxas ocultas. Voce sempre sabe exatamente o que esta pagando e o que vai receber.',
  },
  {
    icon: Zap,
    title: 'Agilidade',
    description: 'Reservas confirmadas em segundos. Suporte rapido e eficiente quando voce precisa.',
  },
  {
    icon: Award,
    title: 'Excelencia',
    description: 'Buscamos a excelencia em cada detalhe. Parcerias com os melhores estabelecimentos da regiao.',
  },
];

const TIMELINE = [
  {
    year: '2016',
    title: 'O comeco',
    description: 'Nascemos como uma pequena agencia local em Caldas Novas, com o sonho de facilitar o turismo na regiao.',
  },
  {
    year: '2018',
    title: 'Expansao digital',
    description: 'Lancamos nossa primeira plataforma online, permitindo reservas 24 horas por dia.',
  },
  {
    year: '2020',
    title: 'Reinvencao',
    description: 'Durante a pandemia, nos reinventamos e lancamos o atendimento via WhatsApp.',
  },
  {
    year: '2022',
    title: 'Crescimento',
    description: 'Ultrapassamos 30 mil clientes atendidos e ampliamos parcerias com mais de 300 estabelecimentos.',
  },
  {
    year: '2024',
    title: 'Novo capitulo',
    description: 'Lancamento da Reservei360 com tecnologia de ponta e a melhor experiencia de reservas.',
  },
];

const TEAM = [
  {
    name: 'Carlos Silva',
    role: 'CEO e Fundador',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    description: 'Empreendedor apaixonado por turismo e tecnologia.',
  },
  {
    name: 'Ana Oliveira',
    role: 'Diretora Comercial',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    description: 'Especialista em parcerias e relacionamento com clientes.',
  },
  {
    name: 'Pedro Santos',
    role: 'CTO',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80',
    description: 'Lider de tecnologia com foco em inovacao.',
  },
  {
    name: 'Maria Costa',
    role: 'Head de Atendimento',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    description: 'Responsavel pela excelencia no atendimento ao cliente.',
  },
];

const PARTNERS = [
  'Hot Park',
  'DiRoma',
  'Water Park',
  'Nautico',
  'Lagoa Quente',
  'Thermas Paradise',
  'Prive',
  'Rio Quente Resorts',
];

export default function SobrePage() {
  return (
    <PublicPageShell
      header={<PublicHeader />}
      footer={<PublicFooter />}
      background="white"
    >
      {/* ====== HERO ====== */}
      <PublicSection fullWidth spacing="none" variant="default">
        <div
          className="relative min-h-[400px] flex items-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-slate-900/70" />
          
          <div className="relative w-full mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-2xl">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-6">
                Nossa Historia
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Transformando sonhos em{' '}
                <span className="text-blue-400">experiencias</span>
              </h1>
              <p className="text-lg text-white/80 leading-relaxed">
                Ha mais de 8 anos conectando viajantes aos melhores destinos de
                Caldas Novas e Rio Quente. Somos apaixonados por turismo e por
                criar memorias inesqueciveis.
              </p>
            </div>
          </div>
        </div>
      </PublicSection>

      {/* ====== STATS ====== */}
      <PublicSection spacing="lg" variant="default">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 bg-slate-50 rounded-xl border border-slate-100"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <stat.icon size={24} className="text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </PublicSection>

      {/* ====== MISSAO, VISAO, VALORES ====== */}
      <PublicSection spacing="lg" variant="alt">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Missao */}
          <div className="bg-white rounded-xl p-8 border border-slate-200">
            <div className="w-14 h-14 rounded-lg bg-blue-100 flex items-center justify-center mb-6">
              <Target size={28} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Missao</h3>
            <p className="text-slate-600 leading-relaxed">
              Facilitar o acesso a experiencias turisticas incriveis, oferecendo
              os melhores precos, atendimento humanizado e tecnologia de ponta
              para reservas simples e seguras.
            </p>
          </div>

          {/* Visao */}
          <div className="bg-white rounded-xl p-8 border border-slate-200">
            <div className="w-14 h-14 rounded-lg bg-purple-100 flex items-center justify-center mb-6">
              <Eye size={28} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Visao</h3>
            <p className="text-slate-600 leading-relaxed">
              Ser a plataforma de turismo mais amada do Brasil, reconhecida pela
              excelencia no atendimento e por proporcionar experiencias
              memoraveis a milhoes de viajantes.
            </p>
          </div>

          {/* Proposito */}
          <div className="bg-white rounded-xl p-8 border border-slate-200">
            <div className="w-14 h-14 rounded-lg bg-green-100 flex items-center justify-center mb-6">
              <Globe size={28} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Proposito</h3>
            <p className="text-slate-600 leading-relaxed">
              Acreditamos que viajar transforma vidas. Por isso, trabalhamos
              todos os dias para tornar o turismo mais acessivel, pratico e
              inesquecivel para todos.
            </p>
          </div>
        </div>

        {/* Valores */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Nossos Valores
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Principios que guiam cada decisao e acao da nossa equipe
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((value) => (
            <div
              key={value.title}
              className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center mb-4">
                <value.icon size={24} className="text-slate-700" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                {value.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </PublicSection>

      {/* ====== TIMELINE ====== */}
      <PublicSection spacing="lg" variant="default">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-medium mb-4">
            Nossa Trajetoria
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Uma jornada de crescimento
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            De uma pequena agencia local ao maior portal de turismo da regiao
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 lg:-translate-x-1/2" />

          {/* Timeline Items */}
          <div className="space-y-8">
            {TIMELINE.map((item, index) => (
              <div
                key={item.year}
                className={cn(
                  'relative flex items-start gap-8',
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                )}
              >
                {/* Dot */}
                <div className="absolute left-4 lg:left-1/2 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow -translate-x-1/2 z-10" />

                {/* Content */}
                <div className={cn(
                  'flex-1 ml-12 lg:ml-0',
                  index % 2 === 0 ? 'lg:pr-12 lg:text-right' : 'lg:pl-12 lg:text-left'
                )}>
                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-3">
                      {item.year}
                    </span>
                    <h3 className="font-semibold text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Spacer */}
                <div className="hidden lg:block flex-1" />
              </div>
            ))}
          </div>
        </div>
      </PublicSection>

      {/* ====== TEAM ====== */}
      <PublicSection spacing="lg" variant="alt">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-sm font-medium mb-4">
            Nossa Equipe
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Pessoas que fazem acontecer
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Uma equipe apaixonada por turismo e comprometida com sua experiencia
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-xl p-6 border border-slate-200 text-center hover:shadow-md transition-shadow"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-slate-100"
              />
              <h3 className="font-semibold text-slate-900">{member.name}</h3>
              <p className="text-sm text-blue-600 font-medium mb-2">
                {member.role}
              </p>
              <p className="text-sm text-slate-500">{member.description}</p>
            </div>
          ))}
        </div>
      </PublicSection>

      {/* ====== PARTNERS ====== */}
      <PublicSection spacing="lg" variant="default">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Parceiros de confianca
          </h2>
          <p className="text-slate-600">
            Trabalhamos com os melhores estabelecimentos da regiao
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8">
          {PARTNERS.map((partner) => (
            <div
              key={partner}
              className="px-6 py-4 bg-slate-50 rounded-lg border border-slate-100"
            >
              <span className="font-semibold text-slate-700">{partner}</span>
            </div>
          ))}
        </div>
      </PublicSection>

      {/* ====== CTA ====== */}
      <PublicSection spacing="lg" variant="primary">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Faca parte dessa historia
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            Junte-se a mais de 50 mil viajantes que ja descobriram a melhor
            forma de explorar Caldas Novas e Rio Quente
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <CTAButton
              label="Ver Ofertas"
              href="/promocoes"
              variant="secondary"
              size="lg"
            />
            <CTAButton
              label="Falar Conosco"
              href="/contato"
              variant="tertiary"
              size="lg"
              rightIcon={null}
            />
          </div>
        </div>
      </PublicSection>
    </PublicPageShell>
  );
}
