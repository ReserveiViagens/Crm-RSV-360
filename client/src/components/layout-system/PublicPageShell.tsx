/**
 * =============================================================================
 * PublicPageShell - FAMILIA A
 * =============================================================================
 * Para paginas publicas e de marketing.
 * 
 * PAGINAS: Home, landing, promocoes, contato, quem somos, institucional
 * 
 * CARACTERISTICAS:
 * - Max width: 1280px para conteudo interno
 * - Hero pode ser full-bleed (100vw)
 * - Padding responsivo: 16px mobile -> 32px desktop
 * - Spacing generoso entre secoes
 * - Foco em leitura, conversao e editorial
 * 
 * USO:
 * <PublicPageShell>
 *   <SectionContainer fullWidth variant="primary">
 *     <HeroSection />
 *   </SectionContainer>
 *   <SectionContainer>
 *     <PageContainer maxWidth="public">
 *       <FeaturesSection />
 *     </PageContainer>
 *   </SectionContainer>
 * </PublicPageShell>
 * =============================================================================
 */

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface PublicPageShellProps {
  children: ReactNode;
  /** Header fixo/sticky (navegacao) */
  header?: ReactNode;
  /** Footer da pagina */
  footer?: ReactNode;
  /** Background da pagina toda */
  background?: 'white' | 'slate' | 'gradient';
  /** Classe CSS adicional */
  className?: string;
}

const backgroundMap = {
  white: 'bg-white',
  slate: 'bg-slate-50',
  gradient: 'bg-gradient-to-b from-white to-slate-50',
} as const;

export const PublicPageShell = React.forwardRef<
  HTMLDivElement,
  PublicPageShellProps
>(({ 
  children, 
  header,
  footer,
  background = 'white',
  className,
}, ref) => {
  return (
    <div 
      ref={ref}
      className={cn(
        'min-h-screen w-full flex flex-col',
        backgroundMap[background],
        className
      )}
    >
      {/* Header - Sticky */}
      {header && (
        <header className="sticky top-0 z-40 w-full">
          {header}
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Footer */}
      {footer && (
        <footer className="w-full mt-auto">
          {footer}
        </footer>
      )}
    </div>
  );
});

PublicPageShell.displayName = 'PublicPageShell';

/**
 * =============================================================================
 * PublicSection - Helper para secoes com max-width automatico
 * =============================================================================
 */
export interface PublicSectionProps {
  children: ReactNode;
  /** Spacing vertical */
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Variante de background */
  variant?: 'default' | 'alt' | 'elevated' | 'primary' | 'dark';
  /** Full-width (hero, banners) */
  fullWidth?: boolean;
  /** ID para navegacao */
  id?: string;
  /** Classe CSS adicional */
  className?: string;
}

const sectionSpacingMap = {
  none: '',
  sm: 'py-8 sm:py-10',
  md: 'py-12 sm:py-16 lg:py-20',
  lg: 'py-16 sm:py-20 lg:py-24',
  xl: 'py-20 sm:py-24 lg:py-32',
} as const;

const sectionVariantMap = {
  default: 'bg-white',
  alt: 'bg-slate-50',
  elevated: 'bg-white border-y border-slate-100',
  primary: 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white',
  dark: 'bg-slate-900 text-white',
} as const;

export const PublicSection = React.forwardRef<
  HTMLElement,
  PublicSectionProps
>(({ 
  children, 
  spacing = 'md',
  variant = 'default',
  fullWidth = false,
  id,
  className,
}, ref) => {
  return (
    <section
      ref={ref}
      id={id}
      className={cn(
        'w-full',
        sectionSpacingMap[spacing],
        sectionVariantMap[variant],
        className
      )}
    >
      {fullWidth ? (
        children
      ) : (
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      )}
    </section>
  );
});

PublicSection.displayName = 'PublicSection';
