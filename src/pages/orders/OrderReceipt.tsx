import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderReceiptHtml, getOrder } from '../../api/orders';
import { buildWhatsAppLink } from '../../utils/wa';

export default function OrderReceipt(): React.ReactElement {
    const { id } = useParams<{ id: string }>();
    const [html, setHtml] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [waPhone, setWaPhone] = useState<string>('');

    useEffect(() => {
        (async () => {
            try {
                if (!id) return;
                const h = await getOrderReceiptHtml(id);
                setHtml(h);

                try {
                    const orderRes = await getOrder(id);
                    const wa = orderRes?.data?.customer?.whatsapp ?? '';
                    if (wa) setWaPhone(wa);
                } catch {
                    // Biarkan tetap jalan meski gagal ambil order (struk tetap tampil)
                }
            } catch (e: unknown) {
                setError((e as Error).message || 'Gagal memuat struk');
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) return <div className="p-4">Memuat struk…</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;

    const onPrint = () => window.print();
    const onSendWA = () => {
        const url = buildWhatsAppLink(waPhone, 'Halo, berikut struk transaksi Anda. Terima kasih 🙏');
        window.open(url, '_blank');
    };

    return (
        <div className="p-3 space-y-3">
            <div className="flex items-center gap-2 print:hidden">
                <button className="px-3 py-2 rounded border" onClick={onPrint}>Print</button>
                <input
                    type="tel"
                    placeholder="No. WA (62…/08…)"
                    value={waPhone}
                    onChange={(e) => setWaPhone(e.target.value)}
                    className="px-3 py-2 rounded border"
                />
                <button className="px-3 py-2 rounded bg-black text-white dark:bg-white dark:text-black" onClick={onSendWA} disabled={!waPhone}>
                    Kirim WhatsApp
                </button>
            </div>
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    );
}
