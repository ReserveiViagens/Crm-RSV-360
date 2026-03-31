/**
 * =============================================================================
 * Pagina Contratos - Admin
 * =============================================================================
 * Migrada para usar AdminShell e componentes do design system.
 * =============================================================================
 */

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AdminShell, AdminPageHeader, AdminCard } from '@/components/layout-system';
import { AdminSidebar, AdminTopBar, AdminLogo } from '@/components/admin';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  FileText,
  Plus,
  Eye,
  Send,
  ChevronDown,
  AlertTriangle,
  Shield,
  Heart,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Contrato {
  id: string;
  passageiro: string;
  excursao: string;
  tipo: 'contrato' | 'termo' | 'autorizacao_menor';
  data: string;
  status: 'assinado' | 'pendente' | 'expirado';
  valor: number;
}

const mockContratos: Contrato[] = [
  { id: 'CTR-001', passageiro: 'Joao Silva', excursao: 'Caldas Novas - Agosto/2026', tipo: 'contrato', data: '2026-07-15', status: 'assinado', valor: 1500 },
  { id: 'CTR-002', passageiro: 'Maria Santos', excursao: 'Caldas Novas - Agosto/2026', tipo: 'contrato', data: '2026-07-16', status: 'assinado', valor: 1500 },
  { id: 'CTR-003', passageiro: 'Pedro Costa', excursao: 'Porto de Galinhas - Set/2026', tipo: 'contrato', data: '2026-08-01', status: 'pendente', valor: 2200 },
  { id: 'CTR-004', passageiro: 'Ana Oliveira', excursao: 'Caldas Novas - Agosto/2026', tipo: 'termo', data: '2026-07-15', status: 'assinado', valor: 1500 },
  { id: 'CTR-005', passageiro: 'Lucas Mendes (menor)', excursao: 'Caldas Novas - Agosto/2026', tipo: 'autorizacao_menor', data: '2026-07-17', status: 'pendente', valor: 1200 },
  { id: 'CTR-006', passageiro: 'Carlos Ferreira', excursao: 'Gramado - Out/2026', tipo: 'contrato', data: '2026-09-10', status: 'expirado', valor: 1800 },
  { id: 'CTR-007', passageiro: 'Fernanda Lima', excursao: 'Porto de Galinhas - Set/2026', tipo: 'termo', data: '2026-08-05', status: 'assinado', valor: 2200 },
  { id: 'CTR-008', passageiro: 'Beatriz Souza (menor)', excursao: 'Gramado - Out/2026', tipo: 'autorizacao_menor', data: '2026-09-12', status: 'assinado', valor: 900 },
];

const tiposLabel: Record<string, string> = {
  contrato: 'Contrato de Servicos Turisticos',
  termo: 'Termo de Responsabilidade',
  autorizacao_menor: 'Autorizacao para Menores',
};

const statusMap: Record<string, { status: 'success' | 'warning' | 'error'; label: string }> = {
  assinado: { status: 'success', label: 'Assinado' },
  pendente: { status: 'warning', label: 'Pendente' },
  expirado: { status: 'error', label: 'Expirado' },
};

const clausulas = [
  {
    id: 'cancelamento',
    titulo: 'Cancelamento e Reembolso',
    icone: <AlertTriangle className="w-5 h-5 text-orange-600" />,
    conteudo: 'Ate 30 dias antes: devolucao integral com retencao de 10% para custos administrativos. De 29 a 8 dias antes: multa de 30% sobre o valor total. Menos de 7 dias antes: sem devolucao, sendo possivel indicar substituto mediante taxa de R$ 50,00 para atualizacao cadastral.',
  },
  {
    id: 'responsabilidade',
    titulo: 'Responsabilidade Civil',
    icone: <Shield className="w-5 h-5 text-blue-600" />,
    conteudo: 'A RSV Turismo nao se responsabiliza por atos de terceiros, casos fortuitos ou de forca maior, incluindo mas nao limitado a: condicoes climaticas adversas, greves, pandemias, cancelamentos por parte de fornecedores. O passageiro assume total responsabilidade por seus pertences pessoais e por seu comportamento durante a viagem.',
  },
  {
    id: 'seguro',
    titulo: 'Seguro de Viagem',
    icone: <Heart className="w-5 h-5 text-green-600" />,
    conteudo: 'Todas as excursoes incluem seguro de viagem GTA/Universal Assistance, com cobertura de assistencia medica de ate R$ 30.000, repatriamento sanitario e cobertura de bagagem de ate R$ 2.000. A apolice sera emitida em nome do passageiro ate 48h antes do embarque.',
  },
];

export default function ContratosExcursao() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [expandedClause, setExpandedClause] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    tipo: 'contrato',
    nomePassageiro: '',
    cpfPassageiro: '',
    excursao: '',
    valor: '',
    formaPagamento: 'pix',
    nomeMenor: '',
    cpfMenor: '',
    dataNascimentoMenor: '',
    nomeResponsavel: '',
  });

  const totalContratos = mockContratos.length;
  const assinados = mockContratos.filter((c) => c.status === 'assinado').length;
  const pendentes = mockContratos.filter((c) => c.status === 'pendente').length;
  const expirados = mockContratos.filter((c) => c.status === 'expirado').length;

  const handleEnviarAssinatura = () => {
    toast({
      title: 'Contrato enviado!',
      description: 'Contrato enviado via SuperSign para assinatura digital.',
    });
    setShowPreview(false);
    setShowForm(false);
    setFormData({
      tipo: 'contrato',
      nomePassageiro: '',
      cpfPassageiro: '',
      excursao: '',
      valor: '',
      formaPagamento: 'pix',
      nomeMenor: '',
      cpfMenor: '',
      dataNascimentoMenor: '',
      nomeResponsavel: '',
    });
  };

  const handleVerContrato = (contrato: Contrato) => {
    toast({
      title: 'Abrindo contrato...',
      description: `Visualizando ${tiposLabel[contrato.tipo]} de ${contrato.passageiro}`,
    });
  };

  const metrics = [
    { label: 'Total Contratos', value: totalContratos, color: 'text-blue-600' },
    { label: 'Assinados', value: assinados, color: 'text-green-600' },
    { label: 'Pendentes', value: pendentes, color: 'text-orange-600' },
    { label: 'Expirados', value: expirados, color: 'text-red-600' },
  ];

  return (
    <AdminShell
      sidebar={<AdminSidebar />}
      topBar={<AdminTopBar userName="Admin" notificationCount={pendentes} />}
      logo={<AdminLogo />}
    >
      <AdminPageHeader
        title="Contratos de Excursao"
        description="Gestao de contratos, termos e autorizacoes"
        actions={
          <Button onClick={() => setShowForm(true)} className="gap-2 bg-orange-600 hover:bg-orange-700">
            <Plus className="w-4 h-4" />
            Gerar Novo Contrato
          </Button>
        }
      />

      {/* Metricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {metrics.map((m) => (
          <AdminCard key={m.label} className="text-center">
            <p className="text-sm text-slate-500">{m.label}</p>
            <p className={cn('text-3xl font-bold mt-1', m.color)}>{m.value}</p>
          </AdminCard>
        ))}
      </div>

      {/* Clausulas */}
      <AdminCard title="Clausulas Padrao" className="mb-6">
        <div className="space-y-3">
          {clausulas.map((c) => (
            <Collapsible
              key={c.id}
              open={expandedClause === c.id}
              onOpenChange={(open) => setExpandedClause(open ? c.id : null)}
            >
              <CollapsibleTrigger asChild>
                <button className="flex items-center justify-between w-full p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-left">
                  <div className="flex items-center gap-3">
                    {c.icone}
                    <span className="font-semibold text-slate-900">{c.titulo}</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      'w-5 h-5 text-slate-400 transition-transform',
                      expandedClause === c.id && 'rotate-180'
                    )}
                  />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 py-3 text-sm text-slate-600 leading-relaxed">
                {c.conteudo}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </AdminCard>

      {/* Tabela de Contratos */}
      <AdminCard title="Contratos Gerados" noPadding>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Codigo</TableHead>
              <TableHead>Passageiro</TableHead>
              <TableHead className="hidden md:table-cell">Excursao</TableHead>
              <TableHead className="hidden sm:table-cell">Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Valor</TableHead>
              <TableHead>Acoes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockContratos.map((c) => {
              const statusInfo = statusMap[c.status] || statusMap.pendente;
              return (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-sm">{c.id}</TableCell>
                  <TableCell className="font-medium">{c.passageiro}</TableCell>
                  <TableCell className="hidden md:table-cell text-slate-600">{c.excursao}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                      {c.tipo === 'contrato' ? 'Contrato' : c.tipo === 'termo' ? 'Termo' : 'Aut. Menor'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={statusInfo.status} label={statusInfo.label} size="sm" />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell font-semibold">
                    R$ {c.valor.toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerContrato(c)}
                      className="gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </AdminCard>

      {/* Dialog - Novo Contrato */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {showPreview ? 'Preview do Contrato' : 'Gerar Novo Contrato'}
            </DialogTitle>
          </DialogHeader>

          {!showPreview ? (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Documento</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contrato">Contrato de Servicos</SelectItem>
                      <SelectItem value="termo">Termo de Responsabilidade</SelectItem>
                      <SelectItem value="autorizacao_menor">Autorizacao para Menores</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Excursao</Label>
                  <Select
                    value={formData.excursao}
                    onValueChange={(value) => setFormData({ ...formData, excursao: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Caldas Novas - Agosto/2026">Caldas Novas - Agosto/2026</SelectItem>
                      <SelectItem value="Porto de Galinhas - Set/2026">Porto de Galinhas - Set/2026</SelectItem>
                      <SelectItem value="Gramado - Out/2026">Gramado - Out/2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome do Passageiro</Label>
                  <Input
                    value={formData.nomePassageiro}
                    onChange={(e) => setFormData({ ...formData, nomePassageiro: e.target.value })}
                    placeholder="Nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label>CPF</Label>
                  <Input
                    value={formData.cpfPassageiro}
                    onChange={(e) => setFormData({ ...formData, cpfPassageiro: e.target.value })}
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Valor (R$)</Label>
                  <Input
                    type="number"
                    value={formData.valor}
                    onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                    placeholder="0,00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Forma de Pagamento</Label>
                  <Select
                    value={formData.formaPagamento}
                    onValueChange={(value) => setFormData({ ...formData, formaPagamento: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pix">Pix</SelectItem>
                      <SelectItem value="cartao">Cartao de Credito</SelectItem>
                      <SelectItem value="boleto">Boleto Bancario</SelectItem>
                      <SelectItem value="parcelado">Parcelado (ate 12x)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.tipo === 'autorizacao_menor' && (
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div className="space-y-2">
                    <Label>Nome do Menor</Label>
                    <Input
                      value={formData.nomeMenor}
                      onChange={(e) => setFormData({ ...formData, nomeMenor: e.target.value })}
                      placeholder="Nome completo do menor"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nome do Responsavel</Label>
                    <Input
                      value={formData.nomeResponsavel}
                      onChange={(e) => setFormData({ ...formData, nomeResponsavel: e.target.value })}
                      placeholder="Nome do responsavel legal"
                    />
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setShowPreview(true)} className="gap-2">
                  <Eye className="w-4 h-4" />
                  Visualizar
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="py-4">
              <div className="bg-slate-50 border rounded-lg p-6 font-serif max-h-[400px] overflow-y-auto">
                <div className="text-center border-b-2 border-slate-900 pb-4 mb-4">
                  <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
                    RSV Turismo
                  </h2>
                  <p className="text-xs text-slate-500">
                    CNPJ: 00.000.000/0001-00 | Cadastur: 00.000000.00.0000-0
                  </p>
                  <h3 className="text-base font-bold text-slate-700 mt-3">
                    {tiposLabel[formData.tipo]}
                  </h3>
                </div>
                <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                  <p>
                    Pelo presente instrumento,{' '}
                    <strong>{formData.nomePassageiro || '[NOME DO PASSAGEIRO]'}</strong>,
                    CPF <strong>{formData.cpfPassageiro || '[CPF]'}</strong>, doravante denominado(a)
                    CONTRATANTE, e RSV TURISMO, CNPJ 00.000.000/0001-00, doravante denominada
                    CONTRATADA, firmam o presente {tiposLabel[formData.tipo].toLowerCase()} para a
                    excursao <strong>{formData.excursao || '[EXCURSAO]'}</strong>.
                  </p>
                  <p>
                    <strong>CLAUSULA 1a - DO VALOR:</strong> O valor total do pacote e de{' '}
                    <strong>
                      R${' '}
                      {formData.valor
                        ? Number(formData.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                        : '[VALOR]'}
                    </strong>
                    , a ser pago via <strong>{formData.formaPagamento}</strong>.
                  </p>
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Editar
                </Button>
                <Button onClick={handleEnviarAssinatura} className="gap-2">
                  <Send className="w-4 h-4" />
                  Enviar para Assinatura
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
