import { createOrder, createOrderPayment } from '../api/orders';
import { uploadOrderPhotos } from '../api/orderPhotos';
import { applyVoucherToOrder } from '../api/vouchers';
import { normalizeApiError } from '../api/client';
import type { OrderCreatePayload } from '../types/orders';
import type { PaymentCreatePayload } from '../types/payments';

export interface QueuedOrder {
  id: string;
  payload: OrderCreatePayload;
  payment: PaymentCreatePayload | null;
  voucherCode: string | null;
  beforeFiles: File[];
  orderId: string | null;
  error: string | null;
  createdAt: number;
}

export type NewQueuedOrder = Pick<QueuedOrder, 'payload' | 'payment' | 'voucherCode' | 'beforeFiles'>;

const DB_NAME = 'salve-offline';
const STORE = 'orders';

const listeners = new Set<() => void>();
let pendingCount = 0;
let failedCount = 0;
let flushing = false;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'id' });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx<T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest
): Promise<T> {
  const db = await openDb();

  return new Promise<T>((resolve, reject) => {
    const request = run(db.transaction(STORE, mode).objectStore(STORE));
    request.onsuccess = () => resolve(request.result as T);
    request.onerror = () => reject(request.error);
  });
}

async function readAll(): Promise<QueuedOrder[]> {
  return tx<QueuedOrder[]>('readonly', (store) => store.getAll());
}

async function refreshCount(): Promise<void> {
  const jobs = await readAll();
  pendingCount = jobs.filter((job) => job.error === null).length;
  failedCount = jobs.filter((job) => job.error !== null).length;
  listeners.forEach((fn) => fn());
}

export function subscribeQueue(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function getPendingCount(): number {
  return pendingCount;
}

export function getFailedCount(): number {
  return failedCount;
}

export async function enqueueOrder(job: NewQueuedOrder): Promise<void> {
  const id = crypto.randomUUID();

  const row: QueuedOrder = {
    id,
    payload: { ...job.payload, client_ref: id },
    payment: job.payment,
    voucherCode: job.voucherCode,
    beforeFiles: job.beforeFiles,
    orderId: null,
    error: null,
    createdAt: Date.now(),
  };

  await tx('readwrite', (store) => store.put(row));
  await refreshCount();
}

async function sendOne(job: QueuedOrder): Promise<void> {
  if (!job.orderId) {
    const res = await createOrder(job.payload);
    const created = res.data;

    if (!created?.id) throw new Error('Server tidak mengembalikan id order.');

    job.orderId = String(created.id);
    await tx('readwrite', (store) => store.put(job));
  }

  if (job.voucherCode) {
    try {
      await applyVoucherToOrder(job.orderId, { code: job.voucherCode });
    } catch (err) {
      if (normalizeApiError(err).isNetworkError) throw err;
    }
  }

  if (job.payment) {
    await createOrderPayment(job.orderId, job.payment);
  }

  if (job.beforeFiles.length > 0) {
    await uploadOrderPhotos(job.orderId, job.beforeFiles, [], true);
  }

  await tx('readwrite', (store) => store.delete(job.id));
}

export async function flushQueue(): Promise<void> {
  if (flushing || !navigator.onLine) return;

  flushing = true;

  try {
    const jobs = await readAll();

    for (const job of jobs) {
      if (job.error !== null) continue;

      try {
        await sendOne(job);
      } catch (err) {
        const e = normalizeApiError(err);
        if (e.isNetworkError) return;

        job.error = e.message;
        await tx('readwrite', (store) => store.put(job));
      }
    }
  } finally {
    flushing = false;
    await refreshCount();
  }
}
