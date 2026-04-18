import { useEffect } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Link, useLocation, useSearch } from "wouter";
import { trackEvent } from "@/lib/analytics";
import { HomeHeader } from "@/components/home/HomeHeader";
import { HomeFooter } from "@/components/home/HomeFooter";
import { MobileCTABar } from "@/components/home/MobileCTABar";

export default function IngressosSucessoPage() {
  const search = useSearch();
  const [, navigate] = useLocation();

  const params = new URLSearchParams(search);
  const orderId = params.get("orderId") ?? params.get("txn") ?? "";
  const voucherToken = params.get("token") ?? "";

  const destination = orderId
    ? `/pedido/${encodeURIComponent(orderId)}${
        voucherToken ? `?token=${encodeURIComponent(voucherToken)}` : ""
      }`
    : "";

  useEffect(() => {
    trackEvent("tickets_success_view", {
      orderId,
      legacyPage: true,
    });

    if (!destination) return;

    const timer = window.setTimeout(() => {
      navigate(destination, { replace: true });
    }, 250);

    return () => window.clearTimeout(timer);
  }, [destination, navigate, orderId]);

  return (
    <div
      className="rsv-subpage"
      style={{ background: "#F8FAFC", minHeight: "100vh" }}
    >
      <HomeHeader />

      <div
        style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "32px 16px 48px",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: 28,
            boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
            textAlign: "center",
          }}
        >
          {orderId ? (
            <>
              <div
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: "999px",
                  background: "#ECFDF5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <CheckCircle2
                  style={{ width: 36, height: 36, color: "#16A34A" }}
                />
              </div>

              <h1
                style={{
                  margin: "0 0 8px",
                  fontSize: 24,
                  lineHeight: 1.2,
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                Pagamento confirmado
              </h1>

              <p
                style={{
                  margin: "0 0 18px",
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "#6B7280",
                }}
              >
                Estamos te levando para a página do pedido, onde você poderá
                acompanhar o status, baixar o voucher e falar com o suporte.
              </p>

              <div
                style={{
                  background: "#F9FAFB",
                  border: "1px solid #E5E7EB",
                  borderRadius: 12,
                  padding: "12px 14px",
                  marginBottom: 18,
                }}
              >
                <p
                  style={{
                    margin: "0 0 4px",
                    fontSize: 11,
                    color: "#6B7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    fontWeight: 700,
                  }}
                >
                  Pedido
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "#111827",
                    fontWeight: 700,
                    fontFamily: "monospace",
                    wordBreak: "break-all",
                  }}
                >
                  {orderId}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  marginBottom: 20,
                  color: "#2563EB",
                }}
              >
                <Loader2
                  style={{
                    width: 18,
                    height: 18,
                    animation: "spin 1s linear infinite",
                  }}
                />
                <span style={{ fontSize: 14, fontWeight: 600 }}>
                  Redirecionando para {destination}
                </span>
              </div>

              <a
                href={destination}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: "#2563EB",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: 14,
                  minWidth: 240,
                }}
                data-testid="link-go-to-order-status"
              >
                Ir para página do pedido
                <ArrowRight style={{ width: 16, height: 16 }} />
              </a>

              <p
                style={{
                  margin: "14px 0 0",
                  fontSize: 12,
                  color: "#9CA3AF",
                }}
              >
                Se o redirecionamento não acontecer automaticamente, use o botão
                acima.
              </p>
            </>
          ) : (
            <>
              <div
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: "999px",
                  background: "#FEF2F2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <ArrowLeft
                  style={{ width: 30, height: 30, color: "#DC2626" }}
                />
              </div>

              <h1
                style={{
                  margin: "0 0 8px",
                  fontSize: 22,
                  lineHeight: 1.2,
                  fontWeight: 800,
                  color: "#111827",
                }}
              >
                Link de sucesso incompleto
              </h1>

              <p
                style={{
                  margin: "0 0 20px",
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "#6B7280",
                }}
              >
                Não encontramos o identificador do pedido nesta URL. Volte para
                a página de ingressos para gerar um novo pedido ou acessar seu
                fluxo corretamente.
              </p>

              <Link
                href="/ingressos"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: "#2563EB",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: 14,
                }}
                data-testid="link-back-to-tickets"
              >
                <ArrowLeft style={{ width: 16, height: 16 }} />
                Voltar para ingressos
              </Link>
            </>
          )}
        </div>
      </div>

      <HomeFooter />
      <MobileCTABar />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}