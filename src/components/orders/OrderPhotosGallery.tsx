// src/components/orders/OrderPhotosGallery.tsx
import { useMemo } from "react";
import type { OrderPhoto } from "../../types/orders";

const fileUrl = (p?: string | null) => {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;
  const filesBase = (import.meta.env.VITE_FILES_BASE_URL || "").replace(/\/+$/, "");
  // Fallback pintar: jika FILES_BASE_URL kosong, coba turunan dari API_BASE_URL (buang suffix /api/v1)
  const apiBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
  const originFallback = apiBase.replace(/\/api\/v1$/i, "");
  const base = filesBase || originFallback || "";
  return `${base}/${String(p).replace(/^\/+/, "")}`;
};

export default function OrderPhotosGallery({ photos }: { photos: OrderPhoto[] }) {
  const groups = useMemo(() => {
    const norm = (k: unknown) => String(k || "").toUpperCase();
    return {
      before: photos.filter(p => norm(p.kind) === "BEFORE"),
      after: photos.filter(p => norm(p.kind) === "AFTER"),
    };
  }, [photos]);

  if (!photos?.length) {
    return (
      <div className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1 p-4">
        <div className="text-sm font-semibold mb-1">Order Photos</div>
        <div className="text-xs text-gray-500">Belum ada foto.</div>
      </div>
    );
  }

  return (
    <div className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1 p-4 space-y-4">
      <div className="text-sm font-semibold tracking-tight">Order Photos</div>
      <Section label="Before" items={groups.before} />
      <Section label="After" items={groups.after} />
    </div>
  );
}

function resolveCreatedAt(p: OrderPhoto): string | undefined {
  // Jangan asumsikan nama field timestamp. Ambil yang ada saja.
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

function Section({ label, items }: { label: string; items: OrderPhoto[] }) {
  return (
    <div>
      <div className="text-xs font-medium text-gray-600 mb-2">{label}</div>
      {!items.length ? (
        <div className="text-xs text-gray-500">-</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {items.map(p => {
            const url = fileUrl(p.path);
            return (
              <a
                key={p.id}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                title={resolveCreatedAt(p)}
                className="group relative block overflow-hidden rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] transition-shadow hover:shadow-elev-2 focus:outline-none focus-visible:shadow-[var(--focus-ring)]"
              >
                <img
                  src={url}
                  alt={`${label} photo`}
                  loading="lazy"
                  className="w-full h-32 md:h-36 lg:h-40 object-cover transition-transform duration-150 ease-out group-hover:scale-[1.02]"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "data:image/svg+xml;utf8," +
                      encodeURIComponent(
                        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 140'><rect width='100%' height='100%' fill='#eee'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='10' fill='#999'>image not found</text></svg>"
                      );
                  }}
                />
                {/* subtle overlay on hover */}
                <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
