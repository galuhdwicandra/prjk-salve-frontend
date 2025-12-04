// src/utils/receipt-wa.ts
import type { Order } from '../types/orders';

export function formatIDR(n: number): string {
    try {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(n ?? 0);
    } catch {
        return `Rp ${Math.round(n ?? 0).toLocaleString('id-ID')}`;
    }
}

export function buildReceiptMessage(order: Order, shareUrl: string): string {
    const name = order?.customer?.name || 'Pelanggan';
    const nomor = (order as any)?.invoice_no || (order as any)?.number || '';
    const total = formatIDR(Number((order as any)?.grand_total ?? (order as any)?.total ?? 0));

    const status = (order as any)?.payment_status;
    const isLunas = status === 'PAID' || status === 'SETTLED';

    const lines = isLunas
        ? [
            `Halo ${name},`,
            'Terima kasih atas pembayarannya.',
            `Kwitansi: ${shareUrl}`,
            `No: ${nomor}`,
            `Total: ${total}`,
            'Terima Kasih Sudah Menggunakan Layanan.',
            'Salve Laundry',
        ]
        : [
            `Halo ${name},`,
            'Berikut tagihan laundry Anda.',
            `Kwitansi: ${shareUrl}`,
            `No: ${nomor}`,
            `Total: ${total}`,
            'Mohon melakukan pembayaran.',
            'Salve Laundry',
        ];

    return lines.join('\n');
}
