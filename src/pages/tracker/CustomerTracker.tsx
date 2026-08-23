import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getErrorMessage } from '../../api/client';
import { getCustomerTracker } from '../../api/tracker';
import { fileUrl } from '../../utils/files';
import { buildWhatsAppLink } from '../../utils/wa';
import type { CustomerTrackerData } from '../../types/tracker';

const STEPS = ['Diterima', 'Sedang dikerjakan', 'Siap diambil', 'Selesai'];
const INVALID_MESSAGE = 'Link tidak valid atau kedaluwarsa. Minta link terbaru ke Salve ya.';

function formatDateTime(value: string): string {
    return new Date(value).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatDate(value: string | null): string {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function formatMoney(value: number): string {
    return `Rp ${value.toLocaleString('id-ID')}`;
}

export default function CustomerTracker() {
    const { token } = useParams<{ token: string }>();
    const [data, setData] = useState<CustomerTrackerData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        document.title = 'Lacak Pesanan · Salve';

        if (!token) {
            setError(INVALID_MESSAGE);
            return;
        }

        getCustomerTracker(token)
            .then((res) => setData(res.data))
            .catch((e) => setError(getErrorMessage(e, INVALID_MESSAGE)));
    }, [token]);

    if (error || !data) {
        return (
            <div className="trk-page">
                <div className="trk-wrap">
                    <div className="trk-card">
                        <div className="trk-logobar">
                            <img src="/logo-salve.png" alt="Salve" />
                        </div>
                        <div className="trk-foot" style={{ padding: 26 }}>
                            {error ?? 'Memuat status pesanan…'}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const cancelled = data.stage.index === -1;
    const statusClass = cancelled ? 'trk-status cancel' : data.stage.index >= 3 ? 'trk-status done' : 'trk-status';
    const waLink = data.outlet.phone
        ? buildWhatsAppLink(data.outlet.phone, `Halo Salve, saya mau tanya pesanan ${data.number}`)
        : null;

    return (
        <div className="trk-page">
            <div className="trk-wrap">
                <div className="trk-card">
                    <div className="trk-logobar">
                        <img src="/logo-salve.png" alt="Salve" />
                    </div>

                    <div className="trk-head2">
                        <div className="lbl">Lacak Pesanan</div>
                        <div className="ono">{data.number}</div>
                        {data.customer_first_name ? <div className="cust">Halo, {data.customer_first_name} 👋</div> : null}
                    </div>

                    <div className={statusClass}>
                        <div className="big">{data.stage.label}</div>
                    </div>

                    {cancelled ? null : (
                        <div className="trk-steps">
                            {STEPS.map((step, index) => (
                                <div
                                    key={step}
                                    className={
                                        index < data.stage.index
                                            ? 'trk-step past'
                                            : index === data.stage.index
                                                ? 'trk-step on'
                                                : 'trk-step'
                                    }
                                >
                                    <span className="trk-dot">{index <= data.stage.index ? '✓' : index + 1}</span>
                                    <span className="st-t">{step}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="trk-meta">
                        {data.qty > 0 ? (
                            <div className="trk-mrow">
                                <span className="k">Jumlah</span>
                                <span className="v">{data.qty} pasang</span>
                            </div>
                        ) : null}
                        {!cancelled && data.stage.index < 2 ? (
                            <div className="trk-mrow">
                                <span className="k">Estimasi selesai</span>
                                <span className="v">{formatDate(data.estimate)}</span>
                            </div>
                        ) : null}
                        {data.show_pickup && data.outlet.name ? (
                            <div className="trk-mrow">
                                <span className="k">Ambil di</span>
                                <span className="v">
                                    {data.outlet.name}
                                    {data.outlet.address ? ` — ${data.outlet.address}` : ''}
                                </span>
                            </div>
                        ) : null}
                    </div>

                    {data.outstanding > 0 ? (
                        <div className="trk-qr">
                            <div className="trk-sec-t" style={{ margin: '0 0 4px' }}>
                                Sisa pembayaran
                            </div>
                            <div className="trk-qr-amt">{formatMoney(data.outstanding)}</div>
                            <div className="trk-qr-box">
                                <img src={fileUrl('storage/qris.png')} alt="QRIS Salve" />
                            </div>
                            <div className="trk-qr-note">
                                Scan QRIS di atas, lalu masukkan nominal {formatMoney(data.outstanding)}. Bisa dari aplikasi bank
                                atau e-wallet apa saja.
                            </div>
                        </div>
                    ) : null}

                    {data.timeline.length > 0 ? (
                        <>
                            <div className="trk-sec-t">Riwayat pengerjaan</div>
                            <div className="trk-tl">
                                {data.timeline.map((event) => (
                                    <div className="trk-tl-row" key={`${event.at}-${event.title}`}>
                                        <div className="trk-tl-dot" />
                                        <div>
                                            <div className="trk-tl-t">{event.title}</div>
                                            <div className="trk-tl-at">{formatDateTime(event.at)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : null}

                    {data.photos.length > 0 ? (
                        <>
                            <div className="trk-sec-t">Foto pesanan</div>
                            <div className="trk-photos">
                                {data.photos.map((photo) => (
                                    <div className="trk-photo" key={photo.path}>
                                        <img src={fileUrl(photo.path)} alt={photo.group} />
                                        <span className="trk-photo-g">{photo.group}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : null}

                    {waLink ? (
                        <div className="trk-cta">
                            <a href={waLink} target="_blank" rel="noopener noreferrer">
                                Hubungi Salve via WhatsApp
                            </a>
                        </div>
                    ) : null}

                    <div className="trk-foot">
                        Diperbarui {formatDateTime(data.updated_at)}
                        <br />
                        SALVE — Shoe Care &amp; Laundry
                    </div>
                </div>
            </div>
        </div>
    );
}
