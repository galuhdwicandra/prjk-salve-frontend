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
    const all = Object.entries(fieldErrors).flatMap(([k, v]) => v.map(msg => `${k}: ${msg}`));
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
    <div className="space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-lg font-semibold tracking-tight">
          {editing ? 'Edit Service' : 'New Service'}
        </h1>
        <p className="text-xs text-gray-600">
          Definisikan layanan, unit, dan harga default. Tekan <kbd>Ctrl</kbd>/<kbd>⌘</kbd>+<kbd>S</kbd> untuk simpan.
        </p>
      </header>

      {/* Error global */}
      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2"
        >
          {error}
          {errorList.length > 0 && (
            <ul className="mt-1 list-disc ms-5">
              {errorList.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          )}
        </div>
      )}

      {/* Form utama */}
      <form
        className="card max-w-xl border border-[color:var(--color-border)] rounded-lg shadow-elev-1 p-4 space-y-4"
        onSubmit={onSubmit}
        aria-busy={loading ? 'true' : 'false'}
      >
        {/* Kategori */}
        <div className="grid gap-1">
          <label htmlFor="category_id" className="text-sm font-medium">
            Kategori <span className="text-red-600">*</span>
          </label>
          <select
            id="category_id"
            className="input"
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
          {fieldErrors.category_id && (
            <p id="err-category_id" className="text-xs text-red-600">
              {fieldErrors.category_id.join(', ')}
            </p>
          )}
        </div>

        {/* Nama */}
        <div className="grid gap-1">
          <label htmlFor="name" className="text-sm font-medium">
            Nama <span className="text-red-600">*</span>
          </label>
          <input
            id="name"
            className="input"
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
            <p id="err-name" className="text-xs text-red-600">
              {fieldErrors.name.join(', ')}
            </p>
          )}
        </div>

        {/* Unit + presets */}
        <div className="grid gap-1">
          <label htmlFor="unit" className="text-sm font-medium">
            Unit <span className="text-red-600">*</span>
          </label>

          {/* Segmented presets */}
          <div className="flex flex-wrap gap-2">
            {UNIT_PRESETS.map(u => {
              const active = form.unit.toUpperCase() === u;
              return (
                <button
                  type="button"
                  key={u}
                  onClick={() => setForm({ ...form, unit: u })}
                  className={
                    active
                      ? 'chip chip--solid'
                      : 'chip chip--subtle hover:opacity-90'
                  }
                  aria-pressed={active}
                >
                  {u}
                </button>
              );
            })}
          </div>

          {/* Free text */}
          <input
            id="unit"
            className="input"
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value.toUpperCase() })}
            disabled={loading}
            aria-required="true"
            aria-invalid={Boolean(fieldErrors.unit)}
            aria-describedby={fieldErrors.unit ? 'err-unit' : 'hint-unit'}
            placeholder="ITEM / PASANG / KG"
          />
          {!fieldErrors.unit && (
            <p id="hint-unit" className="text-xs text-gray-500">
              Pilih salah satu atau ketik unit kustom (akan otomatis UPPERCASE).
            </p>
          )}
          {fieldErrors.unit && (
            <p id="err-unit" className="text-xs text-red-600">
              {fieldErrors.unit.join(', ')}
            </p>
          )}
        </div>

        {/* Harga Default (Rp prefix) */}
        <div className="grid gap-1">
          <label htmlFor="price_default" className="text-sm font-medium">
            Harga Default <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 select-none">Rp</span>
            <input
              id="price_default"
              type="number"
              min={0}
              step="100"
              className="input pl-10"
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
            <p id="hint-price_default" className="text-xs text-gray-500">
              Gunakan kelipatan 100 agar kasir cepat input.
            </p>
          )}
          {fieldErrors.price_default && (
            <p id="err-price_default" className="text-xs text-red-600">
              {fieldErrors.price_default.join(', ')}
            </p>
          )}
        </div>

        {/* Active */}
        <div className="flex items-center gap-2">
          <input
            id="is_active"
            type="checkbox"
            checked={!!form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            disabled={loading}
          />
          <label htmlFor="is_active" className="text-sm">Active</label>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            id="btn-submit"
            disabled={loading}
            className="btn-primary disabled:opacity-60"
            aria-label="Simpan layanan"
          >
            {loading ? 'Menyimpan…' : 'Simpan'}
          </button>
          <button
            type="button"
            className="btn-outline"
            onClick={() => nav(-1)}
            aria-label="Batalkan dan kembali"
          >
            Batal
          </button>
        </div>
      </form>

      {/* Harga per cabang (override) — hanya saat edit */}
      {editing && service && (
        <section className="card max-w-3xl border border-[color:var(--color-border)] rounded-lg shadow-elev-1 p-4 space-y-2">
          <h2 className="text-sm font-semibold">Harga per Cabang</h2>
          <p className="text-xs text-gray-500">
            Harga efektif = override <code>service_prices</code> per cabang, jika tidak ada akan memakai <code>price_default</code>.
          </p>
          <PricePerBranchInput serviceId={service.id} defaultPrice={Number(form.price_default)} />
        </section>
      )}
    </div>
  );
}
