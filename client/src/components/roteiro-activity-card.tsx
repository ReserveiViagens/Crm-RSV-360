import { useState } from "react";
import { Star, Clock, DollarSign, MapPin, Play, ChevronLeft, ChevronRight, Sparkles, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type RoteiroActivityCategoria = "hoteis" | "atracoesCards" | "passeiosCards" | "parquesAquaticosCards";

export interface RoteiroActivityCardData {
  id: string;
  titulo: string;
  descricaoBreve?: string;
  galeriaImagens: string[];
  galeriaVideos?: string[];
  precoPorPessoa?: number;
  duracaoHoras?: number;
  horarioSaida?: string;
  diasDisponiveis?: string[];
  badgeTipo?: "ia" | "popular";
  createdAt?: string;
  updatedAt?: string;
}

interface RoteiroActivityCardProps {
  card: RoteiroActivityCardData;
  categoria: RoteiroActivityCategoria;
  selected?: boolean;
  onSelect?: (card: RoteiroActivityCardData) => void;
  onEdit?: (card: RoteiroActivityCardData) => void;
  onRemove?: (card: RoteiroActivityCardData) => void;
  isAdmin?: boolean;
  className?: string;
}

export function RoteiroActivityCard({
  card,
  categoria,
  selected = false,
  onSelect,
  onEdit,
  onRemove,
  isAdmin = false,
  className = "",
}: RoteiroActivityCardProps) {
  const [mediaIndex, setMediaIndex] = useState(0);
  const allMedia = [
    ...card.galeriaImagens.map((url) => ({ type: "image" as const, url })),
    ...(card.galeriaVideos ?? []).map((url) => ({ type: "video" as const, url })),
  ];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMediaIndex((i) => (i - 1 + allMedia.length) % allMedia.length);
  };
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMediaIndex((i) => (i + 1) % allMedia.length);
  };

  const categoryLabel: Record<RoteiroActivityCategoria, string> = {
    hoteis: "Hotel",
    atracoesCards: "Atração",
    passeiosCards: "Passeio",
    parquesAquaticosCards: "Parque Aquático",
  };

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(p);

  return (
    <Card
      data-testid={`card-roteiro-${card.id}`}
      className={`cursor-pointer transition-all ${selected ? "ring-2 ring-primary" : ""} ${className}`}
      onClick={() => onSelect?.(card)}
    >
      <div className="relative">
        {allMedia.length > 0 ? (
          <div className="relative h-36 overflow-hidden rounded-t-lg bg-muted">
            {allMedia[mediaIndex].type === "image" ? (
              <img
                src={allMedia[mediaIndex].url}
                alt={card.titulo}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${card.id}/400/200`;
                }}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-black/80">
                <Play className="w-10 h-10 text-white" />
              </div>
            )}
            {allMedia.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-1"
                >
                  <ChevronLeft className="w-3 h-3 text-white" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-1"
                >
                  <ChevronRight className="w-3 h-3 text-white" />
                </button>
                <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs rounded px-1">
                  {mediaIndex + 1}/{allMedia.length}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="h-24 bg-muted rounded-t-lg flex items-center justify-center">
            <MapPin className="w-8 h-8 text-muted-foreground" />
          </div>
        )}

        <div className="absolute top-2 left-2 flex gap-1">
          {card.badgeTipo === "ia" && (
            <Badge variant="default" className="text-xs bg-purple-600">
              <Sparkles className="w-2.5 h-2.5 mr-1" /> IA
            </Badge>
          )}
          {card.badgeTipo === "popular" && (
            <Badge variant="default" className="text-xs bg-orange-500">
              <TrendingUp className="w-2.5 h-2.5 mr-1" /> Popular
            </Badge>
          )}
        </div>

        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="text-xs">
            {categoryLabel[categoria]}
          </Badge>
        </div>
      </div>

      <CardContent className="p-3">
        <h3 className="font-semibold text-sm leading-tight mb-1">{card.titulo}</h3>
        {card.descricaoBreve && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{card.descricaoBreve}</p>
        )}

        <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
          {card.precoPorPessoa !== undefined && (
            <span className="flex items-center gap-0.5">
              <DollarSign className="w-3 h-3" />
              {formatPrice(card.precoPorPessoa)}/pessoa
            </span>
          )}
          {card.duracaoHoras && (
            <span className="flex items-center gap-0.5">
              <Clock className="w-3 h-3" />
              {card.duracaoHoras}h
            </span>
          )}
          {card.horarioSaida && (
            <span className="flex items-center gap-0.5">
              <Star className="w-3 h-3" />
              Saída: {card.horarioSaida}
            </span>
          )}
        </div>

        {card.diasDisponiveis && card.diasDisponiveis.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {card.diasDisponiveis.map((d) => (
              <span key={d} className="text-xs bg-muted px-1.5 py-0.5 rounded">
                {d}
              </span>
            ))}
          </div>
        )}

        {isAdmin && (
          <div className="flex gap-1 mt-2">
            {onEdit && (
              <Button size="sm" variant="outline" className="text-xs h-6 px-2" onClick={(e) => { e.stopPropagation(); onEdit(card); }}>
                Editar
              </Button>
            )}
            {onRemove && (
              <Button size="sm" variant="destructive" className="text-xs h-6 px-2" onClick={(e) => { e.stopPropagation(); onRemove(card); }}>
                Remover
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
