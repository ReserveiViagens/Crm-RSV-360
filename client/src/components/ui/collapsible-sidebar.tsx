import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  children?: SidebarItem[];
}

interface CollapsibleSidebarProps {
  items: SidebarItem[];
  onItemClick?: (id: string) => void;
  defaultExpanded?: boolean;
  width?: number;
  collapsedWidth?: number;
  className?: string;
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
          'flex flex-col h-full bg-slate-50 border-r border-slate-200 transition-all duration-300',
          isExpanded ? `w-[${width}px]` : `w-[${collapsedWidth}px]`,
          className
        )}
        style={{
          width: isExpanded ? `${width}px` : `${collapsedWidth}px`,
        }}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
          {isExpanded && <span className="font-semibold text-slate-900">Menu</span>}
          <button
            onClick={toggleSidebar}
            className="p-1.5 hover:bg-slate-200 rounded-md transition-colors"
            aria-label="Toggle sidebar"
          >
            {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors',
                item.active
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-slate-600 hover:bg-slate-200'
              )}
              title={!isExpanded ? item.label : undefined}
            >
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              {isExpanded && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="h-16 border-t border-slate-200 flex items-center justify-center px-2">
          {isExpanded && (
            <span className="text-xs text-slate-500 text-center">v1.0</span>
          )}
        </div>
      </div>
    );
  }
);
CollapsibleSidebar.displayName = 'CollapsibleSidebar';
