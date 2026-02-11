// src/pages/orders/OrderReceipt.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderReceiptHtml, getOrder, createOrderShareLink } from '../../api/orders';
import { buildWhatsAppLink } from '../../utils/wa';
import type { Order } from '../../types/orders';
import { toIDR } from '../../utils/money';

type Paper = '58' | '80' | 'A4';

// 1 mm ≈ 3.77953 px (CSS 96dpi)
const MM_TO_PX = 3.7795275591;
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

function IconPrinter(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M6 9V3h12v6" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <path d="M6 14h12v7H6z" />
    </svg>
  );
}
function IconExternal(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M14 3h7v7" />
      <path d="M10 14 21 3" />
      <path d="M21 14v6a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6" />
    </svg>
  );
}
function IconLink(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M10 13a5 5 0 0 1 0-7l1.5-1.5a5 5 0 0 1 7 7L17 13" />
      <path d="M14 11a5 5 0 0 1 0 7L12.5 19.5a5 5 0 0 1-7-7L7 11" />
    </svg>
  );
}
function IconWA(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" width="18" height="18" {...props}>
      <path
        fill="currentColor"
        d="M19.11 17.48c-.28-.14-1.64-.81-1.9-.9-.25-.1-.44-.14-.63.14-.18.28-.72.9-.88 1.09-.16.18-.32.21-.6.07-.28-.14-1.17-.43-2.23-1.37-.82-.73-1.37-1.64-1.53-1.91-.16-.28-.02-.43.12-.57.12-.12.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.35-.02-.49-.07-.14-.63-1.51-.87-2.06-.23-.56-.47-.48-.63-.49-.16-.01-.35-.01-.53-.01-.18 0-.49.07-.74.35-.25.28-.98.96-.98 2.35s1 2.73 1.14 2.92c.14.18 1.97 3.01 4.77 4.22.67.29 1.19.46 1.6.59.67.21 1.29.18 1.77.11.54-.08 1.64-.67 1.87-1.32.23-.65.23-1.21.16-1.32-.07-.11-.25-.18-.53-.32z"
      />
      <path
        fill="currentColor"
        d="M26.67 5.33A14.62 14.62 0 0 0 16.02 1C8.07 1 1.61 7.46 1.61 15.41c0 2.54.66 5.03 1.92 7.23L1 31l8.56-2.49a14.4 14.4 0 0 0 6.46 1.65h.01c7.95 0 14.41-6.46 14.41-14.41 0-3.85-1.5-7.46-4.17-10.42zM16.02 27.6h-.01c-2.14 0-4.24-.57-6.08-1.64l-.43-.26-5.08 1.48 1.36-4.95-.28-.51a12.03 12.03 0 0 1-1.86-6.31c0-6.66 5.42-12.08 12.09-12.08 3.22 0 6.25 1.25 8.53 3.52a12 12 0 0 1 3.56 8.56c0 6.66-5.42 12.19-12.08 12.19z"
      />
    </svg>
  );
}

export default function OrderReceipt(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const [html, setHtml] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [waPhone, setWaPhone] = useState<string>('');
  const [order, setOrder] = useState<Order | null>(null);
  const [shareUrl, setShareUrl] = useState<string>('');

  const [paper, setPaper] = useState<Paper>('58');
  const [zoom, setZoom] = useState<number>(1); // 1 = 100%

  // ====== Data fetch ======
  useEffect(() => {
    (async () => {
      try {
        if (!id) return;
        const h = await getOrderReceiptHtml(id);
        setHtml(h);

        try {
          const orderRes = await getOrder(id);
          const ord = orderRes?.data ?? null;
          if (ord) {
            setOrder(ord);
            const wa = ord.customer?.whatsapp ?? '';
            if (wa) setWaPhone(wa);
          }
        } catch { /* lanjutkan */ }

        try {
          const link = await createOrderShareLink(id);
          setShareUrl(link);
        } catch { /* abaikan, tetap bisa cetak manual */ }
      } catch (e: unknown) {
        setError((e as Error).message || 'Gagal memuat struk');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // ====== Derived UI state ======
  const isReceivableOpen = useMemo(() => Number(order?.due_amount ?? 0) > 0, [order?.due_amount]);
  const statusLabel = isReceivableOpen ? 'Piutang' : 'Lunas';

  const statusPillClass = isReceivableOpen
    ? 'bg-amber-50 text-amber-700 ring-amber-200'
    : 'bg-emerald-50 text-emerald-700 ring-emerald-200';

  const paperLabel = paper === '58' ? '58mm' : paper === '80' ? '80mm' : 'A4';
  const previewWidthPx = useMemo(() => {
    if (paper === '58') return Math.round(58 * MM_TO_PX);     // ≈ 219 px
    if (paper === '80') return Math.round(80 * MM_TO_PX);     // ≈ 302 px
    return Math.round(210 * MM_TO_PX);                        // A4 ≈ 794 px
  }, [paper]);

  // ====== Print helpers ======
  const buildPrintDoc = (content: string, pageSize: string, title: string, autoPrint = true) => {
    return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${title}</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  html,body{ margin:0; padding:0; }
  body{ font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial; background:#fff; }
  *{ box-sizing: border-box; }
  @media print { @page { size: ${pageSize}; margin: 0; } }
</style>
</head>
<body>
  <div id="receipt-root">${content}</div>
  <script>${autoPrint ? 'window.onload=()=>{window.print();setTimeout(()=>window.close(),400);}' : ''}</script>
</body>
</html>`;
  };

  const onPrint = () => {
    const nomor = order?.invoice_no ?? order?.number ?? 'Receipt';
    const pageSize = paper === 'A4' ? 'A4 portrait' : paper === '58' ? '58mm auto' : '80mm auto';
    const doc = buildPrintDoc(html, pageSize, `Receipt ${nomor}`, true);
    const w = window.open('', '_blank', 'noopener,noreferrer');
    if (!w) return window.print();
    w.document.open(); w.document.write(doc); w.document.close();
  };

  const onOpenNewTab = () => {
    const nomor = order?.invoice_no ?? order?.number ?? 'Receipt';
    const pageSize = paper === 'A4' ? 'A4 portrait' : paper === '58' ? '58mm auto' : '80mm auto';
    const doc = buildPrintDoc(html, pageSize, `Receipt ${nomor}`, false);
    const w = window.open('', '_blank', 'noopener,noreferrer');
    if (!w) return;
    w.document.open(); w.document.write(doc); w.document.close();
  };

  // ====== WhatsApp helpers ======
  const buildWAMessage = () => {
    const nomor = order?.invoice_no ?? order?.number ?? '-';
    const total = toIDR(Number(order?.grand_total ?? 0));
    const kwitansi = shareUrl || '';
    const name = order?.customer?.name ?? 'Pelanggan';
    const isUnpaid = Number(order?.due_amount ?? 0) > 0;

    if (isUnpaid) {
      return [
        `Halo ${name},`,
        'Berikut tagihan laundry Anda.',
        `Kwitansi: ${kwitansi}`,
        `No: ${nomor}`,
        `Total: ${total}`,
        'Mohon melakukan pembayaran.',
        'Salve Laundry',
      ].join('\n');
    }

    return [
      `Halo ${name},`,
      'Terima kasih atas pembayarannya.',
      `Kwitansi: ${kwitansi}`,
      `No: ${nomor}`,
      `Total: ${total}`,
      'Terima Kasih Sudah Menggunakan Layanan.',
      'Salve Laundry',
    ].join('\n');
  };

  const onSendWA = () => {
    if (!waPhone || !shareUrl) return;
    window.open(buildWhatsAppLink(waPhone, buildWAMessage()), '_blank');
  };

  const onCopyWAText = async () => {
    try {
      await navigator.clipboard?.writeText(shareUrl || '');
    } catch { /* abaikan */ }
  };

  const onCopyShareLink = async () => {
    try {
      await navigator.clipboard?.writeText(shareUrl || '');
    } catch { /* abaikan */ }
  };

  // ====== Iframe preview (isolated) ======
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [frameKey, setFrameKey] = useState(0);
  const [frameHeight, setFrameHeight] = useState<number>(320);

  const previewDoc = useMemo(() => {
    return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  html,body{ margin:0; padding:0; }
  body{ font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial; background:#fff; color:#000; }
  *{ box-sizing: border-box; }
  pre{ white-space: pre-wrap; word-wrap: break-word; }
</style>
</head>
<body>
  <div id="receipt-root">${html}</div>
</body>
</html>`;
  }, [html]);

  // Remount iframe saat ukuran/zoom berubah
  useEffect(() => { setFrameKey((k) => k + 1); }, [previewDoc, previewWidthPx, zoom]);

  const onFrameLoad = () => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    const h = Math.max(
      doc.body?.scrollHeight || 0,
      doc.documentElement?.scrollHeight || 0,
      280
    );
    setFrameHeight(h);
  };

  // ====== UI states ======
  if (loading) {
    return (
      <div className="mx-auto max-w-5xl p-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)]">
          <div className="h-5 w-48 rounded bg-slate-200/70 animate-pulse mb-4" />
          <div className="h-3 w-full rounded bg-slate-200/70 animate-pulse mb-2" />
          <div className="h-3 w-5/6 rounded bg-slate-200/70 animate-pulse mb-2" />
          <div className="h-3 w-4/6 rounded bg-slate-200/70 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl p-4">
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  // ====== Render ======
  const nomor = order?.invoice_no ?? order?.number ?? '';
  const customer = order?.customer?.name ?? '-';
  const total = toIDR(Number(order?.grand_total ?? 0));

  return (
    <div className="mx-auto max-w-[1200px] p-4 space-y-4">
      {/* Header */}
      <header className="print:hidden flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-slate-900 truncate">
            Receipt {nomor}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
            <span className="truncate">{customer}</span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-slate-900">{total}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusPillClass}`}>
            {statusLabel}
          </span>
        </div>
      </header>

      {/* Top actions */}
      <section className="print:hidden rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)]">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end">
          {/* Actions */}
          <div className="lg:col-span-4">
            <div className="text-xs font-medium text-slate-600 mb-2">Aksi</div>
            <div className="flex flex-wrap gap-2">
              <button
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 active:bg-slate-950"
                onClick={onPrint}
                aria-label="Cetak struk"
              >
                <IconPrinter className="text-white" />
                Print
              </button>

              <button
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                onClick={onOpenNewTab}
                aria-label="Buka tab baru"
              >
                <IconExternal className="text-slate-700" />
                Open tab
              </button>
            </div>
          </div>

          {/* Paper */}
          <div className="lg:col-span-3">
            <div className="text-xs font-medium text-slate-600 mb-2">Ukuran kertas</div>
            <div className="inline-flex w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
              <button
                className={`flex-1 px-3 py-2 text-sm font-semibold ${paper === '58' ? 'bg-slate-900 text-white' : 'text-slate-900 hover:bg-slate-50'}`}
                onClick={() => setPaper('58')}
                aria-pressed={paper === '58'}
              >
                58mm
              </button>
              <button
                className={`flex-1 border-l border-slate-200 px-3 py-2 text-sm font-semibold ${paper === '80' ? 'bg-slate-900 text-white' : 'text-slate-900 hover:bg-slate-50'}`}
                onClick={() => setPaper('80')}
                aria-pressed={paper === '80'}
              >
                80mm
              </button>
              <button
                className={`flex-1 border-l border-slate-200 px-3 py-2 text-sm font-semibold ${paper === 'A4' ? 'bg-slate-900 text-white' : 'text-slate-900 hover:bg-slate-50'}`}
                onClick={() => setPaper('A4')}
                aria-pressed={paper === 'A4'}
              >
                A4
              </button>
            </div>
            <div className="mt-1 text-[11px] text-slate-500">Aktif: {paperLabel}</div>
          </div>

          {/* Zoom */}
          <div className="lg:col-span-3">
            <div className="text-xs font-medium text-slate-600 mb-2">Zoom</div>
            <div className="flex items-center gap-2">
              <button
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                onClick={() => setZoom((z) => clamp(Number((z - 0.1).toFixed(2)), 0.8, 2))}
                aria-label="Zoom out"
              >
                −
              </button>

              <input
                type="range"
                min={0.8}
                max={2}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full"
                aria-label="Zoom pratinjau"
              />

              <button
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                onClick={() => setZoom((z) => clamp(Number((z + 0.1).toFixed(2)), 0.8, 2))}
                aria-label="Zoom in"
              >
                +
              </button>

              <div className="w-14 text-right text-xs font-semibold text-slate-900">
                {Math.round(zoom * 100)}%
              </div>

              <button
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50"
                onClick={() => setZoom(1)}
                aria-label="Reset zoom"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Share + WA */}
          <div className="lg:col-span-2">
            <div className="text-xs font-medium text-slate-600 mb-2">Bagikan</div>
            <div className="flex flex-wrap gap-2">
              <button
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none"
                onClick={onCopyShareLink}
                disabled={!shareUrl}
                aria-label="Salin link kwitansi"
                title={shareUrl ? shareUrl : 'Link belum tersedia'}
              >
                <IconLink className="text-slate-700" />
                Copy
              </button>
            </div>
          </div>
        </div>

        {/* WhatsApp row */}
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-12 md:items-end">
          <div className="md:col-span-6">
            <label className="block text-xs font-medium text-slate-600">
              Nomor WhatsApp
            </label>
            <input
              type="tel"
              placeholder="No. WA (62…/08…)"
              value={waPhone}
              onChange={(e) => setWaPhone(e.target.value)}
              className="
                mt-1 w-full rounded-lg border border-slate-200 bg-white
                px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400
                focus:border-slate-900 focus:outline-none
              "
              aria-label="Nomor WhatsApp"
            />
          </div>

          <div className="md:col-span-6 flex flex-wrap gap-2 md:justify-end">
            <button
              className="
                inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2
                text-sm font-semibold text-white hover:bg-slate-800 active:bg-slate-950
                disabled:opacity-50 disabled:pointer-events-none
              "
              onClick={onSendWA}
              disabled={!waPhone || !shareUrl}
              aria-label="Kirim WhatsApp"
            >
              <IconWA className="text-white" />
              Kirim WA
            </button>

            <button
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              onClick={onCopyWAText}
              aria-label="Salin (link) untuk WA"
              title="Menyalin link kwitansi"
            >
              Salin
            </button>
          </div>

          <div className="md:col-span-12 text-xs text-slate-500">
            {shareUrl ? (
              <span>Link kwitansi siap dibagikan.</span>
            ) : (
              <span>Link kwitansi belum tersedia (tetap bisa print & open tab).</span>
            )}
          </div>
        </div>
      </section>

      {/* Preview canvas */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)] print:shadow-none print:border-0">
        <div
          className="w-full overflow-auto"
          style={{
            backgroundImage:
              'linear-gradient(0deg, rgba(2,6,23,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(2,6,23,0.05) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        >
          <div className="min-h-[360px] py-6 grid place-items-start justify-center">
            <iframe
              key={frameKey}
              ref={iframeRef}
              title="Receipt preview"
              srcDoc={previewDoc}
              onLoad={onFrameLoad}
              style={{
                width: `${previewWidthPx * zoom}px`,
                height: `${frameHeight}px`,
                background: '#fff',
                border: '1px solid rgba(15,23,42,0.12)',
                borderRadius: '14px',
                boxShadow: '0 18px 42px -26px rgba(0,0,0,.45)',
                margin: '0 auto'
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
