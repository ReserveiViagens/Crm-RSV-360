import { useState } from "react"
import { Link } from "wouter"
import {
  Bus, Users, Star,
  ArrowRight, Shield, Headphones, Zap,
  Thermometer, Waves, Share2,
  CheckCircle2, Plus, Sparkles,
  Crown, Rocket, ArrowLeft, Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { LiderApplicationDialog } from "@/components/lider-application-dialog"

export default function Excursoes() {
  const [liderDialogOpen, setLiderDialogOpen] = useState(false)
  const { user } = useAuth()

  const isLider = user?.role === "LIDER" || user?.role === "admin"

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=60')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/30 to-blue-900/70" />

        <div className="relative max-w-6xl mx-auto px-4 py-20 text-center">
          <div className="absolute top-4 left-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 text-sm text-white hover:bg-white/25 transition-colors"
              data-testid="button-voltar"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar
            </button>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Thermometer className="w-4 h-4 text-amber-300" />
            Caldas Novas & Rio Quente — Maior polo termal do Brasil
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 tracking-tight">
            Excursões em Grupo<br />
            <span className="text-amber-300">com tudo incluso</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            Viaje com segurança, conforto e economia. Ônibus, hotel, passeios e guia — tudo organizado para você aproveitar sem preocupação.
          </p>

          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {["Transporte incluso", "Hotel garantido", "Guia especializado", "Parcelamento"].map((item) => (
              <span
                key={item}
                className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                {item}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/catalogo-excursoes">
              <Button
                data-testid="btn-hero-ver-excursoes"
                size="lg"
                className="rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 h-12 shadow-lg"
              >
                Ver Excursões Disponíveis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            {isLider ? (
              <Link href="/criar-excursao">
                <Button
                  data-testid="btn-hero-criar-excursao"
                  size="lg"
                  className="rounded-2xl bg-amber-400 text-amber-900 hover:bg-amber-300 font-bold px-8 h-12 shadow-lg gap-2"
                >
                  <Crown className="w-5 h-5" />
                  Criar minha excursão
                </Button>
              </Link>
            ) : (
              <Button
                data-testid="btn-hero-quero-criar"
                size="lg"
                variant="outline"
                onClick={() => setLiderDialogOpen(true)}
                className="rounded-2xl border-white/40 text-white hover:bg-white/10 font-semibold px-8 h-12 gap-2"
              >
                <Crown className="w-5 h-5 text-amber-300" />
                Quero criar minha excursão
              </Button>
            )}
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { icon: Users, value: "12.400+", label: "Viajantes satisfeitos" },
              { icon: Bus, value: "280+", label: "Excursões realizadas" },
              { icon: Star, value: "4.9", label: "Avaliação média" },
              { icon: Shield, value: "100%", label: "Seguro e garantido" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <Icon className="w-5 h-5 text-amber-300 mb-0.5" />
                <p className="text-xl font-bold">{value}</p>
                <p className="text-xs text-blue-200">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="bg-muted/40 border-b border-border py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-center text-2xl font-bold text-foreground mb-8">Como funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                step: "1",
                titulo: "Escolha sua excursão",
                desc: "Filtre por data, destino e categoria. Compare preços e o que está incluso.",
                cor: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
              },
              {
                icon: Users,
                step: "2",
                titulo: "Reserve sua vaga",
                desc: "Garanta seu lugar com pagamento seguro. Parcelamos em até 12x sem juros.",
                cor: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
              },
              {
                icon: Waves,
                step: "3",
                titulo: "Aproveite sem preocupação",
                desc: "Tudo organizado pela agência. Você só precisa aparecer para embarcar.",
                cor: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
              },
            ].map(({ icon: Icon, step, titulo, desc, cor }) => (
              <div key={step} className="flex gap-4 bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-border shadow-sm">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${cor}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Passo {step}</p>
                  <h3 className="font-semibold text-foreground mb-1">{titulo}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — Liderança */}
      <section className="mx-4 mb-10 max-w-6xl md:mx-auto" data-testid="cta-lideranca">
        {isLider ? (
          /* ── Líder ativo ── */
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white py-14 px-6">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=50')", backgroundSize: "cover" }} />
            <div className="relative max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm mb-5 border border-white/30">
                <Crown className="w-4 h-4 text-amber-200" />
                Você é um Líder Reservei Viagens ✓
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Pronto para criar sua excursão?</h2>
              <p className="text-amber-100 text-lg mb-8">Você tem acesso exclusivo ao wizard completo de criação e gestão de grupos.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/criar-excursao">
                  <Button data-testid="btn-criar-excursao-cta" size="lg" className="rounded-2xl bg-white text-amber-700 hover:bg-amber-50 font-bold px-8 h-12 shadow-lg gap-2">
                    <Plus className="w-5 h-5" /> Criar minha excursão
                  </Button>
                </Link>
                <Link href="/viagens-grupo">
                  <Button data-testid="btn-gerenciar-grupos-cta" size="lg" variant="outline" className="rounded-2xl border-white/40 text-white hover:bg-white/10 font-semibold px-8 h-12 gap-2">
                    <Users className="w-5 h-5" /> Meus Grupos
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* ── Benefícios de ser Líder ── */
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-700 to-indigo-800 text-white py-14 px-6">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1510525009512-ad7fc13d8422?w=1200&q=50')", backgroundSize: "cover" }} />
            <div className="relative max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 rounded-full px-4 py-1.5 text-sm mb-5">
                  <Crown className="w-4 h-4 text-amber-300" />
                  <span className="text-amber-200 font-semibold">Benefício exclusivo — Programa Líder</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Torne-se um Líder Reservei</h2>
                <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                  Crie e gerencie suas próprias excursões com todas as ferramentas profissionais — de graça, sem comissões escondidas.
                </p>
              </div>

              {/* Benefícios em grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                {[
                  { icon: Rocket, title: "Wizard de criação", desc: "Monte seu roteiro completo com hotel, parques, passeios e veículo em minutos." },
                  { icon: Users, title: "Gestão de grupo", desc: "Lista de passageiros, aprovações, convites e controle de vagas em tempo real." },
                  { icon: Share2, title: "Link de compartilhamento", desc: "Compartilhe sua excursão via WhatsApp e comece a receber inscrições na hora." },
                  { icon: Shield, title: "Grupo privado", desc: "Controle quem entra no seu grupo com sistema de convites e aprovação." },
                  { icon: Zap, title: "Pix integrado", desc: "Receba pagamentos direto pelo app com split automático entre organizador e plataforma." },
                  { icon: Sparkles, title: "CaldasAI Insights", desc: "Sugestões inteligentes de roteiro, preços e dicas para maximizar inscrições." },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4">
                    <div className="w-9 h-9 rounded-xl bg-amber-400/20 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-amber-300" />
                    </div>
                    <p className="font-bold text-sm mb-1">{title}</p>
                    <p className="text-blue-200 text-xs leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="text-center space-y-3">
                <Button
                  data-testid="btn-tornar-lider-cta"
                  size="lg"
                  onClick={() => setLiderDialogOpen(true)}
                  className="rounded-2xl bg-amber-400 text-amber-900 hover:bg-amber-300 font-bold px-10 shadow-lg gap-2"
                >
                  <Crown className="w-5 h-5" />
                  Quero criar minha excursão — É grátis!
                </Button>
                <p className="text-blue-300 text-xs">Sem taxas de adesão · Ative em 1 clique · Cancele quando quiser</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Depoimentos */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">O que dizem nossos viajantes</h2>
          <div className="flex items-center gap-1 text-amber-500">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
            ))}
            <span className="ml-1 text-sm font-semibold text-foreground">4.9/5</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              nome: "Mariana R.",
              cidade: "Goiânia",
              avatar: "MR",
              nota: 5,
              texto: "Melhor excursão que já fiz! Tudo muito organizado, guia atencioso e hotel excelente. Já reservei para o próximo mês.",
              excursao: "Caldas Novas Família Total",
            },
            {
              nome: "Ricardo S.",
              cidade: "Brasília",
              avatar: "RS",
              nota: 5,
              texto: "Viagem incrível ao Hot Park! O ônibus saiu no horário e o hotel era ainda melhor do que esperávamos. Recomendo!",
              excursao: "Hot Park & Rio Quente Fest",
            },
            {
              nome: "Carla M.",
              cidade: "Uberlândia",
              avatar: "CM",
              nota: 5,
              texto: "Fui na Semana Santa e superou todas as expectativas. All inclusive de verdade, atendimento impecável. Nota 10!",
              excursao: "Semana Santa Caldas Premium",
            },
          ].map((d) => (
            <div
              key={d.nome}
              data-testid={`card-depoimento-${d.nome.replace(" ", "")}`}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-border shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                  {d.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">{d.nome}</p>
                  <p className="text-xs text-muted-foreground">{d.cidade}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i <= d.nota ? "fill-amber-400 stroke-amber-400" : "stroke-muted-foreground"}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">"{d.texto}"</p>
              <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                <Bus className="w-3.5 h-3.5" />
                {d.excursao}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Suporte */}
      <div className="border-t border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Headphones className="w-8 h-8 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Precisa de ajuda para escolher?</p>
              <p className="text-sm text-muted-foreground">Nosso time está disponível de segunda a sábado, 8h–20h</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/caldas-ai">
              <Button data-testid="btn-caldas-ai-suporte" variant="outline" className="rounded-xl gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Falar com CaldasAI
              </Button>
            </Link>
            <Link href="/contato">
              <Button data-testid="btn-contato-suporte" className="rounded-xl gap-2">
                <Headphones className="w-4 h-4" />
                Falar com agente
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Líder Application Dialog */}
      <LiderApplicationDialog
        open={liderDialogOpen}
        onOpenChange={setLiderDialogOpen}
        user={user}
      />
    </div>
  )
}
