import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface FloatingChatProps {
  excursaoId?: string;
  excursaoNome?: string;
}

export function FloatingChat({ excursaoId, excursaoNome }: FloatingChatProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Olá! Sou a assistente da excursão${excursaoNome ? ` "${excursaoNome}"` : ""}. Como posso ajudar?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 800));

    const responses: string[] = [
      "Boa pergunta! Vou verificar as informações da excursão para você.",
      "Para detalhes sobre pagamentos, você pode consultar a aba Financeiro do grupo.",
      "O roteiro completo está disponível na aba Roteiro. Lá você vê todos os atrativos!",
      "Para adicionar um acompanhante, compartilhe o link de convite com a pessoa.",
      "Dúvidas sobre o hotel? Veja a seleção de hospedagem no roteiro oficial.",
    ];
    const reply = responses[Math.floor(Math.random() * responses.length)];

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: reply,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMsg]);
    setLoading(false);
  };

  return (
    <>
      {open && (
        <div
          data-testid="floating-chat-window"
          className="fixed bottom-20 right-4 w-80 h-96 bg-card border border-card-border rounded-xl shadow-xl flex flex-col z-50"
        >
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Assistente RSV</span>
            </div>
            <Button size="icon" variant="ghost" onClick={() => setOpen(false)} data-testid="button-close-chat">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${msg.role === "assistant" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {msg.role === "assistant" ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                </div>
                <div
                  className={`max-w-[70%] rounded-lg px-2.5 py-1.5 text-xs ${msg.role === "assistant" ? "bg-muted" : "bg-primary text-primary-foreground"}`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3 h-3" />
                </div>
                <div className="bg-muted rounded-lg px-2.5 py-1.5 text-xs flex gap-1">
                  <span className="animate-bounce">·</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>·</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>·</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2 p-2 border-t">
            <Input
              data-testid="input-chat-message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Digite sua pergunta..."
              className="text-xs h-8"
            />
            <Button size="icon" onClick={sendMessage} disabled={loading || !input.trim()} data-testid="button-send-chat" className="h-8 w-8">
              <Send className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}

      <Button
        data-testid="button-open-chat"
        size="icon"
        className="fixed bottom-4 right-4 rounded-full shadow-lg z-50 h-12 w-12"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </Button>
    </>
  );
}
