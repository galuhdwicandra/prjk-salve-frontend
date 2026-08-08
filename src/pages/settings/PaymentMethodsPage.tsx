import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../../api/client';
import {
  createPaymentMethod,
  deletePaymentMethod,
  listPaymentMethods,
  updatePaymentMethod,
} from '../../api/paymentMethods';
import type { PaymentMethodMaster, PaymentMethodUpsertPayload } from '../../types/payments';

const EMPTY_FORM: PaymentMethodUpsertPayload = {
  code: '',
  name: '',
  is_active: true,
  sort_order: 0,
};

export default function PaymentMethodsPage() {
  const [rows, setRows] = useState<PaymentMethodMaster[]>([]);
  const [form, setForm] = useState<PaymentMethodUpsertPayload>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listPaymentMethods();
      setRows(res.data ?? []);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat metode pembayaran'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRows();
  }, [fetchRows]);

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function startEdit(row: PaymentMethodMaster) {
    setEditingId(row.id);
    setForm({
      code: row.code,
      name: row.name,
      is_active: row.is_active,
      sort_order: row.sort_order,
    });
  }

  async function onSubmit() {
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        await updatePaymentMethod(editingId, {
          name: form.name,
          is_active: form.is_active,
          sort_order: form.sort_order,
        });
      } else {
        await createPaymentMethod(form);
      }
      resetForm();
      await fetchRows();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menyimpan metode pembayaran'));
    } finally {
      setSaving(false);
    }
  }

  async function onToggleActive(row: PaymentMethodMaster) {
    setError(null);
    try {
      await updatePaymentMethod(row.id, { is_active: !row.is_active });
      await fetchRows();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal mengubah status metode pembayaran'));
    }
  }

  async function onDelete(row: PaymentMethodMaster) {
    if (!confirm(`Hapus metode pembayaran ${row.name}?`)) return;
    setError(null);
    try {
      await deletePaymentMethod(row.id);
      if (editingId === row.id) resetForm();
      await fetchRows();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menghapus metode pembayaran'));
    }
  }

  const canSubmit = form.code.trim() !== '' && form.name.trim() !== '' && !saving;

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-lg font-semibold tracking-tight">Master Metode Pembayaran</h1>
        <p className="text-xs text-gray-500">
          Metode yang aktif akan muncul sebagai pilihan pembayaran di POS.
        </p>
      </header>

      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2"
        >
          {error}
        </div>
      )}

      <section className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
        <div className="p-3 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto_auto_auto]">
          <div>
            <label className="block text-xs font-medium mb-1" htmlFor="pm-code">Kode</label>
            <input
              id="pm-code"
              className="input w-full py-2 uppercase disabled:opacity-60"
              placeholder="EDC"
              value={form.code}
              disabled={editingId !== null}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" htmlFor="pm-name">Nama</label>
            <input
              id="pm-name"
              className="input w-full py-2"
              placeholder="Kartu Debit"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" htmlFor="pm-sort">Urutan</label>
            <input
              id="pm-sort"
              type="number"
              min={0}
              className="input w-24 py-2"
              value={form.sort_order ?? 0}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value || 0) })}
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm pb-2">
              <input
                type="checkbox"
                checked={form.is_active ?? true}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              />
              Aktif
            </label>
          </div>

          <div className="flex items-end gap-2">
            <button
              type="button"
              className="btn-primary disabled:opacity-60"
              disabled={!canSubmit}
              onClick={() => void onSubmit()}
            >
              {saving ? 'Menyimpan…' : editingId ? 'Simpan' : 'Tambah'}
            </button>
            {editingId && (
              <button type="button" className="btn-outline" onClick={resetForm} disabled={saving}>
                Batal
              </button>
            )}
          </div>
        </div>
      </section>

      {!loading && rows.length === 0 && (
        <div className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1 p-6 text-sm text-gray-500">
          Belum ada metode pembayaran.
        </div>
      )}

      <section aria-busy={loading ? 'true' : 'false'}>
        <div className="card overflow-hidden border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#E6EDFF] sticky top-0 z-10">
                <tr className="divide-x divide-[color:var(--color-border)]">
                  <Th>Kode</Th>
                  <Th>Nama</Th>
                  <Th>Urutan</Th>
                  <Th>Status</Th>
                  <Th className="text-right pr-4">Aksi</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color:var(--color-border)]">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-black/5 transition-colors">
                    <Td><span className="font-medium">{row.code}</span></Td>
                    <Td>{row.name}</Td>
                    <Td>{row.sort_order}</Td>
                    <Td>
                      <span className={row.is_active ? 'text-green-700' : 'text-gray-500'}>
                        {row.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </Td>
                    <Td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="btn-outline px-2 py-1 text-xs"
                          onClick={() => void onToggleActive(row)}
                          aria-label={`Ubah status ${row.name}`}
                        >
                          {row.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                        <button
                          className="btn-outline px-2 py-1 text-xs"
                          onClick={() => startEdit(row)}
                          aria-label={`Edit ${row.name}`}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-outline px-2 py-1 text-xs text-red-600"
                          onClick={() => void onDelete(row)}
                          aria-label={`Hapus ${row.name}`}
                        >
                          Hapus
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`text-left px-3 py-2 text-xs font-medium uppercase tracking-wide ${className}`}>
      {children}
    </th>
  );
}

function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2 ${className}`}>{children}</td>;
}
