import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { QrCode, Copy, CheckCircle2, Loader2, Clock, Shield, DollarSign } from "lucide-react";

interface PaymentCheckoutProps {
  excursaoId: string;
  excursaoNome: string;
  amount: number;
  organizerCommission?: number;
  passengerName: string;
}

type PixData = {
  transactionId: string;
  pixQrCode: string;
  pixCopyPaste: string;
  status: string;
  platformAmount: number;
  organizerAmount: number;
  expiresAt: string;
  demo: boolean;
};

function useCountdown(expiresAt: string | null) {
  const [remaining, setRemaining] = useState("");
  useEffect(() => {
    if (!expiresAt) return;
    const update = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) { setRemaining("Expirado"); return; }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${m}:${s.toString().padStart(2, "0")}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);
  return remaining;
}

export function PaymentCheckout({ excursaoId, excursaoNome, amount, organizerCommission = 0, passengerName }: PaymentCheckoutProps) {
  const { toast } = useToast();
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [copied, setCopied] = useState(false);
  const countdown = useCountdown(pixData?.expiresAt ?? null);

  const generatePix = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/pagamento/gerar-pix", {
        excursaoId, amount, passengerName,
        organizerCommission,
      });
      return res.json() as Promise<PixData>;
    },
    onSuccess: (data) => setPixData(data),
    onError: () => toast({ title: "Erro ao gerar Pix", variant: "destructive" }),
  });

  const handleCopy = () => {
    if (!pixData) return;
    navigator.clipboard.writeText(pixData.pixCopyPaste);
    setCopied(true);
    toast({ title: "✅ Código copiado!", description: "Cole no app do banco para pagar." });
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary" data-testid="payment-checkout">
      <CardHeader className="text-center pb-2">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
          <QrCode className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-lg">Pagar minha vaga</CardTitle>
        <CardDescription className="text-sm">{excursaoNome}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Amount breakdown */}
        <div className="bg-muted/40 rounded-2xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Valor total</span>
            <span className="font-bold text-foreground text-lg">R$ {amount.toFixed(2).replace(".", ",")}</span>
          </div>
          {organizerCommission > 0 && (
            <>
              <div className="h-px bg-border" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Plataforma recebe</span>
                <span>R$ {(amount - organizerCommission).toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-700">
                <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> Split organizador</span>
                <span>R$ {organizerCommission.toFixed(2).replace(".", ",")}</span>
              </div>
              <Badge variant="secondary" className="text-xs w-fit">Split automático ativo</Badge>
            </>
          )}
        </div>

        {!pixData ? (
          <Button
            className="w-full h-14 rounded-2xl text-base font-bold gap-2"
            onClick={() => generatePix.mutate()}
            disabled={generatePix.isPending}
            data-testid="btn-gerar-pix"
          >
            {generatePix.isPending ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Gerando Pix seguro...</>
            ) : (
              <><QrCode className="w-5 h-5" /> Gerar PIX</>
            )}
          </Button>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-500">
            {pixData.demo && (
              <div className="text-xs bg-amber-50 text-amber-800 border border-amber-200 rounded-lg px-3 py-2 text-center">
                Modo demo — QR Code de exemplo. Configure GATEWAY_API_URL para modo real.
              </div>
            )}

            {/* QR Code */}
            <div className="flex justify-center">
              <div className="w-44 h-44 border-2 border-primary/30 rounded-2xl p-2 bg-white flex items-center justify-center">
                {pixData.pixQrCode.startsWith("data:image") ? (
                  <img src={pixData.pixQrCode} alt="QR Code Pix" className="w-full h-full object-contain" />
                ) : (
                  <QrCode className="w-20 h-20 text-primary/30" />
                )}
              </div>
            </div>

            {/* Copy & Paste */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wider">Pix Copia e Cola</label>
              <div className="flex gap-2">
                <Input
                  value={pixData.pixCopyPaste}
                  readOnly
                  className="font-mono text-xs bg-muted/50 rounded-xl"
                  data-testid="pix-copy-paste"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  className="rounded-xl flex-shrink-0"
                  data-testid="btn-copy-pix"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-primary animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Aguardando confirmação do banco...
              </div>
              <div className="flex items-center gap-1 text-amber-700">
                <Clock className="w-3.5 h-3.5" />
                {countdown}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Shield className="w-3.5 h-3.5" />
          <span>Pagamento 100% seguro — Criptografia SSL</span>
        </div>
      </CardContent>
    </Card>
  );
}
