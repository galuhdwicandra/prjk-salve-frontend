// src/components/orders/OrderPhotosUpload.tsx
import { useMemo, useRef, useState } from "react";
import { uploadOrderPhotos } from "../../api/orderPhotos";

type Props = {
  orderId: string;
  onUploaded?: () => void;
};

type Incoming = { before: File[]; after: File[] };

function bytesToKB(n: number) {
  return Math.max(1, Math.ceil(n / 1024));
}

function ImageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M8 11a2 2 0 1 0 0-.01" />
      <path d="M21 16l-6-6-5 5-2-2-5 5" />
    </svg>
  );
}

function CameraIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l2-2h8l2 2h3a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

export default function OrderPhotosUpload({ orderId, onUploaded }: Props) {
  const [files, setFiles] = useState<Incoming>({ before: [], after: [] });
  const [busy, setBusy] = useState(false);
  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef = useRef<HTMLInputElement>(null);

  const isMobile = useMemo(() => /android|iphone|ipad|ipod/i.test(navigator.userAgent), []);

  function pick(kind: "before" | "after") {
    (kind === "before" ? beforeRef : afterRef).current?.click();
  }

  function onChange(kind: "before" | "after", list: FileList | null) {
    if (!list) return;
    const arr = Array.from(list);
    setFiles((prev) => ({ ...prev, [kind]: [...prev[kind], ...arr] }));
  }

  function onDrop(kind: "before" | "after", dropped: File[]) {
    if (!dropped.length) return;
    setFiles((prev) => ({ ...prev, [kind]: [...prev[kind], ...dropped] }));
  }

  function removeOne(kind: "before" | "after", index: number) {
    setFiles((prev) => {
      const next = [...prev[kind]];
      next.splice(index, 1);
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

  const totalCount = files.before.length + files.after.length;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <ImageIcon />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Order Photos</h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Unggah foto <span className="font-semibold text-slate-900">Before</span> dan{" "}
                <span className="font-semibold text-slate-900">After</span>.{" "}
                {isMobile ? "Kamera tersedia di perangkat Anda." : "Dukung drag-drop & pilih file."}
              </p>
            </div>
          </div>
        </div>

        <div className="hidden sm:block text-xs text-slate-500">
          Total: <span className="font-semibold text-slate-900">{totalCount}</span> file
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <UploadPanel
          title="Before"
          subtitle="PNG/JPG, ≤ 5MB"
          kind="before"
          busy={busy}
          isMobile={isMobile}
          files={files.before}
          onPick={() => pick("before")}
          onDropFiles={(arr) => onDrop("before", arr)}
          onRemove={(i) => removeOne("before", i)}
        />

        <UploadPanel
          title="After"
          subtitle="PNG/JPG, ≤ 5MB"
          kind="after"
          busy={busy}
          isMobile={isMobile}
          files={files.after}
          onPick={() => pick("after")}
          onDropFiles={(arr) => onDrop("after", arr)}
          onRemove={(i) => removeOne("after", i)}
        />
      </div>

      {/* Hidden inputs */}
      <input
        ref={beforeRef}
        type="file"
        accept="image/*"
        capture={isMobile ? "environment" : undefined}
        multiple
        className="hidden"
        onChange={(e) => onChange("before", e.target.files)}
      />
      <input
        ref={afterRef}
        type="file"
        accept="image/*"
        capture={isMobile ? "environment" : undefined}
        multiple
        className="hidden"
        onChange={(e) => onChange("after", e.target.files)}
      />

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-slate-500 sm:hidden">
          Total: <span className="font-semibold text-slate-900">{totalCount}</span> file
        </div>

        <div className="flex items-center gap-2 sm:ml-auto">
          <button
            type="button"
            className="
              inline-flex items-center justify-center rounded-lg
              bg-slate-900 px-4 py-2 text-sm font-semibold text-white
              hover:bg-slate-800 active:bg-slate-950
              disabled:cursor-not-allowed disabled:opacity-60
            "
            onClick={onUpload}
            disabled={busy || totalCount === 0}
            aria-live="polite"
          >
            {busy ? "Mengunggah..." : "Upload"}
          </button>

          <button
            type="button"
            className="
              inline-flex items-center justify-center rounded-lg
              border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900
              hover:bg-slate-50
              disabled:cursor-not-allowed disabled:opacity-60
            "
            onClick={() => setFiles({ before: [], after: [] })}
            disabled={busy || totalCount === 0}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------
   Presentational sub-components
------------------------- */

function UploadPanel(props: {
  title: string;
  subtitle: string;
  kind: "before" | "after";
  busy: boolean;
  isMobile: boolean;
  files: File[];
  onPick: () => void;
  onDropFiles: (arr: File[]) => void;
  onRemove: (index: number) => void;
}) {
  const { title, subtitle, busy, isMobile, files, onPick, onDropFiles, onRemove } = props;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <div className="text-[11px] text-slate-500">{subtitle}</div>
      </div>

      <div
        className="
          rounded-xl border border-dashed border-slate-300 bg-slate-50
          p-4 text-center
          hover:bg-slate-50/60
          transition-colors
        "
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const dropped = Array.from(e.dataTransfer.files || []);
          onDropFiles(dropped);
        }}
        aria-label={`Drop zone foto ${title.toLowerCase()}`}
      >
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 ring-1 ring-slate-200">
          {isMobile ? <CameraIcon /> : <ImageIcon />}
        </div>

        {isMobile ? (
          <>
            <div className="text-xs font-medium text-slate-700">Ambil foto dari kamera</div>
            <div className="mt-1 text-xs text-slate-500">Klik tombol untuk membuka kamera.</div>
            <button
              type="button"
              className="
                mt-3 inline-flex items-center justify-center rounded-lg
                bg-slate-900 px-3 py-2 text-xs font-semibold text-white
                hover:bg-slate-800 active:bg-slate-950
                disabled:cursor-not-allowed disabled:opacity-60
              "
              onClick={onPick}
              disabled={busy}
            >
              Buka Kamera
            </button>
          </>
        ) : (
          <>
            <div className="text-xs font-medium text-slate-700">Tarik & letakkan file</div>
            <div className="mt-1 text-xs text-slate-500">Atau pilih file dari perangkat Anda.</div>
            <button
              type="button"
              className="
                mt-3 inline-flex items-center justify-center rounded-lg
                border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900
                hover:bg-slate-50
                disabled:cursor-not-allowed disabled:opacity-60
              "
              onClick={onPick}
              disabled={busy}
            >
              Pilih File
            </button>
          </>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
          <div className="flex items-center justify-between bg-slate-50 px-3 py-2">
            <div className="text-xs font-semibold text-slate-700">
              Dipilih: <span className="text-slate-900">{files.length}</span> file
            </div>
            <div className="text-[11px] text-slate-500">Klik ✕ untuk hapus</div>
          </div>

          <ul className="divide-y divide-slate-100">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`} className="flex items-center gap-2 px-3 py-2">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-medium text-slate-900">{f.name}</div>
                  <div className="text-[11px] text-slate-500">{bytesToKB(f.size)} KB</div>
                </div>

                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  disabled={busy}
                  className="
                    inline-flex h-8 w-8 items-center justify-center rounded-md
                    text-slate-600 hover:bg-slate-100
                    disabled:cursor-not-allowed disabled:opacity-60
                  "
                  aria-label={`Hapus file ${f.name}`}
                  title="Hapus"
                >
                  <XIcon />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
