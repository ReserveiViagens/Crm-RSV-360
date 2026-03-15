import { useState } from "react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Settings,
  Building2,
  CreditCard,
  Bell,
  Save,
  CheckCircle,
  Loader2,
} from "lucide-react";

type TabId = "empresa" | "pagamento" | "notificacoes";

export default function ConfiguracoesSistemaPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabId>("empresa");
  const [saving, setSaving] = useState(false);

  const [empresa, setEmpresa] = useState({
    razaoSocial: "Reservei Viagens Ltda",
    cnpj: "12.345.678/0001-90",
    telefone: "(62) 3333-4444",
    emailSuporte: "suporte@reserveiviagens.com.br",
    logoUrl: "",
    endereco: "Av. Principal, 1000 — Caldas Novas, GO",
  });

  const [pagamento, setPagamento] = useState({
    chavePix: "12345678000190",
    tipoChavePix: "cnpj",
    taxaMDR: "2.5",
    taxaISS: "5.0",
    bancoSplit: "Banco Inter",
    contaSplit: "12345-6",
    agenciaSplit: "0001",
  });

  const [notificacoes, setNotificacoes] = useState({
    emailAlertas: "alertas@reserveiviagens.com.br",
    webhookUrl: "",
    canalEmail: true,
    canalWhatsApp: true,
    canalSMS: false,
    canalPush: true,
    alertaNovaReserva: true,
    alertaCancelamento: true,
    alertaPagamento: true,
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSaving(false);
    const tabNames: Record<TabId, string> = { empresa: "Empresa", pagamento: "Pagamento", notificacoes: "Notificações" };
    toast({ title: "Configurações salvas!", description: `Aba "${tabNames[activeTab]}" atualizada com sucesso.` });
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4, display: "block",
  };

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "empresa", label: "Empresa", icon: <Building2 style={{ width: 16, height: 16 }} /> },
    { id: "pagamento", label: "Pagamento", icon: <CreditCard style={{ width: 16, height: 16 }} /> },
    { id: "notificacoes", label: "Notificações", icon: <Bell style={{ width: 16, height: 16 }} /> },
  ];

  return (
    <div data-testid="page-configuracoes-sistema" style={{ minHeight: "100vh", background: "#F9FAFB" }}>
      <header style={{ background: "linear-gradient(135deg, #1e3a5f, #2563EB)", padding: "20px 24px", color: "#fff", display: "flex", alignItems: "center", gap: 16 }}>
        <Link href="/admin/dashboard">
          <button data-testid="button-voltar" style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: "8px 14px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 500 }}>
            <ArrowLeft style={{ width: 18, height: 18 }} /> Voltar
          </button>
        </Link>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}>
            <Settings style={{ width: 28, height: 28 }} /> Configurações do Sistema
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, opacity: 0.85 }}>Gerencie as configurações da plataforma</p>
        </div>
      </header>

      <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              data-testid={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "10px 20px", borderRadius: 8, border: "1px solid",
                borderColor: activeTab === tab.id ? "#2563EB" : "#d1d5db",
                background: activeTab === tab.id ? "#2563EB" : "#fff",
                color: activeTab === tab.id ? "#fff" : "#374151",
                fontSize: 14, fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: 12, padding: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          {activeTab === "empresa" && (
            <div data-testid="tab-content-empresa">
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e3a5f", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <Building2 style={{ width: 20, height: 20 }} /> Dados da Empresa
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
                <div>
                  <label style={labelStyle}>Razão Social</label>
                  <input data-testid="input-razao-social" value={empresa.razaoSocial} onChange={(e) => setEmpresa({ ...empresa, razaoSocial: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>CNPJ</label>
                  <input data-testid="input-cnpj" value={empresa.cnpj} onChange={(e) => setEmpresa({ ...empresa, cnpj: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Telefone</label>
                  <input data-testid="input-telefone-empresa" value={empresa.telefone} onChange={(e) => setEmpresa({ ...empresa, telefone: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>E-mail de Suporte</label>
                  <input data-testid="input-email-suporte" type="email" value={empresa.emailSuporte} onChange={(e) => setEmpresa({ ...empresa, emailSuporte: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Endereço</label>
                  <input data-testid="input-endereco-empresa" value={empresa.endereco} onChange={(e) => setEmpresa({ ...empresa, endereco: e.target.value })} style={inputStyle} />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>URL do Logo</label>
                  <input data-testid="input-logo-url" value={empresa.logoUrl} onChange={(e) => setEmpresa({ ...empresa, logoUrl: e.target.value })} placeholder="https://..." style={inputStyle} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "pagamento" && (
            <div data-testid="tab-content-pagamento">
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e3a5f", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <CreditCard style={{ width: 20, height: 20 }} /> Configurações de Pagamento
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
                <div>
                  <label style={labelStyle}>Chave PIX</label>
                  <input data-testid="input-chave-pix" value={pagamento.chavePix} onChange={(e) => setPagamento({ ...pagamento, chavePix: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Tipo da Chave</label>
                  <select data-testid="select-tipo-chave-pix" value={pagamento.tipoChavePix} onChange={(e) => setPagamento({ ...pagamento, tipoChavePix: e.target.value })} style={inputStyle}>
                    <option value="cnpj">CNPJ</option>
                    <option value="cpf">CPF</option>
                    <option value="email">E-mail</option>
                    <option value="telefone">Telefone</option>
                    <option value="aleatoria">Chave Aleatória</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Taxa MDR (%)</label>
                  <input data-testid="input-taxa-mdr" type="number" step="0.1" value={pagamento.taxaMDR} onChange={(e) => setPagamento({ ...pagamento, taxaMDR: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Taxa ISS (%)</label>
                  <input data-testid="input-taxa-iss" type="number" step="0.1" value={pagamento.taxaISS} onChange={(e) => setPagamento({ ...pagamento, taxaISS: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Banco (Split)</label>
                  <input data-testid="input-banco-split" value={pagamento.bancoSplit} onChange={(e) => setPagamento({ ...pagamento, bancoSplit: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Agência</label>
                  <input data-testid="input-agencia-split" value={pagamento.agenciaSplit} onChange={(e) => setPagamento({ ...pagamento, agenciaSplit: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Conta</label>
                  <input data-testid="input-conta-split" value={pagamento.contaSplit} onChange={(e) => setPagamento({ ...pagamento, contaSplit: e.target.value })} style={inputStyle} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "notificacoes" && (
            <div data-testid="tab-content-notificacoes">
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e3a5f", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <Bell style={{ width: 20, height: 20 }} /> Configurações de Notificações
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 24 }}>
                <div>
                  <label style={labelStyle}>E-mail de Alertas</label>
                  <input data-testid="input-email-alertas" type="email" value={notificacoes.emailAlertas} onChange={(e) => setNotificacoes({ ...notificacoes, emailAlertas: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Webhook URL</label>
                  <input data-testid="input-webhook-url" value={notificacoes.webhookUrl} onChange={(e) => setNotificacoes({ ...notificacoes, webhookUrl: e.target.value })} placeholder="https://..." style={inputStyle} />
                </div>
              </div>

              <h4 style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 12 }}>Canais de Envio</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 24 }}>
                {[
                  { key: "canalEmail" as const, label: "E-mail" },
                  { key: "canalWhatsApp" as const, label: "WhatsApp" },
                  { key: "canalSMS" as const, label: "SMS" },
                  { key: "canalPush" as const, label: "Push" },
                ].map((ch) => (
                  <label key={ch.key} data-testid={`toggle-${ch.key}`} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 10, border: "1px solid #e5e7eb", background: notificacoes[ch.key] ? "#EFF6FF" : "#fff", cursor: "pointer" }}>
                    <input type="checkbox" checked={notificacoes[ch.key]} onChange={(e) => setNotificacoes({ ...notificacoes, [ch.key]: e.target.checked })} style={{ width: 18, height: 18, accentColor: "#2563EB" }} />
                    <span style={{ fontSize: 14, fontWeight: 500, color: "#1f2937" }}>{ch.label}</span>
                  </label>
                ))}
              </div>

              <h4 style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 12 }}>Tipos de Alerta</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                {[
                  { key: "alertaNovaReserva" as const, label: "Nova Reserva" },
                  { key: "alertaCancelamento" as const, label: "Cancelamento" },
                  { key: "alertaPagamento" as const, label: "Pagamento Recebido" },
                ].map((al) => (
                  <label key={al.key} data-testid={`toggle-${al.key}`} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 10, border: "1px solid #e5e7eb", background: notificacoes[al.key] ? "#F0FDF4" : "#fff", cursor: "pointer" }}>
                    <input type="checkbox" checked={notificacoes[al.key]} onChange={(e) => setNotificacoes({ ...notificacoes, [al.key]: e.target.checked })} style={{ width: 18, height: 18, accentColor: "#22C55E" }} />
                    <span style={{ fontSize: 14, fontWeight: 500, color: "#1f2937" }}>{al.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 28 }}>
            <button
              data-testid="button-salvar-config"
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: "12px 28px", borderRadius: 8, border: "none",
                background: saving ? "#93c5fd" : "linear-gradient(135deg, #1e3a5f, #2563EB)",
                color: "#fff", fontSize: 15, fontWeight: 600,
                cursor: saving ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              {saving ? (
                <><Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} /> Salvando...</>
              ) : (
                <><Save style={{ width: 18, height: 18 }} /> Salvar Configurações</>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
