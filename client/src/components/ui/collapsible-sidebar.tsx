import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  badge?: string | number;
  children?: SidebarItem[];
}

interface CollapsibleSidebarProps {
  items: SidebarItem[];
  onItemClick?: (id: string) => void;
  defaultExpanded?: boolean;
  width?: number;
  collapsedWidth?: number;
  className?: string;
  title?: string;
  showFooter?: boolean;
}

export const CollapsibleSidebar = React.forwardRef<HTMLDivElement, CollapsibleSidebarProps>(
  (
    {
      items,
      onItemClick,
      defaultExpanded = true,
      width = 280,
      collapsedWidth = 80,
      className,
      title = 'Menu',
      showFooter = true,
    },
    ref
  ) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    const toggleSidebar = () => {
      setIsExpanded(!isExpanded);
    };

    const handleItemClick = (id: string) => {
      onItemClick?.(id);
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col h-full',
          'bg-[var(--rsv-surface-base)]',
          'border-r border-[var(--rsv-border-color)]',
          'transition-all duration-[var(--rsv-duration-base)]',
          className
        )}
        style={{
          width: isExpanded ? `${width}px` : `${collapsedWidth}px`,
        }}
      >
        {/* Header */}
        <div
          className={cn(
            'flex items-center justify-between h-16 px-4',
            'border-b border-[var(--rsv-border-color)]'
          )}
        >
          {isExpanded && (
            <span className="font-semibold text-[var(--rsv-text-primary)]">
              {title}
            </span>
          )}
          <button
            onClick={toggleSidebar}
            className={cn(
              'p-1.5',
              'hover:bg-[var(--rsv-surface-alt)]',
              'rounded-md transition-colors duration-[var(--rsv-duration-fast)]',
              'text-[var(--rsv-text-secondary)]'
            )}
            aria-label="Toggle sidebar"
          >
            {isExpanded ? (
              <ChevronLeft size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-[var(--rsv-space-4)] px-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={cn(
                'w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-md',
                'transition-colors duration-[var(--rsv-duration-fast)]',
                item.active
                  ? 'bg-[var(--rsv-info-light)] text-[var(--rsv-info-dark)] font-medium'
                  : cn(
                      'text-[var(--rsv-text-secondary)]',
                      'hover:bg-[var(--rsv-surface-alt)]'
                    )
              )}
              title={!isExpanded ? item.label : undefined}
            >
              <div className="flex items-center gap-3 min-w-0">
                {item.icon && (
                  <span className="flex-shrink-0">{item.icon}</span>
                )}
                {isExpanded && (
                  <span className="truncate text-sm">{item.label}</span>
                )}
              </div>
              {item.badge && isExpanded && (
                <span className="flex-shrink-0 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        {showFooter && (
          <div
            className={cn(
              'h-16',
              'border-t border-[var(--rsv-border-color)]',
              'flex items-center justify-center px-2'
            )}
          >
            {isExpanded && (
              <span className="text-xs text-[var(--rsv-text-tertiary)] text-center">
                © RSV 360
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);
CollapsibleSidebar.displayName = 'CollapsibleSidebar';
