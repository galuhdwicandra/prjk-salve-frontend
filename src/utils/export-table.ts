import { aoaToXlsxBlob } from './xlsx';

export type Aoa = unknown[][];

const ESCAPES: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
};

function escapeHtml(value: unknown): string {
    return String(value ?? '').replace(/[&<>"]/g, (char) => ESCAPES[char]);
}

export function downloadXlsx(filename: string, sheet: string, aoa: Aoa): void {
    const url = URL.createObjectURL(aoaToXlsxBlob(aoa, sheet));
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
}

export function printPdf(title: string, subtitle: string, aoa: Aoa): boolean {
    const [head = [], ...body] = aoa;
    const win = window.open('', '_blank');

    if (!win) return false;

    win.document.write(
        `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>` +
        '<style>' +
        'body{font-family:Arial,Helvetica,sans-serif;color:#0F172A;font-size:10px;padding:16px}' +
        'h1{font-size:18px;margin:0 0 4px}' +
        '.sub{color:#64748B;margin-bottom:12px;font-size:11px}' +
        'table{border-collapse:collapse;width:100%}' +
        'th,td{border:1px solid #CBD5E1;padding:4px 6px;text-align:left;vertical-align:top}' +
        'th{background:#0A2A66;color:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}' +
        '@page{size:landscape}' +
        '</style></head><body>' +
        `<h1>${escapeHtml(title)}</h1><div class="sub">${escapeHtml(subtitle)}</div>` +
        `<table><thead><tr>${head.map((c) => `<th>${escapeHtml(c)}</th>`).join('')}</tr></thead><tbody>` +
        body.map((row) => `<tr>${row.map((c) => `<td>${escapeHtml(c)}</td>`).join('')}</tr>`).join('') +
        '</tbody></table></body></html>',
    );
    win.document.close();
    win.focus();
    win.print();

    return true;
}
