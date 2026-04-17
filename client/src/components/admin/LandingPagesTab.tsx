import { useState, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Eye,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Save,
  Globe,
  Loader2,
  CheckCircle,
  FileText,
  Monitor,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  AlignLeft,
  Image as ImageIcon,
  Video,
  Grid,
  Zap,
  Table,
  LayoutGrid,
  HelpCircle,
  Code,
  Minus,
  Type,
  Library,
  X,
} from "lucide-react";
import { useAdminPages, useAdminMedia } from "@/hooks/useAdminWebsite";
import { updatePage, createPage } from "@/services/adminWebsiteApi";
import type { AdminMediaResponse } from "@shared/website-types";
import type {
  CMSSection,
  CMSSectionType,
  CMSPageContent,
  CMSTheme,
  CMSSeo,
} from "@shared/website-types";
import { CMS_SECTION_TYPES, LANDING_PAGES as LANDING_PAGES_CONST } from "@shared/website-types";

type LandingPageMeta = (typeof LANDING_PAGES_CONST)[number];

function MediaPickerModal({ onSelect, onClose }: { onSelect: (url: string) => void; onClose: () => void }) {
  const { data: mediaData, isLoading } = useAdminMedia({ limit: 60 });
  const items: AdminMediaResponse[] = mediaData?.data ?? [];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: 20, width: 620, maxWidth: "95vw", maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#1e3a5f" }}>Biblioteca de Mídia</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }} data-testid="button-close-media-picker">
            <X style={{ width: 18, height: 18, color: "#6b7280" }} />
          </button>
        </div>
        {isLoading && <div style={{ textAlign: "center", padding: 32, color: "#9ca3af" }}>Carregando...</div>}
        {!isLoading && items.length === 0 && (
          <div style={{ textAlign: "center", padding: 32, color: "#9ca3af" }}>Nenhuma mídia encontrada na biblioteca.</div>
        )}
        <div style={{ flex: 1, overflow: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10 }}>
          {items.map((item) => (
            <button key={item.id} onClick={() => { onSelect(item.url); onClose(); }}
              style={{ border: "2px solid #e5e7eb", borderRadius: 8, cursor: "pointer", background: "#f9fafb", padding: 4, textAlign: "center", transition: "border-color 0.15s" }}
              data-testid={`media-picker-item-${item.id}`}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2563EB")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}>
              {item.type === "image" ? (
                <img src={item.url} alt={item.altText ?? item.filename} style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 4, display: "block" }} />
              ) : (
                <div style={{ width: "100%", height: 80, display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f4f6", borderRadius: 4 }}>
                  <Video style={{ width: 28, height: 28, color: "#6b7280" }} />
                </div>
              )}
              <p style={{ fontSize: 10, color: "#6b7280", margin: "4px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.altText ?? item.filename}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MediaUrlField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [showPicker, setShowPicker] = useState(false);
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 3 }}>{label}</label>
      <div style={{ display: "flex", gap: 6 }}>
        <input style={{ flex: 1, padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13, outline: "none", boxSizing: "border-box", background: "#fff" }}
          value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://" />
        <button onClick={() => setShowPicker(true)} title="Selecionar da biblioteca"
          style={{ padding: "0 10px", border: "1px solid #d1d5db", borderRadius: 6, background: "#f9fafb", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#374151" }}
          data-testid={`button-pick-media-${label.replace(/\s+/g, "-").toLowerCase()}`}>
          <Library style={{ width: 14, height: 14 }} />
        </button>
      </div>
      {showPicker && <MediaPickerModal onSelect={onChange} onClose={() => setShowPicker(false)} />}
    </div>
  );
}

const SECTION_LABELS: Record<CMSSectionType, string> = {
  hero: "Hero / Banner",
  text: "Texto",
  image: "Imagem",
  video: "Vídeo",
  gallery: "Galeria",
  cta: "CTA (Chamada)",
  table: "Tabela",
  cards: "Cards",
  faq: "FAQ",
  svg: "SVG",
  html: "HTML / Embed",
  divider: "Divisor",
};

const SECTION_ICONS: Record<CMSSectionType, typeof Eye> = {
  hero: Monitor,
  text: Type,
  image: ImageIcon,
  video: Video,
  gallery: Grid,
  cta: Zap,
  table: Table,
  cards: LayoutGrid,
  faq: HelpCircle,
  svg: FileText,
  html: Code,
  divider: Minus,
};

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

function makeSectionDefault(type: CMSSectionType): CMSSection {
  const defaults: Record<CMSSectionType, Record<string, unknown>> = {
    hero: { headline: "Título Principal", subheadline: "Subtítulo da seção", ctaText: "Saiba Mais", ctaUrl: "/", bgColor: "#1e3a5f", textColor: "#ffffff" },
    text: { heading: "Título da Seção", body: "Conteúdo do texto aqui...", alignment: "left", bgColor: "#ffffff", textColor: "#1f2937" },
    image: { imageUrl: "", altText: "", caption: "", link: "", width: "full" },
    video: { videoUrl: "", posterUrl: "", caption: "", autoplay: false },
    gallery: { title: "Galeria", columns: 3, items: [] },
    cta: { heading: "Título CTA", body: "Descrição do call to action.", buttonText: "Clique Aqui", buttonUrl: "/", bgColor: "#2563EB", textColor: "#ffffff", buttonColor: "#ffffff" },
    table: { title: "Tabela", headers: ["Coluna 1", "Coluna 2", "Coluna 3"], rows: [["", "", ""]] },
    cards: { title: "Cards", columns: 3, items: [{ icon: "⭐", heading: "Card 1", text: "Descrição", link: "", color: "#2563EB" }] },
    faq: { title: "Perguntas Frequentes", items: [{ question: "Pergunta?", answer: "Resposta." }] },
    svg: { rawSvg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='#2563EB'/></svg>", caption: "" },
    html: { rawHtml: "<div>Conteúdo HTML personalizado</div>" },
    divider: { color: "#e5e7eb", thickness: 1, marginTop: 32, marginBottom: 32 },
  };
  return {
    id: genId(),
    type,
    visible: true,
    order: 0,
    data: defaults[type],
  };
}

const inp: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
  background: "#fff",
};

const lbl: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "#374151",
  display: "block",
  marginBottom: 3,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={lbl}>{label}</label>
      {children}
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input type="color" value={value || "#000000"} onChange={(e) => onChange(e.target.value)}
          style={{ width: 40, height: 32, border: "1px solid #d1d5db", borderRadius: 4, cursor: "pointer", padding: 2 }} />
        <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)}
          placeholder="#000000" style={{ ...inp, flex: 1 }} />
      </div>
    </Field>
  );
}

function HeroEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (d: Record<string, unknown>) => void }) {
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });
  return (
    <>
      <Field label="Título principal">
        <input style={inp} value={String(data.headline ?? "")} onChange={(e) => set("headline", e.target.value)} />
      </Field>
      <Field label="Subtítulo">
        <input style={inp} value={String(data.subheadline ?? "")} onChange={(e) => set("subheadline", e.target.value)} />
      </Field>
      <Field label="Texto do botão CTA">
        <input style={inp} value={String(data.ctaText ?? "")} onChange={(e) => set("ctaText", e.target.value)} />
      </Field>
      <Field label="URL do botão CTA">
        <input style={inp} value={String(data.ctaUrl ?? "")} onChange={(e) => set("ctaUrl", e.target.value)} placeholder="https://" />
      </Field>
      <MediaUrlField label="URL da imagem de fundo" value={String(data.imageUrl ?? "")} onChange={(v) => set("imageUrl", v)} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <ColorField label="Cor de fundo" value={String(data.bgColor ?? "")} onChange={(v) => set("bgColor", v)} />
        <ColorField label="Cor do texto" value={String(data.textColor ?? "")} onChange={(v) => set("textColor", v)} />
      </div>
    </>
  );
}

function TextEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (d: Record<string, unknown>) => void }) {
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });
  return (
    <>
      <Field label="Título">
        <input style={inp} value={String(data.heading ?? "")} onChange={(e) => set("heading", e.target.value)} />
      </Field>
      <Field label="Corpo do texto">
        <textarea style={{ ...inp, minHeight: 120, resize: "vertical" }} value={String(data.body ?? "")} onChange={(e) => set("body", e.target.value)} />
      </Field>
      <Field label="Alinhamento">
        <select style={inp} value={String(data.alignment ?? "left")} onChange={(e) => set("alignment", e.target.value)}>
          <option value="left">Esquerda</option>
          <option value="center">Centro</option>
          <option value="right">Direita</option>
        </select>
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <ColorField label="Cor de fundo" value={String(data.bgColor ?? "")} onChange={(v) => set("bgColor", v)} />
        <ColorField label="Cor do texto" value={String(data.textColor ?? "")} onChange={(v) => set("textColor", v)} />
      </div>
    </>
  );
}

function ImageEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (d: Record<string, unknown>) => void }) {
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });
  return (
    <>
      <MediaUrlField label="URL da imagem" value={String(data.imageUrl ?? "")} onChange={(v) => set("imageUrl", v)} />
      {data.imageUrl && (
        <img src={String(data.imageUrl)} alt="preview" style={{ width: "100%", maxHeight: 120, objectFit: "cover", borderRadius: 6, marginBottom: 8 }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
      )}
      <Field label="Texto alternativo (acessibilidade)">
        <input style={inp} value={String(data.altText ?? "")} onChange={(e) => set("altText", e.target.value)} />
      </Field>
      <Field label="Legenda">
        <input style={inp} value={String(data.caption ?? "")} onChange={(e) => set("caption", e.target.value)} />
      </Field>
      <Field label="Link (opcional)">
        <input style={inp} value={String(data.link ?? "")} onChange={(e) => set("link", e.target.value)} placeholder="https://" />
      </Field>
      <Field label="Largura">
        <select style={inp} value={String(data.width ?? "full")} onChange={(e) => set("width", e.target.value)}>
          <option value="full">Tela cheia</option>
          <option value="wide">Larga</option>
          <option value="medium">Média</option>
          <option value="small">Pequena</option>
        </select>
      </Field>
    </>
  );
}

function VideoEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (d: Record<string, unknown>) => void }) {
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });
  return (
    <>
      <MediaUrlField label="URL do vídeo (MP4 ou YouTube embed)" value={String(data.videoUrl ?? "")} onChange={(v) => set("videoUrl", v)} />
      <MediaUrlField label="URL do poster (imagem de capa)" value={String(data.posterUrl ?? "")} onChange={(v) => set("posterUrl", v)} />
      <Field label="Legenda">
        <input style={inp} value={String(data.caption ?? "")} onChange={(e) => set("caption", e.target.value)} />
      </Field>
      <Field label="Reprodução automática">
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input type="checkbox" checked={Boolean(data.autoplay)} onChange={(e) => set("autoplay", e.target.checked)} />
          <span style={{ fontSize: 13 }}>Autoplay (mudo)</span>
        </label>
      </Field>
    </>
  );
}

function GalleryEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (d: Record<string, unknown>) => void }) {
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });
  const items: Array<{ url: string; alt?: string; caption?: string }> = Array.isArray(data.items) ? data.items as Array<{ url: string; alt?: string; caption?: string }> : [];
  const setItem = (i: number, k: string, v: string) => {
    const next = items.map((item, idx) => idx === i ? { ...item, [k]: v } : item);
    set("items", next);
  };
  const addItem = () => set("items", [...items, { url: "", alt: "", caption: "" }]);
  const removeItem = (i: number) => set("items", items.filter((_, idx) => idx !== i));
  return (
    <>
      <Field label="Título da galeria">
        <input style={inp} value={String(data.title ?? "")} onChange={(e) => set("title", e.target.value)} />
      </Field>
      <Field label="Colunas">
        <input type="number" min={1} max={6} style={{ ...inp, width: 80 }} value={Number(data.columns ?? 3)} onChange={(e) => set("columns", Number(e.target.value))} />
      </Field>
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={lbl}>Imagens</span>
          <button onClick={addItem} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 6, border: "1px solid #2563EB", color: "#2563EB", background: "#fff", cursor: "pointer" }}>+ Adicionar</button>
        </div>
        {items.map((item, i) => (
          <div key={i} style={{ border: "1px solid #e5e7eb", borderRadius: 6, padding: 10, marginBottom: 8, background: "#f9fafb" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>Imagem {i + 1}</span>
              <button onClick={() => removeItem(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", fontSize: 12 }}>Remover</button>
            </div>
            <MediaUrlField label="URL da imagem" value={item.url} onChange={(v) => setItem(i, "url", v)} />
            <input style={{ ...inp, marginBottom: 6 }} placeholder="Texto alt" value={item.alt ?? ""} onChange={(e) => setItem(i, "alt", e.target.value)} />
            <input style={inp} placeholder="Legenda" value={item.caption ?? ""} onChange={(e) => setItem(i, "caption", e.target.value)} />
          </div>
        ))}
      </div>
    </>
  );
}

function CtaEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (d: Record<string, unknown>) => void }) {
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });
  return (
    <>
      <Field label="Título"><input style={inp} value={String(data.heading ?? "")} onChange={(e) => set("heading", e.target.value)} /></Field>
      <Field label="Descrição"><textarea style={{ ...inp, minHeight: 80, resize: "vertical" }} value={String(data.body ?? "")} onChange={(e) => set("body", e.target.value)} /></Field>
      <Field label="Texto do botão"><input style={inp} value={String(data.buttonText ?? "")} onChange={(e) => set("buttonText", e.target.value)} /></Field>
      <Field label="URL do botão"><input style={inp} value={String(data.buttonUrl ?? "")} onChange={(e) => set("buttonUrl", e.target.value)} placeholder="https://" /></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <ColorField label="Cor de fundo" value={String(data.bgColor ?? "")} onChange={(v) => set("bgColor", v)} />
        <ColorField label="Cor do texto" value={String(data.textColor ?? "")} onChange={(v) => set("textColor", v)} />
      </div>
    </>
  );
}

function TableEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (d: Record<string, unknown>) => void }) {
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });
  const headers: string[] = Array.isArray(data.headers) ? data.headers as string[] : [];
  const rows: string[][] = Array.isArray(data.rows) ? data.rows as string[][] : [];
  const setHeader = (i: number, v: string) => { const h = [...headers]; h[i] = v; set("headers", h); };
  const setCell = (r: number, c: number, v: string) => { const ro = rows.map((row, ri) => ri === r ? row.map((cell, ci) => ci === c ? v : cell) : row); set("rows", ro); };
  const addCol = () => { set("headers", [...headers, `Coluna ${headers.length + 1}`]); set("rows", rows.map((r) => [...r, ""])); };
  const addRow = () => set("rows", [...rows, headers.map(() => "")]);
  const remRow = (i: number) => set("rows", rows.filter((_, ri) => ri !== i));
  return (
    <>
      <Field label="Título da tabela"><input style={inp} value={String(data.title ?? "")} onChange={(e) => set("title", e.target.value)} /></Field>
      <div style={{ overflowX: "auto", marginBottom: 8 }}>
        <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 12 }}>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} style={{ border: "1px solid #d1d5db", padding: 4 }}>
                  <input style={{ ...inp, minWidth: 80 }} value={h} onChange={(e) => setHeader(i, e.target.value)} />
                </th>
              ))}
              <th style={{ width: 30 }}><button onClick={addCol} style={{ fontSize: 11, padding: "2px 6px", cursor: "pointer", borderRadius: 4, border: "1px solid #d1d5db", background: "#f9fafb" }}>+col</button></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} style={{ border: "1px solid #d1d5db", padding: 4 }}>
                    <input style={{ ...inp, minWidth: 80 }} value={cell} onChange={(e) => setCell(ri, ci, e.target.value)} />
                  </td>
                ))}
                <td><button onClick={() => remRow(ri)} style={{ fontSize: 11, cursor: "pointer", border: "none", background: "none", color: "#dc2626" }}>✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={addRow} style={{ fontSize: 12, padding: "4px 12px", borderRadius: 6, border: "1px solid #2563EB", color: "#2563EB", background: "#fff", cursor: "pointer" }}>+ Adicionar linha</button>
    </>
  );
}

function CardsEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (d: Record<string, unknown>) => void }) {
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });
  const items: Array<{ icon?: string; heading?: string; text?: string; link?: string; color?: string }> =
    Array.isArray(data.items) ? data.items as Array<{ icon?: string; heading?: string; text?: string; link?: string; color?: string }> : [];
  const setItem = (i: number, k: string, v: string) => set("items", items.map((item, idx) => idx === i ? { ...item, [k]: v } : item));
  const addItem = () => set("items", [...items, { icon: "⭐", heading: "Novo Card", text: "", link: "", color: "#2563EB" }]);
  const remItem = (i: number) => set("items", items.filter((_, idx) => idx !== i));
  return (
    <>
      <Field label="Título"><input style={inp} value={String(data.title ?? "")} onChange={(e) => set("title", e.target.value)} /></Field>
      <Field label="Colunas"><input type="number" min={1} max={6} style={{ ...inp, width: 80 }} value={Number(data.columns ?? 3)} onChange={(e) => set("columns", Number(e.target.value))} /></Field>
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={lbl}>Cards</span>
          <button onClick={addItem} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 6, border: "1px solid #2563EB", color: "#2563EB", background: "#fff", cursor: "pointer" }}>+ Adicionar</button>
        </div>
        {items.map((item, i) => (
          <div key={i} style={{ border: "1px solid #e5e7eb", borderRadius: 6, padding: 10, marginBottom: 8, background: "#f9fafb" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>Card {i + 1}</span>
              <button onClick={() => remItem(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", fontSize: 12 }}>Remover</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 6, marginBottom: 6 }}>
              <input style={inp} placeholder="Ícone" value={item.icon ?? ""} onChange={(e) => setItem(i, "icon", e.target.value)} />
              <input style={inp} placeholder="Título" value={item.heading ?? ""} onChange={(e) => setItem(i, "heading", e.target.value)} />
            </div>
            <input style={{ ...inp, marginBottom: 6 }} placeholder="Descrição" value={item.text ?? ""} onChange={(e) => setItem(i, "text", e.target.value)} />
            <input style={inp} placeholder="Link (opcional)" value={item.link ?? ""} onChange={(e) => setItem(i, "link", e.target.value)} />
          </div>
        ))}
      </div>
    </>
  );
}

function FaqEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (d: Record<string, unknown>) => void }) {
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });
  const items: Array<{ question: string; answer: string }> = Array.isArray(data.items) ? data.items as Array<{ question: string; answer: string }> : [];
  const setItem = (i: number, k: string, v: string) => set("items", items.map((item, idx) => idx === i ? { ...item, [k]: v } : item));
  const addItem = () => set("items", [...items, { question: "Nova pergunta?", answer: "Resposta." }]);
  const remItem = (i: number) => set("items", items.filter((_, idx) => idx !== i));
  return (
    <>
      <Field label="Título do FAQ"><input style={inp} value={String(data.title ?? "")} onChange={(e) => set("title", e.target.value)} /></Field>
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={lbl}>Perguntas e Respostas</span>
          <button onClick={addItem} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 6, border: "1px solid #2563EB", color: "#2563EB", background: "#fff", cursor: "pointer" }}>+ Adicionar</button>
        </div>
        {items.map((item, i) => (
          <div key={i} style={{ border: "1px solid #e5e7eb", borderRadius: 6, padding: 10, marginBottom: 8, background: "#f9fafb" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>Pergunta {i + 1}</span>
              <button onClick={() => remItem(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", fontSize: 12 }}>Remover</button>
            </div>
            <input style={{ ...inp, marginBottom: 6 }} placeholder="Pergunta" value={item.question} onChange={(e) => setItem(i, "question", e.target.value)} />
            <textarea style={{ ...inp, minHeight: 70, resize: "vertical" }} placeholder="Resposta" value={item.answer} onChange={(e) => setItem(i, "answer", e.target.value)} />
          </div>
        ))}
      </div>
    </>
  );
}

function SvgEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (d: Record<string, unknown>) => void }) {
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });
  return (
    <>
      <Field label="Código SVG">
        <textarea style={{ ...inp, minHeight: 150, fontFamily: "monospace", fontSize: 12, resize: "vertical" }} value={String(data.rawSvg ?? "")} onChange={(e) => set("rawSvg", e.target.value)} />
      </Field>
      {data.rawSvg && (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 6, padding: 12, marginBottom: 8, background: "#f9fafb", textAlign: "center" }}>
          <iframe
            srcDoc={`<!DOCTYPE html><html><body style="margin:0;display:flex;align-items:center;justify-content:center;height:100%">${String(data.rawSvg)}</body></html>`}
            sandbox="allow-same-origin"
            style={{ width: "100%", height: 120, border: "none" }}
            title="SVG preview"
          />
        </div>
      )}
      <Field label="Legenda"><input style={inp} value={String(data.caption ?? "")} onChange={(e) => set("caption", e.target.value)} /></Field>
    </>
  );
}

function HtmlEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (d: Record<string, unknown>) => void }) {
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });
  return (
    <Field label="HTML / Embed personalizado">
      <textarea style={{ ...inp, minHeight: 150, fontFamily: "monospace", fontSize: 12, resize: "vertical" }} value={String(data.rawHtml ?? "")} onChange={(e) => set("rawHtml", e.target.value)} placeholder="<div>Conteúdo HTML</div>" />
    </Field>
  );
}

function DividerEditor({ data, onChange }: { data: Record<string, unknown>; onChange: (d: Record<string, unknown>) => void }) {
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });
  return (
    <>
      <ColorField label="Cor" value={String(data.color ?? "#e5e7eb")} onChange={(v) => set("color", v)} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <Field label="Espessura (px)"><input type="number" min={1} max={20} style={inp} value={Number(data.thickness ?? 1)} onChange={(e) => set("thickness", Number(e.target.value))} /></Field>
        <Field label="Margem superior (px)"><input type="number" min={0} style={inp} value={Number(data.marginTop ?? 32)} onChange={(e) => set("marginTop", Number(e.target.value))} /></Field>
        <Field label="Margem inferior (px)"><input type="number" min={0} style={inp} value={Number(data.marginBottom ?? 32)} onChange={(e) => set("marginBottom", Number(e.target.value))} /></Field>
      </div>
    </>
  );
}

function SectionDataEditor({ section, onUpdate }: { section: CMSSection; onUpdate: (s: CMSSection) => void }) {
  const updateData = (d: Record<string, unknown>) => onUpdate({ ...section, data: d });
  switch (section.type) {
    case "hero": return <HeroEditor data={section.data} onChange={updateData} />;
    case "text": return <TextEditor data={section.data} onChange={updateData} />;
    case "image": return <ImageEditor data={section.data} onChange={updateData} />;
    case "video": return <VideoEditor data={section.data} onChange={updateData} />;
    case "gallery": return <GalleryEditor data={section.data} onChange={updateData} />;
    case "cta": return <CtaEditor data={section.data} onChange={updateData} />;
    case "table": return <TableEditor data={section.data} onChange={updateData} />;
    case "cards": return <CardsEditor data={section.data} onChange={updateData} />;
    case "faq": return <FaqEditor data={section.data} onChange={updateData} />;
    case "svg": return <SvgEditor data={section.data} onChange={updateData} />;
    case "html": return <HtmlEditor data={section.data} onChange={updateData} />;
    case "divider": return <DividerEditor data={section.data} onChange={updateData} />;
    default: return null;
  }
}

function AddSectionModal({ onAdd, onClose }: { onAdd: (type: CMSSectionType) => void; onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: 24, width: 480, maxWidth: "90vw", maxHeight: "80vh", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e3a5f" }}>Adicionar Seção</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#6b7280" }}>✕</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {CMS_SECTION_TYPES.map((type) => {
            const IconComp = SECTION_ICONS[type];
            return (
              <button
                key={type}
                onClick={() => { onAdd(type); onClose(); }}
                style={{
                  padding: "12px 16px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#f9fafb",
                  cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 8,
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#2563EB"; (e.currentTarget as HTMLButtonElement).style.background = "#EFF6FF"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb"; (e.currentTarget as HTMLButtonElement).style.background = "#f9fafb"; }}
              >
                <IconComp style={{ width: 18, height: 18, color: "#2563EB", flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{SECTION_LABELS[type]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ThemeEditor({ theme, onChange }: { theme: CMSTheme; onChange: (t: CMSTheme) => void }) {
  const set = (k: keyof CMSTheme, v: string) => onChange({ ...theme, [k]: v || undefined });
  return (
    <div>
      <h4 style={{ fontSize: 14, fontWeight: 700, color: "#1e3a5f", marginBottom: 12 }}>Tema da Página</h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <ColorField label="Cor primária" value={theme.primaryColor ?? ""} onChange={(v) => set("primaryColor", v)} />
        <ColorField label="Cor secundária" value={theme.secondaryColor ?? ""} onChange={(v) => set("secondaryColor", v)} />
        <ColorField label="Fundo" value={theme.backgroundColor ?? ""} onChange={(v) => set("backgroundColor", v)} />
        <ColorField label="Texto" value={theme.textColor ?? ""} onChange={(v) => set("textColor", v)} />
        <ColorField label="Cor de destaque" value={theme.accentColor ?? ""} onChange={(v) => set("accentColor", v)} />
      </div>
    </div>
  );
}

function SeoEditor({ seo, onChange }: { seo: CMSSeo; onChange: (s: CMSSeo) => void }) {
  const set = (k: keyof CMSSeo, v: string) => onChange({ ...seo, [k]: v || undefined });
  return (
    <div>
      <h4 style={{ fontSize: 14, fontWeight: 700, color: "#1e3a5f", marginBottom: 12 }}>SEO</h4>
      <Field label="Título da aba (meta title)">
        <input style={inp} value={seo.metaTitle ?? ""} onChange={(e) => set("metaTitle", e.target.value)} placeholder="Título da página — RSV360" />
      </Field>
      <Field label="Descrição (meta description)">
        <textarea style={{ ...inp, minHeight: 70, resize: "vertical" }} value={seo.metaDescription ?? ""} onChange={(e) => set("metaDescription", e.target.value)} placeholder="Descrição curta para buscadores..." />
      </Field>
      <MediaUrlField label="URL da imagem OG (compartilhamento social)" value={seo.ogImageUrl ?? ""} onChange={(v) => set("ogImageUrl", v)} />
    </div>
  );
}

interface PageEditorProps {
  pageMeta: LandingPageMeta;
  dbPage: { id: string; status: string; content: Record<string, unknown> } | null;
  onSaved: () => void;
}

function PageEditor({ pageMeta, dbPage, onSaved }: PageEditorProps) {
  const { toast } = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [saving, setSaving] = useState(false);
  const [activePanel, setActivePanel] = useState<"sections" | "theme" | "seo">("sections");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const parseContent = useCallback((raw: Record<string, unknown>): CMSPageContent => {
    return {
      sections: Array.isArray(raw.sections) ? raw.sections as CMSSection[] : [],
      theme: (raw.theme ?? {}) as CMSTheme,
      seo: (raw.seo ?? {}) as CMSSeo,
    };
  }, []);

  const [content, setContent] = useState<CMSPageContent>(() => parseContent(dbPage?.content ?? {}));

  const sections = content.sections ?? [];
  const theme = content.theme ?? {};
  const seo = content.seo ?? {};

  const setSections = (s: CMSSection[]) => setContent((c) => ({ ...c, sections: s }));
  const setTheme = (t: CMSTheme) => setContent((c) => ({ ...c, theme: t }));
  const setSeo = (s: CMSSeo) => setContent((c) => ({ ...c, seo: s }));

  const updateSection = (updated: CMSSection) => setSections(sections.map((s) => s.id === updated.id ? updated : s));
  const removeSection = (id: string) => setSections(sections.filter((s) => s.id !== id));
  const moveUp = (idx: number) => { if (idx === 0) return; const s = [...sections]; [s[idx - 1], s[idx]] = [s[idx], s[idx - 1]]; setSections(s); };
  const moveDown = (idx: number) => { if (idx === sections.length - 1) return; const s = [...sections]; [s[idx], s[idx + 1]] = [s[idx + 1], s[idx]]; setSections(s); };
  const addSection = (type: CMSSectionType) => {
    const ns = makeSectionDefault(type);
    ns.order = sections.length;
    setSections([...sections, ns]);
    setExpandedId(ns.id);
  };

  const handleSave = async (publish: boolean) => {
    setSaving(true);
    try {
      let pageId = dbPage?.id;
      if (!pageId) {
        const created = await createPage({
          slug: pageMeta.slug,
          title: pageMeta.label,
          section: pageMeta.section as import("@shared/website-types").PageSection,
          access: "public" as const,
          content: content as unknown as Record<string, unknown>,
          status: "draft",
        });
        pageId = created.id;
      }
      await updatePage(pageId, {
        content: content as unknown as Record<string, unknown>,
        ...(publish ? { status: "published" } : { status: "draft" }),
        ...(seo.metaTitle ? { metaTitle: seo.metaTitle } : {}),
        ...(seo.metaDescription ? { metaDescription: seo.metaDescription } : {}),
      });
      toast({ title: publish ? "Página publicada!" : "Rascunho salvo!" });
      if (publish && iframeRef.current) {
        iframeRef.current.src = iframeRef.current.src;
      }
      onSaved();
    } catch (err) {
      toast({ title: "Erro ao salvar", description: (err as Error).message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const reloadPreview = () => {
    if (iframeRef.current) iframeRef.current.src = iframeRef.current.src;
  };

  if (!dbPage) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>
        <FileText style={{ width: 32, height: 32, margin: "0 auto 12px" }} />
        <p>Página ainda não registrada no CMS. Clique em "Publicar" para criar.</p>
        <button onClick={() => handleSave(true)} style={{ marginTop: 8, padding: "8px 20px", borderRadius: 8, border: "none", background: "#2563EB", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Registrar e Publicar</button>
      </div>
    );
  }

  const previewUrl = window.location.origin + pageMeta.path;

  return (
    <div style={{ display: "flex", gap: 16, height: "calc(100vh - 280px)", minHeight: 500 }}>
      <div style={{ flex: showPreview ? "0 0 38%" : "1", display: "flex", flexDirection: "column", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", background: "#fff" }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f9fafb", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {(["sections", "theme", "seo"] as const).map((panel) => (
              <button key={panel} onClick={() => setActivePanel(panel)}
                style={{ padding: "5px 12px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer",
                  background: activePanel === panel ? "#2563EB" : "transparent",
                  color: activePanel === panel ? "#fff" : "#6b7280" }}>
                {panel === "sections" ? "Seções" : panel === "theme" ? "Tema" : "SEO"}
              </button>
            ))}
          </div>
          <button onClick={() => setShowPreview(!showPreview)}
            style={{ background: "none", border: "1px solid #e5e7eb", borderRadius: 6, cursor: "pointer", padding: "4px 8px", fontSize: 12, color: "#6b7280", display: "flex", alignItems: "center", gap: 4 }}>
            {showPreview ? <><ChevronLeft style={{ width: 14, height: 14 }} /> Ocultar</>
              : <><ChevronRight style={{ width: 14, height: 14 }} /> Preview</>}
          </button>
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: 14 }}>
          {activePanel === "sections" && (
            <>
              {sections.length === 0 && (
                <div style={{ textAlign: "center", padding: 32, color: "#9ca3af" }}>
                  <AlignLeft style={{ width: 28, height: 28, margin: "0 auto 8px" }} />
                  <p style={{ fontSize: 13 }}>Nenhuma seção adicionada ainda.<br />Clique em "+ Seção" para começar.</p>
                </div>
              )}
              {sections.map((section, idx) => {
                const IconComp = SECTION_ICONS[section.type];
                const isExpanded = expandedId === section.id;
                return (
                  <div key={section.id} style={{ border: `1px solid ${isExpanded ? "#2563EB" : "#e5e7eb"}`, borderRadius: 8, marginBottom: 8, overflow: "hidden", background: "#fff" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", cursor: "pointer", background: isExpanded ? "#EFF6FF" : "#f9fafb" }}
                      onClick={() => setExpandedId(isExpanded ? null : section.id)}>
                      <IconComp style={{ width: 15, height: 15, color: "#2563EB", flexShrink: 0 }} />
                      <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#374151" }}>{SECTION_LABELS[section.type]}</span>
                      <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#6b7280", cursor: "pointer" }}
                        onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={section.visible !== false} onChange={(e) => updateSection({ ...section, visible: e.target.checked })} />
                        Visível
                      </label>
                      <button onClick={(e) => { e.stopPropagation(); moveUp(idx); }} disabled={idx === 0}
                        style={{ background: "none", border: "none", cursor: idx === 0 ? "default" : "pointer", opacity: idx === 0 ? 0.3 : 1, padding: 2 }}>
                        <ChevronUp style={{ width: 14, height: 14, color: "#6b7280" }} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); moveDown(idx); }} disabled={idx === sections.length - 1}
                        style={{ background: "none", border: "none", cursor: idx === sections.length - 1 ? "default" : "pointer", opacity: idx === sections.length - 1 ? 0.3 : 1, padding: 2 }}>
                        <ChevronDown style={{ width: 14, height: 14, color: "#6b7280" }} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); removeSection(section.id); }}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                        <Trash2 style={{ width: 14, height: 14, color: "#dc2626" }} />
                      </button>
                    </div>
                    {isExpanded && (
                      <div style={{ padding: 14, borderTop: "1px solid #e5e7eb" }}>
                        <SectionDataEditor section={section} onUpdate={updateSection} />
                      </div>
                    )}
                  </div>
                );
              })}
              <button onClick={() => setShowAddModal(true)}
                style={{ width: "100%", padding: "10px", border: "2px dashed #d1d5db", borderRadius: 8, background: "transparent", cursor: "pointer", color: "#6b7280", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 4 }}>
                <Plus style={{ width: 16, height: 16 }} /> Adicionar Seção
              </button>
            </>
          )}
          {activePanel === "theme" && <ThemeEditor theme={theme} onChange={setTheme} />}
          {activePanel === "seo" && <SeoEditor seo={seo} onChange={setSeo} />}
        </div>

        <div style={{ padding: "12px 14px", borderTop: "1px solid #e5e7eb", display: "flex", gap: 8, background: "#f9fafb", flexShrink: 0 }}>
          <button onClick={() => handleSave(false)} disabled={saving}
            style={{ flex: 1, padding: "9px 0", borderRadius: 7, border: "1px solid #d1d5db", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            {saving ? <Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} /> : <Save style={{ width: 14, height: 14 }} />}
            Salvar Rascunho
          </button>
          <button onClick={() => handleSave(true)} disabled={saving}
            style={{ flex: 1, padding: "9px 0", borderRadius: 7, border: "none", background: "linear-gradient(135deg, #1e3a5f, #2563EB)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            {saving ? <Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} /> : <Globe style={{ width: 14, height: 14 }} />}
            Publicar
          </button>
        </div>
      </div>

      {showPreview && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "8px 14px", background: "#f9fafb", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <Eye style={{ width: 14, height: 14, color: "#6b7280" }} />
            <span style={{ fontSize: 12, color: "#6b7280", flex: 1 }}>{previewUrl}</span>
            <a href={previewUrl} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "#2563EB", textDecoration: "none" }}>Abrir ↗</a>
            <button onClick={reloadPreview} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <RefreshCw style={{ width: 13, height: 13, color: "#6b7280" }} />
            </button>
          </div>
          <iframe ref={iframeRef} src={previewUrl} style={{ flex: 1, border: "none", width: "100%" }} title={`Preview — ${pageMeta.label}`} />
        </div>
      )}

      {showAddModal && <AddSectionModal onAdd={addSection} onClose={() => setShowAddModal(false)} />}
    </div>
  );
}

export function LandingPagesTab() {
  const { data: pagesData, isLoading, refetch } = useAdminPages({ limit: 100 });
  const allDbPages = pagesData?.data ?? [];
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const findDbPage = (slug: string) => allDbPages.find((p) => p.slug === slug) ?? null;

  const selectedMeta = LANDING_PAGES_CONST.find((p) => p.slug === selectedSlug);

  const statusBadge = (slug: string) => {
    const p = findDbPage(slug);
    if (!p) return { label: "Sem registro", color: "#9ca3af", bg: "#f3f4f6" };
    if (p.status === "published") return { label: "Publicada", color: "#16a34a", bg: "#dcfce7" };
    if (p.status === "draft") return { label: "Rascunho", color: "#d97706", bg: "#fef3c7" };
    return { label: p.status, color: "#6b7280", bg: "#f3f4f6" };
  };

  return (
    <div data-testid="tab-content-landingpages" style={{ display: "flex", gap: 16, height: "100%" }}>
      <div style={{ width: 200, flexShrink: 0, border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", background: "#fff" }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" }}>
          <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#1e3a5f" }}>Páginas do Site</h4>
        </div>
        <div style={{ overflow: "auto", maxHeight: "calc(100vh - 320px)" }}>
          {isLoading && (
            <div style={{ padding: 20, textAlign: "center" }}>
              <Loader2 style={{ width: 20, height: 20, animation: "spin 1s linear infinite", color: "#6b7280" }} />
            </div>
          )}
          {LANDING_PAGES_CONST.map((pageMeta) => {
            const badge = statusBadge(pageMeta.slug);
            const isActive = selectedSlug === pageMeta.slug;
            return (
              <button key={pageMeta.slug} onClick={() => setSelectedSlug(pageMeta.slug)}
                data-testid={`sidebar-page-${pageMeta.slug}`}
                style={{
                  width: "100%", textAlign: "left", padding: "10px 14px",
                  border: "none", borderBottom: "1px solid #f3f4f6",
                  background: isActive ? "#EFF6FF" : "transparent",
                  cursor: "pointer", display: "flex", flexDirection: "column", gap: 4,
                  borderLeft: isActive ? "3px solid #2563EB" : "3px solid transparent",
                }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: isActive ? "#2563EB" : "#374151" }}>{pageMeta.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {badge.label === "Publicada" ? <CheckCircle style={{ width: 10, height: 10, color: badge.color }} /> : null}
                  <span style={{ fontSize: 10, fontWeight: 600, color: badge.color, background: badge.bg, padding: "1px 6px", borderRadius: 4 }}>{badge.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ flex: 1, overflow: "hidden" }}>
        {!selectedSlug && (
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, color: "#9ca3af" }}>
            <ChevronLeft style={{ width: 32, height: 32 }} />
            <p style={{ fontSize: 14 }}>Selecione uma página na lista à esquerda para editar</p>
          </div>
        )}
        {selectedSlug && selectedMeta && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e3a5f", display: "flex", alignItems: "center", gap: 6 }}>
                <Globe style={{ width: 16, height: 16 }} /> {selectedMeta.label}
                <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 400 }}>({selectedMeta.path})</span>
              </h3>
            </div>
            <PageEditor
              key={selectedSlug}
              pageMeta={selectedMeta}
              dbPage={findDbPage(selectedSlug) as { id: string; status: string; content: Record<string, unknown> } | null}
              onSaved={refetch}
            />
          </>
        )}
      </div>
    </div>
  );
}
