import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  MessageSquare, ShieldAlert, Plus, Users, CheckCircle, Loader2,
  Send, Wifi, WifiOff, Phone, BarChart3, ArrowLeft, Bot
} from "lucide-react";

type WaasGroup = {
  id: string; excursaoId: string; name: string; waGroupId?: string;
  organizer: string; phone: string;
  kycStatus: "APPROVED" | "PENDING" | "BLOCKED";
  members: number; paymentProgress: number; isProvisioned: boolean;
};

const MOCK_GROUPS: WaasGroup[] = [
  { id: "g1", excursaoId: "exc1", name: "Caldas Novas — Turma Março/26", waGroupId: "120363xxx@g.us", organizer: "Douglas Silva", phone: "5565999001122", kycStatus: "APPROVED", members: 24, paymentProgress: 75, isProvisioned: true },
  { id: "g2", excursaoId: "exc2", name: "Rio Quente — Feriado Abril", waGroupId: undefined, organizer: "Ana Souza", phone: "5565988334455", kycStatus: "PENDING", members: 8, paymentProgress: 30, isProvisioned: false },
  { id: "g3", excursaoId: "exc3", name: "Caldas Novas Família 2026", waGroupId: "120363yyy@g.us", organizer: "Carlos Lima", phone: "5511977889900", kycStatus: "BLOCKED", members: 0, paymentProgress: 0, isProvisioned: false },
];

export default function WaaSDashboard() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [, setLocation] = useLocation();

  const [createOpen, setCreateOpen] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);
  const [pollOpen, setPollOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<WaasGroup | null>(null);

  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupPhone, setNewGroupPhone] = useState("");
  const [msgText, setMsgText] = useState("");
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOpts, setPollOpts] = useState("Opção A\nOpção B");

  const { data: statusData } = useQuery<{ configured: boolean; demo: boolean }>({
    queryKey: ["/api/waas/status"],
  });

  const createGroup = useMutation({
    mutationFn: (body: { name: string; phone: string }) =>
      apiRequest("POST", "/api/waas/criar-grupo", body),
    onSuccess: () => {
      toast({ title: "✅ Grupo criado!", description: "Grupo WhatsApp da excursão criado com sucesso." });
      setCreateOpen(false); setNewGroupName(""); setNewGroupPhone("");
      qc.invalidateQueries({ queryKey: ["/api/waas/grupos"] });
    },
    onError: () => toast({ title: "Erro ao criar grupo", variant: "destructive" }),
  });

  const sendMsg = useMutation({
    mutationFn: (body: { groupId: string; text: string }) =>
      apiRequest("POST", `/api/waas/${body.groupId}/mensagem`, { text: body.text }),
    onSuccess: () => { toast({ title: "📨 Mensagem enviada!" }); setMsgOpen(false); setMsgText(""); },
    onError: () => toast({ title: "Erro ao enviar", variant: "destructive" }),
  });

  const sendPoll = useMutation({
    mutationFn: (body: { groupId: string; question: string; options: string[] }) =>
      apiRequest("POST", `/api/waas/${body.groupId}/enquete`, { question: body.question, options: body.options }),
    onSuccess: () => { toast({ title: "📊 Enquete enviada pelo CaldasAI!" }); setPollOpen(false); },
    onError: () => toast({ title: "Erro ao enviar enquete", variant: "destructive" }),
  });

  const groups = MOCK_GROUPS;
  const totalMembers = groups.reduce((s, g) => s + g.members, 0);
  const activeGroups = groups.filter((g) => g.isProvisioned).length;

  const kycColor = (s: string) =>
    s === "APPROVED" ? "bg-emerald-100 text-emerald-700" :
    s === "BLOCKED" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700";

  return (
    <div className="min-h-screen bg-background pb-20" data-testid="waas-dashboard">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setLocation("/admin")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
              <Bot className="w-6 h-6 text-primary" /> WhatsApp as a Service
            </h1>
            <p className="text-sm text-muted-foreground">Gerencie grupos de excursão no WhatsApp via CaldasAI</p>
          </div>
          <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full ${statusData?.configured ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
            {statusData?.configured ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            {statusData?.demo ? "Modo demo" : "Conectado"}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Grupos ativos", value: activeGroups, icon: Users, color: "text-primary" },
            { label: "Membros totais", value: totalMembers, icon: Users, color: "text-emerald-600" },
            { label: "KYC aprovados", value: groups.filter(g => g.kycStatus === "APPROVED").length, icon: CheckCircle, color: "text-emerald-600" },
            { label: "Em risco", value: groups.filter(g => g.kycStatus !== "APPROVED").length, icon: ShieldAlert, color: "text-red-500" },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label} className="text-center p-4">
              <Icon className={`w-6 h-6 mx-auto mb-1 ${color}`} />
              <p className="text-2xl font-extrabold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </Card>
          ))}
        </div>

        {/* Actions bar */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-foreground">Grupos de excursão</h2>
          <Button onClick={() => setCreateOpen(true)} className="rounded-xl gap-2 h-9 text-sm" data-testid="btn-create-group">
            <Plus className="w-4 h-4" /> Criar Grupo WA
          </Button>
        </div>

        {/* Groups table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Grupo</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Organizador / KYC</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Membros</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Pagamentos</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((g) => (
                    <tr key={g.id} className="border-b border-border last:border-0 hover:bg-muted/20" data-testid={`waas-group-row-${g.id}`}>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-foreground">{g.name}</p>
                        <p className="text-xs text-muted-foreground">{g.isProvisioned ? `WA: ${g.waGroupId?.slice(0, 18)}...` : "Sem grupo WA"}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{g.organizer}</p>
                        <span className={`inline-flex text-xs font-bold rounded-full px-2 py-0.5 mt-0.5 ${kycColor(g.kycStatus)}`}>
                          {g.kycStatus === "APPROVED" ? "✓ Verificado" : g.kycStatus === "BLOCKED" ? "✗ Bloqueado" : "⏳ Pendente"}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <p className="font-semibold">{g.members}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <Progress value={g.paymentProgress} className="w-16 h-2" />
                          <span className="text-xs text-muted-foreground">{g.paymentProgress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5 flex-wrap">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs rounded-lg gap-1"
                            disabled={!g.isProvisioned}
                            onClick={() => { setSelectedGroup(g); setMsgOpen(true); }}
                            data-testid={`btn-intervir-${g.id}`}
                          >
                            <MessageSquare className="w-3 h-3" /> Intervir
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs rounded-lg gap-1"
                            disabled={!g.isProvisioned}
                            onClick={() => { setSelectedGroup(g); setPollOpen(true); }}
                            data-testid={`btn-enquete-${g.id}`}
                          >
                            <BarChart3 className="w-3 h-3" /> Enquete
                          </Button>
                          {!g.isProvisioned && g.kycStatus === "APPROVED" && (
                            <Button
                              size="sm"
                              className="h-7 text-xs rounded-lg gap-1 bg-primary"
                              onClick={() => createGroup.mutate({ name: g.name, phone: g.phone })}
                              data-testid={`btn-criar-wa-${g.id}`}
                            >
                              <Phone className="w-3 h-3" /> Criar WA
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Group Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md" data-testid="create-group-dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Bot className="w-5 h-5 text-primary" /> Criar Grupo no WhatsApp</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Nome do grupo</label>
              <Input value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} placeholder="Ex: Caldas Novas — Turma Julho" className="rounded-xl" data-testid="input-group-name" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">WhatsApp do organizador (com DDD e 55)</label>
              <Input value={newGroupPhone} onChange={(e) => setNewGroupPhone(e.target.value)} placeholder="5565999001122" className="rounded-xl" data-testid="input-group-phone" />
            </div>
            {statusData?.demo && (
              <div className="text-xs bg-amber-50 text-amber-800 border border-amber-200 rounded-lg px-3 py-2">
                Modo demo ativo — configure EVOLUTION_API_URL e EVOLUTION_API_KEY para ação real.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)} className="rounded-xl">Cancelar</Button>
            <Button
              onClick={() => createGroup.mutate({ name: newGroupName, phone: newGroupPhone })}
              disabled={createGroup.isPending || !newGroupName.trim() || !newGroupPhone.trim()}
              className="rounded-xl gap-2"
              data-testid="btn-confirm-create-group"
            >
              {createGroup.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Criando...</> : <><Bot className="w-4 h-4" /> Criar Grupo</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Message Dialog */}
      <Dialog open={msgOpen} onOpenChange={setMsgOpen}>
        <DialogContent className="max-w-md" data-testid="send-msg-dialog">
          <DialogHeader>
            <DialogTitle>Enviar mensagem — {selectedGroup?.name}</DialogTitle>
          </DialogHeader>
          <Textarea
            value={msgText}
            onChange={(e) => setMsgText(e.target.value)}
            placeholder="Digite a mensagem para o grupo..."
            className="rounded-xl min-h-[100px] resize-none"
            data-testid="input-msg-text"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setMsgOpen(false)} className="rounded-xl">Cancelar</Button>
            <Button
              onClick={() => selectedGroup && sendMsg.mutate({ groupId: selectedGroup.id, text: msgText })}
              disabled={sendMsg.isPending || !msgText.trim()}
              className="rounded-xl gap-2"
              data-testid="btn-send-msg"
            >
              {sendMsg.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Poll Dialog */}
      <Dialog open={pollOpen} onOpenChange={setPollOpen}>
        <DialogContent className="max-w-md" data-testid="send-poll-dialog">
          <DialogHeader>
            <DialogTitle>Enquete — {selectedGroup?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Pergunta</label>
              <Input value={pollQuestion} onChange={(e) => setPollQuestion(e.target.value)} placeholder="Ex: Qual horário preferem sair?" className="rounded-xl" data-testid="input-poll-question" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Opções (uma por linha)</label>
              <Textarea value={pollOpts} onChange={(e) => setPollOpts(e.target.value)} className="rounded-xl resize-none min-h-[80px]" data-testid="input-poll-options" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPollOpen(false)} className="rounded-xl">Cancelar</Button>
            <Button
              onClick={() => selectedGroup && sendPoll.mutate({ groupId: selectedGroup.id, question: pollQuestion, options: pollOpts.split("\n").filter(Boolean) })}
              disabled={sendPoll.isPending || !pollQuestion.trim()}
              className="rounded-xl gap-2"
              data-testid="btn-send-poll"
            >
              {sendPoll.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Disparar enquete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
