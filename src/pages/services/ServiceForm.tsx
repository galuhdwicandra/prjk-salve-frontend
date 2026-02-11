// src/pages/customers/ServiceForm.tsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Service, ServiceUpsertPayload, ServiceCategory } from '../../types/services';
import { createService, getService, updateService } from '../../api/services';
import { listServiceCategories } from '../../api/serviceCategories';
import PricePerBranchInput from './PricePerBranchInput';

const UNIT_PRESETS = ['ITEM', 'PASANG', 'KG'] as const;

export default function ServiceForm() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const editing = Boolean(id);

  const [cats, setCats] = useState<ServiceCategory[]>([]);
  const [form, setForm] = useState<ServiceUpsertPayload>({
    category_id: '',
    name: '',
    unit: 'ITEM',
    price_default: 0,
    is_active: true,
  });
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Keyboard shortcuts: Ctrl/Cmd+S submit, Esc back
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        const el = document.getElementById('btn-submit') as HTMLButtonElement | null;
        el?.click();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        nav(-1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nav]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const sc = await listServiceCategories({ per_page: 100 });
        setCats(sc.data ?? []);
        if (editing) {
          const res = await getService(id!);
          const s = res.data as Service;
          setService(s);
          setForm({
            category_id: s.category_id,
            name: s.name,
            unit: s.unit,
            price_default: Number(s.price_default),
            is_active: s.is_active,
          });
        }
      } catch {
        setError('Gagal memuat data');
      } finally {
        setLoading(false);
      }
    })();
  }, [editing, id]);

  const errorList = useMemo(() => {
    const all = Object.entries(fieldErrors).flatMap(([k, v]) => v.map((msg) => `${k}: ${msg}`));
    return all;
  }, [fieldErrors]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    if (!form.category_id || !form.name.trim() || !form.unit.trim() || Number(form.price_default) <= 0) {
      setLoading(false);
      setError('Kategori, Nama, Unit, dan Harga Default wajib diisi');
      return;
    }

    try {
      if (editing) await updateService(id!, form);
      else await createService(form);
      alert('Tersimpan');
      nav('/services', { replace: true });
    } catch (err: unknown) {
      const withResp = err as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } };
      const fe = withResp.response?.data?.errors ?? {};
      if (fe && typeof fe === 'object') setFieldErrors(fe);
      setError(withResp.response?.data?.message ?? 'Gagal menyimpan');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="space-y-1">
        <div className="text-xs text-slate-500">
          <span className="font-medium text-slate-700">Master Data</span>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-slate-600">Services</span>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-slate-600">{editing ? 'Edit' : 'New'}</span>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              {editing ? 'Edit Service' : 'New Service'}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Definisikan layanan, unit, dan harga default. Tekan <kbd className="kbd">Ctrl</kbd>/<kbd className="kbd">⌘</kbd>+<kbd className="kbd">S</kbd> untuk simpan.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => nav(-1)}
              className="
                inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
                font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100
              "
              aria-label="Kembali"
            >
              <IconArrowLeft />
              Back
            </button>
          </div>
        </div>
      </header>

      {/* Error global */}
      {error && (
        <div role="alert" aria-live="polite" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-start gap-2">
            <div className="mt-0.5 text-red-600">
              <IconAlert />
            </div>
            <div className="flex-1">
              <div className="font-semibold">{error}</div>
              {errorList.length > 0 && (
                <ul className="mt-2 list-disc space-y-1 ps-5">
                  {errorList.map((e, i) => (
                    <li key={i} className="text-red-700/90">
                      {e}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Form utama */}
      <form
        className="
          max-w-2xl rounded-xl border border-slate-200 bg-white p-5
          shadow-[0_18px_50px_-40px_rgba(0,0,0,.45)]
          space-y-5
        "
        onSubmit={onSubmit}
        aria-busy={loading ? 'true' : 'false'}
      >
        {/* Section title */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="text-sm font-semibold text-slate-900">Informasi Layanan</div>
            <div className="mt-0.5 text-xs text-slate-500">Field bertanda * wajib diisi.</div>
          </div>
          <div className="text-xs text-slate-500">{loading ? 'Memproses…' : null}</div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4">
          {/* Kategori */}
          <Field
            label="Kategori"
            required
            htmlFor="category_id"
            hint="Pilih kategori agar layanan mudah dikelompokkan."
            error={fieldErrors.category_id?.join(', ')}
          >
            <div className="relative">
              <select
                id="category_id"
                className={inputClass(Boolean(fieldErrors.category_id))}
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                disabled={loading}
                aria-required="true"
                aria-invalid={Boolean(fieldErrors.category_id)}
                aria-describedby={fieldErrors.category_id ? 'err-category_id' : undefined}
              >
                <option value="">Pilih kategori</option>
                {cats.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <IconChevronDown />
              </span>
            </div>
            {fieldErrors.category_id && (
              <p id="err-category_id" className="mt-1 text-xs text-red-600">
                {fieldErrors.category_id.join(', ')}
              </p>
            )}
          </Field>

          {/* Nama */}
          <Field
            label="Nama"
            required
            htmlFor="name"
            hint="Gunakan nama jelas, mis. “Cuci Sepatu Premium”."
            error={fieldErrors.name?.join(', ')}
          >
            <input
              id="name"
              className={inputClass(Boolean(fieldErrors.name))}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={loading}
              aria-required="true"
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? 'err-name' : undefined}
              placeholder="Contoh: Cuci Sepatu Premium"
              autoFocus
            />
            {fieldErrors.name && (
              <p id="err-name" className="mt-1 text-xs text-red-600">
                {fieldErrors.name.join(', ')}
              </p>
            )}
          </Field>

          {/* Unit */}
          <Field
            label="Unit"
            required
            htmlFor="unit"
            hint={!fieldErrors.unit ? 'Klik preset atau ketik unit kustom (otomatis UPPERCASE).' : undefined}
            error={fieldErrors.unit?.join(', ')}
          >
            <div className="flex flex-wrap gap-2">
              {UNIT_PRESETS.map((u) => {
                const active = form.unit.toUpperCase() === u;
                return (
                  <button
                    type="button"
                    key={u}
                    onClick={() => setForm({ ...form, unit: u })}
                    className={
                      active
                        ? 'rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white'
                        : 'rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100'
                    }
                    aria-pressed={active}
                    disabled={loading}
                  >
                    {u}
                  </button>
                );
              })}
            </div>

            <input
              id="unit"
              className={inputClass(Boolean(fieldErrors.unit))}
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value.toUpperCase() })}
              disabled={loading}
              aria-required="true"
              aria-invalid={Boolean(fieldErrors.unit)}
              aria-describedby={fieldErrors.unit ? 'err-unit' : 'hint-unit'}
              placeholder="ITEM / PASANG / KG"
            />

            {!fieldErrors.unit && (
              <p id="hint-unit" className="mt-1 text-xs text-slate-500">
                Pilih salah satu atau ketik unit kustom (akan otomatis UPPERCASE).
              </p>
            )}
            {fieldErrors.unit && (
              <p id="err-unit" className="mt-1 text-xs text-red-600">
                {fieldErrors.unit.join(', ')}
              </p>
            )}
          </Field>

          {/* Harga Default */}
          <Field
            label="Harga Default"
            required
            htmlFor="price_default"
            hint={!fieldErrors.price_default ? 'Gunakan kelipatan 100 agar kasir cepat input.' : undefined}
            error={fieldErrors.price_default?.join(', ')}
          >
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500 select-none">
                Rp
              </span>
              <input
                id="price_default"
                type="number"
                min={0}
                step="100"
                className={inputClass(Boolean(fieldErrors.price_default), 'pl-10')}
                value={form.price_default}
                onChange={(e) => setForm({ ...form, price_default: Number(e.target.value) })}
                disabled={loading}
                aria-required="true"
                aria-invalid={Boolean(fieldErrors.price_default)}
                aria-describedby={fieldErrors.price_default ? 'err-price_default' : 'hint-price_default'}
                placeholder="Contoh: 25000"
                inputMode="numeric"
              />
            </div>

            {!fieldErrors.price_default && (
              <p id="hint-price_default" className="mt-1 text-xs text-slate-500">
                Gunakan kelipatan 100 agar kasir cepat input.
              </p>
            )}
            {fieldErrors.price_default && (
              <p id="err-price_default" className="mt-1 text-xs text-red-600">
                {fieldErrors.price_default.join(', ')}
              </p>
            )}
          </Field>

          {/* Active switch (checkbox tetap) */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">Status</div>
              <div className="mt-0.5 text-xs text-slate-500">Jika nonaktif, layanan tidak tampil/terpakai.</div>
            </div>

            <label className="relative inline-flex cursor-pointer items-center">
              <input
                id="is_active"
                type="checkbox"
                className="peer sr-only"
                checked={!!form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                disabled={loading}
              />
              <span
                className="
                  h-6 w-11 rounded-full border border-slate-200 bg-white
                  peer-checked:bg-slate-900 peer-checked:border-slate-900
                  transition-colors
                "
              />
              <span
                className="
                  absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-slate-200
                  peer-checked:translate-x-5 peer-checked:bg-white
                  transition-transform
                "
              />
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            id="btn-submit"
            disabled={loading}
            className="
              inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white
              hover:bg-slate-800 active:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-60
            "
            aria-label="Simpan layanan"
          >
            <IconSave />
            {loading ? 'Menyimpan…' : 'Simpan'}
          </button>

          <button
            type="button"
            className="
              inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm
              font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100
            "
            onClick={() => nav(-1)}
            aria-label="Batalkan dan kembali"
            disabled={loading}
          >
            <IconX />
            Batal
          </button>
        </div>
      </form>

      {/* Harga per cabang (override) — hanya saat edit */}
      {editing && service && (
        <section className="max-w-4xl rounded-xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_-40px_rgba(0,0,0,.45)] space-y-2">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Harga per Cabang</h2>
              <p className="mt-1 text-xs text-slate-500">
                Harga efektif = override <code className="rounded bg-slate-100 px-1">service_prices</code> per cabang, jika tidak ada akan memakai{' '}
                <code className="rounded bg-slate-100 px-1">price_default</code>.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <PricePerBranchInput serviceId={service.id} defaultPrice={Number(form.price_default)} />
          </div>
        </section>
      )}

      {/* tiny styles for kbd (optional, local) */}
      <style>{`
        .kbd{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding:0 .35rem;
          height:1.35rem;
          border:1px solid rgb(226 232 240);
          border-bottom-width:2px;
          border-radius:.4rem;
          background:white;
          font-size:.75rem;
          font-weight:600;
          color:rgb(51 65 85);
          line-height:1;
        }
      `}</style>
    </div>
  );
}

/* ---------- Helpers UI (no logic change) ---------- */
function Field({
  label,
  required,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-slate-900">
        {label} {required ? <span className="text-red-600">*</span> : null}
      </label>
      {children}
      {!error && hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

function inputClass(invalid: boolean, extra: string = '') {
  return `
    w-full rounded-lg border bg-white py-2.5 px-3 text-sm text-slate-900 placeholder:text-slate-400
    focus:outline-none focus:ring-2
    ${invalid ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-slate-300 focus:ring-slate-200'}
    ${extra}
  `;
}

/* ---------- Icons (inline SVG) ---------- */
function IconChevronDown() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
function IconArrowLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M15 18l-6-6 6-6" />
      <path d="M21 12H9" />
    </svg>
  );
}
function IconSave() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M19 21H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2Z" />
      <path d="M17 21v-8H7v8" />
      <path d="M7 3v4h8" />
    </svg>
  );
}
function IconX() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}
function IconAlert() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.3 4.3h3.4L22 18.6a2 2 0 0 1-1.7 3H3.7a2 2 0 0 1-1.7-3L10.3 4.3Z" />
    </svg>
  );
}
