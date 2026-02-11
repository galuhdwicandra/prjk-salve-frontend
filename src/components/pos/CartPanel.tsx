// src/components/pos/CartPanel.tsx
import { useMemo } from 'react';
import { toIDR } from '../../utils/money';
import type { ReactElement } from 'react';

export type CartItem = {
  service_id: string;
  name: string;
  unit: string;
  price: number;
  qty: number;
  note?: string | null;
};

type Props = {
  items: CartItem[];
  onChangeQty: (service_id: string, qty: number) => void;
  onChangeNote: (service_id: string, note: string) => void;
  onRemove: (service_id: string) => void;
};

export default function CartPanel({ items, onChangeQty, onChangeNote, onRemove }: Props): ReactElement {
  const subtotal = useMemo(() => items.reduce((s, it) => s + it.price * it.qty, 0), [items]);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900">Keranjang</div>
          <div className="mt-0.5 text-xs text-slate-500">
            {items.length > 0 ? 'Atur qty, catatan, lalu simpan transaksi.' : 'Tambah layanan dari pencarian.'}
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700 ring-1 ring-slate-100">
          {items.length} item
        </span>
      </div>

      {/* Empty */}
      {items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center">
          <div className="text-sm font-semibold text-slate-900">Belum ada item</div>
          <div className="mt-1 text-xs text-slate-500">Cari layanan, lalu tekan Enter untuk menambahkan.</div>
        </div>
      )}

      {/* List */}
      {items.length > 0 && (
        <>
          <ul className="space-y-2">
            {items.map((it) => (
              <li
                key={it.service_id}
                className="rounded-2xl border border-slate-200 bg-white p-3"
              >
                <div className="flex items-start gap-3">
                  {/* Main */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-900">{it.name}</div>
                        <div className="mt-1 inline-flex items-center rounded-full bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700 ring-1 ring-slate-100">
                          {it.unit}
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <div className="text-[11px] text-slate-500">Total</div>
                        <div className="text-sm font-extrabold tracking-tight text-slate-900">
                          {toIDR(it.price * it.qty)}
                        </div>
                        <div className="text-[11px] text-slate-500">{toIDR(it.price)} / item</div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="sr-only" htmlFor={`note-${it.service_id}`}>
                        Catatan untuk {it.name}
                      </label>
                      <input
                        id={`note-${it.service_id}`}
                        className="
                          w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900
                          placeholder:text-slate-400 focus:border-slate-900 focus:outline-none
                        "
                        placeholder="Catatan item (opsional)"
                        value={it.note ?? ''}
                        onChange={(e) => onChangeNote(it.service_id, e.target.value)}
                        aria-label={`Catatan untuk ${it.name}`}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <QtyStepper
                      value={it.qty}
                      onChange={(v) => onChangeQty(it.service_id, Math.max(1, v))}
                      label={`Kuantitas ${it.name}`}
                    />
                    <button
                      type="button"
                      className="
                        inline-flex items-center justify-center rounded-xl
                        border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700
                        hover:bg-red-100 active:bg-red-200
                      "
                      onClick={() => onRemove(it.service_id)}
                      aria-label={`Hapus ${it.name}`}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Subtotal */}
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">Subtotal</span>
              <span className="text-sm font-extrabold text-slate-900">{toIDR(subtotal)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------
   Subcomponents (UI)
------------------------ */

function QtyStepper({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  label?: string;
}) {
  return (
    <div className="inline-flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white">
      <button
        type="button"
        className="h-10 w-10 text-base font-semibold text-slate-900 hover:bg-slate-50 active:bg-slate-100"
        onClick={() => onChange(Math.max(1, value - 1))}
        aria-label={label ? `${label}: kurang` : 'Kurangi jumlah'}
      >
        &minus;
      </button>

      <input
        type="number"
        min={1}
        value={value}
        onChange={(e) => onChange(Math.max(1, Number(e.target.value) || 1))}
        className="
          h-10 w-14 border-x border-slate-200 bg-white text-center text-sm font-semibold text-slate-900
          focus:outline-none
        "
        aria-label={label ?? 'Jumlah'}
      />

      <button
        type="button"
        className="h-10 w-10 text-base font-semibold text-slate-900 hover:bg-slate-50 active:bg-slate-100"
        onClick={() => onChange(value + 1)}
        aria-label={label ? `${label}: tambah` : 'Tambah jumlah'}
      >
        +
      </button>
    </div>
  );
}
