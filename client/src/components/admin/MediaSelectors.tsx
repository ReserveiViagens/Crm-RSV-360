import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import {
  MEDIA_TYPES,
  MEDIA_STATUSES,
  MEDIA_PLACEMENTS,
  type MediaType,
  type MediaStatus,
  type MediaPlacement,
} from "@shared/website-types";
import type { AdminPageResponse } from "@shared/website-types";

const inputStyle: React.CSSProperties = {
  padding: "8px 12px",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  fontSize: 13,
  outline: "none",
  background: "#fff",
  cursor: "pointer",
};

/* ─── Individual selectors ───────────────────────────────────────────────── */

interface MediaTypeSelectorProps {
  value?: MediaType | "";
  onChange: (v: MediaType | "") => void;
}

export function MediaTypeSelector({ value, onChange }: MediaTypeSelectorProps) {
  return (
    <select
      data-testid="select-media-type"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value as MediaType | "")}
      style={inputStyle}
    >
      <option value="">Todos os tipos</option>
      {MEDIA_TYPES.map((t) => (
        <option key={t} value={t}>
          {t === "image" ? "Imagem" : t === "video" ? "Vídeo" : "Documento"}
        </option>
      ))}
    </select>
  );
}

interface MediaStatusSelectorProps {
  value?: MediaStatus | "";
  onChange: (v: MediaStatus | "") => void;
}

export function MediaStatusSelector({ value, onChange }: MediaStatusSelectorProps) {
  return (
    <select
      data-testid="select-media-status"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value as MediaStatus | "")}
      style={inputStyle}
    >
      <option value="">Todos os status</option>
      {MEDIA_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s === "active" ? "Ativo" : s === "archived" ? "Arquivado" : "Órfão"}
        </option>
      ))}
    </select>
  );
}

interface MediaPlacementSelectorProps {
  value?: MediaPlacement | "";
  onChange: (v: MediaPlacement | "") => void;
}

export function MediaPlacementSelector({ value, onChange }: MediaPlacementSelectorProps) {
  return (
    <select
      data-testid="select-media-placement"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value as MediaPlacement | "")}
      style={inputStyle}
    >
      <option value="">Todos os placement</option>
      {MEDIA_PLACEMENTS.map((p) => (
        <option key={p} value={p}>
          {p.charAt(0).toUpperCase() + p.slice(1)}
        </option>
      ))}
    </select>
  );
}

interface PageRouteSelectorProps {
  pages: AdminPageResponse[];
  value?: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function PageRouteSelector({ pages, value, onChange, placeholder }: PageRouteSelectorProps) {
  return (
    <select
      data-testid="select-page-route"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      style={inputStyle}
    >
      <option value="">{placeholder ?? "Todas as páginas"}</option>
      {pages.map((p) => (
        <option key={p.id} value={p.id}>
          {p.title} ({p.slug})
        </option>
      ))}
    </select>
  );
}

/* ─── MediaFilterBar ─────────────────────────────────────────────────────── */

export interface MediaFilters {
  type?: MediaType | "";
  status?: MediaStatus | "";
  placement?: MediaPlacement | "";
  pageId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface MediaFilterBarProps {
  filters: MediaFilters;
  pages?: AdminPageResponse[];
  onChange: (filters: MediaFilters) => void;
  onReset?: () => void;
}

export function MediaFilterBar({ filters, pages = [], onChange, onReset }: MediaFilterBarProps) {
  const [expanded, setExpanded] = useState(false);

  const hasFilters = !!(
    filters.type ||
    filters.status ||
    filters.placement ||
    filters.pageId ||
    filters.search ||
    filters.dateFrom ||
    filters.dateTo
  );

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <Search
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              width: 14,
              height: 14,
              color: "#9ca3af",
              pointerEvents: "none",
            }}
          />
          <input
            data-testid="input-media-search"
            value={filters.search ?? ""}
            onChange={(e) => onChange({ ...filters, search: e.target.value || undefined })}
            placeholder="Buscar por nome..."
            style={{ ...inputStyle, paddingLeft: 32, width: "100%", boxSizing: "border-box" }}
          />
        </div>
        <MediaTypeSelector
          value={filters.type ?? ""}
          onChange={(v) => onChange({ ...filters, type: v || undefined })}
        />
        <button
          data-testid="button-toggle-media-filters"
          onClick={() => setExpanded((e) => !e)}
          style={{
            ...inputStyle,
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: expanded ? "#2563EB" : "#6b7280",
            borderColor: expanded ? "#2563EB" : "#d1d5db",
          }}
        >
          <Filter style={{ width: 14, height: 14 }} />
          Filtros {hasFilters && !expanded ? "•" : ""}
        </button>
        {hasFilters && (
          <button
            data-testid="button-reset-media-filters"
            onClick={onReset}
            style={{
              ...inputStyle,
              display: "flex",
              alignItems: "center",
              gap: 4,
              color: "#ef4444",
              borderColor: "#fca5a5",
            }}
          >
            <X style={{ width: 13, height: 13 }} /> Limpar
          </button>
        )}
      </div>

      {expanded && (
        <div
          data-testid="media-filter-expanded"
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginTop: 8,
            padding: 12,
            background: "#f9fafb",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
          }}
        >
          <MediaStatusSelector
            value={filters.status ?? ""}
            onChange={(v) => onChange({ ...filters, status: v || undefined })}
          />
          <MediaPlacementSelector
            value={filters.placement ?? ""}
            onChange={(v) => onChange({ ...filters, placement: v || undefined })}
          />
          {pages.length > 0 && (
            <PageRouteSelector
              pages={pages}
              value={filters.pageId}
              onChange={(v) => onChange({ ...filters, pageId: v || undefined })}
            />
          )}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <label style={{ fontSize: 12, color: "#6b7280" }}>De:</label>
            <input
              data-testid="input-media-date-from"
              type="date"
              value={filters.dateFrom ?? ""}
              onChange={(e) => onChange({ ...filters, dateFrom: e.target.value || undefined })}
              style={inputStyle}
            />
            <label style={{ fontSize: 12, color: "#6b7280" }}>Até:</label>
            <input
              data-testid="input-media-date-to"
              type="date"
              value={filters.dateTo ?? ""}
              onChange={(e) => onChange({ ...filters, dateTo: e.target.value || undefined })}
              style={inputStyle}
            />
          </div>
        </div>
      )}
    </div>
  );
}
