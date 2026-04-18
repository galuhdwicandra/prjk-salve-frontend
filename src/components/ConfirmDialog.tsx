import { useEffect } from 'react';

export interface Props {
  open: boolean;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'primary';
  loading?: boolean;
  onConfirm(): void;
  onClose(): void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  confirmVariant = 'primary',
  loading = false,
  onConfirm,
  onClose,
}: Props) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, loading, onClose]);

  if (!open) return null;

  const confirmClass =
    confirmVariant === 'danger'
      ? `
        inline-flex items-center justify-center rounded-xl
        bg-rose-600 px-4 py-2 text-sm font-semibold text-white
        hover:bg-rose-700 active:bg-rose-800
        disabled:opacity-60 disabled:pointer-events-none
      `
      : `
        inline-flex items-center justify-center rounded-xl
        bg-slate-900 px-4 py-2 text-sm font-semibold text-white
        hover:bg-slate-800 active:bg-slate-950
        disabled:opacity-60 disabled:pointer-events-none
      `;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 backdrop-blur-[1px] sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby={message ? 'confirm-dialog-message' : undefined}
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_28px_70px_-40px_rgba(0,0,0,.45)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                <path d="M3 6h18" />
                <path d="M8 6V4.8c0-.7.56-1.3 1.25-1.3h5.5c.69 0 1.25.6 1.25 1.3V6" />
                <path d="M18 6l-.7 11.1c-.08 1.18-1.05 2.1-2.23 2.1H8.93c-1.18 0-2.15-.92-2.23-2.1L6 6" />
                <path d="M10 10.2v5.6" />
                <path d="M14 10.2v5.6" />
              </svg>
            </div>

            <div className="min-w-0">
              <h2 id="confirm-dialog-title" className="text-base font-semibold text-slate-900">
                {title}
              </h2>
              {message ? (
                <p id="confirm-dialog-message" className="mt-1 text-sm leading-6 text-slate-500">
                  {message}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              inline-flex items-center justify-center rounded-xl
              border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700
              hover:bg-slate-50 disabled:opacity-60 disabled:pointer-events-none
            "
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={confirmClass}
          >
            {loading ? 'Memproses...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}