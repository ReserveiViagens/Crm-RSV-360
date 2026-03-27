export interface CatalogTicket {
  id: string
  name: string
  unitPrice: number
  originalPrice: number
}

export const TICKET_CATALOG: CatalogTicket[] = [
  { id: "hot-park", name: "Ingresso Hot Park — Adulto", unitPrice: 189, originalPrice: 220 },
  { id: "hot-park-crianca", name: "Ingresso Hot Park — Criança", unitPrice: 99, originalPrice: 130 },
  { id: "ingresso-vip", name: "Ingresso VIP — Acesso Prioritário", unitPrice: 320, originalPrice: 380 },
  { id: "ingresso-noturno", name: "Ingresso Noturno — Sunset Edition", unitPrice: 150, originalPrice: 190 },
  { id: "morador-hot-park", name: "Hot Park — Ingresso Morador", unitPrice: 132, originalPrice: 189 },
  { id: "diroma-acqua-park", name: "Ingresso diRoma Acqua Park", unitPrice: 90, originalPrice: 110 },
  { id: "morador-diroma", name: "diRoma Acqua Park — Ingresso Morador", unitPrice: 63, originalPrice: 90 },
  { id: "lagoa-termas", name: "Ingresso Lagoa Termas Parque", unitPrice: 75, originalPrice: 95 },
  { id: "morador-lagoa", name: "Lagoa Termas — Ingresso Morador", unitPrice: 53, originalPrice: 75 },
  { id: "passaporte-kawana", name: "Passaporte Kawana (3 dias)", unitPrice: 210, originalPrice: 265 },
  { id: "morador-kawana", name: "Kawana Park — Ingresso Morador", unitPrice: 72, originalPrice: 105 },
  { id: "water-park", name: "Combo Hot Park + diRoma Acqua", unitPrice: 245, originalPrice: 299 },
  { id: "kawana-park", name: "Combo Família (2 Adultos + 1 Criança)", unitPrice: 380, originalPrice: 450 },
  { id: "combo-3-parques", name: "Combo 3 Parques — Semana Completa", unitPrice: 320, originalPrice: 395 },
  { id: "transp-goiania", name: "Transporte Goiânia → Caldas Novas", unitPrice: 65, originalPrice: 90 },
  { id: "transp-brasilia", name: "Transporte Brasília → Caldas Novas", unitPrice: 85, originalPrice: 120 },
  { id: "cabana-standard", name: "Cabana Standard — até 4 pessoas", unitPrice: 280, originalPrice: 350 },
  { id: "cabana-premium", name: "Cabana Premium — até 6 pessoas", unitPrice: 450, originalPrice: 560 },
  { id: "cabana-exclusive", name: "Cabana Exclusive — até 10 pessoas", unitPrice: 680, originalPrice: 850 },
  { id: "ingresso-open-hotel", name: "Open Parques + Hotel (1 Noite)", unitPrice: 540, originalPrice: 680 },
  { id: "meia-idoso", name: "Meia-Entrada — Idoso (60+)", unitPrice: 95, originalPrice: 189 },
  { id: "meia-estudante", name: "Meia-Entrada — Estudante", unitPrice: 95, originalPrice: 189 },
  { id: "meia-pcd", name: "Ingresso Especial — PCD", unitPrice: 50, originalPrice: 189 },
  { id: "meia-professor", name: "Meia-Entrada — Professor", unitPrice: 50, originalPrice: 100 },
  { id: "parque-hotpark", name: "Hot Park", unitPrice: 189, originalPrice: 220 },
  { id: "parque-diroma", name: "Di Roma Acqua Park", unitPrice: 130, originalPrice: 155 },
  { id: "parque-lagoa", name: "Lagoa Quente Thermas", unitPrice: 75, originalPrice: 95 },
  { id: "prive-day-use", name: "Privê Thermas — Day Use Adulto", unitPrice: 110, originalPrice: 140 },
  { id: "prive-day-use-crianca", name: "Privê Thermas — Day Use Criança", unitPrice: 65, originalPrice: 85 },
  { id: "prive-parque-termal", name: "Privê Parque Termal — Ingresso", unitPrice: 120, originalPrice: 155 },
]

export function lookupTicketPrice(ticketId: string): CatalogTicket | null {
  return TICKET_CATALOG.find((t) => t.id === ticketId) ?? null
}
