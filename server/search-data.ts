
export interface CatalogExcursao {
  id: string;
  titulo: string;
  destino: string;
  estado: string;
  cidadeSaida: string;
  estadoSaida: string;
  cepSaida: string;
  dataPartida: string;
  dataRetorno: string;
  diasDuracao: number;
  preco: number;
  precoOriginal?: number;
  vagasTotal: number;
  vagasOcupadas: number;
  organizador: string;
  avatar: string;
  rating: number;
  avaliacoes: number;
  categoria: string;
  inclui: string[];
  imagem: string;
  destaque?: boolean;
  tag?: string;
  slug: string;
  descricao: string;
}

export const CATALOG_EXCURSOES: CatalogExcursao[] = [
  {
    id: "1", titulo: "Caldas Novas Família Total",
    destino: "Caldas Novas", estado: "GO",
    cidadeSaida: "Goiânia", estadoSaida: "GO", cepSaida: "74000-000",
    dataPartida: "2026-04-18", dataRetorno: "2026-04-21", diasDuracao: 4,
    preco: 890, precoOriginal: 1190, vagasTotal: 48, vagasOcupadas: 41,
    organizador: "Reservei Viagens", avatar: "RV", rating: 4.9, avaliacoes: 312, categoria: "família",
    inclui: ["Transporte", "Hotel 4★", "Café da manhã", "Guia", "Seguro Viagem"],
    imagem: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
    destaque: true, tag: "Mais vendida", slug: "caldas-novas-familia-total",
    descricao: "4 dias de diversão em família com hotel 4 estrelas, café incluso e guia dedicado.",
  },
  {
    id: "2", titulo: "Hot Park & Rio Quente Fest",
    destino: "Rio Quente", estado: "GO",
    cidadeSaida: "Brasília", estadoSaida: "DF", cepSaida: "70000-000",
    dataPartida: "2026-04-25", dataRetorno: "2026-04-27", diasDuracao: 3,
    preco: 720, precoOriginal: 950, vagasTotal: 40, vagasOcupadas: 29,
    organizador: "Tour Caldas", avatar: "TC", rating: 4.8, avaliacoes: 184, categoria: "aventura",
    inclui: ["Transporte", "Hotel 5★", "Ingresso Hot Park", "Jantar", "Guia"],
    imagem: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80",
    tag: "Ingresso incluso", slug: "hot-park-rio-quente-fest",
    descricao: "Fim de semana no maior parque aquático de águas quentes do mundo.",
  },
  {
    id: "3", titulo: "Semana Santa Caldas Premium",
    destino: "Caldas Novas", estado: "GO",
    cidadeSaida: "Uberlândia", estadoSaida: "MG", cepSaida: "38400-000",
    dataPartida: "2026-04-14", dataRetorno: "2026-04-20", diasDuracao: 7,
    preco: 1850, precoOriginal: 2400, vagasTotal: 30, vagasOcupadas: 27,
    organizador: "Reservei Viagens", avatar: "RV", rating: 5.0, avaliacoes: 97, categoria: "luxo",
    inclui: ["Transporte Premium", "Resort 5★", "All Inclusive", "Spa", "Passeios", "Seguro"],
    imagem: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80",
    destaque: true, tag: "Últimas vagas", slug: "semana-santa-caldas-premium",
    descricao: "Uma semana completa no melhor resort de Caldas Novas. All inclusive, spa e transporte premium.",
  },
  {
    id: "4", titulo: "Finde nas Termas Goianas",
    destino: "Caldas Novas", estado: "GO",
    cidadeSaida: "Goiânia", estadoSaida: "GO", cepSaida: "74000-000",
    dataPartida: "2026-05-02", dataRetorno: "2026-05-04", diasDuracao: 3,
    preco: 480, vagasTotal: 44, vagasOcupadas: 18,
    organizador: "Grupo Viagens GO", avatar: "GV", rating: 4.7, avaliacoes: 56, categoria: "econômico",
    inclui: ["Transporte", "Hotel 3★", "Café da manhã"],
    imagem: "https://images.unsplash.com/photo-1510525009512-ad7fc13d8422?w=600&q=80",
    slug: "finde-termas-goianas",
    descricao: "Escapada econômica de fim de semana para curtir as águas quentes de Caldas Novas.",
  },
  {
    id: "5", titulo: "Aventura nas Águas — Grupos Jovens",
    destino: "Rio Quente", estado: "GO",
    cidadeSaida: "Belo Horizonte", estadoSaida: "MG", cepSaida: "30100-000",
    dataPartida: "2026-05-09", dataRetorno: "2026-05-12", diasDuracao: 4,
    preco: 650, precoOriginal: 820, vagasTotal: 36, vagasOcupadas: 22,
    organizador: "Caldas Jovem", avatar: "CJ", rating: 4.6, avaliacoes: 73, categoria: "aventura",
    inclui: ["Transporte", "Pousada", "Café da manhã", "Rafting", "Trilha"],
    imagem: "https://images.unsplash.com/photo-1559825481-12a05cc00344?w=600&q=80",
    tag: "Para jovens", slug: "aventura-aguas-jovens",
    descricao: "Roteiro especial para jovens aventureiros. Rafting, trilhas e atividades radicais.",
  },
  {
    id: "6", titulo: "Circuito Completo Caldas + Parque",
    destino: "Caldas Novas", estado: "GO",
    cidadeSaida: "São Paulo", estadoSaida: "SP", cepSaida: "01000-000",
    dataPartida: "2026-05-16", dataRetorno: "2026-05-20", diasDuracao: 5,
    preco: 1120, precoOriginal: 1450, vagasTotal: 42, vagasOcupadas: 8,
    organizador: "Reservei Viagens", avatar: "RV", rating: 4.9, avaliacoes: 228, categoria: "família",
    inclui: ["Transporte", "Hotel 4★", "Café da manhã", "2 Parques", "City Tour", "Guia"],
    imagem: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
    slug: "circuito-completo-caldas-parque",
    descricao: "O pacote mais completo: 5 dias com 2 parques aquáticos, city tour e hotel 4 estrelas.",
  },
  {
    id: "7", titulo: "Caldas Express — Bate e Volta",
    destino: "Caldas Novas", estado: "GO",
    cidadeSaida: "Anápolis", estadoSaida: "GO", cepSaida: "75000-000",
    dataPartida: "2026-05-03", dataRetorno: "2026-05-04", diasDuracao: 2,
    preco: 290, vagasTotal: 50, vagasOcupadas: 35,
    organizador: "Caldas Express", avatar: "CE", rating: 4.5, avaliacoes: 42, categoria: "econômico",
    inclui: ["Transporte", "Hotel 2★", "Café da manhã"],
    imagem: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&q=80",
    slug: "caldas-express-bate-volta",
    descricao: "Viagem rápida e econômica saindo de Anápolis. Ideal para conhecer Caldas Novas.",
  },
  {
    id: "8", titulo: "Romântica Caldas — Casal Premium",
    destino: "Rio Quente", estado: "GO",
    cidadeSaida: "Ribeirão Preto", estadoSaida: "SP", cepSaida: "14000-000",
    dataPartida: "2026-05-23", dataRetorno: "2026-05-26", diasDuracao: 4,
    preco: 1350, precoOriginal: 1700, vagasTotal: 20, vagasOcupadas: 14,
    organizador: "Viagens Romance", avatar: "VR", rating: 4.9, avaliacoes: 65, categoria: "romântico",
    inclui: ["Transporte", "Resort 5★", "All Inclusive", "Spa Casal", "Jantar Especial"],
    imagem: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
    tag: "Romântico", slug: "romantica-caldas-casal-premium",
    descricao: "Roteiro exclusivo para casais. Resort 5 estrelas, spa, jantar a dois.",
  },
  {
    id: "9", titulo: "Melhor Idade — Caldas Termal",
    destino: "Caldas Novas", estado: "GO",
    cidadeSaida: "Campo Grande", estadoSaida: "MS", cepSaida: "79000-000",
    dataPartida: "2026-06-01", dataRetorno: "2026-06-05", diasDuracao: 5,
    preco: 780, precoOriginal: 990, vagasTotal: 38, vagasOcupadas: 20,
    organizador: "Grupo Viagens GO", avatar: "GV", rating: 4.8, avaliacoes: 91, categoria: "família",
    inclui: ["Transporte", "Hotel 3★", "All Inclusive", "Acompanhante", "Seguro"],
    imagem: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80",
    slug: "melhor-idade-caldas-termal",
    descricao: "Roteiro especial para a melhor idade. Ritmo tranquilo, hotel confortável e águas termais.",
  },
  {
    id: "10", titulo: "Feriado Corpus Christi Caldas",
    destino: "Caldas Novas", estado: "GO",
    cidadeSaida: "Cuiabá", estadoSaida: "MT", cepSaida: "78000-000",
    dataPartida: "2026-06-04", dataRetorno: "2026-06-08", diasDuracao: 5,
    preco: 920, precoOriginal: 1200, vagasTotal: 46, vagasOcupadas: 12,
    organizador: "Tour Caldas", avatar: "TC", rating: 4.7, avaliacoes: 38, categoria: "família",
    inclui: ["Transporte", "Hotel 4★", "Café da manhã", "1 Parque", "City Tour"],
    imagem: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80",
    tag: "Feriado", slug: "feriado-corpus-christi-caldas",
    descricao: "Aproveite o feriado de Corpus Christi em Caldas Novas. Parque aquático e city tour inclusos.",
  },
  {
    id: "11", titulo: "Caldas All Inclusive Deluxe",
    destino: "Caldas Novas", estado: "GO",
    cidadeSaida: "Goiânia", estadoSaida: "GO", cepSaida: "74000-000",
    dataPartida: "2026-05-30", dataRetorno: "2026-06-03", diasDuracao: 5,
    preco: 1680, precoOriginal: 2100, vagasTotal: 24, vagasOcupadas: 19,
    organizador: "Reservei Viagens", avatar: "RV", rating: 5.0, avaliacoes: 152, categoria: "luxo",
    inclui: ["Transporte VIP", "Resort 5★", "All Inclusive", "3 Parques", "Spa", "Guia Premium"],
    imagem: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    destaque: true, tag: "Premium", slug: "caldas-all-inclusive-deluxe",
    descricao: "A experiência mais completa em Caldas Novas. Resort 5 estrelas, 3 parques e spa.",
  },
  {
    id: "12", titulo: "Rio Quente Radical — Jovem Aventureiro",
    destino: "Rio Quente", estado: "GO",
    cidadeSaida: "Brasília", estadoSaida: "DF", cepSaida: "70000-000",
    dataPartida: "2026-06-13", dataRetorno: "2026-06-16", diasDuracao: 4,
    preco: 590, vagasTotal: 40, vagasOcupadas: 15,
    organizador: "Caldas Jovem", avatar: "CJ", rating: 4.6, avaliacoes: 47, categoria: "aventura",
    inclui: ["Transporte", "Pousada", "Café da manhã", "Rafting", "Rapel"],
    imagem: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=600&q=80",
    tag: "Radical", slug: "rio-quente-radical",
    descricao: "Para quem busca adrenalina. Rafting, rapel e trilhas em Rio Quente.",
  },
  {
    id: "13", titulo: "Caldas Novas Finde Econômico",
    destino: "Caldas Novas", estado: "GO",
    cidadeSaida: "Uberlândia", estadoSaida: "MG", cepSaida: "38400-000",
    dataPartida: "2026-06-06", dataRetorno: "2026-06-08", diasDuracao: 3,
    preco: 420, vagasTotal: 48, vagasOcupadas: 10,
    organizador: "Grupo Viagens GO", avatar: "GV", rating: 4.5, avaliacoes: 33, categoria: "econômico",
    inclui: ["Transporte", "Pousada", "Café da manhã"],
    imagem: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
    slug: "caldas-novas-finde-economico",
    descricao: "Fim de semana em Caldas Novas sem pesar no bolso. Pousada e transporte garantidos.",
  },
  {
    id: "14", titulo: "Férias de Julho em Caldas",
    destino: "Caldas Novas", estado: "GO",
    cidadeSaida: "São Paulo", estadoSaida: "SP", cepSaida: "01000-000",
    dataPartida: "2026-07-11", dataRetorno: "2026-07-17", diasDuracao: 7,
    preco: 1490, precoOriginal: 1900, vagasTotal: 50, vagasOcupadas: 5,
    organizador: "Reservei Viagens", avatar: "RV", rating: 4.9, avaliacoes: 201, categoria: "família",
    inclui: ["Transporte", "Hotel 4★", "Café da manhã", "2 Parques", "Guia", "Seguro"],
    imagem: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80",
    tag: "Férias Julho", slug: "ferias-julho-caldas",
    descricao: "Férias de julho com a família! 7 dias com 2 parques, guia e hotel 4 estrelas.",
  },
  {
    id: "15", titulo: "Escapada Termal — Saída BH",
    destino: "Caldas Novas", estado: "GO",
    cidadeSaida: "Belo Horizonte", estadoSaida: "MG", cepSaida: "30100-000",
    dataPartida: "2026-05-22", dataRetorno: "2026-05-25", diasDuracao: 4,
    preco: 750, precoOriginal: 950, vagasTotal: 44, vagasOcupadas: 30,
    organizador: "Tour Caldas", avatar: "TC", rating: 4.7, avaliacoes: 88, categoria: "família",
    inclui: ["Transporte", "Hotel 3★", "Café da manhã", "1 Parque", "Guia"],
    imagem: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&q=80",
    slug: "escapada-termal-saida-bh",
    descricao: "Saída direta de BH para Caldas Novas. Ônibus confortável, hotel e parque inclusos.",
  },
  {
    id: "16", titulo: "Caldas Premium Ribeirão",
    destino: "Rio Quente", estado: "GO",
    cidadeSaida: "Ribeirão Preto", estadoSaida: "SP", cepSaida: "14000-000",
    dataPartida: "2026-06-20", dataRetorno: "2026-06-24", diasDuracao: 5,
    preco: 1280, precoOriginal: 1600, vagasTotal: 32, vagasOcupadas: 11,
    organizador: "Viagens Romance", avatar: "VR", rating: 4.8, avaliacoes: 54, categoria: "luxo",
    inclui: ["Transporte", "Resort 4★", "All Inclusive", "Hot Park", "Spa"],
    imagem: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80",
    slug: "caldas-premium-ribeirao",
    descricao: "Saindo de Ribeirão Preto rumo ao Rio Quente. Resort 4 estrelas, Hot Park e spa.",
  },
  {
    id: "17", titulo: "Caldas & Hot Park — Saída Anápolis",
    destino: "Caldas Novas", estado: "GO",
    cidadeSaida: "Anápolis", estadoSaida: "GO", cepSaida: "75000-000",
    dataPartida: "2026-06-27", dataRetorno: "2026-06-30", diasDuracao: 4,
    preco: 680, precoOriginal: 850, vagasTotal: 46, vagasOcupadas: 22,
    organizador: "Caldas Express", avatar: "CE", rating: 4.6, avaliacoes: 61, categoria: "família",
    inclui: ["Transporte", "Hotel 3★", "Café da manhã", "1 Parque", "City Tour"],
    imagem: "https://images.unsplash.com/photo-1549294413-26f195200c16?w=600&q=80",
    slug: "caldas-hot-park-anapolis",
    descricao: "Saída de Anápolis com parque aquático e city tour inclusos.",
  },
  {
    id: "18", titulo: "Caldas Novas VIP — Saída Campo Grande",
    destino: "Rio Quente", estado: "GO",
    cidadeSaida: "Campo Grande", estadoSaida: "MS", cepSaida: "79000-000",
    dataPartida: "2026-07-04", dataRetorno: "2026-07-09", diasDuracao: 6,
    preco: 1550, precoOriginal: 1950, vagasTotal: 28, vagasOcupadas: 6,
    organizador: "Tour Caldas", avatar: "TC", rating: 4.8, avaliacoes: 29, categoria: "luxo",
    inclui: ["Transporte VIP", "Resort 5★", "All Inclusive", "2 Parques", "Spa", "Guia"],
    imagem: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80",
    tag: "VIP", slug: "caldas-novas-vip-campo-grande",
    descricao: "Viagem VIP saindo de Campo Grande. Resort 5 estrelas, 2 parques e all inclusive.",
  },
];

interface SearchItem {
  id: string;
  type: string;
  name: string;
  slug: string;
  enterpriseName: string;
  category: string;
  subcategories: string[];
  city: string;
  state: string;
  region: string;
  descriptionShort: string;
  descriptionLong: string;
  tags: string[];
  profiles: string[];
  priceFrom: number;
  rating: number;
  reviewCount: number;
  popularityScore: number;
  isFeatured: boolean;
  comboAvailable: boolean;
  address: string;
  amenities: string[];
  images: string[];
  coordinates?: { lat: number; lng: number };
}

const SEARCH_ITEMS: SearchItem[] = [
  ...CATALOG_EXCURSOES.map((e) => ({
    id: `exc-${e.id}`,
    type: "excursion" as const,
    name: e.titulo,
    slug: e.slug,
    enterpriseName: e.organizador,
    category: e.categoria,
    subcategories: [],
    city: e.destino,
    state: "GO",
    region: "Centro-Oeste",
    descriptionShort: e.descricao,
    descriptionLong: e.descricao,
    tags: e.inclui,
    profiles: [e.categoria],
    priceFrom: e.preco,
    rating: e.rating,
    reviewCount: e.avaliacoes,
    popularityScore: e.destaque ? 100 : 50,
    isFeatured: e.destaque ?? false,
    comboAvailable: false,
    address: `${e.destino}, GO`,
    amenities: e.inclui,
    images: [e.imagem],
    coordinates: undefined,
  })),
  {
    id: "hotel-di-roma", type: "hotel", name: "Di Roma Grand Hotel", slug: "di-roma-grand-hotel",
    enterpriseName: "Di Roma Hotels", category: "hotel", subcategories: ["resort", "spa"],
    city: "Caldas Novas", state: "GO", region: "Centro-Oeste",
    descriptionShort: "Resort 5 estrelas com piscinas termais, toboáguas e spa completo",
    descriptionLong: "O Di Roma Grand Hotel é o maior resort de Caldas Novas, com 18 piscinas termais, parque aquático e spa de primeira linha.",
    tags: ["termas", "spa", "família", "resort"], profiles: ["família", "luxo"],
    priceFrom: 280, rating: 4.9, reviewCount: 1240, popularityScore: 98, isFeatured: true, comboAvailable: true,
    address: "Av. Ministro Olavo Drummond, 25 - Caldas Novas, GO",
    amenities: ["Wi-Fi", "Piscina Termal", "Spa", "Restaurante", "Bar", "Academia"],
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80"],
    coordinates: { lat: -17.7428, lng: -48.6234 },
  },
  {
    id: "hotel-thermas-laranjais", type: "hotel", name: "Resort Thermas dos Laranjais", slug: "thermas-laranjais",
    enterpriseName: "Grupo Thermas", category: "hotel", subcategories: ["resort", "thermas"],
    city: "Caldas Novas", state: "GO", region: "Centro-Oeste",
    descriptionShort: "Resort familiar com águas termais naturais e área de lazer completa",
    descriptionLong: "O Thermas dos Laranjais oferece 12 piscinas de água quente natural, tobogãs e atrações para toda a família.",
    tags: ["termas", "família", "piscina", "resort"], profiles: ["família", "econômico"],
    priceFrom: 220, rating: 4.7, reviewCount: 890, popularityScore: 88, isFeatured: false, comboAvailable: true,
    address: "Rod. GO-507, km 0 - Caldas Novas, GO",
    amenities: ["Wi-Fi", "Piscina Termal", "Restaurante", "Playground", "Quadra"],
    images: ["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80"],
    coordinates: { lat: -17.7362, lng: -48.6189 },
  },
  {
    id: "hotel-rio-quente-resorts", type: "hotel", name: "Rio Quente Resorts", slug: "rio-quente-resorts",
    enterpriseName: "Rio Quente Resorts", category: "hotel", subcategories: ["resort", "parque"],
    city: "Rio Quente", state: "GO", region: "Centro-Oeste",
    descriptionShort: "Resort completo com acesso ao Hot Park — parque de águas quentes do mundo",
    descriptionLong: "O Rio Quente Resorts oferece acesso ao Hot Park, o maior parque aquático de águas quentes naturais do mundo.",
    tags: ["hot-park", "termas", "família", "aventura"], profiles: ["família", "aventura"],
    priceFrom: 350, rating: 4.8, reviewCount: 2100, popularityScore: 95, isFeatured: true, comboAvailable: true,
    address: "Rod. GO-139, km 6,5 - Rio Quente, GO",
    amenities: ["Wi-Fi", "Acesso Hot Park", "Piscina Termal", "Restaurante", "Bar", "Spa"],
    images: ["https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80"],
    coordinates: { lat: -17.7832, lng: -48.7541 },
  },
  {
    id: "parque-hot-park", type: "park", name: "Hot Park", slug: "hot-park",
    enterpriseName: "Rio Quente Resorts", category: "parque-aquático", subcategories: ["thermas", "toboágua"],
    city: "Rio Quente", state: "GO", region: "Centro-Oeste",
    descriptionShort: "O maior parque aquático de águas quentes do mundo — toboáguas, rio lento e praia artificial",
    descriptionLong: "Com 13 atrações aquáticas, piscinas de ondas e águas naturalmente quentes, o Hot Park é destino obrigatório para toda a família.",
    tags: ["parque-aquático", "termas", "família", "toboágua", "aventura"], profiles: ["família", "aventura"],
    priceFrom: 189, rating: 4.9, reviewCount: 3200, popularityScore: 100, isFeatured: true, comboAvailable: true,
    address: "Rod. GO-139, km 6,5 - Rio Quente, GO",
    amenities: ["Toboágua", "Rio Lento", "Piscina de Ondas", "Praia Artificial", "Restaurante"],
    images: ["https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80"],
    coordinates: { lat: -17.7841, lng: -48.7558 },
  },
  {
    id: "parque-di-roma-acqua", type: "park", name: "Di Roma Acqua Park", slug: "di-roma-acqua-park",
    enterpriseName: "Di Roma Hotels", category: "parque-aquático", subcategories: ["thermas", "infantil"],
    city: "Caldas Novas", state: "GO", region: "Centro-Oeste",
    descriptionShort: "Piscinas termais, toboáguas radicais e área infantil completa",
    descriptionLong: "O Di Roma Acqua Park possui 8 toboáguas, piscinas de águas termais naturais e uma área infantil especialmente projetada.",
    tags: ["parque-aquático", "termas", "família", "infantil"], profiles: ["família"],
    priceFrom: 130, rating: 4.7, reviewCount: 1850, popularityScore: 90, isFeatured: true, comboAvailable: false,
    address: "Av. Ministro Olavo Drummond, 25 - Caldas Novas, GO",
    amenities: ["Toboágua", "Piscina Infantil", "Restaurante", "Churrasqueira"],
    images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80"],
    coordinates: { lat: -17.7430, lng: -48.6238 },
  },
  {
    id: "atracao-mirante-corumba", type: "attraction", name: "Mirante do Rio Corumbá", slug: "mirante-corumba",
    enterpriseName: "Prefeitura de Caldas Novas", category: "atração natural", subcategories: ["mirante", "natureza"],
    city: "Caldas Novas", state: "GO", region: "Centro-Oeste",
    descriptionShort: "Vista panorâmica do lago e pôr do sol inesquecível",
    descriptionLong: "O Mirante do Rio Corumbá oferece uma vista privilegiada do lago e é ponto de encontro para apreciar o pôr do sol dourado.",
    tags: ["mirante", "natureza", "lago", "fotografia"], profiles: ["família", "romântico"],
    priceFrom: 0, rating: 4.6, reviewCount: 420, popularityScore: 65, isFeatured: false, comboAvailable: false,
    address: "Mirante do Corumbá - Caldas Novas, GO",
    amenities: ["Estacionamento", "Área de Contemplação"],
    images: ["https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80"],
    coordinates: { lat: -17.7205, lng: -48.6018 },
  },
  {
    id: "atracao-feira-noturna", type: "attraction", name: "Feira Noturna de Caldas Novas", slug: "feira-noturna-caldas",
    enterpriseName: "Prefeitura de Caldas Novas", category: "gastronomia", subcategories: ["gastronomia", "cultura"],
    city: "Caldas Novas", state: "GO", region: "Centro-Oeste",
    descriptionShort: "Artesanato, gastronomia regional e apresentações culturais",
    descriptionLong: "A Feira Noturna é ponto obrigatório para quem visita Caldas Novas. Artesanato goiano, comidas típicas e shows ao vivo todas as noites.",
    tags: ["gastronomia", "cultura", "artesanato", "noturno"], profiles: ["família", "romântico"],
    priceFrom: 0, rating: 4.5, reviewCount: 680, popularityScore: 75, isFeatured: false, comboAvailable: false,
    address: "Praça Mestre Orlando - Caldas Novas, GO",
    amenities: ["Alimentação", "Artesanato", "Banheiros"],
    images: ["https://images.unsplash.com/photo-1559825481-12a05cc00344?w=600&q=80"],
    coordinates: { lat: -17.7389, lng: -48.6201 },
  },
  {
    id: "destino-caldas-novas", type: "destination", name: "Caldas Novas", slug: "caldas-novas",
    enterpriseName: "RSV360", category: "destino", subcategories: ["termas", "parques"],
    city: "Caldas Novas", state: "GO", region: "Centro-Oeste",
    descriptionShort: "Capital das Águas Quentes — a cidade que nunca esfria",
    descriptionLong: "Caldas Novas é a maior estância hidrotermal do mundo, com águas naturalmente aquecidas entre 37°C e 51°C. Parques aquáticos, hotéis e diversão para toda a família.",
    tags: ["termas", "parques", "família", "natureza"], profiles: ["família", "aventura", "luxo"],
    priceFrom: 0, rating: 4.8, reviewCount: 5000, popularityScore: 99, isFeatured: true, comboAvailable: false,
    address: "Caldas Novas, GO, Brasil",
    amenities: [],
    images: ["https://images.unsplash.com/photo-1510525009512-ad7fc13d8422?w=600&q=80"],
    coordinates: { lat: -17.7389, lng: -48.6201 },
  },
  {
    id: "destino-rio-quente", type: "destination", name: "Rio Quente", slug: "rio-quente",
    enterpriseName: "RSV360", category: "destino", subcategories: ["hot-park", "resort"],
    city: "Rio Quente", state: "GO", region: "Centro-Oeste",
    descriptionShort: "Lar do Hot Park — o maior parque aquático de águas quentes do mundo",
    descriptionLong: "Rio Quente é famoso pelo Hot Park e pelo Rio Quente Resorts, um complexo de lazer com águas naturalmente quentes e estrutura completa.",
    tags: ["hot-park", "termas", "aventura", "família"], profiles: ["família", "aventura"],
    priceFrom: 0, rating: 4.7, reviewCount: 3200, popularityScore: 92, isFeatured: true, comboAvailable: false,
    address: "Rio Quente, GO, Brasil",
    amenities: [],
    images: ["https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=600&q=80"],
    coordinates: { lat: -17.7832, lng: -48.7541 },
  },
];

function normalize(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

export function searchItems(params: {
  q?: string;
  type?: string;
  city?: string;
  profile?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sort?: string;
  comboAvailable?: boolean;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
}): { results: SearchItem[]; total: number; hasMore: boolean; facets: Record<string, Record<string, number>> } {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(40, params.limit ?? 20);

  let items = [...SEARCH_ITEMS];

  if (params.q) {
    const q = normalize(params.q);
    items = items.filter((i) =>
      normalize(i.name).includes(q) ||
      normalize(i.descriptionShort).includes(q) ||
      normalize(i.city).includes(q) ||
      normalize(i.enterpriseName).includes(q) ||
      i.tags.some((t) => normalize(t).includes(q))
    );
  }

  if (params.type && params.type !== "all") {
    items = items.filter((i) => i.type === params.type);
  }

  if (params.city) {
    const c = normalize(params.city);
    items = items.filter((i) => normalize(i.city).includes(c));
  }

  if (params.profile) {
    const p = normalize(params.profile);
    items = items.filter((i) => i.profiles.some((pr) => normalize(pr).includes(p)));
  }

  if (params.minPrice !== undefined) {
    items = items.filter((i) => i.priceFrom >= params.minPrice!);
  }

  if (params.maxPrice !== undefined) {
    items = items.filter((i) => i.priceFrom <= params.maxPrice!);
  }

  if (params.rating !== undefined) {
    items = items.filter((i) => i.rating >= params.rating!);
  }

  if (params.comboAvailable) {
    items = items.filter((i) => i.comboAvailable);
  }

  if (params.isFeatured) {
    items = items.filter((i) => i.isFeatured);
  }

  if (params.sort === "price_asc") {
    items.sort((a, b) => a.priceFrom - b.priceFrom);
  } else if (params.sort === "rating") {
    items.sort((a, b) => b.rating - a.rating);
  } else if (params.sort === "popular") {
    items.sort((a, b) => b.popularityScore - a.popularityScore);
  } else {
    items.sort((a, b) => b.popularityScore - a.popularityScore);
  }

  const total = items.length;
  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit);
  const hasMore = start + limit < total;

  const facets = {
    types: {} as Record<string, number>,
    categories: {} as Record<string, number>,
    enterprises: {} as Record<string, number>,
    cities: {} as Record<string, number>,
    profiles: {} as Record<string, number>,
  };

  for (const item of SEARCH_ITEMS) {
    facets.types[item.type] = (facets.types[item.type] ?? 0) + 1;
    facets.categories[item.category] = (facets.categories[item.category] ?? 0) + 1;
    facets.enterprises[item.enterpriseName] = (facets.enterprises[item.enterpriseName] ?? 0) + 1;
    facets.cities[item.city] = (facets.cities[item.city] ?? 0) + 1;
    for (const p of item.profiles) {
      facets.profiles[p] = (facets.profiles[p] ?? 0) + 1;
    }
  }

  return { results: paged, total, hasMore, facets };
}

export function suggestItems(q: string): {
  names: SearchItem[];
  enterprises: SearchItem[];
  destinations: SearchItem[];
  featured: SearchItem[];
} {
  if (!q || q.trim().length < 1) {
    return { names: [], enterprises: [], destinations: [], featured: [] };
  }
  const qn = normalize(q);
  const byName = SEARCH_ITEMS.filter((i) => normalize(i.name).includes(qn)).slice(0, 5);
  const byEnt = SEARCH_ITEMS.filter((i) => normalize(i.enterpriseName).includes(qn)).slice(0, 3);
  const destinations = SEARCH_ITEMS.filter((i) => i.type === "destination" && normalize(i.name).includes(qn)).slice(0, 3);
  const featured = SEARCH_ITEMS.filter((i) => i.isFeatured).slice(0, 4);
  return { names: byName, enterprises: byEnt, destinations, featured };
}

export function filterCatalogExcursoes(params: {
  destino?: string;
  preco_min?: number;
  preco_max?: number;
  mes?: string;
  cidade_saida?: string;
  categoria?: string;
  q?: string;
  sort?: string;
  page?: number;
  limit?: number;
}): { items: CatalogExcursao[]; total: number; hasMore: boolean } {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(50, params.limit ?? 20);

  let items = [...CATALOG_EXCURSOES];

  if (params.q) {
    const q = normalize(params.q);
    items = items.filter((e) =>
      normalize(e.titulo).includes(q) ||
      normalize(e.destino).includes(q) ||
      normalize(e.organizador).includes(q) ||
      normalize(e.descricao).includes(q) ||
      normalize(e.cidadeSaida).includes(q)
    );
  }

  if (params.destino) {
    const d = normalize(params.destino);
    items = items.filter((e) => normalize(e.destino).includes(d));
  }

  if (params.cidade_saida) {
    const c = normalize(params.cidade_saida);
    items = items.filter((e) => normalize(e.cidadeSaida).includes(c) || normalize(e.estadoSaida).includes(c));
  }

  if (params.preco_min !== undefined) {
    items = items.filter((e) => e.preco >= params.preco_min!);
  }

  if (params.preco_max !== undefined) {
    items = items.filter((e) => e.preco <= params.preco_max!);
  }

  if (params.mes) {
    items = items.filter((e) => e.dataPartida.startsWith(params.mes!));
  }

  if (params.categoria && params.categoria !== "todas") {
    items = items.filter((e) => e.categoria === params.categoria);
  }

  if (params.sort === "preco-asc") items.sort((a, b) => a.preco - b.preco);
  else if (params.sort === "preco-desc") items.sort((a, b) => b.preco - a.preco);
  else if (params.sort === "vagas") items.sort((a, b) => (b.vagasTotal - b.vagasOcupadas) - (a.vagasTotal - a.vagasOcupadas));
  else if (params.sort === "avaliacao") items.sort((a, b) => b.rating - a.rating);
  else items.sort((a, b) => (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0));

  const total = items.length;
  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit);
  return { items: paged, total, hasMore: start + limit < total };
}
