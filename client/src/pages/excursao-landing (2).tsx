import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { PaymentCheckout } from "@/components/checkout/PaymentCheckout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Star, CheckCircle2, MapPin, Clock, Users, Bus, Hotel, Headphones,
  ChevronDown, Flame, Shield, Camera, Waves, ArrowLeft, LogIn, UserPlus
} from "lucide-react";

const MOCK_LANDING = {
  slug: "caldas-novas-maio",
  excursaoId: "exc1",
  excursaoNome: "Caldas Novas — Especial de Maio 2026",
  headline: "Mergulhe no Paraíso das Águas Quentes enquanto o Estresse Fica em Casa",
  copywrite: "Caldas Novas tem o maior parque termal do mundo — e você merece aproveitar isso. Por apenas 3 dias, esqueça as responsabilidades e viva uma experiência de relaxamento e diversão que vai transformar o seu ano.",
  scarcityTrigger: "🔥 Restam apenas 3 vagas! Mais de 21 pessoas já garantiram a delas.",
  price: 890,
  originalPrice: 1190,
  vagas: 3,
  departureDate: "14 de Maio, 2026",
  departureCity: "Cuiabá — MT",
  deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  organizer: "Douglas Silva",
  rating: 4.9,
  reviews: 137,
};

const ITINERARY = [
  { day: "D1", title: "Saída e Chegada", items: ["Saída de Cuiabá às 22h", "Chegada a Caldas Novas", "Check-in no hotel", "Hot Park (noturno)"] },
  { day: "D2", title: "Dia de Parques", items: ["Café da manhã incluso", "Diroma Acqua Park (dia todo)", "Almoço opcional", "Massagem térmica (opcional)"] },
  { day: "D3", title: "Relaxamento e Volta", items: ["Hot Springs livre", "Check-out e lanche", "Retorno para Cuiabá", "Chegada estimada às 23h"] },
];

const TESTIMONIALS = [
  { name: "Fernanda R.", city: "Cuiabá", text: "Melhor excursão que já fiz! Tudo organizado, ônibus confortável e o parque estava incrível!", stars: 5, initial: "F" },
  { name: "Ricardo M.", city: "Várzea Grande", text: "Fui com a família e foi perfeito. Pagamento pelo Pix na hora, sem complicação.", stars: 5, initial: "R" },
  { name: "Patrícia L.", city: "Cuiabá", text: "O CaldasAI ficou respondendo no grupo o tempo todo. Me senti segura durante toda a viagem!", stars: 5, initial: "P" },
];

function useCountdown(deadline: string) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const fn = () => {
      const diff = new Date(deadline).getTime() - Date.now();
      if (diff <= 0) return;
      setT({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    fn();
    const id = setInterval(fn, 1000);
    return () => clearInterval(id);
  }, [deadline]);
  return t;
}

export default function ExcursaoLanding() {
  const { user } = useAuth();
  const params = useParams<{ slug: string }>();
  const checkoutRef = useRef<HTMLDivElement>(null);
  const slug = params.slug || "caldas-novas-maio";
  const data = MOCK_LANDING;
  const countdown = useCountdown(data.deadline);
  const nextUrl = encodeURIComponent(`/viagens-grupo?excursao=${data.excursaoId}`);

  const trackView = useMutation({ mutationFn: () => apiRequest("POST", "/api/analytics/pageview", { slug, page: "landing" }) });
  useEffect(() => { trackView.mutate(); }, []);

  const scrollToCheckout = () => checkoutRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-white" data-testid="excursao-landing">
      {/* HERO */}
      <section className="relative bg-gradient-to-b from-blue-900 via-blue-800 to-teal-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTYgNnY2aDZ2LTZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat" />
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 text-sm text-white hover:bg-white/25 transition-colors"
            data-testid="button-voltar"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge className="bg-red-500 text-white text-xs font-bold animate-pulse px-3 py-1 gap-1">
              <Flame className="w-3 h-3" /> {data.scarcityTrigger}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
            {data.headline}
          </h1>
          <p className="text-blue-100 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {data.copywrite}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-blue-200">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {data.departureCity}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {data.departureDate}</span>
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {data.rating} ({data.reviews} avaliações)
            </span>
          </div>

          {/* FOMO countdown */}
          <div className="flex justify-center gap-3">
            {[{ label: "Dias", val: countdown.d }, { label: "Horas", val: countdown.h }, { label: "Min", val: countdown.m }, { label: "Seg", val: countdown.s }].map(({ label, val }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 min-w-[56px] text-center border border-white/20">
                <p className="text-2xl font-extrabold text-white">{String(val).padStart(2, "0")}</p>
                <p className="text-xs text-blue-200">{label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="text-blue-300 line-through text-lg">R$ {data.originalPrice.toFixed(2).replace(".", ",")}</span>
                <Badge className="bg-emerald-500 text-white text-xs">Economize R$ {(data.originalPrice - data.price).toFixed(0)}</Badge>
              </div>
              <p className="text-5xl font-extrabold text-white mt-1">R$ {data.price.toFixed(2).replace(".", ",")}</p>
              <p className="text-blue-200 text-sm">por pessoa — Pix à vista</p>
            </div>
          </div>

          <Button
            onClick={scrollToCheckout}
            size="lg"
            className="bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_30px_rgba(34,197,94,0.5)] h-14 px-10 rounded-2xl text-lg font-bold gap-2 transition-transform hover:scale-105"
            data-testid="btn-cta-garantir"
          >
            Garantir minha vaga agora
            <ChevronDown className="w-5 h-5" />
          </Button>
          <p className="text-xs text-blue-200 flex items-center justify-center gap-1">
            <Shield className="w-3.5 h-3.5" /> Pagamento 100% seguro • Sem taxas ocultas
          </p>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-extrabold text-center text-slate-800 mb-8">O que está incluso na sua viagem</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Bus, title: "Transporte VIP", desc: "Ônibus executivo com ar-condicionado, Wi-Fi e reclinável de 180°." },
              { icon: Hotel, title: "Hospedagem Inclusa", desc: "Hotel 4 estrelas com café da manhã e acesso às piscinas termais." },
              { icon: Headphones, title: "CaldasAI 24h", desc: "Assistente virtual no grupo do WhatsApp para qualquer dúvida ou emergência." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50">
                <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-blue-700" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ITINERÁRIO */}
      <section className="bg-slate-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-extrabold text-center text-slate-800 mb-8">Roteiro dia a dia</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {ITINERARY.map((day, i) => (
              <Card key={i} className="overflow-hidden border-0 shadow-sm">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-teal-500" />
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-extrabold text-sm flex items-center justify-center">{day.day}</span>
                    <p className="font-bold text-slate-800">{day.title}</p>
                  </div>
                  <ul className="space-y-2">
                    {day.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-extrabold text-center text-slate-800 mb-8">Quem viajou com a gente diz:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <Card key={i} className="p-5 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 text-white font-bold flex items-center justify-center text-sm">{t.initial}</div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.city}</p>
                  </div>
                </div>
                <div className="flex mb-2">{Array.from({ length: t.stars }).map((_, k) => <Star key={k} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}</div>
                <p className="text-sm text-slate-600 leading-relaxed italic">"{t.text}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CHECKOUT */}
      <section ref={checkoutRef} className="bg-gradient-to-b from-slate-50 to-blue-50 py-16" id="checkout">
        <div className="max-w-md mx-auto px-4 text-center space-y-6">
          <div>
            <Badge className="bg-red-100 text-red-700 text-xs mb-3 px-3 py-1 gap-1">
              <Flame className="w-3 h-3" /> Apenas {data.vagas} vagas restantes
            </Badge>
            <h2 className="text-2xl font-extrabold text-slate-800">Reserve agora, pague pelo Pix</h2>
            <p className="text-sm text-muted-foreground mt-1">Confirmação imediata. Sem burocracia.</p>
          </div>
          {user ? (
            <div className="flex justify-center">
              <PaymentCheckout
                excursaoId={data.excursaoId}
                excursaoNome={data.excursaoNome}
                amount={data.price}
                organizerCommission={89}
                passengerName={user.nome || "Passageiro"}
              />
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-border p-6 flex flex-col items-center gap-4 text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">Faça login para reservar sua vaga</h3>
                <p className="text-sm text-muted-foreground">Entre na sua conta ou cadastre-se para garantir seu lugar e pagar pelo Pix.</p>
              </div>
              <Link href={`/entrar?next=${nextUrl}`} className="w-full">
                <button
                  data-testid="btn-landing-login"
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl px-4 py-3 font-semibold text-sm hover:bg-primary/90 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Entrar
                </button>
              </Link>
              <Link href={`/cadastrar?next=${nextUrl}`} className="w-full">
                <button
                  data-testid="btn-landing-cadastrar"
                  className="w-full flex items-center justify-center gap-2 border-2 border-primary text-primary rounded-xl px-4 py-3 font-semibold text-sm hover:bg-primary/5 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Cadastrar
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer mini */}
      <footer className="bg-slate-900 text-slate-400 text-center py-6 text-xs space-y-1">
        <p className="font-semibold text-white">Reservei Viagens</p>
        <p>Caldas Novas, Goiás • contato@reserveiviagens.com.br</p>
        <p>© 2026 • Todos os direitos reservados</p>
      </footer>
    </div>
  );
}
