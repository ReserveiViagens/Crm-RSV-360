import { useState, useEffect, useRef } from "react"
import {
  ArrowLeft, ArrowRight, Copy, Check, Clock, AlertCircle, CheckCircle2,
  XCircle, Loader2, ShoppingCart, Phone, CreditCard, Smartphone, Search,
  Mail, User, MapPin, Lock,
} from "lucide-react"
import { Link, useLocation } from "wouter"
import { useQuery, useMutation } from "@tanstack/react-query"
import { getCart, getCartTotal, clearCart, getSelectedDate, type CartItem } from "@/lib/cart-store"
import { trackEvent } from "@/lib/analytics"
import { apiRequest } from "@/lib/queryClient"
import { IngressosSidebar } from "@/components/IngressosSidebar"

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)
}

function formatCpf(v: string) {
  return v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
}

function formatPhone(v: string) {
  return v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2")
}

function formatCep(v: string) {
  return v.replace(/\D/g, "").slice(0, 8)
    .replace(/(\d{5})(\d{1,3})$/, "$1-$2")
}

function formatCardNumber(v: string) {
  return v.replace(/\D/g, "").slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim()
}

function formatCardExpiry(v: string) {
  return v.replace(/\D/g, "").slice(0, 4)
    .replace(/(\d{2})(\d{1,2})/, "$1/$2")
}

type CheckoutStep = "email" | "dados" | "pagamento"
type PaymentMethod = "pix" | "cartao" | "apple-pay"
type PaymentStatus = "PENDING" | "APPROVED" | "EXPIRED" | "FAILED" | "CANCELLED"

interface PaymentData {
  transactionId: string
  status: PaymentStatus
  qrCodeBase64: string
  copyPasteCode: string
  expirationDate: string
  totalAmount: number
  items: CartItem[]
  demo: boolean
}

interface FormState {
  email: string
  firstName: string
  lastName: string
  phone: string
  cpf: string
  country: string
  cep: string
  estado: string
  cidade: string
  endereco: string
  numero: string
  bairro: string
  complemento: string
  cupom: string
}

interface CardState {
  number: string
  holderName: string
  expiry: string
  cvv: string
}

const STEP_LABELS: { key: CheckoutStep; label: string; icon: typeof Mail }[] = [
  { key: "email", label: "E-mail", icon: Mail },
  { key: "dados", label: "Dados", icon: User },
  { key: "pagamento", label: "Pagamento", icon: CreditCard },
]

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== "undefined" ? window.innerWidth >= 768 : true)
  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 768)
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])
  return isDesktop
}

function ProgressBar({ step }: { step: CheckoutStep }) {
  const stepIndex = STEP_LABELS.findIndex((s) => s.key === step)
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, padding: "0 4px" }}>
      {STEP_LABELS.map((s, idx) => {
        const done = idx < stepIndex
        const active = idx === stepIndex
        return (
          <div key={s.key} style={{ display: "flex", alignItems: "center", flex: idx < STEP_LABELS.length - 1 ? 1 : 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: done ? "#22C55E" : active ? "#fff" : "rgba(255,255,255,0.3)",
                color: done ? "#fff" : active ? "#2563EB" : "rgba(255,255,255,0.6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 800,
                border: active ? "none" : done ? "none" : "1.5px solid rgba(255,255,255,0.4)",
                transition: "all 0.3s",
              }}>
                {done ? <Check style={{ width: 16, height: 16 }} /> : idx + 1}
              </div>
              <span style={{
                fontSize: 10, fontWeight: active ? 700 : 500,
                color: active ? "#fff" : done ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)",
                marginTop: 4, whiteSpace: "nowrap",
              }}>
                {s.label}
              </span>
            </div>
            {idx < STEP_LABELS.length - 1 && (
              <div style={{
                flex: 1, height: 2, margin: "0 8px",
                background: done ? "#22C55E" : "rgba(255,255,255,0.25)",
                borderRadius: 2, marginBottom: 16, transition: "background 0.3s",
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

function InputField({
  label, value, onChange, placeholder, type = "text", error, disabled, rightEl, testId,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; error?: string; disabled?: boolean;
  rightEl?: React.ReactNode; testId?: string;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          data-testid={testId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            width: "100%", padding: rightEl ? "12px 48px 12px 14px" : "12px 14px",
            border: `1.5px solid ${error ? "#EF4444" : "#E5E7EB"}`,
            borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box",
            color: "#1F2937", background: disabled ? "#F9FAFB" : "#fff",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => { if (!error) e.currentTarget.style.borderColor = "#2563EB" }}
          onBlur={(e) => { if (!error) e.currentTarget.style.borderColor = "#E5E7EB" }}
        />
        {rightEl && (
          <div style={{
            position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
          }}>
            {rightEl}
          </div>
        )}
      </div>
      {error && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#EF4444" }}>{error}</p>}
    </div>
  )
}

export default function IngressosCheckoutPage() {
  const [, navigate] = useLocation()
  const isDesktop = useIsDesktop()
  const [cart] = useState<CartItem[]>(() => getCart())
  const [selectedDate] = useState<Date | null>(() => getSelectedDate())
  const [step, setStep] = useState<CheckoutStep>("email")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix")
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [copied, setCopied] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(30 * 60)
  const [cepLoading, setCepLoading] = useState(false)
  const [cepError, setCepError] = useState("")
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [form, setForm] = useState<FormState>({
    email: "", firstName: "", lastName: "", phone: "",
    cpf: "", country: "Brasil", cep: "", estado: "",
    cidade: "", endereco: "", numero: "", bairro: "",
    complemento: "", cupom: "",
  })

  const [card, setCard] = useState<CardState>({
    number: "", holderName: "", expiry: "", cvv: "",
  })

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormState | keyof CardState, string>>>({})

  const total = getCartTotal(cart)

  useEffect(() => {
    if (cart.length === 0) navigate("/ingressos")
    trackEvent("checkout_view", { step: "email" })
  }, [])

  useEffect(() => {
    if (step !== "pagamento" || paymentMethod !== "pix" || !paymentData) return
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current!); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  }, [step, paymentMethod, paymentData])

  const createPaymentMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        items: cart.map((c) => ({
          ticketId: c.ticketId, title: c.name,
          quantity: c.quantity, unitPrice: c.unitPrice,
        })),
        customer: {
          name: `${form.firstName.trim()} ${form.lastName.trim()}`,
          email: form.email.trim(),
          cpf: form.cpf.replace(/\D/g, ""),
          phone: form.phone.replace(/\D/g, ""),
        },
      }
      const res = await apiRequest("POST", "/api/payments/tickets/create", payload)
      return res.json() as Promise<PaymentData>
    },
    onSuccess: (data) => {
      setPaymentData(data)
      const expMs = new Date(data.expirationDate).getTime()
      const diffSec = Math.max(0, Math.floor((expMs - Date.now()) / 1000))
      setSecondsLeft(diffSec)
      trackEvent("pix_qr_visible", { transactionId: data.transactionId })
    },
  })

  const { data: statusData } = useQuery({
    queryKey: ["/api/payments/tickets", paymentData?.transactionId, "status"],
    queryFn: async () => {
      const res = await fetch(`/api/payments/tickets/${paymentData!.transactionId}/status`)
      return res.json() as Promise<{ status: PaymentStatus; paid: boolean }>
    },
    enabled: !!paymentData && step === "pagamento" && paymentMethod === "pix" && paymentData?.status !== "APPROVED",
    refetchInterval: 3000,
  })

  useEffect(() => {
    if (!statusData) return
    if (statusData.paid || statusData.status === "APPROVED") {
      trackEvent("pix_payment_confirmed", { transactionId: paymentData?.transactionId })
      clearCart()
      navigate(`/ingressos/sucesso?txn=${paymentData?.transactionId}`)
    }
  }, [statusData])

  async function fetchViaCep() {
    const clean = form.cep.replace(/\D/g, "")
    if (clean.length !== 8) { setCepError("CEP inválido (8 dígitos)"); return }
    setCepLoading(true)
    setCepError("")
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`)
      const data = await res.json()
      if (data.erro) { setCepError("CEP não encontrado"); return }
      setForm((prev) => ({
        ...prev,
        estado: data.uf || prev.estado,
        cidade: data.localidade || prev.cidade,
        endereco: data.logradouro || prev.endereco,
        bairro: data.bairro || prev.bairro,
      }))
    } catch {
      setCepError("Erro ao buscar CEP. Tente novamente.")
    } finally {
      setCepLoading(false)
    }
  }

  function updateForm(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validateEmail(): boolean {
    const errors: typeof formErrors = {}
    if (!form.email.trim() || !form.email.includes("@")) errors.email = "E-mail válido é obrigatório"
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  function validateDados(): boolean {
    const errors: typeof formErrors = {}
    if (!form.firstName.trim()) errors.firstName = "Nome obrigatório"
    if (!form.lastName.trim()) errors.lastName = "Sobrenome obrigatório"
    const phoneDigits = form.phone.replace(/\D/g, "")
    if (phoneDigits.length < 10) errors.phone = "Telefone inválido"
    const cpfDigits = form.cpf.replace(/\D/g, "")
    if (cpfDigits.length !== 11) errors.cpf = "CPF deve ter 11 dígitos"
    const cepDigits = form.cep.replace(/\D/g, "")
    if (cepDigits.length !== 8) errors.cep = "CEP inválido"
    if (!form.numero.trim()) errors.numero = "Número obrigatório"
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  function handleNextEmail() {
    if (!validateEmail()) return
    trackEvent("checkout_step_email_done")
    setStep("dados")
  }

  function handleNextDados() {
    if (!validateDados()) return
    trackEvent("checkout_step_dados_done")
    setStep("pagamento")
  }

  function handleConfirmPayment() {
    if (paymentMethod === "pix") {
      createPaymentMutation.mutate()
    } else if (paymentMethod === "cartao") {
      trackEvent("checkout_card_simulated")
    }
  }

  function handleCopy() {
    if (!paymentData) return
    navigator.clipboard.writeText(paymentData.copyPasteCode)
    setCopied(true)
    trackEvent("pix_code_copy", { transactionId: paymentData.transactionId })
    setTimeout(() => setCopied(false), 3000)
  }

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0")
  const seconds = String(secondsLeft % 60).padStart(2, "0")
  const isExpired = secondsLeft === 0
  const currentStatus = statusData?.status ?? paymentData?.status ?? "PENDING"

  if (cart.length === 0) return null

  const sidebarProps = {
    cart,
    total,
    selectedDate,
    onCheckout: () => {},
  }

  const isAppleDevice = /iPhone|iPad|Mac/.test(navigator.userAgent)

  return (
    <div className="rsv-subpage" style={{ background: "#F8FAFC", minHeight: "100vh" }}>
      <div style={{
        background: "linear-gradient(135deg, #0891B2 0%, #2563EB 100%)",
        color: "#fff", padding: "20px 20px 24px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <button
            onClick={() => {
              if (step === "email") navigate("/ingressos")
              else if (step === "dados") setStep("email")
              else if (step === "pagamento" && !paymentData) setStep("dados")
            }}
            data-testid="link-back-checkout"
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#fff", display: "flex", alignItems: "center", padding: 0,
            }}
          >
            <ArrowLeft style={{ width: 22, height: 22 }} />
          </button>
          <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }} data-testid="text-checkout-title">
            {step === "email" ? "Seu E-mail" : step === "dados" ? "Seus Dados" : "Pagamento"}
          </h1>
        </div>
        <ProgressBar step={step} />
      </div>

      <div style={{
        display: "flex", alignItems: "flex-start",
        maxWidth: isDesktop ? 1100 : undefined,
        margin: isDesktop ? "0 auto" : undefined,
      }}>
        <div style={{ flex: 1, minWidth: 0, padding: isDesktop ? "24px 0 24px 24px" : "0" }}>
          <div style={{ padding: isDesktop ? 0 : 16, maxWidth: 560 }}>

            {step === "email" && (
              <div style={{
                background: "#fff", borderRadius: 16, padding: 24,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }} data-testid="card-email-step">
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: "50%",
                    background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 12px",
                  }}>
                    <Mail style={{ width: 26, height: 26, color: "#2563EB" }} />
                  </div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 6px", color: "#1F2937" }}>
                    Como você quer entrar?
                  </h2>
                  <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
                    Informe seu e-mail para continuar com a compra
                  </p>
                </div>

                <button
                  data-testid="button-continue-google"
                  style={{
                    width: "100%", padding: "13px 0", border: "1.5px solid #E5E7EB",
                    borderRadius: 12, background: "#fff", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 12,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    transition: "box-shadow 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.10)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)")}
                  onClick={() => {
                    trackEvent("checkout_google_click")
                    if (!form.email) setForm(prev => ({ ...prev, email: "usuario@gmail.com" }))
                    setTimeout(() => setStep("dados"), 300)
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  Continuar com Google
                </button>

                <button
                  data-testid="button-continue-apple"
                  style={{
                    width: "100%", padding: "13px 0", border: "none",
                    borderRadius: 12, background: "#000", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 20,
                  }}
                  onClick={() => {
                    trackEvent("checkout_apple_click")
                    if (!form.email) setForm(prev => ({ ...prev, email: "usuario@icloud.com" }))
                    setTimeout(() => setStep("dados"), 300)
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 814 1000" fill="white">
                    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105.3-57.4-155.5-127.4C46 790.7 0 663 0 541.8c0-194.3 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
                  </svg>
                  Continuar com Apple
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
                  <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 600 }}>ou com seu e-mail</span>
                  <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
                </div>

                <InputField
                  label="E-mail"
                  type="email"
                  value={form.email}
                  onChange={(v) => updateForm("email", v)}
                  placeholder="seu@email.com.br"
                  error={formErrors.email}
                  testId="input-email"
                />

                <button
                  data-testid="button-next-email"
                  onClick={handleNextEmail}
                  style={{
                    width: "100%", padding: "14px 0", border: "none", borderRadius: 12,
                    background: "linear-gradient(135deg, #0891B2, #2563EB)",
                    color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}
                >
                  Continuar
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </button>

                <p style={{ margin: "12px 0 0", fontSize: 11, color: "#9CA3AF", textAlign: "center" }}>
                  <Lock style={{ width: 11, height: 11, display: "inline", marginRight: 4, verticalAlign: "middle" }} />
                  Seus dados são protegidos e não serão compartilhados
                </p>
              </div>
            )}

            {step === "dados" && (
              <div style={{
                background: "#fff", borderRadius: 16, padding: 24,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }} data-testid="card-dados-step">
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 20px", color: "#1F2937" }}>
                  Dados Pessoais e Endereço
                </h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
                  <InputField
                    label="Primeiro Nome *"
                    value={form.firstName}
                    onChange={(v) => updateForm("firstName", v)}
                    placeholder="João"
                    error={formErrors.firstName}
                    testId="input-firstName"
                  />
                  <InputField
                    label="Último Nome *"
                    value={form.lastName}
                    onChange={(v) => updateForm("lastName", v)}
                    placeholder="Silva"
                    error={formErrors.lastName}
                    testId="input-lastName"
                  />
                </div>

                <InputField
                  label="Telefone com DDD *"
                  type="tel"
                  value={form.phone}
                  onChange={(v) => updateForm("phone", formatPhone(v))}
                  placeholder="(65) 99999-0000"
                  error={formErrors.phone}
                  testId="input-phone"
                />

                <InputField
                  label="CPF *"
                  value={form.cpf}
                  onChange={(v) => updateForm("cpf", formatCpf(v))}
                  placeholder="000.000.000-00"
                  error={formErrors.cpf}
                  testId="input-cpf"
                />

                <div style={{ borderTop: "1px solid #F3F4F6", margin: "4px 0 16px" }} />
                <h4 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 14px", color: "#374151" }}>
                  Endereço
                </h4>

                <InputField
                  label="País"
                  value={form.country}
                  onChange={(v) => updateForm("country", v)}
                  disabled
                  testId="input-country"
                />

                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>
                    CEP *
                  </label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      data-testid="input-cep"
                      type="text"
                      value={form.cep}
                      onChange={(e) => {
                        updateForm("cep", formatCep(e.target.value))
                        setCepError("")
                      }}
                      onKeyDown={(e) => { if (e.key === "Enter") fetchViaCep() }}
                      placeholder="00000-000"
                      style={{
                        flex: 1, padding: "12px 14px",
                        border: `1.5px solid ${(formErrors.cep || cepError) ? "#EF4444" : "#E5E7EB"}`,
                        borderRadius: 10, fontSize: 14, outline: "none", color: "#1F2937",
                      }}
                    />
                    <button
                      data-testid="button-search-cep"
                      onClick={fetchViaCep}
                      disabled={cepLoading}
                      style={{
                        padding: "12px 16px", border: "none", borderRadius: 10,
                        background: cepLoading ? "#9CA3AF" : "#2563EB",
                        color: "#fff", fontWeight: 700, fontSize: 13,
                        cursor: cepLoading ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
                      }}
                    >
                      {cepLoading
                        ? <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />
                        : <Search style={{ width: 16, height: 16 }} />
                      }
                      {cepLoading ? "Buscando..." : "Buscar"}
                    </button>
                  </div>
                  {(formErrors.cep || cepError) && (
                    <p style={{ margin: "4px 0 0", fontSize: 11, color: "#EF4444" }}>{formErrors.cep || cepError}</p>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
                  <InputField
                    label="Estado"
                    value={form.estado}
                    onChange={(v) => updateForm("estado", v)}
                    placeholder="GO"
                    testId="input-estado"
                  />
                  <InputField
                    label="Cidade"
                    value={form.cidade}
                    onChange={(v) => updateForm("cidade", v)}
                    placeholder="Caldas Novas"
                    testId="input-cidade"
                  />
                </div>

                <InputField
                  label="Logradouro"
                  value={form.endereco}
                  onChange={(v) => updateForm("endereco", v)}
                  placeholder="Rua, Avenida..."
                  testId="input-endereco"
                />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0 12px" }}>
                  <InputField
                    label="Número *"
                    value={form.numero}
                    onChange={(v) => updateForm("numero", v)}
                    placeholder="123"
                    error={formErrors.numero}
                    testId="input-numero"
                  />
                  <InputField
                    label="Bairro"
                    value={form.bairro}
                    onChange={(v) => updateForm("bairro", v)}
                    placeholder="Centro"
                    testId="input-bairro"
                  />
                </div>

                <InputField
                  label="Complemento"
                  value={form.complemento}
                  onChange={(v) => updateForm("complemento", v)}
                  placeholder="Apto, Sala... (opcional)"
                  testId="input-complemento"
                />

                <div style={{ borderTop: "1px solid #F3F4F6", margin: "4px 0 16px" }} />

                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>
                    Cupom de desconto
                  </label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      data-testid="input-cupom"
                      type="text"
                      value={form.cupom}
                      onChange={(e) => updateForm("cupom", e.target.value.toUpperCase())}
                      placeholder="Ex: RSV10"
                      style={{
                        flex: 1, padding: "12px 14px",
                        border: "1.5px solid #E5E7EB",
                        borderRadius: 10, fontSize: 14, outline: "none", color: "#1F2937",
                        fontFamily: "monospace", letterSpacing: 1,
                      }}
                    />
                    <button
                      data-testid="button-apply-cupom"
                      style={{
                        padding: "12px 16px", border: "none", borderRadius: 10,
                        background: "#F3F4F6", color: "#374151",
                        fontWeight: 700, fontSize: 13, cursor: "pointer",
                      }}
                      onClick={() => trackEvent("cupom_apply_attempt", { cupom: form.cupom })}
                    >
                      Aplicar
                    </button>
                  </div>
                </div>

                <button
                  data-testid="button-next-dados"
                  onClick={handleNextDados}
                  style={{
                    width: "100%", padding: "14px 0", border: "none", borderRadius: 12,
                    background: "linear-gradient(135deg, #0891B2, #2563EB)",
                    color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}
                >
                  Continuar para Pagamento
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </button>
              </div>
            )}

            {step === "pagamento" && (
              <div data-testid="card-pagamento-step">
                {!paymentData && (
                  <div style={{
                    background: "#fff", borderRadius: 16, padding: 24,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 16,
                  }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 18px", color: "#1F2937" }}>
                      Escolha a forma de pagamento
                    </h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                      {([
                        {
                          key: "pix" as PaymentMethod,
                          label: "PIX",
                          sublabel: "Pagamento instantâneo — aprovação imediata",
                          badge: "Recomendado",
                          badgeColor: "#22C55E",
                          icon: (
                            <div style={{
                              width: 40, height: 40, borderRadius: 10,
                              background: "linear-gradient(135deg, #22C55E, #16A34A)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              <svg width="24" height="24" viewBox="0 0 512 512" fill="white">
                                <path d="M242.4 292.5C247.8 287.1 255.1 284.1 262.7 284.1C270.2 284.1 277.5 287.1 282.9 292.5L376.1 385.7C387.3 396.9 405.4 396.9 416.7 385.7L492.3 310.1C514.8 287.6 514.8 251.2 492.3 228.7L416.7 153.2C405.4 142 387.3 142 376.1 153.2L283.4 245.8C278 251.2 270.8 254.2 263.2 254.2C255.6 254.2 248.5 251.2 243.1 245.8L150.3 153C139.1 141.8 120.1 141.8 109.8 153L34.19 228.6C11.69 251.1 11.69 287.5 34.19 310L109.8 385.6C120.1 396.8 138.1 396.8 150.3 385.6L242.4 292.5zM262.7 226.2C255.1 226.2 247.8 223.2 242.4 217.8L149.7 125.1C138.4 113.9 120.3 113.9 109.1 125.1L33.47 200.7C10.97 223.2 10.97 259.6 33.47 282.1L109.1 357.7C120.3 368.9 138.4 368.9 149.7 357.7L242.8 264.7C248.2 259.3 255.4 256.3 263 256.3C270.5 256.3 277.8 259.3 283.2 264.7L375.9 357.4C387.2 368.6 405.2 368.6 416.5 357.4L492.1 281.8C514.6 259.3 514.6 222.9 492.1 200.4L416.5 124.8C405.2 113.6 387.2 113.6 375.9 124.8L283.5 217.5C278.1 222.9 270.9 226.2 262.7 226.2z"/>
                              </svg>
                            </div>
                          ),
                        },
                        {
                          key: "cartao" as PaymentMethod,
                          label: "Cartão de Crédito",
                          sublabel: "Visa, Mastercard, Elo, Amex",
                          badge: null,
                          icon: (
                            <div style={{
                              width: 40, height: 40, borderRadius: 10,
                              background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              <CreditCard style={{ width: 22, height: 22, color: "#fff" }} />
                            </div>
                          ),
                        },
                        {
                          key: "apple-pay" as PaymentMethod,
                          label: "Apple Pay",
                          sublabel: isAppleDevice ? "Disponível neste dispositivo" : "Disponível somente em dispositivos Apple",
                          badge: null,
                          icon: (
                            <div style={{
                              width: 40, height: 40, borderRadius: 10,
                              background: "#000",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                              <Smartphone style={{ width: 22, height: 22, color: "#fff" }} />
                            </div>
                          ),
                        },
                      ]).map(({ key, label, sublabel, badge, badgeColor, icon }) => (
                        <button
                          key={key}
                          data-testid={`button-payment-${key}`}
                          onClick={() => setPaymentMethod(key)}
                          style={{
                            width: "100%", border: `2px solid ${paymentMethod === key ? "#2563EB" : "#E5E7EB"}`,
                            borderRadius: 12, padding: "14px 16px",
                            background: paymentMethod === key ? "#EFF6FF" : "#fff",
                            cursor: "pointer", display: "flex", alignItems: "center", gap: 14,
                            textAlign: "left", transition: "all 0.15s",
                          }}
                        >
                          {icon}
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 14, fontWeight: 700, color: "#1F2937" }}>{label}</span>
                              {badge && (
                                <span style={{
                                  fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                                  background: badgeColor || "#22C55E", color: "#fff",
                                }}>
                                  {badge}
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: 12, color: "#6B7280" }}>{sublabel}</span>
                          </div>
                          <div style={{
                            width: 20, height: 20, borderRadius: "50%",
                            border: `2px solid ${paymentMethod === key ? "#2563EB" : "#D1D5DB"}`,
                            background: paymentMethod === key ? "#2563EB" : "transparent",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0,
                          }}>
                            {paymentMethod === key && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
                          </div>
                        </button>
                      ))}
                    </div>

                    {paymentMethod === "cartao" && (
                      <div style={{
                        background: "#F8FAFC", borderRadius: 12, padding: 16, marginBottom: 20,
                        border: "1px solid #E5E7EB",
                      }} data-testid="card-credit-fields">
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 14 }}>
                          Dados do Cartão
                        </div>
                        <InputField
                          label="Número do Cartão"
                          value={card.number}
                          onChange={(v) => setCard(p => ({ ...p, number: formatCardNumber(v) }))}
                          placeholder="0000 0000 0000 0000"
                          testId="input-card-number"
                        />
                        <InputField
                          label="Nome no Cartão"
                          value={card.holderName}
                          onChange={(v) => setCard(p => ({ ...p, holderName: v.toUpperCase() }))}
                          placeholder="NOME SOBRENOME"
                          testId="input-card-name"
                        />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
                          <InputField
                            label="Validade"
                            value={card.expiry}
                            onChange={(v) => setCard(p => ({ ...p, expiry: formatCardExpiry(v) }))}
                            placeholder="MM/AA"
                            testId="input-card-expiry"
                          />
                          <InputField
                            label="CVV"
                            value={card.cvv}
                            onChange={(v) => setCard(p => ({ ...p, cvv: v.replace(/\D/g, "").slice(0, 4) }))}
                            placeholder="000"
                            testId="input-card-cvv"
                          />
                        </div>
                        <div style={{
                          display: "flex", alignItems: "center", gap: 6,
                          padding: "8px 10px", background: "#FFF7ED",
                          borderRadius: 8, border: "1px solid #FED7AA",
                        }}>
                          <AlertCircle style={{ width: 14, height: 14, color: "#D97706", flexShrink: 0 }} />
                          <span style={{ fontSize: 11, color: "#92400E" }}>
                            Simulação visual — nenhum dado é processado
                          </span>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "apple-pay" && (
                      <div style={{
                        background: "#F9FAFB", borderRadius: 12, padding: 20,
                        marginBottom: 20, textAlign: "center",
                        border: "1px solid #E5E7EB",
                      }} data-testid="card-apple-pay">
                        {isAppleDevice ? (
                          <button
                            style={{
                              width: "100%", padding: "14px 0", border: "none",
                              borderRadius: 10, background: "#000", color: "#fff",
                              fontSize: 15, fontWeight: 700, cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                            }}
                            data-testid="button-apple-pay-confirm"
                            onClick={() => trackEvent("apple_pay_click")}
                          >
                            <svg width="20" height="20" viewBox="0 0 814 1000" fill="white">
                              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105.3-57.4-155.5-127.4C46 790.7 0 663 0 541.8c0-194.3 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
                            </svg>
                            Pay com Apple Pay
                          </button>
                        ) : (
                          <div>
                            <Smartphone style={{ width: 40, height: 40, color: "#9CA3AF", margin: "0 auto 10px" }} />
                            <p style={{ fontSize: 13, fontWeight: 600, color: "#6B7280", margin: "0 0 4px" }}>
                              Não disponível neste dispositivo
                            </p>
                            <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>
                              Apple Pay requer um dispositivo Apple com Safari
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {createPaymentMutation.isError && (
                      <div style={{
                        background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10,
                        padding: "10px 14px", marginBottom: 14,
                        display: "flex", alignItems: "center", gap: 8,
                      }} data-testid="alert-payment-error">
                        <AlertCircle style={{ width: 16, height: 16, color: "#EF4444", flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: "#DC2626" }}>
                          {paymentMethod === "pix" ? "Erro ao gerar Pix. Tente novamente." : "Erro ao processar. Tente novamente."}
                        </span>
                      </div>
                    )}

                    <div style={{
                      background: "#F9FAFB", borderRadius: 12, padding: 14, marginBottom: 16,
                      border: "1px solid #E5E7EB",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 13, color: "#6B7280" }}>Subtotal</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{formatPrice(total)}</span>
                      </div>
                      {form.cupom && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 13, color: "#16A34A" }}>Cupom {form.cupom}</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#16A34A" }}>—</span>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #E5E7EB", paddingTop: 8, marginTop: 4 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: "#1F2937" }}>Total</span>
                        <span style={{ fontSize: 20, fontWeight: 800, color: "#16A34A" }} data-testid="text-total-price">
                          {formatPrice(total)}
                        </span>
                      </div>
                    </div>

                    <button
                      data-testid="button-confirm-payment"
                      onClick={handleConfirmPayment}
                      disabled={createPaymentMutation.isPending || paymentMethod === "apple-pay" && !isAppleDevice}
                      style={{
                        width: "100%", padding: "15px 0", border: "none", borderRadius: 12,
                        background: (createPaymentMutation.isPending || (paymentMethod === "apple-pay" && !isAppleDevice))
                          ? "#9CA3AF"
                          : "linear-gradient(135deg, #22C55E, #16A34A)",
                        color: "#fff", fontSize: 16, fontWeight: 800,
                        cursor: (createPaymentMutation.isPending || (paymentMethod === "apple-pay" && !isAppleDevice)) ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        boxShadow: "0 4px 14px rgba(34,197,94,0.3)",
                      }}
                    >
                      {createPaymentMutation.isPending
                        ? <><Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} /> Processando...</>
                        : paymentMethod === "pix" ? <><ShoppingCart style={{ width: 18, height: 18 }} /> Gerar QR Code Pix</>
                        : paymentMethod === "cartao" ? <><CreditCard style={{ width: 18, height: 18 }} /> Pagar com Cartão (simulado)</>
                        : <><Smartphone style={{ width: 18, height: 18 }} /> Pagar com Apple Pay</>
                      }
                    </button>

                    <p style={{ margin: "10px 0 0", fontSize: 11, color: "#9CA3AF", textAlign: "center" }}>
                      <Lock style={{ width: 11, height: 11, display: "inline", marginRight: 4, verticalAlign: "middle" }} />
                      Pagamento 100% seguro • Dados criptografados
                    </p>
                  </div>
                )}

                {paymentData && paymentMethod === "pix" && (
                  <div style={{
                    background: "#fff", borderRadius: 16, padding: 24,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  }} data-testid="card-pix-payment">
                    {currentStatus === "APPROVED" && (
                      <div style={{
                        background: "#DCFCE7", border: "1px solid #86EFAC", borderRadius: 12,
                        padding: "14px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10,
                      }} data-testid="banner-payment-approved">
                        <CheckCircle2 style={{ width: 22, height: 22, color: "#16A34A", flexShrink: 0 }} />
                        <span style={{ fontSize: 15, fontWeight: 700, color: "#15803D" }}>Pagamento confirmado!</span>
                      </div>
                    )}

                    {(currentStatus === "EXPIRED" || isExpired) && (
                      <div style={{
                        background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12,
                        padding: "14px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10,
                      }} data-testid="banner-payment-expired">
                        <XCircle style={{ width: 22, height: 22, color: "#EF4444", flexShrink: 0 }} />
                        <div>
                          <span style={{ fontSize: 14, fontWeight: 700, color: "#DC2626", display: "block" }}>Pix expirado</span>
                          <Link href="/ingressos" style={{ fontSize: 12, color: "#2563EB" }}>Voltar e tentar novamente</Link>
                        </div>
                      </div>
                    )}

                    {currentStatus === "PENDING" && !isExpired && (
                      <div style={{
                        background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 12,
                        padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10,
                      }} data-testid="banner-payment-pending">
                        <Clock style={{ width: 18, height: 18, color: "#D97706", flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#92400E" }}>
                            Aguardando pagamento — expira em{" "}
                            <span style={{ fontWeight: 800, color: "#D97706" }} data-testid="text-pix-countdown">
                              {minutes}:{seconds}
                            </span>
                          </span>
                        </div>
                        <Loader2 style={{ width: 16, height: 16, color: "#D97706", animation: "spin 1s linear infinite", flexShrink: 0 }} />
                      </div>
                    )}

                    {paymentData.demo && (
                      <div style={{
                        background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10,
                        padding: "8px 12px", marginBottom: 14, fontSize: 12, color: "#1D4ED8",
                      }} data-testid="badge-demo-mode">
                        Modo demonstração — nenhum pagamento real será processado
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }} data-testid="div-qr-code">
                      <img
                        src={paymentData.qrCodeBase64}
                        alt="QR Code Pix"
                        style={{ width: 180, height: 180, borderRadius: 12, border: "3px solid #22C55E" }}
                      />
                    </div>

                    <p style={{ textAlign: "center", fontSize: 13, color: "#6B7280", margin: "0 0 12px" }}>
                      Ou copie o código abaixo:
                    </p>

                    <div style={{
                      background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 10,
                      padding: "12px 14px", marginBottom: 14,
                      display: "flex", alignItems: "center", gap: 10,
                    }} data-testid="field-pix-code">
                      <code style={{
                        flex: 1, fontSize: 11, color: "#374151", wordBreak: "break-all",
                        fontFamily: "monospace", lineHeight: 1.5,
                      }}>
                        {paymentData.copyPasteCode}
                      </code>
                      <button
                        data-testid="button-copy-pix"
                        onClick={handleCopy}
                        disabled={isExpired}
                        style={{
                          padding: "10px 14px", border: "none", borderRadius: 8,
                          background: copied ? "#DCFCE7" : "#22C55E",
                          color: copied ? "#16A34A" : "#fff",
                          fontSize: 13, fontWeight: 700, cursor: isExpired ? "not-allowed" : "pointer",
                          display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
                          transition: "all 0.2s",
                        }}
                      >
                        {copied ? <Check style={{ width: 15, height: 15 }} /> : <Copy style={{ width: 15, height: 15 }} />}
                        {copied ? "Copiado!" : "Copiar"}
                      </button>
                    </div>

                    <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: 14, marginTop: 6 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, margin: "0 0 6px", color: "#374151" }}>Como pagar:</p>
                      {["Abra seu banco ou app de pagamento", "Escolha pagar via Pix", "Escaneie o QR Code ou cole o código", "Confirme e pronto!"].map((st, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                          <span style={{
                            width: 22, height: 22, borderRadius: "50%", background: "#DCFCE7",
                            color: "#16A34A", fontSize: 12, fontWeight: 800,
                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                          }}>{i + 1}</span>
                          <span style={{ fontSize: 13, color: "#6B7280" }}>{st}</span>
                        </div>
                      ))}
                    </div>

                    <a
                      href="https://wa.me/5564993197555?text=Preciso de ajuda com meu pagamento Pix de ingressos"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid="link-checkout-support"
                      onClick={() => trackEvent("support_whatsapp_click")}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        padding: "12px 0", background: "#F0FDF4", borderRadius: 10,
                        marginTop: 14, color: "#16A34A", fontSize: 13, fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      <Phone style={{ width: 16, height: 16 }} />
                      Precisa de ajuda? Fale no WhatsApp
                    </a>
                  </div>
                )}

                {paymentData && paymentMethod === "cartao" && (
                  <div style={{
                    background: "#fff", borderRadius: 16, padding: 24,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    textAlign: "center",
                  }} data-testid="card-cartao-simulated">
                    <AlertCircle style={{ width: 40, height: 40, color: "#D97706", margin: "0 auto 12px" }} />
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937", margin: "0 0 8px" }}>
                      Integração de cartão em breve
                    </h3>
                    <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 16px" }}>
                      Por enquanto, utilize o Pix para finalizar sua compra com segurança.
                    </p>
                    <button
                      onClick={() => { setPaymentMethod("pix"); setPaymentData(null) }}
                      style={{
                        padding: "12px 24px", border: "none", borderRadius: 10,
                        background: "linear-gradient(135deg, #22C55E, #16A34A)",
                        color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
                      }}
                    >
                      Pagar com Pix
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {isDesktop && (
          <div style={{ width: 340, flexShrink: 0, padding: "24px 24px 24px 0" }}>
            <IngressosSidebar {...sidebarProps} />
          </div>
        )}
      </div>

      {!isDesktop && (
        <IngressosSidebar {...sidebarProps} />
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
