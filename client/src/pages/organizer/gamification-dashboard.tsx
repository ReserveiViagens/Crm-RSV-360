import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Gift, Target, Lock, Loader2, ArrowLeft, Sparkles, TrendingUp, Star, AlertTriangle } from "lucide-react";

type OrganizerGoal = {
  id: string;
  nivel: number;
  title: string;
  description: string;
  targetSeats: number;
  achievedSeats: number;
  rewardType: "CORTESIA" | "CASHBACK" | "UPGRADE_DIVERSAO";
  rewardValue: string;
  status: "LOCKED" | "UNLOCKED" | "CLAIMED";
};

type MetasResponse = {
  goals: OrganizerGoal[];
  totalSeats: number;
};

const rewardIcon = (type: string) => type === "CORTESIA" ? "🎟️" : type === "CASHBACK" ? "💰" : "🏨";
const rewardColor = (status: string) =>
  status === "CLAIMED" ? "border-emerald-300 bg-emerald-50" :
  status === "UNLOCKED" ? "border-amber-300 bg-amber-50 shadow-lg" : "border-border bg-white";

const nivelLabel = (nivel: number) =>
  nivel === 1 ? "Nível 1" : nivel === 2 ? "Nível 2" : "Nível 3";

const nivelColor = (nivel: number) =>
  nivel === 1 ? "bg-blue-100 text-blue-700" : nivel === 2 ? "bg-purple-100 text-purple-700" : "bg-amber-100 text-amber-700";

export default function GamificationDashboard() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const qc = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id ?? "anonymous";

  const { data, isLoading } = useQuery<MetasResponse>({
    queryKey: ["/api/organizador", userId, "metas"],
    queryFn: () => fetch(`/api/organizador/${userId}/metas`).then(r => r.json()),
    refetchInterval: 30000,
  });

  const goals = data?.goals ?? [];
  const totalSeats = data?.totalSeats ?? 0;

  const prevGoalsRef = useRef<OrganizerGoal[]>([]);
  useEffect(() => {
    if (goals.length === 0) return;
    const prev = prevGoalsRef.current;
    if (prev.length > 0) {
      for (const goal of goals) {
        const old = prev.find(g => g.id === goal.id);
        if (old && old.status === "LOCKED" && goal.status === "UNLOCKED") {
          toast({
            title: `🏆 Meta desbloqueada: ${goal.title}!`,
            description: "Clique em Resgatar para receber seu bônus.",
          });
        }
      }
    }
    prevGoalsRef.current = goals;
  }, [goals, toast]);

  const resgatarMeta = useMutation({
    mutationFn: (goalId: string) => apiRequest("PATCH", `/api/organizador/metas/${goalId}/resgatar`, {}),
    onSuccess: () => {
      toast({ title: "🎉 Recompensa resgatada!", description: "Nossa equipe entrará em contato em até 48h." });
      qc.invalidateQueries({ queryKey: ["/api/organizador", userId, "metas"] });
    },
    onError: () => toast({ title: "Erro ao resgatar", variant: "destructive" }),
  });

  const thisMonthGroups = 2;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" data-testid="gamification-dashboard-loading">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20" data-testid="gamification-dashboard">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setLocation("/")} className="text-muted-foreground hover:text-foreground" data-testid="btn-voltar-gamification">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
              <Trophy className="w-7 h-7 text-amber-500" /> Suas Metas e Recompensas
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Quanto mais você vende, mais você ganha!</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: Target, label: "Vagas vendidas este mês", value: totalSeats, color: "text-primary" },
            { icon: TrendingUp, label: "Grupos criados", value: thisMonthGroups, color: "text-emerald-600" },
            { icon: Star, label: "Recompensas disponíveis", value: goals.filter(g => g.status === "UNLOCKED").length, color: "text-amber-500" },
          ].map(({ icon: Icon, label, value, color }) => (
            <Card key={label} className="text-center p-4" data-testid={`summary-card-${label.replace(/\s/g, "-").toLowerCase()}`}>
              <Icon className={`w-6 h-6 mx-auto mb-1 ${color}`} />
              <p className="text-2xl font-extrabold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground leading-tight">{label}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {goals.map((goal) => {
            const pct = Math.min(100, Math.round((goal.achievedSeats / goal.targetSeats) * 100));
            const isUnlocked = goal.status === "UNLOCKED";
            const isClaimed = goal.status === "CLAIMED";
            return (
              <Card key={goal.id} className={`relative overflow-hidden border-2 transition-all ${rewardColor(goal.status)}`} data-testid={`goal-card-${goal.id}`}>
                <div className={`absolute top-0 left-0 w-1.5 h-full rounded-l-xl ${isClaimed ? "bg-emerald-400" : isUnlocked ? "bg-amber-400" : "bg-border"}`} />
                <CardHeader className="pl-6 pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{rewardIcon(goal.rewardType)}</span>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <Badge className={`text-[10px] px-1.5 py-0 font-bold ${nivelColor(goal.nivel)}`} data-testid={`badge-nivel-${goal.id}`}>
                            {nivelLabel(goal.nivel)}
                          </Badge>
                        </div>
                        <CardTitle className="text-base">{goal.title}</CardTitle>
                        <CardDescription className="text-xs mt-0.5">{goal.description}</CardDescription>
                      </div>
                    </div>
                    {isUnlocked && !isClaimed && (
                      <Badge className="bg-amber-500 text-white text-xs flex-shrink-0 animate-pulse">🏆 Disponível</Badge>
                    )}
                    {isClaimed && (
                      <Badge className="bg-emerald-500 text-white text-xs flex-shrink-0">✓ Resgatado</Badge>
                    )}
                    {goal.status === "LOCKED" && (
                      <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pl-6 space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{goal.achievedSeats} vagas vendidas</span>
                      <span className="font-semibold">{pct}% — meta: {goal.targetSeats}</span>
                    </div>
                    <Progress value={pct} className={`h-2.5 ${isUnlocked || isClaimed ? "[&>div]:bg-amber-500" : ""}`} />
                  </div>

                  {goal.status === "LOCKED" && (
                    <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200" data-testid={`aviso-meta-${goal.id}`}>
                      <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] text-amber-800 font-medium leading-snug">
                        Você precisa atingir esta meta para que o sistema libere o bônus automaticamente.
                        Faltam <strong>{goal.targetSeats - goal.achievedSeats}</strong> vagas!
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Gift className="w-3.5 h-3.5 text-primary" />
                      <span className="font-medium">{goal.rewardValue}</span>
                    </div>
                    {isUnlocked && !isClaimed && (
                      <Button
                        size="sm"
                        className="h-8 text-xs rounded-xl bg-amber-500 hover:bg-amber-400 text-white gap-1"
                        onClick={() => resgatarMeta.mutate(goal.id)}
                        disabled={resgatarMeta.isPending}
                        data-testid={`btn-resgatar-${goal.id}`}
                      >
                        {resgatarMeta.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        Resgatar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-gradient-to-br from-primary/5 to-indigo-50 border-primary/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> Como funciona o programa de recompensas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              {[
                { step: "1", title: "Crie seu grupo", desc: "Monte uma excursão e convide passageiros pelo WhatsApp com o CaldasAI." },
                { step: "2", title: "Venda as vagas", desc: "Cada pagamento confirmado conta automaticamente para suas metas." },
                { step: "3", title: "Resgate a recompensa", desc: "Bata a meta e clique em 'Resgatar'. Você recebe em até 48 horas." },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{step}</div>
                  <div>
                    <p className="font-semibold text-foreground">{title}</p>
                    <p className="text-muted-foreground text-xs mt-0.5 leading-snug">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
