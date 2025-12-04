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
  const statusClass = isReceivableOpen
    ? 'bg-[var(--color-status-warning)] text-white'
    : 'bg-[var(--color-status-success)] text-white';

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
      <div className="p-4 max-w-4xl mx-auto">
        <div className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1 p-4">
          <div className="h-4 w-40 rounded bg-black/10 animate-pulse mb-3" />
          <div className="h-3 w-full rounded bg-black/10 animate-pulse mb-2" />
          <div className="h-3 w-5/6 rounded bg-black/10 animate-pulse mb-2" />
          <div className="h-3 w-4/6 rounded bg-black/10 animate-pulse" />
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div role="alert" className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
          {error}
        </div>
      </div>
    );
  }

  // ====== Render ======
  return (
    <div className="p-4 max-w-[1200px] mx-auto space-y-3">
      {/* Header ringkas */}
      <header className="print:hidden flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            Receipt {order?.invoice_no ?? order?.number ?? ''}
          </h1>
          <p className="text-xs text-gray-600">
            {order?.customer?.name ?? '-'}
          </p>
        </div>
        <span className={`chip ${statusClass}`}>{statusLabel}</span>
      </header>

      {/* Toolbar */}
      <section className="print:hidden card border border-[color:var(--color-border)] rounded-lg shadow-elev-1 p-3 bg-[var(--color-surface)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:items-end">
          {/* Kolom 1: Cetak */}
          <div className="flex flex-wrap gap-2">
            <button className="btn-outline px-3 py-2" onClick={onPrint} aria-label="Cetak struk">
              <span className="mr-1">🖨</span> Print
            </button>
            <button className="btn-outline px-3 py-2" onClick={onOpenNewTab} aria-label="Buka tab baru">
              <span className="mr-1">🗗</span> Open tab
            </button>
          </div>

          {/* Kolom 2: Kertas & Zoom (stepper) */}
          <div className="flex flex-col gap-2">
            <div>
              <span className="block text-xs text-gray-600 mb-1">Ukuran kertas</span>
              <div className="inline-flex rounded-md border border-[color:var(--color-border)] overflow-hidden">
                <button
                  className={`px-3 py-2 text-sm ${paper === '58' ? 'bg-[var(--color-brand-primary)] text-[color:var(--color-brand-on)]' : 'bg-white'}`}
                  onClick={() => setPaper('58')}
                  aria-pressed={paper === '58'}>58mm</button>
                <button
                  className={`px-3 py-2 text-sm border-l border-[color:var(--color-border)] ${paper === '80' ? 'bg-[var(--color-brand-primary)] text-[color:var(--color-brand-on)]' : 'bg-white'}`}
                  onClick={() => setPaper('80')}
                  aria-pressed={paper === '80'}>80mm</button>
                <button
                  className={`px-3 py-2 text-sm border-l border-[color:var(--color-border)] ${paper === 'A4' ? 'bg-[var(--color-brand-primary)] text-[color:var(--color-brand-on)]' : 'bg-white'}`}
                  onClick={() => setPaper('A4')}
                  aria-pressed={paper === 'A4'}>A4</button>
              </div>
              <div className="text-[10px] text-gray-500 mt-1">Saat ini: {paperLabel}</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="btn-outline px-2 py-2"
                onClick={() => setZoom((z) => clamp(Number((z - 0.1).toFixed(2)), 0.8, 2))}
                aria-label="Zoom out"
              >
                −
              </button>
              <input
                type="range" min={0.8} max={2} step={0.05} value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-40" aria-label="Zoom pratinjau"
              />
              <button
                className="btn-outline px-2 py-2"
                onClick={() => setZoom((z) => clamp(Number((z + 0.1).toFixed(2)), 0.8, 2))}
                aria-label="Zoom in"
              >
                +
              </button>
              <span className="text-xs text-gray-600 w-14 text-right">{Math.round(zoom * 100)}%</span>
              <button
                className="btn-outline px-3 py-2 ml-1"
                onClick={() => setZoom(1)}
                aria-label="Reset zoom"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Kolom 3: WhatsApp */}
          <div className="flex flex-col md:flex-row gap-2 md:justify-end">
            <label className="grid gap-1 text-sm flex-1">
              <span className="text-[color:var(--color-text-default)]">Nomor WhatsApp</span>
              <input
                type="tel" placeholder="No. WA (62…/08…)" value={waPhone}
                onChange={(e) => setWaPhone(e.target.value)}
                className="input px-3 py-2" aria-label="Nomor WhatsApp"
              />
            </label>
            <div className="flex gap-2">
              <button
                className="btn-primary disabled:opacity-50 disabled:pointer-events-none"
                onClick={onSendWA} disabled={!waPhone || !shareUrl} aria-label="Kirim WhatsApp"
              >
                Kirim WA
              </button>
              <button
                className="btn-outline"
                onClick={onCopyWAText}
                aria-label="Salin teks WA"
              >
                Salin
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stage preview */}
      <section className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1 p-0 print:shadow-none print:border-0 print:p-0">
        {/* Background grid halus agar preview terasa seperti kanvas */}
        <div className="w-full overflow-auto rounded-lg"
          style={{
            backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.03) 1px, transparent 1px),
                                 linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
          }}>
          <div className="min-h-[320px] py-6 grid place-items-start justify-center">
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
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-1)',
                margin: '0 auto'
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
