import { useState, useEffect, useRef } from "react";
import { Link, useSearch } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  ArrowLeft,
  Settings,
  Building2,
  Image as ImageIcon,
  Globe,
  Save,
  Loader2,
  AlertCircle,
  Type,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  Upload,
  Trash2,
  Shield,
  UserCheck,
  User,
  Check,
  X,
  Search,
  Crown,
  RefreshCw,
} from "lucide-react";
import { useAdminSettings, useAdminMedia, useAdminMediaUpload, useAdminPages, useAdminMediaById } from "@/hooks/useAdminWebsite";
import { LogoUploadButton } from "@/components/admin/MediaActions";
import { MediaFilterBar, type MediaFilters } from "@/components/admin/MediaSelectors";
import { MediaActionBar } from "@/components/admin/MediaActions";
import type { UpdateSettingsRequest, MediaQueryFilter, AdminPageResponse } from "@shared/website-types";
import { HERO_TYPES } from "@shared/website-types";
import { LandingPagesTab } from "@/components/admin/LandingPagesTab";
import { useAuth } from "@/hooks/use-auth";

type TabId = "site" | "midia" | "landingpages" | "acesso";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "#374151",
  marginBottom: 4,
  display: "block",
};

function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 16px",
        background: "#fef2f2",
        border: "1px solid #fca5a5",
        borderRadius: 8,
        marginBottom: 16,
        color: "#dc2626",
        fontSize: 14,
      }}
    >
      <AlertCircle style={{ width: 18, height: 18, flexShrink: 0 }} />
      {message}
    </div>
  );
}

/* ─── Settings tab ───────────────────────────────────────────────────────── */

function SiteSettingsTab() {
  const { toast } = useToast();
  const { data: settings, isLoading, error, update } = useAdminSettings();

  const uploadMedia = useAdminMediaUpload();

  const [form, setForm] = useState<UpdateSettingsRequest>({});
  const [dirty, setDirty] = useState(false);

  const { data: logoMedia } = useAdminMediaById(form.logoMediaId ?? settings?.logoMediaId);
  const { data: bannerMedia } = useAdminMediaById(form.defaultBannerMediaId ?? settings?.defaultBannerMediaId);

  useEffect(() => {
    if (settings && !dirty) {
      setForm({
        siteName: settings.siteName,
        heroType: settings.heroType,
        primaryColor: settings.primaryColor ?? undefined,
        contactEmail: settings.contactEmail ?? undefined,
        contactPhone: settings.contactPhone ?? undefined,
        logoMediaId: settings.logoMediaId ?? undefined,
        defaultBannerMediaId: settings.defaultBannerMediaId ?? undefined,
        socialLinks: settings.socialLinks ?? undefined,
      });
    }
  }, [settings, dirty]);

  const set = <K extends keyof UpdateSettingsRequest>(key: K, value: UpdateSettingsRequest[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setDirty(true);
  };

  const handleSave = () => {
    update.mutate(form, {
      onSuccess: () => {
        setDirty(false);
        toast({ title: "Configurações do site salvas!" });
      },
      onError: (err) => {
        toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
      },
    });
  };

  const handleLogoUpload = (file: File) => {
    uploadMedia.mutate(
      { file, meta: { placement: "icon", altText: "Logo do site" } },
      {
        onSuccess: (media) => {
          set("logoMediaId", media.id);
          toast({ title: "Logo enviado!", description: "Salve para confirmar." });
        },
        onError: (err) => {
          toast({ title: "Erro no upload", description: err.message, variant: "destructive" });
        },
      }
    );
  };

  const handleBannerUpload = (file: File) => {
    uploadMedia.mutate(
      { file, meta: { placement: "banner", altText: "Banner padrão do site" } },
      {
        onSuccess: (media) => {
          set("defaultBannerMediaId", media.id);
          toast({ title: "Banner enviado!", description: "Salve para confirmar." });
        },
        onError: (err) => {
          toast({ title: "Erro no upload do banner", description: err.message, variant: "destructive" });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div
        data-testid="loading-settings"
        style={{ display: "flex", justifyContent: "center", padding: 40, color: "#6b7280" }}
      >
        <Loader2 style={{ width: 24, height: 24, animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  if (error) {
    return <ErrorBanner message={`Erro ao carregar configurações: ${error.message}`} />;
  }

  return (
    <div data-testid="tab-content-site">
      <h3
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "#1e3a5f",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Globe style={{ width: 20, height: 20 }} /> Configurações do Site
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
        <div>
          <label style={labelStyle}>Nome do Site</label>
          <input
            data-testid="input-site-name"
            value={form.siteName ?? ""}
            onChange={(e) => set("siteName", e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Cor Primária</label>
          <input
            data-testid="input-primary-color"
            value={form.primaryColor ?? ""}
            onChange={(e) => set("primaryColor", e.target.value || null)}
            placeholder="#2563EB"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>E-mail de Contato</label>
          <input
            data-testid="input-contact-email"
            type="email"
            value={form.contactEmail ?? ""}
            onChange={(e) => set("contactEmail", e.target.value || null)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Telefone de Contato</label>
          <input
            data-testid="input-contact-phone"
            value={form.contactPhone ?? ""}
            onChange={(e) => set("contactPhone", e.target.value || null)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Tipo de Hero</label>
          <select
            data-testid="select-hero-type"
            value={form.heroType ?? "image"}
            onChange={(e) => set("heroType", e.target.value as typeof HERO_TYPES[number])}
            style={inputStyle}
          >
            {HERO_TYPES.map((h) => (
              <option key={h} value={h}>
                {h === "image" ? "Imagem" : h === "video" ? "Vídeo" : "Nenhum"}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Logo do Site</label>
          <LogoUploadButton
            currentUrl={logoMedia?.url ?? undefined}
            isPending={uploadMedia.isPending}
            onUpload={handleLogoUpload}
            label="Enviar novo logo"
          />
          {form.logoMediaId && (
            <p data-testid="text-logo-media-id" style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
              Mídia vinculada: {form.logoMediaId}
            </p>
          )}
        </div>
        <div>
          <label style={labelStyle}>Banner Padrão</label>
          <LogoUploadButton
            currentUrl={bannerMedia?.url ?? undefined}
            isPending={uploadMedia.isPending}
            onUpload={handleBannerUpload}
            label="Enviar banner padrão"
          />
          {form.defaultBannerMediaId && (
            <p data-testid="text-banner-media-id" style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
              Mídia vinculada: {form.defaultBannerMediaId}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 28 }}>
        <button
          data-testid="button-salvar-config"
          onClick={handleSave}
          disabled={update.isPending || !dirty}
          style={{
            padding: "12px 28px",
            borderRadius: 8,
            border: "none",
            background:
              update.isPending || !dirty
                ? "#93c5fd"
                : "linear-gradient(135deg, #1e3a5f, #2563EB)",
            color: "#fff",
            fontSize: 15,
            fontWeight: 600,
            cursor: update.isPending || !dirty ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {update.isPending ? (
            <>
              <Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} />{" "}
              Salvando...
            </>
          ) : (
            <>
              <Save style={{ width: 18, height: 18 }} /> Salvar Configurações
            </>
          )}
        </button>
      </div>
    </div>
  );
}

type PageUpdateMutate = ReturnType<typeof useAdminPages>["update"]["mutate"];

/* ─── Hero Text Row (one row per page) ──────────────────────────────────── */

const HERO_TEXT_DEBOUNCE_MS = 400;

function HeroTextRow({ page, onSave }: { page: AdminPageResponse; onSave: PageUpdateMutate }) {
  const { toast } = useToast();

  const content = (page.content as Record<string, unknown>) ?? {};
  const hero = (content.hero as Record<string, unknown> | undefined) ?? {};

  const [headline, setHeadline] = useState((hero.headline as string) ?? "");
  const [subheadline, setSubheadline] = useState((hero.subheadline as string) ?? "");
  const [savingField, setSavingField] = useState<"headline" | "subheadline" | null>(null);

  const localHeroRef = useRef({ headline, subheadline });
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const h = ((page.content as Record<string, unknown>)?.hero as Record<string, unknown> | undefined) ?? {};
    const newHeadline = (h.headline as string) ?? "";
    const newSubheadline = (h.subheadline as string) ?? "";
    setHeadline(newHeadline);
    setSubheadline(newSubheadline);
    localHeroRef.current = { headline: newHeadline, subheadline: newSubheadline };
  }, [page.content]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  const scheduleSave = (field: "headline" | "subheadline", value: string) => {
    localHeroRef.current = { ...localHeroRef.current, [field]: value };
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      const latestContent = (page.content as Record<string, unknown>) ?? {};
      const latestHero = (latestContent.hero as Record<string, unknown> | undefined) ?? {};
      const updatedContent = {
        ...latestContent,
        hero: { ...latestHero, ...localHeroRef.current },
      };
      setSavingField(field);
      onSave(
        { id: page.id, body: { content: updatedContent } },
        {
          onSuccess: () => toast({ title: `"${page.title}" — ${field === "headline" ? "título" : "subtítulo"} atualizado.` }),
          onError: (err) => toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" }),
          onSettled: () => setSavingField(null),
        }
      );
    }, HERO_TEXT_DEBOUNCE_MS);
  };

  return (
    <div
      data-testid={`hero-row-${page.slug}`}
      style={{
        display: "grid",
        gridTemplateColumns: "160px 1fr 1fr",
        gap: 10,
        alignItems: "center",
        padding: "8px 0",
        borderBottom: "1px solid #f3f4f6",
      }}
    >
      <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={page.title}>
        {page.title}
      </span>
      <div style={{ position: "relative" }}>
        <input
          data-testid={`input-headline-${page.slug}`}
          type="text"
          value={headline}
          onChange={(e) => { setHeadline(e.target.value); scheduleSave("headline", e.target.value); }}
          onBlur={(e) => scheduleSave("headline", e.target.value)}
          placeholder="Título do hero…"
          style={{ ...inputStyle, fontSize: 12, paddingRight: savingField === "headline" ? 28 : 10 }}
        />
        {savingField === "headline" && (
          <Loader2 style={{ width: 12, height: 12, position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", animation: "spin 1s linear infinite", color: "#2563EB" }} />
        )}
      </div>
      <div style={{ position: "relative" }}>
        <input
          data-testid={`input-subheadline-${page.slug}`}
          type="text"
          value={subheadline}
          onChange={(e) => { setSubheadline(e.target.value); scheduleSave("subheadline", e.target.value); }}
          onBlur={(e) => scheduleSave("subheadline", e.target.value)}
          placeholder="Subtítulo do hero…"
          style={{ ...inputStyle, fontSize: 12, paddingRight: savingField === "subheadline" ? 28 : 10 }}
        />
        {savingField === "subheadline" && (
          <Loader2 style={{ width: 12, height: 12, position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", animation: "spin 1s linear infinite", color: "#2563EB" }} />
        )}
      </div>
    </div>
  );
}

/* ─── Hero Text Editor (all pages list) ─────────────────────────────────── */

function HeroTextEditor({ pages }: { pages: AdminPageResponse[] }) {
  const [open, setOpen] = useState(false);
  const { update } = useAdminPages();

  return (
    <div
      data-testid="hero-text-editor"
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 20,
      }}
    >
      <button
        data-testid="button-toggle-hero-editor"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          background: "#f9fafb",
          border: "none",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 600,
          color: "#1e3a5f",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Type style={{ width: 16, height: 16 }} /> Textos do Hero — Todas as Páginas
        </span>
        {open ? <ChevronUp style={{ width: 16, height: 16 }} /> : <ChevronDown style={{ width: 16, height: 16 }} />}
      </button>

      {open && (
        <div style={{ padding: "12px 16px", borderTop: "1px solid #e5e7eb" }}>
          <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 10, marginTop: 0 }}>
            Edite os textos de cada página diretamente. O campo é salvo ao perder o foco (blur).
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "160px 1fr 1fr",
              gap: 10,
              padding: "4px 0 8px",
              borderBottom: "2px solid #e5e7eb",
              marginBottom: 4,
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 }}>Página</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 }}>Headline</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 }}>Subheadline</span>
          </div>
          {pages.map((page) => (
            <HeroTextRow key={page.id} page={page} onSave={update.mutate} />
          ))}
          {pages.length === 0 && (
            <p style={{ fontSize: 13, color: "#9ca3af", textAlign: "center", padding: 16 }}>Nenhuma página encontrada.</p>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Media tab ──────────────────────────────────────────────────────────── */

const GALLERY_PAGE_SLUGS = [
  { slug: "hoteis", label: "Hotéis" },
  { slug: "ingressos", label: "Ingressos" },
  { slug: "excursoes", label: "Excursões" },
  { slug: "promocoes", label: "Promoções" },
  { slug: "ofertas", label: "Flash Deals" },
  { slug: "atracoes", label: "Atrações" },
  { slug: "leiloes", label: "Leilões" },
];

const GALLERY_IMAGE_LIMIT = 20;

function GalleryAdminPanel({ pages }: { pages: AdminPageResponse[] }) {
  const { toast } = useToast();
  const [selectedSlug, setSelectedSlug] = useState(GALLERY_PAGE_SLUGS[0].slug);
  const [uploading, setUploading] = useState(false);
  const [altText, setAltText] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [savingVideo, setSavingVideo] = useState(false);

  const selectedPage = pages.find((p) => p.slug === selectedSlug) ?? null;

  const galleryQuery = useAdminMedia(
    selectedPage
      ? { pageId: selectedPage.id, placement: "gallery", limit: 50 }
      : undefined
  );
  const galleryItems = galleryQuery.data?.data ?? [];

  const galleryImages = galleryItems.filter((m) => m.type === "image");
  const galleryVideo = galleryItems.find((m) => m.type === "video") ?? null;
  const atLimit = galleryImages.length >= GALLERY_IMAGE_LIMIT;

  const upload = useAdminMediaUpload();
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedPage) return;
    if (atLimit) {
      toast({ title: "Limite atingido", description: `Máximo de ${GALLERY_IMAGE_LIMIT} imagens por página.`, variant: "destructive" });
      return;
    }
    setUploading(true);
    upload.mutate(
      { file, meta: { placement: "gallery", pageId: selectedPage.id, altText: altText || undefined } },
      {
        onSuccess: () => {
          toast({ title: "Imagem adicionada à galeria!" });
          setAltText("");
          galleryQuery.refetch();
        },
        onError: (err) => toast({ title: "Erro no upload", description: err.message, variant: "destructive" }),
        onSettled: () => setUploading(false),
      }
    );
    e.target.value = "";
  };

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedPage) return;
    setUploadingVideo(true);
    upload.mutate(
      { file, meta: { placement: "gallery", pageId: selectedPage.id, altText: altText || "Vídeo em destaque" } },
      {
        onSuccess: () => {
          toast({ title: "Vídeo adicionado à galeria!" });
          setAltText("");
          galleryQuery.refetch();
        },
        onError: (err) => toast({ title: "Erro no upload do vídeo", description: err.message, variant: "destructive" }),
        onSettled: () => setUploadingVideo(false),
      }
    );
    e.target.value = "";
  };

  const handleSaveVideoUrl = async () => {
    if (!videoUrl.trim() || !selectedPage) return;
    setSavingVideo(true);
    try {
      const res = await fetch("/api/admin/website/media/external-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          url: videoUrl.trim(),
          pageId: selectedPage.id,
          placement: "gallery",
          altText: altText || "Vídeo em destaque",
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Erro");
      toast({ title: "Vídeo salvo na galeria!" });
      setVideoUrl("");
      setAltText("");
      galleryQuery.refetch();
    } catch (err: unknown) {
      toast({ title: "Erro ao salvar vídeo", description: (err as Error).message, variant: "destructive" });
    } finally {
      setSavingVideo(false);
    }
  };

  const handleDelete = (id: string) => {
    galleryQuery.remove.mutate({ id, force: true }, {
      onSuccess: () => { toast({ title: "Item removido da galeria." }); galleryQuery.refetch(); },
      onError: (err) => toast({ title: "Erro ao remover", description: err.message, variant: "destructive" }),
    });
  };

  return (
    <div
      data-testid="gallery-admin-panel"
      style={{
        marginTop: 36,
        padding: "20px 24px",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        background: "#f8fafc",
      }}
    >
      <h4 style={{ fontSize: 15, fontWeight: 700, color: "#1e3a5f", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        <LayoutGrid style={{ width: 16, height: 16 }} /> Gerenciar Galerias por Página
      </h4>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16, alignItems: "flex-end" }}>
        <div>
          <label style={{ ...labelStyle, marginBottom: 4 }}>Página</label>
          <select
            data-testid="select-gallery-page"
            value={selectedSlug}
            onChange={(e) => { setSelectedSlug(e.target.value); setVideoUrl(""); setAltText(""); }}
            style={{ padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13 }}
          >
            {GALLERY_PAGE_SLUGS.map((p) => (
              <option key={p.slug} value={p.slug}>{p.label}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <label style={{ ...labelStyle, marginBottom: 4 }}>Legenda / Alt Text (opcional)</label>
          <input
            data-testid="input-gallery-alt"
            type="text"
            placeholder="Descreva a imagem/vídeo..."
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            style={{ ...inputStyle }}
          />
        </div>
        <label
          data-testid="button-gallery-upload"
          style={{
            padding: "9px 16px",
            borderRadius: 8,
            background: atLimit ? "#9ca3af" : "linear-gradient(135deg, #1e3a5f, #2563EB)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            cursor: selectedPage && !atLimit ? "pointer" : "not-allowed",
            opacity: selectedPage && !atLimit ? 1 : 0.6,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
          title={atLimit ? `Limite de ${GALLERY_IMAGE_LIMIT} imagens atingido` : "Upload de imagem"}
        >
          {uploading ? (
            <Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} />
          ) : (
            <Upload style={{ width: 14, height: 14 }} />
          )}
          Upload imagem
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleUpload}
            disabled={!selectedPage || uploading || atLimit}
          />
        </label>
      </div>

      {selectedPage && (
        <div style={{ marginBottom: 16 }}>
          <label style={{ ...labelStyle, marginBottom: 6 }}>
            Vídeo em Destaque
          </label>
          <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            <input
              data-testid="input-gallery-video-url"
              type="url"
              placeholder="URL YouTube / Vimeo (https://www.youtube.com/watch?v=...)"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              style={{ ...inputStyle, flex: 1, minWidth: 200 }}
            />
            <button
              data-testid="btn-gallery-save-video"
              onClick={handleSaveVideoUrl}
              disabled={!videoUrl.trim() || savingVideo}
              style={{
                padding: "9px 14px",
                borderRadius: 8,
                background: "#2563EB",
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                border: "none",
                cursor: videoUrl.trim() ? "pointer" : "not-allowed",
                opacity: videoUrl.trim() ? 1 : 0.5,
                display: "flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap",
              }}
            >
              {savingVideo ? <Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} /> : <Upload style={{ width: 14, height: 14 }} />}
              Salvar URL
            </button>
            <label
              data-testid="button-gallery-video-upload"
              style={{
                padding: "9px 14px",
                borderRadius: 8,
                background: selectedPage ? "#0f766e" : "#9ca3af",
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                cursor: selectedPage ? "pointer" : "not-allowed",
                opacity: selectedPage ? 1 : 0.6,
                display: "flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap",
              }}
              title="Upload arquivo de vídeo"
            >
              {uploadingVideo ? (
                <Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} />
              ) : (
                <Upload style={{ width: 14, height: 14 }} />
              )}
              Upload vídeo
              <input
                type="file"
                accept="video/*"
                style={{ display: "none" }}
                onChange={handleVideoFileUpload}
                disabled={!selectedPage || uploadingVideo}
              />
            </label>
          </div>

          {galleryVideo && (
            <div style={{ marginTop: 10, border: "1px solid #bfdbfe", borderRadius: 10, overflow: "hidden", background: "#eff6ff" }}>
              <div style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: "#1d4ed8", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  🎥 {galleryVideo.altText ?? galleryVideo.url}
                </span>
                <button
                  data-testid={`btn-gallery-delete-video-${galleryVideo.id}`}
                  onClick={() => handleDelete(galleryVideo.id)}
                  style={{ background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer", fontWeight: 600, flexShrink: 0 }}
                >
                  Remover
                </button>
              </div>
              {(galleryVideo.url.includes("youtube") || galleryVideo.url.includes("youtu.be") || galleryVideo.url.includes("vimeo")) ? (
                <div style={{ position: "relative", paddingTop: "40%", background: "#000" }}>
                  <iframe
                    src={
                      galleryVideo.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/)
                        ? `https://www.youtube.com/embed/${galleryVideo.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/)?.[1]}?rel=0`
                        : galleryVideo.url.match(/vimeo\.com\/(\d+)/)
                          ? `https://player.vimeo.com/video/${galleryVideo.url.match(/vimeo\.com\/(\d+)/)?.[1]}`
                          : galleryVideo.url
                    }
                    title={galleryVideo.altText ?? "Prévia do vídeo"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                  />
                </div>
              ) : (
                <video
                  src={galleryVideo.url}
                  controls
                  style={{ width: "100%", maxHeight: 200, display: "block", background: "#000" }}
                />
              )}
            </div>
          )}
        </div>
      )}

      {!selectedPage && (
        <p style={{ fontSize: 13, color: "#f59e0b", marginBottom: 12 }}>
          Página "{selectedSlug}" ainda não foi criada no CMS. Acesse Landing Pages para criá-la.
        </p>
      )}

      {selectedPage && (
        <p style={{ fontSize: 12, color: atLimit ? "#dc2626" : "#6b7280", marginBottom: 10, fontWeight: atLimit ? 600 : 400 }}>
          {galleryImages.length} / {GALLERY_IMAGE_LIMIT} imagens{atLimit ? " — limite atingido" : ""}
        </p>
      )}

      {galleryQuery.isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
          <Loader2 style={{ width: 20, height: 20, animation: "spin 1s linear infinite", color: "#6b7280" }} />
        </div>
      ) : galleryImages.length === 0 ? (
        <p style={{ fontSize: 13, color: "#9ca3af", padding: "12px 0" }}>
          Nenhuma imagem na galeria desta página. Faça upload acima para adicionar.
        </p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
          {galleryImages.map((item) => (
            <div
              key={item.id}
              data-testid={`gallery-admin-item-${item.id}`}
              style={{
                position: "relative",
                borderRadius: 10,
                overflow: "hidden",
                border: "1px solid #e5e7eb",
                background: "#1f2937",
              }}
            >
              <img
                src={item.url}
                alt={item.altText ?? item.originalName}
                style={{ width: "100%", height: 90, objectFit: "cover", display: "block" }}
              />
              <div style={{ padding: "6px 8px", background: "#fff" }}>
                <p style={{ fontSize: 10, color: "#6b7280", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.altText ?? item.originalName}
                </p>
                <button
                  data-testid={`btn-gallery-delete-${item.id}`}
                  onClick={() => handleDelete(item.id)}
                  style={{
                    marginTop: 4,
                    width: "100%",
                    padding: "4px 0",
                    borderRadius: 6,
                    border: "none",
                    background: "#fee2e2",
                    color: "#dc2626",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  <Trash2 style={{ width: 10, height: 10 }} /> Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MidiaTab() {
  const { toast } = useToast();
  const [filters, setFilters] = useState<MediaFilters>({});
  const [uploading, setUploading] = useState(false);

  const mediaQuery: MediaQueryFilter = {
    type: filters.type || undefined,
    status: filters.status || undefined,
    placement: filters.placement || undefined,
    search: filters.search,
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    limit: 500,
  };

  const { data, isLoading, error, upload, updateMeta, swap, unlink, remove } =
    useAdminMedia(mediaQuery);

  const { data: pagesData } = useAdminPages();
  const pages = pagesData?.data ?? [];

  const [pendingSwap, setPendingSwap] = useState<string | null>(null);
  const [pendingUnlink, setPendingUnlink] = useState<string | null>(null);
  const [pendingUpdate, setPendingUpdate] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    upload.mutate(
      { file, meta: { placement: "misc" } },
      {
        onSuccess: () => toast({ title: "Mídia enviada com sucesso!" }),
        onError: (err) => toast({ title: "Erro no upload", description: err.message, variant: "destructive" }),
        onSettled: () => setUploading(false),
      }
    );
    e.target.value = "";
  };

  const handleSwap = (id: string, file: File) => {
    setPendingSwap(id);
    swap.mutate({ id, file }, {
      onSuccess: () => toast({ title: "Arquivo substituído com sucesso." }),
      onError: (err) => toast({ title: "Erro ao substituir", description: err.message, variant: "destructive" }),
      onSettled: () => setPendingSwap(null),
    });
  };

  const handleUnlink = (id: string) => {
    setPendingUnlink(id);
    unlink.mutate(id, {
      onSuccess: () => toast({ title: "Mídia desvinculada da página." }),
      onError: (err) => toast({ title: "Erro ao desvincular", description: err.message, variant: "destructive" }),
      onSettled: () => setPendingUnlink(null),
    });
  };

  const handleUpdateMeta = (id: string, body: Parameters<typeof updateMeta.mutate>[0]["body"], onSuccess: () => void) => {
    setPendingUpdate(id);
    updateMeta.mutate({ id, body }, {
      onSuccess: () => { onSuccess(); toast({ title: "Metadados atualizados." }); },
      onError: (err) => toast({ title: "Erro ao atualizar", description: err.message, variant: "destructive" }),
      onSettled: () => setPendingUpdate(null),
    });
  };

  const handleDelete = (id: string, force: boolean) => {
    setPendingDelete(id);
    remove.mutate({ id, force }, {
      onSuccess: () => toast({ title: "Mídia excluída.", variant: "destructive" }),
      onError: (err) => toast({ title: "Erro ao excluir", description: err.message, variant: "destructive" }),
      onSettled: () => setPendingDelete(null),
    });
  };

  const handleReset = () => setFilters({});

  const selectedPage = pages.find((p) => p.id === filters.pageId);

  const allMedia = data?.data ?? [];
  const filteredMedia = filters.pageId
    ? allMedia.filter((m) => m.pageId === filters.pageId)
    : allMedia;

  return (
    <div data-testid="tab-content-midia">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h3
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#1e3a5f",
            display: "flex",
            alignItems: "center",
            gap: 8,
            margin: 0,
          }}
        >
          <ImageIcon style={{ width: 20, height: 20 }} /> Gerenciamento de Mídias
        </h3>
        <label
          data-testid="button-upload-media"
          style={{
            padding: "9px 18px",
            borderRadius: 8,
            background: "linear-gradient(135deg, #1e3a5f, #2563EB)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {uploading ? (
            <Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} />
          ) : null}
          + Upload
          <input type="file" accept="image/*,video/*,application/pdf" style={{ display: "none" }} onChange={handleUpload} />
        </label>
      </div>

      <HeroTextEditor pages={pages} />

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ ...labelStyle, marginBottom: 2 }}>Filtrar por página</label>
            <select
              data-testid="select-filter-page"
              value={filters.pageId ?? ""}
              onChange={(e) => setFilters((f) => ({ ...f, pageId: e.target.value || undefined }))}
              style={{ padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13, minWidth: 200 }}
            >
              <option value="">Todas as páginas</option>
              {pages.map((p) => (
                <option key={p.id} value={p.id}>{p.title} ({p.slug})</option>
              ))}
            </select>
          </div>
          {selectedPage && (
            <div
              data-testid="badge-selected-page"
              style={{
                marginTop: 20,
                padding: "4px 10px",
                borderRadius: 20,
                background: "#dbeafe",
                color: "#1d4ed8",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {selectedPage.title}
            </div>
          )}
        </div>
      </div>

      <MediaFilterBar filters={filters} pages={pages} onChange={setFilters} onReset={handleReset} />

      {isLoading && (
        <div
          data-testid="loading-media"
          style={{ display: "flex", justifyContent: "center", padding: 40, color: "#6b7280" }}
        >
          <Loader2 style={{ width: 24, height: 24, animation: "spin 1s linear infinite" }} />
        </div>
      )}

      {error && <ErrorBanner message={`Erro ao carregar mídias: ${error.message}`} />}

      {!isLoading && !error && (
        <>
          <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>
            {filters.pageId
              ? `${filteredMedia.length} mídia${filteredMedia.length !== 1 ? "s" : ""} na página "${selectedPage?.title ?? ""}" (${data?.meta?.total ?? allMedia.length} total no banco)`
              : `${data?.meta?.total ?? allMedia.length} mídia${(data?.meta?.total ?? allMedia.length) !== 1 ? "s" : ""} no banco`}
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            {filteredMedia.map((media) => (
              <div
                key={media.id}
                data-testid={`card-media-${media.id}`}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  overflow: "hidden",
                  background: "#fff",
                }}
              >
                {media.type === "image" ? (
                  <img
                    src={media.url}
                    alt={media.altText ?? media.originalName}
                    style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: 120,
                      background: "#f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      color: "#6b7280",
                    }}
                  >
                    {media.type === "video" ? "🎬 Vídeo" : "📄 Documento"}
                  </div>
                )}
                <div style={{ padding: 10 }}>
                  <p
                    data-testid={`text-media-name-${media.id}`}
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#1f2937",
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={media.originalName}
                  >
                    {media.originalName}
                  </p>
                  <p
                    data-testid={`text-media-status-${media.id}`}
                    style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0" }}
                  >
                    {media.status} · {media.placement}
                  </p>
                  <MediaActionBar
                    media={media}
                    swapPending={pendingSwap === media.id}
                    unlinkPending={pendingUnlink === media.id}
                    updatePending={pendingUpdate === media.id}
                    deletePending={pendingDelete === media.id}
                    onSwap={handleSwap}
                    onUnlink={handleUnlink}
                    onUpdateMeta={handleUpdateMeta}
                    onDelete={handleDelete}
                  />
                </div>
              </div>
            ))}
          </div>
          {data?.data?.length === 0 && (
            <p
              data-testid="text-no-media"
              style={{ textAlign: "center", color: "#9ca3af", padding: 32, fontSize: 14 }}
            >
              Nenhuma mídia encontrada.
            </p>
          )}
        </>
      )}

      <GalleryAdminPanel pages={pages} />
    </div>
  );
}

/* ─── Access Control Tab ─────────────────────────────────────────────────── */

interface AccessRequestWithUser {
  id: string;
  userId: string;
  status: "pending" | "approved" | "rejected";
  message: string;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
  user: { id: string; nome: string; email: string; role: string } | null;
}

function AccessControlTab() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [busca, setBusca] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const { data, isLoading, error, refetch } = useQuery<{ items: AccessRequestWithUser[] }>({
    queryKey: ["/api/admin/access-requests"],
  });

  const { data: usersData } = useQuery<{ items: { id: string; nome: string; email: string; role: string }[] }>({
    queryKey: ["/api/admin/users"],
  });

  const actionMutation = useMutation({
    mutationFn: async ({ id, action }: { id: string; action: "approve" | "reject" }) => {
      const res = await apiRequest("PATCH", `/api/admin/access-requests/${id}`, { action });
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/access-requests"] });
      qc.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Ação realizada com sucesso!" });
    },
    onError: (err: Error) => {
      toast({ title: "Erro ao processar ação", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/admin/access-requests/${id}`);
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/access-requests"] });
      toast({ title: "Solicitação removida." });
    },
    onError: (err: Error) => {
      toast({ title: "Erro ao remover solicitação", description: err.message, variant: "destructive" });
    },
  });

  const revokeMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await apiRequest("PATCH", `/api/admin/users/${userId}/role`, { role: "user" });
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Acesso de editor revogado." });
    },
    onError: (err: Error) => {
      toast({ title: "Erro ao revogar acesso", description: err.message, variant: "destructive" });
    },
  });

  const allRequests = data?.items ?? [];
  const editors = (usersData?.items ?? []).filter((u) => u.role === "editor");

  const filteredRequests = allRequests.filter((r) => {
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    const matchBusca =
      !busca ||
      r.user?.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      r.user?.email?.toLowerCase().includes(busca.toLowerCase());
    return matchStatus && matchBusca;
  });

  const pending = allRequests.filter((r) => r.status === "pending").length;

  const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: "Pendente", color: "#b45309", bg: "#FEF3C7" },
    approved: { label: "Aprovado", color: "#166534", bg: "#DCFCE7" },
    rejected: { label: "Rejeitado", color: "#dc2626", bg: "#FEE2E2" },
  };

  return (
    <div data-testid="tab-content-acesso">
      <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e3a5f", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
        <Shield style={{ width: 20, height: 20 }} /> Controle de Acesso — Aprovação de Editores
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Pendentes", value: pending, color: "#b45309", bg: "#FEF3C7" },
          { label: "Editores Ativos", value: editors.length, color: "#1D4ED8", bg: "#DBEAFE" },
          { label: "Total Solicitações", value: allRequests.length, color: "#6B7280", bg: "#F3F4F6" },
        ].map((card) => (
          <div key={card.label} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "16px 20px" }}>
            <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 4px" }}>{card.label}</p>
            <p style={{ fontSize: 26, fontWeight: 700, color: card.color, margin: 0 }}>{card.value}</p>
          </div>
        ))}
      </div>

      {editors.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <h4 style={{ fontSize: 15, fontWeight: 700, color: "#374151", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
            <UserCheck style={{ width: 16, height: 16, color: "#2563EB" }} /> Editores Ativos ({editors.length})
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {editors.map((editor) => (
              <div key={editor.id} data-testid={`editor-row-${editor.id}`} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "#EFF6FF", borderRadius: 10, border: "1px solid #BFDBFE" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#2563EB" }}>{(editor.nome ?? "?")[0]}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#1e3a5f" }}>{editor.nome}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>{editor.email}</p>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#DBEAFE", color: "#1D4ED8" }}>Editor</span>
                <button
                  data-testid={`button-revogar-${editor.id}`}
                  onClick={() => revokeMutation.mutate(editor.id)}
                  disabled={revokeMutation.isPending}
                  style={{ padding: "6px 14px", borderRadius: 7, border: "1px solid #fca5a5", background: "#FFF1F2", color: "#dc2626", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                >
                  Revogar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginBottom: 16, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
          <Search style={{ position: "absolute", left: 10, top: 11, width: 14, height: 14, color: "#9ca3af" }} />
          <input
            data-testid="input-busca-requests"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome ou e-mail..."
            style={{ width: "100%", padding: "10px 10px 10px 30px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }}
          />
        </div>
        <select
          data-testid="select-status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          style={{ padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13, outline: "none", background: "#fff" }}
        >
          <option value="all">Todos os status</option>
          <option value="pending">Pendentes</option>
          <option value="approved">Aprovados</option>
          <option value="rejected">Rejeitados</option>
        </select>
        <button
          data-testid="button-refresh-requests"
          onClick={() => refetch()}
          style={{ padding: "10px 14px", border: "1px solid #d1d5db", borderRadius: 8, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#374151" }}
        >
          <RefreshCw style={{ width: 14, height: 14 }} /> Atualizar
        </button>
      </div>

      {isLoading && (
        <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
          <Loader2 style={{ width: 24, height: 24, color: "#2563EB", animation: "spin 1s linear infinite" }} />
        </div>
      )}

      {error && <ErrorBanner message={`Erro ao carregar solicitações: ${(error as Error).message}`} />}

      {!isLoading && filteredRequests.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af" }}>
          <Shield style={{ width: 40, height: 40, margin: "0 auto 12px", opacity: 0.4 }} />
          <p style={{ margin: 0, fontSize: 14 }}>Nenhuma solicitação encontrada.</p>
        </div>
      )}

      {filteredRequests.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filteredRequests.map((req) => {
            const st = STATUS_LABEL[req.status] ?? STATUS_LABEL.pending;
            return (
              <div key={req.id} data-testid={`request-row-${req.id}`} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#4b5563" }}>{(req.user?.nome ?? "?")[0]}</span>
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#111827" }}>{req.user?.nome ?? "Usuário desconhecido"}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>{req.user?.email}</p>
                  {req.message && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#9ca3af", fontStyle: "italic" }}>"{req.message}"</p>}
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: st.bg, color: st.color, flexShrink: 0 }}>
                  {st.label}
                </span>
                <span style={{ fontSize: 11, color: "#9ca3af", flexShrink: 0 }}>{new Date(req.createdAt).toLocaleDateString("pt-BR")}</span>
                {req.status === "pending" && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      data-testid={`button-aprovar-${req.id}`}
                      onClick={() => actionMutation.mutate({ id: req.id, action: "approve" })}
                      disabled={actionMutation.isPending}
                      style={{ padding: "6px 14px", borderRadius: 7, border: "none", background: "#16a34a", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <Check style={{ width: 13, height: 13 }} /> Aprovar
                    </button>
                    <button
                      data-testid={`button-rejeitar-${req.id}`}
                      onClick={() => actionMutation.mutate({ id: req.id, action: "reject" })}
                      disabled={actionMutation.isPending}
                      style={{ padding: "6px 14px", borderRadius: 7, border: "1px solid #fca5a5", background: "#fff", color: "#dc2626", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <X style={{ width: 13, height: 13 }} /> Rejeitar
                    </button>
                  </div>
                )}
                {req.status !== "pending" && (
                  <button
                    data-testid={`button-remover-${req.id}`}
                    onClick={() => deleteMutation.mutate(req.id)}
                    disabled={deleteMutation.isPending}
                    style={{ padding: "6px 12px", borderRadius: 7, border: "1px solid #e5e7eb", background: "#fff", color: "#9ca3af", fontSize: 12, cursor: "pointer" }}
                  >
                    Remover
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────────── */

export default function ConfiguracoesSistemaPage() {
  const searchStr = useSearch();
  const params = new URLSearchParams(searchStr);
  const initialTab = (params.get("tab") as TabId | null) ?? "site";
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);
  const { user } = useAuth();
  const isAdminOrSuperAdmin = user?.role === "admin" || user?.role === "superadmin";

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "site", label: "Site & Identidade", icon: <Globe style={{ width: 16, height: 16 }} /> },
    { id: "midia", label: "Mídias", icon: <ImageIcon style={{ width: 16, height: 16 }} /> },
    { id: "landingpages", label: "Landing Pages", icon: <Building2 style={{ width: 16, height: 16 }} /> },
    ...(isAdminOrSuperAdmin ? [{ id: "acesso" as TabId, label: "Controle de Acesso", icon: <Shield style={{ width: 16, height: 16 }} /> }] : []),
  ];

  return (
    <div data-testid="page-configuracoes-sistema" style={{ minHeight: "100vh", background: "#F9FAFB" }}>
      <header
        style={{
          background: "linear-gradient(135deg, #1e3a5f, #2563EB)",
          padding: "20px 24px",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Link href="/admin/dashboard">
          <button
            data-testid="button-voltar"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "none",
              borderRadius: 8,
              padding: "8px 14px",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <ArrowLeft style={{ width: 18, height: 18 }} /> Voltar
          </button>
        </Link>
        <div style={{ flex: 1 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Settings style={{ width: 28, height: 28 }} /> Configurações do Sistema
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, opacity: 0.85 }}>
            Gerencie configurações do site e mídias
          </p>
        </div>
      </header>

      <div style={{ padding: 24, maxWidth: activeTab === "landingpages" ? "100%" : 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              data-testid={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "10px 20px",
                borderRadius: 8,
                border: "1px solid",
                borderColor: activeTab === tab.id ? (tab.id === "acesso" ? "#7c3aed" : "#2563EB") : "#d1d5db",
                background: activeTab === tab.id ? (tab.id === "acesso" ? "#7c3aed" : "#2563EB") : "#fff",
                color: activeTab === tab.id ? "#fff" : tab.id === "acesso" ? "#7c3aed" : "#374151",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 28,
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}
        >
          {activeTab === "site" && <SiteSettingsTab />}
          {activeTab === "midia" && <MidiaTab />}
          {activeTab === "landingpages" && <LandingPagesTab />}
          {activeTab === "acesso" && isAdminOrSuperAdmin && <AccessControlTab />}
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
