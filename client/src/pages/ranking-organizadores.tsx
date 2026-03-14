import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, Crown, Medal, Users, Trophy, BarChart3, Target } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";

type RankingItem = { nome: string; vagas: number };

const PODIUM_COLORS = ["#F59E0B", "#9CA3AF", "#CD7F32"];
const PODIUM_ICONS = ["🥇", "🥈", "🥉"];

export default function RankingOrganizadoresPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const isOrganizador = user?.role === "LIDER" || user?.role === "admin";
  const isAdmin = user?.role === "admin";

  const { data, isLoading } = useQuery<{ ranking: RankingItem[] }>({
    queryKey: ["/api/gamification/ranking-organizadores"],
  });

  const ranking = data?.ranking ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" data-testid="ranking-loading">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const podium = ranking.slice(0, 3);
  const restantes = ranking.slice(3);

  return (
    <div className="min-h-screen bg-background pb-20" data-testid="ranking-organizadores-page">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setLocation("/")} className="text-muted-foreground hover:text-foreground" data-testid="btn-voltar-ranking">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
              <Crown className="w-7 h-7 text-amber-500" /> Ranking de Organizadores
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Top organizadores por vagas vendidas este mês</p>
          </div>
        </div>

        {ranking.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Nenhum organizador no ranking ainda.</p>
              <p className="text-xs text-muted-foreground mt-1">Os dados aparecem quando houver reservas confirmadas.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3 mb-8">
              {podium.map((item, i) => (
                <Card
                  key={i}
                  className={`text-center p-4 border-2 ${i === 0 ? "border-amber-300 bg-amber-50 shadow-lg" : "border-border"}`}
                  data-testid={`podium-${i + 1}`}
                >
                  <div className="text-3xl mb-1">{PODIUM_ICONS[i]}</div>
                  <p className="text-sm font-bold text-foreground truncate">{item.nome}</p>
                  <p className="text-2xl font-black mt-1" style={{ color: PODIUM_COLORS[i] }}>
                    {item.vagas}
                  </p>
                  <p className="text-[10px] text-muted-foreground">vagas vendidas</p>
                </Card>
              ))}
              {podium.length < 3 &&
                Array.from({ length: 3 - podium.length }).map((_, i) => (
                  <Card key={`empty-${i}`} className="text-center p-4 border-2 border-dashed border-border opacity-40">
                    <div className="text-3xl mb-1">{PODIUM_ICONS[podium.length + i]}</div>
                    <p className="text-sm text-muted-foreground">—</p>
                  </Card>
                ))}
            </div>

            {restantes.length > 0 && (
              <Card data-testid="tabela-ranking-restantes">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Medal className="w-5 h-5 text-primary" /> Posições 4–{3 + restantes.length}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {restantes.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30"
                        data-testid={`ranking-row-${i + 4}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-muted-foreground w-6 text-center">{i + 4}º</span>
                          <span className="text-sm font-medium text-foreground">{item.nome}</span>
                        </div>
                        <span className="text-sm font-bold text-primary">{item.vagas} vagas</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {isOrganizador && (
          <Card className="mt-8 border-amber-200 bg-amber-50/50" data-testid="section-organizador-ranking">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" /> Área do Organizador
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/organizer/metas" className="flex items-center gap-3 p-3 rounded-xl bg-white border border-amber-100 hover:shadow-md transition-shadow no-underline" data-testid="link-minhas-metas">
                <Target className="w-5 h-5 text-amber-500" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">Minhas Metas</p>
                  <p className="text-xs text-muted-foreground">Acompanhe seu progresso e resgatar recompensas</p>
                </div>
              </Link>
              <Link href="/criar-excursao" className="flex items-center gap-3 p-3 rounded-xl bg-white border border-amber-100 hover:shadow-md transition-shadow no-underline" data-testid="link-criar-excursao-ranking">
                <Users className="w-5 h-5 text-amber-500" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">Criar Nova Excursão</p>
                  <p className="text-xs text-muted-foreground">Monte sua próxima viagem e suba no ranking</p>
                </div>
              </Link>
            </CardContent>
          </Card>
        )}

        {isAdmin && (
          <Card className="mt-4 border-red-200 bg-red-50/30" data-testid="section-admin-ranking">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-red-500" /> Painel Administrativo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/super-financeiro" className="flex items-center gap-3 p-3 rounded-xl bg-white border border-red-100 hover:shadow-md transition-shadow no-underline" data-testid="link-admin-financeiro-ranking">
                <BarChart3 className="w-5 h-5 text-red-500" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">Relatório Financeiro</p>
                  <p className="text-xs text-muted-foreground">KPIs, gráficos e exportação CSV</p>
                </div>
              </Link>
              <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-xl bg-white border border-red-100 hover:shadow-md transition-shadow no-underline" data-testid="link-admin-painel-ranking">
                <Users className="w-5 h-5 text-red-500" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">Painel Admin Completo</p>
                  <p className="text-xs text-muted-foreground">Gerenciar passageiros, excursões e mais</p>
                </div>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
