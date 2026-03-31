/**
 * =============================================================================
 * AdminSidebar - Navegacao lateral do painel admin
 * =============================================================================
 * Componente compartilhado para todas as paginas admin.
 * Usa o contexto do AdminShell para suportar modo collapsed.
 * =============================================================================
 */

import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { useAdminShell } from '@/components/layout-system/AdminShell';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  DollarSign,
  FileText,
  CalendarPlus,
  BarChart3,
  Settings,
  Shield,
  Bus,
  Plane,
  FileSignature,
  Building2,
  Megaphone,
  Bot,
  Lock,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navigation: NavGroup[] = [
  {
    title: 'Principal',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { label: 'Nova Reserva', href: '/admin/nova-reserva', icon: CalendarPlus },
    ],
  },
  {
    title: 'Clientes',
    items: [
      { label: 'Clientes', href: '/admin/clientes', icon: Users },
      { label: 'CRM', href: '/admin/crm', icon: UserCheck },
    ],
  },
  {
    title: 'Financeiro',
    items: [
      { label: 'Financeiro', href: '/admin/financeiro', icon: DollarSign },
      { label: 'Contratos', href: '/admin/contratos', icon: FileText },
      { label: 'Relatorio Mensal', href: '/admin/relatorio-mensal', icon: BarChart3 },
    ],
  },
  {
    title: 'Operacional',
    items: [
      { label: 'Frota ANTT', href: '/admin/frota-antt', icon: Bus },
      { label: 'Seguro Viagem', href: '/admin/seguro-viagem', icon: Plane },
      { label: 'Seguranca Embarque', href: '/admin/seguranca-embarque', icon: Shield },
    ],
  },
  {
    title: 'Documentos',
    items: [
      { label: 'Assinatura Digital', href: '/admin/assinatura-digital', icon: FileSignature },
      { label: 'FNRH', href: '/admin/fnrh', icon: FileText },
      { label: 'CADASTUR', href: '/admin/cadastur', icon: Building2 },
    ],
  },
  {
    title: 'Marketing',
    items: [
      { label: 'Relatorios Ads', href: '/admin/relatorios-ads', icon: Megaphone },
      { label: 'WaaS Dashboard', href: '/admin/waas-dashboard', icon: Bot },
    ],
  },
  {
    title: 'Sistema',
    items: [
      { label: 'Integracoes', href: '/admin/integracoes', icon: Settings },
      { label: 'Configuracoes', href: '/admin/configuracoes-sistema', icon: Settings },
      { label: 'LGPD', href: '/admin/lgpd', icon: Lock },
    ],
  },
];

export function AdminSidebar() {
  const [location] = useLocation();
  const { sidebarCollapsed } = useAdminShell();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location === '/admin' || location === '/admin/';
    }
    return location.startsWith(href);
  };

  return (
    <nav className="flex flex-col gap-6">
      {navigation.map((group) => (
        <div key={group.title}>
          {!sidebarCollapsed && (
            <h3 className="px-2 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {group.title}
            </h3>
          )}
          <ul className="flex flex-col gap-1">
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <li key={item.href}>
                  <Link href={item.href}>
                    <a
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        sidebarCollapsed && 'justify-center px-2',
                        active
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      )}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <Icon className={cn('w-5 h-5 flex-shrink-0', active && 'text-blue-600')} />
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1">{item.label}</span>
                          {item.badge && (
                            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </a>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
