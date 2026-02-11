// src/components/orders/OrderPhotosGallery.tsx
import { useMemo, useState, useEffect } from "react";
import type { OrderPhoto } from "../../types/orders";

const fileUrl = (p?: string | null) => {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;
  const filesBase = (import.meta.env.VITE_FILES_BASE_URL || "").replace(/\/+$/, "");
  const apiBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
  const originFallback = apiBase.replace(/\/api\/v1$/i, "");
  const base = filesBase || originFallback || "";
  return `${base}/${String(p).replace(/^\/+/, "")}`;
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setPreview(null)}
              className="absolute -top-10 right-0 text-white text-sm font-semibold"
            >
              ✕ Close
            </button>

            <div className="rounded-xl bg-white overflow-hidden shadow-2xl">
              <img
                src={preview.url}
                alt={preview.label}
                className="w-full max-h-[80vh] object-contain bg-black"
              />
              <div className="px-4 py-3 border-t border-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  {preview.label}
                </div>
                <div className="text-xs text-slate-500">
                  {preview.ts ?? "-"}
                </div>
              </div>
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
