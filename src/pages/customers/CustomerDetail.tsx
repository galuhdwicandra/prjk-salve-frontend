// src/pages/customers/CustomerDetail.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { createCustomer, getCustomer, updateCustomer } from "../../api/customers";
import type { Customer, CustomerUpsertPayload, SingleResponse } from "../../types/customers";
import { useAuth } from "../../store/useAuth";

function IconArrowLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function IconUser(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M20 21a8 8 0 1 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function IconCopy(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <rect x="2" y="2" width="13" height="13" rx="2" opacity=".5" />
    </svg>
  );
}
function IconSave(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
      <path d="M17 21v-8H7v8" />
      <path d="M7 3v5h8" />
    </svg>
  );
}
function initials(name?: string) {
  const n = (name ?? "").trim();
  if (!n) return "C";
  const parts = n.split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "C";
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (a + b).toUpperCase();
}

export default function CustomerDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const isNew = !params.id || params.id === "new";
  const { hasRole, user } = useAuth;

  const canEdit = hasRole("Superadmin") || hasRole("Admin Cabang") || hasRole("Kasir");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CustomerUpsertPayload>({
    name: "",
    whatsapp: "",
    address: "",
    notes: "",
  });
  const [entity, setEntity] = useState<Customer | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!isNew && params.id) {
      (async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await getCustomer(params.id!);
          if (!cancelled) {
            setEntity(res.data);
            if (res.data) {
              setForm({
                name: res.data.name,
                whatsapp: res.data.whatsapp,
                address: res.data.address ?? "",
                notes: res.data.notes ?? "",
              });
            }
          }
        } catch {
          if (!cancelled) setError("Gagal memuat detail pelanggan.");
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
    }
    return () => {
      cancelled = true;
    };
  }, [isNew, params.id]);

  function normalizeWa(input: string): string {
    const s = (input || "").trim();
    return s.replace(/[^\d]/g, "");
  }

  // buang key undefined & konversi "" => null
  function clean<T extends Record<string, unknown>>(obj: T): Partial<T> {
    const out: Partial<T> = {};
    Object.entries(obj).forEach(([k, v]) => {
      if (v === undefined) return;
      if (typeof v === "string") {
        const t = v.trim();
        (out as Record<string, unknown>)[k] = t === "" ? null : t;
      } else {
        (out as Record<string, unknown>)[k] = v;
      }
    });
    return out;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canEdit) return;
    setSaving(true);
    setError(null);
    try {
      let res: SingleResponse<Customer>;

      if (isNew) {
        const basePayload = {
          name: form.name,
          whatsapp: normalizeWa(form.whatsapp),
          address: form.address,
          notes: form.notes,
        };
        const cleanedBase = clean(basePayload);

        let finalBranchId: string | undefined;
        if (hasRole("Superadmin")) {
          finalBranchId = form.branch_id && form.branch_id.trim() !== "" ? form.branch_id.trim() : undefined;
        } else {
          finalBranchId = user?.branch_id ? String(user.branch_id) : undefined;
          if (!finalBranchId) {
            setError("Akun Anda belum terikat ke cabang. Hubungi admin pusat.");
            setSaving(false);
            return;
          }
        }

        const payloadCreate: CustomerUpsertPayload = {
          name: String(cleanedBase.name ?? ""),
          whatsapp: String(cleanedBase.whatsapp ?? ""),
          address: (cleanedBase.address as string | null | undefined) ?? null,
          notes: (cleanedBase.notes as string | null | undefined) ?? null,
          ...(finalBranchId ? { branch_id: finalBranchId } : {}),
        };
        res = await createCustomer(payloadCreate);
      } else {
        if (!params.id) {
          setError("ID pelanggan tidak valid.");
          setSaving(false);
          return;
        }
        const cleanedUpdate = clean({
          name: form.name,
          whatsapp: normalizeWa(form.whatsapp),
          address: form.address,
          notes: form.notes,
          ...(hasRole("Superadmin") && form.branch_id && String(form.branch_id).trim() !== ""
            ? { branch_id: String(form.branch_id).trim() }
            : {}),
        });
        const payloadUpdate: Partial<CustomerUpsertPayload> = {
          ...(cleanedUpdate.name !== undefined ? { name: String(cleanedUpdate.name) } : {}),
          ...(cleanedUpdate.whatsapp !== undefined ? { whatsapp: String(cleanedUpdate.whatsapp) } : {}),
          ...(cleanedUpdate.address !== undefined ? { address: cleanedUpdate.address as string | null } : {}),
          ...(cleanedUpdate.notes !== undefined ? { notes: cleanedUpdate.notes as string | null } : {}),
          ...(hasRole("Superadmin") && cleanedUpdate.branch_id !== undefined ? { branch_id: String(cleanedUpdate.branch_id) } : {}),
        };
        res = await updateCustomer(params.id, payloadUpdate);
      }

      if (res?.data?.id) {
        navigate(`/customers/${String(res.data.id)}`);
      } else {
        setError("Gagal menyimpan data pelanggan.");
      }
    } catch (err) {
      const anyErr = err as { response?: { data?: unknown }; message?: string };
      const srv = (anyErr.response?.data as { message?: string; errors?: unknown } | undefined) || undefined;
      const msg = srv?.message ?? (srv?.errors ? JSON.stringify(srv.errors) : undefined) ?? anyErr.message;
      setError(msg ?? "Gagal menyimpan data pelanggan.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-7 w-56 rounded bg-black/10 animate-pulse" />
        <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_-18px_rgba(0,0,0,.35)] space-y-4">
          <div className="h-10 w-full rounded bg-black/10 animate-pulse" />
          <div className="h-10 w-full rounded bg-black/10 animate-pulse" />
          <div className="h-10 w-full rounded bg-black/10 animate-pulse" />
          <div className="h-24 w-full rounded bg-black/10 animate-pulse" />
          <div className="flex gap-2">
            <div className="h-10 w-32 rounded bg-black/10 animate-pulse" />
            <div className="h-10 w-28 rounded bg-black/10 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const title = isNew ? "Buat Customer" : "Detail Customer";
  const subtitle = "Data identitas pelanggan untuk transaksi, penjemputan, dan histori.";

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
            <IconUser />
          </div>
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs text-slate-500">
              <Link to="/customers" className="hover:underline">
                Customers
              </Link>
              <span className="text-slate-300">/</span>
              <span className="text-slate-700">{isNew ? "New" : "Detail"}</span>
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h1>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/customers"
            className="
              inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2
              text-sm font-semibold text-slate-900 hover:bg-slate-50 active:bg-slate-100
            "
            aria-label="Kembali ke daftar pelanggan"
          >
            <IconArrowLeft />
            Back
          </Link>

          {!isNew && entity && (
            <button
              type="button"
              className="
                inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2
                text-sm font-semibold text-slate-900 hover:bg-slate-50 active:bg-slate-100
              "
              onClick={() => navigator.clipboard.writeText(entity.whatsapp)}
              aria-label="Salin nomor WhatsApp"
            >
              <IconCopy />
              Copy WA
            </button>
          )}
        </div>
      </header>

      {/* Error global */}
      {error && (
        <div role="alert" aria-live="polite" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Card + Form */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <form
          onSubmit={onSubmit}
          aria-busy={saving ? "true" : "false"}
          className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_10px_30px_-18px_rgba(0,0,0,.35)]"
        >
          {/* top strip */}
          <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="text-sm font-semibold text-slate-900">Informasi Customer</div>
              <div className="mt-1 text-xs text-slate-500">Lengkapi data agar transaksi dan pengiriman lebih cepat.</div>
            </div>

            <button
              disabled={saving || !canEdit}
              className="
                inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5
                text-sm font-semibold text-white shadow-sm
                hover:bg-slate-800 active:bg-slate-950
                disabled:cursor-not-allowed disabled:opacity-70
              "
              type="submit"
              aria-label="Simpan pelanggan"
            >
              <IconSave />
              {saving ? "Menyimpan…" : "Simpan"}
            </button>
          </div>

          {/* Cabang */}
          <div className="mt-5">
            {hasRole("Superadmin") ? (
              <label className="grid gap-1">
                <span className="text-sm font-medium text-slate-700">Branch ID (Superadmin)</span>
                <input
                  placeholder="CTH: 019aa7... (opsional)"
                  className="
                    w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm
                    text-slate-900 placeholder:text-slate-400
                    focus:border-slate-900 focus:outline-none
                  "
                  value={form.branch_id ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      branch_id: e.target.value.trim() ? e.target.value.trim() : undefined,
                    }))
                  }
                />
                <span className="text-xs text-slate-500">Kosongkan untuk tidak mengubah cabang.</span>
              </label>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
                Cabang: <span className="font-semibold text-slate-900">{user?.branch_id ?? "-"}</span>
              </div>
            )}
          </div>

          {/* Fields */}
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-700">Nama</span>
              <input
                placeholder="Nama pelanggan"
                className="
                  w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm
                  text-slate-900 placeholder:text-slate-400
                  focus:border-slate-900 focus:outline-none
                "
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                autoComplete="name"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-700">WhatsApp</span>
              <input
                placeholder="08xxxxxxxxxx"
                className="
                  w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm
                  text-slate-900 placeholder:text-slate-400
                  focus:border-slate-900 focus:outline-none
                "
                value={form.whatsapp}
                onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                required
                inputMode="tel"
                autoComplete="tel"
              />
              <span className="text-xs text-slate-500">Hanya angka. Akan dinormalisasi saat simpan.</span>
            </label>

            <label className="grid gap-1 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">Alamat</span>
              <input
                placeholder="Alamat lengkap (opsional)"
                className="
                  w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm
                  text-slate-900 placeholder:text-slate-400
                  focus:border-slate-900 focus:outline-none
                "
                value={form.address ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                autoComplete="street-address"
              />
            </label>

            <label className="grid gap-1 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">Catatan</span>
              <textarea
                placeholder="Instruksi khusus, preferensi, atau catatan lain"
                className="
                  min-h-[110px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm
                  text-slate-900 placeholder:text-slate-400
                  focus:border-slate-900 focus:outline-none
                "
                value={form.notes ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </label>
          </div>

          {/* bottom actions (secondary, for consistency) */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button
              disabled={saving || !canEdit}
              className="
                inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5
                text-sm font-semibold text-slate-900 hover:bg-slate-50 active:bg-slate-100
                disabled:cursor-not-allowed disabled:opacity-70
              "
              type="submit"
            >
              {saving ? "Menyimpan…" : "Simpan"}
            </button>

            {!isNew && entity && (
              <button
                type="button"
                className="
                  inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5
                  text-sm font-semibold text-slate-900 hover:bg-slate-50 active:bg-slate-100
                "
                onClick={() => navigator.clipboard.writeText(entity.whatsapp)}
                aria-label="Salin nomor WhatsApp"
              >
                <IconCopy />
                Salin WA
              </button>
            )}
          </div>
        </form>

        {/* Side card (ringkasan) */}
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_-18px_rgba(0,0,0,.35)]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
              {initials(form.name)}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-slate-900">{form.name?.trim() || "Customer"}</div>
              <div className="truncate text-xs text-slate-500">{isNew ? "Draft (belum tersimpan)" : `ID: ${String(entity?.id ?? "-")}`}</div>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-sm">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <div className="text-xs text-slate-500">WhatsApp</div>
              <div className="mt-0.5 font-semibold tabular-nums text-slate-900">{form.whatsapp || "-"}</div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <div className="text-xs text-slate-500">Cabang</div>
              <div className="mt-0.5 font-semibold text-slate-900">
                {hasRole("Superadmin") ? form.branch_id ?? "-" : user?.branch_id ?? "-"}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <div className="text-xs text-slate-500">Alamat</div>
              <div className="mt-0.5 text-slate-700">{form.address?.trim() ? form.address : "-"}</div>
            </div>
          </div>

          {!canEdit && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Anda tidak memiliki izin untuk mengubah data customer.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
