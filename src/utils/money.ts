export function toIDR(n: number): string {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n ?? 0);
}

export function rp(n: number | null | undefined): string {
    if (n == null || Number.isNaN(n)) return 'Rp 0';
    return `Rp ${Math.round(n).toLocaleString('id-ID')}`;
}

export function num(n: number | null | undefined): string {
    return Number(n || 0).toLocaleString('id-ID');
}