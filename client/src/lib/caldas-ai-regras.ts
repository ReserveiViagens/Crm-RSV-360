export interface TravelerProfile {
  tripType?: string;
  budget?: string;
  companions?: string;
  interests?: string[];
}

export interface ContextoGrupo {
  groupSize?: number;
  capacidade?: number;
  vagasRestantes?: number;
  cafeIncluso?: boolean;
  ingressosParqueIncluso?: boolean;
  roupaCamaIncluso?: boolean;
}

export interface UpsellResult {
  texto: string;
  titulo?: string;
  preco?: number;
  precoAntigo?: number;
  desconto?: number;
  cta?: string;
}

export function obterMensagemUpsell(produto: string, perfil?: TravelerProfile): string;
export function obterMensagemUpsell(contexto: ContextoGrupo): UpsellResult | null;
export function obterMensagemUpsell(
  produtoOrContexto: string | ContextoGrupo,
  perfil?: TravelerProfile
): UpsellResult | string | null {
  if (typeof produtoOrContexto === "string") {
    const mensagens: Record<string, string[]> = {
      seguro: [
        "Proteja sua viagem com nosso seguro! Tranquilidade para toda a família.",
        "Não arrisque! Seguro viagem por menos de R$2/dia.",
        "Viaje com tranquilidade: seguro completo incluído.",
      ],
      ingresso: [
        "Garanta já seu ingresso! Poucos disponíveis.",
        "Ingresso antecipado com desconto exclusivo!",
        "Aproveite enquanto há vagas — ingressos esgotando!",
      ],
      hotel: [
        "Hotel com café da manhã incluído — conforto total!",
        "Hospedagem premium com desconto especial para o grupo.",
        "Reserve agora e garanta o melhor quarto disponível!",
      ],
      default: [
        "Oferta especial disponível por tempo limitado!",
        "Aproveite enquanto há vagas!",
        "Não perca essa oportunidade exclusiva!",
      ],
    };
    const lista = mensagens[produtoOrContexto] ?? mensagens.default;
    return lista[Math.floor(Math.random() * lista.length)];
  }

  const ctx = produtoOrContexto;
  const upsells: UpsellResult[] = [];

  if (!ctx.cafeIncluso) {
    upsells.push({
      texto: "Adicione café da manhã ao seu pacote por apenas R$35/pessoa!",
      titulo: "Café da Manhã",
      preco: 35,
      cta: "Adicionar",
    });
  }

  if (!ctx.ingressosParqueIncluso) {
    upsells.push({
      texto: "🎢 Garanta seu ingresso para os parques com desconto de grupo!",
      titulo: "Ingressos Parque",
      preco: 99,
      precoAntigo: 129,
      desconto: 23,
      cta: "Quero meu ingresso",
    });
  }

  if (!ctx.roupaCamaIncluso) {
    upsells.push({
      texto: "Inclua roupa de cama premium no pacote por só R$20/pessoa.",
      titulo: "Roupa de Cama",
      preco: 20,
      cta: "Adicionar",
    });
  }

  if (upsells.length === 0) return null;
  return upsells[Math.floor(Math.random() * upsells.length)];
}

export function deveExibirFomoEscassez(
  vagasOrContexto: number | ContextoGrupo,
  capacidade?: number
): boolean {
  if (typeof vagasOrContexto === "number") {
    const cap = capacidade ?? vagasOrContexto;
    if (cap === 0) return false;
    const percentualOcupado = (cap - vagasOrContexto) / cap;
    return percentualOcupado >= 0.7;
  }
  const ctx = vagasOrContexto;
  if (!ctx.capacidade || ctx.capacidade === 0) return false;
  const vagasRestantes = ctx.vagasRestantes ?? (ctx.capacidade - (ctx.groupSize ?? 0));
  const percentualOcupado = (ctx.capacidade - vagasRestantes) / ctx.capacidade;
  return percentualOcupado >= 0.7;
}

export function obterFraseUrgencia(vagasRestantes?: number): string {
  const vagas = vagasRestantes ?? 5;
  if (vagas <= 2) return `⚠️ Apenas ${vagas} vaga${vagas > 1 ? "s" : ""} restante${vagas > 1 ? "s" : ""}!`;
  if (vagas <= 5) return `🔥 Quase esgotado! ${vagas} vagas restantes.`;
  if (vagas <= 10) return `⏰ Apenas ${vagas} vagas disponíveis.`;
  return `✅ ${vagas} vagas disponíveis.`;
}

export function calcularDesconto(
  membros: number,
  totalPago: number
): { percentual: number; valor: number; codigo?: string } {
  if (membros >= 20) return { percentual: 15, valor: totalPago * 0.15, codigo: "GRUPO20" };
  if (membros >= 10) return { percentual: 10, valor: totalPago * 0.10, codigo: "GRUPO10" };
  if (membros >= 5) return { percentual: 5, valor: totalPago * 0.05, codigo: "GRUPO5" };
  return { percentual: 0, valor: 0 };
}
