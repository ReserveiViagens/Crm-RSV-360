import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

// Mock Data
const MONTHLY_DATA = [
  { month: "Jan", GMV: 125000, Lucro: 18750, Passageiros: 420 },
  { month: "Fev", GMV: 142000, Lucro: 21300, Passageiros: 485 },
  { month: "Mar", GMV: 158000, Lucro: 23700, Passageiros: 542 },
];

const DAILY_TREND = [
  { day: "Seg", conversion: 85 },
  { day: "Ter", conversion: 92 },
  { day: "Qua", conversion: 78 },
  { day: "Qui", conversion: 105 },
  { day: "Sex", conversion: 118 },
  { day: "Sab", conversion: 95 },
  { day: "Dom", conversion: 112 },
];

const EXCURSOES_TABLE = [
  { id: 1, nome: "Caldas Novas - Março", bruto: 45000, plataforma: 5400, organizador: 39600, passageiros: 50, status: "Concluída" },
  { id: 2, nome: "Rio Quente - Feriado", bruto: 32000, plataforma: 3840, organizador: 28160, passageiros: 35, status: "EM ANDAMENTO" },
  { id: 3, nome: "Poços de Caldas", bruto: 28500, plataforma: 3420, organizador: 25080, passageiros: 30, status: "VENDENDO" },
];

const fmtCurrency = (v: number) => `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

export default function FinancialDashboard() {
  const [period, setPeriod] = useState("30d");
  const [category, setCategory] = useState("all");
  const currentMonth = MONTHLY_DATA[MONTHLY_DATA.length - 1];

  const filteredTransactions = category === "all" 
    ? EXCURSOES_TABLE 
    : EXCURSOES_TABLE.filter(e => category === "tours" ? true : true);

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
    },
    { 
      label: "Volume Transacionado (GMV)", 
      value: fmtCurrency(currentMonth.GMV), 
      sub: "Total pago por passageiros", 
      icon: Wallet, 
      color: "border-primary", 
      subColor: "text-muted-foreground",
    },
    { 
      label: "Repasses Pagos (Split)", 
      value: fmtCurrency(currentMonth.GMV - currentMonth.Lucro), 
      sub: "Comissões de Organizadores", 
      icon: TrendingUp, 
      color: "border-amber-400", 
      subColor: "text-muted-foreground",
    },
    { 
      label: "Passageiros Pagantes", 
      value: String(currentMonth.Passageiros), 
      sub: "No mês atual", 
      icon: Users, 
      color: "border-blue-400", 
      subColor: "text-muted-foreground",
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
        <SectionContainer className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
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
        </SectionContainer>

        {/* KPI Cards */}
        <SectionContainer className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiCards.map(({ label, value, sub, icon: Icon, color, subColor }) => (
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
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionContainer>

        {/* Gráficos */}
        <SectionContainer className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* GMV vs Lucro */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">GMV vs Lucro Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={MONTHLY_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => fmtCurrency(value as number)} />
                  <Legend />
                  <Bar dataKey="GMV" fill="#3b82f6" />
                  <Bar dataKey="Lucro" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Taxa de Conversão */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tendência de Conversão (%)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={DAILY_TREND} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="conversion" stroke="#f59e0b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </SectionContainer>

        {/* Tabela de Transações */}
        <SectionContainer>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Transações por Excursão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">Excursão</th>
                      <th className="px-4 py-2 text-right font-semibold">Bruto</th>
                      <th className="px-4 py-2 text-right font-semibold">Plataforma</th>
                      <th className="px-4 py-2 text-right font-semibold">Organizador</th>
                      <th className="px-4 py-2 text-right font-semibold">Passageiros</th>
                      <th className="px-4 py-2 text-center font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((row) => (
                      <tr key={row.id} className="border-t hover:bg-muted/30">
                        <td className="px-4 py-3">{row.nome}</td>
                        <td className="px-4 py-3 text-right font-semibold text-foreground">{fmtCurrency(row.bruto)}</td>
                        <td className="px-4 py-3 text-right text-red-600">{fmtCurrency(row.plataforma)}</td>
                        <td className="px-4 py-3 text-right text-green-600 font-semibold">{fmtCurrency(row.organizador)}</td>
                        <td className="px-4 py-3 text-right">{row.passageiros}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge className={
                            row.status === "Concluída" ? "bg-green-100 text-green-800" :
                            row.status === "EM ANDAMENTO" ? "bg-blue-100 text-blue-800" :
                            "bg-amber-100 text-amber-800"
                          }>
                            {row.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </SectionContainer>
      </PageContainer>
    </AdminShell>
  );
}
