/**
 * =============================================================================
 * AdminTopBar - Barra superior do painel admin
 * =============================================================================
 * Componente compartilhado para todas as paginas admin.
 * Inclui busca global, notificacoes e menu de usuario.
 * =============================================================================
 */

import { useState } from 'react';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  HelpCircle,
} from 'lucide-react';

interface AdminTopBarProps {
  userName?: string;
  userEmail?: string;
  userRole?: string;
  notificationCount?: number;
}

export function AdminTopBar({
  userName = 'Admin',
  userEmail = 'admin@rsv360.com',
  userRole = 'Administrador',
  notificationCount = 0,
}: AdminTopBarProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex items-center justify-between w-full gap-4">
      {/* Search - Desktop */}
      <div className="hidden md:flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar clientes, reservas, excursoes..."
            className={cn(
              'w-full h-9 pl-9 pr-4 rounded-lg',
              'bg-slate-100 border-none',
              'text-sm text-slate-900 placeholder-slate-400',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white',
              'transition-all'
            )}
          />
        </div>
      </div>

      {/* Search Toggle - Mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden h-9 w-9"
        onClick={() => setSearchOpen(!searchOpen)}
      >
        <Search className="h-5 w-5" />
      </Button>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificacoes</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="py-4 text-center text-sm text-slate-500">
              Nenhuma notificacao no momento
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Help */}
        <Button variant="ghost" size="icon" className="h-9 w-9 hidden sm:flex">
          <HelpCircle className="h-5 w-5" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-9 gap-2 px-2 hover:bg-slate-100"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-xs font-semibold text-white">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-slate-900">{userName}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div>
                <p className="font-medium">{userName}</p>
                <p className="text-xs text-slate-500">{userEmail}</p>
                <p className="text-xs text-blue-600 mt-1">{userRole}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/perfil">
                <a className="flex items-center gap-2 w-full cursor-pointer">
                  <User className="w-4 h-4" />
                  Meu Perfil
                </a>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/configuracoes-sistema">
                <a className="flex items-center gap-2 w-full cursor-pointer">
                  <Settings className="w-4 h-4" />
                  Configuracoes
                </a>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 cursor-pointer">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-x-0 top-16 z-50 p-4 bg-white border-b md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar..."
              autoFocus
              className={cn(
                'w-full h-10 pl-9 pr-4 rounded-lg',
                'bg-slate-100 border-none',
                'text-sm text-slate-900 placeholder-slate-400',
                'focus:outline-none focus:ring-2 focus:ring-blue-500'
              )}
              onBlur={() => setSearchOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
