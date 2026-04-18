/**
 * =============================================================================
 * PageContainer
 * =============================================================================
 * Wrapper base para todas as paginas do sistema.
 * Fornece padding horizontal responsivo e centraliza o conteudo.
 * 
 * RESPONSABILIDADES:
 * - Padding horizontal consistente (16px mobile -> 32px desktop)
 * - Centralizacao do conteudo
 * - Max-width opcional por familia
 * 
 * USO:
 * <PageContainer>
 *   <SectionContainer>...</SectionContainer>
 * </PageContainer>
 * =============================================================================
 */

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface PageContainerProps {
  children: ReactNode;
  /** Aplicar padding horizontal responsivo */
  padded?: boolean;
  /** Max-width do container */
  maxWidth?: 'public' | 'catalog' | 'auth' | 'app' | 'admin' | 'full' | 'none';
  /** Centralizar horizontalmente */
  centered?: boolean;
  /** Classe CSS adicional */
  className?: string;
  /** Tag HTML a usar */
  as?: 'div' | 'main' | 'section' | 'article';
}

const maxWidthMap = {
  public: 'max-w-[1280px]',
  catalog: 'max-w-[1280px]',
  auth: 'max-w-[440px]',
  app: 'max-w-[480px]',
  admin: 'max-w-[1440px]',
  full: 'max-w-full',
  none: '',
} as const;

export const PageContainer = React.forwardRef<
  HTMLDivElement,
  PageContainerProps
>(({ 
  children, 
  padded = true, 
  maxWidth = 'none',
  centered = true,
  className,
  as: Component = 'div',
}, ref) => {
  return (
    <Component 
      ref={ref}
      className={cn(
        'w-full',
        padded && 'px-4 sm:px-6 lg:px-8',
        maxWidthMap[maxWidth],
        centered && 'mx-auto',
        className
      )}
    >
      {children}
    </Component>
  );
});

PageContainer.displayName = 'PageContainer';
