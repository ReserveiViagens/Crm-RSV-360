import React from 'react';
import { Star, Heart, BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  id: string;
  image: string;
  imageAlt: string;
  title: string;
  description?: string;
  originalPrice?: number;
  discountedPrice?: number;
  rating?: number;
  reviewCount?: number;
  badge?: {
    label: string;
    variant?: 'success' | 'warning' | 'error' | 'info';
  };
  verified?: boolean;
  isFavorite?: boolean;
  onFavoriteClick?: (id: string) => void;
  onClick?: (id: string) => void;
  children?: React.ReactNode;
  className?: string;
  imageClassName?: string;
  aspectRatio?: '4/3' | '16/9' | '1/1';
}

const badgeVariants = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
};

const aspectRatioClasses = {
  '4/3': 'aspect-[4/3]',
  '16/9': 'aspect-video',
  '1/1': 'aspect-square',
};

export const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  (
    {
      id,
      image,
      imageAlt,
      title,
      description,
      originalPrice,
      discountedPrice,
      rating,
      reviewCount,
      badge,
      verified,
      isFavorite,
      onFavoriteClick,
      onClick,
      children,
      className,
      imageClassName,
      aspectRatio = '4/3',
    },
    ref
  ) => {
    const discount = originalPrice && discountedPrice 
      ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
      : null;

    const finalPrice = discountedPrice || originalPrice;

    return (
      <div
        ref={ref}
        onClick={() => onClick?.(id)}
        className={cn(
          'group relative flex flex-col overflow-hidden rounded-lg',
          'border border-[var(--rsv-border-color)]',
          'bg-[var(--rsv-surface-base)]',
          'shadow-[var(--rsv-shadow-card)] hover:shadow-[var(--rsv-shadow-card-hover)]',
          'transition-all duration-[var(--rsv-duration-base)]',
          'hover:border-[var(--rsv-action-blue)] cursor-pointer',
          className
        )}
      >
        {/* IMAGE CONTAINER */}
        <div className="relative overflow-hidden">
          {/* Image */}
          <img
            src={image}
            alt={imageAlt}
            className={cn(
              'w-full object-cover',
              'transition-transform duration-[var(--rsv-duration-base)]',
              'group-hover:scale-105',
              aspectRatioClasses[aspectRatio],
              imageClassName
            )}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--rsv-duration-base)]" />

          {/* Badge (Top Left) */}
          {badge && (
            <div
              className={cn(
                'absolute top-3 left-3',
                'px-3 py-1.5 rounded-full',
                'text-xs font-semibold',
                'backdrop-blur-sm',
                badgeVariants[badge.variant || 'info']
              )}
            >
              {badge.label}
            </div>
          )}

          {/* Discount Badge (Top Right) */}
          {discount && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold">
              -{discount}%
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteClick?.(id);
            }}
            className={cn(
              'absolute bottom-3 right-3',
              'w-10 h-10 rounded-full',
              'flex items-center justify-center',
              'backdrop-blur-sm',
              'transition-all duration-[var(--rsv-duration-base)]',
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-white text-red-500 hover:bg-red-50'
            )}
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>

          {/* Verified Badge */}
          {verified && (
            <div className="absolute bottom-3 left-3 bg-green-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <BadgeCheck size={14} />
              Verificado
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex flex-col flex-1 p-4 gap-3">
          {/* Title */}
          <h3 className="font-semibold text-sm line-clamp-2 text-[var(--rsv-text-primary)]">
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-xs text-[var(--rsv-text-secondary)] line-clamp-2">
              {description}
            </p>
          )}

          {/* Rating */}
          {rating !== undefined && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={cn(
                      i < Math.floor(rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-[var(--rsv-border-color)]'
                    )}
                  />
                ))}
              </div>
              {reviewCount && (
                <span className="text-xs text-[var(--rsv-text-tertiary)]">
                  ({reviewCount})
                </span>
              )}
            </div>
          )}

          {/* Pricing */}
          {(originalPrice !== undefined || finalPrice !== undefined) && (
            <div className="flex items-baseline gap-2 mt-auto pt-2">
              {discountedPrice && originalPrice && (
                <>
                  <span className="text-sm font-bold text-[var(--rsv-action-blue)]">
                    R$ {discountedPrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-[var(--rsv-text-tertiary)] line-through">
                    R$ {originalPrice.toFixed(2)}
                  </span>
                </>
              )}
              {!discountedPrice && originalPrice && (
                <span className="text-sm font-bold text-[var(--rsv-text-primary)]">
                  R$ {originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          )}

          {/* Custom Children */}
          {children}
        </div>
      </div>
    );
  }
);

ProductCard.displayName = 'ProductCard';
