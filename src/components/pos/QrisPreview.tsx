import { useEffect, useState } from 'react';
import { toIDR } from '../../utils/money';
import { createQrisDataUrl } from '../../utils/qris';

type QrisPreviewProps = {
  amount: number;
};

export default function QrisPreview({
  amount,
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

  return (
    <div className="rcp-qr">
      <div className="mini">
        Scan QRIS {'\u2014'} bayar <b>{toIDR(amount)}</b>
      </div>

      {imageUrl ? (
        <img src={imageUrl} alt={`QRIS pembayaran ${toIDR(amount)}`} />
      ) : failed ? (
        <div className="mini rcp-qr-status">
          QRIS gagal dibuat. Silakan pilih ulang metode pembayaran.
        </div>
      ) : (
        <div className="mini rcp-qr-status">
          Menyiapkan QRIS...
        </div>
      )}
    </div>
  );
}