import { useState } from 'react';
import { getErrorMessage } from '../../api/client';
import { updateOrder } from '../../api/orders';
import OrderBeforePhotos from '../../components/orders/OrderBeforePhotos';
import ProductSearch from '../../components/pos/ProductSearch';
import { rp } from '../../utils/money';
import type { Order } from '../../types/orders';

type Props = {
  order: Order;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
  onPhotosChanged: () => void | Promise<void>;
};

type DraftItem = {
  service_id: string;
  name: string;
  price: number;
  qty: number;
};

export default function EditOrderModal({ order, onClose, onSaved, onPhotosChanged }: Props) {
  const [items, setItems] = useState<DraftItem[]>(() =>
    (order.items ?? []).map((item) => ({
      service_id: item.service_id,
      name: item.service?.name ?? item.service_id,
      price: Number(item.price),
      qty: Number(item.qty),
    })),
  );

  const [picked, setPicked] = useState<DraftItem | null>(null);
  const [pickedQty, setPickedQty] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = Math.max(0, subtotal - Number(order.discount ?? 0));

  function changeQty(serviceId: string, value: number) {
    setItems((prev) =>
      prev.map((item) => (item.service_id === serviceId ? { ...item, qty: Math.max(1, Math.trunc(value)) } : item)),
    );
  }

  function addPicked() {
    if (!picked) return;

    setItems((prev) => {
      const found = prev.find((item) => item.service_id === picked.service_id);

      if (found) {
        return prev.map((item) =>
          item.service_id === picked.service_id ? { ...item, qty: item.qty + pickedQty } : item,
        );
      }

      return [...prev, { ...picked, qty: pickedQty }];
    });

    setPicked(null);
    setPickedQty(1);
  }

  async function save() {
    if (items.length === 0) {
      setError('Minimal satu layanan harus tersisa. Untuk membatalkan seluruh order, gunakan Void Receipt.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await updateOrder(order.id, {
        items: items.map((item) => ({ service_id: item.service_id, qty: item.qty })),
      });

      await onSaved();
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal menyimpan perubahan order.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal show" role="dialog" aria-modal="true" aria-label="Edit Order">
      <div className="box lg">
        <div className="modal-head">
          <div>
            <h3>
              Edit Order {'\u00b7'} {order.invoice_no ?? order.number}
            </h3>
            <div className="mini">Ubah foto, layanan, atau jumlah</div>
          </div>
          <button type="button" className="mclose" onClick={onClose} aria-label="Tutup">
            {'\u2715'}
          </button>
        </div>

        {error ? (
          <div role="alert" style={{ marginBottom: 12, color: 'var(--danger)', fontWeight: 700, fontSize: 13 }}>
            {error}
          </div>
        ) : null}

        <div className="card-title">Foto Before</div>
        <OrderBeforePhotos
          orderId={order.id}
          photos={order.photos ?? []}
          onChanged={onPhotosChanged}
        />

        <div className="card-title" style={{ marginTop: 20 }}>Layanan</div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Layanan</th>
                <th>Qty</th>
                <th className="num">Harga</th>
                <th className="num">Subtotal</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.service_id}>
                  <td data-label="Layanan">{item.name}</td>
                  <td data-label="Qty">
                    <input
                      type="number"
                      min={1}
                      style={{ maxWidth: 80 }}
                      value={item.qty}
                      disabled={saving}
                      onChange={(e) => changeQty(item.service_id, Number(e.target.value || 1))}
                    />
                  </td>
                  <td className="num" data-label="Harga">{rp(item.price)}</td>
                  <td className="num" data-label="Subtotal">{rp(item.price * item.qty)}</td>
                  <td className="num">
                    <button
                      type="button"
                      className="btn danger sm"
                      disabled={saving}
                      onClick={() =>
                        setItems((prev) => prev.filter((row) => row.service_id !== item.service_id))
                      }
                    >
                      Batal
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="row" style={{ marginTop: 14, alignItems: 'flex-end' }}>
          <div className="field" style={{ marginBottom: 0, flex: 2 }}>
            <label>Tambah layanan</label>
            <ProductSearch
              branchId={order.branch_id}
              onPick={(service) =>
                setPicked({
                  service_id: service.id,
                  name: service.name,
                  price: Number(service.price_effective),
                  qty: 1,
                })
              }
            />
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="add_qty">Qty</label>
            <input
              id="add_qty"
              type="number"
              min={1}
              value={pickedQty}
              disabled={saving}
              onChange={(e) => setPickedQty(Math.max(1, Number(e.target.value || 1)))}
            />
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <button type="button" className="btn block" disabled={!picked || saving} onClick={addPicked}>
              Tambah
            </button>
          </div>
        </div>

        <div className="totals" style={{ marginTop: 16 }}>
          <div className="l">
            <span>Subtotal</span>
            <span>{rp(subtotal)}</span>
          </div>
          <div className="l grand">
            <span>Total</span>
            <span>{rp(total)}</span>
          </div>
          <div className="l">
            <span>Sudah dibayar</span>
            <span>{rp(Number(order.paid_amount))}</span>
          </div>
        </div>

        <div className="mini" style={{ marginTop: 10 }}>
          Harga layanan baru mengikuti tarif outlet order ini. Untuk membatalkan seluruh order, gunakan Void Receipt.
        </div>

        <div className="modal-foot" style={{ marginTop: 16 }}>
          <button type="button" className="btn ghost" disabled={saving} onClick={onClose}>
            Batal
          </button>
          <button type="button" className="btn" style={{ marginLeft: 'auto' }} disabled={saving} onClick={() => void save()}>
            {saving ? 'Menyimpan\u2026' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
}
