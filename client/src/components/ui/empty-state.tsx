import React from 'react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
  variant?: 'default' | 'compact' | 'centered';
  size?: 'sm' | 'md' | 'lg';
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      icon,
      title,
      description,
      action,
      secondaryAction,
      className,
      variant = 'default',
      size = 'md',
    },
    ref
  ) => {
    const variants = {
      default: 'py-12 px-6',
      compact: 'py-8 px-6',
      centered: 'py-16 px-6 flex items-center justify-center min-h-96',
    };

    const sizeClasses = {
      sm: {
        icon: 'w-10 h-10 mb-3',
        title: 'text-lg',
        description: 'text-sm',
      },
      md: {
        icon: 'w-16 h-16 mb-4',
        title: 'text-xl',
        description: 'text-base',
      },
      lg: {
        icon: 'w-24 h-24 mb-6',
        title: 'text-2xl',
        description: 'text-lg',
      },
    };

    const sizeConfig = sizeClasses[size];

    const renderLink = (
      actionConfig: { label: string; onClick?: () => void; href?: string },
      isSecondary?: boolean
    ) => {
      const baseClasses = cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all rounded-lg',
        'px-4 py-2.5 text-sm'
      );

      const primaryClasses = 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md';
      const secondaryClasses = 'border border-slate-300 text-slate-700 hover:bg-slate-50';

      const classes = cn(
        baseClasses,
        isSecondary ? secondaryClasses : primaryClasses
      );

      if (actionConfig.href) {
        return (
          <a href={actionConfig.href} className={classes}>
            {actionConfig.label}
          </a>
        );
      }

      return (
        <button onClick={actionConfig.onClick} className={classes}>
          {actionConfig.label}
        </button>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(
          'text-center',
          variants[variant],
          className
        )}
      >
        {icon && (
          <div className={cn(
            'mx-auto text-slate-300',
            sizeConfig.icon
          )}>
            {icon}
          </div>
        )}

        <h3 className={cn(
          'font-semibold text-slate-900 mb-2',
          sizeConfig.title
        )}>
          {title}
        </h3>

        {description && (
          <p className={cn(
            'text-slate-600 mb-6 max-w-sm mx-auto',
            sizeConfig.description
          )}>
            {description}
          </p>
        )}

        {(action || secondaryAction) && (
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {action && renderLink(action, false)}
            {secondaryAction && renderLink(secondaryAction, true)}
          </div>
        )}
      </div>
    );
  }
);
EmptyState.displayName = 'EmptyState';
