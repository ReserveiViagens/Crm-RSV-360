import { mutateDb } from "./persistence";

export type ExcursaoStatus = "rascunho" | "aberta" | "fechada";

export interface Passageiro {
  nome: string;
  contato: string;
  rg?: string;
  cpf?: string;
}

export interface ExcursaoWizard {
  catalogoRoteiro?: {
    atracoes: RoteiroCatalogCard[];
    passeios: RoteiroCatalogCard[];
    parquesAquaticos: RoteiroCatalogCard[];
    refeicoes?: RoteiroCatalogCard[];
    transfers?: RoteiroCatalogCard[];
    updatedAt?: string;
  };
  onde?: {
    localSaida: string;
    destinoFinal: string;
  };
  como?: {
    atracoes: string[];
  };
  conforto?: {
    cafe: boolean;
    roupaCama: boolean;
    ingressosParque: boolean;
  };
  quem?: {
    passageiros: Passageiro[];
  };
  roteiroOficial?: {
    veiculoTipo?: string;
    veiculoAutomatico?: boolean;
    manualVehicleOverride?: boolean;
    hotelPrincipal?: string;
    atracoes: string[];
    passeios: string[];
    parquesAquaticos: string[];
    hoteis?: Array<{
      id: string;
      titulo: string;
      descricaoBreve?: string;
      galeriaImagens: string[];
      galeriaVideos: string[];
      precoPorPessoa?: number;
      duracaoHoras?: number;
      horarioSaida?: string;
      diasDisponiveis?: string[];
      badgeTipo?: "ia" | "popular";
      createdAt?: string;
      updatedAt?: string;
    }>;
    atracoesCards?: Array<{
      id: string;
      titulo: string;
      descricaoBreve?: string;
      galeriaImagens: string[];
      galeriaVideos: string[];
      precoPorPessoa?: number;
      duracaoHoras?: number;
      horarioSaida?: string;
      diasDisponiveis?: string[];
      badgeTipo?: "ia" | "popular";
      createdAt?: string;
      updatedAt?: string;
    }>;
    passeiosCards?: Array<{
      id: string;
      titulo: string;
      descricaoBreve?: string;
      galeriaImagens: string[];
      galeriaVideos: string[];
      precoPorPessoa?: number;
      duracaoHoras?: number;
      horarioSaida?: string;
      diasDisponiveis?: string[];
      badgeTipo?: "ia" | "popular";
      createdAt?: string;
      updatedAt?: string;
    }>;
    parquesAquaticosCards?: Array<{
      id: string;
      titulo: string;
      descricaoBreve?: string;
      galeriaImagens: string[];
      galeriaVideos: string[];
      precoPorPessoa?: number;
      duracaoHoras?: number;
      horarioSaida?: string;
      diasDisponiveis?: string[];
      badgeTipo?: "ia" | "popular";
      createdAt?: string;
      updatedAt?: string;
    }>;
    notas?: string;
    updatedByAdminAt?: string;
    publishedAt?: string;
  };
  sugestoesRoteiro?: Array<{
    id: string;
    userId: string;
    nomeAutor: string;
    categoria: "veiculo" | "hotel" | "atracao" | "passeio" | "parque" | "outro";
    valor: string;
    descricao?: string;
    status: "PENDENTE" | "APROVADA" | "REJEITADA";
    publishedForVoting?: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
  votacaoRoteiro?: {
    items: Array<{
      id: string;
      categoria: "veiculo" | "hotel" | "atracao" | "passeio" | "parque" | "outro";
      valor: string;
      votos: number;
    }>;
    updatedAt?: string;
  };
}

export type RoteiroCatalogCategory =
  | "atracoes"
  | "passeios"
  | "parquesAquaticos"
  | "refeicoes"
  | "transfers";

export interface RoteiroCatalogCard {
  id: string;
  titulo: string;
  descricaoBreve?: string;
  galeriaImagens: string[];
  galeriaVideos: string[];
  precoPorPessoa?: number;
  duracaoHoras?: number;
  horarioSaida?: string;
  diasDisponiveis?: string[];
  badgeTipo?: "ia" | "popular";
  createdAt?: string;
  updatedAt?: string;
}

export interface Excursao {
  id: string;
  nome: string;
  dataIda: string;
  dataVolta: string;
  destino: string;
  localSaida?: string;
  capacidade: number;
  veiculoTipo: string;
  status: ExcursaoStatus;
  wizard?: ExcursaoWizard;
  anttNumero?: string;
  anttValido?: boolean;
  cadasturNumero?: string;
  cadasturValido?: boolean;
  precoAdulto?: number;
  precoInfantil?: number;
  categoria?: string;
  imagem?: string;
  rating?: number;
  avaliacoes?: number;
  slug?: string;
  descricao?: string;
  inclui?: string[];
  destaque?: boolean;
  tag?: string;
  vagasOcupadas?: number;
}

const DEFAULT_EXCURSOES: Excursao[] = [
  { id: "1", nome: "Caldas Novas Família Total", dataIda: "2026-04-18", dataVolta: "2026-04-21", destino: "Caldas Novas", localSaida: "Goiânia", capacidade: 48, veiculoTipo: "Ônibus", status: "aberta", precoAdulto: 890, precoInfantil: 445, categoria: "família", rating: 4.9, avaliacoes: 312, destaque: true, tag: "Mais vendida", slug: "caldas-novas-familia-total", descricao: "4 dias de diversão em família com hotel 4 estrelas, café incluso e guia dedicado.", inclui: ["Transporte", "Hotel 4★", "Café da manhã", "Guia", "Seguro Viagem"], imagem: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", vagasOcupadas: 41 },
  { id: "2", nome: "Hot Park & Rio Quente Fest", dataIda: "2026-04-25", dataVolta: "2026-04-27", destino: "Rio Quente", localSaida: "Brasília", capacidade: 40, veiculoTipo: "Ônibus", status: "aberta", precoAdulto: 720, precoInfantil: 360, categoria: "aventura", rating: 4.8, avaliacoes: 184, destaque: true, tag: "Super oferta", slug: "hot-park-rio-quente-fest", descricao: "3 dias com ingresso Hot Park incluso, hotel 5 estrelas e jantar especial.", inclui: ["Transporte", "Hotel 5★", "Ingresso Hot Park", "Jantar", "Guia"], imagem: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", vagasOcupadas: 29 },
  { id: "3", nome: "Semana Santa Caldas Premium", dataIda: "2026-04-17", dataVolta: "2026-04-20", destino: "Caldas Novas", localSaida: "São Paulo", capacidade: 52, veiculoTipo: "Ônibus", status: "aberta", precoAdulto: 1850, precoInfantil: 925, categoria: "premium", rating: 5.0, avaliacoes: 97, destaque: true, tag: "Premium", slug: "semana-santa-caldas-premium", descricao: "Uma semana completa no melhor resort de Caldas Novas. All inclusive, spa e transporte premium.", inclui: ["Transporte Premium", "Resort 5★", "All Inclusive", "Spa", "Transfer"], imagem: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80", vagasOcupadas: 48 },
  { id: "4", nome: "Caldas All Inclusive Deluxe", dataIda: "2026-05-01", dataVolta: "2026-05-04", destino: "Caldas Novas", localSaida: "Belo Horizonte", capacidade: 36, veiculoTipo: "Ônibus", status: "aberta", precoAdulto: 1680, precoInfantil: 840, categoria: "premium", rating: 5.0, avaliacoes: 152, destaque: true, tag: "All Inclusive", slug: "caldas-all-inclusive-deluxe", descricao: "A experiência mais completa em Caldas Novas. Resort 5 estrelas, 3 parques e spa.", inclui: ["Transporte", "Resort 5★", "3 Parques", "All Inclusive", "Spa"], imagem: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80", vagasOcupadas: 18 },
  { id: "5", nome: "Rio Quente & Parque das Fontes", dataIda: "2026-05-08", dataVolta: "2026-05-10", destino: "Rio Quente", localSaida: "Goiânia", capacidade: 44, veiculoTipo: "Ônibus", status: "aberta", precoAdulto: 650, precoInfantil: 325, categoria: "aventura", rating: 4.7, avaliacoes: 89, slug: "rio-quente-parque-fontes", descricao: "Fim de semana em Rio Quente com Parque das Fontes e águas termais naturais.", inclui: ["Transporte", "Hotel 4★", "Ingresso Parque", "Café da manhã"], imagem: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&q=80", vagasOcupadas: 22 },
  { id: "6", nome: "Caldas Novas Casal Romântico", dataIda: "2026-05-15", dataVolta: "2026-05-17", destino: "Caldas Novas", localSaida: "Brasília", capacidade: 20, veiculoTipo: "Van", status: "aberta", precoAdulto: 980, precoInfantil: 490, categoria: "casal", rating: 4.9, avaliacoes: 67, tag: "Casal", slug: "caldas-novas-casal-romantico", descricao: "Escapada romântica com jantar especial, spa a dois e suite exclusiva.", inclui: ["Transporte", "Suite Luxo", "Jantar Romântico", "Spa", "Champanhe"], imagem: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80", vagasOcupadas: 12 },
  { id: "7", nome: "DiRoma Acqua Park Total", dataIda: "2026-05-22", dataVolta: "2026-05-25", destino: "Caldas Novas", localSaida: "Goiânia", capacidade: 60, veiculoTipo: "Ônibus", status: "aberta", precoAdulto: 750, precoInfantil: 375, categoria: "família", rating: 4.6, avaliacoes: 231, slug: "diroma-acqua-park-total", descricao: "3 dias no complexo DiRoma com ingresso para todos os parques aquáticos.", inclui: ["Transporte", "Hotel DiRoma", "Ingressos", "Café da manhã"], imagem: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80", vagasOcupadas: 38 },
  { id: "8", nome: "Caldas Novas Aventura Jovem", dataIda: "2026-06-05", dataVolta: "2026-06-07", destino: "Caldas Novas", localSaida: "Goiânia", capacidade: 35, veiculoTipo: "Ônibus", status: "aberta", precoAdulto: 490, precoInfantil: 245, categoria: "aventura", rating: 4.5, avaliacoes: 55, slug: "caldas-novas-aventura-jovem", descricao: "Fim de semana radical com esportes aquáticos, trilha e muita diversão.", inclui: ["Transporte", "Hostel", "Esportes", "Guia"], imagem: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80", vagasOcupadas: 10 },
  { id: "9", nome: "Rio Quente Resort Experience", dataIda: "2026-06-12", dataVolta: "2026-06-15", destino: "Rio Quente", localSaida: "São Paulo", capacidade: 45, veiculoTipo: "Ônibus", status: "aberta", precoAdulto: 1250, precoInfantil: 625, categoria: "resort", rating: 4.8, avaliacoes: 143, destaque: true, slug: "rio-quente-resort-experience", descricao: "4 dias no Rio Quente Resorts com acesso a todos os parques aquáticos e café incluso.", inclui: ["Aéreo", "Resort 5★", "Todos os Parques", "All Inclusive"], imagem: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=600&q=80", vagasOcupadas: 31 },
  { id: "10", nome: "Caldas Novas Feriado Julho", dataIda: "2026-07-09", dataVolta: "2026-07-12", destino: "Caldas Novas", localSaida: "Uberlândia", capacidade: 50, veiculoTipo: "Ônibus", status: "aberta", precoAdulto: 920, precoInfantil: 460, categoria: "família", rating: 4.7, avaliacoes: 88, tag: "Julho", slug: "caldas-novas-feriado-julho", descricao: "Aproveite o feriado de julho com a família em Caldas Novas.", inclui: ["Transporte", "Hotel 4★", "Café da manhã", "Ingressos"], imagem: "https://images.unsplash.com/photo-1561361058-c24e021a1f06?w=600&q=80", vagasOcupadas: 42 },
  { id: "11", nome: "Hot Park VIP Experience", dataIda: "2026-07-18", dataVolta: "2026-07-20", destino: "Rio Quente", localSaida: "Brasília", capacidade: 30, veiculoTipo: "Van", status: "aberta", precoAdulto: 1100, precoInfantil: 550, categoria: "premium", rating: 4.9, avaliacoes: 76, destaque: true, tag: "VIP", slug: "hot-park-vip-experience", descricao: "Acesso VIP ao Hot Park com fast pass, lounge exclusivo e monitor pessoal.", inclui: ["Transporte", "Hotel 5★", "Ingresso VIP", "Fast Pass", "Lounge"], imagem: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80", vagasOcupadas: 17 },
  { id: "12", nome: "Caldas Novas Pet Friendly", dataIda: "2026-08-07", dataVolta: "2026-08-09", destino: "Caldas Novas", localSaida: "Goiânia", capacidade: 25, veiculoTipo: "Van", status: "aberta", precoAdulto: 680, precoInfantil: 340, categoria: "família", rating: 4.6, avaliacoes: 34, slug: "caldas-novas-pet-friendly", descricao: "Viagem especial para famílias com pets. Hotel pet friendly e passeios ao ar livre.", inclui: ["Transporte", "Hotel Pet", "Passeios", "Guia"], imagem: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80", vagasOcupadas: 8 },
  { id: "13", nome: "Rio Quente Mágica de Natal", dataIda: "2026-12-23", dataVolta: "2026-12-26", destino: "Rio Quente", localSaida: "São Paulo", capacidade: 55, veiculoTipo: "Ônibus", status: "aberta", precoAdulto: 2100, precoInfantil: 1050, categoria: "premium", rating: 5.0, avaliacoes: 29, destaque: true, tag: "Natal", slug: "rio-quente-magica-natal", descricao: "Natal mágico em Rio Quente com decoração temática, shows e ceia especial.", inclui: ["Aéreo", "Resort 5★", "Ceia de Natal", "Shows", "All Inclusive"], imagem: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=600&q=80", vagasOcupadas: 51 },
  { id: "14", nome: "Caldas Novas Réveillon Premium", dataIda: "2026-12-29", dataVolta: "2027-01-02", destino: "Caldas Novas", localSaida: "Brasília", capacidade: 48, veiculoTipo: "Ônibus", status: "aberta", precoAdulto: 2500, precoInfantil: 1250, categoria: "premium", rating: 5.0, avaliacoes: 18, tag: "Réveillon", slug: "caldas-novas-reveillon-premium", descricao: "Réveillon inesquecível com show pirotécnico, buffet de luxo e open bar.", inclui: ["Transporte", "Resort 5★", "Réveillon", "Open Bar", "Show"], imagem: "https://images.unsplash.com/photo-1496950866446-3253e1470e8e?w=600&q=80", vagasOcupadas: 44 },
  { id: "15", nome: "Caldas Novas Melhor Idade", dataIda: "2026-09-10", dataVolta: "2026-09-13", destino: "Caldas Novas", localSaida: "Goiânia", capacidade: 28, veiculoTipo: "Micro", status: "aberta", precoAdulto: 780, precoInfantil: 390, categoria: "melhor-idade", rating: 4.8, avaliacoes: 112, tag: "Melhor Idade", slug: "caldas-novas-melhor-idade", descricao: "Pacote especial para a melhor idade com fisioterapia aquática e passeios tranquilos.", inclui: ["Transporte Adaptado", "Hotel 4★", "Fisioterapia", "Passeios", "Monitor"], imagem: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=600&q=80", vagasOcupadas: 20 },
  { id: "16", nome: "Rio Quente Casal Premium", dataIda: "2026-10-02", dataVolta: "2026-10-04", destino: "Rio Quente", localSaida: "Belo Horizonte", capacidade: 18, veiculoTipo: "Van", status: "aberta", precoAdulto: 1380, precoInfantil: 690, categoria: "casal", rating: 4.9, avaliacoes: 47, destaque: true, slug: "rio-quente-casal-premium", descricao: "Escapada premium para casais com tratamentos spa, jantar romântico e suíte com vista.", inclui: ["Transporte", "Suite Premium", "Spa", "Jantar", "Champanhe"], imagem: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80", vagasOcupadas: 10 },
  { id: "17", nome: "Caldas Novas Escolar Educativo", dataIda: "2026-10-15", dataVolta: "2026-10-17", destino: "Caldas Novas", localSaida: "Goiânia", capacidade: 120, veiculoTipo: "Ônibus", status: "aberta", precoAdulto: 380, precoInfantil: 190, categoria: "escolar", rating: 4.4, avaliacoes: 78, slug: "caldas-novas-escolar-educativo", descricao: "Excursão escolar com programa educativo sobre geotermia e meio ambiente.", inclui: ["Transporte", "Pousada", "Programa Educativo", "Monitor", "Refeições"], imagem: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80", vagasOcupadas: 67 },
  { id: "18", nome: "Caldas Novas Grupo Empresarial", dataIda: "2026-11-06", dataVolta: "2026-11-08", destino: "Caldas Novas", localSaida: "São Paulo", capacidade: 80, veiculoTipo: "Ônibus", status: "aberta", precoAdulto: 1150, precoInfantil: 575, categoria: "corporativo", rating: 4.7, avaliacoes: 24, slug: "caldas-novas-grupo-empresarial", descricao: "Team building em Caldas Novas com atividades grupais, sala de eventos e lazer.", inclui: ["Transporte", "Hotel 4★", "Sala de Eventos", "Team Building", "All Inclusive"], imagem: "https://images.unsplash.com/photo-1542744094-24638eff58bb?w=600&q=80", vagasOcupadas: 55 },
];

export async function listExcursoes(): Promise<Excursao[]> {
  return mutateDb((db) => {
    const stored = (db.excursaoStore ?? []) as Excursao[];
    const enrichedMap = new Map(DEFAULT_EXCURSOES.map(e => [e.id, e]));
    const merged = stored.map(s => {
      const enriched = enrichedMap.get(s.id);
      return enriched ? { ...enriched, ...s, precoAdulto: s.precoAdulto ?? enriched.precoAdulto, precoInfantil: s.precoInfantil ?? enriched.precoInfantil, categoria: s.categoria ?? enriched.categoria, imagem: s.imagem ?? enriched.imagem, rating: s.rating ?? enriched.rating, avaliacoes: s.avaliacoes ?? enriched.avaliacoes, slug: s.slug ?? enriched.slug, descricao: s.descricao ?? enriched.descricao, inclui: s.inclui ?? enriched.inclui, destaque: s.destaque ?? enriched.destaque, tag: s.tag ?? enriched.tag, vagasOcupadas: s.vagasOcupadas ?? enriched.vagasOcupadas } : s;
    });
    const storedIds = new Set(stored.map(s => s.id));
    const newDefaults = DEFAULT_EXCURSOES.filter(d => !storedIds.has(d.id));
    const all = [...merged, ...newDefaults];
    if (all.length !== stored.length || newDefaults.length > 0) {
      db.excursaoStore = all;
    }
    return all;
  });
}

export async function findExcursao(id: string): Promise<Excursao | undefined> {
  const items = await listExcursoes();
  return items.find((e) => e.id === id);
}

export async function createExcursao(payload: Omit<Excursao, "id">): Promise<Excursao> {
  return mutateDb((db) => {
    const nova: Excursao = { ...payload, id: Date.now().toString(36) };
    const items = ((db.excursaoStore as Excursao[]) ?? []);
    items.unshift(nova);
    db.excursaoStore = items;
    return nova;
  });
}

export async function updateExcursao(id: string, patch: Partial<Excursao>): Promise<Excursao | undefined> {
  return mutateDb((db) => {
    const items = ((db.excursaoStore as Excursao[]) ?? []);
    const idx = items.findIndex((e) => e.id === id);
    if (idx === -1) return undefined;
    items[idx] = { ...items[idx], ...patch, id };
    db.excursaoStore = items;
    return items[idx];
  });
}

export async function deleteExcursao(id: string): Promise<boolean> {
  return mutateDb((db) => {
    const items = ((db.excursaoStore as Excursao[]) ?? []);
    const idx = items.findIndex((e) => e.id === id);
    if (idx === -1) return false;
    items.splice(idx, 1);
    db.excursaoStore = items;
    return true;
  });
}
