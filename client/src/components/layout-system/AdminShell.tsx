/**
 * AdminShell — Família E
 * 
 * Para painéis administrativos e dashboards
 * Uso: Dashboard admin, CRM, financeiro, reports, maps, settings
 * 
 * Características:
 * - Sidebar retrátil (250px → 64px)
 * - Top bar sticky (64px)
 * - Max width: 1440px para conteúdo
 * - Layout flex com sidebar
 * - Aparência B2B premium
 */

import React, { ReactNode, useState } from 'react';
import { Menu, X } from 'lucide-react';

export interface AdminShellProps {
  children: ReactNode;
  /** Conteúdo do sidebar */
  sidebar?: ReactNode;
  /** Conteúdo do top bar */
  topBar?: ReactNode;
  /** Sidebar colapsada por padrão em mobile */
  sidebarCollapsedMobile?: boolean;
  /** Classe customizada */
  className?: string;
}

export const AdminShell = React.forwardRef<
  HTMLDivElement,
  AdminShellProps
>(({ 
  children,
  sidebar,
  topBar,
  sidebarCollapsedMobile = true,
  className = '' 
}, ref) => {
  const [sidebarOpen, setSidebarOpen] = useState(!sidebarCollapsedMobile);

  return (
    <div 
      ref={ref}
      className={`w-full min-h-screen flex flex-col bg-slate-50 ${className}`}
    >
      {/* Top Bar */}
      {topBar && (
        <header className="sticky top-0 z-40 h-16 border-b border-slate-200 bg-white flex items-center px-4 sm:px-6">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden mr-4 p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-slate-600" />
            ) : (
              <Menu className="w-5 h-5 text-slate-600" />
            )}
          </button>
          
          {/* Top bar content */}
          <div className="flex-1">
            {topBar}
          </div>
        </header>
      )}

      {/* Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebar && (
          <>
            {/* Mobile backdrop */}
            {sidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
            
            {/* Sidebar container */}
            <aside 
              className={`
                fixed bottom-0 left-0 top-16 z-40 w-64 bg-white border-r border-slate-200 
                overflow-y-auto transition-all duration-300
                lg:relative lg:top-0 lg:w-64 lg:flex-shrink-0 lg:sticky lg:max-h-[calc(100vh-64px)]
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              `}
            >
              <nav className="p-4 sm:p-6 space-y-2">
                {sidebar}
              </nav>
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1440px] w-full px-4 sm:px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
});

AdminShell.displayName = 'AdminShell';
