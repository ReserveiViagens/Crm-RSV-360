/** Textos fallback do wizard — produção usa GET /api/leiloes/rules */

export const LEILAO_WIZARD_STEPS = [
  { id: 1, label: "Valor" },
  { id: 2, label: "Regras" },
  { id: 3, label: "Hotel" },
  { id: 4, label: "Políticas" },
  { id: 5, label: "Confirmar" },
] as const;

export const LEILAO_WIZARD_TOTAL_STEPS = LEILAO_WIZARD_STEPS.length;

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
    text: "Após a confirmação da vitória e pagamento, cancelamentos seguem a política do fornecedor e o CDC, quando aplicável.",
  },
  {
    title: "Dados pessoais",
    text: "Seus dados são tratados conforme a Política de Privacidade da Reservei Viagens.",
  },
];

export const LEILAO_SEM_REEMBOLSO = [
  {
    title: "Leilões — sem reembolso",
    text: "Ofertas de leilão são condições especiais. Após confirmação e pagamento, não há reembolso, salvo hipóteses legais obrigatórias.",
  },
];

export const LEILAO_ACEITE_LABEL =
  "Li e aceito as regras do leilão, as regras do hotel/fornecedor, as políticas de cancelamento, a política de não reembolso e a Política de Privacidade da Reservei Viagens.";

export const FALLBACK_WIZARD_RULES = {
  regras: LEILAO_REGRAS,
  hotel: [] as { title: string; text: string }[],
  politicas: [...LEILAO_POLITICAS, ...LEILAO_SEM_REEMBOLSO],
  semReembolso: LEILAO_SEM_REEMBOLSO,
  aceiteLabel: LEILAO_ACEITE_LABEL,
};
