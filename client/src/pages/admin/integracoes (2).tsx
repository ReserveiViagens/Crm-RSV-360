import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Settings, ExternalLink, Clock, CheckCircle, XCircle, AlertCircle, Zap, MessageSquare } from "lucide-react";
import { SiWhatsapp, SiInstagram, SiTiktok, SiYoutube, SiTelegram } from "react-icons/si";

interface ChannelCard {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  status: "connected" | "disconnected";
  metrics: { label: string; value: string }[];
}

interface Interaction {
  id: string;
  user: string;
  channel: string;
  channelIcon: React.ReactNode;
  channelColor: string;
  action: string;
  time: string;
}

interface WebhookEvent {
  id: string;
  event: string;
  status: "success" | "error" | "pending";
  timestamp: string;
  payload: string;
}

const channels: ChannelCard[] = [
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    icon: <SiWhatsapp size={28} />,
    color: "#25D366",
    bgColor: "rgba(37, 211, 102, 0.1)",
    status: "connected",
    metrics: [
      { label: "Mensagens hoje", value: "47" },
      { label: "Conversões", value: "12" },
      { label: "Taxa resposta", value: "94%" },
    ],
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: <SiInstagram size={28} />,
    color: "#E4405F",
    bgColor: "rgba(228, 64, 95, 0.1)",
    status: "connected",
    metrics: [
      { label: "Seguidores", value: "2.340" },
      { label: "Reels postados", value: "8" },
      { label: "Engajamento", value: "4,2%" },
    ],
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: <SiTiktok size={28} />,
    color: "#000000",
    bgColor: "rgba(0, 0, 0, 0.06)",
    status: "connected",
    metrics: [
      { label: "Seguidores", value: "890" },
      { label: "Vídeos", value: "15" },
      { label: "Views totais", value: "45,2K" },
    ],
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: <SiYoutube size={28} />,
    color: "#FF0000",
    bgColor: "rgba(255, 0, 0, 0.08)",
    status: "connected",
    metrics: [
      { label: "Inscritos", value: "350" },
      { label: "Shorts", value: "6" },
      { label: "Views", value: "12,8K" },
    ],
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: <SiTelegram size={28} />,
    color: "#0088CC",
    bgColor: "rgba(0, 136, 204, 0.1)",
    status: "disconnected",
    metrics: [
      { label: "Membros do grupo", value: "120" },
      { label: "Mensagens/dia", value: "35" },
      { label: "Novos membros", value: "+8" },
    ],
  },
];

const mockInteractions: Interaction[] = [
  {
    id: "1",
    user: "Maria R.",
    channel: "WhatsApp",
    channelIcon: <SiWhatsapp size={16} />,
    channelColor: "#25D366",
    action: "Reserva confirmada",
    time: "14:32",
  },
  {
    id: "2",
    user: "Carlos S.",
    channel: "Instagram",
    channelIcon: <SiInstagram size={16} />,
    channelColor: "#E4405F",
    action: "Comentou no reel de Caldas Novas",
    time: "14:18",
  },
  {
    id: "3",
    user: "Juliana M.",
    channel: "WhatsApp",
    channelIcon: <SiWhatsapp size={16} />,
    channelColor: "#25D366",
    action: "Solicitou orçamento grupo 12 pessoas",
    time: "13:55",
  },
  {
    id: "4",
    user: "Roberto L.",
    channel: "Telegram",
    channelIcon: <SiTelegram size={16} />,
    channelColor: "#0088CC",
    action: "Entrou no grupo de promoções",
    time: "13:40",
  },
  {
    id: "5",
    user: "Fernanda A.",
    channel: "TikTok",
    channelIcon: <SiTiktok size={16} />,
    channelColor: "#000000",
    action: "Salvou vídeo do Hot Park",
    time: "13:22",
  },
  {
    id: "6",
    user: "Lucas P.",
    channel: "YouTube",
    channelIcon: <SiYoutube size={16} />,
    channelColor: "#FF0000",
    action: "Se inscreveu no canal",
    time: "12:50",
  },
  {
    id: "7",
    user: "Amanda G.",
    channel: "WhatsApp",
    channelIcon: <SiWhatsapp size={16} />,
    channelColor: "#25D366",
    action: "Pagamento Pix confirmado",
    time: "12:35",
  },
  {
    id: "8",
    user: "Marcos T.",
    channel: "Instagram",
    channelIcon: <SiInstagram size={16} />,
    channelColor: "#E4405F",
    action: "Enviou DM pedindo informações",
    time: "12:10",
  },
];

const mockWebhooks: WebhookEvent[] = [
  { id: "1", event: "payment.confirmed", status: "success", timestamp: "2026-03-15 14:32:10", payload: "Pix R$ 1.500,00 — João Silva" },
  { id: "2", event: "payment.pending", status: "pending", timestamp: "2026-03-15 14:18:45", payload: "Cartão R$ 2.200,00 — Maria Santos" },
  { id: "3", event: "payment.confirmed", status: "success", timestamp: "2026-03-15 13:55:22", payload: "Pix R$ 890,00 — Carlos Lima" },
  { id: "4", event: "booking.created", status: "success", timestamp: "2026-03-15 13:40:05", payload: "Reserva #4521 — Caldas Novas" },
  { id: "5", event: "payment.failed", status: "error", timestamp: "2026-03-15 13:22:18", payload: "Cartão R$ 3.100,00 — Ana Oliveira (recusado)" },
  { id: "6", event: "booking.cancelled", status: "error", timestamp: "2026-03-15 12:50:33", payload: "Reserva #4518 — Pedro Costa" },
];

export default function Integracoes() {
  const [channelStates, setChannelStates] = useState<Record<string, boolean>>(
    Object.fromEntries(channels.map((c) => [c.id, c.status === "connected"]))
  );

  const handleConfigure = (channelId: string) => {
    setChannelStates((prev) => ({ ...prev, [channelId]: !prev[channelId] }));
  };

  const getWebhookStatusStyle = (status: string) => {
    switch (status) {
      case "success":
        return { bg: "#dcfce7", color: "#166534", label: "Sucesso" };
      case "error":
        return { bg: "#fee2e2", color: "#991b1b", label: "Erro" };
      case "pending":
        return { bg: "#fef9c3", color: "#854d0e", label: "Pendente" };
      default:
        return { bg: "#f3f4f6", color: "#374151", label: status };
    }
  };

  const getWebhookIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle style={{ width: 16, height: 16, color: "#16a34a" }} />;
      case "error":
        return <XCircle style={{ width: 16, height: 16, color: "#dc2626" }} />;
      case "pending":
        return <AlertCircle style={{ width: 16, height: 16, color: "#ca8a04" }} />;
      default:
        return null;
    }
  };

  return (
    <div data-testid="page-integracoes" style={{ minHeight: "100vh", background: "#F9FAFB" }}>
      <header
        data-testid="header-integracoes"
        style={{
          background: "linear-gradient(135deg, #1e3a5f, #2563EB)",
          padding: "24px 32px",
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <Link href="/admin/dashboard" data-testid="link-back-dashboard">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#fff",
                cursor: "pointer",
                opacity: 0.9,
              }}
            >
              <ArrowLeft style={{ width: 20, height: 20 }} />
              <span style={{ fontSize: 14 }}>Voltar ao Dashboard</span>
            </div>
          </Link>
        </div>
        <div style={{ marginTop: 16 }}>
          <h1 data-testid="text-title" style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>
            Integrações com Canais
          </h1>
          <p style={{ fontSize: 14, opacity: 0.85, marginTop: 4 }}>
            Gerencie suas conexões com plataformas de comunicação e marketing
          </p>
        </div>
      </header>

      <div style={{ padding: "32px 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
            marginBottom: 40,
          }}
        >
          {channels.map((channel) => {
            const isConnected = channelStates[channel.id];
            return (
              <div
                key={channel.id}
                data-testid={`card-channel-${channel.id}`}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: 24,
                  border: isConnected ? `2px solid ${channel.color}` : "2px solid #e5e7eb",
                  position: "relative",
                  transition: "box-shadow 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: channel.bgColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: channel.color,
                      }}
                    >
                      {channel.icon}
                    </div>
                    <div>
                      <h3 data-testid={`text-channel-name-${channel.id}`} style={{ fontSize: 16, fontWeight: 600, margin: 0, color: "#1f2937" }}>
                        {channel.name}
                      </h3>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                        <div
                          data-testid={`status-channel-${channel.id}`}
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: isConnected ? "#22C55E" : "#9ca3af",
                          }}
                        />
                        <span style={{ fontSize: 12, color: isConnected ? "#16a34a" : "#6b7280" }}>
                          {isConnected ? "Conectado" : "Não configurado"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                  {channel.metrics.map((metric, idx) => (
                    <div
                      key={idx}
                      data-testid={`text-metric-${channel.id}-${idx}`}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "6px 0",
                        borderBottom: idx < channel.metrics.length - 1 ? "1px solid #f3f4f6" : "none",
                      }}
                    >
                      <span style={{ fontSize: 13, color: "#6b7280" }}>{metric.label}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#1f2937" }}>{metric.value}</span>
                    </div>
                  ))}
                </div>

                <button
                  data-testid={`button-configure-${channel.id}`}
                  onClick={() => handleConfigure(channel.id)}
                  style={{
                    width: "100%",
                    padding: "10px 16px",
                    borderRadius: 8,
                    border: "none",
                    background: isConnected ? "#f3f4f6" : channel.color,
                    color: isConnected ? "#374151" : "#fff",
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    transition: "opacity 0.2s",
                  }}
                >
                  <Settings style={{ width: 16, height: 16 }} />
                  {isConnected ? "Configurar" : "Conectar"}
                </button>
              </div>
            );
          })}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: 24,
          }}
        >
          <div
            data-testid="section-interactions"
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              border: "1px solid #e5e7eb",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <MessageSquare style={{ width: 20, height: 20, color: "#2563EB" }} />
              <h2 data-testid="text-interactions-title" style={{ fontSize: 18, fontWeight: 600, margin: 0, color: "#1f2937" }}>
                Últimas Interações
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {mockInteractions.map((interaction, idx) => (
                <div
                  key={interaction.id}
                  data-testid={`row-interaction-${interaction.id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 0",
                    borderBottom: idx < mockInteractions.length - 1 ? "1px solid #f3f4f6" : "none",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: `${interaction.channelColor}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: interaction.channelColor,
                      flexShrink: 0,
                    }}
                  >
                    {interaction.channelIcon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#1f2937" }}>{interaction.user}</span>
                      <span style={{ fontSize: 12, color: "#9ca3af" }}>via {interaction.channel}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "#6b7280", margin: "2px 0 0 0" }}>{interaction.action}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                    <Clock style={{ width: 12, height: 12, color: "#9ca3af" }} />
                    <span data-testid={`text-interaction-time-${interaction.id}`} style={{ fontSize: 12, color: "#9ca3af" }}>
                      {interaction.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            data-testid="section-webhooks"
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              border: "1px solid #e5e7eb",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <Zap style={{ width: 20, height: 20, color: "#F57C00" }} />
              <h2 data-testid="text-webhooks-title" style={{ fontSize: 18, fontWeight: 600, margin: 0, color: "#1f2937" }}>
                Webhook de Pagamento
              </h2>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table data-testid="table-webhooks" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                    <th style={{ textAlign: "left", padding: "8px 12px", color: "#6b7280", fontWeight: 500, fontSize: 12, textTransform: "uppercase" }}>
                      Evento
                    </th>
                    <th style={{ textAlign: "left", padding: "8px 12px", color: "#6b7280", fontWeight: 500, fontSize: 12, textTransform: "uppercase" }}>
                      Status
                    </th>
                    <th style={{ textAlign: "left", padding: "8px 12px", color: "#6b7280", fontWeight: 500, fontSize: 12, textTransform: "uppercase" }}>
                      Timestamp
                    </th>
                    <th style={{ textAlign: "left", padding: "8px 12px", color: "#6b7280", fontWeight: 500, fontSize: 12, textTransform: "uppercase" }}>
                      Detalhes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockWebhooks.map((webhook, idx) => {
                    const statusStyle = getWebhookStatusStyle(webhook.status);
                    return (
                      <tr
                        key={webhook.id}
                        data-testid={`row-webhook-${webhook.id}`}
                        style={{ borderBottom: idx < mockWebhooks.length - 1 ? "1px solid #f3f4f6" : "none" }}
                      >
                        <td style={{ padding: "10px 12px" }}>
                          <code
                            style={{
                              background: "#f3f4f6",
                              padding: "2px 8px",
                              borderRadius: 4,
                              fontSize: 12,
                              color: "#374151",
                            }}
                          >
                            {webhook.event}
                          </code>
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <span
                            data-testid={`status-webhook-${webhook.id}`}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              padding: "2px 10px",
                              borderRadius: 9999,
                              background: statusStyle.bg,
                              color: statusStyle.color,
                              fontSize: 12,
                              fontWeight: 500,
                            }}
                          >
                            {getWebhookIcon(webhook.status)}
                            {statusStyle.label}
                          </span>
                        </td>
                        <td style={{ padding: "10px 12px", color: "#6b7280", fontSize: 12 }}>{webhook.timestamp}</td>
                        <td style={{ padding: "10px 12px", color: "#374151", fontSize: 12 }}>{webhook.payload}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
