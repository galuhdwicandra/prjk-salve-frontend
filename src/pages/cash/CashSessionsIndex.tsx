import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  listCashSessions,
  openCashSession,
  closeCashSession,
  createCashWithdrawal,
  getCashSession,
} from '../../api/cashSessions';
import { getErrorMessage } from '../../api/client';
import type { CashSession, CashMutation } from '../../types/cash';
import { listBranches } from '../../api/branches';
import { useAuth } from '../../store/useAuth';

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

function getMutationTone(mutation: CashMutation) {
  if (mutation.direction === 'IN') {
    return 'text-emerald-700';
  }
  return 'text-rose-700';
}

export default function CashSessionsIndex() {
  const me = useAuth.user;
  const isSuperadmin = (me?.roles ?? []).includes('Superadmin');

  const [rows, setRows] = useState<CashSession[]>([]);
  const [branches, setBranches] = useState<Array<{ id: string; name: string }>>([]);
  const [branchId, setBranchId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const [openDate, setOpenDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [openingCash, setOpeningCash] = useState<number>(0);
  const [openNotes, setOpenNotes] = useState('');

  const [selected, setSelected] = useState<CashSession | null>(null);
  const [selectedSystemClosing, setSelectedSystemClosing] = useState<number>(0);
  const [closingCash, setClosingCash] = useState<number>(0);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [withdrawNote, setWithdrawNote] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [submittingOpen, setSubmittingOpen] = useState(false);
  const [submittingClose, setSubmittingClose] = useState(false);
  const [submittingWithdraw, setSubmittingWithdraw] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listCashSessions({
        branch_id: isSuperadmin ? (branchId || undefined) : undefined,
        per_page: 50,
      });
      setRows(res.data ?? []);
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'Gagal memuat daftar sesi kas.'));
    } finally {
      setLoading(false);
    }
  }, [branchId, isSuperadmin]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!isSuperadmin) return;

    listBranches({ per_page: 100 })
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        setBranches(list.map((b: { id: string; name: string }) => ({ id: b.id, name: b.name })));
      })
      .catch(() => {});
  }, [isSuperadmin]);

  const summary = useMemo(() => {
    const totalSessions = rows.length;
    const openSessions = rows.filter((row) => row.status === 'OPEN').length;
    const closedSessions = rows.filter((row) => row.status === 'CLOSED').length;
    const totalOpeningCash = rows.reduce((acc, row) => acc + Number(row.opening_cash ?? 0), 0);

    return {
      totalSessions,
      openSessions,
      closedSessions,
      totalOpeningCash,
    };
  }, [rows]);

  const onOpen = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setSubmittingOpen(true);

    try {
      await openCashSession({
        branch_id: isSuperadmin ? (branchId || undefined) : undefined,
        business_date: openDate,
        opening_cash: Number(openingCash),
        notes: openNotes || null,
      });

      setOpeningCash(0);
      setOpenNotes('');
      setSuccessMsg('Sesi kas berhasil dibuka.');
      await load();
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'Gagal membuka sesi kas.'));
    } finally {
      setSubmittingOpen(false);
    }
  };

  const onSelect = async (id: string) => {
    setErrorMsg('');
    setSuccessMsg('');
    setDetailLoading(true);

    try {
      const res = await getCashSession(id);
      const next = res.data ?? null;

      setSelected(next);
      setSelectedSystemClosing(Number(res.meta?.system_closing ?? 0));
      setClosingCash(Number(next?.closing_cash_counted ?? 0));
      setWithdrawAmount(0);
      setWithdrawNote('');
      setIsModalOpen(true);
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'Gagal mengambil detail sesi kas.'));
    } finally {
      setDetailLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelected(null);
    setSelectedSystemClosing(0);
    setClosingCash(0);
    setWithdrawAmount(0);
    setWithdrawNote('');
  };

  const onCloseSession = async () => {
    if (!selected) return;

    setErrorMsg('');
    setSuccessMsg('');
    setSubmittingClose(true);

    try {
      await closeCashSession(selected.id, {
        closing_cash_counted: Number(closingCash),
        notes: selected.notes || null,
      });

      setSuccessMsg('Sesi kas berhasil ditutup.');
      await load();
      closeModal();
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'Gagal menutup sesi kas.'));
    } finally {
      setSubmittingClose(false);
    }
  };

  const onWithdraw = async () => {
    if (!selected) return;

    setErrorMsg('');
    setSuccessMsg('');
    setSubmittingWithdraw(true);

    try {
      await createCashWithdrawal(selected.id, {
        amount: Number(withdrawAmount),
        note: withdrawNote || null,
      });

      setWithdrawAmount(0);
      setWithdrawNote('');
      setSuccessMsg('Withdrawal berhasil disimpan.');

      await onSelect(selected.id);
      await load();
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'Gagal menyimpan withdrawal.'));
    } finally {
      setSubmittingWithdraw(false);
    }
  };

  const differenceAmount =
    Number(selected?.closing_cash_counted ?? closingCash ?? 0) - Number(selectedSystemClosing ?? 0);

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
              Cash Management
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[color:var(--color-text-default)]">
              Cash Box
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-[color:var(--color-text-muted)]">
              Kelola pembukaan sesi kas, penarikan dana, penutupan kas, dan pantau mutasi kas fisik per cabang.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SummaryCard label="Total Sesi" value={String(summary.totalSessions)} />
            <SummaryCard label="Masih Buka" value={String(summary.openSessions)} />
            <SummaryCard label="Sudah Tutup" value={String(summary.closedSessions)} />
            <SummaryCard label="Total Kas Awal" value={toIDR(summary.totalOpeningCash)} />
          </div>
        </div>
      </section>

      {errorMsg ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMsg}
        </div>
      ) : null}

      {successMsg ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMsg}
        </div>
      ) : null}

      <section className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/80 p-5 shadow-[0_18px_48px_-36px_rgba(0,0,0,.65)]">
        <div className="mb-4 flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-[color:var(--color-text-default)]">Buka Sesi Kas</h2>
          <p className="text-sm text-[color:var(--color-text-muted)]">
            Buat sesi kas baru untuk tanggal operasional yang dipilih.
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
          <div className="grid gap-4 md:grid-cols-2">
            {isSuperadmin ? (
              <label className="space-y-2">
                <span className="text-xs font-medium text-[color:var(--color-text-muted)]">Cabang</span>
                <select
                  className="input"
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                >
                  <option value="">-- Pilih Cabang --</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            <label className="space-y-2">
              <span className="text-xs font-medium text-[color:var(--color-text-muted)]">Tanggal Bisnis</span>
              <input
                className="input"
                type="date"
                value={openDate}
                onChange={(e) => setOpenDate(e.target.value)}
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-xs font-medium text-[color:var(--color-text-muted)]">Kas Awal</span>
              <input
                className="input"
                type="number"
                min={0}
                value={openingCash}
                onChange={(e) => setOpeningCash(Number(e.target.value))}
                placeholder="Masukkan modal awal kas"
              />
              <div className="text-xs text-[color:var(--color-text-muted)]">
                Nilai saat ini: <span className="font-semibold">{toIDR(openingCash)}</span>
              </div>
            </label>
          </div>

          <div className="space-y-4">
            <label className="block space-y-2">
              <span className="text-xs font-medium text-[color:var(--color-text-muted)]">Catatan</span>
              <textarea
                className="input min-h-32"
                value={openNotes}
                onChange={(e) => setOpenNotes(e.target.value)}
                placeholder="Catatan sesi kas (opsional)"
              />
            </label>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[color:var(--color-border)] bg-white/60 px-4 py-3">
              <div>
                <div className="text-sm font-medium text-[color:var(--color-text-default)]">Siap membuka sesi?</div>
                <div className="text-xs text-[color:var(--color-text-muted)]">
                  Pastikan tanggal bisnis dan kas awal sudah benar.
                </div>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={onOpen}
                disabled={submittingOpen}
              >
                {submittingOpen ? 'Menyimpan...' : 'Buka Sesi'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/80 p-5 shadow-[0_18px_48px_-36px_rgba(0,0,0,.65)]">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[color:var(--color-text-default)]">Daftar Sesi</h2>
            <p className="text-sm text-[color:var(--color-text-muted)]">
              Riwayat sesi kas yang dapat dibuka untuk melihat detail mutasi dan penutupan.
            </p>
          </div>
          <div className="inline-flex items-center rounded-full border border-[color:var(--color-border)] bg-white/70 px-3 py-1 text-xs text-[color:var(--color-text-muted)]">
            {loading ? 'Memuat data...' : `${rows.length} sesi`}
          </div>
        </div>

        {!loading && rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[color:var(--color-border)] bg-white/40 px-4 py-10 text-center text-sm text-[color:var(--color-text-muted)]">
            Belum ada sesi kas.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[color:var(--color-border)]">
            <table className="min-w-full text-sm">
              <thead className="bg-black/[0.03]">
                <tr className="text-[color:var(--color-text-muted)]">
                  <Th>Tanggal</Th>
                  <Th>Cabang</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Kas Awal</Th>
                  <Th className="text-right">Kas Sistem</Th>
                  <Th className="text-right">Kas Fisik</Th>
                  <Th className="text-right">Selisih</Th>
                  <Th className="text-right">Aksi</Th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => <RowSkeleton key={i} />)
                  : rows.map((row) => (
                      <tr
                        key={row.id}
                        className="border-t border-[color:var(--color-border)] bg-white/40 transition-colors hover:bg-black/[0.025]"
                      >
                        <Td>
                          <div className="font-medium text-[color:var(--color-text-default)]">
                            {toLocalDate(row.business_date)}
                          </div>
                          <div className="text-xs text-[color:var(--color-text-muted)]">
                            Dibuka: {toLocalDateTime(row.opened_at)}
                          </div>
                        </Td>
                        <Td>
                          <div className="font-medium text-[color:var(--color-text-default)]">
                            {row.branch?.name ?? '-'}
                          </div>
                          <div className="text-xs text-[color:var(--color-text-muted)]">
                            Oleh: {row.opener?.name ?? '-'}
                          </div>
                        </Td>
                        <Td>
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusTone(row.status)}`}
                          >
                            {row.status}
                          </span>
                        </Td>
                        <Td className="text-right font-medium">{toIDR(row.opening_cash)}</Td>
                        <Td className="text-right">{toIDR(row.closing_cash_system)}</Td>
                        <Td className="text-right">{toIDR(row.closing_cash_counted)}</Td>
                        <Td className="text-right">
                          <span
                            className={
                              Number(row.difference_amount ?? 0) < 0
                                ? 'font-semibold text-rose-700'
                                : 'font-semibold text-emerald-700'
                            }
                          >
                            {toIDR(row.difference_amount)}
                          </span>
                        </Td>
                        <Td className="text-right">
                          <button
                            type="button"
                            className="btn-outline text-xs"
                            onClick={() => void onSelect(row.id)}
                          >
                            Detail
                          </button>
                        </Td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[0_30px_80px_-30px_rgba(0,0,0,.65)]">
            <div className="flex items-center justify-between border-b border-[color:var(--color-border)] px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold text-[color:var(--color-text-default)]">
                  Detail Sesi Kas
                </h3>
                <p className="text-sm text-[color:var(--color-text-muted)]">
                  Lihat ringkasan ledger, lakukan withdrawal, dan tutup sesi jika diperlukan.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[color:var(--color-border)] bg-white/70 text-[color:var(--color-text-default)] hover:bg-white"
                onClick={closeModal}
              >
                ✕
              </button>
            </div>

            {detailLoading ? (
              <div className="p-6 text-sm text-[color:var(--color-text-muted)]">Memuat detail sesi...</div>
            ) : selected ? (
              <div className="grid max-h-[calc(92vh-81px)] gap-0 overflow-y-auto lg:grid-cols-[360px_1fr]">
                <aside className="border-b border-[color:var(--color-border)] bg-black/[0.02] p-5 lg:border-b-0 lg:border-r">
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-[color:var(--color-border)] bg-white/70 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="text-sm font-semibold text-[color:var(--color-text-default)]">
                          Ringkasan Sesi
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusTone(selected.status)}`}
                        >
                          {selected.status}
                        </span>
                      </div>

                      <div className="space-y-3 text-sm">
                        <InfoRow label="Tanggal Bisnis" value={toLocalDate(selected.business_date)} />
                        <InfoRow label="Cabang" value={selected.branch?.name ?? '-'} />
                        <InfoRow label="Dibuka Oleh" value={selected.opener?.name ?? '-'} />
                        <InfoRow label="Ditutup Oleh" value={selected.closer?.name ?? '-'} />
                        <InfoRow label="Kas Awal" value={toIDR(selected.opening_cash)} strong />
                        <InfoRow label="Kas Sistem" value={toIDR(selectedSystemClosing)} strong />
                        <InfoRow
                          label="Kas Fisik"
                          value={toIDR(selected.closing_cash_counted)}
                          strong
                        />
                        <InfoRow
                          label="Selisih"
                          value={toIDR(differenceAmount)}
                          strong
                          valueClassName={
                            differenceAmount < 0 ? 'text-rose-700 font-semibold' : 'text-emerald-700 font-semibold'
                          }
                        />
                      </div>

                      {selected.notes ? (
                        <div className="mt-4 rounded-xl border border-[color:var(--color-border)] bg-black/[0.02] p-3 text-sm text-[color:var(--color-text-muted)]">
                          <div className="mb-1 text-xs font-semibold uppercase tracking-wide">Catatan</div>
                          <div>{selected.notes}</div>
                        </div>
                      ) : null}
                    </div>

                    {selected.status === 'OPEN' ? (
                      <>
                        <div className="rounded-2xl border border-[color:var(--color-border)] bg-white/70 p-4">
                          <div className="mb-3">
                            <div className="text-sm font-semibold text-[color:var(--color-text-default)]">
                              Withdrawal
                            </div>
                            <div className="text-xs text-[color:var(--color-text-muted)]">
                              Catat pengeluaran kas dari sesi yang sedang berjalan.
                            </div>
                          </div>

                          <div className="space-y-3">
                            <label className="block space-y-2">
                              <span className="text-xs font-medium text-[color:var(--color-text-muted)]">
                                Nominal
                              </span>
                              <input
                                className="input"
                                type="number"
                                min={0}
                                value={withdrawAmount}
                                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                              />
                            </label>

                            <label className="block space-y-2">
                              <span className="text-xs font-medium text-[color:var(--color-text-muted)]">
                                Catatan Withdrawal
                              </span>
                              <textarea
                                className="input min-h-24"
                                value={withdrawNote}
                                onChange={(e) => setWithdrawNote(e.target.value)}
                                placeholder="Contoh: setor ke owner, operasional mendesak, dll."
                              />
                            </label>

                            <button
                              type="button"
                              className="btn-outline w-full justify-center"
                              onClick={onWithdraw}
                              disabled={submittingWithdraw}
                            >
                              {submittingWithdraw ? 'Menyimpan...' : 'Simpan Withdrawal'}
                            </button>
                          </div>
                        </div>

                        <div className="rounded-2xl border border-[color:var(--color-border)] bg-white/70 p-4">
                          <div className="mb-3">
                            <div className="text-sm font-semibold text-[color:var(--color-text-default)]">
                              Tutup Sesi
                            </div>
                            <div className="text-xs text-[color:var(--color-text-muted)]">
                              Isi nominal kas fisik yang benar-benar dihitung.
                            </div>
                          </div>

                          <div className="space-y-3">
                            <label className="block space-y-2">
                              <span className="text-xs font-medium text-[color:var(--color-text-muted)]">
                                Kas Fisik Dihitung
                              </span>
                              <input
                                className="input"
                                type="number"
                                min={0}
                                value={closingCash}
                                onChange={(e) => setClosingCash(Number(e.target.value))}
                              />
                            </label>

                            <div className="rounded-xl border border-[color:var(--color-border)] bg-black/[0.02] p-3 text-sm">
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-[color:var(--color-text-muted)]">Estimasi selisih</span>
                                <span
                                  className={
                                    closingCash - selectedSystemClosing < 0
                                      ? 'font-semibold text-rose-700'
                                      : 'font-semibold text-emerald-700'
                                  }
                                >
                                  {toIDR(closingCash - selectedSystemClosing)}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              className="btn-primary w-full justify-center"
                              onClick={onCloseSession}
                              disabled={submittingClose}
                            >
                              {submittingClose ? 'Menutup sesi...' : 'Tutup Sesi'}
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="rounded-2xl border border-[color:var(--color-border)] bg-white/70 p-4 text-sm text-[color:var(--color-text-muted)]">
                        Sesi ini sudah ditutup, sehingga withdrawal dan penutupan ulang tidak tersedia.
                      </div>
                    )}
                  </div>
                </aside>

                <section className="p-5">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-base font-semibold text-[color:var(--color-text-default)]">
                        Ledger Mutasi Kas
                      </h4>
                      <p className="text-sm text-[color:var(--color-text-muted)]">
                        Urutan mutasi mengikuti waktu efektif dan waktu pembuatan terbaru.
                      </p>
                    </div>
                    <div className="inline-flex items-center rounded-full border border-[color:var(--color-border)] bg-white/70 px-3 py-1 text-xs text-[color:var(--color-text-muted)]">
                      {selected.mutations?.length ?? 0} mutasi
                    </div>
                  </div>

                  {!selected.mutations || selected.mutations.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[color:var(--color-border)] bg-white/40 px-4 py-10 text-center text-sm text-[color:var(--color-text-muted)]">
                      Belum ada mutasi pada sesi ini.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-[color:var(--color-border)]">
                      <table className="min-w-full text-sm">
                        <thead className="bg-black/[0.03]">
                          <tr className="text-[color:var(--color-text-muted)]">
                            <Th>Waktu</Th>
                            <Th>Tipe</Th>
                            <Th>Arah</Th>
                            <Th className="text-right">Nominal</Th>
                            <Th>Referensi</Th>
                            <Th>Catatan</Th>
                            <Th>Dibuat Oleh</Th>
                          </tr>
                        </thead>
                        <tbody>
                          {selected.mutations.map((m) => (
                            <tr
                              key={m.id}
                              className="border-t border-[color:var(--color-border)] bg-white/40"
                            >
                              <Td>
                                <div className="font-medium text-[color:var(--color-text-default)]">
                                  {toLocalDateTime(m.effective_at)}
                                </div>
                              </Td>
                              <Td>
                                <span className="inline-flex rounded-full border border-[color:var(--color-border)] bg-white px-2.5 py-1 text-xs font-medium">
                                  {m.type}
                                </span>
                              </Td>
                              <Td>
                                <span
                                  className={`font-semibold ${m.direction === 'IN' ? 'text-emerald-700' : 'text-rose-700'}`}
                                >
                                  {m.direction}
                                </span>
                              </Td>
                              <Td className={`text-right font-semibold ${getMutationTone(m)}`}>
                                {toIDR(m.amount)}
                              </Td>
                              <Td className="font-mono text-xs">{m.reference_no || '-'}</Td>
                              <Td className="text-[color:var(--color-text-muted)]">{m.note || '-'}</Td>
                              <Td>{m.creator?.name ?? '-'}</Td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              </div>
            ) : (
              <div className="p-6 text-sm text-[color:var(--color-text-muted)]">
                Data sesi kas tidak ditemukan.
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[color:var(--color-border)] bg-white/70 px-4 py-3 shadow-[0_10px_24px_-24px_rgba(0,0,0,.45)]">
      <div className="text-[11px] font-medium uppercase tracking-wide text-[color:var(--color-text-muted)]">
        {label}
      </div>
      <div className="mt-1 text-base font-semibold text-[color:var(--color-text-default)]">
        {value}
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  strong = false,
  valueClassName = '',
}: {
  label: string;
  value: string;
  strong?: boolean;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-[color:var(--color-text-muted)]">{label}</span>
      <span
        className={[
          'text-right text-[color:var(--color-text-default)]',
          strong ? 'font-semibold' : '',
          valueClassName,
        ].join(' ')}
      >
        {value}
      </span>
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

function RowSkeleton() {
  return (
    <tr className="border-t border-[color:var(--color-border)]">
      <td className="px-4 py-4"><div className="h-4 w-28 animate-pulse rounded bg-black/10" /></td>
      <td className="px-4 py-4"><div className="h-4 w-24 animate-pulse rounded bg-black/10" /></td>
      <td className="px-4 py-4"><div className="h-6 w-16 animate-pulse rounded-full bg-black/10" /></td>
      <td className="px-4 py-4 text-right"><div className="ml-auto h-4 w-24 animate-pulse rounded bg-black/10" /></td>
      <td className="px-4 py-4 text-right"><div className="ml-auto h-4 w-24 animate-pulse rounded bg-black/10" /></td>
      <td className="px-4 py-4 text-right"><div className="ml-auto h-4 w-24 animate-pulse rounded bg-black/10" /></td>
      <td className="px-4 py-4 text-right"><div className="ml-auto h-4 w-20 animate-pulse rounded bg-black/10" /></td>
      <td className="px-4 py-4 text-right"><div className="ml-auto h-8 w-20 animate-pulse rounded-xl bg-black/10" /></td>
    </tr>
  );
}