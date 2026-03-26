/**
 * PublicPageShell — Família A
 * 
 * Para páginas públicas e de marketing
 * Uso: Home, landing, promoções, contato, quem somos
 * 
 * Características:
 * - Max width: 1280px
 * - Hero pode ser full-bleed
 * - Padding responsivo: 16px mobile → 32px desktop
 * - Foco em leitura e conversão
 * - Spacing generoso entre seções
 */

import React, { ReactNode } from 'react';

export interface PublicPageShellProps {
  children: ReactNode;
  /** Metadata para SEO */
  title?: string;
  description?: string;
  /** Background color para hero full-bleed */
  heroBgClass?: string;
  /** Classe customizada */
  className?: string;
}

export const PublicPageShell = React.forwardRef<
  HTMLDivElement,
  PublicPageShellProps
>(({ 
  children, 
  title,
  description,
  heroBgClass = '',
  className = '' 
}, ref) => {
  return (
    <div 
      ref={ref}
      className={`w-full bg-white ${className}`}
    >
      {/* SEO Meta (opcional, via head) */}
      {title && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: title,
            description: description,
          })}
        </script>
      )}

      {/* Container centralizado com max-width */}
      <div className="mx-auto w-full max-w-[1280px]">
        {children}
      </div>
    </div>
  );
});

PublicPageShell.displayName = 'PublicPageShell';
