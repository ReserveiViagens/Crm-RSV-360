import React from 'react';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  onClick?: () => void;
  active?: boolean;
}

interface BottomNavigationProps {
  items: NavItem[];
  onItemClick?: (id: string) => void;
  className?: string;
}

export const BottomNavigation = React.forwardRef<HTMLDivElement, BottomNavigationProps>(
  ({ items, onItemClick, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around px-2',
          'md:hidden',
          className
        )}
      >
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick?.(item.id)}
            className={cn(
              'flex flex-col items-center justify-center w-16 h-16 relative rounded-lg transition-colors',
              item.active
                ? 'text-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            )}
            aria-label={item.label}
          >
            <span className="flex items-center justify-center">{item.icon}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            )}
            <span className="text-xs mt-1 text-center leading-tight">{item.label}</span>
          </button>
        ))}
      </div>
    );
  }
);
BottomNavigation.displayName = 'BottomNavigation';
