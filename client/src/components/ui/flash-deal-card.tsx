import React, { useEffect, useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PriceDisplay } from './price-display';

interface FlashDealCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  originalPrice: number;
  discountedPrice: number;
  endsAt: Date | string;
  soldCount: number;
  totalAvailable: number;
  onClick?: (id: string) => void;
  onBuyClick?: (id: string) => void;
  className?: string;
}

interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export const FlashDealCard = React.forwardRef<HTMLDivElement, FlashDealCardProps>(
  (
    {
      id,
      title,
      description,
      image,
      imageAlt,
      originalPrice,
      discountedPrice,
      endsAt,
      soldCount,
      totalAvailable,
      onClick,
      onBuyClick,
      className,
    },
    ref
  ) => {
    const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: false,
    });
    const [isPulsing, setIsPulsing] = useState(false);

    const endTime = new Date(endsAt).getTime();
    const remainingPercentage = (soldCount / totalAvailable) * 100;
    const discount = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);

    useEffect(() => {
      const updateTimer = () => {
        const now = new Date().getTime();
        const distance = endTime - now;

        if (distance <= 0) {
          setTimeRemaining({
            hours: 0,
            minutes: 0,
            seconds: 0,
            isExpired: true,
          });
          return;
        }

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeRemaining({
          hours,
          minutes,
          seconds,
          isExpired: false,
        });

        // Pulse animation when less than 1 hour
        setIsPulsing(distance < 3600000);
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }, [endTime]);

    return (
      <div
        ref={ref}
        onClick={() => onClick?.(id)}
        className={cn(
          'group flex flex-col overflow-hidden rounded-lg',
          'bg-[var(--rsv-surface-base)] border border-[var(--rsv-border-color)]',
          'shadow-[var(--rsv-shadow-card)] hover:shadow-[var(--rsv-shadow-lg)]',
          'transition-all duration-[var(--rsv-duration-base)]',
          'hover:border-[var(--rsv-warning)] cursor-pointer',
          isPulsing && 'ring-2 ring-[var(--rsv-warning)]/30 animate-pulse',
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

          {/* Discount Badge */}
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-bold">
            -{discount}%
          </div>

          {/* Urgency Indicator */}
          {timeRemaining.hours < 1 && !timeRemaining.isExpired && (
            <div className="absolute top-3 left-3 bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1">
              <AlertCircle size={14} />
              Termina em breve!
            </div>
          )}

          {/* Availability Progress */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
            <div
              className="h-full bg-gradient-to-r from-[var(--rsv-warning)] to-[var(--rsv-error)] transition-all duration-500"
              style={{ width: `${remainingPercentage}%` }}
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex flex-col flex-1 p-4 gap-3">
          {/* Title & Description */}
          <div>
            <h3 className="font-bold text-base line-clamp-2 text-[var(--rsv-text-primary)]">
              {title}
            </h3>
            {description && (
              <p className="text-xs text-[var(--rsv-text-secondary)] line-clamp-1 mt-1">
                {description}
              </p>
            )}
          </div>

          {/* Pricing */}
          <div>
            <PriceDisplay
              originalPrice={originalPrice}
              discountedPrice={discountedPrice}
              size="md"
              layout="horizontal"
            />
          </div>

          {/* Stock Status */}
          <div className="bg-[var(--rsv-surface-alt)] rounded-md p-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-[var(--rsv-text-primary)]">
                Disponibilidade
              </span>
              <span className="text-xs text-[var(--rsv-text-tertiary)]">
                {soldCount} de {totalAvailable}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[var(--rsv-border-color)] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[var(--rsv-success)] to-[var(--rsv-warning)] transition-all duration-500"
                style={{ width: `${100 - remainingPercentage}%` }}
              />
            </div>
          </div>

          {/* Timer */}
          <div
            className={cn(
              'flex items-center gap-2 p-2.5 rounded-md font-mono text-sm font-semibold',
              timeRemaining.isExpired
                ? 'bg-red-100 text-red-700'
                : timeRemaining.hours < 1
                  ? 'bg-[var(--rsv-warning-light)] text-[var(--rsv-warning-dark)] animate-pulse'
                  : 'bg-[var(--rsv-info-light)] text-[var(--rsv-info-dark)]'
            )}
          >
            <Clock size={16} />
            {timeRemaining.isExpired ? (
              <span>Oferta Encerrada</span>
            ) : (
              <span>
                {String(timeRemaining.hours).padStart(2, '0')}:
                {String(timeRemaining.minutes).padStart(2, '0')}:
                {String(timeRemaining.seconds).padStart(2, '0')}
              </span>
            )}
          </div>

          {/* Buy Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBuyClick?.(id);
            }}
            disabled={timeRemaining.isExpired}
            className={cn(
              'w-full py-2.5 rounded-md font-semibold text-sm transition-all duration-[var(--rsv-duration-base)]',
              timeRemaining.isExpired
                ? 'bg-[var(--rsv-surface-dim)] text-[var(--rsv-text-tertiary)] cursor-not-allowed'
                : 'bg-gradient-to-r from-[var(--rsv-warning)] to-[var(--rsv-error)] text-white hover:shadow-[var(--rsv-shadow-md)]'
            )}
          >
            {timeRemaining.isExpired ? 'Oferta Encerrada' : 'Comprar Agora'}
          </button>
        </div>
      </div>
    );
  }
);

FlashDealCard.displayName = 'FlashDealCard';
