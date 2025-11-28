# Dokumentasi Frontend (FULL Source)

_Dihasilkan otomatis: 2025-11-25 14:42:56_  
**Root:** `/home/galuhdwicandra/projects/clone_salve/prjk-salve-frontend`


## Daftar Isi

- [API (src/api)](#api-srcapi)
  - [src/api/branches.ts](#file-srcapibranchests)
  - [src/api/client.ts](#file-srcapiclientts)
  - [src/api/customers.ts](#file-srcapicustomersts)
  - [src/api/dashboard.ts](#file-srcapidashboardts)
  - [src/api/deliveries.ts](#file-srcapideliveriests)
  - [src/api/expenses.ts](#file-srcapiexpensests)
  - [src/api/invoiceCounters.ts](#file-srcapiinvoicecountersts)
  - [src/api/orderPhotos.ts](#file-srcapiorderphotosts)
  - [src/api/orders.ts](#file-srcapiordersts)
  - [src/api/receivables.ts](#file-srcapireceivablests)
  - [src/api/serviceCategories.ts](#file-srcapiservicecategoriests)
  - [src/api/servicePrices.ts](#file-srcapiservicepricests)
  - [src/api/services.ts](#file-srcapiservicests)
  - [src/api/users.ts](#file-srcapiusersts)
  - [src/api/vouchers.ts](#file-srcapivouchersts)

- [Store (src/store)](#store-srcstore)
  - [src/store/useAuth.ts](#file-srcstoreuseauthts)

- [layouts (src/layouts)](#layouts-srclayouts)
  - [src/layouts/GuestLayout.tsx](#file-srclayoutsguestlayouttsx)
  - [src/layouts/ProtectedLayout.tsx](#file-srclayoutsprotectedlayouttsx)

- [router (src/reouter)](#router-srcreouter)
  - [src/router/Guarded.tsx](#file-srcrouterguardedtsx)
  - [src/router/index.tsx](#file-srcrouterindextsx)

- [Types (src/types)](#types-srctypes)
  - [src/types/branches.ts](#file-srctypesbranchests)
  - [src/types/customers.ts](#file-srctypescustomersts)
  - [src/types/dashboard.ts](#file-srctypesdashboardts)
  - [src/types/deliveries.ts](#file-srctypesdeliveriests)
  - [src/types/expenses.ts](#file-srctypesexpensests)
  - [src/types/orders.ts](#file-srctypesordersts)
  - [src/types/payments.ts](#file-srctypespaymentsts)
  - [src/types/receivables.ts](#file-srctypesreceivablests)
  - [src/types/services.ts](#file-srctypesservicests)
  - [src/types/users.ts](#file-srctypesusersts)
  - [src/types/vouchers.ts](#file-srctypesvouchersts)

- [Components (src/components)](#components-srccomponents)
  - [src/components/ConfirmDialog.tsx](#file-srccomponentsconfirmdialogtsx)
  - [src/components/customers/CustomerPicker.tsx](#file-srccomponentscustomerscustomerpickertsx)
  - [src/components/DataTable.tsx](#file-srccomponentsdatatabletsx)
  - [src/components/delivery/AssignCourierSelect.tsx](#file-srccomponentsdeliveryassigncourierselecttsx)
  - [src/components/delivery/DeliveryStatusStepper.tsx](#file-srccomponentsdeliverydeliverystatussteppertsx)
  - [src/components/Dropzone.tsx](#file-srccomponentsdropzonetsx)
  - [src/components/FilterBar.tsx](#file-srccomponentsfilterbartsx)
  - [src/components/LazyBoundary.tsx](#file-srccomponentslazyboundarytsx)
  - [src/components/orders/OrderPhotos.tsx](#file-srccomponentsordersorderphotostsx)
  - [src/components/orders/OrderPhotosGallery.tsx](#file-srccomponentsordersorderphotosgallerytsx)
  - [src/components/orders/OrderPhotosUpload.tsx](#file-srccomponentsordersorderphotosuploadtsx)
  - [src/components/orders/OrderStatusStepper.tsx](#file-srccomponentsordersorderstatussteppertsx)
  - [src/components/pos/CartPanel.tsx](#file-srccomponentsposcartpaneltsx)
  - [src/components/pos/CheckoutDialog.tsx](#file-srccomponentsposcheckoutdialogtsx)
  - [src/components/pos/ProductSearch.tsx](#file-srccomponentsposproductsearchtsx)
  - [src/components/ReceiptPreview.tsx](#file-srccomponentsreceiptpreviewtsx)
  - [src/components/receivables/SettleReceivableDialog.tsx](#file-srccomponentsreceivablessettlereceivabledialogtsx)
  - [src/components/Toast.tsx](#file-srccomponentstoasttsx)

- [Pages (src/pages)](#pages-srcpages)
  - [src/pages/branches/BranchForm.tsx](#file-srcpagesbranchesbranchformtsx)
  - [src/pages/branches/BranchIndex.tsx](#file-srcpagesbranchesbranchindextsx)
  - [src/pages/branches/InvoiceSettings.tsx](#file-srcpagesbranchesinvoicesettingstsx)
  - [src/pages/customers/CustomerDetail.tsx](#file-srcpagescustomerscustomerdetailtsx)
  - [src/pages/customers/CustomersIndex.tsx](#file-srcpagescustomerscustomersindextsx)
  - [src/pages/dashboard/DashboardHome.tsx](#file-srcpagesdashboarddashboardhometsx)
  - [src/pages/deliveries/DeliveryDetail.tsx](#file-srcpagesdeliveriesdeliverydetailtsx)
  - [src/pages/deliveries/DeliveryIndex.tsx](#file-srcpagesdeliveriesdeliveryindextsx)
  - [src/pages/expenses/ExpenseForm.tsx](#file-srcpagesexpensesexpenseformtsx)
  - [src/pages/expenses/ExpensesIndex.tsx](#file-srcpagesexpensesexpensesindextsx)
  - [src/pages/Login.tsx](#file-srcpageslogintsx)
  - [src/pages/orders/OrderDetail.tsx](#file-srcpagesordersorderdetailtsx)
  - [src/pages/orders/OrderReceipt.tsx](#file-srcpagesordersorderreceipttsx)
  - [src/pages/orders/OrdersIndex.tsx](#file-srcpagesordersordersindextsx)
  - [src/pages/pos/POSPage.tsx](#file-srcpagespospospagetsx)
  - [src/pages/receivables/ReceivablesIndex.tsx](#file-srcpagesreceivablesreceivablesindextsx)
  - [src/pages/services/CategoryIndex.tsx](#file-srcpagesservicescategoryindextsx)
  - [src/pages/services/PricePerBranchInput.tsx](#file-srcpagesservicespriceperbranchinputtsx)
  - [src/pages/services/ServiceForm.tsx](#file-srcpagesservicesserviceformtsx)
  - [src/pages/services/ServiceIndex.tsx](#file-srcpagesservicesserviceindextsx)
  - [src/pages/users/UserForm.tsx](#file-srcpagesusersuserformtsx)
  - [src/pages/users/UsersList.tsx](#file-srcpagesusersuserslisttsx)
  - [src/pages/vouchers/VoucherForm.tsx](#file-srcpagesvouchersvoucherformtsx)
  - [src/pages/vouchers/VouchersIndex.tsx](#file-srcpagesvouchersvouchersindextsx)

- [Pages (src/utils)](#pages-srcutils)
  - [src/utils/files.ts](#file-srcutilsfilests)
  - [src/utils/money.ts](#file-srcutilsmoneyts)
  - [src/utils/order-status.ts](#file-srcutilsorder-statusts)
  - [src/utils/theme.ts](#file-srcutilsthemets)
  - [src/utils/wa.ts](#file-srcutilswats)

- [Entry Files](#entry-files)
  - [src/App.tsx](#file-srcapptsx)
  - [src/main.tsx](#file-srcmaintsx)



## API (src/api)

### src/api/branches.ts

- SHA: `6e7bc78ba8f6`  
- Ukuran: 1 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
import { api } from './client';
import type { ApiEnvelope } from './client';
import type {
    Branch, BranchUpsertPayload, BranchQuery, PaginationMeta,
} from '../types/branches';

export async function listBranches(params: BranchQuery = {}) {
    const { data } = await api.get<ApiEnvelope<Branch[], PaginationMeta | null>>('/branches', { params });
    return data;
}

export async function getBranch(id: string) {
    const { data } = await api.get<ApiEnvelope<Branch, null>>(`/branches/${id}`);
    return data;
}

export async function createBranch(payload: BranchUpsertPayload) {
    const { data } = await api.post<ApiEnvelope<Branch, null>>('/branches', payload);
    return data;
}

export async function updateBranch(id: string, payload: Partial<BranchUpsertPayload>) {
    const { data } = await api.put<ApiEnvelope<Branch, null>>(`/branches/${id}`, payload);
    return data;
}

export async function deleteBranch(id: string) {
    const { data } = await api.delete<ApiEnvelope<null, null>>(`/branches/${id}`);
    return data;
}

```
</details>

### src/api/client.ts

- SHA: `741c920e6df2`  
- Ukuran: 3 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
import axios from 'axios';
import type { AxiosError } from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: false,
    headers: { 'Content-Type': 'application/json' },
});

export type RoleName = 'Superadmin' | 'Admin Cabang' | 'Kasir' | 'Petugas Cuci' | 'Kurir';
export interface MeUser {
    id: number | string;
    name: string;
    email: string;
    branch_id: number | string | null;
    is_active: boolean;
    roles: RoleName[];
}
export interface ApiEnvelope<T = unknown, M = unknown> {
    data: T;
    meta: M;
    message: string | null;
    errors: Record<string, string[]> | null;
}
export interface LoginPayload { email: string; password: string; }
type LoginResp = ApiEnvelope<{ user: MeUser }, { token: string }>;
type MeResp = ApiEnvelope<{ user: MeUser }, null>;
type LogoutResp = ApiEnvelope<null, null>;

// Lazy getter agar tidak coupling langsung ke store (hindari import sirkular)
function getToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
        return window.localStorage.getItem('pos-salve:token');
    } catch {
        // fallback aman saat localStorage diblok
        return null;
    }
}

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (import.meta.env.VITE_DEBUG_HTTP === 'true') {
        console.debug('[HTTP]', config.method?.toUpperCase(), config.baseURL, config.url, config.params ?? '', config.data ?? '');
    }
    return config;
});

type ApiErrorResponse = {
    message?: string;
    errors?: Record<string, string[]>;
};

function clearAuthSideEffects(): void {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.removeItem('pos-salve:token');
        window.localStorage.removeItem('pos-salve:user');
    } catch {
        // jika storage tidak tersedia (mode private/SSO), cukup hentikan
        return;
    }
}

api.interceptors.response.use(
    (res) => res,
    (err: AxiosError<ApiErrorResponse>) => {
        const status = err.response?.status;
        if (status === 401) {
            // Bersihkan token & lempar ke /login
            clearAuthSideEffects();
            if (location.pathname !== '/login') {
                location.replace('/login');
            }
        }
        // 422: biarkan caller menampilkan field errors
        return Promise.reject(err);
    }
);

// === Auth API (typed) ===
export async function apiLogin(payload: LoginPayload) {
    const { data } = await api.post<LoginResp>('/auth/login', payload);
    return data;
}
export async function apiMe() {
    const { data } = await api.get<MeResp>('/auth/me');
    return data;
}
export async function apiLogout() {
    const { data } = await api.post<LogoutResp>('/auth/logout');
    return data;
}

export { api };
```
</details>

### src/api/customers.ts

- SHA: `55f48245371e`  
- Ukuran: 3 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/api/customers.ts
import { api } from './client';
import { isAxiosError } from 'axios';
import type {
    Customer,
    CustomerQuery,
    CustomerUpsertPayload,
    Paginated,
    SingleResponse,
} from '../types/customers';

export async function listCustomers(params: CustomerQuery): Promise<Paginated<Customer>> {
    const { data } = await api.get<Paginated<Customer>>('/customers', { params });
    return data;
}

export async function getCustomer(id: string): Promise<SingleResponse<Customer>> {
    const { data } = await api.get<SingleResponse<Customer>>(`/customers/${id}`);
    return data;
}

export async function createCustomer(payload: CustomerUpsertPayload): Promise<SingleResponse<Customer>> {
    const { data } = await api.post<SingleResponse<Customer>>('/customers', payload);
    return data;
}

export async function updateCustomer(id: string, payload: Partial<CustomerUpsertPayload>): Promise<SingleResponse<Customer>> {
    const { data } = await api.put<SingleResponse<Customer>>(`/customers/${id}`, payload);
    return data;
}

export async function deleteCustomer(id: string): Promise<SingleResponse<null>> {
    const { data } = await api.delete<SingleResponse<null>>(`/customers/${id}`);
    return data;
}

/**
 * Cari pelanggan berdasarkan nomor WhatsApp persis (spasi akan dihilangkan di backend).
 * GET /customers/search-wa?wa=08123...
 */
export async function searchCustomerByWA(wa: string, branch_id?: string): Promise<SingleResponse<Customer>> {
    const params: Record<string, string> = { wa };
    if (branch_id) params.branch_id = branch_id; // hanya dihormati untuk Superadmin
    const { data } = await api.get<SingleResponse<Customer>>('/customers/search-wa', { params });
    return data;
}

/**
 * Helper otomasi checkout:
 * - Coba cari by WA.
 * - Jika 404, buat customer baru dengan nama yang diberikan (fallback ke 'Pelanggan').
 */
export async function resolveOrCreateCustomerByWA(
    wa: string,
    name: string,
    branch_id?: string,
    address?: string | null,
): Promise<Customer> {
    try {
        const found = await searchCustomerByWA(wa, branch_id);
        if (found.data) return found.data;
    } catch (err: unknown) {
        // Abaikan hanya 404 (not found); error lain tetap dilempar
        if (!isAxiosError(err) || err.response?.status !== 404) {
            throw err;
        }
    }
    const created = await createCustomer({
        branch_id,
        name: name?.trim() || 'Pelanggan',
        whatsapp: wa,
        address: address ?? null,
    });
    if (!created.data) {
        throw new Error('Gagal membuat pelanggan');
    }
    return created.data;
}

```
</details>

### src/api/dashboard.ts

- SHA: `b5b7cbd6f727`  
- Ukuran: 513 B
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/api/dashboard.ts
import { api } from './client';
import type { ApiEnvelope } from './client';
import type { DashboardSummary, DashboardSummaryMeta } from '../types/dashboard';

export interface DashboardSummaryQuery {
  from: string;
  to: string;
  branch_id?: string | null;
}

export async function getDashboardSummary(params: DashboardSummaryQuery) {
  const { data } = await api.get<ApiEnvelope<DashboardSummary, DashboardSummaryMeta>>(
    '/dashboard/summary',
    { params },
  );
  return data;
}

```
</details>

### src/api/deliveries.ts

- SHA: `bc61a066492a`  
- Ukuran: 2 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/api/deliveries.ts
import { api } from './client';
import type {
  Delivery, DeliveryCreatePayload, DeliveryAssignPayload, DeliveryStatusPayload,
  DeliveryQuery, Paginated, SingleResponse,
} from '../types/deliveries';

/** List deliveries (untuk DeliveryIndex) */
export async function listDeliveries(params: DeliveryQuery = {}) {
  const { data } = await api.get<Paginated<Delivery>>('/deliveries', { params });
  return data;
}

/** Create delivery + auto-assign di backend (M7) */
export async function createDelivery(payload: DeliveryCreatePayload) {
  const { data } = await api.post<SingleResponse<Delivery>>(
    '/deliveries',
    payload,
    { headers: { 'Content-Type': 'application/json' } }
  );
  return data;
}

/** Assign/ubah kurir */
export async function assignCourier(id: string, payload: DeliveryAssignPayload) {
  const { data } = await api.put<SingleResponse<Delivery>>(
    `/deliveries/${encodeURIComponent(id)}/assign`,
    payload,
    { headers: { 'Content-Type': 'application/json' } }
  );
  return data;
}

/** Update status (+ opsional upload bukti serah-terima) */
export async function updateDeliveryStatus(id: string, payload: DeliveryStatusPayload) {
  const hasFile = !!payload.handover_photo;
  if (hasFile) {
    const fd = new FormData();
    fd.append('status', payload.status);
    if (payload.note) fd.append('note', payload.note);
    if (payload.handover_photo) fd.append('handover_photo', payload.handover_photo);
    const { data } = await api.put<SingleResponse<Delivery>>(
      `/deliveries/${encodeURIComponent(id)}/status`,
      fd,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data;
  }
  const { data } = await api.put<SingleResponse<Delivery>>(
    `/deliveries/${encodeURIComponent(id)}/status`,
    { status: payload.status, note: payload.note ?? null },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return data;
}

```
</details>

### src/api/expenses.ts

- SHA: `366273253174`  
- Ukuran: 4 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/api/expenses.ts
import { api, type ApiEnvelope } from './client';
import type {
    Expense,
    ExpenseCreatePayload,
    ExpenseUpdatePayload,
    ExpenseQuery,
    SingleResponse,
    PaginationMeta,
} from '../types/expenses';

/** Laravel paginator shape (server) */
type Paginator<T> = {
    data: T[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
};

function isPaginator<T>(v: unknown): v is Paginator<T> {
    return (
        !!v &&
        typeof v === 'object' &&
        Array.isArray((v as { data?: unknown }).data) &&
        typeof (v as { current_page?: unknown }).current_page !== 'undefined'
    );
}

/** GET /expenses */
export async function listExpenses(
    params: ExpenseQuery = {},
): Promise<ApiEnvelope<Expense[], PaginationMeta | null>> {
    const { data: env } = await api.get<unknown>('/expenses', { params });

    if (isPaginator<Expense>(env)) {
        const out: ApiEnvelope<Expense[], PaginationMeta> = {
            data: env.data,
            meta: {
                current_page: env.current_page,
                per_page: env.per_page,
                total: env.total,
                last_page: env.last_page,
            },
            message: null,
            errors: null,
        };
        return out;
    }

    return {
        data: (env as { data?: Expense[] })?.data ?? [],
        meta: null,
        message: (env as { message?: string | null })?.message ?? null,
        errors: (env as { errors?: Record<string, string[]> | null })?.errors ?? null,
    };
}

/** GET /expenses/{id} */
export async function getExpense(id: string): Promise<SingleResponse<Expense>> {
    const { data } = await api.get<SingleResponse<Expense>>(`/expenses/${encodeURIComponent(id)}`);
    return data;
}

/** POST /expenses (multipart jika ada file 'proof', JSON jika tidak) */
export async function createExpense(payload: ExpenseCreatePayload): Promise<SingleResponse<Expense>> {
    if (payload.proof) {
        const fd = new FormData();
        if (payload.branch_id) fd.append('branch_id', payload.branch_id);
        fd.append('category', payload.category);
        fd.append('amount', String(payload.amount ?? 0));
        if (typeof payload.note !== 'undefined') fd.append('note', payload.note ?? '');
        fd.append('proof', payload.proof);
        const { data } = await api.post<SingleResponse<Expense>>('/expenses', fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    }

    const json: {
        branch_id?: string;
        category: string;
        amount: number;
        note?: string | null;
    } = {
        category: payload.category,
        amount: payload.amount,
    };
    if (payload.branch_id) json.branch_id = payload.branch_id;
    if (typeof payload.note !== 'undefined') json.note = payload.note;

    const { data } = await api.post<SingleResponse<Expense>>('/expenses', json);
    return data;
}

export async function updateExpense(
    id: string,
    payload: ExpenseUpdatePayload,
): Promise<SingleResponse<Expense>> {
    if (payload.proof) {
        const fd = new FormData();
        fd.append('category', payload.category);
        fd.append('amount', String(payload.amount ?? 0));
        if (typeof payload.note !== 'undefined') fd.append('note', payload.note ?? '');
        fd.append('proof', payload.proof);
        const { data } = await api.put<SingleResponse<Expense>>(`/expenses/${encodeURIComponent(id)}`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
    }

    const json: {
        category: string;
        amount: number;
        note?: string | null;
    } = {
        category: payload.category,
        amount: payload.amount,
    };
    if (typeof payload.note !== 'undefined') json.note = payload.note;

    const { data } = await api.put<SingleResponse<Expense>>(`/expenses/${encodeURIComponent(id)}`, json);
    return data;
}

export async function deleteExpense(id: string) {
    return api.delete(`/expenses/${encodeURIComponent(id)}`);
}

```
</details>

### src/api/invoiceCounters.ts

- SHA: `8591808346ee`  
- Ukuran: 2 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/api/invoiceCounters.ts
import { api } from './client';
import type { ApiEnvelope } from './client';
import type {
  InvoiceCounter, InvoiceCounterUpsertPayload, InvoiceCounterQuery, PaginationMeta,
} from '../types/branches';

export async function listInvoiceCounters(params: InvoiceCounterQuery) {
  const { data } = await api.get<ApiEnvelope<InvoiceCounter[], PaginationMeta | null>>(
    '/invoice-counters',
    { params }
  );
  return data;
}

export async function getInvoiceCounter(id: string) {
  const { data } = await api.get<ApiEnvelope<InvoiceCounter, null>>(`/invoice-counters/${id}`);
  return data;
}

export async function createInvoiceCounter(payload: InvoiceCounterUpsertPayload) {
  const { data } = await api.post<ApiEnvelope<InvoiceCounter, null>>('/invoice-counters', payload);
  return data;
}

export async function updateInvoiceCounter(id: string, payload: Partial<InvoiceCounterUpsertPayload>) {
  const { data } = await api.put<ApiEnvelope<InvoiceCounter, null>>(`/invoice-counters/${id}`, payload);
  return data;
}

export async function deleteInvoiceCounter(id: string) {
  const { data } = await api.delete<ApiEnvelope<null, null>>(`/invoice-counters/${id}`);
  return data;
}

export interface PreviewNumber {
  number: string;     // contoh: SLV-202511-000019
  invoice_no: string; // contoh: INV-21-11-0019
}

/** GET /invoice-counters/preview?branch_id=... */
export async function previewNextNumber(branch_id: string) {
  const { data } = await api.get<ApiEnvelope<PreviewNumber, null>>(
    '/invoice-counters/preview',
    { params: { branch_id } },
  );
  return data; // ApiEnvelope<PreviewNumber, null>
}

/** POST /invoice-counters/{id}/reset-now */
export async function resetCounterNow(id: string) {
  const { data } = await api.post<ApiEnvelope<InvoiceCounter, null>>(
    `/invoice-counters/${id}/reset-now`,
    {},
  );
  return data; // ApiEnvelope<InvoiceCounter, null>
}
```
</details>

### src/api/orderPhotos.ts

- SHA: `2c2c206554e4`  
- Ukuran: 459 B
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/api/orderPhotos.ts
import { api } from "./client";

export async function uploadOrderPhotos(
  orderId: string,
  before: File[] = [],
  after: File[] = []
): Promise<void> {
  const fd = new FormData();
  before.forEach(f => fd.append("photos[before][]", f));
  after.forEach(f => fd.append("photos[after][]", f));
  await api.post(`/orders/${encodeURIComponent(orderId)}/photos`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

```
</details>

### src/api/orders.ts

- SHA: `3f13a90b4cec`  
- Ukuran: 3 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/api/orders.ts
import { api } from './client';
import type {
  Order, OrderCreatePayload, OrderUpdatePayload, OrderQuery,
  Paginated, SingleResponse, OrderBackendStatus
} from '../types/orders';
import type { PaymentCreatePayload, Payment } from '../types/payments';

export async function listOrders(params: OrderQuery = {}) {
  const { data } = await api.get<Paginated<Order>>('/orders', { params });
  return data;
}

export async function getOrder(id: string) {
  const { data } = await api.get<SingleResponse<Order>>(`/orders/${encodeURIComponent(id)}`);
  return data;
}

export async function createOrder(payload: OrderCreatePayload) {
  const { data } = await api.post<SingleResponse<Order>>('/orders', payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return data;
}

export async function updateOrder(id: string, payload: OrderUpdatePayload) {
  const { data } = await api.put<SingleResponse<Order>>(`/orders/${encodeURIComponent(id)}`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return data;
}

export async function updateOrderStatus(id: string, status: OrderBackendStatus) {
  const { data } = await api.post<
    SingleResponse<{ id: string; status: OrderBackendStatus }>
  >(`/orders/${encodeURIComponent(id)}/status`, { next: status }, {
    headers: { 'Content-Type': 'application/json' },
  });
  return data;
}

export async function createOrderPayment(
  id: string,
  payload: PaymentCreatePayload
): Promise<{ order: Order; payment?: Payment }> {
  const { data } = await api.post<SingleResponse<{ order: Order; payment?: Payment }>>(
    `/orders/${encodeURIComponent(id)}/payments`,
    payload,
    { headers: { 'Content-Type': 'application/json' } }
  );

  if (!data?.data) {
    throw new Error('Unexpected server response for payments');
  }
  return {
    order: data.data.order,
    payment: data.data.payment,
  };
}

export async function getOrderReceiptHtml(id: string): Promise<string> {
  const { data } = await api.get(`/orders/${encodeURIComponent(id)}/receipt`, {
    headers: { Accept: 'text/html' },
    responseType: 'text',
    transformResponse: (r) => r, // cegah axios mengutak-atik
  });
  return data as string;
}

export async function openOrderReceipt(id: string, autoPrint = false): Promise<void> {
  const w = window.open("", "_blank");
  if (!w) throw new Error("Popup diblokir browser. Izinkan pop-up untuk situs ini.");

  try {
    const html = await getOrderReceiptHtml(id);
    w.document.open();
    w.document.write(html);
    w.document.close();

    if (autoPrint) {
      w.onload = () => w.print();
    }
  } catch (err) {
    w.close();
    throw err;
  }
}
```
</details>

### src/api/receivables.ts

- SHA: `4180e50f6920`  
- Ukuran: 2 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/api/receivables.ts
import { api, type ApiEnvelope } from "./client";
import type { Receivable, ReceivableQuery, ReceivableSettlePayload, ReceivableSettleResult } from "../types/receivables";
import type { PaginationMeta } from "../types/branches";

type Paginator<T> = {
    data: T[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
};
function isPaginator<T>(v: unknown): v is Paginator<T> {
    return !!v && typeof v === "object" && Array.isArray((v as { data?: unknown }).data)
        && typeof (v as { current_page?: unknown }).current_page !== "undefined";
}

export async function listReceivables(params: ReceivableQuery) {
    // Backend M9 kadang mengembalikan:
    // A) envelope.data = array + envelope.meta = PaginationMeta
    // B) envelope.data = paginator (ada fields current_page, dst) + envelope.meta = {}
    // Kita normalkan jadi pola A (konsisten dengan halaman lain).
    const res = await api.get<ApiEnvelope<unknown, unknown>>(`/receivables`, { params });
    const env = res.data;
    const inner = env.data;

    if (Array.isArray(inner)) {
        // Sudah pola A
        return env as ApiEnvelope<Receivable[], PaginationMeta | null>;
    }
    if (isPaginator<Receivable>(inner)) {
        const pag = inner;
        const out: ApiEnvelope<Receivable[], PaginationMeta> = {
            data: pag.data,
            meta: {
                current_page: pag.current_page,
                per_page: pag.per_page,
                total: pag.total,
                last_page: pag.last_page,
            },
            message: env.message ?? null,
            errors: (env as { errors?: Record<string, string[]> | null }).errors ?? null,
        };
        return out;
    }
    // Fallback aman (kosong) jika bentuk tak terduga
    const empty: ApiEnvelope<Receivable[], PaginationMeta | null> = {
        data: [],
        meta: null,
        message: env?.message ?? null,
        errors: (env as { errors?: Record<string, string[]> | null })?.errors ?? null,
    };
    return empty;
}

export async function settleReceivable(id: string, payload: ReceivableSettlePayload) {
    // POST /receivables/{id}/settle — returns { order, receivable }
    return api.post<ApiEnvelope<ReceivableSettleResult>>(`/receivables/${id}/settle`, payload);
}

```
</details>

### src/api/serviceCategories.ts

- SHA: `103d2837c411`  
- Ukuran: 1 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
import { api, type ApiEnvelope } from './client';
import type { ServiceCategory, CategoryUpsertPayload, CategoryQuery, PaginationMeta } from '../types/services';

export async function listServiceCategories(params: CategoryQuery = {}) {
  const { data } = await api.get<ApiEnvelope<ServiceCategory[], PaginationMeta | null>>('/service-categories', { params });
  return data;
}
export async function getServiceCategory(id: string) {
  const { data } = await api.get<ApiEnvelope<ServiceCategory, null>>(`/service-categories/${id}`);
  return data;
}
export async function createServiceCategory(payload: CategoryUpsertPayload) {
  const { data } = await api.post<ApiEnvelope<ServiceCategory, null>>('/service-categories', payload);
  return data;
}
export async function updateServiceCategory(id: string, payload: Partial<CategoryUpsertPayload>) {
  const { data } = await api.put<ApiEnvelope<ServiceCategory, null>>(`/service-categories/${id}`, payload);
  return data;
}
export async function deleteServiceCategory(id: string) {
  const { data } = await api.delete<ApiEnvelope<null, null>>(`/service-categories/${id}`);
  return data;
}

```
</details>

### src/api/servicePrices.ts

- SHA: `1f175f2f1a30`  
- Ukuran: 1 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/api/servicePrices.ts
import { api, type ApiEnvelope } from './client';
import type { ServicePrice, ServicePriceSetPayload } from '../types/services';

export async function setServicePrice(payload: ServicePriceSetPayload) {
  const { data } = await api.post<ApiEnvelope<ServicePrice, null>>('/service-prices/set', payload);
  return data;
}

export async function listServicePricesByService(service_id: string, branch_id?: string) {
  const params = { service_id, branch_id };
  const { data } = await api.get<ApiEnvelope<ServicePrice[], null>>('/service-prices/by-service', { params });
  return data;
}

/** Helper sinkron (disarankan): hitung harga efektif dari rows yang sudah di-fetch */
export function computeEffectivePrice(
  rows: ServicePrice[] | undefined,
  branch_id: string | null | undefined,
  defaultPrice: number | string
): number {
  const fallback = typeof defaultPrice === 'string' ? parseFloat(defaultPrice) : (defaultPrice ?? 0);
  if (!rows || !rows.length || !branch_id) return fallback;
  const hit = rows.find(p => String(p.branch_id) === String(branch_id));
  return hit ? Number(hit.price) : fallback;
}

/** Helper async (kompatibilitas): tetap ada, tetapi utamakan computeEffectivePrice di loop */
export async function getEffectivePrice(service: { id: string; price_default: number }, branch_id: string): Promise<number> {
  const res = await listServicePricesByService(service.id, branch_id);
  return computeEffectivePrice(res.data, branch_id, service.price_default);
}

```
</details>

### src/api/services.ts

- SHA: `0ab43f358e65`  
- Ukuran: 1001 B
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
import { api, type ApiEnvelope } from './client';
import type { Service, ServiceUpsertPayload, ServiceQuery, PaginationMeta } from '../types/services';

export async function listServices(params: ServiceQuery = {}) {
  const { data } = await api.get<ApiEnvelope<Service[], PaginationMeta | null>>('/services', { params });
  return data;
}
export async function getService(id: string) {
  const { data } = await api.get<ApiEnvelope<Service, null>>(`/services/${id}`);
  return data;
}
export async function createService(payload: ServiceUpsertPayload) {
  const { data } = await api.post<ApiEnvelope<Service, null>>('/services', payload);
  return data;
}
export async function updateService(id: string, payload: Partial<ServiceUpsertPayload>) {
  const { data } = await api.put<ApiEnvelope<Service, null>>(`/services/${id}`, payload);
  return data;
}
export async function deleteService(id: string) {
  const { data } = await api.delete<ApiEnvelope<null, null>>(`/services/${id}`);
  return data;
}

```
</details>

### src/api/users.ts

- SHA: `c066e4f4055b`  
- Ukuran: 2 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/api/users.ts
import { api } from './client';
import type { Envelope } from '../types/users';
import type { User, UserUpsertPayload, UserQuery, PaginationMeta, } from '../types/users';
import type { RoleName } from './client';

export async function listUsers(params: UserQuery = {}) {
    const { data } = await api.get<Envelope<User[], PaginationMeta>>('/users', { params });
    return data;
}

export async function getUser(id: string) {
    const { data } = await api.get<{ data: User }>(`/users/${encodeURIComponent(id)}`);
    return data;
}

export async function createUser(payload: UserUpsertPayload) {
    const { data } = await api.post<Envelope<User, null>>(
        '/users',
        payload,
        { headers: { 'Content-Type': 'application/json' } } // ⬅️ penting
    );
    return data;
}

export async function updateUser(id: string, payload: Partial<UserUpsertPayload>) {
    const { data } = await api.put(`/users/${encodeURIComponent(id)}`, payload);
    return data;
}

export async function deleteUser(id: string) {
    const { data } = await api.delete<Envelope<null, null>>(`/users/${id}`);
    return data;
}

// Aksi khusus dari backend routes:
export async function setUserActive(id: string, is_active: boolean) {
    const { data } = await api.post<Envelope<User, null>>(`/users/${id}/active`, { is_active });
    return data;
}
export async function setUserRoles(id: string, roles: RoleName[]) {
  const { data } = await api.post<Envelope<User, null>>(
    `/users/${encodeURIComponent(id)}/roles`,
    { roles },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return data;
}
export async function resetUserPassword(id: string, new_password: string) {
    const payload = { password: new_password, password_confirmation: new_password };
    const { data } = await api.post<Envelope<null, null>>(`/users/${encodeURIComponent(id)}/reset-password`, payload);
    return data;
}

```
</details>

### src/api/vouchers.ts

- SHA: `77de151cb26f`  
- Ukuran: 1 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/api/vouchers.ts
import { api } from '../api/client';
import type {
    ID, Voucher, VoucherQuery, VoucherUpsertPayload,
    ListResponse, ItemResponse, ApplyVoucherPayload, ApplyVoucherResponse
} from '../types/vouchers';

export async function listVouchers(query: VoucherQuery = {}): Promise<ListResponse<Voucher>> {
    const res = await api.get<ListResponse<Voucher>>('/vouchers', { params: query });
    return res.data;
}

export async function getVoucher(id: ID): Promise<ItemResponse<Voucher>> {
    const res = await api.get<ItemResponse<Voucher>>(`/vouchers/${id}`);
    return res.data;
}

export async function createVoucher(payload: VoucherUpsertPayload): Promise<ItemResponse<Voucher>> {
    const res = await api.post<ItemResponse<Voucher>>('/vouchers', payload);
    return res.data;
}

export async function updateVoucher(id: ID, payload: VoucherUpsertPayload): Promise<ItemResponse<Voucher>> {
    const res = await api.put<ItemResponse<Voucher>>(`/vouchers/${id}`, payload);
    return res.data;
}

export async function deleteVoucher(id: ID): Promise<void> {
    await api.delete(`/vouchers/${id}`);
}

export async function applyVoucherToOrder(orderId: ID, payload: ApplyVoucherPayload): Promise<ApplyVoucherResponse> {
    const res = await api.post<ApplyVoucherResponse>(`/orders/${orderId}/apply-voucher`, payload);
    return res.data;
}

```
</details>



## Store (src/store)

### src/store/useAuth.ts

- SHA: `8f456f8a3349`  
- Ukuran: 3 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/store/useAuth.ts
import { apiLogin, apiMe, apiLogout } from '../api/client';
import type { MeUser, RoleName, LoginPayload } from '../api/client';
import { useSyncExternalStore } from 'react';

interface AuthState {
    token: string | null;
    user: MeUser | null;
}

const state: AuthState = {
    token: null,
    user: null,
};

const isDev = typeof import.meta !== 'undefined' && !!import.meta.env?.DEV;

export function homePathByRole(roles: RoleName[]): string {
    // Kasir → POS ; Admin Cabang & Superadmin → Dashboard
    if (roles.includes('Kasir')) return '/pos';
    return '/';
}

const subscribers = new Set<() => void>();
function notify() { subscribers.forEach((fn) => fn()); }

function load() {
    try {
        state.token = localStorage.getItem('pos-salve:token');
        const raw = localStorage.getItem('pos-salve:user');
        state.user = raw ? (JSON.parse(raw) as MeUser) : null;
    } catch (e) {
        state.token = null;
        state.user = null;
        if (isDev) console.warn('Auth load failed:', e);
    }
}

function persist() {
    try {
        if (state.token) localStorage.setItem('pos-salve:token', state.token);
        if (state.user) localStorage.setItem('pos-salve:user', JSON.stringify(state.user));
    } catch (e) {
        if (isDev) console.warn('Auth persist failed:', e);
    }
}

load();

export const useAuth = {
    get token() {
        return state.token;
    },
    get user() {
        return state.user;
    },
    get roles(): RoleName[] {
        return state.user?.roles ?? [];
    },
    hasRole(role: RoleName | RoleName[]): boolean {
        const list = Array.isArray(role) ? role : [role];
        const roles = state.user?.roles ?? [];
        return roles.some((r) => list.includes(r));
    },
    async login(payload: LoginPayload) {
        const res = await apiLogin(payload);
        // backend: { data: { user }, meta: { token } }
        state.token = res?.meta?.token ?? null;
        state.user = res?.data?.user ?? null;
        persist();
        notify();
        return state.user;
    },
    async fetchMe() {
        const res = await apiMe();
        state.user = res?.data?.user ?? null;
        persist();
        notify();
        return state.user;
    },
    async logout() {
        try {
            await apiLogout();
        } finally {
            state.token = null;
            state.user = null;
            try {
                localStorage.removeItem('pos-salve:token');
                localStorage.removeItem('pos-salve:user');
            } catch (e) {
                if (isDev) console.warn('Auth localStorage clear failed:', e);
            }
            notify();
        }
    },
    subscribe(fn: () => void) {
        subscribers.add(fn);
        return () => subscribers.delete(fn);
    },
};

/**
* Hook ringan untuk cek role yang reaktif terhadap perubahan auth.
* Penggunaan: const can = useHasRole(['Superadmin','Admin Cabang'])
*/
export function useHasRole(required: RoleName | RoleName[]): boolean {
    // re-render saat auth state berubah
    useSyncExternalStore(
        useAuth.subscribe,
        () => String(useAuth.user?.id ?? '0') + '|' + (useAuth.user?.roles ?? []).join(','),
    );
    const roles = Array.isArray(required) ? required : [required];
    return (useAuth.user?.roles ?? []).some((r) => roles.includes(r));
}
```
</details>



## layouts (src/layouts)

### src/layouts/GuestLayout.tsx

- SHA: `43899ef8ecc3`  
- Ukuran: 319 B
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
import { Outlet } from 'react-router-dom';

export default function GuestLayout() {
    return (
        <main className="min-h-dvh grid place-items-center p-6">
            <div className="w-full max-w-sm rounded-xl border p-6 shadow-sm bg-white">
                <Outlet />
            </div>
        </main>
    );
}
```
</details>

### src/layouts/ProtectedLayout.tsx

- SHA: `256d0ca0278e`  
- Ukuran: 8 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/layouts/ProtectedLayout.tsx
import { useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { useAuth, useHasRole } from '../store/useAuth';
import type { RoleName } from '../api/client';

export default function ProtectedLayout() {
  const me = useAuth.user;
  const location = useLocation();
  const nav = useNavigate();

  // Drawer untuk mobile
  const [open, setOpen] = useState(false);

  if (!me) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const FF = {
    vouchers: import.meta.env.VITE_FEATURE_VOUCHER === 'true',
    delivery: import.meta.env.VITE_FEATURE_DELIVERY === 'true',
    receivables: import.meta.env.VITE_FEATURE_RECEIVABLES === 'true',
  };

  type MenuItem = { label: string; to: string; roles: RoleName[]; show?: boolean };
  const MENU: MenuItem[] = [
    { label: 'Dashboard', to: '/', roles: ['Superadmin', 'Admin Cabang,', 'Kasir', 'Petugas Cuci', 'Kurir'] as RoleName[] },
    { label: 'POS', to: '/pos', roles: ['Superadmin', 'Admin Cabang', 'Kasir'] },
    { label: 'Orders', to: '/orders', roles: ['Superadmin', 'Admin Cabang', 'Kasir'] },
    { label: 'Customers', to: '/customers', roles: ['Superadmin', 'Admin Cabang', 'Kasir'] },
    { label: 'Services', to: '/services', roles: ['Superadmin', 'Admin Cabang'] },
    { label: 'Users', to: '/users', roles: ['Superadmin', 'Admin Cabang'] },
    { label: 'Branches', to: '/branches', roles: ['Superadmin'] },
    { label: 'Delivery', to: '/deliveries', roles: ['Superadmin', 'Admin Cabang', 'Kasir', 'Kurir'], show: FF.delivery },
    { label: 'Expenses', to: '/expenses', roles: ['Superadmin', 'Admin Cabang'] },
    { label: 'Receivables', to: '/receivables', roles: ['Superadmin', 'Admin Cabang', 'Kasir'], show: FF.receivables },
    { label: 'Vouchers', to: '/vouchers', roles: ['Superadmin', 'Admin Cabang'], show: FF.vouchers },
  ];

  const VISIBLE = MENU.filter(
    (m) => (m.show ?? true) && (me.roles ?? []).some((r) => m.roles.includes(r as RoleName)),
  );

  return (
    <div className="min-h-dvh bg-[var(--color-surface)] text-[var(--color-text-default)]">
      {/* Topbar */}
      <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur">
        <div className="container-app flex h-14 items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Toggle drawer (mobile) */}
            <button
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] hover:bg-[#E6EDFF] transition-colors"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              {/* ikon burger sederhana */}
              <span className="block h-0.5 w-4 bg-current" />
              <span className="block h-0.5 w-4 bg-current mt-1" />
              <span className="block h-0.5 w-4 bg-current mt-1" />
            </button>
            <div className="font-semibold">SALVE</div>
          </div>

          {/* Aksi cepat sederhana (placeholder) */}
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                await useAuth.logout();
                nav('/login', { replace: true });
              }}
              className="hidden md:inline-flex h-9 items-center rounded-lg border border-[var(--color-border)] px-3 text-sm hover:bg-[#E6EDFF] transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container-app grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-6 py-6">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:block rounded-lg border border-[var(--color-border)] bg-white/90 p-4 shadow-elev-1">
          <UserCard name={me.name} roles={me.roles} />
          <nav className="mt-4 space-y-1">
            {VISIBLE.map((m) => (
              <NavLink
                key={m.to}
                to={m.to}
                className={({ isActive }) =>
                  [
                    'block rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[var(--color-brand-primary)] text-[var(--color-brand-on)] shadow-elev-1'
                      : 'hover:bg-[#E6EDFF]',
                  ].join(' ')
                }
              >
                {m.label}
              </NavLink>
            ))}
          </nav>
          <button
            onClick={async () => {
              await useAuth.logout();
              nav('/login', { replace: true });
            }}
            className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm hover:bg-[#E6EDFF] transition-colors"
          >
            Logout
          </button>
        </aside>

        {/* Drawer Sidebar (mobile) */}
        <MobileDrawer open={open} onClose={() => setOpen(false)}>
          <div className="p-4">
            <UserCard name={me.name} roles={me.roles} />
            <nav className="mt-4 space-y-1">
              {VISIBLE.map((m) => (
                <NavLink
                  key={m.to}
                  to={m.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    [
                      'block rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-[var(--color-brand-primary)] text-[var(--color-brand-on)] shadow-elev-1'
                        : 'hover:bg-[#E6EDFF]',
                    ].join(' ')
                  }
                >
                  {m.label}
                </NavLink>
              ))}
            </nav>
            <button
              onClick={async () => {
                await useAuth.logout();
                nav('/login', { replace: true });
              }}
              className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm hover:bg-[#E6EDFF] transition-colors"
            >
              Logout
            </button>
          </div>
        </MobileDrawer>

        {/* Konten */}
        <main className="min-w-0">
          <div className="rounded-lg border border-[var(--color-border)] bg-white/90 p-4 shadow-elev-1">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function UserCard(props: { name: string; roles: string[] }) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
      <div className="font-semibold">{props.name}</div>
      <div className="mt-0.5 text-xs text-black/60 dark:text-white/70">
        {props.roles?.join(', ')}
      </div>
    </div>
  );
}

function MobileDrawer(props: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <>
      {/* Overlay */}
      <div
        className={[
          'fixed inset-0 z-40 bg-black/30 transition-opacity md:hidden',
          props.open ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
        onClick={props.onClose}
        aria-hidden={!props.open}
      />
      {/* Panel */}
      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 w-72 border-r border-[var(--color-border)] bg-white p-0 shadow-elev-2 transition-transform md:hidden',
          props.open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
      >
        {props.children}
      </aside>
    </>
  );
}

/** Komponen guard untuk tombol/aksi dalam halaman */
export function RequireRole(props: { roles: RoleName[]; children: React.ReactNode; fallback?: React.ReactNode }) {
  const allowed = useHasRole(props.roles);
  if (!allowed) return props.fallback ?? null;
  return <>{props.children}</>;
}

```
</details>



## router (src/reouter)

### src/router/Guarded.tsx

- SHA: `588b0d2ac55c`  
- Ukuran: 947 B
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
import { useEffect, useState, type ReactNode } from 'react';
import { useAuth } from '../store/useAuth';
import type { RoleName } from '../api/client';

// Hook ringan untuk ambil snapshot dari store dan reaktif lewat subscribe()
function useAuthState() {
  const [snapshot, setSnapshot] = useState(() => ({
    user: useAuth.user,
    roles: useAuth.roles,
  }));
  useEffect(() => {
    const unsub = useAuth.subscribe(() => {
      setSnapshot({ user: useAuth.user, roles: useAuth.roles });
    });
    return () => { unsub(); };
  }, []);
  return snapshot;
}

export default function Guarded(props: { roles: RoleName[]; children: ReactNode }) {
  const { roles: myRoles } = useAuthState();
  const allowed = (myRoles ?? []).some((r: RoleName) => props.roles.includes(r)); // <- r ditipkan
  if (!allowed) {
    return <div className="text-sm text-red-600">Anda tidak berhak mengakses halaman ini.</div>;
  }
  return <>{props.children}</>;
}

```
</details>

### src/router/index.tsx

- SHA: `be7db023a69b`  
- Ukuran: 9 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/router/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import GuestLayout from '../layouts/GuestLayout';
import ProtectedLayout from '../layouts/ProtectedLayout';
import LoginPage from '../pages/Login';
import { lazy } from 'react';
import Guarded from './Guarded';
import LazyBoundary from '../components/LazyBoundary';

const BranchIndex = lazy(() => import('../pages/branches/BranchIndex'));
const BranchForm = lazy(() => import('../pages/branches/BranchForm'));
const InvoiceSettings = lazy(() => import('../pages/branches/InvoiceSettings'));
const CategoryIndex = lazy(() => import('../pages/services/CategoryIndex'));
const ServiceIndex = lazy(() => import('../pages/services/ServiceIndex'));
const ServiceForm = lazy(() => import('../pages/services/ServiceForm'));
const CustomersIndex = lazy(() => import('../pages/customers/CustomersIndex'));
const CustomerDetail = lazy(() => import('../pages/customers/CustomerDetail'));
const UsersList = lazy(() => import('../pages/users/UsersList'));
const UserForm = lazy(() => import('../pages/users/UserForm'));
const POSPage = lazy(() => import('../pages/pos/POSPage'));
const OrdersIndex = lazy(() => import('../pages/orders/OrdersIndex'));
const OrderDetail = lazy(() => import('../pages/orders/OrderDetail'));
const OrderReceipt = lazy(() => import('../pages/orders/OrderReceipt'));
const DeliveryIndex = lazy(() => import('../pages/deliveries/DeliveryIndex'));
const DeliveryDetail = lazy(() => import('../pages/deliveries/DeliveryDetail'));
const VouchersIndex = lazy(() => import('../pages/vouchers/VouchersIndex'));
const VoucherForm = lazy(() => import('../pages/vouchers/VoucherForm'));
const ReceivablesIndex = lazy(() => import('../pages/receivables/ReceivablesIndex'));
const ExpensesIndex = lazy(() => import('../pages/expenses/ExpensesIndex'));
const ExpenseForm = lazy(() => import('../pages/expenses/ExpenseForm'));
const DashboardHome = lazy(() => import('../pages/dashboard/DashboardHome'));

export const router = createBrowserRouter([
  {
    element: <GuestLayout />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: '/',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir', 'Petugas Cuci', 'Kurir']}>
            <LazyBoundary>
              <DashboardHome />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/customers',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir']}>
            <LazyBoundary>
              <CustomersIndex />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/customers/:id',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir']}>
            <LazyBoundary>
              <CustomerDetail />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/service-categories',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang']}>
            <LazyBoundary>
              <CategoryIndex />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/services',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang']}>
            <LazyBoundary>
              <ServiceIndex />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/services/new',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang']}>
            <LazyBoundary>
              <ServiceForm />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/services/:id/edit',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang']}>
            <LazyBoundary>
              <ServiceForm />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/users',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang']}>
            <LazyBoundary>
              <UsersList />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/users/new',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang']}>
            <LazyBoundary>
              <UserForm />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/users/:id/edit',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang']}>
            <LazyBoundary>
              <UserForm />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/branches',
        element: (
          <Guarded roles={['Superadmin']}>
            <LazyBoundary>
              <BranchIndex />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/branches/new',
        element: (
          <Guarded roles={['Superadmin']}>
            <LazyBoundary>
              <BranchForm />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/branches/:id/edit',
        element: (
          <Guarded roles={['Superadmin']}>
            <LazyBoundary>
              <BranchForm />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/branches/:id/invoice-settings',
        element: (
          <Guarded roles={['Superadmin']}>
            <LazyBoundary>
              <InvoiceSettings />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/pos',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir']}>
            <LazyBoundary>
              <POSPage />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/orders',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir']}>
            <LazyBoundary>
              <OrdersIndex />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/orders/:id',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir']}>
            <LazyBoundary>
              <OrderDetail />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/orders/:id/receipt',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir']}>
            <LazyBoundary>
              <OrderReceipt />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/deliveries',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir', 'Kurir']}>
            <LazyBoundary>
              <DeliveryIndex />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/deliveries/:id',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir', 'Kurir']}>
            <LazyBoundary>
              <DeliveryDetail />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/expenses',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang']}>
            <LazyBoundary>
              <ExpensesIndex />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/expenses/new',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang']}>
            <LazyBoundary>
              <ExpenseForm />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/expenses/:id/edit',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang']}>
            <LazyBoundary>
              <ExpenseForm />
            </LazyBoundary>
          </Guarded>
        ),
      },
      {
        path: '/receivables',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir']}>
            <LazyBoundary>
              <ReceivablesIndex />
            </LazyBoundary>
          </Guarded>
        ),
      },
      ...(import.meta.env.VITE_FEATURE_VOUCHER === 'true'
        ? [
            {
              path: '/vouchers',
              element: (
                <Guarded roles={['Superadmin', 'Admin Cabang']}>
                  <LazyBoundary>
                    <VouchersIndex />
                  </LazyBoundary>
                </Guarded>
              ),
            },
            {
              path: '/vouchers/new',
              element: (
                <Guarded roles={['Superadmin', 'Admin Cabang']}>
                  <LazyBoundary>
                    <VoucherForm />
                  </LazyBoundary>
                </Guarded>
              ),
            },
            {
              path: '/vouchers/:id/edit',
              element: (
                <Guarded roles={['Superadmin', 'Admin Cabang']}>
                  <LazyBoundary>
                    <VoucherForm />
                  </LazyBoundary>
                </Guarded>
              ),
            },
          ]
        : []),
    ],
  },
]);

```
</details>



## Types (src/types)

### src/types/branches.ts

- SHA: `4969acb7da70`  
- Ukuran: 1 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/types/branches.ts
export type ResetPolicy = 'monthly' | 'never';

export interface Branch {
  id: string;
  code: string;
  name: string;
  address?: string | null;
  invoice_prefix: string;
  reset_policy: ResetPolicy;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface BranchUpsertPayload {
  code: string;
  name: string;
  address?: string | null;
  invoice_prefix: string;
  reset_policy: ResetPolicy;
}

export interface BranchQuery {
  q?: string;
  page?: number;
  per_page?: number;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface InvoiceCounter {
  id: string;
  branch_id: string;
  prefix: string;
  seq: number;
  reset_policy: ResetPolicy;
  last_reset_month?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface InvoiceCounterUpsertPayload {
  branch_id: string;
  prefix: string;         
  reset_policy: ResetPolicy;
  seq?: number;
}

export interface InvoiceCounterQuery {
  branch_id?: string;
  page?: number;
  per_page?: number;
}

```
</details>

### src/types/customers.ts

- SHA: `a990c8398134`  
- Ukuran: 1 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/types/customers.ts
export interface Customer {
  id: string;
  branch_id: string;
  name: string;
  whatsapp: string;
  address: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CustomerUpsertPayload {
  branch_id?: string; // Akan dipaksa branch user untuk Admin Cabang/Kasir oleh backend
  name: string;
  whatsapp: string; // normalisasi tanpa spasi di backend
  address?: string | null;
  notes?: string | null;
}

export interface CustomerQuery {
  q?: string;
  page?: number;
  per_page?: number;
  branch_id?: string; // hanya efektif untuk Superadmin
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
  message: string;
  errors: Record<string, string[] | string> | null;
}

export interface SingleResponse<T> {
  data: T | null;
  meta: Record<string, unknown> | null;
  message: string;
  errors: Record<string, string[] | string> | null;
}

```
</details>

### src/types/dashboard.ts

- SHA: `7c56c02702aa`  
- Ukuran: 1013 B
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/types/dashboard.ts
export interface TopServiceRow {
  service_id: number | string;
  name: string;
  qty: number;
  amount: number;
}

export interface OmzetDailyPoint {
  date: string;      // YYYY-MM-DD
  amount: number;
}

export interface OmzetMonthlyPoint {
  month: string;     // YYYY-MM
  amount: number;
}

/**
 * Cerminan tepat dari payload backend /dashboard/summary
 * Lihat Backend_Docs.md M11 DashboardController::summary()
 */
export interface DashboardSummary {
  omzet_total: number;
  orders_count: number;

  top_services: TopServiceRow[];

  vouchers_used_count: number;
  vouchers_used_amount: number;

  delivery_shipping_fee: number;

  receivables_open_count: number;
  receivables_open_amount: number;

  omzet_daily: OmzetDailyPoint[];
  omzet_monthly: OmzetMonthlyPoint[];
}

export interface DashboardSummaryMeta {
  from: string;               // YYYY-MM-DD
  to: string;                 // YYYY-MM-DD
  branch_id?: string | null;  // UUID cabang atau null/undefined = semua
}

```
</details>

### src/types/deliveries.ts

- SHA: `985ea24185f1`  
- Ukuran: 2 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/types/deliveries.ts
export type DeliveryType = 'pickup' | 'delivery' | 'return';

export type DeliveryStatus =
  | 'CREATED'
  | 'ASSIGNED'
  | 'PICKED_UP'
  | 'ON_ROUTE'
  | 'DELIVERED'
  | 'FAILED'
  | 'CANCELLED';

export interface Delivery {
  id: string;
  order_id: string;
  type: string;
  zone_id: string | null;
  fee: number;
  assigned_to: string | number | null;
  auto_assigned: boolean;
  status: DeliveryStatus;
  handover_photo?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface DeliveryEvent {
  id: string;
  delivery_id: string;
  status: DeliveryStatus;
  note: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface DeliveryCreatePayload {
  order_id: string;
  type: DeliveryType | string;
  zone_id?: string | null;
  fee?: number;
}

export interface DeliveryAssignPayload {
  user_id: string | number;
}

export interface DeliveryStatusPayload {
  status: DeliveryStatus;
  note?: string | null
  handover_photo?: File | null;
}

export interface DeliveryQuery {
  q?: string;
  status?: DeliveryStatus;
  courier_id?: string | number;
  page?: number;
  per_page?: number;
  branch_id?: string;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
  message: string;
  errors: Record<string, string[] | string> | null;
}

export interface SingleResponse<T> {
  data: T | null;
  meta: Record<string, unknown> | null;
  message: string;
  errors: Record<string, string[] | string> | null;
}

```
</details>

### src/types/expenses.ts

- SHA: `8527b92302de`  
- Ukuran: 1 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/types/expenses.ts
export interface Expense {
  id: string;
  branch_id: string;
  category: string;
  amount: number;
  note: string | null;
  proof_path: string | null;
  created_at: string | null;
  updated_at: string | null;
  // Optional eager loaded relation
  branch?: { id: string; name: string } | null;
}

export interface ExpenseCreatePayload {
  branch_id?: string; // required untuk Superadmin (divalidasi backend)
  category: string;
  amount: number;
  note?: string | null;
  proof?: File | null;
}

export interface ExpenseUpdatePayload {
  category: string;
  amount: number;
  note?: string | null;
  proof?: File | null; // jika diisi: mengganti bukti lama
}

export interface ExpenseQuery {
  branch_id?: string;
  date_from?: string; // YYYY-MM-DD
  date_to?: string;   // YYYY-MM-DD
  page?: number;
  per_page?: number;
}

export type PaginationMeta = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
};

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
  message: string | null;
  errors: Record<string, string[] | string> | null;
}

export interface SingleResponse<T> {
  data: T | null;
  meta: Record<string, unknown> | null;
  message: string | null;
  errors: Record<string, string[] | string> | null;
}

```
</details>

### src/types/orders.ts

- SHA: `a05d90a1fce4`  
- Ukuran: 3 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/types/orders.ts
import type { Service } from './services';
import type { Customer } from './customers';

export type OrderBackendStatus =
    | 'QUEUE' | 'WASHING' | 'DRYING' | 'IRONING' | 'READY' | 'DELIVERING' | 'PICKED_UP' | 'CANCELED';

export type OrderUiStep = 'QUEUE' | 'WASH' | 'DRY' | 'FINISHING' | 'COMPLETED' | 'PICKED_UP';

export type PaymentStatus = 'PENDING' | 'DP' | 'PAID' | 'UNPAID' | 'SETTLED';

export const UI_TO_BACKEND_STATUS: Record<OrderUiStep, OrderBackendStatus> = {
    QUEUE: 'QUEUE',
    WASH: 'WASHING',
    DRY: 'DRYING',
    FINISHING: 'IRONING',
    COMPLETED: 'READY',
    PICKED_UP: 'PICKED_UP',
};

export const BACKEND_TO_UI_STATUS: Record<OrderBackendStatus, OrderUiStep> = {
    QUEUE: 'QUEUE',
    WASHING: 'WASH',
    DRYING: 'DRY',
    IRONING: 'FINISHING',
    READY: 'COMPLETED',
    DELIVERING: 'COMPLETED',
    PICKED_UP: 'PICKED_UP',
    CANCELED: 'QUEUE',
};

export interface OrderItemInput {
    service_id: string;
    qty: number;
    note?: string | null;
}

export interface OrderItem {
    id: string;
    order_id: string;
    service_id: string;
    qty: number;
    price: number;
    total: number;
    note: string | null;
    service?: Service;
}

export interface Order {
    id: string;
    branch_id: string;
    customer_id: string | null;
    number: string;
    status: OrderBackendStatus;
    subtotal: number;
    discount: number;
    grand_total: number;
    due_amount: number;
    notes: string | null;
    payment_status: 'PENDING' | 'DP' | 'PAID' | 'UNPAID' | 'SETTLED';
    dp_amount: number;     // str
    paid_amount: number;
    paid_at: string | null;
    invoice_no: string | null;
    total: number;        // str (grand_total)
    created_at: string | null;
    updated_at: string | null;
    customer?: Customer | null;
    items?: OrderItem[];
    photos?: OrderPhoto[];
}

export type OrderPhotoKind = 'BEFORE' | 'AFTER';

export interface OrderPhoto {
    id: string;
    order_id: string;
    kind: OrderPhotoKind;
    path: string;
}

export interface OrderCreatePayload {
    branch_id?: string;
    customer_id?: string | null;
    items: OrderItemInput[];
    discount?: number;
    notes?: string | null;
}

export interface OrderUpdatePayload {
    customer_id?: string | null;
    items?: OrderItemInput[];
    discount?: number;
    notes?: string | null;
}

export interface OrderQuery {
    q?: string;
    status?: OrderBackendStatus;
    page?: number;
    per_page?: number;
    branch_id?: string;
}

export interface PaginationMeta {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
}

export interface Paginated<T> {
    data: T[];
    meta: PaginationMeta;
    message: string;
    errors: Record<string, string[] | string> | null;
}

export interface SingleResponse<T> {
    data: T | null;
    meta: Record<string, unknown> | null;
    message: string;
    errors: Record<string, string[] | string> | null;
}

```
</details>

### src/types/payments.ts

- SHA: `a3a68e2ecd8b`  
- Ukuran: 410 B
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
export type PaymentMethod = 'PENDING' | 'DP' | 'CASH' | 'QRIS' | 'TRANSFER';

export type PaymentCreatePayload = {
    method: PaymentMethod;
    amount: number;
    paid_at?: string | null;
    note?: string | null;
};

export type Payment = {
    id: string;
    order_id: string;
    method: PaymentMethod;
    amount: number;
    paid_at: string | null;
    note: string | null;
    created_at: string;
};

```
</details>

### src/types/receivables.ts

- SHA: `77e577194255`  
- Ukuran: 1 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/types/receivables.ts
import type { PaymentMethod, Payment } from "../types/payments";
import type { Order } from "../types/orders";

export type ReceivableStatus = "OPEN" | "PARTIAL" | "SETTLED" | "OVERDUE";

export interface Receivable {
    id: string;
    order_id: string;
    remaining_amount: number;
    status: ReceivableStatus;
    due_date: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    order?: {
        id: string;
        branch_id: string;
        customer_id: string | null;
        invoice_no: string | null;
        grand_total: number;
        paid_amount: number;
        due_amount: number;
        status: string;
        payment_status: string;
        created_at: string;
        customer?: { id: string; name: string | null } | null;
    } | null;
}

export interface ReceivableQuery {
    q?: string;
    status?: ReceivableStatus | "";
    due_before?: string; // YYYY-MM-DD
    customer_id?: string;
    page?: number;
    per_page?: number;
    branch_id?: string;
}

export interface ReceivableSettlePayload {
    amount: number;
    method: PaymentMethod; // CASH | QRIS | TRANSFER
    paid_at?: string;
    note?: string | null;
}

export interface ReceivableSettleResult {
    receivable: Receivable;
    order: Order;
    payment?: Payment | null;
}

```
</details>

### src/types/services.ts

- SHA: `8c3c6f2e0ddb`  
- Ukuran: 2 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

/** MASTER: Kategori Layanan */
export interface ServiceCategory {
  id: string;
  name: string;
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CategoryUpsertPayload {
  name: string;
  is_active?: boolean;
}

export interface CategoryQuery {
  q?: string;
  is_active?: boolean;
  page?: number;
  per_page?: number;
}

/** MASTER: Layanan */
export interface Service {
  id: string;
  category_id: string;
  name: string;
  unit: string;                // ERD menekankan 'unit', tidak membatasi enumerasi di dokumen
  price_default: number;       // sesuai skema DB
  is_active: boolean;
  category?: ServiceCategory;  // opsional bila backend menyertakan relasi
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ServiceUpsertPayload {
  category_id: string;
  name: string;
  unit: string;
  price_default: number;
  is_active?: boolean;
}

export interface ServiceQuery {
  q?: string;
  category_id?: string;
  is_active?: boolean;
  page?: number;
  per_page?: number;
}

/** Override harga per cabang */
export interface ServicePrice {
  id: string;
  service_id: string;
  branch_id: string;
  price: number;
  created_at?: string | null;
  updated_at?: string | null;
}

/** Payload set harga per cabang (idempotent di backend) */
export interface ServicePriceSetPayload {
  service_id: string;
  branch_id: string;
  price: number;
}

```
</details>

### src/types/users.ts

- SHA: `9f576bb91d3b`  
- Ukuran: 1 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/types/users.ts
import type { RoleName } from '../api/client';

export interface User {
    id: string;
    name: string;
    email: string;
    branch_id: string | null;
    is_active: boolean;
    roles: RoleName[];
    created_at?: string | null;
    updated_at?: string | null;
}

export interface UserUpsertPayload {
    name: string;
    email: string;
    password?: string;
    branch_id?: string | null;
    is_active?: boolean;
    role?: RoleName;        // ⬅️ single role untuk kompatibel create
    roles?: RoleName[];     // ⬅️ multi roles (dipakai via endpoint khusus)
}

export interface UserQuery {
    q?: string;
    role?: RoleName;
    branch_id?: string; // efektif untuk Superadmin
    page?: number;
    per_page?: number;
}

export interface PaginationMeta {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
}

export interface Envelope<T, M = unknown> {
    data: T;
    meta: M;
    message: string | null;
    errors: Record<string, string[]> | null;
}

```
</details>

### src/types/vouchers.ts

- SHA: `40392fcaeff8`  
- Ukuran: 1 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/types/vouchers.ts
export type ID = string;

export type VoucherType = 'PERCENT' | 'NOMINAL';

export type Voucher = {
    id: ID;
    branch_id: ID | null;
    code: string;
    type: VoucherType;
    value: number;
    start_at: string | null;
    end_at: string | null;  
    min_total: number;
    usage_limit: number | null;
    active: boolean;
    created_at?: string;
    updated_at?: string;
};

export type VoucherQuery = {
    q?: string;
    page?: number;
    per_page?: number;
    active?: boolean;
    branch_id?: ID | null;
};

export type VoucherUpsertPayload = {
    branch_id?: ID | null;
    code: string;
    type: VoucherType;
    value: number;
    start_at?: string | null;
    end_at?: string | null;
    min_total?: number;
    usage_limit?: number | null;
    active?: boolean;
};

export type PaginationMeta = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

export type ListResponse<T> = { data: T[]; meta: PaginationMeta };
export type ItemResponse<T> = { data: T };

export type ApplyVoucherPayload = { code: string };
export type ApplyVoucherResponse = {
    applied_amount: number;
    order: unknown;
};

```
</details>



## Components (src/components)

### src/components/ConfirmDialog.tsx

- SHA: `5d2261ec27f2`  
- Ukuran: 261 B
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
export interface Props {
    open: boolean;
    title: string;
    message?: string;
    onConfirm(): void;
    onClose(): void;
}
export default function ConfirmDialog(props: Props) {
    void props; // mark as used agar lolos no-unused-vars
    return null;
}
```
</details>

### src/components/customers/CustomerPicker.tsx

- SHA: `41ab43d06c00`  
- Ukuran: 9 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/components/customers/CustomerPicker.tsx
import React, { useEffect, useMemo, useRef, useState, useId } from "react";
import { listCustomers } from "../../api/customers";

type Props = {
  /** id pelanggan terpilih (untuk form/submit) */
  value: string | "";
  /** callback saat id berubah */
  onChange: (id: string | "") => void;
  /** placeholder input */
  placeholder?: string;
  /** opsional: tampilkan teks kecil error bila wajib */
  requiredText?: string;
};

type CustomerLite = {
  id: string;
  name: string;
  whatsapp?: string | null;
  address?: string | null;
};

type UnknownObj = Record<string, unknown>;

export default function CustomerPicker({
  value,
  onChange,
  placeholder = "Cari nama/WA/alamat pelanggan...",
  requiredText,
}: Props): React.ReactElement {
  const [query, setQuery] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<CustomerLite[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const boxRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const listboxId = useId();

  function isCustomerLite(u: unknown): u is CustomerLite {
    if (!u || typeof u !== "object") return false;
    const o = u as UnknownObj;
    return typeof o.id === "string" && typeof o.name === "string";
  }

  function extractRows(u: unknown): unknown[] {
    if (Array.isArray(u)) return u;
    if (u && typeof u === "object") {
      const o = u as UnknownObj;
      if (Array.isArray(o.data)) return o.data as unknown[];
      if (Array.isArray(o.items)) return o.items as unknown[];
      if (o.data && typeof o.data === "object" && Array.isArray((o.data as UnknownObj).data)) {
        return ((o.data as UnknownObj).data as unknown[]);
      }
    }
    return [];
  }

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // Debounce pencarian
  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (!query || query.length < 2) {
      setList([]);
      setOpen(false);
      setActiveIndex(-1);
      return;
    }
    timerRef.current = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await listCustomers({ q: query, per_page: 8 });
        const rowsUnknown = extractRows(res as unknown);
        const items: CustomerLite[] = rowsUnknown
          .map((r) => {
            if (!isCustomerLite(r)) return null;
            const o = r as UnknownObj;
            return {
              id: String(o.id),
              name: String(o.name),
              whatsapp: o.whatsapp ? String(o.whatsapp) : null,
              address: o.address ? String(o.address) : null,
            } as CustomerLite;
          })
          .filter((x): x is CustomerLite => x !== null);

        setList(items);
        setOpen(true);
        setActiveIndex(items.length > 0 ? 0 : -1);
      } catch {
        setList([]);
        setOpen(false);
        setActiveIndex(-1);
      } finally {
        setLoading(false);
      }
    }, 300) as unknown as number;
  }, [query]);

  // Jika parent reset value → kosongkan label
  useEffect(() => {
    if (!value) setSelectedLabel("");
  }, [value]);

  const showHelper = useMemo(() => !value && !!requiredText, [value, requiredText]);
  const displayText = selectedLabel || query;

  function pick(c: CustomerLite) {
    setSelectedLabel(c.name);
    setQuery(c.name);
    onChange(c.id);
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }

  function clearSelection() {
    setSelectedLabel("");
    setQuery("");
    onChange("");
    setList([]);
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      setActiveIndex((idx) => (idx === -1 && list.length ? 0 : idx));
      return;
    }
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (list.length ? (prev + 1) % list.length : -1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (list.length ? (prev - 1 + list.length) % list.length : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && list[activeIndex]) pick(list[activeIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div className="relative" ref={boxRef}>
      <div className="flex items-center gap-2">
        <div className="relative grow">
          <input
            ref={inputRef}
            className="input w-full pl-9 py-2"
            value={displayText}
            onChange={(e) => {
              setSelectedLabel("");
              onChange(""); // reset id saat user mulai mengetik lagi
              setQuery(e.target.value);
            }}
            placeholder={placeholder}
            onFocus={() => { if (list.length > 0) setOpen(true); }}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded={open}
            aria-controls={open ? `listbox-${listboxId}` : undefined}
            aria-autocomplete="list"
            aria-haspopup="listbox"
            aria-activedescendant={
              open && activeIndex >= 0 ? `option-${listboxId}-${list[activeIndex]?.id}` : undefined
            }
          />
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔎
          </span>
        </div>

        {value && (
          <button
            type="button"
            className="btn-outline text-xs px-2 py-1"
            onClick={clearSelection}
            title="Bersihkan pilihan"
          >
            ×
          </button>
        )}
      </div>

      {showHelper && (
        <div className="text-[11px] text-red-600 mt-1">{requiredText}</div>
      )}

      {open && (
        <div
          className="absolute z-20 mt-1 w-full rounded-lg border border-[color:var(--color-border)] bg-white shadow-elev-2 overflow-hidden"
          role="listbox"
          id={`listbox-${listboxId}`}
        >
          {loading && (
            <div className="px-3 py-2 text-sm flex items-center gap-2 opacity-70">
              <span className="h-4 w-4 rounded-full border-2 border-black/20 border-t-black/60 animate-spin" />
              Mencari…
            </div>
          )}

          {!loading && list.length === 0 && (
            <div className="px-3 py-2 text-sm opacity-70">Tidak ada hasil</div>
          )}

          {!loading && list.length > 0 && (
            <ul className="max-h-64 overflow-auto">
              {list.map((c, idx) => {
                const active = idx === activeIndex;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      id={`option-${listboxId}-${c.id}`}
                      role="option"
                      aria-selected={value === c.id || active}
                      className={`w-full text-left px-3 py-2 transition-colors ${
                        active ? "bg-[#E6EDFF]" : "hover:bg-black/5"
                      }`}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onMouseDown={(e) => e.preventDefault()} // cegah blur sebelum click
                      onClick={() => pick(c)}
                    >
                      <div className="text-sm font-medium">
                        {highlight(c.name, query)}
                      </div>
                      {(c.whatsapp || c.address) && (
                        <div className="text-[11px] opacity-70">
                          {c.whatsapp ? <>WA: {highlight(c.whatsapp, query)}</> : null}
                          {c.whatsapp && c.address ? " • " : ""}
                          {c.address ? <>{highlight(c.address, query)}</> : null}
                        </div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Utils ---------- */
function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function highlight(text?: string | null, q?: string) {
  if (!text) return null;
  if (!q || q.length < 2) return text;
  const parts = text.split(new RegExp(`(${escapeRegExp(q)})`, "ig"));
  return parts.map((part, i) =>
    part.toLowerCase() === q.toLowerCase()
      ? <mark key={i} className="bg-[#E6EDFF] px-0.5 rounded">{part}</mark>
      : <span key={i}>{part}</span>
  );
}

```
</details>

### src/components/DataTable.tsx

- SHA: `84c0672f24bd`  
- Ukuran: 2 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
import React from 'react';

export interface Column<T> {
    key: keyof T | string;
    header: string;
    render?(row: T): React.ReactNode;
}

type Props<T extends object> = {
    columns: Column<T>[];
    rows: T[];
    loading?: boolean;
    emptyText?: string;
};

export default function DataTable<T extends object>({
    columns,
    rows,
    loading = false,
    emptyText = 'Tidak ada data',
}: Props<T>) {
    if (loading) return <div className="text-sm text-gray-500">Memuat…</div>;
    if (!rows || rows.length === 0) return <div className="text-sm text-gray-500">{emptyText}</div>;

    return (
        <div className="overflow-auto rounded border">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((c) => (
                            <th key={String(c.key)} className="px-3 py-2 text-left font-medium text-gray-700">
                                {c.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => {
                        const record = row as unknown as Record<string, unknown>;
                        return (
                            <tr key={i} className="border-t">
                                {columns.map((c, j) => (
                                    <td key={`${String(c.key)}-${j}`} className="px-3 py-2">
                                        {c.render ? c.render(row) : String(record[String(c.key)] ?? '')}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
```
</details>

### src/components/delivery/AssignCourierSelect.tsx

- SHA: `7edcd5681f24`  
- Ukuran: 2 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/components/delivery/AssignCourierSelect.tsx
import { useEffect, useMemo, useState } from 'react';
import { listUsers } from '../../api/users';
import type { User } from '../../types/users';

type Props = {
    value: string | number | null;
    onChange: (userId: string | number | null) => void;
    disabled?: boolean;
};

export default function AssignCourierSelect({ value, onChange, disabled = false }: Props) {
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<User[]>([]);

    const options = useMemo(() => rows
        .filter(u => (u.roles ?? []).includes('Kurir'))
        .map(u => ({ id: u.id, label: `${u.name}` })), [rows]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            try {
                const res = await listUsers({ role: 'Kurir', per_page: 100 });
                const list = Array.isArray((res as unknown as { data: User[] }).data) ? (res as { data: User[] }).data : [];
                if (mounted) setRows(list);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    return (
        <div className="flex items-center gap-2">
            <select
                className="border rounded px-2 py-1 text-sm"
                value={value === null ? '' : String(value)}
                onChange={(e) => onChange(e.target.value ? e.target.value : null)}
                disabled={disabled || loading}
            >
                <option value="">{loading ? 'Memuat kurir…' : '— Pilih Kurir —'}</option>
                {options.map(o => (
                    <option key={String(o.id)} value={String(o.id)}>{o.label}</option>
                ))}
            </select>
            {value && (
                <button
                    type="button"
                    className="text-xs border rounded px-2 py-1"
                    onClick={() => onChange(null)}
                    disabled={disabled}
                    title="Kosongkan kurir"
                >
                    ×
                </button>
            )}
        </div>
    );
}

```
</details>

### src/components/delivery/DeliveryStatusStepper.tsx

- SHA: `0cb4caba06e7`  
- Ukuran: 793 B
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/components/delivery/DeliveryStatusStepper.tsx
import type { DeliveryStatus } from '../../types/deliveries';

const FLOW: DeliveryStatus[] = ['CREATED', 'ASSIGNED', 'PICKED_UP', 'ON_ROUTE', 'DELIVERED'];

export default function DeliveryStatusStepper({ status }: { status: DeliveryStatus }) {
    const activeIdx = Math.max(0, FLOW.indexOf(status));
    return (
        <div className="flex items-center gap-2 text-xs">
            {FLOW.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                    <div className={`px-2 py-1 rounded ${i <= activeIdx ? 'bg-black text-white' : 'border'}`}>{s}</div>
                    {i < FLOW.length - 1 && <div className="w-6 h-px bg-muted" />}
                </div>
            ))}
        </div>
    );
}

```
</details>

### src/components/Dropzone.tsx

- SHA: `1ea7e5280ea4`  
- Ukuran: 51 B
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
export default function Dropzone() { return null; }
```
</details>

### src/components/FilterBar.tsx

- SHA: `3605319a8f83`  
- Ukuran: 52 B
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
export default function FilterBar() { return null; }
```
</details>

### src/components/LazyBoundary.tsx

- SHA: `8ed0e79357ac`  
- Ukuran: 470 B
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/components/LazyBoundary.tsx
import { Suspense, type ReactNode } from 'react';

export default function LazyBoundary({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="loading-inline" role="status" aria-live="polite">
          <span className="spinner" aria-hidden="true"></span>
          <span className="loading-text">Memuat…</span>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

```
</details>

### src/components/orders/OrderPhotos.tsx

- SHA: `616c2e46ff31`  
- Ukuran: 8 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/components/orders/OrderPhotos.tsx
import { useMemo, useRef, useState } from "react";
import { uploadOrderPhotos } from "../../api/orderPhotos";

type Props = {
  orderId: string;
  onUploaded?: () => void;
};

type Incoming = { before: File[]; after: File[] };

export default function OrderPhotos({ orderId, onUploaded }: Props) {
  const [files, setFiles] = useState<Incoming>({ before: [], after: [] });
  const [busy, setBusy] = useState(false);
  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef = useRef<HTMLInputElement>(null);

  // Heuristik ringan: mobile? -> gunakan capture camera
  const isMobile = useMemo(() => {
    const ua = navigator.userAgent.toLowerCase();
    return /android|iphone|ipad|ipod/.test(ua);
  }, []);

  function pick(kind: "before" | "after") {
    (kind === "before" ? beforeRef : afterRef).current?.click();
  }

  function onChange(kind: "before" | "after", list: FileList | null) {
    if (!list) return;
    const arr = Array.from(list);
    setFiles(prev => ({
      ...prev,
      [kind]: [...prev[kind], ...arr],
    }));
  }

  async function onUpload() {
    try {
      setBusy(true);
      await uploadOrderPhotos(orderId, files.before, files.after);
      setFiles({ before: [], after: [] });
      onUploaded?.();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card border border-[color:var(--color-border)] rounded-2xl shadow-elev-1 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm font-semibold tracking-tight">Order Photos</div>
          <p className="text-xs text-gray-600">Foto sebelum & sesudah (opsional). Gunakan kamera belakang untuk hasil terbaik.</p>
        </div>
        {busy && (
          <span className="inline-flex items-center gap-2 text-xs text-gray-600" aria-live="polite">
            <span className="h-3 w-3 rounded-full border-2 border-black/20 border-t-black/70 animate-spin" />
            Mengunggah…
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* BEFORE */}
        <section className="card border border-[color:var(--color-border)] rounded-xl p-3">
          <header className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium">Before</div>
            <span className="text-[10px] text-gray-500">{files.before.length} file</span>
          </header>

          {/* PC: drag & drop; Mobile: tombol kamera */}
          <div
            className="group relative grid place-content-center rounded-xl border-2 border-dashed border-[color:var(--color-border)] bg-white/80 p-5 text-center text-xs hover:border-[color:var(--color-brand-primary)] transition-colors"
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault();
              const dropped = Array.from(e.dataTransfer.files || []);
              setFiles(prev => ({ ...prev, before: [...prev.before, ...dropped] }));
            }}
            role="button"
            aria-label="Area unggah foto sebelum"
          >
            {isMobile ? (
              <button
                type="button"
                className="btn-primary"
                onClick={() => pick("before")}
              >
                Buka Kamera
              </button>
            ) : (
              <>
                <div className="mb-2 text-gray-600">Tarik & letakkan file ke sini</div>
                <div className="text-gray-500">atau</div>
                <button
                  type="button"
                  className="btn-outline mt-2"
                  onClick={() => pick("before")}
                >
                  Pilih File
                </button>
              </>
            )}
          </div>

          <input
            ref={beforeRef}
            type="file"
            accept="image/*"
            capture={isMobile ? "environment" : undefined}
            multiple
            className="hidden"
            onChange={e => onChange("before", e.target.files)}
          />

          {/* Preview ringkas */}
          {files.before.length > 0 && (
            <ul className="mt-3 divide-y divide-[color:var(--color-border)] rounded-md border border-[color:var(--color-border)] bg-white/70">
              {files.before.map((f, i) => (
                <li key={i} className="flex items-center justify-between gap-2 px-3 py-2 text-xs">
                  <span className="truncate max-w-[70%]">{f.name}</span>
                  <span className="shrink-0 text-[10px] text-gray-500">{Math.ceil(f.size / 1024)} KB</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* AFTER */}
        <section className="card border border-[color:var(--color-border)] rounded-xl p-3">
          <header className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium">After</div>
            <span className="text-[10px] text-gray-500">{files.after.length} file</span>
          </header>

          <div
            className="group relative grid place-content-center rounded-xl border-2 border-dashed border-[color:var(--color-border)] bg-white/80 p-5 text-center text-xs hover:border-[color:var(--color-brand-primary)] transition-colors"
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault();
              const dropped = Array.from(e.dataTransfer.files || []);
              setFiles(prev => ({ ...prev, after: [...prev.after, ...dropped] }));
            }}
            role="button"
            aria-label="Area unggah foto sesudah"
          >
            {isMobile ? (
              <button
                type="button"
                className="btn-primary"
                onClick={() => pick("after")}
              >
                Buka Kamera
              </button>
            ) : (
              <>
                <div className="mb-2 text-gray-600">Tarik & letakkan file ke sini</div>
                <div className="text-gray-500">atau</div>
                <button
                  type="button"
                  className="btn-outline mt-2"
                  onClick={() => pick("after")}
                >
                  Pilih File
                </button>
              </>
            )}
          </div>

          <input
            ref={afterRef}
            type="file"
            accept="image/*"
            capture={isMobile ? "environment" : undefined}
            multiple
            className="hidden"
            onChange={e => onChange("after", e.target.files)}
          />

          {files.after.length > 0 && (
            <ul className="mt-3 divide-y divide-[color:var(--color-border)] rounded-md border border-[color:var(--color-border)] bg-white/70">
              {files.after.map((f, i) => (
                <li key={i} className="flex items-center justify-between gap-2 px-3 py-2 text-xs">
                  <span className="truncate max-w-[70%]">{f.name}</span>
                  <span className="shrink-0 text-[10px] text-gray-500">{Math.ceil(f.size / 1024)} KB</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="btn-primary"
          onClick={onUpload}
          disabled={busy || (files.before.length === 0 && files.after.length === 0)}
        >
          {busy ? "Mengunggah..." : "Upload"}
        </button>
        <button
          type="button"
          className="btn-outline"
          onClick={() => setFiles({ before: [], after: [] })}
          disabled={busy}
        >
          Reset
        </button>
        <span className="text-[10px] text-gray-500 ml-auto">
          Hanya gambar (*.jpg, *.png, *.heic). Kamera belakang aktif di mobile.
        </span>
      </div>
    </div>
  );
}

```
</details>

### src/components/orders/OrderPhotosGallery.tsx

- SHA: `1dbf91a387b4`  
- Ukuran: 4 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/components/orders/OrderPhotosGallery.tsx
import { useMemo } from "react";
import type { OrderPhoto } from "../../types/orders";

const fileUrl = (p?: string | null) => {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;
  const filesBase = (import.meta.env.VITE_FILES_BASE_URL || "").replace(/\/+$/, "");
  // Fallback pintar: jika FILES_BASE_URL kosong, coba turunan dari API_BASE_URL (buang suffix /api/v1)
  const apiBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
  const originFallback = apiBase.replace(/\/api\/v1$/i, "");
  const base = filesBase || originFallback || "";
  return `${base}/${String(p).replace(/^\/+/, "")}`;
};

export default function OrderPhotosGallery({ photos }: { photos: OrderPhoto[] }) {
  const groups = useMemo(() => {
    const norm = (k: unknown) => String(k || "").toUpperCase();
    return {
      before: photos.filter(p => norm(p.kind) === "BEFORE"),
      after: photos.filter(p => norm(p.kind) === "AFTER"),
    };
  }, [photos]);

  if (!photos?.length) {
    return (
      <div className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1 p-4">
        <div className="text-sm font-semibold mb-1">Order Photos</div>
        <div className="text-xs text-gray-500">Belum ada foto.</div>
      </div>
    );
  }

  return (
    <div className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1 p-4 space-y-4">
      <div className="text-sm font-semibold tracking-tight">Order Photos</div>
      <Section label="Before" items={groups.before} />
      <Section label="After" items={groups.after} />
    </div>
  );
}

function resolveCreatedAt(p: OrderPhoto): string | undefined {
  // Jangan asumsikan nama field timestamp. Ambil yang ada saja.
  const anyP = p as unknown as Record<string, unknown>;
  const raw =
    (anyP["created_at"] as string | undefined) ??
    (anyP["createdAt"] as string | undefined) ??
    (anyP["uploaded_at"] as string | undefined) ??
    (anyP["timestamp"] as string | undefined);

  if (!raw) return undefined;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? undefined : d.toLocaleString();
}

function Section({ label, items }: { label: string; items: OrderPhoto[] }) {
  return (
    <div>
      <div className="text-xs font-medium text-gray-600 mb-2">{label}</div>
      {!items.length ? (
        <div className="text-xs text-gray-500">-</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {items.map(p => {
            const url = fileUrl(p.path);
            return (
              <a
                key={p.id}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                title={resolveCreatedAt(p)}
                className="group relative block overflow-hidden rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] transition-shadow hover:shadow-elev-2 focus:outline-none focus-visible:shadow-[var(--focus-ring)]"
              >
                <img
                  src={url}
                  alt={`${label} photo`}
                  loading="lazy"
                  className="w-full h-32 md:h-36 lg:h-40 object-cover transition-transform duration-150 ease-out group-hover:scale-[1.02]"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "data:image/svg+xml;utf8," +
                      encodeURIComponent(
                        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 140'><rect width='100%' height='100%' fill='#eee'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='10' fill='#999'>image not found</text></svg>"
                      );
                  }}
                />
                {/* subtle overlay on hover */}
                <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

```
</details>

### src/components/orders/OrderPhotosUpload.tsx

- SHA: `17221e244132`  
- Ukuran: 7 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/components/orders/OrderPhotosUpload.tsx
import { useMemo, useRef, useState } from "react";
import { uploadOrderPhotos } from "../../api/orderPhotos";

type Props = {
  orderId: string;
  onUploaded?: () => void;
};

type Incoming = { before: File[]; after: File[] };

export default function OrderPhotosUpload({ orderId, onUploaded }: Props) {
  const [files, setFiles] = useState<Incoming>({ before: [], after: [] });
  const [busy, setBusy] = useState(false);
  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef = useRef<HTMLInputElement>(null);

  const isMobile = useMemo(() => /android|iphone|ipad|ipod/i.test(navigator.userAgent), []);

  function pick(kind: "before" | "after") {
    (kind === "before" ? beforeRef : afterRef).current?.click();
  }

  function onChange(kind: "before" | "after", list: FileList | null) {
    if (!list) return;
    const arr = Array.from(list);
    setFiles(prev => ({ ...prev, [kind]: [...prev[kind], ...arr] }));
  }

  async function onUpload() {
    try {
      setBusy(true);
      await uploadOrderPhotos(orderId, files.before, files.after);
      setFiles({ before: [], after: [] });
      onUploaded?.();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1 p-4">
      <div className="mb-3">
        <h3 className="text-sm font-semibold tracking-tight">Order Photos</h3>
        <p className="text-xs text-gray-600">Unggah foto <span className="font-medium">Before</span> dan <span className="font-medium">After</span>. {isMobile ? 'Kamera tersedia di perangkat Anda.' : 'Dukung drag-drop & pilih file.'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* BEFORE */}
        <section className="border rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium">Before</div>
            <div className="text-[10px] text-gray-500">PNG/JPG, &le; 5MB</div>
          </div>

          <div
            className="border border-dashed rounded-lg p-4 text-center text-xs bg-white/50 hover:bg-black/5 transition-colors"
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault();
              const dropped = Array.from(e.dataTransfer.files || []);
              setFiles(prev => ({ ...prev, before: [...prev.before, ...dropped] }));
            }}
            aria-label="Drop zone foto before"
          >
            {isMobile ? (
              <button
                type="button"
                className="btn-primary disabled:opacity-50"
                onClick={() => pick("before")}
                disabled={busy}
              >
                Buka Kamera
              </button>
            ) : (
              <>
                <div className="mb-2 text-gray-600">Tarik & letakkan file ke sini</div>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => pick("before")}
                  disabled={busy}
                >
                  Pilih File
                </button>
              </>
            )}
          </div>

          <input
            ref={beforeRef}
            type="file"
            accept="image/*"
            capture={isMobile ? "environment" : undefined}
            multiple
            className="hidden"
            onChange={e => onChange("before", e.target.files)}
          />

          {files.before.length > 0 && (
            <ul className="mt-2 text-xs divide-y divide-[color:var(--color-border)] rounded-md border border-[color:var(--color-border)] bg-white/70 overflow-hidden">
              {files.before.map((f, i) => (
                <li key={i} className="px-3 py-2 flex items-center justify-between">
                  <span className="truncate">{f.name}</span>
                  <span className="text-[10px] text-gray-500 ml-2">{Math.ceil(f.size/1024)} KB</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* AFTER */}
        <section className="border rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium">After</div>
            <div className="text-[10px] text-gray-500">PNG/JPG, &le; 5MB</div>
          </div>

          <div
            className="border border-dashed rounded-lg p-4 text-center text-xs bg-white/50 hover:bg-black/5 transition-colors"
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault();
              const dropped = Array.from(e.dataTransfer.files || []);
              setFiles(prev => ({ ...prev, after: [...prev.after, ...dropped] }));
            }}
            aria-label="Drop zone foto after"
          >
            {isMobile ? (
              <button
                type="button"
                className="btn-primary disabled:opacity-50"
                onClick={() => pick("after")}
                disabled={busy}
              >
                Buka Kamera
              </button>
            ) : (
              <>
                <div className="mb-2 text-gray-600">Tarik & letakkan file ke sini</div>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => pick("after")}
                  disabled={busy}
                >
                  Pilih File
                </button>
              </>
            )}
          </div>

          <input
            ref={afterRef}
            type="file"
            accept="image/*"
            capture={isMobile ? "environment" : undefined}
            multiple
            className="hidden"
            onChange={e => onChange("after", e.target.files)}
          />

          {files.after.length > 0 && (
            <ul className="mt-2 text-xs divide-y divide-[color:var(--color-border)] rounded-md border border-[color:var(--color-border)] bg-white/70 overflow-hidden">
              {files.after.map((f, i) => (
                <li key={i} className="px-3 py-2 flex items-center justify-between">
                  <span className="truncate">{f.name}</span>
                  <span className="text-[10px] text-gray-500 ml-2">{Math.ceil(f.size/1024)} KB</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className="btn-primary disabled:opacity-50"
          onClick={onUpload}
          disabled={busy || (files.before.length === 0 && files.after.length === 0)}
          aria-live="polite"
        >
          {busy ? "Mengunggah..." : "Upload"}
        </button>
        <button
          type="button"
          className="btn-outline disabled:opacity-50"
          onClick={() => setFiles({ before: [], after: [] })}
          disabled={busy}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

```
</details>

### src/components/orders/OrderStatusStepper.tsx

- SHA: `77e3205182c1`  
- Ukuran: 2 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/components/orders/OrderStatusStepper.tsx
import React from 'react';
import type { OrderBackendStatus, OrderUiStep } from '../../types/orders';
import { BACKEND_TO_UI_STATUS } from '../../types/orders';

const UI_FLOW: OrderUiStep[] = ['QUEUE', 'WASH', 'DRY', 'FINISHING', 'COMPLETED', 'PICKED_UP'];

type Props = {
  backendStatus: OrderBackendStatus;
};

export default function OrderStatusStepper({ backendStatus }: Props): React.ReactElement {
  const current = BACKEND_TO_UI_STATUS[backendStatus];
  const activeIdx = UI_FLOW.indexOf(current);

  return (
    <div
      className="flex items-center gap-2 text-xs select-none"
      role="list"
      aria-label="Order progress"
    >
      {UI_FLOW.map((s, idx) => {
        const isCurrent = idx === activeIdx;
        const isDone = idx < activeIdx;

        const dotCls =
          'grid place-items-center h-6 w-6 rounded-full border text-[10px] font-semibold transition-transform duration-150 motion-reduce:transition-none';
        const dotState = isCurrent
          ? 'bg-[var(--color-brand-primary)] text-[color:var(--color-brand-on)] border-transparent scale-[1.04]'
          : isDone
          ? 'bg-[#E6EDFF] text-[var(--color-brand-primary)] border-[color:var(--color-brand-primary)]'
          : 'bg-[color:var(--color-surface)] text-gray-500 border-[color:var(--color-border)]';

        const labelCls = 'text-[11px] font-medium tracking-wide';
        const labelState = isCurrent
          ? 'text-[color:var(--color-text-default)]'
          : isDone
          ? 'text-[var(--color-brand-primary)]'
          : 'text-gray-500';

        const barCls = 'h-[2px] rounded w-6 md:w-10';
        const barState = idx < activeIdx
          ? 'bg-[var(--color-brand-primary)]/80'
          : 'bg-[color:var(--color-border)]';

        return (
          <React.Fragment key={s}>
            <div
              className="flex items-center gap-2"
              role="listitem"
              aria-current={isCurrent ? 'step' : undefined}
              aria-label={s}
            >
              <span className={`${dotCls} ${dotState}`} aria-hidden="true">{idx + 1}</span>
              <span className={`${labelCls} ${labelState}`}>{s}</span>
            </div>
            {idx < UI_FLOW.length - 1 && (
              <div className={`${barCls} ${barState}`} aria-hidden="true" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

```
</details>

### src/components/pos/CartPanel.tsx

- SHA: `ae5609e46bc7`  
- Ukuran: 4 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/components/pos/CartPanel.tsx
import { useMemo } from 'react';
import { toIDR } from '../../utils/money';
import type { ReactElement } from 'react';

export type CartItem = {
  service_id: string;
  name: string;
  unit: string;
  price: number;
  qty: number;
  note?: string | null;
};

type Props = {
  items: CartItem[];
  onChangeQty: (service_id: string, qty: number) => void;
  onChangeNote: (service_id: string, note: string) => void;
  onRemove: (service_id: string) => void;
};

export default function CartPanel({
  items,
  onChangeQty,
  onChangeNote,
  onRemove,
}: Props): ReactElement  {
  const subtotal = useMemo(
    () => items.reduce((s, it) => s + it.price * it.qty, 0),
    [items],
  );

  return (
    <div className="card rounded-lg border border-(--color-border) shadow-elev-1 p-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">Keranjang</div>
        <div className="text-[10px] text-gray-600">{items.length} item</div>
      </div>

      {items.length === 0 && (
        <div className="rounded-lg border border-dashed border-(--color-border) p-4 text-sm text-gray-600 text-center">
          Belum ada item
        </div>
      )}

      {items.length > 0 && (
        <>
          <ul className="space-y-2">
            {items.map((it) => (
              <li
                key={it.service_id}
                className="flex items-start gap-3 pb-2 border-b border-(--color-border)"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-medium truncate">{it.name}</div>
                    <span className="chip chip--subtle text-xs">{it.unit}</span>
                  </div>

                  <div className="mt-1 text-sm font-semibold">
                    {toIDR(it.price * it.qty)}
                  </div>

                  <input
                    className="input mt-2 px-2 py-2 text-sm w-full"
                    placeholder="Catatan item (opsional)"
                    value={it.note ?? ''}
                    onChange={(e) => onChangeNote(it.service_id, e.target.value)}
                    aria-label={`Catatan untuk ${it.name}`}
                  />
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <QtyStepper
                    value={it.qty}
                    onChange={(v) => onChangeQty(it.service_id, Math.max(1, v))}
                    label={`Kuantitas ${it.name}`}
                  />
                  <button
                    type="button"
                    className="btn-outline px-2 py-1 text-xs border-(--color-status-danger) text-(--color-status-danger)"
                    onClick={() => onRemove(it.service_id)}
                    aria-label={`Hapus ${it.name}`}
                  >
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-between items-center pt-2 text-sm font-semibold">
            <span>Subtotal</span>
            <span>{toIDR(subtotal)}</span>
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------
   Subcomponents (UI)
------------------------ */

function QtyStepper({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  label?: string;
}) {
  return (
    <div className="inline-flex items-center rounded-lg border border-(--color-border) overflow-hidden">
      <button
        type="button"
        className="px-2 py-1 hover:bg-black/5"
        onClick={() => onChange(Math.max(1, value - 1))}
        aria-label={label ? `${label}: kurang` : 'Kurangi jumlah'}
      >
        &minus;
      </button>
      <input
        type="number"
        min={1}
        value={value}
        onChange={(e) => onChange(Math.max(1, Number(e.target.value) || 1))}
        className="w-16 text-center py-1 input border-0 focus:ring-0"
        aria-label={label ?? 'Jumlah'}
      />
      <button
        type="button"
        className="px-2 py-1 hover:bg-black/5"
        onClick={() => onChange(value + 1)}
        aria-label={label ? `${label}: tambah` : 'Tambah jumlah'}
      >
        +
      </button>
    </div>
  );
}

```
</details>

### src/components/pos/CheckoutDialog.tsx

- SHA: `61a587f4382b`  
- Ukuran: 9 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/components/pos/CheckoutDialog.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { createOrderPayment } from "../../api/orders";
import type { PaymentCreatePayload, PaymentMethod } from "../../types/payments";
import { applyVoucherToOrder } from "../../api/vouchers";
import type { Order } from "../../types/orders";
import { toIDR } from "../../utils/money";

type PayMode = 'PENDING' | 'DP' | PaymentMethod;

type Props = {
  open: boolean;
  onClose: () => void;
  order: Order;
  onPaid: (order: Order) => void;
};

const METHODS: PaymentMethod[] = ['CASH', 'QRIS', 'TRANSFER'];

export default function CheckoutDialog({ open, onClose, order, onPaid }: Props) {
  const [mode, setMode] = useState<PayMode>('PENDING');
  const [dpAmount, setDpAmount] = useState<number>(0);
  const [payAmount, setPayAmount] = useState<number>(order.grand_total);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [voucherCode, setVoucherCode] = useState<string>('');
  const [applyLoading, setApplyLoading] = useState<boolean>(false);
  const [applyMsg, setApplyMsg] = useState<string | null>(null);
  const [applyErr, setApplyErr] = useState<string | null>(null);

  const due = useMemo(
    () => Math.max((order.grand_total ?? 0) - (order.paid_amount ?? 0), 0),
    [order.grand_total, order.paid_amount]
  );

  // focus voucher input saat dialog terbuka
  const voucherRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!open) return;
    setMode('PENDING');
    setDpAmount(0);
    setPayAmount(due);
    setErr(null);
    setVoucherCode('');
    setApplyMsg(null);
    setApplyErr(null);
    // small delay untuk memastikan render selesai
    setTimeout(() => voucherRef.current?.focus(), 0);
  }, [open, order.id, due]);

  async function onSubmit() {
    try {
      setErr(null);
      if (mode === 'PENDING') {
        onClose();
        onPaid(order);
        return;
      }

      let payload: PaymentCreatePayload;

      if (mode === 'DP') {
        const n = Number.isFinite(dpAmount) ? dpAmount : 0;
        if (n <= 0) throw new Error('Nominal DP harus > 0');
        if (n > due) throw new Error('DP melebihi sisa tagihan');
        payload = { method: 'DP', amount: n };
      } else {
        const n = Number.isFinite(payAmount) ? payAmount : 0;
        if (n <= 0) throw new Error('Nominal bayar harus > 0');
        if (n > due) throw new Error('Nominal bayar melebihi sisa tagihan');
        payload = { method: mode, amount: n };
      }

      setLoading(true);
      const { order: updated } = await createOrderPayment(order.id, payload);
      onPaid(updated);
      onClose();
    } catch (e) {
      const m = e instanceof Error ? e.message : 'Gagal menyimpan pembayaran';
      setErr(m);
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3"
      onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-elev-2 bg-(--color-surface) text-(--color-text-default) border border-(--color-border)"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-(--color-border)">
          <div id="checkout-title" className="text-lg font-semibold">Pembayaran</div>
          <div className="text-xs text-gray-600">
            Tagihan: {toIDR(order.grand_total)} · Sudah bayar: {toIDR(order.paid_amount)} · Sisa: {toIDR(due)}
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {/* Voucher */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Voucher</label>
            <div className="flex items-center gap-2">
              <input
                ref={voucherRef}
                className="input px-3 py-2 text-sm flex-1"
                placeholder="MASUKKAN-KODE"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
              />
              <button
                type="button"
                className="btn-outline disabled:opacity-50"
                disabled={applyLoading || voucherCode.trim().length === 0}
                onClick={async () => {
                  setApplyLoading(true);
                  setApplyMsg(null);
                  setApplyErr(null);
                  try {
                    const res = await applyVoucherToOrder(String(order.id), { code: voucherCode.trim().toUpperCase() });
                    const updated = res.order as Order;
                    onPaid(updated);
                    const pot = typeof (res).applied_amount === 'number' ? (res).applied_amount : 0;
                    setApplyMsg(`Voucher diterapkan. Potongan: ${toIDR(pot)}`);
                  } catch (ex: unknown) {
                    const statusObj = ex as { response?: { status?: number } };
                    const status = typeof statusObj?.response?.status === 'number' ? statusObj.response!.status! : 0;
                    if (status === 422) setApplyErr('Voucher tidak valid / tidak memenuhi syarat');
                    else if (status === 403) setApplyErr('Tidak berwenang menerapkan voucher untuk order ini');
                    else setApplyErr('Gagal menerapkan voucher');
                  } finally {
                    setApplyLoading(false);
                  }
                }}
              >
                {applyLoading ? 'Menerapkan…' : 'Terapkan'}
              </button>
            </div>
            {applyMsg && <div className="text-xs text-green-700">{applyMsg}</div>}
            {applyErr && <div className="text-xs text-red-600">{applyErr}</div>}
          </div>

          {/* Mode */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Mode</label>
            <div className="inline-flex rounded-lg border border-(--color-border) overflow-hidden">
              {(['PENDING', 'DP', ...METHODS] as PayMode[]).map((m) => {
                const active = mode === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`px-3 py-1.5 text-sm transition-colors ${
                      active
                        ? 'bg-(--color-brand-primary) text-(--color-brand-on)'
                        : 'bg-white hover:bg-black/5'
                    }`}
                    aria-pressed={active}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>

          {/* DP input */}
          {mode === 'DP' && (
            <div>
              <label className="block text-sm mb-1">Nominal DP</label>
              <input
                type="number"
                min={1}
                max={due}
                value={dpAmount}
                onChange={(e) => {
                  const v = Math.max(0, Math.min(Number(e.target.value || 0), due));
                  setDpAmount(v);
                }}
                className="input px-3 py-2 w-full"
              />
              <div className="text-xs text-gray-500 mt-1">Maksimal {toIDR(due)}</div>
            </div>
          )}

          {/* Pay amount input */}
          {mode !== 'PENDING' && mode !== 'DP' && (
            <div>
              <label className="block text-sm mb-1">Nominal Bayar</label>
              <input
                type="number"
                min={1}
                max={due}
                value={payAmount}
                onChange={(e) => {
                  const v = Math.max(0, Math.min(Number(e.target.value || 0), due));
                  setPayAmount(v);
                }}
                className="input px-3 py-2 w-full"
              />
              <div className="text-xs text-gray-500 mt-1">Sisa tagihan: {toIDR(due)}</div>
            </div>
          )}

          {err && (
            <div
              role="alert"
              aria-live="polite"
              className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2"
            >
              {err}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-(--color-border) flex items-center justify-end gap-2">
          <button type="button" className="btn-outline" onClick={onClose} disabled={loading}>
            Batal
          </button>
          <button
            type="button"
            className="btn-primary disabled:opacity-60"
            onClick={() => void onSubmit()}
            disabled={loading}
          >
            {loading ? 'Menyimpan…' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}

```
</details>

### src/components/pos/ProductSearch.tsx

- SHA: `c83d10d31c3a`  
- Ukuran: 4 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/components/pos/ProductSearch.tsx
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import type { Service } from '../../types/services';
import { listServices } from '../../api/services';
import { listServicePricesByService, computeEffectivePrice } from '../../api/servicePrices';
import type { ServicePrice } from '../../types/services';
import { useAuth } from '../../store/useAuth';

type Props = {
  onPick: (row: Service & { price_effective: number }) => void;
};

export default function ProductSearch({ onPick }: Props): React.ReactElement {
  const user = useSyncExternalStore(useAuth.subscribe, () => useAuth.user);
  const branchId: string | null = user?.branch_id != null ? String(user.branch_id) : null;
  const [q, setQ] = useState('');
  const [base, setBase] = useState<Service[]>([]);
  const [priceMap, setPriceMap] = useState<Record<string, ServicePrice[]>>({});
  const [rows, setRows] = useState<(Service & { price_effective: number })[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await listServices({ q, is_active: true, per_page: 10, page: 1 });
      const list = (res.data ?? []) as Service[];
      setBase(list);
      // Ambil daftar override harga per service (sekali per service, paralel)
      const entries = await Promise.all(
        list.map(async (s) => [String(s.id), (await listServicePricesByService(String(s.id))).data] as const)
      );
      const map: Record<string, ServicePrice[]> = {};
      for (const [sid, prices] of entries) map[sid] = prices ?? [];
      setPriceMap(map);
      // Hitung harga efektif untuk cabang aktif saat ini (tanpa request tambahan)
      const computed = list.map(s => ({
        ...s,
        price_effective: computeEffectivePrice(map[String(s.id)], branchId, s.price_default),
      }));
      setRows(computed);
    } catch {
      setError('Gagal memuat layanan');
    } finally {
      setLoading(false);
    }
  }, [q, branchId]);

  useEffect(() => { void refresh(); }, [refresh]);

  useEffect(() => {
    if (!base.length) return;
    const computed = base.map(s => ({
      ...s,
      price_effective: computeEffectivePrice(priceMap[String(s.id)], branchId, s.price_default),
    }));
    setRows(computed);
  }, [branchId, base, priceMap]);

  return (
    <div className="space-y-2">
      {/* Search bar */}
      <div className="flex gap-2">
        <input
          className="input px-3 py-2 w-full"
          placeholder="Cari layanan…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') void refresh(); }}
          aria-label="Cari layanan"
        />
        <button
          className="btn-outline"
          onClick={() => void refresh()}
          aria-label="Cari"
        >
          Cari
        </button>
      </div>
      <div className="text-[10px] text-gray-500">Enter untuk cari • Klik kartu layanan untuk menambah ke keranjang</div>

      {/* States */}
      {loading && (
        <div className="text-sm text-gray-500" aria-live="polite">Memuat…</div>
      )}
      {error && (
        <div className="text-sm text-red-600" role="alert" aria-live="polite">{error}</div>
      )}

      {/* Results */}
      {!loading && !error && rows.length > 0 && (
        <div className="grid md:grid-cols-2 gap-2">
          {rows.map((r) => (
            <button
              key={r.id}
              className="rounded-lg border border-(--color-border) bg-(--color-surface) p-3 text-left transition-colors hover:bg-black/5 focus-visible:focus-ring"
              onClick={() => onPick(r)}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-gray-600">{r.unit}</div>
                </div>
                <div className="text-sm font-semibold tabular-nums">
                  {r.price_effective.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <div className="text-sm text-gray-600">Tidak ada hasil</div>
      )}
    </div>
  );
}

```
</details>

### src/components/ReceiptPreview.tsx

- SHA: `9ddac89c9fcf`  
- Ukuran: 4 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/components/ReceiptPreview.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  /** HTML struk lengkap dari backend (GET /orders/{id}/receipt) */
  html: string;
  /** Tinggi iframe, default: "70vh" */
  height?: string | number;
  /** Auto print begitu selesai render */
  autoPrint?: boolean;
  /** Kelas tambahan untuk wrapper */
  className?: string;
  /** Dipanggil setelah iframe selesai load */
  onLoaded?: () => void;
  /** Dipanggil saat tombol Print diklik */
  onPrint?: () => void;
  printTitle?: string;
};

export default function ReceiptPreview({
  html,
  height = "70vh",
  autoPrint = false,
  className = "",
  onLoaded,
  onPrint,
  printTitle,
}: Props): React.ReactElement {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);

  // srcDoc bekerja di browser modern; fallback ke Blob URL kalau perlu
  const supportsSrcDoc = useMemo(() => {
    const el = document.createElement("iframe");
    return "srcdoc" in el;
  }, []);
  const blobUrl = useMemo(() => {
    if (!html || supportsSrcDoc) return "";
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    return URL.createObjectURL(blob);
  }, [html, supportsSrcDoc]);

  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [blobUrl]);

  const handleLoad = () => {
    setLoaded(true);
    onLoaded?.();

    if (autoPrint) {
      // delay kecil supaya layout stabil sebelum print
      setTimeout(() => {
        const frameWin = iframeRef.current?.contentWindow;
        // Set judul dokumen di dalam iframe (jika diminta)
        try {
          if (printTitle && frameWin?.document) {
            frameWin.document.title = printTitle;
          }
        } catch (err) { void err; }
        frameWin?.focus();
        frameWin?.print();
      }, 50);
    }
  };

  const doPrint = () => {
    onPrint?.();
    const frameWin = iframeRef.current?.contentWindow;
    try {
      if (printTitle && frameWin?.document) {
        frameWin.document.title = printTitle;
      }
    } catch (err) { void err; }
    frameWin?.focus();
    frameWin?.print();
  };

  const openInNewTab = () => {
    // buka tab baru dan tulis HTML langsung — tidak kena CORS
    const w = window.open("", "_blank");
    if (!w) {
      alert("Popup diblokir browser. Izinkan pop-up untuk situs ini.");
      return;
    }
    w.document.open();
    w.document.write(html || "<!doctype html><title>Receipt</title><body>Empty</body>");
    w.document.close();
  };

  return (
    <div className={`border rounded-2xl overflow-hidden bg-white dark:bg-background ${className}`}>
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <div className="text-sm font-semibold">Receipt Preview</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1.5 text-sm border rounded"
            onClick={openInNewTab}
            disabled={!html}
            title="Buka di tab baru"
          >
            Open
          </button>
          <button
            type="button"
            className="px-3 py-1.5 text-sm border rounded"
            onClick={doPrint}
            disabled={!loaded}
            title={loaded ? "Print" : "Menunggu render…"}
          >
            Print
          </button>
        </div>
      </div>

      {!html ? (
        <div className="p-4 text-sm text-muted-foreground">Tidak ada HTML struk.</div>
      ) : (
        <iframe
          ref={iframeRef}
          title="receipt-preview"
          // srcDoc memberi isolasi style dari app utama; sebagian browser lama fallback ke src
          srcDoc={supportsSrcDoc ? html : undefined}
          src={supportsSrcDoc ? undefined : blobUrl}
          // sandbox untuk keamanan, tetap izinkan script, popup (print), dan same-origin
          sandbox="allow-same-origin allow-scripts allow-popups allow-modals"
          onLoad={handleLoad}
          style={{
            width: "100%",
            height: typeof height === "number" ? `${height}px` : height,
            border: "0",
            background: "#fff",
          }}
        />
      )}
    </div>
  );
}

```
</details>

### src/components/receivables/SettleReceivableDialog.tsx

- SHA: `bb73c1fb84f2`  
- Ukuran: 6 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/components/receivables/SettleReceivableDialog.tsx
import { useEffect, useMemo, useState } from "react";
import type { Receivable } from "../../types/receivables";
import type { PaymentMethod } from "../../types/payments";
import { settleReceivable } from "../../api/receivables";
import { toIDR } from "../../utils/money";

type Props = {
    open: boolean;
    receivable: Receivable | null;
    onClose: () => void;
    onSettled?: (r: Receivable) => void;
};

const METHODS: PaymentMethod[] = ["CASH", "QRIS", "TRANSFER"];

export default function SettleReceivableDialog({ open, receivable, onClose, onSettled }: Props) {
    const [amount, setAmount] = useState<number>(0);
    const [method, setMethod] = useState<PaymentMethod>("CASH");
    const [paidAt, setPaidAt] = useState<string>("");
    const [note, setNote] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string>("");

    useEffect(() => {
        if (open && receivable) {
            setAmount(receivable.remaining_amount);
            setMethod("CASH");
            setPaidAt(new Date().toISOString().slice(0, 16)); // "YYYY-MM-DDTHH:mm"
            setNote("");
            setErr("");
        }
    }, [open, receivable]);

    const disabled = useMemo(() => {
        if (!receivable) return true;
        return amount <= 0 || amount > receivable.remaining_amount || loading;
    }, [amount, loading, receivable]);

    if (!open || !receivable) return null;

    const onSubmit = async () => {
        if (!receivable) return;
        setLoading(true);
        setErr("");
        try {
            const res = await settleReceivable(receivable.id, {
                amount,
                method,
                paid_at: paidAt ? new Date(paidAt).toISOString() : undefined,
                note: note || undefined,
            });
            const next = res.data.data.receivable;
            onSettled?.(next);
            onClose();
        } catch {
            setErr("Gagal memproses pelunasan. Periksa nominal/metode, atau coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <h3 className="mb-4 text-lg font-semibold">Pelunasan Piutang</h3>
                <div className="space-y-3">
                    <div className="text-sm">
                        <div>Invoice: <strong>{receivable.order?.invoice_no ?? "-"}</strong></div>
                        <div>Total: <strong>{toIDR(receivable.order?.grand_total ?? 0)}</strong></div>
                        <div>Terbayar: <strong>{toIDR(receivable.order?.paid_amount ?? 0)}</strong></div>
                        <div className="mt-1">
                            Sisa: <span className="rounded-md bg-amber-100 px-2 py-0.5 font-semibold">
                                {toIDR(receivable.remaining_amount)}
                            </span>
                        </div>
                    </div>
                    <label className="block text-sm">
                        Nominal Pelunasan
                        <input
                            type="number"
                            min={0}
                            max={receivable.remaining_amount}
                            step="100"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="mt-1 w-full rounded-lg border px-3 py-2"
                        />
                    </label>
                    <label className="block text-sm">
                        Metode
                        <select
                            className="mt-1 w-full rounded-lg border px-3 py-2"
                            value={method}
                            onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                        >
                            {METHODS.map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </label>
                    <label className="block text-sm">
                        Tanggal Bayar
                        <input
                            type="datetime-local"
                            value={paidAt}
                            onChange={(e) => setPaidAt(e.target.value)}
                            className="mt-1 w-full rounded-lg border px-3 py-2"
                        />
                    </label>
                    <label className="block text-sm">
                        Catatan (opsional)
                        <input
                            type="text"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="mt-1 w-full rounded-lg border px-3 py-2"
                        />
                    </label>
                    {err ? <p className="text-sm text-red-600">{err}</p> : null}
                </div>
                <div className="mt-6 flex justify-end gap-2">
                    <button onClick={onClose} className="rounded-xl border px-4 py-2">Batal</button>
                    <button
                        onClick={onSubmit}
                        disabled={disabled}
                        className="rounded-xl bg-black px-4 py-2 text-white disabled:opacity-50"
                    >
                        {loading ? "Memproses..." : "Lunasi"}
                    </button>
                </div>
            </div >
        </div >
    );
}

```
</details>

### src/components/Toast.tsx

- SHA: `6a7bcbf0b950`  
- Ukuran: 102 B
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
export type ToastKind = 'success' | 'error' | 'info';
export default function Toast() { return null; }
```
</details>



## Pages (src/pages)

### src/pages/branches/BranchForm.tsx

- SHA: `cc391fd8fcd7`  
- Ukuran: 6 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
import { useEffect, useState } from 'react';
import { createBranch, getBranch, updateBranch } from '../../api/branches';
import type { Branch, BranchUpsertPayload, ResetPolicy } from '../../types/branches';
import { useNavigate, useParams } from 'react-router-dom';

function toResetPolicy(value: string): ResetPolicy {
    return value === 'never' ? 'never' : 'monthly';
}

const POLICIES: ResetPolicy[] = ['monthly', 'never'];

export default function BranchForm() {
    const { id } = useParams<{ id: string }>();
    const nav = useNavigate();
    const editing = Boolean(id);

    const [form, setForm] = useState<BranchUpsertPayload>({
        code: '',
        name: '',
        address: '',
        invoice_prefix: 'SLV',
        reset_policy: 'monthly',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

    useEffect(() => {
        (async () => {
            if (!editing) return;
            setLoading(true);
            try {
                const res = await getBranch(id!);
                const b = res.data as Branch;
                setForm({
                    code: b.code,
                    name: b.name,
                    address: b.address ?? '',
                    invoice_prefix: b.invoice_prefix,
                    reset_policy: b.reset_policy,
                });
            } catch {
                setError('Gagal memuat data cabang');
            } finally {
                setLoading(false);
            }
        })();
    }, [editing, id]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true); setError(null); setFieldErrors({});
        // Validasi ringan sisi UI
        if (!form.code.trim() || !form.name.trim() || !form.invoice_prefix.trim()) {
            setLoading(false);
            setError('Kode, Nama, dan Prefix wajib diisi');
            return;
        }
        if (form.invoice_prefix.length > 8) {
            setLoading(false);
            setError('Panjang prefix maksimal 8 karakter');
            return;
        }

        try {
            if (editing) await updateBranch(id!, form);
            else await createBranch(form);
            alert('Tersimpan');
            nav('/branches', { replace: true });
        } catch (err: unknown) {
            // Narrowing aman tanpa any
            const withResp = err as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } };
            const fe = withResp.response?.data?.errors ?? {};
            if (fe && typeof fe === 'object') setFieldErrors(fe);
            setError(withResp.response?.data?.message ?? 'Gagal menyimpan');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className="max-w-xl space-y-3" onSubmit={onSubmit}>
            <h1 className="text-lg font-semibold">{editing ? 'Edit Branch' : 'New Branch'}</h1>
            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="grid gap-1">
                <label className="text-xs">Kode *</label>
                <input className="border rounded px-3 py-2" value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })} />
                {fieldErrors.code && <p className="text-xs text-red-600">{fieldErrors.code.join(', ')}</p>}
            </div>

            <div className="grid gap-1">
                <label className="text-xs">Nama *</label>
                <input className="border rounded px-3 py-2" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} />
                {fieldErrors.name && <p className="text-xs text-red-600">{fieldErrors.name.join(', ')}</p>}
            </div>

            <div className="grid gap-1">
                <label className="text-xs">Alamat</label>
                <input className="border rounded px-3 py-2" value={form.address ?? ''}
                    onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>

            <div className="grid gap-1">
                <label className="text-xs">Prefix Invoice (max 8) *</label>
                <input className="border rounded px-3 py-2" value={form.invoice_prefix}
                    onChange={(e) => setForm({ ...form, invoice_prefix: e.target.value.toUpperCase() })} />
                {fieldErrors.invoice_prefix && <p className="text-xs text-red-600">{fieldErrors.invoice_prefix.join(', ')}</p>}
            </div>

            <div className="grid gap-1">
                <label className="text-xs">Kebijakan Reset *</label>
                <select
                    className="border rounded px-3 py-2"
                    value={form.reset_policy}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setForm({ ...form, reset_policy: toResetPolicy(e.target.value) })
                    }
                >
                    {POLICIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                {fieldErrors.reset_policy && <p className="text-xs text-red-600">{fieldErrors.reset_policy.join(', ')}</p>}
            </div>

            <div className="flex gap-2">
                <button disabled={loading} className="rounded bg-black text-white px-3 py-2">{loading ? 'Menyimpan…' : 'Simpan'}</button>
                <button type="button" className="rounded border px-3 py-2" onClick={() => history.back()}>Batal</button>
            </div>
        </form>
    );
}

```
</details>

### src/pages/branches/BranchIndex.tsx

- SHA: `3ccc58ef5d08`  
- Ukuran: 5 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
import { useCallback, useEffect, useState } from 'react';
import DataTable from '../../components/DataTable';
import { useNavigate } from 'react-router-dom';
import { listBranches, deleteBranch } from '../../api/branches';
import type { Branch, PaginationMeta } from '../../types/branches';
import { useHasRole } from '../../store/useAuth';

export default function BranchIndex() {
    const canManage = useHasRole(['Superadmin']);
    const nav = useNavigate();
    const [rows, setRows] = useState<Branch[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [q, setQ] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const perPage = 10;

    const fetchPage = useCallback(async (p = 1) => {
        setLoading(true);
        setError(null);
        try {
            const res = await listBranches({ q, page: p, per_page: perPage });
            setRows(res.data ?? []);
            setMeta((res.meta as PaginationMeta) ?? null);
        } catch {
            setError('Gagal memuat data cabang');
        } finally {
            setLoading(false);
        }
    }, [q]);

    // Load saat halaman berubah
    useEffect(() => {
        void fetchPage(page);
    }, [fetchPage, page]);

    // Debounce pencarian (reset ke page 1)
    useEffect(() => {
        const t = setTimeout(() => {
            void fetchPage(1);
            setPage(1);
        }, 300);
        return () => clearTimeout(t);
    }, [fetchPage, q]);

    return (
        <div className="space-y-4">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold">Branches</h1>
                    <p className="text-xs text-gray-500">Kelola cabang & konfigurasi penomoran faktur.</p>
                </div>
                {canManage && (
                    <div className="space-x-2">
                        <button className="rounded border px-3 py-2 text-sm" onClick={() => nav('/branches/new')}>New Branch</button>
                    </div>
                )}
            </header>

            <div className="flex items-center gap-2">
                <input
                    className="border rounded px-3 py-2 text-sm"
                    placeholder="Cari nama/kode…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <DataTable<Branch>
                columns={[
                    { key: 'code', header: 'Kode' },
                    { key: 'name', header: 'Nama' },
                    { key: 'invoice_prefix', header: 'Prefix Invoice' },
                    { key: 'reset_policy', header: 'Reset' },
                    {
                        key: 'actions',
                        header: 'Aksi',
                        render: (b) => (
                            <div className="flex gap-2">
                                <button className="underline text-xs" onClick={() => nav(`/branches/${b.id}/edit`)}>Edit</button>
                                <button className="underline text-xs" onClick={() => nav(`/branches/${b.id}/invoice-settings`)}>Invoice</button>
                                {canManage && (
                                    <button
                                        className="underline text-xs text-red-600"
                                        onClick={async () => {
                                            if (!confirm(`Hapus cabang ${b.name}?`)) return;
                                            try { await deleteBranch(b.id); await fetchPage(page); } catch { alert('Gagal menghapus'); }
                                        }}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        ),
                    },
                ]}
                rows={rows}
                loading={loading}
                emptyText="Belum ada data cabang"
            />

            <div className="flex items-center gap-2">
                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded border px-2 py-1 text-xs">Prev</button>
                <div className="text-xs text-gray-600">
                    Hal {meta?.current_page ?? page} / {meta?.last_page ?? 1}
                </div>
                <button disabled={!!meta && page >= (meta.last_page ?? 1)} onClick={() => setPage((p) => p + 1)} className="rounded border px-2 py-1 text-xs">Next</button>
            </div>
        </div>
    );
}

```
</details>

### src/pages/branches/InvoiceSettings.tsx

- SHA: `532eae53b231`  
- Ukuran: 13 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/branches/InvoiceSettings.tsx
import { useEffect, useMemo, useState, useCallback } from 'react';
import {
    listInvoiceCounters, createInvoiceCounter, updateInvoiceCounter, deleteInvoiceCounter,
    previewNextNumber, resetCounterNow,
} from '../../api/invoiceCounters';
import { getBranch } from '../../api/branches';
import type { Branch, InvoiceCounter, InvoiceCounterUpsertPayload, ResetPolicy } from '../../types/branches';
import { useParams } from 'react-router-dom';

function toResetPolicy(value: string): ResetPolicy {
    return value === 'never' ? 'never' : 'monthly';
}

const POLICIES: ResetPolicy[] = ['monthly', 'never'];

export default function InvoiceSettings() {
    const { id } = useParams<{ id: string }>(); // branch id
    const [branch, setBranch] = useState<Branch | null>(null);
    const [rows, setRows] = useState<InvoiceCounter[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<{ number: string; invoice_no: string } | null>(null);

    const [form, setForm] = useState<InvoiceCounterUpsertPayload>({
        branch_id: id!,
        prefix: '',
        reset_policy: 'monthly',
        seq: 0,
    });
    const valid = useMemo(() => form.prefix.trim().length > 0 && form.prefix.length <= 8, [form.prefix]);

    const refresh = useCallback(async () => {
        setLoading(true); setError(null);
        try {
            const b = await getBranch(id!);
            setBranch(b.data as Branch);
            const res = await listInvoiceCounters({ branch_id: id, per_page: 50 });
            setRows(res.data ?? []);
            // default prefix mengikuti branch
            setForm((f) => ({
                ...f,
                prefix: (b.data as Branch).invoice_prefix,
                branch_id: id!,
                seq: (res.data?.[0]?.seq ?? 0)
            }));
            setPreview(null);
        } catch {
            setError('Gagal memuat konfigurasi invoice');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    async function onSaveNew(e: React.FormEvent) {
        e.preventDefault();
        if (!valid) { alert('Prefix wajib dan maksimal 8 karakter'); return; }
        if (typeof form.seq !== 'number' || form.seq < 0 || form.seq > 999999) {
            alert('Sequence harus angka 0–999999'); return;
        }
        try {
            await createInvoiceCounter(form);
            alert('Counter ditambahkan');
            await refresh();
        } catch {
            alert('Gagal menambah counter');
        }
    }

    async function onPreview() {
        try {
            const res = await previewNextNumber(id!);
            setPreview(res.data);
        } catch {
            alert('Gagal preview nomor berikutnya');
        }
    }

    async function onResetNow(counterId: string) {
        if (!confirm('Reset sequence ke 0 untuk bulan berjalan?')) return;
        try {
            await resetCounterNow(counterId);
            await refresh();
        } catch {
            alert('Gagal reset counter');
        }
    }

    return (
        <div className="space-y-4 max-w-2xl">
            <header>
                <h1 className="text-lg font-semibold">Invoice Settings</h1>
                <p className="text-xs text-gray-600">
                    Branch: <strong>{branch?.code}</strong> — {branch?.name}
                </p>
            </header>

            {error && <div className="text-sm text-red-600">{error}</div>}
            {loading && <div className="text-sm text-gray-500">Memuat…</div>}

            <section className="space-y-2">
                <h2 className="font-medium">Daftar Counter</h2>
                <div className="overflow-auto rounded border">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left">Prefix</th>
                                <th className="px-3 py-2 text-left">Reset</th>
                                <th className="px-3 py-2 text-left">Sequence</th>
                                <th className="px-3 py-2 text-left">Last Month</th>
                                <th className="px-3 py-2 text-left">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.length === 0 && (
                                <tr><td className="px-3 py-3 text-gray-500" colSpan={5}>Belum ada counter</td></tr>
                            )}
                            {rows.map((r) => (
                                <tr key={r.id} className="border-t">
                                    <td className="px-3 py-2">{r.prefix}</td>
                                    <td className="px-3 py-2">{r.reset_policy}</td>
                                    <td className="px-3 py-2">{r.seq}</td>
                                    <td className="px-3 py-2">{r.last_reset_month ?? '-'}</td>
                                    <td className="px-3 py-2">
                                        <button
                                            className="underline text-xs mr-2"
                                            onClick={async () => {
                                                const raw = prompt('Prefix baru (2–8 huruf kapital A–Z):', r.prefix) ?? r.prefix;
                                                const prefix = (raw || '').toUpperCase().slice(0, 8);
                                                if (!/^[A-Z]{2,8}$/.test(prefix)) { alert('Prefix tidak valid'); return; }
                                                try {
                                                    await updateInvoiceCounter(r.id, {
                                                        prefix,
                                                        reset_policy: r.reset_policy,
                                                        seq: r.seq,
                                                    });
                                                    await refresh();
                                                } catch { alert('Gagal update'); }
                                            }}
                                        >
                                            Ubah Prefix
                                        </button>
                                        <button
                                            className="underline text-xs mr-2"
                                            onClick={async () => {
                                                const policy = (prompt('Reset policy (monthly/never):', r.reset_policy) ?? r.reset_policy) as ResetPolicy;
                                                if (!['monthly', 'never'].includes(policy)) { alert('Reset policy tidak valid'); return; }
                                                try {
                                                    await updateInvoiceCounter(r.id, {
                                                        prefix: r.prefix,
                                                        reset_policy: policy,
                                                        seq: r.seq,
                                                    });
                                                    await refresh();
                                                } catch { alert('Gagal update'); }
                                            }}
                                        >
                                            Ubah Reset
                                        </button>
                                        <button
                                            className="underline text-xs mr-2"
                                            onClick={async () => {
                                                const v = prompt('Sequence baru (0–999999):', String(r.seq));
                                                if (v == null) return;
                                                const n = Number(v);
                                                if (!Number.isFinite(n) || n < 0 || n > 999999) { alert('Sequence tidak valid'); return; }
                                                try {
                                                    await updateInvoiceCounter(r.id, {
                                                        prefix: r.prefix,
                                                        reset_policy: r.reset_policy,
                                                        seq: Math.floor(n),
                                                    });
                                                    await refresh();
                                                } catch { alert('Gagal update sequence'); }
                                            }}
                                        >
                                            Ubah Sequence
                                        </button>
                                        <button
                                            className="underline text-xs mr-2"
                                            onClick={async () => { await onResetNow(r.id); }}
                                        >
                                            Reset Now
                                        </button>
                                        <button
                                            className="underline text-xs text-red-600"
                                            onClick={async () => {
                                                if (!confirm('Hapus counter ini?')) return;
                                                try { await deleteInvoiceCounter(r.id); await refresh(); } catch { alert('Gagal hapus'); }
                                            }}
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="space-y-2">
                <h2 className="font-medium">Tambah Counter</h2>
                <form className="flex flex-wrap items-end gap-2" onSubmit={onSaveNew}>
                    <div className="grid gap-1">
                        <label className="text-xs">Prefix *</label>
                        <input className="border rounded px-3 py-2" value={form.prefix}
                            onChange={(e) => setForm({ ...form, prefix: e.target.value.toUpperCase().slice(0, 8) })} />
                    </div>
                    <div className="grid gap-1">
                        <label className="text-xs">Reset *</label>
                        <select
                            className="border rounded px-3 py-2"
                            value={form.reset_policy}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                setForm({ ...form, reset_policy: toResetPolicy(e.target.value) })
                            }
                        >
                            {POLICIES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    <div className="grid gap-1">
                        <label className="text-xs">Sequence *</label>
                        <input
                            type="number"
                            min={0}
                            max={999999}
                            step={1}
                            className="border rounded px-3 py-2 font-mono"
                            value={form.seq ?? 0}
                            onChange={(e) => {
                                const n = Number(e.target.value);
                                const v = Number.isFinite(n) ? Math.max(0, Math.min(999999, Math.floor(n))) : 0;
                                setForm({ ...form, seq: v });
                            }}
                        />
                    </div>
                    <button className="rounded bg-black text-white px-3 py-2" disabled={!valid}>Tambah</button>
                </form>
                <p className="text-xs text-gray-500">
                    Kombinasi <code>branch_id + prefix</code> harus unik (lihat constraint DB). Sequence akan bertambah saat invoice dipakai.
                </p>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onPreview}
                        className="rounded border px-3 py-2 text-xs"
                        disabled={loading}
                    >
                        Preview nomor berikutnya
                    </button>
                    {preview && (
                        <div className="text-xs">
                            Next <code>number</code>: <strong className="font-mono">{preview.number}</strong>{' '}
                            — <code>invoice_no</code>: <strong className="font-mono">{preview.invoice_no}</strong>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

```
</details>

### src/pages/customers/CustomerDetail.tsx

- SHA: `63f28d242227`  
- Ukuran: 13 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/customers/CustomerDetail.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCustomer, getCustomer, updateCustomer } from '../../api/customers';
import type { Customer, CustomerUpsertPayload, SingleResponse } from '../../types/customers';
import { useAuth } from '../../store/useAuth';

export default function CustomerDetail() {
    const params = useParams();
    const navigate = useNavigate();
    const isNew = !params.id || params.id === 'new';
    const { hasRole, user } = useAuth;

    const canEdit = hasRole('Superadmin') || hasRole('Admin Cabang') || hasRole('Kasir');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<CustomerUpsertPayload>({
        name: '',
        whatsapp: '',
        address: '',
        notes: '',
    });
    const [entity, setEntity] = useState<Customer | null>(null);

    useEffect(() => {
        let cancelled = false;
        if (!isNew && params.id) {
            (async () => {
                setLoading(true);
                setError(null);
                try {
                    const res = await getCustomer(params.id!);
                    if (!cancelled) {
                        setEntity(res.data);
                        if (res.data) {
                            setForm({
                                name: res.data.name,
                                whatsapp: res.data.whatsapp,
                                address: res.data.address ?? '',
                                notes: res.data.notes ?? '',
                            });
                        }
                    }
                } catch {
                    if (!cancelled) setError('Gagal memuat detail pelanggan.');
                } finally {
                    if (!cancelled) setLoading(false);
                }
            })();
        }
        return () => { cancelled = true; };
    }, [isNew, params.id]);

    function normalizeWa(input: string): string {
        const s = (input || '').trim();
        return s.replace(/[^\d]/g, '');
    }

    // buang key undefined & konversi "" => null
    function clean<T extends Record<string, unknown>>(obj: T): Partial<T> {
        const out: Partial<T> = {};
        Object.entries(obj).forEach(([k, v]) => {
            if (v === undefined) return;
            if (typeof v === 'string') {
                const t = v.trim();
                (out as Record<string, unknown>)[k] = t === '' ? null : t;
            } else {
                (out as Record<string, unknown>)[k] = v;
            }
        });
        return out;
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!canEdit) return;
        setSaving(true);
        setError(null);
        try {
            let res: SingleResponse<Customer>;

            if (isNew) {
                const basePayload = {
                    name: form.name,
                    whatsapp: normalizeWa(form.whatsapp),
                    address: form.address,
                    notes: form.notes,
                };
                const cleanedBase = clean(basePayload);

                let finalBranchId: string | undefined;
                if (hasRole('Superadmin')) {
                    finalBranchId = form.branch_id && form.branch_id.trim() !== '' ? form.branch_id.trim() : undefined;
                } else {
                    finalBranchId = user?.branch_id ? String(user.branch_id) : undefined;
                    if (!finalBranchId) {
                        setError('Akun Anda belum terikat ke cabang. Hubungi admin pusat.');
                        setSaving(false);
                        return;
                    }
                }

                const payloadCreate: CustomerUpsertPayload = {
                    name: String(cleanedBase.name ?? ''),
                    whatsapp: String(cleanedBase.whatsapp ?? ''),
                    address: (cleanedBase.address as string | null | undefined) ?? null,
                    notes: (cleanedBase.notes as string | null | undefined) ?? null,
                    ...(finalBranchId ? { branch_id: finalBranchId } : {}),
                };
                res = await createCustomer(payloadCreate);
            } else {
                if (!params.id) {
                    setError('ID pelanggan tidak valid.');
                    setSaving(false);
                    return;
                }
                const cleanedUpdate = clean({
                    name: form.name,
                    whatsapp: normalizeWa(form.whatsapp),
                    address: form.address,
                    notes: form.notes,
                    ...(hasRole('Superadmin') && form.branch_id && String(form.branch_id).trim() !== ''
                        ? { branch_id: String(form.branch_id).trim() }
                        : {}),
                });
                const payloadUpdate: Partial<CustomerUpsertPayload> = {
                    ...(cleanedUpdate.name !== undefined ? { name: String(cleanedUpdate.name) } : {}),
                    ...(cleanedUpdate.whatsapp !== undefined ? { whatsapp: String(cleanedUpdate.whatsapp) } : {}),
                    ...(cleanedUpdate.address !== undefined ? { address: cleanedUpdate.address as string | null } : {}),
                    ...(cleanedUpdate.notes !== undefined ? { notes: cleanedUpdate.notes as string | null } : {}),
                    ...(hasRole('Superadmin') && cleanedUpdate.branch_id !== undefined
                        ? { branch_id: String(cleanedUpdate.branch_id) }
                        : {}),
                };
                res = await updateCustomer(params.id, payloadUpdate);
            }

            if (res?.data?.id) {
                navigate(`/customers/${String(res.data.id)}`);
            } else {
                setError('Gagal menyimpan data pelanggan.');
            }
        } catch (err) {
            const anyErr = err as { response?: { data?: unknown }; message?: string };
            const srv = (anyErr.response?.data as { message?: string; errors?: unknown } | undefined) || undefined;
            const msg = srv?.message ?? (srv?.errors ? JSON.stringify(srv.errors) : undefined) ?? anyErr.message;
            setError(msg ?? 'Gagal menyimpan data pelanggan.');
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-6 w-48 rounded bg-black/10 animate-pulse" />
                <div className="card p-6 border border-[color:var(--color-border)] rounded-lg shadow-elev-1 space-y-4 max-w-2xl">
                    <div className="h-10 w-full rounded bg-black/10 animate-pulse" />
                    <div className="h-10 w-full rounded bg-black/10 animate-pulse" />
                    <div className="h-10 w-full rounded bg-black/10 animate-pulse" />
                    <div className="h-20 w-full rounded bg-black/10 animate-pulse" />
                    <div className="flex gap-2">
                        <div className="h-10 w-28 rounded bg-black/10 animate-pulse" />
                        <div className="h-10 w-24 rounded bg-black/10 animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold tracking-tight">
                        {isNew ? 'Buat Pelanggan' : 'Detail Pelanggan'}
                    </h1>
                    <p className="text-xs text-gray-600">
                        Data identitas pelanggan untuk transaksi & penjemputan
                    </p>
                </div>
            </header>

            {/* Error global */}
            {error && (
                <div
                    role="alert"
                    aria-live="polite"
                    className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2"
                >
                    {error}
                </div>
            )}

            {/* Form */}
            <form
                onSubmit={onSubmit}
                aria-busy={saving ? 'true' : 'false'}
                className="card p-4 md:p-6 border border-[color:var(--color-border)] rounded-lg shadow-elev-1 space-y-4 max-w-2xl"
            >
                {/* Cabang */}
                {hasRole('Superadmin') ? (
                    <label className="grid gap-1 text-sm">
                        <span>Branch ID (Superadmin)</span>
                        <input
                            placeholder="CTH: 019aa7... (opsional)"
                            className="input"
                            value={form.branch_id ?? ''}
                            onChange={(e) =>
                                setForm((f) => ({
                                    ...f,
                                    branch_id: e.target.value.trim() ? e.target.value.trim() : undefined,
                                }))
                            }
                        />
                        <span className="text-xs text-gray-500">Kosongkan untuk tidak mengubah cabang.</span>
                    </label>
                ) : (
                    <div className="text-sm text-gray-600">
                        Cabang: <span className="font-medium">{user?.branch_id ?? '-'}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label className="grid gap-1 text-sm">
                        <span>Nama</span>
                        <input
                            placeholder="Nama pelanggan"
                            className="input"
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            required
                            autoComplete="name"
                        />
                    </label>

                    <label className="grid gap-1 text-sm">
                        <span>WhatsApp</span>
                        <input
                            placeholder="08xxxxxxxxxx"
                            className="input"
                            value={form.whatsapp}
                            onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                            required
                            inputMode="tel"
                            autoComplete="tel"
                        />
                        <span className="text-xs text-gray-500">Hanya angka, akan dinormalisasi saat simpan.</span>
                    </label>

                    <label className="grid gap-1 text-sm md:col-span-2">
                        <span>Alamat</span>
                        <input
                            placeholder="Alamat lengkap (opsional)"
                            className="input"
                            value={form.address ?? ''}
                            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                            autoComplete="street-address"
                        />
                    </label>

                    <label className="grid gap-1 text-sm md:col-span-2">
                        <span>Catatan</span>
                        <textarea
                            placeholder="Instruksi khusus, preferensi, atau catatan lain"
                            className="input min-h-[96px]"
                            value={form.notes ?? ''}
                            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                        />
                    </label>
                </div>

                <div className="flex gap-2 pt-2">
                    <button
                        disabled={saving || !canEdit}
                        className="btn-primary disabled:opacity-50"
                        type="submit"
                        aria-label="Simpan pelanggan"
                    >
                        {saving ? 'Menyimpan…' : 'Simpan'}
                    </button>

                    {!isNew && entity && (
                        <button
                            type="button"
                            className="btn-outline"
                            onClick={() => navigator.clipboard.writeText(entity.whatsapp)}
                            aria-label="Salin nomor WhatsApp"
                        >
                            Salin WA
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

```
</details>

### src/pages/customers/CustomersIndex.tsx

- SHA: `af40c6549b43`  
- Ukuran: 11 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/customers/CustomersIndex.tsx
import { useEffect, useMemo, useState } from 'react';
import type { Customer, CustomerQuery, Paginated } from '../../types/customers';
import { listCustomers } from '../../api/customers';
import { useAuth, useHasRole } from '../../store/useAuth';
import { Link } from 'react-router-dom';

export default function CustomersIndex() {
    // Snapshot auth store (sesuai pola Anda)
    function useAuthSnapshot() {
        const store = useAuth;
        const [, force] = useState(0);
        useEffect(() => {
            const unsubscribe = store.subscribe(() => force((x) => x + 1));
            return () => { unsubscribe(); };
        }, [store]);
        return store;
    }

    const auth = useAuthSnapshot();
    const user = auth.user;
    const canManage = useHasRole(['Superadmin', 'Admin Cabang', 'Kasir']);
    const isSuperadmin = useHasRole('Superadmin');

    const [query, setQuery] = useState<CustomerQuery>({ page: 1, per_page: 10 });
    const [rows, setRows] = useState<Paginated<Customer> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const branchIdForScope = useMemo(() => {
        if (isSuperadmin) return query.branch_id ?? undefined;
        const id = user?.branch_id as string | number | undefined;
        if (typeof id === 'string') return id;
        if (typeof id === 'number') return String(id);
        return undefined;
    }, [isSuperadmin, query.branch_id, user?.branch_id]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await listCustomers({
                    ...query,
                    q: search || undefined,
                    branch_id: branchIdForScope,
                });
                if (!cancelled) setRows(data);
            } catch {
                if (!cancelled) setError('Gagal memuat data pelanggan.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [query, search, branchIdForScope]);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold tracking-tight">Customers</h1>
                    <p className="text-xs text-gray-600">Kelola data pelanggan & histori transaksi</p>
                </div>
                {canManage && (
                    <Link
                        to="/customers/new"
                        className="btn-primary"
                        aria-label="Tambah pelanggan baru"
                    >
                        New Customer
                    </Link>
                )}
            </div>

            {/* Toolbar (FilterBar) */}
            <section
                className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1"
                aria-label="Toolbar pencarian pelanggan"
            >
                <div className="p-3 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
                    <label className="sr-only" htmlFor="cari">Pencarian</label>
                    <div className="relative">
                        <input
                            id="cari"
                            placeholder="Cari nama/WA/alamat…"
                            className="input w-full pl-9 py-2"
                            value={search}
                            onChange={(e) => {
                                setQuery((q) => ({ ...q, page: 1 }));
                                setSearch(e.target.value);
                            }}
                            aria-label="Cari pelanggan"
                        />
                        {/* Ikon search (dekoratif) */}
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            🔎
                        </span>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                        <label className="text-sm text-gray-600" htmlFor="perpage">Per page</label>
                        <select
                            id="perpage"
                            className="input w-[88px] py-2"
                            value={query.per_page ?? 10}
                            onChange={(e) =>
                                setQuery((q) => ({ ...q, per_page: Number(e.target.value), page: 1 }))
                            }
                            aria-label="Jumlah baris per halaman"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Alert error */}
            {error && (
                <div
                    role="alert"
                    aria-live="polite"
                    className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2"
                >
                    {error}
                </div>
            )}

            {/* Empty state */}
            {!loading && !error && rows && rows.data.length === 0 && (
                <div className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1 p-6 text-sm text-gray-500">
                    Belum ada data pelanggan.
                </div>
            )}

            {/* Table */}
            <section aria-busy={loading ? 'true' : 'false'}>
                <div className="card overflow-hidden border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
                    <div className="overflow-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-[#E6EDFF] sticky top-0 z-10">
                                <tr className="divide-x divide-[color:var(--color-border)]">
                                    <Th>Nama</Th>
                                    <Th>WhatsApp</Th>
                                    <Th>Alamat</Th>
                                    <Th className="text-right pr-4">Aksi</Th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[color:var(--color-border)]">
                                {loading ? (
                                    <>
                                        <RowSkeleton />
                                        <RowSkeleton />
                                        <RowSkeleton />
                                        <RowSkeleton />
                                        <RowSkeleton />
                                        <RowSkeleton />
                                    </>
                                ) : (
                                    rows?.data.map((c) => (
                                        <tr key={c.id} className="hover:bg-black/5 transition-colors">
                                            <Td>
                                                <span className="line-clamp-1 font-medium">{c.name}</span>
                                            </Td>
                                            <Td>
                                                <span className="tabular-nums">{c.whatsapp}</span>
                                            </Td>
                                            <Td>
                                                <span className="line-clamp-2 max-w-[48ch]">{c.address ?? '-'}</span>
                                            </Td>
                                            <Td className="text-right">
                                                <Link
                                                    to={`/customers/${String(c.id)}`}
                                                    className="btn-outline"
                                                    aria-label={`Lihat detail pelanggan ${c.name}`}
                                                >
                                                    Detail
                                                </Link>
                                            </Td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Pagination */}
            {!loading && rows && rows.meta.last_page > 1 && (
                <nav
                    className="flex items-center gap-2 justify-end"
                    aria-label="Navigasi halaman"
                >
                    <button
                        disabled={(rows.meta.current_page ?? 1) <= 1}
                        onClick={() => setQuery((q) => ({ ...q, page: (q.page ?? 1) - 1 }))}
                        className="btn-outline disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="text-sm">
                        Page {rows.meta.current_page} / {rows.meta.last_page}
                    </span>
                    <button
                        disabled={rows.meta.current_page >= rows.meta.last_page}
                        onClick={() => setQuery((q) => ({ ...q, page: (q.page ?? 1) + 1 }))}
                        className="btn-outline disabled:opacity-50"
                    >
                        Next
                    </button>
                </nav>
            )}
        </div>
    );
}

/* ---------- Subcomponents ---------- */
function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <th className={`text-left px-3 py-2 text-xs font-medium uppercase tracking-wide ${className}`}>
            {children}
        </th>
    );
}
function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <td className={`px-3 py-2 ${className}`}>{children}</td>;
}
function RowSkeleton() {
    return (
        <tr>
            <td className="px-3 py-3"><div className="h-4 w-40 rounded bg-black/10 animate-pulse" /></td>
            <td className="px-3 py-3"><div className="h-4 w-32 rounded bg-black/10 animate-pulse" /></td>
            <td className="px-3 py-3"><div className="h-4 w-64 rounded bg-black/10 animate-pulse" /></td>
            <td className="px-3 py-3 text-right"><div className="inline-block h-8 w-20 rounded bg-black/10 animate-pulse" /></td>
        </tr>
    );
}

```
</details>

### src/pages/dashboard/DashboardHome.tsx

- SHA: `33e53e367992`  
- Ukuran: 12 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/dashboard/DashboardHome.tsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import { listBranches } from '../../api/branches';
import { getDashboardSummary } from '../../api/dashboard';
import type { Branch } from '../../types/branches';
import type { DashboardSummary, DashboardSummaryMeta } from '../../types/dashboard';
import { toIDR } from '../../utils/money';
import { useAuth, useHasRole } from '../../store/useAuth';

type Meta = DashboardSummaryMeta;

function today(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}
function firstDayThisMonth(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-01`;
}

export default function DashboardHome() {
  const me = useAuth.user;
  const isSuperadmin = useHasRole(['Superadmin']);

  // filter
  const [branchList, setBranchList] = useState<Branch[]>([]);
  const [branchId, setBranchId] = useState<string>(() => {
    if (!isSuperadmin && me?.branch_id) return String(me.branch_id);
    return '';
  });
  const [from, setFrom] = useState<string>(firstDayThisMonth());
  const [to, setTo] = useState<string>(today());

  // data
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>('');

  const q = useMemo(() => {
    // Superadmin boleh pilih cabang; role lain pakai cabang login
    const out: { from: string; to: string; branch_id?: string | null } = { from, to };
    if (isSuperadmin) {
      if (branchId) out.branch_id = branchId;
    } else {
      if (me?.branch_id) out.branch_id = String(me.branch_id);
    }
    return out;
  }, [from, to, branchId, isSuperadmin, me?.branch_id]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      if (isSuperadmin && branchList.length === 0) {
        const br = await listBranches({ per_page: 100 });
        setBranchList(br.data ?? []);
      }
      const res = await getDashboardSummary(q);
      setData(res.data ?? null);
      setMeta((res.meta as Meta) ?? null);
    } catch (e) {
      setErr('Gagal memuat ringkasan dashboard');
      if (import.meta.env.DEV) console.error('[DashboardHome] load error', e);
    } finally {
      setLoading(false);
    }
  }, [q, isSuperadmin, branchList.length]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
          <p className="text-xs text-gray-600">Ringkasan kinerja & laporan</p>
        </div>
      </header>

      {/* FilterBar */}
      <section
        className="card bg-[var(--color-surface)] border border-[color:var(--color-border)] rounded-lg shadow-elev-1"
        aria-label="Filter ringkas dashboard"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3">
          {isSuperadmin && (
            <label className="grid gap-1 text-sm">
              <span className="text-[color:var(--color-text-default)]">Cabang</span>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="input px-2 py-2 bg-white text-[color:var(--color-text-default)]"
              >
                <option value="">Semua Cabang</option>
                {branchList.map(b => (
                  <option key={b.id} value={String(b.id)}>{b.name}</option>
                ))}
              </select>
            </label>
          )}

          <label className="grid gap-1 text-sm">
            <span className="text-[color:var(--color-text-default)]">Dari Tanggal</span>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="input px-2 py-2 bg-white"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-[color:var(--color-text-default)]">Sampai Tanggal</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="input px-2 py-2 bg-white"
            />
          </label>

          <div className="flex items-end gap-2 md:col-span-2">
            <button
              type="button"
              onClick={() => load()}
              className="btn-primary"
              aria-label="Terapkan filter"
            >
              Terapkan
            </button>
            <button
              type="button"
              onClick={() => { setFrom(firstDayThisMonth()); setTo(today()); }}
              className="btn-outline"
              aria-label="Reset tanggal"
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* Error */}
      {err ? (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2"
        >
          {err}
        </div>
      ) : null}

      {/* KPI Cards */}
      <section
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3"
        aria-busy={loading ? 'true' : 'false'}
      >
        <KpiCard title="Omzet" value={toIDR(Number(data?.omzet_total ?? 0))} loading={loading} />
        <KpiCard title="Transaksi" value={String(data?.orders_count ?? 0)} loading={loading} />
        <KpiCard
          title="Voucher Terpakai"
          value={`${data?.vouchers_used_count ?? 0} (${toIDR(Number(data?.vouchers_used_amount ?? 0))})`}
          loading={loading}
        />
        <KpiCard
          title="Ongkir"
          value={toIDR(Number(data?.delivery_shipping_fee ?? 0))}
          loading={loading}
        />
        <KpiCard
          title="Piutang Terbuka"
          value={`${data?.receivables_open_count ?? 0} (${toIDR(Number(data?.receivables_open_amount ?? 0))})`}
          loading={loading}
        />
      </section>

      {/* Top Layanan */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold">Top Layanan</h2>
        <div className="card bg-[var(--color-surface)] rounded-lg border border-[color:var(--color-border)] shadow-elev-1 overflow-hidden">
          <div className="overflow-auto">
            <table className="min-w-[560px] w-full text-sm">
              <thead className="bg-[#E6EDFF] text-[color:var(--color-text-default)] sticky top-0 z-10">
                <tr className="divide-x divide-[color:var(--color-border)]">
                  <Th>Layanan</Th>
                  <Th className="text-right">Qty</Th>
                  <Th className="text-right">Pendapatan</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color:var(--color-border)]">
                {loading ? (
                  <RowSkeleton colSpan={3} />
                ) : (data?.top_services?.length ?? 0) === 0 ? (
                  <tr><td colSpan={3} className="px-3 py-4 text-center text-gray-500">Belum ada data</td></tr>
                ) : (
                  (data?.top_services ?? []).map((r) => (
                    <tr
                      key={`${r.service_id}-${r.name}`}
                      className="hover:bg-black/5 transition-colors"
                    >
                      <Td>{r.name}</Td>
                      <Td className="text-right">{r.qty}</Td>
                      <Td className="text-right">{toIDR(Number(r.amount))}</Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Omzet harian & bulanan */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SimpleTable
          title="Omzet Harian"
          cols={[
            { label: 'Tanggal', align: 'left' },
            { label: 'Omzet', align: 'right' },
          ]}
          loading={loading}
          empty={(data?.omzet_daily?.length ?? 0) === 0}
        >
          {(data?.omzet_daily ?? []).map((d) => (
            <tr key={d.date} className="hover:bg-black/5 transition-colors">
              <Td>{d.date}</Td>
              <Td className="text-right">{toIDR(Number(d.amount))}</Td>
            </tr>
          ))}
        </SimpleTable>

        <SimpleTable
          title="Omzet Bulanan"
          cols={[
            { label: 'Bulan', align: 'left' },
            { label: 'Omzet', align: 'right' },
          ]}
          loading={loading}
          empty={(data?.omzet_monthly?.length ?? 0) === 0}
        >
          {(data?.omzet_monthly ?? []).map((m) => (
            <tr key={m.month} className="hover:bg-black/5 transition-colors">
              <Td>{m.month}</Td>
              <Td className="text-right">{toIDR(Number(m.amount))}</Td>
            </tr>
          ))}
        </SimpleTable>
      </section>

      {/* Meta */}
      <footer className="text-xs text-gray-500">
        Rentang data: {meta?.from ?? from} s.d. {meta?.to ?? to}
        {meta?.branch_id ? ` • Cabang: ${meta.branch_id}` : ''}
      </footer>
    </div>
  );
}

/* ------------------------
   Subcomponents (UI)
------------------------ */

function KpiCard(props: { title: string; value: string; loading?: boolean }) {
  return (
    <div className="card bg-[var(--color-surface)] rounded-lg border border-[color:var(--color-border)] shadow-elev-1 p-3">
      <div className="text-xs text-gray-600">{props.title}</div>
      <div className="mt-1 text-lg font-semibold min-h-[28px]">
        {props.loading ? (
          <span className="inline-block h-5 w-24 rounded bg-black/10 animate-pulse" />
        ) : (
          props.value
        )}
      </div>
    </div>
  );
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`text-left px-3 py-2 text-xs font-medium uppercase tracking-wide ${className}`}>
      {children}
    </th>
  );
}
function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2 ${className}`}>{children}</td>;
}
function RowSkeleton({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-3 py-4">
        <div className="flex items-center justify-center gap-3">
          <span className="h-4 w-4 rounded-full bg-black/10 animate-pulse" />
          <span className="h-4 w-40 rounded bg-black/10 animate-pulse" />
          <span className="h-4 w-24 rounded bg-black/10 animate-pulse" />
        </div>
      </td>
    </tr>
  );
}

function SimpleTable(props: {
  title: string;
  cols: { label: string; align?: 'left' | 'right' }[];
  loading: boolean;
  empty: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold mb-2">{props.title}</h2>
      <div className="card bg-[var(--color-surface)] rounded-lg border border-[color:var(--color-border)] shadow-elev-1 overflow-hidden">
        <div className="overflow-auto">
          <table className="min-w-[380px] w-full text-sm">
            <thead className="bg-[#E6EDFF] text-[color:var(--color-text-default)] sticky top-0 z-10">
              <tr className="divide-x divide-[color:var(--color-border)]">
                {props.cols.map((c) => (
                  <Th key={c.label} className={c.align === 'right' ? 'text-right' : 'text-left'}>
                    {c.label}
                  </Th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--color-border)]">
              {props.loading ? (
                <RowSkeleton colSpan={props.cols.length} />
              ) : props.empty ? (
                <tr>
                  <td colSpan={props.cols.length} className="px-3 py-4 text-center text-gray-500">
                    Belum ada data
                  </td>
                </tr>
              ) : (
                props.children
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

```
</details>

### src/pages/deliveries/DeliveryDetail.tsx

- SHA: `e8f0c3c5c22c`  
- Ukuran: 8 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/deliveries/DeliveryDetail.tsx
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { assignCourier, listDeliveries, updateDeliveryStatus } from '../../api/deliveries';
import type { Delivery, DeliveryStatus } from '../../types/deliveries';
import AssignCourierSelect from '../../components/delivery/AssignCourierSelect';
import DeliveryStatusStepper from '../../components/delivery/DeliveryStatusStepper';
import { useHasRole } from '../../store/useAuth';

/* eslint-disable no-console */
const TAG = '[DeliveryDetail]';
const dbg = {
    log: (...args: unknown[]) => { if (import.meta.env.DEV) console.log(TAG, ...args); },
    warn: (...args: unknown[]) => { if (import.meta.env.DEV) console.warn(TAG, ...args); },
    err: (...args: unknown[]) => { if (import.meta.env.DEV) console.error(TAG, ...args); },
    group: (label: string) => { if (import.meta.env.DEV) console.groupCollapsed(`${TAG} ${label}`); },
    groupEnd: () => { if (import.meta.env.DEV) console.groupEnd(); },
};
/* eslint-enable no-console */

export default function DeliveryDetail() {
    const { id } = useParams();
    const [row, setRow] = useState<Delivery | null>(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const canAssign = useHasRole(['Superadmin', 'Admin Cabang', 'Kasir']);
    const canUpdate = useHasRole(['Superadmin', 'Admin Cabang', 'Kasir', 'Kurir']);

    const load = useCallback(async () => {
        dbg.group('load() start');
        dbg.log('params', { id });
        if (!id) {
            dbg.warn('no id in params; abort load');
            dbg.groupEnd();
            return;
        }
        const t0 = performance.now();
        setLoading(true); setErr(null);
        try {
            const res = await listDeliveries({ q: id, per_page: 1 });
            const list = res.data ?? [];
            const found = list.find(d => String(d.id) === String(id)) ?? null;
            setRow(found);
            if (!found) {
                setErr('Delivery tidak ditemukan');
                dbg.warn('not found');
            } else {
                dbg.log('found row', { id: found.id, status: found.status, assigned_to: found.assigned_to });
            }
        } catch (e) {
            dbg.err('load() error:', e);
            setErr('Gagal memuat delivery');
        } finally {
            setLoading(false);
            const dt = (performance.now() - t0).toFixed(1);
            dbg.log(`load() done in ${dt}ms`);
            dbg.groupEnd();
        }
    }, [id]);

    useEffect(() => {
        dbg.log('mount');
        void load();
        return () => { dbg.log('unmount'); };
    }, [load]);

    async function onAssign(user_id: string | number | null) {
        dbg.group('onAssign');
        dbg.log('attempt', { page_id: id, row_id: row?.id, user_id, canAssign });
        try {
            if (!row) { dbg.warn('blocked: no row'); return; }
            if (!canAssign) { dbg.warn('blocked: no permission'); return; }
            if (!user_id) { dbg.warn('skipped: user_id empty'); return; }
            await assignCourier(row.id, { user_id });
            dbg.log('assign success → reload');
            await load();
        } catch (e) {
            dbg.err('assign error:', e);
        } finally {
            dbg.groupEnd();
        }
    }

    async function onUpdateStatus(status: DeliveryStatus) {
        dbg.group('onUpdateStatus');
        const file = fileRef.current?.files?.[0] ?? null;
        dbg.log('attempt', {
            page_id: id,
            row_id: row?.id,
            from: row?.status,
            to: status,
            hasFile: !!file,
            canUpdate,
        });
        try {
            if (!row) { dbg.warn('blocked: no row'); return; }
            if (!canUpdate) { dbg.warn('blocked: no permission'); return; }
            await updateDeliveryStatus(row.id, { status, handover_photo: file });
            if (fileRef.current) {
                fileRef.current.value = '';
                dbg.log('file input cleared');
            }
            dbg.log('status updated → reload');
            await load();
        } catch (e) {
            dbg.err('update status error:', e);
        } finally {
            dbg.groupEnd();
        }
    }

    if (loading) return <div className="text-sm text-gray-500">Memuat…</div>;
    if (err) return <div className="text-sm text-red-600">{err}</div>;
    if (!row) return null;

    return (
        <div className="space-y-4">
            <header>
                <h1 className="text-lg font-semibold">Delivery Detail</h1>
                <div className="text-xs text-gray-600">ID: {row.id}</div>
            </header>

            <div className="rounded-xl border p-4 space-y-3">
                <div className="flex flex-wrap gap-6 items-center">
                    <div><span className="text-xs">Order:</span> <span className="text-sm font-medium">{row.order_id}</span></div>
                    <div><span className="text-xs">Tipe:</span> <span className="text-sm">{row.type}</span></div>
                    <div><span className="text-xs">Fee:</span> <span className="text-sm">{Number(row.fee).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span></div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-xs">Kurir</span>
                    <AssignCourierSelect value={row.assigned_to ?? null} onChange={onAssign} disabled={!canAssign} />
                </div>

                <div className="space-y-2">
                    <DeliveryStatusStepper status={row.status} />
                    <div className="flex items-center gap-2">
                        <select
                            className="border rounded px-2 py-1 text-sm"
                            defaultValue={row.status}
                            onChange={(e) => {
                                const next = e.target.value as DeliveryStatus;
                                dbg.log('status select changed', { from: row.status, to: next });
                                void onUpdateStatus(next);
                            }}
                            disabled={!canUpdate}
                        >
                            {(['CREATED', 'ASSIGNED', 'PICKED_UP', 'ON_ROUTE', 'DELIVERED', 'FAILED', 'CANCELLED'] as DeliveryStatus[])
                                .map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="text-xs"
                            title="Foto serah-terima (opsional; dipakai saat DELIVERED)"
                            onChange={() => {
                                const f = fileRef.current?.files?.[0] ?? null;
                                dbg.log('file selected', f ? { name: f.name, size: f.size, type: f.type } : '(none)');
                            }}
                        />
                    </div>
                    {row.handover_photo && (
                        <a
                            href={(import.meta.env.VITE_FILES_BASE_URL || '').replace(/\/+$/, '') + '/' + String(row.handover_photo).replace(/^\/+/, '')}
                            target="_blank" rel="noopener noreferrer"
                            className="text-xs underline"
                            onClick={() => dbg.log('open proof clicked', { url: row.handover_photo })}
                        >
                            Lihat bukti serah-terima
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

```
</details>

### src/pages/deliveries/DeliveryIndex.tsx

- SHA: `5bcf77df6de2`  
- Ukuran: 9 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/deliveries/DeliveryIndex.tsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from '../../components/DataTable';
import AssignCourierSelect from '../../components/delivery/AssignCourierSelect';
import { listDeliveries, assignCourier, updateDeliveryStatus } from '../../api/deliveries';
import type { Delivery, DeliveryStatus } from '../../types/deliveries';
import { useHasRole } from '../../store/useAuth';
import { Link } from 'react-router-dom';
import { getOrder } from '../../api/orders';

const STATUSES: DeliveryStatus[] = ['CREATED', 'ASSIGNED', 'PICKED_UP', 'ON_ROUTE', 'DELIVERED', 'FAILED', 'CANCELLED'];

/* eslint-disable no-console */
const TAG = '[DeliveryIndex]';
const dbg = {
  log: (...args: unknown[]) => { if (import.meta.env.DEV) console.log(TAG, ...args); },
  warn: (...args: unknown[]) => { if (import.meta.env.DEV) console.warn(TAG, ...args); },
  err: (...args: unknown[]) => { if (import.meta.env.DEV) console.error(TAG, ...args); },
  group: (label: string) => { if (import.meta.env.DEV) console.groupCollapsed(`${TAG} ${label}`); },
  groupEnd: () => { if (import.meta.env.DEV) console.groupEnd(); },
};
/* eslint-enable no-console */

export default function DeliveryIndex() {
  const canAssign = useHasRole(['Superadmin', 'Admin Cabang', 'Kasir']);
  const canUpdate = useHasRole(['Superadmin', 'Admin Cabang', 'Kasir', 'Kurir']);

  const [status, setStatus] = useState<DeliveryStatus | ''>('');
  const [courier, setCourier] = useState<string | number | ''>('');
  const [rows, setRows] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [orderMap, setOrderMap] = useState<Record<string, { invoice_no?: string | null; number?: string | null }>>({});

  const load = useCallback(async () => {
    const t0 = performance.now();
    dbg.group('load() start');
    dbg.log('filters', { status: status || '(all)', courier: courier || '(all)' });
    setLoading(true); setErr(null);
    try {
      const res = await listDeliveries({
        status: status || undefined,
        courier_id: courier || undefined,
        per_page: 100,
      });
      const list = res.data ?? [];
      setRows(list);
      dbg.log('loaded rows:', list.length, { sample: list.slice(0, 3) });
      try {
        const ids = Array.from(new Set(list.map(d => d.order_id).filter(Boolean)));
        if (ids.length) {
          // Batasi konkuren sederhana
          const chunkSize = 6;
          const nextMap: Record<string, { invoice_no?: string | null; number?: string | null }> = {};
          for (let i = 0; i < ids.length; i += chunkSize) {
            const chunk = ids.slice(i, i + chunkSize);
            const results = await Promise.allSettled(chunk.map((oid) => getOrder(oid)));
            results.forEach((r) => {
              if (r.status === 'fulfilled') {
                const data = r.value?.data;
                if (data?.id) {
                  nextMap[data.id] = { invoice_no: data.invoice_no ?? null, number: data.number ?? null };
                }
              }
            });
          }
          setOrderMap(prev => ({ ...prev, ...nextMap }));
        }
      } catch (e) {
        dbg.warn('hydrate order labels failed:', e);
      }
    } catch (e) {
      dbg.err('load() error:', e);
      setErr('Gagal memuat deliveries');
      setRows([]);
    } finally {
      setLoading(false);
      const dt = (performance.now() - t0).toFixed(1);
      dbg.log(`load() done in ${dt}ms`);
      dbg.groupEnd();
    }
  }, [status, courier]);

  useEffect(() => {
    dbg.log('mount');
    return () => { dbg.log('unmount'); };
  }, []);

  useEffect(() => {
    dbg.log('effect load() — dependencies changed', { status, courier });
    void load();
  }, [load, status, courier]);

  const onAssign = useCallback(async (d: Delivery, user_id: string | number | null) => {
    dbg.group('onAssign');
    dbg.log('attempt', { delivery_id: d.id, user_id, canAssign });
    try {
      if (!canAssign) {
        dbg.warn('blocked: no permission to assign');
        return;
      }
      if (!user_id) {
        dbg.warn('skipped: user_id is null/empty');
        return;
      }
      await assignCourier(d.id, { user_id });
      dbg.log('assign success → reload');
      await load();
    } catch (e) {
      dbg.err('assign error:', e);
    } finally {
      dbg.groupEnd();
    }
  }, [canAssign, load]);

  const advance = useCallback(async (d: Delivery) => {
    dbg.group('advance');
    dbg.log('attempt', { delivery_id: d.id, from: d.status, canUpdate });
    try {
      if (!canUpdate) {
        dbg.warn('blocked: no permission to update status');
        return;
      }
      const flow: DeliveryStatus[] = ['CREATED', 'ASSIGNED', 'PICKED_UP', 'ON_ROUTE', 'DELIVERED'];
      const i = Math.max(0, flow.indexOf(d.status));
      const next = flow[Math.min(i + 1, flow.length - 1)];
      dbg.log('computed next', { next, index: i });

      if (next !== d.status) {
        await updateDeliveryStatus(d.id, { status: next });
        dbg.log('status updated → reload');
        await load();
      } else {
        dbg.warn('no-op: already at terminal or same status');
      }
    } catch (e) {
      dbg.err('advance error:', e);
    } finally {
      dbg.groupEnd();
    }
  }, [canUpdate, load]);

  // helper
  type DeliveryWithOrderRef = Delivery & {
    order_invoice_no?: string | null;
    order_number?: string | null;
  };
  const getOrderLabel = (d: Delivery): string => {
    const dx = d as DeliveryWithOrderRef;
    const cached = orderMap[d.order_id];
    return cached?.invoice_no ?? cached?.number ?? dx.order_invoice_no ?? dx.order_number ?? d.order_id;
  };

  const columns = useMemo(() => {
    dbg.log('columns memo recalculated');
    return [
      { key: 'id', header: 'ID' },
      {
        key: 'order_id', header: 'Order',
        render: (r: Delivery) => (
          <Link className="underline" to={`/orders/${r.order_id}`}>
            {getOrderLabel(r)}
          </Link>
        ),
      },
      { key: 'type', header: 'Tipe' },
      { key: 'fee', header: 'Fee', render: (r: Delivery) => Number(r.fee).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) },
      {
        key: 'assigned_to', header: 'Kurir',
        render: (r: Delivery) => (
          <AssignCourierSelect
            value={r.assigned_to ?? null}
            onChange={(v) => onAssign(r, v)}
            disabled={!canAssign}
          />
        ),
      },
      {
        key: 'status', header: 'Status',
        render: (r: Delivery) => (
          <div className="flex items-center gap-2">
            <span className="text-xs rounded px-2 py-1 border">{r.status}</span>
            <button
              type="button"
              className="text-xs px-2 py-1 border rounded"
              onClick={() => void advance(r)}
              disabled={!canUpdate || r.status === 'DELIVERED' || r.status === 'FAILED' || r.status === 'CANCELLED'}
              title="Majukan status"
            >
              Next
            </button>
          </div>
        ),
      },
      { key: 'created_at', header: 'Dibuat' },
    ];
  }, [canAssign, canUpdate, onAssign, advance, orderMap]);

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Deliveries</h1>
          <p className="text-xs text-gray-600">Auto-assign & tracking</p>
        </div>
      </header>

      <div className="flex flex-wrap gap-2 items-end">
        <div className="flex flex-col">
          <label className="text-xs mb-1">Status</label>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={status}
            onChange={(e) => {
              dbg.log('filter change: status →', e.target.value || '(all)');
              setStatus(e.target.value as DeliveryStatus | '');
            }}
          >
            <option value="">— Semua —</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-xs mb-1">Kurir</label>
          <AssignCourierSelect
            value={courier || null}
            onChange={(v) => {
              dbg.log('filter change: courier →', v ?? '(all)');
              setCourier(v ?? '');
            }}
          />
        </div>
        <button
          type="button"
          className="border rounded px-3 py-2 text-sm"
          onClick={() => {
            dbg.log('filters reset');
            setStatus('');
            setCourier('');
          }}
        >
          Reset
        </button>
      </div>

      <DataTable<Delivery>
        columns={columns}
        rows={rows}
        loading={loading}
        emptyText={err ?? 'Belum ada data'}
      />
    </div>
  );
}

```
</details>

### src/pages/expenses/ExpenseForm.tsx

- SHA: `53cf31566e56`  
- Ukuran: 7 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/expenses/ExpenseForm.tsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createExpense, getExpense, updateExpense } from '../../api/expenses';
import { listBranches } from '../../api/branches';
import type { Expense } from '../../types/expenses';
import type { Branch } from '../../types/branches';
import { toIDR } from '../../utils/money';
import { useHasRole } from '../../store/useAuth';

export default function ExpenseForm() {
    const params = useParams();
    const id = params.id ? String(params.id) : null;
    const editing = !!id;
    const nav = useNavigate();
    const canManage = useHasRole(['Superadmin', 'Admin Cabang']);
    const isSuperadmin = useHasRole(['Superadmin']);

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string>('');

    const [branchList, setBranchList] = useState<Branch[]>([]);
    const [branchId, setBranchId] = useState<string>('');

    const [category, setCategory] = useState<string>('');
    const [amount, setAmount] = useState<string>('0');
    const [note, setNote] = useState<string>('');
    const [existingProof, setExistingProof] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const title = editing ? 'Ubah Pengeluaran' : 'Tambah Pengeluaran';

    useEffect(() => {
        let stop = false;
        (async () => {
            setLoading(true); setErr('');
            try {
                if (isSuperadmin) {
                    const b = await listBranches({ per_page: 100 });
                    if (!stop) setBranchList(b.data ?? []);
                }
                if (editing && id) {
                    const res = await getExpense(id);
                    const row = res.data as Expense | null;
                    if (row) {
                        if (isSuperadmin) setBranchId(String(row.branch_id));
                        setCategory(row.category);
                        setAmount(String(row.amount ?? 0));
                        setNote(row.note ?? '');
                        setExistingProof(row.proof_path ?? null);
                    }
                }
            } catch (e) {
                if (import.meta.env.DEV) console.error('[ExpenseForm] load error', e);
                setErr('Gagal memuat data');
            } finally {
                if (!stop) setLoading(false);
            }
        })();
        return () => { stop = true; };
    }, [editing, id, isSuperadmin]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!canManage) return;
        try {
            setLoading(true); setErr('');
            const file = fileRef.current?.files?.[0] ?? null;
            const num = Number(amount || 0);
            if (Number.isNaN(num)) { setErr('Nominal tidak valid'); setLoading(false); return; }

            if (editing && id) {
                await updateExpense(id, { category, amount: num, note: note || null, proof: file ?? undefined });
            } else {
                const payload: { branch_id?: string; category: string; amount: number; note?: string | null; proof?: File | null } = {
                    category, amount: num, note: note || null,
                };
                if (isSuperadmin) payload.branch_id = branchId || undefined;
                if (file) payload.proof = file;
                await createExpense(payload);
            }
            nav('/expenses');
        } catch (e) {
            if (import.meta.env.DEV) console.error('[ExpenseForm] submit error', e);
            setErr('Gagal menyimpan');
        } finally {
            setLoading(false);
        }
    }

    function fileUrl(path: string | null): string | null {
        if (!path) return null;
        const base = String(import.meta.env.VITE_FILES_BASE_URL || '').replace(/\/+$/, '');
        const clean = String(path).replace(/^\/+/, '');
        return `${base}/${clean}`;
    }

    return (
        <div className="p-4">
            <h1 className="text-lg font-semibold mb-3">{title}</h1>

            {err && <div className="mb-2 text-sm text-red-600">{err}</div>}
            {loading && <div className="text-sm text-gray-500">Memuat…</div>}

            {!loading && (
                <form onSubmit={onSubmit} className="grid gap-3 max-w-xl">
                    {isSuperadmin && (
                        <label className="grid gap-1 text-sm">
                            <span>Cabang</span>
                            <select value={branchId} onChange={(e) => setBranchId(e.target.value)} required className="border rounded-md px-2 py-1">
                                <option value="">-- pilih cabang --</option>
                                {branchList.map(b => <option key={b.id} value={String(b.id)}>{b.name}</option>)}
                            </select>
                        </label>
                    )}

                    <label className="grid gap-1 text-sm">
                        <span>Kategori</span>
                        <input value={category} onChange={(e) => setCategory(e.target.value)} required className="border rounded-md px-2 py-1" placeholder="Contoh: Listrik / Sewa / Operasional lain" />
                    </label>

                    <label className="grid gap-1 text-sm">
                        <span>Nominal</span>
                        <input value={amount} onChange={(e) => setAmount(e.target.value)} required className="border rounded-md px-2 py-1" inputMode="numeric" />
                        <span className="text-xs text-gray-500">{toIDR(Number(amount || 0))}</span>
                    </label>

                    <label className="grid gap-1 text-sm">
                        <span>Catatan</span>
                        <textarea value={note} onChange={(e) => setNote(e.target.value)} className="border rounded-md px-2 py-1" rows={3} placeholder="Opsional" />
                    </label>

                    <label className="grid gap-1 text-sm">
                        <span>Bukti (foto/struk/PDF)</span>
                        <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.pdf" className="border rounded-md px-2 py-1" />
                        {existingProof && (
                            <a href={fileUrl(existingProof) ?? '#'} target="_blank" rel="noopener noreferrer" className="text-xs underline">
                                Lihat bukti saat ini
                            </a>
                        )}
                    </label>

                    <div className="mt-2 flex items-center gap-3">
                        <button type="submit" disabled={loading} className="rounded-lg bg-black px-3 py-2 text-white text-sm disabled:opacity-50">
                            {editing ? 'Simpan Perubahan' : 'Simpan'}
                        </button>
                        <button type="button" onClick={() => nav('/expenses')} className="text-sm underline">Batal</button>
                    </div>
                </form>
            )}
        </div>
    );
}

```
</details>

### src/pages/expenses/ExpensesIndex.tsx

- SHA: `fdbd00d25868`  
- Ukuran: 9 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/expenses/ExpensesIndex.tsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listExpenses, deleteExpense } from '../../api/expenses';
import { listBranches } from '../../api/branches';
import type { Expense, ExpenseQuery } from '../../types/expenses';
import type { Branch } from '../../types/branches';
import { toIDR } from '../../utils/money';
import { useHasRole } from '../../store/useAuth';

type Meta = { current_page: number; per_page: number; total: number; last_page: number };

export default function ExpensesIndex() {
    const canManage = useHasRole(['Superadmin', 'Admin Cabang']);
    const isSuperadmin = useHasRole(['Superadmin']);
    const nav = useNavigate();

    const [rows, setRows] = useState<Expense[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string>('');
    const [branchList, setBranchList] = useState<Branch[]>([]);

    // Filters
    const [branchId, setBranchId] = useState<string>('');
    const [dateFrom, setDateFrom] = useState<string>('');
    const [dateTo, setDateTo] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(15);

    const params: ExpenseQuery = useMemo(() => {
        const out: ExpenseQuery = { page, per_page: perPage };
        if (isSuperadmin && branchId) out.branch_id = branchId;
        if (dateFrom) out.date_from = dateFrom;
        if (dateTo) out.date_to = dateTo;
        return out;
    }, [page, perPage, isSuperadmin, branchId, dateFrom, dateTo]);

    const load = useCallback(async () => {
        setLoading(true);
        setErr('');
        try {
            if (isSuperadmin && branchList.length === 0) {
                const bres = await listBranches({ per_page: 100 });
                setBranchList(bres.data ?? []);
            }
            const res = await listExpenses(params);
            setRows(res.data ?? []);
            setMeta((res.meta as unknown as Meta) ?? null);
        } catch (e) {
            setErr('Gagal memuat data');
            if (import.meta.env.DEV) console.error('[ExpensesIndex] load error', e);
        } finally {
            setLoading(false);
        }
    }, [params, isSuperadmin, branchList.length]);

    useEffect(() => { load(); }, [load]);

    async function onDelete(row: Expense) {
        if (!canManage) return;
        const ok = window.confirm(`Hapus pengeluaran "${row.category}" sebesar ${toIDR(Number(row.amount))}?`);
        if (!ok) return;
        try {
            await deleteExpense(row.id);
            await load();
        } catch (e) {
            if (import.meta.env.DEV) console.error('[ExpensesIndex] delete error', e);
            alert('Gagal menghapus');
        }
    }

    function fileUrl(path: string | null): string | null {
        if (!path) return null;
        const base = String(import.meta.env.VITE_FILES_BASE_URL || '').replace(/\/+$/, '');
        const clean = String(path).replace(/^\/+/, '');
        return `${base}/${clean}`;
    }

    return (
        <div className="p-4">
            <div className="mb-3 flex items-center justify-between">
                <h1 className="text-lg font-semibold">Biaya Operasional</h1>
                {canManage && (
                    <button
                        className="rounded-lg bg-black px-3 py-2 text-white text-sm"
                        onClick={() => nav('/expenses/new')}
                    >
                        Tambah
                    </button>
                )}
            </div>

            <div className="mb-3 grid grid-cols-1 md:grid-cols-5 gap-2">
                {isSuperadmin && (
                    <select
                        value={branchId}
                        onChange={(e) => setBranchId(e.target.value)}
                        className="border rounded-md px-2 py-1 text-sm"
                    >
                        <option value="">Semua Cabang</option>
                        {branchList.map(b => <option key={b.id} value={String(b.id)}>{b.name}</option>)}
                    </select>
                )}
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="border rounded-md px-2 py-1 text-sm" />
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="border rounded-md px-2 py-1 text-sm" />
                <select value={perPage} onChange={(e) => { setPerPage(parseInt(e.target.value, 10)); setPage(1); }} className="border rounded-md px-2 py-1 text-sm">
                    {[10, 15, 25, 50, 100].map(n => <option key={n} value={n}>{n}/hal</option>)}
                </select>
                <button onClick={() => { setPage(1); load(); }} className="border rounded-md px-3 py-1 text-sm">Terapkan</button>
            </div>

            {loading && <div className="text-sm text-gray-500">Memuat…</div>}
            {err && <div className="text-sm text-red-600">{err}</div>}
            {!loading && rows.length === 0 && <div className="text-sm text-gray-500">Belum ada data.</div>}

            {!loading && rows.length > 0 && (
                <div className="overflow-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="text-left border-b">
                                <th className="p-2">Tanggal</th>
                                {isSuperadmin && <th className="p-2">Cabang</th>}
                                <th className="p-2">Kategori</th>
                                <th className="p-2">Nominal</th>
                                <th className="p-2">Catatan</th>
                                <th className="p-2">Bukti</th>
                                {canManage && <th className="p-2"></th>}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(r => (
                                <tr key={r.id} className="border-b hover:bg-gray-50">
                                    <td className="p-2">{r.created_at ? new Date(r.created_at).toLocaleString('id-ID') : '-'}</td>
                                    {isSuperadmin && <td className="p-2">{r.branch?.name ?? r.branch_id}</td>}
                                    <td className="p-2">{r.category}</td>
                                    <td className="p-2">{toIDR(Number(r.amount))}</td>
                                    <td className="p-2">{r.note ?? '-'}</td>
                                    <td className="p-2">
                                        {r.proof_path ? (
                                            <a
                                                className="underline"
                                                target="_blank" rel="noopener noreferrer"
                                                href={fileUrl(r.proof_path) ?? '#'}
                                            >
                                                Lihat
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    {canManage && (
                                        <td className="p-2 text-right space-x-2">
                                            <Link to={`/expenses/${encodeURIComponent(r.id)}/edit`} className="underline">Edit</Link>
                                            <button onClick={() => onDelete(r)} className="underline text-red-600">Hapus</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {meta && meta.last_page > 1 && (
                <div className="mt-3 flex items-center gap-2">
                    <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="border rounded-md px-3 py-1 text-sm disabled:opacity-50">Prev</button>
                    <div className="text-sm">Hal {page} / {meta.last_page} • {meta.total} data</div>
                    <button disabled={page >= meta.last_page} onClick={() => setPage(p => p + 1)} className="border rounded-md px-3 py-1 text-sm disabled:opacity-50">Next</button>
                </div>
            )}
        </div>
    );
}

```
</details>

### src/pages/Login.tsx

- SHA: `90dee148deeb`  
- Ukuran: 7 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/Login.tsx
import { useState, type FormEvent } from 'react';
import type { AxiosError } from 'axios';
import { useAuth, homePathByRole } from '../store/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

/** Ikon mata (show) */
function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  );
}

/** Ikon mata tertutup (hide) */
function EyeOffIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M1 12s4-7 11-7a12 12 0 0 1 5.6 1.4" />
      <path d="M23 12s-4 7-11 7A12 12 0 0 1 6.4 18.6" />
      <line x1="3" y1="3" x2="21" y2="21" />
    </svg>
  );
}

export default function LoginPage() {
  const nav = useNavigate();
  const loc = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const me = await useAuth.login({ email, password });
      const profile = await useAuth.fetchMe();
      const from = (loc.state as { from?: { pathname?: string } } | undefined)?.from?.pathname;
      const fallback = homePathByRole(profile?.roles ?? me?.roles ?? []);
      nav(from ?? fallback, { replace: true });
    } catch (err: unknown) {
      const ax = err as AxiosError<{ errors?: Record<string, string[]>; message?: string }>;
      const msg =
        ax.response?.data?.errors?.auth?.[0] ??
        ax.response?.data?.message ??
        'Login gagal';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="
        text-[color:var(--color-text)] overflow-hidden
      "
    >
      {/* Layer gradient halus */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0 -z-10
          [background:radial-gradient(1000px_600px_at_50%_-120px,rgba(51,102,255,0.10),transparent_55%)]
        "
      />

      {/* Card autentikasi */}
      <section
        aria-labelledby="auth-title"
        className="
          w-full max-w-[420px] rounded-2xl border
          border-[color:var(--color-border)]
          bg-[color:var(--color-bg)]
          p-6 sm:p-8 shadow-[var(--shadow-2)]
        "
      >
        <header className="mb-6 sm:mb-8 text-center">
          <div className="text-xs font-semibold tracking-[0.18em] text-[color:var(--color-primary)]">
            SALVE
          </div>
          <h1 id="auth-title" className="mt-1 text-2xl font-semibold">Masuk</h1>
        </header>

        {error && (
          <div
            role="alert"
            className="
              mb-4 rounded-md border px-3 py-2 text-sm
              border-[color:var(--color-danger)]
              text-[color:var(--color-danger)]
              bg-[color-mix(in_srgb,var(--color-danger)_10%,transparent)]
            "
          >
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} aria-busy={loading} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input
              id="email"
              required
              type="email"
              placeholder="nama@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={loading}
              aria-invalid={!!error}
              className="
                block w-full rounded-md
                border border-[color:var(--color-border)]
                bg-white/95 text-[color:var(--color-text)]
                placeholder:text-slate-500
                px-3 py-2
                focus:outline-none focus-visible:shadow-[var(--focus-ring)]
                disabled:opacity-60
              "
            />
          </div>

          {/* Password + toggle show/hide */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium">Kata sandi</label>
            <div className="relative">
              <input
                id="password"
                required
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
                aria-invalid={!!error}
                className="
                  block w-full rounded-md
                  border border-[color:var(--color-border)]
                  bg-white/95 text-[color:var(--color-text)]
                  placeholder:text-slate-500
                  px-3 py-2 pr-12
                  focus:outline-none focus-visible:shadow-[var(--focus-ring)]
                  disabled:opacity-60
                "
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                disabled={loading}
                aria-label={showPwd ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                aria-pressed={showPwd}
                className="
                  absolute right-1.5 top-1/2 -translate-y-1/2
                  rounded-md px-2 py-1
                  text-slate-600 hover:bg-[color:var(--blue-100)]
                  focus:outline-none focus-visible:shadow-[var(--focus-ring)]
                  disabled:opacity-60
                "
              >
                {showPwd ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              inline-flex w-full items-center justify-center rounded-lg
              bg-[color:var(--color-primary)] px-4 py-2.5
              font-medium text-[color:var(--color-on-primary)]
              transition hover:shadow-[var(--shadow-2)] active:scale-[.98]
              focus:outline-none focus-visible:shadow-[var(--focus-ring)]
              disabled:opacity-60
            "
          >
            {loading ? 'Memproses…' : 'Masuk'}
          </button>

        </form>
      </section>
    </main>
  );
}

```
</details>

### src/pages/orders/OrderDetail.tsx

- SHA: `10f33edd5704`  
- Ukuran: 11 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/orders/OrderDetail.tsx
import { useCallback, useEffect, useState } from 'react';
import {
  getOrder,
  updateOrderStatus,
  getOrderReceiptHtml,
  openOrderReceipt,
} from '../../api/orders';
import ReceiptPreview from '../../components/ReceiptPreview';
import type { Order, OrderBackendStatus } from '../../types/orders';
import OrderStatusStepper from '../../components/orders/OrderStatusStepper';
import OrderPhotosGallery from '../../components/orders/OrderPhotosGallery';
import OrderPhotosUpload from '../../components/orders/OrderPhotosUpload';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllowedNext } from '../../utils/order-status';
import { isAxiosError } from 'axios';

type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[] | string>;
};

export default function OrderDetail(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [row, setRow] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receiptHtml, setReceiptHtml] = useState<string>('');
  const [receiptLoading, setReceiptLoading] = useState(false);
  const [receiptErr, setReceiptErr] = useState<string | null>(null);

  const loadReceipt = useCallback(async () => {
    if (!id) return;
    setReceiptLoading(true);
    setReceiptErr(null);
    try {
      const html = await getOrderReceiptHtml(id);
      setReceiptHtml(html);
    } catch {
      setReceiptErr('Gagal memuat struk');
    } finally {
      setReceiptLoading(false);
    }
  }, [id]);

  const refresh = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await getOrder(id);
      setRow(res.data);
    } catch {
      setErr('Gagal memuat detail');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { void refresh(); }, [refresh]);

  const onTransit = useCallback(async (next: OrderBackendStatus) => {
    if (!id) return;
    try {
      await updateOrderStatus(id, next);
      await refresh();
    } catch (e: unknown) {
      let msg = 'Gagal ubah status';
      if (isAxiosError<ApiErrorResponse>(e)) {
        const api = e.response?.data;
        const errMap = api?.errors;

        const nextVal = errMap?.['next'];
        let detail: string | undefined;
        if (typeof nextVal === 'string') detail = nextVal;
        else if (Array.isArray(nextVal)) detail = nextVal[0];
        else if (errMap) {
          const v = Object.values(errMap)[0];
          detail = Array.isArray(v) ? v[0] : (typeof v === 'string' ? v : undefined);
        }

        msg = api?.message ?? detail ?? msg;
      }
      alert(msg);
    }
  }, [id, refresh]);

  return (
    <div className="space-y-4">
      {loading && <div className="text-sm text-gray-600">Memuat…</div>}
      {err && (
        <div role="alert" className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
          {err}
        </div>
      )}
      {!loading && !row && !err && (
        <div className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1 p-6 text-sm text-gray-500">
          Tidak ditemukan
        </div>
      )}

      {row && (
        <>
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold tracking-tight">Order {row.invoice_no ?? row.number}</div>
              <div className="text-xs text-gray-600">{row.customer?.name ?? '-'}</div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Buka struk tab baru */}
              <button
                type="button"
                className="btn-outline px-3 py-1.5 text-xs"
                onClick={() => openOrderReceipt(row.id)}
                title="Buka struk di tab baru"
              >
                Receipt
              </button>

              {/* Toggle preview di halaman */}
              <button
                type="button"
                className="btn-outline px-3 py-1.5 text-xs"
                onClick={async () => {
                  const next = !receiptOpen;
                  setReceiptOpen(next);
                  if (next && !receiptHtml) {
                    await loadReceipt();
                  }
                }}
                title="Tampilkan/sembunyikan preview struk"
              >
                {receiptOpen ? 'Tutup Preview' : 'Preview Receipt'}
              </button>

              {/* Shortcut pelunasan bila masih ada sisa */}
              {(row.due_amount ?? 0) > 0 && (
                <button
                  type="button"
                  className="btn-primary px-3 py-1.5 text-xs text-[color:var(--color-brand-on)]"
                  onClick={() => navigate(`/receivables?q=${encodeURIComponent(row.invoice_no ?? row.number ?? '')}`)}
                  title="Menuju halaman Piutang untuk pelunasan"
                >
                  Pelunasan
                </button>
              )}

              {/* Stepper status (komponen existing) */}
              <OrderStatusStepper backendStatus={row.status} />
            </div>
          </div>

          {/* Items table */}
          <div className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1 overflow-hidden">
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-[#E6EDFF] text-[color:var(--color-text-default)] sticky top-0 z-10">
                  <tr className="divide-x divide-[color:var(--color-border)]">
                    <Th>Layanan</Th>
                    <Th>Qty</Th>
                    <Th>Harga</Th>
                    <Th>Total</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--color-border)]">
                  {(row.items ?? []).map((it) => (
                    <tr key={it.id} className="hover:bg-black/5 transition-colors">
                      <Td>{it.service?.name ?? it.service_id}</Td>
                      <Td>{it.qty}</Td>
                      <Td>
                        {Number(it.price).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                      </Td>
                      <Td>
                        {Number(it.total).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex flex-wrap justify-end gap-x-6 gap-y-2 p-3 border-t border-[color:var(--color-border)] text-sm">
              <div>
                <span className="text-gray-600">Subtotal</span>{' '}
                <b>{Number(row.subtotal).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</b>
              </div>
              <div>
                <span className="text-gray-600">Diskon</span>{' '}
                <b>{Number(row.discount).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</b>
              </div>
              <div>
                <span className="text-gray-600">Grand</span>{' '}
                <b>{Number(row.grand_total).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</b>
              </div>
              <div>
                <span className="text-gray-600">Sisa</span>{' '}
                <b>{Number(row.due_amount).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</b>
              </div>
            </div>
          </div>

          {/* Photos */}
          <OrderPhotosGallery
            key={`${row.id}:${row.photos?.length ?? 0}`}
            photos={row.photos ?? []}
          />
          <div className="mt-3">
            <OrderPhotosUpload
              orderId={row.id}
              onUploaded={async () => { await refresh(); }}
            />
          </div>

          {/* Receipt Preview */}
          {receiptOpen && (
            <div className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-[color:var(--color-border)]">
                <div className="text-sm font-semibold">Receipt Preview</div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="btn-outline px-3 py-1.5 text-xs disabled:opacity-50"
                    onClick={loadReceipt}
                    disabled={receiptLoading}
                    title="Muat ulang HTML struk"
                  >
                    {receiptLoading ? 'Memuat…' : 'Reload'}
                  </button>
                  <button
                    type="button"
                    className="btn-outline px-3 py-1.5 text-xs"
                    onClick={() => openOrderReceipt(row.id, true)}
                    title="Buka & print"
                  >
                    Open & Print
                  </button>
                </div>
              </div>

              {receiptErr && <div className="p-3 text-xs text-red-600">{receiptErr}</div>}
              {!receiptErr && receiptLoading && (
                <div className="p-3 text-xs text-gray-600">Memuat struk…</div>
              )}
              {!receiptErr && !receiptLoading && !receiptHtml && (
                <div className="p-3 text-xs text-gray-600">Belum ada HTML struk.</div>
              )}
              {!receiptErr && !!receiptHtml && (
                <ReceiptPreview html={receiptHtml} height="70vh" />
              )}
            </div>
          )}

          {/* Status transitions */}
          <div className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1 p-3 flex flex-wrap gap-2">
            {getAllowedNext(row.status).map((s) => (
              <button
                key={s}
                className="btn-outline px-2 py-1 text-xs"
                onClick={() => void onTransit(s)}
                title={`Set status ke ${s}`}
              >
                Set {s}
              </button>
            ))}

            {getAllowedNext(row.status).length === 0 && (
              <span className="text-xs text-gray-600">
                Status terminal — tidak ada transisi.
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------
   Sub-komponen presentasional (UI-only)
------------------------- */

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide">
      {children}
    </th>
  );
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-3 py-2 align-middle">{children}</td>;
}

```
</details>

### src/pages/orders/OrderReceipt.tsx

- SHA: `f1902327be67`  
- Ukuran: 6 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/orders/OrderReceipt.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderReceiptHtml, getOrder } from '../../api/orders';
import { buildWhatsAppLink } from '../../utils/wa';
import type { Order } from '../../types/orders';
import { toIDR } from '../../utils/money';

export default function OrderReceipt(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const [html, setHtml] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [waPhone, setWaPhone] = useState<string>('');
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    (async () => {
      try {
        if (!id) return;
        const h = await getOrderReceiptHtml(id);
        setHtml(h);

        try {
          const orderRes = await getOrder(id);
          const ord = orderRes?.data ?? null;
          if (ord) {
            setOrder(ord);
            const wa = ord.customer?.whatsapp ?? '';
            if (wa) setWaPhone(wa);
          }
        } catch {
          // Biarkan tetap jalan meski gagal ambil order (struk tetap tampil)
        }
      } catch (e: unknown) {
        setError((e as Error).message || 'Gagal memuat struk');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="p-4 max-w-3xl mx-auto">
        <div className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1 p-4">
          <div className="h-4 w-40 rounded bg-black/10 animate-pulse mb-3" />
          <div className="h-3 w-full rounded bg-black/10 animate-pulse mb-2" />
          <div className="h-3 w-5/6 rounded bg-black/10 animate-pulse mb-2" />
          <div className="h-3 w-4/6 rounded bg-black/10 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-3xl mx-auto">
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2"
        >
          {error}
        </div>
      </div>
    );
  }

  const onPrint = () => {
    const prev = document.title;
    const nomor = order?.invoice_no ?? order?.number ?? 'Receipt';
    document.title = `Receipt ${nomor}`;
    window.print();
    document.title = prev;
  };

  const onSendWA = () => {
    if (!waPhone) return;

    // Default message kalau order belum kebaca (harusnya jarang terjadi)
    let message = 'Halo, berikut struk transaksi Anda. Terima kasih 🙏';

    if (order) {
      const name = order.customer?.name ?? 'Pelanggan';
      const nomor = order.invoice_no ?? order.number;
      const total = toIDR(order.grand_total);
      const sisa = Number(order.due_amount ?? 0);

      if (sisa > 0) {
        // MODE TAGIHAN / JATUH TEMPO
        message = [
          `Halo ${name},`,
          `Ini tagihan laundry Anda dengan nomor ${nomor}.`,
          `Total: ${total}.`,
          `Sisa tagihan: ${toIDR(sisa)}.`,
          `Mohon melakukan pelunasan sebelum jatuh tempo. Terima kasih 🙏`,
        ].join('\n');
      } else {
        // MODE KUITANSI (SUDAH LUNAS)
        message = [
          `Halo ${name},`,
          `Ini kuitansi pelunasan transaksi laundry Anda dengan nomor ${nomor}.`,
          `Total dibayar: ${total}.`,
          `Terima kasih telah menggunakan layanan kami 🙏`,
        ].join('\n');
      }
    }

    const url = buildWhatsAppLink(waPhone, message);
    window.open(url, '_blank');
  };

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-3">
      {/* Toolbar (print hidden) */}
      <div className="print:hidden sticky top-0 z-10">
        <div className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1 p-3 bg-[var(--color-surface)]">
          <div className="flex flex-col md:flex-row md:items-end gap-2">
            <div className="flex gap-2">
              <button
                className="btn-outline px-3 py-2"
                onClick={onPrint}
                aria-label="Cetak struk"
                title="Cetak struk"
              >
                Print
              </button>
            </div>

            <div className="flex-1 md:ml-2">
              <label className="grid gap-1 text-sm">
                <span className="text-[color:var(--color-text-default)]">Nomor WhatsApp</span>
                <input
                  type="tel"
                  placeholder="No. WA (62…/08…)"
                  value={waPhone}
                  onChange={(e) => setWaPhone(e.target.value)}
                  className="input px-3 py-2"
                  aria-label="Nomor WhatsApp"
                />
              </label>
            </div>

            <div className="flex gap-2 md:ml-auto">
              <button
                className="btn-primary disabled:opacity-50 disabled:pointer-events-none"
                onClick={onSendWA}
                disabled={!waPhone}
                aria-label="Kirim struk via WhatsApp"
                title="Kirim WhatsApp"
              >
                Kirim WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info ringkas sebelum preview (membantu kasir) */}
      {order && (
        <div className="print:hidden text-xs text-gray-700">
          <b>No:</b> {order.invoice_no ?? order.number}{' '}
          &middot; <b>Customer:</b> {order.customer?.name ?? '-'}
        </div>
      )}

      {/* Preview struk */}
      <div
        className="bg-white rounded-lg border border-[color:var(--color-border)] shadow-elev-1 p-3 print:shadow-none print:border-0 print:p-0"
        role="document"
        aria-label="Pratinjau struk"
      >
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}

```
</details>

### src/pages/orders/OrdersIndex.tsx

- SHA: `e49b7a9b3fef`  
- Ukuran: 10 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/orders/OrdersIndex.tsx
import { useCallback, useEffect, useState } from 'react';
import { listOrders, openOrderReceipt } from '../../api/orders';
import type { Order, OrderBackendStatus, PaginationMeta } from '../../types/orders';
import { Link } from 'react-router-dom';

const dlog = (...args: unknown[]) => {
  if (import.meta.env?.DEV) console.log('[OrdersIndex]', ...args);
};

const shortOrderNo = (number?: string | null, invoiceNo?: string | null): string => {
  if (invoiceNo && invoiceNo.trim().length > 0) return invoiceNo;
  if (!number) return '-';
  const m = number.match(/(\d{4,})$/);
  const tail = m?.[1] ?? number.slice(-6);
  return `#${tail}`;
};

export default function OrdersIndex(): React.ReactElement {
  const [rows, setRows] = useState<Order[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<OrderBackendStatus | ''>('');
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (p = 1) => {
    dlog('refresh start', { q: q || undefined, status: status || undefined, page: p, perPage });
    setLoading(true); setError(null);
    try {
      const res = await listOrders({ q: q || undefined, status: status || undefined, page: p, per_page: perPage });
      dlog('refresh success', { count: (res.data ?? []).length, meta: res.meta });
      setRows(res.data ?? []);
      setMeta(res.meta as PaginationMeta);
      setPage(p);
    } catch (e) {
      dlog('refresh error', e);
      setError('Gagal memuat data');
    } finally {
      setLoading(false);
      dlog('refresh finally: loading=false');
    }
  }, [q, status]);

  useEffect(() => { dlog('mount'); return () => dlog('unmount'); }, []);
  useEffect(() => { dlog('query changed', q); }, [q]);
  useEffect(() => { dlog('status changed', status); }, [status]);
  useEffect(() => { dlog('page changed', page); }, [page]);
  useEffect(() => { dlog('rows/meta updated', { rows: rows.length, meta }); }, [rows, meta]);
  useEffect(() => { dlog('loading/error', { loading, error }); }, [loading, error]);

  useEffect(() => { void refresh(1); }, [refresh]);

  const onApply = () => {
    dlog('apply filter clicked');
    void refresh(1);
  };

  const onPrev = () => {
    const target = page - 1;
    dlog('pagination prev', { from: page, to: target });
    void refresh(target);
  };

  const onNext = () => {
    const target = page + 1;
    dlog('pagination next', { from: page, to: target });
    void refresh(target);
  };

  const onOpenReceipt = async (id: Order['id']) => {
    dlog('open receipt', id);
    try {
      await openOrderReceipt(id); // akan buka tab baru berisi HTML struk
    } catch (e) {
      dlog('open receipt error', e);
      setError('Gagal membuka struk. Izinkan pop-up untuk situs ini, lalu coba lagi.');
    }
  };

  return (
    <div className="space-y-4">
      {/* FilterBar */}
      <section
        className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1"
        aria-label="Filter orders"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3">
          <label className="grid gap-1 text-sm md:col-span-2">
            <span className="text-[color:var(--color-text-default)]">Pencarian</span>
            <input
              className="input px-3 py-2"
              placeholder="Cari nomor (INV…)/nama/phone…"
              value={q}
              onChange={(e) => { dlog('q input', e.target.value); setQ(e.target.value); }}
              aria-label="Cari pesanan"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-[color:var(--color-text-default)]">Status</span>
            <select
              className="input px-3 py-2"
              value={status}
              onChange={(e) => { const v = e.target.value as OrderBackendStatus | ''; dlog('status select', v); setStatus(v); }}
              aria-label="Filter status"
            >
              <option value="">Semua Status</option>
              <option value="QUEUE">QUEUE</option>
              <option value="WASHING">WASHING</option>
              <option value="DRYING">DRYING</option>
              <option value="IRONING">IRONING</option>
              <option value="READY">READY</option>
              <option value="DELIVERING">DELIVERING</option>
              <option value="PICKED_UP">PICKED_UP</option>
              <option value="CANCELED">CANCELED</option>
            </select>
          </label>

          <div className="flex items-end gap-2">
            <button className="btn-primary" onClick={onApply}>Terapkan</button>
            {/* Tombol reset opsional bila ada kebutuhan nanti */}
          </div>

          <div className="flex items-end md:justify-end">
            <Link to="/pos" className="btn-primary md:ml-auto text-[color:var(--color-brand-on)]" aria-label="Buat transaksi baru">
              Buat Transaksi
            </Link>
          </div>
        </div>
      </section>

      {/* Loading / Error / Empty */}
      {loading && (
        <div className="text-sm text-gray-600">
          Memuat…
        </div>
      )}

      {error && (
        <div role="alert" className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
          {error}
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <div className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1 p-6 text-sm text-gray-500">
          Data kosong
        </div>
      )}

      {/* Table */}
      {rows.length > 0 && (
        <div className="card overflow-hidden border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#E6EDFF] text-[color:var(--color-text-default)] sticky top-0 z-10">
                <tr className="divide-x divide-[color:var(--color-border)]">
                  <Th>Nomor</Th>
                  <Th>Customer</Th>
                  <Th>Status</Th>
                  <Th>Total</Th>
                  <Th>Aksi</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color:var(--color-border)]">
                {rows.map((o) => (
                  <tr key={o.id} className="hover:bg-black/5 transition-colors">
                    <Td className="font-medium max-w-[160px] truncate" title={(o.invoice_no ?? o.number) ?? ''}>
                      {shortOrderNo(o.number, o.invoice_no)}
                    </Td>
                    <Td className="max-w-[200px] truncate" title={o.customer?.name ?? ''}>
                      {o.customer?.name ?? '—'}
                    </Td>
                    <Td><StatusBadge status={o.status} /></Td>
                    <Td>
                      {Number(o.grand_total).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <Link to={`/orders/${o.id}`} className="text-xs text-[color:var(--color-brand-primary)] hover:underline">
                          Detail
                        </Link>
                        <button
                          type="button"
                          className="text-xs btn-outline px-2 py-1"
                          onClick={() => void onOpenReceipt(o.id)}
                          title="Lihat/Cetak struk"
                        >
                          Receipt
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {meta && meta.last_page > 1 && (
            <div className="flex items-center justify-end gap-2 p-2 border-t border-[color:var(--color-border)]">
              <button
                disabled={page <= 1}
                className="btn-outline px-2 py-1 disabled:opacity-50 disabled:pointer-events-none"
                onClick={onPrev}
              >
                Prev
              </button>
              <div className="text-xs text-gray-600">
                Page {meta.current_page} / {meta.last_page}
              </div>
              <button
                disabled={page >= meta.last_page}
                className="btn-outline px-2 py-1 disabled:opacity-50 disabled:pointer-events-none"
                onClick={onNext}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------
   Sub-komponen presentasional
------------------------- */

function Th({
  children,
  className = '',
  ...rest
}: React.ComponentProps<'th'>) {
  return (
    <th
      className={`px-3 py-2 text-left text-xs font-medium uppercase tracking-wide ${className}`}
      {...rest}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className = '',
  ...rest
}: React.ComponentProps<'td'>) {
  return (
    <td className={`px-3 py-2 align-middle ${className}`} {...rest}>
      {children}
    </td>
  );
}

function StatusBadge({ status }: { status: OrderBackendStatus }) {
  // Murni presentasi (warna/varian), tidak mengubah logika data
  const clsBase = 'chip text-xs';
  const cls =
    status === 'CANCELED'
      ? 'chip--danger'
      : status === 'READY' || status === 'PICKED_UP'
        ? 'chip--solid'
        : 'chip--subtle';
  return <span className={`${clsBase} ${cls}`}>{status}</span>;
}

```
</details>

### src/pages/pos/POSPage.tsx

- SHA: `a3076e7526f0`  
- Ukuran: 20 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/pos/POSPage.tsx
import { useEffect, useMemo, useState, useRef } from 'react';
import ProductSearch from '../../components/pos/ProductSearch';
import CartPanel, { type CartItem } from '../../components/pos/CartPanel';
import { createOrder, getOrder, createOrderPayment } from '../../api/orders';
import type { OrderCreatePayload } from '../../types/orders';
import type { PaymentCreatePayload, PaymentMethod } from '../../types/payments';
import type { RoleName } from '../../api/client';
import CustomerPicker from '../../components/customers/CustomerPicker';
import { uploadOrderPhotos } from '../../api/orderPhotos';
import { applyVoucherToOrder } from '../../api/vouchers';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/useAuth';
import { toIDR } from '../../utils/money';

type HttpError = { response?: { status?: number; data?: unknown } };

function extractServerMessage(data: unknown): string | null {
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object' && 'message' in data) {
    const m = (data as Record<string, unknown>).message;
    return typeof m === 'string' ? m : null;
  }
  return null;
}

const dlog = (...args: unknown[]) => {
  if (import.meta.env?.DEV) console.log('[POSPage]', ...args);
};

export default function POSPage() {
  const nav = useNavigate();
  const { user, hasRole } = useAuth;
  const branchId = user?.branch_id ? String(user.branch_id) : '';

  // cart & form states
  const [items, setItems] = useState<CartItem[]>([]);
  const [customerId, setCustomerId] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const PAY_ROLES: RoleName[] = ['Superadmin', 'Admin Cabang', 'Kasir'];
  const canPay = hasRole(PAY_ROLES);

  // photos
  const [beforeFiles, setBeforeFiles] = useState<File[]>([]);
  const [afterFiles, setAfterFiles] = useState<File[]>([]);
  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef = useRef<HTMLInputElement>(null);

  // device / UI
  const isMobile = useMemo(() => /android|iphone|ipad|ipod/i.test(navigator.userAgent), []);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  // payment
  type PayMode = 'PENDING' | 'DP' | 'FULL';
  const [mode, setMode] = useState<PayMode>('PENDING');
  const [method, setMethod] = useState<PaymentMethod>('CASH');
  const [dpAmount, setDpAmount] = useState<number>(0);

  // voucher
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [voucherMsg, setVoucherMsg] = useState<string | null>(null);

  // totals
  const subtotal = useMemo(() => items.reduce((s, it) => s + it.price * it.qty, 0), [items]);
  const total = useMemo(() => Math.max(0, subtotal - discount), [subtotal, discount]);
  const payableNow = useMemo(() => {
    if (mode === 'PENDING') return 0;
    if (mode === 'DP') return Math.max(0, Math.min(dpAmount, total));
    return total;
  }, [mode, dpAmount, total]);
  const grand = useMemo(() => Math.max(0, subtotal - (discount || 0)), [subtotal, discount]);
  const canSubmit = useMemo(() => items.length > 0 && !!customerId && !loading, [items.length, customerId, loading]);

  // logs
  useEffect(() => { dlog('mount'); return () => dlog('unmount'); }, []);
  useEffect(() => { dlog('items changed', items); }, [items]);
  useEffect(() => { dlog('discount changed', discount); }, [discount]);
  useEffect(() => { dlog('notes changed', notes); }, [notes]);
  useEffect(() => { dlog('totals', { subtotal, grand }); }, [subtotal, grand]);

  // cart ops
  function addItem(svc: { id: string; name: string; unit: string; price_effective: number }) {
    dlog('addItem clicked', svc);
    setItems((prev) => {
      const found = prev.find((p) => p.service_id === svc.id);
      if (found) {
        const next = prev.map((p) => (p.service_id === svc.id ? { ...p, qty: p.qty + 1 } : p));
        dlog('increment qty', { service_id: svc.id, nextQty: found.qty + 1 });
        return next;
      }
      const next = [...prev, { service_id: svc.id, name: svc.name, unit: svc.unit, price: svc.price_effective, qty: 1 }];
      dlog('push new cart item', next[next.length - 1]);
      return next;
    });
  }
  const onChangeQty = (id: string, qty: number) => setItems((prev) => prev.map((p) => (p.service_id === id ? { ...p, qty } : p)));
  const onChangeNote = (id: string, note: string) => setItems((prev) => prev.map((p) => (p.service_id === id ? { ...p, note } : p)));
  const onRemove = (id: string) => setItems((prev) => prev.filter((p) => p.service_id !== id));

  // submit
  async function onSubmit() {
    dlog('onSubmit start');
    if (items.length === 0) return setError('Keranjang kosong');
    if (hasRole(['Kasir', 'Admin Cabang']) && !branchId) return setError('Akun Anda belum terikat ke cabang. Hubungi admin pusat.');
    if (!customerId) return setError('Pelanggan wajib dipilih.');
    if (mode === 'DP' && (payableNow <= 0 || payableNow > total)) return setError('Nominal DP tidak valid (≤ 0 atau melebihi grand total).');
    if (mode === 'FULL' && payableNow <= 0) return setError('Nominal pembayaran harus > 0 untuk mode FULL.');

    setLoading(true); setError(null);
    try {
      // 1) create order
      const payload: OrderCreatePayload = {
        branch_id: branchId || undefined,
        customer_id: customerId,
        items: items.map((it) => ({ service_id: it.service_id, qty: it.qty, note: it.note ?? null })),
        discount: discount || 0,
        notes: notes || null,
      };
      dlog('createOrder payload', payload);
      const res = await createOrder(payload);
      let order = res.data!;

      // 2) apply voucher (optional)
      if (voucherCode.trim()) {
        try {
          setVoucherMsg(null);
          await applyVoucherToOrder(String(order.id), { code: voucherCode.trim().toUpperCase() });
          const refreshed = await getOrder(String(order.id)); // sync totals
          order = refreshed.data!;
          setVoucherMsg('Voucher berhasil diterapkan.');
        } catch (ex: unknown) {
          const ax = ex as HttpError;
          const msg =
            extractServerMessage(ax.response?.data) ??
            (ax.response?.status === 422
              ? 'Voucher tidak valid / syarat tidak terpenuhi'
              : ax.response?.status === 404
              ? 'Kode voucher tidak ditemukan'
              : 'Gagal menerapkan voucher');
          setVoucherMsg(msg);
        }
      }

      // 3) payment (if allowed & not pending)
      const adjustedPayNow = Math.min(payableNow, Number(order?.grand_total ?? payableNow));
      if (canPay && mode !== 'PENDING') {
        const payPayload: PaymentCreatePayload =
          mode === 'DP'
            ? { method: 'DP', amount: adjustedPayNow, paid_at: new Date().toISOString() }
            : { method, amount: adjustedPayNow, paid_at: new Date().toISOString() };

        dlog('createOrderPayment payload', payPayload);
        const payRes = await createOrderPayment(order.id, payPayload);
        order = payRes.order;
      }

      // 4) upload photos (best-effort)
      try {
        if (beforeFiles.length || afterFiles.length) {
          dlog('uploadOrderPhotos start', { before: beforeFiles.length, after: afterFiles.length });
          await uploadOrderPhotos(order.id, beforeFiles, afterFiles);
          dlog('uploadOrderPhotos done');
        }
      } catch (e) {
        console.warn('[POSPage] upload photos failed', e);
      }

      alert('Transaksi tersimpan');
      nav(`/orders/${order.id}/receipt`, { replace: true });
    } catch (e: unknown) {
      dlog('createOrder error', e);
      const ax = e as HttpError;
      if (ax.response?.status === 403) {
        const msg = extractServerMessage(ax.response.data) ?? 'Forbidden: Anda tidak diizinkan melakukan pembayaran untuk order ini.';
        setError(msg);
      } else if (ax.response?.status === 422) {
        const data = ax.response.data as { message?: string; errors?: Record<string, string[]> } | undefined;
        console.error('[POSPage] 422 detail:', data?.errors);
        setError(data?.message ?? 'Validasi gagal (422)');
      } else {
        setError((e as Error)?.message ?? 'Gagal menyimpan transaksi');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_minmax(420px,480px)]">
      {/* LEFT: katalog & pencarian */}
      <section className="space-y-3">
        <div className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1 p-3">
          <div className="flex items-center justify-between">
            <h1 className="text-sm font-semibold">Cari Layanan</h1>
            <span className="text-[10px] text-gray-500">Ctrl+K · Enter tambah · Del hapus</span>
          </div>
          <div className="mt-2">
            <ProductSearch onPick={addItem} />
          </div>
        </div>

        {/* Order Photos */}
        <div className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1 p-3 space-y-3">
          <div className="text-sm font-semibold">Foto Pesanan</div>
          <div className="grid gap-3 md:grid-cols-2">
            {/* BEFORE */}
            <UploadBox
              title="Before"
              isMobile={isMobile}
              inputRef={beforeRef}
              files={beforeFiles}
              onFiles={(f) => setBeforeFiles((prev) => [...prev, ...f])}
            />
            {/* AFTER */}
            <UploadBox
              title="After"
              isMobile={isMobile}
              inputRef={afterRef}
              files={afterFiles}
              onFiles={(f) => setAfterFiles((prev) => [...prev, ...f])}
            />
          </div>
        </div>

        {/* Form ringkas (pelanggan, voucher, diskon, catatan) */}
        <div className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1 p-3 space-y-3">
          <div className="grid gap-1">
            <label className="text-xs">
              Pelanggan <span className="text-red-600">*</span>
            </label>
            <CustomerPicker
              value={customerId}
              onChange={setCustomerId}
              placeholder="Ketik nama/WA/alamat pelanggan…"
              requiredText="Pelanggan wajib dipilih dari data terdaftar."
            />
          </div>

          <div className="grid gap-1">
            <label className="text-xs">Kode Voucher</label>
            <div className="flex gap-2">
              <input
                className="input px-3 py-2 flex-1"
                placeholder="MASUKKAN-KODE"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
              />
              <span className="self-center text-[10px] text-gray-500">Voucher diterapkan saat “Simpan & Cetak”</span>
            </div>
            {voucherMsg && <div className="text-xs text-gray-600">{voucherMsg}</div>}
          </div>

          <div className="grid gap-1">
            <label className="text-xs">Diskon</label>
            <input
              type="number"
              min={0}
              className="input px-3 py-2"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value) || 0)}
            />
          </div>

          <div className="grid gap-1">
            <label className="text-xs">Catatan</label>
            <textarea
              className="input px-3 py-2 min-h-[84px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* RIGHT: cart & pembayaran */}
      <aside className="md:sticky md:top-4 md:h-[calc(100dvh-2rem)] md:overflow-auto space-y-3">
        {/* Info cabang */}
        <div className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1 p-3">
          <div className="text-xs text-gray-600">Cabang</div>
          <div className="text-sm font-semibold">{branchId || '-'}</div>
        </div>

        {/* Desktop cart */}
        <div className="hidden md:block">
          <CartPanel items={items} onChangeQty={onChangeQty} onChangeNote={onChangeNote} onRemove={onRemove} />
        </div>

        {/* Mobile bottom bar summary */}
        <MobileCartBar
          open={mobileCartOpen}
          setOpen={setMobileCartOpen}
          itemsCount={items.reduce((n, it) => n + it.qty, 0)}
          total={grand}
        >
          {/* Cart content inside bottom sheet */}
          <CartPanel items={items} onChangeQty={onChangeQty} onChangeNote={onChangeNote} onRemove={onRemove} />
        </MobileCartBar>

        {/* Payment & actions */}
        <div className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1 p-3 space-y-3">
          <div className="flex justify-between text-sm">
            <span>Grand Total</span>
            <span className="font-semibold">{toIDR(grand)}</span>
          </div>

          {/* Mode Pembayaran */}
          <div className="space-y-2">
            <div className="text-xs font-medium">Mode Pembayaran</div>
            <div className="inline-flex rounded-lg border border-[color:var(--color-border)] overflow-hidden">
              {(['PENDING', 'DP', 'FULL'] as const).map((m) => {
                const active = mode === m;
                return (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-3 py-1.5 text-sm transition-colors ${
                      active
                        ? 'bg-[var(--color-brand-primary)] text-[var(--color-brand-on)]'
                        : 'bg-white text-[color:var(--color-text-default)] hover:bg-black/5'
                    }`}
                    aria-pressed={active}
                  >
                    {m}
                  </button>
                );
              })}
            </div>

            {mode === 'FULL' && (
              <div>
                <div className="text-xs font-medium mb-1">Metode</div>
                <div className="flex flex-wrap gap-2">
                  {(['CASH', 'QRIS', 'TRANSFER'] as PaymentMethod[]).map((pm) => {
                    const active = method === pm;
                    return (
                      <button
                        key={pm}
                        onClick={() => setMethod(pm)}
                        className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                          active
                            ? 'bg-[var(--color-brand-primary)] text-[var(--color-brand-on)]'
                            : 'bg-white hover:bg-black/5'
                        }`}
                        aria-pressed={active}
                      >
                        {pm}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {mode === 'DP' && (
              <div>
                <div className="text-xs font-medium mb-1">Nominal DP</div>
                <input
                  type="number"
                  min={0}
                  max={total}
                  value={dpAmount}
                  onChange={(e) => setDpAmount(Number(e.target.value) || 0)}
                  className="input px-3 py-2 w-full"
                  placeholder="Masukkan nominal DP"
                />
                <div className="text-xs mt-1">
                  Dibayar sekarang: <b>{toIDR(payableNow)}</b>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div role="alert" aria-live="polite" className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <button
              disabled={loading || !canSubmit}
              className="btn-primary disabled:opacity-60"
              onClick={() => void onSubmit()}
            >
              {loading ? 'Menyimpan…' : 'Simpan & Cetak'}
            </button>
            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                dlog('cancel/back clicked');
                history.back();
              }}
            >
              Batal
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ------------------------
   Subcomponents (UI)
------------------------ */

function UploadBox({
  title,
  isMobile,
  inputRef,
  files,
  onFiles,
}: {
  title: string;
  isMobile: boolean;
  inputRef:
    | React.RefObject<HTMLInputElement>
    | React.MutableRefObject<HTMLInputElement | null>;
  files: File[];
  onFiles: (f: File[]) => void;
}) {
  return (
    <div className="border border-[color:var(--color-border)] rounded-lg p-3">
      <div className="text-xs font-medium mb-2">{title}</div>
      <div
        className="border border-dashed border-[color:var(--color-border)] rounded-lg p-4 text-center text-xs bg-white/70"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const dropped = Array.from(e.dataTransfer.files || []);
          onFiles(dropped);
        }}
      >
        {isMobile ? (
          <button type="button" className="btn-outline" onClick={() => inputRef.current?.click()}>
            Buka Kamera
          </button>
        ) : (
          <>
            <div className="mb-2 text-gray-600">Drop file ke sini atau</div>
            <button type="button" className="btn-outline" onClick={() => inputRef.current?.click()}>
              Pilih File
            </button>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture={isMobile ? 'environment' : undefined}
        multiple
        className="hidden"
        onChange={(e) => {
          const list = e.target.files ? Array.from(e.target.files) : [];
          onFiles(list);
        }}
      />
      {files.length > 0 && (
        <ul className="mt-2 text-xs list-disc pl-5">
          {files.map((f, i) => (
            <li key={i}>{f.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MobileCartBar({
  open,
  setOpen,
  itemsCount,
  total,
  children,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  itemsCount: number;
  total: number;
  children: React.ReactNode;
}) {
  return (
    <>
      {/* sticky bottom bar on mobile */}
      <div className="md:hidden fixed inset-x-0 bottom-0 z-30">
        <div className="mx-auto max-w-[1200px] px-3 pb-[env(safe-area-inset-bottom)]">
          <div className="rounded-t-xl border border-[color:var(--color-border)] bg-[var(--color-surface)] shadow-elev-2 p-3">
            <div className="flex items-center justify-between">
              <div className="text-xs">
                <div className="font-medium">{itemsCount} item</div>
                <div className="text-gray-600">Total {toIDR(total)}</div>
              </div>
              <button className="btn-primary" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="mobile-cart-sheet">
                Buka Keranjang
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* bottom sheet */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-cart-title"
          onClick={() => setOpen(false)}
        >
          <div
            id="mobile-cart-sheet"
            className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-[var(--color-surface)] shadow-elev-2 border border-[color:var(--color-border)] p-3 max-h-[80dvh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[color:var(--color-border)]">
              <div id="mobile-cart-title" className="text-sm font-semibold">
                Keranjang
              </div>
              <button className="btn-outline px-2 py-1" onClick={() => setOpen(false)}>
                Tutup
              </button>
            </div>
            <div className="pt-2">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}

```
</details>

### src/pages/receivables/ReceivablesIndex.tsx

- SHA: `b4c99f795109`  
- Ukuran: 8 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Receivable, ReceivableQuery, ReceivableStatus } from "../../types/receivables";
import { listReceivables } from "../../api/receivables";
import DataTable from "../../components/DataTable"; // perbaikan path
import { toIDR } from "../../utils/money";
import SettleReceivableDialog from "../../components/receivables/SettleReceivableDialog";

type Meta = { current_page: number; per_page: number; total: number; last_page: number };

const STATUS: Array<ReceivableStatus | ""> = ["", "OPEN", "PARTIAL", "OVERDUE", "SETTLED"];

export default function ReceivablesIndex() {
    const [rows, setRows] = useState<Receivable[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    const [q, setQ] = useState<string>("");
    const [status, setStatus] = useState<ReceivableStatus | "">("");
    const [dueBefore, setDueBefore] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(15);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selected, setSelected] = useState<Receivable | null>(null);

    const params: ReceivableQuery = useMemo(
        () => ({ q, status, due_before: dueBefore || undefined, page, per_page: perPage }),
        [q, status, dueBefore, page, perPage]
    );

    const load = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await listReceivables(params);
            // API dinormalisasi: res.data = Receivable[] ; res.meta = Pagination meta
            setRows(res.data ?? []);
            setMeta((res.meta as Meta) ?? null);
        } catch {
            setError("Gagal memuat data piutang.");
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        load();
    }, [load]);

    const columns = [
        { key: "invoice_no", header: "Invoice", render: (r: Receivable) => r.order?.invoice_no ?? "-" },
        { key: "customer", header: "Customer", render: (r: Receivable) => r.order?.customer?.name ?? "-" },
        {
            key: "due_date",
            header: "Jatuh Tempo",
            render: (r: Receivable) => {
                const txt = r.due_date ? new Date(r.due_date).toLocaleDateString("id-ID") : "-";
                const danger = r.status === "OVERDUE";
                return <span className={danger ? "text-red-600 font-semibold" : ""}>{txt}</span>;
            },
        },
        { key: "grand_total", header: "Total", render: (r: Receivable) => toIDR(r.order?.grand_total ?? 0) },
        { key: "paid_amount", header: "Terbayar", render: (r: Receivable) => toIDR(r.order?.paid_amount ?? 0) },
        {
            key: "remaining",
            header: "Sisa",
            render: (r: Receivable) => (
                <span className="rounded-md bg-amber-100 px-2 py-0.5 font-semibold">{toIDR(r.remaining_amount)}</span>
            ),
        },
        { key: "status", header: "Status", render: (r: Receivable) => r.status },
        {
            key: "actions",
            header: "",
            render: (r: Receivable) =>
                r.remaining_amount > 0 ? (
                    <button
                        className="rounded-xl bg-black px-3 py-1 text-sm text-white"
                        onClick={() => {
                            setSelected(r);
                            setDialogOpen(true);
                        }}
                    >
                        Pelunasan
                    </button>
                ) : null,
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-end gap-2">
                <div className="flex-1 min-w-[220px]">
                    <label className="block text-sm">Cari (Invoice/Customer)</label>
                    <input
                        value={q}
                        onChange={(e) => {
                            setPage(1);
                            setQ(e.target.value);
                        }}
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                        placeholder="cth: SLV-202510-000012 atau nama pelanggan"
                    />
                </div>

                <div>
                    <label className="block text-sm">Status</label>
                    <select
                        value={status}
                        onChange={(e) => {
                            setPage(1);
                            setStatus(e.target.value as ReceivableStatus | "");
                        }}
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                    >
                        {STATUS.map((s) => (
                            <option key={s || "ALL"} value={s}>
                                {s || "ALL"}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm">Jatuh Tempo ≤</label>
                    <input
                        type="date"
                        value={dueBefore}
                        onChange={(e) => {
                            setPage(1);
                            setDueBefore(e.target.value);
                        }}
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm">Per halaman</label>
                    <select
                        value={perPage}
                        onChange={(e) => {
                            setPage(1);
                            setPerPage(Number(e.target.value));
                        }}
                        className="mt-1 w-full rounded-lg border px-3 py-2"
                    >
                        {[10, 15, 25, 50].map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {error ? <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
            <DataTable rows={rows} columns={columns} loading={loading} />

            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    {meta ? `Hal ${meta.current_page}/${meta.last_page} — ${meta.total} data` : null}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        disabled={!meta || page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="rounded-xl border px-3 py-1 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <button
                        disabled={!meta || (meta && page >= meta.last_page)}
                        onClick={() => setPage((p) => (meta ? Math.min(meta.last_page, p + 1) : p))}
                        className="rounded-xl border px-3 py-1 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>

            <SettleReceivableDialog
                open={dialogOpen}
                receivable={selected}
                onClose={() => setDialogOpen(false)}
                onSettled={() => load()}
            />
        </div>
    );
}

```
</details>

### src/pages/services/CategoryIndex.tsx

- SHA: `0a8f9b35fe18`  
- Ukuran: 6 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/services/CategoryIndex.tsx
import { useEffect, useState, useCallback } from 'react';
import DataTable from '../../components/DataTable';
import type { ServiceCategory, PaginationMeta } from '../../types/services';
import {
  listServiceCategories,
  createServiceCategory,
  updateServiceCategory,
  deleteServiceCategory,
} from '../../api/serviceCategories';

export default function CategoryIndex() {
  const [rows, setRows] = useState<ServiceCategory[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const perPage = 10;

  const refresh = useCallback(
    async (p = 1) => {
      setLoading(true);
      setError(null);
      try {
        const res = await listServiceCategories({ q, page: p, per_page: perPage });
        setRows(res.data ?? []);
        setMeta((res.meta as PaginationMeta) ?? null);
      } catch {
        setError('Gagal memuat kategori');
      } finally {
        setLoading(false);
      }
    },
    [q, perPage],
  );

  useEffect(() => { void refresh(page); }, [page, refresh]);
  useEffect(() => {
    const t = setTimeout(() => { void refresh(1); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [q, refresh]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Service Categories</h1>
          <p className="text-xs text-gray-600">Kelola kategori untuk mengelompokkan layanan.</p>
        </div>
        <button
          className="btn-primary"
          onClick={async () => {
            const name = prompt('Nama kategori:')?.trim();
            if (!name) return;
            try {
              await createServiceCategory({ name, is_active: true });
              await refresh(page);
            } catch {
              alert('Gagal membuat kategori');
            }
          }}
          aria-label="Tambah kategori layanan"
        >
          + New Category
        </button>
      </header>

      {/* Toolbar */}
      <section
        className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1"
        aria-label="Toolbar filter kategori"
      >
        <div className="p-3">
          <div className="relative max-w-xl">
            <label htmlFor="search-cat" className="sr-only">Cari kategori</label>
            <input
              id="search-cat"
              className="input w-full pl-9 py-2"
              placeholder="Cari nama…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Cari nama kategori"
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2"
        >
          {error}
        </div>
      )}

      {/* Table */}
      <div aria-busy={loading ? 'true' : 'false'}>
        <DataTable<ServiceCategory>
          columns={[
            { key: 'name', header: 'Nama' },
            {
              key: 'is_active',
              header: 'Status',
              render: (r) =>
                r.is_active ? (
                  <span className="chip chip--solid">Active</span>
                ) : (
                  <span className="chip chip--danger">Inactive</span>
                ),
            },
            {
              key: 'actions',
              header: 'Aksi',
              render: (r) => (
                <div className="flex gap-2 justify-end">
                  <button
                    className="btn-outline text-xs px-3 py-1"
                    onClick={async () => {
                      const name = prompt('Ubah nama kategori:', r.name)?.trim();
                      if (!name) return;
                      try {
                        await updateServiceCategory(r.id, { name });
                        await refresh(page);
                      } catch {
                        alert('Gagal update');
                      }
                    }}
                    aria-label={`Ubah kategori ${r.name}`}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-outline text-xs px-3 py-1 text-red-600"
                    onClick={async () => {
                      if (!confirm(`Hapus kategori ${r.name}?`)) return;
                      try {
                        await deleteServiceCategory(r.id);
                        await refresh(page);
                      } catch {
                        alert('Gagal hapus');
                      }
                    }}
                    aria-label={`Hapus kategori ${r.name}`}
                  >
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
          rows={rows}
          loading={loading}
          emptyText="Belum ada kategori"
        />
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-2 justify-end">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="btn-outline disabled:opacity-50"
        >
          Prev
        </button>
        <div className="text-sm">
          Hal {meta?.current_page ?? page} / {meta?.last_page ?? 1}
        </div>
        <button
          disabled={!!meta && page >= (meta.last_page ?? 1)}
          onClick={() => setPage((p) => p + 1)}
          className="btn-outline disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

```
</details>

### src/pages/services/PricePerBranchInput.tsx

- SHA: `1eb89a6ea0c1`  
- Ukuran: 11 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/services/PricePerBranchInput.tsx
import { useEffect, useRef, useState } from 'react';
import type { Branch } from '../../types/branches';
import type { ServicePrice, ServicePriceSetPayload } from '../../types/services';
import { listBranches } from '../../api/branches';
import { listServicePricesByService, setServicePrice } from '../../api/servicePrices';

interface Props {
  serviceId: string;
  defaultPrice: number;
}
type Row = Branch & { override?: ServicePrice | null; effective: number };

function toStr(x: unknown) {
  return x == null ? '' : String(x);
}
function toNum(x: unknown, fallback = 0) {
  const n = Number(x);
  return Number.isFinite(n) ? n : fallback;
}
function toIDR(n: number) {
  return n.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
}

export default function PricePerBranchInput({ serviceId, defaultPrice }: Props) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      setNotice(null);

      console.groupCollapsed('[PricePerBranchInput] LOAD');
      console.log('serviceId:', serviceId);
      console.log('defaultPrice:', defaultPrice);

      try {
        const branchesRes = await listBranches({ per_page: 100 });
        const branchesRaw: unknown = (branchesRes)?.data ?? branchesRes;
        const branches: Branch[] = Array.isArray(branchesRaw) ? branchesRaw : [];
        console.log('branches (raw):', branchesRes);
        console.log('branches (parsed):', branches);

        const overridesRes = await listServicePricesByService(serviceId);
        const overridesData: unknown = (overridesRes)?.data ?? overridesRes;
        const overrides: ServicePrice[] = Array.isArray(overridesData) ? overridesData : [];
        console.log('overrides (raw):', overridesRes);
        console.log('overrides (parsed):', overrides);

        const map = new Map<string, ServicePrice>(
          overrides.map((p) => [toStr(p.branch_id), p])
        );

        const merged: Row[] = branches.map((b) => {
          const key = toStr(b.id);
          const ov = map.get(key) ?? null;
          const eff = ov ? toNum(ov.price, Number(defaultPrice)) : Number(defaultPrice);
          return { ...b, override: ov, effective: eff };
        });

        console.log('merged rows:', merged);
        setRows(merged);
      } catch (e) {
        console.error('LOAD error:', e);
        setError('Gagal memuat harga per cabang.');
      } finally {
        console.groupEnd();
        setLoading(false);
      }
    })();
  }, [serviceId, defaultPrice]);

  async function onSaveOne(branch_id_raw: string | number, price_raw: number) {
    const branch_id = toStr(branch_id_raw);
    const price = toNum(price_raw);

    if (!Number.isFinite(price) || price <= 0) {
      setNotice(null);
      setError('Harga tidak valid.');
      return;
    }

    const payload: ServicePriceSetPayload = { service_id: serviceId, branch_id, price };

    console.groupCollapsed('[PricePerBranchInput] SAVE ONE');
    console.log('payload:', payload);

    try {
      setSaving(branch_id);
      setError(null);
      setNotice(null);

      const res = await setServicePrice(payload);
      console.log('response (raw):', res);
      const updated: ServicePrice = (res && (res).data ? (res).data : res) as ServicePrice;
      console.log('response (parsed row):', updated);

      if (!updated || !updated.id) {
        console.warn('No updated row returned, skip UI update.');
      } else {
        setRows((prev) =>
          prev.map((r) =>
            toStr(r.id) === branch_id
              ? {
                  ...r,
                  override: updated,
                  effective: toNum(updated.price, r.effective),
                }
              : r
          )
        );

        const ref = inputRefs.current[branch_id];
        if (ref) ref.value = toStr(updated.price);
      }

      setNotice('Harga cabang diperbarui.');
    } catch (e) {
      console.error('SAVE error:', e);
      setError('Gagal menyimpan harga cabang.');
    } finally {
      setSaving(null);
      console.groupEnd();
    }
  }

  /* ---------------- UI ---------------- */

  if (loading) {
    return (
      <div className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1 p-4">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="h-4 w-4 rounded-full bg-black/10 animate-pulse" />
          Memuat harga cabang…
        </div>
      </div>
    );
  }
  if (error && !rows.length) {
    return (
      <div
        role="alert"
        aria-live="polite"
        className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2"
      >
        {error}
      </div>
    );
  }
  if (!rows.length) {
    return <div className="text-sm text-gray-500">Belum ada cabang.</div>;
  }

  return (
    <section className="card overflow-hidden border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[color:var(--color-border)]">
        <div>
          <h2 className="text-sm font-semibold">Harga Per Cabang</h2>
          <p className="text-xs text-gray-600">
            Default harga layanan: <span className="font-medium">{toIDR(Number(defaultPrice))}</span>
          </p>
        </div>
      </div>

      {/* Alerts */}
      {notice && (
        <div
          role="status"
          aria-live="polite"
          className="mx-4 mt-3 rounded-md border border-[color:var(--color-border)] bg-[#E6EDFF] text-[color:var(--color-text-default)] text-sm px-3 py-2"
        >
          {notice}
        </div>
      )}
      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="mx-4 mt-3 rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2"
        >
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-auto mt-3">
        <table className="min-w-[720px] w-full text-sm">
          <thead className="bg-[#E6EDFF] sticky top-0 z-10">
            <tr className="divide-x divide-[color:var(--color-border)]">
              <Th>Cabang</Th>
              <Th>Harga Efektif</Th>
              <Th>Override</Th>
              <Th className="text-right pr-4">Aksi</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--color-border)]">
            {rows.map((r) => {
              const key = toStr(r.id);
              const isSaving = saving === key;
              return (
                <tr key={key} className="hover:bg-black/5 transition-colors">
                  <Td>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{r.code}</span>
                      <span className="text-gray-500">— {r.name}</span>
                    </div>
                  </Td>
                  <Td>
                    <span className="font-medium">{toIDR(r.effective)}</span>
                  </Td>
                  <Td>
                    <input
                      type="number"
                      min={0}
                      step="100"
                      className="input w-40 text-right"
                      defaultValue={r.override?.price ?? ''}
                      placeholder={`Default ${toIDR(Number(defaultPrice))}`}
                      ref={(el) => { inputRefs.current[key] = el; }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const raw = inputRefs.current[key]?.value;
                          const val = toNum(raw, NaN);
                          if (!Number.isFinite(val) || val <= 0) {
                            setError('Harga tidak valid.');
                            setNotice(null);
                            return;
                          }
                          void onSaveOne(key, val);
                        }
                      }}
                      aria-label={`Harga override untuk cabang ${r.name}`}
                    />
                  </Td>
                  <Td className="text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        className="btn-primary disabled:opacity-50"
                        disabled={isSaving}
                        onClick={() => {
                          const raw = inputRefs.current[key]?.value;
                          const val = toNum(raw, NaN);
                          if (!Number.isFinite(val) || val <= 0) {
                            setError('Harga tidak valid.');
                            setNotice(null);
                            return;
                          }
                          void onSaveOne(key, val);
                        }}
                        aria-label={`Simpan harga cabang ${r.name}`}
                      >
                        {isSaving ? 'Menyimpan…' : 'Simpan'}
                      </button>

                      <button
                        className="btn-outline"
                        onClick={() => {
                          // reset field ke kosong -> berarti pakai default saat berikutnya dihitung server
                          const ref = inputRefs.current[key];
                          if (ref) ref.value = '';
                          setRows((prev) =>
                            prev.map((x) =>
                              toStr(x.id) === key
                                ? { ...x, override: null, effective: Number(defaultPrice) }
                                : x
                            )
                          );
                          setNotice('Override dihapus (kembali ke default). Belum tersimpan ke server.');
                        }}
                        aria-label={`Kosongkan override cabang ${r.name}`}
                      >
                        Reset Field
                      </button>
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 border-t border-[color:var(--color-border)] text-xs text-gray-500">
        Tip: Tekan <kbd className="px-1 py-0.5 border rounded">Enter</kbd> pada kolom harga untuk menyimpan cepat.
      </div>
    </section>
  );
}

/* ---------- Subcomponents UI ---------- */
function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`text-left px-3 py-2 text-xs font-medium uppercase tracking-wide ${className}`}>
      {children}
    </th>
  );
}
function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2 ${className}`}>{children}</td>;
}

```
</details>

### src/pages/services/ServiceForm.tsx

- SHA: `e77813d6f06e`  
- Ukuran: 9 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/customers/ServiceForm.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Service, ServiceUpsertPayload, ServiceCategory } from '../../types/services';
import { createService, getService, updateService } from '../../api/services';
import { listServiceCategories } from '../../api/serviceCategories';
import PricePerBranchInput from './PricePerBranchInput';

export default function ServiceForm() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const editing = Boolean(id);

  const [cats, setCats] = useState<ServiceCategory[]>([]);
  const [form, setForm] = useState<ServiceUpsertPayload>({
    category_id: '',
    name: '',
    unit: 'ITEM',
    price_default: 0,
    is_active: true,
  });
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const sc = await listServiceCategories({ per_page: 100 });
        setCats(sc.data ?? []);
        if (editing) {
          const res = await getService(id!);
          const s = res.data as Service;
          setService(s);
          setForm({
            category_id: s.category_id,
            name: s.name,
            unit: s.unit,
            price_default: Number(s.price_default),
            is_active: s.is_active,
          });
        }
      } catch {
        setError('Gagal memuat data');
      } finally {
        setLoading(false);
      }
    })();
  }, [editing, id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    if (!form.category_id || !form.name.trim() || !form.unit.trim() || Number(form.price_default) <= 0) {
      setLoading(false);
      setError('Kategori, Nama, Unit, dan Harga Default wajib diisi');
      return;
    }

    try {
      if (editing) await updateService(id!, form);
      else await createService(form);
      alert('Tersimpan');
      nav('/services', { replace: true });
    } catch (err: unknown) {
      const withResp = err as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } };
      const fe = withResp.response?.data?.errors ?? {};
      if (fe && typeof fe === 'object') setFieldErrors(fe);
      setError(withResp.response?.data?.message ?? 'Gagal menyimpan');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-lg font-semibold tracking-tight">
          {editing ? 'Edit Service' : 'New Service'}
        </h1>
        <p className="text-xs text-gray-600">Definisikan layanan, unit, dan harga default.</p>
      </header>

      {/* Alert error global */}
      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2"
        >
          {error}
        </div>
      )}

      {/* Form utama */}
      <form
        className="card max-w-xl border border-[color:var(--color-border)] rounded-lg shadow-elev-1 p-4 space-y-4"
        onSubmit={onSubmit}
        aria-busy={loading ? 'true' : 'false'}
      >
        {/* Kategori */}
        <div className="grid gap-1">
          <label htmlFor="category_id" className="text-sm font-medium">
            Kategori <span className="text-red-600">*</span>
          </label>
          <select
            id="category_id"
            className="input"
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            disabled={loading}
            aria-invalid={Boolean(fieldErrors.category_id)}
            aria-describedby={fieldErrors.category_id ? 'err-category_id' : undefined}
          >
            <option value="">Pilih kategori</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {fieldErrors.category_id && (
            <p id="err-category_id" className="text-xs text-red-600">
              {fieldErrors.category_id.join(', ')}
            </p>
          )}
        </div>

        {/* Nama */}
        <div className="grid gap-1">
          <label htmlFor="name" className="text-sm font-medium">
            Nama <span className="text-red-600">*</span>
          </label>
          <input
            id="name"
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            disabled={loading}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? 'err-name' : undefined}
            placeholder="Contoh: Cuci Sepatu Premium"
          />
          {fieldErrors.name && (
            <p id="err-name" className="text-xs text-red-600">
              {fieldErrors.name.join(', ')}
            </p>
          )}
        </div>

        {/* Unit */}
        <div className="grid gap-1">
          <label htmlFor="unit" className="text-sm font-medium">
            Unit <span className="text-red-600">*</span>
          </label>
          <input
            id="unit"
            className="input"
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value.toUpperCase() })}
            disabled={loading}
            aria-invalid={Boolean(fieldErrors.unit)}
            aria-describedby={fieldErrors.unit ? 'err-unit' : undefined}
            placeholder="ITEM / PASANG / KG"
          />
          {fieldErrors.unit && (
            <p id="err-unit" className="text-xs text-red-600">
              {fieldErrors.unit.join(', ')}
            </p>
          )}
        </div>

        {/* Harga Default */}
        <div className="grid gap-1">
          <label htmlFor="price_default" className="text-sm font-medium">
            Harga Default <span className="text-red-600">*</span>
          </label>
          <input
            id="price_default"
            type="number"
            min={0}
            step="100"
            className="input"
            value={form.price_default}
            onChange={(e) => setForm({ ...form, price_default: Number(e.target.value) })}
            disabled={loading}
            aria-invalid={Boolean(fieldErrors.price_default)}
            aria-describedby={fieldErrors.price_default ? 'err-price_default' : 'hint-price_default'}
            placeholder="Contoh: 25000"
          />
          {!fieldErrors.price_default && (
            <p id="hint-price_default" className="text-xs text-gray-500">
              Gunakan kelipatan 100 untuk memudahkan kasir.
            </p>
          )}
          {fieldErrors.price_default && (
            <p id="err-price_default" className="text-xs text-red-600">
              {fieldErrors.price_default.join(', ')}
            </p>
          )}
        </div>

        {/* Active */}
        <div className="flex items-center gap-2">
          <input
            id="is_active"
            type="checkbox"
            checked={!!form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            disabled={loading}
          />
          <label htmlFor="is_active" className="text-sm">
            Active
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            disabled={loading}
            className="btn-primary disabled:opacity-60"
            aria-label="Simpan layanan"
          >
            {loading ? 'Menyimpan…' : 'Simpan'}
          </button>
          <button
            type="button"
            className="btn-outline"
            onClick={() => nav(-1)}
            aria-label="Batalkan dan kembali"
          >
            Batal
          </button>
        </div>
      </form>

      {/* Harga per cabang (override) — tampil saat edit */}
      {editing && service && (
        <section className="card max-w-3xl border border-[color:var(--color-border)] rounded-lg shadow-elev-1 p-4 space-y-2">
          <h2 className="text-sm font-semibold">Harga per Cabang</h2>
          <p className="text-xs text-gray-500">
            Harga efektif = override <code>service_prices</code> per cabang, jika tidak ada akan memakai{' '}
            <code>price_default</code>.
          </p>
          <PricePerBranchInput serviceId={service.id} defaultPrice={Number(form.price_default)} />
        </section>
      )}
    </div>
  );
}

```
</details>

### src/pages/services/ServiceIndex.tsx

- SHA: `00584f89c425`  
- Ukuran: 8 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/services/ServiceIndex.tsx
import { useEffect, useState, useCallback } from 'react';
import DataTable from '../../components/DataTable';
import type { Service, PaginationMeta, ServiceCategory } from '../../types/services';
import { listServices, deleteService } from '../../api/services';
import { listServiceCategories } from '../../api/serviceCategories';
import { useNavigate, Link } from 'react-router-dom';
import { toIDR } from '../../utils/money';

export default function ServiceIndex() {
  const nav = useNavigate();
  const [rows, setRows] = useState<Service[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [cats, setCats] = useState<ServiceCategory[]>([]);
  const [q, setQ] = useState('');
  const [category_id, setCategoryId] = useState<string>('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const perPage = 10;

  const loadCats = useCallback(async () => {
    try {
      const sc = await listServiceCategories({ per_page: 100 });
      setCats(sc.data ?? []);
    } catch {
      // optional: tampilkan toast/log, tapi jangan hentikan flow services
    }
  }, []);

  const refresh = useCallback(
    async (p = 1) => {
      setLoading(true);
      setError(null);
      try {
        const res = await listServices({
          q,
          category_id: category_id || undefined,
          page: p,
          per_page: perPage,
        });
        setRows(res.data ?? []);
        setMeta((res.meta as PaginationMeta) ?? null);
      } catch {
        setError('Gagal memuat layanan');
      } finally {
        setLoading(false);
      }
    },
    [q, category_id, perPage],
  );

  useEffect(() => {
    if (!cats.length) void loadCats();
  }, [cats.length, loadCats]);

  useEffect(() => {
    void refresh(page);
  }, [page, refresh]);

  useEffect(() => {
    const t = setTimeout(() => {
      void refresh(1);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [q, category_id, refresh]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Services</h1>
          <p className="text-xs text-gray-600">Kelola layanan & harga per cabang.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/service-categories" className="btn-outline" aria-label="Kelola kategori">
            Categories
          </Link>
          <button className="btn-primary" onClick={() => nav('/services/new')} aria-label="Tambah layanan baru">
            New Service
          </button>
        </div>
      </header>

      {/* FilterBar */}
      <section
        className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1"
        aria-label="Filter layanan"
      >
        <div className="p-3 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="relative">
              <label htmlFor="q" className="sr-only">
                Pencarian layanan
              </label>
              <input
                id="q"
                className="input w-full pl-9 py-2"
                placeholder="Cari nama layanan…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Cari layanan"
              />
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
            </div>

            <div>
              <label htmlFor="cat" className="sr-only">
                Filter kategori
              </label>
              <select
                id="cat"
                className="input w-full py-2"
                value={category_id}
                onChange={(e) => setCategoryId(e.target.value)}
                aria-label="Pilih kategori layanan"
              >
                <option value="">Semua kategori</option>
                {cats.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                setQ('');
                setCategoryId('');
              }}
              aria-label="Reset filter"
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2"
        >
          {error}
        </div>
      )}

      {/* DataTable dalam card */}
      <section aria-busy={loading ? 'true' : 'false'}>
        <div className="card overflow-hidden border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
          <div className="overflow-auto">
            <DataTable<Service>
              columns={[
                { key: 'name', header: 'Nama' },
                { key: 'category', header: 'Kategori', render: (s) => s.category?.name ?? '-' },
                { key: 'unit', header: 'Unit' },
                {
                  key: 'price_default',
                  header: 'Harga Default',
                  render: (s) => toIDR(Number(s.price_default)),
                },
                {
                  key: 'is_active',
                  header: 'Status',
                  render: (s) => (
                    <span
                      className={`chip ${
                        s.is_active ? 'chip--solid' : 'chip--subtle'
                      }`}
                      aria-label={s.is_active ? 'Aktif' : 'Nonaktif'}
                    >
                      {s.is_active ? 'Active' : 'Inactive'}
                    </span>
                  ),
                },
                {
                  key: 'actions',
                  header: 'Aksi',
                  render: (s) => (
                    <div className="flex justify-end gap-2">
                      <button
                        className="btn-outline"
                        onClick={() => nav(`/services/${s.id}/edit`)}
                        aria-label={`Edit layanan ${s.name}`}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-outline text-red-600"
                        onClick={async () => {
                          if (!confirm(`Hapus layanan ${s.name}?`)) return;
                          try {
                            await deleteService(s.id);
                            await refresh(page);
                          } catch {
                            alert('Gagal hapus');
                          }
                        }}
                        aria-label={`Hapus layanan ${s.name}`}
                      >
                        Delete
                      </button>
                    </div>
                  ),
                },
              ]}
              rows={rows}
              loading={loading}
              emptyText="Belum ada layanan"
            />
          </div>
        </div>
      </section>

      {/* Pagination */}
      <div className="flex items-center gap-2 justify-end">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="btn-outline disabled:opacity-50"
        >
          Prev
        </button>
        <div className="text-sm">
          Hal {meta?.current_page ?? page} / {meta?.last_page ?? 1}
        </div>
        <button
          disabled={!!meta && page >= (meta.last_page ?? 1)}
          onClick={() => setPage((p) => p + 1)}
          className="btn-outline disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

```
</details>

### src/pages/users/UserForm.tsx

- SHA: `e2fc73fe263b`  
- Ukuran: 15 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
import { useEffect, useMemo, useState } from 'react';
import { createUser, getUser, updateUser, setUserRoles, resetUserPassword } from '../../api/users';
import type { UserUpsertPayload } from '../../types/users';
import type { RoleName } from '../../api/client';
import { useNavigate, useParams } from 'react-router-dom';
import { listBranches } from '../../api/branches';
import type { Branch } from '../../types/branches';
import { useAuth, useHasRole } from '../../store/useAuth';
import { isAxiosError } from 'axios';

const ALL_ROLES: RoleName[] = ['Superadmin', 'Admin Cabang', 'Kasir', 'Petugas Cuci', 'Kurir'];
function allowedRoles(isSuperadmin: boolean): RoleName[] {
    return isSuperadmin ? ALL_ROLES : (ALL_ROLES.filter(r => r !== 'Superadmin') as RoleName[]);
}

type ApiErrBody = { message?: string; errors?: Record<string, string[]> };
function getHttpStatus(err: unknown): number | null {
    return isAxiosError<ApiErrBody>(err) ? (err.response?.status ?? null) : null;
}
function getFieldErrors(err: unknown): Record<string, string[]> {
    return isAxiosError<ApiErrBody>(err) && err.response?.data?.errors
        ? err.response.data.errors
        : {};
}
function getMessage(err: unknown, fallback = 'Terjadi kesalahan'): string {
    return isAxiosError<ApiErrBody>(err) && err.response?.data?.message
        ? err.response.data.message
        : fallback;
}

export default function UserForm() {
    const { id } = useParams<{ id: string }>();
    const editing = Boolean(id);
    const nav = useNavigate();

    const me = useAuth.user;
    const isSuperadmin = useHasRole('Superadmin');
    const isAdminCabang = useHasRole('Admin Cabang');
    const canManage = useHasRole(['Superadmin', 'Admin Cabang']);

    const [branches, setBranches] = useState<Branch[]>([]);
    const [form, setForm] = useState<UserUpsertPayload>({
        name: '',
        email: '',
        branch_id: isSuperadmin ? null : (me?.branch_id ? String(me.branch_id) : '' as unknown as null),
        is_active: true,
        roles: [],
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

    // debug awal
    console.log('[UserForm] mount:', { editing, id, me, isSuperadmin, isAdminCabang, canManage });

    const v = useMemo(() => ({
        name: form.name ?? '',
        email: form.email ?? '',
        password: form.password ?? '',
        branch_id: form.branch_id === null ? '' : (form.branch_id ?? ''),
        is_active: !!form.is_active,
        roles: Array.isArray(form.roles) ? form.roles : [],
    }), [form]);

    useEffect(() => {
        (async () => {
            console.log('[UserForm] useEffect triggered', { editing, id });

            try {
                const br = await listBranches({ per_page: 100 });
                console.log('[UserForm] fetched branches:', br.data);
                setBranches(br.data ?? []);
            } catch (err) {
                console.warn('[UserForm] gagal load branches:', err);
            }

            if (editing) {
                setLoading(true);
                try {
                    const res = await getUser(id!);
                    const u = res.data;
                    console.log('[UserForm] fetched user for edit:', u);

                    setForm({
                        name: u?.name ?? '',
                        email: u?.email ?? '',
                        branch_id: (u?.branch_id ?? null),
                        is_active: typeof u?.is_active === 'boolean' ? u.is_active : true,
                        roles: Array.isArray(u?.roles) ? (u.roles as RoleName[]) : [],
                        password: '',
                    });
                } catch (err: unknown) {
                    console.error('[UserForm] gagal load user:', err);
                    const status = getHttpStatus(err);
                    if (status === 403) {
                        setError('Anda tidak berhak melihat user ini (beda cabang).');
                    } else if (status === 404) {
                        setError('User tidak ditemukan.');
                    } else {
                        setError(getMessage(err, 'Gagal memuat user'));
                    }
                } finally {
                    setLoading(false);
                }
            } else {
                if (!isSuperadmin && me?.branch_id) {
                    console.log('[UserForm] new user mode, auto-assign branch_id:', me.branch_id);
                    setForm((f) => ({ ...f, branch_id: String(me.branch_id) }));
                }
            }
        })();
    }, [editing, id, isSuperadmin, me?.branch_id]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!canManage) {
            console.warn('[UserForm] submit blocked, user tidak punya akses');
            return;
        }

        console.log('[UserForm] submitting...', { editing, v });

        setSaving(true);
        setError(null);
        setFieldErrors({});

        try {
            if (editing) {
                const payload: Partial<UserUpsertPayload> = {
                    name: v.name,
                    email: v.email,
                    branch_id: isSuperadmin ? (v.branch_id || null) : (me?.branch_id ? String(me.branch_id) : null),
                    is_active: v.is_active,
                };
                console.log('[UserForm] updateUser payload:', payload);
                await updateUser(id!, payload);

                if (!editing && v.roles.length === 0) {
                    console.warn('[UserForm] role kosong saat update');
                    setFieldErrors({ roles: ['Pilih minimal satu role'] });
                    return;
                }

                try {
                    console.log('[UserForm] setUserRoles', v.roles);
                    await setUserRoles(id!, v.roles ?? []);
                } catch (err: unknown) {
                    console.error('[UserForm] gagal setUserRoles:', err);
                    if (getHttpStatus(err) === 403) {
                        alert('Perubahan roles ditolak (kewenangan/cabang tidak sesuai). Data lain tetap tersimpan.');
                    } else throw err;
                }
            } else {
                if (v.roles.length === 0) {
                    console.warn('[UserForm] role kosong saat create');
                    setFieldErrors({ roles: ['Pilih minimal satu role'] });
                    setSaving(false);
                    return;
                }

                const primaryRole = v.roles[0] as RoleName;
                const payload: UserUpsertPayload = {
                    name: v.name,
                    email: v.email,
                    password: v.password,
                    branch_id: isSuperadmin ? (v.branch_id || null) : (me?.branch_id ? String(me.branch_id) : null),
                    is_active: v.is_active,
                    role: primaryRole,
                };
                console.log('[UserForm] createUser payload:', payload);

                const created = await createUser(payload);
                const newUserId = String(created.data.id);
                console.log('[UserForm] created user:', created.data);

                try {
                    console.log('[UserForm] setUserRoles (after create):', v.roles);
                    await setUserRoles(newUserId, v.roles);
                } catch (err: unknown) {
                    console.error('[UserForm] gagal setUserRoles setelah create:', err);
                    if (getHttpStatus(err) === 403) {
                        alert('User berhasil dibuat, tetapi perubahan roles sebagian ditolak (kewenangan/cabang).');
                    } else throw err;
                }
            }

            alert('Tersimpan');
            console.log('[UserForm] selesai simpan, redirect ke /users');
            nav('/users', { replace: true });
        } catch (err: unknown) {
            console.error('[UserForm] error saat submit:', err);
            setFieldErrors(getFieldErrors(err));
            setError(getMessage(err, 'Gagal menyimpan'));
        } finally {
            console.log('[UserForm] submit selesai');
            setSaving(false);
        }
    }

    return (
        <form className="max-w-xl space-y-3" onSubmit={onSubmit}>
            <h1 className="text-lg font-semibold">{editing ? 'Edit User' : 'New User'}</h1>
            {loading && <div className="text-sm text-gray-500">Memuat…</div>}
            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="grid gap-1">
                <label className="text-xs">Nama *</label>
                <input
                    className="border rounded px-3 py-2"
                    value={v.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />
                {fieldErrors.name && <p className="text-xs text-red-600">{fieldErrors.name.join(', ')}</p>}
            </div>

            <div className="grid gap-1">
                <label className="text-xs">Email *</label>
                <input
                    type="email"
                    className="border rounded px-3 py-2"
                    value={v.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                />
                {fieldErrors.email && <p className="text-xs text-red-600">{fieldErrors.email.join(', ')}</p>}
            </div>

            {!editing && (
                <div className="grid gap-1">
                    <label className="text-xs">Password *</label>
                    <input
                        type="password"
                        className="border rounded px-3 py-2"
                        value={v.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                    />
                    {fieldErrors.password && <p className="text-xs text-red-600">{fieldErrors.password.join(', ')}</p>}
                </div>
            )}

            <div className="grid gap-1">
                <label className="text-xs">Branch</label>
                <select
                    className="border rounded px-3 py-2"
                    value={v.branch_id} // '' == null
                    onChange={(e) =>
                        setForm({
                            ...form,
                            branch_id: isSuperadmin ? (e.target.value || null) : (me?.branch_id ? String(me.branch_id) : null),
                        })
                    }
                    disabled={!isSuperadmin} // Admin Cabang tidak boleh ganti cabang
                >
                    {isSuperadmin && <option value="">(Tanpa branch)</option>}
                    {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                            {b.code} — {b.name}
                        </option>
                    ))}
                </select>
                {fieldErrors.branch_id && <p className="text-xs text-red-600">{fieldErrors.branch_id.join(', ')}</p>}
            </div>

            <div className="grid gap-1">
                <label className="text-xs">Status</label>
                <label className="inline-flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={v.is_active}
                        onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    />
                    Aktif
                </label>
            </div>

            {canManage && (
                <div className="grid gap-1">
                    <label className="text-xs">Roles *</label>
                    <select
                        multiple
                        className="border rounded px-3 py-2 min-h-28"
                        value={v.roles}
                        onChange={(e) => {
                            const values = Array.from(e.target.selectedOptions)
                                .map(o => (o.value || '').trim() as RoleName)
                                .filter(Boolean);
                            const uniq = Array.from(new Set(values)) as RoleName[];
                            setForm({ ...form, roles: uniq });
                        }}
                        required
                    >
                        {allowedRoles(isSuperadmin).map((r) => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>

                    {/* ⬇️ Tambahkan indikator TERLETAK DI SINI, persis di bawah </select> */}
                    {v.roles.length > 0 && (
                        <p className="text-[11px] text-green-700">Dipilih: {v.roles.join(', ')}</p>
                    )}

                    <p className="text-[11px] text-gray-500">Tahan Ctrl / Cmd untuk memilih lebih dari satu.</p>
                    {fieldErrors.roles && <p className="text-xs text-red-600">{fieldErrors.roles.join(', ')}</p>}

                    {Object.keys(fieldErrors).length > 0 && (
                        <pre className="text-[11px] text-red-700 bg-red-50 p-2 rounded">
                            {JSON.stringify(fieldErrors, null, 2)}
                        </pre>
                    )}
                </div>
            )}

            <div className="flex gap-2">
                <button disabled={saving} className="rounded bg-black text-white px-3 py-2">
                    {saving ? 'Menyimpan…' : 'Simpan'}
                </button>

                <button
                    type="button"
                    className="rounded border px-3 py-2"
                    onClick={() => nav('/users')}
                >
                    Batal
                </button>

                {editing && (
                    <button
                        type="button"
                        className="rounded border px-3 py-2"
                        onClick={async () => {
                            if (!isSuperadmin && !isAdminCabang) return;
                            const p1 = prompt('Password baru (min 8, mix-case+angka)'); if (!p1) return;
                            const p2 = prompt('Konfirmasi password baru'); if (p2 !== p1) { alert('Konfirmasi tidak cocok'); return; }
                            try { await resetUserPassword(id!, p1); alert('Password direset'); }
                            catch { alert('Gagal reset password'); }
                        }}
                    >
                        Reset Password
                    </button>
                )}
            </div>
        </form>
    );
}

```
</details>

### src/pages/users/UsersList.tsx

- SHA: `329047e98e9e`  
- Ukuran: 10 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import { listUsers, deleteUser, setUserActive } from '../../api/users';
import type { User, PaginationMeta, UserQuery } from '../../types/users';
import { Link } from 'react-router-dom';
import { useAuth, useHasRole } from '../../store/useAuth';

export default function UsersList() {
    const me = useAuth.user; // akses user login (branch_id, roles)
    const isSuperadmin = useHasRole('Superadmin');
    const canManage = useHasRole(['Superadmin', 'Admin Cabang']);

    const [rows, setRows] = useState<User[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [q, setQ] = useState('');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Guard per-baris agar UI tidak men-trigger 403
    const canEditRow = useCallback(
        (row: User) => {
            if (isSuperadmin) return true;
            // Admin Cabang: hanya boleh edit user di cabangnya dan bukan Superadmin
            const sameBranch = String(row.branch_id ?? '') === String(me?.branch_id ?? '');
            const rowHasSuperadmin = (row.roles ?? []).includes('Superadmin');
            return sameBranch && !rowHasSuperadmin;
        },
        [isSuperadmin, me?.branch_id]
    );

    const canToggleActive = canEditRow; // atur kebijakan sama dengan edit
    const canDeleteRow = useCallback(
        (row: User) => {
            if (isSuperadmin) return true; // Superadmin boleh
            // Admin Cabang: boleh hapus user di cabangnya dan bukan Superadmin
            const sameBranch = String(row.branch_id ?? '') === String(me?.branch_id ?? '');
            const rowHasSuperadmin = (row.roles ?? []).includes('Superadmin');
            return sameBranch && !rowHasSuperadmin;
        },
        [isSuperadmin, me?.branch_id]
    );

    const refresh = useCallback(
        async (p = page) => {
            setLoading(true);
            setError(null);
            try {
                const query: UserQuery = { q, page: p, per_page: perPage };
                // Admin Cabang: paksa filter berdasarkan cabang login
                if (!isSuperadmin && me?.branch_id) {
                    (query).branch_id = String(me.branch_id);
                }
                const res = await listUsers(query);
                setRows(res.data ?? []);
                setMeta((res.meta as PaginationMeta) ?? null);
            } catch {
                setError('Gagal memuat data user');
            } finally {
                setLoading(false);
            }
        },
        [page, q, perPage, isSuperadmin, me?.branch_id]
    );

    // Reset ke halaman 1 ketika q/perPage berubah
    useEffect(() => {
        setPage(1);
    }, [q, perPage]);

    useEffect(() => {
        void refresh(page);
    }, [page, refresh]);

    const handleToggleActive = useCallback(
        async (u: User) => {
            if (!canManage || !canToggleActive(u)) return;
            try {
                await setUserActive(String(u.id), !u.is_active);
                await refresh();
            } catch {
                alert('Gagal set status');
            }
        },
        [canManage, canToggleActive, refresh]
    );

    const handleDelete = useCallback(
        async (u: User) => {
            if (!canManage || !canDeleteRow(u)) return;
            if (!confirm(`Hapus user ${u.email}?`)) return;
            try {
                await deleteUser(String(u.id));
                await refresh();
            } catch {
                alert('Gagal menghapus');
            }
        },
        [canManage, canDeleteRow, refresh]
    );

    const isEmpty = useMemo(() => !loading && rows.length === 0, [loading, rows.length]);

    return (
        <div className="space-y-4">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold">Users</h1>
                    <p className="text-xs text-gray-500">Kelola akun, role, dan status aktif.</p>
                </div>
                {canManage && <Link to="/users/new" className="rounded border px-3 py-2 text-sm">New User</Link>}
            </header>

            <div className="flex gap-2">
                <input
                    className="border rounded px-3 py-2 text-sm w-full"
                    placeholder="Cari nama/email…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
                <select
                    className="border rounded px-3 py-2 text-sm"
                    value={perPage}
                    onChange={(e) => setPerPage(Number(e.target.value))}
                >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                </select>
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}
            {loading && <div className="text-sm text-gray-500">Memuat…</div>}
            {isEmpty && <div className="text-sm text-gray-500">Belum ada user</div>}

            {!loading && rows.length > 0 && (
                <div className="overflow-auto rounded border">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left">Nama</th>
                                <th className="px-3 py-2 text-left">Email</th>
                                <th className="px-3 py-2 text-left">Branch</th>
                                <th className="px-3 py-2 text-left">Roles</th>
                                <th className="px-3 py-2 text-left">Status</th>
                                <th className="px-3 py-2 text-left">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((u) => {
                                const allowEdit = canEditRow(u);
                                const allowToggle = canToggleActive(u);
                                const allowDelete = canDeleteRow(u);

                                return (
                                    <tr key={u.id} className="border-t">
                                        <td className="px-3 py-2">{u.name}</td>
                                        <td className="px-3 py-2">{u.email}</td>
                                        <td className="px-3 py-2">{u.branch_id ?? '-'}</td>
                                        <td className="px-3 py-2">{(u.roles ?? []).join(', ')}</td>
                                        <td className="px-3 py-2">
                                            <span className={`px-2 py-1 rounded text-xs ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {u.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 space-x-2">
                                            {allowEdit && (
                                                <Link className="underline text-xs" to={`/users/${String(u.id)}/edit`}>
                                                    Edit
                                                </Link>
                                            )}

                                            {canManage && (
                                                <>
                                                    <button
                                                        className={`underline text-xs ${allowToggle ? '' : 'opacity-40 cursor-not-allowed'}`}
                                                        disabled={!allowToggle}
                                                        onClick={() => handleToggleActive(u)}
                                                    >
                                                        {u.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                    </button>

                                                    <button
                                                        className={`underline text-xs text-red-600 ${allowDelete ? '' : 'opacity-40 cursor-not-allowed'}`}
                                                        disabled={!allowDelete}
                                                        onClick={() => handleDelete(u)}
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {meta && meta.last_page > 1 && (
                <div className="flex items-center gap-2">
                    <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded border px-2 py-1 text-xs">
                        Prev
                    </button>
                    <div className="text-xs text-gray-600">
                        Hal {meta.current_page} / {meta.last_page}
                    </div>
                    <button disabled={page >= meta.last_page} onClick={() => setPage((p) => p + 1)} className="rounded border px-2 py-1 text-xs">
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

```
</details>

### src/pages/vouchers/VoucherForm.tsx

- SHA: `104b591d9807`  
- Ukuran: 7 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
import { useEffect, useState } from 'react';
import { createVoucher, getVoucher, updateVoucher } from '../../api/vouchers';
import type { Voucher, VoucherUpsertPayload, VoucherType } from '../../types/vouchers';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../store/useAuth';
import type { AxiosError } from 'axios';

const TYPES: VoucherType[] = ['PERCENT', 'NOMINAL'];

export default function VoucherForm() {
    const { id } = useParams<{ id: string }>();
    const nav = useNavigate();
    const editing = Boolean(id);
    const { user: me } = useAuth;

    const [form, setForm] = useState<VoucherUpsertPayload>({
        branch_id: me?.branch_id != null ? String(me.branch_id) : null,
        code: '',
        type: 'PERCENT',
        value: 0,
        start_at: null,
        end_at: null,
        min_total: 0,
        usage_limit: null,
        active: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

    useEffect(() => {
        (async () => {
            if (!editing) return;
            setLoading(true);
            try {
                const res = await getVoucher(id!);
                const v = res.data as Voucher;
                setForm({
                    branch_id: v.branch_id,
                    code: v.code,
                    type: v.type,
                    value: v.value,
                    start_at: v.start_at,
                    end_at: v.end_at,
                    min_total: v.min_total ?? 0,
                    usage_limit: v.usage_limit,
                    active: v.active,
                });
            } catch {
                setError('Gagal memuat data voucher');
            } finally {
                setLoading(false);
            }
        })();
    }, [editing, id]);

    function validateUI(): string | null {
        if (!form.code || !/^[A-Z0-9-]+$/.test(form.code)) return 'Kode wajib huruf/angka/strip dan huruf besar';
        if (form.type === 'PERCENT' && (form.value < 0 || form.value > 100)) return 'Nilai persentase harus 0–100';
        if ((form.start_at && form.end_at) && new Date(form.start_at) > new Date(form.end_at)) return 'Periode tidak valid (start > end)';
        if ((form.min_total ?? 0) < 0) return 'Min total tidak boleh negatif';
        return null;
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true); setError(null); setFieldErrors({});
        const uiErr = validateUI();
        if (uiErr) { setLoading(false); setError(uiErr); return; }

        try {
            if (editing) {
                await updateVoucher(id!, form);
            } else {
                await createVoucher(form);
            }
            nav('/vouchers');
        } catch (ex: unknown) {
            const err = ex as AxiosError<{ message?: string; errors?: Record<string, string[]> }>;
            const resp = err.response;
            if (resp?.status === 422) {
                setFieldErrors(resp.data?.errors ?? {});
                setError(resp.data?.message ?? 'Validasi gagal');
            } else if (resp?.status === 403) {
                setError('Tidak berwenang');
            } else {
                setError('Gagal menyimpan voucher');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className="space-y-4 max-w-xl" onSubmit={onSubmit}>
            <h1 className="text-lg font-semibold">{editing ? 'Edit Voucher' : 'Buat Voucher'}</h1>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="grid grid-cols-2 gap-3">
                <label className="col-span-2">
                    <div className="text-xs text-gray-600 mb-1">Kode</div>
                    <input className="border rounded px-3 py-2 w-full" value={form.code}
                        onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required />
                    {fieldErrors.code && <div className="text-xs text-red-600">{fieldErrors.code.join(', ')}</div>}
                </label>

                <label>
                    <div className="text-xs text-gray-600 mb-1">Tipe</div>
                    <select className="border rounded px-3 py-2 w-full" value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value as VoucherType })}>
                        {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </label>

                <label>
                    <div className="text-xs text-gray-600 mb-1">Nilai</div>
                    <input type="number" className="border rounded px-3 py-2 w-full" value={form.value}
                        onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} required />
                    <div className="text-[10px] text-gray-500">{form.type === 'PERCENT' ? '0–100 (%)' : 'Nominal rupiah'}</div>
                    {fieldErrors.value && <div className="text-xs text-red-600">{fieldErrors.value.join(', ')}</div>}
                </label>

                <label>
                    <div className="text-xs text-gray-600 mb-1">Min Total</div>
                    <input type="number" className="border rounded px-3 py-2 w-full" value={form.min_total ?? 0}
                        onChange={(e) => setForm({ ...form, min_total: Number(e.target.value) })} />
                </label>

                <label>
                    <div className="text-xs text-gray-600 mb-1">Usage Limit</div>
                    <input type="number" className="border rounded px-3 py-2 w-full" value={form.usage_limit ?? 0}
                        onChange={(e) => setForm({ ...form, usage_limit: e.target.value ? Number(e.target.value) : null })} />
                </label>

                <label>
                    <div className="text-xs text-gray-600 mb-1">Start At</div>
                    <input type="datetime-local" className="border rounded px-3 py-2 w-full" value={form.start_at ?? ''}
                        onChange={(e) => setForm({ ...form, start_at: e.target.value || null })} />
                </label>

                <label>
                    <div className="text-xs text-gray-600 mb-1">End At</div>
                    <input type="datetime-local" className="border rounded px-3 py-2 w-full" value={form.end_at ?? ''}
                        onChange={(e) => setForm({ ...form, end_at: e.target.value || null })} />
                </label>

                <label className="col-span-2">
                    <input type="checkbox" checked={!!form.active}
                        onChange={(e) => setForm({ ...form, active: e.target.checked })} /> <span className="text-sm">Aktif</span>
                </label>
            </div>

            <div className="flex items-center gap-2">
                <button disabled={loading} className="rounded border px-3 py-2">{loading ? 'Menyimpan…' : 'Simpan'}</button>
                <button type="button" className="rounded border px-3 py-2" onClick={() => history.back()}>Batal</button>
            </div>
        </form>
    );
}

```
</details>

### src/pages/vouchers/VouchersIndex.tsx

- SHA: `76887826eeb5`  
- Ukuran: 7 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import { listVouchers, deleteVoucher } from '../../api/vouchers';
import type { Voucher, PaginationMeta } from '../../types/vouchers';
import { useNavigate } from 'react-router-dom';
import { useHasRole } from '../../store/useAuth';

export default function VouchersIndex() {
    const canManage = useHasRole(['Superadmin', 'Admin Cabang']);
    const nav = useNavigate();
    const [rows, setRows] = useState<Voucher[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [q, setQ] = useState('');
    const [active, setActive] = useState<'all' | 'active' | 'inactive'>('all');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const perPage = 10;

    const queryActive = useMemo(() => active === 'all' ? undefined : active === 'active', [active]);

    const fetchPage = useCallback(async (p = 1) => {
        setLoading(true); setError(null);
        try {
            const res = await listVouchers({ q, page: p, per_page: perPage, active: queryActive });
            setRows(res.data ?? []);
            setMeta(res.meta ?? null);
        } catch (ex: unknown) {
            const err = ex as { response?: { status?: number } };
            if (err?.response?.status === 403) setError('Tidak berwenang mengakses vouchers');
            else setError('Gagal memuat data voucher');
        } finally {
            setLoading(false);
        }
    }, [q, queryActive]);

    useEffect(() => { void fetchPage(page); }, [fetchPage, page]);

    useEffect(() => {
        const t = setTimeout(() => { void fetchPage(1); setPage(1); }, 300);
        return () => clearTimeout(t);
    }, [fetchPage, q, active]);

    return (
        <div className="space-y-4">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold">Vouchers</h1>
                    <p className="text-xs text-gray-500">Kelola kode promo dan periode aktif.</p>
                </div>
                {canManage && (
                    <div className="space-x-2">
                        <button className="rounded border px-3 py-2 text-sm" onClick={() => nav('/vouchers/new')}>New Voucher</button>
                    </div>
                )}
            </header>

            <div className="flex items-center gap-2">
                <input
                    className="border rounded px-3 py-2 text-sm"
                    placeholder="Cari kode…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
                <select
                    className="border rounded px-3 py-2 text-sm"
                    value={active}
                    onChange={(e) => setActive(e.target.value as 'all' | 'active' | 'inactive')}
                >
                    <option value="all">Semua</option>
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                </select>
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="overflow-auto border rounded">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 text-left">
                            <th className="p-2">Kode</th>
                            <th className="p-2">Tipe</th>
                            <th className="p-2">Nilai</th>
                            <th className="p-2">Min Total</th>
                            <th className="p-2">Periode</th>
                            <th className="p-2">Limit</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td className="p-4" colSpan={8}>Memuat…</td></tr>
                        ) : rows.length === 0 ? (
                            <tr><td className="p-4 text-muted-foreground" colSpan={8}>Belum ada voucher</td></tr>
                        ) : rows.map(v => (
                            <tr key={v.id} className="border-t">
                                <td className="p-2 font-mono">{v.code}</td>
                                <td className="p-2">{v.type}</td>
                                <td className="p-2">{v.type === 'PERCENT' ? `${v.value}%` : new Intl.NumberFormat('id-ID').format(v.value)}</td>
                                <td className="p-2">{new Intl.NumberFormat('id-ID').format(v.min_total ?? 0)}</td>
                                <td className="p-2">
                                    {(v.start_at && v.end_at) ? `${v.start_at?.slice(0, 16)} — ${v.end_at?.slice(0, 16)}` : '—'}
                                </td>
                                <td className="p-2">{v.usage_limit ?? '—'}</td>
                                <td className="p-2">{v.active ? 'Aktif' : 'Nonaktif'}</td>
                                <td className="p-2">
                                    <div className="flex gap-2">
                                        <button className="underline text-xs" onClick={() => nav(`/vouchers/${v.id}/edit`)}>Edit</button>
                                        {canManage && (
                                            <button
                                                className="underline text-xs text-red-600"
                                                onClick={async () => {
                                                    if (!confirm(`Hapus voucher ${v.code}?`)) return;
                                                    try { await deleteVoucher(v.id); await fetchPage(page); } catch { alert('Gagal menghapus'); }
                                                }}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {meta && meta.last_page > 1 && (
                <div className="flex items-center gap-2">
                    <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded border px-2 py-1 text-xs">Prev</button>
                    <div className="text-xs text-gray-600">Hal {meta.current_page} / {meta.last_page}</div>
                    <button disabled={page >= meta.last_page} onClick={() => setPage((p) => p + 1)} className="rounded border px-2 py-1 text-xs">Next</button>
                </div>
            )}
        </div>
    );
}

```
</details>



## Pages (src/utils)

### src/utils/files.ts

- SHA: `b56d905529c2`  
- Ukuran: 332 B
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/utils/files.ts
export function fileUrl(path?: string | null): string {
  if (!path) return "";
  // kalau backend sudah mengembalikan URL absolut, langsung pakai
  if (/^https?:\/\//i.test(path)) return path;
  const base = import.meta.env.VITE_FILES_BASE_URL || "";
  return `${base}/${String(path).replace(/^\/+/, "")}`;
}

```
</details>

### src/utils/money.ts

- SHA: `9de3e1039356`  
- Ukuran: 169 B
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
export function toIDR(n: number): string {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n ?? 0);
}

```
</details>

### src/utils/order-status.ts

- SHA: `7da4ce0c9d21`  
- Ukuran: 568 B
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/utils/order-status.ts
import type { OrderBackendStatus } from '../types/orders';

export const ALLOWED_NEXT: Record<OrderBackendStatus, OrderBackendStatus[]> = {
  QUEUE: ['WASHING', 'CANCELED'],
  WASHING: ['DRYING', 'CANCELED'],
  DRYING: ['IRONING', 'READY', 'CANCELED'],
  IRONING: ['READY', 'CANCELED'],
  READY: ['DELIVERING', 'PICKED_UP', 'CANCELED'],
  DELIVERING: ['PICKED_UP', 'CANCELED'],
  PICKED_UP: [],
  CANCELED: [],
};

export function getAllowedNext(current: OrderBackendStatus): OrderBackendStatus[] {
  return ALLOWED_NEXT[current] ?? [];
}

```
</details>

### src/utils/theme.ts

- SHA: `cd5508d93cc6`  
- Ukuran: 544 B
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/utils/theme.ts
export type ThemeMode = 'light' | 'dark' | 'hc' | 'auto';
const STORAGE_KEY = 'ui.theme';

export function setTheme(mode: ThemeMode = 'auto') {
  const html = document.documentElement;
  if (mode === 'auto') {
    html.removeAttribute('data-theme');
  } else {
    html.setAttribute('data-theme', mode);
  }
  localStorage.setItem(STORAGE_KEY, mode);
}

export function getTheme(): ThemeMode {
  return (localStorage.getItem(STORAGE_KEY) as ThemeMode) ?? 'auto';
}

export function initTheme() {
  setTheme(getTheme());
}

```
</details>

### src/utils/wa.ts

- SHA: `3a7cc9879fd0`  
- Ukuran: 424 B
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
function normPhoneID(wa: string): string {
    const digits = (wa || '').replace(/\D/g, '');
    if (digits.startsWith('62')) return digits;
    if (digits.startsWith('0')) return `62${digits.slice(1)}`;
    return digits;
}

export function buildWhatsAppLink(phone: string, message: string): string {
    const p = normPhoneID(phone);
    const t = encodeURIComponent(message);
    return `https://wa.me/${p}?text=${t}`;
}

```
</details>



## Entry Files

### src/App.tsx

- SHA: `82cfea01d538`  
- Ukuran: 165 B
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

export default function App() {
  return <RouterProvider router={router} />;
}
```
</details>

### src/main.tsx

- SHA: `59751734a779`  
- Ukuran: 287 B
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initTheme } from './utils/theme';
import './index.css'
import App from './App.tsx'

initTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

```
</details>
