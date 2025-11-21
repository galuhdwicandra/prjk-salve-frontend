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
  printTitle?: string;
};

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
        // Set judul dokumen di dalam iframe (jika diminta)
        try {
          if (printTitle && frameWin?.document) {
            frameWin.document.title = printTitle;
          }
        } catch (err) { void err; }
        frameWin?.focus();
        frameWin?.print();
      }, 50);
    }
  };

  const doPrint = () => {
    onPrint?.();
    const frameWin = iframeRef.current?.contentWindow;
    try {
      if (printTitle && frameWin?.document) {
        frameWin.document.title = printTitle;
      }
    } catch (err) { void err; }
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

  return (
    <div className={`border rounded-2xl overflow-hidden bg-white dark:bg-background ${className}`}>
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <div className="text-sm font-semibold">Receipt Preview</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1.5 text-sm border rounded"
            onClick={openInNewTab}
            disabled={!html}
            title="Buka di tab baru"
          >
            Open
          </button>
          <button
            type="button"
            className="px-3 py-1.5 text-sm border rounded"
            onClick={doPrint}
            disabled={!loaded}
            title={loaded ? "Print" : "Menunggu render…"}
          >
            Print
          </button>
        </div>
      </div>

      {!html ? (
        <div className="p-4 text-sm text-muted-foreground">Tidak ada HTML struk.</div>
      ) : (
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
      )}
    </div>
  );
}
