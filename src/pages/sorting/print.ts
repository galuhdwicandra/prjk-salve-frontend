import { fmtDate } from '../../utils/date';
import type { DeliveryNote, SortingOrder } from '../../api/sorting';

const SHEET_CSS = `
*{box-sizing:border-box}
body{font-family:Arial,Helvetica,sans-serif;color:#0f172a;margin:0;padding:14px;font-size:12px}
.sheet{border:2px solid #0a2a66;border-radius:8px;padding:14px;margin-bottom:16px}
.hd{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;border-bottom:2px solid #0a2a66;padding-bottom:8px;margin-bottom:10px}
.hd h1{font-size:20px;font-weight:800;color:#0a2a66;letter-spacing:1px;margin:0}
.hd .no{font-size:11px;color:#555;margin-top:2px}
.hd .meta{font-size:11px;text-align:right;line-height:1.5}
.sheet table{width:100%;border-collapse:collapse;font-size:11px}
.sheet th,.sheet td{border:1px solid #cbd5e1;padding:5px 7px;text-align:left;vertical-align:top}
.sheet th{background:#eef2f7;font-weight:800}
.sheet td.num,.sheet th.num{text-align:center}
.sheet tfoot td{font-weight:800;background:#f8fafc}
.sign{display:flex;justify-content:space-between;margin-top:24px;font-size:11px}
.sign div{text-align:center;width:45%}
.sign .line{border-bottom:1px solid #0f172a;margin-top:40px}
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

function openPrintFrame(title: string, body: string): void {
  const frame = document.createElement('iframe');

  frame.setAttribute('aria-hidden', 'true');
  frame.style.position = 'fixed';
  frame.style.right = '0';
  frame.style.bottom = '0';
  frame.style.width = '1px';
  frame.style.height = '1px';
  frame.style.border = '0';
  frame.style.opacity = '0';

  frame.onload = () => {
    frame.onload = null;

    const printWindow = frame.contentWindow;
    if (!printWindow) {
      frame.remove();
      return;
    }

    const cleanup = () => {
      if (frame.isConnected) frame.remove();
    };

    printWindow.addEventListener('afterprint', cleanup, { once: true });

    try {
      printWindow.focus();
      printWindow.print();
    } catch {
      cleanup();
    }
  };

  frame.srcdoc =
    `<!doctype html><html lang="id"><head><meta charset="utf-8">` +
    `<title>${esc(title)}</title><style>${SHEET_CSS}</style>` +
    `</head><body>${body}</body></html>`;

  document.body.appendChild(frame);
}

function branchLabel(branch: { name: string; code: string } | null | undefined): string | null {
  if (!branch) return null;
  return branch.code ? `${branch.name} (${branch.code})` : branch.name;
}

function originLabel(note: DeliveryNote): string {
  return note.from_contact?.name ?? branchLabel(note.branch) ?? '-';
}

function destinationLabel(note: DeliveryNote): string {
  return note.to_contact?.name ?? branchLabel(note.to_branch) ?? '-';
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
  const routeMeta =
    note.kind === 'ambil'
      ? `Dari: <b>${esc(originLabel(note))}</b><br>Ke: <b>${esc(destinationLabel(note))}</b>`
      : `Ke: <b>${esc(destinationLabel(note))}</b>`;

  openPrintFrame(
    note.number,
    `<div class="sheet">
      <div class="hd">
        <div><h1>${heading}</h1><div class="no">${esc(note.number)}</div></div>
        <div class="meta">Tanggal: ${esc(fmtDate(note.note_date))}<br>${routeMeta}</div>
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

  openPrintFrame(orders.length === 1 ? `Label ${orders[0].number}` : 'Label Order', body);
}
