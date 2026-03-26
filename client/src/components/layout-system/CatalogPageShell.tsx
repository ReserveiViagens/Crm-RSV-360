/**
 * CatalogPageShell — Família B
 * 
 * Para páginas de catálogo, busca e ecommerce
 * Uso: Ingressos, hotéis, atrações, excursões
 * 
 * Características:
 * - Max width: 1280px
 * - Sidebar retrátil: 280px desktop, drawer mobile
 * - Busca/filtros sempre visível e bem posicionado
 * - Grid limpo e consistente
 * - Sensação de catálogo premium
 */

import React, { ReactNode, useState } from 'react';
import { Menu, X } from 'lucide-react';

export interface CatalogPageShellProps {
  children: ReactNode;
  /** Conteúdo da sidebar (filtros, etc) */
  sidebar?: ReactNode;
  /** Título da página */
  title?: string;
  /** Mostrar sidebar por padrão */
  showSidebarByDefault?: boolean;
  /** Classe customizada */
  className?: string;
}

export const CatalogPageShell = React.forwardRef<
  HTMLDivElement,
  CatalogPageShellProps
>(({ 
  children,
  sidebar,
  title,
  showSidebarByDefault = true,
  className = '' 
}, ref) => {
  const [sidebarOpen, setSidebarOpen] = useState(showSidebarByDefault);

  return (
    <div 
      ref={ref}
      className={`w-full min-h-screen bg-white ${className}`}
    >
      {/* Topbar com título e toggle sidebar */}
      {title && (
        <div className="sticky top-0 z-30 border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1280px] flex items-center justify-between py-4">
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            {/* Toggle sidebar button — visible on mobile only */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label={sidebarOpen ? 'Fechar filtros' : 'Abrir filtros'}
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Main layout: sidebar + content */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar — hidden on mobile unless open */}
          {sidebar && (
            <>
              {/* Mobile drawer backdrop */}
              {sidebarOpen && (
                <div 
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                />
              )}
              
              {/* Sidebar container */}
              <aside 
                className={`
                  fixed bottom-0 left-0 top-0 z-40 w-72 bg-white border-r border-slate-200 
                  overflow-y-auto transition-all duration-300
                  lg:relative lg:w-72 lg:flex-shrink-0 lg:sticky lg:top-0 lg:max-h-[calc(100vh-80px)]
                  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
              >
                <div className="p-4 sm:p-6">
                  {sidebar}
                </div>
              </aside>
            </>
          )}

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
});

CatalogPageShell.displayName = 'CatalogPageShell';
