import { useState, useRef, useEffect, useCallback } from "react"
import { X, Send, User, Bot, Star, ChevronRight, Mic, Camera, Menu } from "lucide-react"
import HotelDetailPanel, { HotelDetailData } from "./hotel-detail-panel"

interface CardData {
  title: string
  image: string
  location: string
  originalPrice: number
  price: number
  discount: number
  rating: number
  reviews: number
  description: string
  features: string[]
  capacity: number
}

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
  cards?: CardData[]
}

const PRODUCTS: Record<string, CardData> = {
  hot_park: {
    title: "Hot Park - Rio Quente",
    image: "https://q-xx.bstatic.com/xdata/images/hotel/max1024x768/261264812.jpg",
    location: "Rio Quente, GO",
    originalPrice: 918,
    price: 375,
    discount: 59,
    rating: 4.9,
    reviews: 2341,
    description: "O maior parque aquático de águas quentes naturais do mundo. Diversão garantida com piscinas de ondas, toboáguas radicais e rio lento. Perfeito para toda a família!",
    features: ["Piscinas Termais", "Toboáguas", "Rio Lento", "Área Kids", "Alimentação"],
    capacity: 6,
  },
  diroma: {
    title: "DiRoma Acqua Park",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/63/c5/62/photo0jpg.jpg",
    location: "Caldas Novas, GO",
    originalPrice: 780,
    price: 349,
    discount: 55,
    rating: 4.7,
    reviews: 1856,
    description: "Um dos maiores parques aquáticos de Caldas Novas com piscinas de águas quentes naturais, toboáguas emocionantes e área de lazer completa.",
    features: ["Águas Termais", "Toboáguas", "Bar Molhado", "Área Infantil", "Estacionamento"],
    capacity: 6,
  },
  water_park: {
    title: "Water Park",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/a6/2a/e9/water-park.jpg",
    location: "Caldas Novas, GO",
    originalPrice: 650,
    price: 289,
    discount: 56,
    rating: 4.6,
    reviews: 1432,
    description: "Parque aquático moderno com diversas atrações para toda a família. Piscinas termais, toboáguas e área gourmet em um só lugar.",
    features: ["Piscinas Termais", "Toboáguas", "Área Gourmet", "Wi-Fi", "Estacionamento"],
    capacity: 5,
  },
  lagoa_quente: {
    title: "Lagoa Quente",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/10/d4/f5/85/lagoa-quente.jpg",
    location: "Caldas Novas, GO",
    originalPrice: 520,
    price: 239,
    discount: 54,
    rating: 4.5,
    reviews: 987,
    description: "Complexo de lazer com piscinas naturais de águas termais em meio à natureza. Ambiente tranquilo e relaxante para toda a família.",
    features: ["Águas Termais", "Natureza", "Restaurante", "Estacionamento", "Área Kids"],
    capacity: 4,
  },
  termas_paradise: {
    title: "Resort Termas Paradise",
    image: "https://q-xx.bstatic.com/xdata/images/hotel/max1024x768/483886718.jpg",
    location: "Caldas Novas, GO",
    originalPrice: 1899,
    price: 1199,
    discount: 37,
    rating: 4.9,
    reviews: 3210,
    description: "Resort completo com piscinas de águas termais, spa, restaurante gourmet e quartos luxuosos. A melhor experiência em Caldas Novas!",
    features: ["Wi-Fi", "Café da Manhã", "Piscinas Termais", "Spa", "Restaurante", "Estacionamento"],
    capacity: 5,
  },
  prive: {
    title: "Privé Thermas Park",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/88/26/65/prive-thermas-park.jpg",
    location: "Caldas Novas, GO",
    originalPrice: 1450,
    price: 899,
    discount: 38,
    rating: 4.6,
    reviews: 2780,
    description: "Hotel resort com parque aquático privativo, águas termais naturais e infraestrutura completa para sua família.",
    features: ["Wi-Fi", "Café da Manhã", "Parque Aquático", "Restaurante", "Estacionamento", "Área Kids"],
    capacity: 6,
  },
  diroma_fiori: {
    title: "DiRoma Fiori Resort",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/a0/26/5a/diroma-fiori.jpg",
    location: "Caldas Novas, GO",
    originalPrice: 1680,
    price: 989,
    discount: 41,
    rating: 4.8,
    reviews: 2150,
    description: "Resort premium com acesso exclusivo ao DiRoma Acqua Park. Quartos amplos, piscinas termais e gastronomia de primeira.",
    features: ["Wi-Fi", "Café da Manhã", "Acesso DiRoma Park", "Spa", "Restaurante", "Estacionamento"],
    capacity: 5,
  },
  lacqua: {
    title: "Lacqua DiRoma",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/e5/45/c5/lacqua-diroma.jpg",
    location: "Caldas Novas, GO",
    originalPrice: 1350,
    price: 799,
    discount: 41,
    rating: 4.7,
    reviews: 1890,
    description: "Apartamentos completos com acesso ao complexo DiRoma. Ideal para famílias que buscam conforto e diversão.",
    features: ["Wi-Fi", "Cozinha Completa", "Acesso DiRoma Park", "Piscinas Termais", "Estacionamento"],
    capacity: 6,
  },
}

interface ResponseData {
  text: string
  cards?: CardData[]
}

const getSmartResponse = (userMessage: string): ResponseData => {
  const lower = userMessage.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

  if (lower.includes("hot park") || lower.includes("hotpark")) {
    return {
      text: "O Hot Park em Rio Quente e INCRIVEL! E o maior parque de aguas quentes naturais do mundo! Tenho um ingresso com 59% OFF - ultimas vagas!",
      cards: [PRODUCTS.hot_park],
    }
  }

  if (lower.includes("diroma fiori")) {
    return {
      text: "O DiRoma Fiori e um resort premium com acesso exclusivo ao parque! Veja esta oferta especial:",
      cards: [PRODUCTS.diroma_fiori],
    }
  }

  if (lower.includes("diroma") || lower.includes("di roma")) {
    return {
      text: "O DiRoma Acqua Park e um dos melhores de Caldas Novas! Olha esse desconto especial que consegui para voce:",
      cards: [PRODUCTS.diroma],
    }
  }

  if (lower.includes("water park") || lower.includes("waterpark")) {
    return {
      text: "O Water Park e moderno e tem atracoes para toda a familia! Confira este ingresso com preco especial:",
      cards: [PRODUCTS.water_park],
    }
  }

  if (lower.includes("lagoa quente") || lower.includes("lagoa")) {
    return {
      text: "A Lagoa Quente e perfeita para quem busca tranquilidade! Aguas termais em meio a natureza. Veja:",
      cards: [PRODUCTS.lagoa_quente],
    }
  }

  if (lower.includes("prive") || lower.includes("thermas park")) {
    return {
      text: "O Prive Thermas Park e excelente! Hotel com parque aquatico privativo. Oferta imperdivel:",
      cards: [PRODUCTS.prive],
    }
  }

  if (lower.includes("lacqua")) {
    return {
      text: "O Lacqua DiRoma oferece apartamentos completos com acesso ao parque! Otimo para familias:",
      cards: [PRODUCTS.lacqua],
    }
  }

  if (lower.includes("ingresso") || lower.includes("ticket") || lower.includes("entrada")) {
    return {
      text: "Temos ingressos para os melhores parques aquaticos de Caldas Novas! Veja as opcoes com desconto exclusivo:",
      cards: [PRODUCTS.hot_park, PRODUCTS.diroma, PRODUCTS.water_park],
    }
  }

  if (lower.includes("parque")) {
    return {
      text: "Caldas Novas tem os melhores parques aquaticos do Brasil! Confira nossos ingressos com ate 59% de desconto:",
      cards: [PRODUCTS.hot_park, PRODUCTS.diroma, PRODUCTS.water_park, PRODUCTS.lagoa_quente],
    }
  }

  if (lower.includes("promocao") || lower.includes("oferta") || lower.includes("desconto") || lower.includes("promo")) {
    return {
      text: "Separei as melhores promocoes do momento para voce! Descontos de ate 59%:",
      cards: [PRODUCTS.hot_park, PRODUCTS.termas_paradise, PRODUCTS.diroma],
    }
  }

  if (lower.includes("hotel") && (lower.includes("parque") || lower.includes("combo") || lower.includes("pacote"))) {
    return {
      text: "Combo Hotel + Parque e a melhor opcao! Economize ate 40% reservando juntos. Veja minhas recomendacoes:",
      cards: [PRODUCTS.termas_paradise, PRODUCTS.prive, PRODUCTS.diroma_fiori],
    }
  }

  if (lower.includes("hotel") || lower.includes("resort") || lower.includes("hospedagem") || lower.includes("hospedar")) {
    return {
      text: "Temos os melhores hoteis e resorts de Caldas Novas! Veja estas opcoes especiais:",
      cards: [PRODUCTS.termas_paradise, PRODUCTS.prive, PRODUCTS.diroma_fiori, PRODUCTS.lacqua],
    }
  }

  if (lower.includes("familia") || lower.includes("crianca") || lower.includes("filho") || lower.includes("kids")) {
    return {
      text: "Para familias com criancas, recomendo estes destinos com area kids e piscinas infantis:",
      cards: [PRODUCTS.hot_park, PRODUCTS.prive, PRODUCTS.diroma],
    }
  }

  if (lower.includes("casal") || lower.includes("romantico") || lower.includes("lua de mel") || lower.includes("namorado")) {
    return {
      text: "Para casais, tenho opcoes romanticas com spa e experiencias exclusivas:",
      cards: [PRODUCTS.termas_paradise, PRODUCTS.diroma_fiori],
    }
  }

  if (lower.includes("barato") || lower.includes("economico") || lower.includes("mais barato") || lower.includes("orcamento")) {
    return {
      text: "Pensando no seu bolso! Veja as opcoes com melhor custo-beneficio:",
      cards: [PRODUCTS.lagoa_quente, PRODUCTS.water_park, PRODUCTS.diroma],
    }
  }

  if (lower.includes("luxo") || lower.includes("premium") || lower.includes("melhor hotel") || lower.includes("5 estrelas")) {
    return {
      text: "Para uma experiencia premium em Caldas Novas, estas sao as melhores opcoes:",
      cards: [PRODUCTS.termas_paradise, PRODUCTS.diroma_fiori],
    }
  }

  if (lower.includes("caldas novas") || lower.includes("caldas") || lower.includes("rio quente")) {
    return {
      text: "Caldas Novas e Rio Quente sao destinos incriveis! Aguas termais, parques aquaticos e muito mais. Veja minhas sugestoes:",
      cards: [PRODUCTS.hot_park, PRODUCTS.termas_paradise, PRODUCTS.diroma],
    }
  }

  if (lower.includes("preco") || lower.includes("valor") || lower.includes("quanto custa") || lower.includes("custo")) {
    return {
      text: "Os precos variam conforme o destino e epoca. Veja nossas melhores ofertas com precos especiais:",
      cards: [PRODUCTS.hot_park, PRODUCTS.termas_paradise, PRODUCTS.prive],
    }
  }

  if (lower.includes("reserva") || lower.includes("reservar") || lower.includes("comprar")) {
    return {
      text: "Para reservar, basta clicar em 'Ver Detalhes e Reservar' no card abaixo! Ou fale direto pelo WhatsApp: (64) 99319-7555",
      cards: [PRODUCTS.termas_paradise],
    }
  }

  if (lower.includes("ola") || lower.includes("oi") || lower.includes("bom dia") || lower.includes("boa tarde") || lower.includes("boa noite") || lower.includes("hey") || lower.includes("eai")) {
    return {
      text: "Ola! Sou o Alex, seu Especialista RSV360! Estou aqui para encontrar o destino perfeito em Caldas Novas para voce. O que voce procura? Hoteis, parques, ingressos ou promocoes?",
    }
  }

  if (lower.includes("contato") || lower.includes("telefone") || lower.includes("ligar") || lower.includes("atendente") || lower.includes("humano") || lower.includes("pessoa")) {
    return {
      text: "Nosso time esta pronto para atender!\n\nWhatsApp: (64) 99319-7555\nWhatsApp 2: (64) 99306-8752\nTelefone: (65) 2127-0415\n\nOu continue aqui comigo que posso ajudar!",
    }
  }

  if (lower.includes("whatsapp") || lower.includes("zap") || lower.includes("wpp")) {
    return {
      text: "Nossos canais WhatsApp:\n(64) 99319-7555\n(64) 99306-8752\n(65) 99235-1207\n(65) 99204-8814\n\nEstamos online agora!",
    }
  }

  if (lower.includes("ajuda") || lower.includes("help") || lower.includes("o que voce faz") || lower.includes("como funciona")) {
    return {
      text: "Posso ajudar voce com:\n\n- Hoteis e Resorts em Caldas Novas\n- Ingressos para Parques Aquaticos\n- Promocoes e Descontos Exclusivos\n- Pacotes Hotel + Parque\n- Dicas de Viagem\n\nO que voce gostaria de saber?",
    }
  }

  if (lower.includes("obrigad") || lower.includes("valeu") || lower.includes("vlw") || lower.includes("thanks")) {
    return {
      text: "Por nada! Estou sempre aqui para ajudar. Se precisar de mais alguma coisa sobre Caldas Novas, e so perguntar!",
    }
  }

  if (lower.includes("piscina") || lower.includes("termal") || lower.includes("agua quente")) {
    return {
      text: "Caldas Novas e famosa pelas aguas termais naturais! Todos esses destinos tem piscinas de aguas quentes:",
      cards: [PRODUCTS.hot_park, PRODUCTS.termas_paradise, PRODUCTS.lagoa_quente],
    }
  }

  if (lower.includes("toboagua") || lower.includes("radical") || lower.includes("adrenalina")) {
    return {
      text: "Para quem gosta de emocao, esses parques tem os melhores toboaguas:",
      cards: [PRODUCTS.hot_park, PRODUCTS.diroma, PRODUCTS.water_park],
    }
  }

  if (lower.includes("spa") || lower.includes("relaxar") || lower.includes("descanso") || lower.includes("tranquilo")) {
    return {
      text: "Para relaxar e descansar, recomendo estes destinos com spa e ambiente tranquilo:",
      cards: [PRODUCTS.termas_paradise, PRODUCTS.lagoa_quente],
    }
  }

  if (lower.includes("grupo") || lower.includes("amigos") || lower.includes("excursao") || lower.includes("turma")) {
    return {
      text: "Para grupos e turmas temos condicoes especiais! Veja os melhores destinos para grupos:",
      cards: [PRODUCTS.hot_park, PRODUCTS.prive, PRODUCTS.diroma],
    }
  }

  return {
    text: "Que otimo que voce se interessa por Caldas Novas! Posso ajudar com hoteis, parques, ingressos ou promocoes. Veja uma das nossas ofertas mais procuradas:",
    cards: [PRODUCTS.hot_park],
  }
}

const quickQuestions = [
  "Ingressos Hot Park",
  "Hoteis em Caldas Novas",
  "Promocoes do dia",
  "Hotel + Parque",
]

interface ChatAgentProps {
  defaultOpen?: boolean
  onOpenHotelDetail?: (hotel: HotelDetailData) => void
}

export default function ChatAgent({ defaultOpen = false, onOpenHotelDetail }: ChatAgentProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Ola! Sou o Alex, seu Especialista RSV360! Estou aqui para encontrar o destino perfeito em Caldas Novas para voce. O que voce procura?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)
  const [internalSelectedHotel, setInternalSelectedHotel] = useState<HotelDetailData | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })

  useEffect(() => { scrollToBottom() }, [messages])

  useEffect(() => {
    if (!isOpen && messages.length > 1 && messages[messages.length - 1].sender === "bot") setHasUnread(true)
  }, [messages, isOpen])

  const handleSendMessage = useCallback((text?: string) => {
    const msg = text || inputValue.trim()
    if (!msg) return
    setMessages((prev) => [...prev, { id: prev.length + 1, text: msg, sender: "user", timestamp: new Date() }])
    setInputValue("")
    setIsTyping(true)
    setTimeout(() => {
      const resp = getSmartResponse(msg)
      setMessages((prev) => [...prev, {
        id: prev.length + 1,
        text: resp.text,
        sender: "bot",
        timestamp: new Date(),
        cards: resp.cards,
      }])
      setIsTyping(false)
    }, 800 + Math.random() * 800)
  }, [inputValue])

  const formatPrice = (p: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(p)

  const openDetail = (card: CardData) => {
    const hotelData: HotelDetailData = {
      id: card.title.toLowerCase().replace(/\s+/g, "-"),
      title: card.title,
      description: card.description,
      images: [card.image],
      stars: Math.round(card.rating),
      location: card.location,
      price: card.price,
      originalPrice: card.originalPrice,
      features: card.features,
      capacity: card.capacity,
      rating: card.rating,
      reviews: card.reviews,
    }
    if (onOpenHotelDetail) {
      onOpenHotelDetail(hotelData)
    } else {
      setInternalSelectedHotel(hotelData)
    }
  }

  return (
    <>
      {isOpen && (
        <div style={{
          position: "fixed", bottom: 80, left: 16, width: 380, maxWidth: "calc(100vw - 32px)",
          borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.2)", zIndex: 50,
          background: "#fff", animation: "slideInFromBottom 0.3s ease-out",
          display: "flex", flexDirection: "column", maxHeight: "calc(100vh - 120px)",
        }}>
          <div style={{
            background: "linear-gradient(135deg, #1e3a5f 0%, #2563EB 100%)",
            padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 42, height: 42, borderRadius: "50%", background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid rgba(255,255,255,0.3)",
              }}>
                <Bot style={{ width: 22, height: 22, color: "#fff" }} />
              </div>
              <div>
                <div style={{ color: "#fff", fontSize: 15, fontWeight: 700 }}>Alex</div>
                <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 11 }}>Seu Especialista RSV360</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%", background: "#22C55E",
                boxShadow: "0 0 6px #22C55E",
              }} />
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, marginRight: 8 }}>Online</span>
              <button onClick={() => setIsOpen(false)} style={{
                width: 32, height: 32, borderRadius: "50%", border: "none",
                background: "rgba(255,255,255,0.15)", color: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}><X style={{ width: 16, height: 16 }} /></button>
            </div>
          </div>

          <div style={{
            flex: 1, overflowY: "auto", padding: 16, background: "#EFF3F8",
            minHeight: 300, maxHeight: 400,
          }} className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} style={{
                display: "flex", flexDirection: message.sender === "user" ? "row-reverse" : "row",
                alignItems: "flex-start", gap: 8, marginBottom: 14,
              }} className="chat-fade-in">
                {message.sender === "bot" && (
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                    background: "#1e3a5f",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Bot style={{ width: 16, height: 16, color: "#fff" }} />
                  </div>
                )}
                <div style={{ maxWidth: message.cards ? "85%" : "78%" }}>
                  {message.sender === "bot" && message.id === 1 && (
                    <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 4, fontWeight: 600 }}>
                      Alex - Seu Especialista RSV360
                    </div>
                  )}
                  <div style={{
                    padding: "10px 14px", borderRadius: 16,
                    ...(message.sender === "user"
                      ? { background: "#2563EB", color: "#fff", borderTopRightRadius: 4 }
                      : { background: "#fff", color: "#1F2937", borderTopLeftRadius: 4, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }
                    ),
                  }}>
                    <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0, whiteSpace: "pre-line" }}>{message.text}</p>
                  </div>

                  {message.cards && message.cards.map((card, idx) => (
                    <div key={idx} style={{
                      background: "#fff", borderRadius: 14, overflow: "hidden", marginTop: 8,
                      boxShadow: "0 2px 10px rgba(0,0,0,0.08)", border: "1px solid #E5E7EB",
                    }}>
                      <div style={{ position: "relative", height: 110, overflow: "hidden" }}>
                        <img
                          src={card.image}
                          alt={card.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none"
                            const parent = (e.target as HTMLImageElement).parentElement
                            if (parent) parent.style.background = "linear-gradient(135deg, #2563EB, #1e3a5f)"
                          }}
                        />
                        <div style={{
                          position: "absolute", top: 8, right: 8,
                          background: "#EF4444", color: "#fff",
                          padding: "3px 8px", borderRadius: 6,
                          fontSize: 11, fontWeight: 800,
                        }}>
                          -{card.discount}%
                        </div>
                      </div>
                      <div style={{ padding: 12 }}>
                        <h4 style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", margin: "0 0 4px" }}>
                          {card.title}
                        </h4>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
                          <Star style={{ width: 12, height: 12, fill: "#FBBF24", color: "#FBBF24" }} />
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{card.rating}</span>
                          <span style={{ fontSize: 11, color: "#9CA3AF" }}>({card.reviews})</span>
                          <span style={{ fontSize: 11, color: "#9CA3AF", marginLeft: 4 }}>{card.location}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
                          <span style={{ fontSize: 12, color: "#9CA3AF", textDecoration: "line-through" }}>
                            {formatPrice(card.originalPrice)}
                          </span>
                          <span style={{ fontSize: 18, fontWeight: 800, color: "#22C55E" }}>
                            {formatPrice(card.price)}
                          </span>
                        </div>
                        <button
                          onClick={() => openDetail(card)}
                          style={{
                            width: "100%", padding: "10px 0", borderRadius: 10, border: "none",
                            background: "linear-gradient(135deg, #2563EB, #1e3a5f)",
                            color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                            transition: "opacity 0.2s",
                          }}
                        >
                          Ver Detalhes e Reservar
                          <ChevronRight style={{ width: 14, height: 14 }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 14 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", background: "#1e3a5f",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Bot style={{ width: 16, height: 16, color: "#fff" }} />
                </div>
                <div style={{
                  background: "#fff", borderRadius: 16, borderTopLeftRadius: 4,
                  padding: "12px 18px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}>
                  <div style={{ display: "flex", gap: 5 }}>
                    <div className="typing-dot" style={{ width: 7, height: 7, background: "#9CA3AF", borderRadius: "50%" }} />
                    <div className="typing-dot" style={{ width: 7, height: 7, background: "#9CA3AF", borderRadius: "50%" }} />
                    <div className="typing-dot" style={{ width: 7, height: 7, background: "#9CA3AF", borderRadius: "50%" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 2 && (
            <div style={{ padding: "10px 16px", background: "#fff", borderTop: "1px solid #E5E7EB" }}>
              <p style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 6, fontWeight: 600 }}>Perguntas frequentes:</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {quickQuestions.map((q, i) => (
                  <button key={i} onClick={() => handleSendMessage(q)} style={{
                    padding: "8px 10px", borderRadius: 10, border: "1px solid #E5E7EB",
                    background: "#F8FAFC", color: "#374151", fontSize: 11, cursor: "pointer",
                    textAlign: "left", transition: "all 0.2s", fontWeight: 500,
                  }}>{q}</button>
                ))}
              </div>
            </div>
          )}

          <div style={{ padding: "12px 16px", background: "#fff", borderTop: "1px solid #E5E7EB" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Envie uma mensagem..."
                style={{
                  flex: 1, padding: "11px 14px", borderRadius: 12, border: "1px solid #E5E7EB",
                  fontSize: 13, outline: "none", background: "#F8FAFC",
                }}
              />
              <button onClick={() => handleSendMessage()} style={{
                width: 42, height: 42, borderRadius: 12, border: "none",
                background: "linear-gradient(135deg, #2563EB, #1e3a5f)",
                color: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <Send style={{ width: 16, height: 16 }} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => { setIsOpen(!isOpen); if (!isOpen) setHasUnread(false) }}
        style={{
          position: "fixed", bottom: 24, left: 16, width: 56, height: 56,
          borderRadius: "50%", border: "none",
          background: "linear-gradient(135deg, #1e3a5f, #2563EB)",
          boxShadow: "0 4px 16px rgba(37,99,235,0.4)", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50,
          transition: "transform 0.2s",
        }}
      >
        {isOpen
          ? <X style={{ width: 24, height: 24, color: "#fff" }} />
          : <>
              <Bot style={{ width: 24, height: 24, color: "#fff" }} />
              {hasUnread && (
                <span style={{
                  position: "absolute", top: -2, right: -2, width: 16, height: 16,
                  background: "#EF4444", borderRadius: "50%", border: "2px solid #fff",
                }} />
              )}
            </>
        }
      </button>

      {internalSelectedHotel && (
        <HotelDetailPanel hotel={internalSelectedHotel} onClose={() => setInternalSelectedHotel(null)} />
      )}
    </>
  )
}
