import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  QrCode,
  AlertTriangle,
  Shield,
  Bell,
  Users,
  Baby,
  User,
  UserCheck,
  Smartphone,
  Volume2,
} from "lucide-react";

interface Passenger {
  id: number;
  name: string;
  age: number;
  type: "adult" | "child" | "elderly";
  seat: number;
  status: "boarded" | "pending" | "absent";
  responsibleName?: string;
  photoInitials: string;
}

interface SecurityAlert {
  id: number;
  message: string;
  type: "child" | "elderly" | "general";
  timestamp: string;
}

interface AlertHistoryItem {
  id: number;
  message: string;
  timestamp: string;
  sentBy: string;
}

const initialPassengers: Passenger[] = [
  { id: 1, name: "Carlos Mendes", age: 42, type: "adult", seat: 1, status: "boarded", photoInitials: "CM" },
  { id: 2, name: "Maria Silva", age: 35, type: "adult", seat: 2, status: "boarded", photoInitials: "MS" },
  { id: 3, name: "Ana Silva", age: 8, type: "child", seat: 3, status: "pending", responsibleName: "Maria Silva", photoInitials: "AS" },
  { id: 4, name: "José Ferreira", age: 72, type: "elderly", seat: 4, status: "boarded", photoInitials: "JF" },
  { id: 5, name: "Luísa Souza", age: 28, type: "adult", seat: 5, status: "pending", photoInitials: "LS" },
  { id: 6, name: "Pedro Santos", age: 11, type: "child", seat: 6, status: "absent", responsibleName: "Carlos Mendes", photoInitials: "PS" },
  { id: 7, name: "Dona Tereza", age: 68, type: "elderly", seat: 7, status: "pending", photoInitials: "DT" },
  { id: 8, name: "Rafael Costa", age: 33, type: "adult", seat: 8, status: "boarded", photoInitials: "RC" },
  { id: 9, name: "Bruna Lima", age: 25, type: "adult", seat: 9, status: "boarded", photoInitials: "BL" },
  { id: 10, name: "Lucas Oliveira", age: 6, type: "child", seat: 10, status: "pending", responsibleName: "Bruna Lima", photoInitials: "LO" },
  { id: 11, name: "Fernanda Alves", age: 45, type: "adult", seat: 11, status: "boarded", photoInitials: "FA" },
  { id: 12, name: "Antônio Rocha", age: 70, type: "elderly", seat: 12, status: "absent", photoInitials: "AR" },
  { id: 13, name: "Juliana Martins", age: 31, type: "adult", seat: 13, status: "pending", photoInitials: "JM" },
  { id: 14, name: "Gabriel Nunes", age: 9, type: "child", seat: 14, status: "boarded", responsibleName: "Fernanda Alves", photoInitials: "GN" },
  { id: 15, name: "Cláudia Reis", age: 50, type: "adult", seat: 15, status: "boarded", photoInitials: "CR" },
  { id: 16, name: "Roberto Dias", age: 38, type: "adult", seat: 16, status: "pending", photoInitials: "RD" },
];

const initialAlerts: SecurityAlert[] = [
  { id: 1, message: "ALERTA: Criança Ana Silva (8 anos) pendente — Responsável: Maria Silva", type: "child", timestamp: "14:32" },
  { id: 2, message: "ALERTA: Idoso Antônio Rocha (70 anos) ausente — Verificar última localização", type: "elderly", timestamp: "14:28" },
  { id: 3, message: "ALERTA: Criança Pedro Santos (11 anos) ausente — Responsável: Carlos Mendes", type: "child", timestamp: "14:25" },
  { id: 4, message: "AVISO: Dona Tereza (68 anos) pendente — Aguardando no ponto de encontro", type: "elderly", timestamp: "14:20" },
  { id: 5, message: "ALERTA: Criança Lucas Oliveira (6 anos) pendente — Responsável: Bruna Lima", type: "child", timestamp: "14:15" },
];

const initialAlertHistory: AlertHistoryItem[] = [
  { id: 1, message: "Alerta sonoro enviado: Retorno ao ônibus em 10 minutos", timestamp: "14:00", sentBy: "Sistema" },
  { id: 2, message: "Alerta enviado: Passageiro José Ferreira embarcou com sucesso", timestamp: "13:55", sentBy: "Motorista" },
  { id: 3, message: "Alerta sonoro enviado: Chamada geral para embarque", timestamp: "13:45", sentBy: "Guia" },
  { id: 4, message: "Vigilância comunitária ativada para parada Rio Quente", timestamp: "13:30", sentBy: "Sistema" },
];

export default function SegurancaEmbarque() {
  const { toast } = useToast();
  const [passengers, setPassengers] = useState<Passenger[]>(initialPassengers);
  const [vigilanciaAtiva, setVigilanciaAtiva] = useState(true);
  const [alertHistory, setAlertHistory] = useState<AlertHistoryItem[]>(initialAlertHistory);

  const boarded = passengers.filter((p) => p.status === "boarded").length;
  const total = passengers.length;
  const progressPercent = Math.round((boarded / total) * 100);

  const handleQrCheckin = (passengerId: number) => {
    setPassengers((prev) =>
      prev.map((p) =>
        p.id === passengerId ? { ...p, status: "boarded" as const } : p
      )
    );
    const passenger = passengers.find((p) => p.id === passengerId);
    if (passenger) {
      toast({
        title: "Check-in realizado!",
        description: `Passageiro ${passenger.name} embarcou! Assento ${passenger.seat}`,
      });
    }
  };

  const handleSendGroupAlert = () => {
    const newAlert: AlertHistoryItem = {
      id: alertHistory.length + 1,
      message: "Alerta sonoro enviado a todos os dispositivos do grupo",
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      sentBy: "Administrador",
    };
    setAlertHistory((prev) => [newAlert, ...prev]);
    toast({
      title: "Alerta enviado!",
      description: "Alerta enviado a todos os dispositivos do grupo",
    });
  };

  const handleToggleVigilancia = () => {
    setVigilanciaAtiva(!vigilanciaAtiva);
    toast({
      title: vigilanciaAtiva ? "Vigilância desativada" : "Vigilância ativada",
      description: vigilanciaAtiva
        ? "A vigilância comunitária foi desativada"
        : "Todos os celulares receberão alertas sonoros se alguém faltar",
    });
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "boarded": return "#dcfce7";
      case "pending": return "#fef9c3";
      case "absent": return "#fee2e2";
      default: return "#f3f4f6";
    }
  };

  const getStatusBorder = (status: string) => {
    switch (status) {
      case "boarded": return "#22c55e";
      case "pending": return "#eab308";
      case "absent": return "#ef4444";
      default: return "#d1d5db";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "boarded": return "Embarcado";
      case "pending": return "Pendente";
      case "absent": return "Ausente";
      default: return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "adult": return "Adulto";
      case "child": return "Criança";
      case "elderly": return "Idoso";
      default: return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "child": return <Baby style={{ width: 14, height: 14 }} />;
      case "elderly": return <User style={{ width: 14, height: 14 }} />;
      default: return <UserCheck style={{ width: 14, height: 14 }} />;
    }
  };

  const getSeatColor = (status: string) => {
    switch (status) {
      case "boarded": return "#22c55e";
      case "pending": return "#eab308";
      case "absent": return "#ef4444";
      default: return "#d1d5db";
    }
  };

  const alerts = initialAlerts.filter((a) => {
    const passenger = passengers.find((p) => p.name.includes(a.message.split(" ")[2]));
    return true;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB" }} data-testid="page-seguranca-embarque">
      <header
        style={{
          background: "linear-gradient(135deg, #1e3a5f, #2563EB)",
          color: "white",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
        data-testid="header-seguranca-embarque"
      >
        <Link href="/admin/dashboard" data-testid="link-voltar-dashboard">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "white",
              cursor: "pointer",
              background: "rgba(255,255,255,0.15)",
              borderRadius: 8,
              padding: "8px 16px",
            }}
          >
            <ArrowLeft style={{ width: 20, height: 20 }} />
            <span style={{ fontSize: 14 }}>Voltar</span>
          </div>
        </Link>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }} data-testid="text-titulo">
            Segurança de Embarque
          </h1>
          <p style={{ fontSize: 14, opacity: 0.85, margin: 0 }}>
            Módulo 9 — Controle avançado de embarque e vigilância comunitária
          </p>
        </div>
        <Shield style={{ width: 32, height: 32, opacity: 0.7 }} />
      </header>

      <div style={{ padding: "24px", maxWidth: 1400, margin: "0 auto" }}>
        <div
          style={{
            background: "white",
            borderRadius: 12,
            padding: 24,
            marginBottom: 24,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
          data-testid="section-contador-embarque"
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1e3a5f", margin: 0 }}>
                Passageiros Embarcados
              </h2>
              <p style={{ fontSize: 14, color: "#6b7280", margin: "4px 0 0 0" }}>
                Excursão Caldas Novas — Saída 15/08/2025
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{ fontSize: 48, fontWeight: 800, color: "#2563EB" }}
                data-testid="text-contador-embarcados"
              >
                {boarded}/{total}
              </div>
              <div style={{ fontSize: 14, color: "#6b7280" }}>embarcados</div>
            </div>
          </div>
          <div
            style={{
              background: "#e5e7eb",
              borderRadius: 999,
              height: 24,
              overflow: "hidden",
              position: "relative",
            }}
            data-testid="progress-bar-embarque"
          >
            <div
              style={{
                background: progressPercent >= 80 ? "linear-gradient(90deg, #22c55e, #16a34a)" : progressPercent >= 50 ? "linear-gradient(90deg, #eab308, #f59e0b)" : "linear-gradient(90deg, #ef4444, #dc2626)",
                height: "100%",
                width: `${progressPercent}%`,
                borderRadius: 999,
                transition: "width 0.5s ease-in-out",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>{progressPercent}%</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 24, marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#22c55e" }} />
              <span style={{ fontSize: 13, color: "#374151" }}>Embarcados: {passengers.filter(p => p.status === "boarded").length}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#eab308" }} />
              <span style={{ fontSize: 13, color: "#374151" }}>Pendentes: {passengers.filter(p => p.status === "pending").length}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444" }} />
              <span style={{ fontSize: 13, color: "#374151" }}>Ausentes: {passengers.filter(p => p.status === "absent").length}</span>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1e3a5f", marginBottom: 16 }}>
            Passageiros
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 16,
            }}
            data-testid="grid-passageiros"
          >
            {passengers.map((p) => (
              <div
                key={p.id}
                style={{
                  background: getStatusBg(p.status),
                  border: `2px solid ${getStatusBorder(p.status)}`,
                  borderRadius: 12,
                  padding: 16,
                  transition: "all 0.3s",
                }}
                data-testid={`card-passageiro-${p.id}`}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: p.status === "boarded" ? "#16a34a" : p.status === "pending" ? "#ca8a04" : "#dc2626",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: 700,
                      fontSize: 16,
                    }}
                    data-testid={`avatar-passageiro-${p.id}`}
                  >
                    {p.photoInitials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: "#111827" }} data-testid={`text-nome-${p.id}`}>
                        {p.name}
                      </span>
                      {(p.type === "child" || p.type === "elderly") && (
                        <span
                          style={{
                            background: p.type === "child" ? "#fbbf24" : "#fb923c",
                            color: "#1e3a5f",
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 999,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                          data-testid={`badge-atencao-${p.id}`}
                        >
                          <AlertTriangle style={{ width: 12, height: 12 }} />
                          Atenção Especial
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 12,
                          color: "#6b7280",
                        }}
                      >
                        {getTypeIcon(p.type)}
                        {getTypeLabel(p.type)} — {p.age} anos
                      </span>
                      <span style={{ fontSize: 12, color: "#6b7280" }}>
                        Assento {p.seat}
                      </span>
                    </div>
                    {p.responsibleName && (
                      <div style={{ fontSize: 12, color: "#9333ea", marginTop: 2 }} data-testid={`text-responsavel-${p.id}`}>
                        Responsável: {p.responsibleName}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: p.status === "boarded" ? "#16a34a" : p.status === "pending" ? "#ca8a04" : "#dc2626",
                      textTransform: "uppercase",
                    }}
                    data-testid={`text-status-${p.id}`}
                  >
                    {getStatusLabel(p.status)}
                  </span>
                  {p.status !== "boarded" && (
                    <button
                      onClick={() => handleQrCheckin(p.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        background: "#2563EB",
                        color: "white",
                        border: "none",
                        borderRadius: 8,
                        padding: "8px 16px",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                      data-testid={`button-qr-checkin-${p.id}`}
                    >
                      <QrCode style={{ width: 16, height: 16 }} />
                      Bipar QR
                    </button>
                  )}
                  {p.status === "boarded" && (
                    <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#16a34a", fontSize: 13 }}>
                      <UserCheck style={{ width: 16, height: 16 }} />
                      Confirmado
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: 12,
            padding: 24,
            marginBottom: 24,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
          data-testid="section-alertas-seguranca"
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1e3a5f", margin: 0 }}>
              Alertas de Segurança
            </h2>
            <button
              onClick={handleSendGroupAlert}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "10px 20px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
              data-testid="button-enviar-alerta-grupo"
            >
              <Bell style={{ width: 18, height: 18 }} />
              Enviar Alerta ao Grupo
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {initialAlerts.map((alert) => (
              <div
                key={alert.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: 14,
                  borderRadius: 10,
                  background: alert.type === "child" ? "#fef2f2" : alert.type === "elderly" ? "#fff7ed" : "#f0f9ff",
                  border: `1px solid ${alert.type === "child" ? "#fecaca" : alert.type === "elderly" ? "#fed7aa" : "#bae6fd"}`,
                }}
                data-testid={`alert-item-${alert.id}`}
              >
                <div
                  style={{
                    minWidth: 32,
                    height: 32,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: alert.type === "child" ? "#ef4444" : alert.type === "elderly" ? "#F57C00" : "#2563EB",
                  }}
                >
                  <AlertTriangle style={{ width: 16, height: 16, color: "white" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, color: "#1f2937", margin: 0 }} data-testid={`text-alert-${alert.id}`}>
                    {alert.message}
                  </p>
                  <span style={{ fontSize: 12, color: "#9ca3af" }}>{alert.timestamp}</span>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "2px 10px",
                    borderRadius: 999,
                    background: alert.type === "child" ? "#ef4444" : alert.type === "elderly" ? "#F57C00" : "#2563EB",
                    color: "white",
                  }}
                  data-testid={`badge-tipo-alerta-${alert.id}`}
                >
                  {alert.type === "child" ? "Criança" : alert.type === "elderly" ? "Idoso" : "Geral"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: 12,
            padding: 24,
            marginBottom: 24,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
          data-testid="section-vigilancia-comunitaria"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <Smartphone style={{ width: 24, height: 24, color: "#2563EB" }} />
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1e3a5f", margin: 0 }}>
              Vigilância Comunitária
            </h2>
          </div>
          <div
            style={{
              background: "#eff6ff",
              borderRadius: 10,
              padding: 16,
              marginBottom: 16,
              border: "1px solid #bfdbfe",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Volume2 style={{ width: 18, height: 18, color: "#2563EB" }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: "#1e3a5f" }}>
                Como funciona
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.6 }}>
              Todos os celulares do grupo recebem alerta sonoro se alguém faltar no retorno.
              O sistema monitora automaticamente o embarque e notifica todos os passageiros
              quando detecta ausências no horário previsto de partida.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <div>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#374151" }}>
                Ativar vigilância comunitária
              </span>
              <p style={{ fontSize: 13, color: "#6b7280", margin: "2px 0 0 0" }}>
                {vigilanciaAtiva ? "Monitoramento ativo — alertas habilitados" : "Monitoramento desativado"}
              </p>
            </div>
            <button
              onClick={handleToggleVigilancia}
              style={{
                width: 56,
                height: 28,
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                background: vigilanciaAtiva ? "#22c55e" : "#d1d5db",
                position: "relative",
                transition: "background 0.3s",
              }}
              data-testid="toggle-vigilancia-comunitaria"
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "white",
                  position: "absolute",
                  top: 3,
                  left: vigilanciaAtiva ? 31 : 3,
                  transition: "left 0.3s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }}
              />
            </button>
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#374151", marginBottom: 12 }}>
            Histórico de Alertas
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {alertHistory.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                }}
                data-testid={`alert-history-${item.id}`}
              >
                <Bell style={{ width: 14, height: 14, color: "#9ca3af" }} />
                <span style={{ fontSize: 13, color: "#374151", flex: 1 }} data-testid={`text-alert-history-${item.id}`}>
                  {item.message}
                </span>
                <span style={{ fontSize: 12, color: "#9ca3af", whiteSpace: "nowrap" }}>
                  {item.timestamp} — {item.sentBy}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: 12,
            padding: 24,
            marginBottom: 24,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
          data-testid="section-mapa-assentos"
        >
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1e3a5f", marginBottom: 16 }}>
            Mapa de Assentos
          </h2>
          <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, background: "#22c55e" }} />
              <span style={{ fontSize: 13, color: "#374151" }}>Embarcado</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, background: "#eab308" }} />
              <span style={{ fontSize: 13, color: "#374151" }}>Pendente</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, background: "#ef4444" }} />
              <span style={{ fontSize: 13, color: "#374151" }}>Ausente</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, background: "#d1d5db" }} />
              <span style={{ fontSize: 13, color: "#374151" }}>Vazio</span>
            </div>
          </div>

          <div
            style={{
              background: "#f3f4f6",
              borderRadius: 12,
              padding: 24,
              maxWidth: 500,
              margin: "0 auto",
            }}
          >
            <div
              style={{
                background: "#1e3a5f",
                color: "white",
                textAlign: "center",
                padding: "8px",
                borderRadius: "8px 8px 0 0",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              FRENTE DO VEÍCULO
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 40px 1fr 1fr",
                gap: 8,
                padding: "16px 8px",
              }}
            >
              {Array.from({ length: 20 }, (_, i) => {
                const seatNum = i + 1;
                const passenger = passengers.find((p) => p.seat === seatNum);
                const colIndex = i % 4;
                const rowIndex = Math.floor(i / 4);

                const gridCol = colIndex < 2 ? colIndex + 1 : colIndex + 2;
                const gridRow = rowIndex + 1;

                if (colIndex === 2) {
                  return [
                    <div
                      key={`aisle-${i}`}
                      style={{ gridColumn: 3, gridRow: gridRow }}
                    />,
                    <div
                      key={`seat-${seatNum}`}
                      style={{
                        gridColumn: gridCol,
                        gridRow: gridRow,
                        width: "100%",
                        aspectRatio: "1",
                        borderRadius: 8,
                        background: passenger ? getSeatColor(passenger.status) : "#d1d5db",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        position: "relative",
                        minHeight: 50,
                      }}
                      title={passenger ? `${passenger.name} — ${getStatusLabel(passenger.status)}` : `Assento ${seatNum} — Vazio`}
                      data-testid={`seat-${seatNum}`}
                    >
                      <span style={{ color: "white", fontWeight: 700, fontSize: 14 }}>{seatNum}</span>
                      {passenger && (
                        <span style={{ color: "white", fontSize: 9, fontWeight: 600 }}>
                          {passenger.photoInitials}
                        </span>
                      )}
                    </div>,
                  ];
                }

                return (
                  <div
                    key={`seat-${seatNum}`}
                    style={{
                      gridColumn: gridCol,
                      gridRow: gridRow,
                      width: "100%",
                      aspectRatio: "1",
                      borderRadius: 8,
                      background: passenger ? getSeatColor(passenger.status) : "#d1d5db",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      position: "relative",
                      minHeight: 50,
                    }}
                    title={passenger ? `${passenger.name} — ${getStatusLabel(passenger.status)}` : `Assento ${seatNum} — Vazio`}
                    data-testid={`seat-${seatNum}`}
                  >
                    <span style={{ color: "white", fontWeight: 700, fontSize: 14 }}>{seatNum}</span>
                    {passenger && (
                      <span style={{ color: "white", fontSize: 9, fontWeight: 600 }}>
                        {passenger.photoInitials}
                      </span>
                    )}
                  </div>
                );
              }).flat()}
            </div>
            <div
              style={{
                background: "#374151",
                color: "white",
                textAlign: "center",
                padding: "8px",
                borderRadius: "0 0 8px 8px",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              TRASEIRA DO VEÍCULO
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
