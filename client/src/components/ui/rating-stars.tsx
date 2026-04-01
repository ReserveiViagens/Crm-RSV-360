import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  fillColor?: string;
  emptyColor?: string;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showLabel?: boolean;
  reviewCount?: number;
  className?: string;
}

const sizeMap = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 24,
};

export const RatingStars = React.forwardRef<HTMLDivElement, RatingStarsProps>(
  (
    {
      rating,
      maxRating = 5,
      size = 'md',
      fillColor = 'fill-yellow-400 text-yellow-400',
      emptyColor = 'text-[var(--rsv-border-color)]',
      interactive = false,
      onRatingChange,
      showLabel = false,
      reviewCount,
      className,
    },
    ref
  ) => {
    const [hoverRating, setHoverRating] = React.useState<number | null>(null);
    const displayRating = hoverRating !== null ? hoverRating : rating;
    const pixelSize = sizeMap[size];

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-1',
          interactive && 'cursor-pointer',
          className
        )}
      >
        {/* Stars */}
        <div className="flex items-center gap-0.5">
          {Array.from({ length: maxRating }).map((_, index) => {
            const starRating = index + 1;
            const isFilled = starRating <= Math.floor(displayRating);
            const isHalfFilled = starRating - 0.5 <= displayRating && starRating > displayRating;

            return (
              <button
                key={index}
                type="button"
                disabled={!interactive}
                onMouseEnter={() => interactive && setHoverRating(starRating)}
                onMouseLeave={() => interactive && setHoverRating(null)}
                onClick={() => interactive && onRatingChange?.(starRating)}
                className={cn(
                  'transition-transform duration-[var(--rsv-duration-fast)]',
                  interactive && 'hover:scale-110',
                  !interactive && 'cursor-default'
                )}
                aria-label={`Rate ${starRating} out of ${maxRating}`}
              >
                {isFilled ? (
                  <Star
                    size={pixelSize}
                    className={cn('transition-colors duration-[var(--rsv-duration-fast)]', fillColor)}
                    fill="currentColor"
                  />
                ) : isHalfFilled ? (
                  <div className="relative">
                    <Star
                      size={pixelSize}
                      className={cn('transition-colors duration-[var(--rsv-duration-fast)]', emptyColor)}
                    />
                    <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                      <Star
                        size={pixelSize}
                        className={cn('transition-colors duration-[var(--rsv-duration-fast)]', fillColor)}
                        fill="currentColor"
                      />
                    </div>
                  </div>
                ) : (
                  <Star
                    size={pixelSize}
                    className={cn('transition-colors duration-[var(--rsv-duration-fast)]', emptyColor)}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Label */}
        {(showLabel || reviewCount) && (
          <div className="flex items-center gap-1.5 ml-1">
            {showLabel && (
              <span className="text-sm font-medium text-[var(--rsv-text-primary)]">
                {displayRating.toFixed(1)}
              </span>
            )}
            {reviewCount !== undefined && (
              <span className="text-xs text-[var(--rsv-text-tertiary)]">
                ({reviewCount})
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

RatingStars.displayName = 'RatingStars';
