import React from 'react';
import { MapPin, Clock, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RatingStars } from './rating-stars';

export interface ExcursionCardProps {
  /** Excursion name */
  title: string;
  /** Excursion description */
  description: string;
  /** Duration in minutes */
  duration: number;
  /** Starting point */
  startingPoint: string;
  /** Rating */
  rating: number;
  /** Number of reviews */
  reviewCount: number;
  /** Price per person */
  price: number;
  /** Total available spots */
  totalSpots: number;
  /** Remaining available spots */
  remainingSpots: number;
  /** Organizer name */
  organizer: string;
  /** Is organizer verified */
  isOrganizerVerified?: boolean;
  /** Included items */
  included?: string[];
  /** Image URL */
  image?: string;
  /** On book click */
  onBook?: () => void;
  /** CSS class */
  className?: string;
}

export const ExcursionCard = React.forwardRef<
  HTMLDivElement,
  ExcursionCardProps
>(({
  title,
  description,
  duration,
  startingPoint,
  rating,
  reviewCount,
  price,
  totalSpots,
  remainingSpots,
  organizer,
  isOrganizerVerified = true,
  included = [],
  image,
  onBook,
  className,
}, ref) => {
  const occupancyPercent = Math.round(((totalSpots - remainingSpots) / totalSpots) * 100);
  const isLowStock = remainingSpots <= 2;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow',
        className
      )}
    >
      {/* Image */}
      {image && (
        <div className="relative h-48 overflow-hidden bg-slate-100">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Title and Organizer */}
        <div className="mb-2">
          <h3 className="font-bold text-slate-900 text-base mb-1 line-clamp-2">
            {title}
          </h3>
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-600">{organizer}</span>
            {isOrganizerVerified && (
              <CheckCircle size={14} className="text-blue-600 flex-shrink-0" />
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 mb-3 line-clamp-2">
          {description}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-slate-600" />
            <span className="text-slate-600">{formatDuration(duration)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-slate-600" />
            <span className="text-slate-600 truncate">{startingPoint}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <RatingStars
            rating={rating}
            size="sm"
            interactive={false}
          />
          <span className="text-xs text-slate-600">
            {rating.toFixed(1)} ({reviewCount})
          </span>
        </div>

        {/* Included Items */}
        {included.length > 0 && (
          <div className="mb-3 p-2 bg-slate-50 rounded">
            <p className="text-xs font-semibold text-slate-700 mb-1">Incluso:</p>
            <div className="flex flex-wrap gap-1">
              {included.slice(0, 3).map((item, index) => (
                <span
                  key={index}
                  className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                >
                  {item}
                </span>
              ))}
              {included.length > 3 && (
                <span className="inline-block text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded">
                  +{included.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Availability */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-slate-600 font-medium">
              Vagas: {remainingSpots}/{totalSpots}
            </span>
            {isLowStock && (
              <span className="flex items-center gap-1 text-xs font-bold text-red-600">
                <AlertCircle size={12} />
                Últimas vagas!
              </span>
            )}
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all',
                occupancyPercent > 90
                  ? 'bg-red-500'
                  : occupancyPercent > 60
                  ? 'bg-orange-500'
                  : 'bg-green-500'
              )}
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs text-slate-600">Por pessoa</p>
            <p className="text-lg font-bold text-slate-900">
              R$ {price.toLocaleString('pt-BR')}
            </p>
          </div>
          <button
            onClick={onBook}
            disabled={remainingSpots === 0}
            className={cn(
              'px-4 py-2 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap',
              remainingSpots === 0
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            )}
          >
            {remainingSpots === 0 ? 'Sem vagas' : 'Reservar agora'}
          </button>
        </div>
      </div>
    </div>
  );
});

ExcursionCard.displayName = 'ExcursionCard';
