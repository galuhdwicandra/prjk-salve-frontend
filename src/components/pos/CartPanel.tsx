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
  sla_days?: number;
  note?: string | null;
};

type Props = {
  items: CartItem[];
  editablePrice: boolean;
  onChangeQty: (service_id: string, qty: number) => void;
  onChangePrice: (service_id: string, price: number) => void;
  onRemove: (service_id: string) => void;
  onClear: () => void;
};

export default function CartPanel({
  items,
  editablePrice,
  onChangeQty,
  onChangePrice,
  onRemove,
  onClear,
}: Props): ReactElement {
  const totalQty = useMemo(() => items.reduce((s, it) => s + it.qty, 0), [items]);

  if (items.length === 0) {
    return <div className="empty">Belum ada item. Klik produk di sebelah kiri.</div>;
  }

  return (
    <div className="cart">
      <div className="cart-head">
        <span className="mini">{`${items.length} item · ${totalQty} ${items[0].unit}`}</span>
        <button type="button" className="link" onClick={onClear}>
          Kosongkan
        </button>
      </div>

      {items.map((item) => (
        <div className="citem" key={item.service_id}>
          <div className="citem-top">
            <span className="nm">{item.name}</span>
            <button
              type="button"
              className="x"
              onClick={() => onRemove(item.service_id)}
              aria-label={`Hapus ${item.name}`}
            >
              {"\u2715"}
            </button>
          </div>

          <div className="citem-bot">
            <div className="qwrap">
              <button
                type="button"
                className="qbtn"
                onClick={() => onChangeQty(item.service_id, Math.max(1, item.qty - 1))}
                aria-label={`Kurangi ${item.name}`}
              >
                {"\u2212"}
              </button>

              <input
                className="qty inp"
                type="number"
                min={1}
                value={item.qty}
                onChange={(e) => onChangeQty(item.service_id, Math.max(1, Number(e.target.value) || 1))}
                aria-label={`Jumlah ${item.name}`}
              />

              <button
                type="button"
                className="qbtn"
                onClick={() => onChangeQty(item.service_id, item.qty + 1)}
                aria-label={`Tambah ${item.name}`}
              >
                +
              </button>
            </div>

            {editablePrice ? (
              <span className="citem-pr">
                <span className="mini">Rp</span>
                <input
                  className="prc inp mono"
                  type="number"
                  min={0}
                  value={item.price}
                  onChange={(e) => onChangePrice(item.service_id, Math.max(0, Number(e.target.value) || 0))}
                  aria-label={`Harga ${item.name}`}
                />
              </span>
            ) : null}

            <span className="pr mono">{toIDR(item.price * item.qty)}</span>
          </div>
          
        </div>
      ))}
    </div>
  );
}
