/** Defaults server-side — espelham client/src/constants/leiloes-termos.ts */

export const LEILAO_REGRAS = [
  {
    title: "Lance vinculante",
    text: "Ao confirmar, você declara interesse firme na oferta pelo valor informado, enquanto o leilão estiver ativo.",
  },
  {
    title: "Maior lance ao encerrar",
    text: "Vence quem tiver o maior lance válido no horário de encerramento do leilão, conforme relógio da plataforma.",
  },
  {
    title: "Pagamento do vencedor",
    text: "Se você vencer, nossa equipe entrará em contato em até 24 horas úteis com link de pagamento e instruções de confirmação da reserva.",
  },
  {
    title: "Sem garantia de vitória",
    text: "Registrar um lance não garante a aquisição. Outros participantes podem ofertar valores superiores até o fim do leilão.",
  },
];

export const LEILAO_POLITICAS = [
  {
    title: "Cancelamento pelo comprador",
    text: "Após a confirmação da vitória e pagamento, cancelamentos seguem a política do fornecedor (hotel, parque ou pacote) e o Código de Defesa do Consumidor (Lei 8.078/90), quando aplicável.",
  },
  {
    title: "Dados pessoais",
    text: "Seus dados são tratados conforme a Política de Privacidade da Reservei Viagens, para viabilizar o leilão, contato e eventual contratação.",
  },
];

export const LEILAO_SEM_REEMBOLSO_DEFAULT = [
  {
    title: "Leilões — condição especial sem reembolso",
    text: "Ofertas adquiridas via leilão possuem preço promocional e condições especiais. Após confirmação da vitória e pagamento, não há direito a reembolso, exceto nas hipóteses legais obrigatórias.",
  },
  {
    title: "Flash Deals — condição especial sem reembolso",
    text: "Ofertas relâmpago (Flash Deals) são limitadas no tempo e estoque. Após a confirmação do pagamento, não há reembolso, salvo disposição legal imperativa.",
  },
];

export const LEILAO_ACEITE_LABEL =
  "Li e aceito as regras do leilão, as políticas de cancelamento, a política de não reembolso para ofertas especiais e a Política de Privacidade da Reservei Viagens.";
