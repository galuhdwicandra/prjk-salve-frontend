import { useCallback, useEffect, useMemo, useState } from 'react';
import { previewDocumentNumbers, saveDocumentNumber } from '../../api/invoiceCounters';
import { listBranches } from '../../api/branches';
import { getErrorMessage } from '../../api/client';
import { useAuth } from '../../store/useAuth';
import type { Branch, CounterResetPolicy, DocumentNumber } from '../../types/branches';

const TOKENS: { token: string; label: string }[] = [
  { token: '[YY]', label: 'Tahun 2 digit' },
  { token: '[YYYY]', label: 'Tahun 4 digit' },
  { token: '[MM]', label: 'Bulan' },
  { token: '[DD]', label: 'Tanggal' },
  { token: '[OUTLET]', label: 'Kode outlet aktif' },
  { token: '[NUMBER]', label: 'Nomor urut (0001)' },
  { token: '[NUMBER:6]', label: 'Nomor urut 6 digit' },
];

const RESET_LABELS: Record<CounterResetPolicy, string> = {
  never: 'Tidak pernah reset',
  monthly: 'Setiap bulan',
  yearly: 'Setiap tahun',
};

type EditState = {
  doc: DocumentNumber;
  format: string;
  seq: number;
  reset_policy: CounterResetPolicy;
};

export default function DocumentNumberingPage() {
  const me = useAuth.user;
  const isSuperadmin = useMemo(() => (me?.branches.length ?? 0) > 1, [me?.branches]);
  const branchIdFromAuth = me?.branch_id != null ? String(me.branch_id) : null;

  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchId, setBranchId] = useState<string | null>(branchIdFromAuth);
  const [docs, setDocs] = useState<DocumentNumber[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [edit, setEdit] = useState<EditState | null>(null);

  useEffect(() => {
    if (!isSuperadmin) return;
    void (async () => {
      try {
        const res = await listBranches({ per_page: 100 });
        const list = res.data ?? [];
        setBranches(list);
        setBranchId((current) => current ?? list[0]?.id ?? null);
      } catch (err) {
        setError(getErrorMessage(err, 'Gagal memuat daftar outlet'));
      }
    })();
  }, [isSuperadmin]);

  const refresh = useCallback(async () => {
    if (!branchId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await previewDocumentNumbers(branchId);
      setDocs(res.data ?? []);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat penomoran otomatis'));
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => { void refresh(); }, [refresh]);

  const groups = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = term ? docs.filter((d) => d.label.toLowerCase().includes(term)) : docs;
    const map = new Map<string, DocumentNumber[]>();
    filtered.forEach((doc) => {
      const items = map.get(doc.group) ?? [];
      items.push(doc);
      map.set(doc.group, items);
    });
    return Array.from(map.entries());
  }, [docs, search]);

  async function onSave() {
    if (!edit || !branchId) return;
    if (!/\[NUMBER(:\d+)?\]/.test(edit.format)) {
      setError('Format wajib memuat [NUMBER]');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await saveDocumentNumber(edit.doc.id, {
        branch_id: branchId,
        doc_key: edit.doc.key,
        format: edit.format.trim(),
        reset_policy: edit.reset_policy,
        seq: edit.seq,
      });
      setEdit(null);
      await refresh();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menyimpan format'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 max-w-4xl">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Penomoran Otomatis</h1>
          <p className="text-xs text-gray-600">Format nomor dokumen · klik kartu untuk mengubah</p>
        </div>
        <div className="flex items-center gap-2">
          {isSuperadmin && (
            <select
              className="input text-sm"
              value={branchId ?? ''}
              onChange={(e) => setBranchId(e.target.value || null)}
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.code} — {b.name}</option>
              ))}
            </select>
          )}
          <input
            className="input text-sm"
            type="search"
            value={search}
            placeholder="cari dokumen"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {error && (
        <div role="alert" aria-live="polite" className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
          {error}
        </div>
      )}

      {!branchId && !loading && (
        <div className="text-sm text-gray-500">Pilih outlet terlebih dahulu.</div>
      )}

      {loading && <div className="text-sm text-gray-500">Memuat…</div>}

      {!loading && branchId && groups.length === 0 && (
        <div className="text-sm text-gray-500">Tidak ada dokumen cocok.</div>
      )}

      {groups.map(([group, items]) => (
        <section key={group} className="space-y-2">
          <h2 className="font-medium">{group}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {items.map((doc) => (
              <button
                key={doc.key}
                type="button"
                className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1 p-3 text-left hover:bg-black/5 transition-colors"
                onClick={() => setEdit({
                  doc,
                  format: doc.format,
                  seq: doc.seq,
                  reset_policy: doc.reset_policy,
                })}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{doc.label}</span>
                  <span className="text-[10px] uppercase tracking-wide text-gray-500">
                    {doc.status === 'aktif' ? 'Aktif' : 'Rencana'}
                  </span>
                </div>
                <div className="font-mono text-base mt-1">{doc.next}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {doc.format} · {RESET_LABELS[doc.reset_policy]}
                </div>
              </button>
            ))}
          </div>
        </section>
      ))}

      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div role="dialog" aria-modal="true" className="card bg-white rounded-lg shadow-elev-1 p-4 w-full max-w-md space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold">{edit.doc.label}</h3>
                <p className="text-xs text-gray-500">
                  Format penomoran{edit.doc.status === 'aktif' ? ' · aktif dipakai' : ' · rencana'}
                </p>
              </div>
              <button type="button" className="btn-outline text-xs" onClick={() => setEdit(null)}>Tutup</button>
            </div>

            <div className="grid gap-1">
              <label className="text-xs" htmlFor="docFormat">Format Nomor</label>
              <div className="flex gap-2">
                <input
                  id="docFormat"
                  className="input font-mono flex-1"
                  value={edit.format}
                  onChange={(e) => setEdit({ ...edit, format: e.target.value })}
                />
                <select
                  className="input w-40"
                  value=""
                  onChange={(e) => {
                    if (!e.target.value) return;
                    setEdit({ ...edit, format: edit.format + e.target.value });
                  }}
                >
                  <option value="">+ Kode nomor</option>
                  {TOKENS.map((t) => (
                    <option key={t.token} value={t.token}>{t.token} — {t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-1">
              <label className="text-xs">Contoh hasil otomatis</label>
              <div className="font-mono text-base">{edit.doc.next}</div>
              <p className="text-xs text-gray-500">Contoh dihitung backend, diperbarui setelah disimpan.</p>
            </div>

            <div className="grid gap-1">
              <label className="text-xs" htmlFor="docSeq">Nomor Terakhir</label>
              <input
                id="docSeq"
                type="number"
                min={0}
                max={999999}
                step={1}
                className="input font-mono"
                value={String(edit.seq)}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  if (!Number.isFinite(n)) return;
                  setEdit({ ...edit, seq: Math.max(0, Math.min(999999, Math.floor(n))) });
                }}
              />
              <p className="text-xs text-gray-500">Dokumen berikutnya = nomor ini + 1.</p>
            </div>

            <fieldset className="grid gap-1">
              <legend className="text-xs">Reset Nomor Setiap</legend>
              {(Object.keys(RESET_LABELS) as CounterResetPolicy[]).map((policy) => (
                <label key={policy} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="docReset"
                    value={policy}
                    checked={edit.reset_policy === policy}
                    onChange={() => setEdit({ ...edit, reset_policy: policy })}
                  />
                  {RESET_LABELS[policy]}
                </label>
              ))}
            </fieldset>

            <div className="flex justify-end gap-2">
              <button type="button" className="btn-outline" onClick={() => setEdit(null)}>Batal</button>
              <button type="button" className="btn-primary" onClick={onSave} disabled={saving}>
                {saving ? 'Menyimpan…' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
