/**
 * =============================================================================
 * HOME PAGE - FAMILIA A (Public)
 * =============================================================================
 * Landing page principal usando PublicPageShell
 * Max width interno: 1280px | Hero full-bleed | Spacing consistente
 */
import { Link } from 'wouter';
import {
  Star,
  CheckCircle,
  Shield,
  Clock,
  Phone,
  ChevronRight,
  Zap,
  MapPin,
  Users,
  Award,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { PublicPageShell, PublicSection } from '@/components/layout-system';
import { PublicHeader, PublicFooter } from '@/components/public';
import { CTAButton } from '@/components/ui/cta-button';
import { cn } from '@/lib/utils';

// Data
const HERO_STATS = [
  { value: '50k+', label: 'Clientes satisfeitos' },
  { value: '4.9', label: 'Avaliacao media', icon: Star },
  { value: '500+', label: 'Parques e hoteis' },
];

const TRUST_BADGES = [
  { icon: Shield, label: 'Pagamento Seguro' },
  { icon: CheckCircle, label: 'Garantia de Preco' },
  { icon: Clock, label: 'Suporte 24h' },
];

const FEATURED_PRODUCTS = [
  {
    id: 1,
    title: 'Hot Park - Ingresso',
    location: 'Rio Quente, GO',
    image: 'https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?w=400&q=80',
    originalPrice: 289.9,
    price: 149.9,
    discount: 48,
    rating: 4.9,
    reviews: 2847,
    badge: 'Mais Vendido',
  },
  {
    id: 2,
    title: 'DiRoma Acqua Park',
    location: 'Caldas Novas, GO',
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&q=80',
    originalPrice: 259.9,
    price: 139.9,
    discount: 46,
    rating: 4.8,
    reviews: 1932,
    badge: 'Oferta',
  },
  {
    id: 3,
    title: 'Resort Termas Paradise',
    location: 'Caldas Novas, GO',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80',
    originalPrice: 1899.0,
    price: 1199.0,
    discount: 37,
    rating: 4.9,
    reviews: 856,
    badge: 'Premium',
  },
  {
    id: 4,
    title: 'Water Park',
    location: 'Caldas Novas, GO',
    image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=400&q=80',
    originalPrice: 199.9,
    price: 119.9,
    discount: 40,
    rating: 4.7,
    reviews: 1456,
    badge: 'Promocao',
  },
];

const BENEFITS = [
  {
    icon: Zap,
    title: 'Reserva Instantanea',
    description: 'Confirmacao em segundos. Receba seu ingresso digital no celular.',
  },
  {
    icon: Shield,
    title: 'Garantia de Preco',
    description: 'Encontrou mais barato? Cobrimos a diferenca e devolvemos 10%.',
  },
  {
    icon: Users,
    title: 'Suporte Especializado',
    description: 'Time de atendimento via WhatsApp disponivel 7 dias por semana.',
  },
  {
    icon: Award,
    title: 'Melhor Avaliado',
    description: 'Mais de 50 mil clientes satisfeitos com nota media 4.9.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Maria Silva',
    location: 'Sao Paulo, SP',
    text: 'Experiencia incrivel! Reservei pelo site e recebi os ingressos na hora. Super recomendo!',
    rating: 5,
    avatar: 'MS',
  },
  {
    name: 'Carlos Santos',
    location: 'Brasilia, DF',
    text: 'Precos excelentes e atendimento nota 10. Ja viajei 3 vezes com a Reservei360.',
    rating: 5,
    avatar: 'CS',
  },
  {
    name: 'Ana Oliveira',
    location: 'Goiania, GO',
    text: 'Muito pratico! Consegui montar o pacote perfeito para a familia toda.',
    rating: 5,
    avatar: 'AO',
  },
];

function formatPrice(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export default function HomePage() {
  return (
    <PublicPageShell
      header={<PublicHeader />}
      footer={<PublicFooter />}
      background="white"
    >
      {/* ====== HERO SECTION - Full Bleed ====== */}
      <PublicSection fullWidth spacing="none" variant="primary">
        <div
          className="relative min-h-[600px] flex items-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/60" />

          {/* Content - Respeita max-width 1280px */}
          <div className="relative w-full mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Caldas Novas e Rio Quente - Maior polo termal do Brasil
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Ingressos e Hoteis com ate{' '}
                <span className="text-orange-400">70% OFF</span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg sm:text-xl text-white/80 leading-relaxed mb-8 max-w-xl">
                Reserve parques aquaticos, hoteis termais e excursoes com os
                melhores precos. Suporte via WhatsApp e parcele em ate 12x.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <CTAButton
                  label="Ver Ingressos"
                  href="/ingressos"
                  variant="primary"
                  size="lg"
                />
                <CTAButton
                  label="Falar no WhatsApp"
                  href="https://wa.me/5564993197555"
                  variant="secondary"
                  size="lg"
                  icon={<Phone size={18} />}
                  rightIcon={null}
                />
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-6">
                {TRUST_BADGES.map((badge) => (
                  <div
                    key={badge.label}
                    className="flex items-center gap-2 text-white/70"
                  >
                    <badge.icon size={18} className="text-green-400" />
                    <span className="text-sm font-medium">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats - Desktop Only */}
            <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-6">
              {HERO_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 text-center min-w-[140px]"
                >
                  <div className="flex items-center justify-center gap-1 text-2xl font-bold text-white mb-1">
                    {stat.value}
                    {stat.icon && <stat.icon size={20} className="text-yellow-400 fill-yellow-400" />}
                  </div>
                  <div className="text-xs text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PublicSection>

      {/* ====== FEATURED PRODUCTS ====== */}
      <PublicSection spacing="lg" variant="default">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-4">
            Destaques
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Ofertas Imperdíveis
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Os melhores precos em ingressos e hoteis para sua viagem
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_PRODUCTS.map((product) => (
            <Link key={product.id} href={`/produto/${product.id}`}>
              <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all cursor-pointer">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 rounded-md bg-orange-500 text-white text-xs font-semibold">
                      -{product.discount}%
                    </span>
                  </div>
                  {product.badge && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 rounded-md bg-slate-900/80 text-white text-xs font-medium">
                        {product.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center gap-1 text-sm text-slate-500 mb-2">
                    <MapPin size={14} />
                    {product.location}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-3 line-clamp-2">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium text-slate-900">
                        {product.rating}
                      </span>
                    </div>
                    <span className="text-sm text-slate-400">
                      ({product.reviews} avaliacoes)
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-slate-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <CTAButton
            label="Ver Todas as Ofertas"
            href="/ingressos"
            variant="tertiary"
            size="lg"
          />
        </div>
      </PublicSection>

      {/* ====== BENEFITS ====== */}
      <PublicSection spacing="lg" variant="alt">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-green-50 text-green-600 text-sm font-medium mb-4">
            Por que escolher a Reservei360?
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Vantagens Exclusivas
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Oferecemos a melhor experiencia em reservas de viagens
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                <benefit.icon size={24} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </PublicSection>

      {/* ====== TESTIMONIALS ====== */}
      <PublicSection spacing="lg" variant="default">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-sm font-medium mb-4">
            Depoimentos
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Mais de 50 mil clientes satisfeitos com nota media 4.9
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-white rounded-xl p-6 border border-slate-200"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <p className="text-slate-700 leading-relaxed mb-6">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-600">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-medium text-slate-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-slate-500">
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PublicSection>

      {/* ====== CTA FINAL ====== */}
      <PublicSection spacing="lg" variant="primary">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Pronto para sua proxima aventura?
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            Aproveite as melhores ofertas em ingressos e hoteis para Caldas
            Novas e Rio Quente. Reserve agora e parcele em ate 12x!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <CTAButton
              label="Ver Ingressos"
              href="/ingressos"
              variant="secondary"
              size="lg"
            />
            <CTAButton
              label="Falar com Especialista"
              href="https://wa.me/5564993197555"
              variant="tertiary"
              size="lg"
              icon={<Phone size={18} />}
              rightIcon={null}
            />
          </div>
        </div>
      </PublicSection>
    </PublicPageShell>
  );
}
