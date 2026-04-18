import { useRef, useState } from "react";
import { RefreshCw, Unlink, Pencil, Trash2, Loader2, X, Save } from "lucide-react";
import {
  MEDIA_PLACEMENTS,
  MEDIA_STATUSES,
  type AdminMediaResponse,
  type UpdateMediaRequest,
  type MediaPlacement,
  type MediaStatus,
} from "@shared/website-types";

const btnBase: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "5px 10px",
  border: "1px solid",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
  background: "#fff",
};

/* ─── Swap file button ───────────────────────────────────────────────────── */

interface SwapButtonProps {
  mediaId: string;
  isPending: boolean;
  onSwap: (id: string, file: File) => void;
}

export function SwapButton({ mediaId, isPending, onSwap }: SwapButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <button
        data-testid={`button-swap-media-${mediaId}`}
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
        style={{ ...btnBase, borderColor: "#93c5fd", color: "#1d4ed8" }}
        title="Trocar arquivo"
      >
        {isPending ? (
          <Loader2 style={{ width: 12, height: 12, animation: "spin 1s linear infinite" }} />
        ) : (
          <RefreshCw style={{ width: 12, height: 12 }} />
        )}
        Trocar
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*,application/pdf"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onSwap(mediaId, file);
          e.target.value = "";
        }}
      />
    </>
  );
}

/* ─── Unlink button ──────────────────────────────────────────────────────── */

interface UnlinkButtonProps {
  mediaId: string;
  isPending: boolean;
  onUnlink: (id: string) => void;
}

export function UnlinkButton({ mediaId, isPending, onUnlink }: UnlinkButtonProps) {
  const handleClick = () => {
    if (window.confirm("Desvincular esta mídia da página? O arquivo permanecerá no storage.")) {
      onUnlink(mediaId);
    }
  };

  return (
    <button
      data-testid={`button-unlink-media-${mediaId}`}
      disabled={isPending}
      onClick={handleClick}
      style={{ ...btnBase, borderColor: "#fcd34d", color: "#92400e" }}
      title="Desvincular da página"
    >
      {isPending ? (
        <Loader2 style={{ width: 12, height: 12, animation: "spin 1s linear infinite" }} />
      ) : (
        <Unlink style={{ width: 12, height: 12 }} />
      )}
      Desvincular
    </button>
  );
}

/* ─── Delete button ──────────────────────────────────────────────────────── */

interface DeleteButtonProps {
  mediaId: string;
  isPending: boolean;
  onDelete: (id: string, force: boolean) => void;
}

export function DeleteButton({ mediaId, isPending, onDelete }: DeleteButtonProps) {
  const handleClick = () => {
    const confirmed = window.confirm(
      "Excluir permanentemente esta mídia do storage? Esta ação não pode ser desfeita."
    );
    if (!confirmed) return;
    const force = window.confirm(
      "Forçar exclusão mesmo se a mídia estiver vinculada a uma página?\n\nOK = forçar | Cancelar = apenas excluir se não vinculada"
    );
    onDelete(mediaId, force);
  };

  return (
    <button
      data-testid={`button-delete-media-${mediaId}`}
      disabled={isPending}
      onClick={handleClick}
      style={{ ...btnBase, borderColor: "#fca5a5", color: "#dc2626" }}
      title="Excluir do storage"
    >
      {isPending ? (
        <Loader2 style={{ width: 12, height: 12, animation: "spin 1s linear infinite" }} />
      ) : (
        <Trash2 style={{ width: 12, height: 12 }} />
      )}
      Excluir
    </button>
  );
}

/* ─── Inline metadata editor ─────────────────────────────────────────────── */

interface EditMetaFormProps {
  media: AdminMediaResponse;
  isPending: boolean;
  onSave: (id: string, body: UpdateMediaRequest, onSuccess: () => void) => void;
  onCancel: () => void;
}

function EditMetaForm({ media, isPending, onSave, onCancel }: EditMetaFormProps) {
  const [altText, setAltText] = useState(media.altText ?? "");
  const [placement, setPlacement] = useState<MediaPlacement>(media.placement);
  const [status, setStatus] = useState<MediaStatus>(media.status);

  const inputStyle: React.CSSProperties = {
    padding: "7px 10px",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    fontSize: 13,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <div
      data-testid={`form-edit-meta-${media.id}`}
      style={{
        padding: 16,
        background: "#f9fafb",
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        marginTop: 8,
      }}
    >
      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>
          Alt text
        </label>
        <input
          data-testid={`input-alt-text-${media.id}`}
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          style={inputStyle}
          placeholder="Descrição da imagem..."
        />
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>
            Placement
          </label>
          <select
            data-testid={`select-placement-${media.id}`}
            value={placement}
            onChange={(e) => setPlacement(e.target.value as MediaPlacement)}
            style={inputStyle}
          >
            {MEDIA_PLACEMENTS.map((p) => (
              <option key={p} value={p}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>
            Status
          </label>
          <select
            data-testid={`select-status-${media.id}`}
            value={status}
            onChange={(e) => setStatus(e.target.value as MediaStatus)}
            style={inputStyle}
          >
            {MEDIA_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "active" ? "Ativo" : s === "archived" ? "Arquivado" : "Órfão"}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button
          data-testid={`button-cancel-edit-${media.id}`}
          onClick={onCancel}
          style={{ ...btnBase, borderColor: "#d1d5db", color: "#6b7280" }}
        >
          <X style={{ width: 12, height: 12 }} /> Cancelar
        </button>
        <button
          data-testid={`button-save-meta-${media.id}`}
          disabled={isPending}
          onClick={() => onSave(media.id, { altText: altText || null, placement, status }, onCancel)}
          style={{ ...btnBase, borderColor: "#86efac", color: "#15803d" }}
        >
          {isPending ? (
            <Loader2 style={{ width: 12, height: 12, animation: "spin 1s linear infinite" }} />
          ) : (
            <Save style={{ width: 12, height: 12 }} />
          )}
          Salvar
        </button>
      </div>
    </div>
  );
}

/* ─── MediaActionBar ─────────────────────────────────────────────────────── */

interface MediaActionBarProps {
  media: AdminMediaResponse;
  swapPending: boolean;
  unlinkPending: boolean;
  updatePending: boolean;
  deletePending: boolean;
  onSwap: (id: string, file: File) => void;
  onUnlink: (id: string) => void;
  onUpdateMeta: (id: string, body: UpdateMediaRequest, onSuccess: () => void) => void;
  onDelete: (id: string, force: boolean) => void;
}

export function MediaActionBar({
  media,
  swapPending,
  unlinkPending,
  updatePending,
  deletePending,
  onSwap,
  onUnlink,
  onUpdateMeta,
  onDelete,
}: MediaActionBarProps) {
  const [editing, setEditing] = useState(false);

  const handleSave = (id: string, body: UpdateMediaRequest, onSuccess: () => void) => {
    onUpdateMeta(id, body, onSuccess);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
        <SwapButton mediaId={media.id} isPending={swapPending} onSwap={onSwap} />
        {media.pageId && (
          <UnlinkButton mediaId={media.id} isPending={unlinkPending} onUnlink={onUnlink} />
        )}
        <button
          data-testid={`button-edit-meta-${media.id}`}
          onClick={() => setEditing((e) => !e)}
          style={{
            ...btnBase,
            borderColor: editing ? "#a78bfa" : "#c4b5fd",
            color: "#7c3aed",
          }}
          title="Editar metadados"
        >
          <Pencil style={{ width: 12, height: 12 }} />
          Editar
        </button>
        <DeleteButton mediaId={media.id} isPending={deletePending} onDelete={onDelete} />
      </div>
      {editing && (
        <EditMetaForm
          media={media}
          isPending={updatePending}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
        />
      )}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ─── LogoUploadButton — upload real via /media/upload ───────────────────── */

interface LogoUploadButtonProps {
  currentUrl?: string | null;
  isPending: boolean;
  onUpload: (file: File) => void;
  label?: string;
}

export function LogoUploadButton({ currentUrl, isPending, onUpload, label = "Selecionar arquivo" }: LogoUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {currentUrl && (
        <img
          src={currentUrl}
          alt="Logo atual"
          data-testid="img-current-logo"
          style={{ maxHeight: 64, maxWidth: 180, objectFit: "contain", borderRadius: 6, border: "1px solid #e5e7eb" }}
        />
      )}
      <button
        data-testid="button-upload-logo"
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
        style={{ ...btnBase, borderColor: "#93c5fd", color: "#1d4ed8", padding: "8px 14px" }}
      >
        {isPending ? (
          <Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} />
        ) : (
          <RefreshCw style={{ width: 14, height: 14 }} />
        )}
        {label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
          e.target.value = "";
        }}
      />
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
