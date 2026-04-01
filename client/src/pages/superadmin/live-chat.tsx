import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AdminShell } from "@/components/layout-system/AdminShell";
import { PageContainer } from "@/components/layout-system";
import { AdminSidebar, AdminTopBar } from "@/components/admin";
import {
  MessageSquare, Send, Search, MapPin, CreditCard, Clock, CheckCheck,
  Paperclip, Smile, MoreVertical, Phone, Video
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data
const CONVERSATIONS = [
  {
    id: 1,
    name: "João Silva",
    avatar: "JS",
    status: "online" as const,
    lastMessage: "Qual é o horário de saída?",
    timestamp: "10:35",
    unread: 2,
    initials: "JS"
  },
  {
    id: 2,
    name: "Maria Oliveira",
    avatar: "MO",
    status: "online" as const,
    lastMessage: "Obrigada pela ajuda!",
    timestamp: "09:12",
    unread: 0,
    initials: "MO"
  },
  {
    id: 3,
    name: "Carlos Santos",
    avatar: "CS",
    status: "offline" as const,
    lastMessage: "Preciso de informações sobre o hotel",
    timestamp: "Ontem",
    unread: 0,
    initials: "CS"
  },
];

const MESSAGES = [
  {
    id: 1,
    sender: "João Silva",
    isAgent: false,
    text: "Olá, gostaria de saber mais sobre a excursão",
    timestamp: "10:15",
    read: true
  },
  {
    id: 2,
    sender: "Agent",
    isAgent: true,
    text: "Bem-vindo! A excursão inclui hospedagem e refeições. Qual seu período?",
    timestamp: "10:16",
    read: true
  },
  {
    id: 3,
    sender: "João Silva",
    isAgent: false,
    text: "Qual é o horário de saída?",
    timestamp: "10:35",
    read: true
  },
];

const CLIENT_PROFILE = {
  id: 1,
  name: "João Silva",
  email: "joao.silva@email.com",
  phone: "(11) 98765-4321",
  joinDate: "15 Mar 2024",
  totalPurchases: "R$ 2.450,00",
  status: "Ativo",
  avatar: "JS",
  purchases: [
    { id: 1, name: "Caldas Novas - Março", value: "R$ 890,00", status: "Concluída", date: "10 Mar 2024" },
    { id: 2, name: "Rio Quente Feriado", value: "R$ 1.560,00", status: "Confirmada", date: "25 Mar 2024" },
  ],
  reservations: [
    { id: 1, event: "Caldas Novas 2024", date: "10-12 Março", status: "Concluída" },
    { id: 2, event: "Rio Quente Feriado", date: "20-22 Abril", status: "Confirmada" },
  ]
};

export default function LiveChat() {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");

  const selected = CONVERSATIONS.find(c => c.id === selectedConversation);

  return (
    <AdminShell
      sidebar={<AdminSidebar currentPath="/superadmin/live-chat" />}
      topbar={<AdminTopBar title="Atendimento ao Cliente" />}
    >
      <PageContainer
        title="Atendimento em Tempo Real"
        subtitle="Gerenciar conversas com clientes e resolver dúvidas"
        icon={<MessageSquare className="w-6 h-6" />}
        data-testid="live-chat"
      >
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-200px)]">
          {/* Left Panel - Conversations List */}
          <div className="col-span-12 lg:col-span-3 border rounded-lg bg-white overflow-hidden flex flex-col">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar conversa..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="space-y-1 p-2">
                {CONVERSATIONS.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedConversation === conv.id
                        ? "bg-blue-50 border-l-4 border-blue-500"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700">
                          {conv.initials}
                        </div>
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          conv.status === "online" ? "bg-green-500" : "bg-gray-400"
                        }`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-sm truncate">{conv.name}</p>
                          <span className="text-xs text-muted-foreground">{conv.timestamp}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                      </div>
                      {conv.unread > 0 && (
                        <Badge className="bg-red-500 text-white text-xs">{conv.unread}</Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Center Panel - Chat */}
          <div className="col-span-12 lg:col-span-6 border rounded-lg bg-white overflow-hidden flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700">
                  {selected?.initials}
                </div>
                <div>
                  <p className="font-semibold">{selected?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selected?.status === "online" ? "Online agora" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {MESSAGES.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isAgent ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-xs rounded-lg p-3 ${
                      msg.isAgent
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.isAgent ? "text-blue-100" : "text-gray-500"}`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t space-y-2">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  placeholder="Digite sua mensagem..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1"
                />
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                  <Smile className="w-4 h-4" />
                </Button>
                <Button size="icon" className="h-8 w-8 bg-blue-500 hover:bg-blue-600">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Panel - Client Context */}
          <div className="col-span-12 lg:col-span-3 border rounded-lg bg-white overflow-hidden flex flex-col">
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {/* Profile Header */}
                <div className="text-center pb-4 border-b">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700 mx-auto mb-2">
                    {CLIENT_PROFILE.avatar}
                  </div>
                  <h3 className="font-semibold text-lg">{CLIENT_PROFILE.name}</h3>
                  <p className="text-xs text-muted-foreground">{CLIENT_PROFILE.email}</p>
                  <Badge className="mt-2 bg-green-100 text-green-800">{CLIENT_PROFILE.status}</Badge>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 pb-4 border-b">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{CLIENT_PROFILE.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Membro desde {CLIENT_PROFILE.joinDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold text-green-700">{CLIENT_PROFILE.totalPurchases}</span>
                  </div>
                </div>

                {/* Recent Purchases */}
                <div className="pb-4 border-b">
                  <h4 className="font-semibold text-sm mb-2">Compras Recentes</h4>
                  <div className="space-y-2">
                    {CLIENT_PROFILE.purchases.map((purchase) => (
                      <div key={purchase.id} className="text-xs p-2 bg-gray-50 rounded">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{purchase.name}</span>
                          <Badge className="bg-emerald-100 text-emerald-800 text-xs">{purchase.status}</Badge>
                        </div>
                        <p className="text-muted-foreground mt-1">{purchase.date}</p>
                        <p className="font-semibold text-green-700 mt-1">{purchase.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Reservations */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Reservas Ativas</h4>
                  <div className="space-y-2">
                    {CLIENT_PROFILE.reservations.map((res) => (
                      <div key={res.id} className="text-xs p-2 bg-blue-50 rounded border border-blue-200">
                        <div className="font-medium text-blue-900">{res.event}</div>
                        <div className="flex items-center gap-2 mt-1 text-blue-700">
                          <MapPin className="w-3 h-3" />
                          <span>{res.date}</span>
                        </div>
                        <Badge className="mt-2 bg-blue-100 text-blue-800 text-xs">{res.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </PageContainer>
    </AdminShell>
  );
}
