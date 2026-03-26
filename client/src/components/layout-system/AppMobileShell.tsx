/**
 * AppMobileShell — Família D
 * 
 * Para aplicações mobile-first (perfil, reservas, notificações)
 * Uso: Perfil, minhas reservas, pagamentos, suporte, fidelidade
 * 
 * Características:
 * - Mobile-first design
 * - Max width: 480px
 * - Top bar sticky (56px)
 * - Bottom navigation (64px)
 * - Safe area handling
 * - Sensação de app premium
 */

import React, { ReactNode } from 'react';

export interface AppMobileShellProps {
  children: ReactNode;
  /** Conteúdo do top bar (logo, title, etc) */
  topBar?: ReactNode;
  /** Conteúdo do bottom navigation */
  bottomNav?: ReactNode;
  /** Padding bottom para acomodar bottom nav */
  withBottomNav?: boolean;
  /** Classe customizada */
  className?: string;
}

export const AppMobileShell = React.forwardRef<
  HTMLDivElement,
  AppMobileShellProps
>(({ 
  children,
  topBar,
  bottomNav,
  withBottomNav = true,
  className = '' 
}, ref) => {
  return (
    <div 
      ref={ref}
      className={`w-full max-w-[480px] mx-auto min-h-screen bg-white flex flex-col ${className}`}
    >
      {/* Top Bar — Sticky */}
      {topBar && (
        <div className="sticky top-0 z-40 h-14 border-b border-slate-200 bg-white flex items-center px-4">
          {topBar}
        </div>
      )}

      {/* Main Content — Scrollable */}
      <main className={`flex-1 overflow-y-auto ${withBottomNav ? 'pb-16' : ''}`}>
        <div className="px-4 py-4 sm:py-6">
          {children}
        </div>
      </main>

      {/* Bottom Navigation — Sticky */}
      {bottomNav && withBottomNav && (
        <nav className="sticky bottom-0 left-0 right-0 z-40 h-16 border-t border-slate-200 bg-white flex items-center px-4 pb-safe">
          {bottomNav}
        </nav>
      )}
    </div>
  );
});

AppMobileShell.displayName = 'AppMobileShell';
