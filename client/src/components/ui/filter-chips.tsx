import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface FilterChipsProps {
  options: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
  }>;
  selected?: string | string[];
  onChange?: (selected: string | string[]) => void;
  onRemove?: (id: string) => void;
  multiple?: boolean;
  clearable?: boolean;
  className?: string;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export const FilterChips = React.forwardRef<HTMLDivElement, FilterChipsProps>(
  (
    {
      options,
      selected = '',
      onChange,
      onRemove,
      multiple = false,
      clearable = true,
      className,
      variant = 'default',
      size = 'md',
      disabled = false,
    },
    ref
  ) => {
    const selectedArray = Array.isArray(selected) ? selected : [selected];

    const sizeClasses = {
      sm: 'px-3 py-1 text-xs gap-1',
      md: 'px-3 py-1.5 text-sm gap-1.5',
      lg: 'px-4 py-2 text-base gap-2',
    };

    const getChipClass = (isSelected: boolean) => {
      const baseClasses = cn(
        'inline-flex items-center gap-2 rounded-full transition-all cursor-pointer whitespace-nowrap',
        sizeClasses[size],
        disabled && 'opacity-50 cursor-not-allowed'
      );

      const variants = {
        default: isSelected
          ? 'bg-blue-500 text-white'
          : 'bg-slate-100 text-slate-900 hover:bg-slate-200',
        filled: isSelected
          ? 'bg-blue-600 text-white'
          : 'bg-slate-200 text-slate-700 hover:bg-slate-300',
        outlined: isSelected
          ? 'bg-blue-50 border border-blue-500 text-blue-600'
          : 'border border-slate-300 text-slate-700 hover:border-slate-400',
      };

      return cn(baseClasses, variants[variant]);
    };

    const handleClick = (id: string) => {
      if (disabled) return;

      if (multiple) {
        const newSelected = selectedArray.includes(id)
          ? selectedArray.filter((s) => s !== id)
          : [...selectedArray, id];
        onChange?.(newSelected);
      } else {
        onChange?.(selectedArray[0] === id ? '' : id);
      }
    };

    const handleRemove = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      onRemove?.(id);
    };

    return (
      <div ref={ref} className={cn('flex flex-wrap gap-2', className)}>
        {options.map((option) => {
          const isSelected = selectedArray.includes(option.id);
          return (
            <button
              key={option.id}
              onClick={() => handleClick(option.id)}
              disabled={disabled}
              className={getChipClass(isSelected)}
              aria-pressed={isSelected}
              type="button"
            >
              {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
              <span>{option.label}</span>
              {clearable && isSelected && (
                <button
                  onClick={(e) => handleRemove(option.id, e)}
                  className="ml-1 hover:opacity-70 transition-opacity"
                  aria-label={`Remover ${option.label}`}
                  type="button"
                >
                  <X size={14} />
                </button>
              )}
            </button>
          );
        })}
      </div>
    );
  }
);
FilterChips.displayName = 'FilterChips';
