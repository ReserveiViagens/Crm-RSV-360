import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, Trophy, Flame, Gift, Clock, Rocket } from "lucide-react";
import { Link } from "wouter";

type PontosData = { pontos: number; streak: number; nome: string };
type HistoricoItem = { data: string; motivo: string; valor: number };
type Conquista = { id: string; titulo: string; descricao: string; icone: string; desbloqueada: boolean };

export default function MinhaJornadaPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const { data: pontosData, isLoading: loadingPontos } = useQuery<PontosData>({
    queryKey: ["/api/gamification/pontos"],
  });

  const { data: historicoData, isLoading: loadingHist } = useQuery<{ historico: HistoricoItem[] }>({
    queryKey: ["/api/gamification/historico"],
  });

  const { data: conquistasData, isLoading: loadingConq } = useQuery<{ conquistas: Conquista[] }>({
    queryKey: ["/api/gamification/conquistas"],
  });

  const pontos = pontosData?.pontos ?? 0;
  const streak = pontosData?.streak ?? 0;
  const historico = historicoData?.historico ?? [];
  const conquistas = conquistasData?.conquistas ?? [];
  const isLoading = loadingPontos || loadingHist || loadingConq;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" data-testid="minha-jornada-loading">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20" data-testid="minha-jornada-page">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setLocation("/perfil")} className="text-muted-foreground hover:text-foreground" data-testid="btn-voltar-jornada">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
              <Trophy className="w-7 h-7 text-amber-500" /> Minha Jornada RSV
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Olá, {user?.nome ?? "Viajante"}! Acompanhe seus pontos e conquistas.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div
            className="rounded-2xl p-5 text-center"
            style={{ background: "linear-gradient(135deg, #FFF7ED, #FFEDD5)" }}
            data-testid="card-saldo-pontos"
          >
            <div className="text-3xl mb-1">🪙</div>
            <p className="text-xs text-amber-700 font-medium mb-1">Saldo de Pontos</p>
            <p className="text-3xl font-black text-amber-600">
              {pontos.toLocaleString("pt-BR")}
            </p>
          </div>
          <div
            className="rounded-2xl p-5 text-center"
            style={{ background: "linear-gradient(135deg, #FEF2F2, #FEE2E2)" }}
            data-testid="card-streak"
          >
            <Flame className="w-8 h-8 mx-auto mb-1 text-red-500" />
            <p className="text-xs text-red-700 font-medium mb-1">Viagens Confirmadas</p>
            <p className="text-3xl font-black text-red-500">{streak}</p>
          </div>
        </div>

        <Card className="mb-6" data-testid="section-conquistas">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" /> Conquistas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {conquistas.map((c) => (
                <div
                  key={c.id}
                  className={`rounded-xl p-3 text-center border-2 transition-all ${
                    c.desbloqueada
                      ? "border-amber-300 bg-amber-50 shadow-sm"
                      : "border-border bg-muted/30 opacity-50"
                  }`}
                  data-testid={`conquista-${c.id}`}
                >
                  <div className="text-2xl mb-1">{c.icone}</div>
                  <p className="text-xs font-bold text-foreground">{c.titulo}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{c.descricao}</p>
                  {c.desbloqueada && (
                    <Badge className="mt-1.5 bg-amber-500 text-white text-[9px] px-1.5">Desbloqueada</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6" data-testid="section-historico-pontos">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Histórico de Pontos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {historico.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum ponto acumulado ainda. Faça sua primeira reserva!
              </p>
            ) : (
              <div className="space-y-2">
                {historico.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30"
                    data-testid={`historico-item-${i}`}
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.motivo}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-amber-600">+{item.valor} pts</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 to-indigo-50 border-primary/20" data-testid="card-cta-pontos">
          <CardContent className="p-6 text-center">
            <Rocket className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-base font-bold text-foreground mb-1">Acumule mais pontos!</p>
            <p className="text-sm text-muted-foreground mb-3">
              Cada R$1 pago via PIX = 1 ponto. Viaje com a RSV360 e desbloqueie conquistas exclusivas.
            </p>
            <Link href="/" className="text-sm font-semibold text-primary hover:underline" data-testid="link-explorar-viagens">
              Explorar viagens disponíveis
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
