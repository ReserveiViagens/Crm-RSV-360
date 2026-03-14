import { useState, useMemo, useCallback } from "react"
import { Link } from "wouter"
import {
  Bus, Calendar, Users, MapPin, Star, Clock, ChevronRight,
  Search, Filter, ArrowRight, Shield, ArrowLeft,
  CheckCircle2, Plus, Sparkles, TrendingUp,
  Crown, Lock, Heart, Home, Thermometer, Eye,
  X, MessageCircle, Loader2, Navigation,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { LiderApplicationDialog } from "@/components/lider-application-dialog"
import { buscarCEP, formatCEP, ESTADOS_BR } from "@/lib/viacep"

interface Excursao {
  id: string
  titulo: string
  destino: string
  estado: string
  cidadeSaida: string
  estadoSaida: string
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
    cidadeSaida: "Goiânia",
    estadoSaida: "GO",
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
    cidadeSaida: "Brasília",
    estadoSaida: "DF",
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
    cidadeSaida: "Uberlândia",
    estadoSaida: "MG",
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
    cidadeSaida: "Goiânia",
    estadoSaida: "GO",
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
    cidadeSaida: "Belo Horizonte",
    estadoSaida: "MG",
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
    cidadeSaida: "São Paulo",
    estadoSaida: "SP",
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
  {
    id: "7",
    titulo: "Caldas Express — Bate e Volta",
    destino: "Caldas Novas",
    estado: "GO",
    cidadeSaida: "Anápolis",
    estadoSaida: "GO",
    dataPartida: "2026-05-03",
    dataRetorno: "2026-05-04",
    diasDuracao: 2,
    preco: 290,
    vagasTotal: 50,
    vagasOcupadas: 35,
    organizador: "Caldas Express",
    avatar: "CE",
    rating: 4.5,
    avaliacoes: 42,
    categoria: "econômico",
    inclui: ["Transporte", "Hotel 2★", "Café da manhã"],
    imagem: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&q=80",
    slug: "caldas-express-bate-volta",
    descricao: "Viagem rápida e econômica saindo de Anápolis. Ideal para quem quer conhecer Caldas Novas sem gastar muito.",
  },
  {
    id: "8",
    titulo: "Romântica Caldas — Casal Premium",
    destino: "Rio Quente",
    estado: "GO",
    cidadeSaida: "Ribeirão Preto",
    estadoSaida: "SP",
    dataPartida: "2026-05-23",
    dataRetorno: "2026-05-26",
    diasDuracao: 4,
    preco: 1350,
    precoOriginal: 1700,
    vagasTotal: 20,
    vagasOcupadas: 14,
    organizador: "Viagens Romance",
    avatar: "VR",
    rating: 4.9,
    avaliacoes: 65,
    categoria: "romântico",
    inclui: ["Transporte", "Resort 5★", "All Inclusive", "Spa Casal", "Jantar Especial"],
    imagem: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
    tag: "Romântico",
    slug: "romantica-caldas-casal-premium",
    descricao: "Roteiro exclusivo para casais. Resort 5 estrelas, spa, jantar a dois e momentos inesquecíveis.",
  },
  {
    id: "9",
    titulo: "Melhor Idade — Caldas Termal",
    destino: "Caldas Novas",
    estado: "GO",
    cidadeSaida: "Campo Grande",
    estadoSaida: "MS",
    dataPartida: "2026-06-01",
    dataRetorno: "2026-06-05",
    diasDuracao: 5,
    preco: 780,
    precoOriginal: 990,
    vagasTotal: 38,
    vagasOcupadas: 20,
    organizador: "Grupo Viagens GO",
    avatar: "GV",
    rating: 4.8,
    avaliacoes: 91,
    categoria: "família",
    inclui: ["Transporte", "Hotel 3★", "All Inclusive", "Acompanhante", "Seguro"],
    imagem: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80",
    slug: "melhor-idade-caldas-termal",
    descricao: "Roteiro especial para a melhor idade. Ritmo tranquilo, hotel confortável e águas termais terapêuticas.",
  },
  {
    id: "10",
    titulo: "Feriado Corpus Christi Caldas",
    destino: "Caldas Novas",
    estado: "GO",
    cidadeSaida: "Cuiabá",
    estadoSaida: "MT",
    dataPartida: "2026-06-04",
    dataRetorno: "2026-06-08",
    diasDuracao: 5,
    preco: 920,
    precoOriginal: 1200,
    vagasTotal: 46,
    vagasOcupadas: 12,
    organizador: "Tour Caldas",
    avatar: "TC",
    rating: 4.7,
    avaliacoes: 38,
    categoria: "família",
    inclui: ["Transporte", "Hotel 4★", "Café da manhã", "1 Parque", "City Tour"],
    imagem: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80",
    tag: "Feriado",
    slug: "feriado-corpus-christi-caldas",
    descricao: "Aproveite o feriado prolongado de Corpus Christi em Caldas Novas. Parque aquático e city tour inclusos.",
  },
  {
    id: "11",
    titulo: "Caldas All Inclusive Deluxe",
    destino: "Caldas Novas",
    estado: "GO",
    cidadeSaida: "Goiânia",
    estadoSaida: "GO",
    dataPartida: "2026-05-30",
    dataRetorno: "2026-06-03",
    diasDuracao: 5,
    preco: 1680,
    precoOriginal: 2100,
    vagasTotal: 24,
    vagasOcupadas: 19,
    organizador: "Reservei Viagens",
    avatar: "RV",
    rating: 5.0,
    avaliacoes: 152,
    categoria: "luxo",
    inclui: ["Transporte VIP", "Resort 5★", "All Inclusive", "3 Parques", "Spa", "Guia Premium"],
    imagem: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    destaque: true,
    tag: "Premium",
    slug: "caldas-all-inclusive-deluxe",
    descricao: "A experiência mais completa em Caldas Novas. Resort 5 estrelas, 3 parques, spa e all inclusive de verdade.",
  },
  {
    id: "12",
    titulo: "Rio Quente Radical — Jovem Aventureiro",
    destino: "Rio Quente",
    estado: "GO",
    cidadeSaida: "Brasília",
    estadoSaida: "DF",
    dataPartida: "2026-06-13",
    dataRetorno: "2026-06-16",
    diasDuracao: 4,
    preco: 590,
    vagasTotal: 40,
    vagasOcupadas: 15,
    organizador: "Caldas Jovem",
    avatar: "CJ",
    rating: 4.6,
    avaliacoes: 47,
    categoria: "aventura",
    inclui: ["Transporte", "Pousada", "Café da manhã", "Rafting", "Rapel"],
    imagem: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=600&q=80",
    tag: "Radical",
    slug: "rio-quente-radical",
    descricao: "Para quem busca adrenalina. Rafting, rapel e trilhas em Rio Quente com a turma jovem.",
  },
  {
    id: "13",
    titulo: "Caldas Novas Finde Econômico",
    destino: "Caldas Novas",
    estado: "GO",
    cidadeSaida: "Uberlândia",
    estadoSaida: "MG",
    dataPartida: "2026-06-06",
    dataRetorno: "2026-06-08",
    diasDuracao: 3,
    preco: 420,
    vagasTotal: 48,
    vagasOcupadas: 10,
    organizador: "Grupo Viagens GO",
    avatar: "GV",
    rating: 4.5,
    avaliacoes: 33,
    categoria: "econômico",
    inclui: ["Transporte", "Pousada", "Café da manhã"],
    imagem: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
    slug: "caldas-novas-finde-economico",
    descricao: "Fim de semana em Caldas Novas sem pesar no bolso. Pousada confortável e transporte garantido.",
  },
  {
    id: "14",
    titulo: "Férias de Julho em Caldas",
    destino: "Caldas Novas",
    estado: "GO",
    cidadeSaida: "São Paulo",
    estadoSaida: "SP",
    dataPartida: "2026-07-11",
    dataRetorno: "2026-07-17",
    diasDuracao: 7,
    preco: 1490,
    precoOriginal: 1900,
    vagasTotal: 50,
    vagasOcupadas: 5,
    organizador: "Reservei Viagens",
    avatar: "RV",
    rating: 4.9,
    avaliacoes: 201,
    categoria: "família",
    inclui: ["Transporte", "Hotel 4★", "Café da manhã", "2 Parques", "Guia", "Seguro"],
    imagem: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80",
    tag: "Férias Julho",
    slug: "ferias-julho-caldas",
    descricao: "Férias de julho com a família inteira! 7 dias com 2 parques aquáticos, guia e hotel 4 estrelas.",
  },
  {
    id: "15",
    titulo: "Escapada Termal — Saída BH",
    destino: "Caldas Novas",
    estado: "GO",
    cidadeSaida: "Belo Horizonte",
    estadoSaida: "MG",
    dataPartida: "2026-05-22",
    dataRetorno: "2026-05-25",
    diasDuracao: 4,
    preco: 750,
    precoOriginal: 950,
    vagasTotal: 44,
    vagasOcupadas: 30,
    organizador: "Tour Caldas",
    avatar: "TC",
    rating: 4.7,
    avaliacoes: 88,
    categoria: "família",
    inclui: ["Transporte", "Hotel 3★", "Café da manhã", "1 Parque", "Guia"],
    imagem: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&q=80",
    slug: "escapada-termal-saida-bh",
    descricao: "Saída direta de BH para Caldas Novas. Ônibus confortável, hotel e parque aquático inclusos.",
  },
  {
    id: "16",
    titulo: "Caldas Premium Ribeirão",
    destino: "Rio Quente",
    estado: "GO",
    cidadeSaida: "Ribeirão Preto",
    estadoSaida: "SP",
    dataPartida: "2026-06-20",
    dataRetorno: "2026-06-24",
    diasDuracao: 5,
    preco: 1280,
    precoOriginal: 1600,
    vagasTotal: 32,
    vagasOcupadas: 11,
    organizador: "Viagens Romance",
    avatar: "VR",
    rating: 4.8,
    avaliacoes: 54,
    categoria: "luxo",
    inclui: ["Transporte", "Resort 4★", "All Inclusive", "Hot Park", "Spa"],
    imagem: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80",
    slug: "caldas-premium-ribeirao",
    descricao: "Saindo de Ribeirão Preto rumo ao Rio Quente. Resort 4 estrelas, Hot Park e spa inclusos.",
  },
  {
    id: "17",
    titulo: "Caldas & Hot Park — Saída Anápolis",
    destino: "Caldas Novas",
    estado: "GO",
    cidadeSaida: "Anápolis",
    estadoSaida: "GO",
    dataPartida: "2026-06-27",
    dataRetorno: "2026-06-30",
    diasDuracao: 4,
    preco: 680,
    precoOriginal: 850,
    vagasTotal: 46,
    vagasOcupadas: 22,
    organizador: "Caldas Express",
    avatar: "CE",
    rating: 4.6,
    avaliacoes: 61,
    categoria: "família",
    inclui: ["Transporte", "Hotel 3★", "Café da manhã", "1 Parque", "City Tour"],
    imagem: "https://images.unsplash.com/photo-1549294413-26f195200c16?w=600&q=80",
    slug: "caldas-hot-park-anapolis",
    descricao: "Saída de Anápolis com parque aquático e city tour inclusos. Hotel confortável e preço acessível.",
  },
  {
    id: "18",
    titulo: "Caldas Novas VIP — Saída Campo Grande",
    destino: "Rio Quente",
    estado: "GO",
    cidadeSaida: "Campo Grande",
    estadoSaida: "MS",
    dataPartida: "2026-07-04",
    dataRetorno: "2026-07-09",
    diasDuracao: 6,
    preco: 1550,
    precoOriginal: 1950,
    vagasTotal: 28,
    vagasOcupadas: 6,
    organizador: "Tour Caldas",
    avatar: "TC",
    rating: 4.8,
    avaliacoes: 29,
    categoria: "luxo",
    inclui: ["Transporte VIP", "Resort 5★", "All Inclusive", "2 Parques", "Spa", "Guia"],
    imagem: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80",
    tag: "VIP",
    slug: "caldas-novas-vip-campo-grande",
    descricao: "Viagem VIP saindo de Campo Grande. Resort 5 estrelas, 2 parques, spa e all inclusive completo.",
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

const MESES_PARTIDA = [
  { value: "todos", label: "Qualquer data" },
  { value: "2026-04", label: "Abril 2026" },
  { value: "2026-05", label: "Maio 2026" },
  { value: "2026-06", label: "Junho 2026" },
  { value: "2026-07", label: "Julho 2026" },
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
            <div>
              <div className="flex items-center gap-1.5 text-white">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-sm font-medium">{exc.destino}, {exc.estado}</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/80 mt-0.5">
                <Navigation className="w-3 h-3" />
                <span className="text-xs">Saída: {exc.cidadeSaida}/{exc.estadoSaida}</span>
              </div>
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

          <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
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

type TabLocalidade = "cep" | "cidade" | "estado"

interface FiltrosAtivos {
  cidadeSaida: string | null
  estadoSaida: string | null
  precoMin: string
  precoMax: string
  mesPartida: string
}

function ChipFiltro({ label, tipo, onRemove }: { label: string; tipo: string; onRemove: () => void }) {
  return (
    <span
      data-testid={`chip-filtro-${tipo}`}
      className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1 text-sm font-medium"
    >
      {label}
      <button
        data-testid={`btn-limpar-chip-${tipo}`}
        onClick={onRemove}
        className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </span>
  )
}

export default function CatalogoExcursoes() {
  const [busca, setBusca] = useState("")
  const [categoria, setCategoria] = useState("todas")
  const [ordenacao, setOrdenacao] = useState("destaque")
  const [liderDialogOpen, setLiderDialogOpen] = useState(false)
  const { user } = useAuth()

  const [tabLocalidade, setTabLocalidade] = useState<TabLocalidade>("cep")
  const [cepInput, setCepInput] = useState("")
  const [cepBuscando, setCepBuscando] = useState(false)
  const [cepErro, setCepErro] = useState("")

  const [filtros, setFiltros] = useState<FiltrosAtivos>({
    cidadeSaida: null,
    estadoSaida: null,
    precoMin: "",
    precoMax: "",
    mesPartida: "todos",
  })

  const [cidadeInput, setCidadeInput] = useState("")

  const isLider = user?.role === "LIDER" || user?.role === "admin"

  const handleBuscarCEP = useCallback(async () => {
    const cleaned = cepInput.replace(/\D/g, "")
    if (cleaned.length !== 8) {
      setCepErro("Digite um CEP válido com 8 dígitos")
      return
    }
    setCepBuscando(true)
    setCepErro("")
    const result = await buscarCEP(cleaned)
    setCepBuscando(false)
    if (result.erro) {
      setCepErro("CEP não encontrado. Verifique e tente novamente.")
      setFiltros((prev) => ({ ...prev, cidadeSaida: null, estadoSaida: null }))
      return
    }
    setFiltros((prev) => ({
      ...prev,
      cidadeSaida: result.cidade,
      estadoSaida: result.estado,
    }))
  }, [cepInput])

  const handleCidadeFiltro = useCallback(() => {
    const trimmed = cidadeInput.trim()
    if (!trimmed) return
    setFiltros((prev) => ({
      ...prev,
      cidadeSaida: trimmed,
      estadoSaida: null,
    }))
  }, [cidadeInput])

  const handleEstadoFiltro = useCallback((uf: string) => {
    if (uf === "todos") {
      setFiltros((prev) => ({ ...prev, estadoSaida: null, cidadeSaida: null }))
      return
    }
    setFiltros((prev) => ({
      ...prev,
      estadoSaida: uf,
      cidadeSaida: null,
    }))
  }, [])

  const limparLocalidade = useCallback(() => {
    setFiltros((prev) => ({ ...prev, cidadeSaida: null, estadoSaida: null }))
    setCepInput("")
    setCidadeInput("")
    setCepErro("")
  }, [])

  const temFiltrosAtivos = !!(
    filtros.cidadeSaida ||
    filtros.estadoSaida ||
    filtros.precoMin ||
    filtros.precoMax ||
    filtros.mesPartida !== "todos" ||
    categoria !== "todas" ||
    busca.trim()
  )

  const excursoesFiltradas = useMemo(() => {
    let lista = [...EXCURSOES]

    if (busca.trim()) {
      const q = busca.toLowerCase()
      lista = lista.filter(
        (e) =>
          e.titulo.toLowerCase().includes(q) ||
          e.destino.toLowerCase().includes(q) ||
          e.organizador.toLowerCase().includes(q) ||
          e.descricao.toLowerCase().includes(q) ||
          e.cidadeSaida.toLowerCase().includes(q),
      )
    }

    if (categoria !== "todas") {
      lista = lista.filter((e) => e.categoria === categoria)
    }

    if (filtros.cidadeSaida) {
      const c = filtros.cidadeSaida.toLowerCase()
      lista = lista.filter((e) => e.cidadeSaida.toLowerCase().includes(c))
    }

    if (filtros.estadoSaida && !filtros.cidadeSaida) {
      lista = lista.filter((e) => e.estadoSaida === filtros.estadoSaida)
    }

    if (filtros.precoMin) {
      const min = parseFloat(filtros.precoMin)
      if (!isNaN(min)) lista = lista.filter((e) => e.preco >= min)
    }
    if (filtros.precoMax) {
      const max = parseFloat(filtros.precoMax)
      if (!isNaN(max)) lista = lista.filter((e) => e.preco <= max)
    }

    if (filtros.mesPartida !== "todos") {
      lista = lista.filter((e) => e.dataPartida.startsWith(filtros.mesPartida))
    }

    if (ordenacao === "preco-asc") lista.sort((a, b) => a.preco - b.preco)
    else if (ordenacao === "preco-desc") lista.sort((a, b) => b.preco - a.preco)
    else if (ordenacao === "vagas")
      lista.sort((a, b) => (b.vagasTotal - b.vagasOcupadas) - (a.vagasTotal - a.vagasOcupadas))
    else if (ordenacao === "avaliacao") lista.sort((a, b) => b.rating - a.rating)
    else lista.sort((a, b) => (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0))

    return lista
  }, [busca, categoria, ordenacao, filtros])

  const totalVagas = EXCURSOES.reduce((acc, e) => acc + (e.vagasTotal - e.vagasOcupadas), 0)
  const precoMin = Math.min(...EXCURSOES.map(e => e.preco))

  const limparTudo = useCallback(() => {
    setBusca("")
    setCategoria("todas")
    setOrdenacao("destaque")
    limparLocalidade()
    setFiltros({ cidadeSaida: null, estadoSaida: null, precoMin: "", precoMax: "", mesPartida: "todos" })
  }, [limparLocalidade])

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
        <div
          data-testid="secao-localidade"
          className="bg-white dark:bg-zinc-900 rounded-2xl border border-border shadow-sm p-5 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground">De onde você sai?</h3>
          </div>

          <div className="flex gap-1 mb-4">
            {(
              [
                { key: "cep" as TabLocalidade, label: "CEP" },
                { key: "cidade" as TabLocalidade, label: "Cidade" },
                { key: "estado" as TabLocalidade, label: "Estado" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                data-testid={`tab-localidade-${tab.key}`}
                onClick={() => setTabLocalidade(tab.key)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  tabLocalidade === tab.key
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {tabLocalidade === "cep" && (
            <div className="flex gap-2 items-start">
              <div className="flex-1">
                <Input
                  data-testid="input-cep"
                  placeholder="00000-000"
                  value={cepInput}
                  onChange={(e) => {
                    setCepInput(formatCEP(e.target.value))
                    setCepErro("")
                  }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleBuscarCEP() }}
                  className="h-11 rounded-xl"
                  maxLength={9}
                />
                {cepErro && <p className="text-xs text-red-500 mt-1">{cepErro}</p>}
              </div>
              <Button
                data-testid="btn-buscar-cep"
                onClick={handleBuscarCEP}
                disabled={cepBuscando}
                className="rounded-xl h-11"
              >
                {cepBuscando ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                <span className="ml-2">Buscar</span>
              </Button>
            </div>
          )}

          {tabLocalidade === "cidade" && (
            <div className="flex gap-2">
              <Input
                data-testid="input-cidade-localidade"
                placeholder="Ex: Goiânia, Brasília, São Paulo..."
                value={cidadeInput}
                onChange={(e) => setCidadeInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleCidadeFiltro() }}
                className="h-11 rounded-xl flex-1"
              />
              <Button
                data-testid="btn-buscar-cidade"
                onClick={handleCidadeFiltro}
                className="rounded-xl h-11"
              >
                <Search className="w-4 h-4 mr-2" />
                Filtrar
              </Button>
            </div>
          )}

          {tabLocalidade === "estado" && (
            <Select
              value={filtros.estadoSaida || "todos"}
              onValueChange={handleEstadoFiltro}
            >
              <SelectTrigger data-testid="select-estado-localidade" className="h-11 rounded-xl">
                <SelectValue placeholder="Selecione o estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os estados</SelectItem>
                {ESTADOS_BR.map((e) => (
                  <SelectItem key={e.uf} value={e.uf}>{e.uf} — {e.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {(filtros.cidadeSaida || filtros.estadoSaida) && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-foreground font-medium">
                Filtrando saídas de{" "}
                {filtros.cidadeSaida
                  ? `${filtros.cidadeSaida}${filtros.estadoSaida ? `/${filtros.estadoSaida}` : ""}`
                  : ESTADOS_BR.find((e) => e.uf === filtros.estadoSaida)?.nome || filtros.estadoSaida}
              </span>
              <button onClick={limparLocalidade} className="text-xs text-primary hover:underline ml-auto">
                Limpar
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              data-testid="input-busca-catalogo"
              placeholder="Buscar por destino, título, organizador ou cidade de saída..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10 h-11 rounded-xl"
            />
          </div>
          <Select value={categoria} onValueChange={setCategoria}>
            <SelectTrigger data-testid="select-categoria-catalogo" className="w-full md:w-48 h-11 rounded-xl">
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
            <SelectTrigger data-testid="select-ordenacao-catalogo" className="w-full md:w-48 h-11 rounded-xl">
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

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="flex gap-3 flex-1">
            <Input
              data-testid="input-preco-min"
              type="number"
              placeholder="Preço mín (R$)"
              value={filtros.precoMin}
              onChange={(e) => setFiltros((p) => ({ ...p, precoMin: e.target.value }))}
              className="h-11 rounded-xl w-full md:w-40"
            />
            <Input
              data-testid="input-preco-max"
              type="number"
              placeholder="Preço máx (R$)"
              value={filtros.precoMax}
              onChange={(e) => setFiltros((p) => ({ ...p, precoMax: e.target.value }))}
              className="h-11 rounded-xl w-full md:w-40"
            />
          </div>
          <Select
            value={filtros.mesPartida}
            onValueChange={(v) => setFiltros((p) => ({ ...p, mesPartida: v }))}
          >
            <SelectTrigger data-testid="select-data-partida" className="w-full md:w-48 h-11 rounded-xl">
              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Data de partida" />
            </SelectTrigger>
            <SelectContent>
              {MESES_PARTIDA.map((m) => (
                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {temFiltrosAtivos && (
          <div className="flex flex-wrap gap-2 mb-5 items-center">
            <span className="text-sm text-muted-foreground font-medium">Filtros ativos:</span>
            {filtros.cidadeSaida && (
              <ChipFiltro
                label={`Saída: ${filtros.cidadeSaida}${filtros.estadoSaida ? `/${filtros.estadoSaida}` : ""}`}
                tipo="localidade"
                onRemove={limparLocalidade}
              />
            )}
            {filtros.estadoSaida && !filtros.cidadeSaida && (
              <ChipFiltro
                label={`Estado: ${filtros.estadoSaida}`}
                tipo="estado"
                onRemove={() => setFiltros((p) => ({ ...p, estadoSaida: null }))}
              />
            )}
            {filtros.precoMin && (
              <ChipFiltro
                label={`Mín: R$ ${filtros.precoMin}`}
                tipo="preco-min"
                onRemove={() => setFiltros((p) => ({ ...p, precoMin: "" }))}
              />
            )}
            {filtros.precoMax && (
              <ChipFiltro
                label={`Máx: R$ ${filtros.precoMax}`}
                tipo="preco-max"
                onRemove={() => setFiltros((p) => ({ ...p, precoMax: "" }))}
              />
            )}
            {filtros.mesPartida !== "todos" && (
              <ChipFiltro
                label={MESES_PARTIDA.find((m) => m.value === filtros.mesPartida)?.label || filtros.mesPartida}
                tipo="mes"
                onRemove={() => setFiltros((p) => ({ ...p, mesPartida: "todos" }))}
              />
            )}
            {categoria !== "todas" && (
              <ChipFiltro
                label={CATEGORIAS.find((c) => c.value === categoria)?.label || categoria}
                tipo="categoria"
                onRemove={() => setCategoria("todas")}
              />
            )}
            {busca.trim() && (
              <ChipFiltro
                label={`Busca: "${busca}"`}
                tipo="busca"
                onRemove={() => setBusca("")}
              />
            )}
            <button
              onClick={limparTudo}
              className="text-xs text-primary hover:underline font-medium ml-1"
              data-testid="btn-limpar-filtros"
            >
              Limpar tudo
            </button>
          </div>
        )}

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
          <div
            data-testid="card-caldas-ai-empty"
            className="text-center py-16 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-zinc-800 rounded-2xl border border-border"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <p className="text-xl font-bold text-foreground mb-2">Nenhuma excursão encontrada</p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              Não encontramos excursões com esses filtros. Mas a CaldasAI pode ajudar a montar a viagem perfeita para você!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/5562999999999?text=Ol%C3%A1!%20Quero%20ajuda%20para%20encontrar%20uma%20excurs%C3%A3o%20para%20Caldas%20Novas"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  data-testid="btn-whatsapp-sugestao"
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Falar no WhatsApp
                </Button>
              </a>
              <Link href="/caldas-ai">
                <Button
                  data-testid="btn-caldas-ai-empty"
                  variant="outline"
                  className="rounded-xl font-semibold gap-2"
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                  Perguntar à CaldasAI
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={limparTudo}
                data-testid="btn-limpar-filtros-empty"
                className="rounded-xl"
              >
                Limpar filtros
              </Button>
            </div>
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
