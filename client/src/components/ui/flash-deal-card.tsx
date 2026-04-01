import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FlashDealCardProps {
  /** Deal title */
  title: string;
  /** Deal description */
  description: string;
  /** Original price */
  originalPrice: number;
  /** Discounted price */
  discountedPrice: number;
  /** Total slots available */
  totalSlots: number;
  /** Slots remaining */
  slotsRemaining: number;
  /** End time (ISO string) */
  endTime: string;
  /** Deal image */
  image?: string;
  /** On reserve click */
  onReserve?: () => void;
  /** CSS class */
  className?: string;
}

const formatTimeRemaining = (endTime: string): { hours: number; minutes: number; seconds: number; isExpired: boolean } => {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, isExpired: false };
};

export const FlashDealCard = React.forwardRef<
  HTMLDivElement,
  FlashDealCardProps
>(({
  title,
  description,
  originalPrice,
  discountedPrice,
  totalSlots,
  slotsRemaining,
  endTime,
  image,
  onReserve,
  className,
}, ref) => {
  const [timeRemaining, setTimeRemaining] = useState(
    formatTimeRemaining(endTime)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(formatTimeRemaining(endTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const discount = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  const occupancyPercent = Math.round(((totalSlots - slotsRemaining) / totalSlots) * 100);
  const isUrgent = timeRemaining.hours < 1;
  const isLowStock = slotsRemaining <= 3;

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg overflow-hidden bg-white border shadow-md hover:shadow-lg transition-shadow',
        isUrgent && 'border-orange-500 border-2',
        className
      )}
    >
      {/* Image */}
      {image && (
        <div className="relative h-40 overflow-hidden bg-slate-100">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
          {/* Discount Badge */}
          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded font-bold text-sm flex items-center gap-1">
            <Zap size={14} />
            -{discount}%
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-bold text-slate-900 text-sm mb-1 line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-600 mb-3 line-clamp-2">
          {description}
        </p>

        {/* Prices */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-bold text-slate-900">
            R$ {discountedPrice.toLocaleString('pt-BR')}
          </span>
          <span className="text-sm text-slate-400 line-through">
            R$ {originalPrice.toLocaleString('pt-BR')}
          </span>
        </div>

        {/* Urgency Indicator */}
        {isUrgent && (
          <div className="mb-3 p-2 bg-orange-50 border border-orange-200 rounded flex items-center gap-2">
            <AlertCircle size={14} className="text-orange-600 flex-shrink-0" />
            <span className="text-xs font-semibold text-orange-600">
              Terminando em breve!
            </span>
          </div>
        )}

        {/* Stock Bar */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-slate-600 font-medium">
              Vagas restantes: {slotsRemaining}/{totalSlots}
            </span>
            {isLowStock && (
              <span className="text-xs font-bold text-red-600">
                Últimas vagas!
              </span>
            )}
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all',
                occupancyPercent > 80
                  ? 'bg-red-500'
                  : occupancyPercent > 50
                  ? 'bg-orange-500'
                  : 'bg-green-500'
              )}
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={14} className="text-slate-600" />
            <span className="text-xs font-semibold text-slate-600">
              Tempo restante
            </span>
          </div>
          <div className={cn(
            'text-center font-bold text-lg',
            isUrgent ? 'text-red-600 animate-pulse' : 'text-slate-900'
          )}>
            {timeRemaining.isExpired ? (
              <span className="text-red-600">Oferta expirada</span>
            ) : (
              `${String(timeRemaining.hours).padStart(2, '0')}:${String(timeRemaining.minutes).padStart(2, '0')}:${String(timeRemaining.seconds).padStart(2, '0')}`
            )}
          </div>
        </div>

        {/* Reserve Button */}
        <button
          onClick={onReserve}
          disabled={timeRemaining.isExpired || slotsRemaining === 0}
          className={cn(
            'w-full py-2 px-3 rounded-lg font-semibold text-sm transition-colors',
            timeRemaining.isExpired || slotsRemaining === 0
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          )}
        >
          {timeRemaining.isExpired
            ? 'Oferta expirada'
            : slotsRemaining === 0
            ? 'Sem vagas'
            : 'Reservar agora'}
        </button>
      </div>
    </div>
  );
});

FlashDealCard.displayName = 'FlashDealCard';
