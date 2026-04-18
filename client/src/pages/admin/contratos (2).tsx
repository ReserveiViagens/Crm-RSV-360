import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  FileText,
  Plus,
  Eye,
  Send,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Shield,
  Heart,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Contrato {
  id: string;
  passageiro: string;
  excursao: string;
  tipo: "contrato" | "termo" | "autorizacao_menor";
  data: string;
  status: "assinado" | "pendente" | "expirado";
  valor: number;
}

const mockContratos: Contrato[] = [
  { id: "CTR-001", passageiro: "João Silva", excursao: "Caldas Novas - Agosto/2026", tipo: "contrato", data: "2026-07-15", status: "assinado", valor: 1500 },
  { id: "CTR-002", passageiro: "Maria Santos", excursao: "Caldas Novas - Agosto/2026", tipo: "contrato", data: "2026-07-16", status: "assinado", valor: 1500 },
  { id: "CTR-003", passageiro: "Pedro Costa", excursao: "Porto de Galinhas - Set/2026", tipo: "contrato", data: "2026-08-01", status: "pendente", valor: 2200 },
  { id: "CTR-004", passageiro: "Ana Oliveira", excursao: "Caldas Novas - Agosto/2026", tipo: "termo", data: "2026-07-15", status: "assinado", valor: 1500 },
  { id: "CTR-005", passageiro: "Lucas Mendes (menor)", excursao: "Caldas Novas - Agosto/2026", tipo: "autorizacao_menor", data: "2026-07-17", status: "pendente", valor: 1200 },
  { id: "CTR-006", passageiro: "Carlos Ferreira", excursao: "Gramado - Out/2026", tipo: "contrato", data: "2026-09-10", status: "expirado", valor: 1800 },
  { id: "CTR-007", passageiro: "Fernanda Lima", excursao: "Porto de Galinhas - Set/2026", tipo: "termo", data: "2026-08-05", status: "assinado", valor: 2200 },
  { id: "CTR-008", passageiro: "Beatriz Souza (menor)", excursao: "Gramado - Out/2026", tipo: "autorizacao_menor", data: "2026-09-12", status: "assinado", valor: 900 },
];

const tiposLabel: Record<string, string> = {
  contrato: "Contrato de Serviços Turísticos",
  termo: "Termo de Responsabilidade",
  autorizacao_menor: "Autorização para Menores",
};

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: typeof CheckCircle }> = {
  assinado: { label: "Assinado", bg: "#dcfce7", text: "#166534", icon: CheckCircle },
  pendente: { label: "Pendente", bg: "#fef9c3", text: "#854d0e", icon: Clock },
  expirado: { label: "Expirado", bg: "#fee2e2", text: "#991b1b", icon: XCircle },
};

export default function ContratosExcursao() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [expandedClause, setExpandedClause] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    tipo: "contrato",
    nomePassageiro: "",
    cpfPassageiro: "",
    excursao: "",
    valor: "",
    formaPagamento: "pix",
    nomeMenor: "",
    cpfMenor: "",
    dataNascimentoMenor: "",
    nomeResponsavel: "",
  });

  const totalContratos = mockContratos.length;
  const assinados = mockContratos.filter(c => c.status === "assinado").length;
  const pendentes = mockContratos.filter(c => c.status === "pendente").length;
  const expirados = mockContratos.filter(c => c.status === "expirado").length;

  const handleEnviarAssinatura = () => {
    toast({
      title: "Contrato enviado!",
      description: "Contrato enviado via SuperSign para assinatura digital.",
    });
    setShowPreview(false);
    setShowForm(false);
    setFormData({
      tipo: "contrato",
      nomePassageiro: "",
      cpfPassageiro: "",
      excursao: "",
      valor: "",
      formaPagamento: "pix",
      nomeMenor: "",
      cpfMenor: "",
      dataNascimentoMenor: "",
      nomeResponsavel: "",
    });
  };

  const handleVerContrato = (contrato: Contrato) => {
    toast({
      title: "Abrindo contrato...",
      description: `Visualizando ${tiposLabel[contrato.tipo]} de ${contrato.passageiro}`,
    });
  };

  const clausulas = [
    {
      id: "cancelamento",
      titulo: "Cancelamento e Reembolso",
      icone: <AlertTriangle style={{ width: 20, height: 20, color: "#F57C00" }} />,
      conteudo: "Até 30 dias antes: devolução integral com retenção de 10% para custos administrativos. De 29 a 8 dias antes: multa de 30% sobre o valor total. Menos de 7 dias antes: sem devolução, sendo possível indicar substituto mediante taxa de R$ 50,00 para atualização cadastral.",
    },
    {
      id: "responsabilidade",
      titulo: "Responsabilidade Civil",
      icone: <Shield style={{ width: 20, height: 20, color: "#2563EB" }} />,
      conteudo: "A RSV Turismo não se responsabiliza por atos de terceiros, casos fortuitos ou de força maior, incluindo mas não limitado a: condições climáticas adversas, greves, pandemias, cancelamentos por parte de fornecedores. O passageiro assume total responsabilidade por seus pertences pessoais e por seu comportamento durante a viagem.",
    },
    {
      id: "seguro",
      titulo: "Seguro de Viagem",
      icone: <Heart style={{ width: 20, height: 20, color: "#22C55E" }} />,
      conteudo: "Todas as excursões incluem seguro de viagem GTA/Universal Assistance, com cobertura de assistência médica de até R$ 30.000, repatriamento sanitário e cobertura de bagagem de até R$ 2.000. A apólice será emitida em nome do passageiro até 48h antes do embarque.",
    },
  ];

  const headerStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #1e3a5f, #2563EB)",
    padding: "24px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  };

  const cardStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: 8,
    padding: 24,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB" }} data-testid="page-contratos">
      <div style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/admin/dashboard" data-testid="link-voltar-dashboard">
            <div style={{ color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <ArrowLeft style={{ width: 20, height: 20 }} />
              <span style={{ fontSize: 14 }}>Voltar</span>
            </div>
          </Link>
          <div>
            <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 700, margin: 0 }} data-testid="text-titulo">
              Contratos de Excursão
            </h1>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, margin: 0 }}>
              Gestão de contratos, termos e autorizações
            </p>
          </div>
        </div>
        <button
          onClick={() => { setShowForm(true); setShowPreview(false); }}
          style={{
            background: "#F57C00",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontWeight: 600,
            fontSize: 14,
          }}
          data-testid="button-gerar-contrato"
        >
          <Plus style={{ width: 18, height: 18 }} />
          Gerar Novo Contrato
        </button>
      </div>

      <div style={{ padding: "24px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Total Contratos", value: totalContratos, color: "#2563EB" },
            { label: "Assinados", value: assinados, color: "#22C55E" },
            { label: "Pendentes", value: pendentes, color: "#F57C00" },
            { label: "Expirados", value: expirados, color: "#EF4444" },
          ].map((m) => (
            <div key={m.label} style={cardStyle} data-testid={`metric-${m.label.toLowerCase().replace(/ /g, "-")}`}>
              <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>{m.label}</p>
              <p style={{ fontSize: 32, fontWeight: 700, color: m.color, margin: "4px 0 0" }}>{m.value}</p>
            </div>
          ))}
        </div>

        {showForm && (
          <div style={{ ...cardStyle, marginBottom: 24, border: "2px solid #2563EB" }} data-testid="section-novo-contrato">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e3a5f", margin: 0 }}>
                {showPreview ? "Preview do Contrato" : "Gerar Novo Contrato"}
              </h2>
              <button onClick={() => { setShowForm(false); setShowPreview(false); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280" }} data-testid="button-fechar-form">
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            {!showPreview ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Tipo de Documento</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 14 }}
                    data-testid="select-tipo-contrato"
                  >
                    <option value="contrato">Contrato de Serviços Turísticos</option>
                    <option value="termo">Termo de Responsabilidade</option>
                    <option value="autorizacao_menor">Autorização para Menores</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Nome do Passageiro</label>
                  <input
                    value={formData.nomePassageiro}
                    onChange={(e) => setFormData({ ...formData, nomePassageiro: e.target.value })}
                    placeholder="Nome completo"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 14 }}
                    data-testid="input-nome-passageiro"
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4 }}>CPF</label>
                  <input
                    value={formData.cpfPassageiro}
                    onChange={(e) => setFormData({ ...formData, cpfPassageiro: e.target.value })}
                    placeholder="000.000.000-00"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 14 }}
                    data-testid="input-cpf-passageiro"
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Excursão</label>
                  <select
                    value={formData.excursao}
                    onChange={(e) => setFormData({ ...formData, excursao: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 14 }}
                    data-testid="select-excursao"
                  >
                    <option value="">Selecione a excursão</option>
                    <option value="Caldas Novas - Agosto/2026">Caldas Novas - Agosto/2026</option>
                    <option value="Porto de Galinhas - Set/2026">Porto de Galinhas - Set/2026</option>
                    <option value="Gramado - Out/2026">Gramado - Out/2026</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Valor (R$)</label>
                  <input
                    type="number"
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    placeholder="0,00"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 14 }}
                    data-testid="input-valor"
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Forma de Pagamento</label>
                  <select
                    value={formData.formaPagamento}
                    onChange={(e) => setFormData({ ...formData, formaPagamento: e.target.value })}
                    style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 14 }}
                    data-testid="select-forma-pagamento"
                  >
                    <option value="pix">Pix</option>
                    <option value="cartao">Cartão de Crédito</option>
                    <option value="boleto">Boleto Bancário</option>
                    <option value="parcelado">Parcelado (até 12x)</option>
                  </select>
                </div>

                {formData.tipo === "autorizacao_menor" && (
                  <>
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Nome do Menor</label>
                      <input
                        value={formData.nomeMenor}
                        onChange={(e) => setFormData({ ...formData, nomeMenor: e.target.value })}
                        placeholder="Nome completo do menor"
                        style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 14 }}
                        data-testid="input-nome-menor"
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4 }}>CPF do Menor</label>
                      <input
                        value={formData.cpfMenor}
                        onChange={(e) => setFormData({ ...formData, cpfMenor: e.target.value })}
                        placeholder="000.000.000-00"
                        style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 14 }}
                        data-testid="input-cpf-menor"
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Data de Nascimento do Menor</label>
                      <input
                        type="date"
                        value={formData.dataNascimentoMenor}
                        onChange={(e) => setFormData({ ...formData, dataNascimentoMenor: e.target.value })}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 14 }}
                        data-testid="input-data-nascimento-menor"
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Nome do Responsável</label>
                      <input
                        value={formData.nomeResponsavel}
                        onChange={(e) => setFormData({ ...formData, nomeResponsavel: e.target.value })}
                        placeholder="Nome completo do responsável legal"
                        style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 14 }}
                        data-testid="input-nome-responsavel"
                      />
                    </div>
                  </>
                )}

                <div style={{ gridColumn: "1 / -1", display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
                  <button
                    onClick={() => setShowForm(false)}
                    style={{ padding: "10px 20px", borderRadius: 6, border: "1px solid #d1d5db", background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#374151" }}
                    data-testid="button-cancelar-form"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => setShowPreview(true)}
                    style={{ padding: "10px 20px", borderRadius: 6, border: "none", background: "#2563EB", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}
                    data-testid="button-preview-contrato"
                  >
                    <Eye style={{ width: 16, height: 16 }} />
                    Visualizar Contrato
                  </button>
                </div>
              </div>
            ) : (
              <div data-testid="section-preview-contrato">
                <div style={{
                  background: "#fafafa",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  padding: 32,
                  fontFamily: "'Georgia', serif",
                  maxWidth: 800,
                  margin: "0 auto",
                }}>
                  <div style={{ textAlign: "center", marginBottom: 24, borderBottom: "2px solid #1e3a5f", paddingBottom: 16 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1e3a5f", margin: 0, textTransform: "uppercase", letterSpacing: 1 }}>
                      RSV Turismo
                    </h2>
                    <p style={{ fontSize: 11, color: "#6b7280", margin: "4px 0 0" }}>CNPJ: 00.000.000/0001-00 | Cadastur: 00.000000.00.0000-0</p>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#374151", marginTop: 12 }}>
                      {tiposLabel[formData.tipo]}
                    </h3>
                  </div>

                  <div style={{ fontSize: 13, lineHeight: 1.8, color: "#374151" }}>
                    <p>
                      Pelo presente instrumento, <strong>{formData.nomePassageiro || "[NOME DO PASSAGEIRO]"}</strong>,
                      CPF <strong>{formData.cpfPassageiro || "[CPF]"}</strong>, doravante denominado(a)
                      CONTRATANTE, e RSV TURISMO, CNPJ 00.000.000/0001-00, doravante denominada CONTRATADA,
                      firmam o presente {tiposLabel[formData.tipo].toLowerCase()} para a excursão
                      <strong> {formData.excursao || "[EXCURSÃO]"}</strong>.
                    </p>

                    <p style={{ marginTop: 16 }}>
                      <strong>CLÁUSULA 1ª — DO OBJETO:</strong> A CONTRATADA compromete-se a prestar serviços
                      turísticos conforme pacote adquirido, incluindo transporte, hospedagem e atividades descritas
                      no itinerário fornecido ao CONTRATANTE.
                    </p>

                    <p style={{ marginTop: 12 }}>
                      <strong>CLÁUSULA 2ª — DO VALOR:</strong> O valor total do pacote é de
                      <strong> R$ {formData.valor ? Number(formData.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : "[VALOR]"}</strong>,
                      a ser pago via <strong>{formData.formaPagamento === "pix" ? "Pix" : formData.formaPagamento === "cartao" ? "Cartão de Crédito" : formData.formaPagamento === "boleto" ? "Boleto Bancário" : "Parcelamento em até 12x"}</strong>.
                    </p>

                    <p style={{ marginTop: 12 }}>
                      <strong>CLÁUSULA 3ª — DO CANCELAMENTO:</strong> Conforme política vigente da CONTRATADA.
                    </p>

                    {formData.tipo === "autorizacao_menor" && (
                      <div style={{ marginTop: 16, padding: 16, background: "#eff6ff", borderRadius: 6, border: "1px solid #bfdbfe" }}>
                        <p style={{ fontWeight: 700, color: "#1e3a5f", margin: "0 0 8px" }}>AUTORIZAÇÃO PARA MENOR DE IDADE</p>
                        <p>Autorizo o menor <strong>{formData.nomeMenor || "[NOME DO MENOR]"}</strong>,
                          CPF <strong>{formData.cpfMenor || "[CPF MENOR]"}</strong>,
                          nascido(a) em <strong>{formData.dataNascimentoMenor || "[DATA]"}</strong>,
                          a participar da excursão sob responsabilidade de
                          <strong> {formData.nomeResponsavel || "[RESPONSÁVEL]"}</strong>.
                        </p>
                      </div>
                    )}

                    <div style={{ marginTop: 32, display: "flex", justifyContent: "space-between", gap: 32 }}>
                      <div style={{ textAlign: "center", flex: 1 }}>
                        <div style={{ borderTop: "1px solid #374151", paddingTop: 8, marginTop: 40 }}>
                          <p style={{ margin: 0, fontSize: 12 }}>{formData.nomePassageiro || "CONTRATANTE"}</p>
                          <p style={{ margin: 0, fontSize: 11, color: "#6b7280" }}>CPF: {formData.cpfPassageiro || "___.___.___-__"}</p>
                        </div>
                      </div>
                      <div style={{ textAlign: "center", flex: 1 }}>
                        <div style={{ borderTop: "1px solid #374151", paddingTop: 8, marginTop: 40 }}>
                          <p style={{ margin: 0, fontSize: 12 }}>RSV TURISMO</p>
                          <p style={{ margin: 0, fontSize: 11, color: "#6b7280" }}>CNPJ: 00.000.000/0001-00</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
                  <button
                    onClick={() => setShowPreview(false)}
                    style={{ padding: "10px 20px", borderRadius: 6, border: "1px solid #d1d5db", background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#374151" }}
                    data-testid="button-voltar-edicao"
                  >
                    Voltar à Edição
                  </button>
                  <button
                    onClick={handleEnviarAssinatura}
                    style={{ padding: "10px 20px", borderRadius: 6, border: "none", background: "#22C55E", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}
                    data-testid="button-enviar-assinatura"
                  >
                    <Send style={{ width: 16, height: 16 }} />
                    Enviar para Assinatura Digital
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div style={{ ...cardStyle, marginBottom: 24 }} data-testid="section-lista-contratos">
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e3a5f", margin: "0 0 16px" }}>
            Lista de Contratos
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                  {["ID", "Passageiro", "Excursão", "Tipo", "Data", "Status", "Ações"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockContratos.map((c) => {
                  const st = statusConfig[c.status];
                  const Icon = st.icon;
                  return (
                    <tr key={c.id} style={{ borderBottom: "1px solid #f3f4f6" }} data-testid={`row-contrato-${c.id}`}>
                      <td style={{ padding: "12px", fontWeight: 500, color: "#374151" }}>{c.id}</td>
                      <td style={{ padding: "12px", color: "#374151" }}>{c.passageiro}</td>
                      <td style={{ padding: "12px", color: "#6b7280" }}>{c.excursao}</td>
                      <td style={{ padding: "12px" }}>
                        <span style={{
                          background: c.tipo === "contrato" ? "#eff6ff" : c.tipo === "termo" ? "#f0fdf4" : "#fef3c7",
                          color: c.tipo === "contrato" ? "#1d4ed8" : c.tipo === "termo" ? "#166534" : "#92400e",
                          padding: "4px 10px",
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                        }}>
                          {tiposLabel[c.tipo]}
                        </span>
                      </td>
                      <td style={{ padding: "12px", color: "#6b7280" }}>{new Date(c.data).toLocaleDateString("pt-BR")}</td>
                      <td style={{ padding: "12px" }}>
                        <span style={{
                          background: st.bg,
                          color: st.text,
                          padding: "4px 10px",
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 600,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}>
                          <Icon style={{ width: 14, height: 14 }} />
                          {st.label}
                        </span>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <button
                          onClick={() => handleVerContrato(c)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#2563EB", display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 500 }}
                          data-testid={`button-ver-contrato-${c.id}`}
                        >
                          <Eye style={{ width: 16, height: 16 }} />
                          Ver
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ ...cardStyle }} data-testid="section-clausulas">
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e3a5f", margin: "0 0 16px" }}>
            Cláusulas Padrão
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {clausulas.map((cl) => (
              <div
                key={cl.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
                data-testid={`clausula-${cl.id}`}
              >
                <button
                  onClick={() => setExpandedClause(expandedClause === cl.id ? null : cl.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 16px",
                    background: expandedClause === cl.id ? "#f9fafb" : "#fff",
                    border: "none",
                    cursor: "pointer",
                    gap: 12,
                  }}
                  data-testid={`button-expand-clausula-${cl.id}`}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {cl.icone}
                    <span style={{ fontWeight: 600, fontSize: 14, color: "#374151" }}>{cl.titulo}</span>
                  </div>
                  {expandedClause === cl.id
                    ? <ChevronUp style={{ width: 18, height: 18, color: "#9ca3af" }} />
                    : <ChevronDown style={{ width: 18, height: 18, color: "#9ca3af" }} />
                  }
                </button>
                {expandedClause === cl.id && (
                  <div style={{ padding: "0 16px 16px", fontSize: 13, color: "#4b5563", lineHeight: 1.7 }}>
                    {cl.conteudo}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
