
import { useState, useEffect, useRef } from "react"
import {
  ArrowLeft,
  Settings,
  Users,
  Send,
  FileText,
  Ticket,
  Calendar,
  Camera,
  MapPin,
  UserPlus,
  Smile,
  Star,
  Check,
  Clock,
  ChevronRight,
  Share2,
  Vote,
  DollarSign,
  ThumbsUp,
  Sparkles,
  Bell,
  Crown,
  ImageIcon,
  Minus,
  Plus,
  TrendingDown,
  Percent,
  ChevronDown,
  ChevronUp,
  Bot,
  Lightbulb,
  BarChart3,
  User,
  Plane,
  Hotel,
  UtensilsCrossed,
  Map,
  MessageCircle,
  Gift,
  Utensils,
  TreePine,
  Waves,
  Copy,
  ExternalLink,
  Lock,
  LogIn,
  AlertCircle,
  Hourglass,
  ShieldX,
  KeyRound,
  Home,
  Mail,
  Compass,
  RefreshCw,
  Heart,
  Zap,
  Trophy,
} from "lucide-react"
import { Link, useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query"
import { useAuth } from "@/hooks/use-auth"
import { SiWhatsapp } from "react-icons/si"
import type { AtividadeWizard } from "@shared/schema"
import { RoteiroActivityCard, type RoteiroActivityCategoria } from "@/components/roteiro-activity-card"
import { subscribeExcursao, socketEmit } from "@/lib/socket"
import { toast } from "@/hooks/use-toast"
import { obterMensagemUpsell, deveExibirFomoEscassez, obterFraseUrgencia } from "@/lib/caldas-ai-regras"
import { TEXTO_TERMO_EXCURSAO_CALDAS, TERMO_VERSAO } from "@/constants/termos"
import { BarraFinanceira } from "@/components/BarraFinanceira"
import { CountdownTimer } from "@/components/CountdownTimer"
import { QRCodeSVG } from "qrcode.react"
import { HotelSelector } from "@/components/HotelSelector"
import { PaymentCheckout } from "@/components/checkout/PaymentCheckout"
import { calculateNights, hasScheduleConflict, sortByMarginAndScore, type TimeSlot } from "@/utils/social-commerce"
const WHATSAPP = "5564993197555"

const GATE_EXCURSAO_INFO: Record<string, { nome: string; dataPartida: string; dataRetorno: string; preco: number }> = {
  "1": { nome: "Caldas Novas Família Total", dataPartida: "2026-04-18", dataRetorno: "2026-04-21", preco: 890 },
  "2": { nome: "Hot Park & Rio Quente Fest", dataPartida: "2026-04-25", dataRetorno: "2026-04-27", preco: 690 },
  "3": { nome: "Semana Santa Caldas Premium", dataPartida: "2026-04-14", dataRetorno: "2026-04-20", preco: 1290 },
  "4": { nome: "Finde nas Termas Goianas", dataPartida: "2026-05-02", dataRetorno: "2026-05-04", preco: 590 },
  "5": { nome: "Aventura nas Águas — Grupos Jovens", dataPartida: "2026-05-09", dataRetorno: "2026-05-12", preco: 790 },
  "6": { nome: "Circuito Completo Caldas + Parque", dataPartida: "2026-05-16", dataRetorno: "2026-05-20", preco: 990 },
}

function formatGateDate(iso: string) {
  const d = new Date(iso + "T12:00:00")
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
}

const ATIVIDADES_FALLBACK: AtividadeWizard[] = [
  { id: "hot-park", label: "Hot Park", descricao: "Maior parque aquático de águas quentes do mundo", icone: "waves" },
  { id: "di-roma", label: "Di Roma Thermas", descricao: "Resort com piscinas termais e toboáguas", icone: "droplets" },
  { id: "lagoa-quente", label: "Lagoa Quente", descricao: "Complexo termal com águas naturalmente aquecidas", icone: "thermometer" },
  { id: "parque-corumba", label: "Parque Corumbá", descricao: "Lago Corumbá com passeio de barco e esportes náuticos", icone: "sailboat" },
  { id: "city-tour", label: "City Tour", descricao: "Centro + comprinhas + pontos turísticos locais", icone: "map" },
  { id: "taua-resort", label: "Tauá Resort", descricao: "Resort all-inclusive com parque aquático e spa", icone: "hotel" },
  { id: "rio-quente", label: "Rio Quente Resorts", descricao: "Hot Park + hospedagem integrada no complexo", icone: "tree-pine" },
  { id: "aquapark", label: "Caldas Novas Aquapark", descricao: "Parque aquático familiar com piscinas e toboáguas", icone: "fish" },
]

interface Member {
  name: string
  color: string
  isOrganizer?: boolean
  expenses: number
  paid: number
}

const MEMBERS: Member[] = [
  { name: "Você", color: "#2563EB", isOrganizer: true, expenses: 578, paid: 578 },
  { name: "Cate Plotar", color: "#8B5CF6", expenses: 578, paid: 400 },
  { name: "Mario Paxvango", color: "#EC4899", expenses: 578, paid: 578 },
  { name: "Viete Perruoiras", color: "#F59E0B", expenses: 578, paid: 300 },
]

const TABS = [
  { icon: FileText, label: "Vouchers" },
  { icon: Ticket, label: "Ingressos" },
  { icon: Calendar, label: "Programação" },
  { icon: ImageIcon, label: "Fotos" },
]

const PRIMARY_TABS = [
  { icon: Compass, label: "Planejar" },
  { icon: MessageCircle, label: "Chat" },
  { icon: Vote, label: "Votar" },
  { icon: Home, label: "Timeline do Planejamento" },
  { icon: Map, label: "Roteiro" },
]

const TIMELINE = [
  {
    day: "Dia 1",
    label: "Check-in & Piscinas",
    icon: Hotel,
    status: "done",
    details: "14h check-in, tarde livre nas piscinas termais",
    expandedDetails: null,
    time: "14:00 - 20:00",
  },
  {
    day: "Dia 2",
    label: "Parque Aquático",
    icon: Waves,
    status: "done",
    details: "Hot Park o dia inteiro, almoço incluso",
    expandedDetails: null,
    time: "09:00 - 18:00",
  },
  {
    day: "Dia 3",
    label: "City Tour",
    icon: Map,
    status: "current",
    details: "Visita guiada + almoço regional",
    expandedDetails: null,
    time: "08:30 - 16:00",
  },
  {
    day: "Dia 4",
    label: "Spa & Compras",
    icon: TreePine,
    status: "upcoming",
    details: "Manhã no spa, tarde para compras",
    time: "10:00 - 17:00",
    expandedDetails: [
      { hora: "10:00", atividade: "Spa termal — Banho nas piscinas de água quente natural (36°C–42°C)", dica: "Leve chinelo e toalha extra. A água é sulfurosa e ótima para a pele." },
      { hora: "12:00", atividade: "Almoço livre — Opções no centro gastronômico do resort" },
      { hora: "13:30", atividade: "Massagem relaxante (opcional) — Reservar com antecedência", dica: "Pacote grupo com 20% de desconto: R$ 89/pessoa." },
      { hora: "15:00", atividade: "Compras — Feira do artesanato local e lojas do centro", dica: "Lojas recomendadas: Empório Goiano, Doces da Serra, Artesanato Termal." },
      { hora: "17:00", atividade: "Retorno ao hotel — Tempo livre para descanso" },
    ],
  },
  {
    day: "Dia 5",
    label: "Check-out",
    icon: Plane,
    status: "upcoming",
    details: "Café da manhã e partida às 12h",
    time: "07:00 - 12:00",
    expandedDetails: [
      { hora: "07:00", atividade: "Café da manhã — Buffet completo no restaurante do hotel", dica: "Último café incluso na diária. Aproveite as frutas regionais!" },
      { hora: "09:00", atividade: "Arrumar malas e conferir pertences no quarto" },
      { hora: "10:00", atividade: "Check-out na recepção — Devolver chaves e fechar conta", dica: "Verifique consumo do frigobar antes de descer." },
      { hora: "10:30", atividade: "Tempo livre — Última passada nas piscinas ou lojinha do hotel" },
      { hora: "11:30", atividade: "Embarque no ônibus — Ponto de encontro no lobby", dica: "Chegue com 15 min de antecedência. Viagem de retorno: ~3h." },
    ],
  },
]

const VOTE_OPTIONS = [
  { name: "Resort Termas Paradise", votes: 3, total: 5, img: Hotel, tags: ["Piscina termal", "Buffet"] },
  { name: "Hotel Lago Azul", votes: 2, total: 5, img: Star, tags: ["Vista lago", "Spa"] },
  { name: "Pousada Recanto", votes: 1, total: 5, img: MapPin, tags: ["Econômico", "Central"] },
]

const AI_ITINERARIES = [
  {
    name: "Roteiro Relax",
    icon: Star,
    color: "#8B5CF6",
    days: ["Spa & Termas", "Lago Corumbá", "Compras", "Dia Livre"],
    savings: 320,
    basePP: 489,
  },
  {
    name: "Roteiro Aventura",
    icon: Plane,
    color: "#2563EB",
    days: ["Hot Park", "Rapel & Trilha", "Rafting", "City Tour"],
    savings: 450,
    basePP: 629,
  },
  {
    name: "Roteiro Família",
    icon: Users,
    color: "#22C55E",
    days: ["Parque Aquático", "Zoo & Passeio", "Piscinas", "Compras"],
    savings: 380,
    basePP: 539,
  },
]

type PlannerStep = "intro" | "lazer" | "orcamento" | "perfil" | "dias" | "resultado"

interface PlannerQuestion {
  step: PlannerStep
  aiMessage: string
  options: { label: string; value: string; icon?: string }[]
}

const PLANNER_FLOW: PlannerQuestion[] = [
  {
    step: "intro",
    aiMessage: "Imagina chegar em Caldas Novas e descobrir que tudo que você queria fazer já esgotou... 😰 Isso acontece com 60% dos grupos que não planejam! Mas calma — eu vou montar o roteiro perfeito pra vocês em segundos. Me conta: o que vocês NÃO querem que aconteça nessa viagem?",
    options: [
      { label: "🏨 Hotel ruim e longe de tudo", value: "hotel" },
      { label: "💸 Gastar demais sem curtir", value: "gastar" },
      { label: "😴 Ficar sem nada pra fazer", value: "tedio" },
      { label: "🗓️ Perder tempo organizando", value: "tempo" },
    ],
  },
  {
    step: "lazer",
    aiMessage: "Entendi! Vou cuidar disso pra vocês. Agora me conta: qual é o estilo do grupo? O que vocês mais curtem?",
    options: [
      { label: "🧖 Relaxar e descansar", value: "relax" },
      { label: "🎢 Aventura e adrenalina", value: "aventura" },
      { label: "👨‍👩‍👧‍👦 Diversão em família", value: "familia" },
      { label: "🎉 Festas e vida noturna", value: "festa" },
    ],
  },
  {
    step: "orcamento",
    aiMessage: "Ótima escolha! E sobre o investimento — lembra que em grupo vocês economizam até 20%. Qual faixa de orçamento por pessoa vocês pensam?",
    options: [
      { label: "💰 Econômico (até R$ 400)", value: "economico" },
      { label: "⚖️ Custo-benefício (R$ 400-600)", value: "medio" },
      { label: "✨ Conforto total (R$ 600+)", value: "premium" },
    ],
  },
  {
    step: "perfil",
    aiMessage: "Perfeito! E quem vai nessa viagem? Isso me ajuda a escolher as melhores atividades:",
    options: [
      { label: "👫 Casais", value: "casais" },
      { label: "👨‍👩‍👧‍👦 Famílias com crianças", value: "familias" },
      { label: "👥 Amigos", value: "amigos" },
      { label: "🎓 Grupo da igreja/escola", value: "grupo" },
    ],
  },
  {
    step: "dias",
    aiMessage: "Quase lá! Quantos dias vocês pretendem ficar?",
    options: [
      { label: "📅 2-3 dias (final de semana)", value: "curto" },
      { label: "📅 4-5 dias (feriado)", value: "medio" },
      { label: "📅 6-7 dias (semana inteira)", value: "longo" },
    ],
  },
]

function getPlannerRecommendation(answers: Record<string, string>): { index: number; reason: string; proof: string; benefit: string } {
  const lazer = answers.lazer
  const orc = answers.orcamento

  if (lazer === "aventura" || lazer === "festa") {
    return {
      index: 1,
      reason: "Com o perfil aventureiro do grupo, o Roteiro Aventura tem tudo que vocês precisam: Hot Park, trilhas, rafting e city tour — tudo já negociado com desconto de grupo!",
      proof: "92% dos grupos de amigos que escolheram esse roteiro avaliaram como \"melhor viagem do ano\"",
      benefit: orc === "economico"
        ? "Mesmo no econômico, vocês vão aproveitar TUDO com a economia de grupo!"
        : "Com esse investimento vocês terão uma experiência premium com economia real de até R$ 450 por pessoa!",
    }
  }

  if (lazer === "familia" || answers.perfil === "familias") {
    return {
      index: 2,
      reason: "Pra famílias, o Roteiro Família é imbatível: parques aquáticos, zoo, piscinas e compras — diversão garantida pra todas as idades!",
      proof: "87% das famílias que viajaram com esse roteiro já agendaram a próxima viagem conosco",
      benefit: orc === "premium"
        ? "Com o investimento premium, as crianças terão acesso VIP e a família toda vai curtir sem preocupação!"
        : "O melhor custo-benefício pra família: diversão o dia todo gastando menos que uma viagem individual!",
    }
  }

  return {
    index: 0,
    reason: "O Roteiro Relax foi feito pra quem quer descansar de verdade: spa, termas, lago e tempo livre — vocês vão voltar renovados!",
    proof: "94% dos casais que escolheram esse roteiro disseram que foi a melhor decisão de viagem",
    benefit: orc === "premium"
      ? "Com o pacote premium, vocês terão acesso exclusivo ao spa e experiências relaxantes que normalmente custam o dobro!"
      : "Relaxamento total sem estourar o orçamento — a economia de grupo permite curtir mais pagando menos!",
  }
}

interface ChatMessage {
  id: number
  sender: string
  text: string
  time: string
  isMe: boolean
  isBot?: boolean
  tag?: string
  isOrganizer?: boolean
  card?: {
    type: "hotel" | "attraction"
    title: string
    subtitle: string
    price: string
    oldPrice?: string
    discount?: string
    cta: string
  }
  typing?: boolean
  /** Mensagem de mediação em empate (CaldasAI) — estilo laranja/âmbar */
  isAiIntervention?: boolean
}

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: 1, sender: "Cate Plotar", text: "Pessoal, encontrei umas opções incríveis!", time: "10:30", isMe: false },
  { id: 2, sender: "Você", text: "Vamos! Já apliquei o desconto do grupo, muito bom!", time: "10:32", isMe: true, isOrganizer: true },
  { id: 3, sender: "Mario Paxvango", text: "Fechado! Pode contar comigo.", time: "10:35", isMe: false, tag: "Confirmado" },
  {
    id: 4,
    sender: "CaldasAI",
    text: "Analisei as melhores opções em Caldas Novas para o grupo e selecionei esta hospedagem com ótimo custo-benefício.",
    time: "10:40",
    isMe: false,
    isBot: true,
    card: {
      type: "hotel",
      title: "Resort Termas Paradise",
      subtitle: "Caldas Novas - 4 estrelas - Nota 9.1",
      price: "R$ 289",
      oldPrice: "R$ 450",
      discount: "-36%",
      cta: "Reservar pelo Grupo",
    },
  },
  { id: 5, sender: "Viete Perruoiras", text: "Já vi as opções! Vamos com o Resort Termas mesmo.", time: "10:45", isMe: false },
  { id: 6, sender: "Cate Plotar", text: "Alguém sabe se tem café da manhã incluso?", time: "10:50", isMe: false },
  {
    id: 7,
    sender: "CaldasAI",
    text: "Sim. O Resort Termas Paradise inclui café da manhã completo. Para o grupo, também recomendo este combo de parques com desconto:",
    time: "10:52",
    isMe: false,
    isBot: true,
    card: {
      type: "attraction",
      title: "Hot Park - Ingresso Grupo",
      subtitle: "Desconto especial para 4 ou mais pessoas",
      price: "R$ 139/pessoa",
      oldPrice: "R$ 189",
      discount: "-26%",
      cta: "Ver Ingressos",
    },
  },
  { id: 8, sender: "Mario Paxvango", text: "Esse desconto tá ótimo! Bora fechar logo!", time: "10:55", isMe: false },
  { id: 9, sender: "Você", text: "Fechado! Vou reservar pra todo mundo. Dividindo fica barato demais!", time: "11:00", isMe: true, isOrganizer: true },
  { id: 10, sender: "Viete Perruoiras", text: "Perfeito! Não esqueçam o protetor solar!", time: "11:05", isMe: false },
]

const BOT_RESPONSES: Record<string, ChatMessage> = {
  hotel: {
    id: 0,
    sender: "CaldasAI",
    text: "Para o grupo em Caldas Novas, esta hospedagem oferece ótimo custo-benefício. Com quatro ou mais pessoas o desconto aumenta.",
    time: "",
    isMe: false,
    isBot: true,
    card: {
      type: "hotel",
      title: "Pousada Recanto das Águas",
      subtitle: "Caldas Novas - Nota 9.2 - Wi-Fi incluso",
      price: "R$ 199/noite",
      oldPrice: "R$ 320",
      discount: "-38%",
      cta: "Reservar com desconto",
    },
  },
  restaurante: {
    id: 0,
    sender: "CaldasAI",
    text: "Para jantar em grupo na região, recomendo restaurantes com mesas amplas e boa avaliação. Segue uma opção em destaque:",
    time: "",
    isMe: false,
    isBot: true,
    card: {
      type: "attraction",
      title: "Restaurante Fogão Mineiro",
      subtitle: "Culinária regional - Nota 9.4",
      price: "R$ 65/pessoa",
      oldPrice: "R$ 89",
      discount: "-27%",
      cta: "Reservar mesa",
    },
  },
  parque: {
    id: 0,
    sender: "CaldasAI",
    text: "Os parques aquáticos em Caldas Novas têm condições especiais para grupos. Esta é uma das melhores ofertas no momento:",
    time: "",
    isMe: false,
    isBot: true,
    card: {
      type: "attraction",
      title: "Hot Park - Combo grupo",
      subtitle: "Ingresso + almoço - até 6 pessoas",
      price: "R$ 149/pessoa",
      oldPrice: "R$ 220",
      discount: "-32%",
      cta: "Ver combo grupo",
    },
  },
  spa: {
    id: 0,
    sender: "CaldasAI",
    text: "Programas de spa em grupo costumam sair mais em conta. Encontrei um pacote termal ideal para o grupo:",
    time: "",
    isMe: false,
    isBot: true,
    card: {
      type: "attraction",
      title: "Spa Termal Premium",
      subtitle: "Massagem + piscina termal - grupo",
      price: "R$ 189/pessoa",
      oldPrice: "R$ 280",
      discount: "-33%",
      cta: "Reservar spa",
    },
  },
  ingresso: {
    id: 0,
    sender: "CaldasAI",
    text: "Ingressos para parques e atrações em grupo têm desconto. Segue uma promoção válida para a excursão:",
    time: "",
    isMe: false,
    isBot: true,
    card: {
      type: "attraction",
      title: "Combo 3 parques",
      subtitle: "Hot Park + diRoma + Lagoa Quente",
      price: "R$ 329/pessoa",
      oldPrice: "R$ 499",
      discount: "-34%",
      cta: "Ver ingressos",
    },
  },
  transfer: {
    id: 0,
    sender: "CaldasAI",
    text: "Transfer compartilhado para grupo reduz bastante o custo por pessoa. Veja esta opção de van:",
    time: "",
    isMe: false,
    isBot: true,
    card: {
      type: "attraction",
      title: "Transfer aeroporto - Van",
      subtitle: "Ida e volta - até 8 pessoas",
      price: "R$ 45/pessoa",
      oldPrice: "R$ 120",
      discount: "-63%",
      cta: "Reservar transfer",
    },
  },
  mapaAssentos: {
    id: 0,
    sender: "CaldasAI",
    text: "O mapa de assentos fica na página desta viagem em grupo. O organizador pode ver e definir os lugares na área administrativa do CRM. Quando os assentos forem liberados, você poderá escolher o seu aqui mesmo. Quer que eu avise quando o mapa estiver disponível?",
    time: "",
    isMe: false,
    isBot: true,
  },
  urgencia: {
    id: 0,
    sender: "CaldasAI",
    text: "As vagas desta excursão estão se esgotando. Recomendo fechar o pacote em até 48 horas para garantir preço e assento. Deixar para a última hora pode significar perder o desconto de grupo. Posso ajudar a fechar agora?",
    time: "",
    isMe: false,
    isBot: true,
    card: {
      type: "attraction",
      title: "Fechar pacote agora",
      subtitle: "Garanta preço e vaga — oferta por tempo limitado",
      price: "Ver opções",
      oldPrice: "",
      discount: "",
      cta: "Fechar com desconto",
    },
  },
  default: {
    id: 0,
    sender: "CaldasAI",
    text: "Posso ajudar o grupo a encontrar as melhores opções em Caldas Novas. Segue uma sugestão que combina hospedagem, parque e transfer:",
    time: "",
    isMe: false,
    isBot: true,
    card: {
      type: "hotel",
      title: "Combo grupo especial",
      subtitle: "Hotel + parque + transfer",
      price: "R$ 459/pessoa",
      oldPrice: "R$ 680",
      discount: "-33%",
      cta: "Ver combo",
    },
  },
}

type ExcursaoStatus = "rascunho" | "aberta" | "fechada"

interface Excursao {
  id: string
  nome: string
  dataIda: string
  dataVolta: string
  destino: string
  localSaida?: string
  capacidade: number
  veiculoTipo: string
  status: ExcursaoStatus
  wizard?: {
    roteiroOficial?: RoteiroOficial
  }
}

type RoteiroOficial = {
  veiculoTipo?: string
  veiculoAutomatico?: boolean
  manualVehicleOverride?: boolean
  hotelPrincipal?: string
  atracoes: string[]
  passeios: string[]
  parquesAquaticos: string[]
  hoteis?: RoteiroCard[]
  atracoesCards?: RoteiroCard[]
  passeiosCards?: RoteiroCard[]
  parquesAquaticosCards?: RoteiroCard[]
  notas?: string
}

type RoteiroCard = {
  id: string
  titulo: string
  descricaoBreve?: string
  galeriaImagens: string[]
  galeriaVideos: string[]
  precoPorPessoa?: number
  duracaoHoras?: number
  horarioSaida?: string
  diasDisponiveis?: string[]
  badgeTipo?: "ia" | "popular"
}

type SugestaoRoteiro = {
  id: string
  nomeAutor: string
  categoria: "veiculo" | "hotel" | "atracao" | "passeio" | "parque" | "outro"
  valor: string
  descricao?: string
  status: "PENDENTE" | "APROVADA" | "REJEITADA"
  publishedForVoting?: boolean
}

type VotacaoRoteiroItem = {
  id: string
  categoria: "veiculo" | "hotel" | "atracao" | "passeio" | "parque" | "outro"
  valor: string
  votos: number
}

function getCurrentUser() {
  const existingId = localStorage.getItem("rsv_user_id")
  const existingName = localStorage.getItem("rsv_user_name")
  const userId = existingId || `u-${Math.random().toString(36).slice(2, 10)}`
  const nome = existingName || "Convidado"
  localStorage.setItem("rsv_user_id", userId)
  localStorage.setItem("rsv_user_name", nome)
  return { userId, nome }
}

const SAVINGS_COMPARISON = [
  { item: "Hospedagem (4 noites)", individual: 1800, group: 1156, icon: Hotel },
  { item: "Hot Park (ingresso)", individual: 756, group: 556, icon: Ticket },
  { item: "Transfer Aeroporto", individual: 400, group: 200, icon: Plane },
  { item: "Jantar Regional", individual: 356, group: 240, icon: UtensilsCrossed },
  { item: "City Tour Guiado", individual: 280, group: 160, icon: Map },
]

function getPerPersonPrice(base: number, groupSize: number): number {
  if (groupSize >= 8) return Math.round(base * 0.8)
  if (groupSize >= 6) return Math.round(base * 0.88)
  if (groupSize >= 5) return Math.round(base * 0.93)
  return base
}

export default function ViagensGrupoPage() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [showTyping, setShowTyping] = useState(false)
  const [showAssistant, setShowAssistant] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [activePrimaryTab, setActivePrimaryTab] = useState(0)
  const [votes, setVotes] = useState([3, 2, 1])
  const [hasVoted, setHasVoted] = useState(false)
  const [showNotification, setShowNotification] = useState(true)
  const [expandedTimeline, setExpandedTimeline] = useState<number | null>(2)
  const [showCostSplit, setShowCostSplit] = useState(false)
  const [selectedItinerary, setSelectedItinerary] = useState(0)
  const [showSavings, setShowSavings] = useState(false)
  const [animatedSavings, setAnimatedSavings] = useState(0)
  const [groupSize, setGroupSize] = useState(4)
  const [voteAnimating, setVoteAnimating] = useState<number | null>(null)
  const [itineraryApplied, setItineraryApplied] = useState(false)

  const [plannerStepIdx, setPlannerStepIdx] = useState(0)
  const [plannerAnswers, setPlannerAnswers] = useState<Record<string, string>>({})
  const [plannerHistory, setPlannerHistory] = useState<{ role: "ai" | "user"; text: string }[]>([])
  const [plannerDone, setPlannerDone] = useState(false)
  const [plannerTyping, setPlannerTyping] = useState(true)
  const [showOldCards, setShowOldCards] = useState(false)
  const plannerChatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (plannerStepIdx === 0 && plannerHistory.length === 0) {
      const timer = setTimeout(() => {
        setPlannerHistory([{ role: "ai", text: PLANNER_FLOW[0].aiMessage }])
        setPlannerTyping(false)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    plannerChatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [plannerHistory, plannerTyping])
  const chatRef = useRef<HTMLDivElement>(null)
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastActivityRef = useRef(Date.now())
  const contextRef = useRef({ groupSize: 4, adicionaisSelecionados: { cafe: true, roupaCama: false, ingressosParque: true }, excursao: null as Excursao | null })

  const [wizardStep, setWizardStep] = useState<"onde" | "como" | "conforto" | "quem">("onde")
  const [localSaida, setLocalSaida] = useState("Goiânia - Rodoviária Central")
  const [destinoFinal, setDestinoFinal] = useState("Caldas Novas - Hot Park")
  const [atracoesSelecionadas, setAtracoesSelecionadas] = useState<string[]>([])
  const [adicionaisSelecionados, setAdicionaisSelecionados] = useState({
    cafe: true,
    roupaCama: false,
    ingressosParque: true,
  })
  const [passageiros, setPassageiros] = useState<{ nome: string; contato: string; rg?: string; cpf?: string }[]>([
    { nome: "Você", contato: "WhatsApp principal" },
    { nome: "Cate Plotar", contato: "64 99999-0001" },
  ])
  const [novoPassageiroNome, setNovoPassageiroNome] = useState("")
  const [novoPassageiroContato, setNovoPassageiroContato] = useState("")
  const [novoPassageiroRg, setNovoPassageiroRg] = useState("")
  const [novoPassageiroCpf, setNovoPassageiroCpf] = useState("")
  const [wizardSaving, setWizardSaving] = useState(false)
  const [wizardSaved, setWizardSaved] = useState(false)
  const [wizardError, setWizardError] = useState<string | null>(null)
  const [linkCopiedId, setLinkCopiedId] = useState<string | null>(null)
  const [aceiteTermos, setAceiteTermos] = useState(false)
  const [reservaExpiracaoByIdx, setReservaExpiracaoByIdx] = useState<Record<number, string>>({})
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null)
  const [selectedCheckIn, setSelectedCheckIn] = useState("2026-03-12")
  const [selectedCheckOut, setSelectedCheckOut] = useState("2026-03-15")
  const [inviteCode, setInviteCode] = useState("RSV-DEMO")
  const [inviteLink, setInviteLink] = useState("")
  const [agendaSlots, setAgendaSlots] = useState<TimeSlot[]>([])
  const [isAdminRoteiro, setIsAdminRoteiro] = useState(false)
  const [roteiroOficial, setRoteiroOficial] = useState<RoteiroOficial | null>(null)
  const [sugestoesRoteiro, setSugestoesRoteiro] = useState<SugestaoRoteiro[]>([])
  const [votacaoRoteiro, setVotacaoRoteiro] = useState<VotacaoRoteiroItem[]>([])
  const [novaSugestaoCategoria, setNovaSugestaoCategoria] = useState<"veiculo" | "hotel" | "atracao" | "passeio" | "parque" | "outro">("atracao")
  const [novaSugestaoValor, setNovaSugestaoValor] = useState("")
  const [novaSugestaoDescricao, setNovaSugestaoDescricao] = useState("")

  const ADICIONAIS_CONFORTO = [
    { id: "cafe", label: "Café da manhã incluso", preco: 35, fomo: "Últimas 8 vagas para este adicional", key: "cafe" as const },
    { id: "roupaCama", label: "Roupa de cama extra", preco: 20, fomo: null, key: "roupaCama" as const },
    { id: "ingressosParque", label: "Ingressos Hot Park/DiRoma", preco: 129, fomo: "Últimas 12 vagas com desconto", key: "ingressosParque" as const },
  ]
  const HOTEL_OPTIONS = sortByMarginAndScore([
    { id: "termas", nome: "Resort Termas Paradise", precoNoite: 289, imagem: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=900&auto=format&fit=crop", recommended: true, highMargin: true, margin: 190, score: 9 },
    { id: "lago-azul", nome: "Hotel Lago Azul", precoNoite: 219, imagem: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=900&auto=format&fit=crop", margin: 120, score: 8 },
    { id: "recanto", nome: "Pousada Recanto", precoNoite: 179, imagem: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=900&auto=format&fit=crop", margin: 85, score: 7 },
  ])

  const { user, isLoading: authLoading } = useAuth()
  const [, setLocation] = useLocation()

  const [, params] = useRoute<{ id: string }>("/viagens-grupo/:id")
  const excursaoIdFromQuery = new URLSearchParams(window.location.search).get("excursao")
  const conviteFromQuery = new URLSearchParams(window.location.search).get("convite")
  const excursaoIdRaw = params?.id ?? excursaoIdFromQuery ?? null
  const [autoExcursaoId, setAutoExcursaoId] = useState<string | null>(null)
  const excursaoId = excursaoIdRaw ?? autoExcursaoId

  useEffect(() => {
    if (excursaoIdRaw || !user) return
    fetch("/api/demo/info")
      .then((r) => r.ok ? r.json() : null)
      .then((data: { excursaoId?: string } | null) => {
        if (data?.excursaoId) {
          setAutoExcursaoId(data.excursaoId)
          fetch("/api/invites/join", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: "auto", userId: user.id, nome: user.nome }),
          }).catch(() => null)
        }
      })
      .catch(() => null)
  }, [excursaoIdRaw, user])

  const { data: meRoleData, isLoading: roleLoading, refetch: refetchRole } = useQuery<{ role: string | null; isAdmin: boolean } | null>({
    queryKey: ["me-role", excursaoId, user?.id],
    enabled: !!excursaoId && !!user,
    retry: false,
    staleTime: 0,
    queryFn: async () => {
      if (!excursaoId || !user) return null
      const res = await fetch(`/api/excursoes/${excursaoId}/me-role`)
      if (!res.ok) return null
      return res.json() as Promise<{ role: string | null; isAdmin: boolean }>
    },
  })

  const memberRole = meRoleData?.role ?? null

  const [gateInviteCode, setGateInviteCode] = useState("")
  const [gateError, setGateError] = useState<string | null>(null)

  useEffect(() => {
    if (conviteFromQuery && !gateInviteCode) {
      setGateInviteCode(conviteFromQuery)
    }
  }, [conviteFromQuery])

  const joinMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await fetch("/api/invites/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, userId: user!.id, nome: user!.nome }),
      })
      const data = (await res.json()) as { ok?: boolean; reason?: string; excursaoId?: string }
      if (!res.ok || !data.ok) throw new Error(data.reason ?? "Código inválido ou expirado")
      return data
    },
    onSuccess: (data) => {
      setGateError(null)
      const targetId = data.excursaoId ?? excursaoId
      if (targetId) {
        setLocation(`/viagens-grupo?excursao=${targetId}`)
      } else {
        void refetchRole()
      }
    },
    onError: (err: Error) => {
      setGateError(err.message)
    },
  })

  const requestMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/excursoes/${excursaoId}/solicitar-participacao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user!.id, nome: user!.nome }),
      })
      const data = (await res.json()) as { ok?: boolean }
      if (!res.ok) throw new Error("Não foi possível solicitar participação")
      return data
    },
    onSuccess: () => {
      void refetchRole()
    },
    onError: () => {
      toast({ title: "Erro", description: "Não foi possível solicitar participação.", variant: "destructive" })
    },
  })

  const { data: excursao } = useQuery<Excursao | null>({
    queryKey: ["excursao-grupo", excursaoId],
    enabled: !!excursaoId,
    queryFn: async () => {
      if (!excursaoId) return null
      const res = await fetch(`/api/excursoes/${excursaoId}`)
      if (res.status === 404) return null
      if (!res.ok) throw new Error("Erro ao carregar excursão")
      return (await res.json()) as Excursao
    },
  })

  const { data: atividadesWizardData, isLoading: atividadesLoading, isError: atividadesError } = useQuery<{ items: AtividadeWizard[] }>({
    queryKey: ["/api/atividades-wizard"],
    queryFn: async () => {
      const res = await fetch("/api/atividades-wizard")
      if (!res.ok) throw new Error("Erro ao carregar atividades")
      return res.json()
    },
  })
  const atividadesWizard = atividadesWizardData?.items ?? []
  useEffect(() => {
    if (!excursaoId) return
    const base = `${window.location.origin}/join?code=`
    fetch(`/api/excursoes/${excursaoId}/invites`, { method: "POST", headers: { "Content-Type": "application/json" } })
      .then((res) => res.ok ? res.json() : null)
      .then((data: { invite?: { code?: string }; joinUrl?: string } | null) => {
        if (!data) return
        const code = data.invite?.code ?? "RSV-DEMO"
        setInviteCode(code)
        setInviteLink(data.joinUrl ?? `${base}${encodeURIComponent(code)}`)
      })
      .catch(() => {
        setInviteCode("RSV-DEMO")
        setInviteLink(`${base}RSV-DEMO`)
      })
  }, [excursaoId])

  useEffect(() => {
    setIsAdminRoteiro(meRoleData?.isAdmin ?? false)
  }, [meRoleData])

  useEffect(() => {
    if (!excursaoId) {
      setVotacaoRoteiro((prev) => prev.length > 0 ? prev : [
        { id: "demo-1", categoria: "hotel", valor: "Resort Termas Paradise", votos: 5 },
        { id: "demo-2", categoria: "atracao", valor: "Hot Park — dia inteiro", votos: 3 },
        { id: "demo-3", categoria: "passeio", valor: "City Tour + Almoço Regional", votos: 2 },
      ])
      return
    }
    fetch(`/api/excursoes/${excursaoId}/roteiro`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { roteiro?: RoteiroOficial } | null) => {
        if (data?.roteiro) setRoteiroOficial(data.roteiro)
      })
      .catch(() => null)

    fetch(`/api/excursoes/${excursaoId}/votacao-roteiro`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { items?: VotacaoRoteiroItem[] } | null) => {
        setVotacaoRoteiro(data?.items ?? [])
      })
      .catch(() => setVotacaoRoteiro([]))
  }, [excursaoId])

  const refreshSugestoesRoteiro = async () => {
    if (!excursaoId || !isAdminRoteiro) return
    const res = await fetch(`/api/excursoes/${excursaoId}/sugestoes-roteiro`, {
      headers: {
        "x-user-id": user?.id ?? "",
        "x-user-name": user?.nome ?? "",
      },
    })
    if (!res.ok) return
    const data = (await res.json()) as { items?: SugestaoRoteiro[] }
    setSugestoesRoteiro(data.items ?? [])
  }

  useEffect(() => {
    void refreshSugestoesRoteiro()
  }, [isAdminRoteiro])

  const handleEnviarSugestaoRoteiro = async () => {
    if (!novaSugestaoValor.trim()) return
    if (excursaoId) {
      const res = await fetch(`/api/excursoes/${excursaoId}/sugestoes-roteiro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user?.id ?? "",
          "x-user-name": user?.nome ?? "",
        },
        body: JSON.stringify({
          categoria: novaSugestaoCategoria,
          valor: novaSugestaoValor.trim(),
          descricao: novaSugestaoDescricao.trim() || undefined,
        }),
      })
      if (!res.ok) {
        toast({ title: "Sugestão não enviada", description: "Verifique se você está aprovado no grupo.", variant: "destructive" })
        return
      }
    } else {
      const novaSugestao: SugestaoRoteiro = {
        id: `demo-${Date.now()}`,
        nomeAutor: user?.nome ?? "Você",
        categoria: novaSugestaoCategoria,
        valor: novaSugestaoValor.trim(),
        descricao: novaSugestaoDescricao.trim() || undefined,
        status: "PENDENTE",
      }
      setSugestoesRoteiro((prev) => [...prev, novaSugestao])
    }
    setNovaSugestaoValor("")
    setNovaSugestaoDescricao("")
    toast({ title: "Sugestão enviada", description: "O admin vai analisar e publicar para votação." })
  }

  const handleModerarSugestao = async (sugestaoId: string, newStatus: "APROVADA" | "REJEITADA", publishForVoting: boolean) => {
    if (!excursaoId) {
      setSugestoesRoteiro((prev) => prev.map((s) => s.id === sugestaoId ? { ...s, status: newStatus, publishedForVoting: publishForVoting } : s))
      if (publishForVoting) {
        const sugestao = sugestoesRoteiro.find((s) => s.id === sugestaoId)
        if (sugestao) {
          setVotacaoRoteiro((prev) => [...prev, { id: `vote-${sugestaoId}`, categoria: sugestao.categoria, valor: sugestao.valor, votos: 0 }])
        }
      }
      toast({ title: newStatus === "APROVADA" ? "Sugestão aprovada" : "Sugestão reprovada" })
      return
    }
    const res = await fetch(`/api/excursoes/${excursaoId}/sugestoes-roteiro/${encodeURIComponent(sugestaoId)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": user?.id ?? "",
        "x-user-name": user?.nome ?? "",
      },
      body: JSON.stringify({ status: newStatus, publishForVoting }),
    })
    if (!res.ok) {
      toast({ title: "Falha na moderação", description: "Não foi possível atualizar a sugestão.", variant: "destructive" })
      return
    }
    await refreshSugestoesRoteiro()
    const voteRes = await fetch(`/api/excursoes/${excursaoId}/votacao-roteiro`)
    if (voteRes.ok) {
      const voteData = (await voteRes.json()) as { items?: VotacaoRoteiroItem[] }
      setVotacaoRoteiro(voteData.items ?? [])
    }
  }

  const handleVotarRoteiro = async (itemId: string) => {
    if (!excursaoId) {
      setVotacaoRoteiro((prev) =>
        prev.map((item) => item.id === itemId ? { ...item, votos: item.votos + 1 } : item)
      )
      toast({ title: "Voto registrado", description: "Seu voto foi computado com sucesso." })
      return
    }
    const res = await fetch(`/api/excursoes/${excursaoId}/votacao-roteiro`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": user?.id ?? "",
        "x-user-name": user?.nome ?? "",
      },
      body: JSON.stringify({ itemId }),
    })
    if (!res.ok) return
    const data = (await res.json()) as { items?: VotacaoRoteiroItem[] }
    setVotacaoRoteiro(data.items ?? [])
  }

  const renderRoteiroCards = (cards: RoteiroCard[] | undefined, emptyText: string, testId: string, categoria: RoteiroActivityCategoria) => {
    if (!cards || cards.length === 0) {
      return <div style={{ fontSize: 12, color: "#6B7280" }}>{emptyText}</div>
    }
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8 }} data-testid={testId}>
        {cards.map((card) => (
          <RoteiroActivityCard
            key={card.id}
            id={card.id}
            titulo={card.titulo}
            descricaoBreve={card.descricaoBreve}
            galeriaImagens={card.galeriaImagens}
            galeriaVideos={card.galeriaVideos}
            categoria={categoria}
            precoPorPessoa={card.precoPorPessoa}
            duracaoHoras={card.duracaoHoras}
            horarioSaida={card.horarioSaida}
            diasDisponiveis={card.diasDisponiveis}
            badgeTipo={card.badgeTipo}
            dataTestId={testId}
          />
        ))}
      </div>
    )
  }

  contextRef.current = { groupSize, adicionaisSelecionados, excursao: excursao ?? null }

  const CONCIERGE_UPSELL_MESSAGES: Omit<ChatMessage, "id" | "time">[] = [
    {
      sender: "CaldasAI",
      text: "Incluir café da manhã no pacote sai mais em conta e todo o grupo começa o dia bem. As vagas com essa condição são limitadas.",
      isMe: false,
      isBot: true,
      card: {
        type: "attraction",
        title: "Café da manhã incluso - Grupo",
        subtitle: "Resort Termas - Buffet completo",
        price: "R$ 35/pessoa",
        oldPrice: "R$ 55",
        discount: "-36%",
        cta: "Incluir no pacote",
      },
    },
    {
      sender: "CaldasAI",
      text: "Os ingressos dos parques em grupo saem com desconto. Restam poucas vagas no combo Hot Park + DiRoma neste preço.",
      isMe: false,
      isBot: true,
      card: {
        type: "attraction",
        title: "Combo 2 parques - Excursão",
        subtitle: "Hot Park + DiRoma - Vagas limitadas",
        price: "R$ 129/pessoa",
        oldPrice: "R$ 199",
        discount: "-35%",
        cta: "Garantir ingressos",
      },
    },
    {
      sender: "CaldasAI",
      text: "Nesta excursão restam poucas vagas no veículo. Quem ainda não fechou pode perder o preço atual quando o grupo completar.",
      isMe: false,
      isBot: true,
    },
  ]

  const scheduleSilenceConcierge = useRef(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
    silenceTimerRef.current = setTimeout(() => {
      lastActivityRef.current = Date.now()
      const ctx = contextRef.current
      const contextoGrupo = {
        groupSize: ctx.groupSize,
        capacidade: ctx.excursao?.capacidade,
        vagasRestantes: ctx.excursao ? ctx.excursao.capacidade - ctx.groupSize : undefined,
        cafeIncluso: ctx.adicionaisSelecionados.cafe,
        ingressosParqueIncluso: ctx.adicionaisSelecionados.ingressosParque,
        roupaCamaIncluso: ctx.adicionaisSelecionados.roupaCama,
      }
      const upsellRegra = obterMensagemUpsell(contextoGrupo)
      const fomo = deveExibirFomoEscassez(contextoGrupo) ? " " + obterFraseUrgencia() : ""
      let template: Omit<ChatMessage, "id" | "time">
      if (upsellRegra) {
        template = {
          sender: "CaldasAI",
          text: upsellRegra.texto + fomo,
          isMe: false,
          isBot: true,
          card: upsellRegra.preco
            ? {
                type: "attraction" as const,
                title: upsellRegra.titulo ?? "Oferta Especial",
                subtitle: "Vagas limitadas",
                price: `R$ ${upsellRegra.preco}`,
                oldPrice: upsellRegra.precoAntigo ? `R$ ${upsellRegra.precoAntigo}` : undefined,
                discount: upsellRegra.desconto ? `${upsellRegra.desconto}%` : undefined,
                cta: upsellRegra.cta ?? "Ver oferta",
              }
            : undefined,
        }
      } else {
        template = CONCIERGE_UPSELL_MESSAGES[Math.floor(Math.random() * CONCIERGE_UPSELL_MESSAGES.length)]
        if (fomo) template = { ...template, text: template.text + fomo }
      }
      const conciergeMsg: ChatMessage = {
        ...template,
        id: Date.now(),
        time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        card: template.card ? { ...template.card } : undefined,
      }
      setMessages((prev) => [...prev, conciergeMsg])
      scheduleSilenceConcierge.current()
    }, 120000)
  })

  useEffect(() => {
    scheduleSilenceConcierge.current()
    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!excursao) return
    if (excursao.localSaida) setLocalSaida(excursao.localSaida)
    if (excursao.destino) setDestinoFinal(excursao.destino)
    if (excursao.capacidade) {
      const sugestao = Math.min(excursao.capacidade, Math.max(4, Math.round(excursao.capacidade * 0.6)))
      setGroupSize(sugestao)
    }
    if (excursao.dataIda) setSelectedCheckIn(excursao.dataIda)
    if (excursao.dataVolta) setSelectedCheckOut(excursao.dataVolta)
  }, [excursao])

  useEffect(() => {
    const timer1 = setTimeout(() => setShowTyping(true), 4000)
    const timer2 = setTimeout(() => {
      setShowTyping(false)
      const botMsg: ChatMessage = {
        id: 11,
        sender: "CaldasAI",
        text: "Com base no perfil do grupo, esta hospedagem em Caldas Novas combina bem com o roteiro e o orçamento:",
        time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        isMe: false,
        isBot: true,
        card: {
          type: "hotel",
          title: "Pousada Recanto das Águas",
          subtitle: "Caldas Novas - Nota 9.2",
          price: "R$ 199/noite",
          oldPrice: "R$ 320",
          discount: "-38%",
          cta: "Reservar com desconto",
        },
      }
      lastActivityRef.current = Date.now()
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
      scheduleSilenceConcierge.current()
      setMessages(prev => [...prev, botMsg])
    }, 7000)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, showTyping])

  useEffect(() => {
    if (showNotification) {
      const t = setTimeout(() => setShowNotification(false), 5000)
      return () => clearTimeout(t)
    }
  }, [showNotification])

  useEffect(() => {
    if (!excursaoId) return
    return subscribeExcursao(excursaoId, {
      onPixExpirado: (data) => {
        toast({
          title: "Pix expirando",
          description: String(data.message ?? "Pix prestes a expirar"),
          variant: "destructive",
        })
      },
      onVigilancia: (data) => {
        toast({
          title: String(data.tipo) === "crianca" ? "Vigilância: criança" : "Vigilância: idoso",
          description: String(data.message ?? ""),
          variant: "default",
        })
      },
      onEstadoGrupo: (dataUnknown) => {
        const data = dataUnknown as { votacao?: number[]; passageirosCount?: number; passageiros?: { nome: string; contato: string; rg?: string; cpf?: string }[]; listaEspera?: unknown }
        if (Array.isArray(data.votacao) && data.votacao.length > 0) {
          setVotes(data.votacao)
        }
        if (Array.isArray(data.passageiros)) {
          const normalized = data.passageiros.map((p) => ({
            nome: typeof p?.nome === "string" ? p.nome : "",
            contato: typeof p?.contato === "string" ? p.contato : "",
            rg: typeof p?.rg === "string" ? p.rg : undefined,
            cpf: typeof p?.cpf === "string" ? p.cpf : undefined,
          }))
          setPassageiros(normalized)
        }
      },
      onAiIntervention: (data) => {
        if (data.mensagem) {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              sender: "CaldasAI",
              text: String(data.mensagem),
              time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
              isMe: false,
              isBot: true,
              isAiIntervention: true,
            } as ChatMessage,
          ])
        }
      },
    })
  }, [excursaoId])

  useEffect(() => {
    if (showSavings) {
      const target = SAVINGS_COMPARISON.reduce((sum, s) => sum + (s.individual - s.group), 0)
      let current = 0
      const step = Math.ceil(target / 30)
      const interval = setInterval(() => {
        current += step
        if (current >= target) {
          current = target
          clearInterval(interval)
        }
        setAnimatedSavings(current)
      }, 40)
      return () => clearInterval(interval)
    }
  }, [showSavings])

  const handleSend = () => {
    if (!message.trim()) return
    lastActivityRef.current = Date.now()
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
    scheduleSilenceConcierge.current()
    const newMsg: ChatMessage = {
      id: Date.now(),
      sender: "Você",
      text: message,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
      isOrganizer: true,
    }
    setMessages(prev => [...prev, newMsg])
    const userText = message.toLowerCase()
    setMessage("")

    setTimeout(() => setShowTyping(true), 800)
    setTimeout(() => {
      setShowTyping(false)
      let responseTemplate: ChatMessage
      const isMapaAssentos =
        userText.includes("mapa de assentos") ||
        userText.includes("mapa de assento") ||
        userText.includes("onde sentar") ||
        userText.includes("qual meu assento") ||
        (userText.includes("assentos") && (userText.includes("ônibus") || userText.includes("onibus") || userText.includes("lugar")))
      if (isMapaAssentos) {
        responseTemplate = { ...BOT_RESPONSES.mapaAssentos }
      } else if (
        userText.includes("urgência") ||
        userText.includes("urgente") ||
        userText.includes("rápido") ||
        userText.includes("rapido") ||
        userText.includes("prazo") && (userText.includes("pagamento") || userText.includes("pagar") || userText.includes("fechar")) ||
        userText.includes("tempo") && (userText.includes("limite") || userText.includes("fechar"))
      ) {
        responseTemplate = { ...BOT_RESPONSES.urgencia }
      } else if (userText.includes("hotel") || userText.includes("hospedagem") || userText.includes("pousada")) {
        responseTemplate = { ...BOT_RESPONSES.hotel }
      } else if (
        userText.includes("restaurante") ||
        userText.includes("jantar") ||
        userText.includes("comer") ||
        userText.includes("almoço")
      ) {
        responseTemplate = { ...BOT_RESPONSES.restaurante }
      } else if (userText.includes("parque") || userText.includes("aquático")) {
        responseTemplate = { ...BOT_RESPONSES.parque }
      } else if (userText.includes("spa") || userText.includes("massagem")) {
        responseTemplate = { ...BOT_RESPONSES.spa }
      } else if (userText.includes("ingresso") || userText.includes("parques")) {
        responseTemplate = { ...BOT_RESPONSES.ingresso }
      } else if (userText.includes("transfer") || userText.includes("van") || userText.includes("aeroporto")) {
        responseTemplate = { ...BOT_RESPONSES.transfer }
      } else {
        responseTemplate = { ...BOT_RESPONSES.default }
      }
      responseTemplate.id = Date.now() + 1
      responseTemplate.time = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      if (responseTemplate.card) {
        responseTemplate.card = { ...responseTemplate.card }
      }
      lastActivityRef.current = Date.now()
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
      scheduleSilenceConcierge.current()
      setMessages(prev => [...prev, responseTemplate])
    }, 2500)
  }

  const handleVote = (idx: number) => {
    if (hasVoted || voteAnimating !== null) return
    const newVotes = votes.map((v, i) => (i === idx ? v + 1 : v))
    setVotes(newVotes)
    setHasVoted(true)
    setVoteAnimating(idx)
    setTimeout(() => setVoteAnimating(null), 1200)
    if (excursaoId) {
      socketEmit("atualizar-estado-grupo", { excursaoId, votacao: newVotes })
    }
  }

  const totalVotes = votes.reduce((a, b) => a + b, 0)

  const totalGroupCost = 2312
  const extrasAdicionais =
    (adicionaisSelecionados.cafe ? 35 : 0) * groupSize +
    (adicionaisSelecionados.roupaCama ? 20 : 0) * groupSize +
    (adicionaisSelecionados.ingressosParque ? 129 : 0) * groupSize
  const valorTotalBarra = totalGroupCost + extrasAdicionais
  const valorPorPessoaBarra = groupSize > 0 ? Math.round(valorTotalBarra / groupSize) : 0
  const perPersonCost = Math.round(totalGroupCost / groupSize)
  const totalIndividual = SAVINGS_COMPARISON.reduce((sum, s) => sum + s.individual, 0)
  const totalGroup = SAVINGS_COMPARISON.reduce((sum, s) => sum + s.group, 0)
  const totalSaved = totalIndividual - totalGroup

  const whatsappInvite = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    "Junte-se ao nosso grupo de viagem para Caldas Novas! Reserve pelo RSV360 e ganhe descontos exclusivos para grupos!",
  )}`

  const appliedItinerary = AI_ITINERARIES[selectedItinerary]

  const discountLabel =
    groupSize >= 8 ? "Desconto grupo 8+ (-20%)" : groupSize >= 6 ? "Desconto grupo 6+ (-12%)" : groupSize >= 5 ? "Grupo 5+ (-7%)" : "Grupo base"

  const appliedPerPerson = getPerPersonPrice(appliedItinerary.basePP, groupSize)

  const progressPercent = (() => {
    const done = TIMELINE.filter(t => t.status === "done").length
    const current = TIMELINE.filter(t => t.status === "current").length
    const total = TIMELINE.length
    return Math.round(((done + current * 0.5) / total) * 100)
  })()

  const handleSaveWizard = async () => {
    if (!excursaoId) return
    try {
      setWizardSaving(true)
      setWizardError(null)
      const res = await fetch(`/api/excursoes/${excursaoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          localSaida,
          destino: destinoFinal,
          wizard: {
            onde: { localSaida, destinoFinal },
            como: { atracoes: atracoesSelecionadas },
            conforto: {
              cafe: adicionaisSelecionados.cafe,
              roupaCama: adicionaisSelecionados.roupaCama,
              ingressosParque: adicionaisSelecionados.ingressosParque,
            },
            quem: { passageiros },
          },
        }),
      })
      if (!res.ok) {
        throw new Error("Erro ao salvar wizard")
      }
      setWizardSaved(true)
      setTimeout(() => setWizardSaved(false), 4000)
    } catch {
      setWizardError("Não foi possível salvar o resumo do grupo agora.")
    } finally {
      setWizardSaving(false)
    }
  }

  const gateBackUrl = excursaoIdFromQuery ? "/catalogo-excursoes" : "/excursoes"

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Verificando acesso...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    const returnUrl = excursaoIdFromQuery
      ? conviteFromQuery
        ? `/viagens-grupo?excursao=${excursaoIdFromQuery}&convite=${conviteFromQuery}`
        : `/viagens-grupo?excursao=${excursaoIdFromQuery}`
      : "/viagens-grupo"

    if (excursaoIdFromQuery && conviteFromQuery) {
      const excInfo = GATE_EXCURSAO_INFO[excursaoIdFromQuery]
      const excNome = excInfo ? excInfo.nome : "excursão especial"
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div data-testid="wizard-convite-card" className="bg-white rounded-2xl shadow-lg border-2 border-primary/30 max-w-sm w-full p-8 flex flex-col items-center gap-5 text-center">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
              <Gift className="w-3.5 h-3.5" />
              Você foi convidado!
            </span>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">{excNome}</h2>
              {excInfo && (
                <p className="text-sm text-muted-foreground">
                  {formatGateDate(excInfo.dataPartida)} a {formatGateDate(excInfo.dataRetorno)}
                </p>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Sua vaga está reservada. Apenas confirme sua identidade para entrar.
            </p>
            <Link href={`/entrar?next=${encodeURIComponent(returnUrl)}`} className="w-full">
              <button
                data-testid="btn-wizard-login"
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl px-4 py-3 font-semibold text-sm hover:bg-primary/90 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Entrar na conta
              </button>
            </Link>
            <Link href={`/cadastrar?next=${encodeURIComponent(returnUrl)}`} className="w-full">
              <button
                data-testid="btn-wizard-cadastrar"
                className="w-full flex items-center justify-center gap-2 border-2 border-primary text-primary rounded-xl px-4 py-3 font-semibold text-sm hover:bg-primary/5 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Criar conta grátis
              </button>
            </Link>
            <Link href={gateBackUrl} data-testid="btn-gate-voltar-login" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mt-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Voltar
            </Link>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-border max-w-sm w-full p-8 flex flex-col items-center gap-5 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">Grupo Privado</h2>
            <p className="text-sm text-muted-foreground">
              Este grupo de excursão é privado. Faça login para verificar seu acesso ou entrar com um convite.
            </p>
          </div>
          <Link href={`/entrar?next=${encodeURIComponent(returnUrl)}`} className="w-full">
            <button
              data-testid="btn-gate-login"
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl px-4 py-3 font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Entrar na conta
            </button>
          </Link>
          <Link href="/cadastrar" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            Ainda não tem conta? Cadastre-se
          </Link>
          <Link href={gateBackUrl} data-testid="btn-gate-voltar-login" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mt-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar
          </Link>
        </div>
      </div>
    )
  }

  if (excursaoId && (roleLoading || meRoleData === undefined)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Verificando membros do grupo...</span>
        </div>
      </div>
    )
  }

  if (excursaoId && memberRole === "REJEITADO") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-border max-w-sm w-full p-8 flex flex-col items-center gap-5 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <ShieldX className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">Acesso Negado</h2>
            <p className="text-sm text-muted-foreground">
              O organizador desta excursão não aprovou sua participação. Entre em contato com o organizador para mais informações.
            </p>
          </div>
          <Link href={gateBackUrl} data-testid="btn-gate-voltar-rejeitado" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar
          </Link>
        </div>
      </div>
    )
  }

  if (excursaoId && memberRole === "PENDING") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-border max-w-sm w-full p-8 flex flex-col items-center gap-5 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center">
            <Hourglass className="w-8 h-8 text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground mb-1">Aguardando Aprovação</h2>
            <p className="text-sm text-muted-foreground">
              Sua solicitação para participar desta excursão foi enviada. O organizador precisa aprovar sua entrada.
            </p>
          </div>
          <div className="w-full bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
            Você receberá acesso assim que o organizador aprovar sua participação.
          </div>
          <button
            data-testid="btn-gate-refresh"
            onClick={() => void refetchRole()}
            className="text-sm text-primary hover:underline font-medium"
          >
            Atualizar status
          </button>
          <Link href={gateBackUrl} data-testid="btn-gate-voltar-pending" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mt-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar
          </Link>
        </div>
      </div>
    )
  }

  if (excursaoId && memberRole === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-border max-w-sm w-full p-8 flex flex-col items-center gap-5">
          <div className="w-full flex items-center">
            <Link
              href={gateBackUrl}
              data-testid="btn-gate-voltar-restrita-top"
              className="flex items-center gap-1.5 border border-border rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Link>
          </div>
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground mb-1">Entrada Restrita</h2>
            <p className="text-sm text-muted-foreground">
              Este grupo é privado. Você precisa de um convite ou da aprovação do organizador para participar.
            </p>
          </div>

          <div className="w-full border-t border-border pt-4 flex flex-col gap-3">
            <p className="text-sm font-semibold text-foreground flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-primary" />
              Tenho um código de convite
            </p>
            <input
              data-testid="input-gate-invite-code"
              type="text"
              value={gateInviteCode}
              onChange={(e) => { setGateInviteCode(e.target.value); setGateError(null) }}
              placeholder="Ex: INV-ABCD-123456"
              className="w-full border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 uppercase tracking-wider"
            />
            {gateError && (
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {gateError}
              </div>
            )}
            <button
              data-testid="btn-gate-join-invite"
              disabled={!gateInviteCode.trim() || joinMutation.isPending}
              onClick={() => joinMutation.mutate(gateInviteCode.trim())}
              className="w-full bg-primary text-primary-foreground rounded-xl px-4 py-3 font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {joinMutation.isPending ? "Verificando..." : "Entrar com convite"}
            </button>
          </div>

          <div className="w-full border-t border-border pt-4 flex flex-col gap-3">
            <p className="text-sm font-semibold text-foreground flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-primary" />
              Não tenho convite
            </p>
            <p className="text-xs text-muted-foreground">
              Solicite participação ou fale direto com o organizador pelo WhatsApp.
            </p>
            {(() => {
              const eid = excursaoId ?? excursaoIdFromQuery
              const info = eid ? GATE_EXCURSAO_INFO[eid] : null
              const msgText = info
                ? `Olá! Tenho interesse na excursão "${info.nome}" de ${formatGateDate(info.dataPartida)} a ${formatGateDate(info.dataRetorno)}. Ainda tem vaga?`
                : "Olá! Tenho interesse em uma excursão. Ainda tem vaga?"
              const waUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msgText)}`
              return (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="btn-gate-whatsapp-sem-convite"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl px-4 py-3 font-semibold text-sm transition-colors"
                >
                  <SiWhatsapp className="w-4 h-4" />
                  Falar no WhatsApp
                </a>
              )
            })()}
            <button
              data-testid="btn-gate-request-join"
              disabled={requestMutation.isPending}
              onClick={() => requestMutation.mutate()}
              className="w-full border border-primary text-primary rounded-xl px-4 py-3 font-semibold text-sm hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {requestMutation.isPending ? "Enviando..." : "Solicitar participação"}
            </button>
          </div>

          <Link href={gateBackUrl} data-testid="btn-gate-voltar-restrita" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: "#F9FAFB", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {showNotification && (
        <div
          data-testid="notification-member-joined"
          style={{
            position: "fixed",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
            background: "linear-gradient(135deg, #22C55E, #16A34A)",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 4px 20px rgba(34,197,94,0.4)",
            animation: "slideDown 0.5s ease-out",
            maxWidth: 360,
          }}
        >
          <Bell style={{ width: 16, height: 16 }} />
          Mario confirmou presença no grupo!
        </div>
      )}

      {/* HEADER 1 com wrapper interno */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e3a5f, #2563EB)",
          padding: "14px 16px",
          color: "#fff",
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          {excursaoIdFromQuery ? (
            <Link
              href="/catalogo-excursoes"
              style={{
                color: "#fff",
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 999,
                padding: "6px 12px",
                fontSize: 13,
                textDecoration: "none",
                backdropFilter: "blur(8px)",
              }}
              data-testid="button-voltar-grupo"
            >
              <ArrowLeft style={{ width: 16, height: 16 }} /> Voltar
            </Link>
          ) : (
            <button
              onClick={() => window.history.back()}
              style={{
                color: "#fff",
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 999,
                padding: "6px 12px",
                fontSize: 13,
                cursor: "pointer",
                backdropFilter: "blur(8px)",
              }}
              data-testid="button-voltar-grupo"
            >
              <ArrowLeft style={{ width: 16, height: 16 }} /> Voltar
            </button>
          )}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Excursão em Grupo</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, opacity: 0.85 }}>Saída • Destino • Roteiros • Adicionais</span>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E" }} />
              <span style={{ fontSize: 11, opacity: 0.85 }}>{groupSize} membros online</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", marginRight: 8 }}>
            {MEMBERS.map((m, i) => (
              <div
                key={i}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: m.color,
                  border: "2px solid #1e3a5f",
                  marginLeft: i > 0 ? -10 : 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#fff",
                  zIndex: MEMBERS.length - i,
                  position: "relative",
                }}
              >
                {m.name.charAt(0)}
              </div>
            ))}
          </div>
          <button
            data-testid="button-settings"
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "none",
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Settings style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>

      {/* HEADER 2 com wrapper interno */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e3a5f, #0D47A1)",
          padding: "12px 16px",
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              overflow: "hidden",
              flexShrink: 0,
              background: "linear-gradient(135deg, #2563EB, #1e3a5f)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Hotel style={{ width: 24, height: 24, color: "rgba(255,255,255,0.6)" }} />
          </div>
          <div style={{ flex: 1, color: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
              <span
                style={{
                  background: "rgba(255,255,255,0.15)",
                  padding: "2px 8px",
                  borderRadius: 6,
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                Em Grupo com Amigos
              </span>
              <span
                style={{
                  background: "rgba(34,197,94,0.2)",
                  padding: "2px 8px",
                  borderRadius: 6,
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#86EFAC",
                }}
              >
                {groupSize} pessoas
              </span>
            </div>
            <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Resort Termas Paradise</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
              <MapPin style={{ width: 10, height: 10, opacity: 0.7 }} />
              <span style={{ fontSize: 12, opacity: 0.7 }}>Caldas Novas - 15-19 Mar</span>
            </div>
          </div>
          <button
            data-testid="button-invite"
            onClick={() => window.open(inviteLink || whatsappInvite, "_blank")}
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              border: "none",
              background: "#22C55E",
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <UserPlus style={{ width: 12, height: 12 }} />
            Convidar
          </button>
        </div>
      </div>

      <div style={{ background: "#fff", borderBottom: "2px solid #E5E7EB", padding: "0 16px", position: "sticky", top: 0, zIndex: 30 }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", gap: 0, overflowX: "auto" }}>
          {PRIMARY_TABS.map((tab, i) => {
            const isActive = activePrimaryTab === i
            const TabIcon = tab.icon
            return (
              <button
                key={i}
                data-testid={`primary-tab-${i}`}
                onClick={() => setActivePrimaryTab(i)}
                style={{
                  flex: 1,
                  minWidth: 64,
                  padding: "10px 6px 8px",
                  border: "none",
                  borderBottom: isActive ? "3px solid #2563EB" : "3px solid transparent",
                  background: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  transition: "all 0.2s",
                }}
              >
                <TabIcon style={{ width: 18, height: 18, color: isActive ? "#2563EB" : "#9CA3AF" }} />
                <span style={{ fontSize: 11, fontWeight: isActive ? 700 : 500, color: isActive ? "#2563EB" : "#6B7280" }}>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ overflowY: "auto", flex: 1 }}>

        {activePrimaryTab === 0 && (
        <div style={{ background: "#F3F4F6", padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }}>
          <div style={{ maxWidth: 1400, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Sparkles style={{ width: 18, height: 18, color: "#7C3AED" }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Monte sua excursão</span>
              </div>
              <span style={{ fontSize: 11, color: "#6B7280" }}>Onde → Como → Conforto → Quem</span>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {([
                { id: "onde", label: "Onde?", desc: "Saída e destino" },
                { id: "como", label: "Como?", desc: "Roteiro e atrações" },
                { id: "conforto", label: "Conforto?", desc: "Adicionais" },
                { id: "quem", label: "Quem?", desc: "Passageiros" },
              ] as const).map((step, index) => {
                const isActive = wizardStep === step.id
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setWizardStep(step.id)}
                    style={{
                      flex: 1,
                      minWidth: 140,
                      padding: "8px 10px",
                      borderRadius: 999,
                      border: isActive ? "2px solid #2563EB" : "1px solid #E5E7EB",
                      background: isActive ? "#EEF2FF" : "#FFFFFF",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      justifyContent: "flex-start",
                    }}
                    data-testid={`wizard-step-${step.id}`}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "999px",
                        background: isActive ? "#2563EB" : "#E5E7EB",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {index + 1}
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: isActive ? "#1F2937" : "#4B5563" }}>{step.label}</div>
                      <div style={{ fontSize: 11, color: "#6B7280" }}>{step.desc}</div>
                    </div>
                  </button>
                )
              })}
            </div>

            <div style={{ marginTop: 12, borderRadius: 12, background: "#FFFFFF", padding: 12, boxShadow: "0 4px 12px rgba(15,23,42,0.04)" }}>
              {wizardStep === "onde" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#4B5563", display: "block", marginBottom: 4 }}>Local de saída</label>
                    <select
                      value={localSaida}
                      onChange={(e) => setLocalSaida(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        borderRadius: 10,
                        border: "1px solid #E5E7EB",
                        fontSize: 13,
                      }}
                      data-testid="wizard-onde-saida"
                    >
                      <option>Goiânia - Rodoviária Central</option>
                      <option>Goiânia - Shopping Flamboyant</option>
                      <option>Brasília - Saída Norte</option>
                      <option>Anápolis - Posto BR</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#4B5563", display: "block", marginBottom: 4 }}>Destino final</label>
                    <select
                      value={destinoFinal}
                      onChange={(e) => setDestinoFinal(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        borderRadius: 10,
                        border: "1px solid #E5E7EB",
                        fontSize: 13,
                      }}
                      data-testid="wizard-onde-destino"
                    >
                      <option>Caldas Novas - Hot Park</option>
                      <option>Caldas Novas - DiRoma</option>
                      <option>Rio Quente - Resorts</option>
                    </select>
                  </div>
                </div>
              )}

              {wizardStep === "como" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                  {atividadesLoading ? (
                    <>
                      {[1, 2, 3].map((n) => (
                        <div key={n} style={{ padding: 10, borderRadius: 10, border: "1px solid #E5E7EB", background: "#F9FAFB" }}>
                          <div style={{ height: 16, width: "60%", background: "#E5E7EB", borderRadius: 4, marginBottom: 6 }} />
                          <div style={{ height: 12, width: "80%", background: "#F3F4F6", borderRadius: 4 }} />
                        </div>
                      ))}
                    </>
                  ) : atividadesError ? (
                    <div style={{ padding: 12, borderRadius: 8, background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B", fontSize: 12 }} data-testid="wizard-atividades-error">
                      Não foi possível carregar as atividades. Tente novamente mais tarde.
                    </div>
                  ) : (
                    (atividadesWizard.length > 0 ? atividadesWizard : ATIVIDADES_FALLBACK).map((a) => {
                      const selected = atracoesSelecionadas.includes(a.id)
                      return (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() =>
                            setAtracoesSelecionadas((prev) =>
                              prev.includes(a.id) ? prev.filter((x) => x !== a.id) : [...prev, a.id],
                            )
                          }
                          style={{
                            textAlign: "left",
                            padding: 10,
                            borderRadius: 10,
                            border: selected ? "2px solid #2563EB" : "1px solid #E5E7EB",
                            background: selected ? "linear-gradient(135deg,#EEF2FF,#DBEAFE)" : "#FFFFFF",
                            cursor: "pointer",
                          }}
                          data-testid={`wizard-como-${a.id}`}
                        >
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{a.label}</div>
                          <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>{a.descricao}</div>
                        </button>
                      )
                    })
                  )}
                </div>
              )}

              {wizardStep === "conforto" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
                  {ADICIONAIS_CONFORTO.map((ad) => {
                    const checked = adicionaisSelecionados[ad.key]
                    return (
                      <button
                        key={ad.id}
                        type="button"
                        onClick={() => setAdicionaisSelecionados((prev) => ({ ...prev, [ad.key]: !checked }))}
                        style={{
                          textAlign: "left",
                          padding: 12,
                          borderRadius: 12,
                          border: checked ? "2px solid #2563EB" : "1px solid #E5E7EB",
                          background: checked ? "linear-gradient(135deg,#EEF2FF,#DBEAFE)" : "#FFFFFF",
                          cursor: "pointer",
                          position: "relative",
                        }}
                        data-testid={`wizard-conforto-${ad.id}`}
                      >
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <input
                            type="checkbox"
                            checked={checked}
                            readOnly
                            style={{ marginTop: 2 }}
                          />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{ad.label}</div>
                            <div style={{ fontSize: 15, fontWeight: 800, color: "#2563EB", marginTop: 4 }}>
                              R$ {ad.preco}/pessoa
                            </div>
                            {ad.fomo && (
                              <span
                                style={{
                                  display: "inline-block",
                                  marginTop: 6,
                                  fontSize: 11,
                                  fontWeight: 600,
                                  color: "#D97706",
                                  padding: "2px 6px",
                                  borderRadius: 6,
                                  background: "rgba(245,158,11,0.15)",
                                }}
                              >
                                {ad.fomo}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}

              {wizardStep === "quem" && (
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.4fr) minmax(0,1fr)", gap: 12 }}>
                  <div>
                    <details style={{ marginBottom: 12, borderRadius: 8, border: "1px solid #E5E7EB", overflow: "hidden" }}>
                      <summary style={{ padding: "8px 12px", fontSize: 12, fontWeight: 600, color: "#4B5563", cursor: "pointer" }}>
                        Termo de responsabilidade (Excursão Caldas Novas)
                      </summary>
                      <pre style={{ margin: 0, padding: 12, fontSize: 11, color: "#374151", whiteSpace: "pre-wrap", fontFamily: "inherit", maxHeight: 200, overflowY: "auto" }}>
                        {TEXTO_TERMO_EXCURSAO_CALDAS}
                      </pre>
                    </details>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, fontSize: 13, cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        id="aceite-termos"
                        checked={aceiteTermos}
                        onChange={(e) => setAceiteTermos(e.target.checked)}
                        data-testid="aceite-termos"
                      />
                      <span>Li e aceito o termo de responsabilidade</span>
                    </label>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#4B5563", marginBottom: 4 }}>Passageiros e link de pagamento</div>
                    <div style={{ borderRadius: 8, border: "1px solid #E5E7EB", padding: 8, maxHeight: 220, overflowY: "auto" }}>
                      {passageiros.map((p, idx) => {
                        const linkMock = `https://pay.rsv360.com/mock/${excursaoId || "grupo"}/${encodeURIComponent(p.nome)}?valor=578`
                        const copyId = `link-${idx}-${p.nome}`
                        return (
                          <div
                            key={`${p.nome}-${idx}`}
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: 8,
                              padding: "8px 0",
                              borderBottom: idx < passageiros.length - 1 ? "1px solid #F3F4F6" : "none",
                              fontSize: 12,
                            }}
                            data-testid={`wizard-quem-passageiro-${idx}`}
                          >
                            <div>
                              <span style={{ fontWeight: 600, color: "#111827" }}>{p.nome}</span>
                              <span style={{ color: "#6B7280", marginLeft: 6 }}>{p.contato}</span>
                              {reservaExpiracaoByIdx[idx] && (
                                <div style={{ marginTop: 4 }}>
                                  <CountdownTimer
                                    endDate={new Date(reservaExpiracaoByIdx[idx])}
                                    label="Pix expira em"
                                  />
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              disabled={!aceiteTermos}
                              onClick={async () => {
                                if (!aceiteTermos) return
                                if (excursaoId) {
                                  try {
                                    const res = await fetch(`/api/excursoes/${excursaoId}/reservas`, {
                                      method: "POST",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({
                                        passageiroId: String(idx),
                                        passageiroNome: p.nome,
                                        aceitouTermos: true,
                                        termoVersao: TERMO_VERSAO,
                                      }),
                                    })
                                    if (res.ok) {
                                      const data = await res.json()
                                      if (data.dataExpiracaoPix) {
                                        setReservaExpiracaoByIdx((prev) => ({ ...prev, [idx]: data.dataExpiracaoPix }))
                                      }
                                    }
                                  } catch {
                                    // fallback: copy link without API
                                  }
                                }
                                navigator.clipboard.writeText(linkMock).then(() => {
                                  setLinkCopiedId(copyId)
                                  setTimeout(() => setLinkCopiedId(null), 2000)
                                })
                              }}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                padding: "4px 8px",
                                borderRadius: 8,
                                border: "1px solid " + (aceiteTermos ? "#22C55E" : "#D1D5DB"),
                                background: !aceiteTermos ? "#F3F4F6" : linkCopiedId === copyId ? "#DCFCE7" : "#F0FDF4",
                                color: !aceiteTermos ? "#9CA3AF" : "#16A34A",
                                fontSize: 11,
                                fontWeight: 600,
                                cursor: aceiteTermos ? "pointer" : "not-allowed",
                              }}
                              data-testid={`wizard-quem-link-pagamento-${idx}`}
                            >
                              {linkCopiedId === copyId ? (
                                <>Copiado!</>
                              ) : !aceiteTermos ? (
                                <>Aceite o termo</>
                              ) : (
                                <>
                                  <Copy style={{ width: 12, height: 12 }} />
                                  Link Pix
                                </>
                              )}
                            </button>
                          </div>
                        )
                      })}
                      {passageiros.length === 0 && <div style={{ fontSize: 12, color: "#9CA3AF" }}>Nenhum passageiro adicionado ainda.</div>}
                    </div>
                    <p style={{ fontSize: 11, color: "#6B7280", marginTop: 6 }}>
                      Cada passageiro recebe um link exclusivo para pagamento (Pix). Em produção, integração com Mercado Pago ou gateway.
                    </p>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#4B5563", marginBottom: 4 }}>Adicionar passageiro</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <input
                        type="text"
                        placeholder="Nome"
                        value={novoPassageiroNome}
                        onChange={(e) => setNovoPassageiroNome(e.target.value)}
                        style={{ padding: "6px 8px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 13 }}
                      />
                      <input
                        type="text"
                        placeholder="Contato (WhatsApp)"
                        value={novoPassageiroContato}
                        onChange={(e) => setNovoPassageiroContato(e.target.value)}
                        style={{ padding: "6px 8px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 13 }}
                      />
                      <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>
                        Dados documentação (opcional, LGPD — criptografia em implementação)
                      </div>
                      <input
                        type="text"
                        placeholder="RG (opcional)"
                        value={novoPassageiroRg}
                        onChange={(e) => setNovoPassageiroRg(e.target.value)}
                        style={{ padding: "6px 8px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 13 }}
                        data-testid="wizard-quem-rg"
                      />
                      <input
                        type="text"
                        placeholder="CPF (opcional)"
                        value={novoPassageiroCpf}
                        onChange={(e) => setNovoPassageiroCpf(e.target.value)}
                        style={{ padding: "6px 8px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 13 }}
                        data-testid="wizard-quem-cpf"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!novoPassageiroNome.trim()) return
                          const novoPassageiro = {
                            nome: novoPassageiroNome.trim(),
                            contato: novoPassageiroContato || "WhatsApp",
                            rg: novoPassageiroRg.trim() || undefined,
                            cpf: novoPassageiroCpf.trim() || undefined,
                          }
                          const novaLista = [...passageiros, novoPassageiro]
                          setPassageiros(novaLista)
                          setNovoPassageiroNome("")
                          setNovoPassageiroContato("")
                          setNovoPassageiroRg("")
                          setNovoPassageiroCpf("")
                          if (excursaoId) {
                            socketEmit("atualizar-estado-grupo", { excursaoId, passageirosCount: novaLista.length, passageiros: novaLista })
                          }
                        }}
                        style={{
                          marginTop: 4,
                          padding: "8px 10px",
                          borderRadius: 8,
                          border: "none",
                          background: "#2563EB",
                          color: "#fff",
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                        data-testid="wizard-quem-add"
                      >
                        Adicionar passageiro
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {excursaoId && (
                <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "space-between" }}>
                  <button
                    type="button"
                    onClick={handleSaveWizard}
                    disabled={wizardSaving}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 999,
                      border: "none",
                      background: wizardSaving ? "#93C5FD" : "#2563EB",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: wizardSaving ? "default" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                    data-testid="wizard-salvar-excursao"
                  >
                    <Sparkles style={{ width: 14, height: 14 }} />
                    {wizardSaving ? "Salvando..." : "Salvar grupo nesta excursão"}
                  </button>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 16 }}>
                    {wizardSaved && (
                      <span style={{ fontSize: 11, color: "#16A34A", fontWeight: 600 }}>
                        Resumo do grupo salvo com sucesso.
                      </span>
                    )}
                    {wizardError && (
                      <span style={{ fontSize: 11, color: "#DC2626" }}>
                        {wizardError}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        )}

        {activePrimaryTab === 4 && (
        <div style={{ marginTop: 12, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: 12 }} data-testid="roteiro-governanca-widget">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1F2937" }} data-testid="roteiro-governanca-title">Roteiro oficial da excursão</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>Convidados analisam e sugerem. Admin aprova/reprova e publica para votação.</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: isAdminRoteiro ? "#1D4ED8" : "#6B7280", background: isAdminRoteiro ? "#DBEAFE" : "#F3F4F6", padding: "4px 8px", borderRadius: 999 }} data-testid="roteiro-governanca-role-badge">
              {isAdminRoteiro ? "Modo admin" : "Modo convidado"}
            </span>
          </div>

          <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8 }}>
            <div style={{ border: "1px solid #E5E7EB", borderRadius: 10, padding: 8 }} data-testid="roteiro-governanca-veiculo">
              <div style={{ fontSize: 11, color: "#6B7280" }}>Veículo</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{roteiroOficial?.veiculoTipo || excursao?.veiculoTipo || "A definir"}</div>
            </div>
            <div style={{ border: "1px solid #E5E7EB", borderRadius: 10, padding: 8 }} data-testid="roteiro-governanca-hotel">
              <div style={{ fontSize: 11, color: "#6B7280" }}>Hotel</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{roteiroOficial?.hotelPrincipal || "A definir"}</div>
            </div>
            <div style={{ border: "1px solid #E5E7EB", borderRadius: 10, padding: 8 }} data-testid="roteiro-governanca-atracoes">
              <div style={{ fontSize: 11, color: "#6B7280" }}>Atrações</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{(roteiroOficial?.atracoes || []).join(", ") || "A definir"}</div>
            </div>
          </div>

          <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Cards de hotel</div>
              {renderRoteiroCards(roteiroOficial?.hoteis, "Sem hotel cadastrado em cards.", "roteiro-governanca-hoteis-cards", "hotel")}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Cards de atrações</div>
              {renderRoteiroCards(roteiroOficial?.atracoesCards, "Sem atrações em cards.", "roteiro-governanca-atracoes-cards", "atracao")}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Cards de passeios</div>
              {renderRoteiroCards(roteiroOficial?.passeiosCards, "Sem passeios em cards.", "roteiro-governanca-passeios-cards", "passeio")}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Cards de parques aquáticos</div>
              {renderRoteiroCards(roteiroOficial?.parquesAquaticosCards, "Sem parques em cards.", "roteiro-governanca-parques-cards", "parque")}
            </div>
          </div>

        </div>
        )}

        {activePrimaryTab === 3 && (<>
        <div style={{ background: "#fff", padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }} data-testid="group-info-card">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <MapPin style={{ width: 18, height: 18, color: "#2563EB" }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#1F2937" }}>Informações do Grupo</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 8 }}>
            <div style={{ border: "1px solid #E5E7EB", borderRadius: 10, padding: 10 }}>
              <div style={{ fontSize: 11, color: "#6B7280" }}>Local de saída</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1F2937" }}>{excursao?.localPartida || "Goiânia - GO"}</div>
            </div>
            <div style={{ border: "1px solid #E5E7EB", borderRadius: 10, padding: 10 }}>
              <div style={{ fontSize: 11, color: "#6B7280" }}>Destino</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1F2937" }}>Caldas Novas - GO</div>
            </div>
            <div style={{ border: "1px solid #E5E7EB", borderRadius: 10, padding: 10 }}>
              <div style={{ fontSize: 11, color: "#6B7280" }}>Período</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1F2937" }}>15-19 Mar 2026</div>
            </div>
            <div style={{ border: "1px solid #E5E7EB", borderRadius: 10, padding: 10 }}>
              <div style={{ fontSize: 11, color: "#6B7280" }}>Membros</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1F2937" }}>{groupSize} pessoas</div>
            </div>
          </div>
        </div>

        <div style={{ background: "#fff", padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }} data-testid="members-grid">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Users style={{ width: 18, height: 18, color: "#8B5CF6" }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#1F2937" }}>Membros do Grupo</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8 }}>
            {MEMBERS.map((m, i) => (
              <div key={i} data-testid={`member-card-${i}`} style={{
                border: "1px solid #E5E7EB", borderRadius: 10, padding: 10,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <div style={{ position: "relative" }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%", background: m.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 700, color: "#fff",
                  }}>
                    {m.name.charAt(0)}
                  </div>
                  <div style={{
                    position: "absolute", bottom: 0, right: 0,
                    width: 10, height: 10, borderRadius: "50%",
                    background: i < 3 ? "#22C55E" : "#D1D5DB",
                    border: "2px solid #fff",
                  }} data-testid={`member-status-${i}`} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#1F2937", display: "flex", alignItems: "center", gap: 4 }}>
                    {m.name}
                    {m.isOrganizer && <Crown style={{ width: 10, height: 10, color: "#F59E0B" }} />}
                  </div>
                  <div style={{ fontSize: 10, color: i < 3 ? "#22C55E" : "#9CA3AF", fontWeight: 600 }}>
                    {i < 3 ? "Online" : "Offline"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "linear-gradient(135deg, #1e3a5f, #0D47A1)", padding: "12px 16px" }}>
          <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", gap: 12, color: "#fff", flexWrap: "wrap" }}>
            <div style={{ background: "#fff", borderRadius: 8, padding: 6 }}>
              <QRCodeSVG value={inviteLink || whatsappInvite} size={56} />
            </div>
            <div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>Código de convite</div>
              <div style={{ fontWeight: 800, letterSpacing: 0.5 }}>{inviteCode}</div>
              <div style={{ fontSize: 10, opacity: 0.7 }}>RSV-XXXX válido por vagas</div>
            </div>
          </div>
        </div>

        <div style={{ background: "#fff", padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <DollarSign style={{ width: 18, height: 18, color: "#2563EB" }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1F2937" }}>Resumo de Custos</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 11, color: "#6B7280" }}>Membros:</span>
              <button data-testid="button-decrease-members" onClick={() => setGroupSize(s => Math.max(2, s - 1))} style={{
                width: 24, height: 24, borderRadius: 6, border: "1px solid #E5E7EB",
                background: "#F9FAFB", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Minus style={{ width: 12, height: 12, color: "#6B7280" }} />
              </button>
              <span data-testid="text-group-size" style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", minWidth: 20, textAlign: "center" }}>{groupSize}</span>
              <button data-testid="button-increase-members" onClick={() => setGroupSize(s => Math.min(10, s + 1))} style={{
                width: 24, height: 24, borderRadius: 6, border: "1px solid #E5E7EB",
                background: "#F9FAFB", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Plus style={{ width: 12, height: 12, color: "#6B7280" }} />
              </button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{
              flex: 1, background: "linear-gradient(135deg, #EBF5FF, #DBEAFE)",
              borderRadius: 10, padding: "10px 12px", textAlign: "center",
            }}>
              <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 500 }}>Total do Grupo</div>
              <div data-testid="text-total-cost" style={{ fontSize: 20, fontWeight: 800, color: "#2563EB" }}>R$ {totalGroupCost.toLocaleString("pt-BR")}</div>
            </div>
            <div style={{
              flex: 1, background: "linear-gradient(135deg, #F0FDF4, #DCFCE7)",
              borderRadius: 10, padding: "10px 12px", textAlign: "center",
            }}>
              <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 500 }}>Por Pessoa</div>
              <div data-testid="text-per-person-cost" style={{ fontSize: 20, fontWeight: 800, color: "#22C55E" }}>R$ {perPersonCost}</div>
            </div>
            <div style={{
              flex: 1, background: "linear-gradient(135deg, #FEF3C7, #FDE68A)",
              borderRadius: 10, padding: "10px 12px", textAlign: "center",
            }}>
              <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 500 }}>Economia</div>
              <div data-testid="text-savings" style={{ fontSize: 20, fontWeight: 800, color: "#D97706" }}>R$ 488</div>
            </div>
          </div>
          <button data-testid="button-toggle-cost-split" onClick={() => setShowCostSplit(!showCostSplit)} style={{
            width: "100%", marginTop: 10, padding: "8px 0", borderRadius: 8,
            border: "1px solid #E5E7EB", background: "#F9FAFB", cursor: "pointer",
            fontSize: 12, fontWeight: 600, color: "#2563EB",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            <Users style={{ width: 14, height: 14 }} />
            {showCostSplit ? "Ocultar divisão" : "Ver divisão por pessoa"}
            {showCostSplit ? <ChevronUp style={{ width: 14, height: 14 }} /> : <ChevronDown style={{ width: 14, height: 14 }} />}
          </button>
          {showCostSplit && (
            <div style={{ marginTop: 10 }}>
              {MEMBERS.map((member, i) => {
                const paidPercent = Math.round((member.paid / member.expenses) * 100)
                return (
                  <div key={i} data-testid={`card-member-${i}`} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "8px 0",
                    borderBottom: i < MEMBERS.length - 1 ? "1px solid #F3F4F6" : "none",
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%", background: member.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0,
                    }}>
                      {member.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#1F2937" }}>
                          {member.name}
                          {member.isOrganizer && <Crown style={{ width: 10, height: 10, color: "#F59E0B", display: "inline", marginLeft: 4, verticalAlign: "middle" }} />}
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: paidPercent >= 100 ? "#22C55E" : "#D97706" }}>
                          R$ {member.paid}/{member.expenses}
                        </span>
                      </div>
                      <div style={{ marginTop: 4, height: 6, borderRadius: 3, background: "#E5E7EB", overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: 3,
                          width: `${Math.min(paidPercent, 100)}%`,
                          background: paidPercent >= 100 ? "#22C55E" : "linear-gradient(90deg, #F59E0B, #D97706)",
                          transition: "width 0.8s ease",
                        }} />
                      </div>
                      <span style={{ fontSize: 10, color: paidPercent >= 100 ? "#22C55E" : "#D97706", fontWeight: 600, marginTop: 2, display: "block" }}>
                        {paidPercent >= 100 ? "Pago" : `Falta R$ ${member.expenses - member.paid}`}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        </>)}

        {activePrimaryTab === 0 && (() => {
          const eid = excursaoId ?? excursaoIdFromQuery
          const pixInfo = eid ? GATE_EXCURSAO_INFO[eid] : null
          const pixNome = pixInfo?.nome ?? "Excursão"
          const pixPreco = pixInfo?.preco ?? 890
          const pixComissao = Math.round(pixPreco * 0.15)
          return (
            <div data-testid="section-pix-grupo" style={{ background: "#F0F9FF", padding: "16px", borderBottom: "1px solid #E5E7EB" }}>
              <div style={{ maxWidth: 480, margin: "0 auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <DollarSign style={{ width: 18, height: 18, color: "#2563EB" }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#1F2937" }}>Reserve agora, pague pelo Pix</span>
                </div>
                <PaymentCheckout
                  excursaoId={eid ?? "1"}
                  excursaoNome={pixNome}
                  amount={pixPreco}
                  organizerCommission={pixComissao}
                  passengerName={user?.nome ?? "Passageiro"}
                />
              </div>
            </div>
          )
        })()}

        {activePrimaryTab === 0 && (<>
        <div style={{ background: "#fff", padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }} data-testid="planejador-ia-chat">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles style={{ width: 18, height: 18, color: "#F57C00" }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1F2937" }}>Planejador IA</span>
              <span style={{
                fontSize: 9, fontWeight: 700, color: "#fff",
                background: "linear-gradient(135deg, #F57C00, #E65100)", padding: "2px 8px", borderRadius: 4,
              }}>INTERATIVO</span>
            </div>
            {plannerHistory.length > 1 && (
              <button
                data-testid="button-planner-restart"
                onClick={() => {
                  setPlannerStepIdx(0)
                  setPlannerAnswers({})
                  setPlannerHistory([])
                  setPlannerDone(false)
                  setPlannerTyping(true)
                  setTimeout(() => {
                    setPlannerHistory([{ role: "ai", text: PLANNER_FLOW[0].aiMessage }])
                    setPlannerTyping(false)
                  }, 800)
                }}
                style={{
                  display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 6,
                  border: "1px solid #E5E7EB", background: "#fff", fontSize: 11, color: "#6B7280",
                  cursor: "pointer",
                }}
              >
                <RefreshCw style={{ width: 12, height: 12 }} />
                Recomeçar
              </button>
            )}
          </div>

          {!plannerDone && (
            <div style={{
              display: "flex", gap: 4, marginBottom: 12,
            }}>
              {PLANNER_FLOW.map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 4, borderRadius: 2,
                  background: i < plannerStepIdx ? "#F57C00" : i === plannerStepIdx ? "#FDBA74" : "#E5E7EB",
                  transition: "background 0.3s ease",
                }} data-testid={`planner-progress-${i}`} />
              ))}
            </div>
          )}

          <div style={{
            maxHeight: 360, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10,
            paddingRight: 4,
          }}>
            {plannerHistory.map((msg, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                alignItems: "flex-start", gap: 8,
              }} data-testid={`planner-msg-${i}`}>
                {msg.role === "ai" && (
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "linear-gradient(135deg, #F57C00, #E65100)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <Bot style={{ width: 14, height: 14, color: "#fff" }} />
                  </div>
                )}
                <div style={{
                  maxWidth: "80%", padding: "10px 14px", borderRadius: 14,
                  background: msg.role === "ai" ? "#FFF7ED" : "#EFF6FF",
                  border: msg.role === "ai" ? "1px solid #FDBA74" : "1px solid #93C5FD",
                  fontSize: 13, color: "#1F2937", lineHeight: 1.5,
                  borderTopLeftRadius: msg.role === "ai" ? 4 : 14,
                  borderTopRightRadius: msg.role === "user" ? 4 : 14,
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {plannerTyping && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "linear-gradient(135deg, #F57C00, #E65100)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Bot style={{ width: 14, height: 14, color: "#fff" }} />
                </div>
                <div style={{
                  padding: "10px 14px", borderRadius: 14, borderTopLeftRadius: 4,
                  background: "#FFF7ED", border: "1px solid #FDBA74",
                  display: "flex", gap: 4, alignItems: "center",
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#F57C00", animation: "pulse 1.4s infinite", animationDelay: "0s" }} />
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#F57C00", animation: "pulse 1.4s infinite", animationDelay: "0.2s" }} />
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#F57C00", animation: "pulse 1.4s infinite", animationDelay: "0.4s" }} />
                </div>
              </div>
            )}

            {!plannerTyping && !plannerDone && plannerStepIdx < PLANNER_FLOW.length && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                {PLANNER_FLOW[plannerStepIdx].options.map((opt, oi) => (
                  <button
                    key={oi}
                    data-testid={`planner-option-${plannerStepIdx}-${oi}`}
                    onClick={() => {
                      const currentStep = PLANNER_FLOW[plannerStepIdx]
                      const newAnswers = { ...plannerAnswers, [currentStep.step]: opt.value }
                      setPlannerAnswers(newAnswers)
                      setPlannerHistory((prev) => [...prev, { role: "user", text: opt.label }])

                      const nextIdx = plannerStepIdx + 1
                      if (nextIdx < PLANNER_FLOW.length) {
                        setPlannerStepIdx(nextIdx)
                        setPlannerTyping(true)
                        setTimeout(() => {
                          setPlannerHistory((prev) => [...prev, { role: "ai", text: PLANNER_FLOW[nextIdx].aiMessage }])
                          setPlannerTyping(false)
                        }, 900)
                      } else {
                        setPlannerTyping(true)
                        setTimeout(() => {
                          const rec = getPlannerRecommendation(newAnswers)
                          const itin = AI_ITINERARIES[rec.index]
                          setSelectedItinerary(rec.index)
                          setPlannerHistory((prev) => [
                            ...prev,
                            { role: "ai", text: `🎯 Analisei todas as suas respostas e tenho a recomendação perfeita!\n\n${rec.reason}` },
                          ])
                          setPlannerTyping(false)
                          setTimeout(() => {
                            setPlannerDone(true)
                          }, 300)
                        }, 1200)
                      }
                    }}
                    style={{
                      padding: "8px 14px", borderRadius: 20, cursor: "pointer",
                      border: "1px solid #E5E7EB", background: "#fff", fontSize: 12,
                      fontWeight: 500, color: "#374151", transition: "all 0.2s ease",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#FFF7ED"
                      e.currentTarget.style.borderColor = "#F57C00"
                      e.currentTarget.style.color = "#F57C00"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fff"
                      e.currentTarget.style.borderColor = "#E5E7EB"
                      e.currentTarget.style.color = "#374151"
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {plannerDone && (() => {
              const rec = getPlannerRecommendation(plannerAnswers)
              const itin = AI_ITINERARIES[rec.index]
              return (
                <div style={{
                  marginTop: 4, padding: 16, borderRadius: 14,
                  background: `linear-gradient(135deg, ${itin.color}08, ${itin.color}15)`,
                  border: `2px solid ${itin.color}`,
                  position: "relative",
                }} data-testid="planner-result-card">
                  <div style={{
                    position: "absolute", top: -10, left: 16,
                    background: itin.color, color: "#fff",
                    fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 10,
                    display: "flex", alignItems: "center", gap: 4,
                  }}>
                    <Trophy style={{ width: 12, height: 12 }} />
                    Escolhido para você
                  </div>

                  <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: `${itin.color}20`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {rec.index === 0 && <Heart style={{ width: 22, height: 22, color: itin.color }} />}
                      {rec.index === 1 && <Zap style={{ width: 22, height: 22, color: itin.color }} />}
                      {rec.index === 2 && <Users style={{ width: 22, height: 22, color: itin.color }} />}
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#1F2937" }}>{itin.name}</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: itin.color }}>
                        R$ {itin.basePP}
                        <span style={{ fontSize: 12, fontWeight: 500, color: "#6B7280" }}>/pessoa</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.6, marginBottom: 12 }}>
                    {rec.benefit}
                  </div>

                  <div style={{
                    display: "flex", alignItems: "center", gap: 6, marginBottom: 12,
                    padding: "8px 12px", borderRadius: 8, background: "#FEF3C7", border: "1px solid #FCD34D",
                  }}>
                    <BarChart3 style={{ width: 14, height: 14, color: "#D97706" }} />
                    <span style={{ fontSize: 11, color: "#92400E", fontWeight: 600 }}>{rec.proof}</span>
                  </div>

                  <div style={{ marginBottom: 12, borderRadius: 10, background: "#F9FAFB", padding: 10, border: "1px solid #E5E7EB" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", marginBottom: 6 }}>PROGRAMAÇÃO</div>
                    {itin.days.map((day, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: i < itin.days.length - 1 ? 4 : 0 }}>
                        <div style={{
                          width: 22, height: 22, borderRadius: "50%",
                          background: itin.color, color: "#fff",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 10, fontWeight: 700, flexShrink: 0,
                        }}>{i + 1}</div>
                        <span style={{ fontSize: 12, color: "#374151" }}>{day}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    display: "flex", alignItems: "center", gap: 6, marginBottom: 12,
                    padding: "6px 10px", borderRadius: 6, background: "#F0FDF4", border: "1px solid #BBF7D0",
                  }}>
                    <TrendingDown style={{ width: 14, height: 14, color: "#22C55E" }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#166534" }}>
                      Economia de R$ {itin.savings} por pessoa em grupo de {groupSize}
                    </span>
                  </div>

                  <button
                    data-testid="button-apply-itinerary"
                    onClick={() => {
                      const slot: TimeSlot = {
                        id: `it-${rec.index}`,
                        startsAt: rec.index === 0 ? "09:00" : rec.index === 1 ? "10:00" : "14:00",
                        endsAt: rec.index === 0 ? "11:00" : rec.index === 1 ? "12:00" : "16:00",
                      }
                      if (hasScheduleConflict(agendaSlots, slot)) {
                        toast({
                          title: "Conflito de horário detectado",
                          description: "Escolha outro roteiro para evitar sobreposição no calendário.",
                          variant: "destructive",
                        })
                        return
                      }
                      setAgendaSlots((prev) => [...prev, slot])
                      setItineraryApplied(true)
                      toast({
                        title: "Roteiro aplicado!",
                        description: `${itin.name} adicionado ao seu grupo com sucesso.`,
                      })
                    }}
                    style={{
                      width: "100%", padding: "12px 0", borderRadius: 10,
                      border: "none", background: `linear-gradient(135deg, ${itin.color}, ${itin.color}CC)`,
                      color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      boxShadow: `0 4px 14px ${itin.color}40`,
                    }}
                  >
                    <Lightbulb style={{ width: 16, height: 16 }} />
                    Aplicar este Roteiro ao meu Grupo
                  </button>
                </div>
              )
            })()}

            <div ref={plannerChatEndRef} />
          </div>

          <div style={{ marginTop: 12, borderTop: "1px solid #E5E7EB", paddingTop: 10 }}>
            <button
              data-testid="button-toggle-old-cards"
              onClick={() => setShowOldCards(!showOldCards)}
              style={{
                display: "flex", alignItems: "center", gap: 6, width: "100%",
                padding: "6px 0", border: "none", background: "none",
                fontSize: 12, color: "#6B7280", cursor: "pointer",
              }}
            >
              {showOldCards ? <ChevronUp style={{ width: 14, height: 14 }} /> : <ChevronDown style={{ width: 14, height: 14 }} />}
              {showOldCards ? "Ocultar roteiros rápidos" : "Ver roteiros rápidos (sem assistente)"}
            </button>
            {showOldCards && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
                  {AI_ITINERARIES.map((itin, i) => {
                    const isSelected = selectedItinerary === i
                    const IconComp = itin.icon
                    return (
                      <button key={i} data-testid={`button-itinerary-${i}`} onClick={() => { setSelectedItinerary(i); setItineraryApplied(false) }} style={{
                        minWidth: 140, padding: 10, borderRadius: 12, cursor: "pointer", textAlign: "left",
                        border: isSelected ? `2px solid ${itin.color}` : "1px solid #E5E7EB",
                        background: isSelected ? `${itin.color}08` : "#fff",
                        flexShrink: 0, position: "relative",
                      }}>
                        {isSelected && (
                          <div style={{
                            position: "absolute", top: -6, right: -6,
                            width: 18, height: 18, borderRadius: "50%", background: itin.color,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <Check style={{ width: 10, height: 10, color: "#fff" }} />
                          </div>
                        )}
                        <IconComp style={{ width: 18, height: 18, color: itin.color, marginBottom: 4 }} />
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#1F2937", marginBottom: 2 }}>{itin.name}</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: itin.color }}>R$ {itin.basePP}</div>
                        <div style={{ fontSize: 10, color: "#6B7280" }}>/pessoa</div>
                        <div style={{
                          marginTop: 4, fontSize: 9, fontWeight: 700, color: "#22C55E",
                          background: "#F0FDF4", padding: "2px 6px", borderRadius: 4,
                          display: "inline-flex", alignItems: "center", gap: 2,
                        }}>
                          <TrendingDown style={{ width: 9, height: 9 }} />
                          -R$ {itin.savings}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ background: "#fff", padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }}>
          <HotelSelector
            hotels={HOTEL_OPTIONS}
            selectedHotelId={selectedHotelId ?? undefined}
            checkIn={selectedCheckIn}
            checkOut={selectedCheckOut}
            onSelect={async (hotelId, total) => {
              setSelectedHotelId(hotelId)
              if (excursaoId) {
                try {
                  await fetch(`/api/excursoes/${excursaoId}/orders/0`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ hotelId, totalAmount: total, paidAmount: 0 }),
                  })
                } catch {
                  // fallback silencioso para manter UX
                }
              }
            }}
          />
          <div style={{ marginTop: 8, fontSize: 12, color: "#475569" }}>
            Total por hospedagem: <strong>R$ {(selectedHotelId ? (HOTEL_OPTIONS.find((h) => h.id === selectedHotelId)?.precoNoite ?? 0) * (calculateNights(selectedCheckIn, selectedCheckOut) || 1) : 0).toLocaleString("pt-BR")}</strong>
          </div>
        </div>

        <div style={{ background: "#fff", padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }} data-testid="roteiro-governanca-sugestao-widget">
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", marginBottom: 8 }} data-testid="roteiro-governanca-sugestao-title">Enviar sugestão de roteiro</div>
          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 10 }}>Sugira mudanças no roteiro. O admin irá revisar e pode publicar para votação do grupo.</div>
          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr auto", gap: 8 }}>
            <select value={novaSugestaoCategoria} onChange={(e) => setNovaSugestaoCategoria(e.target.value as typeof novaSugestaoCategoria)} style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }} data-testid="roteiro-governanca-sugestao-categoria">
              <option value="veiculo">Veículo</option>
              <option value="hotel">Hotel</option>
              <option value="atracao">Atração</option>
              <option value="passeio">Passeio</option>
              <option value="parque">Parque aquático</option>
              <option value="outro">Outro</option>
            </select>
            <input value={novaSugestaoValor} onChange={(e) => setNovaSugestaoValor(e.target.value)} placeholder="Sugestão principal" style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }} data-testid="roteiro-governanca-sugestao-valor" />
            <input value={novaSugestaoDescricao} onChange={(e) => setNovaSugestaoDescricao(e.target.value)} placeholder="Descrição opcional" style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }} data-testid="roteiro-governanca-sugestao-descricao" />
            <button onClick={handleEnviarSugestaoRoteiro} style={{ padding: "8px 12px", borderRadius: 8, border: "none", background: "#1e3a8a", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 12 }} data-testid="roteiro-governanca-sugestao-enviar">
              Enviar
            </button>
          </div>
          {!isAdminRoteiro && sugestoesRoteiro.length > 0 && (
            <div style={{ marginTop: 10 }} data-testid="roteiro-governanca-sugestoes-lista">
              <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Suas sugestões enviadas</div>
              <div style={{ display: "grid", gap: 6 }}>
                {sugestoesRoteiro.map((s) => (
                  <div key={s.id} style={{ border: "1px solid #E5E7EB", borderRadius: 8, padding: 8, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <div style={{ fontSize: 12 }}>
                      <strong>{s.valor}</strong> <span style={{ color: "#6B7280" }}>({s.categoria})</span>
                      {s.descricao && <span style={{ color: "#9CA3AF" }}> — {s.descricao}</span>}
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 999,
                      background: s.status === "APROVADA" ? "#D1FAE5" : s.status === "REJEITADA" ? "#FEE2E2" : "#F3F4F6",
                      color: s.status === "APROVADA" ? "#065F46" : s.status === "REJEITADA" ? "#991B1B" : "#374151",
                    }}>{s.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {isAdminRoteiro && (
          <div style={{ background: "#fff", padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }} data-testid="roteiro-governanca-moderacao-widget">
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", marginBottom: 8 }} data-testid="roteiro-governanca-moderacao-title">Moderação de sugestões (admin)</div>
            {(sugestoesRoteiro.length === 0) && <div style={{ fontSize: 12, color: "#6B7280" }}>Nenhuma sugestão pendente.</div>}
            <div style={{ display: "grid", gap: 8 }} data-testid="roteiro-governanca-moderacao-list">
              {sugestoesRoteiro.map((s) => (
                <div key={s.id} style={{ border: "1px solid #E5E7EB", borderRadius: 10, padding: 8, display: "grid", gap: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                    <div style={{ fontSize: 12 }}>
                      <strong>{s.nomeAutor}</strong> sugeriu <strong>{s.valor}</strong> ({s.categoria})
                    </div>
                    <span style={{ fontSize: 11, padding: "2px 6px", borderRadius: 999, background: "#F3F4F6", color: "#374151" }}>{s.status}</span>
                  </div>
                  {s.descricao ? <div style={{ fontSize: 12, color: "#6B7280" }}>{s.descricao}</div> : null}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <button onClick={() => handleModerarSugestao(s.id, "APROVADA", true)} style={{ padding: "6px 10px", borderRadius: 8, border: "none", background: "#16A34A", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }} data-testid="roteiro-governanca-moderacao-aprovar">
                      Aprovar + publicar votação
                    </button>
                    <button onClick={() => handleModerarSugestao(s.id, "REJEITADA", false)} style={{ padding: "6px 10px", borderRadius: 8, border: "none", background: "#DC2626", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }} data-testid="roteiro-governanca-moderacao-reprovar">
                      Reprovar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </>)}

        {activePrimaryTab === 2 && (<>
        <div style={{ background: "#fff", padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Vote style={{ width: 18, height: 18, color: "#8B5CF6" }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#1F2937" }}>Votação de Hotel</span>
            {hasVoted && <span style={{ fontSize: 10, color: "#22C55E", fontWeight: 600, display: "flex", alignItems: "center", gap: 2 }}><Check style={{ width: 10, height: 10 }} /> Você votou</span>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {VOTE_OPTIONS.map((opt, i) => {
              const pct = totalVotes > 0 ? Math.round((votes[i] / totalVotes) * 100) : 0
              const isWinning = pct === Math.max(...votes.map((v, j) => Math.round((v / totalVotes) * 100)))
              const IconComp = opt.img
              return (
                <button key={i} data-testid={`button-vote-${i}`} onClick={() => handleVote(i)} style={{
                  width: "100%", padding: "12px 14px", borderRadius: 12, cursor: hasVoted ? "default" : "pointer",
                  border: isWinning ? "2px solid #2563EB" : "1px solid #E5E7EB",
                  background: "#fff", textAlign: "left", position: "relative", overflow: "hidden",
                  display: "flex", alignItems: "center", gap: 12,
                }}>
                  <div style={{
                    position: "absolute", left: 0, top: 0, bottom: 0,
                    width: `${pct}%`, background: isWinning ? "rgba(37,99,235,0.06)" : "rgba(139,92,246,0.04)",
                    transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
                  }} />
                  <div style={{
                    position: "relative", zIndex: 1,
                    width: 40, height: 40, borderRadius: 10,
                    background: isWinning ? "linear-gradient(135deg, #2563EB, #1D4ED8)" : "linear-gradient(135deg, #8B5CF6, #7C3AED)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <IconComp style={{ width: 18, height: 18, color: "#fff" }} />
                  </div>
                  <div style={{ position: "relative", zIndex: 1, flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1F2937" }}>{opt.name}</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: isWinning ? "#2563EB" : "#8B5CF6" }}>{pct}%</div>
                    </div>
                    <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                      {opt.tags.map((tag, j) => (
                        <span key={j} style={{
                          fontSize: 9, fontWeight: 600, color: "#6B7280",
                          background: "#F3F4F6", padding: "2px 6px", borderRadius: 4,
                        }}>{tag}</span>
                      ))}
                    </div>
                    <div style={{ marginTop: 6, height: 6, borderRadius: 3, background: "#E5E7EB", overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 3,
                        width: `${pct}%`,
                        background: isWinning ? "linear-gradient(90deg, #2563EB, #1D4ED8)" : "linear-gradient(90deg, #8B5CF6, #7C3AED)",
                        transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
                      }} />
                    </div>
                    <div style={{ fontSize: 10, color: "#6B7280", marginTop: 4 }}>{votes[i]} de {totalVotes} votos</div>
                  </div>
                  {isWinning && (
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <ThumbsUp style={{ width: 16, height: 16, color: "#2563EB" }} />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ background: "#fff", padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }} data-testid="roteiro-governanca-votacao-widget">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Map style={{ width: 18, height: 18, color: "#2563EB" }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#1F2937" }} data-testid="roteiro-governanca-votacao-title">Votação do Roteiro</span>
          </div>
          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 10 }}>Itens publicados pelo admin para votação do grupo.</div>
          {votacaoRoteiro.length === 0 ? (
            <div style={{ fontSize: 12, color: "#6B7280" }}>Sem itens publicados para votação.</div>
          ) : (
            <div style={{ display: "grid", gap: 8 }} data-testid="roteiro-governanca-votacao-list">
              {votacaoRoteiro.map((item) => (
                <div key={item.id} style={{ border: "1px solid #E5E7EB", borderRadius: 10, padding: 8, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <div style={{ fontSize: 12 }}>
                    <strong>{item.valor}</strong> <span style={{ color: "#6B7280" }}>({item.categoria})</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, color: "#1F2937", fontWeight: 700 }}>{item.votos} votos</span>
                    <button onClick={() => handleVotarRoteiro(item.id)} style={{ padding: "6px 10px", borderRadius: 8, border: "none", background: "#2563EB", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }} data-testid="roteiro-governanca-votacao-votar">
                      Votar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </>)}

        {activePrimaryTab === 3 && (
        <div style={{ background: "#fff", padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Calendar style={{ width: 18, height: 18, color: "#F59E0B" }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#1F2937" }}>Timeline do Planejamento</span>
          </div>
          <div style={{ position: "relative", paddingLeft: 20 }}>
            <div style={{
              position: "absolute", left: 11, top: 0, bottom: 0, width: 2,
              background: "linear-gradient(180deg, #22C55E 40%, #2563EB 60%, #E5E7EB 80%)",
            }} />
            {TIMELINE.map((item, i) => {
              const isExpanded = expandedTimeline === i
              const IconComp = item.icon
              return (
                <div key={i} data-testid={`card-timeline-${i}`} onClick={() => setExpandedTimeline(isExpanded ? null : i)} style={{
                  position: "relative", paddingLeft: 20, marginBottom: i < TIMELINE.length - 1 ? 8 : 0,
                  cursor: "pointer",
                }}>
                  <div style={{
                    position: "absolute", left: -4, top: 8,
                    width: 24, height: 24, borderRadius: "50%",
                    background: item.status === "done" ? "#22C55E" : item.status === "current" ? "#2563EB" : "#D1D5DB",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "3px solid #fff", boxShadow: "0 0 0 2px " + (item.status === "done" ? "#22C55E" : item.status === "current" ? "#2563EB" : "#D1D5DB"),
                  }}>
                    {item.status === "done" ? (
                      <Check style={{ width: 10, height: 10, color: "#fff" }} />
                    ) : item.status === "current" ? (
                      <Clock style={{ width: 10, height: 10, color: "#fff" }} />
                    ) : (
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />
                    )}
                  </div>
                  <div style={{
                    padding: "10px 14px", borderRadius: 10,
                    background: item.status === "current" ? "#EBF5FF" : item.status === "done" ? "#F0FDF4" : "#F9FAFB",
                    border: item.status === "current" ? "2px solid #2563EB" : "1px solid #E5E7EB",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <IconComp style={{
                          width: 16, height: 16,
                          color: item.status === "done" ? "#22C55E" : item.status === "current" ? "#2563EB" : "#9CA3AF",
                        }} />
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: item.status === "current" ? "#2563EB" : item.status === "done" ? "#22C55E" : "#374151" }}>{item.day}</div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#1F2937" }}>{item.label}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        {item.status === "done" && <span style={{ fontSize: 9, fontWeight: 600, color: "#22C55E", background: "#F0FDF4", padding: "2px 6px", borderRadius: 4 }}>Concluído</span>}
                        {item.status === "current" && <span style={{ fontSize: 9, fontWeight: 600, color: "#2563EB", background: "#EBF5FF", padding: "2px 6px", borderRadius: 4 }}>Hoje</span>}
                        {item.status === "upcoming" && <span style={{ fontSize: 9, fontWeight: 600, color: "#9CA3AF", background: "#F3F4F6", padding: "2px 6px", borderRadius: 4 }}>Em breve</span>}
                      </div>
                    </div>
                    {isExpanded && (
                      <div style={{
                        marginTop: 8, paddingTop: 8, borderTop: "1px solid #E5E7EB",
                        fontSize: 12, color: "#6B7280", lineHeight: 1.5,
                      }}>
                        {item.expandedDetails ? (
                          <div style={{ display: "grid", gap: 6 }}>
                            {item.expandedDetails.map((d, di) => (
                              <div key={di} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: "#2563EB", minWidth: 40, flexShrink: 0 }}>{d.hora}</span>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: 12, color: "#374151" }}>{d.atividade}</div>
                                  {d.dica && (
                                    <div style={{ fontSize: 11, color: "#F59E0B", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                                      <Lightbulb style={{ width: 10, height: 10, flexShrink: 0 }} />
                                      {d.dica}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          item.details
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        )}

        {activePrimaryTab === 4 && (
        <div style={{ background: "#fff", padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }} data-testid="recommended-hotels">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Star style={{ width: 18, height: 18, color: "#F59E0B" }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#1F2937" }}>Recomendado</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
            {[
              { name: "Hotel Di Roma", stars: 5, price: "R$ 280/noite", img: "🏨", tag: "Mais votado" },
              { name: "Lagoa Quente", stars: 4, price: "R$ 220/noite", img: "🏖️", tag: "Melhor custo" },
              { name: "Prive Thermas", stars: 4, price: "R$ 195/noite", img: "🌊", tag: "Grupo favorito" },
            ].map((h, i) => (
              <div key={i} data-testid={`hotel-rec-${i}`} style={{
                border: "1px solid #E5E7EB", borderRadius: 12, padding: 12, position: "relative",
              }}>
                <div style={{
                  position: "absolute", top: 8, right: 8, background: "#EFF6FF",
                  color: "#2563EB", fontSize: 10, fontWeight: 700, borderRadius: 20, padding: "2px 8px",
                }}>{h.tag}</div>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{h.img}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1F2937" }}>{h.name}</div>
                <div style={{ display: "flex", gap: 2, margin: "4px 0" }}>
                  {Array.from({ length: h.stars }).map((_, s) => (
                    <Star key={s} style={{ width: 12, height: 12, color: "#F59E0B", fill: "#F59E0B" }} />
                  ))}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#22C55E" }}>{h.price}</div>
              </div>
            ))}
          </div>
        </div>
        )}

        {activePrimaryTab === 3 && (
        <div style={{ background: "#fff", padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }}>
          <button data-testid="button-toggle-savings" onClick={() => setShowSavings(!showSavings)} style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 8, padding: 0, border: "none", background: "transparent", cursor: "pointer",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Percent style={{ width: 18, height: 18, color: "#22C55E" }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1F2937" }}>Economize em Grupo</span>
            </div>
            {showSavings ? <ChevronUp style={{ width: 18, height: 18, color: "#6B7280" }} /> : <ChevronDown style={{ width: 18, height: 18, color: "#6B7280" }} />}
          </button>

          {showSavings && (
            <div style={{ marginTop: 12 }}>
              <div style={{
                padding: "14px 16px", borderRadius: 12, marginBottom: 12,
                background: "linear-gradient(135deg, #F0FDF4, #DCFCE7)",
                border: "1px solid #BBF7D0", textAlign: "center",
              }}>
                <div style={{ fontSize: 12, color: "#16A34A", fontWeight: 600 }}>Economia total do grupo</div>
                <div data-testid="text-total-savings" style={{ fontSize: 28, fontWeight: 800, color: "#22C55E" }}>
                  R$ {animatedSavings.toLocaleString("pt-BR")}
                </div>
                <div style={{ fontSize: 11, color: "#6B7280" }}>comparado com reservas individuais</div>
              </div>

              <div style={{
                display: "grid", gridTemplateColumns: "1fr auto auto", gap: "2px 12px",
                fontSize: 12, padding: "0 4px",
              }}>
                <div style={{ fontWeight: 700, color: "#6B7280", fontSize: 10, paddingBottom: 6 }}>ITEM</div>
                <div style={{ fontWeight: 700, color: "#EF4444", fontSize: 10, paddingBottom: 6, textAlign: "right" }}>INDIVIDUAL</div>
                <div style={{ fontWeight: 700, color: "#22C55E", fontSize: 10, paddingBottom: 6, textAlign: "right" }}>GRUPO</div>
                {SAVINGS_COMPARISON.map((item, i) => {
                  const ItemIcon = item.icon
                  const savings = item.individual - item.group
                  return [
                    <div key={`name-${i}`} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 0", borderTop: "1px solid #F3F4F6" }}>
                      <ItemIcon style={{ width: 14, height: 14, color: "#6B7280" }} />
                      <span style={{ color: "#374151", fontWeight: 500 }}>{item.item}</span>
                    </div>,
                    <div key={`ind-${i}`} style={{ textAlign: "right", color: "#9CA3AF", textDecoration: "line-through", padding: "6px 0", borderTop: "1px solid #F3F4F6" }}>
                      R$ {item.individual}
                    </div>,
                    <div key={`grp-${i}`} style={{ textAlign: "right", padding: "6px 0", borderTop: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                      <span style={{ fontWeight: 700, color: "#22C55E" }}>R$ {item.group}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, color: "#16A34A", background: "#F0FDF4", padding: "1px 4px", borderRadius: 3 }}>-{Math.round((savings / item.individual) * 100)}%</span>
                    </div>
                  ]
                })}
              </div>
              <div style={{
                display: "grid", gridTemplateColumns: "1fr auto auto", gap: "2px 12px",
                fontSize: 13, padding: "8px 4px 0", borderTop: "2px solid #E5E7EB", marginTop: 4,
              }}>
                <div style={{ fontWeight: 800, color: "#1F2937" }}>Total</div>
                <div style={{ textAlign: "right", fontWeight: 700, color: "#EF4444", textDecoration: "line-through" }}>R$ {totalIndividual.toLocaleString("pt-BR")}</div>
                <div style={{ textAlign: "right", fontWeight: 800, color: "#22C55E" }}>R$ {totalGroup.toLocaleString("pt-BR")}</div>
              </div>
            </div>
          )}
        </div>
        )}

        {activePrimaryTab === 1 && (
        <div className="chat-tab-layout" style={{ display: "flex", flex: 1, width: "100%", minHeight: 0 }} data-testid="chat-tab-container">
          <div className={`chat-main-col${showAssistant ? " assistant-active" : ""}`} style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                padding: "10px 16px",
                borderBottom: "1px solid #E5E7EB",
                background: "linear-gradient(135deg, #EFF6FF, #F8FAFC)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <MessageCircle style={{ width: 16, height: 16, color: "#2563EB" }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#1F2937" }}>Chat do Grupo</span>
                <span style={{ fontSize: 10, color: "#64748B" }}>({messages.length} mensagens)</span>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ display: "flex", gap: 4, overflowX: "auto" }}>
                  {TABS.map((tab, i) => (
                    <button key={i} data-testid={`button-tab-${i}`} onClick={() => setActiveTab(i)} style={{
                      padding: "4px 8px", borderRadius: 6,
                      border: activeTab === i ? "1px solid #2563EB" : "1px solid #E5E7EB",
                      background: activeTab === i ? "#EBF5FF" : "transparent",
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
                    }}>
                      <tab.icon style={{ width: 12, height: 12, color: activeTab === i ? "#2563EB" : "#9CA3AF" }} />
                      <span style={{ fontSize: 10, color: activeTab === i ? "#2563EB" : "#6B7280", fontWeight: activeTab === i ? 700 : 500 }}>{tab.label}</span>
                    </button>
                  ))}
                </div>
                <button
                  data-testid="button-toggle-assistant"
                  onClick={() => setShowAssistant(!showAssistant)}
                  style={{
                    padding: "4px 8px", borderRadius: 6, cursor: "pointer",
                    border: showAssistant ? "1px solid #22C55E" : "1px solid #E5E7EB",
                    background: showAssistant ? "#F0FDF4" : "transparent",
                    display: "flex", alignItems: "center", gap: 4,
                  }}
                >
                  <Bot style={{ width: 12, height: 12, color: showAssistant ? "#22C55E" : "#9CA3AF" }} />
                  <span style={{ fontSize: 10, color: showAssistant ? "#22C55E" : "#6B7280", fontWeight: showAssistant ? 700 : 500 }}>Assistente</span>
                </button>
              </div>
            </div>

            <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "16px 16px 0", minHeight: 300, maxHeight: "calc(100vh - 380px)" }}>
              {messages.map((msg) => (
                <div key={msg.id} style={{
                  display: "flex", flexDirection: msg.isMe ? "row-reverse" : "row",
                  alignItems: "flex-start", gap: 8, marginBottom: 14,
                }}>
                  {!msg.isMe && (
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                      background: msg.isAiIntervention ? "linear-gradient(135deg, #f97316, #ea580c)" : msg.isBot ? "linear-gradient(135deg, #22C55E, #16A34A)" : MEMBERS.find(m => m.name === msg.sender)?.color || "#2563EB",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700, color: "#fff",
                    }}>
                      {msg.isBot ? <Bot style={{ width: 14, height: 14 }} /> : msg.sender.charAt(0)}
                    </div>
                  )}
                  <div style={{ maxWidth: "78%" }}>
                    {!msg.isMe && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: msg.isAiIntervention ? "#ea580c" : msg.isBot ? "#22C55E" : "#1F2937" }}>{msg.sender}</span>
                        {msg.isBot && (
                          <span style={{
                            fontSize: 9, fontWeight: 700, color: "#fff",
                            background: msg.isAiIntervention ? "linear-gradient(135deg, #f97316, #ea580c)" : "linear-gradient(135deg, #22C55E, #16A34A)", padding: "1px 6px", borderRadius: 4,
                          }}>AI BOT</span>
                        )}
                        {msg.isOrganizer && (
                          <span style={{
                            fontSize: 9, fontWeight: 700, color: "#F59E0B",
                            background: "#FEF3C7", padding: "1px 6px", borderRadius: 4,
                            display: "flex", alignItems: "center", gap: 2,
                          }}>
                            <Crown style={{ width: 8, height: 8 }} /> Organizador
                          </span>
                        )}
                        {msg.tag && (
                          <span style={{
                            fontSize: 9, fontWeight: 600, color: "#22C55E",
                            background: "#F0FDF4", padding: "1px 6px", borderRadius: 4,
                            display: "flex", alignItems: "center", gap: 2,
                          }}><Check style={{ width: 8, height: 8 }} /> {msg.tag}</span>
                        )}
                      </div>
                    )}
                    {msg.isMe && msg.isOrganizer && (
                      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 2 }}>
                        <span style={{
                          fontSize: 9, fontWeight: 700, color: "#F59E0B",
                          background: "#FEF3C7", padding: "1px 6px", borderRadius: 4,
                          display: "flex", alignItems: "center", gap: 2,
                        }}>
                          <Crown style={{ width: 8, height: 8 }} /> Organizador
                        </span>
                      </div>
                    )}
                    <div style={{
                      padding: "10px 14px", borderRadius: 14,
                      ...(msg.isMe
                        ? { background: "linear-gradient(135deg, #2563EB, #1D4ED8)", color: "#fff", borderTopRightRadius: 4 }
                        : msg.isAiIntervention
                          ? { background: "#FFF7ED", color: "#1F2937", borderTopLeftRadius: 4, border: "1px solid #FED7AA" }
                          : msg.isBot
                          ? { background: "#F0FDF4", color: "#1F2937", borderTopLeftRadius: 4, border: "1px solid #BBF7D0" }
                          : { background: "#fff", color: "#1F2937", borderTopLeftRadius: 4, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }
                      ),
                    }}>
                      <p style={{ fontSize: 13, lineHeight: 1.5, margin: 0 }}>{msg.text}</p>
                      {msg.card && (
                        <div style={{
                          marginTop: 10, background: "#fff", borderRadius: 12, overflow: "hidden",
                          border: "1px solid #E5E7EB", boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        }}>
                          <div style={{
                            height: 70, background: msg.card.type === "hotel"
                              ? "linear-gradient(135deg, #3B82F6, #1D4ED8)"
                              : "linear-gradient(135deg, #F59E0B, #D97706)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            position: "relative",
                          }}>
                            {msg.card.type === "hotel" ? <Hotel style={{ width: 24, height: 24, color: "rgba(255,255,255,0.5)" }} /> : <Ticket style={{ width: 24, height: 24, color: "rgba(255,255,255,0.5)" }} />}
                            {msg.card.discount && (
                              <div style={{
                                position: "absolute", top: 8, right: 8,
                                background: "#EF4444", color: "#fff", padding: "2px 8px",
                                borderRadius: 6, fontSize: 11, fontWeight: 800,
                              }}>{msg.card.discount}</div>
                            )}
                          </div>
                          <div style={{ padding: 12 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#1F2937" }}>{msg.card.title}</div>
                            <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>{msg.card.subtitle}</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                              <span style={{ fontSize: 16, fontWeight: 800, color: "#22C55E" }}>{msg.card.price}</span>
                              {msg.card.oldPrice && (
                                <span style={{ fontSize: 12, color: "#9CA3AF", textDecoration: "line-through" }}>{msg.card.oldPrice}</span>
                              )}
                            </div>
                            <button data-testid={`button-cta-${msg.id}`} style={{
                              marginTop: 8, width: "100%", padding: "8px 0", borderRadius: 8,
                              border: "none", background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                              color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                            }}>
                              {msg.card.cta} <ChevronRight style={{ width: 14, height: 14 }} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2, display: "block", textAlign: msg.isMe ? "right" : "left" }}>{msg.time}</span>
                  </div>
                </div>
              ))}

              {showTyping && (
                <div style={{
                  display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 14,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg, #22C55E, #16A34A)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff",
                  }}>
                    <Bot style={{ width: 14, height: 14 }} />
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#22C55E" }}>CaldasAI</span>
                      <span style={{
                        fontSize: 9, fontWeight: 700, color: "#fff",
                        background: "linear-gradient(135deg, #22C55E, #16A34A)", padding: "1px 6px", borderRadius: 4,
                      }}>AI BOT</span>
                    </div>
                    <div style={{
                      padding: "10px 18px", borderRadius: 14, borderTopLeftRadius: 4,
                      background: "#F0FDF4", border: "1px solid #BBF7D0",
                      display: "flex", alignItems: "center", gap: 4,
                    }}>
                      <span style={{ fontSize: 20, animation: "bounce 1s infinite" }}>&#8226;</span>
                      <span style={{ fontSize: 20, animation: "bounce 1s infinite 0.2s" }}>&#8226;</span>
                      <span style={{ fontSize: 20, animation: "bounce 1s infinite 0.4s" }}>&#8226;</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ background: "#fff", borderTop: "1px solid #E5E7EB", padding: "10px 16px 12px" }}>
              <div style={{
                background: "linear-gradient(135deg, #F0FDF4, #DCFCE7)", padding: "8px 12px",
                borderRadius: 10, border: "1px solid #BBF7D0", marginBottom: 10,
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <Share2 style={{ width: 16, height: 16, color: "#22C55E", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#16A34A" }}>Convide mais amigos!</div>
                  <div style={{ fontSize: 11, color: "#6B7280" }}>Quanto mais pessoas, maior o desconto</div>
                </div>
                <button data-testid="button-whatsapp-invite" onClick={() => window.open(whatsappInvite, "_blank")} style={{
                  padding: "6px 12px", borderRadius: 8, border: "none",
                  background: "#25D366", color: "#fff", fontSize: 11, fontWeight: 700,
                  cursor: "pointer", whiteSpace: "nowrap",
                }}>
                  WhatsApp
                </button>
              </div>

              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <button data-testid="button-emoji" style={{
                  width: 36, height: 36, borderRadius: 10, border: "1px solid #E5E7EB",
                  background: "#F9FAFB", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Smile style={{ width: 18, height: 18, color: "#F59E0B" }} />
                </button>
                <button data-testid="button-camera" style={{
                  width: 36, height: 36, borderRadius: 10, border: "1px solid #E5E7EB",
                  background: "#F9FAFB", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Camera style={{ width: 18, height: 18, color: "#6B7280" }} />
                </button>
                <button data-testid="button-location" style={{
                  width: 36, height: 36, borderRadius: 10, border: "1px solid #E5E7EB",
                  background: "#F9FAFB", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <MapPin style={{ width: 18, height: 18, color: "#EF4444" }} />
                </button>
                <input
                  data-testid="input-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Envie uma mensagem..."
                  style={{
                    flex: 1, padding: "10px 14px", borderRadius: 10,
                    border: "1px solid #E5E7EB", fontSize: 13, outline: "none",
                    background: "#F9FAFB",
                  }}
                />
                <button data-testid="button-send" onClick={handleSend} style={{
                  width: 40, height: 40, borderRadius: 10, border: "none",
                  background: message.trim() ? "linear-gradient(135deg, #2563EB, #1D4ED8)" : "#E5E7EB",
                  color: message.trim() ? "#fff" : "#9CA3AF", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                }}>
                  <Send style={{ width: 16, height: 16 }} />
                </button>
              </div>
            </div>
          </div>

          {showAssistant && (
            <div
              data-testid="assistant-panel"
              style={{
                width: 340,
                minWidth: 280,
                borderLeft: "1px solid #E5E7EB",
                display: "flex",
                flexDirection: "column",
                background: "#FAFBFC",
              }}
            >
              <div style={{
                padding: "10px 14px",
                borderBottom: "1px solid #E5E7EB",
                background: "linear-gradient(135deg, #F0FDF4, #ECFDF5)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Bot style={{ width: 16, height: 16, color: "#22C55E" }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1F2937" }}>CaldasAI Assistente</span>
                  <span style={{
                    fontSize: 9, fontWeight: 700, color: "#fff",
                    background: "linear-gradient(135deg, #22C55E, #16A34A)", padding: "1px 6px", borderRadius: 4,
                  }}>AI</span>
                </div>
                <button
                  data-testid="button-close-assistant"
                  onClick={() => setShowAssistant(false)}
                  style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}
                >
                  <ChevronRight style={{ width: 14, height: 14, color: "#6B7280" }} />
                </button>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>
                <div style={{
                  padding: 14, borderRadius: 12, background: "#fff",
                  border: "1px solid #E5E7EB", marginBottom: 12,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1F2937", marginBottom: 6 }}>Sugestões rápidas</div>
                  {[
                    "Quais parques valem a pena?",
                    "Melhor hotel custo-benefício?",
                    "Roteiro ideal para 3 dias?",
                    "Como economizar em grupo?",
                  ].map((q, i) => (
                    <button
                      key={i}
                      data-testid={`button-assistant-suggestion-${i}`}
                      onClick={() => {
                        setMessage(q)
                        setShowAssistant(false)
                      }}
                      style={{
                        display: "block", width: "100%", textAlign: "left",
                        padding: "8px 10px", marginBottom: 4, borderRadius: 8,
                        border: "1px solid #E5E7EB", background: "#F9FAFB",
                        cursor: "pointer", fontSize: 12, color: "#374151",
                      }}
                    >
                      <Sparkles style={{ width: 10, height: 10, color: "#F57C00", display: "inline", marginRight: 6, verticalAlign: "middle" }} />
                      {q}
                    </button>
                  ))}
                </div>
                <div style={{
                  padding: 14, borderRadius: 12, background: "#fff",
                  border: "1px solid #E5E7EB", marginBottom: 12,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1F2937", marginBottom: 6 }}>Dados do grupo</div>
                  <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Membros</span>
                      <strong style={{ color: "#1F2937" }}>{groupSize}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Custo por pessoa</span>
                      <strong style={{ color: "#22C55E" }}>R$ {perPersonCost}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Total do grupo</span>
                      <strong style={{ color: "#2563EB" }}>R$ {totalGroupCost.toLocaleString("pt-BR")}</strong>
                    </div>
                  </div>
                </div>
                <div style={{
                  padding: 14, borderRadius: 12,
                  background: "linear-gradient(135deg, #FFF7ED, #FFFBEB)",
                  border: "1px solid #FED7AA",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <Lightbulb style={{ width: 14, height: 14, color: "#F57C00" }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#92400E" }}>Dica da CaldasAI</span>
                  </div>
                  <p style={{ fontSize: 12, color: "#78350F", margin: 0, lineHeight: 1.5 }}>
                    Grupos com {groupSize}+ pessoas conseguem até 35% de desconto em hotéis parceiros em Caldas Novas. Pergunte no chat para mais detalhes!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        )}

      </div>

      {wizardStep === "quem" && activePrimaryTab === 0 && (
        <BarraFinanceira
          valorPorPessoa={valorPorPessoaBarra}
          valorTotal={valorTotalBarra}
          onReservar={() => {}}
        />
      )}

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes slideDown {
          from { transform: translate(-50%, -100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        @media (max-width: 768px) {
          .chat-tab-layout {
            flex-direction: column !important;
          }
          .chat-tab-layout .chat-main-col.assistant-active {
            display: none !important;
          }
          .chat-tab-layout [data-testid="assistant-panel"] {
            width: 100% !important;
            min-width: 0 !important;
            border-left: none !important;
            border-top: 1px solid #E5E7EB !important;
            flex: 1;
          }
        }
      `}</style>
    </div>
  )
}
