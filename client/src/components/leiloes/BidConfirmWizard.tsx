import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Gavel, X, Minus, Plus, ChevronRight, ChevronLeft, CheckCircle2, MessageCircle, AlertTriangle } from "lucide-react";
import {
  LEILAO_WIZARD_STEPS,
  LEILAO_WIZARD_TOTAL_STEPS,
  FALLBACK_WIZARD_RULES,
} from "@/constants/leiloes-termos";
import { fetchLeilaoWizardRules } from "@/lib/offers-cms-api";
import type { WizardRulesBundle } from "@shared/offers-cms-types";

type BidModalState = {
  leilaoId: number;
  currentBid: number;
  title: string;
  hotelKey?: string;
};

type Props = {
  bidModal: BidModalState;
  customBidAmount: number;
  setCustomBidAmount: (value: number | ((prev: number) => number)) => void;
  formatPrice: (value: number) => string;
  isLiveData: boolean;
  bidSubmitting: boolean;
  bidError: string | null;
  onClose: () => void;
  onConfirm: (leilaoId: number, amount: number) => Promise<void>;
};

function StepDots({ step }: { step: number }) {
  return (
    <div
      data-testid="bid-wizard-steps"
      style={{ display: "flex", gap: 6, marginBottom: 16, justifyContent: "center" }}
    >
      {LEILAO_WIZARD_STEPS.map((s) => (
        <div
          key={s.id}
          style={{
            flex: 1,
            height: 4,
            borderRadius: 4,
            background: s.id <= step ? "#22C55E" : "rgba(255,255,255,0.15)",
            transition: "background 0.2s",
          }}
          title={s.label}
        />
      ))}
    </div>
  );
}

function RuleList({
  items,
  highlightNoRefund,
}: {
  items: { title: string; text: string }[];
  highlightNoRefund?: boolean;
}) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
      {items.map((item) => (
        <li
          key={item.title}
          style={{
            background: highlightNoRefund ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.04)",
            border: highlightNoRefund
              ? "1px solid rgba(239,68,68,0.35)"
              : "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10,
            padding: "12px 14px",
          }}
        >
          <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700, color: highlightNoRefund ? "#FCA5A5" : "#E2E8F0" }}>
            {highlightNoRefund && <AlertTriangle style={{ width: 14, height: 14, display: "inline", marginRight: 6, verticalAlign: "text-bottom" }} />}
            {item.title}
          </p>
          <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: "#94A3B8" }}>{item.text}</p>
        </li>
      ))}
    </ul>
  );
}

export function BidConfirmWizard({
  bidModal,
  customBidAmount,
  setCustomBidAmount,
  formatPrice,
  isLiveData,
  bidSubmitting,
  bidError,
  onClose,
  onConfirm,
}: Props) {
  const [step, setStep] = useState(1);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [success, setSuccess] = useState(false);
  const [rules, setRules] = useState<WizardRulesBundle>(FALLBACK_WIZARD_RULES);
  const [rulesLoading, setRulesLoading] = useState(true);

  const totalSteps = LEILAO_WIZARD_TOTAL_STEPS;

  useEffect(() => {
    let cancelled = false;
    setRulesLoading(true);
    void fetchLeilaoWizardRules(bidModal.leilaoId, bidModal.hotelKey)
      .then((data) => {
        if (!cancelled) setRules(data);
      })
      .catch(() => {
        if (!cancelled) setRules(FALLBACK_WIZARD_RULES);
      })
      .finally(() => {
        if (!cancelled) setRulesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [bidModal.leilaoId, bidModal.hotelKey]);

  const resetAndClose = () => {
    setStep(1);
    setAcceptedTerms(false);
    setSuccess(false);
    onClose();
  };

  const handleConfirm = async () => {
    if (!acceptedTerms || bidSubmitting) return;
    try {
      await onConfirm(bidModal.leilaoId, customBidAmount);
      setSuccess(true);
    } catch {
      // Erro exibido via bidError no componente pai
    }
  };

  const whatsappHref = `https://wa.me/5564993197555?text=${encodeURIComponent(
    `Olá! Acabei de registrar um lance de ${formatPrice(customBidAmount)} no leilão "${bidModal.title}". Gostaria de mais informações.`,
  )}`;

  return (
    <div
      onClick={resetAndClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#1E293B",
          borderRadius: "20px 20px 0 0",
          width: "100%",
          maxWidth: 480,
          padding: "24px 20px 32px",
          animation: "fadeInUp 0.3s ease-out",
          border: "1px solid rgba(255,255,255,0.1)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: "0 0 4px" }}>
              {success ? "Lance registrado" : "Dar Lance"}
            </h3>
            <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>{bidModal.title}</p>
          </div>
          <button
            data-testid="button-close-bid-modal"
            onClick={resetAndClose}
            type="button"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "none",
              background: "rgba(255,255,255,0.1)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X style={{ width: 18, height: 18, color: "#94A3B8" }} />
          </button>
        </div>

        {!success && <StepDots step={step} />}

        {success ? (
          <div data-testid="bid-wizard-success" style={{ textAlign: "center", padding: "8px 0 4px" }}>
            <CheckCircle2 style={{ width: 48, height: 48, color: "#4ADE80", margin: "0 auto 12px" }} />
            <p style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>
              Lance de {formatPrice(customBidAmount)} registrado!
            </p>
            <p style={{ fontSize: 13, color: "#94A3B8", margin: "0 0 20px", lineHeight: 1.5 }}>
              {isLiveData
                ? "Seu lance foi enviado com sucesso. Acompanhe o leilão nesta página. Se vencer, entraremos em contato para pagamento."
                : "Seu interesse foi registrado. Nossa equipe pode entrar em contato para confirmar disponibilidade."}
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="button-bid-whatsapp-optional"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                width: "100%",
                padding: "14px 0",
                borderRadius: 12,
                border: "1px solid rgba(37,211,102,0.4)",
                background: "rgba(37,211,102,0.12)",
                color: "#4ADE80",
                fontSize: 15,
                fontWeight: 700,
                textDecoration: "none",
                marginBottom: 10,
              }}
            >
              <MessageCircle style={{ width: 18, height: 18 }} />
              Tirar dúvidas no WhatsApp (opcional)
            </a>
            <button
              type="button"
              data-testid="button-bid-wizard-done"
              onClick={resetAndClose}
              style={{
                width: "100%",
                padding: "14px 0",
                borderRadius: 12,
                border: "none",
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Voltar aos leilões
            </button>
          </div>
        ) : (
          <>
            {rulesLoading && step > 1 && (
              <p style={{ fontSize: 13, color: "#64748B", textAlign: "center", marginBottom: 12 }}>
                Carregando regras…
              </p>
            )}

            {step === 1 && (
              <div data-testid="bid-wizard-step-valor">
                <div
                  style={{
                    background: "rgba(34,197,94,0.1)",
                    borderRadius: 12,
                    padding: 16,
                    textAlign: "center",
                    marginBottom: 16,
                    border: "1px solid rgba(34,197,94,0.2)",
                  }}
                >
                  <p style={{ fontSize: 12, color: "#94A3B8", margin: "0 0 4px" }}>Lance atual</p>
                  <span style={{ fontSize: 28, fontWeight: 900, color: "#4ADE80" }}>
                    {formatPrice(bidModal.currentBid)}
                  </span>
                </div>

                <p style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", margin: "0 0 10px" }}>
                  Incrementos sugeridos:
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
                  {[10, 25, 50, 100].map((inc) => (
                    <button
                      key={inc}
                      type="button"
                      data-testid={`button-increment-${inc}`}
                      onClick={() => setCustomBidAmount(bidModal.currentBid + inc)}
                      style={{
                        padding: "10px 0",
                        borderRadius: 10,
                        border:
                          customBidAmount === bidModal.currentBid + inc
                            ? "2px solid #2563EB"
                            : "1px solid rgba(255,255,255,0.1)",
                        background:
                          customBidAmount === bidModal.currentBid + inc
                            ? "rgba(37,99,235,0.15)"
                            : "rgba(255,255,255,0.05)",
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      +R${inc}
                    </button>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 8,
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: 12,
                    padding: "8px 12px",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <button
                    type="button"
                    data-testid="button-bid-decrease"
                    onClick={() =>
                      setCustomBidAmount((prev) => Math.max(bidModal.currentBid + 5, prev - 5))
                    }
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      border: "none",
                      background: "rgba(255,255,255,0.1)",
                      color: "#fff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Minus style={{ width: 16, height: 16 }} />
                  </button>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <span style={{ fontSize: 11, color: "#64748B" }}>Seu lance</span>
                    <div style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>
                      {formatPrice(customBidAmount)}
                    </div>
                  </div>
                  <button
                    type="button"
                    data-testid="button-bid-increase"
                    onClick={() => setCustomBidAmount((prev) => prev + 5)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      border: "none",
                      background: "rgba(255,255,255,0.1)",
                      color: "#fff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Plus style={{ width: 16, height: 16 }} />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div data-testid="bid-wizard-step-regras">
                <p style={{ fontSize: 13, color: "#94A3B8", margin: "0 0 12px", lineHeight: 1.5 }}>
                  Regras do leilão RSV360 antes de continuar.
                </p>
                <RuleList items={rules.regras} />
              </div>
            )}

            {step === 3 && (
              <div data-testid="bid-wizard-step-hotel">
                <p style={{ fontSize: 13, color: "#94A3B8", margin: "0 0 12px", lineHeight: 1.5 }}>
                  Regras do hotel / fornecedor desta oferta.
                </p>
                {rules.hotel.length > 0 ? (
                  <RuleList items={rules.hotel} />
                ) : (
                  <p
                    style={{
                      fontSize: 13,
                      color: "#64748B",
                      background: "rgba(255,255,255,0.04)",
                      borderRadius: 10,
                      padding: 14,
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    Nenhuma regra específica cadastrada para este hotel. Aplicam-se as condições gerais do fornecedor
                    informadas no voucher após a vitória.
                  </p>
                )}
              </div>
            )}

            {step === 4 && (
              <div data-testid="bid-wizard-step-politicas">
                <p style={{ fontSize: 13, color: "#94A3B8", margin: "0 0 12px", lineHeight: 1.5 }}>
                  Políticas de cancelamento e condições especiais (sem reembolso).
                </p>
                {rules.semReembolso.length > 0 && (
                  <div style={{ marginBottom: 14 }}>
                    <RuleList items={rules.semReembolso} highlightNoRefund />
                  </div>
                )}
                <RuleList items={rules.politicas.filter((p) => !rules.semReembolso.some((s) => s.title === p.title))} />
                <p style={{ fontSize: 11, color: "#64748B", marginTop: 12, lineHeight: 1.5 }}>
                  Documentos:{" "}
                  <Link href="/politica-de-privacidade" style={{ color: "#60A5FA" }}>
                    Política de Privacidade
                  </Link>
                  {" · "}
                  <Link href="/contato" style={{ color: "#60A5FA" }}>
                    Contato / SAC
                  </Link>
                </p>
              </div>
            )}

            {step === 5 && (
              <div data-testid="bid-wizard-step-confirmar">
                <div
                  style={{
                    background: "rgba(37,99,235,0.12)",
                    border: "1px solid rgba(37,99,235,0.25)",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 16,
                  }}
                >
                  <p style={{ margin: "0 0 4px", fontSize: 12, color: "#94A3B8" }}>Resumo do lance</p>
                  <p style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 700, color: "#fff" }}>
                    {bidModal.title}
                  </p>
                  <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#4ADE80" }}>
                    {formatPrice(customBidAmount)}
                  </p>
                </div>

                {rules.semReembolso.length > 0 && (
                  <p
                    style={{
                      fontSize: 11,
                      color: "#FCA5A5",
                      background: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.25)",
                      borderRadius: 8,
                      padding: "8px 10px",
                      marginBottom: 12,
                      lineHeight: 1.45,
                    }}
                  >
                    Oferta especial: sem reembolso após confirmação e pagamento.
                  </p>
                )}

                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    cursor: "pointer",
                    marginBottom: 16,
                  }}
                >
                  <input
                    type="checkbox"
                    data-testid="checkbox-aceite-leilao"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    style={{ marginTop: 3, width: 18, height: 18, accentColor: "#22C55E" }}
                  />
                  <span style={{ fontSize: 12, lineHeight: 1.5, color: "#CBD5E1" }}>
                    {rules.aceiteLabel}{" "}
                    <Link href="/politica-de-privacidade" style={{ color: "#60A5FA" }}>
                      Ver política
                    </Link>
                  </span>
                </label>
              </div>
            )}

            {bidError && (
              <p data-testid="text-bid-error" style={{ color: "#F87171", fontSize: 13, margin: "12px 0 0" }}>
                {bidError}
              </p>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              {step > 1 && (
                <button
                  type="button"
                  data-testid="button-bid-wizard-back"
                  onClick={() => setStep((s) => s - 1)}
                  disabled={bidSubmitting}
                  style={{
                    flex: "0 0 auto",
                    padding: "14px 16px",
                    borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "transparent",
                    color: "#94A3B8",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <ChevronLeft style={{ width: 18, height: 18 }} />
                  Voltar
                </button>
              )}

              {step < totalSteps ? (
                <button
                  type="button"
                  data-testid="button-bid-wizard-next"
                  onClick={() => setStep((s) => s + 1)}
                  style={{
                    flex: 1,
                    padding: "14px 0",
                    borderRadius: 12,
                    border: "none",
                    background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  Continuar
                  <ChevronRight style={{ width: 18, height: 18 }} />
                </button>
              ) : (
                <button
                  type="button"
                  data-testid="button-confirm-bid"
                  disabled={bidSubmitting || !acceptedTerms}
                  onClick={() => void handleConfirm()}
                  style={{
                    flex: 1,
                    padding: "14px 0",
                    borderRadius: 12,
                    border: "none",
                    background:
                      acceptedTerms && !bidSubmitting
                        ? "linear-gradient(135deg, #22C55E, #16A34A)"
                        : "rgba(255,255,255,0.15)",
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: 800,
                    cursor: acceptedTerms && !bidSubmitting ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    opacity: acceptedTerms ? 1 : 0.7,
                  }}
                >
                  <Gavel style={{ width: 18, height: 18 }} />
                  {bidSubmitting ? "Registrando…" : `Confirmar ${formatPrice(customBidAmount)}`}
                </button>
              )}
            </div>

            {step === 1 && (
              <p style={{ fontSize: 11, color: "#64748B", textAlign: "center", marginTop: 10 }}>
                Próximo: regras do leilão, hotel e políticas (incl. sem reembolso)
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
