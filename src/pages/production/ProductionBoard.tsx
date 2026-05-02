import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    approveProductionCorrectionRequest,
    createProductionCorrectionRequest,
    finishProductionTask,
    getProductionBoard,
    listProductionCorrectionRequests,
    moveProductionTask,
    rejectProductionCorrectionRequest,
    startProductionTask,
} from '../../api/production';
import { normalizeApiError } from '../../api/client';
import { listBranches } from '../../api/branches';
import { listUsers } from '../../api/users';
import { useAuth } from '../../store/useAuth';
import type { Branch } from '../../types/branches';
import type { User } from '../../types/users';
import type {
    ProductionBoardColumns,
    ProductionBoardFilterStatus,
    ProductionBoardStatus,
    ProductionCorrectionRequest,
    ProductionCorrectionType,
    ProductionStatus,
    ProductionTask,
} from '../../types/production';
import { Link } from 'react-router-dom';
import { useHasRole } from '../../store/useAuth';

const BOARD_COLUMNS: Array<{
    status: ProductionBoardStatus;
    title: string;
    description: string;
}> = [
        { status: 'QUEUE', title: 'Antrian', description: 'Belum diambil petugas' },
        { status: 'WASHING', title: 'Sedang Dicuci', description: 'Proses cuci berjalan' },
        { status: 'DRYING', title: 'Pengeringan', description: 'Masuk tahap pengeringan' },
        { status: 'IRONING', title: 'Finishing', description: 'Setrika / finishing' },
        { status: 'READY', title: 'Selesai', description: 'Siap diambil pelanggan' },
    ];

const NEXT_STATUS: Partial<Record<ProductionStatus, ProductionStatus>> = {
    QUEUE: 'WASHING',
    WASHING: 'DRYING',
    DRYING: 'IRONING',
    IRONING: 'READY',
};

const PREVIOUS_STATUS: Partial<Record<ProductionStatus, ProductionStatus>> = {
    WASHING: 'QUEUE',
    DRYING: 'WASHING',
    IRONING: 'DRYING',
    READY: 'IRONING',
};

function correctionLabel(type: ProductionCorrectionType): string {
    return type === 'REWASH' ? 'Cuci Ulang' : 'Kembali Tahap';
}

function emptyColumns(): ProductionBoardColumns {
    return {
        QUEUE: [],
        WASHING: [],
        DRYING: [],
        IRONING: [],
        READY: [],
    };
}

function formatDate(value?: string | null): string {
    if (!value) return '-';
    return value;
}

function statusLabel(status: ProductionStatus): string {
    const labels: Record<ProductionStatus, string> = {
        QUEUE: 'Antrian',
        WASHING: 'Sedang Dicuci',
        DRYING: 'Pengeringan',
        IRONING: 'Finishing',
        READY: 'Selesai',
        PICKED_UP: 'Diambil',
        CANCELED: 'Dibatalkan',
    };

    return labels[status] ?? status;
}

function statusBadgeClass(status: ProductionStatus): string {
    const base = 'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset';

    if (status === 'READY') return `${base} bg-emerald-50 text-emerald-700 ring-emerald-200`;
    if (status === 'WASHING' || status === 'DRYING' || status === 'IRONING') {
        return `${base} bg-amber-50 text-amber-700 ring-amber-200`;
    }
    if (status === 'CANCELED') return `${base} bg-red-50 text-red-700 ring-red-200`;
    if (status === 'PICKED_UP') return `${base} bg-slate-900 text-white ring-slate-900`;

    return `${base} bg-slate-50 text-slate-700 ring-slate-200`;
}

export default function ProductionBoard() {
    const [columns, setColumns] = useState<ProductionBoardColumns>(() => emptyColumns());
    const [q, setQ] = useState('');
    const [status, setStatus] = useState<'' | ProductionBoardFilterStatus>('');
    const [branchId, setBranchId] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [branches, setBranches] = useState<Branch[]>([]);
    const [staffOptions, setStaffOptions] = useState<User[]>([]);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [meta, setMeta] = useState({
        current_page: 1,
        per_page: 20,
        total: 0,
        last_page: 1,
    });
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const isManager = useHasRole(['Superadmin', 'Admin Cabang']);
    const [correctionRequests, setCorrectionRequests] = useState<ProductionCorrectionRequest[]>([]);
    const [correctionLoading, setCorrectionLoading] = useState<string | null>(null);
    const [correctionModal, setCorrectionModal] = useState<{
        task: ProductionTask;
        type: ProductionCorrectionType;
        direct: boolean;
    } | null>(null);

    const totalTasks = useMemo(
        () => Object.values(columns).reduce((total, rows) => total + rows.length, 0),
        [columns]
    );
    const isSuperadmin = useAuth.hasRole('Superadmin');

    const canGoPrev = meta.current_page > 1;
    const canGoNext = meta.current_page < meta.last_page;

    const loadFilterOptions = useCallback(async () => {
        if (!isSuperadmin) return;

        try {
            const [branchResponse, userResponse] = await Promise.all([
                listBranches({ per_page: 100 }),
                listUsers({
                    role: 'Petugas Cuci',
                    branch_id: branchId || undefined,
                    per_page: 100,
                }),
            ]);

            setBranches(branchResponse.data ?? []);
            setStaffOptions(userResponse.data ?? []);
        } catch (err) {
            const normalized = normalizeApiError(err);
            setError(normalized.message);
        }
    }, [isSuperadmin, branchId]);

    useEffect(() => {
        void loadFilterOptions();
    }, [loadFilterOptions]);

    useEffect(() => {
        setAssignedTo('');
    }, [branchId]);

    const loadBoard = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await getProductionBoard({
                q: q.trim() || undefined,
                status: status || undefined,
                branch_id: isSuperadmin && branchId ? branchId : undefined,
                assigned_to: isSuperadmin && assignedTo ? assignedTo : undefined,
                page,
                per_page: perPage,
            });

            setColumns(response.data?.columns ?? emptyColumns());
            setMeta({
                current_page: response.meta?.current_page ?? 1,
                per_page: response.meta?.per_page ?? perPage,
                total: response.meta?.total ?? 0,
                last_page: response.meta?.last_page ?? 1,
            });
        } catch (err) {
            const normalized = normalizeApiError(err);
            setError(normalized.message);
        } finally {
            setLoading(false);
        }
    }, [q, status, branchId, assignedTo, page, perPage, isSuperadmin]);

    const loadCorrectionRequests = useCallback(async () => {
        try {
            const response = await listProductionCorrectionRequests({
                status: 'PENDING',
                per_page: 50,
            });

            setCorrectionRequests(response.data ?? []);
        } catch (err) {
            const normalized = normalizeApiError(err);
            setError(normalized.message);
        }
    }, []);

    useEffect(() => {
        void loadBoard();
        void loadCorrectionRequests();
    }, [loadBoard, loadCorrectionRequests]);

    useEffect(() => {
        setPage(1);
    }, [q, status, branchId, assignedTo, perPage]);

    useEffect(() => {
        const timer = window.setInterval(() => {
            void loadBoard();
            void loadCorrectionRequests();
        }, 10000);

        return () => window.clearInterval(timer);
    }, [loadBoard, loadCorrectionRequests]);

    async function handleStart(task: ProductionTask) {
        if (!task.order_id) return;

        setActionLoading(task.id);
        setError(null);

        try {
            await startProductionTask(task.order_id);
            await loadBoard();
        } catch (err) {
            const normalized = normalizeApiError(err);
            setError(normalized.message);
        } finally {
            setActionLoading(null);
        }
    }

    async function handleMove(task: ProductionTask, toStatus: ProductionStatus) {
        if (!task.order_id) return;

        setActionLoading(task.id);
        setError(null);

        try {
            if (toStatus === 'READY') {
                await finishProductionTask(task.order_id);
            } else {
                await moveProductionTask(task.order_id, { to_status: toStatus });
            }

            await loadBoard();
        } catch (err) {
            const normalized = normalizeApiError(err);
            setError(normalized.message);
        } finally {
            setActionLoading(null);
        }
    }

    async function handleSubmitCorrection(reason: string) {
        if (!correctionModal?.task.order_id) return;

        const target = correctionModal.task;
        setCorrectionLoading(target.id);
        setError(null);

        try {
            await createProductionCorrectionRequest(target.order_id, {
                type: correctionModal.type,
                reason,
                direct: correctionModal.direct,
            });

            setCorrectionModal(null);
            await loadBoard();
            await loadCorrectionRequests();
        } catch (err) {
            const normalized = normalizeApiError(err);
            setError(normalized.message);
        } finally {
            setCorrectionLoading(null);
        }
    }

    async function handleApproveCorrection(item: ProductionCorrectionRequest) {
        setCorrectionLoading(item.id);
        setError(null);

        try {
            await approveProductionCorrectionRequest(item.id);
            await loadBoard();
            await loadCorrectionRequests();
        } catch (err) {
            const normalized = normalizeApiError(err);
            setError(normalized.message);
        } finally {
            setCorrectionLoading(null);
        }
    }

    async function handleRejectCorrection(item: ProductionCorrectionRequest) {
        const note = window.prompt('Catatan penolakan pengajuan:') ?? '';

        setCorrectionLoading(item.id);
        setError(null);

        try {
            await rejectProductionCorrectionRequest(item.id, {
                review_note: note.trim() || null,
            });
            await loadCorrectionRequests();
        } catch (err) {
            const normalized = normalizeApiError(err);
            setError(normalized.message);
        } finally {
            setCorrectionLoading(null);
        }
    }

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                        Live Cucian
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Pantau antrian cucian, petugas yang mengerjakan, dan status produksi per invoice.
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Link
                        to="/production-board/reports"
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Lihat Laporan Cucian
                    </Link>

                    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
                        <div className="text-slate-500">Total cucian aktif</div>
                        <div className="mt-1 text-2xl font-semibold text-slate-950">{totalTasks}</div>
                    </div>
                </div>
            </div>

            {isManager && correctionRequests.length > 0 ? (
                <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
                    <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-sm font-semibold text-amber-900">
                                Pengajuan Koreksi Cucian
                            </h2>
                            <p className="text-xs text-amber-700">
                                Ada {correctionRequests.length} pengajuan cuci ulang / kembali tahap yang menunggu approval.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-3 lg:grid-cols-2">
                        {correctionRequests.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-2xl border border-amber-200 bg-white p-3 text-xs shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="font-semibold text-slate-950">
                                            {item.order?.invoice_no ?? '-'}
                                        </div>
                                        <div className="mt-0.5 text-slate-500">
                                            {item.order?.customer?.name ?? '-'} • {correctionLabel(item.type)}
                                        </div>
                                    </div>
                                    <span className="rounded-full bg-amber-100 px-2 py-1 font-semibold text-amber-800">
                                        PENDING
                                    </span>
                                </div>

                                <div className="mt-2 text-slate-600">
                                    {statusLabel(item.from_status)} → {statusLabel(item.to_status)}
                                </div>

                                <div className="mt-2 rounded-xl bg-slate-50 p-2 text-slate-700">
                                    {item.reason}
                                </div>

                                <div className="mt-2 text-slate-500">
                                    Diajukan oleh: {item.requester?.name ?? '-'}
                                </div>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => void handleApproveCorrection(item)}
                                        disabled={correctionLoading === item.id}
                                        className="inline-flex flex-1 items-center justify-center rounded-xl bg-slate-900 px-3 py-2 font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {correctionLoading === item.id ? 'Proses...' : 'Approve'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => void handleRejectCorrection(item)}
                                        disabled={correctionLoading === item.id}
                                        className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ) : null}

            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
                <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
                    <input
                        value={q}
                        onChange={(event) => setQ(event.target.value)}
                        placeholder="Cari invoice, no order, atau customer..."
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 sm:max-w-md"
                    />

                    <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value as '' | ProductionBoardFilterStatus)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 sm:w-48"
                    >
                        <option value="">Semua Status</option>
                        <option value="OVERDUE">Terlambat</option>
                        <option value="QUEUE">Antrian</option>
                        <option value="WASHING">Sedang Dicuci</option>
                        <option value="DRYING">Pengeringan</option>
                        <option value="IRONING">Finishing</option>
                        <option value="READY">Selesai</option>
                    </select>

                    {isSuperadmin ? (
                        <select
                            value={branchId}
                            onChange={(event) => setBranchId(event.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 sm:w-56"
                        >
                            <option value="">Semua Cabang</option>
                            {branches.map((branch) => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.name}
                                </option>
                            ))}
                        </select>
                    ) : null}

                    {isSuperadmin ? (
                        <select
                            value={assignedTo}
                            onChange={(event) => setAssignedTo(event.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 sm:w-56"
                        >
                            <option value="">Semua Petugas</option>
                            {staffOptions.map((staff) => (
                                <option key={staff.id} value={staff.id}>
                                    {staff.name}
                                </option>
                            ))}
                        </select>
                    ) : null}

                    <select
                        value={perPage}
                        onChange={(event) => setPerPage(Number(event.target.value))}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 sm:w-36"
                    >
                        <option value={10}>10 / halaman</option>
                        <option value={20}>20 / halaman</option>
                        <option value={50}>50 / halaman</option>
                        <option value={100}>100 / halaman</option>
                    </select>
                </div>

                <button
                    type="button"
                    onClick={() => void loadBoard()}
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? 'Memuat...' : 'Refresh'}
                </button>
            </div>

            {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            ) : null}

            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="text-slate-600">
                    Menampilkan <span className="font-semibold text-slate-900">{totalTasks}</span> data dari{' '}
                    <span className="font-semibold text-slate-900">{meta.total}</span> total cucian aktif.
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <button
                        type="button"
                        onClick={() => setPage((current) => Math.max(1, current - 1))}
                        disabled={!canGoPrev || loading}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Sebelumnya
                    </button>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-center text-sm font-semibold text-slate-700">
                        Halaman {meta.current_page} dari {meta.last_page}
                    </div>

                    <button
                        type="button"
                        onClick={() => setPage((current) => Math.min(meta.last_page, current + 1))}
                        disabled={!canGoNext || loading}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Berikutnya
                    </button>
                </div>
            </div>

            <div className="space-y-5">
                {BOARD_COLUMNS.map((column) => {
                    const tasks = columns[column.status] ?? [];

                    return (
                        <section
                            key={column.status}
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
                        >
                            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <h2 className="text-base font-semibold text-slate-950">
                                        {column.title}
                                    </h2>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        {column.description}
                                    </p>
                                </div>

                                <span className="inline-flex w-fit rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                                    {tasks.length} order
                                </span>
                            </div>

                            {tasks.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-400">
                                    Tidak ada data.
                                </div>
                            ) : (
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                                    {tasks.map((task) => (
                                        <ProductionCard
                                            key={task.id}
                                            task={task}
                                            loading={actionLoading === task.id || correctionLoading === task.id}
                                            isManager={isManager}
                                            hasPendingCorrection={correctionRequests.some((item) => item.order_id === task.order_id)}
                                            onStart={() => void handleStart(task)}
                                            onMove={(toStatus) => void handleMove(task, toStatus)}
                                            onCorrection={(type, direct) => setCorrectionModal({ task, type, direct })}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>
                    );
                })}
            </div>
            <CorrectionReasonModal
                open={!!correctionModal}
                title={
                    correctionModal
                        ? `${correctionModal.direct ? '' : 'Ajukan '}${correctionLabel(correctionModal.type)}`
                        : 'Koreksi Cucian'
                }
                loading={!!correctionModal && correctionLoading === correctionModal.task.id}
                onSubmit={(reason) => void handleSubmitCorrection(reason)}
                onClose={() => setCorrectionModal(null)}
            />
        </div>
    );
}

function ProductionCard(props: {
    task: ProductionTask;
    loading: boolean;
    isManager: boolean;
    hasPendingCorrection: boolean;
    onStart: () => void;
    onMove: (toStatus: ProductionStatus) => void;
    onCorrection: (type: ProductionCorrectionType, direct: boolean) => void;
}) {
    const { task, loading, isManager, hasPendingCorrection, onStart, onMove, onCorrection } = props;
    const order = task.order;
    const nextStatus = NEXT_STATUS[task.current_status];

    return (
        <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-950">
                        {order?.invoice_no ?? '-'}
                    </div>
                    <div className="mt-0.5 truncate text-xs text-slate-500">
                        No Order: {order?.number ?? '-'}
                    </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className={statusBadgeClass(task.current_status)}>
                        {statusLabel(task.current_status)}
                    </span>

                    {hasPendingCorrection ? (
                        <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">
                            Menunggu Approval
                        </span>
                    ) : null}
                </div>
            </div>

            <div className="mt-4 space-y-2 text-xs">
                <InfoRow label="Customer" value={order?.customer?.name ?? '-'} />
                <InfoRow label="Total Qty" value={String(task.qty ?? 0)} />
                <InfoRow label="Petugas Cuci" value={task.assignee?.name ?? 'Belum diambil'} />
                <InfoRow label="Tanggal Masuk" value={formatDate(order?.received_at)} />
                <InfoRow label="Target Selesai" value={formatDate(order?.ready_at)} />
                <InfoRow label="Tanggal Selesai Aktual" value={formatDate(task.finished_date)} />
            </div>

            <div className="mt-auto flex flex-wrap gap-2 pt-4">
                {task.current_status === 'QUEUE' ? (
                    <button
                        type="button"
                        onClick={onStart}
                        disabled={loading}
                        className="inline-flex flex-1 items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? 'Proses...' : 'Ambil Cucian'}
                    </button>
                ) : null}

                {task.current_status !== 'QUEUE' && nextStatus ? (
                    <button
                        type="button"
                        onClick={() => onMove(nextStatus)}
                        disabled={loading}
                        className="inline-flex flex-1 items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? 'Proses...' : nextStatus === 'READY' ? 'Tandai Selesai' : `Pindah ke ${statusLabel(nextStatus)}`}
                    </button>
                ) : null}
                {task.current_status !== 'QUEUE' && task.current_status !== 'PICKED_UP' && task.current_status !== 'CANCELED' ? (
                    <>
                        {task.current_status !== 'WASHING' ? (
                            <button
                                type="button"
                                onClick={() => onCorrection('REWASH', isManager)}
                                disabled={loading || hasPendingCorrection}
                                className="inline-flex flex-1 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isManager ? 'Cuci Ulang' : 'Ajukan Cuci Ulang'}
                            </button>
                        ) : null}

                        {PREVIOUS_STATUS[task.current_status] ? (
                            <button
                                type="button"
                                onClick={() => onCorrection('ROLLBACK', isManager)}
                                disabled={loading || hasPendingCorrection}
                                className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isManager ? 'Kembali Tahap' : 'Ajukan Kembali Tahap'}
                            </button>
                        ) : null}
                    </>
                ) : null}
            </div>
        </article>
    );
}

function InfoRow(props: { label: string; value: string }) {
    return (
        <div className="flex items-start justify-between gap-3">
            <span className="shrink-0 text-slate-500">{props.label}</span>
            <span className="text-right font-medium text-slate-800">{props.value}</span>
        </div>
    );
}

function CorrectionReasonModal(props: {
    open: boolean;
    title: string;
    loading: boolean;
    onSubmit: (reason: string) => void;
    onClose: () => void;
}) {
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (props.open) {
            setReason('');
        }
    }, [props.open]);

    if (!props.open) return null;

    const canSubmit = reason.trim().length >= 3;

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 backdrop-blur-[1px] sm:items-center"
            role="dialog"
            aria-modal="true"
            onClick={() => {
                if (!props.loading) props.onClose();
            }}
        >
            <div
                className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div>
                    <h2 className="text-base font-semibold text-slate-950">
                        {props.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Isi catatan alasan agar histori koreksi cucian jelas.
                    </p>
                </div>

                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                    placeholder="Contoh: Noda masih terlihat, perlu dicuci ulang."
                    className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                />

                <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={props.onClose}
                        disabled={props.loading}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={() => props.onSubmit(reason.trim())}
                        disabled={!canSubmit || props.loading}
                        className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {props.loading ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </div>
        </div>
    );
}