import { useEffect, useState } from 'react';
import { getErrorMessage } from '../../api/client';
import { getLoyaltySetting, saveLoyaltySetting } from '../../api/loyaltySettings';
import { listServices } from '../../api/services';
import type { LoyaltyReward } from '../../types/loyalty-settings';
import type { Service } from '../../types/services';

type Props = {
    onClose: () => void;
    onDone: (message: string) => void;
};

type Option = { value: string; label: string };

function emptyReward(): LoyaltyReward {
    return {
        at: 0,
        free: { on: false, products: [] },
        disc: { on: false, mode: 'rp', amount: 0, basis: 'before' },
    };
}

export default function LoyaltyStampModal({ onClose, onDone }: Props) {
    const [target, setTarget] = useState('10');
    const [stampPer, setStampPer] = useState<'transaksi' | 'kunjungan'>('transaksi');
    const [rewards, setRewards] = useState<LoyaltyReward[]>([]);
    const [options, setOptions] = useState<Option[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getLoyaltySetting()
            .then((res) => {
                setTarget(String(res.data.target));
                setStampPer(res.data.stamp_per);
                setRewards(res.data.rewards ?? []);
            })
            .catch((err) => setError(getErrorMessage(err, 'Gagal memuat pengaturan loyalty')))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        listServices({ tree: true, per_page: 200 })
            .then((res) =>
                setOptions(
                    (res.data ?? [])
                        .flatMap((parent: Service) => parent.variants ?? [])
                        .filter((variant) => variant.is_active)
                        .map((variant) => ({ value: variant.id, label: variant.name })),
                ),
            )
            .catch(() => setOptions([]));
    }, []);

    function patch(index: number, next: LoyaltyReward) {
        setRewards((prev) => prev.map((reward, i) => (i === index ? next : reward)));
    }

    async function submit() {
        const cleaned = rewards
            .filter((reward) => reward.at > 0 && (reward.free.on || reward.disc.on))
            .map((reward) => ({
                ...reward,
                free: { ...reward.free, products: reward.free.products.filter(Boolean) },
            }))
            .sort((a, b) => a.at - b.at);

        setSaving(true);
        setError(null);
        try {
            await saveLoyaltySetting({ target: Number(target), stamp_per: stampPer, rewards: cleaned });
            onDone('Pengaturan loyalty disimpan.');
        } catch (err) {
            setError(getErrorMessage(err, 'Gagal menyimpan pengaturan loyalty'));
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="modal show" role="dialog" aria-modal="true" aria-label="Atur loyalty stamp">
            <div className="box">
                <div className="modal-head">
                    <h3>Atur Loyalty Stamp</h3>
                    <button type="button" className="mclose" aria-label="Tutup" onClick={onClose}>
                        {'\u2715'}
                    </button>
                </div>

                {loading ? (
                    <div className="mini">Memuat{'\u2026'}</div>
                ) : (
                    <>
                        <div className="row">
                            <div className="field">
                                <label htmlFor="loy-target">Target stamp (maks)</label>
                                <input
                                    id="loy-target"
                                    type="number"
                                    min={1}
                                    max={20}
                                    value={target}
                                    onChange={(e) => setTarget(e.target.value)}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="loy-per">Stamp diberikan per</label>
                                <select
                                    id="loy-per"
                                    value={stampPer}
                                    onChange={(e) => setStampPer(e.target.value as 'transaksi' | 'kunjungan')}
                                >
                                    <option value="transaksi">Transaksi</option>
                                    <option value="kunjungan">Kunjungan</option>
                                </select>
                            </div>
                        </div>

                        <div className="field">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                <label style={{ margin: 0 }}>Reward per Titik Stamp</label>
                                <button
                                    type="button"
                                    className="btn ghost sm"
                                    onClick={() => setRewards((prev) => [...prev, emptyReward()])}
                                >
                                    + Tambah Reward
                                </button>
                            </div>

                            {rewards.length === 0 ? (
                                <div className="mini">Belum ada reward. Klik "+ Tambah Reward".</div>
                            ) : (
                                rewards.map((reward, index) => (
                                    <div className="loy-card" key={index}>
                                        <div className="loy-card-hd">
                                            <div>
                                                <b>Reward {index + 1}</b>
                                                &nbsp;<span className="mini">di stamp ke</span>{' '}
                                                <input
                                                    type="number"
                                                    min={1}
                                                    style={{ width: 64 }}
                                                    value={reward.at || ''}
                                                    aria-label={`Titik stamp reward ${index + 1}`}
                                                    onChange={(e) => patch(index, { ...reward, at: Number(e.target.value) })}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                className="loy-x2"
                                                aria-label={`Hapus reward ${index + 1}`}
                                                onClick={() => setRewards((prev) => prev.filter((_, i) => i !== index))}
                                            >
                                                {'\u2715'}
                                            </button>
                                        </div>

                                        <label className="tgl">
                                            <span className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={reward.free.on}
                                                    onChange={(e) =>
                                                        patch(index, { ...reward, free: { ...reward.free, on: e.target.checked } })
                                                    }
                                                />
                                                <span className="slider" />
                                            </span>
                                            <span>Free Service</span>
                                        </label>

                                        {reward.free.on ? (
                                            <div className="loy-free">
                                                {(reward.free.products.length ? reward.free.products : ['']).map((productId, j) => (
                                                    <div className="loy-prow" key={j}>
                                                        <select
                                                            className="loy-prod"
                                                            value={productId}
                                                            aria-label={`Produk reward ${index + 1} baris ${j + 1}`}
                                                            onChange={(e) => {
                                                                const products = reward.free.products.length
                                                                    ? [...reward.free.products]
                                                                    : [''];
                                                                products[j] = e.target.value;
                                                                patch(index, { ...reward, free: { ...reward.free, products } });
                                                            }}
                                                        >
                                                            <option value="">{'\u2014'} pilih produk {'\u2014'}</option>
                                                            {options.map((option) => (
                                                                <option key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <button
                                                            type="button"
                                                            className="loy-prem"
                                                            aria-label="Hapus produk"
                                                            onClick={() =>
                                                                patch(index, {
                                                                    ...reward,
                                                                    free: {
                                                                        ...reward.free,
                                                                        products: reward.free.products.filter((_, k) => k !== j),
                                                                    },
                                                                })
                                                            }
                                                        >
                                                            {'\u2715'}
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    className="btn ghost sm"
                                                    onClick={() =>
                                                        patch(index, {
                                                            ...reward,
                                                            free: { ...reward.free, products: [...reward.free.products, ''] },
                                                        })
                                                    }
                                                >
                                                    + Tambah Produk
                                                </button>
                                            </div>
                                        ) : null}

                                        <label className="tgl">
                                            <span className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={reward.disc.on}
                                                    onChange={(e) =>
                                                        patch(index, { ...reward, disc: { ...reward.disc, on: e.target.checked } })
                                                    }
                                                />
                                                <span className="slider" />
                                            </span>
                                            <span>Extra Discount</span>
                                        </label>

                                        {reward.disc.on ? (
                                            <div className="loy-disc">
                                                <div className="disc-row">
                                                    <input
                                                        inputMode="numeric"
                                                        value={reward.disc.amount || ''}
                                                        placeholder="0"
                                                        aria-label={`Nilai diskon reward ${index + 1}`}
                                                        onChange={(e) =>
                                                            patch(index, {
                                                                ...reward,
                                                                disc: { ...reward.disc, amount: Number(e.target.value.replace(/\D/g, '')) },
                                                            })
                                                        }
                                                    />
                                                    <div className="seg2">
                                                        <button
                                                            type="button"
                                                            className={reward.disc.mode === 'rp' ? 'on' : undefined}
                                                            onClick={() => patch(index, { ...reward, disc: { ...reward.disc, mode: 'rp' } })}
                                                        >
                                                            Rp
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={reward.disc.mode === 'pct' ? 'on' : undefined}
                                                            onClick={() => patch(index, { ...reward, disc: { ...reward.disc, mode: 'pct' } })}
                                                        >
                                                            %
                                                        </button>
                                                    </div>
                                                </div>

                                                {reward.disc.mode === 'pct' ? (
                                                    <div className="loy-basis" style={{ display: 'flex' }}>
                                                        <span className="mini">Dasar % dari:</span>
                                                        <div className="seg2">
                                                            <button
                                                                type="button"
                                                                className={reward.disc.basis === 'before' ? 'on' : undefined}
                                                                onClick={() =>
                                                                    patch(index, { ...reward, disc: { ...reward.disc, basis: 'before' } })
                                                                }
                                                            >
                                                                Sebelum diskon
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className={reward.disc.basis === 'after' ? 'on' : undefined}
                                                                onClick={() =>
                                                                    patch(index, { ...reward, disc: { ...reward.disc, basis: 'after' } })
                                                                }
                                                            >
                                                                Setelah diskon
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : null}
                                            </div>
                                        ) : null}
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mini" style={{ marginBottom: 14 }}>
                            Reward bisa berupa free service dan/atau extra discount, ditaruh di titik stamp tertentu. Aturan detail
                            earn/redeem menyusul.
                        </div>
                    </>
                )}

                {error ? (
                    <div role="alert" style={{ color: 'var(--danger)', fontWeight: 700, fontSize: 13, marginBottom: 10 }}>
                        {error}
                    </div>
                ) : null}

                <div className="modal-foot">
                    <span style={{ flex: 1 }} />
                    <button type="button" className="btn" disabled={saving || loading} onClick={() => void submit()}>
                        {saving ? 'Menyimpan\u2026' : 'Simpan'}
                    </button>
                </div>
            </div>
        </div>
    );
}
