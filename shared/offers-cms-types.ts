/** Tipos do CMS de regras e overlays — leilões / flash deals (S1 CRM) */

export type OfferRuleScope = "global" | "auction" | "flash_deal" | "hotel";
export type OfferRuleCategory = "regras" | "hotel" | "politicas" | "sem_reembolso";

export type OfferRule = {
  id: string;
  scope: OfferRuleScope;
  /** ID do leilão, flash deal ou chave do hotel (slug/nome) */
  targetId?: string;
  category: OfferRuleCategory;
  title: string;
  body: string;
  sortOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AuctionCardOverlay = {
  auctionId: number;
  title?: string;
  description?: string;
  location?: string;
  category?: string;
  image?: string;
  tags?: string[];
  rating?: number;
  hotelName?: string;
  /** Chave para vincular regras scope=hotel */
  hotelKey?: string;
  updatedAt: string;
};

export type FlashDealCardOverlay = {
  flashDealId: number;
  title?: string;
  location?: string;
  originalPrice?: number;
  price?: number;
  discount?: number;
  image?: string;
  category?: string;
  tags?: string[];
  description?: string;
  hotelKey?: string;
  updatedAt: string;
};

export type WizardRulesBundle = {
  regras: { title: string; text: string }[];
  hotel: { title: string; text: string }[];
  politicas: { title: string; text: string }[];
  semReembolso: { title: string; text: string }[];
  aceiteLabel: string;
};

export type CreateOfferRuleInput = {
  scope: OfferRuleScope;
  targetId?: string;
  category: OfferRuleCategory;
  title: string;
  body: string;
  sortOrder?: number;
  active?: boolean;
};

export type UpdateOfferRuleInput = Partial<CreateOfferRuleInput>;
