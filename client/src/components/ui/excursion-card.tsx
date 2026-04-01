import React from 'react';
import { Clock, MapPin, Users, Heart, BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RatingStars } from './rating-stars';
import { PriceDisplay } from './price-display';

interface ExcursionCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  startPoint: string;
  duration: string;
  durationMinutes: number;
  groupSize: number;
  maxGroupSize: number;
  rating: number;
  reviewCount: number;
  originalPrice?: number;
  discountedPrice?: number;
  includes: string[];
  organizer?: string;
  verified?: boolean;
  isFavorite?: boolean;
  onFavoriteClick?: (id: string) => void;
  onClick?: (id: string) => void;
  onBookClick?: (id: string) => void;
  className?: string;
  badge?: {
    label: string;
    variant?: 'success' | 'warning' | 'error' | 'info';
  };
}

const badgeVariants = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
};

export const ExcursionCard = React.forwardRef<HTMLDivElement, ExcursionCardProps>(
  (
    {
      id,
      name,
      description,
      image,
      imageAlt,
      startPoint,
      duration,
      durationMinutes,
      groupSize,
      maxGroupSize,
      rating,
      reviewCount,
      originalPrice,
      discountedPrice,
      includes,
      organizer,
      verified,
      isFavorite,
      onFavoriteClick,
      onClick,
      onBookClick,
      className,
      badge,
    },
    ref
  ) => {
    const discount = originalPrice && discountedPrice
      ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
      : null;

    const availableSpots = maxGroupSize - groupSize;
    const spotsPercentage = (availableSpots / maxGroupSize) * 100;
    const urgentSpaces = availableSpots <= 3;

    return (
      <div
        ref={ref}
        onClick={() => onClick?.(id)}
        className={cn(
          'group flex flex-col overflow-hidden rounded-lg',
          'bg-[var(--rsv-surface-base)] border border-[var(--rsv-border-color)]',
          'shadow-[var(--rsv-shadow-card)] hover:shadow-[var(--rsv-shadow-lg)]',
          'transition-all duration-[var(--rsv-duration-base)]',
          'hover:border-[var(--rsv-action-blue)] cursor-pointer',
          urgentSpaces && 'ring-2 ring-[var(--rsv-warning)]/20',
          className
        )}
      >
        {/* IMAGE CONTAINER */}
        <div className="relative overflow-hidden bg-[var(--rsv-surface-dim)]">
          <img
            src={image}
            alt={imageAlt}
            className="w-full aspect-video object-cover transition-transform duration-[var(--rsv-duration-base)] group-hover:scale-105"
          />

          {/* Badge */}
          {badge && (
            <div
              className={cn(
                'absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm',
                badgeVariants[badge.variant || 'info']
              )}
            >
              {badge.label}
            </div>
          )}

          {/* Discount Badge */}
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
              'absolute bottom-3 right-3 w-10 h-10 rounded-full',
              'flex items-center justify-center backdrop-blur-sm',
              'transition-all duration-[var(--rsv-duration-base)]',
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-white text-red-500 hover:bg-red-50'
            )}
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>

          {/* Urgent Indicator */}
          {urgentSpaces && (
            <div className="absolute bottom-3 left-3 bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-semibold">
              Últimas {availableSpots} vagas!
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex flex-col flex-1 p-4 gap-3">
          {/* Title & Description */}
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-base line-clamp-1 text-[var(--rsv-text-primary)] flex-1">
                {name}
              </h3>
              {verified && (
                <BadgeCheck size={18} className="text-green-600 flex-shrink-0" />
              )}
            </div>
            {description && (
              <p className="text-xs text-[var(--rsv-text-secondary)] line-clamp-2 mt-1">
                {description}
              </p>
            )}
          </div>

          {/* Key Info Row 1: Duration & Start Point */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 text-xs text-[var(--rsv-text-secondary)]">
              <Clock size={14} className="flex-shrink-0 text-[var(--rsv-action-blue)]" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--rsv-text-secondary)] line-clamp-1">
              <MapPin size={14} className="flex-shrink-0 text-[var(--rsv-action-blue)]" />
              <span className="line-clamp-1">{startPoint}</span>
            </div>
          </div>

          {/* Rating */}
          <div>
            <RatingStars
              rating={rating}
              size="sm"
              showLabel
              reviewCount={reviewCount}
            />
          </div>

          {/* Organizer */}
          {organizer && (
            <p className="text-xs text-[var(--rsv-text-tertiary)]">
              Por <span className="font-medium">{organizer}</span>
            </p>
          )}

          {/* Includes */}
          {includes.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {includes.slice(0, 2).map((item, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 bg-[var(--rsv-surface-alt)] text-[var(--rsv-text-secondary)] rounded-md line-clamp-1"
                >
                  {item}
                </span>
              ))}
              {includes.length > 2 && (
                <span className="text-xs text-[var(--rsv-text-tertiary)] px-2 py-1">
                  +{includes.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Group Size & Availability */}
          <div className="bg-[var(--rsv-surface-alt)] rounded-md p-2.5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--rsv-text-primary)]">
                <Users size={14} />
                <span>{groupSize} pessoas inscritas</span>
              </div>
              <span
                className={cn(
                  'text-xs font-semibold',
                  urgentSpaces
                    ? 'text-red-700 bg-red-100 px-2 py-0.5 rounded-full'
                    : 'text-[var(--rsv-success-dark)]'
                )}
              >
                {availableSpots}/{maxGroupSize} vagas
              </span>
            </div>
            <div className="w-full h-1.5 bg-[var(--rsv-border-color)] rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-500',
                  urgentSpaces
                    ? 'bg-gradient-to-r from-[var(--rsv-warning)] to-[var(--rsv-error)]'
                    : 'bg-[var(--rsv-success)]'
                )}
                style={{ width: `${spotsPercentage}%` }}
              />
            </div>
          </div>

          {/* Pricing & Book Button */}
          {(originalPrice || discountedPrice) && (
            <div className="mt-auto pt-3 border-t border-[var(--rsv-border-color)]">
              <div className="flex items-center justify-between gap-3">
                <PriceDisplay
                  originalPrice={originalPrice}
                  discountedPrice={discountedPrice}
                  size="md"
                  layout="horizontal"
                />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBookClick?.(id);
                }}
                className="w-full mt-3 py-2 px-4 bg-[var(--rsv-action-blue)] text-white rounded-md font-semibold text-sm hover:bg-[var(--rsv-deep-blue)] transition-colors duration-[var(--rsv-duration-base)]"
              >
                Reservar Agora
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

ExcursionCard.displayName = 'ExcursionCard';
