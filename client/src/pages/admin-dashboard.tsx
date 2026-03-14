
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import type { AtividadeWizard } from "@shared/schema";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell, Legend,
  LineChart, Line
} from 'recharts';

import {
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  MapPin,
  Star,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ArrowRight,
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity,
  UserCheck,
  MessageSquare,
  FileSpreadsheet,
  Printer,
  Shield,
  Receipt,
  Percent,
  Bot,
  Zap,
  Trophy,
  BarChart2,
  Crown
} from 'lucide-react';

interface BookingStats {
  totalBookings: number;
  monthlyRevenue: number;
  activeCustomers: number;
  popularDestination: string;
  conversionRate: number;
  averageBookingValue: number;
}

interface RecentBooking {
  id: string;
  customerName: string;
  destination: string;
  checkIn: string;
  checkOut: string;
  value: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'failed';
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  color: string;
}

const monthlyRevenueData = [
  { month: 'Jan', receita: 98500 },
  { month: 'Fev', receita: 112300 },
  { month: 'Mar', receita: 134700 },
  { month: 'Abr', receita: 121400 },
  { month: 'Mai', receita: 145200 },
  { month: 'Jun', receita: 156800 },
];

const distributionData = [
  { name: 'Hotéis', value: 40, color: '#2563EB' },
  { name: 'Ingressos', value: 25, color: '#F57C00' },
  { name: 'Excursões', value: 20, color: '#22C55E' },
  { name: 'Outros', value: 15, color: '#8B5CF6' },
];

const dailyBookingsData = Array.from({ length: 30 }, (_, i) => ({
  dia: `${i + 1}`,
  reservas: Math.floor(Math.random() * 30) + 10,
}));

const anttPassengers = [
  { id: 1, nome: 'João Silva', rg: '12.345.678-9', cpf: '123.456.789-00', orgaoEmissor: 'SSP/GO', assento: '01' },
  { id: 2, nome: 'Maria Santos', rg: '23.456.789-0', cpf: '234.567.890-11', orgaoEmissor: 'SSP/MG', assento: '02' },
  { id: 3, nome: 'Pedro Costa', rg: '34.567.890-1', cpf: '345.678.901-22', orgaoEmissor: 'SSP/SP', assento: '03' },
  { id: 4, nome: 'Ana Oliveira', rg: '45.678.901-2', cpf: '456.789.012-33', orgaoEmissor: 'SSP/GO', assento: '04' },
  { id: 5, nome: 'Carlos Mendes', rg: '56.789.012-3', cpf: '567.890.123-44', orgaoEmissor: 'SSP/DF', assento: '05' },
  { id: 6, nome: 'Fernanda Lima', rg: '67.890.123-4', cpf: '678.901.234-55', orgaoEmissor: 'SSP/RJ', assento: '06' },
  { id: 7, nome: 'Ricardo Souza', rg: '78.901.234-5', cpf: '789.012.345-66', orgaoEmissor: 'SSP/GO', assento: '07' },
  { id: 8, nome: 'Juliana Pereira', rg: '89.012.345-6', cpf: '890.123.456-77', orgaoEmissor: 'SSP/MG', assento: '08' },
];

const lucroData = {
  totalArrecadado: 156800,
  taxasComissoes: 23520,
  impostos: { iss: 7840, mdr: 3920 },
  lucroLiquido: 121520,
};

export default function DashboardRSV() {
  const [, setLocation] = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const [atividades, setAtividades] = useState<AtividadeWizard[]>([]);
  const [atividadeEditId, setAtividadeEditId] = useState<string | null>(null);
  const [atividadeEditLabel, setAtividadeEditLabel] = useState('');
  const [atividadeEditDesc, setAtividadeEditDesc] = useState('');
  const [atividadeNovaLabel, setAtividadeNovaLabel] = useState('');
  const [atividadeNovaDesc, setAtividadeNovaDesc] = useState('');
  const [showNovaAtividade, setShowNovaAtividade] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchAtividades = async () => {
    const res = await fetch('/api/atividades-wizard');
    if (res.ok) {
      const data = await res.json();
      setAtividades(data.items ?? []);
    }
  };

  useEffect(() => { fetchAtividades(); }, []);

  const handleCriarAtividade = async () => {
    if (!atividadeNovaLabel.trim() || !atividadeNovaDesc.trim()) return;
    const res = await fetch('/api/atividades-wizard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: atividadeNovaLabel.trim(), descricao: atividadeNovaDesc.trim() }),
    });
    if (res.ok) {
      setAtividadeNovaLabel('');
      setAtividadeNovaDesc('');
      setShowNovaAtividade(false);
      await fetchAtividades();
    } else {
      const data = await res.json().catch(() => null);
      alert(data?.message ?? 'Erro ao criar atividade. Verifique se está autenticado como admin.');
    }
  };

  const handleEditarAtividade = async (id: string) => {
    if (!atividadeEditLabel.trim() || !atividadeEditDesc.trim()) return;
    const res = await fetch(`/api/atividades-wizard/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: atividadeEditLabel.trim(), descricao: atividadeEditDesc.trim() }),
    });
    if (res.ok) {
      setAtividadeEditId(null);
      await fetchAtividades();
    } else {
      const data = await res.json().catch(() => null);
      alert(data?.message ?? 'Erro ao editar atividade. Verifique se está autenticado como admin.');
    }
  };

  const handleExcluirAtividade = async (id: string) => {
    const res = await fetch(`/api/atividades-wizard/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setDeleteConfirmId(null);
      await fetchAtividades();
    } else {
      const data = await res.json().catch(() => null);
      alert(data?.message ?? 'Erro ao excluir atividade. Verifique se está autenticado como admin.');
      setDeleteConfirmId(null);
    }
  };

  const [stats] = useState<BookingStats>({
    totalBookings: 1247,
    monthlyRevenue: 156800,
    activeCustomers: 892,
    popularDestination: 'Caldas Novas',
    conversionRate: 23.4,
    averageBookingValue: 1258
  });

  const [recentBookings] = useState<RecentBooking[]>([
    { id: '1', customerName: 'João Silva', destination: 'Caldas Novas - GO', checkIn: '2025-08-15', checkOut: '2025-08-18', value: 1500, status: 'confirmed', paymentStatus: 'paid' },
    { id: '2', customerName: 'Maria Santos', destination: 'Porto de Galinhas - PE', checkIn: '2025-08-20', checkOut: '2025-08-25', value: 2200, status: 'pending', paymentStatus: 'pending' },
    { id: '3', customerName: 'Pedro Costa', destination: 'Fernando de Noronha - PE', checkIn: '2025-09-01', checkOut: '2025-09-07', value: 4500, status: 'confirmed', paymentStatus: 'paid' },
    { id: '4', customerName: 'Ana Oliveira', destination: 'Gramado - RS', checkIn: '2025-08-30', checkOut: '2025-09-02', value: 1800, status: 'cancelled', paymentStatus: 'failed' },
  ]);

  const quickActions: QuickAction[] = [
    { title: 'Nova Reserva', description: 'Criar nova reserva para cliente', icon: <Plus className="w-6 h-6" />, action: () => setLocation('/reservations'), color: 'bg-blue-500 hover:bg-blue-600' },
    { title: 'Adicionar Cliente', description: 'Cadastrar novo cliente', icon: <Users className="w-6 h-6" />, action: () => setLocation('/cadastros'), color: 'bg-green-500 hover:bg-green-600' },
    { title: 'CRM - Atendimento', description: 'Sistema de gestão de clientes', icon: <UserCheck className="w-6 h-6" />, action: () => setLocation('/crm'), color: 'bg-orange-500 hover:bg-orange-600' },
    { title: 'Relatório Mensal', description: 'Gerar relatório de vendas', icon: <BarChart3 className="w-6 h-6" />, action: () => setLocation('/reports'), color: 'bg-purple-500 hover:bg-purple-600' },
    { title: 'Configurações', description: 'Configurar sistema', icon: <Settings className="w-6 h-6" />, action: () => setLocation('/settings'), color: 'bg-gray-500 hover:bg-gray-600' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogout = () => {
    setLocation('/login');
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,Cliente,Destino,Check-in,Check-out,Valor,Status,Pagamento\n" +
      recentBookings.map(b => `${b.customerName},${b.destination},${b.checkIn},${b.checkOut},${b.value},${b.status},${b.paymentStatus}`).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "relatorio_dashboard.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportANTT = () => {
    alert("Lista ANTT exportada com sucesso! Arquivo: lista_antt_excursao.xlsx");
  };

  const costBarTotal = lucroData.totalArrecadado;
  const costSegments = [
    { label: 'Lucro Líquido', value: lucroData.lucroLiquido, color: '#22C55E' },
    { label: 'Taxas/Comissões', value: lucroData.taxasComissoes, color: '#F57C00' },
    { label: 'ISS', value: lucroData.impostos.iss, color: '#EF4444' },
    { label: 'MDR', value: lucroData.impostos.mdr, color: '#F59E0B' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
      <header style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563EB)', padding: '0 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => window.history.back()}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', padding: '6px 12px', borderRadius: 20, cursor: 'pointer', fontSize: 13 }}
              data-testid="button-voltar"
              title="Voltar"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar
            </button>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'none' }}
              data-testid="button-toggle-sidebar"
              title="Abrir menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 700, margin: 0 }} data-testid="text-header-title">Reservei Viagens</h1>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, margin: 0 }}>Dashboard Financeiro & Operacional</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={handleExportCSV}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}
              data-testid="button-export-csv"
              title="Exportar Relatório CSV"
            >
              <Download className="w-4 h-4" />
              Exportar CSV
            </button>
            <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', position: 'relative' }} title="Notificações" data-testid="button-notifications">
              <Bell className="w-5 h-5" />
              <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: '#fff', fontSize: 14, fontWeight: 500, margin: 0 }} data-testid="text-admin-name">Usuário Admin</p>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, margin: 0 }}>Administrador</p>
              </div>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }} title="Sair" data-testid="button-logout">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex' }}>
        <div style={{ width: 256, minHeight: 'calc(100vh - 64px)', background: '#fff', borderRight: '1px solid #E5E7EB', padding: '24px 16px', flexShrink: 0 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16, paddingLeft: 12 }}>Menu Principal</h2>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Link href="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, background: '#EFF6FF', color: '#2563EB', fontWeight: 600, fontSize: 14, textDecoration: 'none' }} data-testid="link-sidebar-dashboard">
              <Activity className="w-5 h-5" /> Dashboard
            </Link>
            <Link href="/admin/financeiro" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, color: '#4B5563', fontSize: 14, textDecoration: 'none' }} data-testid="link-sidebar-financeiro">
              <DollarSign className="w-5 h-5" /> Financeiro / Split
            </Link>
            <Link href="/admin/relatorios-ads" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, color: '#4B5563', fontSize: 14, textDecoration: 'none' }} data-testid="link-sidebar-ads">
              <BarChart3 className="w-5 h-5" /> Relatórios de Ads
            </Link>
            <Link href="/admin/integracoes" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, color: '#4B5563', fontSize: 14, textDecoration: 'none' }} data-testid="link-sidebar-integracoes">
              <MessageSquare className="w-5 h-5" /> Integrações Canais
            </Link>
          </nav>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16, marginTop: 24, paddingLeft: 12 }}>Operacional</h2>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Link href="/admin/fnrh" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, color: '#4B5563', fontSize: 14, textDecoration: 'none' }} data-testid="link-sidebar-fnrh">
              <FileSpreadsheet className="w-5 h-5" /> FNRH Digital
            </Link>
            <Link href="/admin/contratos" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, color: '#4B5563', fontSize: 14, textDecoration: 'none' }} data-testid="link-sidebar-contratos">
              <Edit className="w-5 h-5" /> Contratos
            </Link>
            <Link href="/admin/seguro-viagem" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, color: '#4B5563', fontSize: 14, textDecoration: 'none' }} data-testid="link-sidebar-seguro">
              <Shield className="w-5 h-5" /> Seguro Viagem
            </Link>
            <Link href="/admin/assinatura-digital" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, color: '#4B5563', fontSize: 14, textDecoration: 'none' }} data-testid="link-sidebar-assinatura">
              <CheckCircle className="w-5 h-5" /> Assinatura Digital
            </Link>
            <Link href="/admin/seguranca-embarque" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, color: '#4B5563', fontSize: 14, textDecoration: 'none' }} data-testid="link-sidebar-embarque">
              <UserCheck className="w-5 h-5" /> Segurança Embarque
            </Link>
            <Link href="/admin/frota-antt" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, color: '#4B5563', fontSize: 14, textDecoration: 'none' }} data-testid="link-sidebar-frota">
              <MapPin className="w-5 h-5" /> Frota / ANTT
            </Link>
          </nav>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16, marginTop: 24, paddingLeft: 12 }}>Conformidade</h2>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Link href="/admin/cadastur" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, color: '#4B5563', fontSize: 14, textDecoration: 'none' }} data-testid="link-sidebar-cadastur">
              <Star className="w-5 h-5" /> Cadastur
            </Link>
            <Link href="/admin/lgpd" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, color: '#4B5563', fontSize: 14, textDecoration: 'none' }} data-testid="link-sidebar-lgpd">
              <Shield className="w-5 h-5" /> LGPD
            </Link>
            <Link href="/settings" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, color: '#4B5563', fontSize: 14, textDecoration: 'none' }} data-testid="link-sidebar-config">
              <Settings className="w-5 h-5" /> Configurações
            </Link>
          </nav>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16, marginTop: 24, paddingLeft: 12 }}>🚀 NTX — Next Gen</h2>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Link href="/kyc" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, color: '#4B5563', fontSize: 14, textDecoration: 'none' }} data-testid="link-sidebar-kyc">
              <Shield className="w-5 h-5" /> KYC Biométrico
            </Link>
            <Link href="/admin/waas" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, color: '#4B5563', fontSize: 14, textDecoration: 'none' }} data-testid="link-sidebar-waas">
              <Bot className="w-5 h-5" /> WhatsApp WaaS
            </Link>
            <Link href="/admin/live-chat" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, color: '#4B5563', fontSize: 14, textDecoration: 'none' }} data-testid="link-sidebar-live-chat">
              <MessageSquare className="w-5 h-5" /> Live Chat Handoff
            </Link>
            <Link href="/admin/super-financeiro" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, color: '#4B5563', fontSize: 14, textDecoration: 'none' }} data-testid="link-sidebar-super-financeiro">
              <BarChart2 className="w-5 h-5" /> Super-Admin Financeiro
            </Link>
            <Link href="/organizer/metas" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, color: '#4B5563', fontSize: 14, textDecoration: 'none' }} data-testid="link-sidebar-gamification">
              <Trophy className="w-5 h-5" /> Gamificação
            </Link>
            <Link href="/ranking-organizadores" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, color: '#4B5563', fontSize: 14, textDecoration: 'none' }} data-testid="link-sidebar-ranking">
              <Crown className="w-5 h-5" /> Ranking
            </Link>
            <Link href="/excursoes/caldas-novas-maio" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, color: '#4B5563', fontSize: 14, textDecoration: 'none' }} data-testid="link-sidebar-landing">
              <Zap className="w-5 h-5" /> Landing Page Demo
            </Link>
          </nav>
        </div>

        <div style={{ flex: 1, padding: '32px 32px 48px' }}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', margin: 0 }} data-testid="text-page-title">Dashboard</h1>
            <p style={{ color: '#6B7280', marginTop: 4 }}>Visão geral do seu negócio de viagens</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 32 }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }} data-testid="card-stat-reservas">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ padding: 10, background: '#DBEAFE', borderRadius: 10 }}>
                  <Calendar className="w-6 h-6" style={{ color: '#2563EB' }} />
                </div>
                <div>
                  <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Total de Reservas</p>
                  <p style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }} data-testid="text-stat-reservas">{stats.totalBookings.toLocaleString()}</p>
                </div>
              </div>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', fontSize: 13, color: '#22C55E' }}>
                <TrendingUp className="w-4 h-4" style={{ marginRight: 4 }} /> +12% este mês
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }} data-testid="card-stat-receita">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ padding: 10, background: '#D1FAE5', borderRadius: 10 }}>
                  <DollarSign className="w-6 h-6" style={{ color: '#22C55E' }} />
                </div>
                <div>
                  <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Receita Mensal</p>
                  <p style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }} data-testid="text-stat-receita">R$ {stats.monthlyRevenue.toLocaleString()}</p>
                </div>
              </div>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', fontSize: 13, color: '#22C55E' }}>
                <TrendingUp className="w-4 h-4" style={{ marginRight: 4 }} /> +8% este mês
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }} data-testid="card-stat-clientes">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ padding: 10, background: '#EDE9FE', borderRadius: 10 }}>
                  <Users className="w-6 h-6" style={{ color: '#8B5CF6' }} />
                </div>
                <div>
                  <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Clientes Ativos</p>
                  <p style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }} data-testid="text-stat-clientes">{stats.activeCustomers.toLocaleString()}</p>
                </div>
              </div>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', fontSize: 13, color: '#22C55E' }}>
                <TrendingUp className="w-4 h-4" style={{ marginRight: 4 }} /> +5% este mês
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }} data-testid="card-stat-destino">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ padding: 10, background: '#FEF3C7', borderRadius: 10 }}>
                  <Star className="w-6 h-6" style={{ color: '#F59E0B' }} />
                </div>
                <div>
                  <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Destino Popular</p>
                  <p style={{ fontSize: 18, fontWeight: 600, color: '#111827', margin: 0 }} data-testid="text-stat-destino">{stats.popularDestination}</p>
                </div>
              </div>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', fontSize: 13, color: '#2563EB' }}>
                <MapPin className="w-4 h-4" style={{ marginRight: 4 }} /> Mais reservado
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 24, marginBottom: 32 }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }} data-testid="chart-receita-mensal">
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 20 }}>Receita Mensal (Últimos 6 Meses)</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                  <RechartsTooltip formatter={(value: number) => [`R$ ${value.toLocaleString()}`, 'Receita']} />
                  <Bar dataKey="receita" fill="#2563EB" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }} data-testid="chart-distribuicao">
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 20 }}>Distribuição por Tipo</h3>
              <ResponsiveContainer width="100%" height={280}>
                <RechartsPieChart>
                  <Pie data={distributionData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <RechartsTooltip formatter={(value: number) => [`${value}%`, 'Participação']} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: 32 }} data-testid="chart-reservas-diarias">
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 20 }}>Reservas por Dia (Últimos 30 Dias)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={dailyBookingsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="dia" tick={{ fill: '#6B7280', fontSize: 11 }} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                <RechartsTooltip formatter={(value: number) => [`${value}`, 'Reservas']} labelFormatter={(label) => `Dia ${label}`} />
                <Line type="monotone" dataKey="reservas" stroke="#2563EB" strokeWidth={2} dot={{ fill: '#2563EB', r: 3 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: 32 }} data-testid="section-lucro-real">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#111827', margin: 0 }}>Lucro Real</h3>
              <span style={{ fontSize: 13, color: '#6B7280' }}>Período: Junho 2026</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
              <div style={{ padding: 20, borderRadius: 10, background: '#EFF6FF', border: '1px solid #BFDBFE' }} data-testid="card-lucro-total">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <DollarSign className="w-5 h-5" style={{ color: '#2563EB' }} />
                  <span style={{ fontSize: 13, color: '#2563EB', fontWeight: 500 }}>Total Arrecadado</span>
                </div>
                <p style={{ fontSize: 22, fontWeight: 700, color: '#1e3a5f', margin: 0 }} data-testid="text-lucro-total">R$ {lucroData.totalArrecadado.toLocaleString()}</p>
              </div>

              <div style={{ padding: 20, borderRadius: 10, background: '#FFF7ED', border: '1px solid #FED7AA' }} data-testid="card-lucro-taxas">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Percent className="w-5 h-5" style={{ color: '#F57C00' }} />
                  <span style={{ fontSize: 13, color: '#F57C00', fontWeight: 500 }}>Taxas/Comissões</span>
                </div>
                <p style={{ fontSize: 22, fontWeight: 700, color: '#9A3412', margin: 0 }} data-testid="text-lucro-taxas">R$ {lucroData.taxasComissoes.toLocaleString()}</p>
              </div>

              <div style={{ padding: 20, borderRadius: 10, background: '#FEF2F2', border: '1px solid #FECACA' }} data-testid="card-lucro-impostos">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Receipt className="w-5 h-5" style={{ color: '#EF4444' }} />
                  <span style={{ fontSize: 13, color: '#EF4444', fontWeight: 500 }}>Impostos (ISS + MDR)</span>
                </div>
                <p style={{ fontSize: 22, fontWeight: 700, color: '#991B1B', margin: 0 }} data-testid="text-lucro-impostos">R$ {(lucroData.impostos.iss + lucroData.impostos.mdr).toLocaleString()}</p>
                <p style={{ fontSize: 12, color: '#6B7280', margin: '4px 0 0' }}>ISS: R$ {lucroData.impostos.iss.toLocaleString()} | MDR: R$ {lucroData.impostos.mdr.toLocaleString()}</p>
              </div>

              <div style={{ padding: 20, borderRadius: 10, background: '#F0FDF4', border: '1px solid #BBF7D0' }} data-testid="card-lucro-liquido">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <TrendingUp className="w-5 h-5" style={{ color: '#22C55E' }} />
                  <span style={{ fontSize: 13, color: '#22C55E', fontWeight: 500 }}>Lucro Líquido</span>
                </div>
                <p style={{ fontSize: 22, fontWeight: 700, color: '#166534', margin: 0 }} data-testid="text-lucro-liquido">R$ {lucroData.lucroLiquido.toLocaleString()}</p>
              </div>
            </div>

            <div data-testid="bar-composicao-custos">
              <p style={{ fontSize: 13, fontWeight: 500, color: '#6B7280', marginBottom: 8 }}>Composição de Custos</p>
              <div style={{ display: 'flex', height: 32, borderRadius: 8, overflow: 'hidden' }}>
                {costSegments.map((seg, i) => (
                  <div
                    key={i}
                    style={{
                      width: `${(seg.value / costBarTotal) * 100}%`,
                      background: seg.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 600,
                      minWidth: 60
                    }}
                    title={`${seg.label}: R$ ${seg.value.toLocaleString()}`}
                    data-testid={`bar-segment-${i}`}
                  >
                    {((seg.value / costBarTotal) * 100).toFixed(0)}%
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
                {costSegments.map((seg, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6B7280' }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: seg.color }} />
                    {seg.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: 32 }} data-testid="section-quick-actions">
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #E5E7EB' }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: 0 }}>Ações Rápidas</h2>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    style={{ background: index === 0 ? '#2563EB' : index === 1 ? '#22C55E' : index === 2 ? '#F57C00' : index === 3 ? '#8B5CF6' : '#6B7280', color: '#fff', padding: 16, borderRadius: 10, border: 'none', cursor: 'pointer', textAlign: 'left' }}
                    data-testid={`button-action-${index}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <h3 style={{ fontWeight: 600, fontSize: 14, margin: 0 }}>{action.title}</h3>
                        <p style={{ fontSize: 12, opacity: 0.9, margin: '4px 0 0' }}>{action.description}</p>
                      </div>
                      {action.icon}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: 32 }} data-testid="section-reservas-recentes">
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: 0 }}>Reservas Recentes</h2>
              <Link href="/reservations" style={{ fontSize: 13, color: '#2563EB', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }} data-testid="link-ver-reservas">
                Ver todas <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F9FAFB' }}>
                    {['Cliente', 'Destino', 'Check-in', 'Check-out', 'Valor', 'Status', 'Pagamento', 'Ações'].map((h) => (
                      <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} style={{ borderTop: '1px solid #F3F4F6' }} data-testid={`row-booking-${booking.id}`}>
                      <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 500, color: '#111827' }}>{booking.customerName}</td>
                      <td style={{ padding: '14px 20px', fontSize: 14, color: '#374151' }}>{booking.destination}</td>
                      <td style={{ padding: '14px 20px', fontSize: 14, color: '#374151' }}>{new Date(booking.checkIn).toLocaleDateString('pt-BR')}</td>
                      <td style={{ padding: '14px 20px', fontSize: 14, color: '#374151' }}>{new Date(booking.checkOut).toLocaleDateString('pt-BR')}</td>
                      <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 600, color: '#111827' }}>R$ {booking.value.toLocaleString()}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{
                          padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                          background: booking.status === 'confirmed' ? '#D1FAE5' : booking.status === 'pending' ? '#FEF3C7' : '#FEE2E2',
                          color: booking.status === 'confirmed' ? '#065F46' : booking.status === 'pending' ? '#92400E' : '#991B1B'
                        }} data-testid={`badge-status-${booking.id}`}>
                          {booking.status === 'confirmed' ? 'Confirmada' : booking.status === 'pending' ? 'Pendente' : 'Cancelada'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{
                          padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                          background: booking.paymentStatus === 'paid' ? '#D1FAE5' : booking.paymentStatus === 'pending' ? '#FEF3C7' : '#FEE2E2',
                          color: booking.paymentStatus === 'paid' ? '#065F46' : booking.paymentStatus === 'pending' ? '#92400E' : '#991B1B'
                        }} data-testid={`badge-payment-${booking.id}`}>
                          {booking.paymentStatus === 'paid' ? 'Pago' : booking.paymentStatus === 'pending' ? 'Pendente' : 'Falhou'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button style={{ background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer' }} title="Visualizar" data-testid={`button-view-${booking.id}`}>
                            <Eye className="w-4 h-4" />
                          </button>
                          <button style={{ background: 'none', border: 'none', color: '#22C55E', cursor: 'pointer' }} title="Editar" data-testid={`button-edit-${booking.id}`}>
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: 32 }} data-testid="section-atividades-wizard">
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: 0 }}>Atividades do Roteiro</h2>
                <p style={{ fontSize: 13, color: '#6B7280', margin: '4px 0 0' }}>Gerencie as atividades exibidas no wizard "Como?" da excursão em grupo.</p>
              </div>
              <button
                onClick={() => setShowNovaAtividade(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#2563EB', color: '#fff', padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
                data-testid="button-nova-atividade"
              >
                <Plus className="w-4 h-4" />
                Nova Atividade
              </button>
            </div>
            <div style={{ padding: 24 }}>
              {showNovaAtividade && (
                <div style={{ border: '1px solid #DBEAFE', borderRadius: 10, padding: 16, marginBottom: 16, background: '#EFF6FF' }} data-testid="form-nova-atividade">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: 8, alignItems: 'end' }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Nome</label>
                      <input
                        value={atividadeNovaLabel}
                        onChange={(e) => setAtividadeNovaLabel(e.target.value)}
                        placeholder="Ex: Trilha ecológica"
                        style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 13 }}
                        data-testid="input-nova-atividade-label"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Descrição</label>
                      <input
                        value={atividadeNovaDesc}
                        onChange={(e) => setAtividadeNovaDesc(e.target.value)}
                        placeholder="Descrição curta da atividade"
                        style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 13 }}
                        data-testid="input-nova-atividade-descricao"
                      />
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={handleCriarAtividade} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#22C55E', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }} data-testid="button-salvar-nova-atividade">
                        Salvar
                      </button>
                      <button onClick={() => { setShowNovaAtividade(false); setAtividadeNovaLabel(''); setAtividadeNovaDesc(''); }} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', color: '#374151', fontSize: 13, cursor: 'pointer' }} data-testid="button-cancelar-nova-atividade">
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {atividades.length === 0 ? (
                <p style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', padding: 20 }}>Nenhuma atividade cadastrada.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F9FAFB' }}>
                      {['Nome', 'Descrição', 'Ações'].map((h) => (
                        <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {atividades.map((a) => (
                      <tr key={a.id} style={{ borderTop: '1px solid #F3F4F6' }} data-testid={`row-atividade-${a.id}`}>
                        {atividadeEditId === a.id ? (
                          <>
                            <td style={{ padding: '10px 20px' }}>
                              <input value={atividadeEditLabel} onChange={(e) => setAtividadeEditLabel(e.target.value)} style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #E5E7EB', fontSize: 13 }} data-testid="input-edit-atividade-label" />
                            </td>
                            <td style={{ padding: '10px 20px' }}>
                              <input value={atividadeEditDesc} onChange={(e) => setAtividadeEditDesc(e.target.value)} style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: '1px solid #E5E7EB', fontSize: 13 }} data-testid="input-edit-atividade-descricao" />
                            </td>
                            <td style={{ padding: '10px 20px' }}>
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button onClick={() => handleEditarAtividade(a.id)} style={{ background: '#22C55E', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }} data-testid="button-salvar-edit-atividade">Salvar</button>
                                <button onClick={() => setAtividadeEditId(null)} style={{ background: '#F3F4F6', color: '#374151', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, cursor: 'pointer' }} data-testid="button-cancelar-edit-atividade">Cancelar</button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 500, color: '#111827' }}>{a.label}</td>
                            <td style={{ padding: '14px 20px', fontSize: 14, color: '#374151' }}>{a.descricao}</td>
                            <td style={{ padding: '14px 20px' }}>
                              <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={() => { setAtividadeEditId(a.id); setAtividadeEditLabel(a.label); setAtividadeEditDesc(a.descricao); }} style={{ background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer' }} title="Editar" data-testid={`button-edit-atividade-${a.id}`}>
                                  <Edit className="w-4 h-4" />
                                </button>
                                {deleteConfirmId === a.id ? (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <span style={{ fontSize: 11, color: '#EF4444', fontWeight: 600 }}>Confirmar?</span>
                                    <button onClick={() => handleExcluirAtividade(a.id)} style={{ background: '#EF4444', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px', fontSize: 11, fontWeight: 600, cursor: 'pointer' }} data-testid={`button-confirmar-delete-atividade-${a.id}`}>Sim</button>
                                    <button onClick={() => setDeleteConfirmId(null)} style={{ background: '#F3F4F6', color: '#374151', border: 'none', borderRadius: 4, padding: '4px 8px', fontSize: 11, cursor: 'pointer' }} data-testid={`button-cancelar-delete-atividade-${a.id}`}>Não</button>
                                  </div>
                                ) : (
                                  <button onClick={() => setDeleteConfirmId(a.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }} title="Excluir" data-testid={`button-delete-atividade-${a.id}`}>
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: 32 }} data-testid="section-lista-antt">
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: 0 }}>Lista ANTT — Próxima Excursão</h2>
                <p style={{ fontSize: 13, color: '#6B7280', margin: '4px 0 0' }}>Caldas Novas — 15/08/2026 — Ônibus Placa ABC-1234</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={handleExportANTT}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#22C55E', color: '#fff', padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
                  data-testid="button-export-antt"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Exportar Lista ANTT (Excel)
                </button>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F9FAFB' }}>
                    {['Nome', 'RG', 'CPF', 'Órgão Emissor', 'Assento'].map((h) => (
                      <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {anttPassengers.map((p) => (
                    <tr key={p.id} style={{ borderTop: '1px solid #F3F4F6' }} data-testid={`row-antt-${p.id}`}>
                      <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 500, color: '#111827' }}>{p.nome}</td>
                      <td style={{ padding: '14px 20px', fontSize: 14, color: '#374151' }}>{p.rg}</td>
                      <td style={{ padding: '14px 20px', fontSize: 14, color: '#374151' }}>{p.cpf}</td>
                      <td style={{ padding: '14px 20px', fontSize: 14, color: '#374151' }}>{p.orgaoEmissor}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 13, fontWeight: 600, background: '#EFF6FF', color: '#2563EB' }} data-testid={`text-assento-${p.id}`}>
                          {p.assento}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
