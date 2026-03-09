import { useState } from "react";
import { Star, Clock, DollarSign, MapPin, Play, ChevronLeft, ChevronRight, Sparkles, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type RoteiroActivityCategoria =
  | "hoteis" | "atracoesCards" | "passeiosCards" | "parquesAquaticosCards"
  | "hotel" | "atracao" | "passeio" | "parque";

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
  card?: RoteiroActivityCardData;
  id?: string;
  titulo?: string;
  descricaoBreve?: string;
  galeriaImagens?: string[];
  galeriaVideos?: string[];
  precoPorPessoa?: number;
  duracaoHoras?: number;
  horarioSaida?: string;
  diasDisponiveis?: string[];
  badgeTipo?: "ia" | "popular";
  dataTestId?: string;
  categoria: RoteiroActivityCategoria;
  selected?: boolean;
  onSelect?: (card: RoteiroActivityCardData) => void;
  onClickSelecionar?: () => void;
  onEdit?: (card: RoteiroActivityCardData) => void;
  onRemove?: (card: RoteiroActivityCardData) => void;
  isAdmin?: boolean;
  className?: string;
}

export function RoteiroActivityCard({
  card: cardProp,
  id,
  titulo,
  descricaoBreve,
  galeriaImagens,
  galeriaVideos,
  precoPorPessoa,
  duracaoHoras,
  horarioSaida,
  diasDisponiveis,
  badgeTipo,
  dataTestId,
  categoria,
  selected = false,
  onSelect,
  onClickSelecionar,
  onEdit,
  onRemove,
  isAdmin = false,
  className = "",
}: RoteiroActivityCardProps) {
  const card: RoteiroActivityCardData = cardProp ?? {
    id: id ?? "",
    titulo: titulo ?? "",
    descricaoBreve,
    galeriaImagens: galeriaImagens ?? [],
    galeriaVideos: galeriaVideos ?? [],
    precoPorPessoa,
    duracaoHoras,
    horarioSaida,
    diasDisponiveis,
    badgeTipo,
  };

  const [mediaIndex, setMediaIndex] = useState(0);
  const allMedia = [
    ...card.galeriaImagens.map((url) => ({ type: "image" as const, url })),
    ...(card.galeriaVideos ?? []).map((url) => ({ type: "video" as const, url })),
  ];

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(p);

  const getCategoriaLabel = () => {
    const labels: Record<string, string> = {
      hoteis: "Hotel",
      hotel: "Hotel",
      atracoesCards: "Atração",
      atracao: "Atração",
      passeiosCards: "Passeio",
      passeio: "Passeio",
      parquesAquaticosCards: "Parque",
      parque: "Parque",
    };
    return labels[categoria] ?? categoria;
  };

  return (
    <Card
      data-testid={dataTestId ? `${dataTestId}-${card.id}` : `roteiro-card-${card.id}`}
      className={`overflow-hidden cursor-pointer transition-all ${selected ? "ring-2 ring-primary" : ""} ${className}`}
      onClick={() => { onSelect?.(card); onClickSelecionar?.(); }}
    >
      <div className="relative">
        {allMedia.length > 0 ? (
          <div className="relative h-32 bg-muted overflow-hidden">
            {allMedia[mediaIndex].type === "image" ? (
              <img
                src={allMedia[mediaIndex].url}
                alt={card.titulo}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${card.id}/300/128`;
                }}
              />
            ) : (
              <video src={allMedia[mediaIndex].url} className="w-full h-full object-cover" muted playsInline />
            )}
            {allMedia[mediaIndex].type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Play className="w-8 h-8 text-white" />
              </div>
            )}
            {allMedia.length > 1 && (
              <>
                <button
                  className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-0.5"
                  onClick={(e) => { e.stopPropagation(); setMediaIndex((i) => (i - 1 + allMedia.length) % allMedia.length); }}
                >
                  <ChevronLeft className="w-3 h-3 text-white" />
                </button>
                <button
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-0.5"
                  onClick={(e) => { e.stopPropagation(); setMediaIndex((i) => (i + 1) % allMedia.length); }}
                >
                  <ChevronRight className="w-3 h-3 text-white" />
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="h-32 bg-muted flex items-center justify-center">
            <MapPin className="w-8 h-8 text-muted-foreground" />
          </div>
        )}

        <div className="absolute top-1 left-1 flex gap-1">
          <Badge variant="secondary" className="text-xs py-0 px-1.5">
            {getCategoriaLabel()}
          </Badge>
          {card.badgeTipo === "ia" && (
            <Badge variant="default" className="text-xs py-0 px-1.5 gap-0.5">
              <Sparkles className="w-2.5 h-2.5" /> IA
            </Badge>
          )}
          {card.badgeTipo === "popular" && (
            <Badge variant="secondary" className="text-xs py-0 px-1.5 gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" /> Popular
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-2 space-y-1">
        <p className="font-semibold text-xs leading-tight line-clamp-1">{card.titulo}</p>
        {card.descricaoBreve && (
          <p className="text-xs text-muted-foreground line-clamp-2">{card.descricaoBreve}</p>
        )}
        <div className="flex flex-wrap gap-x-2 gap-y-0.5">
          {card.precoPorPessoa !== undefined && (
            <span className="flex items-center gap-0.5 text-xs text-primary font-semibold">
              <DollarSign className="w-2.5 h-2.5" />
              {formatPrice(card.precoPorPessoa)}/pessoa
            </span>
          )}
          {card.duracaoHoras !== undefined && (
            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
              <Clock className="w-2.5 h-2.5" />
              {card.duracaoHoras}h
            </span>
          )}
          {card.horarioSaida && (
            <span className="text-xs text-muted-foreground">{card.horarioSaida}</span>
          )}
        </div>
        {isAdmin && (
          <div className="flex gap-1 mt-1" onClick={(e) => e.stopPropagation()}>
            <Button size="sm" variant="outline" className="h-5 text-xs px-2 py-0" onClick={() => onEdit?.(card)}>Editar</Button>
            <Button size="sm" variant="destructive" className="h-5 text-xs px-2 py-0" onClick={() => onRemove?.(card)}>Remover</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
