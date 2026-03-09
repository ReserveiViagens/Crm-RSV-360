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
}

const DEFAULT_EXCURSOES: Excursao[] = [
  {
    id: "1",
    nome: "Caldas Novas - Hot Park",
    dataIda: "2025-08-10",
    dataVolta: "2025-08-13",
    destino: "Caldas Novas",
    localSaida: "Goiânia - Rodoviária",
    capacidade: 28,
    veiculoTipo: "Micro",
    status: "aberta",
  },
  {
    id: "2",
    nome: "DiRoma - Fim de Semana",
    dataIda: "2025-08-23",
    dataVolta: "2025-08-25",
    destino: "Caldas Novas",
    localSaida: "Brasília - Saída Norte",
    capacidade: 15,
    veiculoTipo: "Van",
    status: "rascunho",
  },
];

export async function listExcursoes(): Promise<Excursao[]> {
  return mutateDb((db) => {
    if (!Array.isArray(db.excursaoStore) || (db.excursaoStore as Excursao[]).length === 0) {
      db.excursaoStore = DEFAULT_EXCURSOES;
    }
    return db.excursaoStore as Excursao[];
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
