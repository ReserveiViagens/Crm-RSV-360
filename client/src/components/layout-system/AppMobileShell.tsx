/**
 * =============================================================================
 * AppMobileShell - FAMILIA D
 * =============================================================================
 * Para aplicacoes mobile-first (area do cliente).
 * 
 * PAGINAS: Perfil, minhas reservas, pagamentos, suporte, fidelidade, notificacoes
 * 
 * CARACTERISTICAS:
 * - Mobile-first design
 * - Max width: 480px (centralizado em desktop)
 * - Top bar sticky (56px)
 * - Bottom navigation (64px)
 * - Safe area handling para dispositivos moveis
 * - Sensacao de app nativo premium
 * 
 * USO:
 * <AppMobileShell
 *   topBar={<TopBarContent />}
 *   bottomNav={<BottomNavigation />}
 * >
 *   <ProfileContent />
 * </AppMobileShell>
 * =============================================================================
 */

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface AppMobileShellProps {
  children: ReactNode;
  /** Conteudo do top bar */
  topBar?: ReactNode;
  /** Titulo para top bar simples */
  title?: string;
  /** Botao de voltar */
  showBackButton?: boolean;
  /** Funcao ao clicar em voltar */
  onBack?: () => void;
  /** Acoes no header (direita) */
  headerActions?: ReactNode;
  /** Conteudo da bottom navigation */
  bottomNav?: ReactNode;
  /** Mostrar bottom nav */
  showBottomNav?: boolean;
  /** Background do conteudo */
  background?: 'white' | 'slate';
  /** Classe CSS adicional */
  className?: string;
}

export const AppMobileShell = React.forwardRef<
  HTMLDivElement,
  AppMobileShellProps
>(({ 
  children,
  topBar,
  title,
  showBackButton = false,
  onBack,
  headerActions,
  bottomNav,
  showBottomNav = true,
  background = 'slate',
  className,
}, ref) => {
  const hasTopBar = topBar || title;
  const hasBottomNav = bottomNav && showBottomNav;

  return (
    <div 
      ref={ref}
      className={cn(
        'w-full max-w-[480px] mx-auto min-h-screen flex flex-col',
        background === 'white' ? 'bg-white' : 'bg-slate-50',
        className
      )}
    >
      {/* Top Bar */}
      {hasTopBar && (
        <header className={cn(
          'sticky top-0 z-40 h-14 flex-shrink-0',
          'bg-white border-b border-slate-200',
          'flex items-center px-4 gap-3'
        )}>
          {/* Back Button */}
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 -ml-2"
              onClick={onBack}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}

          {/* Custom TopBar or Title */}
          {topBar ? (
            <div className="flex-1 min-w-0">
              {topBar}
            </div>
          ) : title ? (
            <h1 className="flex-1 min-w-0 text-lg font-semibold text-slate-900 truncate">
              {title}
            </h1>
          ) : null}

          {/* Header Actions */}
          {headerActions && (
            <div className="flex items-center gap-2 -mr-2">
              {headerActions}
            </div>
          )}
        </header>
      )}

      {/* Main Content */}
      <main className={cn(
        'flex-1 overflow-y-auto',
        hasBottomNav && 'pb-16'
      )}>
        <div className="px-4 py-4 sm:py-6">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      {hasBottomNav && (
        <nav className={cn(
          'fixed bottom-0 left-0 right-0 z-40',
          'max-w-[480px] mx-auto',
          'h-16 bg-white border-t border-slate-200',
          'flex items-center justify-around px-4',
          'pb-[env(safe-area-inset-bottom)]'
        )}>
          {bottomNav}
        </nav>
      )}
    </div>
  );
});

AppMobileShell.displayName = 'AppMobileShell';

/**
 * =============================================================================
 * AppMobileCard - Card padronizado para o contexto mobile
 * =============================================================================
 */
export interface AppMobileCardProps {
  children: ReactNode;
  /** Titulo do card */
  title?: string;
  /** Subtitulo */
  subtitle?: string;
  /** Icone ou avatar */
  icon?: ReactNode;
  /** Acao no canto direito */
  action?: ReactNode;
  /** Funcao ao clicar */
  onClick?: () => void;
  /** Classe CSS adicional */
  className?: string;
}

export const AppMobileCard = React.forwardRef<
  HTMLDivElement,
  AppMobileCardProps
>(({ 
  children, 
  title, 
  subtitle, 
  icon, 
  action, 
  onClick,
  className 
}, ref) => {
  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component
      ref={ref as React.Ref<HTMLButtonElement & HTMLDivElement>}
      onClick={onClick}
      className={cn(
        'w-full bg-white rounded-xl border border-slate-200 p-4',
        'text-left transition-colors',
        onClick && 'hover:bg-slate-50 active:bg-slate-100 cursor-pointer',
        className
      )}
    >
      {(title || icon) && (
        <div className="flex items-center gap-3 mb-3">
          {icon && (
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className="font-medium text-slate-900 truncate">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-slate-500 truncate">
                {subtitle}
              </p>
            )}
          </div>
          {action && (
            <div className="flex-shrink-0">
              {action}
            </div>
          )}
        </div>
      )}
      {children}
    </Component>
  );
});

AppMobileCard.displayName = 'AppMobileCard';
