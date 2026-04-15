import { useEffect } from 'react';

export type ToastKind = 'success' | 'error' | 'info';

type ToastProps = {
  show: boolean;
  message: string;
  kind?: ToastKind;
  onClose: () => void;
  duration?: number;
};

export default function Toast({
  show,
  message,
  kind = 'info',
  onClose,
  duration = 2200,
}: ToastProps) {
  useEffect(() => {
    if (!show) return;

    const timer = window.setTimeout(() => {
      onClose();
    }, duration);

    return () => window.clearTimeout(timer);
  }, [show, duration, onClose]);

  if (!show || !message) return null;

  const tone =
    kind === 'success'
      ? {
          wrap: 'border-emerald-200 bg-emerald-50 text-emerald-800',
          icon: 'text-emerald-600',
          button: 'text-emerald-700 hover:bg-emerald-100',
        }
      : kind === 'error'
      ? {
          wrap: 'border-red-200 bg-red-50 text-red-800',
          icon: 'text-red-600',
          button: 'text-red-700 hover:bg-red-100',
        }
      : {
          wrap: 'border-sky-200 bg-sky-50 text-sky-800',
          icon: 'text-sky-600',
          button: 'text-sky-700 hover:bg-sky-100',
        };

  return (
    <div
      className="pointer-events-none fixed right-4 top-4 z-[1000] w-full max-w-sm"
      aria-live="polite"
      aria-atomic="true"
      role="status"
    >
      <div
        className={`
          pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm
          ${tone.wrap}
        `}
      >
        <div className={`mt-0.5 shrink-0 ${tone.icon}`}>
          {kind === 'success' ? <IconCheck /> : kind === 'error' ? <IconAlert /> : <IconInfo />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold">
            {kind === 'success' ? 'Berhasil' : kind === 'error' ? 'Gagal' : 'Informasi'}
          </div>
          <div className="mt-0.5 text-sm leading-5">{message}</div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className={`rounded-lg px-2 py-1 text-xs font-medium transition ${tone.button}`}
          aria-label="Tutup notifikasi"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

function IconCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function IconAlert() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.3 4.3h3.4L22 18.6a2 2 0 0 1-1.7 3H3.7a2 2 0 0 1-1.7-3L10.3 4.3Z" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6" />
      <path d="M12 7h.01" />
    </svg>
  );
}