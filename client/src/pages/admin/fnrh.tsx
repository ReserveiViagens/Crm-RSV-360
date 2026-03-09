import { useState } from "react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  FileText,
  Send,
  Download,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Shield,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Car,
  Briefcase,
} from "lucide-react";

interface FnrhRecord {
  id: string;
  hospede: string;
  cpf: string;
  checkIn: string;
  checkOut: string;
  status: "Enviada" | "Pendente" | "Erro";
  protocolo: string;
}

const mockRecords: FnrhRecord[] = [
  { id: "1", hospede: "João Silva", cpf: "123.456.789-00", checkIn: "2026-03-10", checkOut: "2026-03-14", status: "Enviada", protocolo: "FNRH-2026-00142" },
  { id: "2", hospede: "Maria Santos", cpf: "987.654.321-00", checkIn: "2026-03-11", checkOut: "2026-03-15", status: "Enviada", protocolo: "FNRH-2026-00143" },
  { id: "3", hospede: "Pedro Costa", cpf: "456.789.123-00", checkIn: "2026-03-12", checkOut: "2026-03-16", status: "Pendente", protocolo: "—" },
  { id: "4", hospede: "Ana Oliveira", cpf: "321.654.987-00", checkIn: "2026-03-13", checkOut: "2026-03-17", status: "Enviada", protocolo: "FNRH-2026-00145" },
  { id: "5", hospede: "Carlos Mendes", cpf: "654.321.987-00", checkIn: "2026-03-14", checkOut: "2026-03-18", status: "Erro", protocolo: "—" },
  { id: "6", hospede: "Fernanda Lima", cpf: "789.123.456-00", checkIn: "2026-03-15", checkOut: "2026-03-19", status: "Enviada", protocolo: "FNRH-2026-00147" },
  { id: "7", hospede: "Ricardo Alves", cpf: "159.753.486-00", checkIn: "2026-03-16", checkOut: "2026-03-20", status: "Pendente", protocolo: "—" },
];

const motivoOptions = [
  { value: "lazer", label: "Lazer" },
  { value: "negocios", label: "Negócios" },
  { value: "eventos", label: "Eventos" },
  { value: "saude", label: "Saúde" },
  { value: "religiao", label: "Religião" },
  { value: "estudos", label: "Estudos" },
];

const transporteOptions = [
  { value: "aviao", label: "Avião" },
  { value: "onibus", label: "Ônibus" },
  { value: "carro", label: "Carro" },
  { value: "van", label: "Van" },
];

export default function FnrhPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [records, setRecords] = useState<FnrhRecord[]>(mockRecords);

  const [form, setForm] = useState({
    nomeCompleto: "",
    cpfPassaporte: "",
    dataNascimento: "",
    sexo: "",
    telefone: "",
    email: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    motivoViagem: "",
    meioTransporte: "",
    checkIn: "",
    checkOut: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nomeCompleto || !form.cpfPassaporte) {
      toast({ title: "Erro", description: "Preencha os campos obrigatórios.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 2000));
    const protocolo = `FNRH-2026-${String(Math.floor(10000 + Math.random() * 90000))}`;
    const newRecord: FnrhRecord = {
      id: String(records.length + 1),
      hospede: form.nomeCompleto,
      cpf: form.cpfPassaporte,
      checkIn: form.checkIn || "2026-03-20",
      checkOut: form.checkOut || "2026-03-24",
      status: "Enviada",
      protocolo,
    };
    setRecords([newRecord, ...records]);
    setIsSubmitting(false);
    toast({ title: "FNRH enviada com sucesso!", description: `Protocolo: ${protocolo}` });
    setForm({ nomeCompleto: "", cpfPassaporte: "", dataNascimento: "", sexo: "", telefone: "", email: "", endereco: "", cidade: "", estado: "", cep: "", motivoViagem: "", meioTransporte: "", checkIn: "", checkOut: "" });
  };

  const handleExportCSV = () => {
    const header = "Hóspede,CPF,Check-in,Check-out,Status,Protocolo\n";
    const rows = records.map((r) => `${r.hospede},${r.cpf},${r.checkIn},${r.checkOut},${r.status},${r.protocolo}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "fnrh_registros.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: "CSV exportado!", description: "Arquivo fnrh_registros.csv baixado." });
  };

  const getStatusBadge = (status: FnrhRecord["status"]) => {
    const styles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      Enviada: { bg: "#dcfce7", text: "#166534", icon: <CheckCircle style={{ width: 14, height: 14 }} /> },
      Pendente: { bg: "#fef9c3", text: "#854d0e", icon: <AlertCircle style={{ width: 14, height: 14 }} /> },
      Erro: { bg: "#fecaca", text: "#991b1b", icon: <XCircle style={{ width: 14, height: 14 }} /> },
    };
    const s = styles[status];
    return (
      <span
        data-testid={`badge-status-${status.toLowerCase()}`}
        style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 9999, fontSize: 12, fontWeight: 600, backgroundColor: s.bg, color: s.text }}
      >
        {s.icon} {status}
      </span>
    );
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s",
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
    <div style={{ minHeight: "100vh", backgroundColor: "#F9FAFB" }}>
      <header
        data-testid="header-fnrh"
        style={{
          background: "linear-gradient(135deg, #1e3a5f, #2563EB)",
          color: "#fff",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Link href="/admin/dashboard" data-testid="link-voltar-dashboard">
          <button
            data-testid="button-voltar"
            style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: "8px 14px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 500 }}
          >
            <ArrowLeft style={{ width: 18, height: 18 }} /> Voltar
          </button>
        </Link>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}>
            <FileText style={{ width: 28, height: 28 }} /> FNRH Digital
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, opacity: 0.85 }}>Ficha Nacional de Registro de Hóspedes — Envio ao MTur</p>
        </div>
        <button
          data-testid="button-exportar-csv"
          onClick={handleExportCSV}
          style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, padding: "8px 16px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 500 }}
        >
          <Download style={{ width: 16, height: 16 }} /> Exportar CSV
        </button>
      </header>

      <div style={{ padding: "24px", display: "grid", gap: 24 }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 10,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1e3a5f", display: "flex", alignItems: "center", gap: 8 }}>
              <User style={{ width: 20, height: 20 }} /> Nova FNRH
            </h2>
            <span
              data-testid="badge-lgpd"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                backgroundColor: "#eff6ff",
                color: "#1e40af",
                border: "1px solid #bfdbfe",
              }}
            >
              <Shield style={{ width: 14, height: 14 }} /> Dados coletados conforme LGPD e Lei 11.771/2008
            </span>
          </div>

          <form onSubmit={handleSubmit} data-testid="form-fnrh" style={{ padding: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              <div>
                <label style={labelStyle}><User style={{ width: 14, height: 14 }} /> Nome Completo *</label>
                <input data-testid="input-nome-completo" name="nomeCompleto" value={form.nomeCompleto} onChange={handleChange} placeholder="Nome completo do hóspede" style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}><FileText style={{ width: 14, height: 14 }} /> CPF / Passaporte *</label>
                <input data-testid="input-cpf-passaporte" name="cpfPassaporte" value={form.cpfPassaporte} onChange={handleChange} placeholder="000.000.000-00" style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}><Calendar style={{ width: 14, height: 14 }} /> Data de Nascimento</label>
                <input data-testid="input-data-nascimento" name="dataNascimento" type="date" value={form.dataNascimento} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Sexo</label>
                <select data-testid="select-sexo" name="sexo" value={form.sexo} onChange={handleChange} style={inputStyle}>
                  <option value="">Selecione</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}><Phone style={{ width: 14, height: 14 }} /> Telefone</label>
                <input data-testid="input-telefone" name="telefone" value={form.telefone} onChange={handleChange} placeholder="(00) 00000-0000" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}><Mail style={{ width: 14, height: 14 }} /> E-mail</label>
                <input data-testid="input-email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@exemplo.com" style={inputStyle} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}><MapPin style={{ width: 14, height: 14 }} /> Endereço Residencial</label>
                <input data-testid="input-endereco" name="endereco" value={form.endereco} onChange={handleChange} placeholder="Rua, número, complemento" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Cidade</label>
                <input data-testid="input-cidade" name="cidade" value={form.cidade} onChange={handleChange} placeholder="Cidade" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Estado</label>
                <input data-testid="input-estado" name="estado" value={form.estado} onChange={handleChange} placeholder="UF" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>CEP</label>
                <input data-testid="input-cep" name="cep" value={form.cep} onChange={handleChange} placeholder="00000-000" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}><Briefcase style={{ width: 14, height: 14 }} /> Motivo da Viagem</label>
                <select data-testid="select-motivo-viagem" name="motivoViagem" value={form.motivoViagem} onChange={handleChange} style={inputStyle}>
                  <option value="">Selecione</option>
                  {motivoOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}><Car style={{ width: 14, height: 14 }} /> Meio de Transporte</label>
                <select data-testid="select-meio-transporte" name="meioTransporte" value={form.meioTransporte} onChange={handleChange} style={inputStyle}>
                  <option value="">Selecione</option>
                  {transporteOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}><Calendar style={{ width: 14, height: 14 }} /> Check-in</label>
                <input data-testid="input-checkin" name="checkIn" type="date" value={form.checkIn} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}><Calendar style={{ width: 14, height: 14 }} /> Check-out</label>
                <input data-testid="input-checkout" name="checkOut" type="date" value={form.checkOut} onChange={handleChange} style={inputStyle} />
              </div>
            </div>

            <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
              <button
                data-testid="button-enviar-fnrh"
                type="submit"
                disabled={isSubmitting}
                style={{
                  background: isSubmitting ? "#93c5fd" : "linear-gradient(135deg, #1e3a5f, #2563EB)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "12px 28px",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} /> Enviando ao MTur...
                  </>
                ) : (
                  <>
                    <Send style={{ width: 18, height: 18 }} /> Enviar FNRH
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 10,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1e3a5f", display: "flex", alignItems: "center", gap: 8 }}>
              <FileText style={{ width: 20, height: 20 }} /> FNRHs Enviadas
            </h2>
            <span data-testid="text-total-registros" style={{ fontSize: 13, color: "#6b7280" }}>
              {records.length} registros
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table data-testid="table-fnrh" style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ backgroundColor: "#f9fafb" }}>
                  {["Hóspede", "CPF", "Check-in", "Check-out", "Status", "Protocolo"].map((col) => (
                    <th key={col} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #e5e7eb" }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.id} data-testid={`row-fnrh-${r.id}`} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 500, color: "#111827" }}>{r.hospede}</td>
                    <td style={{ padding: "12px 16px", color: "#374151", fontFamily: "monospace" }}>{r.cpf}</td>
                    <td style={{ padding: "12px 16px", color: "#374151" }}>{new Date(r.checkIn).toLocaleDateString("pt-BR")}</td>
                    <td style={{ padding: "12px 16px", color: "#374151" }}>{new Date(r.checkOut).toLocaleDateString("pt-BR")}</td>
                    <td style={{ padding: "12px 16px" }}>{getStatusBadge(r.status)}</td>
                    <td style={{ padding: "12px 16px", color: "#374151", fontFamily: "monospace", fontSize: 13 }}>{r.protocolo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
