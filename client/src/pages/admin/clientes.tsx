/**
 * =============================================================================
 * Pagina de Clientes - Admin
 * =============================================================================
 * Migrada para usar AdminShell e componentes do design system.
 * =============================================================================
 */

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AdminShell, AdminPageHeader, AdminCard } from '@/components/layout-system';
import { AdminSidebar, AdminTopBar, AdminLogo } from '@/components/admin';
import { SearchBar } from '@/components/ui/search-bar';
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
  Users,
  Plus,
  Eye,
  Phone,
  Mail,
  FileText,
  Calendar,
  Loader2,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  nascimento: string;
  status: 'ativo' | 'lead' | 'inativo';
  reservas: number;
  ultimaReserva: string;
}

const mockClientes: Cliente[] = [
  { id: '1', nome: 'Joao Silva', email: 'joao@email.com', telefone: '(62) 99999-1234', cpf: '123.456.789-00', nascimento: '1985-03-15', status: 'ativo', reservas: 5, ultimaReserva: '2026-02-20' },
  { id: '2', nome: 'Maria Santos', email: 'maria@email.com', telefone: '(62) 99999-5678', cpf: '234.567.890-11', nascimento: '1990-07-22', status: 'ativo', reservas: 3, ultimaReserva: '2026-03-01' },
  { id: '3', nome: 'Pedro Costa', email: 'pedro@email.com', telefone: '(34) 99999-9012', cpf: '345.678.901-22', nascimento: '1978-11-08', status: 'lead', reservas: 0, ultimaReserva: '-' },
  { id: '4', nome: 'Ana Oliveira', email: 'ana@email.com', telefone: '(11) 99999-3456', cpf: '456.789.012-33', nascimento: '1992-01-30', status: 'ativo', reservas: 8, ultimaReserva: '2026-03-10' },
  { id: '5', nome: 'Carlos Mendes', email: 'carlos@email.com', telefone: '(61) 99999-7890', cpf: '567.890.123-44', nascimento: '1988-06-14', status: 'inativo', reservas: 1, ultimaReserva: '2025-08-05' },
  { id: '6', nome: 'Fernanda Lima', email: 'fernanda@email.com', telefone: '(21) 99999-2345', cpf: '678.901.234-55', nascimento: '1995-09-25', status: 'ativo', reservas: 4, ultimaReserva: '2026-02-28' },
  { id: '7', nome: 'Ricardo Souza', email: 'ricardo@email.com', telefone: '(62) 99999-6789', cpf: '789.012.345-66', nascimento: '1983-04-12', status: 'lead', reservas: 0, ultimaReserva: '-' },
  { id: '8', nome: 'Juliana Pereira', email: 'juliana@email.com', telefone: '(62) 99999-0123', cpf: '890.123.456-77', nascimento: '1991-12-03', status: 'ativo', reservas: 2, ultimaReserva: '2026-01-15' },
];

const PAGE_SIZE = 6;

const statusMap: Record<string, { status: 'success' | 'warning' | 'pending'; label: string }> = {
  ativo: { status: 'success', label: 'Ativo' },
  lead: { status: 'warning', label: 'Lead' },
  inativo: { status: 'pending', label: 'Inativo' },
};

export default function ClientesPage() {
  const { toast } = useToast();
  const [clientes, setClientes] = useState<Cliente[]>(mockClientes);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [pagina, setPagina] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detalheId, setDetalheId] = useState<string | null>(null);

  const [novoCliente, setNovoCliente] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    nascimento: '',
  });

  const filtrados = clientes.filter((c) => {
    const matchBusca =
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.cpf.includes(busca) ||
      c.email.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === 'todos' || c.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  const totalPaginas = Math.ceil(filtrados.length / PAGE_SIZE);
  const paginados = filtrados.slice(pagina * PAGE_SIZE, (pagina + 1) * PAGE_SIZE);

  const handleNovoCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoCliente.nome || !novoCliente.email || !novoCliente.telefone) {
      toast({
        title: 'Campos obrigatorios',
        description: 'Preencha nome, e-mail e telefone.',
        variant: 'destructive',
      });
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    const novo: Cliente = {
      id: String(clientes.length + 1),
      ...novoCliente,
      status: 'lead',
      reservas: 0,
      ultimaReserva: '-',
    };
    setClientes([novo, ...clientes]);
    setNovoCliente({ nome: '', email: '', telefone: '', cpf: '', nascimento: '' });
    setShowForm(false);
    setIsSubmitting(false);
    setPagina(0);
    toast({
      title: 'Cliente cadastrado!',
      description: `${novo.nome} adicionado com sucesso.`,
    });
  };

  const detalhe = detalheId ? clientes.find((c) => c.id === detalheId) : null;

  return (
    <AdminShell
      sidebar={<AdminSidebar />}
      topBar={<AdminTopBar userName="Admin" notificationCount={3} />}
      logo={<AdminLogo />}
    >
      <AdminPageHeader
        title="Clientes"
        description="Cadastro e gerenciamento de clientes"
        actions={
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Novo Cliente
          </Button>
        }
      />

      {/* Filtros */}
      <AdminCard className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={busca}
              onChange={(value) => {
                setBusca(value);
                setPagina(0);
              }}
              placeholder="Buscar por nome, CPF ou e-mail..."
              variant="elevated"
            />
          </div>
          <Select
            value={filtroStatus}
            onValueChange={(value) => {
              setFiltroStatus(value);
              setPagina(0);
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </AdminCard>

      {/* Tabela de Clientes */}
      <AdminCard
        title={`${filtrados.length} clientes encontrados`}
        noPadding
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead className="hidden md:table-cell">Telefone</TableHead>
              <TableHead className="hidden lg:table-cell">CPF</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell text-center">Reservas</TableHead>
              <TableHead className="w-[100px]">Acoes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginados.map((c) => {
              const statusInfo = statusMap[c.status] || statusMap.inativo;
              return (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.nome}</TableCell>
                  <TableCell className="text-slate-600">{c.email}</TableCell>
                  <TableCell className="hidden md:table-cell text-slate-600">
                    {c.telefone}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell font-mono text-slate-600">
                    {c.cpf}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={statusInfo.status}
                      label={statusInfo.label}
                      size="sm"
                      showIcon={false}
                    />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-center">
                    {c.reservas}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDetalheId(detalheId === c.id ? null : c.id)}
                      className="gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {paginados.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Paginacao */}
        {totalPaginas > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t">
            {Array.from({ length: totalPaginas }).map((_, i) => (
              <Button
                key={i}
                variant={pagina === i ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPagina(i)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        )}
      </AdminCard>

      {/* Detalhe do Cliente */}
      {detalhe && (
        <AdminCard className="mt-6" title={detalhe.nome}>
          <div className="flex items-center justify-between mb-4">
            <StatusBadge
              status={statusMap[detalhe.status]?.status || 'pending'}
              label={statusMap[detalhe.status]?.label || 'Inativo'}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDetalheId(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">E-mail</p>
              <p className="text-sm font-medium">{detalhe.email}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Telefone</p>
              <p className="text-sm font-medium">{detalhe.telefone}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">CPF</p>
              <p className="text-sm font-medium font-mono">{detalhe.cpf}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Nascimento</p>
              <p className="text-sm font-medium">
                {detalhe.nascimento
                  ? new Date(detalhe.nascimento).toLocaleDateString('pt-BR')
                  : '-'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Total de Reservas</p>
              <p className="text-lg font-bold text-blue-600">{detalhe.reservas}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Ultima Reserva</p>
              <p className="text-sm font-medium">
                {detalhe.ultimaReserva !== '-'
                  ? new Date(detalhe.ultimaReserva).toLocaleDateString('pt-BR')
                  : '-'}
              </p>
            </div>
          </div>
        </AdminCard>
      )}

      {/* Dialog Novo Cliente */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Novo Cliente</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleNovoCliente}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={novoCliente.nome}
                  onChange={(e) =>
                    setNovoCliente({ ...novoCliente, nome: e.target.value })
                  }
                  placeholder="Nome completo"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-1">
                    <Mail className="w-3 h-3" /> E-mail *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={novoCliente.email}
                    onChange={(e) =>
                      setNovoCliente({ ...novoCliente, email: e.target.value })
                    }
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone" className="flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Telefone *
                  </Label>
                  <Input
                    id="telefone"
                    value={novoCliente.telefone}
                    onChange={(e) =>
                      setNovoCliente({ ...novoCliente, telefone: e.target.value })
                    }
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpf" className="flex items-center gap-1">
                    <FileText className="w-3 h-3" /> CPF
                  </Label>
                  <Input
                    id="cpf"
                    value={novoCliente.cpf}
                    onChange={(e) =>
                      setNovoCliente({ ...novoCliente, cpf: e.target.value })
                    }
                    placeholder="000.000.000-00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nascimento" className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Data de Nascimento
                  </Label>
                  <Input
                    id="nascimento"
                    type="date"
                    value={novoCliente.nascimento}
                    onChange={(e) =>
                      setNovoCliente({ ...novoCliente, nascimento: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
