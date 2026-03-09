export interface TravelerProfile {
  tripType?: string;
  budget?: string;
  companions?: string;
  interests?: string[];
}

export function obterMensagemUpsell(produto: string, perfil?: TravelerProfile): string {
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

  const lista = mensagens[produto] ?? mensagens.default;
  return lista[Math.floor(Math.random() * lista.length)];
}

export function deveExibirFomoEscassez(vagas: number, capacidade: number): boolean {
  const percentualOcupado = vagas / capacidade;
  return percentualOcupado >= 0.7;
}

export function obterFraseUrgencia(vagasRestantes: number): string {
  if (vagasRestantes <= 2) return `⚠️ Apenas ${vagasRestantes} vaga${vagasRestantes > 1 ? "s" : ""} restante${vagasRestantes > 1 ? "s" : ""}!`;
  if (vagasRestantes <= 5) return `🔥 Quase esgotado! ${vagasRestantes} vagas restantes.`;
  if (vagasRestantes <= 10) return `⏰ Apenas ${vagasRestantes} vagas disponíveis.`;
  return `✅ ${vagasRestantes} vagas disponíveis.`;
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
