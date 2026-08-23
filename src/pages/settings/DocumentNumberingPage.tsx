import { useCallback, useEffect, useMemo, useState } from 'react';
import { getErrorMessage } from '../../api/client';
import { previewDocumentNumbers, saveDocumentNumber } from '../../api/invoiceCounters';
import { useActiveBranchId } from '../../store/useBranch';
import type { CounterResetPolicy, DocumentNumber } from '../../types/branches';

const TOKENS: { token: string; label: string }[] = [
  { token: '[YY]', label: 'Tahun 2 digit' },
  { token: '[YYYY]', label: 'Tahun 4 digit' },
  { token: '[MM]', label: 'Bulan' },
  { token: '[DD]', label: 'Tanggal' },
  { token: '[OUTLET]', label: 'Kode outlet aktif' },
  { token: '[NUMBER]', label: 'Nomor urut (0001)' },
  { token: '[NUMBER:6]', label: 'Nomor urut 6 digit' },
];

const RESET_OPTIONS: { value: CounterResetPolicy; label: string }[] = [
  { value: 'never', label: 'Tidak pernah reset' },
  { value: 'monthly', label: 'Setiap bulan' },
  { value: 'yearly', label: 'Setiap tahun' },
];

const DATE_TOKEN = /\[(YYYY|YY|MM|DD|OUTLET)\]/g;
const NUMBER_TOKEN = /\[NUMBER(?::(\d+))?\]/g;

interface EditState {
  doc: DocumentNumber;
  format: string;
  seq: number;
  reset_policy: CounterResetPolicy;
}

function renderFormat(format: string, seq: number, outlet: string): string {
  const now = new Date();
  const year = String(now.getFullYear());
  const values: Record<string, string> = {
    YYYY: year,
    YY: year.slice(-2),
    MM: String(now.getMonth() + 1).padStart(2, '0'),
    DD: String(now.getDate()).padStart(2, '0'),
    OUTLET: outlet,
  };

  return format
    .replace(DATE_TOKEN, (_match: string, token: string) => values[token])
    .replace(NUMBER_TOKEN, (_match: string, digits: string | undefined) =>
      String(seq).padStart(Number(digits ?? 4), '0'));
}

export default function DocumentNumberingPage() {
  const branchId = useActiveBranchId();

  const [docs, setDocs] = useState<DocumentNumber[]>([]);
  const [outlet, setOutlet] = useState('SLV');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [edit, setEdit] = useState<EditState | null>(null);

  const refresh = useCallback(async () => {
    if (!branchId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await previewDocumentNumbers(branchId);
      setDocs(res.data ?? []);
      setOutlet(res.meta?.outlet ?? 'SLV');
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat penomoran otomatis'));
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const groups = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = term ? docs.filter((doc) => doc.label.toLowerCase().includes(term)) : docs;
    const map = new Map<string, DocumentNumber[]>();
    filtered.forEach((doc) => {
      map.set(doc.group, [...(map.get(doc.group) ?? []), doc]);
    });
    return Array.from(map.entries());
  }, [docs, search]);

  async function onSave() {
    if (!edit || !branchId) return;

    const format = edit.format.trim();
    if (!format.match(NUMBER_TOKEN)) {
      setError('Format wajib memuat [NUMBER]');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await saveDocumentNumber(edit.doc.id, {
        branch_id: branchId,
        doc_key: edit.doc.key,
        format,
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
    <>
      <div className="card">
        <div className="card-hd">
          <div className="card-title">
            Penomoran Otomatis
            <span className="ct-note">format nomor dokumen {'\u00B7'} klik kartu untuk mengubah</span>
          </div>
          <input
            type="search"
            className="hd-search num-search"
            value={search}
            placeholder="cari dokumen"
            aria-label="Cari dokumen"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {error ? (
          <div role="alert" style={{ marginBottom: 12, color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}>
            {error}
          </div>
        ) : null}

        {!branchId ? <div className="mini">Pilih outlet terlebih dahulu.</div> : null}
        {branchId && loading ? <div className="mini">Memuat{'\u2026'}</div> : null}
        {branchId && !loading && groups.length === 0 ? (
          <div className="mini">Tidak ada dokumen cocok.</div>
        ) : null}

        {groups.map(([group, items]) => (
          <div key={group} className="num-group">
            <h4>{group}</h4>
            <div className="num-grid">
              {items.map((doc) => (
                <div
                  key={doc.key}
                  role="button"
                  tabIndex={0}
                  className="num-card"
                  onClick={() =>
                    setEdit({
                      doc,
                      format: doc.format,
                      seq: doc.seq,
                      reset_policy: doc.reset_policy,
                    })
                  }
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter' && e.key !== ' ') return;
                    e.preventDefault();
                    setEdit({
                      doc,
                      format: doc.format,
                      seq: doc.seq,
                      reset_policy: doc.reset_policy,
                    });
                  }}
                >
                  <div className="nc-top">
                    <span className="nc-name">{doc.label}</span>
                    <span className={`num-badge ${doc.status}`}>
                      {doc.status === 'aktif' ? 'Aktif' : 'Rencana'}
                    </span>
                  </div>
                  <div className="nc-eg">{doc.next}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {edit ? (
        <div className="modal show" role="dialog" aria-modal="true" aria-label={edit.doc.label}>
          <div className="box">
            <div className="modal-head">
              <div>
                <h3>{edit.doc.label}</h3>
                <div className="mini">
                  Format penomoran {'\u00B7'} {edit.doc.status === 'aktif' ? 'aktif dipakai' : 'rencana'}
                </div>
              </div>
              <button type="button" className="mclose" aria-label="Tutup" onClick={() => setEdit(null)}>
                {'\u2715'}
              </button>
            </div>

            <div className="field">
              <label htmlFor="num-format">Format Nomor</label>
              <div className="row">
                <input
                  id="num-format"
                  type="text"
                  maxLength={40}
                  value={edit.format}
                  onChange={(e) => setEdit({ ...edit, format: e.target.value })}
                />
                <select
                  aria-label="Sisipkan kode nomor"
                  style={{ flex: 'none', width: 160 }}
                  value=""
                  onChange={(e) => {
                    if (!e.target.value) return;
                    setEdit({ ...edit, format: edit.format + e.target.value });
                  }}
                >
                  <option value="">+ Kode nomor</option>
                  {TOKENS.map((t) => (
                    <option key={t.token} value={t.token}>{`${t.token} — ${t.label}`}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label>Contoh hasil otomatis</label>
              <div className="nc-eg" style={{ fontSize: 17 }}>
                {renderFormat(edit.format, edit.seq + 1, outlet)}
              </div>
            </div>

            <div className="field">
              <label htmlFor="num-seq">Nomor Terakhir</label>
              <input
                id="num-seq"
                type="number"
                min={0}
                max={999999}
                step={1}
                value={String(edit.seq)}
                onChange={(e) => {
                  const parsed = Number(e.target.value);
                  if (!Number.isFinite(parsed)) return;
                  setEdit({ ...edit, seq: Math.max(0, Math.min(999999, Math.floor(parsed))) });
                }}
              />
              <div className="mini" style={{ marginTop: 6 }}>
                Dokumen berikutnya = nomor ini + 1.
              </div>
            </div>

            <div className="field">
              <label>Reset Nomor Setiap</label>
              {RESET_OPTIONS.map((option) => (
                <label key={option.value} className="modall-lbl" style={{ marginBottom: 6 }}>
                  <input
                    type="radio"
                    name="num-reset"
                    value={option.value}
                    checked={edit.reset_policy === option.value}
                    onChange={() => setEdit({ ...edit, reset_policy: option.value })}
                  />
                  {option.label}
                </label>
              ))}
              <div className="mini" style={{ marginTop: 6 }}>
                Reset memakai zona waktu Asia/Jakarta. Nomor urut kembali ke 1 saat periode berganti.
              </div>
            </div>

            <div className="modal-foot">
              <button
                type="button"
                className="btn ghost"
                style={{ marginLeft: 'auto' }}
                onClick={() => setEdit(null)}
              >
                Batal
              </button>
              <button type="button" className="btn" disabled={saving} onClick={() => void onSave()}>
                {saving ? `Menyimpan${'\u2026'}` : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
