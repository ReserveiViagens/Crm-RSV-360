import React from 'react';
import { ProductCard, type ProductCardProps } from './product-card';
import { MapPin, Clock, Users, CheckCircle } from 'lucide-react';

interface TicketCardProps extends Omit<ProductCardProps, 'children'> {
  location?: string;
  duration?: string;
  ageGroup?: string;
  features?: string[];
  sold?: number;
  available?: number;
  documentRequired?: string;
}

export const TicketCard = React.forwardRef<HTMLDivElement, TicketCardProps>(
  (
    {
      location,
      duration,
      ageGroup,
      features,
      sold,
      available,
      documentRequired,
      ...productCardProps
    },
    ref
  ) => {
    return (
      <ProductCard ref={ref} {...productCardProps}>
        {/* Meta Information */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[var(--rsv-border-color)] mt-auto">
          {/* Location */}
          {location && (
            <div className="flex items-center gap-2 text-xs text-[var(--rsv-text-secondary)]">
              <MapPin size={14} />
              <span>{location}</span>
            </div>
          )}

          {/* Duration */}
          {duration && (
            <div className="flex items-center gap-2 text-xs text-[var(--rsv-text-secondary)]">
              <Clock size={14} />
              <span>{duration}</span>
            </div>
          )}

          {/* Age Group */}
          {ageGroup && (
            <div className="flex items-center gap-2 text-xs text-[var(--rsv-text-secondary)]">
              <Users size={14} />
              <span>{ageGroup}</span>
            </div>
          )}

          {/* Features List */}
          {features && features.length > 0 && (
            <div className="flex flex-col gap-1 pt-2">
              {features.slice(0, 2).map((feature, index) => (
                <div key={index} className="flex items-start gap-2 text-xs text-[var(--rsv-text-secondary)]">
                  <CheckCircle size={12} className="mt-0.5 flex-shrink-0 text-green-500" />
                  <span className="line-clamp-1">{feature}</span>
                </div>
              ))}
              {features.length > 2 && (
                <span className="text-xs text-[var(--rsv-text-muted)] pt-1">
                  +{features.length - 2} mais
                </span>
              )}
            </div>
          )}

          {/* Document Required */}
          {documentRequired && (
            <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200 text-xs text-yellow-700">
              📋 {documentRequired}
            </div>
          )}

          {/* Availability */}
          {(sold !== undefined || available !== undefined) && (
            <div className="pt-2 text-xs text-[var(--rsv-text-tertiary)]">
              {sold !== undefined && <span>{sold} vendidos hoje</span>}
              {sold !== undefined && available !== undefined && <span> • </span>}
              {available !== undefined && <span>{available} disponíveis</span>}
            </div>
          )}
        </div>
      </ProductCard>
    );
  }
);

TicketCard.displayName = 'TicketCard';
