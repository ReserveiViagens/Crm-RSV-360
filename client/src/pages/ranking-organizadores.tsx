import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, Crown, Medal, Users } from "lucide-react";

type RankingItem = { nome: string; vagas: number };

const PODIUM_COLORS = ["#F59E0B", "#9CA3AF", "#CD7F32"];
const PODIUM_ICONS = ["🥇", "🥈", "🥉"];

export default function RankingOrganizadoresPage() {
  const [, setLocation] = useLocation();

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
      </div>
    </div>
  );
}
