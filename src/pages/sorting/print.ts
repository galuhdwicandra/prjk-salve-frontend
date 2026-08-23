import { fmtDate } from '../../utils/date';
import type { DeliveryNote, SortingOrder } from '../../api/sorting';

const SHEET_CSS = `
*{box-sizing:border-box}
body{font-family:ui-sans-serif,system-ui,"Segoe UI",Arial,sans-serif;color:#0f172a;margin:0;padding:18px}
.sheet{border:1.5px solid #0f172a;border-radius:6px;padding:14px 16px}
.hd{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:12px}
.hd h1{font-size:15px;font-weight:900;letter-spacing:.04em;margin:0}
.hd .no{font-size:10px;color:#475569;margin-top:2px}
.hd .meta{font-size:9.5px;text-align:right;line-height:1.5}
table{width:100%;border-collapse:collapse;font-size:9px}
th,td{border:1px solid #94a3b8;padding:3px 5px;text-align:left;vertical-align:top}
th{background:#e2e8f0;font-weight:800}
td.num,th.num{text-align:right}
tfoot td{font-weight:900;background:#f1f5f9}
.sign{display:flex;justify-content:space-around;gap:24px;margin-top:34px;font-size:9.5px}
.sign div{text-align:center;flex:1}
.sign .line{border-bottom:1px solid #0f172a;margin-top:44px}
.label{border:1.5px solid #0f172a;border-radius:6px;padding:10px 12px;margin-bottom:10px;page-break-inside:avoid}
.label .n{font-size:16px;font-weight:900}
.label .r{display:flex;justify-content:space-between;font-size:10px;margin-top:3px;color:#334155}
@page{size:A4 portrait;margin:10mm}
`;

function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function openPrintWindow(title: string, body: string): void {
  const w = window.open('', '_blank', 'noopener,noreferrer');
  if (!w) throw new Error('Popup diblokir browser. Izinkan pop-up untuk situs ini.');

  w.document.open();
  w.document.write(
    `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>${esc(title)}</title>` +
    `<style>${SHEET_CSS}</style></head><body>${body}` +
    `<script>window.onload=function(){window.print();setTimeout(function(){window.close()},400)}</script>` +
    `</body></html>`,
  );
  w.document.close();
}

function destinationLabel(note: DeliveryNote): string {
  return note.to_contact?.name ?? note.to_branch?.name ?? '-';
}

export function printDeliveryNote(note: DeliveryNote): void {
  const orders = note.orders ?? [];
  const total = orders.reduce(
    (sum, order) => sum + (order.items ?? []).reduce((n, item) => n + Number(item.qty ?? 0), 0),
    0,
  );

  const rows = orders
    .map((order, index) => {
      const qty = (order.items ?? []).reduce((n, item) => n + Number(item.qty ?? 0), 0);
      const treatment = (order.items ?? [])
        .map((item) => item.service?.name)
        .filter(Boolean)
        .join(', ');

      return (
        `<tr><td class="num">${index + 1}</td>` +
        `<td>${esc(order.invoice_no ?? order.number)}</td>` +
        `<td>${esc(order.customer?.name ?? order.customer_name ?? '-')}</td>` +
        `<td>${esc(order.branch?.code ?? order.branch?.name ?? '-')}</td>` +
        `<td>${esc(treatment || '-')}</td>` +
        `<td class="num">${qty}</td></tr>`
      );
    })
    .join('');

  const heading = note.kind === 'ambil' ? 'SURAT JALAN AMBIL' : 'SURAT JALAN';

  openPrintWindow(
    note.number,
    `<div class="sheet">
      <div class="hd">
        <div><h1>${heading}</h1><div class="no">${esc(note.number)}</div></div>
        <div class="meta">Tanggal: ${esc(fmtDate(note.note_date))}<br>Ke: ${esc(destinationLabel(note))}</div>
      </div>
      <table>
        <thead><tr><th class="num">#</th><th>No. Order</th><th>Pelanggan</th><th>Asal</th><th>Treatment</th><th class="num">Pasang</th></tr></thead>
        <tbody>${rows}</tbody>
        <tfoot><tr><td colspan="5">Total</td><td class="num">${total} pasang</td></tr></tfoot>
      </table>
      <div class="sign">
        <div>Diserahkan,<div class="line"></div></div>
        <div>Diterima,<div class="line"></div></div>
      </div>
    </div>`,
  );
}

type LabelOrder = Pick<
  SortingOrder,
  'number' | 'invoice_no' | 'customer_name' | 'qty' | 'ready_at' | 'branch'
>;

export function printOrderLabels(orders: LabelOrder[]): void {
  const body = orders
    .map(
      (order) =>
        `<div class="label">
          <div class="n">${esc(order.invoice_no ?? order.number)}</div>
          <div class="r"><span>${esc(order.customer_name ?? '-')}</span><span>${order.qty} pasang</span></div>
          <div class="r"><span>${esc(order.branch?.code ?? '-')}</span><span>Deadline ${esc(fmtDate(order.ready_at))}</span></div>
        </div>`,
    )
    .join('');

  openPrintWindow(orders.length === 1 ? `Label ${orders[0].number}` : 'Label Order', body);
}
