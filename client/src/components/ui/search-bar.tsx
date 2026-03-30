import React from 'react';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';

export interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'minimal' | 'elevated';
  size?: 'sm' | 'md' | 'lg';
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      value = '',
      onChange,
      onSearch,
      onClear,
      placeholder = 'Buscar...',
      disabled = false,
      className,
      variant = 'default',
      size = 'md',
    },
    ref
  ) => {
    const variants = {
      default: 'bg-white border border-slate-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500',
      minimal: 'bg-transparent border-b border-slate-200 focus-within:border-slate-900',
      elevated: 'bg-slate-50 border border-slate-200 shadow-sm focus-within:bg-white',
    };

    const sizes = {
      sm: 'h-9 text-sm',
      md: 'h-10 text-base',
      lg: 'h-12 text-base',
    };

    const paddingSizes = {
      sm: 'px-3 py-2',
      md: 'px-4 py-2',
      lg: 'px-4 py-3',
    };

    const iconSizes = {
      sm: 16,
      md: 18,
      lg: 20,
    };

    return (
      <div
        className={cn(
          'flex items-center gap-2 rounded-lg transition-all',
          variants[variant],
          sizes[size],
          paddingSizes[size],
          disabled && 'opacity-50 cursor-not-allowed bg-slate-50',
          className
        )}
      >
        <Search size={iconSizes[size]} className="text-slate-400 flex-shrink-0" />
        
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSearch?.(value);
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'flex-1 bg-transparent outline-none placeholder-slate-400 text-slate-900',
            'disabled:cursor-not-allowed'
          )}
        />

        {value && !disabled && (
          <button
            onClick={() => {
              onChange?.('');
              onClear?.();
            }}
            className="p-1 hover:bg-slate-100 rounded transition-colors flex-shrink-0"
            aria-label="Limpar busca"
          >
            <X size={iconSizes[size]} className="text-slate-400" />
          </button>
        )}
      </div>
    );
  }
);
SearchBar.displayName = 'SearchBar';
