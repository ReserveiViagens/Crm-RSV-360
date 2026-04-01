import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RatingStarsProps {
  /** Rating value (0-5) */
  rating?: number;
  /** Show half stars */
  allowHalf?: boolean;
  /** Interactive mode */
  interactive?: boolean;
  /** Callback when rating changes */
  onChange?: (rating: number) => void;
  /** Size of stars */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Color of stars */
  color?: string;
  /** Show review count */
  showCount?: boolean;
  /** Number of reviews */
  reviewCount?: number;
  /** Disable the component */
  disabled?: boolean;
  /** CSS class */
  className?: string;
}

const sizeMap = {
  xs: { star: 14, gap: 2 },
  sm: { star: 16, gap: 3 },
  md: { star: 20, gap: 4 },
  lg: { star: 24, gap: 6 },
};

export const RatingStars = React.forwardRef<
  HTMLDivElement,
  RatingStarsProps
>(({
  rating = 0,
  allowHalf = false,
  interactive = false,
  onChange,
  size = 'md',
  color = '#FFA500',
  showCount = false,
  reviewCount = 0,
  disabled = false,
  className,
}, ref) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [localRating, setLocalRating] = useState(rating);

  const displayRating = hoverRating !== null ? hoverRating : localRating;
  const { star: starSize, gap: gapSize } = sizeMap[size];

  const handleMouseMove = (index: number, event: React.MouseEvent) => {
    if (!interactive || disabled) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const isLeftHalf = x < rect.width / 2;

    const newRating = allowHalf
      ? index + (isLeftHalf ? 0.5 : 1)
      : index + 1;

    setHoverRating(newRating);
  };

  const handleClick = (index: number, event: React.MouseEvent) => {
    if (!interactive || disabled) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const isLeftHalf = x < rect.width / 2;

    const newRating = allowHalf
      ? index + (isLeftHalf ? 0.5 : 1)
      : index + 1;

    setLocalRating(newRating);
    onChange?.(newRating);
  };

  const handleMouseLeave = () => {
    setHoverRating(null);
  };

  return (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center gap-2',
        className
      )}
    >
      <div
        className="flex items-center"
        style={{ gap: gapSize }}
        onMouseLeave={handleMouseLeave}
      >
        {[0, 1, 2, 3, 4].map((index) => {
          const isFilled = displayRating >= index + 1;
          const isHalf = displayRating > index && displayRating < index + 1;

          return (
            <div
              key={index}
              className={cn(
                'relative',
                interactive && !disabled && 'cursor-pointer transition-transform hover:scale-110'
              )}
              onMouseMove={(e) => handleMouseMove(index, e)}
              onClick={(e) => handleClick(index, e)}
              style={{
                width: starSize,
                height: starSize,
              }}
            >
              {/* Background star */}
              <Star
                size={starSize}
                className="text-slate-300 absolute inset-0"
              />

              {/* Filled star */}
              {(isFilled || isHalf) && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    width: isHalf ? '50%' : '100%',
                  }}
                >
                  <Star
                    size={starSize}
                    className="text-yellow-400"
                    style={{ fill: color }}
                    fill={color}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showCount && (
        <span className="text-xs text-slate-600 ml-1">
          {displayRating.toFixed(allowHalf ? 1 : 0)} ({reviewCount})
        </span>
      )}
    </div>
  );
});

RatingStars.displayName = 'RatingStars';
