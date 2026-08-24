import { useEffect, useState } from 'react';
import { toIDR } from '../../utils/money';
import { createQrisDataUrl } from '../../utils/qris';

type QrisPreviewProps = {
  amount: number;
  variant?: 'compact' | 'receipt-payment';
};

export default function QrisPreview({
  amount,
  variant = 'compact',
}: QrisPreviewProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    setImageUrl('');
    setFailed(false);

    const timeoutId = window.setTimeout(() => {
      void createQrisDataUrl(amount)
        .then((url) => {
          if (active) {
            setImageUrl(url);
          }
        })
        .catch(() => {
          if (active) {
            setFailed(true);
          }
        });
    }, 150);

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
  }, [amount]);

  const receiptPayment = variant === 'receipt-payment';

  const statusClassName = receiptPayment
    ? 'mini mx-auto mt-2 grid aspect-square w-[270px] max-w-full place-items-center rounded-[10px] border border-[color:var(--line)] bg-white p-4'
    : 'mini rcp-qr-status';

  return (
    <div className={receiptPayment ? 'mt-2 text-center' : 'rcp-qr'}>
      <div className={receiptPayment ? 'mini mb-2' : 'mini'}>
        {receiptPayment ? (
          <>
            QRIS dinamis {'\u00b7'} {toIDR(amount)}
            {' \u2014 '}minta pelanggan scan
          </>
        ) : (
          <>
            Scan QRIS {'\u2014'} bayar <b>{toIDR(amount)}</b>
          </>
        )}
      </div>

      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`QRIS pembayaran ${toIDR(amount)}`}
          className={
            receiptPayment
              ? 'mx-auto aspect-square h-auto w-[270px] max-w-full rounded-[10px] border border-[color:var(--line)] bg-white'
              : undefined
          }
        />
      ) : failed ? (
        <div className={statusClassName}>
          QRIS gagal dibuat. Silakan pilih ulang metode pembayaran.
        </div>
      ) : (
        <div className={statusClassName}>
          Menyiapkan QRIS...
        </div>
      )}
    </div>
  );
}