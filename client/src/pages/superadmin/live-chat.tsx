import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bot, Send, User, Users, Play, Pause } from "lucide-react";

type ChatGroup = { id: string; name: string; members: number; lastMsg: string; aiPaused: boolean };
type Message = { id: string; author: string; text: string; type: "ai" | "human" | "system"; time: string };

const MOCK_GROUPS: ChatGroup[] = [
  { id: "g1", name: "Caldas Novas — Turma Março", members: 24, lastMsg: "CaldasAI: Boa tarde! Restam apenas 3 vagas 🔥", aiPaused: false },
  { id: "g2", name: "Rio Quente — Abril", members: 15, lastMsg: "CaldasAI: Seu pagamento foi confirmado! ✅", aiPaused: false },
  { id: "g3", name: "Caldas Novas Família", members: 8, lastMsg: "Ana: Oi, qual o horário de saída?", aiPaused: true },
];

const INITIAL_MESSAGES: Record<string, Message[]> = {
  g1: [
    { id: "1", author: "CaldasAI", text: "👋 Boa tarde, turma! Restam apenas 3 vagas para nossa excursão de Caldas Novas. Confirme sua vaga agora pelo Pix! 🔥", type: "ai", time: "14:30" },
    { id: "2", author: "Douglas Silva", text: "Boa tarde! Já paguei o meu!", type: "human", time: "14:32" },
    { id: "3", author: "CaldasAI", text: "🎉 Pagamento do Douglas confirmado! Seja bem-vindo(a), Douglas! Vaga garantida! ✅", type: "ai", time: "14:32" },
    { id: "4", author: "Ana Souza", text: "Qual o horário de saída?", type: "human", time: "14:35" },
    { id: "5", author: "CaldasAI", text: "Olá Ana! A saída está prevista para as 22h do dia 14/05, da Praça do CPA. Precisando de mais alguma info? 😊", type: "ai", time: "14:35" },
  ],
  g2: [
    { id: "1", author: "CaldasAI", text: "Seu pagamento foi confirmado! Bem-vindo(a) ao grupo oficial da excursão Rio Quente ✅", type: "ai", time: "10:00" },
  ],
  g3: [
    { id: "1", author: "CaldasAI", text: "Olá família! A excursão está aberta para reservas 🏊", type: "ai", time: "09:00" },
    { id: "2", author: "Ana", text: "Oi, qual o horário de saída?", type: "human", time: "09:05" },
    { id: "3", author: "Sistema", text: "⚠️ CaldasAI pausado — operador humano assumiu o atendimento.", type: "system", time: "09:06" },
  ],
};

export default function LiveChat() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [selectedGroupId, setSelectedGroupId] = useState("g1");
  const [groups, setGroups] = useState(MOCK_GROUPS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedGroup = groups.find((g) => g.id === selectedGroupId)!;
  const isAIPaused = selectedGroup?.aiPaused ?? false;

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, selectedGroupId]);

  const toggleAI = useMutation({
    mutationFn: (paused: boolean) =>
      paused
        ? apiRequest("POST", `/api/handoff/${selectedGroupId}/pausar`, { operatorId: "op-001" })
        : apiRequest("POST", `/api/handoff/${selectedGroupId}/retomar`, {}),
    onSuccess: (_, paused) => {
      setGroups((prev) => prev.map((g) => g.id === selectedGroupId ? { ...g, aiPaused: paused } : g));
      const sysMsg: Message = {
        id: String(Date.now()), author: "Sistema",
        text: paused ? "⚠️ CaldasAI pausado — operador humano assumiu o atendimento." : "✅ CaldasAI retomou o atendimento automático.",
        type: "system", time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => ({ ...prev, [selectedGroupId]: [...(prev[selectedGroupId] || []), sysMsg] }));
      toast({ title: paused ? "🔴 Modo Humano ativado" : "🤖 CaldasAI retomado" });
    },
  });

  const sendMessage = () => {
    if (!inputText.trim() || !isAIPaused) return;
    const newMsg: Message = {
      id: String(Date.now()), author: "Operador",
      text: inputText,
      type: "human", time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => ({ ...prev, [selectedGroupId]: [...(prev[selectedGroupId] || []), newMsg] }));
    setInputText("");
  };

  return (
    <div className="min-h-screen bg-background" data-testid="live-chat-page">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setLocation("/admin")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
              <Bot className="w-6 h-6 text-primary" /> Central de Atendimento — Handoff
            </h1>
            <p className="text-sm text-muted-foreground">Monitore e assuma conversas do CaldasAI</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5" style={{ height: "calc(100vh - 200px)" }}>
          {/* Group list */}
          <Card className="shadow-sm overflow-hidden flex flex-col">
            <CardHeader className="py-3 px-4 border-b border-border">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> Grupos WA
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto flex-1">
              {groups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGroupId(g.id)}
                  className={`w-full text-left px-4 py-3.5 border-b border-border transition-colors ${selectedGroupId === g.id ? "bg-primary/8 border-l-2 border-l-primary" : "hover:bg-muted/30"}`}
                  data-testid={`group-item-${g.id}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-sm text-foreground leading-tight">{g.name}</p>
                    {g.aiPaused ? (
                      <Badge className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5">HUMANO</Badge>
                    ) : (
                      <Badge className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5">AI</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{g.lastMsg}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" /> {g.members} membros
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Chat area */}
          <Card className="lg:col-span-2 shadow-sm flex flex-col overflow-hidden">
            {/* Chat header */}
            <CardHeader className="py-3 px-4 border-b border-border flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-foreground text-sm">{selectedGroup?.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedGroup?.members} membros</p>
                </div>
                <div className="flex items-center gap-2">
                  {isAIPaused && (
                    <Badge className="bg-red-500 text-white text-xs font-bold animate-pulse px-2 gap-1">
                      <User className="w-3 h-3" /> MODO HUMANO
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    variant={isAIPaused ? "default" : "outline"}
                    className={`rounded-xl h-8 text-xs gap-1.5 ${isAIPaused ? "bg-emerald-500 hover:bg-emerald-400 text-white" : "border-red-300 text-red-600 hover:bg-red-50"}`}
                    onClick={() => toggleAI.mutate(!isAIPaused)}
                    disabled={toggleAI.isPending}
                    data-testid="btn-toggle-ai"
                  >
                    {isAIPaused ? (
                      <><Play className="w-3 h-3" /> Devolver ao CaldasAI</>
                    ) : (
                      <><Pause className="w-3 h-3" /> Intervir como Humano</>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/10">
              {(messages[selectedGroupId] || []).map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === "system" ? "justify-center" : msg.author === "Operador" ? "justify-end" : "justify-start"}`}
                  data-testid={`msg-${msg.id}`}
                >
                  {msg.type === "system" ? (
                    <span className="text-xs text-muted-foreground bg-muted border border-border px-3 py-1 rounded-full">{msg.text}</span>
                  ) : (
                    <div className={`max-w-[75%] space-y-1 ${msg.author === "Operador" ? "items-end" : "items-start"} flex flex-col`}>
                      <div className={`flex items-center gap-1.5 ${msg.author === "Operador" ? "justify-end" : ""}`}>
                        {msg.type === "ai" && <Bot className="w-3.5 h-3.5 text-primary" />}
                        <span className="text-xs font-semibold text-muted-foreground">{msg.author}</span>
                        <span className="text-[10px] text-muted-foreground/60">{msg.time}</span>
                      </div>
                      <div className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${msg.author === "Operador" ? "bg-primary text-white rounded-tr-sm" : msg.type === "ai" ? "bg-white border border-border text-foreground rounded-tl-sm shadow-sm" : "bg-slate-100 text-slate-700 rounded-tl-sm"}`}>
                        {msg.text}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input */}
            <div className="p-3 border-t border-border bg-white flex-shrink-0">
              {!isAIPaused && (
                <p className="text-xs text-muted-foreground text-center mb-2">
                  Clique em "Intervir como Humano" para digitar mensagens.
                </p>
              )}
              <div className="flex gap-2">
                <Input
                  placeholder={isAIPaused ? "Digite sua mensagem para o grupo..." : "CaldasAI está no controle..."}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={!isAIPaused}
                  className="rounded-xl"
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  data-testid="input-chat-msg"
                />
                <Button
                  disabled={!isAIPaused || !inputText.trim()}
                  onClick={sendMessage}
                  className="rounded-xl"
                  data-testid="btn-send-chat"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
