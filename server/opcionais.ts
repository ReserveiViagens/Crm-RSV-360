export interface Opcional {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: "seguro" | "traslado" | "ingresso" | "hospedagem" | "alimentacao" | "outro";
}

const OPCIONAIS: Opcional[] = [
  {
    id: "seg-viagem",
    nome: "Seguro Viagem",
    descricao: "Cobertura completa durante toda a viagem",
    preco: 49.9,
    categoria: "seguro",
  },
  {
    id: "ingresso-hotpark",
    nome: "Ingresso Hot Park",
    descricao: "Entrada no parque aquático Hot Park",
    preco: 189.0,
    categoria: "ingresso",
  },
  {
    id: "ingresso-diroma",
    nome: "Ingresso DiRoma",
    descricao: "Acesso ao complexo DiRoma",
    preco: 149.0,
    categoria: "ingresso",
  },
  {
    id: "cafe-manha",
    nome: "Café da Manhã",
    descricao: "Café da manhã incluso no hotel",
    preco: 35.0,
    categoria: "alimentacao",
  },
  {
    id: "transfer-aeroporto",
    nome: "Transfer Aeroporto",
    descricao: "Traslado do aeroporto ao hotel",
    preco: 80.0,
    categoria: "traslado",
  },
];

export function getOpcionais(): Opcional[] {
  return OPCIONAIS;
}
