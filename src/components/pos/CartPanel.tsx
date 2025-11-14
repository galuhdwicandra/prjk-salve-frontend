// src/components/pos/CartPanel.tsx
import { useMemo } from 'react';

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

export default function CartPanel({ items, onChangeQty, onChangeNote, onRemove }: Props): React.ReactElement {
    const subtotal = useMemo(
        () => items.reduce((s, it) => s + (it.price * it.qty), 0),
        [items]
    );

    return (
        <div className="rounded-2xl border p-3 space-y-2">
            <div className="text-sm font-semibold">Keranjang</div>
            {items.length === 0 && <div className="text-sm text-muted-foreground">Belum ada item</div>}

            {items.length > 0 && (
                <div className="space-y-2">
                    {items.map((it) => (
                        <div key={it.service_id} className="flex items-start gap-2 border-b pb-2">
                            <div className="flex-1">
                                <div className="font-medium">{it.name}</div>
                                <div className="text-xs text-muted-foreground">{it.unit}</div>
                                <div className="text-sm mt-1">{(it.price * it.qty).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</div>
                                <input
                                    className="mt-1 border rounded px-2 py-1 w-full"
                                    placeholder="Catatan item (opsional)"
                                    value={it.note ?? ''}
                                    onChange={(e) => onChangeNote(it.service_id, e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min={1}
                                    className="border rounded px-2 py-1 w-20"
                                    value={it.qty}
                                    onChange={(e) => onChangeQty(it.service_id, Math.max(1, Number(e.target.value)))}
                                />
                                <button className="text-xs underline" onClick={() => onRemove(it.service_id)}>Hapus</button>
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-between text-sm font-semibold">
                        <span>Subtotal</span>
                        <span>{subtotal.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
