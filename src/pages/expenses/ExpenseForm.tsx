// src/pages/expenses/ExpenseForm.tsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createExpense, getExpense, updateExpense } from '../../api/expenses';
import { listBranches } from '../../api/branches';
import type { Expense } from '../../types/expenses';
import type { Branch } from '../../types/branches';
import { toIDR } from '../../utils/money';
import { useHasRole } from '../../store/useAuth';

export default function ExpenseForm() {
  const params = useParams();
  const id = params.id ? String(params.id) : null;
  const editing = !!id;
  const nav = useNavigate();
  const canManage = useHasRole(['Superadmin', 'Admin Cabang']);
  const isSuperadmin = useHasRole(['Superadmin']);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>('');

  const [branchList, setBranchList] = useState<Branch[]>([]);
  const [branchId, setBranchId] = useState<string>('');

  const [category, setCategory] = useState<string>('');
  const [amount, setAmount] = useState<string>('0');
  const [note, setNote] = useState<string>('');
  const [existingProof, setExistingProof] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const title = editing ? 'Ubah Pengeluaran' : 'Tambah Pengeluaran';

  useEffect(() => {
    let stop = false;
    (async () => {
      setLoading(true); setErr('');
      try {
        if (isSuperadmin) {
          const b = await listBranches({ per_page: 100 });
          if (!stop) setBranchList(b.data ?? []);
        }
        if (editing && id) {
          const res = await getExpense(id);
          const row = res.data as Expense | null;
          if (row) {
            if (isSuperadmin) setBranchId(String(row.branch_id));
            setCategory(row.category);
            setAmount(String(row.amount ?? 0));
            setNote(row.note ?? '');
            setExistingProof(row.proof_path ?? null);
          }
        }
      } catch (e) {
        if (import.meta.env.DEV) console.error('[ExpenseForm] load error', e);
        setErr('Gagal memuat data');
      } finally {
        if (!stop) setLoading(false);
      }
    })();
    return () => { stop = true; };
  }, [editing, id, isSuperadmin]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canManage) return;
    try {
      setLoading(true); setErr('');
      const file = fileRef.current?.files?.[0] ?? null;
      const num = Number(amount || 0);
      if (Number.isNaN(num)) { setErr('Nominal tidak valid'); setLoading(false); return; }

      if (editing && id) {
        await updateExpense(id, { category, amount: num, note: note || null, proof: file ?? undefined });
      } else {
        const payload: { branch_id?: string; category: string; amount: number; note?: string | null; proof?: File | null } = {
          category, amount: num, note: note || null,
        };
        if (isSuperadmin) payload.branch_id = branchId || undefined;
        if (file) payload.proof = file;
        await createExpense(payload);
      }
      nav('/expenses');
    } catch (e) {
      if (import.meta.env.DEV) console.error('[ExpenseForm] submit error', e);
      setErr('Gagal menyimpan');
    } finally {
      setLoading(false);
    }
  }

  function fileUrl(path: string | null): string | null {
    if (!path) return null;
    const base = String(import.meta.env.VITE_FILES_BASE_URL || '').replace(/\/+$/, '');
    const clean = String(path).replace(/^\/+/, '');
    return `${base}/${clean}`;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
          <p className="text-xs text-gray-600">Catat pengeluaran operasional dengan bukti pendukung</p>
        </div>
      </div>

      {/* Alert error */}
      {err && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2"
        >
          {err}
        </div>
      )}

      {/* Loading info */}
      {loading && <div className="text-sm text-gray-500">Memuat…</div>}

      {/* Form Card */}
      {!loading && (
        <div className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1 max-w-2xl">
          <form onSubmit={onSubmit}>
            <div className="p-4 grid gap-3">
              {isSuperadmin && (
                <label className="grid gap-1 text-sm">
                  <span>Cabang</span>
                  <select
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    required
                    className="input py-2"
                  >
                    <option value="">-- pilih cabang --</option>
                    {branchList.map(b => <option key={b.id} value={String(b.id)}>{b.name}</option>)}
                  </select>
                </label>
              )}

              <label className="grid gap-1 text-sm">
                <span>Kategori</span>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="input py-2"
                  placeholder="Contoh: Listrik / Sewa / Operasional lain"
                />
              </label>

              <label className="grid gap-1 text-sm">
                <span>Nominal</span>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="input py-2"
                  inputMode="numeric"
                />
                <span className="text-xs text-gray-500">{toIDR(Number(amount || 0))}</span>
              </label>

              <label className="grid gap-1 text-sm">
                <span>Catatan</span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="input py-2"
                  rows={3}
                  placeholder="Opsional"
                />
              </label>

              <label className="grid gap-1 text-sm">
                <span>Bukti (foto/struk/PDF)</span>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="input py-2"
                />
                {existingProof && (
                  <a
                    href={fileUrl(existingProof) ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs underline"
                  >
                    Lihat bukti saat ini
                  </a>
                )}
              </label>
            </div>

            <div className="p-4 border-t border-[color:var(--color-border)] flex items-center gap-3">
              <button
                type="submit"
                disabled={loading || !canManage}
                className="btn-primary disabled:opacity-50"
              >
                {editing ? 'Simpan Perubahan' : 'Simpan'}
              </button>
              <button
                type="button"
                onClick={() => nav('/expenses')}
                className="btn-outline"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
