/**
 * AuthPageShell — Família C
 * 
 * Para páginas de autenticação
 * Uso: Login, cadastro, reset password, verify email
 * 
 * Características:
 * - Max width: 440px (formulário)
 * - Centralizado vertical e horizontal
 * - Fundo limpo e minimalista
 * - Foco total no formulário
 * - Min height: 100vh
 */

import React, { ReactNode } from 'react';

export interface AuthPageShellProps {
  children: ReactNode;
  /** Título da página (ex: "Entrar") */
  title?: string;
  /** Subtítulo ou descrição */
  subtitle?: string;
  /** Logo/branding no topo */
  header?: ReactNode;
  /** Link ou conteúdo no rodapé (ex: "Não tem conta? Cadastre-se") */
  footer?: ReactNode;
  /** Classe customizada */
  className?: string;
}

export const AuthPageShell = React.forwardRef<
  HTMLDivElement,
  AuthPageShellProps
>(({ 
  children,
  title,
  subtitle,
  header,
  footer,
  className = '' 
}, ref) => {
  return (
    <div 
      ref={ref}
      className={`w-full min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center px-4 py-8 sm:py-12 ${className}`}
    >
      {/* Central card container */}
      <div className="w-full max-w-[440px]">
        {/* Header/Logo */}
        {header && (
          <div className="mb-8 text-center">
            {header}
          </div>
        )}

        {/* Title & Subtitle */}
        {title && (
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-slate-600 text-sm sm:text-base">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Form Content */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          {children}
        </div>

        {/* Footer (login link, terms, etc) */}
        {footer && (
          <div className="mt-6 text-center text-sm text-slate-600">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
});

AuthPageShell.displayName = 'AuthPageShell';
