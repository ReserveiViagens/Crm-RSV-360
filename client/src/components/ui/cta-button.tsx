import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, Loader2 } from 'lucide-react';

interface CTAButtonProps {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const CTAButton = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  CTAButtonProps
>(
  (
    {
      label,
      onClick,
      href,
      variant = 'primary',
      size = 'md',
      icon,
      rightIcon = <ChevronRight size={18} />,
      loading = false,
      disabled = false,
      fullWidth = false,
      className,
      type = 'button',
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm gap-2',
      md: 'px-4 py-2.5 text-base gap-2',
      lg: 'px-6 py-3 text-base gap-2.5',
      xl: 'px-8 py-4 text-lg gap-3',
    };

    const variantClasses = {
      primary:
        'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50',
      secondary:
        'bg-slate-100 text-slate-900 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-50',
      tertiary:
        'bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50',
      danger:
        'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:opacity-50',
    };

    const baseClasses = cn(
      'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
      'disabled:cursor-not-allowed',
      sizeClasses[size],
      variantClasses[variant],
      fullWidth && 'w-full',
      loading && 'relative',
      className
    );

    const content = (
      <>
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <>
            {icon && <span className="flex-shrink-0">{icon}</span>}
            <span>{label}</span>
            {rightIcon && !loading && (
              <span className="flex-shrink-0">{rightIcon}</span>
            )}
          </>
        )}
      </>
    );

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={baseClasses}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        onClick={onClick}
        disabled={disabled || loading}
        className={baseClasses}
        type={type}
      >
        {content}
      </button>
    );
  }
);
CTAButton.displayName = 'CTAButton';
