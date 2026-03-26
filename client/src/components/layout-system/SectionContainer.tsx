/**
 * SectionContainer
 * 
 * Wrapper para seções internas dentro de páginas
 * Fornece spacing vertical consistente entre blocos
 * 
 * Uso: Separar visualmente diferentes seções (hero, features, cta, etc)
 */

import React, { ReactNode } from 'react';

export interface SectionContainerProps {
  children: ReactNode;
  /** Spacing vertical before: 'sm' | 'md' | 'lg' */
  spacingBefore?: 'sm' | 'md' | 'lg';
  /** Spacing vertical after: 'sm' | 'md' | 'lg' */
  spacingAfter?: 'sm' | 'md' | 'lg';
  /** Background color: 'default' | 'alt' | 'elevated' */
  variant?: 'default' | 'alt' | 'elevated';
  /** Classe customizada adicional */
  className?: string;
}

const spacingMap = {
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-16',
} as const;

const variantMap = {
  default: 'bg-white',
  alt: 'bg-slate-50',
  elevated: 'bg-white border-b border-slate-200',
} as const;

export const SectionContainer = React.forwardRef<
  HTMLDivElement,
  SectionContainerProps
>(({ 
  children, 
  spacingBefore = 'md',
  spacingAfter = 'md',
  variant = 'default',
  className = '' 
}, ref) => {
  const spacingClass = `${spacingMap[spacingBefore]} ${spacingMap[spacingAfter]}`;
  const variantClass = variantMap[variant];

  return (
    <section 
      ref={ref}
      className={`${spacingClass} ${variantClass} w-full ${className}`}
    >
      {children}
    </section>
  );
});

SectionContainer.displayName = 'SectionContainer';
