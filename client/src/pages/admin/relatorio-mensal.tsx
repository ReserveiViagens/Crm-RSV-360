/**
 * =============================================================================
 * Pagina Relatorio Mensal - Admin
 * =============================================================================
 * Migrada para usar AdminShell e componentes do design system.
 * =============================================================================
 */

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import { AdminShell, AdminPageHeader, AdminCard } from '@/components/layout-system';
import { AdminSidebar, AdminTopBar, AdminLogo } from '@/components/admin';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart3,
  Download,
  DollarSign,
  Calendar,
  Users,
  TrendingUp,
  FileText,
} from 'lucide-react';

interface ReservaRelatorio {
  id: string;
  cliente: string;
  destino: string;
  valor: number;
  data: string;
  status: 'confirmada' | 'pendente' | 'cancelada';
}

const meses = [
  'Janeiro',
  'Fevereiro',
  'Marco',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const gerarDados = (mes: number, ano: number) => {
  const seed = mes + ano * 12;
  const base = 80000 + (seed % 7) * 15000;
  const semanas = [
    { semana: 'Sem 1', receita: Math.round(base * 0.22 + (seed % 5) * 1000) },
    { semana: 'Sem 2', receita: Math.round(base * 0.28 + (seed % 3) * 2000) },
    { semana: 'Sem 3', receita: Math.round(base * 0.26 + (seed % 4) * 1500) },
    { semana: 'Sem 4', receita: Math.round(base * 0.24 + (seed % 6) * 800) },
  ];
  const totalReceita = semanas.reduce((s, w) => s + w.receita, 0);
  const numReservas = 30 + (seed % 20);
  const novosClientes = 8 + (seed % 12);
  const ticketMedio = Math.round(totalReceita / numReservas);

  const reservas: ReservaRelatorio[] = Array.from(
    { length: Math.min(numReservas, 12) },
    (_, i) => {
      const statuses: ReservaRelatorio['status'][] = [
        'confirmada',
        'confirmada',
        'confirmada',
        'pendente',
        'cancelada',
      ];
      const destinos = [
        'Caldas Novas - GO',
        'Rio Quente - GO',
        'Porto de Galinhas - PE',
        'Gramado - RS',
        'Bonito - MS',
      ];
      const nomes = [
        'Joao Silva',
        'Maria Santos',
        'Pedro Costa',
        'Ana Oliveira',
        'Carlos Mendes',
        'Fernanda Lima',
        'Ricardo Souza',
        'Juliana Pereira',
        'Roberto Alves',
        'Camila Rocha',
        'Lucas Martins',
        'Beatriz Nunes',
      ];
      const dia = String(Math.min(28, i + 1 + (seed % 5))).padStart(2, '0');
      const mesStr = String(mes + 1).padStart(2, '0');
      return {
        id: `R-${ano}${mesStr}${String(i + 1).padStart(3, '0')}`,
        cliente: nomes[i % nomes.length],
        destino: destinos[i % destinos.length],
        valor: 800 + ((seed + i) % 10) * 200,
        data: `${ano}-${mesStr}-${dia}`,
        status: statuses[i % statuses.length],
      };
    }
  );

  return { semanas, totalReceita, numReservas, novosClientes, ticketMedio, reservas };
};

const statusMap: Record<string, { status: 'success' | 'warning' | 'error'; label: string }> = {
  confirmada: { status: 'success', label: 'Confirmada' },
  pendente: { status: 'warning', label: 'Pendente' },
  cancelada: { status: 'error', label: 'Cancelada' },
};

export default function RelatorioMensalPage() {
  const { toast } = useToast();
  const hoje = new Date();
  const [mes, setMes] = useState(hoje.getMonth());
  const [ano, setAno] = useState(hoje.getFullYear());

  const dados = gerarDados(mes, ano);

  const handleExportCSV = () => {
    const header = 'ID,Cliente,Destino,Valor,Data,Status\n';
    const rows = dados.reservas
      .map((r) => `${r.id},${r.cliente},${r.destino},${r.valor},${r.data},${r.status}`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio_${meses[mes].toLowerCase()}_${ano}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast({
      title: 'CSV exportado!',
      description: `Relatorio de ${meses[mes]} ${ano} baixado.`,
    });
  };

  const kpis = [
    {
      label: 'Receita Total',
      value: `R$ ${dados.totalReceita.toLocaleString('pt-BR')}`,
      icon: <DollarSign className="w-6 h-6 text-green-600" />,
      bg: 'bg-green-100',
    },
    {
      label: 'N de Reservas',
      value: String(dados.numReservas),
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      bg: 'bg-blue-100',
    },
    {
      label: 'Ticket Medio',
      value: `R$ ${dados.ticketMedio.toLocaleString('pt-BR')}`,
      icon: <TrendingUp className="w-6 h-6 text-orange-600" />,
      bg: 'bg-amber-100',
    },
    {
      label: 'Novos Clientes',
      value: String(dados.novosClientes),
      icon: <Users className="w-6 h-6 text-violet-600" />,
      bg: 'bg-violet-100',
    },
  ];

  return (
    <AdminShell
      sidebar={<AdminSidebar />}
      topBar={<AdminTopBar userName="Admin" />}
      logo={<AdminLogo />}
    >
      <AdminPageHeader
        title="Relatorio Mensal"
        description="Relatorio de vendas e desempenho"
        actions={
          <Button onClick={handleExportCSV} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
        }
      />

      {/* Filtros de Periodo */}
      <AdminCard className="mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Periodo:</span>
          </div>
          <Select value={String(mes)} onValueChange={(v) => setMes(Number(v))}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {meses.map((m, i) => (
                <SelectItem key={i} value={String(i)}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(ano)} onValueChange={(v) => setAno(Number(v))}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[2024, 2025, 2026].map((a) => (
                <SelectItem key={a} value={String(a)}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </AdminCard>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi, i) => (
          <AdminCard key={i}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${kpi.bg}`}>{kpi.icon}</div>
              <div>
                <p className="text-xs text-slate-500">{kpi.label}</p>
                <p className="text-xl font-bold text-slate-900">{kpi.value}</p>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>

      {/* Grafico */}
      <AdminCard
        title={`Receita por Semana - ${meses[mes]} ${ano}`}
        className="mb-6"
      >
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dados.semanas}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="semana" tick={{ fill: '#6B7280', fontSize: 12 }} />
              <YAxis
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
              />
              <RechartsTooltip
                formatter={(value: number) => [
                  `R$ ${value.toLocaleString('pt-BR')}`,
                  'Receita',
                ]}
              />
              <Bar dataKey="receita" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </AdminCard>

      {/* Tabela de Reservas */}
      <AdminCard
        title="Reservas do Periodo"
        headerActions={
          <span className="text-sm text-slate-500">{dados.reservas.length} reservas</span>
        }
        noPadding
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Codigo</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="hidden sm:table-cell">Destino</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead className="hidden md:table-cell">Data</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dados.reservas.map((r) => {
              const statusInfo = statusMap[r.status] || statusMap.pendente;
              return (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-sm">{r.id}</TableCell>
                  <TableCell className="font-medium">{r.cliente}</TableCell>
                  <TableCell className="hidden sm:table-cell text-slate-600">
                    {r.destino}
                  </TableCell>
                  <TableCell className="font-semibold">
                    R$ {r.valor.toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-slate-500">
                    {new Date(r.data).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={statusInfo.status} label={statusInfo.label} size="sm" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </AdminCard>
    </AdminShell>
  );
}
