
import { useCallback, useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { RoteiroActivityCard, type RoteiroActivityCategoria } from "@/components/roteiro-activity-card";

type ExcursaoResponse = {
  id: string;
  nome: string;
  dataIda: string;
  dataVolta: string;
  destino: string;
  localSaida?: string;
  capacidade: number;
  veiculoTipo?: string;
};

type RoteiroCard = {
  id: string;
  titulo: string;
  descricaoBreve?: string;
  galeriaImagens: string[];
  galeriaVideos: string[];
  precoPorPessoa?: number;
  duracaoHoras?: number;
  horarioSaida?: string;
  diasDisponiveis?: string[];
  badgeTipo?: "ia" | "popular";
};

type RoteiroPayload = {
  veiculoTipo?: string;
  veiculoAutomatico?: boolean;
  manualVehicleOverride?: boolean;
  hotelPrincipal?: string;
  atracoes: string[];
  passeios: string[];
  parquesAquaticos: string[];
  hoteis: RoteiroCard[];
  atracoesCards: RoteiroCard[];
  passeiosCards: RoteiroCard[];
  parquesAquaticosCards: RoteiroCard[];
  notas?: string;
};

type CardSection = "hoteis" | "atracoesCards" | "passeiosCards" | "parquesAquaticosCards";
type MediaType = "image" | "video";
type SugestaoRoteiro = {
  id: string;
  nomeAutor: string;
  categoria: "veiculo" | "hotel" | "atracao" | "passeio" | "parque" | "outro";
  valor: string;
  descricao?: string;
  status: "PENDENTE" | "APROVADA" | "REJEITADA";
  publishedForVoting?: boolean;
};
type VotacaoRoteiroItem = {
  id: string;
  categoria: "veiculo" | "hotel" | "atracao" | "passeio" | "parque" | "outro";
  valor: string;
  votos: number;
};
type CatalogoRoteiro = {
  atracoes: RoteiroCard[];
  passeios: RoteiroCard[];
  parquesAquaticos: RoteiroCard[];
  refeicoes: RoteiroCard[];
  transfers: RoteiroCard[];
};

function getCurrentUser() {
  const existingId = localStorage.getItem("rsv_user_id");
  const existingName = localStorage.getItem("rsv_user_name");
  const userId = existingId || `u-${Math.random().toString(36).slice(2, 10)}`;
  const nome = existingName || "Organizador";
  localStorage.setItem("rsv_user_id", userId);
  localStorage.setItem("rsv_user_name", nome);
  return { userId, nome };
}

function vehicleByCapacity(capacidade: number): "Van" | "Micro" | "Ônibus" {
  if (capacidade <= 15) return "Van";
  if (capacidade <= 28) return "Micro";
  return "Ônibus";
}

function createCard(prefix: string): RoteiroCard {
  return {
    id: `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    titulo: "",
    descricaoBreve: "",
    galeriaImagens: [],
    galeriaVideos: [],
  };
}

async function filesToDataUrls(files: FileList | null): Promise<string[]> {
  if (!files || files.length === 0) return [];
  const all = Array.from(files).slice(0, 6);
  const reads = all.map(
    (file) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      }),
  );
  const urls = await Promise.all(reads);
  return urls.filter(Boolean);
}

export default function CriarExcursaoPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/criar-excursao/:id");
  const excursaoId = (params as { id?: string } | null)?.id;

  const [nome, setNome] = useState("Minha Excursão Caldas Novas");
  const [dataIda, setDataIda] = useState("2026-04-20");
  const [dataVolta, setDataVolta] = useState("2026-04-23");
  const [destino, setDestino] = useState("Caldas Novas");
  const [localSaida, setLocalSaida] = useState("Cuiabá");
  const [capacidade, setCapacidade] = useState(20);
  const [saving, setSaving] = useState(false);
  const [savingRoteiro, setSavingRoteiro] = useState(false);
  const [mainSyncStatus, setMainSyncStatus] = useState<"idle" | "syncing" | "synced" | "error">("idle");
  const [mainLastUpdatedAt, setMainLastUpdatedAt] = useState<string | null>(null);
  const [fullscreenPreviewOpen, setFullscreenPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewLastUpdatedAt, setPreviewLastUpdatedAt] = useState<string | null>(null);
  const [previewSyncStatus, setPreviewSyncStatus] = useState<"idle" | "syncing" | "synced" | "error">("idle");
  const [previewIsAdmin, setPreviewIsAdmin] = useState(false);
  const [previewSugestoes, setPreviewSugestoes] = useState<SugestaoRoteiro[]>([]);
  const [previewVotacao, setPreviewVotacao] = useState<VotacaoRoteiroItem[]>([]);
  const [catalogoRoteiro, setCatalogoRoteiro] = useState<CatalogoRoteiro>({
    atracoes: [],
    passeios: [],
    parquesAquaticos: [],
    refeicoes: [],
    transfers: [],
  });
  const [selectedCatalogIds, setSelectedCatalogIds] = useState<{
    atracoes: string[];
    passeios: string[];
    parquesAquaticos: string[];
    refeicoes: string[];
    transfers: string[];
  }>({
    atracoes: [],
    passeios: [],
    parquesAquaticos: [],
    refeicoes: [],
    transfers: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [mediaInput, setMediaInput] = useState<Record<string, { image: string; video: string }>>({});
  const [roteiro, setRoteiro] = useState<RoteiroPayload>({
    veiculoTipo: "Micro",
    veiculoAutomatico: true,
    manualVehicleOverride: false,
    hotelPrincipal: "",
    atracoes: [],
    passeios: [],
    parquesAquaticos: [],
    hoteis: [createCard("hotel")],
    atracoesCards: [createCard("atracao")],
    passeiosCards: [createCard("passeio")],
    parquesAquaticosCards: [createCard("parque")],
    notas: "",
  });

  const tripDays = (() => {
    const start = new Date(dataIda);
    const end = new Date(dataVolta);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
      return [] as { id: string; label: string }[];
    }
    const days: { id: string; label: string }[] = [];
    let cursor = new Date(start);
    let idx = 1;
    while (cursor <= end && idx <= 5) {
      const id = `D${idx}`;
      const label = `${id} • ${cursor.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      })}`;
      days.push({ id, label });
      cursor = new Date(cursor.getTime() + 24 * 60 * 60 * 1000);
      idx += 1;
    }
    return days;
  })();

  useEffect(() => {
    if (!excursaoId) return;
    fetch(`/api/excursoes/${excursaoId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: ExcursaoResponse | null) => {
        if (!data) return;
        setNome(data.nome);
        setDataIda(data.dataIda);
        setDataVolta(data.dataVolta);
        setDestino(data.destino);
        setLocalSaida(data.localSaida || "A definir");
        setCapacidade(data.capacidade);
      })
      .catch(() => null);
    fetch(`/api/excursoes/${excursaoId}/roteiro`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { roteiro?: Partial<RoteiroPayload> } | null) => {
        if (!data?.roteiro) return;
        const hoteis = Array.isArray(data.roteiro.hoteis) && data.roteiro.hoteis.length > 0 ? data.roteiro.hoteis : [];
        const atracoesCards = Array.isArray(data.roteiro.atracoesCards) && data.roteiro.atracoesCards.length > 0 ? data.roteiro.atracoesCards : [];
        const passeiosCards = Array.isArray(data.roteiro.passeiosCards) && data.roteiro.passeiosCards.length > 0 ? data.roteiro.passeiosCards : [];
        const parquesCards = Array.isArray(data.roteiro.parquesAquaticosCards) && data.roteiro.parquesAquaticosCards.length > 0 ? data.roteiro.parquesAquaticosCards : [];
        setRoteiro({
          veiculoTipo: data.roteiro.veiculoTipo || vehicleByCapacity(capacidade),
          veiculoAutomatico: data.roteiro.veiculoAutomatico !== false,
          manualVehicleOverride: data.roteiro.manualVehicleOverride === true,
          hotelPrincipal: data.roteiro.hotelPrincipal || "",
          atracoes: data.roteiro.atracoes || [],
          passeios: data.roteiro.passeios || [],
          parquesAquaticos: data.roteiro.parquesAquaticos || [],
          hoteis: hoteis.length > 0 ? hoteis : [createCard("hotel")],
          atracoesCards: atracoesCards.length > 0 ? atracoesCards : [createCard("atracao")],
          passeiosCards: passeiosCards.length > 0 ? passeiosCards : [createCard("passeio")],
          parquesAquaticosCards: parquesCards.length > 0 ? parquesCards : [createCard("parque")],
          notas: data.roteiro.notas || "",
        });
      })
      .catch(() => null);
    fetch(`/api/excursoes/${excursaoId}/catalogo-roteiro`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { items?: CatalogoRoteiro } | null) => {
        const items = data?.items;
        if (!items) return;
        setCatalogoRoteiro({
          atracoes: items.atracoes || [],
          passeios: items.passeios || [],
          parquesAquaticos: items.parquesAquaticos || [],
          refeicoes: items.refeicoes || [],
          transfers: items.transfers || [],
        });
      })
      .catch(() => null);
  }, [excursaoId, capacidade]);

  useEffect(() => {
    if (!roteiro.veiculoAutomatico || roteiro.manualVehicleOverride) return;
    const auto = vehicleByCapacity(capacidade);
    if (roteiro.veiculoTipo !== auto) {
      setRoteiro((prev) => ({ ...prev, veiculoTipo: auto }));
    }
  }, [capacidade, roteiro.manualVehicleOverride, roteiro.veiculoAutomatico, roteiro.veiculoTipo]);

  useEffect(() => {
    const mapByTitle = (cards: RoteiroCard[], selectedCards: RoteiroCard[], selectedLegacy: string[]) => {
      const selectedSet = new Set<string>([
        ...selectedCards.map((c) => c.titulo),
        ...selectedLegacy,
      ]);
      return cards.filter((c) => selectedSet.has(c.titulo)).map((c) => c.id);
    };
    setSelectedCatalogIds({
      atracoes: mapByTitle(catalogoRoteiro.atracoes, roteiro.atracoesCards, roteiro.atracoes),
      passeios: mapByTitle(catalogoRoteiro.passeios, roteiro.passeiosCards, roteiro.passeios),
      parquesAquaticos: mapByTitle(catalogoRoteiro.parquesAquaticos, roteiro.parquesAquaticosCards, roteiro.parquesAquaticos),
      refeicoes: [],
      transfers: [],
    });
  }, [
    catalogoRoteiro.atracoes,
    catalogoRoteiro.passeios,
    catalogoRoteiro.parquesAquaticos,
    roteiro.atracoesCards,
    roteiro.passeiosCards,
    roteiro.parquesAquaticosCards,
    roteiro.atracoes,
    roteiro.passeios,
    roteiro.parquesAquaticos,
  ]);

  const refreshFullscreenPreview = useCallback(async () => {
    if (!excursaoId) return;
    setPreviewLoading(true);
    setPreviewSyncStatus("syncing");
    const user = getCurrentUser();
    try {
      const roleRes = await fetch(`/api/excursoes/${excursaoId}/me-role`, {
        headers: {
          "x-user-id": user.userId,
          "x-user-name": user.nome,
        },
      });
      const roleData = roleRes.ok ? ((await roleRes.json()) as { isAdmin?: boolean }) : null;
      const isAdmin = Boolean(roleData?.isAdmin);
      setPreviewIsAdmin(isAdmin);

      if (isAdmin) {
        const sugestoesRes = await fetch(`/api/excursoes/${excursaoId}/sugestoes-roteiro`, {
          headers: {
            "x-user-id": user.userId,
            "x-user-name": user.nome,
          },
        });
        if (sugestoesRes.ok) {
          const data = (await sugestoesRes.json()) as { items?: SugestaoRoteiro[] };
          setPreviewSugestoes(data.items ?? []);
        } else {
          setPreviewSugestoes([]);
        }
      } else {
        setPreviewSugestoes([]);
      }

      const votacaoRes = await fetch(`/api/excursoes/${excursaoId}/votacao-roteiro`);
      const votacaoData = votacaoRes.ok ? ((await votacaoRes.json()) as { items?: VotacaoRoteiroItem[] }) : null;
      setPreviewVotacao(votacaoData?.items ?? []);
      setPreviewLastUpdatedAt(
        new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
      setPreviewSyncStatus("synced");
    } catch {
      setPreviewSugestoes([]);
      setPreviewVotacao([]);
      setPreviewIsAdmin(false);
      setPreviewSyncStatus("error");
    } finally {
      setPreviewLoading(false);
    }
  }, [excursaoId]);

  useEffect(() => {
    if (!fullscreenPreviewOpen || !excursaoId) return;
    void refreshFullscreenPreview();
    const intervalId = window.setInterval(() => {
      void refreshFullscreenPreview();
    }, 10000);
    return () => {
      window.clearInterval(intervalId);
    };
  }, [fullscreenPreviewOpen, excursaoId, refreshFullscreenPreview]);

  function setCardSection(section: CardSection, cards: RoteiroCard[]) {
    setRoteiro((prev) => ({ ...prev, [section]: cards }));
  }

  function updateCard(section: CardSection, cardId: string, patch: Partial<RoteiroCard>) {
    setCardSection(
      section,
      roteiro[section].map((card) => (card.id === cardId ? { ...card, ...patch } : card)),
    );
  }

  function addCard(section: CardSection) {
    const prefix = section === "hoteis" ? "hotel" : section === "atracoesCards" ? "atracao" : section === "passeiosCards" ? "passeio" : "parque";
    setCardSection(section, [...roteiro[section], createCard(prefix)]);
  }

  function removeCard(section: CardSection, cardId: string) {
    const next = roteiro[section].filter((card) => card.id !== cardId);
    if (next.length === 0) return;
    setCardSection(section, next);
  }

  async function addUploadedMedia(section: CardSection, cardId: string, type: MediaType, files: FileList | null) {
    const urls = await filesToDataUrls(files);
    if (urls.length === 0) return;
    const card = roteiro[section].find((c) => c.id === cardId);
    if (!card) return;
    if (type === "image") {
      updateCard(section, cardId, { galeriaImagens: [...card.galeriaImagens, ...urls].slice(0, 12) });
      return;
    }
    updateCard(section, cardId, { galeriaVideos: [...card.galeriaVideos, ...urls].slice(0, 12) });
  }

  function addMediaByUrl(section: CardSection, cardId: string, type: MediaType) {
    const key = `${section}:${cardId}`;
    const value = (mediaInput[key]?.[type] || "").trim();
    if (!value) return;
    const card = roteiro[section].find((c) => c.id === cardId);
    if (!card) return;
    if (type === "image") {
      updateCard(section, cardId, { galeriaImagens: [...card.galeriaImagens, value].slice(0, 12) });
    } else {
      updateCard(section, cardId, { galeriaVideos: [...card.galeriaVideos, value].slice(0, 12) });
    }
    setMediaInput((prev) => ({ ...prev, [key]: { ...prev[key], [type]: "" } }));
  }

  function removeMedia(section: CardSection, cardId: string, type: MediaType, idx: number) {
    const card = roteiro[section].find((c) => c.id === cardId);
    if (!card) return;
    if (type === "image") {
      const next = [...card.galeriaImagens];
      next.splice(idx, 1);
      updateCard(section, cardId, { galeriaImagens: next });
      return;
    }
    const next = [...card.galeriaVideos];
    next.splice(idx, 1);
    updateCard(section, cardId, { galeriaVideos: next });
  }

  async function handleCreate() {
    setError(null);
    setSaving(true);
    try {
      const user = getCurrentUser();
      const resCreate = await fetch("/api/excursoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          dataIda,
          dataVolta,
          destino,
          localSaida,
          capacidade,
          veiculoTipo: vehicleByCapacity(capacidade),
          status: "rascunho",
        }),
      });
      if (!resCreate.ok) throw new Error("Falha ao criar nova excursão");
      const created = (await resCreate.json()) as ExcursaoResponse;
      await fetch(`/api/excursoes/${created.id}/creator-setup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.userId, nome: user.nome }),
      });
      setLocation(`/criar-excursao/${created.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao criar excursão.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveRoteiro(publishAndOpenGroup: boolean) {
    if (!excursaoId) return;
    setSavingRoteiro(true);
    setMainSyncStatus("syncing");
    setError(null);
    try {
      const user = getCurrentUser();
      await fetch(`/api/excursoes/${excursaoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ capacidade, veiculoTipo: roteiro.veiculoTipo || vehicleByCapacity(capacidade) }),
      });
      const payload: RoteiroPayload & { publish: boolean } = {
        ...roteiro,
        hotelPrincipal: roteiro.hoteis[0]?.titulo || roteiro.hotelPrincipal || "",
        atracoesCards: selectedAtracoesCards,
        passeiosCards: selectedPasseiosCards,
        parquesAquaticosCards: selectedParquesCards,
        atracoes: selectedAtracoesCards.map((c) => c.titulo).filter(Boolean),
        passeios: selectedPasseiosCards.map((c) => c.titulo).filter(Boolean),
        parquesAquaticos: selectedParquesCards.map((c) => c.titulo).filter(Boolean),
        publish: publishAndOpenGroup,
      };
      const res = await fetch(`/api/excursoes/${excursaoId}/roteiro`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.userId,
          "x-user-name": user.nome,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Falha ao salvar roteiro");
      setMainLastUpdatedAt(
        new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
      setMainSyncStatus("synced");
      if (publishAndOpenGroup) setLocation(`/viagens-grupo/${excursaoId}`);
    } catch (e) {
      setMainSyncStatus("error");
      setError(e instanceof Error ? e.message : "Erro ao salvar roteiro.");
    } finally {
      setSavingRoteiro(false);
    }
  }

  const isWizardMode = Boolean(excursaoId);
  const suggestedVehicle = vehicleByCapacity(capacidade);
  const selectedAtracoesCards = catalogoRoteiro.atracoes.filter((c) => selectedCatalogIds.atracoes.includes(c.id));
  const selectedPasseiosCards = catalogoRoteiro.passeios.filter((c) => selectedCatalogIds.passeios.includes(c.id));
  const selectedParquesCards = catalogoRoteiro.parquesAquaticos.filter((c) => selectedCatalogIds.parquesAquaticos.includes(c.id));
  const previewSections = [
    { label: "Hotel", cards: roteiro.hoteis, fallback: "Sem hotel definido" },
    { label: "Atrações", cards: selectedAtracoesCards, fallback: "Sem atrações selecionadas" },
    { label: "Passeios", cards: selectedPasseiosCards, fallback: "Sem passeios selecionados" },
    { label: "Parques aquáticos", cards: selectedParquesCards, fallback: "Sem parques selecionados" },
  ] as const;

  const sectionConfig: Array<{
    key: CardSection;
    title: string;
    testId: string;
    addTestId: string;
    titleInputTestId: string;
    descriptionInputTestId: string;
    imageUrlTestId: string;
    videoUrlTestId: string;
  }> = [
    {
      key: "hoteis",
      title: "Hotel principal",
      testId: "criar-excursao-wizard-hotel",
      addTestId: "criar-excursao-wizard-card-hoteis-add",
      titleInputTestId: "criar-excursao-wizard-card-title-hoteis",
      descriptionInputTestId: "criar-excursao-wizard-card-description-hoteis",
      imageUrlTestId: "criar-excursao-wizard-card-image-url-hoteis",
      videoUrlTestId: "criar-excursao-wizard-card-video-url-hoteis",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", padding: 20, display: "grid", placeItems: "center" }} data-testid="criar-excursao-page">
      <div style={{ width: "min(980px, 100%)", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: 20 }} data-testid="criar-excursao-card">
        <h1 style={{ margin: 0, color: "#1e3a8a", fontSize: 24 }}>
          {isWizardMode ? "Monte o roteiro completo da sua excursão" : "Criar sua própria excursão"}
        </h1>
        <p style={{ color: "#475569", marginTop: 8 }}>
          {isWizardMode
            ? "Use cards com galeria de imagens/vídeos para hotel, atrações, passeios e parques."
            : "Configure uma nova excursão e crie seu grupo com governança de roteiro."}
        </p>

        {!isWizardMode && (
          <div style={{ display: "grid", gap: 10, marginTop: 12 }} data-testid="criar-excursao-form">
            <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome da excursão" style={{ padding: 10, borderRadius: 10, border: "1px solid #CBD5E1" }} data-testid="criar-excursao-nome" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <input type="date" value={dataIda} onChange={(e) => setDataIda(e.target.value)} style={{ padding: 10, borderRadius: 10, border: "1px solid #CBD5E1" }} data-testid="criar-excursao-data-ida" />
              <input type="date" value={dataVolta} onChange={(e) => setDataVolta(e.target.value)} style={{ padding: 10, borderRadius: 10, border: "1px solid #CBD5E1" }} data-testid="criar-excursao-data-volta" />
            </div>
            {tripDays.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, fontSize: 11, color: "#1e293b" }} data-testid="criar-excursao-dias-mapeados">
                {tripDays.map((d) => (
                  <span
                    key={d.id}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 999,
                      border: "1px solid #e5e7eb",
                      background: "#eff6ff",
                      fontWeight: 600,
                    }}
                  >
                    {d.label}
                  </span>
                ))}
              </div>
            )}
            <input value={destino} onChange={(e) => setDestino(e.target.value)} placeholder="Destino" style={{ padding: 10, borderRadius: 10, border: "1px solid #CBD5E1" }} data-testid="criar-excursao-destino" />
            <input value={localSaida} onChange={(e) => setLocalSaida(e.target.value)} placeholder="Local de saída" style={{ padding: 10, borderRadius: 10, border: "1px solid #CBD5E1" }} data-testid="criar-excursao-local-saida" />
            <input type="number" value={capacidade} onChange={(e) => setCapacidade(Math.max(4, Number(e.target.value || 4)))} placeholder="Capacidade" style={{ padding: 10, borderRadius: 10, border: "1px solid #CBD5E1" }} data-testid="criar-excursao-capacidade" />
            <button type="button" onClick={handleCreate} disabled={saving} style={{ padding: "12px 14px", borderRadius: 10, border: "none", background: "#f97316", color: "#fff", fontWeight: 700, cursor: "pointer" }} data-testid="criar-excursao-submit">
              {saving ? "Criando..." : "Criar excursão e abrir wizard"}
            </button>
          </div>
        )}

        {isWizardMode && (
          <div style={{ display: "grid", gap: 10, marginTop: 12 }} data-testid="criar-excursao-wizard">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
              <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 10 }}>
                <label style={{ display: "grid", gap: 6 }}>
                  <span style={{ fontSize: 12, color: "#64748B", fontWeight: 700 }}>Capacidade do grupo</span>
                  <input
                    type="number"
                    value={capacidade}
                    onChange={(e) => setCapacidade(Math.max(4, Number(e.target.value || 4)))}
                    style={{ padding: 10, borderRadius: 10, border: "1px solid #CBD5E1" }}
                    data-testid="criar-excursao-wizard-capacidade"
                  />
                </label>
              </div>
              <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 10 }}>
                <div style={{ fontSize: 12, color: "#64748B", fontWeight: 700 }}>Veículo</div>
                <div style={{ marginTop: 6, display: "grid", gap: 6 }}>
                  <div style={{ fontSize: 12, color: "#475569" }}>Sugestão automática: <strong>{suggestedVehicle}</strong></div>
                  <select
                    value={roteiro.veiculoTipo || suggestedVehicle}
                    onChange={(e) => setRoteiro((p) => ({ ...p, veiculoTipo: e.target.value, manualVehicleOverride: true, veiculoAutomatico: true }))}
                    style={{ padding: 10, borderRadius: 10, border: "1px solid #CBD5E1" }}
                    data-testid="criar-excursao-wizard-veiculo"
                  >
                    <option>Van</option>
                    <option>Micro</option>
                    <option>Ônibus</option>
                  </select>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#334155" }}>
                    <input
                      type="checkbox"
                      checked={roteiro.manualVehicleOverride === true}
                      onChange={(e) =>
                        setRoteiro((p) => ({
                          ...p,
                          manualVehicleOverride: e.target.checked,
                          veiculoTipo: e.target.checked ? p.veiculoTipo : vehicleByCapacity(capacidade),
                        }))
                      }
                      data-testid="criar-excursao-wizard-veiculo-override"
                    />
                    Manter escolha manual (override)
                  </label>
                </div>
              </div>
            </div>

            {sectionConfig.map((section) => (
              <div key={section.key} style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 12 }} data-testid={section.testId}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1E3A8A" }}>{section.title}</div>
                  <button
                    type="button"
                    onClick={() => addCard(section.key)}
                    style={{ border: "none", background: "#1e3a8a", color: "#fff", borderRadius: 8, padding: "6px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                    data-testid={section.addTestId}
                  >
                    + Adicionar card
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 10 }}>
                  {roteiro[section.key].map((card) => {
                    const key = `${section.key}:${card.id}`;
                    return (
                      <div key={card.id} style={{ border: "1px solid #E5E7EB", borderRadius: 12, padding: 10, background: "#FFF" }} data-testid={`criar-excursao-wizard-card-${section.key}`}>
                        <div style={{ display: "grid", gap: 8 }}>
                          <input
                            value={card.titulo}
                            onChange={(e) => updateCard(section.key, card.id, { titulo: e.target.value })}
                            placeholder="Título do item"
                            style={{ padding: 9, borderRadius: 8, border: "1px solid #CBD5E1" }}
                            data-testid={section.titleInputTestId}
                          />
                          <textarea
                            value={card.descricaoBreve || ""}
                            onChange={(e) => updateCard(section.key, card.id, { descricaoBreve: e.target.value })}
                            placeholder="Descrição breve"
                            style={{ minHeight: 70, padding: 9, borderRadius: 8, border: "1px solid #CBD5E1", resize: "vertical" }}
                            data-testid={section.descriptionInputTestId}
                          />
                          <div style={{ display: "grid", gap: 6 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>Galeria de imagens</div>
                            <div style={{ display: "flex", gap: 6 }}>
                              <input
                                value={mediaInput[key]?.image || ""}
                                onChange={(e) => setMediaInput((prev) => ({ ...prev, [key]: { image: e.target.value, video: prev[key]?.video || "" } }))}
                                placeholder="URL da imagem"
                                style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid #CBD5E1" }}
                                data-testid={section.imageUrlTestId}
                              />
                              <button type="button" onClick={() => addMediaByUrl(section.key, card.id, "image")} style={{ border: "none", background: "#f97316", color: "#fff", borderRadius: 8, padding: "0 10px", fontWeight: 700, cursor: "pointer" }}>
                                Add URL
                              </button>
                            </div>
                            <input type="file" multiple accept="image/*" onChange={(e) => void addUploadedMedia(section.key, card.id, "image", e.target.files)} data-testid={`criar-excursao-wizard-card-image-upload-${section.key}`} />
                            {card.galeriaImagens.length > 0 && (
                              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                {card.galeriaImagens.map((img, idx) => (
                                  <div key={`${img}-${idx}`} style={{ position: "relative" }}>
                                    <img src={img} alt="" style={{ width: 62, height: 48, objectFit: "cover", borderRadius: 6, border: "1px solid #E2E8F0" }} />
                                    <button type="button" onClick={() => removeMedia(section.key, card.id, "image", idx)} style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: 999, border: "none", background: "#DC2626", color: "#fff", cursor: "pointer", fontSize: 10 }}>
                                      x
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div style={{ display: "grid", gap: 6 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>Galeria de vídeos</div>
                            <div style={{ display: "flex", gap: 6 }}>
                              <input
                                value={mediaInput[key]?.video || ""}
                                onChange={(e) => setMediaInput((prev) => ({ ...prev, [key]: { image: prev[key]?.image || "", video: e.target.value } }))}
                                placeholder="URL do vídeo"
                                style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid #CBD5E1" }}
                                data-testid={section.videoUrlTestId}
                              />
                              <button type="button" onClick={() => addMediaByUrl(section.key, card.id, "video")} style={{ border: "none", background: "#f97316", color: "#fff", borderRadius: 8, padding: "0 10px", fontWeight: 700, cursor: "pointer" }}>
                                Add URL
                              </button>
                            </div>
                            <input type="file" multiple accept="video/*" onChange={(e) => void addUploadedMedia(section.key, card.id, "video", e.target.files)} data-testid={`criar-excursao-wizard-card-video-upload-${section.key}`} />
                            {card.galeriaVideos.length > 0 && (
                              <div style={{ display: "grid", gap: 6 }}>
                                {card.galeriaVideos.map((video, idx) => (
                                  <div key={`${video}-${idx}`} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                    <video src={video} controls style={{ width: 130, height: 70, borderRadius: 6, border: "1px solid #E2E8F0" }} />
                                    <button type="button" onClick={() => removeMedia(section.key, card.id, "video", idx)} style={{ border: "none", background: "#DC2626", color: "#fff", borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer" }}>
                                      Remover
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <button type="button" onClick={() => removeCard(section.key, card.id)} style={{ justifySelf: "start", border: "none", background: "#DC2626", color: "#fff", borderRadius: 8, padding: "6px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer" }} data-testid={`criar-excursao-wizard-card-remove-${section.key}`}>
                            Remover card
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {tripDays.length > 0 && (
              <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#1E3A8A", marginBottom: 6 }}>Mapa de dias da viagem</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }} data-testid="criar-excursao-wizard-trip-days">
                  {tripDays.map((d) => (
                    <span
                      key={d.id}
                      style={{
                        padding: "4px 8px",
                        borderRadius: 999,
                        border: "1px solid #DBEAFE",
                        background: "#EFF6FF",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#1E40AF",
                      }}
                    >
                      {d.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {([
              { key: "atracoes" as const, title: "Atrações", source: catalogoRoteiro.atracoes, selected: selectedCatalogIds.atracoes, testId: "criar-excursao-wizard-atracoes", categoria: "atracao" as RoteiroActivityCategoria },
              { key: "passeios" as const, title: "Passeios", source: catalogoRoteiro.passeios, selected: selectedCatalogIds.passeios, testId: "criar-excursao-wizard-passeios", categoria: "passeio" as RoteiroActivityCategoria },
              { key: "parquesAquaticos" as const, title: "Parques aquáticos", source: catalogoRoteiro.parquesAquaticos, selected: selectedCatalogIds.parquesAquaticos, testId: "criar-excursao-wizard-parques", categoria: "parque" as RoteiroActivityCategoria },
            ]).map((section) => (
              <div key={section.key} style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 12 }} data-testid={section.testId}>
                {(() => {
                  const listTestId =
                    section.key === "atracoes"
                      ? "criar-excursao-wizard-atracoes-catalogo-list"
                      : section.key === "passeios"
                        ? "criar-excursao-wizard-passeios-catalogo-list"
                        : "criar-excursao-wizard-parquesAquaticos-catalogo-list";
                  const cardTestId =
                    section.key === "atracoes"
                      ? "criar-excursao-wizard-atracoes-catalogo-card"
                      : section.key === "passeios"
                        ? "criar-excursao-wizard-passeios-catalogo-card"
                        : "criar-excursao-wizard-parquesAquaticos-catalogo-card";
                  return (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center", marginBottom: 8 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#1E3A8A" }}>{section.title} (catálogo admin)</div>
                        <div style={{ fontSize: 11, color: "#64748B" }}>
                          {section.selected.length} selecionado(s)
                        </div>
                      </div>
                      {section.source.length === 0 ? (
                        <div style={{ fontSize: 12, color: "#64748B" }} data-testid={`criar-excursao-wizard-${section.key}-empty`}>
                          Nenhum card disponível. Cadastre no admin da excursão.
                        </div>
                      ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }} data-testid={listTestId}>
                          {section.source.map((card) => {
                            const isSelected = section.selected.includes(card.id);
                            return (
                              <div
                                key={card.id}
                                onClick={() =>
                                  setSelectedCatalogIds((prev) => {
                                    const curr = prev[section.key];
                                    const next = curr.includes(card.id) ? curr.filter((id) => id !== card.id) : [...curr, card.id];
                                    return { ...prev, [section.key]: next };
                                  })
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <RoteiroActivityCard
                                  id={card.id}
                                  titulo={card.titulo}
                                  descricaoBreve={card.descricaoBreve}
                                  galeriaImagens={card.galeriaImagens}
                                  galeriaVideos={card.galeriaVideos}
                                  categoria={section.categoria}
                                  precoPorPessoa={card.precoPorPessoa}
                                  duracaoHoras={card.duracaoHoras}
                                  horarioSaida={card.horarioSaida}
                                  diasDisponiveis={card.diasDisponiveis}
                                  badgeTipo={card.badgeTipo}
                                  selected={isSelected}
                                  onClickSelecionar={() =>
                                    setSelectedCatalogIds((prev) => {
                                      const curr = prev[section.key];
                                      const next = curr.includes(card.id) ? curr.filter((id) => id !== card.id) : [...curr, card.id];
                                      return { ...prev, [section.key]: next };
                                    })
                                  }
                                  dataTestId={cardTestId}
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            ))}

            <textarea value={roteiro.notas || ""} onChange={(e) => setRoteiro((p) => ({ ...p, notas: e.target.value }))} placeholder="Notas do admin para o roteiro" style={{ minHeight: 90, padding: 10, borderRadius: 10, border: "1px solid #CBD5E1", resize: "vertical" }} data-testid="criar-excursao-wizard-notas" />
            <div
              style={{
                border: "1px solid #DBEAFE",
                borderRadius: 14,
                padding: 14,
                background: "linear-gradient(135deg, #EFF6FF 0%, #FFF7ED 100%)",
                boxShadow: "0 10px 25px rgba(30, 58, 138, 0.08)",
                animation: "preview-fade-up 360ms ease-out",
              }}
              data-testid="criar-excursao-wizard-preview"
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#1e3a8a" }}>Preview final do roteiro</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 12, color: "#475569" }}>Layout vitrine antes de publicar no grupo</div>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 11,
                      fontWeight: 700,
                      color:
                        mainSyncStatus === "error"
                          ? "#B91C1C"
                          : mainSyncStatus === "syncing"
                            ? "#92400E"
                            : "#166534",
                      background:
                        mainSyncStatus === "error"
                          ? "#FEE2E2"
                          : mainSyncStatus === "syncing"
                            ? "#FEF3C7"
                            : "#DCFCE7",
                      borderRadius: 999,
                      padding: "4px 8px",
                    }}
                    data-testid="criar-excursao-wizard-main-sync-status"
                  >
                    {mainSyncStatus === "syncing" ? (
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: 999,
                          border: "2px solid rgba(245, 158, 11, 0.35)",
                          borderTopColor: "#F59E0B",
                          animation: "preview-spin 700ms linear infinite",
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 999,
                          background: mainSyncStatus === "error" ? "#DC2626" : "#16A34A",
                        }}
                      />
                    )}
                    {mainSyncStatus === "syncing"
                      ? "Atualizando"
                      : mainSyncStatus === "error"
                        ? "Falha na sincronização"
                        : "Sincronizado agora"}
                  </span>
                  <span
                    style={{ fontSize: 11, color: "#334155", fontWeight: 600 }}
                    data-testid="criar-excursao-wizard-main-last-updated"
                  >
                    Última atualização: {mainLastUpdatedAt || "--:--:--"}
                  </span>
                </div>
              </div>
              <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8 }}>
                <div
                  style={{
                    borderRadius: 10,
                    padding: 10,
                    background: "#fff",
                    border: "1px solid #E2E8F0",
                    animation: "preview-fade-up 420ms ease-out",
                  }}
                  data-testid="criar-excursao-wizard-preview-veiculo"
                >
                  <div style={{ fontSize: 11, color: "#64748B" }}>Veículo final</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>{roteiro.veiculoTipo || suggestedVehicle}</div>
                  <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>
                    {roteiro.manualVehicleOverride ? "Override manual ativo" : "Automação por capacidade ativa"}
                  </div>
                </div>
                <div
                  style={{
                    borderRadius: 10,
                    padding: 10,
                    background: "#fff",
                    border: "1px solid #E2E8F0",
                    animation: "preview-fade-up 480ms ease-out",
                  }}
                  data-testid="criar-excursao-wizard-preview-capacidade"
                >
                  <div style={{ fontSize: 11, color: "#64748B" }}>Capacidade</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>{capacidade} pessoas</div>
                  <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>Sugestão automática: {suggestedVehicle}</div>
                </div>
              </div>
              <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
                {previewSections.map((section, sectionIdx) => (
                  <div
                    key={section.label}
                    style={{
                      background: "#fff",
                      border: "1px solid #E2E8F0",
                      borderRadius: 12,
                      padding: 10,
                      animation: `preview-fade-up ${560 + sectionIdx * 60}ms ease-out`,
                    }}
                    data-testid={`criar-excursao-wizard-preview-section-${section.label}`}
                  >
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 8 }}>{section.label}</div>
                    {section.cards.length === 0 || section.cards.every((card) => !card.titulo.trim()) ? (
                      <div style={{ fontSize: 12, color: "#64748B" }}>{section.fallback}</div>
                    ) : (
                      <div style={{ display: "grid", gap: 8 }}>
                        {section.cards
                          .filter((card) => card.titulo.trim())
                          .slice(0, 2)
                          .map((card, cardIdx) => (
                            <div
                              key={card.id}
                              style={{
                                border: "1px solid #E5E7EB",
                                borderRadius: 10,
                                overflow: "hidden",
                                transform: "translateY(0)",
                                transition: "transform 200ms ease, box-shadow 200ms ease",
                                animation: `preview-fade-up ${680 + cardIdx * 80}ms ease-out`,
                              }}
                              data-testid={`criar-excursao-wizard-preview-card-${section.label}`}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 8px 20px rgba(15, 23, 42, 0.12)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                              }}
                            >
                              {card.galeriaImagens?.[0] ? (
                                <img src={card.galeriaImagens[0]} alt={card.titulo} style={{ width: "100%", height: 92, objectFit: "cover", display: "block" }} />
                              ) : (
                                <div style={{ height: 92, background: "linear-gradient(120deg, #DBEAFE, #FFEDD5)" }} />
                              )}
                              <div style={{ padding: 8 }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>{card.titulo}</div>
                                <div style={{ marginTop: 4, fontSize: 11, color: "#64748B" }}>
                                  {card.descricaoBreve?.trim() || "Sem descrição breve."}
                                </div>
                                <div style={{ marginTop: 6, fontSize: 11, color: "#475569" }}>
                                  {(card.galeriaImagens?.length || 0)} imagem(ns) • {(card.galeriaVideos?.length || 0)} vídeo(s)
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setFullscreenPreviewOpen(true)}
                style={{ padding: "12px 14px", borderRadius: 10, border: "1px solid #1e3a8a", background: "#EFF6FF", color: "#1e3a8a", fontWeight: 700, cursor: "pointer" }}
                data-testid="criar-excursao-wizard-fullscreen-preview-open"
              >
                Ver como convidado
              </button>
              <button type="button" onClick={() => handleSaveRoteiro(false)} disabled={savingRoteiro} style={{ padding: "12px 14px", borderRadius: 10, border: "none", background: "#1e3a8a", color: "#fff", fontWeight: 700, cursor: "pointer" }} data-testid="criar-excursao-wizard-salvar">
                {savingRoteiro ? "Salvando..." : "Salvar roteiro"}
              </button>
              <button type="button" onClick={() => handleSaveRoteiro(true)} disabled={savingRoteiro} style={{ padding: "12px 14px", borderRadius: 10, border: "none", background: "#f97316", color: "#fff", fontWeight: 700, cursor: "pointer" }} data-testid="criar-excursao-wizard-publicar">
                Publicar e ir para grupo
              </button>
            </div>
          </div>
        )}

        {error ? <div style={{ color: "#B91C1C", fontSize: 13, marginTop: 10 }}>{error}</div> : null}
      </div>
      {fullscreenPreviewOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.7)",
            zIndex: 50,
            display: "grid",
            placeItems: "center",
            padding: 16,
            animation: "preview-fade-up 220ms ease-out",
          }}
          data-testid="criar-excursao-wizard-fullscreen-preview-overlay"
        >
          <div
            style={{
              width: "min(1200px, 100%)",
              maxHeight: "90vh",
              overflow: "auto",
              background: "#fff",
              borderRadius: 16,
              border: "1px solid #E2E8F0",
              boxShadow: "0 24px 60px rgba(15, 23, 42, 0.25)",
              padding: 16,
            }}
            data-testid="criar-excursao-wizard-fullscreen-preview"
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 19, fontWeight: 800, color: "#1e3a8a" }}>Simulação: visão do convidado</div>
                <div style={{ fontSize: 12, color: "#64748B" }}>
                  Prévia de como o roteiro aparecerá em <strong>/viagens-grupo/{excursaoId || ":id"}</strong>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => void refreshFullscreenPreview()}
                  style={{ border: "1px solid #1e3a8a", background: "#EFF6FF", color: "#1e3a8a", borderRadius: 8, padding: "8px 12px", fontWeight: 700, cursor: "pointer" }}
                  data-testid="criar-excursao-wizard-fullscreen-preview-refresh"
                >
                  {previewLoading ? "Atualizando..." : "Atualizar prévia"}
                </button>
                <button
                  type="button"
                  onClick={() => setFullscreenPreviewOpen(false)}
                  style={{ border: "none", background: "#0F172A", color: "#fff", borderRadius: 8, padding: "8px 12px", fontWeight: 700, cursor: "pointer" }}
                  data-testid="criar-excursao-wizard-fullscreen-preview-close"
                >
                  Fechar
                </button>
              </div>
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: "#64748B" }}>
              Auto-refresh ativo a cada 10s enquanto esta prévia estiver aberta.
            </div>
            <div style={{ marginTop: 4, fontSize: 11, color: "#334155", fontWeight: 600 }} data-testid="criar-excursao-wizard-fullscreen-preview-last-updated">
              Última atualização: {previewLastUpdatedAt || "--:--:--"}
            </div>
            <div
              style={{
                marginTop: 4,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
                fontWeight: 700,
                color:
                  previewSyncStatus === "error"
                    ? "#B91C1C"
                    : previewSyncStatus === "syncing"
                      ? "#92400E"
                      : "#166534",
                background:
                  previewSyncStatus === "error"
                    ? "#FEE2E2"
                    : previewSyncStatus === "syncing"
                      ? "#FEF3C7"
                      : "#DCFCE7",
                borderRadius: 999,
                padding: "4px 8px",
              }}
              data-testid="criar-excursao-wizard-fullscreen-preview-sync-status"
            >
              {previewSyncStatus === "syncing" ? (
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    border: "2px solid rgba(245, 158, 11, 0.35)",
                    borderTopColor: "#F59E0B",
                    animation: "preview-spin 700ms linear infinite",
                  }}
                />
              ) : (
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: previewSyncStatus === "error" ? "#DC2626" : "#16A34A",
                  }}
                />
              )}
              {previewSyncStatus === "syncing"
                ? "Atualizando"
                : previewSyncStatus === "error"
                  ? "Falha na sincronização"
                  : "Sincronizado agora"}
            </div>

            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
              <div style={{ border: "1px solid #E2E8F0", borderRadius: 10, padding: 10, background: "#F8FAFC" }}>
                <div style={{ fontSize: 11, color: "#64748B" }}>Veículo</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A" }}>{roteiro.veiculoTipo || suggestedVehicle}</div>
              </div>
              <div style={{ border: "1px solid #E2E8F0", borderRadius: 10, padding: 10, background: "#F8FAFC" }}>
                <div style={{ fontSize: 11, color: "#64748B" }}>Capacidade</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A" }}>{capacidade} pessoas</div>
              </div>
              <div style={{ border: "1px solid #E2E8F0", borderRadius: 10, padding: 10, background: "#F8FAFC" }}>
                <div style={{ fontSize: 11, color: "#64748B" }}>Modo</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A" }}>{roteiro.manualVehicleOverride ? "Override manual" : "Automático"}</div>
              </div>
            </div>

            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 10 }}>
              {previewSections.map((section) => (
                <div key={section.label} style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#1E293B", marginBottom: 8 }}>{section.label}</div>
                  {section.cards.length === 0 || section.cards.every((card) => !card.titulo.trim()) ? (
                    <div style={{ fontSize: 12, color: "#64748B" }}>{section.fallback}</div>
                  ) : (
                    <div style={{ display: "grid", gap: 8 }}>
                      {section.cards
                        .filter((card) => card.titulo.trim())
                        .map((card) => (
                          <div key={card.id} style={{ border: "1px solid #E5E7EB", borderRadius: 10, overflow: "hidden", background: "#fff" }}>
                            {card.galeriaImagens?.[0] ? (
                              <img src={card.galeriaImagens[0]} alt={card.titulo} style={{ width: "100%", height: 110, objectFit: "cover", display: "block" }} />
                            ) : (
                              <div style={{ height: 110, background: "linear-gradient(120deg, #DBEAFE, #FFEDD5)" }} />
                            )}
                            <div style={{ padding: 8 }}>
                              <div style={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>{card.titulo}</div>
                              {card.descricaoBreve ? <div style={{ marginTop: 4, fontSize: 12, color: "#64748B" }}>{card.descricaoBreve}</div> : null}
                              <div style={{ marginTop: 6, fontSize: 11, color: "#475569" }}>
                                {(card.galeriaImagens?.length || 0)} imagem(ns) • {(card.galeriaVideos?.length || 0)} vídeo(s)
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 10 }}>
              <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 10 }} data-testid="criar-excursao-wizard-fullscreen-preview-sugestoes">
                <div style={{ fontSize: 13, fontWeight: 800, color: "#1E293B", marginBottom: 8 }}>
                  Prévia real de sugestões {previewIsAdmin ? "(visão admin)" : "(somente leitura)"}
                </div>
                {previewSugestoes.length === 0 ? (
                  <div style={{ fontSize: 12, color: "#64748B" }}>
                    {previewIsAdmin ? "Sem sugestões no momento." : "Sem acesso de admin para listar sugestões ou ainda não existem."}
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: 8 }}>
                    {previewSugestoes.slice(0, 6).map((s) => (
                      <div key={s.id} style={{ border: "1px solid #E5E7EB", borderRadius: 8, padding: 8, background: "#fff" }}>
                        <div style={{ fontSize: 12, color: "#0F172A" }}>
                          <strong>{s.nomeAutor}</strong> sugeriu <strong>{s.valor}</strong> ({s.categoria})
                        </div>
                        {s.descricao ? <div style={{ marginTop: 4, fontSize: 11, color: "#64748B" }}>{s.descricao}</div> : null}
                        <div style={{ marginTop: 4, fontSize: 11, color: "#334155" }}>
                          Status: <strong>{s.status}</strong> {s.publishedForVoting ? "• publicado para votação" : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 10 }} data-testid="criar-excursao-wizard-fullscreen-preview-votacao">
                <div style={{ fontSize: 13, fontWeight: 800, color: "#1E293B", marginBottom: 8 }}>
                  Prévia real da votação
                </div>
                {previewVotacao.length === 0 ? (
                  <div style={{ fontSize: 12, color: "#64748B" }}>Sem itens publicados para votação.</div>
                ) : (
                  <div style={{ display: "grid", gap: 8 }}>
                    {previewVotacao.slice(0, 8).map((item) => (
                      <div key={item.id} style={{ border: "1px solid #E5E7EB", borderRadius: 8, padding: 8, background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                        <div style={{ fontSize: 12, color: "#0F172A" }}>
                          <strong>{item.valor}</strong> <span style={{ color: "#64748B" }}>({item.categoria})</span>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: "#1e3a8a" }}>{item.votos} votos</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <style>
        {`
          @keyframes preview-fade-up {
            from {
              opacity: 0;
              transform: translateY(8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes preview-spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
}
