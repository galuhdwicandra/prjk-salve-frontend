// src/components/orders/OrderPhotos.tsx
import { useMemo, useRef, useState } from "react";
import { uploadOrderPhotos } from "../../api/orderPhotos";

type Props = {
  orderId: string;
  onUploaded?: () => void;
};

type Incoming = { before: File[]; after: File[] };

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

  function pick(kind: "before" | "after") {
    (kind === "before" ? beforeRef : afterRef).current?.click();
  }

  function onChange(kind: "before" | "after", list: FileList | null) {
    if (!list) return;
    const arr = Array.from(list);
    setFiles(prev => ({
      ...prev,
      [kind]: [...prev[kind], ...arr],
    }));
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

  return (
    <div className="card border border-[color:var(--color-border)] rounded-2xl shadow-elev-1 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm font-semibold tracking-tight">Order Photos</div>
          <p className="text-xs text-gray-600">Foto sebelum & sesudah (opsional). Gunakan kamera belakang untuk hasil terbaik.</p>
        </div>
        {busy && (
          <span className="inline-flex items-center gap-2 text-xs text-gray-600" aria-live="polite">
            <span className="h-3 w-3 rounded-full border-2 border-black/20 border-t-black/70 animate-spin" />
            Mengunggah…
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* BEFORE */}
        <section className="card border border-[color:var(--color-border)] rounded-xl p-3">
          <header className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium">Before</div>
            <span className="text-[10px] text-gray-500">{files.before.length} file</span>
          </header>

          {/* PC: drag & drop; Mobile: tombol kamera */}
          <div
            className="group relative grid place-content-center rounded-xl border-2 border-dashed border-[color:var(--color-border)] bg-white/80 p-5 text-center text-xs hover:border-[color:var(--color-brand-primary)] transition-colors"
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault();
              const dropped = Array.from(e.dataTransfer.files || []);
              setFiles(prev => ({ ...prev, before: [...prev.before, ...dropped] }));
            }}
            role="button"
            aria-label="Area unggah foto sebelum"
          >
            {isMobile ? (
              <button
                type="button"
                className="btn-primary"
                onClick={() => pick("before")}
              >
                Buka Kamera
              </button>
            ) : (
              <>
                <div className="mb-2 text-gray-600">Tarik & letakkan file ke sini</div>
                <div className="text-gray-500">atau</div>
                <button
                  type="button"
                  className="btn-outline mt-2"
                  onClick={() => pick("before")}
                >
                  Pilih File
                </button>
              </>
            )}
          </div>

          <input
            ref={beforeRef}
            type="file"
            accept="image/*"
            capture={isMobile ? "environment" : undefined}
            multiple
            className="hidden"
            onChange={e => onChange("before", e.target.files)}
          />

          {/* Preview ringkas */}
          {files.before.length > 0 && (
            <ul className="mt-3 divide-y divide-[color:var(--color-border)] rounded-md border border-[color:var(--color-border)] bg-white/70">
              {files.before.map((f, i) => (
                <li key={i} className="flex items-center justify-between gap-2 px-3 py-2 text-xs">
                  <span className="truncate max-w-[70%]">{f.name}</span>
                  <span className="shrink-0 text-[10px] text-gray-500">{Math.ceil(f.size / 1024)} KB</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* AFTER */}
        <section className="card border border-[color:var(--color-border)] rounded-xl p-3">
          <header className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium">After</div>
            <span className="text-[10px] text-gray-500">{files.after.length} file</span>
          </header>

          <div
            className="group relative grid place-content-center rounded-xl border-2 border-dashed border-[color:var(--color-border)] bg-white/80 p-5 text-center text-xs hover:border-[color:var(--color-brand-primary)] transition-colors"
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault();
              const dropped = Array.from(e.dataTransfer.files || []);
              setFiles(prev => ({ ...prev, after: [...prev.after, ...dropped] }));
            }}
            role="button"
            aria-label="Area unggah foto sesudah"
          >
            {isMobile ? (
              <button
                type="button"
                className="btn-primary"
                onClick={() => pick("after")}
              >
                Buka Kamera
              </button>
            ) : (
              <>
                <div className="mb-2 text-gray-600">Tarik & letakkan file ke sini</div>
                <div className="text-gray-500">atau</div>
                <button
                  type="button"
                  className="btn-outline mt-2"
                  onClick={() => pick("after")}
                >
                  Pilih File
                </button>
              </>
            )}
          </div>

          <input
            ref={afterRef}
            type="file"
            accept="image/*"
            capture={isMobile ? "environment" : undefined}
            multiple
            className="hidden"
            onChange={e => onChange("after", e.target.files)}
          />

          {files.after.length > 0 && (
            <ul className="mt-3 divide-y divide-[color:var(--color-border)] rounded-md border border-[color:var(--color-border)] bg-white/70">
              {files.after.map((f, i) => (
                <li key={i} className="flex items-center justify-between gap-2 px-3 py-2 text-xs">
                  <span className="truncate max-w-[70%]">{f.name}</span>
                  <span className="shrink-0 text-[10px] text-gray-500">{Math.ceil(f.size / 1024)} KB</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="btn-primary"
          onClick={onUpload}
          disabled={busy || (files.before.length === 0 && files.after.length === 0)}
        >
          {busy ? "Mengunggah..." : "Upload"}
        </button>
        <button
          type="button"
          className="btn-outline"
          onClick={() => setFiles({ before: [], after: [] })}
          disabled={busy}
        >
          Reset
        </button>
        <span className="text-[10px] text-gray-500 ml-auto">
          Hanya gambar (*.jpg, *.png, *.heic). Kamera belakang aktif di mobile.
        </span>
      </div>
    </div>
  );
}
