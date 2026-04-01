import React from 'react';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  originalPrice?: number;
  discountedPrice?: number;
  currentPrice?: number;
  currency?: string;
  showDiscount?: boolean;
  layout?: 'horizontal' | 'vertical' | 'compact';
  className?: string;
  priceClassName?: string;
  originalPriceClassName?: string;
  discountClassName?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: {
    current: 'text-sm font-semibold',
    original: 'text-xs',
    discount: 'text-xs',
  },
  md: {
    current: 'text-lg font-bold',
    original: 'text-sm',
    discount: 'text-sm',
  },
  lg: {
    current: 'text-2xl font-bold',
    original: 'text-base',
    discount: 'text-base',
  },
};

export const PriceDisplay = React.forwardRef<HTMLDivElement, PriceDisplayProps>(
  (
    {
      originalPrice,
      discountedPrice,
      currentPrice,
      currency = 'R$',
      showDiscount = true,
      layout = 'horizontal',
      className,
      priceClassName,
      originalPriceClassName,
      discountClassName,
      size = 'md',
    },
    ref
  ) => {
    const displayPrice = currentPrice || discountedPrice || originalPrice;
    const hasDiscount = discountedPrice && originalPrice && discountedPrice < originalPrice;
    const discountPercent = hasDiscount
      ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
      : null;

    const layoutClasses = {
      horizontal: 'flex items-baseline gap-3',
      vertical: 'flex flex-col gap-1',
      compact: 'flex items-center gap-2',
    };

    return (
      <div
        ref={ref}
        className={cn(layoutClasses[layout], className)}
      >
        {/* Current Price */}
        {displayPrice && (
          <span
            className={cn(
              'font-bold text-[var(--rsv-action-blue)]',
              sizeClasses[size].current,
              priceClassName
            )}
          >
            {currency} {displayPrice.toFixed(2).replace('.', ',')}
          </span>
        )}

        {/* Original Price (Strikethrough) */}
        {hasDiscount && originalPrice && (
          <span
            className={cn(
              'text-[var(--rsv-text-tertiary)] line-through',
              sizeClasses[size].original,
              originalPriceClassName
            )}
          >
            {currency} {originalPrice.toFixed(2).replace('.', ',')}
          </span>
        )}

        {/* Discount Badge */}
        {hasDiscount && showDiscount && discountPercent && (
          <span
            className={cn(
              'bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold',
              sizeClasses[size].discount,
              discountClassName
            )}
          >
            -{discountPercent}%
          </span>
        )}
      </div>
    );
  }
);

PriceDisplay.displayName = 'PriceDisplay';
