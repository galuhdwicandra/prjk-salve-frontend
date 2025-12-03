// src/components/ReceiptPreview.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  /** HTML struk lengkap dari backend (GET /orders/{id}/receipt) */
  html: string;
  /** Tinggi iframe, default: "70vh" */
  height?: string | number;
  /** Auto print begitu selesai render */
  autoPrint?: boolean;
  /** Kelas tambahan untuk wrapper */
  className?: string;
  /** Dipanggil setelah iframe selesai load */
  onLoaded?: () => void;
  /** Dipanggil saat tombol Print diklik */
  onPrint?: () => void;
  /** Judul dokumen saat print */
  printTitle?: string;
};

type PreviewWidth = "auto" | "58" | "80";

export default function ReceiptPreview({
  html,
  height = "70vh",
  autoPrint = false,
  className = "",
  onLoaded,
  onPrint,
  printTitle,
}: Props): React.ReactElement {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [previewWidth, setPreviewWidth] = useState<PreviewWidth>("auto");

  // srcDoc bekerja di browser modern; fallback ke Blob URL kalau perlu
  const supportsSrcDoc = useMemo(() => {
    const el = document.createElement("iframe");
    return "srcdoc" in el;
  }, []);
  const blobUrl = useMemo(() => {
    if (!html || supportsSrcDoc) return "";
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    return URL.createObjectURL(blob);
  }, [html, supportsSrcDoc]);

  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl]);

  const handleLoad = () => {
    setLoaded(true);
    onLoaded?.();

    if (autoPrint) {
      // delay kecil supaya layout stabil sebelum print
      setTimeout(() => {
        const frameWin = iframeRef.current?.contentWindow;
        try {
          if (printTitle && frameWin?.document) frameWin.document.title = printTitle;
        } catch { /* no-op */ }
        frameWin?.focus();
        frameWin?.print();
      }, 50);
    }
  };

  const doPrint = () => {
    onPrint?.();
    const frameWin = iframeRef.current?.contentWindow;
    try {
      if (printTitle && frameWin?.document) frameWin.document.title = printTitle;
    } catch { /* no-op */ }
    frameWin?.focus();
    frameWin?.print();
  };

  const openInNewTab = () => {
    // buka tab baru dan tulis HTML langsung — tidak kena CORS
    const w = window.open("", "_blank");
    if (!w) {
      alert("Popup diblokir browser. Izinkan pop-up untuk situs ini.");
      return;
    }
    w.document.open();
    w.document.write(html || "<!doctype html><title>Receipt</title><body>Empty</body>");
    w.document.close();
  };

  // Lebar pratinjau (tidak memengaruhi hasil cetak), hanya untuk membantu lihat 58/80mm.
  const previewWidthClass =
    previewWidth === "58"
      ? "w-[240px]" // kira-kira 58mm untuk pratinjau layar
      : previewWidth === "80"
      ? "w-[320px]" // kira-kira 80mm untuk pratinjau layar
      : "w-full";

  return (
    <div
      className={`card border border-[color:var(--color-border)] rounded-lg shadow-elev-1 bg-[var(--color-surface)] ${className}`}
      aria-busy={html ? (loaded ? "false" : "true") : "false"}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[color:var(--color-border)]">
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold">Receipt Preview</div>
          <span className="text-xs text-gray-500 hidden sm:inline">
            Pratinjau tidak memengaruhi hasil print
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Preview width */}
          <label className="hidden sm:flex items-center gap-2 text-xs text-gray-600">
            <span>Preview Width</span>
            <select
              value={previewWidth}
              onChange={(e) => setPreviewWidth(e.target.value as PreviewWidth)}
              className="input py-1 px-2 h-8"
              aria-label="Lebar pratinjau"
            >
              <option value="auto">Auto</option>
              <option value="58">58mm</option>
              <option value="80">80mm</option>
            </select>
          </label>

          <button
            type="button"
            className="btn-outline"
            onClick={openInNewTab}
            disabled={!html}
            aria-disabled={!html}
            title="Buka di tab baru"
          >
            Open
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={doPrint}
            disabled={!loaded}
            aria-disabled={!loaded}
            title={loaded ? "Print" : "Menunggu render…"}
          >
            Print
          </button>
        </div>
      </div>

      {/* Body */}
      {!html ? (
        <div className="p-4 text-sm text-gray-500">Tidak ada HTML struk.</div>
      ) : (
        <div className="p-3">
          <div className="mx-auto">
            <div className={`mx-auto ${previewWidthClass}`}>
              {/* Skeleton overlay saat loading */}
              {!loaded && (
                <div
                  className="mb-2 h-8 w-28 rounded bg-black/10 animate-pulse"
                  aria-hidden="true"
                />
              )}
              <div className="rounded border border-[color:var(--color-border)] overflow-hidden bg-white">
                <iframe
                  ref={iframeRef}
                  title="receipt-preview"
                  // srcDoc memberi isolasi style dari app utama; sebagian browser lama fallback ke src
                  srcDoc={supportsSrcDoc ? html : undefined}
                  src={supportsSrcDoc ? undefined : blobUrl}
                  // sandbox untuk keamanan, tetap izinkan script, popup (print), dan same-origin
                  sandbox="allow-same-origin allow-scripts allow-popups allow-modals"
                  onLoad={handleLoad}
                  style={{
                    width: "100%",
                    height: typeof height === "number" ? `${height}px` : height,
                    border: "0",
                    background: "#fff",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
