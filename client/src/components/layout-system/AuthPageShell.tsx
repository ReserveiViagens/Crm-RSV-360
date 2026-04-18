/**
 * =============================================================================
 * AuthPageShell - FAMILIA C
 * =============================================================================
 * Para paginas de autenticacao.
 * 
 * PAGINAS: Login, cadastro, esqueci senha, redefinir senha, verificar email
 * 
 * CARACTERISTICAS:
 * - Max width: 440px (formulario)
 * - Centralizado vertical e horizontal
 * - Fundo limpo e minimalista
 * - Foco total no formulario
 * - Min height: 100vh
 * - Aparencia sofisticada e confiavel
 * 
 * USO:
 * <AuthPageShell
 *   title="Entrar"
 *   subtitle="Bem-vindo de volta"
 *   header={<Logo />}
 *   footer={<Link to="/cadastrar">Criar conta</Link>}
 * >
 *   <LoginForm />
 * </AuthPageShell>
 * =============================================================================
 */

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface AuthPageShellProps {
  children: ReactNode;
  /** Titulo da pagina */
  title?: string;
  /** Subtitulo ou descricao */
  subtitle?: string;
  /** Logo/branding no topo */
  header?: ReactNode;
  /** Link ou conteudo no rodape */
  footer?: ReactNode;
  /** Variante visual */
  variant?: 'default' | 'split' | 'minimal';
  /** Imagem para variante split */
  splitImage?: string;
  /** Classe CSS adicional */
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
  variant = 'default',
  splitImage,
  className,
}, ref) => {
  // Variante Split - com imagem lateral
  if (variant === 'split') {
    return (
      <div 
        ref={ref}
        className={cn(
          'min-h-screen w-full flex',
          className
        )}
      >
        {/* Form Side */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white">
          <div className="w-full max-w-[400px]">
            {/* Header */}
            {header && (
              <div className="mb-8">
                {header}
              </div>
            )}

            {/* Title */}
            {title && (
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="mt-2 text-slate-600">
                    {subtitle}
                  </p>
                )}
              </div>
            )}

            {/* Form */}
            <div className="space-y-6">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="mt-8 text-center text-sm text-slate-600">
                {footer}
              </div>
            )}
          </div>
        </div>

        {/* Image Side */}
        <div 
          className="hidden lg:block lg:w-1/2 bg-slate-100 bg-cover bg-center"
          style={splitImage ? { backgroundImage: `url(${splitImage})` } : undefined}
        >
          {!splitImage && (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700">
              <div className="text-center text-white p-8">
                <div className="text-4xl font-bold mb-4">RSV360</div>
                <p className="text-blue-100 max-w-xs">
                  Sua plataforma completa para reservas e turismo
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Variante Minimal - sem card
  if (variant === 'minimal') {
    return (
      <div 
        ref={ref}
        className={cn(
          'min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-white',
          className
        )}
      >
        <div className="w-full max-w-[400px]">
          {header && <div className="mb-8 text-center">{header}</div>}
          {title && (
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
              {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
            </div>
          )}
          {children}
          {footer && <div className="mt-8 text-center text-sm text-slate-600">{footer}</div>}
        </div>
      </div>
    );
  }

  // Variante Default - com card centralizado
  return (
    <div 
      ref={ref}
      className={cn(
        'min-h-screen w-full flex items-center justify-center p-4 sm:p-6',
        'bg-gradient-to-br from-slate-50 via-white to-slate-100',
        className
      )}
    >
      <div className="w-full max-w-[440px]">
        {/* Header/Logo */}
        {header && (
          <div className="mb-8 text-center">
            {header}
          </div>
        )}

        {/* Title & Subtitle */}
        {title && (
          <div className="mb-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-slate-600 text-sm sm:text-base">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Card com formulario */}
        <div className={cn(
          'bg-white rounded-2xl p-6 sm:p-8',
          'border border-slate-200 shadow-sm'
        )}>
          {children}
        </div>

        {/* Footer */}
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
