import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, Lock } from "lucide-react";

interface LGPDAcceptanceModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

export function LGPDAcceptanceModal({ isOpen, onAccept }: LGPDAcceptanceModalProps) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 20) setHasScrolled(true);
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-2xl" data-testid="lgpd-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-foreground">
            <ShieldCheck className="w-6 h-6 text-primary" />
            Termo de Consentimento — LGPD
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            Para garantir a segurança da plataforma Reservei Viagens, precisamos validar sua identidade antes de liberar o acesso de organizador.
          </DialogDescription>
        </DialogHeader>

        <div
          className="h-64 overflow-y-auto p-4 border border-border rounded-xl text-sm text-muted-foreground space-y-4 bg-muted/30 scrollbar-thin"
          onScroll={handleScroll}
          data-testid="lgpd-scroll-area"
        >
          <p>
            <strong className="text-foreground">1. Finalidade:</strong> A coleta de sua biometria facial, número de CPF e cruzamento de dados cadastrais tem a finalidade exclusiva de validação de identidade (KYC — Know Your Customer), prevenção à fraude, segurança dos usuários adquirentes de pacotes de viagem e cumprimento de obrigações legais impostas pela Resolução Anac nº 400/2016 e legislação vigente.
          </p>
          <p>
            <strong className="text-foreground">2. Armazenamento e Processamento:</strong> A captura e validação biométrica são realizadas por meio de parceiros homologados com certificação ISO 27001. A Reservei Viagens não armazena a imagem do seu documento ou sua fotografia em seus servidores de forma permanente, retendo apenas o código de validação (token criptografado) e o status de aprovação (APROVADO / PENDENTE / BLOQUEADO).
          </p>
          <p>
            <strong className="text-foreground">3. Compartilhamento de Dados:</strong> Seus dados cadastrais poderão ser consultados junto a bases de proteção ao crédito (Serasa, SPC) e à base da Receita Federal unicamente para a finalidade de atribuição do "Score de Confiança do Organizador". Não realizamos venda ou compartilhamento comercial de dados pessoais.
          </p>
          <p>
            <strong className="text-foreground">4. Direitos do Titular (Art. 18, LGPD):</strong> Você tem o direito de acessar, corrigir, portar ou solicitar a eliminação de seus dados pessoais a qualquer momento por meio do nosso canal de suporte (suporte@reserveiviagens.com.br). A revogação do consentimento inviabilizará a manutenção de sua conta como Organizador de Excursões.
          </p>
          <p>
            <strong className="text-foreground">5. Base Legal:</strong> O tratamento de dados se fundamenta no art. 7º, inciso V (execução de contrato) e inciso IX (legítimo interesse) da Lei nº 13.709/2018 (LGPD). Para dados biométricos (dados sensíveis), a base legal é o consentimento explícito do titular (art. 11, inciso I).
          </p>
          <p>
            <strong className="text-foreground">6. Retenção:</strong> Os dados de verificação serão mantidos pelo período mínimo de 5 anos conforme exigência da legislação tributária e de combate à lavagem de dinheiro (Lei nº 9.613/1998).
          </p>
          <p className="text-center text-xs text-muted-foreground mt-6 pb-2">
            {hasScrolled ? "✅ Você chegou ao final do documento." : "⬇️ Role até o final para habilitar o aceite."}
          </p>
        </div>

        <DialogFooter className="flex-col gap-4 mt-2">
          <div className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${hasScrolled ? "border-primary/30 bg-primary/5" : "border-border bg-muted/20 opacity-60"}`}>
            <Checkbox
              id="lgpd-terms"
              checked={isChecked}
              onCheckedChange={(checked) => setIsChecked(checked as boolean)}
              disabled={!hasScrolled}
              data-testid="lgpd-checkbox"
              className="mt-0.5"
            />
            <label
              htmlFor="lgpd-terms"
              className={`text-sm leading-snug ${hasScrolled ? "cursor-pointer text-foreground" : "cursor-not-allowed text-muted-foreground"}`}
            >
              Declaro que li, compreendi e concordo com a coleta da minha biometria facial e dados cadastrais conforme os termos acima, em conformidade com a LGPD (Lei nº 13.709/2018).
            </label>
          </div>

          {!hasScrolled && (
            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <Lock className="w-3.5 h-3.5 flex-shrink-0" />
              Role até o final do texto acima para desbloquear o aceite.
            </div>
          )}

          <Button
            onClick={onAccept}
            disabled={!hasScrolled || !isChecked}
            className="w-full h-12 rounded-xl font-bold text-base gap-2"
            data-testid="lgpd-accept-btn"
          >
            <ShieldCheck className="w-4 h-4" />
            Aceitar e continuar com verificação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
