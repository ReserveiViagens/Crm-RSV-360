/**
 * =============================================================================
 * CatalogPageShell - FAMILIA B
 * =============================================================================
 * Para paginas de catalogo, busca e ecommerce.
 * 
 * PAGINAS: Ingressos, hoteis, atracoes, excursoes, listagens
 * 
 * CARACTERISTICAS:
 * - Max width: 1280px para conteudo
 * - Sidebar retrátil: 280px desktop, drawer no mobile
 * - Busca/filtros sempre bem posicionados
 * - Grid consistente para cards de produto
 * - Sensacao de catalogo premium
 * 
 * USO:
 * <CatalogPageShell
 *   header={<SearchHeader />}
 *   sidebar={<FiltersSidebar />}
 * >
 *   <ProductGrid products={products} />
 * </CatalogPageShell>
 * =============================================================================
 */

import React, { ReactNode, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

export interface CatalogPageShellProps {
  children: ReactNode;
  /** Header da pagina (breadcrumbs, titulo, busca) */
  header?: ReactNode;
  /** Conteudo da sidebar (filtros) */
  sidebar?: ReactNode;
  /** Titulo da pagina */
  title?: string;
  /** Subtitulo ou contagem de resultados */
  subtitle?: string;
  /** Sidebar aberta por padrao no desktop */
  sidebarOpenDefault?: boolean;
  /** Esconder sidebar completamente */
  hideSidebar?: boolean;
  /** Classe CSS adicional */
  className?: string;
}

export const CatalogPageShell = React.forwardRef<
  HTMLDivElement,
  CatalogPageShellProps
>(({ 
  children,
  header,
  sidebar,
  title,
  subtitle,
  sidebarOpenDefault = true,
  hideSidebar = false,
  className,
}, ref) => {
  const [sidebarOpen, setSidebarOpen] = useState(sidebarOpenDefault);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const hasSidebar = sidebar && !hideSidebar;

  return (
    <div 
      ref={ref}
      className={cn(
        'min-h-screen w-full bg-slate-50',
        className
      )}
    >
      {/* Header Section */}
      {(header || title) && (
        <div className="sticky top-0 z-30 border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
            {/* Custom Header */}
            {header && (
              <div className="py-3">
                {header}
              </div>
            )}

            {/* Title Row */}
            {title && (
              <div className="flex items-center justify-between gap-4 py-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-sm text-slate-500 mt-0.5">
                      {subtitle}
                    </p>
                  )}
                </div>

                {/* Mobile Filter Button */}
                {hasSidebar && (
                  <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="lg:hidden flex items-center gap-2"
                      >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filtros
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] p-0">
                      <SheetTitle className="sr-only">Filtros</SheetTitle>
                      <div className="p-4 border-b border-slate-200">
                        <h2 className="font-semibold text-slate-900">Filtros</h2>
                      </div>
                      <div className="p-4 overflow-y-auto max-h-[calc(100vh-80px)]">
                        {sidebar}
                      </div>
                    </SheetContent>
                  </Sheet>
                )}

                {/* Desktop Sidebar Toggle */}
                {hasSidebar && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSidebar}
                    className="hidden lg:flex items-center gap-2 text-slate-600"
                  >
                    {sidebarOpen ? (
                      <>
                        <X className="h-4 w-4" />
                        Esconder filtros
                      </>
                    ) : (
                      <>
                        <Menu className="h-4 w-4" />
                        Mostrar filtros
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          {hasSidebar && (
            <aside 
              className={cn(
                'hidden lg:block flex-shrink-0 transition-all duration-300',
                sidebarOpen ? 'w-[280px]' : 'w-0 overflow-hidden'
              )}
            >
              <div className={cn(
                'sticky top-[140px] w-[280px] max-h-[calc(100vh-160px)] overflow-y-auto',
                'bg-white rounded-xl border border-slate-200 p-4',
                !sidebarOpen && 'invisible'
              )}>
                {sidebar}
              </div>
            </aside>
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
});

CatalogPageShell.displayName = 'CatalogPageShell';

/**
 * =============================================================================
 * CatalogGrid - Helper para grids de produtos
 * =============================================================================
 */
export interface CatalogGridProps {
  children: ReactNode;
  /** Colunas: 2, 3, 4 */
  columns?: 2 | 3 | 4;
  /** Gap entre items */
  gap?: 'sm' | 'md' | 'lg';
  /** Classe CSS adicional */
  className?: string;
}

const columnsMap = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
} as const;

const gapMap = {
  sm: 'gap-3',
  md: 'gap-4 sm:gap-5',
  lg: 'gap-5 sm:gap-6',
} as const;

export const CatalogGrid = React.forwardRef<
  HTMLDivElement,
  CatalogGridProps
>(({ children, columns = 3, gap = 'md', className }, ref) => {
  return (
    <div 
      ref={ref}
      className={cn(
        'grid',
        columnsMap[columns],
        gapMap[gap],
        className
      )}
    >
      {children}
    </div>
  );
});

CatalogGrid.displayName = 'CatalogGrid';
