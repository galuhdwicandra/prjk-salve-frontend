// src/pages/services/CategoryIndex.tsx
import { useEffect, useState, useCallback } from "react";
import type { ServiceCategory, PaginationMeta } from "../../types/services";
import {
  listServiceCategories,
  createServiceCategory,
  updateServiceCategory,
  deleteServiceCategory,
} from "../../api/serviceCategories";

export default function CategoryIndex() {
  const [rows, setRows] = useState<ServiceCategory[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const perPage = 10;

  const refresh = useCallback(
    async (p = 1) => {
      setLoading(true);
      setError(null);
      try {
        const res = await listServiceCategories({ q, page: p, per_page: perPage });
        setRows(res.data ?? []);
        setMeta((res.meta as PaginationMeta) ?? null);
      } catch {
        setError("Gagal memuat kategori");
      } finally {
        setLoading(false);
      }
    },
    [q, perPage],
  );

  useEffect(() => {
    void refresh(page);
  }, [page, refresh]);

  useEffect(() => {
    const t = setTimeout(() => {
      void refresh(1);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [q, refresh]);

  const total = meta?.total ?? rows.length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs text-slate-500">Services</div>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
            Service Categories
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Kelola kategori untuk mengelompokkan layanan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1">
              Total: <span className="ml-1 font-semibold text-slate-900">{total}</span>
            </span>
          </div>

          <button
            className="
              inline-flex items-center justify-center gap-2
              rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white
              hover:bg-slate-800 active:bg-slate-950
              focus:outline-none focus:ring-2 focus:ring-slate-300
            "
            onClick={async () => {
              const name = prompt("Nama kategori:")?.trim();
              if (!name) return;
              try {
                await createServiceCategory({ name, is_active: true });
                await refresh(page);
              } catch {
                alert("Gagal membuat kategori");
              }
            }}
            aria-label="Tambah kategori layanan"
          >
            <PlusIcon />
            New Category
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <section
        className="rounded-xl border border-slate-200 bg-white shadow-[0_10px_30px_-24px_rgba(0,0,0,.35)]"
        aria-label="Toolbar filter kategori"
      >
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xl">
            <label htmlFor="search-cat" className="sr-only">
              Cari kategori
            </label>
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="search-cat"
              className="
                w-full rounded-md border border-slate-200 bg-white
                pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400
                focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200
              "
              placeholder="Cari nama kategori…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Cari nama kategori"
            />
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <div className="text-xs text-slate-500">
              Menampilkan{" "}
              <span className="font-semibold text-slate-900">{rows.length}</span>{" "}
              item{meta?.total ? <> dari <span className="font-semibold text-slate-900">{meta.total}</span></> : null}
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-1">
                Ketik untuk mencari (auto)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && rows.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
          Belum ada kategori.
        </div>
      )}

      {/* Table */}
      <section aria-busy={loading ? "true" : "false"}>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_10px_30px_-24px_rgba(0,0,0,.35)]">
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="border-b border-slate-200">
                  <Th>Nama</Th>
                  <Th>Status</Th>
                  <Th className="text-right pr-4">Aksi</Th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <>
                    <RowSkeleton />
                    <RowSkeleton />
                    <RowSkeleton />
                    <RowSkeleton />
                    <RowSkeleton />
                  </>
                ) : (
                  rows.map((r, idx) => (
                    <tr
                      key={r.id}
                      className={[
                        "transition-colors",
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50/40",
                        "hover:bg-slate-100/60",
                      ].join(" ")}
                    >
                      <Td>
                        <div className="flex items-center gap-3">
                          <div className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700">
                            <TagIcon />
                          </div>
                          <div className="min-w-0">
                            <div className="line-clamp-1 font-semibold text-slate-900">
                              {r.name}
                            </div>
                            <div className="mt-0.5 text-xs text-slate-500">
                              ID: {r.id}
                            </div>
                          </div>
                        </div>
                      </Td>

                      <Td>
                        {r.is_active ? (
                          <Pill tone="success">Active</Pill>
                        ) : (
                          <Pill tone="danger">Inactive</Pill>
                        )}
                      </Td>

                      <Td className="pr-4">
                        <div className="flex justify-end gap-2">
                          <button
                            className="
                              inline-flex items-center gap-2 rounded-md
                              border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700
                              hover:bg-slate-50 active:bg-slate-100
                              focus:outline-none focus:ring-2 focus:ring-slate-200
                            "
                            onClick={async () => {
                              const name = prompt("Ubah nama kategori:", r.name)?.trim();
                              if (!name) return;
                              try {
                                await updateServiceCategory(r.id, { name });
                                await refresh(page);
                              } catch {
                                alert("Gagal update");
                              }
                            }}
                            aria-label={`Ubah kategori ${r.name}`}
                          >
                            <EditIcon />
                            Edit
                          </button>

                          <button
                            className="
                              inline-flex items-center gap-2 rounded-md
                              border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700
                              hover:bg-red-50 active:bg-red-100/60
                              focus:outline-none focus:ring-2 focus:ring-red-200
                            "
                            onClick={async () => {
                              if (!confirm(`Hapus kategori ${r.name}?`)) return;
                              try {
                                await deleteServiceCategory(r.id);
                                await refresh(page);
                              } catch {
                                alert("Gagal hapus");
                              }
                            }}
                            aria-label={`Hapus kategori ${r.name}`}
                          >
                            <TrashIcon />
                            Delete
                          </button>
                        </div>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer pagination (inside card) */}
          <div className="flex flex-col gap-3 border-t border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-slate-500">
              Hal{" "}
              <span className="font-semibold text-slate-900">
                {meta?.current_page ?? page}
              </span>{" "}
              /{" "}
              <span className="font-semibold text-slate-900">
                {meta?.last_page ?? 1}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="
                  inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white
                  px-3 py-2 text-sm font-semibold text-slate-700
                  hover:bg-slate-50 active:bg-slate-100
                  disabled:cursor-not-allowed disabled:opacity-50
                  focus:outline-none focus:ring-2 focus:ring-slate-200
                "
              >
                <ChevronLeftIcon />
                Prev
              </button>

              <button
                disabled={!!meta && page >= (meta.last_page ?? 1)}
                onClick={() => setPage((p) => p + 1)}
                className="
                  inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white
                  px-3 py-2 text-sm font-semibold text-slate-700
                  hover:bg-slate-50 active:bg-slate-100
                  disabled:cursor-not-allowed disabled:opacity-50
                  focus:outline-none focus:ring-2 focus:ring-slate-200
                "
              >
                Next
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- Subcomponents (UI only) ---------- */
function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={[
        "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500",
        className,
      ].join(" ")}
    >
      {children}
    </th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={["px-4 py-3 align-middle", className].join(" ")}>{children}</td>;
}

function RowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-slate-200" />
          <div className="space-y-2">
            <div className="h-4 w-44 rounded bg-slate-200" />
            <div className="h-3 w-24 rounded bg-slate-200" />
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="h-6 w-20 rounded-full bg-slate-200" />
      </td>
      <td className="px-4 py-4">
        <div className="ml-auto h-9 w-44 rounded bg-slate-200" />
      </td>
    </tr>
  );
}

function Pill({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "success" | "danger";
}) {
  const cls =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-red-200 bg-red-50 text-red-700";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}>
      {children}
    </span>
  );
}

/* ---------- Icons (inline, no deps) ---------- */
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 21l-4.3-4.3" />
      <circle cx="11" cy="11" r="7" />
    </svg>
  );
}
function TagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.6 13.5 12 22 2 12 10.5 3.4H20V13.5Z" />
      <circle cx="16.5" cy="7.5" r="1.2" />
    </svg>
  );
}
function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}
function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
