import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Users, Send, Calendar, MapPin, UserPlus, Star, Check, Clock, ChevronRight, Share2, DollarSign, ThumbsUp, Sparkles, Bell, Crown, Minus, Plus, TrendingDown, Percent, ChevronDown, ChevronUp, Bot, Lightbulb, User, Plane, Hotel, UtensilsCrossed, Map, MessageCircle, Gift, TreePine, Waves, Bus, Shield, QrCode, AlertTriangle, Download, X, Copy, ShoppingCart, Trash2, Coffee, Sunset, Mountain, Fish, Anchor, ChevronLeft } from "lucide-react"
import { Link } from "wouter"
const WHATSAPP = "5564993197555"

interface Member {
  id: string
  name: string
  color: string
  isOrganizer?: boolean
  expenses: number
  paid: number
}

interface GroupData {
  id: string
  name: string
  code: string
  destination: string
  status: "planning" | "confirmed" | "finished"
  createdBy: string
  members: Member[]
  dates: { checkIn: string | null; checkOut: string | null }
  selectedHotel: number | null
  itinerary: ItineraryItem[]
  orders: OrderItem[]
  messages: ChatMessage[]
  voucherReleased: boolean
}

interface ItineraryItem {
  id: string
  category: string
  name: string
  price: number
  duration: string
  time: string
  day: number
  icon: string
}

interface OrderItem {
  id: string
  memberId: string
  memberName: string
  item: string
  type: string
  value: number
  status: "confirmed" | "pending" | "cancelled"
  date: string
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
    type: "hotel" | "attraction" | "voucher"
    title: string
    subtitle: string
    price: string
    oldPrice?: string
    discount?: string
    cta: string
  }
}

interface HotelOption {
  id: number
  name: string
  stars: number
  pricePerNight: number
  location: string
  rating: number
  amenities: string[]
  recommended?: boolean
  popular?: boolean
  gradient: string
}

interface CatalogItem {
  id: string
  category: string
  name: string
  price: number
  duration: string
  suggestedTime: string
  iconName: string
}

const CATALOG: CatalogItem[] = [
  { id: "a1", category: "Atrações", name: "Hot Park", price: 189, duration: "8h", suggestedTime: "09:00", iconName: "waves" },
  { id: "a2", category: "Atrações", name: "DiRoma", price: 149, duration: "6h", suggestedTime: "10:00", iconName: "waves" },
  { id: "a3", category: "Atrações", name: "Lagoa Quente", price: 120, duration: "5h", suggestedTime: "09:00", iconName: "waves" },
  { id: "a4", category: "Atrações", name: "Náutico Praia Clube", price: 99, duration: "6h", suggestedTime: "10:00", iconName: "anchor" },
  { id: "a5", category: "Atrações", name: "Jardim Japonês", price: 35, duration: "2h", suggestedTime: "16:00", iconName: "tree" },
  { id: "p1", category: "Parques Aquáticos", name: "Hot Park Completo", price: 220, duration: "10h", suggestedTime: "08:30", iconName: "waves" },
  { id: "p2", category: "Parques Aquáticos", name: "DiRoma Acqua Park", price: 169, duration: "8h", suggestedTime: "09:00", iconName: "waves" },
  { id: "p3", category: "Parques Aquáticos", name: "Lagoa Termas Parque", price: 139, duration: "7h", suggestedTime: "09:30", iconName: "waves" },
  { id: "ps1", category: "Passeios", name: "City Tour Guiado", price: 85, duration: "4h", suggestedTime: "08:30", iconName: "map" },
  { id: "ps2", category: "Passeios", name: "Trilha Ecológica", price: 65, duration: "3h", suggestedTime: "07:00", iconName: "mountain" },
  { id: "ps3", category: "Passeios", name: "Pesca Esportiva", price: 120, duration: "5h", suggestedTime: "06:00", iconName: "fish" },
  { id: "ps4", category: "Passeios", name: "Passeio de Barco", price: 95, duration: "3h", suggestedTime: "15:00", iconName: "anchor" },
  { id: "r1", category: "Refeições", name: "Café da Manhã (hotel)", price: 0, duration: "1h", suggestedTime: "07:00", iconName: "coffee" },
  { id: "r2", category: "Refeições", name: "Almoço - Fogão Mineiro", price: 65, duration: "1h30", suggestedTime: "12:00", iconName: "utensils" },
  { id: "r3", category: "Refeições", name: "Almoço - Churrascaria Boi", price: 79, duration: "1h30", suggestedTime: "12:30", iconName: "utensils" },
  { id: "r4", category: "Refeições", name: "Almoço - Restaurante Lago", price: 55, duration: "1h", suggestedTime: "12:00", iconName: "utensils" },
  { id: "r5", category: "Refeições", name: "Jantar - Pizzaria Italia", price: 49, duration: "1h30", suggestedTime: "19:00", iconName: "utensils" },
  { id: "r6", category: "Refeições", name: "Jantar - Restaurante Termal", price: 89, duration: "2h", suggestedTime: "19:30", iconName: "utensils" },
  { id: "r7", category: "Refeições", name: "Jantar - Sushi Caldas", price: 72, duration: "1h30", suggestedTime: "20:00", iconName: "utensils" },
  { id: "r8", category: "Refeições", name: "Jantar - Espetaria Grill", price: 59, duration: "1h30", suggestedTime: "19:00", iconName: "utensils" },
  { id: "t1", category: "Transfers", name: "Aeroporto → Hotel", price: 45, duration: "40min", suggestedTime: "14:00", iconName: "bus" },
  { id: "t2", category: "Transfers", name: "Hotel → Parque", price: 25, duration: "20min", suggestedTime: "08:30", iconName: "bus" },
  { id: "t3", category: "Transfers", name: "Hotel → Restaurante", price: 20, duration: "15min", suggestedTime: "19:00", iconName: "bus" },
]

const HOTELS: HotelOption[] = [
  { id: 1, name: "Resort Termas Paradise", stars: 4, pricePerNight: 289, location: "Av. Principal, 500", rating: 9.1, amenities: ["Piscina Termal", "Buffet", "Wi-Fi", "Estacionamento", "Spa"], recommended: true, gradient: "linear-gradient(135deg, #2563EB, #1D4ED8)" },
  { id: 2, name: "Hotel Lago Azul", stars: 4, pricePerNight: 249, location: "Rua do Lago, 120", rating: 8.8, amenities: ["Vista Lago", "Spa", "Wi-Fi", "Café incluído"], gradient: "linear-gradient(135deg, #0EA5E9, #0284C7)" },
  { id: 3, name: "Pousada Recanto das Águas", stars: 3, pricePerNight: 199, location: "Rua das Fontes, 85", rating: 9.2, amenities: ["Econômico", "Central", "Wi-Fi", "Café incluído"], popular: true, gradient: "linear-gradient(135deg, #22C55E, #16A34A)" },
  { id: 4, name: "DiRoma Resort", stars: 5, pricePerNight: 389, location: "Rod. GO-139, km 2", rating: 9.4, amenities: ["Parque Aquático", "All Inclusive", "Kids Club", "Spa", "Academia"], gradient: "linear-gradient(135deg, #8B5CF6, #7C3AED)" },
  { id: 5, name: "Hotel Privé Boulevard", stars: 4, pricePerNight: 269, location: "Av. Orcalino Santos, 400", rating: 8.6, amenities: ["Piscina", "Restaurante", "Wi-Fi", "Estacionamento"], gradient: "linear-gradient(135deg, #F59E0B, #D97706)" },
  { id: 6, name: "Pousada Solar das Águas", stars: 3, pricePerNight: 169, location: "Rua Beira Rio, 45", rating: 8.3, amenities: ["Econômico", "Café incluído", "Wi-Fi", "Quintal"], gradient: "linear-gradient(135deg, #EC4899, #DB2777)" },
]

const generateCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = "RSV-"
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

const INITIAL_GROUPS: GroupData[] = [
  {
    id: "g1", name: "Caldas Novas - Amigos", code: "RSV-A7K2", destination: "Caldas Novas - GO",
    status: "planning", createdBy: "Você",
    members: [
      { id: "m1", name: "Você", color: "#2563EB", isOrganizer: true, expenses: 578, paid: 578 },
      { id: "m2", name: "Cate Plotar", color: "#8B5CF6", expenses: 578, paid: 400 },
      { id: "m3", name: "Mario Paxvango", color: "#EC4899", expenses: 578, paid: 578 },
      { id: "m4", name: "Viete Perruoiras", color: "#F59E0B", expenses: 578, paid: 300 },
    ],
    dates: { checkIn: null, checkOut: null },
    selectedHotel: null,
    itinerary: [],
    orders: [
      { id: "PED-G1-001", memberId: "m1", memberName: "Você", item: "Resort Termas Paradise", type: "Hotel", value: 1156, status: "confirmed", date: "2026-03-01" },
      { id: "PED-G1-002", memberId: "m2", memberName: "Cate Plotar", item: "Hot Park Ingresso", type: "Ingresso", value: 189, status: "pending", date: "2026-03-02" },
      { id: "PED-G1-003", memberId: "m3", memberName: "Mario Paxvango", item: "Transfer Aeroporto", type: "Transfer", value: 45, status: "confirmed", date: "2026-03-01" },
    ],
    messages: [
      { id: 1, sender: "Cate Plotar", text: "Pessoal, encontrei umas opções incríveis!", time: "10:30", isMe: false },
      { id: 2, sender: "Você", text: "Vamos! Já apliquei o desconto do grupo!", time: "10:32", isMe: true, isOrganizer: true },
      { id: 3, sender: "Mario Paxvango", text: "Fechado! Pode contar comigo.", time: "10:35", isMe: false, tag: "Confirmado" },
      { id: 4, sender: "CaldasAI BOT", text: "Analisei os preços da região e encontrei a melhor opção para o grupo!", time: "10:40", isMe: false, isBot: true,
        card: { type: "hotel", title: "Resort Termas Paradise", subtitle: "Caldas Novas - 4 estrelas - Nota 9.1", price: "R$ 289", oldPrice: "R$ 450", discount: "-36%", cta: "Reservar pelo Grupo" }
      },
    ],
    voucherReleased: false,
  },
  {
    id: "g2", name: "Férias Família 2026", code: "RSV-F3P8", destination: "Caldas Novas - GO",
    status: "confirmed", createdBy: "Você",
    members: [
      { id: "m1", name: "Você", color: "#2563EB", isOrganizer: true, expenses: 1200, paid: 1200 },
      { id: "m5", name: "Ana Silva", color: "#22C55E", expenses: 1200, paid: 1200 },
      { id: "m6", name: "João Jr.", color: "#F97316", expenses: 600, paid: 600 },
    ],
    dates: { checkIn: "2026-04-10", checkOut: "2026-04-14" },
    selectedHotel: 3,
    itinerary: [],
    orders: [],
    messages: [
      { id: 1, sender: "Você", text: "Família, reservei tudo! Saímos dia 10/04.", time: "14:00", isMe: true, isOrganizer: true },
      { id: 2, sender: "Ana Silva", text: "Perfeito! Já separei as malas!", time: "14:05", isMe: false },
    ],
    voucherReleased: true,
  },
  {
    id: "g3", name: "Excursão Empresa XYZ", code: "RSV-E9W1", destination: "Caldas Novas - GO",
    status: "planning", createdBy: "RH Empresa",
    members: [
      { id: "m1", name: "Você", color: "#2563EB", expenses: 450, paid: 0 },
      { id: "m7", name: "Fernanda Lima", color: "#DC2626", expenses: 450, paid: 450 },
      { id: "m8", name: "Ricardo Costa", color: "#0891B2", expenses: 450, paid: 225 },
      { id: "m9", name: "Patrícia Souza", color: "#7C3AED", expenses: 450, paid: 450 },
      { id: "m10", name: "Lucas Mendes", color: "#059669", expenses: 450, paid: 0 },
      { id: "m11", name: "Carla Dias", color: "#DB2777", expenses: 450, paid: 300 },
    ],
    dates: { checkIn: null, checkOut: null },
    selectedHotel: null,
    itinerary: [],
    orders: [],
    messages: [
      { id: 1, sender: "Fernanda Lima", text: "Pessoal do RH, quando saem as datas?", time: "09:00", isMe: false },
    ],
    voucherReleased: false,
  },
]

const BOT_RESPONSES: Record<string, { text: string; card: ChatMessage["card"] }> = {
  hotel: { text: "Encontrei uma opção incrível para o grupo!", card: { type: "hotel", title: "Pousada Recanto das Águas", subtitle: "Caldas Novas - Nota 9.2", price: "R$ 199/noite", oldPrice: "R$ 320", discount: "-38%", cta: "Reservar com Desconto" } },
  restaurante: { text: "Para jantar em grupo, recomendo:", card: { type: "attraction", title: "Restaurante Fogão Mineiro", subtitle: "Comida regional - Nota 9.4", price: "R$ 65/pessoa", oldPrice: "R$ 89", discount: "-27%", cta: "Reservar Mesa" } },
  parque: { text: "Parques aquáticos em grupo têm descontos!", card: { type: "attraction", title: "Hot Park - Combo Grupo", subtitle: "Ingresso + Almoço - Até 6 pessoas", price: "R$ 149/pessoa", oldPrice: "R$ 220", discount: "-32%", cta: "Ver Combo" } },
  spa: { text: "Day spa em grupo é ótimo!", card: { type: "attraction", title: "Spa Termal Premium", subtitle: "Massagem + Piscina Termal", price: "R$ 189/pessoa", oldPrice: "R$ 280", discount: "-33%", cta: "Reservar Spa" } },
  ingresso: { text: "Ingressos em grupo saem mais baratos!", card: { type: "attraction", title: "Combo 3 Parques", subtitle: "Hot Park + diRoma + Lagoa Quente", price: "R$ 329/pessoa", oldPrice: "R$ 499", discount: "-34%", cta: "Ver Ingressos" } },
  transfer: { text: "Transfer compartilhado fica barato!", card: { type: "attraction", title: "Transfer Van", subtitle: "Ida e volta - Até 8 pessoas", price: "R$ 45/pessoa", oldPrice: "R$ 120", discount: "-63%", cta: "Reservar Transfer" } },
  default: { text: "Posso ajudar! Aqui vai uma sugestão:", card: { type: "hotel", title: "Combo Grupo Especial", subtitle: "Hotel + Parque + Transfer", price: "R$ 459/pessoa", oldPrice: "R$ 680", discount: "-33%", cta: "Ver Combo" } },
}

const getCatalogIcon = (iconName: string) => {
  const map: Record<string, any> = { waves: Waves, map: Map, mountain: Mountain, fish: Fish, anchor: Anchor, coffee: Coffee, utensils: UtensilsCrossed, bus: Bus, tree: TreePine, sunset: Sunset }
  return map[iconName] || Star
}

const getGroupDiscount = (size: number) => {
  if (size >= 8) return 20
  if (size >= 6) return 12
  if (size >= 5) return 7
  return 0
}

export default function ViagensGrupoPage() {
  const [groups, setGroups] = useState<GroupData[]>(INITIAL_GROUPS)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [joinCode, setJoinCode] = useState("")
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupDestination, setNewGroupDestination] = useState("Caldas Novas - GO")
  const [activeSection, setActiveSection] = useState<"overview" | "calendar" | "hotel" | "itinerary" | "orders">("overview")
  const [chatOpen, setChatOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [showTyping, setShowTyping] = useState(false)
  const [voucherModalOpen, setVoucherModalOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [catalogCategory, setCatalogCategory] = useState("Atrações")
  const [compareHotels, setCompareHotels] = useState<number[]>([])
  const [showCompare, setShowCompare] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth())
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear())
  const chatRef = useRef<HTMLDivElement>(null)
  const botTimersRef = useRef<number[]>([])

  const selectedGroup = groups.find(g => g.id === selectedGroupId) || null

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(t)
    }
  }, [toast])

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [selectedGroup?.messages, showTyping, chatOpen])

  useEffect(() => {
    return () => {
      botTimersRef.current.forEach(t => clearTimeout(t))
      botTimersRef.current = []
    }
  }, [selectedGroupId])

  useEffect(() => {
    if (!selectedGroup || selectedGroup.voucherReleased) return
    const membersCount = selectedGroup.members.length
    const paidCount = selectedGroup.members.filter(m => m.paid >= m.expenses).length
    if (paidCount / membersCount >= 0.8) {
      const timer = setTimeout(() => {
        setGroups(prev => prev.map(g => {
          if (g.id !== selectedGroupId) return g
          const botMsg: ChatMessage = {
            id: Date.now(), sender: "CaldasAI BOT",
            text: "Seu grupo está quase completo! Aqui está o Voucher exclusivo com condições especiais válidas por 24h!",
            time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
            isMe: false, isBot: true,
            card: { type: "voucher", title: "Voucher Exclusivo do Grupo", subtitle: "Desconto extra de 10% — Válido por 24h", price: "LIBERADO", cta: "Ver Voucher Completo" }
          }
          return { ...g, voucherReleased: true, messages: [...g.messages, botMsg] }
        }))
        setChatOpen(true)
      }, 15000)
      return () => clearTimeout(timer)
    }
  }, [selectedGroup?.members, selectedGroupId])

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return
    const newGroup: GroupData = {
      id: `g${Date.now()}`, name: newGroupName, code: generateCode(),
      destination: newGroupDestination, status: "planning", createdBy: "Você",
      members: [{ id: "m1", name: "Você", color: "#2563EB", isOrganizer: true, expenses: 0, paid: 0 }],
      dates: { checkIn: null, checkOut: null }, selectedHotel: null,
      itinerary: [], orders: [], messages: [
        { id: 1, sender: "CaldasAI BOT", text: `Grupo "${newGroupName}" criado! Convide seus amigos com o código acima. Posso ajudar a planejar a viagem!`, time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }), isMe: false, isBot: true }
      ], voucherReleased: false,
    }
    setGroups(prev => [newGroup, ...prev])
    setSelectedGroupId(newGroup.id)
    setShowCreateGroup(false)
    setNewGroupName("")
    setToast(`Grupo "${newGroupName}" criado! Código: ${newGroup.code}`)
  }

  const handleJoinGroup = () => {
    const code = joinCode.trim().toUpperCase()
    const group = groups.find(g => g.code === code)
    if (group) {
      if (group.members.find(m => m.name === "Você")) {
        setSelectedGroupId(group.id)
        setJoinCode("")
        return
      }
      setGroups(prev => prev.map(g => {
        if (g.id !== group.id) return g
        return { ...g, members: [...g.members, { id: `m${Date.now()}`, name: "Você", color: "#2563EB", expenses: 0, paid: 0 }] }
      }))
      setSelectedGroupId(group.id)
      setJoinCode("")
      setToast(`Você entrou no grupo "${group.name}"!`)
    } else {
      setToast("Código não encontrado. Verifique e tente novamente.")
    }
  }

  const handleSendMessage = () => {
    if (!message.trim() || !selectedGroupId) return
    const newMsg: ChatMessage = {
      id: Date.now(), sender: "Você", text: message,
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      isMe: true, isOrganizer: true
    }
    setGroups(prev => prev.map(g => g.id === selectedGroupId ? { ...g, messages: [...g.messages, newMsg] } : g))
    const userText = message.toLowerCase()
    setMessage("")

    const typingTimer = window.setTimeout(() => setShowTyping(true), 800)
    const responseTimer = window.setTimeout(() => {
      setShowTyping(false)
      let resp = BOT_RESPONSES.default
      if (userText.match(/hotel|hospedagem|pousada/)) resp = BOT_RESPONSES.hotel
      else if (userText.match(/restaurante|jantar|comer|almoço/)) resp = BOT_RESPONSES.restaurante
      else if (userText.match(/parque|aquático|hot park/)) resp = BOT_RESPONSES.parque
      else if (userText.match(/spa|massagem|relax/)) resp = BOT_RESPONSES.spa
      else if (userText.match(/ingresso|entrada|ticket/)) resp = BOT_RESPONSES.ingresso
      else if (userText.match(/transfer|transporte|aeroporto|van/)) resp = BOT_RESPONSES.transfer
      const botMsg: ChatMessage = {
        id: Date.now() + 1, sender: "CaldasAI BOT", text: resp.text,
        time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        isMe: false, isBot: true, card: resp.card ? { ...resp.card } : undefined
      }
      setGroups(prev => prev.map(g => g.id === selectedGroupId ? { ...g, messages: [...g.messages, botMsg] } : g))
    }, 2500)
    botTimersRef.current.push(typingTimer, responseTimer)
  }

  const handleSelectHotel = (hotelId: number) => {
    if (!selectedGroupId) return
    const hotel = HOTELS.find(h => h.id === hotelId)
    if (!hotel) return
    setGroups(prev => prev.map(g => {
      if (g.id !== selectedGroupId) return g
      const ordersWithoutHotel = g.orders.filter(o => o.type !== "Hotel" || o.status === "confirmed")
      const order: OrderItem = {
        id: `PED-${g.code}-${(g.orders.length + 1).toString().padStart(3, "0")}`,
        memberId: "m1", memberName: "Você", item: hotel.name,
        type: "Hotel", value: hotel.pricePerNight * 4, status: "pending",
        date: new Date().toISOString().split("T")[0]
      }
      return { ...g, selectedHotel: hotelId, orders: [...ordersWithoutHotel, order] }
    }))
    setToast(`${hotel.name} selecionado!`)
  }

  const handleAddToItinerary = (catalogItem: CatalogItem, day: number) => {
    if (!selectedGroupId) return
    const itinItem: ItineraryItem = {
      id: `itin-${Date.now()}`, category: catalogItem.category,
      name: catalogItem.name, price: catalogItem.price,
      duration: catalogItem.duration, time: catalogItem.suggestedTime,
      day, icon: catalogItem.iconName,
    }
    setGroups(prev => prev.map(g => {
      if (g.id !== selectedGroupId) return g
      const order: OrderItem = {
        id: `PED-${g.code}-${(g.orders.length + 1).toString().padStart(3, "0")}`,
        memberId: "m1", memberName: "Você", item: catalogItem.name,
        type: catalogItem.category, value: catalogItem.price, status: "pending",
        date: new Date().toISOString().split("T")[0]
      }
      return { ...g, itinerary: [...g.itinerary, itinItem], orders: [...g.orders, order] }
    }))
    setToast(`${catalogItem.name} adicionado ao Dia ${day}!`)
  }

  const handleRemoveFromItinerary = (itemId: string) => {
    if (!selectedGroupId) return
    setGroups(prev => prev.map(g => {
      if (g.id !== selectedGroupId) return g
      const item = g.itinerary.find(i => i.id === itemId)
      const updatedOrders = item
        ? g.orders.filter(o => !(o.item === item.name && o.type === item.category && o.status === "pending"))
        : g.orders
      return { ...g, itinerary: g.itinerary.filter(i => i.id !== itemId), orders: updatedOrders }
    }))
  }

  const handleSelectDates = (day: number) => {
    if (!selectedGroupId || !selectedGroup) return
    const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    setGroups(prev => prev.map(g => {
      if (g.id !== selectedGroupId) return g
      if (!g.dates.checkIn || (g.dates.checkIn && g.dates.checkOut)) {
        return { ...g, dates: { checkIn: dateStr, checkOut: null } }
      }
      if (dateStr > g.dates.checkIn) {
        return { ...g, dates: { ...g.dates, checkOut: dateStr } }
      }
      return { ...g, dates: { checkIn: dateStr, checkOut: null } }
    }))
  }

  const getDateAvailability = (day: number) => {
    const d = new Date(calendarYear, calendarMonth, day)
    if (d < new Date()) return "past"
    const seed = (day * 7 + calendarMonth * 31) % 10
    if (seed < 2) return "full"
    if (seed < 4) return "few"
    return "available"
  }

  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-")
    return `${d}/${m}/${y}`
  }

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay()
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

  if (!selectedGroupId) {
    return (
      <div style={{ background: "#F9FAFB", minHeight: "100vh" }}>
        {toast && (
          <div data-testid="toast-notification" style={{
            position: "fixed", top: 12, left: "50%", transform: "translateX(-50%)", zIndex: 100,
            background: toast.includes("não encontrado") ? "linear-gradient(135deg, #EF4444, #DC2626)" : "linear-gradient(135deg, #22C55E, #16A34A)", color: "#fff",
            padding: "10px 20px", borderRadius: 12, fontSize: 13, fontWeight: 600,
            display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            maxWidth: 400,
          }}>
            {toast.includes("não encontrado") ? <AlertTriangle style={{ width: 16, height: 16 }} /> : <Check style={{ width: 16, height: 16 }} />}
            {toast}
          </div>
        )}
        <div style={{ background: "linear-gradient(135deg, #1e3a5f, #2563EB)", padding: "14px 16px", color: "#fff" }}>
          <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/" style={{ color: "#fff", display: "flex" }}>
              <ArrowLeft style={{ width: 24, height: 24 }} data-testid="button-back" />
            </Link>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Meus Grupos de Viagem</h1>
              <p style={{ fontSize: 12, opacity: 0.8, margin: 0 }}>{groups.length} grupos</p>
            </div>
            <button data-testid="button-create-group" onClick={() => setShowCreateGroup(true)} style={{
              padding: "8px 14px", borderRadius: 8, border: "none",
              background: "#22C55E", color: "#fff", fontSize: 12, fontWeight: 700,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
            }}>
              <Plus style={{ width: 14, height: 14 }} /> Criar Grupo
            </button>
          </div>
        </div>

        <div style={{ maxWidth: 1400, margin: "0 auto", padding: 16 }}>
          <div style={{
            display: "flex", gap: 8, marginBottom: 20, padding: 12, borderRadius: 12,
            background: "#fff", border: "1px solid #E5E7EB",
          }}>
            <input data-testid="input-join-code" value={joinCode} onChange={e => setJoinCode(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleJoinGroup()}
              placeholder="Código do grupo (ex: RSV-A7K2)"
              style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 13, outline: "none" }}
            />
            <button data-testid="button-join-group" onClick={handleJoinGroup} style={{
              padding: "10px 16px", borderRadius: 8, border: "none",
              background: "linear-gradient(135deg, #2563EB, #1D4ED8)", color: "#fff",
              fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
            }}>
              Entrar no Grupo
            </button>
          </div>

          {showCreateGroup && (
            <div style={{
              marginBottom: 20, padding: 20, borderRadius: 12,
              background: "#fff", border: "2px solid #2563EB", boxShadow: "0 4px 20px rgba(37,99,235,0.15)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: 0 }}>Criar Novo Grupo</h3>
                <button onClick={() => setShowCreateGroup(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280" }}>
                  <X style={{ width: 20, height: 20 }} />
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input data-testid="input-group-name" value={newGroupName} onChange={e => setNewGroupName(e.target.value)}
                  placeholder="Nome do grupo (ex: Viagem com Amigos)"
                  style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 13, outline: "none" }}
                />
                <input data-testid="input-group-destination" value={newGroupDestination} onChange={e => setNewGroupDestination(e.target.value)}
                  placeholder="Destino"
                  style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 13, outline: "none" }}
                />
                <button data-testid="button-confirm-create" onClick={handleCreateGroup} style={{
                  padding: "12px 0", borderRadius: 8, border: "none",
                  background: "linear-gradient(135deg, #22C55E, #16A34A)", color: "#fff",
                  fontSize: 14, fontWeight: 700, cursor: "pointer",
                }}>
                  Criar Grupo
                </button>
              </div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 12 }}>
            {groups.map(group => (
              <button key={group.id} data-testid={`card-group-${group.id}`}
                onClick={() => { setSelectedGroupId(group.id); setActiveSection("overview") }}
                style={{
                  padding: 16, borderRadius: 12, border: "1px solid #E5E7EB",
                  background: "#fff", cursor: "pointer", textAlign: "left",
                  transition: "all 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1F2937", margin: 0 }}>{group.name}</h3>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6,
                    color: group.status === "confirmed" ? "#22C55E" : group.status === "finished" ? "#6B7280" : "#2563EB",
                    background: group.status === "confirmed" ? "#F0FDF4" : group.status === "finished" ? "#F3F4F6" : "#EBF5FF",
                  }}>
                    {group.status === "planning" ? "Planejando" : group.status === "confirmed" ? "Confirmado" : "Finalizado"}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, fontSize: 12, color: "#6B7280" }}>
                  <MapPin style={{ width: 12, height: 12 }} /> {group.destination}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, fontSize: 12, color: "#6B7280" }}>
                  <Copy style={{ width: 12, height: 12 }} /> Código: <span style={{ fontWeight: 700, color: "#2563EB" }}>{group.code}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {group.members.slice(0, 5).map((m, i) => (
                    <div key={i} style={{
                      width: 28, height: 28, borderRadius: "50%", background: m.color,
                      border: "2px solid #fff", marginLeft: i > 0 ? -8 : 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 10, fontWeight: 700, color: "#fff", zIndex: 5 - i,
                    }}>{m.name.charAt(0)}</div>
                  ))}
                  {group.members.length > 5 && (
                    <span style={{ fontSize: 11, color: "#6B7280", marginLeft: 4 }}>+{group.members.length - 5}</span>
                  )}
                  <span style={{ fontSize: 11, color: "#6B7280", marginLeft: "auto" }}>{group.members.length} membros</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const group = selectedGroup!
  const groupSize = group.members.length
  const discount = getGroupDiscount(groupSize)
  const whatsappInvite = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Junte-se ao meu grupo "${group.name}"! Use o código ${group.code} em reserveiviagens.com/viagens-grupo`)}`
  const totalOrders = group.orders.reduce((sum, o) => o.status !== "cancelled" ? sum + o.value : sum, 0)
  const confirmedOrders = group.orders.filter(o => o.status === "confirmed").length
  const pendingOrders = group.orders.filter(o => o.status === "pending").length
  const unreadCount = group.messages.length > 0 ? Math.min(group.messages.length, 3) : 0

  const SECTIONS = [
    { key: "overview", label: "Visão Geral", icon: Users },
    { key: "calendar", label: "Datas", icon: Calendar },
    { key: "hotel", label: "Hotéis", icon: Hotel },
    { key: "itinerary", label: "Roteiro", icon: Map },
    { key: "orders", label: "Pedidos", icon: ShoppingCart },
  ] as const

  return (
    <div style={{ background: "#F9FAFB", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {toast && (
        <div data-testid="toast-notification" style={{
          position: "fixed", top: 12, left: "50%", transform: "translateX(-50%)", zIndex: 200,
          background: "linear-gradient(135deg, #22C55E, #16A34A)", color: "#fff",
          padding: "10px 20px", borderRadius: 12, fontSize: 13, fontWeight: 600,
          display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 20px rgba(34,197,94,0.4)",
          maxWidth: 400,
        }}>
          <Check style={{ width: 16, height: 16 }} /> {toast}
        </div>
      )}

      {voucherModalOpen && group.voucherReleased && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div data-testid="modal-voucher" style={{ background: "#fff", borderRadius: 16, maxWidth: 440, width: "100%", maxHeight: "90vh", overflowY: "auto", padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1F2937", margin: 0 }}>Voucher Exclusivo</h2>
              <button data-testid="button-close-voucher" onClick={() => setVoucherModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X style={{ width: 20, height: 20, color: "#6B7280" }} /></button>
            </div>
            <div style={{ border: "2px dashed #2563EB", borderRadius: 12, padding: 16, background: "linear-gradient(135deg, #FAFBFF, #EBF5FF)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#2563EB", letterSpacing: 1 }}>VOUCHER RSV360</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#1F2937", marginTop: 2 }}>{group.name}</div>
                </div>
                <div style={{ width: 56, height: 56, borderRadius: 8, background: "#fff", border: "1px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <QrCode style={{ width: 32, height: 32, color: "#1F2937" }} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                <div><div style={{ fontSize: 10, color: "#6B7280" }}>Destino</div><div style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{group.destination}</div></div>
                <div><div style={{ fontSize: 10, color: "#6B7280" }}>Membros</div><div style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{groupSize} pessoas</div></div>
                {group.dates.checkIn && <div><div style={{ fontSize: 10, color: "#6B7280" }}>Check-in</div><div style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{formatDate(group.dates.checkIn)}</div></div>}
                {group.dates.checkOut && <div><div style={{ fontSize: 10, color: "#6B7280" }}>Check-out</div><div style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{formatDate(group.dates.checkOut)}</div></div>}
                {group.selectedHotel && <div><div style={{ fontSize: 10, color: "#6B7280" }}>Hotel</div><div style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{HOTELS.find(h => h.id === group.selectedHotel)?.name}</div></div>}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Participantes:</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 12 }}>
                {group.members.map((m, i) => (
                  <span key={i} style={{ fontSize: 10, fontWeight: 600, color: "#fff", background: m.color, padding: "2px 8px", borderRadius: 4 }}>{m.name}</span>
                ))}
              </div>
              <div style={{ padding: "8px 10px", borderRadius: 6, background: "#FEF3C7", border: "1px solid #FDE68A", fontSize: 10, color: "#92400E", lineHeight: 1.5, marginBottom: 12 }}>
                Desconto extra de 10% válido por 24h. Cancelamento: até 30 dias = devolução -10% | 29-8 dias = multa 30% | &lt;7 dias = sem devolução. Seguro GTA incluso.
              </div>
              <button data-testid="button-download-voucher" onClick={() => { setToast("Voucher gerado com sucesso!"); setVoucherModalOpen(false) }} style={{
                width: "100%", padding: "10px 0", borderRadius: 8, border: "none",
                background: "linear-gradient(135deg, #F57C00, #E65100)", color: "#fff",
                fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
                <Download style={{ width: 14, height: 14 }} /> Baixar Voucher PDF
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: "linear-gradient(135deg, #1e3a5f, #2563EB)", padding: "14px 16px", color: "#fff" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          <button data-testid="button-back-to-groups" onClick={() => setSelectedGroupId(null)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex" }}>
            <ArrowLeft style={{ width: 24, height: 24 }} />
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{group.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, opacity: 0.85 }}>{groupSize} membros</span>
              <span style={{ fontSize: 10, background: "rgba(255,255,255,0.2)", padding: "1px 6px", borderRadius: 4, fontWeight: 600 }}>{group.code}</span>
              {discount > 0 && <span style={{ fontSize: 10, background: "rgba(245,158,0,0.3)", padding: "1px 6px", borderRadius: 4, fontWeight: 700, color: "#FDE68A" }}>-{discount}%</span>}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: -4 }}>
            {group.members.slice(0, 4).map((m, i) => (
              <div key={i} style={{
                width: 28, height: 28, borderRadius: "50%", background: m.color,
                border: "2px solid #1e3a5f", marginLeft: i > 0 ? -8 : 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, color: "#fff", zIndex: 4 - i, position: "relative",
              }}>{m.name.charAt(0)}</div>
            ))}
          </div>
          <button data-testid="button-invite" onClick={() => window.open(whatsappInvite, "_blank")} style={{
            padding: "6px 10px", borderRadius: 8, border: "none",
            background: "#22C55E", color: "#fff", fontSize: 11, fontWeight: 700,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
          }}>
            <UserPlus style={{ width: 12, height: 12 }} /> Convidar
          </button>
        </div>
      </div>

      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", overflowX: "auto" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", gap: 0 }}>
          {SECTIONS.map(sec => {
            const Icon = sec.icon
            const isActive = activeSection === sec.key
            return (
              <button key={sec.key} data-testid={`tab-${sec.key}`} onClick={() => setActiveSection(sec.key as any)} style={{
                flex: 1, minWidth: 70, padding: "10px 8px", border: "none", borderBottom: isActive ? "3px solid #2563EB" : "3px solid transparent",
                background: "transparent", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                transition: "all 0.2s",
              }}>
                <Icon style={{ width: 16, height: 16, color: isActive ? "#2563EB" : "#9CA3AF" }} />
                <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, color: isActive ? "#2563EB" : "#6B7280" }}>{sec.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 80 }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: 16 }}>

          {activeSection === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
                <div style={{ background: "linear-gradient(135deg, #EBF5FF, #DBEAFE)", borderRadius: 10, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "#6B7280" }}>Membros</div>
                  <div data-testid="text-member-count" style={{ fontSize: 22, fontWeight: 800, color: "#2563EB" }}>{groupSize}</div>
                </div>
                <div style={{ background: "linear-gradient(135deg, #F0FDF4, #DCFCE7)", borderRadius: 10, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "#6B7280" }}>Pedidos</div>
                  <div data-testid="text-order-count" style={{ fontSize: 22, fontWeight: 800, color: "#22C55E" }}>{group.orders.length}</div>
                </div>
                <div style={{ background: "linear-gradient(135deg, #FEF3C7, #FDE68A)", borderRadius: 10, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "#6B7280" }}>Total</div>
                  <div data-testid="text-total-value" style={{ fontSize: 22, fontWeight: 800, color: "#D97706" }}>R$ {totalOrders.toLocaleString("pt-BR")}</div>
                </div>
              </div>

              {discount > 0 && (
                <div style={{ padding: "8px 12px", borderRadius: 8, background: "linear-gradient(135deg, #FEF3C7, #FDE68A)", border: "1px solid #FDE68A", fontSize: 12, fontWeight: 600, color: "#92400E", display: "flex", alignItems: "center", gap: 6 }}>
                  <Gift style={{ width: 14, height: 14, color: "#D97706" }} />
                  Desconto de {discount}% aplicado por ter {groupSize}+ membros!
                </div>
              )}

              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}>
                  <Users style={{ width: 16, height: 16, color: "#2563EB" }} /> Membros do Grupo
                </h3>
                {group.members.map((member, i) => {
                  const paidPercent = member.expenses > 0 ? Math.round((member.paid / member.expenses) * 100) : 0
                  return (
                    <div key={i} data-testid={`card-member-${i}`} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < group.members.length - 1 ? "1px solid #F3F4F6" : "none" }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: member.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{member.name.charAt(0)}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#1F2937" }}>
                            {member.name}
                            {member.isOrganizer && <Crown style={{ width: 10, height: 10, color: "#F59E0B", display: "inline", marginLeft: 4, verticalAlign: "middle" }} />}
                          </span>
                          {member.expenses > 0 && <span style={{ fontSize: 11, fontWeight: 700, color: paidPercent >= 100 ? "#22C55E" : "#D97706" }}>R$ {member.paid}/{member.expenses}</span>}
                        </div>
                        {member.expenses > 0 && (
                          <div style={{ marginTop: 4, height: 5, borderRadius: 3, background: "#E5E7EB", overflow: "hidden" }}>
                            <div style={{ height: "100%", borderRadius: 3, width: `${Math.min(paidPercent, 100)}%`, background: paidPercent >= 100 ? "#22C55E" : "linear-gradient(90deg, #F59E0B, #D97706)", transition: "width 0.8s ease" }} />
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div style={{ padding: "12px 16px", borderRadius: 12, background: "linear-gradient(135deg, #F0FDF4, #DCFCE7)", border: "1px solid #BBF7D0", display: "flex", alignItems: "center", gap: 10 }}>
                <Share2 style={{ width: 18, height: 18, color: "#22C55E", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#16A34A" }}>Convide mais amigos!</div>
                  <div style={{ fontSize: 11, color: "#6B7280" }}>Código: <strong>{group.code}</strong> — Quanto mais pessoas, maior o desconto</div>
                </div>
                <button data-testid="button-whatsapp-invite" onClick={() => window.open(whatsappInvite, "_blank")} style={{ padding: "6px 12px", borderRadius: 8, border: "none", background: "#25D366", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>WhatsApp</button>
              </div>
            </div>
          )}

          {activeSection === "calendar" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <button data-testid="button-prev-month" onClick={() => { if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(y => y - 1) } else setCalendarMonth(m => m - 1) }}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><ChevronLeft style={{ width: 20, height: 20, color: "#6B7280" }} /></button>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: 0 }}>{monthNames[calendarMonth]} {calendarYear}</h3>
                  <button data-testid="button-next-month" onClick={() => { if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(y => y + 1) } else setCalendarMonth(m => m + 1) }}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><ChevronRight style={{ width: 20, height: 20, color: "#6B7280" }} /></button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 8 }}>
                  {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(d => (
                    <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 600, color: "#9CA3AF", padding: 4 }}>{d}</div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
                  {Array.from({ length: getFirstDayOfMonth(calendarMonth, calendarYear) }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: getDaysInMonth(calendarMonth, calendarYear) }).map((_, i) => {
                    const day = i + 1
                    const avail = getDateAvailability(day)
                    const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                    const isCheckIn = group.dates.checkIn === dateStr
                    const isCheckOut = group.dates.checkOut === dateStr
                    const isInRange = group.dates.checkIn && group.dates.checkOut && dateStr > group.dates.checkIn && dateStr < group.dates.checkOut
                    const isClickable = avail === "available" || avail === "few"
                    const bgColor = isCheckIn || isCheckOut ? "#2563EB" : isInRange ? "#DBEAFE" : avail === "available" ? "#F0FDF4" : avail === "few" ? "#FEF3C7" : avail === "full" ? "#FEE2E2" : "#F3F4F6"
                    const textColor = isCheckIn || isCheckOut ? "#fff" : avail === "past" ? "#D1D5DB" : avail === "full" ? "#EF4444" : "#374151"
                    return (
                      <button key={day} data-testid={`cal-day-${day}`}
                        onClick={() => isClickable && handleSelectDates(day)}
                        disabled={!isClickable}
                        style={{
                          padding: "8px 4px", borderRadius: 8, border: "none",
                          background: bgColor, cursor: isClickable ? "pointer" : "default",
                          textAlign: "center", fontSize: 13, fontWeight: isCheckIn || isCheckOut ? 800 : 500,
                          color: textColor, transition: "all 0.2s", position: "relative",
                        }}>
                        {day}
                        {avail === "few" && !isCheckIn && !isCheckOut && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#F59E0B", margin: "2px auto 0" }} />}
                      </button>
                    )
                  })}
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 12, fontSize: 10, color: "#6B7280", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: "#F0FDF4", border: "1px solid #BBF7D0" }} /> Disponível</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: "#FEF3C7", border: "1px solid #FDE68A" }} /> Poucas vagas</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: "#FEE2E2", border: "1px solid #FECACA" }} /> Lotado</div>
                </div>
              </div>
              {(group.dates.checkIn || group.dates.checkOut) && (
                <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 16 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", margin: "0 0 10px" }}>Datas Selecionadas</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div style={{ padding: 10, borderRadius: 8, background: "#EBF5FF", textAlign: "center" }}>
                      <div style={{ fontSize: 10, color: "#6B7280" }}>Check-in</div>
                      <div data-testid="text-checkin" style={{ fontSize: 14, fontWeight: 700, color: "#2563EB" }}>{group.dates.checkIn ? formatDate(group.dates.checkIn) : "—"}</div>
                    </div>
                    <div style={{ padding: 10, borderRadius: 8, background: "#EBF5FF", textAlign: "center" }}>
                      <div style={{ fontSize: 10, color: "#6B7280" }}>Check-out</div>
                      <div data-testid="text-checkout" style={{ fontSize: 14, fontWeight: 700, color: "#2563EB" }}>{group.dates.checkOut ? formatDate(group.dates.checkOut) : "—"}</div>
                    </div>
                  </div>
                  {group.dates.checkIn && group.dates.checkOut && (
                    <div style={{ marginTop: 8, textAlign: "center", fontSize: 12, fontWeight: 600, color: "#22C55E" }}>
                      {Math.round((new Date(group.dates.checkOut).getTime() - new Date(group.dates.checkIn).getTime()) / (1000 * 60 * 60 * 24))} noites
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeSection === "hotel" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {showCompare && compareHotels.length === 2 && (
                <div style={{ background: "#fff", borderRadius: 12, border: "2px solid #2563EB", padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", margin: 0 }}>Comparação</h3>
                    <button onClick={() => { setShowCompare(false); setCompareHotels([]) }} style={{ background: "none", border: "none", cursor: "pointer" }}><X style={{ width: 16, height: 16, color: "#6B7280" }} /></button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {compareHotels.map(hId => {
                      const h = HOTELS.find(x => x.id === hId)!
                      return (
                        <div key={hId} style={{ textAlign: "center" }}>
                          <div style={{ height: 50, borderRadius: 8, background: h.gradient, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                            <Hotel style={{ width: 20, height: 20, color: "rgba(255,255,255,0.5)" }} />
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#1F2937" }}>{h.name}</div>
                          <div style={{ fontSize: 11, color: "#6B7280" }}>{"⭐".repeat(h.stars)} — {h.rating}</div>
                          <div style={{ fontSize: 16, fontWeight: 800, color: "#22C55E", marginTop: 4 }}>R$ {h.pricePerNight}/noite</div>
                          <div style={{ display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "center", marginTop: 6 }}>
                            {h.amenities.map((a, j) => (
                              <span key={j} style={{ fontSize: 8, background: "#F3F4F6", padding: "2px 4px", borderRadius: 3, color: "#6B7280" }}>{a}</span>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
                {HOTELS.map(hotel => {
                  const isSelected = group.selectedHotel === hotel.id
                  const isComparing = compareHotels.includes(hotel.id)
                  return (
                    <div key={hotel.id} data-testid={`card-hotel-${hotel.id}`} style={{
                      borderRadius: 12, overflow: "hidden", background: "#fff",
                      border: isSelected ? "2px solid #22C55E" : isComparing ? "2px solid #2563EB" : "1px solid #E5E7EB",
                      transition: "all 0.2s", position: "relative",
                    }}>
                      {isSelected && <div style={{ position: "absolute", top: 8, left: 8, zIndex: 2, fontSize: 9, fontWeight: 700, color: "#fff", background: "#22C55E", padding: "2px 8px", borderRadius: 4 }}>Selecionado</div>}
                      {hotel.recommended && <div style={{ position: "absolute", top: 8, right: 8, zIndex: 2, fontSize: 9, fontWeight: 700, color: "#fff", background: "linear-gradient(135deg, #F57C00, #E65100)", padding: "2px 8px", borderRadius: 4 }}>Recomendado IA</div>}
                      {hotel.popular && !hotel.recommended && <div style={{ position: "absolute", top: 8, right: 8, zIndex: 2, fontSize: 9, fontWeight: 700, color: "#fff", background: "#8B5CF6", padding: "2px 8px", borderRadius: 4 }}>Mais Popular</div>}
                      <div style={{ height: 80, background: hotel.gradient, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Hotel style={{ width: 28, height: 28, color: "rgba(255,255,255,0.4)" }} />
                      </div>
                      <div style={{ padding: 12 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#1F2937" }}>{hotel.name}</div>
                        <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>{"⭐".repeat(hotel.stars)} — Nota {hotel.rating}</div>
                        <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                          <MapPin style={{ width: 10, height: 10 }} /> {hotel.location}
                        </div>
                        <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginTop: 6 }}>
                          {hotel.amenities.slice(0, 4).map((a, j) => (
                            <span key={j} style={{ fontSize: 9, background: "#F3F4F6", padding: "2px 6px", borderRadius: 4, color: "#6B7280" }}>{a}</span>
                          ))}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
                          <div>
                            <div style={{ fontSize: 18, fontWeight: 800, color: "#22C55E" }}>R$ {hotel.pricePerNight}</div>
                            <div style={{ fontSize: 10, color: "#6B7280" }}>/noite</div>
                          </div>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button data-testid={`button-compare-${hotel.id}`}
                              onClick={() => setCompareHotels(prev => {
                                if (prev.includes(hotel.id)) return prev.filter(id => id !== hotel.id)
                                if (prev.length >= 2) return [prev[1], hotel.id]
                                return [...prev, hotel.id]
                              })}
                              style={{ padding: "6px 10px", borderRadius: 6, border: isComparing ? "2px solid #2563EB" : "1px solid #E5E7EB", background: isComparing ? "#EBF5FF" : "#fff", cursor: "pointer", fontSize: 10, fontWeight: 600, color: isComparing ? "#2563EB" : "#6B7280" }}>
                              Comparar
                            </button>
                            <button data-testid={`button-select-hotel-${hotel.id}`}
                              onClick={() => handleSelectHotel(hotel.id)}
                              style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: isSelected ? "#22C55E" : "linear-gradient(135deg, #2563EB, #1D4ED8)", color: "#fff", cursor: "pointer", fontSize: 10, fontWeight: 700 }}>
                              {isSelected ? "Selecionado ✓" : "Selecionar"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              {compareHotels.length === 2 && !showCompare && (
                <button data-testid="button-show-compare" onClick={() => setShowCompare(true)} style={{
                  width: "100%", padding: "10px 0", borderRadius: 8, border: "none",
                  background: "linear-gradient(135deg, #2563EB, #1D4ED8)", color: "#fff",
                  fontSize: 12, fontWeight: 700, cursor: "pointer",
                }}>Comparar 2 Hotéis Selecionados</button>
              )}
            </div>
          )}

          {activeSection === "itinerary" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}>
                  <Sparkles style={{ width: 16, height: 16, color: "#F57C00" }} /> Catálogo de Atividades
                </h3>
                <div style={{ display: "flex", gap: 6, marginBottom: 12, overflowX: "auto", paddingBottom: 4 }}>
                  {["Atrações", "Parques Aquáticos", "Passeios", "Refeições", "Transfers"].map(cat => (
                    <button key={cat} data-testid={`button-cat-${cat}`} onClick={() => setCatalogCategory(cat)} style={{
                      padding: "6px 12px", borderRadius: 8, border: catalogCategory === cat ? "2px solid #2563EB" : "1px solid #E5E7EB",
                      background: catalogCategory === cat ? "#EBF5FF" : "#fff", cursor: "pointer",
                      fontSize: 11, fontWeight: catalogCategory === cat ? 700 : 500,
                      color: catalogCategory === cat ? "#2563EB" : "#6B7280", whiteSpace: "nowrap",
                    }}>{cat}</button>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 8 }}>
                  {CATALOG.filter(c => c.category === catalogCategory).map(item => {
                    const Icon = getCatalogIcon(item.iconName)
                    const alreadyAdded = group.itinerary.some(i => i.name === item.name)
                    return (
                      <div key={item.id} data-testid={`catalog-item-${item.id}`} style={{
                        padding: 12, borderRadius: 10, border: alreadyAdded ? "1px solid #BBF7D0" : "1px solid #E5E7EB",
                        background: alreadyAdded ? "#F0FDF4" : "#fff",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <Icon style={{ width: 16, height: 16, color: "#2563EB" }} />
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#1F2937" }}>{item.name}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 11, color: "#6B7280" }}>
                          <span>{item.price > 0 ? `R$ ${item.price}/pessoa` : "Incluído"}</span>
                          <span>·</span>
                          <span>{item.duration}</span>
                          <span>·</span>
                          <span>{item.suggestedTime}</span>
                        </div>
                        <div style={{ display: "flex", gap: 4 }}>
                          {[1, 2, 3, 4, 5].map(day => (
                            <button key={day} data-testid={`add-${item.id}-day-${day}`}
                              onClick={() => handleAddToItinerary(item, day)}
                              style={{
                                flex: 1, padding: "4px 0", borderRadius: 4, border: "1px solid #E5E7EB",
                                background: "#F9FAFB", cursor: "pointer", fontSize: 9, fontWeight: 600, color: "#6B7280",
                              }}>D{day}</button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {group.itinerary.length > 0 && (
                <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 16 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}>
                    <Calendar style={{ width: 16, height: 16, color: "#22C55E" }} /> Roteiro Montado
                  </h3>
                  {[1, 2, 3, 4, 5].map(day => {
                    const dayItems = group.itinerary.filter(i => i.day === day)
                    if (dayItems.length === 0) return null
                    return (
                      <div key={day} style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#2563EB", marginBottom: 6 }}>Dia {day}</div>
                        {dayItems.map(item => {
                          const Icon = getCatalogIcon(item.icon)
                          return (
                            <div key={item.id} data-testid={`itinerary-item-${item.id}`} style={{
                              display: "flex", alignItems: "center", gap: 8, padding: "6px 8px",
                              borderRadius: 6, background: "#F9FAFB", marginBottom: 4,
                            }}>
                              <Icon style={{ width: 14, height: 14, color: "#2563EB", flexShrink: 0 }} />
                              <span style={{ fontSize: 12, fontWeight: 500, color: "#374151", flex: 1 }}>{item.name}</span>
                              <span style={{ fontSize: 10, color: "#6B7280" }}>{item.time}</span>
                              <span style={{ fontSize: 10, fontWeight: 700, color: "#22C55E" }}>{item.price > 0 ? `R$ ${item.price}` : "Incluído"}</span>
                              <button data-testid={`remove-${item.id}`} onClick={() => handleRemoveFromItinerary(item.id)} style={{
                                background: "none", border: "none", cursor: "pointer", padding: 2,
                              }}><Trash2 style={{ width: 12, height: 12, color: "#EF4444" }} /></button>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                  <div style={{ marginTop: 8, padding: "8px 12px", borderRadius: 8, background: "#EBF5FF", display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700 }}>
                    <span style={{ color: "#374151" }}>Total do Roteiro</span>
                    <span style={{ color: "#2563EB" }}>R$ {group.itinerary.reduce((sum, i) => sum + i.price, 0)}/pessoa</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === "orders" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10 }}>
                <div style={{ background: "#fff", borderRadius: 10, padding: 12, textAlign: "center", border: "1px solid #E5E7EB" }}>
                  <div style={{ fontSize: 10, color: "#6B7280" }}>Confirmados</div>
                  <div data-testid="text-confirmed-orders" style={{ fontSize: 20, fontWeight: 800, color: "#22C55E" }}>{confirmedOrders}</div>
                </div>
                <div style={{ background: "#fff", borderRadius: 10, padding: 12, textAlign: "center", border: "1px solid #E5E7EB" }}>
                  <div style={{ fontSize: 10, color: "#6B7280" }}>Pendentes</div>
                  <div data-testid="text-pending-orders" style={{ fontSize: 20, fontWeight: 800, color: "#F59E0B" }}>{pendingOrders}</div>
                </div>
                <div style={{ background: "#fff", borderRadius: 10, padding: 12, textAlign: "center", border: "1px solid #E5E7EB" }}>
                  <div style={{ fontSize: 10, color: "#6B7280" }}>Total</div>
                  <div data-testid="text-total-orders-value" style={{ fontSize: 20, fontWeight: 800, color: "#2563EB" }}>R$ {totalOrders.toLocaleString("pt-BR")}</div>
                </div>
              </div>
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: "#F9FAFB" }}>
                        <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#6B7280", fontSize: 11 }}>ID</th>
                        <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#6B7280", fontSize: 11 }}>Membro</th>
                        <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#6B7280", fontSize: 11 }}>Item</th>
                        <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#6B7280", fontSize: 11 }}>Tipo</th>
                        <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, color: "#6B7280", fontSize: 11 }}>Valor</th>
                        <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 600, color: "#6B7280", fontSize: 11 }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.orders.length === 0 ? (
                        <tr><td colSpan={6} style={{ padding: 20, textAlign: "center", color: "#9CA3AF" }}>Nenhum pedido ainda. Selecione hotel ou monte o roteiro.</td></tr>
                      ) : group.orders.map((order, i) => (
                        <tr key={i} data-testid={`row-order-${i}`} style={{ borderTop: "1px solid #F3F4F6" }}>
                          <td style={{ padding: "10px 12px", fontWeight: 600, color: "#2563EB", fontSize: 11 }}>{order.id}</td>
                          <td style={{ padding: "10px 12px", color: "#374151" }}>{order.memberName}</td>
                          <td style={{ padding: "10px 12px", color: "#374151" }}>{order.item}</td>
                          <td style={{ padding: "10px 12px", color: "#6B7280" }}>{order.type}</td>
                          <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: "#1F2937" }}>R$ {order.value}</td>
                          <td style={{ padding: "10px 12px", textAlign: "center" }}>
                            <span style={{
                              fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                              color: order.status === "confirmed" ? "#22C55E" : order.status === "pending" ? "#F59E0B" : "#EF4444",
                              background: order.status === "confirmed" ? "#F0FDF4" : order.status === "pending" ? "#FEF3C7" : "#FEE2E2",
                            }}>
                              {order.status === "confirmed" ? "Confirmado" : order.status === "pending" ? "Pendente" : "Cancelado"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <button data-testid="button-open-chat" onClick={() => setChatOpen(!chatOpen)} style={{
        position: "fixed", bottom: 20, right: 20, zIndex: 100,
        width: 56, height: 56, borderRadius: "50%", border: "none",
        background: chatOpen ? "#EF4444" : "linear-gradient(135deg, #22C55E, #16A34A)",
        color: "#fff", cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {chatOpen ? <X style={{ width: 24, height: 24 }} /> : <MessageCircle style={{ width: 24, height: 24 }} />}
        {!chatOpen && unreadCount > 0 && (
          <div style={{
            position: "absolute", top: -2, right: -2, width: 20, height: 20, borderRadius: "50%",
            background: "#EF4444", color: "#fff", fontSize: 10, fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff",
          }}>{unreadCount}</div>
        )}
      </button>

      {chatOpen && (
        <div data-testid="chat-popup" style={{
          position: "fixed", bottom: 84, right: 20, zIndex: 150,
          width: 380, maxWidth: "calc(100vw - 32px)", height: 500, maxHeight: "calc(100vh - 120px)",
          background: "#fff", borderRadius: 16, boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          border: "1px solid #E5E7EB",
        }}>
          <div style={{
            background: "linear-gradient(135deg, #1e3a5f, #2563EB)", padding: "12px 16px",
            display: "flex", alignItems: "center", gap: 8, color: "#fff", flexShrink: 0,
          }}>
            <Bot style={{ width: 20, height: 20 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Chat - {group.name}</div>
              <div style={{ fontSize: 10, opacity: 0.8 }}>{group.messages.length} mensagens</div>
            </div>
            <button data-testid="button-close-chat" onClick={() => setChatOpen(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}>
              <X style={{ width: 18, height: 18 }} />
            </button>
          </div>

          <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: 12 }}>
            {group.messages.map(msg => (
              <div key={msg.id} style={{ display: "flex", flexDirection: msg.isMe ? "row-reverse" : "row", alignItems: "flex-start", gap: 6, marginBottom: 12 }}>
                {!msg.isMe && (
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    background: msg.isBot ? "linear-gradient(135deg, #22C55E, #16A34A)" : group.members.find(m => m.name === msg.sender)?.color || "#2563EB",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff",
                  }}>{msg.isBot ? <Bot style={{ width: 12, height: 12 }} /> : msg.sender.charAt(0)}</div>
                )}
                <div style={{ maxWidth: "80%" }}>
                  {!msg.isMe && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 10, fontWeight: 600, color: msg.isBot ? "#22C55E" : "#1F2937" }}>{msg.sender}</span>
                      {msg.isBot && <span style={{ fontSize: 8, fontWeight: 700, color: "#fff", background: "#22C55E", padding: "1px 4px", borderRadius: 3 }}>BOT</span>}
                      {msg.isOrganizer && <Crown style={{ width: 8, height: 8, color: "#F59E0B" }} />}
                      {msg.tag && <span style={{ fontSize: 8, color: "#22C55E", fontWeight: 600 }}>{msg.tag}</span>}
                    </div>
                  )}
                  <div style={{
                    padding: "8px 12px", borderRadius: 12,
                    ...(msg.isMe ? { background: "linear-gradient(135deg, #2563EB, #1D4ED8)", color: "#fff", borderTopRightRadius: 4 }
                      : msg.isBot ? { background: "#F0FDF4", color: "#1F2937", borderTopLeftRadius: 4, border: "1px solid #BBF7D0" }
                      : { background: "#F3F4F6", color: "#1F2937", borderTopLeftRadius: 4 }),
                  }}>
                    <p style={{ fontSize: 12, lineHeight: 1.5, margin: 0 }}>{msg.text}</p>
                    {msg.card && (
                      <div style={{ marginTop: 8, background: "#fff", borderRadius: 10, overflow: "hidden", border: "1px solid #E5E7EB" }}>
                        <div style={{ height: 50, background: msg.card.type === "hotel" ? "linear-gradient(135deg, #3B82F6, #1D4ED8)" : msg.card.type === "voucher" ? "linear-gradient(135deg, #F57C00, #E65100)" : "linear-gradient(135deg, #F59E0B, #D97706)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                          {msg.card.type === "voucher" ? <QrCode style={{ width: 20, height: 20, color: "rgba(255,255,255,0.5)" }} /> : <Hotel style={{ width: 20, height: 20, color: "rgba(255,255,255,0.5)" }} />}
                          {msg.card.discount && <div style={{ position: "absolute", top: 6, right: 6, background: "#EF4444", color: "#fff", padding: "1px 6px", borderRadius: 4, fontSize: 9, fontWeight: 800 }}>{msg.card.discount}</div>}
                        </div>
                        <div style={{ padding: 10 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#1F2937" }}>{msg.card.title}</div>
                          <div style={{ fontSize: 10, color: "#6B7280", marginTop: 2 }}>{msg.card.subtitle}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                            <span style={{ fontSize: 14, fontWeight: 800, color: "#22C55E" }}>{msg.card.price}</span>
                            {msg.card.oldPrice && <span style={{ fontSize: 10, color: "#9CA3AF", textDecoration: "line-through" }}>{msg.card.oldPrice}</span>}
                          </div>
                          <button data-testid={`button-cta-${msg.id}`}
                            onClick={() => { if (msg.card?.type === "voucher") setVoucherModalOpen(true) }}
                            style={{
                              marginTop: 6, width: "100%", padding: "6px 0", borderRadius: 6, border: "none",
                              background: msg.card.type === "voucher" ? "linear-gradient(135deg, #F57C00, #E65100)" : "linear-gradient(135deg, #2563EB, #1D4ED8)",
                              color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer",
                            }}>{msg.card.cta}</button>
                        </div>
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 9, color: "#9CA3AF", marginTop: 2, display: "block", textAlign: msg.isMe ? "right" : "left" }}>{msg.time}</span>
                </div>
              </div>
            ))}
            {showTyping && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #22C55E, #16A34A)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><Bot style={{ width: 12, height: 12 }} /></div>
                <div style={{ padding: "8px 14px", borderRadius: 12, borderTopLeftRadius: 4, background: "#F0FDF4", border: "1px solid #BBF7D0", display: "flex", gap: 3 }}>
                  <span style={{ fontSize: 18, animation: "bounce 1s infinite" }}>&#8226;</span>
                  <span style={{ fontSize: 18, animation: "bounce 1s infinite 0.2s" }}>&#8226;</span>
                  <span style={{ fontSize: 18, animation: "bounce 1s infinite 0.4s" }}>&#8226;</span>
                </div>
              </div>
            )}
          </div>

          <div style={{ padding: "8px 12px", borderTop: "1px solid #E5E7EB", display: "flex", gap: 6, flexShrink: 0 }}>
            <input data-testid="input-chat-message" value={message} onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSendMessage()}
              placeholder="Pergunte sobre hotel, parque, spa..."
              style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12, outline: "none" }}
            />
            <button data-testid="button-send-message" onClick={handleSendMessage} style={{
              width: 36, height: 36, borderRadius: 8, border: "none",
              background: message.trim() ? "linear-gradient(135deg, #2563EB, #1D4ED8)" : "#E5E7EB",
              color: message.trim() ? "#fff" : "#9CA3AF", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Send style={{ width: 14, height: 14 }} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
