import { rp } from './money';
import { fmtDate } from './date';
import type { WaConfigKey } from '../types/whatsapp-templates';
import type { Order } from '../types/orders';

export type WaTemplateDef = {
    key: WaConfigKey;
    label: string;
    desc: string;
    vars: string[];
};

export const WA_TEMPLATE_DEFS: WaTemplateDef[] = [
    {
        key: 'struk',
        label: 'Struk / Konfirmasi Order',
        desc: 'Dikirim saat checkout & saat kirim ulang struk dari detail receipt.',
        vars: ['{nama}', '{no_order}', '{tanggal}', '{outlet}', '{items}', '{ringkasan}', '{total}', '{dibayar}', '{sisa}', '{estimasi}', '{link_tracker}'],
    },
    {
        key: 'ready',
        label: 'Pesanan Siap Diambil',
        desc: 'Dikirim saat status order sudah Ready (tombol "WA: Pesanan Siap").',
        vars: ['{nama}', '{no_order}', '{pasang}', '{outlet}', '{alamat_outlet}', '{sisa}', '{total}', '{link_tracker}'],
    },
    {
        key: 'reminder',
        label: 'Pengingat Pelunasan',
        desc: 'Dikirim untuk order yang masih ada sisa pembayaran (tombol "WA: Ingatkan Bayar").',
        vars: ['{nama}', '{no_order}', '{total}', '{dibayar}', '{sisa}'],
    },
    {
        key: 'greeting',
        label: 'Sapaan Umum',
        desc: 'Dipakai tombol WA di daftar Pelanggan (buka chat dengan sapaan).',
        vars: ['{nama}'],
    },
];

export const WA_TEMPLATE_DEFAULTS: Record<WaConfigKey, string> = {
    struk: [
        'Halo {nama} \u{1F64F}',
        '',
        '*SALVE \u2014 Shoe Care & Laundry*',
        'Struk: {no_order}',
        'Tgl: {tanggal} \u00B7 {outlet}',
        '--------------------------------',
        '{items}',
        '--------------------------------',
        '{ringkasan}',
        'Estimasi selesai: {estimasi}',
        '',
        '\u{1F50D} Lacak pesanan Anda:',
        '{link_tracker}',
        '',
        'Terima kasih sudah mempercayakan sepatunya ke Salve \u{1F64F}',
    ].join('\n'),
    ready: [
        'Halo {nama},',
        '',
        'Kabar baik! Pesanan Anda di *Salve* sudah *SELESAI* dan siap diambil. \u2728',
        '',
        'No. Order: {no_order}',
        'Jumlah: {pasang} pasang',
        'Sisa pembayaran: {sisa}',
        'Lokasi: {outlet} ({alamat_outlet})',
        '',
        '\u{1F50D} Cek status: {link_tracker}',
        '',
        'Ditunggu kedatangannya, terima kasih!',
    ].join('\n'),
    reminder: [
        'Halo {nama},',
        '',
        'Mengingatkan untuk pelunasan pesanan Anda di *Salve* ya \u{1F64F}',
        '',
        'No. Order: {no_order}',
        'Total: {total}',
        'Sudah dibayar: {dibayar}',
        '*Sisa: {sisa}*',
        '',
        'Terima kasih!',
    ].join('\n'),
    greeting:
        'Halo {nama}, terima kasih sudah mempercayakan perawatan sepatunya ke *Salve* \u{1F64F} Ada yang bisa kami bantu?',
};

export function waSampleVars(): Record<string, string> {
    const now = new Date();
    const estimasi = new Date(now.getTime() + 3 * 86400000);

    return {
        nama: 'Budi Santoso',
        no_order: 'SLV-0001',
        tanggal: fmtDate(now.toISOString()),
        outlet: 'Permata Biru',
        alamat_outlet: 'Pusat Permata Biru, Bandung',
        pasang: '2',
        total: rp(180000),
        subtotal: rp(200000),
        diskon: rp(20000),
        dibayar: rp(100000),
        sisa: rp(80000),
        estimasi: fmtDate(estimasi.toISOString()),
        items: [
            `Reguler  1 \u00D7 ${rp(50000)} = ${rp(50000)}`,
            `Full Repaint  1 \u00D7 ${rp(150000)} = ${rp(150000)}`,
        ].join('\n'),
        ringkasan: [
            `Subtotal: ${rp(200000)}`,
            `Diskon: -${rp(20000)}`,
            `*TOTAL: ${rp(180000)}*`,
            `Dibayar: ${rp(100000)}`,
            `Sisa: ${rp(80000)}`,
        ].join('\n'),
        link_tracker: `${window.location.origin}/t/contoh-token`,
    };
}

export function waRender(template: string, vars: Record<string, string>): string {
    return template.replace(/\{([a-z_]+)\}/g, (match, key: string) => vars[key] ?? match);
}

type WaOrderOptions = {
    outletName?: string;
    outletAddress?: string;
    trackerUrl?: string;
};

export function waOrderVars(order: Order, options: WaOrderOptions = {}): Record<string, string> {
    const items = order.items ?? [];
    const subtotal = Number(order.subtotal ?? 0);
    const discount = Number(order.discount ?? 0);
    const total = Number(order.grand_total ?? 0);
    const paid = Number(order.paid_amount ?? 0);
    const due = Number(order.due_amount ?? 0);
    const sisa = due > 0 ? rp(due) : 'LUNAS';

    const ringkasan = [
        `Subtotal: ${rp(subtotal)}`,
        discount > 0 ? `Diskon: -${rp(discount)}` : null,
        `*TOTAL: ${rp(total)}*`,
        `Dibayar: ${rp(paid)}`,
        `Sisa: ${sisa}`,
    ]
        .filter((line): line is string => line !== null)
        .join('\n');

    return {
        nama: order.customer?.name ?? order.customer_name ?? '',
        no_order: order.invoice_no || order.number,
        tanggal: fmtDate(order.created_at),
        outlet: options.outletName ?? '',
        alamat_outlet: options.outletAddress ?? '',
        pasang: String(items.reduce((sum, item) => sum + Number(item.qty ?? 0), 0)),
        total: rp(total),
        subtotal: rp(subtotal),
        diskon: rp(discount),
        dibayar: rp(paid),
        sisa,
        estimasi: fmtDate(order.ready_at),
        items: items
            .map((item) => `${item.service?.name ?? ''}  ${item.qty} \u00D7 ${rp(Number(item.price ?? 0))} = ${rp(Number(item.total ?? 0))}`)
            .join('\n'),
        ringkasan,
        link_tracker: options.trackerUrl ?? '',
    };
}

export function buildOrderWaMessage(
    order: Order,
    key: WaConfigKey,
    template: string | null | undefined,
    options: WaOrderOptions = {},
): string {
    return waRender(template?.trim() || WA_TEMPLATE_DEFAULTS[key], waOrderVars(order, options));
}
