/**
 * =============================================================================
 * Pagina Financeiro - Admin
 * =============================================================================
 * Migrada para usar AdminShell e componentes do design system.
 * =============================================================================
 */

import { useState } from 'react';
import { AdminShell, AdminPageHeader, AdminCard } from '@/components/layout-system';
import { AdminSidebar, AdminTopBar, AdminLogo } from '@/components/admin';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DollarSign,
  Wallet,
  CreditCard,
  Receipt,
  Calculator,
  Percent,
  Building2,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Fornecedor {
  nome: string;
  valor: number;
  status: 'Pago' | 'Pendente';
}

interface PagamentoIndividual {
  id: string;
  passageiro: string;
  valor: number;
  metodo: 'Pix' | 'Cartao' | 'Boleto';
  status: 'Pago' | 'Pendente' | 'Atrasado';
  data: string;
}

export default function Financeiro() {
  const [simuladorQtd, setSimuladorQtd] = useState(1);

  const totalExcursao = 45000;
  const comissaoRSV = totalExcursao * 0.15;
  const repasseFornecedores = totalExcursao * 0.85;

  const fornecedores: Fornecedor[] = [
    { nome: 'Hotel Termas DiRoma', valor: 18500, status: 'Pago' },
    { nome: 'Hot Park', valor: 12000, status: 'Pago' },
    { nome: 'Transporte Goiania Tur', valor: 5800, status: 'Pendente' },
    { nome: 'Seguro GTA', valor: 1950, status: 'Pago' },
  ];

  const descontos = [
    { min: 3, desconto: 5 },
    { min: 5, desconto: 8 },
    { min: 10, desconto: 15 },
    { min: 20, desconto: 25 },
  ];

  const pagamentos: PagamentoIndividual[] = [
    { id: '1', passageiro: 'Joao Silva', valor: 1500, metodo: 'Pix', status: 'Pago', data: '2026-03-10' },
    { id: '2', passageiro: 'Maria Santos', valor: 1500, metodo: 'Cartao', status: 'Pago', data: '2026-03-11' },
    { id: '3', passageiro: 'Pedro Costa', valor: 1500, metodo: 'Boleto', status: 'Pendente', data: '2026-03-12' },
    { id: '4', passageiro: 'Ana Oliveira', valor: 1500, metodo: 'Pix', status: 'Pago', data: '2026-03-13' },
    { id: '5', passageiro: 'Carlos Mendes', valor: 1500, metodo: 'Cartao', status: 'Atrasado', data: '2026-03-05' },
    { id: '6', passageiro: 'Fernanda Lima', valor: 1500, metodo: 'Pix', status: 'Pago', data: '2026-03-14' },
    { id: '7', passageiro: 'Roberto Alves', valor: 1500, metodo: 'Boleto', status: 'Pendente', data: '2026-03-15' },
    { id: '8', passageiro: 'Juliana Rocha', valor: 1500, metodo: 'Cartao', status: 'Pago', data: '2026-03-16' },
  ];

  const totalArrecadado = pagamentos.reduce((acc, p) => acc + (p.status === 'Pago' ? p.valor : 0), 0);
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

  const statusMap: Record<string, { status: 'success' | 'warning' | 'error'; label: string }> = {
    Pago: { status: 'success', label: 'Pago' },
    Pendente: { status: 'warning', label: 'Pendente' },
    Atrasado: { status: 'error', label: 'Atrasado' },
  };

  return (
    <AdminShell
      sidebar={<AdminSidebar />}
      topBar={<AdminTopBar userName="Admin" notificationCount={2} />}
      logo={<AdminLogo />}
    >
      <AdminPageHeader
        title="Split de Pagamento e Estrutura Fiscal"
        description="Modulo 5 - Gestao financeira, splits e descontos progressivos"
      />

      {/* Split de Pagamento */}
      <AdminCard
        title="Split de Pagamento"
        headerActions={<Wallet className="w-5 h-5 text-blue-600" />}
        className="mb-6"
      >
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="bg-slate-900 text-white px-6 py-4 rounded-xl text-center min-w-[160px]">
            <p className="text-xs opacity-80 mb-1">Valor Total</p>
            <p className="text-2xl font-bold">R$ {totalExcursao.toLocaleString('pt-BR')}</p>
          </div>
          <span className="text-2xl text-slate-300">-&gt;</span>
          <div className="bg-blue-600 text-white px-6 py-4 rounded-xl text-center min-w-[160px]">
            <p className="text-xs opacity-80 mb-1">Comissao RSV (15%)</p>
            <p className="text-2xl font-bold">R$ {comissaoRSV.toLocaleString('pt-BR')}</p>
          </div>
          <span className="text-2xl text-slate-300">-&gt;</span>
          <div className="bg-green-600 text-white px-6 py-4 rounded-xl text-center min-w-[160px]">
            <p className="text-xs opacity-80 mb-1">Fornecedores (85%)</p>
            <p className="text-2xl font-bold">R$ {repasseFornecedores.toLocaleString('pt-BR')}</p>
          </div>
        </div>

        <div className="h-8 rounded-full overflow-hidden flex mb-6">
          <div className="w-[15%] bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
            15%
          </div>
          <div className="w-[85%] bg-green-600 flex items-center justify-center text-white text-xs font-semibold">
            85%
          </div>
        </div>

        <h4 className="text-sm font-semibold text-slate-700 mb-3">Fornecedores</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {fornecedores.map((f, i) => {
            const statusInfo = statusMap[f.status] || statusMap.Pendente;
            return (
              <div
                key={i}
                className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{f.nome}</p>
                  <p className="text-slate-500 text-sm">R$ {f.valor.toLocaleString('pt-BR')}</p>
                </div>
                <StatusBadge
                  status={statusInfo.status}
                  label={statusInfo.label}
                  size="sm"
                />
              </div>
            );
          })}
        </div>
      </AdminCard>

      {/* Descontos Progressivos */}
      <AdminCard
        title="Descontos Progressivos"
        headerActions={<Percent className="w-5 h-5 text-orange-600" />}
        className="mb-6"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {descontos.map((d, i) => (
            <div
              key={i}
              className={cn(
                'rounded-xl p-5 text-center transition-all border-2',
                simuladorQtd >= d.min
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              )}
            >
              <p className="text-3xl font-extrabold">{d.desconto}%</p>
              <p className="text-sm mt-1 opacity-80">{d.min}+ pessoas</p>
            </div>
          ))}
        </div>

        <div className="bg-sky-50 border border-sky-200 rounded-xl p-6">
          <h4 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            Simulador de Desconto
          </h4>
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <Label htmlFor="qtd" className="text-sm text-slate-600 mb-1.5 block">
                Quantidade de pessoas
              </Label>
              <Input
                id="qtd"
                type="number"
                min={1}
                max={100}
                value={simuladorQtd}
                onChange={(e) => setSimuladorQtd(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-28"
              />
            </div>
            <span className="text-2xl text-slate-300">-&gt;</span>
            <div className="flex gap-3">
              <div className="bg-white rounded-lg px-5 py-3 border text-center">
                <p className="text-xs text-slate-500">Desconto</p>
                <p className="text-xl font-bold text-orange-600">{descontoAtual}%</p>
              </div>
              <div className="bg-white rounded-lg px-5 py-3 border text-center">
                <p className="text-xs text-slate-500">Valor p/ pessoa</p>
                <p className="text-xl font-bold text-slate-900">
                  R$ {valorComDesconto.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="bg-white rounded-lg px-5 py-3 border text-center">
                <p className="text-xs text-slate-500">Economia total</p>
                <p className="text-xl font-bold text-green-600">
                  R$ {economiaTotal.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </AdminCard>

      {/* Pagamentos Individuais */}
      <AdminCard
        title="Pagamentos Individuais"
        headerActions={<CreditCard className="w-5 h-5 text-blue-600" />}
        noPadding
        className="mb-6"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Passageiro</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Metodo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagamentos.map((p) => {
              const statusInfo = statusMap[p.status] || statusMap.Pendente;
              return (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.passageiro}</TableCell>
                  <TableCell className="font-semibold">
                    R$ {p.valor.toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded text-xs font-medium">
                      {p.metodo === 'Pix' && <Wallet className="w-3 h-3" />}
                      {p.metodo === 'Cartao' && <CreditCard className="w-3 h-3" />}
                      {p.metodo === 'Boleto' && <Receipt className="w-3 h-3" />}
                      {p.metodo}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={statusInfo.status}
                      label={statusInfo.label}
                      size="sm"
                    />
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {new Date(p.data).toLocaleDateString('pt-BR')}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </AdminCard>

      {/* Resumo Fiscal */}
      <AdminCard
        title="Estrutura Fiscal"
        headerActions={<Building2 className="w-5 h-5 text-violet-600" />}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500 mb-1">Total Arrecadado</p>
            <p className="text-xl font-bold text-green-700">
              R$ {totalArrecadado.toLocaleString('pt-BR')}
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500 mb-1">MDR (2.5%)</p>
            <p className="text-xl font-bold text-amber-700">
              R$ {mdr.toLocaleString('pt-BR')}
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500 mb-1">ISS (5%)</p>
            <p className="text-xl font-bold text-red-700">
              R$ {iss.toLocaleString('pt-BR')}
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500 mb-1">Lucro Liquido</p>
            <p className="text-xl font-bold text-blue-700">
              R$ {lucroLiquido.toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
      </AdminCard>
    </AdminShell>
  );
}
