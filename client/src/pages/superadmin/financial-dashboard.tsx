import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminShell } from "@/components/layout-system/AdminShell";
import { PageContainer, SectionContainer } from "@/components/layout-system";
import { AdminSidebar, AdminTopBar } from "@/components/admin";
import {
  DollarSign, TrendingUp, Users, Wallet, Download, BarChart3, Activity,
  Filter, Calendar
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, AreaChart, Area
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Dados base
const MONTHLY_DATA = [
  { name: "Jan", GMV: 45000, Lucro: 12000, Passageiros: 48 },
  { name: "Fev", GMV: 62000, Lucro: 18500, Passageiros: 67 },
  { name: "Mar", GMV: 89000, Lucro: 26700, Passageiros: 94 },
  { name: "Abr", GMV: 71000, Lucro: 21300, Passageiros: 78 },
  { name: "Mai", GMV: 95000, Lucro: 28500, Passageiros: 103 },
  { name: "Jun", GMV: 112000, Lucro: 33600, Passageiros: 124 },
];

const CONVERSION_DATA = [
  { name: "Jan", taxa: 12 }, { name: "Fev", taxa: 15 }, { name: "Mar", taxa: 18 },
  { name: "Abr", taxa: 14 }, { name: "Mai", taxa: 22 }, { name: "Jun", taxa: 27 },
];

const TREND_DATA_7D = [
  { day: "Seg", value: 85000 },
  { day: "Ter", value: 92000 },
  { day: "Qua", value: 78000 },
  { day: "Qui", value: 105000 },
  { day: "Sex", value: 118000 },
  { day: "Sab", value: 95000 },
  { day: "Dom", value: 112000 },
];

const EXCURSOES_TABLE = [
  { nome: "Caldas Novas — Março", bruto: 89000, plataforma: 26700, organizador: 14500, passageiros: 94, status: "CONCLUIDA" },
  { nome: "Rio Quente — Feriado Abril", bruto: 71000, plataforma: 21300, organizador: 11360, passageiros: 78, status: "CONCLUIDA" },
  { nome: "Caldas Novas — Maio", bruto: 95000, plataforma: 28500, organizador: 15200, passageiros: 103, status: "EM ANDAMENTO" },
  { nome: "Rio Quente — Junho", bruto: 55000, plataforma: 16500, organizador: 8800, passageiros: 61, status: "VENDENDO" },
];

const fmtCurrency = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

export default function FinancialDashboard() {
  const [period, setPeriod] = useState("30d");
  const [category, setCategory] = useState("all");
  const currentMonth = MONTHLY_DATA[MONTHLY_DATA.length - 1];

  const filteredTransactions = category === "all" 
    ? EXCURSOES_TABLE 
    : EXCURSOES_TABLE;

  const exportCSV = () => {
    const header = "Excursão,Bruto,Plataforma,Organizador,Passageiros,Status\n";
    const rows = filteredTransactions.map(e => `${e.nome},${e.bruto},${e.plataforma},${e.organizador},${e.passageiros},${e.status}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); 
    a.href = url; 
    a.download = `relatorio-financeiro-${period}.csv`; 
    a.click();
  };

  const kpiCards = [
    { 
      label: "Lucro Líquido (Mês)", 
      value: fmtCurrency(currentMonth.Lucro), 
      sub: "+44% vs mês anterior", 
      icon: DollarSign, 
      color: "border-emerald-400", 
      subColor: "text-emerald-600",
      trend: TREND_DATA_7D
    },
    { 
      label: "Volume Transacionado (GMV)", 
      value: fmtCurrency(currentMonth.GMV), 
      sub: "Total pago por passageiros", 
      icon: Wallet, 
      color: "border-blue-500", 
      subColor: "text-blue-600",
      trend: TREND_DATA_7D
    },
    { 
      label: "Repasses Pagos (Split)", 
      value: fmtCurrency(currentMonth.GMV - currentMonth.Lucro), 
      sub: "Comissões de Organizadores", 
      icon: TrendingUp, 
      color: "border-amber-400", 
      subColor: "text-amber-600",
      trend: TREND_DATA_7D
    },
    { 
      label: "Passageiros Pagantes", 
      value: String(currentMonth.Passageiros), 
      sub: "No mês atual", 
      icon: Users, 
      color: "border-purple-400", 
      subColor: "text-purple-600",
      trend: TREND_DATA_7D
    },
  ];

  return (
    <AdminShell
      sidebar={<AdminSidebar currentPath="/superadmin/financial-dashboard" />}
      topbar={<AdminTopBar title="Centro Financeiro" />}
    >
      <PageContainer
        title="Centro de Comando Financeiro"
        subtitle="Visão global de faturamento e comissionamento — Fuso: America/Cuiaba"
        icon={<BarChart3 className="w-6 h-6" />}
        actions={
          <Button onClick={exportCSV} variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
        }
        data-testid="financial-dashboard"
      >
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
                <SelectItem value="ytd">Ano até hoje</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                <SelectItem value="hotels">Hotéis</SelectItem>
                <SelectItem value="tours">Excursões</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* KPI Cards com Mini-gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpiCards.map(({ label, value, sub, icon: Icon, color, subColor, trend }) => (
            <Card key={label} className={`border-l-4 ${color}`} data-testid={`kpi-${label.substring(0, 10).toLowerCase().replace(/ /g, "-")}`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
                <CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle>
                <Icon className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className={`text-xs mt-2 flex items-center gap-1 ${subColor}`}>
                  {subColor === "text-emerald-600" && <TrendingUp className="w-3 h-3" />}
                  {sub}
                </p>
                {/* Mini gráfico */}
                <div className="mt-3 h-12 -mx-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trend} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        fill={color === "border-emerald-400" ? "#d1fae5" : color === "border-blue-500" ? "#dbeafe" : color === "border-amber-400" ? "#fef3c7" : "#e9d5ff"} 
                        stroke={subColor === "text-emerald-600" ? "#10b981" : subColor === "text-blue-600" ? "#3b82f6" : subColor === "text-amber-600" ? "#f59e0b" : "#a855f7"} 
                        strokeWidth={1}
                        isAnimationActive={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Gráficos Principais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary" /> GMV vs Lucro Mensal</CardTitle>
              <CardDescription className="text-xs">Comparativo de volume bruto e lucro líquido da plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={MONTHLY_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => fmtCurrency(v)} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="GMV" name="GMV" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Lucro" name="Lucro Líquido" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Activity className="w-4 h-4 text-primary" /> Tendência de Conversão</CardTitle>
              <CardDescription className="text-xs">Taxa de conversão de visitantes da landing page em pagamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={CONVERSION_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(v: number) => `${v}%`} />
                  <Line type="monotone" dataKey="taxa" name="Taxa de conversão" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: "#8b5cf6", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Transações */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Detalhamento por Excursão</CardTitle>
            <CardDescription className="text-xs">Breakdown de split financeiro por grupo de viagem</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {["Excursão", "Bruto (GMV)", "Plataforma", "Organizador", "Passageiros", "Status"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((e, i) => (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20" data-testid={`financial-row-${i}`}>
                      <td className="px-4 py-3 font-medium text-foreground">{e.nome}</td>
                      <td className="px-4 py-3 font-bold text-foreground">{fmtCurrency(e.bruto)}</td>
                      <td className="px-4 py-3 text-emerald-700 font-semibold">{fmtCurrency(e.plataforma)}</td>
                      <td className="px-4 py-3 text-amber-700 font-semibold">{fmtCurrency(e.organizador)}</td>
                      <td className="px-4 py-3">{e.passageiros}</td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs ${e.status === "CONCLUIDA" ? "bg-slate-100 text-slate-700" : e.status === "VENDENDO" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}>
                          {e.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    </AdminShell>
  );
}
