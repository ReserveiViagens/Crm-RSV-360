/**
 * =============================================================================
 * AdminShell - FAMILIA E
 * =============================================================================
 * Para paineis administrativos e dashboards.
 * 
 * PAGINAS: Dashboard, CRM, financeiro, reports, analytics, settings, usuarios
 * 
 * CARACTERISTICAS:
 * - Sidebar retrátil (256px -> 64px collapsed)
 * - Top bar sticky (64px)
 * - Max width: 1440px para conteudo principal
 * - Layout flex com sidebar
 * - Aparencia B2B premium
 * - Responsivo: sidebar vira drawer no mobile
 * 
 * USO:
 * <AdminShell
 *   sidebar={<AdminSidebar />}
 *   topBar={<AdminTopBar />}
 * >
 *   <DashboardContent />
 * </AdminShell>
 * =============================================================================
 */

import React, { ReactNode, useState, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

// Context para controle da sidebar
interface AdminShellContextValue {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  collapseSidebar: () => void;
  expandSidebar: () => void;
}

const AdminShellContext = createContext<AdminShellContextValue | null>(null);

export const useAdminShell = () => {
  const context = useContext(AdminShellContext);
  if (!context) {
    throw new Error('useAdminShell must be used within AdminShell');
  }
  return context;
};

export interface AdminShellProps {
  children: ReactNode;
  /** Conteudo da sidebar */
  sidebar?: ReactNode;
  /** Conteudo do top bar */
  topBar?: ReactNode;
  /** Logo para sidebar */
  logo?: ReactNode;
  /** Sidebar colapsada por padrao */
  sidebarCollapsedDefault?: boolean;
  /** Esconder sidebar completamente */
  hideSidebar?: boolean;
  /** Background do content area */
  contentBackground?: 'white' | 'slate';
  /** Classe CSS adicional */
  className?: string;
}

export const AdminShell = React.forwardRef<
  HTMLDivElement,
  AdminShellProps
>(({ 
  children,
  sidebar,
  topBar,
  logo,
  sidebarCollapsedDefault = false,
  hideSidebar = false,
  contentBackground = 'slate',
  className,
}, ref) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(sidebarCollapsedDefault);

  const contextValue: AdminShellContextValue = {
    sidebarOpen: mobileOpen,
    sidebarCollapsed: collapsed,
    toggleSidebar: () => setMobileOpen(prev => !prev),
    collapseSidebar: () => setCollapsed(true),
    expandSidebar: () => setCollapsed(false),
  };

  const hasSidebar = sidebar && !hideSidebar;

  return (
    <AdminShellContext.Provider value={contextValue}>
      <div 
        ref={ref}
        className={cn(
          'min-h-screen w-full flex flex-col',
          contentBackground === 'white' ? 'bg-white' : 'bg-slate-50',
          className
        )}
      >
        {/* Top Bar */}
        <header className={cn(
          'sticky top-0 z-40 h-16 flex-shrink-0',
          'bg-white border-b border-slate-200',
          'flex items-center px-4 sm:px-6 gap-4'
        )}>
          {/* Mobile Menu Toggle */}
          {hasSidebar && (
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden h-9 w-9"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                <SheetTitle className="sr-only">Menu de navegacao</SheetTitle>
                {/* Mobile Sidebar Content */}
                <div className="flex flex-col h-full">
                  {logo && (
                    <div className="h-16 flex items-center px-4 border-b border-slate-200">
                      {logo}
                    </div>
                  )}
                  <nav className="flex-1 overflow-y-auto p-4">
                    {sidebar}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          )}

          {/* Logo (mobile) */}
          {logo && (
            <div className="lg:hidden">
              {logo}
            </div>
          )}

          {/* Top Bar Content */}
          <div className="flex-1 flex items-center">
            {topBar}
          </div>
        </header>

        {/* Main Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Desktop Sidebar */}
          {hasSidebar && (
            <aside className={cn(
              'hidden lg:flex flex-col flex-shrink-0',
              'bg-white border-r border-slate-200',
              'transition-all duration-300',
              collapsed ? 'w-16' : 'w-64'
            )}>
              {/* Logo */}
              {logo && (
                <div className={cn(
                  'h-16 flex items-center border-b border-slate-200',
                  collapsed ? 'justify-center px-2' : 'px-4'
                )}>
                  {!collapsed && logo}
                </div>
              )}

              {/* Sidebar Content */}
              <nav className={cn(
                'flex-1 overflow-y-auto',
                collapsed ? 'px-2 py-4' : 'p-4'
              )}>
                {sidebar}
              </nav>

              {/* Collapse Toggle */}
              <div className="p-2 border-t border-slate-200">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCollapsed(!collapsed)}
                  className={cn(
                    'w-full justify-center',
                    !collapsed && 'justify-start'
                  )}
                >
                  {collapsed ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      <span>Recolher</span>
                    </>
                  )}
                </Button>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className={cn(
              'mx-auto w-full px-4 sm:px-6 py-6',
              'max-w-[1440px]'
            )}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminShellContext.Provider>
  );
});

AdminShell.displayName = 'AdminShell';

/**
 * =============================================================================
 * AdminPageHeader - Header padronizado para paginas admin
 * =============================================================================
 */
export interface AdminPageHeaderProps {
  /** Titulo da pagina */
  title: string;
  /** Descricao ou subtitulo */
  description?: string;
  /** Breadcrumbs */
  breadcrumbs?: ReactNode;
  /** Acoes (botoes) */
  actions?: ReactNode;
  /** Classe CSS adicional */
  className?: string;
}

export const AdminPageHeader = React.forwardRef<
  HTMLDivElement,
  AdminPageHeaderProps
>(({ title, description, breadcrumbs, actions, className }, ref) => {
  return (
    <div ref={ref} className={cn('mb-6', className)}>
      {breadcrumbs && (
        <div className="mb-3 text-sm text-slate-500">
          {breadcrumbs}
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-slate-600">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
});

AdminPageHeader.displayName = 'AdminPageHeader';

/**
 * =============================================================================
 * AdminCard - Card padronizado para dashboards
 * =============================================================================
 */
export interface AdminCardProps {
  children: ReactNode;
  /** Titulo do card */
  title?: string;
  /** Descricao */
  description?: string;
  /** Acoes no header */
  headerActions?: ReactNode;
  /** Sem padding interno */
  noPadding?: boolean;
  /** Classe CSS adicional */
  className?: string;
}

export const AdminCard = React.forwardRef<
  HTMLDivElement,
  AdminCardProps
>(({ 
  children, 
  title, 
  description, 
  headerActions, 
  noPadding = false,
  className 
}, ref) => {
  return (
    <div 
      ref={ref}
      className={cn(
        'bg-white rounded-xl border border-slate-200',
        className
      )}
    >
      {(title || headerActions) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            {title && (
              <h3 className="font-semibold text-slate-900">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-slate-500 mt-0.5">
                {description}
              </p>
            )}
          </div>
          {headerActions && (
            <div className="flex items-center gap-2">
              {headerActions}
            </div>
          )}
        </div>
      )}
      <div className={cn(!noPadding && 'p-5')}>
        {children}
      </div>
    </div>
  );
});

AdminCard.displayName = 'AdminCard';
