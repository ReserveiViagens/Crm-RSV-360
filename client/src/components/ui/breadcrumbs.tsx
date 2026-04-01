import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
  separator?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export const Breadcrumbs = React.forwardRef<HTMLNavElement, BreadcrumbsProps>(
  (
    {
      items,
      className,
      showHome = true,
      onItemClick,
      separator = <ChevronRight size={16} className="text-[var(--rsv-text-tertiary)]" />,
      size = 'md',
    },
    ref
  ) => {
    const allItems = showHome
      ? [{ label: 'Início', href: '/', icon: <Home size={16} /> }, ...items]
      : items;

    return (
      <nav
        ref={ref}
        className={cn(
          'flex items-center gap-2 flex-wrap',
          'text-[var(--rsv-text-secondary)]',
          sizeClasses[size],
          className
        )}
        aria-label="Navegação por breadcrumb"
      >
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const isLink = item.href && !isLast;

          return (
            <React.Fragment key={index}>
              {/* Item */}
              {isLink ? (
                <Link
                  href={item.href}
                  onClick={() => onItemClick?.(item, index)}
                  className={cn(
                    'flex items-center gap-1',
                    'hover:text-[var(--rsv-action-blue)]',
                    'transition-colors duration-[var(--rsv-duration-fast)]',
                    'cursor-pointer'
                  )}
                >
                  {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <div
                  className={cn(
                    'flex items-center gap-1',
                    isLast && 'text-[var(--rsv-text-primary)] font-medium'
                  )}
                  onClick={() => onItemClick?.(item, index)}
                >
                  {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                  <span>{item.label}</span>
                </div>
              )}

              {/* Separator */}
              {!isLast && (
                <span className="flex-shrink-0 mx-1" aria-hidden="true">
                  {separator}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    );
  }
);

Breadcrumbs.displayName = 'Breadcrumbs';
