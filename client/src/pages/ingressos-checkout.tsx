import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Copy, Check, Clock, AlertCircle, CheckCircle2, XCircle, Loader2, ShoppingCart, Phone } from "lucide-react"
import { Link, useLocation } from "wouter"
import { useQuery, useMutation } from "@tanstack/react-query"
import { getCart, getCartTotal, clearCart, type CartItem } from "@/lib/cart-store"
import { trackEvent } from "@/lib/analytics"
import { apiRequest } from "@/lib/queryClient"

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
  name: string
  email: string
  cpf: string
  phone: string
}

export default function IngressosCheckoutPage() {
  const [, navigate] = useLocation()
  const [cart] = useState<CartItem[]>(() => getCart())
  const [form, setForm] = useState<FormState>({ name: "", email: "", cpf: "", phone: "" })
  const [formErrors, setFormErrors] = useState<Partial<FormState>>({})
  const [step, setStep] = useState<"form" | "pix">("form")
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [copied, setCopied] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(30 * 60)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (cart.length === 0) navigate("/ingressos")
    trackEvent("pix_checkout_view")
  }, [])

  useEffect(() => {
    if (step !== "pix" || !paymentData) return
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  }, [step, paymentData])

  const createPaymentMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        items: cart.map((c) => ({
          ticketId: c.ticketId,
          title: c.name,
          quantity: c.quantity,
          unitPrice: c.unitPrice,
        })),
        customer: {
          name: form.name,
          email: form.email,
          cpf: form.cpf.replace(/\D/g, ""),
          phone: form.phone.replace(/\D/g, ""),
        },
      }
      const res = await apiRequest("POST", "/api/payments/tickets/create", payload)
      return res.json() as Promise<PaymentData>
    },
    onSuccess: (data) => {
      setPaymentData(data)
      setStep("pix")
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
    enabled: !!paymentData && step === "pix" && paymentData?.status !== "APPROVED",
    refetchInterval: 3000,
  })

  useEffect(() => {
    if (!statusData) return
    if (statusData.paid || statusData.status === "APPROVED") {
      trackEvent("pix_payment_confirmed", { transactionId: paymentData?.transactionId })
      clearCart()
      navigate(`/ingressos/sucesso?txn=${paymentData?.transactionId}`)
    }
    if (statusData.status === "EXPIRED") {
      trackEvent("pix_payment_expired", { transactionId: paymentData?.transactionId })
    }
    if (statusData.status === "FAILED") {
      trackEvent("pix_payment_failed", { transactionId: paymentData?.transactionId })
    }
  }, [statusData])

  function validateForm(): boolean {
    const errors: Partial<FormState> = {}
    if (!form.name.trim() || form.name.trim().split(" ").length < 2) {
      errors.name = "Nome completo obrigatório"
    }
    if (!form.email.includes("@")) {
      errors.email = "E-mail inválido"
    }
    const cpfDigits = form.cpf.replace(/\D/g, "")
    if (cpfDigits.length !== 11) {
      errors.cpf = "CPF com 11 dígitos"
    }
    const phoneDigits = form.phone.replace(/\D/g, "")
    if (phoneDigits.length < 10) {
      errors.phone = "Telefone inválido"
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  function handleSubmit() {
    if (!validateForm()) return
    createPaymentMutation.mutate()
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
  const total = getCartTotal(cart)

  if (cart.length === 0) return null

  return (
    <div className="rsv-subpage" style={{ background: "#F8FAFC", minHeight: "100vh" }}>
      <div style={{
        background: "linear-gradient(135deg, #0891B2 0%, #2563EB 100%)",
        color: "#fff", padding: "20px 20px 20px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <Link href="/ingressos" style={{ color: "#fff", display: "flex", alignItems: "center" }} data-testid="link-back-ingressos">
            <ArrowLeft style={{ width: 22, height: 22 }} />
          </Link>
          <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }} data-testid="text-checkout-title">
            {step === "form" ? "Seus Dados" : "Pagamento Pix"}
          </h1>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{
            width: 24, height: 24, borderRadius: "50%",
            background: "#fff", color: "#2563EB",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 800,
          }}>1</div>
          <div style={{ flex: 1, height: 2, background: step === "pix" ? "#fff" : "rgba(255,255,255,0.3)", borderRadius: 2 }} />
          <div style={{
            width: 24, height: 24, borderRadius: "50%",
            background: step === "pix" ? "#fff" : "rgba(255,255,255,0.3)",
            color: step === "pix" ? "#2563EB" : "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 800,
          }}>2</div>
        </div>
      </div>

      <div style={{ padding: 16, maxWidth: 560, margin: "0 auto" }}>
        <div style={{
          background: "#fff", borderRadius: 16, padding: 16, marginBottom: 16,
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }} data-testid="card-order-summary">
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 10px", color: "#374151" }}>
            Resumo do Pedido
          </h3>
          {cart.map((item) => (
            <div key={item.ticketId} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "6px 0", borderBottom: "1px solid #F3F4F6",
            }} data-testid={`row-order-item-${item.ticketId}`}>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1F2937" }}>{item.name}</p>
                <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>{item.quantity}x {formatPrice(item.unitPrice)}</p>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#16A34A" }}>
                {formatPrice(item.unitPrice * item.quantity)}
              </span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#1F2937" }}>Total Pix</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#16A34A" }} data-testid="text-total-price">
              {formatPrice(total)}
            </span>
          </div>
        </div>

        {step === "form" && (
          <div style={{
            background: "#fff", borderRadius: 16, padding: 20,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }} data-testid="card-customer-form">
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 16px", color: "#1F2937" }}>
              Dados do Comprador
            </h3>
            {(["name", "email", "cpf", "phone"] as const).map((field) => {
              const labels = { name: "Nome completo", email: "E-mail", cpf: "CPF", phone: "Telefone com DDD" }
              const types = { name: "text", email: "email", cpf: "text", phone: "tel" }
              return (
                <div key={field} style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>
                    {labels[field]}
                  </label>
                  <input
                    data-testid={`input-${field}`}
                    type={types[field]}
                    value={form[field]}
                    onChange={(e) => {
                      let val = e.target.value
                      if (field === "cpf") val = formatCpf(val)
                      if (field === "phone") val = formatPhone(val)
                      setForm((prev) => ({ ...prev, [field]: val }))
                      if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: undefined }))
                    }}
                    placeholder={field === "cpf" ? "000.000.000-00" : field === "phone" ? "(65) 99999-0000" : ""}
                    style={{
                      width: "100%", padding: "12px 14px", border: `1px solid ${formErrors[field] ? "#EF4444" : "#E5E7EB"}`,
                      borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box",
                      color: "#1F2937", background: "#FAFAFA",
                    }}
                  />
                  {formErrors[field] && (
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "#EF4444" }}>{formErrors[field]}</p>
                  )}
                </div>
              )
            })}

            {createPaymentMutation.isError && (
              <div style={{
                background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10,
                padding: "10px 14px", marginBottom: 14,
                display: "flex", alignItems: "center", gap: 8,
              }} data-testid="alert-payment-error">
                <AlertCircle style={{ width: 16, height: 16, color: "#EF4444", flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: "#DC2626" }}>Erro ao gerar Pix. Tente novamente.</span>
              </div>
            )}

            <button
              data-testid="button-generate-pix"
              onClick={handleSubmit}
              disabled={createPaymentMutation.isPending}
              style={{
                width: "100%", padding: "15px 0", border: "none", borderRadius: 12,
                background: createPaymentMutation.isPending
                  ? "#9CA3AF"
                  : "linear-gradient(135deg, #22C55E, #16A34A)",
                color: "#fff", fontSize: 16, fontWeight: 800, cursor: createPaymentMutation.isPending ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {createPaymentMutation.isPending
                ? <><Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} /> Gerando Pix...</>
                : <><ShoppingCart style={{ width: 18, height: 18 }} /> Gerar QR Code Pix</>
              }
            </button>

            <p style={{ margin: "12px 0 0", fontSize: 11, color: "#9CA3AF", textAlign: "center" }}>
              Pagamento 100% seguro • Pix instantâneo • Seus dados protegidos
            </p>
          </div>
        )}

        {step === "pix" && paymentData && (
          <div style={{
            background: "#fff", borderRadius: 16, padding: 20,
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
              {["Abra seu banco ou app de pagamento", "Escolha pagar via Pix", "Escaneie o QR Code ou cole o código", "Confirme e pronto!"].map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: "50%", background: "#DCFCE7",
                    color: "#16A34A", fontSize: 12, fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>{i + 1}</span>
                  <span style={{ fontSize: 13, color: "#6B7280" }}>{step}</span>
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
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
