import { useState, useMemo } from "react"
import { Link } from "wouter"
import {
  Bus, Calendar, Users, MapPin, Star, Clock, ChevronRight,
  Search, Filter, ArrowRight, Shield, Headphones, Zap,
  Thermometer, Waves, Camera, Heart, Share2, Trophy,
  CheckCircle2, Plus, Sparkles, TrendingUp, Tag,
  Crown, Rocket,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { LiderApplicationDialog } from "@/components/lider-application-dialog"

interface Excursao {
  id: string
  titulo: string
  destino: string
  estado: string
  dataPartida: string
  dataRetorno: string
  diasDuracao: number
  preco: number
  precoOriginal?: number
  vagasTotal: number
  vagasOcupadas: number
  organizador: string
  avatar: string
  rating: number
  avaliacoes: number
  categoria: string
  inclui: string[]
  imagem: string
  destaque?: boolean
  tag?: string
}

const EXCURSOES: Excursao[] = [
  {
    id: "1",
    titulo: "Caldas Novas Família Total",
    destino: "Caldas Novas",
    estado: "GO",
    dataPartida: "2026-04-18",
    dataRetorno: "2026-04-21",
    diasDuracao: 4,
    preco: 890,
    precoOriginal: 1190,
    vagasTotal: 48,
    vagasOcupadas: 41,
    organizador: "Reservei Viagens",
    avatar: "RV",
    rating: 4.9,
    avaliacoes: 312,
    categoria: "família",
    inclui: ["Transporte", "Hotel 4★", "Café da manhã", "Guia"],
    imagem: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
    destaque: true,
    tag: "Mais vendida",
  },
  {
    id: "2",
    titulo: "Hot Park & Rio Quente Fest",
    destino: "Rio Quente",
    estado: "GO",
    dataPartida: "2026-04-25",
    dataRetorno: "2026-04-27",
    diasDuracao: 3,
    preco: 720,
    precoOriginal: 950,
    vagasTotal: 40,
    vagasOcupadas: 29,
    organizador: "Tour Caldas",
    avatar: "TC",
    rating: 4.8,
    avaliacoes: 184,
    categoria: "aventura",
    inclui: ["Transporte", "Hotel 5★", "Ingresso Hot Park", "Jantar"],
    imagem: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80",
    tag: "Ingresso incluso",
  },
  {
    id: "3",
    titulo: "Semana Santa Caldas Premium",
    destino: "Caldas Novas",
    estado: "GO",
    dataPartida: "2026-04-14",
    dataRetorno: "2026-04-20",
    diasDuracao: 7,
    preco: 1850,
    precoOriginal: 2400,
    vagasTotal: 30,
    vagasOcupadas: 27,
    organizador: "Reservei Viagens",
    avatar: "RV",
    rating: 5.0,
    avaliacoes: 97,
    categoria: "luxo",
    inclui: ["Transporte Premium", "Resort 5★", "All Inclusive", "Spa", "Passeios"],
    imagem: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80",
    destaque: true,
    tag: "Últimas vagas",
  },
  {
    id: "4",
    titulo: "Finde nas Termas Goianas",
    destino: "Caldas Novas",
    estado: "GO",
    dataPartida: "2026-05-02",
    dataRetorno: "2026-05-04",
    diasDuracao: 3,
    preco: 480,
    vagasTotal: 44,
    vagasOcupadas: 18,
    organizador: "Grupo Viagens GO",
    avatar: "GV",
    rating: 4.7,
    avaliacoes: 56,
    categoria: "econômico",
    inclui: ["Transporte", "Hotel 3★", "Café da manhã"],
    imagem: "https://images.unsplash.com/photo-1510525009512-ad7fc13d8422?w=600&q=80",
  },
  {
    id: "5",
    titulo: "Aventura nas Águas — Grupos Jovens",
    destino: "Rio Quente",
    estado: "GO",
    dataPartida: "2026-05-09",
    dataRetorno: "2026-05-12",
    diasDuracao: 4,
    preco: 650,
    precoOriginal: 820,
    vagasTotal: 36,
    vagasOcupadas: 22,
    organizador: "Caldas Jovem",
    avatar: "CJ",
    rating: 4.6,
    avaliacoes: 73,
    categoria: "aventura",
    inclui: ["Transporte", "Pousada", "Café da manhã", "Rafting"],
    imagem: "https://images.unsplash.com/photo-1559825481-12a05cc00344?w=600&q=80",
    tag: "Para jovens",
  },
  {
    id: "6",
    titulo: "Circuito Completo Caldas + Parque",
    destino: "Caldas Novas",
    estado: "GO",
    dataPartida: "2026-05-16",
    dataRetorno: "2026-05-20",
    diasDuracao: 5,
    preco: 1120,
    precoOriginal: 1450,
    vagasTotal: 42,
    vagasOcupadas: 8,
    organizador: "Reservei Viagens",
    avatar: "RV",
    rating: 4.9,
    avaliacoes: 228,
    categoria: "família",
    inclui: ["Transporte", "Hotel 4★", "Café da manhã", "2 Parques", "City Tour"],
    imagem: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
  },
]

const CATEGORIAS = [
  { value: "todas", label: "Todas as categorias" },
  { value: "família", label: "Família" },
  { value: "aventura", label: "Aventura" },
  { value: "luxo", label: "Luxo" },
  { value: "econômico", label: "Econômico" },
]

const ORDENACAO = [
  { value: "destaque", label: "Em destaque" },
  { value: "preco-asc", label: "Menor preço" },
  { value: "preco-desc", label: "Maior preço" },
  { value: "vagas", label: "Mais vagas" },
  { value: "avaliacao", label: "Melhor avaliado" },
]

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00")
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
}

function VagasBar({ total, ocupadas }: { total: number; ocupadas: number }) {
  const pct = Math.round((ocupadas / total) * 100)
  const livres = total - ocupadas
  const cor = pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-emerald-500"
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{livres} vagas restantes</span>
        <span>{pct}% ocupado</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${cor}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function ExcursaoCard({ exc }: { exc: Excursao }) {
  const desconto = exc.precoOriginal
    ? Math.round(((exc.precoOriginal - exc.preco) / exc.precoOriginal) * 100)
    : null
  const livres = exc.vagasTotal - exc.vagasOcupadas

  return (
    <div
      data-testid={`card-excursao-${exc.id}`}
      className={`group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl flex flex-col ${
        exc.destaque ? "border-primary/40 ring-1 ring-primary/20" : "border-border"
      }`}
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={exc.imagem}
          alt={exc.titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {exc.tag && (
            <Badge className="bg-primary text-white text-xs font-semibold shadow">
              {exc.tag}
            </Badge>
          )}
          {desconto && (
            <Badge className="bg-emerald-500 text-white text-xs font-bold shadow">
              -{desconto}%
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3">
          <button
            data-testid={`btn-favorite-${exc.id}`}
            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors"
          >
            <Heart className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div className="flex items-center gap-1.5 text-white">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-sm font-medium">{exc.destino}, {exc.estado}</span>
          </div>
          <div className="flex items-center gap-1 text-white">
            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
            <span className="text-sm font-semibold">{exc.rating}</span>
            <span className="text-xs text-white/80">({exc.avaliacoes})</span>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-semibold text-base text-foreground leading-tight group-hover:text-primary transition-colors">
              {exc.titulo}
            </h3>
            <span
              data-testid={`badge-privado-${exc.id}`}
              className="inline-flex items-center gap-1 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-0.5 whitespace-nowrap flex-shrink-0"
            >
              <Lock className="w-3 h-3" />
              Grupo Privado
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(exc.dataPartida)} → {formatDate(exc.dataRetorno)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {exc.diasDuracao}d
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {exc.inclui.slice(0, 3).map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              {item}
            </span>
          ))}
          {exc.inclui.length > 3 && (
            <span className="text-xs text-muted-foreground px-1 py-0.5">
              +{exc.inclui.length - 3} mais
            </span>
          )}
        </div>

        <VagasBar total={exc.vagasTotal} ocupadas={exc.vagasOcupadas} />

        <div className="flex items-center gap-2 pt-1 border-t border-border">
          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
            {exc.avatar}
          </div>
          <span className="text-xs text-muted-foreground">{exc.organizador}</span>
        </div>

        <div className="flex items-end justify-between mt-auto">
          <div>
            {exc.precoOriginal && (
              <p className="text-xs text-muted-foreground line-through">
                R$ {exc.precoOriginal.toLocaleString("pt-BR")}
              </p>
            )}
            <p className="text-xl font-bold text-foreground">
              R$ {exc.preco.toLocaleString("pt-BR")}
            </p>
            <p className="text-xs text-muted-foreground">por pessoa</p>
          </div>
          <Link href={`/viagens-grupo?excursao=${exc.id}`}>
            <Button
              data-testid={`btn-reservar-${exc.id}`}
              size="sm"
              className="rounded-xl font-semibold"
              disabled={livres === 0}
            >
              {livres === 0 ? "Esgotado" : "Reservar"}
              {livres > 0 && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function Excursoes() {
  const [busca, setBusca] = useState("")
  const [categoria, setCategoria] = useState("todas")
  const [ordenacao, setOrdenacao] = useState("destaque")
  const [liderDialogOpen, setLiderDialogOpen] = useState(false)
  const { user } = useAuth()

  const isLider = user?.role === "LIDER" || user?.role === "admin"

  const excursoesFiltradas = useMemo(() => {
    let lista = [...EXCURSOES]

    if (busca.trim()) {
      const q = busca.toLowerCase()
      lista = lista.filter(
        (e) =>
          e.titulo.toLowerCase().includes(q) ||
          e.destino.toLowerCase().includes(q) ||
          e.organizador.toLowerCase().includes(q),
      )
    }

    if (categoria !== "todas") {
      lista = lista.filter((e) => e.categoria === categoria)
    }

    if (ordenacao === "preco-asc") lista.sort((a, b) => a.preco - b.preco)
    else if (ordenacao === "preco-desc") lista.sort((a, b) => b.preco - a.preco)
    else if (ordenacao === "vagas")
      lista.sort((a, b) => (b.vagasTotal - b.vagasOcupadas) - (a.vagasTotal - a.vagasOcupadas))
    else if (ordenacao === "avaliacao") lista.sort((a, b) => b.rating - a.rating)
    else lista.sort((a, b) => (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0))

    return lista
  }, [busca, categoria, ordenacao])

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
            <a href="#excursoes">
              <Button
                data-testid="btn-hero-ver-excursoes"
                size="lg"
                className="rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 h-12 shadow-lg"
              >
                Ver Excursões Disponíveis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
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

      {/* Listagem */}
      <section id="excursoes" className="max-w-6xl mx-auto px-4 py-10">

        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              data-testid="input-busca-excursao"
              placeholder="Buscar por destino, título ou organizador..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10 h-11 rounded-xl"
            />
          </div>
          <Select value={categoria} onValueChange={setCategoria}>
            <SelectTrigger data-testid="select-categoria" className="w-full md:w-52 h-11 rounded-xl">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIAS.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={ordenacao} onValueChange={setOrdenacao}>
            <SelectTrigger data-testid="select-ordenacao" className="w-full md:w-52 h-11 rounded-xl">
              <TrendingUp className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              {ORDENACAO.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-foreground">
            {excursoesFiltradas.length} excursão{excursoesFiltradas.length !== 1 ? "ões" : ""} encontrada{excursoesFiltradas.length !== 1 ? "s" : ""}
          </h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Atualizado hoje</span>
          </div>
        </div>

        {excursoesFiltradas.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Bus className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">Nenhuma excursão encontrada</p>
            <p className="text-sm mt-1">Tente ajustar os filtros ou buscar outro destino</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {excursoesFiltradas.map((exc) => (
              <ExcursaoCard key={exc.id} exc={exc} />
            ))}
          </div>
        )}
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
