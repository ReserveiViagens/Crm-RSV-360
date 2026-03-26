/**
 * PageContainer
 * 
 * Wrapper base para todas as páginas
 * Fornece padding horizontal consistente e centraliza conteúdo
 * 
 * Uso: Envolver o conteúdo principal de qualquer página
 */

import React, { ReactNode } from 'react';

export interface PageContainerProps {
  children: ReactNode;
  /** Padding horizontal responsivo */
  padded?: boolean;
  /** Classe customizada adicional */
  className?: string;
}

export const PageContainer = React.forwardRef<
  HTMLDivElement,
  PageContainerProps
>(({ children, padded = true, className = '' }, ref) => {
  const paddingClass = padded 
    ? 'px-4 sm:px-6 lg:px-8' 
    : '';

  return (
    <div 
      ref={ref}
      className={`w-full ${paddingClass} ${className}`}
    >
      {children}
    </div>
  );
});

PageContainer.displayName = 'PageContainer';
