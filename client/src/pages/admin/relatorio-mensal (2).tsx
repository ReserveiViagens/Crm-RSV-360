import { useState } from "react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
} from "recharts";
import {
  ArrowLeft,
  BarChart3,
  Download,
  DollarSign,
  Calendar,
  Users,
  TrendingUp,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

interface ReservaRelatorio {
  id: string;
  cliente: string;
  destino: string;
  valor: number;
  data: string;
  status: "confirmada" | "pendente" | "cancelada";
}

const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const gerarDados = (mes: number, ano: number) => {
  const seed = mes + ano * 12;
  const base = 80000 + (seed % 7) * 15000;
  const semanas = [
    { semana: "Sem 1", receita: Math.round(base * 0.22 + (seed % 5) * 1000) },
    { semana: "Sem 2", receita: Math.round(base * 0.28 + (seed % 3) * 2000) },
    { semana: "Sem 3", receita: Math.round(base * 0.26 + (seed % 4) * 1500) },
    { semana: "Sem 4", receita: Math.round(base * 0.24 + (seed % 6) * 800) },
  ];
  const totalReceita = semanas.reduce((s, w) => s + w.receita, 0);
  const numReservas = 30 + (seed % 20);
  const novosClientes = 8 + (seed % 12);
  const ticketMedio = Math.round(totalReceita / numReservas);

  const reservas: ReservaRelatorio[] = Array.from({ length: Math.min(numReservas, 12) }, (_, i) => {
    const statuses: ReservaRelatorio["status"][] = ["confirmada", "confirmada", "confirmada", "pendente", "cancelada"];
    const destinos = ["Caldas Novas - GO", "Rio Quente - GO", "Porto de Galinhas - PE", "Gramado - RS", "Bonito - MS"];
    const nomes = ["João Silva", "Maria Santos", "Pedro Costa", "Ana Oliveira", "Carlos Mendes", "Fernanda Lima", "Ricardo Souza", "Juliana Pereira", "Roberto Alves", "Camila Rocha", "Lucas Martins", "Beatriz Nunes"];
    const dia = String(Math.min(28, i + 1 + (seed % 5))).padStart(2, "0");
    const mesStr = String(mes + 1).padStart(2, "0");
    return {
      id: `R-${ano}${mesStr}${String(i + 1).padStart(3, "0")}`,
      cliente: nomes[i % nomes.length],
      destino: destinos[i % destinos.length],
      valor: 800 + ((seed + i) % 10) * 200,
      data: `${ano}-${mesStr}-${dia}`,
      status: statuses[i % statuses.length],
    };
  });

  return { semanas, totalReceita, numReservas, novosClientes, ticketMedio, reservas };
};

export default function RelatorioMensalPage() {
  const { toast } = useToast();
  const hoje = new Date();
  const [mes, setMes] = useState(hoje.getMonth());
  const [ano, setAno] = useState(hoje.getFullYear());

  const dados = gerarDados(mes, ano);

  const handleExportCSV = () => {
    const header = "ID,Cliente,Destino,Valor,Data,Status\n";
    const rows = dados.reservas.map((r) => `${r.id},${r.cliente},${r.destino},${r.valor},${r.data},${r.status}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `relatorio_${meses[mes].toLowerCase()}_${ano}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: "CSV exportado!", description: `Relatório de ${meses[mes]} ${ano} baixado.` });
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { bg: string; color: string; icon: React.ReactNode; label: string }> = {
      confirmada: { bg: "#dcfce7", color: "#166534", icon: <CheckCircle style={{ width: 14, height: 14 }} />, label: "Confirmada" },
      pendente: { bg: "#fef9c3", color: "#854d0e", icon: <Clock style={{ width: 14, height: 14 }} />, label: "Pendente" },
      cancelada: { bg: "#fecaca", color: "#991b1b", icon: <XCircle style={{ width: 14, height: 14 }} />, label: "Cancelada" },
    };
    const s = map[status] ?? map.pendente;
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color }}>
        {s.icon} {s.label}
      </span>
    );
  };

  const inputStyle: React.CSSProperties = {
    padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, outline: "none",
  };

  return (
    <div data-testid="page-relatorio-mensal" style={{ minHeight: "100vh", background: "#F9FAFB" }}>
      <header style={{ background: "linear-gradient(135deg, #1e3a5f, #2563EB)", padding: "20px 24px", color: "#fff", display: "flex", alignItems: "center", gap: 16 }}>
        <Link href="/admin/dashboard">
          <button data-testid="button-voltar" style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: "8px 14px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 500 }}>
            <ArrowLeft style={{ width: 18, height: 18 }} /> Voltar
          </button>
        </Link>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}>
            <BarChart3 style={{ width: 28, height: 28 }} /> Relatório Mensal
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, opacity: 0.85 }}>Relatório de vendas e desempenho</p>
        </div>
        <button
          data-testid="button-exportar-csv"
          onClick={handleExportCSV}
          style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, padding: "8px 16px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600 }}
        >
          <Download style={{ width: 16, height: 16 }} /> Exportar CSV
        </button>
      </header>

      <div style={{ padding: 24 }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 24, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Calendar style={{ width: 18, height: 18, color: "#6b7280" }} />
            <span style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>Período:</span>
          </div>
          <select data-testid="select-mes" value={mes} onChange={(e) => setMes(Number(e.target.value))} style={inputStyle}>
            {meses.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <select data-testid="select-ano" value={ano} onChange={(e) => setAno(Number(e.target.value))} style={inputStyle}>
            {[2024, 2025, 2026].map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Receita Total", value: `R$ ${dados.totalReceita.toLocaleString("pt-BR")}`, icon: <DollarSign style={{ width: 24, height: 24, color: "#22C55E" }} />, bg: "#D1FAE5" },
            { label: "Nº de Reservas", value: String(dados.numReservas), icon: <FileText style={{ width: 24, height: 24, color: "#2563EB" }} />, bg: "#DBEAFE" },
            { label: "Ticket Médio", value: `R$ ${dados.ticketMedio.toLocaleString("pt-BR")}`, icon: <TrendingUp style={{ width: 24, height: 24, color: "#F57C00" }} />, bg: "#FEF3C7" },
            { label: "Novos Clientes", value: String(dados.novosClientes), icon: <Users style={{ width: 24, height: 24, color: "#8B5CF6" }} />, bg: "#EDE9FE" },
          ].map((kpi, i) => (
            <div key={i} data-testid={`kpi-${i}`} style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ padding: 8, borderRadius: 10, background: kpi.bg }}>{kpi.icon}</div>
                <div>
                  <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>{kpi.label}</p>
                  <p style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "4px 0 0" }}>{kpi.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", marginBottom: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 20 }}>Receita por Semana — {meses[mes]} {ano}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dados.semanas}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="semana" tick={{ fill: "#6B7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
              <RechartsTooltip formatter={(value: number) => [`R$ ${value.toLocaleString("pt-BR")}`, "Receita"]} />
              <Bar dataKey="receita" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", margin: 0 }}>Reservas do Período</h3>
            <span style={{ fontSize: 13, color: "#6b7280" }}>{dados.reservas.length} reservas</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table data-testid="table-reservas-relatorio" style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Código", "Cliente", "Destino", "Valor", "Data", "Status"].map((col) => (
                    <th key={col} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #e5e7eb" }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dados.reservas.map((r) => (
                  <tr key={r.id} data-testid={`row-reserva-${r.id}`} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "12px 16px", fontFamily: "monospace", color: "#374151", fontSize: 13 }}>{r.id}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 500, color: "#111827" }}>{r.cliente}</td>
                    <td style={{ padding: "12px 16px", color: "#374151" }}>{r.destino}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: "#1e3a5f" }}>R$ {r.valor.toLocaleString("pt-BR")}</td>
                    <td style={{ padding: "12px 16px", color: "#374151" }}>{new Date(r.data).toLocaleDateString("pt-BR")}</td>
                    <td style={{ padding: "12px 16px" }}>{getStatusBadge(r.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
