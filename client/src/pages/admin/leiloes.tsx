import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Gavel, Plus, Pencil, Trash2, Save, Loader2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { OfferRule, OfferRuleCategory, OfferRuleScope } from "@shared/offers-cms-types";
import {
  createAdminOfferRule,
  deleteAdminOfferRule,
  listAdminAuctionCards,
  listAdminOfferRules,
  saveAdminAuctionOverlay,
  updateAdminOfferRule,
  type AdminAuctionCard,
} from "@/lib/offers-cms-api";

type Tab = "regras" | "cards";

const SCOPE_LABELS: Record<OfferRuleScope, string> = {
  global: "Global",
  auction: "Leilão",
  flash_deal: "Flash Deal",
  hotel: "Hotel",
};

const CATEGORY_LABELS: Record<OfferRuleCategory, string> = {
  regras: "Regras leilão",
  hotel: "Regras hotel",
  politicas: "Políticas",
  sem_reembolso: "Sem reembolso",
};

const emptyRuleForm = {
  scope: "global" as OfferRuleScope,
  targetId: "",
  category: "regras" as OfferRuleCategory,
  title: "",
  body: "",
  sortOrder: 100,
  active: true,
};

export default function AdminLeiloesPage() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("regras");
  const [editingRule, setEditingRule] = useState<OfferRule | null>(null);
  const [ruleForm, setRuleForm] = useState(emptyRuleForm);
  const [selectedAuction, setSelectedAuction] = useState<AdminAuctionCard | null>(null);
  const [cardForm, setCardForm] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
    image: "",
    tags: "",
    rating: "",
    hotelName: "",
    hotelKey: "",
  });

  const rulesQuery = useQuery({
    queryKey: ["admin-offer-rules"],
    queryFn: listAdminOfferRules,
  });

  const auctionsQuery = useQuery({
    queryKey: ["admin-auction-cards"],
    queryFn: listAdminAuctionCards,
    enabled: tab === "cards",
  });

  const saveRuleMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...ruleForm,
        targetId: ruleForm.targetId.trim() || undefined,
      };
      if (editingRule) {
        return updateAdminOfferRule(editingRule.id, payload);
      }
      return createAdminOfferRule(payload);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin-offer-rules"] });
      setEditingRule(null);
      setRuleForm(emptyRuleForm);
      toast({ title: "Regra salva com sucesso" });
    },
    onError: (e: Error) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const deleteRuleMutation = useMutation({
    mutationFn: deleteAdminOfferRule,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin-offer-rules"] });
      toast({ title: "Regra excluída" });
    },
    onError: (e: Error) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const saveCardMutation = useMutation({
    mutationFn: async () => {
      if (!selectedAuction) throw new Error("Selecione um leilão");
      return saveAdminAuctionOverlay(selectedAuction.id, {
        title: cardForm.title || undefined,
        description: cardForm.description || undefined,
        location: cardForm.location || undefined,
        category: cardForm.category || undefined,
        image: cardForm.image || undefined,
        tags: cardForm.tags
          ? cardForm.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : undefined,
        rating: cardForm.rating ? Number(cardForm.rating) : undefined,
        hotelName: cardForm.hotelName || undefined,
        hotelKey: cardForm.hotelKey || undefined,
      });
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["admin-auction-cards"] });
      toast({ title: "Card do leilão atualizado" });
    },
    onError: (e: Error) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const startEditRule = (rule: OfferRule) => {
    setEditingRule(rule);
    setRuleForm({
      scope: rule.scope,
      targetId: rule.targetId ?? "",
      category: rule.category,
      title: rule.title,
      body: rule.body,
      sortOrder: rule.sortOrder,
      active: rule.active,
    });
  };

  const selectAuction = (card: AdminAuctionCard) => {
    setSelectedAuction(card);
    const o = card.overlay;
    setCardForm({
      title: o?.title ?? card.title,
      description: o?.description ?? card.description,
      location: o?.location ?? card.location,
      category: o?.category ?? card.category,
      image: o?.image ?? card.image,
      tags: (o?.tags ?? card.tags).join(", "),
      rating: String(o?.rating ?? card.rating),
      hotelName: o?.hotelName ?? "",
      hotelKey: o?.hotelKey ?? "",
    });
  };

  const rules = rulesQuery.data ?? [];
  const auctions = auctionsQuery.data ?? [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80 px-4 py-4">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <Link href="/admin/dashboard" className="text-slate-400 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Gavel className="h-6 w-6 text-emerald-400" />
            <h1 className="text-xl font-bold">Leilões &amp; Ofertas — CMS</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 flex gap-2">
          <button
            type="button"
            onClick={() => setTab("regras")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === "regras" ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-300"}`}
          >
            Regras &amp; políticas
          </button>
          <button
            type="button"
            onClick={() => setTab("cards")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === "cards" ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-300"}`}
          >
            Cards de leilão
          </button>
        </div>

        {tab === "regras" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">Regras cadastradas</h2>
                <span className="text-xs text-slate-500">{rules.length} itens</span>
              </div>
              {rulesQuery.isLoading ? (
                <p className="text-sm text-slate-500">Carregando…</p>
              ) : (
                <ul className="max-h-[520px] space-y-2 overflow-y-auto">
                  {rules.map((rule) => (
                    <li
                      key={rule.id}
                      className="flex items-start justify-between gap-2 rounded-lg border border-slate-800 bg-slate-950/60 p-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{rule.title}</p>
                        <p className="text-xs text-slate-500">
                          {SCOPE_LABELS[rule.scope]}
                          {rule.targetId ? ` · ${rule.targetId}` : ""} · {CATEGORY_LABELS[rule.category]}
                          {!rule.active && " · inativa"}
                        </p>
                        {rule.category === "sem_reembolso" && (
                          <span className="mt-1 inline-flex items-center gap-1 text-xs text-red-400">
                            <AlertTriangle className="h-3 w-3" /> Sem reembolso
                          </span>
                        )}
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button type="button" onClick={() => startEditRule(rule)} className="rounded p-1.5 hover:bg-slate-800">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Excluir esta regra?")) deleteRuleMutation.mutate(rule.id);
                          }}
                          className="rounded p-1.5 text-red-400 hover:bg-slate-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <h2 className="mb-4 font-semibold">{editingRule ? "Editar regra" : "Nova regra"}</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-xs text-slate-400">
                    Escopo
                    <select
                      className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-2 text-sm"
                      value={ruleForm.scope}
                      onChange={(e) => setRuleForm({ ...ruleForm, scope: e.target.value as OfferRuleScope })}
                    >
                      {Object.entries(SCOPE_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-xs text-slate-400">
                    Categoria
                    <select
                      className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-2 py-2 text-sm"
                      value={ruleForm.category}
                      onChange={(e) => setRuleForm({ ...ruleForm, category: e.target.value as OfferRuleCategory })}
                    >
                      {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </label>
                </div>
                {ruleForm.scope !== "global" && (
                  <label className="block text-xs text-slate-400">
                    ID alvo (leilão, flash ou chave hotel)
                    <input
                      className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                      value={ruleForm.targetId}
                      onChange={(e) => setRuleForm({ ...ruleForm, targetId: e.target.value })}
                      placeholder="ex: 2 ou di-roma"
                    />
                  </label>
                )}
                <label className="block text-xs text-slate-400">
                  Título
                  <input
                    className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                    value={ruleForm.title}
                    onChange={(e) => setRuleForm({ ...ruleForm, title: e.target.value })}
                  />
                </label>
                <label className="block text-xs text-slate-400">
                  Texto
                  <textarea
                    rows={5}
                    className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                    value={ruleForm.body}
                    onChange={(e) => setRuleForm({ ...ruleForm, body: e.target.value })}
                  />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-xs text-slate-400">
                    Ordem
                    <input
                      type="number"
                      className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                      value={ruleForm.sortOrder}
                      onChange={(e) => setRuleForm({ ...ruleForm, sortOrder: Number(e.target.value) })}
                    />
                  </label>
                  <label className="flex items-end gap-2 pb-2 text-sm">
                    <input
                      type="checkbox"
                      checked={ruleForm.active}
                      onChange={(e) => setRuleForm({ ...ruleForm, active: e.target.checked })}
                    />
                    Ativa
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={saveRuleMutation.isPending}
                    onClick={() => saveRuleMutation.mutate()}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2 text-sm font-semibold"
                  >
                    {saveRuleMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Salvar
                  </button>
                  {editingRule && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingRule(null);
                        setRuleForm(emptyRuleForm);
                      }}
                      className="rounded-lg border border-slate-700 px-4 py-2 text-sm"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Use categoria <strong>Sem reembolso</strong> para leilões e flash deals. Escopo <strong>Hotel</strong> + chave
                  vincula regras ao passo &quot;Hotel&quot; do wizard quando o card tiver <code>hotelKey</code>.
                </p>
              </div>
            </section>
          </div>
        )}

        {tab === "cards" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <h2 className="mb-4 font-semibold">Leilões ativos (RSV360)</h2>
              {auctionsQuery.isLoading ? (
                <p className="text-sm text-slate-500">Carregando…</p>
              ) : auctions.length === 0 ? (
                <p className="text-sm text-slate-500">Nenhum leilão ativo ou proxy desativado.</p>
              ) : (
                <ul className="space-y-2">
                  {auctions.map((a) => (
                    <li key={a.id}>
                      <button
                        type="button"
                        onClick={() => selectAuction(a)}
                        className={`w-full rounded-lg border p-3 text-left text-sm transition ${
                          selectedAuction?.id === a.id
                            ? "border-emerald-500 bg-emerald-950/30"
                            : "border-slate-800 hover:border-slate-600"
                        }`}
                      >
                        <span className="font-medium">#{a.id} — {a.title}</span>
                        <p className="text-xs text-slate-500">{a.location} · Lance {a.currentBid}</p>
                        {a.overlay && <p className="text-xs text-emerald-400">Overlay personalizado</p>}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <h2 className="mb-4 font-semibold">Editor do card</h2>
              {!selectedAuction ? (
                <p className="text-sm text-slate-500">Selecione um leilão à esquerda.</p>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">
                    Dados canônicos vêm do backend :3002. Campos abaixo sobrescrevem a exibição no site S1.
                  </p>
                  {(["title", "description", "location", "category", "image", "hotelName", "hotelKey"] as const).map((field) => (
                    <label key={field} className="block text-xs text-slate-400 capitalize">
                      {field}
                      <input
                        className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                        value={cardForm[field]}
                        onChange={(e) => setCardForm({ ...cardForm, [field]: e.target.value })}
                      />
                    </label>
                  ))}
                  <label className="block text-xs text-slate-400">
                    Tags (vírgula)
                    <input
                      className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                      value={cardForm.tags}
                      onChange={(e) => setCardForm({ ...cardForm, tags: e.target.value })}
                    />
                  </label>
                  <label className="block text-xs text-slate-400">
                    Rating
                    <input
                      className="mt-1 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
                      value={cardForm.rating}
                      onChange={(e) => setCardForm({ ...cardForm, rating: e.target.value })}
                    />
                  </label>
                  <button
                    type="button"
                    disabled={saveCardMutation.isPending}
                    onClick={() => saveCardMutation.mutate()}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2 text-sm font-semibold"
                  >
                    {saveCardMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Salvar card
                  </button>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
