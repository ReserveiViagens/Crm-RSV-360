import { useState } from 'react';
import { Link } from 'wouter';
import {
  Star,
  Zap,
  Percent,
  MapPin,
  Tag,
  ArrowRight,
  Timer,
  Flame,
  Gift,
} from 'lucide-react';
import { PublicPageShell, PublicSection } from '@/components/layout-system';
import { PublicHeader, PublicFooter } from '@/components/public';
import { CTAButton } from '@/components/ui/cta-button';
import { FilterChips } from '@/components/ui/filter-chips';

// Data
const PROMO_CATEGORIES = [
  { id: 'todas', label: 'Todas' },
  { id: 'flash', label: 'Flash Sale' },
  { id: 'combo', label: 'Combos' },
  { id: 'feriado', label: 'Feriados' },
  { id: 'familia', label: 'Familia' },
];

const FLASH_DEALS = [
  {
    id: 1,
    title: 'Hot Park - Ingresso Individual',
    location: 'Rio Quente, GO',
    image: 'https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?w=500&q=80',
    originalPrice: 289.9,
    price: 149.9,
    discount: 48,
    rating: 4.9,
    reviews: 2847,
    endsIn: { hours: 2, minutes: 47 },
    soldPercent: 82,
    category: 'flash',
  },
  {
    id: 2,
    title: 'DiRoma + Water Park Combo',
    location: 'Caldas Novas, GO',
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&q=80',
    originalPrice: 459.8,
    price: 249.9,
    discount: 46,
    rating: 4.8,
    reviews: 1932,
    endsIn: { hours: 5, minutes: 12 },
    soldPercent: 65,
    category: 'combo',
  },
  {
    id: 3,
    title: 'Pacote Familia 4 pessoas',
    location: 'Caldas Novas, GO',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80',
    originalPrice: 1599.0,
    price: 899.0,
    discount: 44,
    rating: 4.9,
    reviews: 856,
    endsIn: { hours: 12, minutes: 30 },
    soldPercent: 45,
    category: 'familia',
  },
];

const REGULAR_PROMOS = [
  {
    id: 4,
    title: 'Water Park - Dia Inteiro',
    location: 'Caldas Novas, GO',
    image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=400&q=80',
    originalPrice: 199.9,
    price: 119.9,
    discount: 40,
    rating: 4.7,
    reviews: 1456,
    category: 'flash',
  },
  {
    id: 5,
    title: 'Nautico Praia Clube',
    location: 'Caldas Novas, GO',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
    originalPrice: 189.9,
    price: 99.9,
    discount: 47,
    rating: 4.5,
    reviews: 1123,
    category: 'flash',
  },
  {
    id: 6,
    title: 'Resort Termas - 3 Noites',
    location: 'Caldas Novas, GO',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80',
    originalPrice: 2499.0,
    price: 1499.0,
    discount: 40,
    rating: 4.9,
    reviews: 2341,
    category: 'feriado',
  },
  {
    id: 7,
    title: 'Combo Parques + Hotel',
    location: 'Rio Quente, GO',
    image: 'https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?w=400&q=80',
    originalPrice: 3299.0,
    price: 1999.0,
    discount: 39,
    rating: 4.8,
    reviews: 567,
    category: 'combo',
  },
  {
    id: 8,
    title: 'Lagoa Quente Flat - 2 Noites',
    location: 'Caldas Novas, GO',
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&q=80',
    originalPrice: 989.0,
    price: 649.0,
    discount: 34,
    rating: 4.6,
    reviews: 987,
    category: 'familia',
  },
  {
    id: 9,
    title: 'DiRoma Fiori - 4 Noites',
    location: 'Caldas Novas, GO',
    image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=400&q=80',
    originalPrice: 2799.0,
    price: 1699.0,
    discount: 39,
    rating: 4.7,
    reviews: 634,
    category: 'feriado',
  },
];

function formatPrice(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function CountdownTimer({ hours, minutes }: { hours: number; minutes: number }) {
  return (
    <div className="flex items-center gap-1 text-orange-600">
      <Timer size={14} />
      <span className="text-sm font-semibold">
        {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:00
      </span>
    </div>
  );
}

export default function PromocoesPage() {
  const [selectedCategory, setSelectedCategory] = useState('todas');

  const filteredPromos = REGULAR_PROMOS.filter(
    (promo) => selectedCategory === 'todas' || promo.category === selectedCategory
  );

  return (
    <PublicPageShell
      header={<PublicHeader />}
      footer={<PublicFooter />}
      background="white"
    >
      <PublicSection fullWidth spacing="none" variant="dark">
        <div className="relative py-16 lg:py-20">
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-sm font-medium mb-6">
              <Flame size={16} />
              Ofertas por tempo limitado
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Promocoes <span className="text-orange-400">Imperdíveis</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-8">
              Aproveite descontos de ate 70% em ingressos, hoteis e pacotes.
              Ofertas validas por tempo limitado!
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-yellow-400" />
                Flash Sales diarias
              </div>
              <div className="flex items-center gap-2">
                <Gift size={16} className="text-green-400" />
                Combos exclusivos
              </div>
              <div className="flex items-center gap-2">
                <Percent size={16} className="text-blue-400" />
                Ate 70% de desconto
              </div>
            </div>
          </div>
        </div>
      </PublicSection>

      <PublicSection spacing="lg" variant="default">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-orange-600 mb-2">
              <Zap size={20} />
              <span className="font-semibold">Flash Sale</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Ofertas Relampago
            </h2>
          </div>
          <Link href="/flash-deals">
            <span className="text-blue-600 font-medium hover:underline cursor-pointer flex items-center gap-1">
              Ver todas <ArrowRight size={16} />
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FLASH_DEALS.map((deal) => (
            <Link key={deal.id} href={`/produto/${deal.id}`}>
              <div className="group bg-white rounded-xl border-2 border-orange-200 overflow-hidden hover:shadow-xl hover:border-orange-300 transition-all cursor-pointer">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-sm font-bold flex items-center gap-1">
                      <Zap size={14} />
                      -{deal.discount}%
                    </span>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <div className="flex items-center justify-between">
                      <CountdownTimer hours={deal.endsIn.hours} minutes={deal.endsIn.minutes} />
                      <div className="text-white text-sm">
                        {deal.soldPercent}% vendido
                      </div>
                    </div>
                    <div className="mt-2 h-1.5 bg-white/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full"
                        style={{ width: `${deal.soldPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-1 text-sm text-slate-500 mb-2">
                    <MapPin size={14} />
                    {deal.location}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-3">
                    {deal.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-slate-400 line-through block">
                        {formatPrice(deal.originalPrice)}
                      </span>
                      <span className="text-2xl font-bold text-orange-600">
                        {formatPrice(deal.price)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium">{deal.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </PublicSection>

      <PublicSection spacing="lg" variant="alt">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            Todas as Promocoes
          </h2>
          <p className="text-slate-600 mb-6">
            Filtre por categoria e encontre a oferta perfeita
          </p>
          <FilterChips
            options={PROMO_CATEGORIES}
            
            onChange={(selected) =>
              setSelectedCategory(Array.isArray(selected) ? (selected[0] ?? '') : selected)
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPromos.map((promo) => (
            <Link key={promo.id} href={`/produto/${promo.id}`}>
              <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all cursor-pointer">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 rounded-md bg-orange-500 text-white text-xs font-semibold">
                      -{promo.discount}%
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-1 text-sm text-slate-500 mb-2">
                    <MapPin size={14} />
                    {promo.location}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-3 line-clamp-2">
                    {promo.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium text-slate-900">
                        {promo.rating}
                      </span>
                    </div>
                    <span className="text-sm text-slate-400">
                      ({promo.reviews})
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-slate-400 line-through">
                      {formatPrice(promo.originalPrice)}
                    </span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatPrice(promo.price)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredPromos.length === 0 && (
          <div className="text-center py-12">
            <Tag size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Nenhuma promocao encontrada
            </h3>
            <p className="text-slate-600">
              Tente outra categoria ou volte mais tarde
            </p>
          </div>
        )}
      </PublicSection>

      <PublicSection spacing="lg" variant="primary">
        <div className="text-center">
          <Gift size={48} className="mx-auto text-white/80 mb-4" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Receba ofertas exclusivas
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            Cadastre-se e seja o primeiro a saber sobre novas promocoes e
            descontos especiais
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className="w-full px-4 py-3 rounded-lg border-0 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-400"
            />
            <CTAButton
              label="Cadastrar"
              variant="secondary"
              size="lg"
              rightIcon={null}
            />
          </div>
        </div>
      </PublicSection>
    </PublicPageShell>
  );
}