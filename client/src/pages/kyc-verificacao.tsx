import { useState } from "react";
import { useLocation } from "wouter";
import { LGPDAcceptanceModal } from "@/components/kyc/LGPDAcceptanceModal";
import { BiometricCapture } from "@/components/kyc/BiometricCapture";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShieldCheck, ArrowLeft } from "lucide-react";

export default function KYCVerificacaoPage() {
  const [, setLocation] = useLocation();
  const [lgpdAccepted, setLgpdAccepted] = useState(false);
  const [biometricDone, setBiometricDone] = useState(false);

  if (!lgpdAccepted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4" data-testid="kyc-page">
        <LGPDAcceptanceModal isOpen={true} onAccept={() => setLgpdAccepted(true)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4" data-testid="kyc-page">
      <div className="w-full max-w-lg space-y-4">
        <button
          onClick={() => setLocation("/")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          data-testid="btn-back-kyc"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>

        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader className="text-center pb-2">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Verificação de Segurança</CardTitle>
            <CardDescription className="text-sm">
              Confirme sua identidade para liberar a criação de grupos de excursão no WhatsApp.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 pb-6">
            {/* Step indicators */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-semibold text-emerald-700">LGPD aceito</span>
              </div>
              <div className="h-px w-10 bg-border" />
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${biometricDone ? "bg-emerald-500" : "bg-primary"} text-white`}>
                  {biometricDone ? <CheckCircle2 className="w-4 h-4" /> : "2"}
                </div>
                <span className={`text-xs font-semibold ${biometricDone ? "text-emerald-700" : "text-primary"}`}>
                  {biometricDone ? "Biometria aprovada" : "Biometria facial"}
                </span>
              </div>
            </div>

            {!biometricDone ? (
              <BiometricCapture onCaptureSuccess={() => setBiometricDone(true)} />
            ) : (
              <div className="flex flex-col items-center gap-5 text-center py-4" data-testid="kyc-complete">
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">Identidade Verificada!</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                    Sua biometria foi validada com sucesso. Você já pode criar sua primeira excursão e grupo no WhatsApp.
                  </p>
                </div>
                <div className="flex flex-col gap-3 w-full">
                  <Button
                    onClick={() => setLocation("/admin/waas")}
                    className="w-full h-12 rounded-xl font-bold gap-2"
                    data-testid="btn-ir-waas"
                  >
                    Acessar painel de grupos WA
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setLocation("/criar-excursao")}
                    className="w-full rounded-xl"
                  >
                    Criar nova excursão
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Dados protegidos conforme LGPD — Lei nº 13.709/2018</span>
        </div>
      </div>
    </div>
  );
}
