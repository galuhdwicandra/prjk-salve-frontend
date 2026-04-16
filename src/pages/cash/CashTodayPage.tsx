import { useEffect, useMemo, useState } from 'react';
import { getCashToday, type CashTodayMeta } from '../../api/cashSessions';
import { useAuth } from '../../store/useAuth';
import { getErrorMessage } from '../../api/client';
import type { CashSession } from '../../types/cash';

function toIDR(n: number | string | null | undefined) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(n || 0));
}

function toLocalDate(value?: string | null) {
  if (!value) return '-';
  try {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function toLocalDateTime(value?: string | null) {
  if (!value) return '-';
  try {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function getStatusTone(status?: string | null) {
  if (status === 'OPEN') {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }
  if (status === 'CLOSED') {
    return 'bg-slate-100 text-slate-700 border-slate-200';
  }
  return 'bg-amber-50 text-amber-700 border-amber-200';
}

function getDirectionTone(direction?: string | null) {
  return direction === 'IN' ? 'text-emerald-700' : 'text-rose-700';
}

type TodayResponse = {
  session: CashSession | null;
  meta: CashTodayMeta | null;
};

export default function CashTodayPage() {
  const me = useAuth.user;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [state, setState] = useState<TodayResponse>({
    session: null,
    meta: null,
  });

  async function load(withRefreshState = false) {
    if (withRefreshState) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError('');

    try {
      const res = await getCashToday();
      setState({
        session: res.data ?? null,
        meta: res.meta ?? null,
      });
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal memuat kas hari ini.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const session = state.session;
  const meta = state.meta;

  const summary = useMemo(() => {
    return {
      systemClosing: Number(meta?.system_closing ?? 0),
      cashIn: Number(meta?.cash_in_total ?? 0),
      cashOut: Number(meta?.cash_out_total ?? 0),
      withdrawal: Number(meta?.withdrawal_total ?? 0),
      difference: Number(session?.difference_amount ?? 0),
      openingCash: Number(session?.opening_cash ?? 0),
    };
  }, [meta, session]);

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/80 p-5 shadow-[0_18px_48px_-36px_rgba(0,0,0,.65)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(720px 260px at 0% 0%, rgba(79,70,229,0.10) 0%, rgba(79,70,229,0.00) 60%), radial-gradient(520px 220px at 100% 20%, rgba(6,182,212,0.08) 0%, rgba(6,182,212,0.00) 55%)',
          }}
        />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center rounded-full border border-[color:var(--color-border)] bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-muted)]">
              Daily Cash Overview
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[color:var(--color-text-default)]">
              Kas Hari Ini
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-[color:var(--color-text-muted)]">
              Ringkasan kas harian cabang aktif. Halaman ini hanya menampilkan data sesi kas dan mutasi secara baca saja.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center rounded-full border border-[color:var(--color-border)] bg-white/70 px-3 py-1 text-xs text-[color:var(--color-text-muted)]">
              User: <span className="ml-1 font-semibold text-[color:var(--color-text-default)]">{me?.name ?? '-'}</span>
            </div>
            <button
              type="button"
              onClick={() => void load(true)}
              disabled={refreshing}
              className="btn-outline"
            >
              {refreshing ? 'Refresh...' : 'Refresh'}
            </button>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/80 p-5 text-sm text-[color:var(--color-text-muted)]">
          Memuat data kas hari ini...
        </div>
      ) : null}

      {!loading && error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {!loading && !error ? (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Status Sesi"
              value={meta?.has_open_session ? 'Masih Buka' : 'Tidak Ada / Sudah Tutup'}
              subtitle={meta?.business_date ? toLocalDate(meta.business_date) : '-'}
              tone={meta?.has_open_session ? 'success' : 'neutral'}
            />
            <StatCard
              title="Saldo Sistem"
              value={toIDR(summary.systemClosing)}
              subtitle="Perhitungan sistem"
            />
            <StatCard
              title="Kas Masuk"
              value={toIDR(summary.cashIn)}
              subtitle="Akumulasi mutasi masuk"
              tone="success"
            />
            <StatCard
              title="Kas Keluar"
              value={toIDR(summary.cashOut)}
              subtitle="Akumulasi mutasi keluar"
              tone="danger"
            />
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MiniStatCard
              label="Kas Awal"
              value={toIDR(summary.openingCash)}
            />
            <MiniStatCard
              label="Total Withdrawal"
              value={toIDR(summary.withdrawal)}
            />
            <MiniStatCard
              label="Selisih Sesi"
              value={toIDR(summary.difference)}
              valueClassName={summary.difference < 0 ? 'text-rose-700' : 'text-emerald-700'}
            />
            <MiniStatCard
              label="Status Viewer"
              value="Read Only"
            />
          </section>

          <section className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/80 p-5 shadow-[0_18px_48px_-36px_rgba(0,0,0,.65)]">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[color:var(--color-text-default)]">
                  Informasi Sesi
                </h2>
                <p className="text-sm text-[color:var(--color-text-muted)]">
                  Ditampilkan berdasarkan cabang user yang login dan hanya untuk pemantauan operasional.
                </p>
              </div>

              {session?.status ? (
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusTone(session.status)}`}
                >
                  {session.status}
                </span>
              ) : null}
            </div>

            {!session ? (
              <div className="rounded-2xl border border-dashed border-[color:var(--color-border)] bg-white/40 px-4 py-10 text-center text-sm text-[color:var(--color-text-muted)]">
                Belum ada sesi kas untuk hari ini di cabang Anda.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <InfoCard label="Cabang" value={session.branch?.name ?? String(session.branch_id ?? '-')} />
                <InfoCard label="Tanggal Bisnis" value={toLocalDate(session.business_date)} />
                <InfoCard label="Kas Awal" value={toIDR(session.opening_cash)} />
                <InfoCard label="Dibuka Oleh" value={session.opener?.name ?? '-'} />
                <InfoCard label="Waktu Buka" value={toLocalDateTime(session.opened_at)} />
                <InfoCard label="Ditutup Oleh" value={session.closer?.name ?? '-'} />
                <InfoCard label="Waktu Tutup" value={toLocalDateTime(session.closed_at)} />
                <InfoCard label="Kas Fisik Saat Tutup" value={toIDR(session.closing_cash_counted)} />
                <InfoCard
                  label="Selisih"
                  value={toIDR(session.difference_amount)}
                  valueClassName={
                    Number(session.difference_amount ?? 0) < 0
                      ? 'text-rose-700 font-semibold'
                      : 'text-emerald-700 font-semibold'
                  }
                />
                <InfoCard label="Saldo Sistem Hari Ini" value={toIDR(meta?.system_closing ?? 0)} />
                <InfoCard label="Total Withdrawal" value={toIDR(meta?.withdrawal_total ?? 0)} />
                <InfoCard label="Catatan" value={session.notes || '-'} />
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/80 p-5 shadow-[0_18px_48px_-36px_rgba(0,0,0,.65)]">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-[color:var(--color-text-default)]">
                Mutasi Kas
              </h2>
              <p className="text-sm text-[color:var(--color-text-muted)]">
                Hanya tampilan baca. Halaman ini tidak menyediakan aksi withdrawal, buka sesi, atau tutup sesi.
              </p>
            </div>

            {!session?.mutations?.length ? (
              <div className="rounded-2xl border border-dashed border-[color:var(--color-border)] bg-white/40 px-4 py-10 text-center text-sm text-[color:var(--color-text-muted)]">
                Belum ada mutasi kas.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-[color:var(--color-border)]">
                <table className="min-w-full text-sm">
                  <thead className="bg-black/[0.03]">
                    <tr className="text-[color:var(--color-text-muted)]">
                      <Th>Tipe</Th>
                      <Th>Arah</Th>
                      <Th className="text-right">Jumlah</Th>
                      <Th>Referensi</Th>
                      <Th>Catatan</Th>
                      <Th>Dibuat Oleh</Th>
                      <Th>Waktu Efektif</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {session.mutations.map((row) => (
                      <tr
                        key={row.id}
                        className="border-t border-[color:var(--color-border)] bg-white/40 transition-colors hover:bg-black/[0.025]"
                      >
                        <Td>
                          <span className="inline-flex rounded-full border border-[color:var(--color-border)] bg-white px-2.5 py-1 text-xs font-medium">
                            {row.type}
                          </span>
                        </Td>
                        <Td>
                          <span className={`font-semibold ${getDirectionTone(row.direction)}`}>
                            {row.direction}
                          </span>
                        </Td>
                        <Td className={`text-right font-semibold ${getDirectionTone(row.direction)}`}>
                          {toIDR(row.amount)}
                        </Td>
                        <Td className="font-mono text-xs">{row.reference_no || '-'}</Td>
                        <Td className="text-[color:var(--color-text-muted)]">{row.note || '-'}</Td>
                        <Td>{row.creator?.name || '-'}</Td>
                        <Td>{toLocalDateTime(row.effective_at)}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            User login: <strong>{me?.name ?? '-'}</strong>. Halaman ini bersifat read-only untuk operasional kasir.
            Pembukaan sesi, withdrawal, dan penutupan final tetap dilakukan melalui modul Cash Box oleh pihak yang berwenang.
          </section>
        </>
      ) : null}
    </div>
  );
}

function StatCard(props: {
  title: string;
  value: string;
  subtitle?: string;
  tone?: 'default' | 'success' | 'danger' | 'neutral';
}) {
  const toneClass =
    props.tone === 'success'
      ? 'border-emerald-200 bg-emerald-50/70'
      : props.tone === 'danger'
        ? 'border-rose-200 bg-rose-50/70'
        : props.tone === 'neutral'
          ? 'border-slate-200 bg-slate-50/70'
          : 'border-[color:var(--color-border)] bg-white/70';

  return (
    <div className={`rounded-2xl border p-4 shadow-[0_10px_24px_-24px_rgba(0,0,0,.45)] ${toneClass}`}>
      <div className="text-sm text-[color:var(--color-text-muted)]">{props.title}</div>
      <div className="mt-2 text-xl font-semibold text-[color:var(--color-text-default)]">{props.value}</div>
      {props.subtitle ? (
        <div className="mt-1 text-xs text-[color:var(--color-text-muted)]">{props.subtitle}</div>
      ) : null}
    </div>
  );
}

function MiniStatCard(props: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/80 px-4 py-3 shadow-[0_10px_24px_-24px_rgba(0,0,0,.45)]">
      <div className="text-[11px] font-medium uppercase tracking-wide text-[color:var(--color-text-muted)]">
        {props.label}
      </div>
      <div className={`mt-1 text-base font-semibold text-[color:var(--color-text-default)] ${props.valueClassName ?? ''}`}>
        {props.value}
      </div>
    </div>
  );
}

function InfoCard(props: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--color-border)] bg-white/60 p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-[color:var(--color-text-muted)]">
        {props.label}
      </div>
      <div className={`mt-2 text-sm text-[color:var(--color-text-default)] ${props.valueClassName ?? ''}`}>
        {props.value}
      </div>
    </div>
  );
}

function Th({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${className}`}>
      {children}
    </th>
  );
}

function Td({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 align-top ${className}`}>{children}</td>;
}