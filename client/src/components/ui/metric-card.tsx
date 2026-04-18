import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown } from 'lucide-react';

export interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period?: string;
  };
  icon?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'minimal' | 'highlight';
}

export const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  (
    { label, value, unit, change, icon, className, variant = 'default' },
    ref
  ) => {
    const variants = {
      default: 'bg-white border border-slate-200 shadow-sm',
      minimal: 'bg-slate-50 border border-slate-100',
      highlight: 'bg-blue-50 border border-blue-200',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'p-6 rounded-lg transition-all hover:shadow-md',
          variants[variant],
          className
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600">{label}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-slate-900">
                {value}
              </span>
              {unit && <span className="text-sm text-slate-600">{unit}</span>}
            </div>

            {change && (
              <div className="mt-3 flex items-center gap-1">
                {change.type === 'increase' ? (
                  <ArrowUp size={16} className="text-green-600" />
                ) : (
                  <ArrowDown size={16} className="text-red-600" />
                )}
                <span
                  className={cn(
                    'text-xs font-medium',
                    change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {change.type === 'increase' ? '+' : '-'}
                  {Math.abs(change.value)}%
                  {change.period && ` ${change.period}`}
                </span>
              </div>
            )}
          </div>

          {icon && (
            <div className="flex-shrink-0 p-2 rounded-md bg-slate-100 text-slate-600">
              {icon}
            </div>
          )}
        </div>
      </div>
    );
  }
);
MetricCard.displayName = 'MetricCard';
