// src/utils/wa.ts
function normPhoneID(wa: string): string {
    const digits = (wa || '').replace(/\D/g, '');
    if (digits.startsWith('62')) return digits;
    if (digits.startsWith('0')) return `62${digits.slice(1)}`;
    return digits;
}

export function buildWhatsAppLink(phone: string, message: string): string {
    const p = normPhoneID(phone);
    const t = encodeURIComponent(message);
    return `https://wa.me/${p}?text=${t}`;
}
