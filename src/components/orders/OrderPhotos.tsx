// src/components/orders/OrderPhotos.tsx
import { useMemo, useRef, useState } from "react";
import { uploadOrderPhotos } from "../../api/orderPhotos";

type Props = {
  orderId: string;
  onUploaded?: () => void;
};

type Incoming = { before: File[]; after: File[] };

type PreviewItem = {
  file: File;
  url: string;
  name: string;
  sizeKB: number;
};

function formatKB(size: number): number {
  return Math.ceil(size / 1024);
}

function CameraIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M20 7h-3l-2-3H9L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
      <circle cx="12" cy="13" r="3.2" />
    </svg>
  );
}

function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M12 3v12" />
      <path d="M7 8l5-5 5 5" />
      <path d="M21 21H3" />
    </svg>
  );
}

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 16H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

export default function OrderPhotos({ orderId, onUploaded }: Props) {
  const [files, setFiles] = useState<Incoming>({ before: [], after: [] });
  const [busy, setBusy] = useState(false);
  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef = useRef<HTMLInputElement>(null);

  // Heuristik ringan: mobile? -> gunakan capture camera
  const isMobile = useMemo(() => {
    const ua = navigator.userAgent.toLowerCase();
    return /android|iphone|ipad|ipod/.test(ua);
  }, []);

  const previews = useMemo(() => {
    // Buat objectURL hanya untuk tampilan, dan revoke otomatis via cleanup di useMemo (React tidak punya cleanup di useMemo),
    // jadi kita buat "best effort" sederhana: URL dibuat ulang saat render; risiko leak kecil untuk jumlah file sedikit.
    // Jika Anda ingin super ketat, bisa dipindah ke useEffect cleanup, tapi itu mulai menyentuh "logika tambahan".
    const mk = (list: File[]): PreviewItem[] =>
      list.map((f) => ({
        file: f,
        url: URL.createObjectURL(f),
        name: f.name,
        sizeKB: formatKB(f.size),
      }));
    return {
      before: mk(files.before),
      after: mk(files.after),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files.before, files.after]);

  function pick(kind: "before" | "after") {
    (kind === "before" ? beforeRef : afterRef).current?.click();
  }

  function onChange(kind: "before" | "after", list: FileList | null) {
    if (!list) return;
    const arr = Array.from(list);
    setFiles((prev) => ({
      ...prev,
      [kind]: [...prev[kind], ...arr],
    }));
  }

  function onDrop(kind: "before" | "after", droppedFiles: File[]) {
    if (!droppedFiles.length) return;
    setFiles((prev) => ({
      ...prev,
      [kind]: [...prev[kind], ...droppedFiles],
    }));
  }

  function removeOne(kind: "before" | "after", idx: number) {
    setFiles((prev) => {
      const next = [...prev[kind]];
      next.splice(idx, 1);
      return { ...prev, [kind]: next };
    });
  }

  async function onUpload() {
    try {
      setBusy(true);
      await uploadOrderPhotos(orderId, files.before, files.after);
      setFiles({ before: [], after: [] });
      onUploaded?.();
    } finally {
      setBusy(false);
    }
  }

  const disableUpload = busy || (files.before.length === 0 && files.after.length === 0);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)]">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900">Order Photos</div>
          <p className="mt-1 text-xs text-slate-500">
            Foto sebelum &amp; sesudah (opsional). Gunakan kamera belakang untuk hasil terbaik.
          </p>
        </div>

        {busy && (
          <span className="inline-flex items-center gap-2 text-xs text-slate-600" aria-live="polite">
            <span className="h-3 w-3 rounded-full border-2 border-black/20 border-t-black/70 animate-spin" />
            Mengunggah…
          </span>
        )}
      </div>

      {/* Content */}
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {/* BEFORE */}
        <Panel
          title="Before"
          count={files.before.length}
          isMobile={isMobile}
          busy={busy}
          onPick={() => pick("before")}
          onDropFiles={(arr) => onDrop("before", arr)}
        >
          <input
            ref={beforeRef}
            type="file"
            accept="image/*"
            capture={isMobile ? "environment" : undefined}
            multiple
            className="hidden"
            onChange={(e) => onChange("before", e.target.files)}
          />

          <PreviewGrid
            items={previews.before}
            onRemove={(idx) => removeOne("before", idx)}
            disabled={busy}
            emptyText="Belum ada foto before."
          />
        </Panel>

        {/* AFTER */}
        <Panel
          title="After"
          count={files.after.length}
          isMobile={isMobile}
          busy={busy}
          onPick={() => pick("after")}
          onDropFiles={(arr) => onDrop("after", arr)}
        >
          <input
            ref={afterRef}
            type="file"
            accept="image/*"
            capture={isMobile ? "environment" : undefined}
            multiple
            className="hidden"
            onChange={(e) => onChange("after", e.target.files)}
          />

          <PreviewGrid
            items={previews.after}
            onRemove={(idx) => removeOne("after", idx)}
            disabled={busy}
            emptyText="Belum ada foto after."
          />
        </Panel>
      </div>

      {/* Footer actions */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <button
          type="button"
          className="
            inline-flex items-center justify-center gap-2
            rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white
            hover:bg-slate-800 active:bg-slate-950
            disabled:cursor-not-allowed disabled:opacity-70
          "
          onClick={onUpload}
          disabled={disableUpload}
        >
          <UploadIcon className="opacity-95" />
          {busy ? "Mengunggah..." : "Upload"}
        </button>

        <button
          type="button"
          className="
            inline-flex items-center justify-center gap-2
            rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900
            hover:bg-slate-50 active:bg-slate-100
            disabled:cursor-not-allowed disabled:opacity-70
          "
          onClick={() => setFiles({ before: [], after: [] })}
          disabled={busy}
        >
          <TrashIcon />
          Reset
        </button>

        <span className="sm:ml-auto text-[10px] text-slate-500">
          Hanya gambar (*.jpg, *.png, *.heic). Kamera belakang aktif di mobile.
        </span>
      </div>
    </div>
  );
}

/* ------------------------
   Sub-komponen presentasional
------------------------- */

function Panel({
  title,
  count,
  isMobile,
  busy,
  onPick,
  onDropFiles,
  children,
}: {
  title: string;
  count: number;
  isMobile: boolean;
  busy: boolean;
  onPick: () => void;
  onDropFiles: (files: File[]) => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-3">
      <header className="flex items-center justify-between">
        <div className="text-xs font-semibold text-slate-900">{title}</div>
        <span className="text-[10px] text-slate-500">{count} file</span>
      </header>

      {/* Dropzone */}
      <div
        className="
          mt-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/40
          p-4 text-center transition-colors
          hover:border-slate-300
        "
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const dropped = Array.from(e.dataTransfer.files || []);
          onDropFiles(dropped);
        }}
        role="button"
        aria-label={`Area unggah foto ${title}`}
      >
        {isMobile ? (
          <button
            type="button"
            className="
              inline-flex items-center justify-center gap-2
              rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white
              hover:bg-slate-800 active:bg-slate-950
              disabled:cursor-not-allowed disabled:opacity-70
            "
            onClick={onPick}
            disabled={busy}
          >
            <CameraIcon />
            Buka Kamera
          </button>
        ) : (
          <div className="space-y-2">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm">
              <UploadIcon />
            </div>
            <div className="text-xs font-medium text-slate-700">Tarik &amp; letakkan foto ke sini</div>
            <div className="text-xs text-slate-500">atau</div>
            <button
              type="button"
              className="
                inline-flex items-center justify-center gap-2
                rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900
                hover:bg-slate-50 active:bg-slate-100
                disabled:cursor-not-allowed disabled:opacity-70
              "
              onClick={onPick}
              disabled={busy}
            >
              Pilih File
            </button>
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function PreviewGrid({
  items,
  onRemove,
  disabled,
  emptyText,
}: {
  items: PreviewItem[];
  onRemove: (idx: number) => void;
  disabled: boolean;
  emptyText: string;
}) {
  if (!items.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-xs text-slate-500">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {items.map((it, idx) => (
        <div
          key={`${it.name}-${idx}`}
          className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white"
          title={it.name}
        >
          <div className="aspect-square w-full bg-slate-50">
            <img
              src={it.url}
              alt={it.name}
              className="h-full w-full object-cover"
              loading="lazy"
              onLoad={() => {
                // revoke setelah load agar tidak menumpuk (best effort)
                try { URL.revokeObjectURL(it.url); } catch { /* noop */ }
              }}
            />
          </div>

          <div className="p-2">
            <div className="truncate text-[11px] font-medium text-slate-900">{it.name}</div>
            <div className="mt-0.5 text-[10px] text-slate-500">{it.sizeKB} KB</div>
          </div>

          <button
            type="button"
            disabled={disabled}
            onClick={() => onRemove(idx)}
            className="
              absolute right-1.5 top-1.5
              inline-flex items-center justify-center
              rounded-md bg-white/90 p-1.5 text-slate-700 shadow-sm
              opacity-100 sm:opacity-0 sm:group-hover:opacity-100
              hover:bg-white
              disabled:cursor-not-allowed disabled:opacity-60
            "
            aria-label="Hapus foto"
            title="Hapus"
          >
            <XIcon />
          </button>
        </div>
      ))}
    </div>
  );
}
