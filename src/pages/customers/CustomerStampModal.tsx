import { useState } from 'react';
import { getErrorMessage } from '../../api/client';
import { adjustLoyaltyManual } from '../../api/loyalty';
import type { Customer } from '../../types/customers';
import type { LoyaltySummary } from '../../types/loyalty';

type Props = {
  customer: Customer;
  stamps: number;
  cycle: number;
  onClose: () => void;
  onDone: (summary: LoyaltySummary) => void;
};

function rewardLabel(next: number, cycle: number): string {
  if (next === 5) return 'diskon 25%';
  if (next === cycle) return 'gratis 100%';
  return 'tanpa reward';
}

export default function CustomerStampModal({ customer, stamps, cycle, onClose, onDone }: Props) {
  const [value, setValue] = useState(String(stamps));
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amount = Number(value);
  const valid = value.trim() !== '' && Number.isInteger(amount) && amount >= 0 && amount < cycle;
  const next = amount + 1;

  async function submit() {
    if (!valid) {
      setError(`Jumlah stamp harus 0 sampai ${cycle - 1}.`);
      return;
    }

    if (!note.trim()) {
      setError('Alasan wajib diisi.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const res = await adjustLoyaltyManual(customer.id, {
        type: 'set',
        amount,
        note: note.trim(),
        branch_id: customer.branch_id,
      });

      if (!res.data) {
        setError('Gagal menyimpan stamp.');
        return;
      }

      onDone(res.data);
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menyimpan stamp'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal show" role="dialog" aria-modal="true" aria-label="Edit Stamp">
      <div className="box">
        <div className="modal-head">
          <h3>Edit Stamp</h3>
          <button type="button" className="mclose" onClick={onClose} aria-label="Tutup">
            {'\u2715'}
          </button>
        </div>

        {error ? (
          <div role="alert" style={{ marginBottom: 12, color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}>
            {error}
          </div>
        ) : null}

        <div className="kv">
          <span>Stamp di sistem</span>
          <b>
            {stamps}/{cycle}
          </b>
        </div>

        <div className="field" style={{ marginTop: 12 }}>
          <label htmlFor="cust-stamp-value">
            Stamp di kartu fisik <span className="req">*</span>
          </label>
          <input
            id="cust-stamp-value"
            type="number"
            inputMode="numeric"
            min={0}
            max={cycle - 1}
            step={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <div className="mini" style={{ marginTop: 6 }}>
            {valid
              ? `Kunjungan berikutnya ke-${next} (${rewardLabel(next, cycle)}).`
              : `Isi 0 sampai ${cycle - 1}.`}
          </div>
        </div>

        <div className="field">
          <label htmlFor="cust-stamp-note">
            Alasan <span className="req">*</span>
          </label>
          <textarea
            id="cust-stamp-note"
            rows={2}
            maxLength={255}
            value={note}
            placeholder="Contoh: kartu fisik sudah 9 stamp, sistem baru 1."
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="modal-foot" style={{ justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn"
            disabled={saving || (valid && amount === stamps)}
            onClick={() => void submit()}
          >
            {saving ? 'Menyimpan\u2026' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}
