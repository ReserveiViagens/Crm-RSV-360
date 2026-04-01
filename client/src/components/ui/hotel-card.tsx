import React, { useState } from 'react';
import { MapPin, Wifi, UtensilsCrossed, Dumbbell, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RatingStars } from './rating-stars';

export interface HotelCardProps {
  /** Hotel name */
  title: string;
  /** Hotel images */
  images: string[];
  /** Location */
  location: string;
  /** Rating */
  rating: number;
  /** Number of reviews */
  reviewCount: number;
  /** Price per night */
  price: number;
  /** Discounted price */
  discountedPrice?: number;
  /** Amenities */
  amenities?: Array<'wifi' | 'restaurant' | 'gym'>;
  /** Badge text */
  badge?: string;
  /** Is favorite */
  isFavorite?: boolean;
  /** Callback when favorite is clicked */
  onFavoriteChange?: (isFavorite: boolean) => void;
  /** CSS class */
  className?: string;
}

const amenityIcons = {
  wifi: { icon: Wifi, label: 'WiFi' },
  restaurant: { icon: UtensilsCrossed, label: 'Restaurante' },
  gym: { icon: Dumbbell, label: 'Academia' },
};

export const HotelCard = React.forwardRef<
  HTMLDivElement,
  HotelCardProps
>(({
  title,
  images,
  location,
  rating,
  reviewCount,
  price,
  discountedPrice,
  amenities = [],
  badge,
  isFavorite: initialFavorite = false,
  onFavoriteChange,
  className,
}, ref) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const handleFavoriteClick = () => {
    const newFavorite = !isFavorite;
    setIsFavorite(newFavorite);
    onFavoriteChange?.(newFavorite);
  };

  const discount = discountedPrice
    ? Math.round(((price - discountedPrice) / price) * 100)
    : 0;

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow',
        className
      )}
    >
      {/* Image Carousel */}
      <div className="relative bg-slate-100 aspect-video overflow-hidden group">
        <img
          src={images[currentImageIndex]}
          alt={title}
          className="w-full h-full object-cover"
        />

        {/* Badge */}
        {badge && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            {badge}
          </div>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
            -{discount}%
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute bottom-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-slate-100 transition-colors"
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart
            size={20}
            className={cn(
              isFavorite
                ? 'fill-red-500 text-red-500'
                : 'text-slate-400'
            )}
          />
        </button>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Imagem anterior"
            >
              <ChevronLeft size={20} className="text-slate-700" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Próxima imagem"
            >
              <ChevronRight size={20} className="text-slate-700" />
            </button>
          </>
        )}

        {/* Image Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={cn(
                  'h-2 rounded-full transition-colors',
                  index === currentImageIndex
                    ? 'bg-white w-6'
                    : 'bg-white/50 w-2 hover:bg-white/70'
                )}
                aria-label={`Ir para imagem ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Rating */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-slate-900 text-sm flex-1 line-clamp-2">
            {title}
          </h3>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-slate-600 text-xs mb-3">
          <MapPin size={14} />
          <span className="line-clamp-1">{location}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <RatingStars
            rating={rating}
            size="xs"
            interactive={false}
          />
          <span className="text-xs text-slate-600">
            {rating.toFixed(1)} ({reviewCount})
          </span>
        </div>

        {/* Amenities */}
        {amenities.length > 0 && (
          <div className="flex gap-2 mb-3 flex-wrap">
            {amenities.map((amenity) => {
              const AmenityIcon = amenityIcons[amenity].icon;
              return (
                <div
                  key={amenity}
                  className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded text-xs text-slate-600"
                >
                  <AmenityIcon size={12} />
                  <span>{amenityIcons[amenity].label}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2">
          {discountedPrice ? (
            <>
              <span className="text-lg font-bold text-slate-900">
                R$ {discountedPrice.toLocaleString('pt-BR')}
              </span>
              <span className="text-sm text-slate-400 line-through">
                R$ {price.toLocaleString('pt-BR')}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-slate-900">
              R$ {price.toLocaleString('pt-BR')}
            </span>
          )}
          <span className="text-xs text-slate-500">/noite</span>
        </div>
      </div>
    </div>
  );
});

HotelCard.displayName = 'HotelCard';
