// src/components/orders/OrderPhotosUpload.tsx
import { useMemo, useRef, useState } from "react";
import { uploadOrderPhotos } from "../../api/orderPhotos";

type Props = {
  orderId: string;
  onUploaded?: () => void;
};

type Incoming = { before: File[]; after: File[] };

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
    setFiles(prev => ({ ...prev, [kind]: [...prev[kind], ...arr] }));
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
    <div className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1 p-4">
      <div className="mb-3">
        <h3 className="text-sm font-semibold tracking-tight">Order Photos</h3>
        <p className="text-xs text-gray-600">Unggah foto <span className="font-medium">Before</span> dan <span className="font-medium">After</span>. {isMobile ? 'Kamera tersedia di perangkat Anda.' : 'Dukung drag-drop & pilih file.'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* BEFORE */}
        <section className="border rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium">Before</div>
            <div className="text-[10px] text-gray-500">PNG/JPG, &le; 5MB</div>
          </div>

          <div
            className="border border-dashed rounded-lg p-4 text-center text-xs bg-white/50 hover:bg-black/5 transition-colors"
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault();
              const dropped = Array.from(e.dataTransfer.files || []);
              setFiles(prev => ({ ...prev, before: [...prev.before, ...dropped] }));
            }}
            aria-label="Drop zone foto before"
          >
            {isMobile ? (
              <button
                type="button"
                className="btn-primary disabled:opacity-50"
                onClick={() => pick("before")}
                disabled={busy}
              >
                Buka Kamera
              </button>
            ) : (
              <>
                <div className="mb-2 text-gray-600">Tarik & letakkan file ke sini</div>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => pick("before")}
                  disabled={busy}
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

          {files.before.length > 0 && (
            <ul className="mt-2 text-xs divide-y divide-[color:var(--color-border)] rounded-md border border-[color:var(--color-border)] bg-white/70 overflow-hidden">
              {files.before.map((f, i) => (
                <li key={i} className="px-3 py-2 flex items-center justify-between">
                  <span className="truncate">{f.name}</span>
                  <span className="text-[10px] text-gray-500 ml-2">{Math.ceil(f.size/1024)} KB</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* AFTER */}
        <section className="border rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium">After</div>
            <div className="text-[10px] text-gray-500">PNG/JPG, &le; 5MB</div>
          </div>

          <div
            className="border border-dashed rounded-lg p-4 text-center text-xs bg-white/50 hover:bg-black/5 transition-colors"
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault();
              const dropped = Array.from(e.dataTransfer.files || []);
              setFiles(prev => ({ ...prev, after: [...prev.after, ...dropped] }));
            }}
            aria-label="Drop zone foto after"
          >
            {isMobile ? (
              <button
                type="button"
                className="btn-primary disabled:opacity-50"
                onClick={() => pick("after")}
                disabled={busy}
              >
                Buka Kamera
              </button>
            ) : (
              <>
                <div className="mb-2 text-gray-600">Tarik & letakkan file ke sini</div>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => pick("after")}
                  disabled={busy}
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
            <ul className="mt-2 text-xs divide-y divide-[color:var(--color-border)] rounded-md border border-[color:var(--color-border)] bg-white/70 overflow-hidden">
              {files.after.map((f, i) => (
                <li key={i} className="px-3 py-2 flex items-center justify-between">
                  <span className="truncate">{f.name}</span>
                  <span className="text-[10px] text-gray-500 ml-2">{Math.ceil(f.size/1024)} KB</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className="btn-primary disabled:opacity-50"
          onClick={onUpload}
          disabled={busy || (files.before.length === 0 && files.after.length === 0)}
          aria-live="polite"
        >
          {busy ? "Mengunggah..." : "Upload"}
        </button>
        <button
          type="button"
          className="btn-outline disabled:opacity-50"
          onClick={() => setFiles({ before: [], after: [] })}
          disabled={busy}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
