import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface SectionContainerProps {
  children: ReactNode;
  /** Spacing vertical: 'none' | 'sm' | 'md' | 'lg' | 'xl' */
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Variante de background */
  variant?: 'default' | 'alt' | 'elevated' | 'primary' | 'dark';
  /** Full-width (ignora max-width do parent) */
  fullWidth?: boolean;
  /** Classe CSS adicional */
  className?: string;
  /** Tag HTML a usar */
  as?: 'section' | 'div' | 'article' | 'aside';
  /** ID para navegacao */
  id?: string;
}

const spacingMap = {
  none: '',
  sm: 'py-6 sm:py-8',
  md: 'py-10 sm:py-12 lg:py-16',
  lg: 'py-16 sm:py-20 lg:py-24',
  xl: 'py-20 sm:py-24 lg:py-32',
} as const;

const variantMap = {
  default: 'bg-white',
  alt: 'bg-slate-50',
  elevated: 'bg-white shadow-sm border-y border-slate-100',
  primary: 'bg-gradient-to-br from-blue-600 to-blue-700 text-white',
  dark: 'bg-slate-900 text-white',
} as const;

export const SectionContainer = React.forwardRef<
  HTMLDivElement,
  SectionContainerProps
>(({ 
  children, 
  spacing = 'md',
  variant = 'default',
  fullWidth = false,
  className,
  as: Component = 'section',
  id,
}, ref) => {
  return (
    <Component
      ref={ref as React.Ref<HTMLDivElement>}
      id={id}
      className={cn(
        'w-full',
        spacingMap[spacing],
        variantMap[variant],
        fullWidth && 'max-w-none',
        className
      )}
    >
      {children}
    </Component>
  );
});

SectionContainer.displayName = 'SectionContainer';