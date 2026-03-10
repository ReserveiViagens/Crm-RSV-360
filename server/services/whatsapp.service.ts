const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL;
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY;
const INSTANCE_NAME = "CaldasMaster";
const IS_DEMO = !EVOLUTION_API_URL || !EVOLUTION_API_KEY;

const humanDelay = () =>
  new Promise((res) => setTimeout(res, Math.floor(Math.random() * 4000) + 3000));

async function evolutionRequest(path: string, body: unknown) {
  const res = await fetch(`${EVOLUTION_API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: EVOLUTION_API_KEY! },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Evolution API error: ${res.status}`);
  return res.json();
}

export async function createExcursionGroup(groupName: string, organizerPhone: string) {
  if (IS_DEMO) {
    return {
      success: true,
      demo: true,
      groupId: `demo-${Date.now()}`,
      message: `[DEMO] Grupo "${groupName}" criado. Configure EVOLUTION_API_URL e EVOLUTION_API_KEY para modo real.`,
    };
  }
  const createRes = await evolutionRequest(`/group/create/${INSTANCE_NAME}`, {
    subject: groupName,
    participants: [organizerPhone],
  });
  const groupId: string = createRes.id;

  await humanDelay();
  await evolutionRequest(`/group/updateParticipant/${INSTANCE_NAME}`, {
    groupId,
    action: "promote",
    participants: [organizerPhone],
  });

  await humanDelay();
  await evolutionRequest(`/message/sendText/${INSTANCE_NAME}`, {
    number: groupId,
    options: { delay: 1200 },
    textMessage: {
      text: `🚌 Bem-vindos à *${groupName}* pela Reservei Viagens!\n\nEu sou o *CaldasAI* e serei o assistente virtual deste grupo. Estou aqui para responder dúvidas, enviar avisos e tornar sua experiência incrível! 🌟`,
    },
  });

  return { success: true, demo: false, groupId, message: "Grupo criado com sucesso." };
}

export async function sendTextToGroup(groupId: string, text: string) {
  if (IS_DEMO) return { success: true, demo: true };
  await humanDelay();
  return evolutionRequest(`/message/sendText/${INSTANCE_NAME}`, {
    number: groupId,
    options: { delay: 1000 },
    textMessage: { text },
  });
}

export async function sendPollToGroup(groupId: string, question: string, options: string[]) {
  if (IS_DEMO) return { success: true, demo: true };
  await humanDelay();
  return evolutionRequest(`/message/sendPoll/${INSTANCE_NAME}`, {
    number: groupId,
    options: { delay: 1200 },
    pollMessage: { name: question, options, selectableCount: 1 },
  });
}

export async function sendPaymentConfirmation(groupId: string, passengerName: string, amount: number) {
  const msg = `🎉 *Pagamento confirmado!*\n\n✅ *${passengerName}* acaba de garantir sua vaga!\nValor: *R$ ${amount.toFixed(2).replace(".", ",")}*\n\nO CaldasAI já registrou tudo no sistema. Bem-vindo(a) ao grupo oficial! 🚌🌴`;
  return sendTextToGroup(groupId, msg);
}

export function getWaasStatus() {
  return {
    configured: !IS_DEMO,
    demo: IS_DEMO,
    instance: INSTANCE_NAME,
    apiUrl: EVOLUTION_API_URL || "(não configurado)",
  };
}
