import { useState, useMemo } from "react"
import { Link } from "wouter"
import {
  Bus, Calendar, Users, MapPin, Star, Clock, ChevronRight,
  Search, Filter, ArrowRight, Shield, ArrowLeft,
  CheckCircle2, Plus, Sparkles, TrendingUp,
  Crown, Lock, Heart, Home, Thermometer, Eye,
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
  slug: string
  descricao: string
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
    inclui: ["Transporte", "Hotel 4★", "Café da manhã", "Guia", "Seguro Viagem"],
    imagem: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
    destaque: true,
    tag: "Mais vendida",
    slug: "caldas-novas-familia-total",
    descricao: "4 dias de diversão em família com hotel 4 estrelas, café incluso e guia dedicado. Piscinas termais, parques aquáticos e muito mais.",
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
    inclui: ["Transporte", "Hotel 5★", "Ingresso Hot Park", "Jantar", "Guia"],
    imagem: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80",
    tag: "Ingresso incluso",
    slug: "hot-park-rio-quente-fest",
    descricao: "Fim de semana no maior parque aquático de águas quentes do mundo. Hotel 5 estrelas e ingresso Hot Park inclusos.",
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
    inclui: ["Transporte Premium", "Resort 5★", "All Inclusive", "Spa", "Passeios", "Seguro"],
    imagem: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80",
    destaque: true,
    tag: "Últimas vagas",
    slug: "semana-santa-caldas-premium",
    descricao: "Uma semana completa no melhor resort de Caldas Novas. All inclusive, spa, passeios exclusivos e transporte premium.",
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
    slug: "finde-termas-goianas",
    descricao: "Escapada econômica de fim de semana para curtir as águas quentes de Caldas Novas sem gastar muito.",
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
    inclui: ["Transporte", "Pousada", "Café da manhã", "Rafting", "Trilha"],
    imagem: "https://images.unsplash.com/photo-1559825481-12a05cc00344?w=600&q=80",
    tag: "Para jovens",
    slug: "aventura-aguas-jovens",
    descricao: "Roteiro especial para jovens aventureiros. Inclui rafting, trilhas e atividades radicais nas águas termais.",
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
    inclui: ["Transporte", "Hotel 4★", "Café da manhã", "2 Parques", "City Tour", "Guia"],
    imagem: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
    slug: "circuito-completo-caldas-parque",
    descricao: "O pacote mais completo: 5 dias com 2 parques aquáticos, city tour, hotel 4 estrelas e tudo incluso.",
  },
]

const CATEGORIAS = [
  { value: "todas", label: "Todas as categorias" },
  { value: "família", label: "Família" },
  { value: "aventura", label: "Aventura" },
  { value: "luxo", label: "Luxo" },
  { value: "econômico", label: "Econômico" },
  { value: "romântico", label: "Romântico" },
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
  const textCor = pct >= 90 ? "text-red-600" : pct >= 70 ? "text-amber-600" : "text-emerald-600"
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className={`font-semibold ${textCor}`}>{livres} vagas restantes</span>
        <span className="text-muted-foreground">{pct}% ocupado</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${cor}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function CatalogoCard({ exc }: { exc: Excursao }) {
  const desconto = exc.precoOriginal
    ? Math.round(((exc.precoOriginal - exc.preco) / exc.precoOriginal) * 100)
    : null
  const livres = exc.vagasTotal - exc.vagasOcupadas

  return (
    <div
      data-testid={`card-catalogo-${exc.id}`}
      className={`group bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl flex flex-col ${
        exc.destaque ? "border-primary/40 ring-1 ring-primary/20" : "border-border"
      }`}
    >
      <div className="relative overflow-hidden h-52">
        <img
          src={exc.imagem}
          alt={exc.titulo}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

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
            data-testid={`btn-favorite-catalogo-${exc.id}`}
            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-colors"
          >
            <Heart className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-1.5 text-white">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-sm font-medium">{exc.destino}, {exc.estado}</span>
            </div>
            <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-2 py-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
              <span className="text-sm font-semibold text-white">{exc.rating}</span>
              <span className="text-xs text-white/80">({exc.avaliacoes})</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-bold text-lg text-foreground leading-tight group-hover:text-primary transition-colors">
              {exc.titulo}
            </h3>
            <span
              data-testid={`badge-privado-catalogo-${exc.id}`}
              className="inline-flex items-center gap-1 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-0.5 whitespace-nowrap flex-shrink-0"
            >
              <Lock className="w-3 h-3" />
              Privado
            </span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-2">
            {exc.descricao}
          </p>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(exc.dataPartida)} → {formatDate(exc.dataRetorno)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {exc.diasDuracao} dias
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {exc.vagasTotal} vagas
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {exc.inclui.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 text-xs bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-full px-2.5 py-1 border border-emerald-200 dark:border-emerald-800"
            >
              <CheckCircle2 className="w-3 h-3" />
              {item}
            </span>
          ))}
        </div>

        <VagasBar total={exc.vagasTotal} ocupadas={exc.vagasOcupadas} />

        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <div className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
            {exc.avatar}
          </div>
          <div className="flex-1">
            <span className="text-sm font-medium text-foreground">{exc.organizador}</span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Shield className="w-3 h-3 text-emerald-500" />
              Organizador verificado
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between mt-auto pt-2">
          <div>
            {exc.precoOriginal && (
              <p className="text-xs text-muted-foreground line-through">
                R$ {exc.precoOriginal.toLocaleString("pt-BR")}
              </p>
            )}
            <p className="text-2xl font-bold text-foreground">
              R$ {exc.preco.toLocaleString("pt-BR")}
            </p>
            <p className="text-xs text-muted-foreground">por pessoa</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/excursoes/${exc.slug}`}>
              <Button
                data-testid={`btn-detalhes-${exc.id}`}
                size="sm"
                variant="outline"
                className="rounded-xl font-semibold gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                Ver Detalhes
              </Button>
            </Link>
            <Link href={`/viagens-grupo?excursao=${exc.id}`}>
              <Button
                data-testid={`btn-reservar-catalogo-${exc.id}`}
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
    </div>
  )
}

export default function CatalogoExcursoes() {
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
          e.organizador.toLowerCase().includes(q) ||
          e.descricao.toLowerCase().includes(q),
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

  const totalVagas = EXCURSOES.reduce((acc, e) => acc + (e.vagasTotal - e.vagasOcupadas), 0)
  const precoMin = Math.min(...EXCURSOES.map(e => e.preco))

  return (
    <div className="min-h-screen bg-background" data-testid="catalogo-excursoes">
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/excursoes"
                className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1.5 text-sm text-white hover:bg-white/25 transition-colors"
                data-testid="button-voltar-catalogo"
              >
                <ArrowLeft className="w-4 h-4" /> Voltar
              </Link>
              <div>
                <h1 className="text-xl font-bold">Catálogo de Excursões</h1>
                <nav className="flex items-center gap-1.5 text-xs text-blue-200" data-testid="breadcrumb-catalogo">
                  <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                    <Home className="w-3 h-3" /> Início
                  </Link>
                  <span>/</span>
                  <Link href="/excursoes" className="hover:text-white transition-colors">Excursões</Link>
                  <span>/</span>
                  <span className="text-white font-medium">Catálogo</span>
                </nav>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-300" />
                <span>{EXCURSOES.length} excursões</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1">
                <Users className="w-3.5 h-3.5 text-emerald-300" />
                <span>{totalVagas} vagas abertas</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1">
                <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
                <span>A partir de R$ {precoMin}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              data-testid="input-busca-catalogo"
              placeholder="Buscar por destino, título, organizador ou descrição..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10 h-11 rounded-xl"
            />
          </div>
          <Select value={categoria} onValueChange={setCategoria}>
            <SelectTrigger data-testid="select-categoria-catalogo" className="w-full md:w-52 h-11 rounded-xl">
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
            <SelectTrigger data-testid="select-ordenacao-catalogo" className="w-full md:w-52 h-11 rounded-xl">
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
          <h2 className="text-xl font-bold text-foreground" data-testid="text-resultado-count">
            {excursoesFiltradas.length} excursão{excursoesFiltradas.length !== 1 ? "ões" : ""} encontrada{excursoesFiltradas.length !== 1 ? "s" : ""}
          </h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Atualizado hoje</span>
          </div>
        </div>

        {excursoesFiltradas.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground" data-testid="catalogo-empty">
            <Bus className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-xl font-semibold mb-2">Nenhuma excursão encontrada</p>
            <p className="text-sm mb-6">Tente ajustar os filtros ou buscar outro destino</p>
            <Button
              variant="outline"
              onClick={() => { setBusca(""); setCategoria("todas"); setOrdenacao("destaque") }}
              data-testid="btn-limpar-filtros"
              className="rounded-xl"
            >
              Limpar filtros
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {excursoesFiltradas.map((exc) => (
              <CatalogoCard key={exc.id} exc={exc} />
            ))}
          </div>
        )}
      </div>

      <section className="mx-4 my-10 max-w-6xl md:mx-auto" data-testid="cta-lideranca-catalogo">
        {isLider ? (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white py-12 px-6">
            <div className="relative max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm mb-4 border border-white/30">
                <Crown className="w-4 h-4 text-amber-200" />
                Você é um Líder Reservei Viagens ✓
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Crie sua própria excursão</h2>
              <p className="text-amber-100 text-base mb-6">Acesse o wizard de criação e monte seu roteiro completo.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/criar-excursao">
                  <Button data-testid="btn-criar-excursao-catalogo" size="lg" className="rounded-2xl bg-white text-amber-700 hover:bg-amber-50 font-bold px-8 h-12 shadow-lg gap-2">
                    <Plus className="w-5 h-5" /> Criar minha excursão
                  </Button>
                </Link>
                <Link href="/viagens-grupo">
                  <Button data-testid="btn-meus-grupos-catalogo" size="lg" variant="outline" className="rounded-2xl border-white/40 text-white hover:bg-white/10 font-semibold px-8 h-12 gap-2">
                    <Users className="w-5 h-5" /> Meus Grupos
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-700 to-indigo-800 text-white py-12 px-6">
            <div className="relative max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 rounded-full px-4 py-1.5 text-sm mb-4">
                <Crown className="w-4 h-4 text-amber-300" />
                <span className="text-amber-200 font-semibold">Programa Líder</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Quer organizar sua própria excursão?</h2>
              <p className="text-blue-100 text-base max-w-xl mx-auto mb-6">
                Crie e gerencie excursões com ferramentas profissionais — de graça, sem comissões escondidas.
              </p>
              <Button
                data-testid="btn-tornar-lider-catalogo"
                size="lg"
                onClick={() => setLiderDialogOpen(true)}
                className="rounded-2xl bg-amber-400 text-amber-900 hover:bg-amber-300 font-bold px-10 shadow-lg gap-2"
              >
                <Crown className="w-5 h-5" />
                Quero criar minha excursão — É grátis!
              </Button>
              <p className="text-blue-300 text-xs mt-3">Sem taxas de adesão · Ative em 1 clique</p>
            </div>
          </div>
        )}
      </section>

      <LiderApplicationDialog open={liderDialogOpen} onOpenChange={setLiderDialogOpen} user={user} />
    </div>
  )
}
