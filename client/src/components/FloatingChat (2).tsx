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
  isOpen?: boolean;
  unreadCount?: number;
  onToggle?: () => void;
}

export function FloatingChat({ excursaoId, excursaoNome, isOpen: isOpenProp, unreadCount = 0, onToggle }: FloatingChatProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isOpenProp !== undefined ? isOpenProp : internalOpen;
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
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const toggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalOpen((v) => !v);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/caldas-ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, excursaoId }),
      });
      let botContent = "Desculpe, não consegui processar sua mensagem.";
      if (res.ok) {
        const data = await res.json() as { response?: string; message?: string };
        botContent = data.response ?? data.message ?? botContent;
      }
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: botContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Não consegui me conectar ao servidor. Tente novamente.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="floating-chat" style={{ position: "fixed", bottom: 80, right: 16, zIndex: 1000 }}>
      {open && (
        <div style={{
          width: 320,
          maxHeight: 400,
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          marginBottom: 8,
        }}>
          <div style={{ padding: "10px 14px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Bot className="w-4 h-4 text-primary" />
              <span style={{ fontSize: 13, fontWeight: 600 }}>Assistente de Viagem</span>
            </div>
            <button onClick={toggle} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px", minHeight: 200, maxHeight: 280, display: "flex", flexDirection: "column", gap: 8 }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: "flex", gap: 6, alignItems: "flex-start", flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: msg.role === "user" ? "#2563EB" : "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {msg.role === "user" ? <User className="w-3 h-3 text-white" /> : <Bot className="w-3 h-3 text-primary" />}
                </div>
                <div style={{ background: msg.role === "user" ? "#2563EB" : "#F9FAFB", color: msg.role === "user" ? "#fff" : "#111827", borderRadius: 8, padding: "6px 10px", fontSize: 12, maxWidth: "80%" }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Bot className="w-3 h-3 text-primary" />
                </div>
                <div style={{ background: "#F9FAFB", borderRadius: 8, padding: "6px 10px", fontSize: 12 }}>...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: "8px 12px", borderTop: "1px solid #F3F4F6", display: "flex", gap: 6 }}>
            <Input
              data-testid="input-chat"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Enviar mensagem..."
              style={{ fontSize: 12, height: 32 }}
            />
            <Button size="icon" onClick={sendMessage} disabled={loading} data-testid="button-send-chat" style={{ height: 32, width: 32 }}>
              <Send className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}

      <button
        data-testid="button-toggle-chat"
        onClick={toggle}
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "#2563EB",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px rgba(37,99,235,0.3)",
          position: "relative",
        }}
      >
        <MessageCircle className="w-5 h-5 text-white" />
        {unreadCount > 0 && (
          <div style={{
            position: "absolute",
            top: -4,
            right: -4,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#EF4444",
            color: "#fff",
            fontSize: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
          }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </div>
        )}
      </button>
    </div>
  );
}
