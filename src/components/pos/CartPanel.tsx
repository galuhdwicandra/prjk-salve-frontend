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

export default function CartPanel({
  items,
  onChangeQty,
  onChangeNote,
  onRemove,
}: Props): ReactElement  {
  const subtotal = useMemo(
    () => items.reduce((s, it) => s + it.price * it.qty, 0),
    [items],
  );

  return (
    <div className="card rounded-lg border border-(--color-border) shadow-elev-1 p-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">Keranjang</div>
        <div className="text-[10px] text-gray-600">{items.length} item</div>
      </div>

      {items.length === 0 && (
        <div className="rounded-lg border border-dashed border-(--color-border) p-4 text-sm text-gray-600 text-center">
          Belum ada item
        </div>
      )}

      {items.length > 0 && (
        <>
          <ul className="space-y-2">
            {items.map((it) => (
              <li
                key={it.service_id}
                className="flex items-start gap-3 pb-2 border-b border-(--color-border)"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-medium truncate">{it.name}</div>
                    <span className="chip chip--subtle text-xs">{it.unit}</span>
                  </div>

                  <div className="mt-1 text-sm font-semibold">
                    {toIDR(it.price * it.qty)}
                  </div>

                  <input
                    className="input mt-2 px-2 py-2 text-sm w-full"
                    placeholder="Catatan item (opsional)"
                    value={it.note ?? ''}
                    onChange={(e) => onChangeNote(it.service_id, e.target.value)}
                    aria-label={`Catatan untuk ${it.name}`}
                  />
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <QtyStepper
                    value={it.qty}
                    onChange={(v) => onChangeQty(it.service_id, Math.max(1, v))}
                    label={`Kuantitas ${it.name}`}
                  />
                  <button
                    type="button"
                    className="btn-outline px-2 py-1 text-xs border-(--color-status-danger) text-(--color-status-danger)"
                    onClick={() => onRemove(it.service_id)}
                    aria-label={`Hapus ${it.name}`}
                  >
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-between items-center pt-2 text-sm font-semibold">
            <span>Subtotal</span>
            <span>{toIDR(subtotal)}</span>
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
    <div className="inline-flex items-center rounded-lg border border-(--color-border) overflow-hidden">
      <button
        type="button"
        className="px-2 py-1 hover:bg-black/5"
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
        className="w-16 text-center py-1 input border-0 focus:ring-0"
        aria-label={label ?? 'Jumlah'}
      />
      <button
        type="button"
        className="px-2 py-1 hover:bg-black/5"
        onClick={() => onChange(value + 1)}
        aria-label={label ? `${label}: tambah` : 'Tambah jumlah'}
      >
        +
      </button>
    </div>
  );
}
