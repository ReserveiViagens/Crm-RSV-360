const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL;
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY;
const INSTANCE_NAME = process.env.EVOLUTION_INSTANCE_NAME || "CaldasMaster";
const IS_DEMO = !EVOLUTION_API_URL || !EVOLUTION_API_KEY;

let cachedConnectionState: "open" | "connecting" | "close" = "close";
let cachedPhoneNumber: string | null = null;

const humanDelay = () =>
  new Promise((res) => setTimeout(res, Math.floor(Math.random() * 4000) + 3000));

async function evolutionRequest(path: string, body: unknown, method: string = "POST") {
  const opts: RequestInit = {
    method,
    headers: { "Content-Type": "application/json", apikey: EVOLUTION_API_KEY! },
  };
  if (method !== "GET" && method !== "DELETE") {
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(`${EVOLUTION_API_URL}${path}`, opts);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Evolution API error ${res.status}: ${text}`);
  }
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  return res.text();
}

async function evolutionGet(path: string) {
  return evolutionRequest(path, null, "GET");
}

async function evolutionDelete(path: string) {
  return evolutionRequest(path, null, "DELETE");
}

export async function createInstance() {
  if (IS_DEMO) {
    return { success: false, demo: true, message: "Modo demo — configure EVOLUTION_API_URL e EVOLUTION_API_KEY." };
  }
  try {
    const result = await evolutionRequest(`/instance/create`, {
      instanceName: INSTANCE_NAME,
      integration: "WHATSAPP-BAILEYS",
      qrcode: true,
    });
    return { success: true, demo: false, instance: INSTANCE_NAME, data: result };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erro ao criar instância";
    return { success: false, demo: false, error: msg };
  }
}

export async function getInstanceStatus() {
  if (IS_DEMO) {
    return {
      configured: false,
      demo: true,
      instance: INSTANCE_NAME,
      state: "close" as const,
      phoneNumber: null,
    };
  }
  try {
    const result = await evolutionGet(`/instance/connectionState/${INSTANCE_NAME}`);
    const state = result?.instance?.state || result?.state || "close";
    if (state === "open") {
      cachedConnectionState = "open";
      cachedPhoneNumber = result?.instance?.ownerJid || result?.ownerJid || cachedPhoneNumber;
    } else {
      cachedConnectionState = state === "connecting" ? "connecting" : "close";
      cachedPhoneNumber = null;
    }
    return {
      configured: true,
      demo: false,
      instance: INSTANCE_NAME,
      state: cachedConnectionState,
      phoneNumber: cachedPhoneNumber,
    };
  } catch {
    return {
      configured: true,
      demo: false,
      instance: INSTANCE_NAME,
      state: cachedConnectionState,
      phoneNumber: cachedPhoneNumber,
    };
  }
}

export async function getQRCode() {
  if (IS_DEMO) {
    return { success: false, demo: true, message: "Modo demo — configure as env vars." };
  }
  try {
    const result = await evolutionGet(`/instance/connect/${INSTANCE_NAME}`);
    const base64 = result?.base64 || result?.qrcode?.base64 || result?.code || null;
    const pairingCode = result?.pairingCode || null;
    return { success: true, demo: false, base64, pairingCode, raw: result };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erro ao obter QR code";
    return { success: false, demo: false, error: msg };
  }
}

export async function deleteInstance() {
  if (IS_DEMO) {
    return { success: false, demo: true, message: "Modo demo." };
  }
  try {
    await evolutionRequest(`/instance/logout/${INSTANCE_NAME}`, null, "DELETE");
    cachedConnectionState = "close";
    cachedPhoneNumber = null;
    return { success: true, demo: false, message: "Instância desconectada." };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erro ao desconectar";
    return { success: false, demo: false, error: msg };
  }
}

export async function fetchAllGroups() {
  if (IS_DEMO) {
    return { success: true, demo: true, groups: [] };
  }
  if (cachedConnectionState !== "open") {
    return { success: true, demo: false, groups: [], message: "WhatsApp não conectado" };
  }
  try {
    const result = await evolutionGet(`/group/fetchAllGroups/${INSTANCE_NAME}?getParticipants=false`);
    const groups = Array.isArray(result) ? result : (result?.groups || result?.data || []);
    return { success: true, demo: false, groups };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erro ao buscar grupos";
    return { success: false, demo: false, groups: [], error: msg };
  }
}

export function handleWebhookEvent(event: string, data: Record<string, unknown>) {
  if (event === "connection.update") {
    const state = (data?.state as string) || "close";
    cachedConnectionState = state === "open" ? "open" : state === "connecting" ? "connecting" : "close";
    if (state === "open" && data?.ownerJid) {
      cachedPhoneNumber = data.ownerJid as string;
    }
    console.log(`[WaaS Webhook] connection.update → ${cachedConnectionState}${cachedPhoneNumber ? ` (${cachedPhoneNumber})` : ""}`);
  } else if (event === "messages.upsert") {
    const key = (data?.key as Record<string, unknown>) || {};
    const msg = (data?.message as Record<string, unknown>) || {};
    const from = key?.remoteJid || "unknown";
    const extMsg = (msg?.extendedTextMessage as Record<string, unknown>) ?? {};
    const text = (msg?.conversation || extMsg?.text || "(mídia)") as string;
    console.log(`[WaaS Webhook] messages.upsert from ${from}: ${text.slice(0, 100)}`);
  } else {
    console.log(`[WaaS Webhook] ${event}:`, JSON.stringify(data).slice(0, 200));
  }
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
    state: cachedConnectionState,
    phoneNumber: cachedPhoneNumber,
  };
}
