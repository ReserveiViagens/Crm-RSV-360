import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'minimal' | 'compact';
}

export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  (
    { title, description, action, breadcrumb, className, variant = 'default' },
    ref
  ) => {
    const variants = {
      default: 'py-8 px-6',
      minimal: 'py-6 px-6',
      compact: 'py-4 px-6',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'border-b border-slate-200 bg-white',
          variants[variant],
          className
        )}
      >
        {breadcrumb && <div className="mb-4">{breadcrumb}</div>}
        
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className={cn(
              'font-semibold text-slate-900',
              variant === 'compact' ? 'text-xl' : 'text-2xl'
            )}>
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-sm text-slate-600">{description}</p>
            )}
          </div>
          
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      </div>
    );
  }
);
PageHeader.displayName = 'PageHeader';
