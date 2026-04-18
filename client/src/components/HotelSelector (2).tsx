import { useState } from "react";
import { Hotel, Star, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface HotelOption {
  id: string;
  nome?: string;
  titulo?: string;
  descricaoBreve?: string;
  galeriaImagens?: string[];
  imagem?: string;
  precoPorPessoa?: number;
  precoNoite?: number;
  estrelas?: number;
  badgeTipo?: "ia" | "popular";
  recommended?: boolean;
  highMargin?: boolean;
  margin?: number;
  score?: number;
}

interface HotelSelectorProps {
  hoteis?: HotelOption[];
  hotels?: HotelOption[];
  hotelSelecionado?: string;
  selectedHotelId?: string;
  checkIn?: string;
  checkOut?: string;
  onSelect: (hotelId: string, total?: number) => void;
  disabled?: boolean;
}

export function HotelSelector({
  hoteis,
  hotels,
  hotelSelecionado,
  selectedHotelId,
  checkIn,
  checkOut,
  onSelect,
  disabled,
}: HotelSelectorProps) {
  const [page, setPage] = useState(0);
  const perPage = 3;
  const list = hoteis ?? hotels ?? [];
  const selected = hotelSelecionado ?? selectedHotelId;
  const totalPages = Math.ceil(list.length / perPage);
  const visible = list.slice(page * perPage, (page + 1) * perPage);

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(p);

  const calcNights = () => {
    if (!checkIn || !checkOut) return 1;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diff = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  if (list.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2">
        <Hotel className="w-8 h-8" />
        <p className="text-sm">Nenhum hotel disponível no catálogo.</p>
      </div>
    );
  }

  return (
    <div data-testid="hotel-selector" className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {visible.map((hotel) => {
          const isSelected = selected === hotel.id;
          const name = hotel.titulo ?? hotel.nome ?? "";
          const image = hotel.galeriaImagens?.[0] ?? hotel.imagem ?? "";
          const price = hotel.precoPorPessoa ?? hotel.precoNoite;
          const nights = calcNights();
          const total = price ? price * nights : undefined;
          return (
            <Card
              key={hotel.id}
              data-testid={`hotel-option-${hotel.id}`}
              className={`cursor-pointer transition-all ${isSelected ? "ring-2 ring-primary" : ""} ${disabled ? "opacity-60 pointer-events-none" : ""}`}
              onClick={() => !disabled && onSelect(hotel.id, total)}
            >
              <div className="relative h-28 overflow-hidden rounded-t-lg bg-muted">
                {image ? (
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${hotel.id}/300/150`;
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <Hotel className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                {isSelected && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="bg-primary rounded-full p-1">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                )}
                {(hotel.badgeTipo || hotel.recommended) && (
                  <div className="absolute top-1 left-1">
                    <Badge variant="default" className="text-xs">
                      {hotel.badgeTipo === "ia" ? "IA" : hotel.recommended ? "Recomendado" : "Popular"}
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-2">
                <p className="font-medium text-xs leading-tight">{name}</p>
                {hotel.estrelas && (
                  <div className="flex gap-0.5 mt-0.5">
                    {Array.from({ length: hotel.estrelas }).map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                )}
                {hotel.descricaoBreve && (
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{hotel.descricaoBreve}</p>
                )}
                {price !== undefined && (
                  <p className="text-xs font-semibold mt-1 text-primary">
                    {formatPrice(price)}{hotel.precoNoite ? "/noite" : "/pessoa"}
                    {hotel.precoNoite && checkIn && checkOut ? ` × ${nights}n = ${formatPrice(price * nights)}` : ""}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button size="icon" variant="outline" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs text-muted-foreground">
            {page + 1} / {totalPages}
          </span>
          <Button size="icon" variant="outline" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
