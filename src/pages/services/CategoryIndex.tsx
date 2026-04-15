// src/pages/services/CategoryIndex.tsx
import { useEffect, useState, useCallback, useMemo } from "react";
import type { ServiceCategory, PaginationMeta } from "../../types/services";
import {
  listServiceCategories,
  createServiceCategory,
  updateServiceCategory,
  deleteServiceCategory,
} from "../../api/serviceCategories";
import { normalizeApiError } from "../../api/client";

export default function CategoryIndex() {
  const [rows, setRows] = useState<ServiceCategory[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const perPage = 10;
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingRow, setEditingRow] = useState<ServiceCategory | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [form, setForm] = useState({
    name: "",
    is_active: true,
  });

  const isEdit = !!editingRow;

  const formTitle = useMemo(
    () => (isEdit ? "Edit Category" : "New Category"),
    [isEdit]
  );

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

  function openCreateModal() {
    setEditingRow(null);
    setForm({
      name: "",
      is_active: true,
    });
    setFormError(null);
    setFieldErrors({});
    setModalOpen(true);
  }

  function openEditModal(row: ServiceCategory) {
    setEditingRow(row);
    setForm({
      name: row.name ?? "",
      is_active: !!row.is_active,
    });
    setFormError(null);
    setFieldErrors({});
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;
    setModalOpen(false);
    setEditingRow(null);
    setFormError(null);
    setFieldErrors({});
  }

  async function handleSubmitCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSaving(true);
    setFormError(null);
    setFieldErrors({});

    const payload = {
      name: form.name.trim(),
      is_active: form.is_active,
    };

    const nextErrors: Record<string, string[]> = {};

    if (!payload.name) {
      nextErrors.name = ["Nama kategori wajib diisi."];
    } else if (payload.name.length > 120) {
      nextErrors.name = ["Nama kategori maksimal 120 karakter."];
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setFormError("Masih ada input yang belum benar.");
      setSaving(false);
      return;
    }

    try {
      if (editingRow) {
        await updateServiceCategory(editingRow.id, payload);
      } else {
        await createServiceCategory(payload);
      }

      setModalOpen(false);
      setEditingRow(null);
      setFormError(null);
      setFieldErrors({});
      await refresh(page);
    } catch (err) {
      const normalized = normalizeApiError(err);
      setFormError(normalized.message || "Gagal menyimpan kategori.");
      setFieldErrors(normalized.errors ?? {});
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCategory(row: ServiceCategory) {
    const ok = window.confirm(`Hapus kategori ${row.name}?`);
    if (!ok) return;

    try {
      await deleteServiceCategory(row.id);
      await refresh(page);
    } catch (err) {
      const normalized = normalizeApiError(err);
      setError(normalized.message || "Gagal menghapus kategori");
    }
  }

  return (
    <>
      <CategoryModal
        open={modalOpen}
        title={formTitle}
        saving={saving}
        form={form}
        formError={formError}
        fieldErrors={fieldErrors}
        onClose={closeModal}
        onSubmit={handleSubmitCategory}
        onChange={(patch) => {
          setForm((prev) => ({ ...prev, ...patch }));
          setFieldErrors((prev) => ({
            ...prev,
            ...(patch.name !== undefined ? { name: [] } : {}),
          }));
        }}
      />

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
              rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white
              hover:bg-slate-800 active:bg-slate-950
              focus:outline-none focus:ring-2 focus:ring-slate-300
            "
              onClick={openCreateModal}
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
                              inline-flex items-center gap-2 rounded-xl
                              border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700
                              hover:bg-slate-50 active:bg-slate-100
                              focus:outline-none focus:ring-2 focus:ring-slate-200
                            "
                              onClick={() => openEditModal(r)}
                              aria-label={`Ubah kategori ${r.name}`}
                            >
                              <EditIcon />
                              Edit
                            </button>

                            <button
                              className="
                              inline-flex items-center gap-2 rounded-xl
                              border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700
                              hover:bg-red-50 active:bg-red-100/60
                              focus:outline-none focus:ring-2 focus:ring-red-200
                            "
                              onClick={() => void handleDeleteCategory(r)}
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
    </>
  );
}

/* ---------- Subcomponents (UI only) ---------- */
type CategoryModalProps = {
  open: boolean;
  title: string;
  saving: boolean;
  form: {
    name: string;
    is_active: boolean;
  };
  formError: string | null;
  fieldErrors: Record<string, string[]>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (patch: Partial<{ name: string; is_active: boolean }>) => void;
};

function CategoryModal({
  open,
  title,
  saving,
  form,
  formError,
  fieldErrors,
  onClose,
  onSubmit,
  onChange,
}: CategoryModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 backdrop-blur-[1px] sm:items-center"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_28px_70px_-40px_rgba(0,0,0,.45)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            <p className="mt-1 text-xs text-slate-500">
              Kelola kategori layanan dengan tampilan modal yang lebih rapi dan konsisten.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Tutup
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="space-y-4 px-5 py-5">
            {formError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {formError}
              </div>
            ) : null}

            <div className="grid gap-1.5">
              <label htmlFor="category-name" className="text-sm font-medium text-slate-700">
                Nama kategori
              </label>
              <input
                id="category-name"
                value={form.name}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="Contoh: Cuci Reguler"
                className={[
                  "w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition",
                  fieldErrors.name?.length
                    ? "border-red-300 ring-2 ring-red-100"
                    : "border-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-100",
                ].join(" ")}
              />
              {fieldErrors.name?.length ? (
                <p className="text-xs text-red-600">{fieldErrors.name[0]}</p>
              ) : null}
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
              <label className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-slate-800">Status aktif</div>
                  <div className="text-xs text-slate-500">
                    Kategori aktif dapat digunakan saat membuat layanan.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onChange({ is_active: !form.is_active })}
                  className={[
                    "relative inline-flex h-6 w-11 items-center rounded-full transition",
                    form.is_active ? "bg-emerald-500" : "bg-slate-300",
                  ].join(" ")}
                  aria-pressed={form.is_active}
                >
                  <span
                    className={[
                      "inline-block h-5 w-5 transform rounded-full bg-white transition",
                      form.is_active ? "translate-x-5" : "translate-x-1",
                    ].join(" ")}
                  />
                </button>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

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
