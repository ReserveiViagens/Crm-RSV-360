import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  align?: 'left' | 'center';
}

export const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  (
    { title, subtitle, action, className, align = 'left' },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-start justify-between gap-4',
          align === 'center' && 'flex-col items-center text-center',
          className
        )}
      >
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-slate-900">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
          )}
        </div>
        
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    );
  }
);
SectionHeader.displayName = 'SectionHeader';
