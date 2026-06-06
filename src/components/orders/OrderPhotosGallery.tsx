// src/components/orders/OrderPhotosGallery.tsx
import { useMemo, useState, useEffect } from "react";
import type { OrderPhoto } from "../../types/orders";

const fileUrl = (p?: string | null) => {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;

  const cleanPath = String(p).replace(/^\/+/, "");
  const filesBase = String(import.meta.env.VITE_FILES_BASE_URL || "").replace(/\/+$/, "");
  const apiBase = String(import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

  const originFallback = apiBase.replace(/\/api(?:\/v\d+)?(?:\/api\/v\d+)?$/i, "");
  const base = filesBase || originFallback;

  return base ? `${base}/${cleanPath}` : `/${cleanPath}`;
};

export default function OrderPhotosGallery({ photos }: { photos: OrderPhoto[] }) {
  const [preview, setPreview] = useState<{ url: string; label: string; ts?: string } | null>(null);

  const groups = useMemo(() => {
    const norm = (k: unknown) => String(k || "").toUpperCase();
    return {
      before: photos.filter((p) => norm(p.kind) === "BEFORE"),
      after: photos.filter((p) => norm(p.kind) === "AFTER"),
    };
  }, [photos]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreview(null);
    };
    if (preview) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview]);

  if (!photos?.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)]">
        <div className="text-sm font-semibold text-slate-900">Order Photos</div>
        <div className="mt-2 text-xs text-slate-500">Belum ada foto.</div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-900">Order Photos</div>
          <span className="text-xs text-slate-500">{photos.length} foto</span>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Section
            label="Before"
            items={groups.before}
            onPreview={(data) => setPreview(data)}
          />
          <Section
            label="After"
            items={groups.after}
            onPreview={(data) => setPreview(data)}
          />
        </div>
      </div>

      {/* Lightbox Modal */}
      {preview && (
        <div
          className="
      fixed inset-0 z-50
      flex min-h-dvh items-center justify-center
      bg-black/80 px-3 py-4
      sm:p-6
    "
          onClick={() => setPreview(null)}
        >
          <div
            className="
        relative flex h-full w-full max-w-5xl flex-col
        sm:h-auto
      "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-3 text-white">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">
                  {preview.label}
                </div>
                <div className="truncate text-xs text-white/70">
                  {preview.ts ?? "-"}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreview(null)}
                className="
            inline-flex h-10 shrink-0 items-center justify-center
            rounded-full bg-white/15 px-4 text-sm font-semibold text-white
            backdrop-blur transition hover:bg-white/25 active:scale-95
          "
                aria-label="Tutup preview foto"
              >
                ✕ Tutup
              </button>
            </div>

            <div
              className="
          flex min-h-0 flex-1 items-center justify-center
          overflow-hidden rounded-2xl bg-black shadow-2xl
          sm:max-h-[82vh]
        "
            >
              <img
                src={preview.url}
                alt={preview.label}
                className="
            h-auto max-h-[calc(100dvh-7.5rem)] w-auto max-w-full
            object-contain
            sm:max-h-[82vh]
          "
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------
   Section
------------------------- */

function resolveCreatedAt(p: OrderPhoto): string | undefined {
  const anyP = p as unknown as Record<string, unknown>;
  const raw =
    (anyP["created_at"] as string | undefined) ??
    (anyP["createdAt"] as string | undefined) ??
    (anyP["uploaded_at"] as string | undefined) ??
    (anyP["timestamp"] as string | undefined);

  if (!raw) return undefined;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? undefined : d.toLocaleString();
}

function Section({
  label,
  items,
  onPreview,
}: {
  label: string;
  items: OrderPhoto[];
  onPreview: (data: { url: string; label: string; ts?: string }) => void;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div className="text-sm font-semibold text-slate-900">{label}</div>
        <span className="text-xs text-slate-500">{items.length} foto</span>
      </div>

      {!items.length ? (
        <div className="px-4 py-6 text-center text-xs text-slate-500">-</div>
      ) : (
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {items.map((p) => {
              const url = fileUrl(p.path);
              const ts = resolveCreatedAt(p);

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() =>
                    onPreview({
                      url,
                      label: `${label} #${p.id}`,
                      ts,
                    })
                  }
                  className="group block overflow-hidden rounded-lg border border-slate-200 bg-white hover:shadow-lg transition"
                >
                  <div className="relative">
                    <img
                      src={url}
                      alt={`${label} photo`}
                      loading="lazy"
                      className="h-28 w-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "data:image/svg+xml;utf8," +
                          encodeURIComponent(
                            "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 140'><rect width='100%' height='100%' fill='#f1f5f9'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='10' fill='#64748b'>image not found</text></svg>"
                          );
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
