import { useState, type ComponentType } from "react"
import { useLocation } from "wouter"
import { useMutation } from "@tanstack/react-query"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Crown, ChevronLeft, ChevronRight, Minus, Plus,
  Church, Building2, Heart, Users, GraduationCap,
  MapPin, Sparkles, Check, LogIn, UserPlus, ArrowRight,
} from "lucide-react"
import { apiRequest, queryClient } from "@/lib/queryClient"
import { useToast } from "@/hooks/use-toast"
import type { AuthUser } from "@/hooks/use-auth"

/* ─── Tipos ─────────────────────────────────────────── */
interface TipoGrupo {
  id: string
  label: string
  emoji: string
  icon: ComponentType<{ className?: string }>
  cor: string
}

const TIPOS_GRUPO: TipoGrupo[] = [
  { id: "igreja",    label: "Igreja / Comunidade religiosa", emoji: "⛪", icon: Church,      cor: "violet" },
  { id: "empresa",   label: "Empresa / Colegas de trabalho", emoji: "🏢", icon: Building2,   cor: "blue" },
  { id: "familia",   label: "Família",                        emoji: "👨‍👩‍👧‍👦", icon: Heart,       cor: "rose" },
  { id: "amigos",    label: "Amigos / Turma",                 emoji: "🎉", icon: Users,       cor: "amber" },
  { id: "escola",    label: "Escola / Faculdade",             emoji: "🎓", icon: GraduationCap, cor: "green" },
  { id: "agencia",   label: "Agência / Guia de turismo",      emoji: "✈️", icon: MapPin,      cor: "cyan" },
  { id: "outro",     label: "Outro",                          emoji: "✨", icon: Sparkles,    cor: "slate" },
]

const COR_MAP: Record<string, string> = {
  violet: "border-violet-400 bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300",
  blue:   "border-blue-400   bg-blue-50   dark:bg-blue-950/30   text-blue-700   dark:text-blue-300",
  rose:   "border-rose-400   bg-rose-50   dark:bg-rose-950/30   text-rose-700   dark:text-rose-300",
  amber:  "border-amber-400  bg-amber-50  dark:bg-amber-950/30  text-amber-700  dark:text-amber-300",
  green:  "border-green-400  bg-green-50  dark:bg-green-950/30  text-green-700  dark:text-green-300",
  cyan:   "border-cyan-400   bg-cyan-50   dark:bg-cyan-950/30   text-cyan-700   dark:text-cyan-300",
  slate:  "border-slate-400  bg-slate-50  dark:bg-slate-950/30  text-slate-700  dark:text-slate-300",
}

/* ─── Props ─────────────────────────────────────────── */
interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: AuthUser | null
}

/* ─── Componente ─────────────────────────────────────── */
export function LiderApplicationDialog({ open, onOpenChange, user }: Props) {
  const [step, setStep] = useState(1)
  const [tipoGrupo, setTipoGrupo] = useState<string>("")
  const [qtdPessoas, setQtdPessoas] = useState(10)
  const [compromisso, setCompromisso] = useState(false)
  const [, setLocation] = useLocation()
  const { toast } = useToast()

  const tipoSelecionado = TIPOS_GRUPO.find((t) => t.id === tipoGrupo)

  const tornarLiderMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/auth/tornar-lider", {
        tipoGrupo,
        qtdPessoas,
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || "Erro ao ativar liderança")
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] })
      toast({
        title: "🎉 Parabéns! Você é um Líder Reservei!",
        description: "Agora você pode criar e gerenciar suas próprias excursões.",
      })
      handleClose()
      setLocation("/criar-excursao")
    },
    onError: (err: Error) => {
      toast({ title: "Erro", description: err.message, variant: "destructive" })
    },
  })

  function handleClose() {
    onOpenChange(false)
    setTimeout(() => {
      setStep(1)
      setTipoGrupo("")
      setQtdPessoas(10)
      setCompromisso(false)
    }, 300)
  }

  function nextStep() { setStep((s) => s + 1) }
  function prevStep() { setStep((s) => s - 1) }

  const totalSteps = 3

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden rounded-3xl gap-0">
        {/* ── Header com gradiente ── */}
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white px-7 pt-7 pb-5">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-5 h-5 text-amber-300" />
            <span className="text-xs font-semibold text-amber-200 uppercase tracking-wider">
              Programa Líder Reservei
            </span>
          </div>
          <DialogTitle className="text-2xl font-extrabold text-white">
            {step === 1 && "Qual é o seu grupo?"}
            {step === 2 && "Quantas pessoas você já tem?"}
            {step === 3 && !user && "Quase lá — faça login para concluir"}
            {step === 3 && user && "Confirme seu compromisso"}
          </DialogTitle>
          <DialogDescription className="text-blue-100 text-sm mt-1">
            {step === 1 && "Selecione o tipo de grupo que você vai organizar."}
            {step === 2 && "Nos diga quantos participantes você já conseguiu para essa excursão."}
            {step === 3 && !user && "Crie sua conta ou entre para ativar sua liderança gratuitamente."}
            {step === 3 && user && `${user.nome}, revise seu compromisso antes de ativar.`}
          </DialogDescription>

          {/* Progress dots */}
          <div className="flex gap-1.5 mt-4">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i + 1 <= step ? "bg-amber-300 flex-1" : "bg-white/20 w-8"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="px-7 py-6">

          {/* ── STEP 1: Tipo de grupo ── */}
          {step === 1 && (
            <div>
              <div className="grid grid-cols-1 gap-2">
                {TIPOS_GRUPO.map((tipo) => {
                  const selected = tipoGrupo === tipo.id
                  const cor = COR_MAP[tipo.cor]
                  return (
                    <button
                      key={tipo.id}
                      data-testid={`tipo-grupo-${tipo.id}`}
                      onClick={() => setTipoGrupo(tipo.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-left transition-all duration-150 ${
                        selected
                          ? `${cor} border-opacity-100 shadow-sm`
                          : "border-border bg-card hover:border-muted-foreground/30 hover:bg-muted/50"
                      }`}
                    >
                      <span className="text-xl select-none">{tipo.emoji}</span>
                      <span className={`font-semibold text-sm ${selected ? "" : "text-foreground"}`}>
                        {tipo.label}
                      </span>
                      {selected && (
                        <Check className="w-4 h-4 ml-auto flex-shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="flex justify-end mt-5">
                <Button
                  data-testid="btn-step1-proximo"
                  disabled={!tipoGrupo}
                  onClick={nextStep}
                  className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 gap-2"
                >
                  Próximo <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Quantas pessoas ── */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-5">
                  Inclua você mesmo. Mínimo de <strong>3 pessoas</strong> para criar uma excursão.
                </p>

                {/* Stepper grande */}
                <div className="flex items-center justify-center gap-6">
                  <Button
                    data-testid="btn-qtd-minus"
                    variant="outline"
                    size="icon"
                    onClick={() => setQtdPessoas((n) => Math.max(1, n - 1))}
                    className="w-12 h-12 rounded-2xl border-2 text-lg font-bold"
                  >
                    <Minus className="w-5 h-5" />
                  </Button>

                  <div className="text-center">
                    <p className="text-6xl font-extrabold text-indigo-600 dark:text-indigo-400 leading-none" data-testid="qtd-pessoas-display">
                      {qtdPessoas}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {qtdPessoas === 1 ? "pessoa" : "pessoas"}
                    </p>
                  </div>

                  <Button
                    data-testid="btn-qtd-plus"
                    variant="outline"
                    size="icon"
                    onClick={() => setQtdPessoas((n) => Math.min(60, n + 1))}
                    className="w-12 h-12 rounded-2xl border-2 text-lg font-bold"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>

                {/* Quick select chips */}
                <div className="flex gap-2 justify-center mt-5 flex-wrap">
                  {[5, 10, 15, 20, 28, 40].map((n) => (
                    <button
                      key={n}
                      onClick={() => setQtdPessoas(n)}
                      data-testid={`qtd-chip-${n}`}
                      className={`px-3 py-1 rounded-full text-sm font-semibold border transition-colors ${
                        qtdPessoas === n
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "border-border text-muted-foreground hover:border-indigo-300"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>

                {qtdPessoas < 3 && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-3 font-medium">
                    ⚠️ Você precisa de no mínimo 3 pessoas para criar uma excursão.
                  </p>
                )}
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={prevStep} className="rounded-2xl gap-1.5 text-muted-foreground">
                  <ChevronLeft className="w-4 h-4" /> Voltar
                </Button>
                <Button
                  data-testid="btn-step2-proximo"
                  disabled={qtdPessoas < 3}
                  onClick={nextStep}
                  className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 gap-2"
                >
                  Próximo <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 3a: Não logado → login/cadastro ── */}
          {step === 3 && !user && (
            <div className="space-y-5">
              {/* Resumo da candidatura */}
              <div className="bg-muted/60 rounded-2xl p-4 space-y-2 text-sm">
                <p className="font-semibold text-foreground mb-2">Sua candidatura:</p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-base">{tipoSelecionado?.emoji}</span>
                  <span>{tipoSelecionado?.label}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{qtdPessoas} {qtdPessoas === 1 ? "pessoa" : "pessoas"} no grupo</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                Para ativar sua liderança, faça login ou crie sua conta — é grátis e leva menos de 1 minuto.
              </p>

              <div className="flex flex-col gap-2">
                <Button
                  data-testid="btn-gate-login"
                  size="lg"
                  onClick={() => { handleClose(); setLocation("/entrar") }}
                  className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2"
                >
                  <LogIn className="w-4 h-4" /> Já tenho conta — Entrar
                </Button>
                <Button
                  data-testid="btn-gate-cadastro"
                  size="lg"
                  variant="outline"
                  onClick={() => { handleClose(); setLocation("/cadastrar") }}
                  className="rounded-2xl font-semibold gap-2"
                >
                  <UserPlus className="w-4 h-4" /> Criar conta gratuitamente
                </Button>
              </div>

              <div className="flex justify-start">
                <Button variant="ghost" onClick={prevStep} className="rounded-2xl gap-1.5 text-muted-foreground text-sm">
                  <ChevronLeft className="w-4 h-4" /> Voltar
                </Button>
              </div>
            </div>
          )}

          {/* ── STEP 3b: Logado → compromisso ── */}
          {step === 3 && user && (
            <div className="space-y-5">
              {/* Resumo */}
              <div className="bg-muted/60 rounded-2xl p-4 space-y-2 text-sm">
                <p className="font-semibold text-foreground mb-2">Sua candidatura:</p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-base">{tipoSelecionado?.emoji}</span>
                  <span>{tipoSelecionado?.label}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{qtdPessoas} {qtdPessoas === 1 ? "pessoa" : "pessoas"} no grupo</span>
                </div>
              </div>

              {/* Compromissos */}
              <div className="space-y-2.5">
                <p className="text-sm font-semibold text-foreground">
                  Para ser Líder, você se compromete a:
                </p>
                {[
                  `Compartilhar o link da excursão com meu grupo de ${tipoSelecionado?.label?.toLowerCase() ?? "amigos"}`,
                  `Convidar no mínimo ${Math.max(3, qtdPessoas - 2)} pessoas para se inscreverem`,
                  "Ser o organizador responsável pela excursão e pelo grupo",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 rounded-xl px-3.5 py-2.5">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-emerald-900 dark:text-emerald-100">{item}</span>
                  </div>
                ))}
              </div>

              {/* Checkbox de aceite */}
              <label
                htmlFor="check-compromisso"
                className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-colors ${
                  compromisso
                    ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-950/20"
                    : "border-border hover:border-indigo-200"
                }`}
              >
                <Checkbox
                  id="check-compromisso"
                  data-testid="check-compromisso"
                  checked={compromisso}
                  onCheckedChange={(v) => setCompromisso(!!v)}
                  className="mt-0.5"
                />
                <span className="text-sm font-medium text-foreground leading-snug">
                  Li e aceito os compromissos acima. Estou pronto para ser um Líder Reservei!
                </span>
              </label>

              <div className="flex justify-between items-center">
                <Button variant="ghost" onClick={prevStep} className="rounded-2xl gap-1.5 text-muted-foreground text-sm">
                  <ChevronLeft className="w-4 h-4" /> Voltar
                </Button>
                <Button
                  data-testid="btn-confirmar-lider"
                  size="lg"
                  onClick={() => tornarLiderMutation.mutate()}
                  disabled={!compromisso || tornarLiderMutation.isPending}
                  className="rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-900 font-bold px-7 gap-2 shadow-md"
                >
                  <Crown className="w-4 h-4" />
                  {tornarLiderMutation.isPending ? "Ativando..." : "Ativar minha liderança!"}
                </Button>
              </div>
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  )
}
