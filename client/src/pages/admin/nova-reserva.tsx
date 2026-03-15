import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Plus,
  Calendar,
  User,
  MapPin,
  Users,
  DollarSign,
  CreditCard,
  FileText,
  Loader2,
  CheckCircle,
  Search,
} from "lucide-react";

interface ClienteSugestao {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
}

const clientesMock: ClienteSugestao[] = [
  { id: "1", nome: "João Silva", cpf: "123.456.789-00", telefone: "(62) 99999-1234" },
  { id: "2", nome: "Maria Santos", cpf: "234.567.890-11", telefone: "(62) 99999-5678" },
  { id: "3", nome: "Pedro Costa", cpf: "345.678.901-22", telefone: "(34) 99999-9012" },
  { id: "4", nome: "Ana Oliveira", cpf: "456.789.012-33", telefone: "(11) 99999-3456" },
  { id: "5", nome: "Carlos Mendes", cpf: "567.890.123-44", telefone: "(61) 99999-7890" },
  { id: "6", nome: "Fernanda Lima", cpf: "678.901.234-55", telefone: "(21) 99999-2345" },
];

const destinosMock = [
  "Caldas Novas - GO",
  "Rio Quente - GO",
  "Porto de Galinhas - PE",
  "Fernando de Noronha - PE",
  "Gramado - RS",
  "Bonito - MS",
  "Chapada dos Veadeiros - GO",
  "Jericoacoara - CE",
];

export default function NovaReservaPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSugestoes, setShowSugestoes] = useState(false);
  const [buscaCliente, setBuscaCliente] = useState("");

  const [form, setForm] = useState({
    clienteNome: "",
    clienteCpf: "",
    clienteTelefone: "",
    destino: "",
    checkIn: "",
    checkOut: "",
    numPassageiros: "1",
    valorTotal: "",
    metodoPagamento: "",
    observacoes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sugestoesFiltradas = clientesMock.filter(
    (c) =>
      c.nome.toLowerCase().includes(buscaCliente.toLowerCase()) ||
      c.cpf.includes(buscaCliente)
  );

  const selecionarCliente = (c: ClienteSugestao) => {
    setForm({ ...form, clienteNome: c.nome, clienteCpf: c.cpf, clienteTelefone: c.telefone });
    setBuscaCliente(c.nome);
    setShowSugestoes(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clienteNome || !form.destino || !form.checkIn || !form.checkOut || !form.valorTotal || !form.metodoPagamento) {
      toast({ title: "Campos obrigatórios", description: "Preencha todos os campos obrigatórios.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    const codigo = `RSV-${Date.now().toString(36).toUpperCase()}`;
    setIsSubmitting(false);
    toast({ title: "Reserva criada com sucesso!", description: `Código: ${codigo} — ${form.clienteNome} → ${form.destino}` });
    setTimeout(() => setLocation("/admin/dashboard"), 1200);
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
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    marginBottom: 4,
  };

  return (
    <div data-testid="page-nova-reserva" style={{ minHeight: "100vh", background: "#F9FAFB" }}>
      <header style={{ background: "linear-gradient(135deg, #1e3a5f, #2563EB)", padding: "20px 24px", color: "#fff", display: "flex", alignItems: "center", gap: 16 }}>
        <Link href="/admin/dashboard">
          <button data-testid="button-voltar" style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: "8px 14px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 500 }}>
            <ArrowLeft style={{ width: 18, height: 18 }} /> Voltar
          </button>
        </Link>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}>
            <Plus style={{ width: 28, height: 28 }} /> Nova Reserva
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, opacity: 0.85 }}>Criar nova reserva para cliente</p>
        </div>
      </header>

      <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        <form onSubmit={handleSubmit} data-testid="form-nova-reserva">
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e3a5f", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <User style={{ width: 20, height: 20 }} /> Dados do Cliente
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              <div style={{ position: "relative" }}>
                <label style={labelStyle}><Search style={{ width: 14, height: 14 }} /> Buscar Cliente *</label>
                <input
                  data-testid="input-busca-cliente"
                  value={buscaCliente}
                  onChange={(e) => { setBuscaCliente(e.target.value); setShowSugestoes(true); setForm({ ...form, clienteNome: e.target.value }); }}
                  onFocus={() => setShowSugestoes(true)}
                  placeholder="Nome ou CPF do cliente"
                  style={inputStyle}
                  autoComplete="off"
                />
                {showSugestoes && buscaCliente.length > 0 && sugestoesFiltradas.length > 0 && (
                  <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid #d1d5db", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.12)", zIndex: 10, maxHeight: 200, overflow: "auto" }}>
                    {sugestoesFiltradas.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        data-testid={`sugestao-cliente-${c.id}`}
                        onClick={() => selecionarCliente(c)}
                        style={{ display: "block", width: "100%", padding: "10px 14px", border: "none", background: "transparent", cursor: "pointer", textAlign: "left", borderBottom: "1px solid #f3f4f6" }}
                      >
                        <span style={{ fontWeight: 600, fontSize: 14, color: "#1f2937" }}>{c.nome}</span>
                        <span style={{ fontSize: 12, color: "#6b7280", marginLeft: 10 }}>{c.cpf}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label style={labelStyle}><FileText style={{ width: 14, height: 14 }} /> CPF</label>
                <input data-testid="input-cpf-cliente" name="clienteCpf" value={form.clienteCpf} onChange={handleChange} placeholder="000.000.000-00" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Telefone</label>
                <input data-testid="input-telefone-cliente" name="clienteTelefone" value={form.clienteTelefone} onChange={handleChange} placeholder="(00) 00000-0000" style={inputStyle} />
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e3a5f", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <MapPin style={{ width: 20, height: 20 }} /> Detalhes da Reserva
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              <div>
                <label style={labelStyle}><MapPin style={{ width: 14, height: 14 }} /> Destino *</label>
                <select data-testid="select-destino" name="destino" value={form.destino} onChange={handleChange} style={inputStyle}>
                  <option value="">Selecione o destino</option>
                  {destinosMock.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}><Calendar style={{ width: 14, height: 14 }} /> Check-in *</label>
                <input data-testid="input-checkin" name="checkIn" type="date" value={form.checkIn} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}><Calendar style={{ width: 14, height: 14 }} /> Check-out *</label>
                <input data-testid="input-checkout" name="checkOut" type="date" value={form.checkOut} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}><Users style={{ width: 14, height: 14 }} /> Nº de Passageiros</label>
                <input data-testid="input-num-passageiros" name="numPassageiros" type="number" min="1" max="50" value={form.numPassageiros} onChange={handleChange} style={inputStyle} />
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1e3a5f", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <DollarSign style={{ width: 20, height: 20 }} /> Pagamento
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              <div>
                <label style={labelStyle}><DollarSign style={{ width: 14, height: 14 }} /> Valor Total (R$) *</label>
                <input data-testid="input-valor-total" name="valorTotal" type="number" min="0" step="0.01" value={form.valorTotal} onChange={handleChange} placeholder="0,00" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}><CreditCard style={{ width: 14, height: 14 }} /> Método de Pagamento *</label>
                <select data-testid="select-metodo-pagamento" name="metodoPagamento" value={form.metodoPagamento} onChange={handleChange} style={inputStyle}>
                  <option value="">Selecione</option>
                  <option value="pix">PIX</option>
                  <option value="cartao_credito">Cartão de Crédito</option>
                  <option value="cartao_debito">Cartão de Débito</option>
                  <option value="boleto">Boleto Bancário</option>
                  <option value="dinheiro">Dinheiro</option>
                </select>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}><FileText style={{ width: 14, height: 14 }} /> Observações</label>
                <textarea
                  data-testid="input-observacoes"
                  name="observacoes"
                  value={form.observacoes}
                  onChange={handleChange}
                  placeholder="Observações adicionais (opcional)"
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <Link href="/admin/dashboard">
              <button type="button" data-testid="button-cancelar" style={{ padding: "12px 24px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", color: "#6b7280", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                Cancelar
              </button>
            </Link>
            <button
              type="submit"
              data-testid="button-criar-reserva"
              disabled={isSubmitting}
              style={{
                padding: "12px 28px",
                borderRadius: 8,
                border: "none",
                background: isSubmitting ? "#93c5fd" : "linear-gradient(135deg, #1e3a5f, #2563EB)",
                color: "#fff",
                fontSize: 15,
                fontWeight: 600,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {isSubmitting ? (
                <><Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} /> Criando...</>
              ) : (
                <><CheckCircle style={{ width: 18, height: 18 }} /> Criar Reserva</>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
