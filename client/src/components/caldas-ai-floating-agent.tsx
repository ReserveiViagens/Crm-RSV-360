import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Sparkles, Phone, ChevronRight } from "lucide-react"

const WA_URL = "https://wa.me/5564993197555?text=Olá! Preciso de ajuda para planejar minha viagem."

type TravelProfile = "relaxamento" | "aventura" | "familia" | "romantico" | "amigos" | "negocios" | null

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
  showWhatsApp?: boolean
}

const travelOptions = [
  { id: "relaxamento", emoji: "🧘", label: "Relaxamento" },
  { id: "aventura", emoji: "🏄", label: "Aventura" },
  { id: "familia", emoji: "👨‍👩‍👧‍👦", label: "Em Família" },
  { id: "romantico", emoji: "💑", label: "Romântico" },
  { id: "amigos", emoji: "🎉", label: "Com Amigos" },
  { id: "negocios", emoji: "💼", label: "Negócios + Lazer" },
]

const profileResponses: Record<string, { greeting: string; suggestions: string[]; packages: string }> = {
  relaxamento: {
    greeting: "Que escolha incrível! Caldas Novas é o lugar perfeito para descansar a mente e o corpo. 🧘",
    suggestions: [
      "Resort Termas Paradise com spa completo — a experiência mais relaxante da cidade",
      "Lagoa Quente: piscinas termais naturais em ambiente tranquilo, longe da agitação",
      "Massagem terapêutica + ingresso no Water Park — combo ideal para desestressar",
    ],
    packages: "Temos pacotes de 2, 3 e 4 noites com café da manhã incluso e acesso às termas.",
  },
  aventura: {
    greeting: "Adrenalina e diversão em Caldas Novas! Você vai adorar as opções! 🏄",
    suggestions: [
      "Hot Park em Rio Quente — os maiores toboáguas do mundo, para quem não tem medo de emoção",
      "DiRoma Acqua Park — atrações radicais com queda livre e piscinas de ondas",
      "Combo aventura: Hot Park + DiRoma em dias diferentes com hospedagem central",
    ],
    packages: "Pacotes de aventura com 2+ parques incluídos e hospedagem estratégica.",
  },
  familia: {
    greeting: "Família merece o melhor! Caldas Novas tem opções perfeitas para todas as idades. 👨‍👩‍👧‍👦",
    suggestions: [
      "Privê Thermas Park — parque aquático privativo, área kids e segurança total para crianças",
      "Hot Park com área infantil separada — diversão para os adultos e segurança para os pequenos",
      "Lacqua DiRoma — apartamentos completos, ideal para famílias que precisam de espaço",
    ],
    packages: "Pacotes família com até 2 crianças menores de 12 anos com desconto especial.",
  },
  romantico: {
    greeting: "Uma escapada romântica em Caldas Novas? Perfeito para criar memórias inesquecíveis! 💑",
    suggestions: [
      "Resort Termas Paradise — suítes premium, spa para casal e jantar à beira da piscina termal",
      "DiRoma Fiori Resort — resort boutique com atmosfera exclusiva e serviço personalizado",
      "Pacote casal: hospedagem + ingresso VIP + jantar romântico surpresa",
    ],
    packages: "Pacotes para casais com late check-out, café na cama e experiências exclusivas.",
  },
  amigos: {
    greeting: "Viagem com a galera? Isso sim é programa bom! Caldas Novas vai agitar o grupo! 🎉",
    suggestions: [
      "Hot Park — a melhor escolha para grupos, com atrações para todos os gostos",
      "DiRoma Acqua Park + Bar Molhado — diversão o dia todo com drinks à beira da piscina",
      "Chalé ou apartamento compartilhado no Lacqua DiRoma — econômico e divertido",
    ],
    packages: "Desconto progressivo para grupos: a partir de 5 pessoas, ganhos de 10% a 25%.",
  },
  negocios: {
    greeting: "Negócios em Caldas Novas? Ótimo! Você pode misturar produtividade e relaxamento. 💼",
    suggestions: [
      "Resort Termas Paradise — salas de reunião modernas + piscinas termais para o after work",
      "DiRoma Fiori — ambiente executivo, Wi-Fi de alta velocidade e serviço discreto",
      "Pacote Business + Lazer: hospedagem premium com acesso ao parque nos intervalos",
    ],
    packages: "Negociamos diárias corporativas com NF e facilidades para equipes.",
  },
}

const getProfileResponse = (profile: string, userMsg: string, unresolvedTurns: number): { text: string; showWhatsApp: boolean; resolved: boolean } => {
  const lower = userMsg.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

  if (lower.includes("reservar") || lower.includes("comprar") || lower.includes("como faco")) {
    return {
      text: "Para reservar, você pode usar nosso site diretamente! Navegue até Ingressos ou Hotéis, escolha sua opção e siga os passos. É bem simples! 😊 Quer que eu te explique alguma etapa do processo?",
      showWhatsApp: false,
      resolved: true,
    }
  }

  if (lower.includes("preco") || lower.includes("valor") || lower.includes("quanto") || lower.includes("custo") || lower.includes("caro")) {
    return {
      text: "Os ingressos partem de R$189 e pacotes hotel + parque a partir de R$399 por pessoa. Os valores variam conforme o período e o pacote! Você quer ver as opções disponíveis agora ou quer comparar alguma data específica?",
      showWhatsApp: false,
      resolved: true,
    }
  }

  if (lower.includes("quando") || lower.includes("epoca") || lower.includes("melhor mes") || lower.includes("feriado")) {
    return {
      text: "Caldas Novas é destino para o ano todo — o clima quente garante diversão em qualquer época! Alta temporada em julho, dezembro e feriados (reserve com antecedência). Baixa temporada tem preços mais acessíveis e menos filas nos parques. 📅",
      showWhatsApp: false,
      resolved: true,
    }
  }

  if (lower.includes("cancelar") || lower.includes("reembolso") || lower.includes("cancelamento") || lower.includes("politica")) {
    return {
      text: "Entendo! Questões de cancelamento e reembolso precisam ser tratadas diretamente pela nossa equipe para garantir o processo correto conforme a política de cada produto. Vou te conectar com eles agora. 📋",
      showWhatsApp: true,
      resolved: true,
    }
  }

  if (lower.includes("nao") || lower.includes("outro") || lower.includes("diferente")) {
    return {
      text: "Sem problema! Me conte mais sobre o que você está buscando e vou tentar ajudar melhor. O que você procura para essa viagem?",
      showWhatsApp: unresolvedTurns >= 2,
      resolved: false,
    }
  }

  const fallbackTexts = [
    "Boa pergunta! Posso te ajudar melhor se você me contar o que está buscando — preços, datas, tipo de atração ou hospedagem?",
    "Entendi! Para o seu perfil, tenho ótimas sugestões. Você prefere saber mais sobre os parques, os hotéis ou os pacotes combinados?",
    "Posso te ajudar a encontrar a melhor opção! Me diga: você prefere algo mais econômico, mais completo ou está buscando uma experiência específica?",
  ]

  return {
    text: fallbackTexts[unresolvedTurns % fallbackTexts.length],
    showWhatsApp: unresolvedTurns >= 2,
    resolved: false,
  }
}

let globalOpenWizard: (() => void) | null = null

export function openCaldasAiWizard() {
  if (globalOpenWizard) globalOpenWizard()
}

export default function CaldasAiFloatingAgent() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const [pendingProfile, setPendingProfile] = useState<TravelProfile>(null)
  const [profile, setProfile] = useState<TravelProfile>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const unresolvedTurnsRef = useRef(0)
  const [balloon, setBalloon] = useState<{ visible: boolean; message: string }>({
    visible: false, message: "",
  })

  const clickCountRef = useRef(0)
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const balloonDismissedRef = useRef(false)
  const isOpenRef = useRef(isOpen)
  isOpenRef.current = isOpen

  const openWizard = useCallback(() => {
    setIsOpen(true)
    setStep(1)
    setProfile(null)
    setPendingProfile(null)
    setMessages([])
    setInputValue("")
    unresolvedTurnsRef.current = 0
  }, [])

  useEffect(() => {
    globalOpenWizard = openWizard
    return () => { globalOpenWizard = null }
  }, [openWizard])

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current)
    if (isOpenRef.current || balloonDismissedRef.current) return
    inactivityTimerRef.current = setTimeout(() => {
      if (!isOpenRef.current && !balloonDismissedRef.current) {
        setBalloon({ visible: true, message: "Posso ajudar você a escolher? 😊" })
      }
    }, 20000)
  }, [])

  useEffect(() => {
    const onInteraction = () => {
      clickCountRef.current += 1

      if (clickTimerRef.current) clearTimeout(clickTimerRef.current)
      clickTimerRef.current = setTimeout(() => { clickCountRef.current = 0 }, 10000)

      if (clickCountRef.current >= 5 && !isOpenRef.current && !balloonDismissedRef.current) {
        setBalloon({ visible: true, message: "Parece que está pesquisando bastante — posso ajudar! ✨" })
      }

      resetInactivityTimer()
    }

    document.addEventListener("click", onInteraction)
    document.addEventListener("scroll", resetInactivityTimer, { passive: true })

    resetInactivityTimer()

    return () => {
      document.removeEventListener("click", onInteraction)
      document.removeEventListener("scroll", resetInactivityTimer)
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current)
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current)
    }
  }, [resetInactivityTimer])

  useEffect(() => {
    if (isOpen) {
      setBalloon({ visible: false, message: "" })
      balloonDismissedRef.current = true
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current)
    }
  }, [isOpen])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isTyping])

  const dismissBalloon = useCallback(() => {
    setBalloon({ visible: false, message: "" })
    balloonDismissedRef.current = true
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current)
  }, [])

  const handleSelectProfile = useCallback((p: TravelProfile) => {
    setPendingProfile(p)
  }, [])

  const handleContinue = useCallback(() => {
    if (!pendingProfile) return
    setProfile(pendingProfile)
    setStep(2)
    const data = profileResponses[pendingProfile]
    const option = travelOptions.find(o => o.id === pendingProfile)
    const greeting: Message = {
      id: 1,
      text: `${data.greeting}\n\nBaseado no seu perfil ${option?.emoji} ${option?.label}, aqui estão minhas recomendações:\n\n${data.suggestions.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\n${data.packages}\n\nO que você gostaria de saber mais? Pode me perguntar sobre preços, disponibilidade ou qualquer dúvida sobre a viagem! 🌟`,
      sender: "bot",
    }
    setMessages([greeting])
  }, [pendingProfile])

  const handleSend = useCallback((text?: string) => {
    const msg = text || inputValue.trim()
    if (!msg || !profile) return
    setInputValue("")
    const userMsg: Message = { id: Date.now(), text: msg, sender: "user" }
    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)
    setTimeout(() => {
      const resp = getProfileResponse(profile, msg, unresolvedTurnsRef.current)
      if (!resp.resolved) {
        unresolvedTurnsRef.current += 1
      } else {
        unresolvedTurnsRef.current = 0
      }
      const botMsg: Message = {
        id: Date.now() + 1,
        text: resp.text,
        sender: "bot",
        showWhatsApp: resp.showWhatsApp,
      }
      setMessages(prev => [...prev, botMsg])
      setIsTyping(false)
    }, 800 + Math.random() * 600)
  }, [inputValue, profile])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setStep(1)
    setProfile(null)
    setPendingProfile(null)
    setMessages([])
    setInputValue("")
    unresolvedTurnsRef.current = 0
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  return (
    <>
      <AnimatePresence>
        {balloon.visible && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.92 }}
            transition={{ duration: 0.25 }}
            style={{ position: "fixed", bottom: 92, right: 20, zIndex: 999, maxWidth: 240 }}
            data-testid="caldas-ai-balloon"
          >
            <div style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
              padding: "12px 14px",
              border: "1px solid rgba(37,99,235,0.15)",
              position: "relative",
            }}>
              <button
                onClick={dismissBalloon}
                data-testid="balloon-dismiss"
                style={{
                  position: "absolute", top: 6, right: 8,
                  background: "none", border: "none", cursor: "pointer",
                  color: "#9CA3AF", padding: 2, lineHeight: 1,
                }}
              >
                <X size={14} />
              </button>
              <p style={{ fontSize: 13, color: "#1F2937", margin: 0, paddingRight: 16, lineHeight: 1.5 }}>
                {balloon.message}
              </p>
              <div style={{
                position: "absolute", bottom: -8, right: 28,
                width: 0, height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: "8px solid #fff",
              }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={openWizard}
        data-testid="caldas-ai-floating-btn"
        style={{
          position: "fixed", bottom: 20, right: 20, zIndex: 998,
          width: 60, height: 60, borderRadius: "50%",
          background: "linear-gradient(135deg, #2563EB 0%, #1e3a5f 100%)",
          border: "2.5px solid rgba(255,255,255,0.3)",
          boxShadow: "0 4px 24px rgba(37,99,235,0.45)",
          color: "#fff", cursor: "pointer",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 1,
        }}
        aria-label="Abrir Caldas AI"
      >
        <Sparkles size={20} />
        <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: -0.3, lineHeight: 1 }}>AI</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              style={{
                position: "fixed", inset: 0,
                background: "rgba(0,0,0,0.5)",
                zIndex: 1001,
              }}
              data-testid="caldas-ai-backdrop"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              style={{
                position: "fixed",
                bottom: 20, right: 20,
                zIndex: 1002,
                width: 380, maxWidth: "calc(100vw - 32px)",
                maxHeight: "calc(100vh - 80px)",
                borderRadius: 20, overflow: "hidden",
                boxShadow: "0 12px 60px rgba(0,0,0,0.25)",
                display: "flex", flexDirection: "column",
                background: "#fff",
              }}
              data-testid="caldas-ai-modal"
            >
              <div style={{
                background: "linear-gradient(135deg, #1e3a5f 0%, #2563EB 100%)",
                padding: "16px 18px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                flexShrink: 0,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: "50%",
                    background: "rgba(255,255,255,0.2)",
                    border: "2px solid rgba(255,255,255,0.35)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Sparkles size={20} color="#fff" />
                  </div>
                  <div>
                    <div style={{ color: "#fff", fontSize: 15, fontWeight: 800, letterSpacing: -0.3 }}>
                      Caldas AI
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 11 }}>
                      {step === 1 ? "Personalizando sua experiência" : "Seu assistente de viagem"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  data-testid="caldas-ai-close"
                  style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "rgba(255,255,255,0.15)",
                    border: "none", color: "#fff", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {step === 1 && (
                <div style={{ padding: 24, overflowY: "auto", flex: 1 }}>
                  <div style={{
                    textAlign: "center", marginBottom: 20,
                    padding: "12px 14px",
                    background: "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(30,58,95,0.06))",
                    borderRadius: 14,
                    border: "1px solid rgba(37,99,235,0.12)",
                  }}>
                    <p style={{
                      fontSize: 11, fontWeight: 700, color: "#2563EB",
                      textTransform: "uppercase", letterSpacing: 1, margin: "0 0 6px",
                    }}>
                      ✨ IA PERSONALIZANDO SUA EXPERIÊNCIA
                    </p>
                    <p style={{ fontSize: 16, fontWeight: 700, color: "#1e3a5f", margin: 0 }}>
                      Qual o tipo da sua viagem?
                    </p>
                    <p style={{ fontSize: 12, color: "#6B7280", margin: "4px 0 0" }}>
                      Escolha para receber recomendações personalizadas
                    </p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {travelOptions.map(option => {
                      const isSelected = pendingProfile === option.id
                      return (
                        <motion.button
                          key={option.id}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleSelectProfile(option.id as TravelProfile)}
                          data-testid={`travel-option-${option.id}`}
                          style={{
                            padding: "16px 12px",
                            borderRadius: 14,
                            border: isSelected ? "2px solid #2563EB" : "2px solid rgba(37,99,235,0.12)",
                            background: isSelected ? "#EFF6FF" : "#F8FAFF",
                            cursor: "pointer",
                            display: "flex", flexDirection: "column",
                            alignItems: "center", gap: 8,
                            transition: "border-color 0.2s, background 0.2s",
                          }}
                        >
                          <span style={{ fontSize: 28 }}>{option.emoji}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: isSelected ? "#2563EB" : "#1e3a5f" }}>
                            {option.label}
                          </span>
                        </motion.button>
                      )
                    })}
                  </div>

                  <motion.button
                    whileHover={{ scale: pendingProfile ? 1.02 : 1 }}
                    whileTap={{ scale: pendingProfile ? 0.98 : 1 }}
                    onClick={handleContinue}
                    disabled={!pendingProfile}
                    data-testid="wizard-continue-btn"
                    style={{
                      marginTop: 16, width: "100%",
                      padding: "13px 0", borderRadius: 12,
                      background: pendingProfile ? "linear-gradient(135deg, #2563EB, #1e3a5f)" : "#E5E7EB",
                      color: pendingProfile ? "#fff" : "#9CA3AF",
                      fontWeight: 700, fontSize: 14,
                      border: "none", cursor: pendingProfile ? "pointer" : "not-allowed",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      transition: "background 0.2s, color 0.2s",
                    }}
                  >
                    <ChevronRight size={18} />
                    Continuar
                  </motion.button>
                </div>
              )}

              {step === 2 && (
                <>
                  <div style={{
                    flex: 1, overflowY: "auto", padding: 16,
                    background: "#EFF3F8", minHeight: 0,
                  }}>
                    {messages.map(msg => (
                      <div
                        key={msg.id}
                        style={{
                          display: "flex",
                          flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                          alignItems: "flex-start",
                          gap: 8, marginBottom: 14,
                        }}
                      >
                        {msg.sender === "bot" && (
                          <div style={{
                            width: 32, height: 32, borderRadius: "50%",
                            background: "linear-gradient(135deg, #1e3a5f, #2563EB)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0,
                          }}>
                            <Sparkles size={15} color="#fff" />
                          </div>
                        )}
                        <div style={{ maxWidth: "82%" }}>
                          <div style={{
                            padding: "10px 14px", borderRadius: 16,
                            fontSize: 13, lineHeight: 1.65, whiteSpace: "pre-line",
                            ...(msg.sender === "user"
                              ? { background: "#2563EB", color: "#fff", borderTopRightRadius: 4 }
                              : { background: "#fff", color: "#1F2937", borderTopLeftRadius: 4, boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }
                            ),
                          }}>
                            {msg.text}
                          </div>
                          {msg.showWhatsApp && msg.sender === "bot" && (
                            <motion.a
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              href={WA_URL}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-testid="whatsapp-escalation-btn"
                              style={{
                                display: "flex", alignItems: "center", gap: 8,
                                marginTop: 8, padding: "9px 14px",
                                borderRadius: 10, textDecoration: "none",
                                background: "#25D366", color: "#fff",
                                fontSize: 12, fontWeight: 700,
                              }}
                            >
                              <Phone size={14} />
                              Falar com nossa equipe no WhatsApp
                            </motion.a>
                          )}
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: "50%",
                          background: "linear-gradient(135deg, #1e3a5f, #2563EB)",
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        }}>
                          <Sparkles size={15} color="#fff" />
                        </div>
                        <div style={{
                          background: "#fff", borderRadius: 16, borderTopLeftRadius: 4,
                          padding: "12px 16px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
                          display: "flex", gap: 5, alignItems: "center",
                        }}>
                          {[0, 0.2, 0.4].map((delay, i) => (
                            <motion.div
                              key={i}
                              animate={{ y: [0, -5, 0] }}
                              transition={{ repeat: Infinity, duration: 0.7, delay }}
                              style={{ width: 7, height: 7, borderRadius: "50%", background: "#9CA3AF" }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div style={{
                    padding: "12px 14px",
                    borderTop: "1px solid #E5E7EB",
                    background: "#fff",
                    display: "flex", gap: 8, alignItems: "center",
                    flexShrink: 0,
                  }}>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Digite sua dúvida..."
                      data-testid="chat-input"
                      style={{
                        flex: 1, border: "1.5px solid #E5E7EB",
                        borderRadius: 10, padding: "9px 13px",
                        fontSize: 13, outline: "none", color: "#1F2937",
                        background: "#F9FAFB",
                      }}
                      onFocus={e => (e.target.style.borderColor = "#2563EB")}
                      onBlur={e => (e.target.style.borderColor = "#E5E7EB")}
                    />
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleSend()}
                      disabled={!inputValue.trim()}
                      data-testid="chat-send-btn"
                      style={{
                        width: 38, height: 38, borderRadius: 10,
                        background: inputValue.trim() ? "linear-gradient(135deg, #2563EB, #1e3a5f)" : "#E5E7EB",
                        border: "none", cursor: inputValue.trim() ? "pointer" : "default",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, transition: "background 0.2s",
                      }}
                    >
                      <Send size={16} color={inputValue.trim() ? "#fff" : "#9CA3AF"} />
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
