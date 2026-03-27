import React from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopbarProps {
  title?: string;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  onMenuToggle?: () => void;
  showMenu?: boolean;
  className?: string;
  variant?: 'default' | 'minimal' | 'elevated';
}

export const Topbar = React.forwardRef<HTMLDivElement, TopbarProps>(
  (
    {
      title,
      leftContent,
      rightContent,
      onMenuToggle,
      showMenu = false,
      className,
      variant = 'default',
    },
    ref
  ) => {
    const variants = {
      default: 'border-b border-slate-200 bg-white',
      minimal: 'bg-white',
      elevated: 'shadow-sm border-b border-slate-100 bg-white',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between h-16 px-6 gap-4',
          variants[variant],
          className
        )}
      >
        <div className="flex items-center gap-4 flex-1">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="p-2 hover:bg-slate-100 rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {showMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
          {leftContent || (title && <h1 className="text-lg font-semibold">{title}</h1>)}
        </div>

        {rightContent && <div className="flex items-center gap-2">{rightContent}</div>}
      </div>
    );
  }
);
Topbar.displayName = 'Topbar';
