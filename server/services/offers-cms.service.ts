import { randomUUID } from "crypto";
import { getDb, mutateDb } from "../persistence.js";
import type {
  AuctionCardOverlay,
  CreateOfferRuleInput,
  FlashDealCardOverlay,
  OfferRule,
  UpdateOfferRuleInput,
  WizardRulesBundle,
} from "@shared/offers-cms-types";
import {
  LEILAO_ACEITE_LABEL,
  LEILAO_POLITICAS,
  LEILAO_REGRAS,
  LEILAO_SEM_REEMBOLSO_DEFAULT,
} from "../constants/leiloes-termos-defaults.js";

const RULES_KEY = "offersRules";
const AUCTION_OVERLAYS_KEY = "auctionCardOverlays";
const FLASH_OVERLAYS_KEY = "flashDealCardOverlays";

function nowIso(): string {
  return new Date().toISOString();
}

function ruleToItem(rule: OfferRule): { title: string; text: string } {
  return { title: rule.title, text: rule.body };
}

function buildDefaultRules(): OfferRule[] {
  const ts = nowIso();
  const mk = (
    id: string,
    category: OfferRule["category"],
    title: string,
    body: string,
    sortOrder: number,
    scope: OfferRule["scope"] = "global",
    targetId?: string,
  ): OfferRule => ({
    id,
    scope,
    targetId,
    category,
    title,
    body,
    sortOrder,
    active: true,
    createdAt: ts,
    updatedAt: ts,
  });

  const rules: OfferRule[] = [
    ...LEILAO_REGRAS.map((r, i) =>
      mk(`default-regras-${i}`, "regras", r.title, r.text, i + 1),
    ),
    ...LEILAO_POLITICAS.map((r, i) =>
      mk(`default-politicas-${i}`, "politicas", r.title, r.text, i + 1),
    ),
    ...LEILAO_SEM_REEMBOLSO_DEFAULT.map((r, i) =>
      mk(`default-sem-reembolso-${i}`, "sem_reembolso", r.title, r.text, i + 1),
    ),
  ];

  return rules;
}

function readRulesRaw(): OfferRule[] {
  const db = getDb();
  const stored = db[RULES_KEY];
  if (Array.isArray(stored) && stored.length > 0) {
    return stored as OfferRule[];
  }
  const defaults = buildDefaultRules();
  void mutateDb((d) => {
    d[RULES_KEY] = defaults;
  });
  return defaults;
}

function readAuctionOverlays(): Record<string, AuctionCardOverlay> {
  const raw = getDb()[AUCTION_OVERLAYS_KEY];
  return raw && typeof raw === "object" ? (raw as Record<string, AuctionCardOverlay>) : {};
}

function readFlashOverlays(): Record<string, FlashDealCardOverlay> {
  const raw = getDb()[FLASH_OVERLAYS_KEY];
  return raw && typeof raw === "object" ? (raw as Record<string, FlashDealCardOverlay>) : {};
}

function matchesScope(
  rule: OfferRule,
  opts: { auctionId?: number; flashDealId?: number; hotelKey?: string },
): boolean {
  if (!rule.active) return false;

  if (rule.scope === "global") return true;

  if (rule.scope === "auction" && opts.auctionId != null) {
    return String(rule.targetId) === String(opts.auctionId);
  }

  if (rule.scope === "flash_deal" && opts.flashDealId != null) {
    return String(rule.targetId) === String(opts.flashDealId);
  }

  if (rule.scope === "hotel" && opts.hotelKey) {
    return rule.targetId?.toLowerCase() === opts.hotelKey.toLowerCase();
  }

  return false;
}

function collectCategory(
  rules: OfferRule[],
  category: OfferRule["category"],
  opts: { auctionId?: number; flashDealId?: number; hotelKey?: string },
): { title: string; text: string }[] {
  return rules
    .filter((r) => r.category === category && matchesScope(r, opts))
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(ruleToItem);
}

export function getWizardRulesForAuction(
  auctionId: number,
  hotelKey?: string,
): WizardRulesBundle {
  const rules = readRulesRaw();
  const opts = { auctionId, hotelKey };

  const semReembolso = collectCategory(rules, "sem_reembolso", opts);
  const politicas = [
    ...collectCategory(rules, "politicas", opts),
    ...semReembolso,
  ];

  const aceiteParts = [
    "Li e aceito as regras do leilão",
    hotelKey ? "as regras do hotel/fornecedor" : null,
    "as políticas de cancelamento",
    semReembolso.length ? "a política de não reembolso para ofertas especiais" : null,
    "e a Política de Privacidade da Reservei Viagens",
  ].filter(Boolean);

  return {
    regras: collectCategory(rules, "regras", opts),
    hotel: collectCategory(rules, "hotel", opts),
    politicas,
    semReembolso,
    aceiteLabel: aceiteParts.join(", ") + ".",
  };
}

export function getWizardRulesForFlashDeal(flashDealId: number, hotelKey?: string): WizardRulesBundle {
  const rules = readRulesRaw();
  const opts = { flashDealId, hotelKey };

  const semReembolso = collectCategory(rules, "sem_reembolso", opts);
  const politicas = [
    ...collectCategory(rules, "politicas", opts),
    ...semReembolso,
  ];

  return {
    regras: collectCategory(rules, "regras", { ...opts, auctionId: undefined }),
    hotel: collectCategory(rules, "hotel", opts),
    politicas,
    semReembolso,
    aceiteLabel:
      "Li e aceito as condições da oferta relâmpago, incluindo a política de não reembolso, e a Política de Privacidade da Reservei Viagens.",
  };
}

export function listOfferRules(): OfferRule[] {
  return readRulesRaw().sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
}

export async function createOfferRule(input: CreateOfferRuleInput): Promise<OfferRule> {
  const ts = nowIso();
  const rule: OfferRule = {
    id: randomUUID(),
    scope: input.scope,
    targetId: input.targetId?.trim() || undefined,
    category: input.category,
    title: input.title.trim(),
    body: input.body.trim(),
    sortOrder: input.sortOrder ?? 100,
    active: input.active ?? true,
    createdAt: ts,
    updatedAt: ts,
  };

  await mutateDb((db) => {
    const list = readRulesRaw();
    list.push(rule);
    db[RULES_KEY] = list;
    return rule;
  });

  return rule;
}

export async function updateOfferRule(id: string, input: UpdateOfferRuleInput): Promise<OfferRule | null> {
  let updated: OfferRule | null = null;

  await mutateDb((db) => {
    const list = readRulesRaw();
    const idx = list.findIndex((r) => r.id === id);
    if (idx < 0) return null;

    const current = list[idx];
    updated = {
      ...current,
      ...input,
      title: input.title?.trim() ?? current.title,
      body: input.body?.trim() ?? current.body,
      targetId:
        input.targetId !== undefined ? input.targetId?.trim() || undefined : current.targetId,
      updatedAt: nowIso(),
    };
    list[idx] = updated;
    db[RULES_KEY] = list;
    return updated;
  });

  return updated;
}

export async function deleteOfferRule(id: string): Promise<boolean> {
  let removed = false;
  await mutateDb((db) => {
    const list = readRulesRaw();
    const next = list.filter((r) => r.id !== id);
    removed = next.length < list.length;
    db[RULES_KEY] = next;
    return removed;
  });
  return removed;
}

export function getAuctionOverlay(auctionId: number): AuctionCardOverlay | undefined {
  return readAuctionOverlays()[String(auctionId)];
}

export async function upsertAuctionOverlay(
  auctionId: number,
  patch: Omit<AuctionCardOverlay, "auctionId" | "updatedAt">,
): Promise<AuctionCardOverlay> {
  const overlay: AuctionCardOverlay = {
    auctionId,
    ...patch,
    updatedAt: nowIso(),
  };

  await mutateDb((db) => {
    const map = readAuctionOverlays();
    map[String(auctionId)] = overlay;
    db[AUCTION_OVERLAYS_KEY] = map;
    return overlay;
  });

  return overlay;
}

export function getFlashDealOverlay(flashDealId: number): FlashDealCardOverlay | undefined {
  return readFlashOverlays()[String(flashDealId)];
}

export async function upsertFlashDealOverlay(
  flashDealId: number,
  patch: Omit<FlashDealCardOverlay, "flashDealId" | "updatedAt">,
): Promise<FlashDealCardOverlay> {
  const overlay: FlashDealCardOverlay = {
    flashDealId,
    ...patch,
    updatedAt: nowIso(),
  };

  await mutateDb((db) => {
    const map = readFlashOverlays();
    map[String(flashDealId)] = overlay;
    db[FLASH_OVERLAYS_KEY] = map;
    return overlay;
  });

  return overlay;
}

export function listFlashDealOverlays(): FlashDealCardOverlay[] {
  return Object.values(readFlashOverlays());
}

export { LEILAO_ACEITE_LABEL };
