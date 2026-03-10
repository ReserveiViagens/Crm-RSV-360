import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { RoteiroActivityCard, type RoteiroActivityCategoria } from "@/components/roteiro-activity-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Bus, Car, Truck, ChevronLeft, ChevronRight, Check, Sparkles,
  Hotel, MapPin, Waves, Footprints, Star, Clock, DollarSign,
  Rocket, Save, Eye, Users, Calendar, Flame, TrendingUp,
  PiggyBank, AlertCircle, Plus, Trash2, Edit3, Image,
  X, Building2, Coffee, Wifi, ParkingCircle, Utensils
} from "lucide-react";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type ExcursaoResponse = {
  id: string; nome: string; dataIda: string; dataVolta: string;
  destino: string; localSaida?: string; capacidade: number; veiculoTipo?: string;
};
type RoteiroCard = {
  id: string; titulo: string; descricaoBreve?: string;
  galeriaImagens: string[]; galeriaVideos: string[];
  precoPorPessoa?: number; duracaoHoras?: number;
  horarioSaida?: string; diasDisponiveis?: string[];
  badgeTipo?: "ia" | "popular";
};
type RoteiroPayload = {
  veiculoTipo?: string; veiculoAutomatico?: boolean; manualVehicleOverride?: boolean;
  hotelPrincipal?: string; atracoes: string[]; passeios: string[]; parquesAquaticos: string[];
  hoteis: RoteiroCard[]; atracoesCards: RoteiroCard[];
  passeiosCards: RoteiroCard[]; parquesAquaticosCards: RoteiroCard[]; notas?: string;
};
type CardSection = "hoteis" | "atracoesCards" | "passeiosCards" | "parquesAquaticosCards";
type MediaType = "image" | "video";
type SugestaoRoteiro = {
  id: string; nomeAutor: string;
  categoria: "veiculo" | "hotel" | "atracao" | "passeio" | "parque" | "outro";
  valor: string; descricao?: string; status: "PENDENTE" | "APROVADA" | "REJEITADA";
  publishedForVoting?: boolean;
};
type VotacaoRoteiroItem = {
  id: string; categoria: "veiculo" | "hotel" | "atracao" | "passeio" | "parque" | "outro";
  valor: string; votos: number;
};
type CatalogoRoteiro = {
  atracoes: RoteiroCard[]; passeios: RoteiroCard[];
  parquesAquaticos: RoteiroCard[]; refeicoes: RoteiroCard[]; transfers: RoteiroCard[];
};
type DaySelections = Record<string, { atracoes: string[]; passeios: string[]; parques: string[] }>;

/* ─────────────────────────────────────────────
   Static default catalog — Caldas Novas
───────────────────────────────────────────── */
const DEFAULT_PARQUES: RoteiroCard[] = [
  { id: "def-hot-park", titulo: "Hot Park", descricaoBreve: "Maior parque aquático de águas termais do mundo. Tobogãs e piscinas naturais aquecidas.", galeriaImagens: ["https://images.unsplash.com/photo-1559825481-12a05cc00344?w=600&q=80"], galeriaVideos: [], precoPorPessoa: 250, duracaoHoras: 8, badgeTipo: "popular" },
  { id: "def-diroma", titulo: "Di Roma Acqua Park", descricaoBreve: "Parque aquático integrado ao hotel com toboáguas emocionantes e piscinas termais.", galeriaImagens: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80"], galeriaVideos: [], precoPorPessoa: 180, duracaoHoras: 6 },
  { id: "def-golden-dolphin", titulo: "Golden Dolphin Water Park", descricaoBreve: "Parque privativo all-inclusive com ondas termais e kids club.", galeriaImagens: ["https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80"], galeriaVideos: [], precoPorPessoa: 200, duracaoHoras: 7, badgeTipo: "ia" },
  { id: "def-turmalina", titulo: "Turmalina Termas", descricaoBreve: "Complexo termal com piscinas de águas naturalmente quentes e área de lazer.", galeriaImagens: ["https://images.unsplash.com/photo-1510525009512-ad7fc13d8422?w=600&q=80"], galeriaVideos: [], precoPorPessoa: 120, duracaoHoras: 4 },
  { id: "def-lagoa-quente", titulo: "Lagoa Quente", descricaoBreve: "Parque ecológico com lagoa de águas termais naturais e gastronomia local.", galeriaImagens: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80"], galeriaVideos: [], precoPorPessoa: 90, duracaoHoras: 3 },
];
const DEFAULT_ATRACOES: RoteiroCard[] = [
  { id: "def-lago-corumba", titulo: "Lago Corumbá", descricaoBreve: "Lago artificial de 65km² com orla turística, restaurantes e passeios de barco.", galeriaImagens: ["https://images.unsplash.com/photo-1559825481-12a05cc00344?w=600&q=80"], galeriaVideos: [], precoPorPessoa: 0, duracaoHoras: 2 },
  { id: "def-parque-nascentes", titulo: "Parque das Nascentes", descricaoBreve: "Reserva ecológica com trilhas e nascentes de água mineral naturais.", galeriaImagens: ["https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80"], galeriaVideos: [], precoPorPessoa: 20, duracaoHoras: 3, badgeTipo: "ia" },
  { id: "def-mirante", titulo: "Mirante de Caldas Novas", descricaoBreve: "Vista panorâmica de 360° da cidade e da região. Pôr do sol imperdível.", galeriaImagens: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80"], galeriaVideos: [], precoPorPessoa: 0, duracaoHoras: 1 },
  { id: "def-mercado", titulo: "Mercado Municipal", descricaoBreve: "Artesanato local, gastronomia típica goiana e produtos regionais.", galeriaImagens: ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80"], galeriaVideos: [], precoPorPessoa: 0, duracaoHoras: 1 },
  { id: "def-igreja", titulo: "Igreja Matriz", descricaoBreve: "Marco histórico do século XIX no centro da cidade.", galeriaImagens: ["https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80"], galeriaVideos: [], precoPorPessoa: 0, duracaoHoras: 1 },
];
const DEFAULT_PASSEIOS: RoteiroCard[] = [
  { id: "def-city-tour", titulo: "City Tour Caldas Novas", descricaoBreve: "Roteiro guiado pelos principais pontos turísticos da cidade em ônibus panorâmico.", galeriaImagens: ["https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80"], galeriaVideos: [], precoPorPessoa: 60, duracaoHoras: 3, badgeTipo: "popular" },
  { id: "def-barco", titulo: "Passeio de Barco — Lago Corumbá", descricaoBreve: "Travessia panorâmica com parada em ilhas e banho de lago. Pôr do sol a bordo.", galeriaImagens: ["https://images.unsplash.com/photo-1503776768674-0e612f631345?w=600&q=80"], galeriaVideos: [], precoPorPessoa: 90, duracaoHoras: 4 },
  { id: "def-gastronomico", titulo: "Tour Gastronômico", descricaoBreve: "Visita aos melhores restaurantes e bares com culinária goiana típica.", galeriaImagens: ["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80"], galeriaVideos: [], precoPorPessoa: 45, duracaoHoras: 2, badgeTipo: "ia" },
  { id: "def-trilha", titulo: "Trilha Ecológica", descricaoBreve: "Caminhada guiada pela mata nativa com guia naturalista. Nível fácil.", galeriaImagens: ["https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80"], galeriaVideos: [], precoPorPessoa: 35, duracaoHoras: 3 },
];

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function getCurrentUser() {
  const existingId = localStorage.getItem("rsv_user_id");
  const existingName = localStorage.getItem("rsv_user_name");
  const userId = existingId || `u-${Math.random().toString(36).slice(2, 10)}`;
  const nome = existingName || "Organizador";
  localStorage.setItem("rsv_user_id", userId);
  localStorage.setItem("rsv_user_name", nome);
  return { userId, nome };
}

function vehicleByCapacity(capacidade: number): "Van" | "Micro" | "Ônibus" {
  if (capacidade <= 15) return "Van";
  if (capacidade <= 28) return "Micro";
  return "Ônibus";
}

function createCard(prefix: string): RoteiroCard {
  return {
    id: `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    titulo: "", descricaoBreve: "", galeriaImagens: [], galeriaVideos: [],
  };
}

async function filesToDataUrls(files: FileList | null): Promise<string[]> {
  if (!files || files.length === 0) return [];
  const all = Array.from(files).slice(0, 6);
  const reads = all.map(
    (file) => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    }),
  );
  const urls = await Promise.all(reads);
  return urls.filter(Boolean);
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */
const STEP_LABELS = ["Básico", "Veículo", "Hotel", "Roteiro", "Revisão"];

function StepBar({ active, completed }: { active: number; completed: Set<number> }) {
  return (
    <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-1">
      {STEP_LABELS.map((label, idx) => {
        const step = idx + 1;
        const isActive = step === active;
        const isDone = completed.has(step);
        return (
          <div key={step} className="flex items-center flex-shrink-0">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
              isActive ? "bg-primary text-white shadow-md" :
              isDone ? "bg-emerald-50 text-emerald-700" : "text-muted-foreground"
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                isActive ? "bg-white/20 text-white" :
                isDone ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
              }`}>
                {isDone ? <Check className="w-3.5 h-3.5" /> : step}
              </div>
              <span className="hidden sm:inline">{label}</span>
            </div>
            {idx < STEP_LABELS.length - 1 && (
              <div className={`h-px w-6 sm:w-10 flex-shrink-0 ${isDone ? "bg-emerald-400" : "bg-border"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

interface VehicleCardProps {
  type: "Van" | "Micro" | "Ônibus";
  selected: boolean;
  isSuggested: boolean;
  isManual: boolean;
  onSelect: () => void;
}
function VehicleCard({ type, selected, isSuggested, isManual, onSelect }: VehicleCardProps) {
  const config = {
    Van: { icon: Car, capacity: "até 15 pessoas", badge: "Mais econômico", badgeColor: "bg-emerald-100 text-emerald-700", tagline: "Ideal para grupos pequenos e íntimos" },
    Micro: { icon: Truck, capacity: "16–28 pessoas", badge: "Mais popular", badgeColor: "bg-primary/10 text-primary", tagline: "O favorito de 68% das excursões Caldas Novas" },
    Ônibus: { icon: Bus, capacity: "29+ pessoas", badge: "Para grandes grupos", badgeColor: "bg-amber-100 text-amber-700", tagline: "Conforto máximo para excursões longas" },
  }[type];
  const Icon = config.icon;
  return (
    <button
      type="button"
      onClick={onSelect}
      data-testid={`vehicle-card-${type.toLowerCase()}`}
      className={`relative flex flex-col gap-3 p-5 rounded-2xl border-2 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
        selected ? "border-primary bg-primary/5 shadow-md" : "border-border bg-white hover:border-primary/40"
      }`}
    >
      {selected && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-3.5 h-3.5 text-white" />
        </div>
      )}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selected ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="font-bold text-foreground text-base">{type}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{config.capacity}</p>
      </div>
      <span className={`text-xs font-semibold rounded-full px-2.5 py-1 w-fit ${config.badgeColor}`}>
        {config.badge}
      </span>
      <p className="text-xs text-muted-foreground leading-snug">{config.tagline}</p>
      <div className="flex gap-1.5 flex-wrap">
        {isSuggested && (
          <span className="text-xs bg-blue-50 text-blue-700 rounded-full px-2 py-0.5 font-medium">
            ✦ Sugerido para {type === "Van" ? "≤15" : type === "Micro" ? "16–28" : "29+"} pessoas
          </span>
        )}
        {selected && isManual && (
          <span className="text-xs bg-amber-50 text-amber-700 rounded-full px-2 py-0.5 font-medium">
            Override manual ativo
          </span>
        )}
        {selected && !isManual && (
          <span className="text-xs bg-emerald-50 text-emerald-700 rounded-full px-2 py-0.5 font-medium">
            Seleção automática
          </span>
        )}
      </div>
    </button>
  );
}

interface CatalogCardProps {
  card: RoteiroCard;
  selected: boolean;
  onToggle: () => void;
  neuroCount?: number;
}
function CatalogCard({ card, selected, onToggle, neuroCount }: CatalogCardProps) {
  const badgeMap = {
    popular: { label: "🔥 Mais escolhido", cls: "bg-orange-100 text-orange-700" },
    ia: { label: "⭐ Recomendado IA", cls: "bg-purple-100 text-purple-700" },
  };
  const badge = card.badgeTipo ? badgeMap[card.badgeTipo] : null;
  const isFree = !card.precoPorPessoa || card.precoPorPessoa === 0;
  return (
    <button
      type="button"
      onClick={onToggle}
      data-testid={`catalog-card-${card.id}`}
      className={`relative text-left rounded-2xl border-2 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
        selected ? "border-primary shadow-md ring-2 ring-primary/20" : "border-border bg-white hover:border-primary/40"
      }`}
    >
      {selected && (
        <div className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-md">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
      <div className="relative h-36 overflow-hidden">
        {card.galeriaImagens[0] ? (
          <img src={card.galeriaImagens[0]} alt={card.titulo} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
            <Image className="w-8 h-8 text-blue-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {badge && (
          <span className={`absolute top-2 left-2 text-xs font-bold rounded-full px-2.5 py-1 ${badge.cls}`}>
            {badge.label}
          </span>
        )}
        {isFree && (
          <span className="absolute bottom-2 right-2 text-xs bg-emerald-500 text-white font-bold rounded-full px-2 py-0.5">
            💰 Gratuito
          </span>
        )}
      </div>
      <div className="p-3 space-y-1.5">
        <p className="font-semibold text-sm text-foreground leading-snug">{card.titulo}</p>
        {card.descricaoBreve && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-snug">{card.descricaoBreve}</p>
        )}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {card.duracaoHoras && (
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{card.duracaoHoras}h</span>
          )}
          {card.precoPorPessoa && card.precoPorPessoa > 0 && (
            <span className="flex items-center gap-1 font-semibold text-foreground">
              <DollarSign className="w-3 h-3" />R$ {card.precoPorPessoa}/pessoa
            </span>
          )}
        </div>
        {neuroCount && neuroCount > 0 && (
          <p className="text-xs text-primary font-medium">
            <TrendingUp className="w-3 h-3 inline mr-1" />{neuroCount} excursões incluíram esse mês
          </p>
        )}
      </div>
    </button>
  );
}

interface HotelAdminCardProps {
  card: RoteiroCard;
  onUpdate: (patch: Partial<RoteiroCard>) => void;
  onRemove: () => void;
  onAddImage: (url: string) => void;
}
function HotelAdminCard({ card, onUpdate, onRemove, onAddImage }: HotelAdminCardProps) {
  const [imgUrl, setImgUrl] = useState("");
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="rounded-2xl border border-border bg-white overflow-hidden" data-testid={`hotel-admin-card-${card.id}`}>
      <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Hotel className="w-4 h-4 text-primary" />
          </div>
          <p className="font-semibold text-sm text-foreground">{card.titulo || "Novo hotel"}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={(e) => { e.stopPropagation(); onRemove(); }}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
          <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${expanded ? "rotate-90" : ""}`} />
        </div>
      </div>
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
          <Input placeholder="Nome do hotel" value={card.titulo} onChange={(e) => onUpdate({ titulo: e.target.value })} className="h-10 rounded-xl" data-testid="hotel-admin-titulo" />
          <Textarea placeholder="Descrição breve" value={card.descricaoBreve || ""} onChange={(e) => onUpdate({ descricaoBreve: e.target.value })} className="rounded-xl resize-none min-h-[70px]" data-testid="hotel-admin-descricao" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Preço/pessoa (R$)</label>
              <Input type="number" placeholder="Ex: 450" value={card.precoPorPessoa || ""} onChange={(e) => onUpdate({ precoPorPessoa: Number(e.target.value) })} className="h-10 rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Horário check-in</label>
              <Input type="time" value={card.horarioSaida || ""} onChange={(e) => onUpdate({ horarioSaida: e.target.value })} className="h-10 rounded-xl" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Galeria de imagens</label>
            <div className="flex gap-2">
              <Input placeholder="URL da imagem" value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} className="h-9 rounded-xl text-sm" data-testid="hotel-admin-img-url" />
              <Button type="button" size="sm" className="rounded-xl h-9 px-3" onClick={() => { if (imgUrl.trim()) { onAddImage(imgUrl.trim()); setImgUrl(""); } }}>
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
            {card.galeriaImagens.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {card.galeriaImagens.map((img, i) => (
                  <div key={i} className="relative">
                    <img src={img} alt="" className="w-16 h-12 object-cover rounded-lg border border-border" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface HotelPublicCardProps { card: RoteiroCard }
function HotelPublicCard({ card }: HotelPublicCardProps) {
  return (
    <div className="rounded-2xl border border-border overflow-hidden bg-white" data-testid={`hotel-public-card-${card.id}`}>
      <div className="relative h-48">
        {card.galeriaImagens[0] ? (
          <img src={card.galeriaImagens[0]} alt={card.titulo} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
            <Building2 className="w-12 h-12 text-blue-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <p className="text-white font-bold text-base">{card.titulo}</p>
          <div className="flex items-center gap-1 mt-0.5">
            {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-3 h-3 fill-amber-400 stroke-amber-400" />)}
          </div>
        </div>
        {card.precoPorPessoa && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1">
            <p className="text-xs text-muted-foreground">a partir de</p>
            <p className="font-bold text-foreground text-sm">R$ {card.precoPorPessoa}/pessoa</p>
          </div>
        )}
      </div>
      <div className="p-4">
        {card.descricaoBreve && <p className="text-sm text-muted-foreground leading-relaxed">{card.descricaoBreve}</p>}
        <div className="flex gap-2 mt-3 flex-wrap">
          {[
            { icon: Coffee, label: "Café da manhã" }, { icon: Wifi, label: "Wi-Fi" },
            { icon: ParkingCircle, label: "Estacionamento" }, { icon: Waves, label: "Piscina termal" }
          ].map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-1 text-xs bg-muted text-muted-foreground rounded-full px-2.5 py-1">
              <Icon className="w-3 h-3" />{label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export default function CriarExcursaoPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/criar-excursao/:id");
  const excursaoId = (params as { id?: string } | null)?.id;

  // Basic form state
  const [nome, setNome] = useState("Minha Excursão Caldas Novas");
  const [dataIda, setDataIda] = useState("2026-04-20");
  const [dataVolta, setDataVolta] = useState("2026-04-23");
  const [destino, setDestino] = useState("Caldas Novas");
  const [localSaida, setLocalSaida] = useState("");
  const [capacidade, setCapacidade] = useState(20);
  const [saving, setSaving] = useState(false);
  const [savingRoteiro, setSavingRoteiro] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Wizard step navigation
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Roteiro state
  const [roteiro, setRoteiro] = useState<RoteiroPayload>({
    veiculoTipo: "Micro", veiculoAutomatico: true, manualVehicleOverride: false,
    hotelPrincipal: "", atracoes: [], passeios: [], parquesAquaticos: [],
    hoteis: [], atracoesCards: [], passeiosCards: [], parquesAquaticosCards: [], notas: "",
  });

  // Catalog state (merged API + defaults)
  const [apiCatalogo, setApiCatalogo] = useState<CatalogoRoteiro>({
    atracoes: [], passeios: [], parquesAquaticos: [], refeicoes: [], transfers: [],
  });

  // Merged catalog: API items first, then defaults for empty categories
  const catalogoRoteiro = useMemo<CatalogoRoteiro>(() => ({
    atracoes: apiCatalogo.atracoes.length > 0 ? apiCatalogo.atracoes : DEFAULT_ATRACOES,
    passeios: apiCatalogo.passeios.length > 0 ? apiCatalogo.passeios : DEFAULT_PASSEIOS,
    parquesAquaticos: apiCatalogo.parquesAquaticos.length > 0 ? apiCatalogo.parquesAquaticos : DEFAULT_PARQUES,
    refeicoes: apiCatalogo.refeicoes,
    transfers: apiCatalogo.transfers,
  }), [apiCatalogo]);

  // Global catalog selections (for preview/summary)
  const [selectedCatalogIds, setSelectedCatalogIds] = useState<{
    atracoes: string[]; passeios: string[]; parquesAquaticos: string[];
    refeicoes: string[]; transfers: string[];
  }>({ atracoes: [], passeios: [], parquesAquaticos: [], refeicoes: [], transfers: [] });

  // Day map: per-day selections
  const [activeDayTab, setActiveDayTab] = useState<string>("");
  const [daySelections, setDaySelections] = useState<DaySelections>({});

  // Media input buffer
  const [mediaInput, setMediaInput] = useState<Record<string, { image: string; video: string }>>({});

  // Admin mode detection
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Preview
  const [previewIsAdmin, setPreviewIsAdmin] = useState(false);
  const [fullscreenPreviewOpen, setFullscreenPreviewOpen] = useState(false);
  const [previewSugestoes, setPreviewSugestoes] = useState<SugestaoRoteiro[]>([]);
  const [previewVotacao, setPreviewVotacao] = useState<VotacaoRoteiroItem[]>([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewSyncStatus, setPreviewSyncStatus] = useState<"synced" | "syncing" | "error">("synced");
  const [previewLastUpdatedAt, setPreviewLastUpdatedAt] = useState("");
  const [mainSyncStatus, setMainSyncStatus] = useState<"synced" | "syncing" | "error">("synced");
  const [mainLastUpdatedAt, setMainLastUpdatedAt] = useState("");

  // Computed values
  const tripDays = useMemo(() => {
    if (!dataIda || !dataVolta) return [];
    const start = new Date(dataIda + "T00:00:00");
    const end = new Date(dataVolta + "T00:00:00");
    const days: Array<{ id: string; label: string; date: string }> = [];
    const d = new Date(start);
    let idx = 1;
    while (d <= end && days.length < 30) {
      const dateStr = d.toISOString().slice(0, 10);
      const label = `D${idx} • ${d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}`;
      days.push({ id: dateStr, label, date: dateStr });
      d.setDate(d.getDate() + 1);
      idx++;
    }
    return days;
  }, [dataIda, dataVolta]);

  const suggestedVehicle = vehicleByCapacity(capacidade);
  const isWizardMode = Boolean(excursaoId);

  // Neuromarketing counts for catalog items
  const neuroCounts: Record<string, number> = {
    "def-hot-park": 89, "def-diroma": 42, "def-golden-dolphin": 61,
    "def-city-tour": 74, "def-barco": 38, "def-gastronomico": 55,
    "def-lago-corumba": 29, "def-parque-nascentes": 47,
  };

  // Completion score for review step
  const completionScore = useMemo(() => {
    let score = 0;
    if (nome.trim()) score += 20;
    if (roteiro.hoteis.length > 0 && roteiro.hoteis[0].titulo.trim()) score += 20;
    if (selectedCatalogIds.parquesAquaticos.length > 0) score += 20;
    if (selectedCatalogIds.atracoes.length > 0) score += 20;
    if (selectedCatalogIds.passeios.length > 0) score += 20;
    return score;
  }, [nome, roteiro.hoteis, selectedCatalogIds]);

  const totalCatalogSelected =
    selectedCatalogIds.atracoes.length +
    selectedCatalogIds.passeios.length +
    selectedCatalogIds.parquesAquaticos.length;

  /* ── Load data ── */
  useEffect(() => {
    if (!excursaoId) return;
    const user = getCurrentUser();
    // Detect admin via query param
    const urlParams = new URLSearchParams(window.location.search);
    setIsAdminMode(urlParams.get("admin") === "1");

    fetch(`/api/excursoes/${excursaoId}`, {
      headers: { "x-user-id": user.userId, "x-user-name": user.nome },
    })
      .then((r) => r.json())
      .then((data: ExcursaoResponse | null) => {
        if (!data) return;
        setNome(data.nome || "");
        setDataIda(data.dataIda || "");
        setDataVolta(data.dataVolta || "");
        setDestino(data.destino || "");
        setLocalSaida(data.localSaida || "");
        setCapacidade(data.capacidade || 20);
      })
      .catch(() => {});

    fetch(`/api/excursoes/${excursaoId}/roteiro`)
      .then((r) => r.json())
      .then((data: { roteiro?: Partial<RoteiroPayload> } | null) => {
        if (!data?.roteiro) return;
        const hoteis = Array.isArray(data.roteiro.hoteis) && data.roteiro.hoteis.length > 0 ? data.roteiro.hoteis : [];
        setRoteiro({
          veiculoTipo: data.roteiro.veiculoTipo || vehicleByCapacity(capacidade),
          veiculoAutomatico: data.roteiro.veiculoAutomatico !== false,
          manualVehicleOverride: data.roteiro.manualVehicleOverride === true,
          hotelPrincipal: data.roteiro.hotelPrincipal || "",
          atracoes: data.roteiro.atracoes || [],
          passeios: data.roteiro.passeios || [],
          parquesAquaticos: data.roteiro.parquesAquaticos || [],
          hoteis,
          atracoesCards: Array.isArray(data.roteiro.atracoesCards) ? data.roteiro.atracoesCards : [],
          passeiosCards: Array.isArray(data.roteiro.passeiosCards) ? data.roteiro.passeiosCards : [],
          parquesAquaticosCards: Array.isArray(data.roteiro.parquesAquaticosCards) ? data.roteiro.parquesAquaticosCards : [],
          notas: data.roteiro.notas || "",
        });
      })
      .catch(() => {});

    fetch(`/api/excursoes/${excursaoId}/catalogo-roteiro`)
      .then((r) => r.json())
      .then((data: { items?: CatalogoRoteiro } | null) => {
        if (!data?.items) return;
        setApiCatalogo({
          atracoes: Array.isArray(data.items.atracoes) ? data.items.atracoes : [],
          passeios: Array.isArray(data.items.passeios) ? data.items.passeios : [],
          parquesAquaticos: Array.isArray(data.items.parquesAquaticos) ? data.items.parquesAquaticos : [],
          refeicoes: Array.isArray(data.items.refeicoes) ? data.items.refeicoes : [],
          transfers: Array.isArray(data.items.transfers) ? data.items.transfers : [],
        });
      })
      .catch(() => {});
  }, [excursaoId]);

  /* ── Auto-vehicle (FIXED: only when NOT manual override) ── */
  useEffect(() => {
    if (roteiro.manualVehicleOverride) return;
    const auto = vehicleByCapacity(capacidade);
    if (roteiro.veiculoTipo !== auto) {
      setRoteiro((prev) => ({ ...prev, veiculoTipo: auto }));
    }
  }, [capacidade, roteiro.manualVehicleOverride]);

  /* ── Set first day as active ── */
  useEffect(() => {
    if (tripDays.length > 0 && !activeDayTab) {
      setActiveDayTab(tripDays[0].id);
    }
  }, [tripDays, activeDayTab]);

  /* ── Sync catalog selections from saved state ── */
  useEffect(() => {
    const mapByTitle = (cards: RoteiroCard[], selectedCards: RoteiroCard[], selectedLegacy: string[]) => {
      const selectedSet = new Set<string>([...selectedCards.map((c) => c.titulo), ...selectedLegacy]);
      return cards.filter((c) => selectedSet.has(c.titulo)).map((c) => c.id);
    };
    setSelectedCatalogIds({
      atracoes: mapByTitle(catalogoRoteiro.atracoes, roteiro.atracoesCards, roteiro.atracoes),
      passeios: mapByTitle(catalogoRoteiro.passeios, roteiro.passeiosCards, roteiro.passeios),
      parquesAquaticos: mapByTitle(catalogoRoteiro.parquesAquaticos, roteiro.parquesAquaticosCards, roteiro.parquesAquaticos),
      refeicoes: [],
      transfers: [],
    });
  }, [catalogoRoteiro, roteiro.atracoesCards, roteiro.passeiosCards, roteiro.parquesAquaticosCards, roteiro.atracoes, roteiro.passeios, roteiro.parquesAquaticos]);

  /* ── Card CRUD ── */
  function setCardSection(section: CardSection, cards: RoteiroCard[]) {
    setRoteiro((prev) => ({ ...prev, [section]: cards }));
  }
  function updateCard(section: CardSection, cardId: string, patch: Partial<RoteiroCard>) {
    setCardSection(section, roteiro[section].map((card) => (card.id === cardId ? { ...card, ...patch } : card)));
  }
  function addCard(section: CardSection) {
    const prefix = section === "hoteis" ? "hotel" : section === "atracoesCards" ? "atracao" : section === "passeiosCards" ? "passeio" : "parque";
    setCardSection(section, [...roteiro[section], createCard(prefix)]);
  }
  function removeCard(section: CardSection, cardId: string) {
    setCardSection(section, roteiro[section].filter((card) => card.id !== cardId));
  }

  async function addUploadedMedia(section: CardSection, cardId: string, type: MediaType, files: FileList | null) {
    const urls = await filesToDataUrls(files);
    const card = roteiro[section].find((c) => c.id === cardId);
    if (!card) return;
    if (type === "image") updateCard(section, cardId, { galeriaImagens: [...card.galeriaImagens, ...urls].slice(0, 12) });
    else updateCard(section, cardId, { galeriaVideos: [...card.galeriaVideos, ...urls].slice(0, 12) });
  }

  function addMediaByUrl(section: CardSection, cardId: string, type: MediaType) {
    const key = `${section}:${cardId}`;
    const value = type === "image" ? (mediaInput[key]?.image || "") : (mediaInput[key]?.video || "");
    if (!value.trim()) return;
    const card = roteiro[section].find((c) => c.id === cardId);
    if (!card) return;
    if (type === "image") updateCard(section, cardId, { galeriaImagens: [...card.galeriaImagens, value].slice(0, 12) });
    else updateCard(section, cardId, { galeriaVideos: [...card.galeriaVideos, value].slice(0, 12) });
    setMediaInput((prev) => ({ ...prev, [key]: { image: type === "image" ? "" : (prev[key]?.image || ""), video: type === "video" ? "" : (prev[key]?.video || "") } }));
  }

  /* ── Day selection helpers ── */
  function toggleDayCatalog(dayId: string, category: "atracoes" | "passeios" | "parques", itemId: string) {
    setDaySelections((prev) => {
      const day = prev[dayId] || { atracoes: [], passeios: [], parques: [] };
      const curr = day[category];
      const next = curr.includes(itemId) ? curr.filter((id) => id !== itemId) : [...curr, itemId];
      return { ...prev, [dayId]: { ...day, [category]: next } };
    });
    // Also sync to global selections
    setSelectedCatalogIds((prev) => {
      const key = category === "parques" ? "parquesAquaticos" : category;
      const curr = prev[key];
      const next = curr.includes(itemId) ? curr.filter((id) => id !== itemId) : [...curr, itemId];
      return { ...prev, [key]: next };
    });
  }

  function getDayItemCount(dayId: string): number {
    const d = daySelections[dayId];
    if (!d) return 0;
    return d.atracoes.length + d.passeios.length + d.parques.length;
  }

  /* ── Preview ── */
  const refreshFullscreenPreview = useCallback(async () => {
    if (!excursaoId) return;
    setPreviewLoading(true);
    setPreviewSyncStatus("syncing");
    const user = getCurrentUser();
    try {
      const roleRes = await fetch(`/api/excursoes/${excursaoId}/me-role`, {
        headers: { "x-user-id": user.userId, "x-user-name": user.nome },
      });
      const roleData = roleRes.ok ? ((await roleRes.json()) as { isAdmin?: boolean }) : null;
      const isAdmin = Boolean(roleData?.isAdmin);
      setPreviewIsAdmin(isAdmin);
      if (isAdmin) {
        const sugestoesRes = await fetch(`/api/excursoes/${excursaoId}/sugestoes-roteiro`, {
          headers: { "x-user-id": user.userId, "x-user-name": user.nome },
        });
        if (sugestoesRes.ok) {
          const sugestoesData = (await sugestoesRes.json()) as { sugestoes?: SugestaoRoteiro[] };
          setPreviewSugestoes(Array.isArray(sugestoesData?.sugestoes) ? sugestoesData.sugestoes : []);
        }
      }
      const votacaoRes = await fetch(`/api/excursoes/${excursaoId}/votacao-roteiro`, {
        headers: { "x-user-id": user.userId, "x-user-name": user.nome },
      });
      if (votacaoRes.ok) {
        const votacaoData = (await votacaoRes.json()) as { items?: VotacaoRoteiroItem[] };
        setPreviewVotacao(Array.isArray(votacaoData?.items) ? votacaoData.items : []);
      }
      setPreviewSyncStatus("synced");
      setPreviewLastUpdatedAt(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    } catch {
      setPreviewSyncStatus("error");
    } finally {
      setPreviewLoading(false);
    }
  }, [excursaoId]);

  useEffect(() => {
    if (!fullscreenPreviewOpen || !excursaoId) return;
    void refreshFullscreenPreview();
    const interval = setInterval(() => void refreshFullscreenPreview(), 10000);
    return () => clearInterval(interval);
  }, [fullscreenPreviewOpen, excursaoId, refreshFullscreenPreview]);

  /* ── Create excursão ── */
  async function handleCreate() {
    if (!nome.trim() || !dataIda || !dataVolta || !destino.trim()) {
      setError("Preencha nome, datas e destino.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/excursoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, dataIda, dataVolta, destino, localSaida, capacidade }),
      });
      const data = (await res.json()) as { id?: string };
      if (!res.ok || !data.id) { setError("Erro ao criar excursão."); return; }
      toast({ title: "Excursão criada!", description: "Agora monte o roteiro completo." });
      setLocation(`/criar-excursao/${data.id}`);
    } catch {
      setError("Erro de rede. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  /* ── Save roteiro ── */
  async function handleSaveRoteiro(publish: boolean) {
    if (!excursaoId) return;
    setSavingRoteiro(true);
    setMainSyncStatus("syncing");
    const selectedAtracoesCards = catalogoRoteiro.atracoes.filter((c) => selectedCatalogIds.atracoes.includes(c.id));
    const selectedPasseiosCards = catalogoRoteiro.passeios.filter((c) => selectedCatalogIds.passeios.includes(c.id));
    const selectedParquesCards = catalogoRoteiro.parquesAquaticos.filter((c) => selectedCatalogIds.parquesAquaticos.includes(c.id));
    const payload = {
      roteiro: {
        ...roteiro,
        atracoesCards: selectedAtracoesCards,
        passeiosCards: selectedPasseiosCards,
        parquesAquaticosCards: selectedParquesCards,
        atracoes: selectedAtracoesCards.map((c) => c.titulo),
        passeios: selectedPasseiosCards.map((c) => c.titulo),
        parquesAquaticos: selectedParquesCards.map((c) => c.titulo),
      },
      publish,
    };
    try {
      const res = await fetch(`/api/excursoes/${excursaoId}/roteiro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setMainSyncStatus("synced");
        setMainLastUpdatedAt(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
        setCompletedSteps((prev) => new Set(Array.from(prev).concat(activeStep)));
        if (publish) {
          toast({ title: "🚀 Excursão publicada!", description: "Seu grupo está aberto para inscrições." });
          setLocation(`/viagens-grupo/${excursaoId}`);
        } else {
          toast({ title: "✅ Rascunho salvo!", description: "Continue montando seu roteiro." });
        }
      } else {
        setMainSyncStatus("error");
        toast({ title: "Erro ao salvar", variant: "destructive" });
      }
    } catch {
      setMainSyncStatus("error");
      toast({ title: "Erro de rede", variant: "destructive" });
    } finally {
      setSavingRoteiro(false);
    }
  }

  function goStep(n: number) {
    setCompletedSteps((prev) => new Set(Array.from(prev).concat(activeStep)));
    setActiveStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ─────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────── */
  const previewSectionsData = [
    { label: "Hotel", cards: roteiro.hoteis, fallback: "Sem hotel definido" },
    { label: "Atrações", cards: catalogoRoteiro.atracoes.filter((c) => selectedCatalogIds.atracoes.includes(c.id)), fallback: "Sem atrações selecionadas" },
    { label: "Passeios", cards: catalogoRoteiro.passeios.filter((c) => selectedCatalogIds.passeios.includes(c.id)), fallback: "Sem passeios selecionados" },
    { label: "Parques", cards: catalogoRoteiro.parquesAquaticos.filter((c) => selectedCatalogIds.parquesAquaticos.includes(c.id)), fallback: "Sem parques selecionados" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24" data-testid="criar-excursao-page">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* ── Header ── */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-primary">
            {isWizardMode ? "Monte o roteiro completo da sua excursão" : "Criar sua própria excursão"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isWizardMode
              ? "Configure cada detalhe para maximizar as inscrições do seu grupo."
              : "Configure uma nova excursão e crie seu grupo com governança de roteiro."}
          </p>
        </div>

        {/* ── INITIAL FORM (no excursaoId) ── */}
        {!isWizardMode && (
          <div className="bg-white rounded-2xl border border-border p-6 space-y-4" data-testid="criar-excursao-form">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Nome da excursão</label>
              <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Caldas Novas Família Total — Abril 2026" className="h-11 rounded-xl" data-testid="criar-excursao-nome" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Data de ida</label>
                <Input type="date" value={dataIda} onChange={(e) => setDataIda(e.target.value)} className="h-11 rounded-xl" data-testid="criar-excursao-data-ida" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Data de volta</label>
                <Input type="date" value={dataVolta} onChange={(e) => setDataVolta(e.target.value)} className="h-11 rounded-xl" data-testid="criar-excursao-data-volta" />
              </div>
            </div>
            {tripDays.length > 0 && (
              <div className="flex flex-wrap gap-1.5" data-testid="criar-excursao-dias-mapeados">
                {tripDays.map((d) => (
                  <span key={d.id} className="text-xs font-semibold bg-primary/10 text-primary rounded-full px-3 py-1 border border-primary/20">
                    {d.label}
                  </span>
                ))}
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Destino</label>
                <Input value={destino} onChange={(e) => setDestino(e.target.value)} placeholder="Caldas Novas" className="h-11 rounded-xl" data-testid="criar-excursao-destino" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Local de saída</label>
                <Input value={localSaida} onChange={(e) => setLocalSaida(e.target.value)} placeholder="Ex: Terminal Rodoviário, SP" className="h-11 rounded-xl" data-testid="criar-excursao-local-saida" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Capacidade do grupo</label>
              <Input type="number" value={capacidade} onChange={(e) => setCapacidade(Math.max(4, Number(e.target.value || 4)))} className="h-11 rounded-xl" data-testid="criar-excursao-capacidade" />
              <p className="text-xs text-muted-foreground mt-1.5">Sugestão de veículo: <strong>{vehicleByCapacity(capacidade)}</strong></p>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button onClick={handleCreate} disabled={saving} className="w-full h-12 rounded-xl text-base font-bold" data-testid="criar-excursao-submit">
              {saving ? "Criando..." : "Criar excursão e montar roteiro →"}
            </Button>
          </div>
        )}

        {/* ── WIZARD MODE ── */}
        {isWizardMode && (
          <>
            <StepBar active={activeStep} completed={completedSteps} />

            {/* ════════ STEP 1 — Básico ════════ */}
            {activeStep === 1 && (
              <div className="bg-white rounded-2xl border border-border p-6 space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300" data-testid="wizard-step-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-bold text-foreground">Informações básicas</h2>
                    <p className="text-xs text-muted-foreground">Datas, destino e capacidade do grupo</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Nome da excursão</label>
                  <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Caldas Novas Família Total" className="h-11 rounded-xl" data-testid="criar-excursao-wizard-nome" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Data de ida</label>
                    <Input type="date" value={dataIda} onChange={(e) => setDataIda(e.target.value)} className="h-11 rounded-xl" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Data de volta</label>
                    <Input type="date" value={dataVolta} onChange={(e) => setDataVolta(e.target.value)} className="h-11 rounded-xl" />
                  </div>
                </div>
                {tripDays.length > 0 && (
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Mapa de dias da viagem</label>
                    <div className="flex flex-wrap gap-2" data-testid="criar-excursao-wizard-trip-days">
                      {tripDays.map((d) => (
                        <span key={d.id} className="text-xs font-bold bg-primary/10 text-primary rounded-full px-3 py-1.5 border border-primary/20">{d.label}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Destino</label>
                    <Input value={destino} onChange={(e) => setDestino(e.target.value)} className="h-11 rounded-xl" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Capacidade</label>
                    <Input type="number" value={capacidade} onChange={(e) => setCapacidade(Math.max(4, Number(e.target.value || 4)))} className="h-11 rounded-xl" data-testid="criar-excursao-wizard-capacidade" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => goStep(2)} className="rounded-xl gap-2 h-11 px-6 font-bold" data-testid="btn-step-next-1">
                    Próximo: Veículo <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* ════════ STEP 2 — Veículo ════════ */}
            {activeStep === 2 && (
              <div className="bg-white rounded-2xl border border-border p-6 space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300" data-testid="wizard-step-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Bus className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-bold text-foreground">Escolha o veículo</h2>
                    <p className="text-xs text-muted-foreground">Para {capacidade} pessoas — sugestão automática: <strong>{suggestedVehicle}</strong></p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" data-testid="criar-excursao-wizard-veiculo-cards">
                  {(["Van", "Micro", "Ônibus"] as const).map((tipo) => (
                    <VehicleCard
                      key={tipo}
                      type={tipo}
                      selected={roteiro.veiculoTipo === tipo}
                      isSuggested={suggestedVehicle === tipo}
                      isManual={roteiro.manualVehicleOverride === true}
                      onSelect={() => {
                        const isSameSuggested = tipo === suggestedVehicle;
                        setRoteiro((p) => ({
                          ...p,
                          veiculoTipo: tipo,
                          manualVehicleOverride: !isSameSuggested,
                          veiculoAutomatico: isSameSuggested,
                        }));
                      }}
                    />
                  ))}
                </div>

                {roteiro.manualVehicleOverride && (
                  <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <p className="text-amber-800 font-medium">Override manual ativo — o veículo não mudará automaticamente se a capacidade for alterada.</p>
                    <Button variant="ghost" size="sm" className="ml-auto text-amber-700 hover:bg-amber-100 h-7 rounded-lg text-xs" onClick={() => setRoteiro((p) => ({ ...p, manualVehicleOverride: false, veiculoAutomatico: true, veiculoTipo: suggestedVehicle }))} data-testid="btn-reset-vehicle-override">
                      Resetar
                    </Button>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => goStep(1)} className="rounded-xl gap-2 h-11 px-5">
                    <ChevronLeft className="w-4 h-4" /> Anterior
                  </Button>
                  <Button onClick={() => goStep(3)} className="rounded-xl gap-2 h-11 px-6 font-bold" data-testid="btn-step-next-2">
                    Próximo: Hotel <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* ════════ STEP 3 — Hotel ════════ */}
            {activeStep === 3 && (
              <div className="bg-white rounded-2xl border border-border p-6 space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300" data-testid="wizard-step-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Hotel className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-bold text-foreground">Hotel principal</h2>
                      <p className="text-xs text-muted-foreground">
                        {isAdminMode ? "Modo admin — gerencie os cards do hotel" : "Acomodação incluída na excursão"}
                      </p>
                    </div>
                  </div>
                  {isAdminMode && (
                    <Button size="sm" className="rounded-xl gap-2 h-9 text-xs" onClick={() => addCard("hoteis")} data-testid="criar-excursao-wizard-card-hoteis-add">
                      <Plus className="w-3.5 h-3.5" /> Adicionar hotel
                    </Button>
                  )}
                </div>

                {/* Admin mode: full card management */}
                {isAdminMode && (
                  <div className="space-y-3" data-testid="criar-excursao-wizard-hotel">
                    {roteiro.hoteis.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-xl">
                        <Hotel className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Nenhum hotel cadastrado.</p>
                        <p className="text-xs mt-1">Clique em "Adicionar hotel" para começar.</p>
                      </div>
                    ) : (
                      roteiro.hoteis.map((card) => (
                        <HotelAdminCard
                          key={card.id}
                          card={card}
                          onUpdate={(patch) => updateCard("hoteis", card.id, patch)}
                          onRemove={() => removeCard("hoteis", card.id)}
                          onAddImage={(url) => updateCard("hoteis", card.id, { galeriaImagens: [...card.galeriaImagens, url].slice(0, 12) })}
                        />
                      ))
                    )}
                  </div>
                )}

                {/* Public mode: beautiful read-only cards */}
                {!isAdminMode && (
                  <div className="space-y-4">
                    {roteiro.hoteis.length === 0 || roteiro.hoteis.every((c) => !c.titulo.trim()) ? (
                      <div className="text-center py-10 text-muted-foreground border border-dashed border-border rounded-2xl">
                        <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">Hotel será definido pelo organizador</p>
                        <p className="text-xs mt-1">O hotel será revelado após a confirmação do grupo</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {roteiro.hoteis.filter((c) => c.titulo.trim()).map((card) => (
                          <HotelPublicCard key={card.id} card={card} />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => goStep(2)} className="rounded-xl gap-2 h-11 px-5">
                    <ChevronLeft className="w-4 h-4" /> Anterior
                  </Button>
                  <Button onClick={() => goStep(4)} className="rounded-xl gap-2 h-11 px-6 font-bold" data-testid="btn-step-next-3">
                    Próximo: Roteiro <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* ════════ STEP 4 — Roteiro ════════ */}
            {activeStep === 4 && (
              <div className="bg-white rounded-2xl border border-border p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300" data-testid="wizard-step-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-bold text-foreground">Mapa de dias e roteiro</h2>
                    <p className="text-xs text-muted-foreground">Selecione atrações, passeios e parques para cada dia</p>
                  </div>
                </div>

                {/* Day tabs */}
                {tripDays.length > 0 && (
                  <div>
                    <div className="flex gap-2 overflow-x-auto pb-2 mb-4" data-testid="criar-excursao-wizard-trip-days">
                      {tripDays.map((d) => {
                        const count = getDayItemCount(d.id);
                        return (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => setActiveDayTab(d.id)}
                            data-testid={`day-tab-${d.id}`}
                            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
                              activeDayTab === d.id
                                ? "bg-primary text-white border-primary shadow-md"
                                : "bg-white text-muted-foreground border-border hover:border-primary/40 hover:text-primary"
                            }`}
                          >
                            {d.label}
                            {count > 0 && (
                              <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${activeDayTab === d.id ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-700"}`}>
                                {count}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {activeDayTab && (
                      <div className="space-y-5">
                        {/* Parques */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Waves className="w-4 h-4 text-blue-500" />
                              <h3 className="font-semibold text-sm text-foreground">Parques aquáticos</h3>
                              <Badge variant="secondary" className="text-xs" data-testid="criar-excursao-wizard-parques">
                                {(daySelections[activeDayTab]?.parques?.length || 0)} selecionado(s)
                              </Badge>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3" data-testid="criar-excursao-wizard-parquesAquaticos-catalogo-list">
                            {catalogoRoteiro.parquesAquaticos.map((card) => (
                              <CatalogCard
                                key={card.id}
                                card={card}
                                selected={daySelections[activeDayTab]?.parques?.includes(card.id) || false}
                                onToggle={() => toggleDayCatalog(activeDayTab, "parques", card.id)}
                                neuroCount={neuroCounts[card.id]}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Atrações */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-amber-500" />
                              <h3 className="font-semibold text-sm text-foreground">Atrações</h3>
                              <Badge variant="secondary" className="text-xs" data-testid="criar-excursao-wizard-atracoes">
                                {(daySelections[activeDayTab]?.atracoes?.length || 0)} selecionado(s)
                              </Badge>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3" data-testid="criar-excursao-wizard-atracoes-catalogo-list">
                            {catalogoRoteiro.atracoes.map((card) => (
                              <CatalogCard
                                key={card.id}
                                card={card}
                                selected={daySelections[activeDayTab]?.atracoes?.includes(card.id) || false}
                                onToggle={() => toggleDayCatalog(activeDayTab, "atracoes", card.id)}
                                neuroCount={neuroCounts[card.id]}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Passeios */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Footprints className="w-4 h-4 text-emerald-500" />
                              <h3 className="font-semibold text-sm text-foreground">Passeios</h3>
                              <Badge variant="secondary" className="text-xs" data-testid="criar-excursao-wizard-passeios">
                                {(daySelections[activeDayTab]?.passeios?.length || 0)} selecionado(s)
                              </Badge>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3" data-testid="criar-excursao-wizard-passeios-catalogo-list">
                            {catalogoRoteiro.passeios.map((card) => (
                              <CatalogCard
                                key={card.id}
                                card={card}
                                selected={daySelections[activeDayTab]?.passeios?.includes(card.id) || false}
                                onToggle={() => toggleDayCatalog(activeDayTab, "passeios", card.id)}
                                neuroCount={neuroCounts[card.id]}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {tripDays.length === 0 && (
                  <div className="text-center py-10 text-muted-foreground border border-dashed rounded-2xl">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Defina as datas na etapa 1 para ver o mapa de dias</p>
                  </div>
                )}

                {/* Notas admin */}
                {isAdminMode && (
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Notas internas (admin)</label>
                    <Textarea value={roteiro.notas || ""} onChange={(e) => setRoteiro((p) => ({ ...p, notas: e.target.value }))} placeholder="Observações para o guia, motorista ou equipe..." className="rounded-xl resize-none min-h-[80px]" data-testid="criar-excursao-wizard-notas" />
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => goStep(3)} className="rounded-xl gap-2 h-11 px-5">
                    <ChevronLeft className="w-4 h-4" /> Anterior
                  </Button>
                  <Button onClick={() => goStep(5)} className="rounded-xl gap-2 h-11 px-6 font-bold" data-testid="btn-step-next-4">
                    Próximo: Revisão <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* ════════ STEP 5 — Revisão & Publicar ════════ */}
            {activeStep === 5 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300" data-testid="wizard-step-5">

                {/* Completion bar */}
                <div className="bg-white rounded-2xl border border-border p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-bold text-foreground">Completude do roteiro</h2>
                        <p className="text-xs text-muted-foreground">Roteiros completos convertem 3× mais inscrições</p>
                      </div>
                    </div>
                    <div className="text-2xl font-extrabold text-primary">{completionScore}%</div>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${completionScore >= 80 ? "bg-emerald-500" : completionScore >= 50 ? "bg-amber-500" : "bg-primary"}`}
                      style={{ width: `${completionScore}%` }}
                      data-testid="completion-bar"
                    />
                  </div>
                  {completionScore >= 80 && (
                    <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-xl p-3">
                      <Check className="w-5 h-5" />
                      Roteiro completo! Você está pronto para publicar.
                    </div>
                  )}
                  {completionScore < 80 && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-amber-800 bg-amber-50 rounded-xl p-3">
                      <AlertCircle className="w-4 h-4" />
                      Complete mais seções para maximizar as inscrições.
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="bg-white rounded-2xl border border-border p-6">
                  <h3 className="font-bold text-foreground mb-4">Resumo do roteiro</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: "Destino", value: destino || "—", icon: MapPin },
                      { label: "Duração", value: tripDays.length > 0 ? `${tripDays.length} dia(s)` : "—", icon: Calendar },
                      { label: "Capacidade", value: `${capacidade} pessoas`, icon: Users },
                      { label: "Veículo", value: roteiro.veiculoTipo || suggestedVehicle, icon: Bus },
                      { label: "Hotel", value: roteiro.hoteis[0]?.titulo || "Não definido", icon: Hotel },
                      { label: "Itens selecionados", value: `${totalCatalogSelected} atividades`, icon: Star },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="bg-muted/40 rounded-xl p-3">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                          <Icon className="w-3.5 h-3.5" />{label}
                        </div>
                        <p className="font-semibold text-sm text-foreground">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Catalog summary */}
                <div className="bg-white rounded-2xl border border-border p-6">
                  <h3 className="font-bold text-foreground mb-4">Atividades selecionadas</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { label: "Parques", ids: selectedCatalogIds.parquesAquaticos, source: catalogoRoteiro.parquesAquaticos, icon: Waves, color: "text-blue-500 bg-blue-50" },
                      { label: "Atrações", ids: selectedCatalogIds.atracoes, source: catalogoRoteiro.atracoes, icon: Star, color: "text-amber-500 bg-amber-50" },
                      { label: "Passeios", ids: selectedCatalogIds.passeios, source: catalogoRoteiro.passeios, icon: Footprints, color: "text-emerald-500 bg-emerald-50" },
                    ].map(({ label, ids, source, icon: Icon, color }) => {
                      const selected = source.filter((c) => ids.includes(c.id));
                      return (
                        <div key={label} className="space-y-2">
                          <div className={`flex items-center gap-1.5 text-xs font-bold rounded-full px-3 py-1 w-fit ${color}`}>
                            <Icon className="w-3.5 h-3.5" />{label} ({selected.length})
                          </div>
                          {selected.length === 0 ? (
                            <p className="text-xs text-muted-foreground pl-1">Nenhum selecionado</p>
                          ) : (
                            <div className="space-y-1.5">
                              {selected.map((c) => (
                                <div key={c.id} className="flex items-center gap-2 text-xs">
                                  <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                                  <span className="text-foreground">{c.titulo}</span>
                                  {c.precoPorPessoa && c.precoPorPessoa > 0 && (
                                    <span className="text-muted-foreground ml-auto">R$ {c.precoPorPessoa}/p</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Neuromarketing urgency */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <p className="font-bold text-primary text-sm">CaldasAI — Insights do seu roteiro</p>
                  </div>
                  <div className="space-y-2 text-sm text-blue-800">
                    <p>✦ <strong>{Math.floor(Math.random() * 30) + 20} pessoas</strong> já adicionaram excursões similares aos favoritos esta semana.</p>
                    <p>✦ Grupos com roteiro completo publicam <strong>3× mais rápido</strong> e fecham em média em 4 dias.</p>
                    <p>✦ Hot Park e Di Roma têm <strong>disponibilidade limitada</strong> para o período selecionado.</p>
                  </div>
                </div>

                {/* Preview & Save buttons */}
                <div className="bg-white rounded-2xl border border-border p-6 space-y-3">
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" onClick={() => setFullscreenPreviewOpen(true)} className="rounded-xl gap-2 h-11" data-testid="criar-excursao-wizard-fullscreen-preview-open">
                      <Eye className="w-4 h-4" /> Ver como convidado
                    </Button>
                    <Button variant="outline" onClick={() => handleSaveRoteiro(false)} disabled={savingRoteiro} className="rounded-xl gap-2 h-11" data-testid="criar-excursao-wizard-salvar">
                      <Save className="w-4 h-4" /> {savingRoteiro ? "Salvando..." : "Salvar rascunho"}
                    </Button>
                  </div>
                  <Button onClick={() => handleSaveRoteiro(true)} disabled={savingRoteiro} className="w-full h-14 rounded-2xl text-base font-extrabold gap-3 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 shadow-lg" data-testid="criar-excursao-wizard-publicar">
                    <Rocket className="w-5 h-5" />
                    {savingRoteiro ? "Publicando..." : "Publicar e começar a receber inscrições"}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">Você pode editar e salvar novamente a qualquer momento após publicar.</p>
                </div>

                <div className="flex justify-start">
                  <Button variant="outline" onClick={() => goStep(4)} className="rounded-xl gap-2 h-11 px-5">
                    <ChevronLeft className="w-4 h-4" /> Anterior
                  </Button>
                </div>
              </div>
            )}

            {/* Sync indicator */}
            {mainSyncStatus !== "synced" && (
              <div className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-xl mt-4 ${mainSyncStatus === "error" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>
                <div className={`w-2 h-2 rounded-full ${mainSyncStatus === "error" ? "bg-red-500" : "bg-amber-500 animate-pulse"}`} />
                {mainSyncStatus === "syncing" ? "Salvando..." : "Falha na sincronização"}
              </div>
            )}
          </>
        )}

        {error && <p className="text-sm text-destructive mt-4">{error}</p>}
      </div>

      {/* ── Fullscreen preview overlay ── */}
      {fullscreenPreviewOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" data-testid="criar-excursao-wizard-fullscreen-preview-overlay">
          <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-border shadow-2xl" data-testid="criar-excursao-wizard-fullscreen-preview">
            <div className="sticky top-0 z-10 bg-white border-b border-border px-6 py-4 flex items-center justify-between">
              <div>
                <p className="font-extrabold text-primary text-lg">Simulação: visão do convidado</p>
                <p className="text-xs text-muted-foreground">Prévia em <strong>/viagens-grupo/{excursaoId}</strong></p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => void refreshFullscreenPreview()} className="rounded-xl h-8 text-xs" data-testid="criar-excursao-wizard-fullscreen-preview-refresh">
                  {previewLoading ? "Atualizando..." : "Atualizar"}
                </Button>
                <Button size="sm" onClick={() => setFullscreenPreviewOpen(false)} className="rounded-xl h-8 text-xs" data-testid="criar-excursao-wizard-fullscreen-preview-close">
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Veículo", value: roteiro.veiculoTipo || suggestedVehicle },
                  { label: "Capacidade", value: `${capacidade} pessoas` },
                  { label: "Modo", value: roteiro.manualVehicleOverride ? "Override manual" : "Automático" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-muted/40 rounded-xl p-3">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="font-bold text-foreground text-sm mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {previewSectionsData.map((section) => (
                  <div key={section.label} className="rounded-xl border border-border p-4">
                    <p className="font-bold text-sm text-foreground mb-3">{section.label}</p>
                    {section.cards.length === 0 || section.cards.every((c) => !c.titulo.trim()) ? (
                      <p className="text-xs text-muted-foreground">{section.fallback}</p>
                    ) : (
                      <div className="space-y-2">
                        {section.cards.filter((c) => c.titulo.trim()).slice(0, 3).map((card) => (
                          <div key={card.id} className="flex items-center gap-3 rounded-lg border border-border overflow-hidden bg-white">
                            {card.galeriaImagens?.[0] ? (
                              <img src={card.galeriaImagens[0]} alt={card.titulo} className="w-16 h-12 object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-16 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 flex-shrink-0" />
                            )}
                            <div className="flex-1 py-2 pr-2 min-w-0">
                              <p className="font-semibold text-xs text-foreground truncate">{card.titulo}</p>
                              {card.precoPorPessoa && card.precoPorPessoa > 0 && (
                                <p className="text-xs text-muted-foreground">R$ {card.precoPorPessoa}/pessoa</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
