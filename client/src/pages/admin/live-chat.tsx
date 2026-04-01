import { useState } from "react";
import {
  MessageSquare,
  Phone,
  Video,
  MoreVertical,
  Search,
  Send,
  Paperclip,
  Smile,
  CheckCircle,
  Clock,
  MapPin,
  Phone as PhoneIcon,
  Mail,
  User,
  ShoppingBag,
  Calendar,
} from "lucide-react";
import { AdminShell, AdminCard, AdminPageHeader } from "@/components/layout-system/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Conversa {
  id: string;
  nome: string;
  avatar: string;
  status: "online" | "offline";
  ultimaMensagem: string;
  timestamp: string;
  naoLidas: number;
}

interface Mensagem {
  id: string;
  tipo: "cliente" | "agente";
  texto: string;
  timestamp: string;
  lida: boolean;
  anexo?: string;
}

interface ClienteInfo {
  nome: string;
  avatar: string;
  status: "online" | "offline";
  membro_desde: string;
  telefone: string;
  email: string;
  compras_recentes: Array<{
    id: string;
    descricao: string;
    valor: number;
    status: "Concluída" | "EM ANDAMENTO" | "CANCELADA";
    data: string;
  }>;
  reservas_ativas: Array<{
    id: string;
    local: string;
    checkin: string;
    checkout: string;
    status: "Confirmada" | "Pendente";
  }>;
}

export default function LiveChatAdmin() {
  const [conversas, setConversas] = useState<Conversa[]>([
    {
      id: "1",
      nome: "João Silva",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
      status: "online",
      ultimaMensagem: "Qual é o horário de saída?",
      timestamp: "10:45",
      naoLidas: 2,
    },
    {
      id: "2",
      nome: "Maria Santos",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
      status: "online",
      ultimaMensagem: "Obrigada! Tudo certo.",
      timestamp: "09:30",
      naoLidas: 0,
    },
    {
      id: "3",
      nome: "Pedro Costa",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
      status: "offline",
      ultimaMensagem: "Preciso de ajuda com a reserva",
      timestamp: "Ontem",
      naoLidas: 1,
    },
  ]);

  const [conversaSelecionada, setConversaSelecionada] = useState<string>("1");
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    { id: "1", tipo: "cliente", texto: "Oi, tudo bem? Tenho uma dúvida", timestamp: "10:30", lida: true },
    { id: "2", tipo: "agente", texto: "Oi! Claro, como posso ajudar?", timestamp: "10:31", lida: true },
    { id: "3", tipo: "cliente", texto: "Qual é o horário de saída do hotel?", timestamp: "10:35", lida: true },
    { id: "4", tipo: "agente", texto: "O checkout é às 12:00 do meio-dia. Você precisa de algo mais?", timestamp: "10:40", lida: false },
    { id: "5", tipo: "cliente", texto: "Qual é o horário de saída?", timestamp: "10:45", lida: false },
  ]);
  const [novaMsg, setNovaMsg] = useState("");

  const clienteSelecionado: ClienteInfo = {
    nome: "João Silva",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    status: "online",
    membro_desde: "Janeiro 2024",
    telefone: "(62) 99999-8888",
    email: "joao.silva@email.com",
    compras_recentes: [
      {
        id: "1",
        descricao: "Pacote Caldas Novas - 3 diárias",
        valor: 1500,
        status: "Concluída",
        data: "2026-03-15",
      },
      {
        id: "2",
        descricao: "Excursão com transporte",
        valor: 450,
        status: "EM ANDAMENTO",
        data: "2026-03-25",
      },
      {
        id: "3",
        descricao: "Hospedagem urbana",
        valor: 800,
        status: "Concluída",
        data: "2026-03-10",
      },
    ],
    reservas_ativas: [
      {
        id: "1",
        local: "Hotel Termas DiRoma",
        checkin: "2026-04-05",
        checkout: "2026-04-08",
        status: "Confirmada",
      },
      {
        id: "2",
        local: "Hot Park",
        checkin: "2026-04-12",
        checkout: "2026-04-14",
        status: "Pendente",
      },
    ],
  };

  const handleEnviarMsg = () => {
    if (!novaMsg.trim()) return;
    
    const novaMensagem: Mensagem = {
      id: String(mensagens.length + 1),
      tipo: "agente",
      texto: novaMsg,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      lida: false,
    };

    setMensagens([...mensagens, novaMensagem]);
    setNovaMsg("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluída":
        return "bg-green-100 text-green-700";
      case "EM ANDAMENTO":
        return "bg-blue-100 text-blue-700";
      case "CANCELADA":
        return "bg-red-100 text-red-700";
      case "Confirmada":
        return "bg-green-100 text-green-700";
      case "Pendente":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const AdminSidebar = () => (
    <nav className="space-y-2">
      <a href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700">
        <MessageSquare className="w-5 h-5" />
        <span className="text-sm font-medium">Dashboard</span>
      </a>
      <a href="/admin/financeiro" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700">
        <ShoppingBag className="w-5 h-5" />
        <span className="text-sm font-medium">Vendas</span>
      </a>
      <a href="/admin/live-chat" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-100 text-blue-700">
        <MessageSquare className="w-5 h-5" />
        <span className="text-sm font-medium">Live Chat</span>
      </a>
    </nav>
  );

  const AdminTopBar = () => (
    <div className="flex items-center justify-between w-full">
      <h2 className="text-slate-900 font-semibold">Atendimento em Tempo Real</h2>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Phone className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm">
          <Video className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <AdminShell
      sidebar={<AdminSidebar />}
      topBar={<AdminTopBar />}
      contentBackground="slate"
    >
      <AdminPageHeader
        title="Live Chat - Suporte ao Cliente"
        description="Gerencie conversas, consulte histórico e contexto do cliente"
      />

      {/* Layout Principal - 3 Painéis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
        {/* Painel 1: Lista de Conversas */}
        <AdminCard
          title="Conversas Ativas"
          noPadding
          className="flex flex-col lg:col-span-1"
        >
          <div className="p-3 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar conversa..."
                className="pl-9 h-9 text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversas.map((conversa) => (
              <button
                key={conversa.id}
                onClick={() => setConversaSelecionada(conversa.id)}
                className={cn(
                  "w-full p-3 text-left border-b border-slate-100 hover:bg-slate-50 transition-colors",
                  conversaSelecionada === conversa.id && "bg-blue-50"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <img
                      src={conversa.avatar}
                      alt={conversa.nome}
                      className="w-10 h-10 rounded-full"
                    />
                    <div
                      className={cn(
                        "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                        conversa.status === "online"
                          ? "bg-green-500"
                          : "bg-slate-300"
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-1">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {conversa.nome}
                      </p>
                      <span className="text-xs text-slate-500 flex-shrink-0">
                        {conversa.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 truncate">
                      {conversa.ultimaMensagem}
                    </p>
                    {conversa.naoLidas > 0 && (
                      <div className="mt-1 inline-block bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {conversa.naoLidas}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </AdminCard>

        {/* Painel 2: Área de Chat */}
        <AdminCard
          title="Conversa com João Silva"
          noPadding
          headerActions={
            <button className="p-1 hover:bg-slate-100 rounded">
              <MoreVertical className="w-4 h-4 text-slate-600" />
            </button>
          }
          className="flex flex-col lg:col-span-1"
        >
          {/* Histórico */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mensagens.map((msg) => (
              <div
                key={msg.id}
                className={cn("flex", msg.tipo === "agente" && "justify-end")}
              >
                <div
                  className={cn(
                    "max-w-xs rounded-lg px-3 py-2 text-sm",
                    msg.tipo === "cliente"
                      ? "bg-slate-100 text-slate-900"
                      : "bg-blue-600 text-white"
                  )}
                >
                  <p>{msg.texto}</p>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <span className="text-xs opacity-70">{msg.timestamp}</span>
                    {msg.tipo === "agente" && (
                      <CheckCircle className="w-3 h-3" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-slate-200 space-y-2">
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Smile className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={novaMsg}
                onChange={(e) => setNovaMsg(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleEnviarMsg()}
                className="h-9 text-sm"
              />
              <Button
                onClick={handleEnviarMsg}
                size="sm"
                className="h-9 w-9 p-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </AdminCard>

        {/* Painel 3: Contexto do Cliente */}
        <AdminCard
          title="Perfil do Cliente"
          noPadding
          className="flex flex-col lg:col-span-1"
        >
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Mini-perfil */}
            <div className="text-center pb-3 border-b border-slate-200">
              <img
                src={clienteSelecionado.avatar}
                alt={clienteSelecionado.nome}
                className="w-16 h-16 rounded-full mx-auto mb-2"
              />
              <h3 className="font-semibold text-slate-900">
                {clienteSelecionado.nome}
              </h3>
              <div className="flex items-center justify-center gap-2 mt-1">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    clienteSelecionado.status === "online"
                      ? "bg-green-500"
                      : "bg-slate-300"
                  )}
                />
                <span className="text-xs text-slate-600">
                  {clienteSelecionado.status === "online"
                    ? "Online"
                    : "Offline"}
                </span>
              </div>
            </div>

            {/* Informações de contato */}
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2">
                INFORMAÇÕES DE CONTATO
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-slate-600">
                    Membro desde {clienteSelecionado.membro_desde}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-slate-600">
                    {clienteSelecionado.telefone}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-600" />
                  <span className="text-sm text-slate-600">
                    {clienteSelecionado.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Compras Recentes */}
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2">
                COMPRAS RECENTES
              </p>
              <div className="space-y-2">
                {clienteSelecionado.compras_recentes.map((compra) => (
                  <div
                    key={compra.id}
                    className="bg-slate-50 rounded p-2 text-xs"
                  >
                    <div className="flex justify-between items-start gap-1 mb-1">
                      <span className="font-medium text-slate-900 line-clamp-1">
                        {compra.descricao}
                      </span>
                      <span className="font-semibold text-slate-900 flex-shrink-0">
                        R$ {compra.valor}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">{compra.data}</span>
                      <span
                        className={`px-2 py-1 rounded font-semibold ${getStatusColor(
                          compra.status
                        )}`}
                      >
                        {compra.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reservas Ativas */}
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2">
                RESERVAS ATIVAS
              </p>
              <div className="space-y-2">
                {clienteSelecionado.reservas_ativas.map((reserva) => (
                  <div
                    key={reserva.id}
                    className="bg-slate-50 rounded p-2 text-xs"
                  >
                    <div className="flex items-start gap-2 mb-1">
                      <MapPin className="w-3 h-3 text-slate-600 mt-0.5 flex-shrink-0" />
                      <span className="font-medium text-slate-900 line-clamp-1">
                        {reserva.local}
                      </span>
                    </div>
                    <div className="text-slate-500">
                      {reserva.checkin} → {reserva.checkout}
                    </div>
                    <div className="mt-1">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                          reserva.status
                        )}`}
                      >
                        {reserva.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AdminCard>
      </div>
    </AdminShell>
  );
}
