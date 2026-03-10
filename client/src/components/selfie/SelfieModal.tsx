import { useState } from "react";
import { Camera, ShieldCheck, UserCircle2, X, Fingerprint } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BiometricCapture } from "@/components/kyc/BiometricCapture";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export type SelfieModalContexto = "perfil" | "excursao" | "cadastro";

interface SelfieModalProps {
  aberto: boolean;
  onFechar: () => void;
  contexto: SelfieModalContexto;
  onSucesso?: (fotoUrl: string) => void;
}

const CONTEXTO_CONFIG: Record<SelfieModalContexto, {
  titulo: string;
  subtitulo: string;
  descricao: string;
  icon: any;
  cor: string;
  sucesso: string;
}> = {
  perfil: {
    titulo: "📸 Foto do Perfil",
    subtitulo: "Verificação biométrica",
    descricao: "Para personalizar sua conta e garantir a segurança, tire uma selfie. Ela será usada como sua foto de perfil no RSV360. Posicione seu rosto no guia oval e clique em Capturar.",
    icon: UserCircle2,
    cor: "#2563EB",
    sucesso: "Foto de perfil salva com sucesso!",
  },
  excursao: {
    titulo: "🛡️ Verificação do Organizador",
    subtitulo: "Selfie obrigatória para criar excursões",
    descricao: "Para criar excursões e gerenciar grupos de viagem, precisamos verificar sua identidade. Tire uma selfie rápida — é simples, seguro e em conformidade com a LGPD.",
    icon: ShieldCheck,
    cor: "#059669",
    sucesso: "Identidade verificada! Você já pode criar excursões.",
  },
  cadastro: {
    titulo: "🤳 Selfie de Verificação",
    subtitulo: "Confirme sua identidade",
    descricao: "Como etapa final do cadastro, tire uma selfie para confirmar sua identidade e personalizar seu perfil. Sua foto fica protegida e é usada apenas internamente pelo RSV360.",
    icon: Fingerprint,
    cor: "#7C3AED",
    sucesso: "Identidade verificada com sucesso!",
  },
};

export function SelfieModal({ aberto, onFechar, contexto, onSucesso }: SelfieModalProps) {
  const [salvando, setSalvando] = useState(false);
  const { toast } = useToast();
  const config = CONTEXTO_CONFIG[contexto];

  const handleCapture = async (imageData: string) => {
    setSalvando(true);
    try {
      const res = await apiRequest("POST", "/api/auth/selfie", { fotoUrl: imageData });
      const data = await res.json();
      queryClient.setQueryData(["/api/auth/me"], (old: any) =>
        old ? { ...old, fotoUrl: imageData } : old
      );
      toast({ title: config.sucesso, description: "Sua foto foi salva com segurança." });
      onSucesso?.(imageData);
      setTimeout(onFechar, 1800);
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    } finally {
      setSalvando(false);
    }
  };

  const Icon = config.icon;

  return (
    <Dialog open={aberto} onOpenChange={(open) => { if (!open) onFechar(); }}>
      <DialogContent style={{ maxWidth: 480, borderRadius: 20, padding: 0, overflow: "hidden" }}>
        <div style={{ background: `linear-gradient(135deg, ${config.cor}22, ${config.cor}11)`, padding: "20px 24px 0" }}>
          <DialogHeader>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: config.cor, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon style={{ width: 20, height: 20, color: "#fff" }} />
                </div>
                <div>
                  <DialogTitle style={{ fontSize: 16, fontWeight: 800, color: "#1F2937", margin: 0 }}>
                    {config.titulo}
                  </DialogTitle>
                  <p style={{ fontSize: 11, color: config.cor, fontWeight: 600, margin: 0 }}>
                    {config.subtitulo}
                  </p>
                </div>
              </div>
              <button
                onClick={onFechar}
                data-testid="selfie-modal-fechar"
                style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 4 }}
              >
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>
          </DialogHeader>

          <div style={{
            background: "rgba(255,255,255,0.85)", borderRadius: 12,
            padding: "12px 16px", marginBottom: 16, border: `1px solid ${config.cor}33`,
          }}>
            <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, margin: 0 }}>
              {config.descricao}
            </p>
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            {["Câmera segura e criptografada", "Dados protegidos pela LGPD", "Processamento local no dispositivo"].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: config.cor }} />
                <span style={{ fontSize: 11, color: "#6B7280" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "0 24px 24px" }}>
          <BiometricCapture
            onCaptureSuccess={handleCapture}
            mensagemSucesso={config.sucesso}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
