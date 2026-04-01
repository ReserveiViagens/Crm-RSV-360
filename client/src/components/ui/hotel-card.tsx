import React from 'react';
import { MapPin, Wifi, Utensils, Dumbbell, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RatingStars } from './rating-stars';
import { PriceDisplay } from './price-display';

interface HotelCardProps {
  id: string;
  name: string;
  location: string;
  city: string;
  rating: number;
  reviewCount: number;
  originalPrice?: number;
  discountedPrice?: number;
  amenities: Array<{
    icon: React.ReactNode;
    label: string;
  }>;
  images: string[];
  badge?: {
    label: string;
    variant?: 'success' | 'warning' | 'error' | 'info';
  };
  isFavorite?: boolean;
  onFavoriteClick?: (id: string) => void;
  onClick?: (id: string) => void;
  className?: string;
}

const badgeVariants = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
};

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi size={16} />,
  restaurant: <Utensils size={16} />,
  gym: <Dumbbell size={16} />,
};

export const HotelCard = React.forwardRef<HTMLDivElement, HotelCardProps>(
  (
    {
      id,
      name,
      location,
      city,
      rating,
      reviewCount,
      originalPrice,
      discountedPrice,
      amenities,
      images,
      badge,
      isFavorite,
      onFavoriteClick,
      onClick,
      className,
    },
    ref
  ) => {
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
    const [isHovered, setIsHovered] = React.useState(false);

    const discount = originalPrice && discountedPrice
      ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
      : null;

    const handlePrevImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentImageIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      );
    };

    const handleNextImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    };

    return (
      <div
        ref={ref}
        onClick={() => onClick?.(id)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'group flex flex-col overflow-hidden rounded-xl',
          'bg-[var(--rsv-surface-base)]',
          'border border-[var(--rsv-border-color)]',
          'shadow-[var(--rsv-shadow-card)] hover:shadow-[var(--rsv-shadow-lg)]',
          'transition-all duration-[var(--rsv-duration-base)]',
          'hover:border-[var(--rsv-action-blue)] cursor-pointer',
          'w-full',
          className
        )}
      >
        {/* IMAGE CAROUSEL */}
        <div className="relative overflow-hidden bg-[var(--rsv-surface-dim)]">
          {/* Main Image */}
          <img
            src={images[currentImageIndex]}
            alt={name}
            className="w-full aspect-[4/3] object-cover transition-transform duration-[var(--rsv-duration-base)] group-hover:scale-105"
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

          {/* Image Thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-3 flex gap-1.5">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={cn(
                    'w-2 h-2 rounded-full transition-all duration-[var(--rsv-duration-base)]',
                    index === currentImageIndex
                      ? 'bg-white w-6'
                      : 'bg-white/50 hover:bg-white/75'
                  )}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--rsv-duration-base)]"
                aria-label="Previous image"
              >
                ←
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--rsv-duration-base)]"
                aria-label="Next image"
              >
                →
              </button>
            </>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex flex-col flex-1 p-4 gap-3">
          {/* Title & Location */}
          <div>
            <h3 className="font-semibold text-base line-clamp-1 text-[var(--rsv-text-primary)]">
              {name}
            </h3>
            <p className="text-xs text-[var(--rsv-text-secondary)] flex items-center gap-1 mt-1">
              <MapPin size={14} />
              {location}, {city}
            </p>
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

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {amenities.slice(0, 3).map((amenity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-[var(--rsv-surface-alt)] rounded-md text-xs text-[var(--rsv-text-secondary)] hover:bg-[var(--rsv-surface-dim)] transition-colors"
                  title={amenity.label}
                >
                  {amenity.icon}
                  <span className="hidden sm:inline">{amenity.label}</span>
                </div>
              ))}
              {amenities.length > 3 && (
                <div className="text-xs text-[var(--rsv-text-tertiary)] px-2.5 py-1.5">
                  +{amenities.length - 3} mais
                </div>
              )}
            </div>
          )}

          {/* Pricing */}
          {(originalPrice || discountedPrice) && (
            <div className="mt-auto pt-3 border-t border-[var(--rsv-border-color)]">
              <p className="text-xs text-[var(--rsv-text-tertiary)] mb-1">Preço por noite</p>
              <PriceDisplay
                originalPrice={originalPrice}
                discountedPrice={discountedPrice}
                size="md"
                layout="horizontal"
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);

HotelCard.displayName = 'HotelCard';
