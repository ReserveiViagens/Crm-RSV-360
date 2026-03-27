import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Clock, XCircle, Info } from 'lucide-react';

type StatusType = 'success' | 'error' | 'warning' | 'info' | 'pending';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'filled' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const statusConfig = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    icon: CheckCircle2,
    bgFilled: 'bg-green-600',
    textFilled: 'text-white',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    icon: XCircle,
    bgFilled: 'bg-red-600',
    textFilled: 'text-white',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
    icon: AlertCircle,
    bgFilled: 'bg-yellow-600',
    textFilled: 'text-white',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    icon: Info,
    bgFilled: 'bg-blue-600',
    textFilled: 'text-white',
  },
  pending: {
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    text: 'text-slate-600',
    icon: Clock,
    bgFilled: 'bg-slate-600',
    textFilled: 'text-white',
  },
};

export const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  (
    {
      status,
      label,
      icon,
      children,
      className,
      variant = 'default',
      size = 'md',
      showIcon = true,
    },
    ref
  ) => {
    const config = statusConfig[status];
    const IconComponent = icon ? null : config.icon;

    const sizeClasses = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-base',
    };

    const iconSizes = {
      sm: 12,
      md: 14,
      lg: 16,
    };

    const variantClasses = {
      default: cn(config.bg, config.border, 'border'),
      filled: cn(config.bgFilled),
      subtle: cn(config.bg),
    };

    const textClasses = {
      default: config.text,
      filled: config.textFilled,
      subtle: config.text,
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-2 rounded-full font-medium transition-all',
          sizeClasses[size],
          variantClasses[variant],
          textClasses[variant],
          className
        )}
      >
        {showIcon && (
          <>
            {icon ? (
              icon
            ) : (
              IconComponent && <IconComponent size={iconSizes[size]} />
            )}
          </>
        )}
        <span>{label || children}</span>
      </div>
    );
  }
);
StatusBadge.displayName = 'StatusBadge';
