import { useState } from "react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Palette,
  Upload,
  Save,
  Loader2,
  Eye,
  MessageSquare,
  Mail,
  Image,
  RefreshCw,
  CheckCircle,
} from "lucide-react";

type TabId = "identidade" | "templates" | "preview";

const CORES_PRESET = [
  { nome: "Azul RSV", primaria: "#1e3a5f", secundaria: "#2563EB", acento: "#F57C00" },
  { nome: "Verde Natureza", primaria: "#14532d", secundaria: "#16a34a", acento: "#fbbf24" },
  { nome: "Roxo Premium", primaria: "#3b0764", secundaria: "#7c3aed", acento: "#f97316" },
  { nome: "Vermelho Energia", primaria: "#7f1d1d", secundaria: "#dc2626", acento: "#facc15" },
];

const templateWhatsApp = `Olá {NOME}! 👋

Sua reserva na *Reservei Viagens* foi confirmada com sucesso!

📋 *Detalhes:*
• Destino: {DESTINO}
• Data: {DATA}
• Valor: {VALOR}

Em caso de dúvidas, responda essa mensagem.

Bom viagem! 🌴`;

const templateEmail = `Olá {NOME},

Obrigado por escolher a Reservei Viagens!

Sua reserva foi confirmada. Aqui estão os detalhes:

- Destino: {DESTINO}
- Data de embarque: {DATA}
- Valor total: {VALOR}

Para mais informações, acesse seu painel ou entre em contato pelo WhatsApp.

Atenciosamente,
Equipe Reservei Viagens`;

export default function BrandingPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabId>("identidade");
  const [saving, setSaving] = useState(false);

  const [identidade, setIdentidade] = useState({
    nomeEmpresa: "Reservei Viagens",
    slogan: "Sua viagem, do jeito certo",
    logoUrl: "",
    corPrimaria: "#1e3a5f",
    corSecundaria: "#2563EB",
    corAcento: "#F57C00",
    corTexto: "#111827",
    corFundo: "#F9FAFB",
    fontePrincipal: "Inter",
  });

  const [templates, setTemplates] = useState({
    whatsapp: templateWhatsApp,
    email: templateEmail,
    assinaturaEmail: "Equipe Reservei Viagens\nsuporte@reserveiviagens.com.br\n(62) 3333-4444",
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSaving(false);
    toast({ title: "Branding salvo!", description: "Identidade visual atualizada com sucesso." });
  };

  const aplicarPreset = (preset: typeof CORES_PRESET[0]) => {
    setIdentidade((prev) => ({
      ...prev,
      corPrimaria: preset.primaria,
      corSecundaria: preset.secundaria,
      corAcento: preset.acento,
    }));
    toast({ title: "Preset aplicado", description: `Paleta "${preset.nome}" carregada. Salve para confirmar.` });
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    marginBottom: 4,
    display: "block",
  };

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "identidade", label: "Identidade Visual", icon: <Palette style={{ width: 16, height: 16 }} /> },
    { id: "templates", label: "Templates de Comunicação", icon: <MessageSquare style={{ width: 16, height: 16 }} /> },
    { id: "preview", label: "Preview", icon: <Eye style={{ width: 16, height: 16 }} /> },
  ];

  return (
    <div data-testid="page-branding" style={{ minHeight: "100vh", background: "#F9FAFB" }}>
      <header style={{ background: "linear-gradient(135deg, #1e3a5f, #2563EB)", padding: "20px 24px", color: "#fff", display: "flex", alignItems: "center", gap: 16 }}>
        <Link href="/admin/dashboard">
          <button data-testid="button-voltar" style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: "8px 14px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 500 }}>
            <ArrowLeft style={{ width: 18, height: 18 }} /> Voltar
          </button>
        </Link>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}>
            <Palette style={{ width: 28, height: 28 }} /> Branding & Identidade Visual
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, opacity: 0.85 }}>Gerencie a identidade visual e templates de comunicação</p>
        </div>
        <button
          data-testid="button-salvar-branding"
          onClick={handleSave}
          disabled={saving}
          style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, padding: "8px 16px", color: "#fff", cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600 }}
        >
          {saving ? <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> : <Save style={{ width: 16, height: 16 }} />}
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </header>

      <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              data-testid={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "10px 20px",
                borderRadius: 8,
                border: "1px solid",
                borderColor: activeTab === tab.id ? "#2563EB" : "#d1d5db",
                background: activeTab === tab.id ? "#2563EB" : "#fff",
                color: activeTab === tab.id ? "#fff" : "#374151",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "identidade" && (
          <div data-testid="tab-content-identidade" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ background: "#fff", borderRadius: 12, padding: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e3a5f", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <Image style={{ width: 20, height: 20 }} /> Logo e Nome
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                <div>
                  <label style={labelStyle}>Nome da Empresa</label>
                  <input
                    data-testid="input-nome-empresa"
                    value={identidade.nomeEmpresa}
                    onChange={(e) => setIdentidade({ ...identidade, nomeEmpresa: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Slogan</label>
                  <input
                    data-testid="input-slogan"
                    value={identidade.slogan}
                    onChange={(e) => setIdentidade({ ...identidade, slogan: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>URL do Logotipo</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      data-testid="input-logo-url"
                      value={identidade.logoUrl}
                      onChange={(e) => setIdentidade({ ...identidade, logoUrl: e.target.value })}
                      placeholder="https://... ou deixe vazio para usar o padrão"
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <button
                      data-testid="button-upload-logo"
                      style={{ background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: 8, padding: "0 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#374151", whiteSpace: "nowrap" }}
                    >
                      <Upload style={{ width: 14, height: 14 }} /> Upload
                    </button>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Fonte Principal</label>
                  <select
                    data-testid="select-fonte"
                    value={identidade.fontePrincipal}
                    onChange={(e) => setIdentidade({ ...identidade, fontePrincipal: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Nunito">Nunito</option>
                    <option value="Montserrat">Montserrat</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 12, padding: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e3a5f", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                  <Palette style={{ width: 20, height: 20 }} /> Paleta de Cores
                </h3>
                <div style={{ display: "flex", gap: 8 }}>
                  {CORES_PRESET.map((p) => (
                    <button
                      key={p.nome}
                      data-testid={`button-preset-${p.nome.toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={() => aplicarPreset(p)}
                      title={p.nome}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        border: "2px solid #fff",
                        outline: "2px solid #d1d5db",
                        background: p.primaria,
                        cursor: "pointer",
                      }}
                    />
                  ))}
                  <button
                    data-testid="button-resetar-cores"
                    onClick={() => aplicarPreset(CORES_PRESET[0])}
                    style={{ background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: 6, padding: "0 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6b7280" }}
                  >
                    <RefreshCw style={{ width: 12, height: 12 }} /> Reset
                  </button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
                {[
                  { key: "corPrimaria" as const, label: "Cor Primária", hint: "Cabeçalho, sidebar" },
                  { key: "corSecundaria" as const, label: "Cor Secundária", hint: "Botões, links" },
                  { key: "corAcento" as const, label: "Cor de Acento", hint: "CTAs, destaques" },
                  { key: "corTexto" as const, label: "Cor do Texto", hint: "Corpo do texto" },
                  { key: "corFundo" as const, label: "Cor de Fundo", hint: "Background geral" },
                ].map(({ key, label, hint }) => (
                  <div key={key}>
                    <label style={labelStyle}>
                      {label}
                      <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 400, marginLeft: 4 }}>({hint})</span>
                    </label>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <input
                        data-testid={`color-${key}`}
                        type="color"
                        value={identidade[key]}
                        onChange={(e) => setIdentidade({ ...identidade, [key]: e.target.value })}
                        style={{ width: 44, height: 44, border: "1px solid #d1d5db", borderRadius: 8, cursor: "pointer", padding: 2 }}
                      />
                      <input
                        data-testid={`input-hex-${key}`}
                        value={identidade[key]}
                        onChange={(e) => setIdentidade({ ...identidade, [key]: e.target.value })}
                        style={{ ...inputStyle, flex: 1, fontFamily: "monospace", fontSize: 13 }}
                        maxLength={7}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "templates" && (
          <div data-testid="tab-content-templates" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ background: "#fff", borderRadius: 12, padding: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e3a5f", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                <MessageSquare style={{ width: 20, height: 20 }} /> Template WhatsApp
              </h3>
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
                Variáveis disponíveis: <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 }}>{"{NOME}"}</code>{" "}
                <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 }}>{"{DESTINO}"}</code>{" "}
                <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 }}>{"{DATA}"}</code>{" "}
                <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 }}>{"{VALOR}"}</code>
              </p>
              <textarea
                data-testid="textarea-template-whatsapp"
                value={templates.whatsapp}
                onChange={(e) => setTemplates({ ...templates, whatsapp: e.target.value })}
                rows={12}
                style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace", fontSize: 13, lineHeight: 1.6 }}
              />
            </div>

            <div style={{ background: "#fff", borderRadius: 12, padding: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e3a5f", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                <Mail style={{ width: 20, height: 20 }} /> Template E-mail de Confirmação
              </h3>
              <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
                Variáveis disponíveis: <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 }}>{"{NOME}"}</code>{" "}
                <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 }}>{"{DESTINO}"}</code>{" "}
                <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 }}>{"{DATA}"}</code>{" "}
                <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 }}>{"{VALOR}"}</code>
              </p>
              <textarea
                data-testid="textarea-template-email"
                value={templates.email}
                onChange={(e) => setTemplates({ ...templates, email: e.target.value })}
                rows={14}
                style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace", fontSize: 13, lineHeight: 1.6 }}
              />
            </div>

            <div style={{ background: "#fff", borderRadius: 12, padding: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e3a5f", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <Mail style={{ width: 20, height: 20 }} /> Assinatura de E-mail
              </h3>
              <textarea
                data-testid="textarea-assinatura-email"
                value={templates.assinaturaEmail}
                onChange={(e) => setTemplates({ ...templates, assinaturaEmail: e.target.value })}
                rows={5}
                style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace", fontSize: 13 }}
              />
            </div>
          </div>
        )}

        {activeTab === "preview" && (
          <div data-testid="tab-content-preview" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ background: "#fff", borderRadius: 12, padding: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e3a5f", marginBottom: 20 }}>Preview da Identidade Visual</h3>

              <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #e5e7eb" }}>
                <div style={{ background: `linear-gradient(135deg, ${identidade.corPrimaria}, ${identidade.corSecundaria})`, padding: "16px 24px", display: "flex", alignItems: "center", gap: 12 }}>
                  {identidade.logoUrl ? (
                    <img src={identidade.logoUrl} alt="Logo" style={{ height: 40, objectFit: "contain" }} />
                  ) : (
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16 }}>
                      {identidade.nomeEmpresa[0]}
                    </div>
                  )}
                  <div>
                    <p style={{ color: "#fff", fontWeight: 700, fontSize: 18, margin: 0, fontFamily: identidade.fontePrincipal }}>{identidade.nomeEmpresa}</p>
                    <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, margin: 0 }}>{identidade.slogan}</p>
                  </div>
                </div>
                <div style={{ background: identidade.corFundo, padding: 24 }}>
                  <h2 style={{ color: identidade.corTexto, fontFamily: identidade.fontePrincipal, fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Bem-vindo à {identidade.nomeEmpresa}</h2>
                  <p style={{ color: identidade.corTexto, fontSize: 15, lineHeight: 1.6, marginBottom: 20, opacity: 0.7 }}>
                    Sua plataforma de turismo para Caldas Novas e Rio Quente. Encontre as melhores excursões, hotéis e atrações.
                  </p>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      data-testid="button-preview-cta-primary"
                      style={{ padding: "12px 24px", borderRadius: 8, border: "none", background: identidade.corSecundaria, color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: identidade.fontePrincipal }}
                    >
                      Ver Ingressos
                    </button>
                    <button
                      data-testid="button-preview-cta-acento"
                      style={{ padding: "12px 24px", borderRadius: 8, border: "none", background: identidade.corAcento, color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: identidade.fontePrincipal }}
                    >
                      WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 12, padding: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e3a5f", marginBottom: 20 }}>Preview WhatsApp</h3>
              <div style={{ maxWidth: 360, background: "#e5ddd5", borderRadius: 12, padding: 16 }}>
                <div style={{ background: "#d1fae5", borderRadius: "12px 12px 12px 0", padding: "12px 16px", maxWidth: "80%", marginLeft: "auto", whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.6, color: "#1f2937" }}>
                  {templates.whatsapp
                    .replace("{NOME}", "João Silva")
                    .replace("{DESTINO}", "Caldas Novas")
                    .replace("{DATA}", "15/08/2026")
                    .replace("{VALOR}", "R$ 1.500,00")}
                </div>
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 12, padding: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  data-testid="button-salvar-preview"
                  onClick={handleSave}
                  disabled={saving}
                  style={{ padding: "12px 28px", borderRadius: 8, border: "none", background: saving ? "#93c5fd" : "linear-gradient(135deg, #1e3a5f, #2563EB)", color: "#fff", fontSize: 15, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8 }}
                >
                  {saving ? <Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} /> : <CheckCircle style={{ width: 18, height: 18 }} />}
                  {saving ? "Salvando..." : "Confirmar e Salvar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
