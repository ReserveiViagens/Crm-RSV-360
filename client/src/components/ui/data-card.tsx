import React from 'react';
import { cn } from '@/lib/utils';

export interface DataCardProps {
  title: string;
  description?: string;
  image?: React.ReactNode;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outlined' | 'flat';
  onClick?: () => void;
}

export const DataCard = React.forwardRef<HTMLDivElement, DataCardProps>(
  (
    {
      title,
      description,
      image,
      badge,
      action,
      className,
      variant = 'default',
      onClick,
    },
    ref
  ) => {
    const variants = {
      default: 'bg-white border border-slate-200 shadow-sm hover:shadow-md',
      outlined: 'bg-transparent border border-slate-300 hover:border-slate-400',
      flat: 'bg-slate-50 border border-slate-100 hover:bg-slate-100',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg overflow-hidden transition-all duration-200 cursor-pointer',
          variants[variant],
          onClick && 'hover:shadow-lg',
          className
        )}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onClick();
                }
              }
            : undefined
        }
      >
        {image && (
          <div className="relative w-full bg-slate-100 overflow-hidden">
            {image}
          </div>
        )}

        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">{title}</h3>
              {description && (
                <p className="text-sm text-slate-600 mt-1">{description}</p>
              )}
            </div>
            {badge && <div className="flex-shrink-0">{badge}</div>}
          </div>

          {action && <div className="mt-2">{action}</div>}
        </div>
      </div>
    );
  }
);
DataCard.displayName = 'DataCard';
