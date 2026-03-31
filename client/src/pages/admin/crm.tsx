/**
 * =============================================================================
 * Pagina CRM - Admin
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Phone,
  Mail,
  MessageSquare,
  Video,
  Send,
  Clock,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Interacao {
  id: string;
  data: string;
  tipo: 'Ligacao' | 'WhatsApp' | 'E-mail' | 'Reuniao';
  texto: string;
}

interface ClienteCRM {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  status: 'ativo' | 'lead' | 'inativo';
  ultimoContato: string;
  interacoes: Interacao[];
}

const tipoIcons: Record<string, React.ReactNode> = {
  Ligacao: <Phone className="w-3.5 h-3.5" />,
  WhatsApp: <MessageSquare className="w-3.5 h-3.5" />,
  'E-mail': <Mail className="w-3.5 h-3.5" />,
  Reuniao: <Video className="w-3.5 h-3.5" />,
};

const tipoColors: Record<string, string> = {
  Ligacao: 'bg-blue-600',
  WhatsApp: 'bg-green-600',
  'E-mail': 'bg-orange-600',
  Reuniao: 'bg-violet-600',
};

const mockCRM: ClienteCRM[] = [
  {
    id: '1',
    nome: 'Joao Silva',
    email: 'joao@email.com',
    telefone: '(62) 99999-1234',
    status: 'ativo',
    ultimoContato: '2026-03-12',
    interacoes: [
      { id: 'i1', data: '2026-03-12', tipo: 'WhatsApp', texto: 'Cliente confirmou interesse na excursao de abril para Caldas Novas.' },
      { id: 'i2', data: '2026-03-10', tipo: 'Ligacao', texto: 'Ligacao de follow-up. Cliente solicitou orcamento para grupo de 8 pessoas.' },
      { id: 'i3', data: '2026-03-05', tipo: 'E-mail', texto: 'Enviado catalogo de excursoes e promocoes do mes.' },
    ],
  },
  {
    id: '2',
    nome: 'Maria Santos',
    email: 'maria@email.com',
    telefone: '(62) 99999-5678',
    status: 'ativo',
    ultimoContato: '2026-03-11',
    interacoes: [
      { id: 'i4', data: '2026-03-11', tipo: 'Reuniao', texto: 'Reuniao presencial para fechar pacote familia (4 pessoas).' },
      { id: 'i5', data: '2026-03-08', tipo: 'WhatsApp', texto: 'Enviado link de pagamento PIX.' },
    ],
  },
  {
    id: '3',
    nome: 'Pedro Costa',
    email: 'pedro@email.com',
    telefone: '(34) 99999-9012',
    status: 'lead',
    ultimoContato: '2026-03-09',
    interacoes: [
      { id: 'i6', data: '2026-03-09', tipo: 'E-mail', texto: 'Lead veio pelo site. Demonstrou interesse em excursoes para Rio Quente.' },
    ],
  },
  {
    id: '4',
    nome: 'Ana Oliveira',
    email: 'ana@email.com',
    telefone: '(11) 99999-3456',
    status: 'ativo',
    ultimoContato: '2026-03-13',
    interacoes: [
      { id: 'i7', data: '2026-03-13', tipo: 'Ligacao', texto: 'Cliente ligou para alterar datas da reserva RSV-2026-042.' },
      { id: 'i8', data: '2026-03-07', tipo: 'WhatsApp', texto: 'Confirmacao de pagamento recebida.' },
      { id: 'i9', data: '2026-03-01', tipo: 'E-mail', texto: 'Enviado voucher de reserva por e-mail.' },
      { id: 'i10', data: '2026-02-25', tipo: 'Reuniao', texto: 'Primeira reuniao - apresentacao dos pacotes disponiveis.' },
    ],
  },
  {
    id: '5',
    nome: 'Carlos Mendes',
    email: 'carlos@email.com',
    telefone: '(61) 99999-7890',
    status: 'inativo',
    ultimoContato: '2025-12-20',
    interacoes: [
      { id: 'i11', data: '2025-12-20', tipo: 'E-mail', texto: 'Tentativa de reativacao - enviado promocao de Natal.' },
    ],
  },
  {
    id: '6',
    nome: 'Fernanda Lima',
    email: 'fernanda@email.com',
    telefone: '(21) 99999-2345',
    status: 'lead',
    ultimoContato: '2026-03-14',
    interacoes: [
      { id: 'i12', data: '2026-03-14', tipo: 'WhatsApp', texto: 'Novo lead via Instagram. Pediu informacoes sobre Hot Park.' },
    ],
  },
];

const statusMap: Record<string, { status: 'success' | 'warning' | 'pending'; label: string }> = {
  ativo: { status: 'success', label: 'Ativo' },
  lead: { status: 'warning', label: 'Lead' },
  inativo: { status: 'pending', label: 'Inativo' },
};

export default function CRMPage() {
  const { toast } = useToast();
  const [clientes, setClientes] = useState<ClienteCRM[]>(mockCRM);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [selecionadoId, setSelecionadoId] = useState<string>('1');
  const [novaInteracao, setNovaInteracao] = useState({
    tipo: 'WhatsApp' as Interacao['tipo'],
    texto: '',
  });

  const filtrados = clientes.filter((c) => {
    const matchBusca = c.nome.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === 'todos' || c.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  const selecionado = clientes.find((c) => c.id === selecionadoId);

  const handleAddInteracao = () => {
    if (!novaInteracao.texto.trim()) {
      toast({
        title: 'Texto obrigatorio',
        description: 'Escreva uma nota sobre a interacao.',
        variant: 'destructive',
      });
      return;
    }
    const newI: Interacao = {
      id: `i${Date.now()}`,
      data: new Date().toISOString().split('T')[0],
      tipo: novaInteracao.tipo,
      texto: novaInteracao.texto.trim(),
    };
    setClientes(
      clientes.map((c) =>
        c.id === selecionadoId
          ? { ...c, interacoes: [newI, ...c.interacoes], ultimoContato: newI.data }
          : c
      )
    );
    setNovaInteracao({ tipo: 'WhatsApp', texto: '' });
    toast({
      title: 'Interacao registrada!',
      description: `${newI.tipo} adicionada ao historico.`,
    });
  };

  return (
    <AdminShell
      sidebar={<AdminSidebar />}
      topBar={<AdminTopBar userName="Admin" notificationCount={3} />}
      logo={<AdminLogo />}
    >
      <AdminPageHeader
        title="CRM - Atendimento"
        description="Sistema de gestao de relacionamento com clientes"
      />

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)]">
        {/* Lista de Clientes */}
        <AdminCard className="lg:w-[340px] flex-shrink-0 flex flex-col" noPadding>
          <div className="p-4 border-b border-slate-200 space-y-3">
            <SearchBar
              value={busca}
              onChange={setBusca}
              placeholder="Buscar cliente..."
              size="sm"
            />
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Filtrar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtrados.map((c) => {
              const statusInfo = statusMap[c.status] || statusMap.inativo;
              const isSelected = c.id === selecionadoId;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelecionadoId(c.id)}
                  className={cn(
                    'flex items-center gap-3 w-full px-4 py-3 text-left border-b border-slate-100 transition-colors',
                    isSelected ? 'bg-blue-50' : 'hover:bg-slate-50'
                  )}
                >
                  <div
                    className={cn(
                      'w-2.5 h-2.5 rounded-full flex-shrink-0',
                      statusInfo.status === 'success' && 'bg-green-500',
                      statusInfo.status === 'warning' && 'bg-amber-500',
                      statusInfo.status === 'pending' && 'bg-slate-400'
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        'text-sm truncate',
                        isSelected ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'
                      )}
                    >
                      {c.nome}
                    </p>
                    <p className="text-xs text-slate-400">{c.interacoes.length} interacoes</p>
                  </div>
                  <StatusBadge
                    status={statusInfo.status}
                    label={statusInfo.label}
                    size="sm"
                    showIcon={false}
                  />
                </button>
              );
            })}
            {filtrados.length === 0 && (
              <p className="py-8 text-center text-slate-400 text-sm">
                Nenhum cliente encontrado.
              </p>
            )}
          </div>
        </AdminCard>

        {/* Detalhes do Cliente */}
        <div className="flex-1 flex flex-col gap-6 min-w-0 overflow-y-auto">
          {selecionado ? (
            <>
              {/* Info do Cliente */}
              <AdminCard>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{selecionado.nome}</h2>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" /> {selecionado.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" /> {selecionado.telefone}
                      </span>
                    </div>
                  </div>
                  <StatusBadge
                    status={statusMap[selecionado.status]?.status || 'pending'}
                    label={statusMap[selecionado.status]?.label || 'Inativo'}
                  />
                </div>
                <div className="flex gap-4 flex-wrap">
                  <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-500">Ultimo contato</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {new Date(selecionado.ultimoContato).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-500">Total de interacoes</p>
                    <p className="text-sm font-semibold text-blue-600">
                      {selecionado.interacoes.length}
                    </p>
                  </div>
                </div>
              </AdminCard>

              {/* Nova Interacao */}
              <AdminCard title="Nova Interacao" className="border-blue-200">
                <div className="flex flex-wrap gap-2 mb-3">
                  {(['Ligacao', 'WhatsApp', 'E-mail', 'Reuniao'] as const).map((tipo) => (
                    <Button
                      key={tipo}
                      size="sm"
                      variant={novaInteracao.tipo === tipo ? 'default' : 'outline'}
                      className={cn(
                        'gap-1.5',
                        novaInteracao.tipo === tipo && tipoColors[tipo]
                      )}
                      onClick={() => setNovaInteracao({ ...novaInteracao, tipo })}
                    >
                      {tipoIcons[tipo]} {tipo}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Textarea
                    value={novaInteracao.texto}
                    onChange={(e) =>
                      setNovaInteracao({ ...novaInteracao, texto: e.target.value })
                    }
                    placeholder="Descreva a interacao com o cliente..."
                    rows={2}
                    className="flex-1"
                  />
                  <Button onClick={handleAddInteracao} className="self-end gap-2">
                    <Send className="w-4 h-4" /> Enviar
                  </Button>
                </div>
              </AdminCard>

              {/* Timeline */}
              <AdminCard
                title="Timeline de Interacoes"
                headerActions={
                  <span className="text-sm text-slate-500">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {selecionado.interacoes.length} registros
                  </span>
                }
              >
                <div className="relative pl-6">
                  <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-slate-200" />
                  {selecionado.interacoes.map((inter) => (
                    <div key={inter.id} className="relative mb-5 last:mb-0">
                      <div
                        className={cn(
                          'absolute -left-4 top-1 w-4 h-4 rounded-full flex items-center justify-center',
                          tipoColors[inter.tipo] || 'bg-slate-400'
                        )}
                      >
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 ml-2">
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={cn(
                              'flex items-center gap-1 text-xs font-semibold',
                              inter.tipo === 'Ligacao' && 'text-blue-600',
                              inter.tipo === 'WhatsApp' && 'text-green-600',
                              inter.tipo === 'E-mail' && 'text-orange-600',
                              inter.tipo === 'Reuniao' && 'text-violet-600'
                            )}
                          >
                            {tipoIcons[inter.tipo]} {inter.tipo}
                          </span>
                          <span className="text-xs text-slate-400">
                            {new Date(inter.data).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">{inter.texto}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AdminCard>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <User className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="text-sm">Selecione um cliente para ver detalhes</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
