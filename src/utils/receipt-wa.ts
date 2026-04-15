import type { Order } from '../types/orders';
import type { WhatsappTemplate } from '../types/whatsapp-templates';

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

function normalizeText(v: unknown, fallback = ''): string {
    if (v === null || v === undefined) return fallback;
    return String(v);
}

function asObject(value: unknown): Record<string, unknown> {
    if (value && typeof value === 'object') {
        return value as Record<string, unknown>;
    }
    return {};
}

function pickString(obj: Record<string, unknown>, key: string, fallback = ''): string {
    const value = obj[key];
    if (value === null || value === undefined || value === '') {
        return fallback;
    }
    return String(value);
}

function pickNumber(obj: Record<string, unknown>, key: string, fallback = 0): number {
    const value = obj[key];
    if (typeof value === 'number') return value;
    if (typeof value === 'string' && value.trim() !== '') {
        const parsed = Number(value);
        return Number.isNaN(parsed) ? fallback : parsed;
    }
    return fallback;
}

export function applyTemplate(
    template: string,
    vars: Record<string, string>,
): string {
    return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key: string) => {
        return vars[key] ?? '';
    });
}

export function buildReceiptMessage(
    order: Order,
    shareUrl: string,
    templateRow?: WhatsappTemplate | null,
): string {
    const rawOrder = asObject(order);

    const customerName = normalizeText(order.customer?.name, 'Pelanggan');
    const invoiceNo = pickString(rawOrder, 'invoice_no') || pickString(rawOrder, 'number', '-');
    const orderNo = pickString(rawOrder, 'number', '-');
    const grandTotal = formatIDR(
        pickNumber(rawOrder, 'grand_total', pickNumber(rawOrder, 'total', 0)),
    );
    const paymentStatus = pickString(rawOrder, 'payment_status', 'PENDING');

    const vars: Record<string, string> = {
        customer_name: customerName,
        invoice_no: invoiceNo,
        order_no: orderNo,
        grand_total: grandTotal,
        payment_status: paymentStatus,
        share_url: shareUrl,
        app_name: 'Salve Laundry',
    };

    if (templateRow?.content?.trim()) {
        return applyTemplate(templateRow.content, vars);
    }

    const isPaid = paymentStatus === 'PAID' || paymentStatus === 'SETTLED';

    return isPaid
        ? [
            `Halo ${customerName},`,
            'Terima kasih atas pembayarannya.',
            `Kwitansi: ${shareUrl}`,
            `No: ${invoiceNo}`,
            `Total: ${grandTotal}`,
            'Terima kasih sudah menggunakan layanan kami.',
            'Salve Laundry',
        ].join('\n')
        : [
            `Halo ${customerName},`,
            'Berikut tagihan laundry Anda.',
            `Kwitansi: ${shareUrl}`,
            `No: ${invoiceNo}`,
            `Total: ${grandTotal}`,
            'Mohon melakukan pembayaran.',
            'Salve Laundry',
        ].join('\n');
}