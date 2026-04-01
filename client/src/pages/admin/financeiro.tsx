import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Users,
  CreditCard,
  Receipt,
  Calculator,
  CheckCircle,
  Clock,
  AlertCircle,
  Percent,
  Building2,
  Wallet,
  BarChart3,
  Download,
  Filter
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { AdminShell, AdminCard, AdminPageHeader } from "@/components/layout-system/AdminShell";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Fornecedor {
  nome: string;
  valor: number;
  status: "Pago" | "Pendente";
}

interface PagamentoIndividual {
  id: string;
  passageiro: string;
  valor: number;
  metodo: "Pix" | "Cartão" | "Boleto";
  status: "Pago" | "Pendente" | "Atrasado";
  data: string;
  categoria: "Hotéis" | "Excursões" | "Transporte";
}

interface KPIData {
  mes: string;
  valor: number;
  tendencia: number;
}

export default function FinanceiroDashboard() {
  const [periodo, setPeriodo] = useState("30d");
  const [categoria, setCategoria] = useState("todos");
  const [simuladorQtd, setSimuladorQtd] = useState(1);

  // Dados de período
  const periodoConfig = {
    "7d": { label: "Últimos 7 dias", dias: 7 },
    "30d": { label: "Últimos 30 dias", dias: 30 },
    "90d": { label: "Últimos 90 dias", dias: 90 },
    "ytd": { label: "Ano até agora", dias: 90 },
  };

  // KPI Cards com dados históricos para mini-gráficos
  const kpiTrend: KPIData[] = [
    { mes: "Dia 1", valor: 42000, tendencia: -2 },
    { mes: "Dia 5", valor: 44500, tendencia: 3 },
    { mes: "Dia 10", valor: 41000, tendencia: -1 },
    { mes: "Dia 15", valor: 48000, tendencia: 5 },
    { mes: "Dia 20", valor: 45300, tendencia: 2 },
    { mes: "Dia 25", valor: 50000, tendencia: 8 },
    { mes: "Dia 31", valor: 52000, tendencia: 10 },
  ];

  // Dados principais
  const totalExcursao = 45000;
  const comissaoRSV = totalExcursao * 0.15;
  const repasseFornecedores = totalExcursao * 0.85;

  const fornecedores: Fornecedor[] = [
    { nome: "Hotel Termas DiRoma", valor: 18500, status: "Pago" },
    { nome: "Hot Park", valor: 12000, status: "Pago" },
    { nome: "Transporte Goiânia Tur", valor: 5800, status: "Pendente" },
    { nome: "Seguro GTA", valor: 1950, status: "Pago" },
  ];

  const descontos = [
    { min: 3, desconto: 5 },
    { min: 5, desconto: 8 },
    { min: 10, desconto: 15 },
    { min: 20, desconto: 25 },
  ];

  const pagamentos: PagamentoIndividual[] = [
    { id: "1", passageiro: "João Silva", valor: 1500, metodo: "Pix", status: "Pago", data: "2026-03-10", categoria: "Hotéis" },
    { id: "2", passageiro: "Maria Santos", valor: 1500, metodo: "Cartão", status: "Pago", data: "2026-03-11", categoria: "Excursões" },
    { id: "3", passageiro: "Pedro Costa", valor: 1500, metodo: "Boleto", status: "Pendente", data: "2026-03-12", categoria: "Hotéis" },
    { id: "4", passageiro: "Ana Oliveira", valor: 1500, metodo: "Pix", status: "Pago", data: "2026-03-13", categoria: "Transporte" },
    { id: "5", passageiro: "Carlos Mendes", valor: 1500, metodo: "Cartão", status: "Atrasado", data: "2026-03-05", categoria: "Excursões" },
    { id: "6", passageiro: "Fernanda Lima", valor: 1500, metodo: "Pix", status: "Pago", data: "2026-03-14", categoria: "Hotéis" },
    { id: "7", passageiro: "Roberto Alves", valor: 1500, metodo: "Boleto", status: "Pendente", data: "2026-03-15", categoria: "Transporte" },
    { id: "8", passageiro: "Juliana Rocha", valor: 1500, metodo: "Cartão", status: "Pago", data: "2026-03-16", categoria: "Excursões" },
  ];

  // Dados para gráficos
  const gmvMensal = [
    { mes: "Jan", gmv: 180000, lucro: 27000 },
    { mes: "Fev", gmv: 220000, lucro: 33000 },
    { mes: "Mar", gmv: 195000, lucro: 29250 },
    { mes: "Abr", gmv: 250000, lucro: 37500 },
    { mes: "Mai", gmv: 280000, lucro: 42000 },
  ];

  const conversionTrend = [
    { semana: "Sem 1", conversao: 2.3 },
    { semana: "Sem 2", conversao: 2.8 },
    { semana: "Sem 3", conversao: 2.5 },
    { semana: "Sem 4", conversao: 3.1 },
  ];

  const totalArrecadado = pagamentos.reduce((acc, p) => acc + (p.status === "Pago" ? p.valor : 0), 0);
  const mdr = totalArrecadado * 0.025;
  const iss = totalArrecadado * 0.05;
  const lucroLiquido = comissaoRSV - mdr - iss;

  const getDescontoAtual = (qtd: number) => {
    let desc = 0;
    for (const d of descontos) {
      if (qtd >= d.min) desc = d.desconto;
    }
    return desc;
  };

  const descontoAtual = getDescontoAtual(simuladorQtd);
  const valorBase = 1500;
  const valorComDesconto = valorBase * (1 - descontoAtual / 100);
  const economiaTotal = (valorBase - valorComDesconto) * simuladorQtd;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pago":
        return { bg: "bg-green-100", color: "text-green-700", icon: <CheckCircle className="w-4 h-4" /> };
      case "Pendente":
        return { bg: "bg-yellow-100", color: "text-yellow-700", icon: <Clock className="w-4 h-4" /> };
      case "Atrasado":
        return { bg: "bg-red-100", color: "text-red-700", icon: <AlertCircle className="w-4 h-4" /> };
      default:
        return { bg: "bg-slate-100", color: "text-slate-700", icon: null };
    }
  };

  // Sidebar simulada
  const AdminSidebar = () => (
    <nav className="space-y-2">
      <a href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700">
        <BarChart3 className="w-5 h-5" />
        <span className="text-sm font-medium">Dashboard</span>
      </a>
      <a href="/admin/financeiro" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-100 text-blue-700">
        <Wallet className="w-5 h-5" />
        <span className="text-sm font-medium">Financeiro</span>
      </a>
      <a href="/admin/relatorios" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700">
        <Receipt className="w-5 h-5" />
        <span className="text-sm font-medium">Relatórios</span>
      </a>
    </nav>
  );

  const AdminTopBar = () => (
    <div className="flex items-center justify-between w-full">
      <h2 className="text-slate-900 font-semibold">Centro de Comando Financeiro</h2>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4" />
          Exportar
        </Button>
      </div>
    </div>
  );

  return (
    <AdminShell
      sidebar={<AdminSidebar />}
      topBar={<AdminTopBar />}
      contentBackground="slate"
    >
      {/* Page Header */}
      <AdminPageHeader
        title="Gestão Financeira"
        description="KPIs, análises de lucro e gerenciamento de pagamentos"
      />

      {/* Filtros */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <Select value={periodo} onValueChange={setPeriodo}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="90d">Últimos 90 dias</SelectItem>
            <SelectItem value="ytd">Ano até agora</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoria} onValueChange={setCategoria}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas categorias</SelectItem>
            <SelectItem value="hoteis">Hotéis</SelectItem>
            <SelectItem value="excursoes">Excursões</SelectItem>
            <SelectItem value="transporte">Transporte</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards com Mini-gráficos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { title: "Lucro Mensal", value: "R$ 42.000", icon: DollarSign, color: "bg-blue-500", trend: "+12.5%" },
          { title: "GMV Total", value: "R$ 280.000", icon: TrendingUp, color: "bg-green-500", trend: "+8.3%" },
          { title: "Repasses", value: "R$ 238.000", icon: Wallet, color: "bg-orange-500", trend: "+5.2%" },
          { title: "Passageiros", value: "1.245", icon: Users, color: "bg-purple-500", trend: "+18.9%" },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <AdminCard key={i} className="flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-slate-600 mb-1">{kpi.title}</p>
                  <h3 className="text-xl font-bold text-slate-900">{kpi.value}</h3>
                  <p className="text-xs text-green-600 font-semibold mt-1">{kpi.trend}</p>
                </div>
                <div className={`${kpi.color} p-2 rounded-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="h-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={kpiTrend}>
                    <defs>
                      <linearGradient id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="valor" stroke="#3b82f6" fill={`url(#grad${i})`} isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </AdminCard>
          );
        })}
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* GMV vs Lucro */}
        <AdminCard title="GMV vs Lucro Mensal" noPadding>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gmvMensal}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="gmv" fill="#3b82f6" name="GMV" />
                <Bar dataKey="lucro" fill="#10b981" name="Lucro" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>

        {/* Taxa de Conversão */}
        <AdminCard title="Tendência de Conversão (%)" noPadding>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={conversionTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semana" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="conversao" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
      </div>

      {/* Split de Pagamento */}
      <AdminCard title="Split de Pagamento e Comissões" className="mb-6">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-40 bg-slate-50 p-4 rounded-lg">
              <p className="text-xs text-slate-600 mb-1">Valor Total</p>
              <p className="text-2xl font-bold text-slate-900">R$ {totalExcursao.toLocaleString("pt-BR")}</p>
            </div>
            <div className="flex-1 min-w-40 bg-blue-50 p-4 rounded-lg">
              <p className="text-xs text-slate-600 mb-1">Comissão RSV (15%)</p>
              <p className="text-2xl font-bold text-blue-600">R$ {comissaoRSV.toLocaleString("pt-BR")}</p>
            </div>
            <div className="flex-1 min-w-40 bg-green-50 p-4 rounded-lg">
              <p className="text-xs text-slate-600 mb-1">Repasse Fornecedores (85%)</p>
              <p className="text-2xl font-bold text-green-600">R$ {repasseFornecedores.toLocaleString("pt-BR")}</p>
            </div>
          </div>
          <div className="w-full h-8 bg-slate-200 rounded-full overflow-hidden flex">
            <div className="w-[15%] bg-blue-600 flex items-center justify-center text-xs font-bold text-white">15%</div>
            <div className="w-[85%] bg-green-600 flex items-center justify-center text-xs font-bold text-white">85%</div>
          </div>
        </div>
      </AdminCard>

      {/* Tabela de Transações */}
      <AdminCard title="Transações Recentes" noPadding className="mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Passageiro</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Valor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Categoria</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Data</th>
              </tr>
            </thead>
            <tbody>
              {pagamentos.map((p) => {
                const badge = getStatusBadge(p.status);
                return (
                  <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-900">{p.passageiro}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900">R$ {p.valor.toLocaleString("pt-BR")}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{p.categoria}</td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-2 ${badge.color} ${badge.bg} px-2 py-1 rounded text-xs font-semibold w-fit`}>
                        {badge.icon}
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{p.data}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </AdminCard>

      {/* Descontos Progressivos e Simulador */}
      <AdminCard title="Descontos Progressivos" noPadding>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {descontos.map((d, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg text-center ${
                  simuladorQtd >= d.min ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                <p className="text-2xl font-bold">{d.desconto}%</p>
                <p className="text-xs mt-1">{d.min}+ pessoas</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-slate-900">Simulador de Desconto</h4>
            </div>
            <div className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="text-xs text-slate-600 block mb-2">Quantidade de pessoas</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={simuladorQtd}
                  onChange={(e) => setSimuladorQtd(Math.max(1, parseInt(e.target.value) || 1))}
                  className="border border-slate-300 rounded px-3 py-2 w-24 font-semibold"
                />
              </div>
              <div className="text-2xl text-slate-400">→</div>
              <div className="bg-white border border-slate-300 rounded px-3 py-2 text-center">
                <p className="text-xs text-slate-600">Desconto</p>
                <p className="text-lg font-bold text-orange-600">{descontoAtual}%</p>
              </div>
              <div className="bg-white border border-slate-300 rounded px-3 py-2 text-center">
                <p className="text-xs text-slate-600">Valor p/ pessoa</p>
                <p className="text-lg font-bold text-slate-900">R$ {valorComDesconto.toLocaleString("pt-BR")}</p>
              </div>
              <div className="bg-white border border-slate-300 rounded px-3 py-2 text-center">
                <p className="text-xs text-slate-600">Economia total</p>
                <p className="text-lg font-bold text-green-600">R$ {economiaTotal.toLocaleString("pt-BR")}</p>
              </div>
            </div>
          </div>
        </div>
      </AdminCard>
    </AdminShell>
  );
}
