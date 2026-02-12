# Dokumentasi Frontend (FULL Source)

_Dihasilkan otomatis: 2026-02-12 16:52:26_  
**Root:** `/home/galuhdwicandra/workspace/clone_salve/prjk-salve-frontend`


## Daftar Isi

- [API (src/api)](#api-srcapi)
  - [src/api/branches.ts](#file-srcapibranchests)
  - [src/api/client.ts](#file-srcapiclientts)
  - [src/api/customers.ts](#file-srcapicustomersts)
  - [src/api/dashboard.ts](#file-srcapidashboardts)
  - [src/api/deliveries.ts](#file-srcapideliveriests)
  - [src/api/expenses.ts](#file-srcapiexpensests)
  - [src/api/invoiceCounters.ts](#file-srcapiinvoicecountersts)
  - [src/api/loyalty.ts](#file-srcapiloyaltyts)
  - [src/api/orderPhotos.ts](#file-srcapiorderphotosts)
  - [src/api/orders.ts](#file-srcapiordersts)
  - [src/api/receivables.ts](#file-srcapireceivablests)
  - [src/api/reports.ts](#file-srcapireportsts)
  - [src/api/serviceCategories.ts](#file-srcapiservicecategoriests)
  - [src/api/servicePrices.ts](#file-srcapiservicepricests)
  - [src/api/services.ts](#file-srcapiservicests)
  - [src/api/users.ts](#file-srcapiusersts)
  - [src/api/vouchers.ts](#file-srcapivouchersts)
  - [src/api/washNotes.ts](#file-srcapiwashnotests)

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
  - [src/types/loyalty.ts](#file-srctypesloyaltyts)
  - [src/types/orders.ts](#file-srctypesordersts)
  - [src/types/payments.ts](#file-srctypespaymentsts)
  - [src/types/receivables.ts](#file-srctypesreceivablests)
  - [src/types/services.ts](#file-srctypesservicests)
  - [src/types/users.ts](#file-srctypesusersts)
  - [src/types/vouchers.ts](#file-srctypesvouchersts)
  - [src/types/wash-notes.ts](#file-srctypeswash-notests)

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
  - [src/pages/reports/ReportsIndex.tsx](#file-srcpagesreportsreportsindextsx)
  - [src/pages/services/CategoryIndex.tsx](#file-srcpagesservicescategoryindextsx)
  - [src/pages/services/PricePerBranchInput.tsx](#file-srcpagesservicespriceperbranchinputtsx)
  - [src/pages/services/ServiceForm.tsx](#file-srcpagesservicesserviceformtsx)
  - [src/pages/services/ServiceIndex.tsx](#file-srcpagesservicesserviceindextsx)
  - [src/pages/users/UserForm.tsx](#file-srcpagesusersuserformtsx)
  - [src/pages/users/UsersList.tsx](#file-srcpagesusersuserslisttsx)
  - [src/pages/vouchers/VoucherForm.tsx](#file-srcpagesvouchersvoucherformtsx)
  - [src/pages/vouchers/VouchersIndex.tsx](#file-srcpagesvouchersvouchersindextsx)
  - [src/pages/wash-notes/WashNoteForm.tsx](#file-srcpageswash-noteswashnoteformtsx)
  - [src/pages/wash-notes/WashNotesIndex.tsx](#file-srcpageswash-noteswashnotesindextsx)

- [Pages (src/utils)](#pages-srcutils)
  - [src/utils/date.ts](#file-srcutilsdatets)
  - [src/utils/files.ts](#file-srcutilsfilests)
  - [src/utils/money.ts](#file-srcutilsmoneyts)
  - [src/utils/order-status.ts](#file-srcutilsorder-statusts)
  - [src/utils/receipt-wa.ts](#file-srcutilsreceipt-wats)
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

- SHA: `7b0531c076a2`  
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
export interface LoginPayload { login: string; password: string; }
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

- SHA: `4a338c480c40`  
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
  const hasFile = !!payload.photo;
  if (hasFile) {
    const fd = new FormData();
    fd.append('status', payload.status);
    if (payload.note) fd.append('note', payload.note);
    if (payload.photo) fd.append('photo', payload.photo);
    const { data } = await api.put<SingleResponse<Delivery>>(
      `/deliveries/${encodeURIComponent(id)}/status`,
      fd
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

### src/api/loyalty.ts

- SHA: `3460dc811e86`  
- Ukuran: 621 B
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/api/loyalty.ts
import { api, type ApiEnvelope } from './client';
import type { LoyaltySummary } from '../types/loyalty';

export async function getLoyaltySummary(customerId: string, branchId?: string) {
    const { data } = await api.get<ApiEnvelope<LoyaltySummary, null>>(
        `/loyalty/${encodeURIComponent(customerId)}`,
        // kirim branch_id agar backend membaca akun loyalti pada cabang aktif
        branchId ? { params: { branch_id: branchId } } : undefined
    );
    // Ikuti pola modul lain yang mengembalikan envelope (lihat branches.ts).
    return data; // ApiEnvelope<LoyaltySummary, null>
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

- SHA: `cbc7ad31f765`  
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

type ShareLinkPayload = { share_url: string; expires_in_minutes: number };
export async function createOrderShareLink(id: string): Promise<string> {
  const { data } = await api.post<SingleResponse<ShareLinkPayload>>(
    `/orders/${encodeURIComponent(id)}/share-link`
  );
  const url = data?.data?.share_url;
  if (!url) throw new Error('Share link tidak tersedia dari server');
  return url;
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

### src/api/reports.ts

- SHA: `1afa41b5c804`  
- Ukuran: 1 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/api/reports.ts
import { api } from './client';
import type { ApiEnvelope } from './client';

export type ReportKind = 'sales' | 'orders' | 'receivables' | 'expenses' | 'services';

export interface ReportQuery {
    from: string; // 'YYYY-MM-DD'
    to: string;   // 'YYYY-MM-DD'
    branch_id?: string | null;
    method?: string | null; // sales
    status?: string | null; // orders/receivables
    per_page?: number;
}

export interface PaginatedMeta {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    kind: ReportKind;
    columns: string[];
}

type PreviewResp = ApiEnvelope<any[], PaginatedMeta>;

export async function getReportPreview(kind: ReportKind, params: ReportQuery): Promise<PreviewResp> {
    const { data } = await api.get<PreviewResp>(`/reports/${kind}`, { params });
    return data;
}

export async function exportReport(kind: ReportKind, params: ReportQuery & { format?: 'csv' | 'xlsx', delimiter?: 'comma' | 'semicolon' | 'tab' }) {
    const { data } = await api.get(`/reports/${kind}/export`, {
        params,
        responseType: 'blob',
    });
    return data as Blob;
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

- SHA: `0bcc8ef09c29`  
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
    const { data } = await api.get<Envelope<User, null>>(`/users/${encodeURIComponent(id)}`);
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

### src/api/washNotes.ts

- SHA: `3fe62f8fac9d`  
- Ukuran: 2 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/api/washNotes.ts
import { api } from './client';
import type { ApiEnvelope } from './client';

export type ProcessStatus = 'QUEUE' | 'WASH' | 'DRY' | 'FINISHING' | 'COMPLETED' | 'PICKED_UP';

export interface WashNoteItem {
    id?: string;
    order_id: string;
    qty?: number;
    process_status?: ProcessStatus | null;
    started_at?: string | null;
    finished_at?: string | null;
    note?: string | null;
}

export interface WashNote {
    id: string;
    user_id: number;
    branch_id: string | null;
    note_date: string;
    orders_count: number;
    total_qty: number;
    items?: WashNoteItem[];
}

export interface OrderLite {
    id: string;
    number: string;
    invoice_no?: string | null;
    status?: string;
    customer?: { id: string; name: string } | null;
    default_qty?: number;
}

export interface WashNoteUpsert {
    note_date: string;
    items: WashNoteItem[];
}

export interface SearchOrderCandidatesParams {
    query?: string;
    date_from?: string;
    date_to?: string;
    on_date?: string;
    exclude_note_id?: string; // <— baru
}

export async function listWashNotes(params?: {
    date_from?: string; date_to?: string; page?: number; per_page?: number;
}) {
    const { data } = await api.get<ApiEnvelope<WashNote[]>>('/wash-notes', { params });
    return data;
}

export async function getWashNote(id: string) {
    const { data } = await api.get<ApiEnvelope<WashNote>>(`/wash-notes/${encodeURIComponent(id)}`);
    return data;
}

export async function createWashNote(payload: WashNoteUpsert) {
    const { data } = await api.post<ApiEnvelope<WashNote>>('/wash-notes', payload);
    return data;
}

export async function updateWashNote(id: string, payload: WashNoteUpsert) {
    const { data } = await api.patch<ApiEnvelope<WashNote>>(`/wash-notes/${encodeURIComponent(id)}`, payload);
    return data;
}

export async function deleteWashNote(id: string) {
    const { data } = await api.delete<ApiEnvelope<null>>(`/wash-notes/${encodeURIComponent(id)}`);
    return data;
}

export async function searchOrderCandidates(params: SearchOrderCandidatesParams) {
    const { data } = await api.get<ApiEnvelope<OrderLite[]>>(
        '/wash-notes/candidates',
        { params }
    );
    return data;
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

- SHA: `57fcc9161a87`  
- Ukuran: 595 B
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
import { Outlet, useLocation } from 'react-router-dom';

export default function GuestLayout() {
  const { pathname } = useLocation();
  const isFullBleed = pathname === '/login';

  // LOGIN: biarkan halaman (Login.tsx) yang mengatur layout sendiri
  if (isFullBleed) {
    return <Outlet />;
  }

  // Halaman tamu lain: tetap model kartu 420px
  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <div className="w-full max-w-[420px] rounded-2xl p-6 sm:p-8 shadow-[var(--shadow-2)] bg-[color:var(--color-surface)]">
        <Outlet />
      </div>
    </main>
  );
}

```
</details>

### src/layouts/ProtectedLayout.tsx

- SHA: `9d7c169c6742`  
- Ukuran: 12 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/layouts/ProtectedLayout.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate, NavLink } from "react-router-dom";
import { useAuth, useHasRole } from "../store/useAuth";
import type { RoleName } from "../api/client";

export default function ProtectedLayout() {
  const me = useAuth.user;
  const location = useLocation();
  const nav = useNavigate();

  // Drawer untuk mobile
  const [open, setOpen] = useState(false);

  // Close drawer on route change (UX)
  useEffect(() => {
    setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Esc to close + lock scroll on mobile drawer
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!me) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const FF = {
    vouchers: import.meta.env.VITE_FEATURE_VOUCHER === "true",
    delivery: import.meta.env.VITE_FEATURE_DELIVERY === "true",
    receivables: import.meta.env.VITE_FEATURE_RECEIVABLES === "true",
  };

  type MenuItem = { label: string; to: string; roles: RoleName[]; show?: boolean };
  const MENU: MenuItem[] = [
    { label: "Dashboard", to: "/", roles: ["Superadmin", "Admin Cabang", "Kasir", "Petugas Cuci", "Kurir"] as RoleName[] },
    { label: "POS", to: "/pos", roles: ["Superadmin", "Admin Cabang", "Kasir"] },
    { label: "Pesanan", to: "/orders", roles: ["Superadmin", "Admin Cabang", "Kasir"] },
    { label: "Pelanggan", to: "/customers", roles: ["Superadmin", "Admin Cabang", "Kasir"] },
    { label: "Layanan", to: "/services", roles: ["Superadmin", "Admin Cabang"] },
    { label: "Pengguna", to: "/users", roles: ["Superadmin", "Admin Cabang"] },
    { label: "Cabang", to: "/branches", roles: ["Superadmin"] },
    { label: "Catatan Cuci", to: "/wash-notes", roles: ["Superadmin", "Admin Cabang", "Petugas Cuci"] },
    { label: "Pengiriman", to: "/deliveries", roles: ["Superadmin", "Admin Cabang", "Kasir", "Kurir"], show: FF.delivery },
    { label: "Pengeluaran", to: "/expenses", roles: ["Superadmin", "Admin Cabang"] },
    { label: "Piutang", to: "/receivables", roles: ["Superadmin", "Admin Cabang", "Kasir"], show: FF.receivables },
    { label: "Vouchers", to: "/vouchers", roles: ["Superadmin", "Admin Cabang"], show: FF.vouchers },
    { label: "Laporan", to: "/reports", roles: ["Superadmin", "Admin Cabang", "Kasir"] },
  ];

  const VISIBLE = useMemo(
    () =>
      MENU.filter((m) => (m.show ?? true) && (me.roles ?? []).some((r) => m.roles.includes(r as RoleName))),
    [me.roles, FF.delivery, FF.receivables, FF.vouchers],
  );

  const roleText = (me.roles ?? []).join(", ");
  const showSubtitle = roleText && roleText.toLowerCase() !== (me.name ?? "").toLowerCase();

  return (
    <div
      className="min-h-dvh text-[var(--color-text-default)]"
      style={{
        background: "linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 92%, #ffffff) 0%, var(--color-surface) 100%)",
      }}
    >
      {/* Topbar */}
      <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-surface)]/85 backdrop-blur shadow-[0_10px_30px_-25px_rgba(0,0,0,.35)]">
        <div className="container-app flex h-14 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 min-w-0">
            {/* Toggle drawer (mobile) */}
            <button
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-white/80 hover:bg-white transition-colors"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <span className="block h-0.5 w-4 bg-current" />
              <span className="block h-0.5 w-4 bg-current mt-1" />
              <span className="block h-0.5 w-4 bg-current mt-1" />
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <div className="h-9 w-9 rounded-xl overflow-hidden bg-white shadow-sm border border-[var(--color-border)] flex items-center justify-center">
                <img
                  src="/logo-salve.png"
                  alt="Logo Salve"
                  className="h-7 w-7 object-contain"
                />
              </div>
              <div className="min-w-0">
                <div className="font-semibold leading-5 truncate">SALVE</div>
                <div className="text-[11px] leading-4 text-black/55 dark:text-white/60 truncate">
                  {"POS Laundry"}
                </div>
              </div>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-2 py-1 shadow-[0_8px_20px_-16px_rgba(0,0,0,.35)]">
              <div className="h-8 w-8 rounded-full bg-black/10 flex items-center justify-center text-xs font-bold">
                {(me.name ?? "U").slice(0, 1).toUpperCase()}
              </div>

              <div className="hidden sm:block leading-tight pr-1">
                <div className="text-sm font-semibold truncate max-w-[180px]">{me.name}</div>
                {showSubtitle ? (
                  <div className="text-[11px] text-black/55 dark:text-white/60 truncate max-w-[180px]">
                    {roleText}
                  </div>
                ) : null}
              </div>

              <button
                onClick={async () => {
                  await useAuth.logout();
                  nav("/login", { replace: true });
                }}
                className="inline-flex h-8 items-center rounded-lg border border-[var(--color-border)] bg-white px-3 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container-app grid grid-cols-1 md:grid-cols-[17rem_1fr] gap-4 md:gap-6 py-4 md:py-6">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:block">
          <div className="rounded-2xl border border-[var(--color-border)] bg-white/90 p-4 shadow-[0_10px_30px_-18px_rgba(0,0,0,.35)]">
            <UserCard name={me.name} roles={me.roles ?? []} />
            <nav className="mt-4 space-y-1">
              {VISIBLE.map((m) => (
                <NavLink key={m.to} to={m.to} className={({ isActive }) => navItemClass(isActive)}>
                  <span className="truncate">{m.label}</span>
                  <span className="ml-auto text-[10px] opacity-60">{isActiveDot(m.to, location.pathname)}</span>
                </NavLink>
              ))}
            </nav>

            <div className="mt-4 border-t border-[var(--color-border)] pt-4">
              <button
                onClick={async () => {
                  await useAuth.logout();
                  nav("/login", { replace: true });
                }}
                className="inline-flex w-full items-center justify-center rounded-xl border border-[var(--color-border)] bg-white/80 px-3 py-2 text-sm hover:bg-white transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Drawer Sidebar (mobile) */}
        <MobileDrawer open={open} onClose={() => setOpen(false)}>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Menu</div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-white hover:bg-slate-50"
                aria-label="Close menu"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-4">
              <UserCard name={me.name} roles={me.roles ?? []} />
            </div>

            <nav className="mt-4 space-y-1">
              {VISIBLE.map((m) => (
                <NavLink key={m.to} to={m.to} className={({ isActive }) => navItemClass(isActive)}>
                  <span className="truncate">{m.label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="mt-4">
              <button
                onClick={async () => {
                  await useAuth.logout();
                  nav("/login", { replace: true });
                }}
                className="inline-flex w-full items-center justify-center rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-sm hover:bg-slate-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </MobileDrawer>

        {/* Konten */}
        <main className="min-w-0">
          <div className="rounded-2xl border border-[var(--color-border)] bg-white/90 p-4 md:p-6 shadow-[0_10px_30px_-18px_rgba(0,0,0,.35)]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function navItemClass(isActive: boolean) {
  return [
    "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-black/15",
    isActive
      ? "bg-[var(--color-brand-primary)] text-[var(--color-brand-on)] shadow-[0_10px_22px_-18px_rgba(0,0,0,.45)]"
      : "text-[var(--color-text-default)] hover:bg-black/5",
  ].join(" ");
}

// kecil saja, supaya tidak mengubah logika: ini hanya untuk penanda UI
function isActiveDot(_to: string, _pathname: string) {
  return "";
}

function UserCard(props: { name: string; roles: string[] }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-black/10 flex items-center justify-center font-bold">
          {(props.name ?? "U").slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="font-semibold leading-5 truncate">{props.name}</div>
          <div className="mt-0.5 text-xs text-black/60 dark:text-white/70 truncate">
            {props.roles?.join(", ")}
          </div>
        </div>
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
          "fixed inset-0 z-40 bg-black/35 transition-opacity md:hidden",
          props.open ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={props.onClose}
        aria-hidden={!props.open}
      />
      {/* Panel */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 w-[82vw] max-w-[320px] border-r border-[var(--color-border)] bg-white shadow-[0_20px_60px_-30px_rgba(0,0,0,.6)] transition-transform md:hidden",
          props.open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
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

- SHA: `d077b9476fd9`  
- Ukuran: 10 KB
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
const ReportsIndex = lazy(() => import('../pages/reports/ReportsIndex'));
const WashNotesIndex = lazy(() => import('../pages/wash-notes/WashNotesIndex'));
const WashNoteForm = lazy(() => import('../pages/wash-notes/WashNoteForm'));

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
        path: '/reports',
        element: (
          <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir']}>
            <LazyBoundary>
              <ReportsIndex />
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
          {
            path: '/wash-notes',
            element: (
              <Guarded roles={['Superadmin', 'Admin Cabang', 'Petugas Cuci']}>
                <LazyBoundary>
                  <WashNotesIndex />
                </LazyBoundary>
              </Guarded>
            ),
          },
          {
            path: '/wash-notes/new',
            element: (
              <Guarded roles={['Petugas Cuci']}>
                <LazyBoundary>
                  <WashNoteForm />
                </LazyBoundary>
              </Guarded>
            ),
          },
          {
            path: '/wash-notes/:id',
            element: (
              <Guarded roles={['Superadmin', 'Admin Cabang', 'Petugas Cuci']}>
                <LazyBoundary>
                  <WashNoteForm />
                </LazyBoundary>
              </Guarded>
            ),
          },
          {
            path: '/wash-notes/:id/edit',
            element: (
              <Guarded roles={['Petugas Cuci']}>
                <LazyBoundary>
                  <WashNoteForm />
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

- SHA: `fb03c8625a8d`  
- Ukuran: 987 B
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
  date: string;
  amount: number;
}

export interface OmzetMonthlyPoint {
  month: string;
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

  dp_outstanding_count: number;
  dp_outstanding_amount: number;

  omzet_daily: OmzetDailyPoint[];
  omzet_monthly: OmzetMonthlyPoint[];
}

export interface DashboardSummaryMeta {
  from: string;
  to: string;
  branch_id?: string | null;  // UUID cabang atau null/undefined = semua
}

```
</details>

### src/types/deliveries.ts

- SHA: `fb09a36e6ca4`  
- Ukuran: 2 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/types/deliveries.ts
export type DeliveryType = 'pickup' | 'delivery' | 'return';

export type DeliveryStatus =
  | 'CREATED'
  | 'ASSIGNED'
  | 'ON_THE_WAY'
  | 'PICKED'
  | 'HANDOVER'
  | 'COMPLETED'
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
  note?: string | null;
  /** Optional; hanya diperlukan saat HANDOVER */
  photo?: File | null;
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

### src/types/loyalty.ts

- SHA: `f4db26e1ab8e`  
- Ukuran: 143 B
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/types/loyalty.ts
export interface LoyaltySummary {
  stamps: number;   // 0..9
  cycle: number;    // 10
  next: number;     // 1..10
}

```
</details>

### src/types/orders.ts

- SHA: `723bf44f6706`  
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
    dp_amount: number;
    paid_amount: number;
    paid_at: string | null;
    received_at: string | null;
    ready_at: string | null;
    invoice_no: string | null;
    total: number;
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
    received_at?: string | null;
    ready_at?: string | null;
}

export interface OrderUpdatePayload {
    customer_id?: string | null;
    items?: OrderItemInput[];
    discount?: number;
    notes?: string | null;
    received_at?: string | null;
    ready_at?: string | null;
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

- SHA: `bc843ad5b3c3`  
- Ukuran: 2 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/types/receivables.ts
import type { PaymentMethod, Payment } from "../types/payments";
import type { Order } from "../types/orders";

export type ReceivableStatus = "OPEN" | "PARTIAL" | "SETTLED" | "OVERDUE" | "CANCELLED";

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
        customer?: {
            id: string;
            name: string | null;
            phone?: string | null;
            whatsapp?: string | null;
        } | null;
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
    order: Order | { order: Order;[k: string]: unknown };
    payment?: Payment | null;
    order_id?: string;
    receipt_url?: string | null;
    share_url?: string | null;
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

- SHA: `cc5d6364bed5`  
- Ukuran: 1 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/types/users.ts
import type { RoleName } from '../api/client';

export interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    branch_id: string | null;
    is_active: boolean;
    roles: RoleName[];
    created_at?: string | null;
    updated_at?: string | null;
}

export interface UserUpsertPayload {
    name: string;
    username?: string;
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

### src/types/wash-notes.ts

- SHA: `d9c1406d2fc9`  
- Ukuran: 755 B
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
export type ProcessStatus = 'QUEUE' | 'WASH' | 'DRY' | 'FINISHING' | 'COMPLETED' | 'PICKED_UP';

export interface WashNoteItem {
    id: string;
    order_id: string;
    qty: number;
    process_status?: ProcessStatus | null;
    started_at?: string | null;  // "HH:mm"
    finished_at?: string | null; // "HH:mm"
    note?: string | null;
}

export interface WashNote {
    id: string;
    user_id: number;
    branch_id: string | null;
    note_date: string; // "YYYY-MM-DD"
    orders_count: number;
    total_qty: number;
    items?: WashNoteItem[];
}

export interface OrderLite {
    id: string;
    number: string;
    invoice_no?: string | null;
    status: string;
    customer?: { id: string; name: string } | null;
    default_qty?: number;
}

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

- SHA: `2ab750179e2f`  
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

  const options = useMemo(
    () =>
      rows
        .filter((u) => (u.roles ?? []).includes('Kurir'))
        .map((u) => ({ id: u.id, label: `${u.name}` })),
    [rows]
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await listUsers({ role: 'Kurir', per_page: 100 });
        const list = Array.isArray((res as unknown as { data: User[] }).data)
          ? (res as { data: User[] }).data
          : [];
        if (mounted) setRows(list);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const hasValue = value !== null && String(value).length > 0;

  return (
    <div className="flex items-center gap-2" aria-busy={loading ? 'true' : 'false'}>
      <label className="sr-only" htmlFor="assign-courier">
        Pilih kurir
      </label>
      <select
        id="assign-courier"
        className="input min-w-[220px] py-2 pr-8"
        value={value === null ? '' : String(value)}
        onChange={(e) => onChange(e.target.value ? e.target.value : null)}
        disabled={disabled || loading}
        aria-label="Pilih kurir untuk pengantaran"
      >
        <option value="">{loading ? 'Memuat kurir…' : '— Pilih Kurir —'}</option>
        {options.map((o) => (
          <option key={String(o.id)} value={String(o.id)}>
            {o.label}
          </option>
        ))}
      </select>

      {hasValue && (
        <button
          type="button"
          className="btn-outline text-xs h-9 px-2"
          onClick={() => onChange(null)}
          disabled={disabled}
          title="Kosongkan kurir"
          aria-label="Kosongkan kurir"
        >
          Kosongkan
        </button>
      )}
    </div>
  );
}

```
</details>

### src/components/delivery/DeliveryStatusStepper.tsx

- SHA: `bfdc8abff0a2`  
- Ukuran: 2 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/components/delivery/DeliveryStatusStepper.tsx
import type { DeliveryStatus } from '../../types/deliveries';

const FLOW: DeliveryStatus[] = ['CREATED', 'ASSIGNED', 'ON_THE_WAY', 'PICKED', 'HANDOVER', 'COMPLETED'];

export default function DeliveryStatusStepper({ status }: { status: DeliveryStatus }) {
    // Logika asli dipertahankan
    const activeIdx = Math.max(0, FLOW.indexOf(status));

    return (
        <ol
            className="flex items-center flex-wrap gap-2 text-xs"
            aria-label="Status pengiriman"
            role="list"
        >
            {FLOW.map((s, i) => {
                const isDone = i < activeIdx;
                const isActive = i === activeIdx;
                const pillBase =
                    'inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium transition duration-150 ease-out';
                const pillClass = isActive
                    ? // Langkah aktif: solid brand, teks on-brand, ring ringan + micro-scale
                    `${pillBase} bg-[var(--color-brand-primary)] text-[color:var(--color-brand-on)] shadow-elev-1 scale-[1.02]`
                    : isDone
                        ? // Sudah lewat: subtle brand (mirip chip--subtle pada table Customers)
                        `${pillBase} text-[var(--color-brand-primary)] bg-[#E6EDFF]`
                        : // Belum: outline halus
                        `${pillBase} border border-[color:var(--color-border)] text-gray-700 bg-white/80`;

                return (
                    <li key={s} className="flex items-center gap-2" aria-current={isActive ? 'step' : undefined}>
                        <span className={pillClass}>
                            {/* Bullet/ikon sederhana: ✔ untuk selesai, • untuk lain */}
                            <span aria-hidden="true">{isDone ? '✔' : '•'}</span>
                            <span className="tracking-wide">{s}</span>
                        </span>

                        {/* Connector antar step */}
                        {i < FLOW.length - 1 && (
                            <span
                                className={`h-px w-6 md:w-8 ${i < activeIdx ? 'bg-[var(--color-brand-primary)]' : 'bg-[color:var(--color-border)]'
                                    }`}
                                aria-hidden="true"
                            />
                        )}
                    </li>
                );
            })}
        </ol>
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

- SHA: `44bf8ad3c679`  
- Ukuran: 12 KB
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

type PreviewItem = {
  file: File;
  url: string;
  name: string;
  sizeKB: number;
};

function formatKB(size: number): number {
  return Math.ceil(size / 1024);
}

function CameraIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M20 7h-3l-2-3H9L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z" />
      <circle cx="12" cy="13" r="3.2" />
    </svg>
  );
}

function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M12 3v12" />
      <path d="M7 8l5-5 5 5" />
      <path d="M21 21H3" />
    </svg>
  );
}

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 16H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

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

  const previews = useMemo(() => {
    // Buat objectURL hanya untuk tampilan, dan revoke otomatis via cleanup di useMemo (React tidak punya cleanup di useMemo),
    // jadi kita buat "best effort" sederhana: URL dibuat ulang saat render; risiko leak kecil untuk jumlah file sedikit.
    // Jika Anda ingin super ketat, bisa dipindah ke useEffect cleanup, tapi itu mulai menyentuh "logika tambahan".
    const mk = (list: File[]): PreviewItem[] =>
      list.map((f) => ({
        file: f,
        url: URL.createObjectURL(f),
        name: f.name,
        sizeKB: formatKB(f.size),
      }));
    return {
      before: mk(files.before),
      after: mk(files.after),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files.before, files.after]);

  function pick(kind: "before" | "after") {
    (kind === "before" ? beforeRef : afterRef).current?.click();
  }

  function onChange(kind: "before" | "after", list: FileList | null) {
    if (!list) return;
    const arr = Array.from(list);
    setFiles((prev) => ({
      ...prev,
      [kind]: [...prev[kind], ...arr],
    }));
  }

  function onDrop(kind: "before" | "after", droppedFiles: File[]) {
    if (!droppedFiles.length) return;
    setFiles((prev) => ({
      ...prev,
      [kind]: [...prev[kind], ...droppedFiles],
    }));
  }

  function removeOne(kind: "before" | "after", idx: number) {
    setFiles((prev) => {
      const next = [...prev[kind]];
      next.splice(idx, 1);
      return { ...prev, [kind]: next };
    });
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

  const disableUpload = busy || (files.before.length === 0 && files.after.length === 0);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)]">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900">Order Photos</div>
          <p className="mt-1 text-xs text-slate-500">
            Foto sebelum &amp; sesudah (opsional). Gunakan kamera belakang untuk hasil terbaik.
          </p>
        </div>

        {busy && (
          <span className="inline-flex items-center gap-2 text-xs text-slate-600" aria-live="polite">
            <span className="h-3 w-3 rounded-full border-2 border-black/20 border-t-black/70 animate-spin" />
            Mengunggah…
          </span>
        )}
      </div>

      {/* Content */}
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {/* BEFORE */}
        <Panel
          title="Before"
          count={files.before.length}
          isMobile={isMobile}
          busy={busy}
          onPick={() => pick("before")}
          onDropFiles={(arr) => onDrop("before", arr)}
        >
          <input
            ref={beforeRef}
            type="file"
            accept="image/*"
            capture={isMobile ? "environment" : undefined}
            multiple
            className="hidden"
            onChange={(e) => onChange("before", e.target.files)}
          />

          <PreviewGrid
            items={previews.before}
            onRemove={(idx) => removeOne("before", idx)}
            disabled={busy}
            emptyText="Belum ada foto before."
          />
        </Panel>

        {/* AFTER */}
        <Panel
          title="After"
          count={files.after.length}
          isMobile={isMobile}
          busy={busy}
          onPick={() => pick("after")}
          onDropFiles={(arr) => onDrop("after", arr)}
        >
          <input
            ref={afterRef}
            type="file"
            accept="image/*"
            capture={isMobile ? "environment" : undefined}
            multiple
            className="hidden"
            onChange={(e) => onChange("after", e.target.files)}
          />

          <PreviewGrid
            items={previews.after}
            onRemove={(idx) => removeOne("after", idx)}
            disabled={busy}
            emptyText="Belum ada foto after."
          />
        </Panel>
      </div>

      {/* Footer actions */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <button
          type="button"
          className="
            inline-flex items-center justify-center gap-2
            rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white
            hover:bg-slate-800 active:bg-slate-950
            disabled:cursor-not-allowed disabled:opacity-70
          "
          onClick={onUpload}
          disabled={disableUpload}
        >
          <UploadIcon className="opacity-95" />
          {busy ? "Mengunggah..." : "Upload"}
        </button>

        <button
          type="button"
          className="
            inline-flex items-center justify-center gap-2
            rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900
            hover:bg-slate-50 active:bg-slate-100
            disabled:cursor-not-allowed disabled:opacity-70
          "
          onClick={() => setFiles({ before: [], after: [] })}
          disabled={busy}
        >
          <TrashIcon />
          Reset
        </button>

        <span className="sm:ml-auto text-[10px] text-slate-500">
          Hanya gambar (*.jpg, *.png, *.heic). Kamera belakang aktif di mobile.
        </span>
      </div>
    </div>
  );
}

/* ------------------------
   Sub-komponen presentasional
------------------------- */

function Panel({
  title,
  count,
  isMobile,
  busy,
  onPick,
  onDropFiles,
  children,
}: {
  title: string;
  count: number;
  isMobile: boolean;
  busy: boolean;
  onPick: () => void;
  onDropFiles: (files: File[]) => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-3">
      <header className="flex items-center justify-between">
        <div className="text-xs font-semibold text-slate-900">{title}</div>
        <span className="text-[10px] text-slate-500">{count} file</span>
      </header>

      {/* Dropzone */}
      <div
        className="
          mt-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/40
          p-4 text-center transition-colors
          hover:border-slate-300
        "
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const dropped = Array.from(e.dataTransfer.files || []);
          onDropFiles(dropped);
        }}
        role="button"
        aria-label={`Area unggah foto ${title}`}
      >
        {isMobile ? (
          <button
            type="button"
            className="
              inline-flex items-center justify-center gap-2
              rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white
              hover:bg-slate-800 active:bg-slate-950
              disabled:cursor-not-allowed disabled:opacity-70
            "
            onClick={onPick}
            disabled={busy}
          >
            <CameraIcon />
            Buka Kamera
          </button>
        ) : (
          <div className="space-y-2">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm">
              <UploadIcon />
            </div>
            <div className="text-xs font-medium text-slate-700">Tarik &amp; letakkan foto ke sini</div>
            <div className="text-xs text-slate-500">atau</div>
            <button
              type="button"
              className="
                inline-flex items-center justify-center gap-2
                rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900
                hover:bg-slate-50 active:bg-slate-100
                disabled:cursor-not-allowed disabled:opacity-70
              "
              onClick={onPick}
              disabled={busy}
            >
              Pilih File
            </button>
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function PreviewGrid({
  items,
  onRemove,
  disabled,
  emptyText,
}: {
  items: PreviewItem[];
  onRemove: (idx: number) => void;
  disabled: boolean;
  emptyText: string;
}) {
  if (!items.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-3 text-xs text-slate-500">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {items.map((it, idx) => (
        <div
          key={`${it.name}-${idx}`}
          className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white"
          title={it.name}
        >
          <div className="aspect-square w-full bg-slate-50">
            <img
              src={it.url}
              alt={it.name}
              className="h-full w-full object-cover"
              loading="lazy"
              onLoad={() => {
                // revoke setelah load agar tidak menumpuk (best effort)
                try { URL.revokeObjectURL(it.url); } catch { /* noop */ }
              }}
            />
          </div>

          <div className="p-2">
            <div className="truncate text-[11px] font-medium text-slate-900">{it.name}</div>
            <div className="mt-0.5 text-[10px] text-slate-500">{it.sizeKB} KB</div>
          </div>

          <button
            type="button"
            disabled={disabled}
            onClick={() => onRemove(idx)}
            className="
              absolute right-1.5 top-1.5
              inline-flex items-center justify-center
              rounded-md bg-white/90 p-1.5 text-slate-700 shadow-sm
              opacity-100 sm:opacity-0 sm:group-hover:opacity-100
              hover:bg-white
              disabled:cursor-not-allowed disabled:opacity-60
            "
            aria-label="Hapus foto"
            title="Hapus"
          >
            <XIcon />
          </button>
        </div>
      ))}
    </div>
  );
}

```
</details>

### src/components/orders/OrderPhotosGallery.tsx

- SHA: `af6c34a7ac25`  
- Ukuran: 6 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/components/orders/OrderPhotosGallery.tsx
import { useMemo, useState, useEffect } from "react";
import type { OrderPhoto } from "../../types/orders";

const fileUrl = (p?: string | null) => {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;
  const filesBase = (import.meta.env.VITE_FILES_BASE_URL || "").replace(/\/+$/, "");
  const apiBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
  const originFallback = apiBase.replace(/\/api\/v1$/i, "");
  const base = filesBase || originFallback || "";
  return `${base}/${String(p).replace(/^\/+/, "")}`;
};

export default function OrderPhotosGallery({ photos }: { photos: OrderPhoto[] }) {
  const [preview, setPreview] = useState<{ url: string; label: string; ts?: string } | null>(null);

  const groups = useMemo(() => {
    const norm = (k: unknown) => String(k || "").toUpperCase();
    return {
      before: photos.filter((p) => norm(p.kind) === "BEFORE"),
      after: photos.filter((p) => norm(p.kind) === "AFTER"),
    };
  }, [photos]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreview(null);
    };
    if (preview) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preview]);

  if (!photos?.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)]">
        <div className="text-sm font-semibold text-slate-900">Order Photos</div>
        <div className="mt-2 text-xs text-slate-500">Belum ada foto.</div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-900">Order Photos</div>
          <span className="text-xs text-slate-500">{photos.length} foto</span>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Section
            label="Before"
            items={groups.before}
            onPreview={(data) => setPreview(data)}
          />
          <Section
            label="After"
            items={groups.after}
            onPreview={(data) => setPreview(data)}
          />
        </div>
      </div>

      {/* Lightbox Modal */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setPreview(null)}
              className="absolute -top-10 right-0 text-white text-sm font-semibold"
            >
              ✕ Close
            </button>

            <div className="rounded-xl bg-white overflow-hidden shadow-2xl">
              <img
                src={preview.url}
                alt={preview.label}
                className="w-full max-h-[80vh] object-contain bg-black"
              />
              <div className="px-4 py-3 border-t border-slate-200">
                <div className="text-sm font-semibold text-slate-900">
                  {preview.label}
                </div>
                <div className="text-xs text-slate-500">
                  {preview.ts ?? "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------
   Section
------------------------- */

function resolveCreatedAt(p: OrderPhoto): string | undefined {
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

function Section({
  label,
  items,
  onPreview,
}: {
  label: string;
  items: OrderPhoto[];
  onPreview: (data: { url: string; label: string; ts?: string }) => void;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div className="text-sm font-semibold text-slate-900">{label}</div>
        <span className="text-xs text-slate-500">{items.length} foto</span>
      </div>

      {!items.length ? (
        <div className="px-4 py-6 text-center text-xs text-slate-500">-</div>
      ) : (
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {items.map((p) => {
              const url = fileUrl(p.path);
              const ts = resolveCreatedAt(p);

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() =>
                    onPreview({
                      url,
                      label: `${label} #${p.id}`,
                      ts,
                    })
                  }
                  className="group block overflow-hidden rounded-lg border border-slate-200 bg-white hover:shadow-lg transition"
                >
                  <div className="relative">
                    <img
                      src={url}
                      alt={`${label} photo`}
                      loading="lazy"
                      className="h-28 w-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "data:image/svg+xml;utf8," +
                          encodeURIComponent(
                            "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 140'><rect width='100%' height='100%' fill='#f1f5f9'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='10' fill='#64748b'>image not found</text></svg>"
                          );
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

```
</details>

### src/components/orders/OrderPhotosUpload.tsx

- SHA: `93f5b79cec29`  
- Ukuran: 11 KB
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

function bytesToKB(n: number) {
  return Math.max(1, Math.ceil(n / 1024));
}

function ImageIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M8 11a2 2 0 1 0 0-.01" />
      <path d="M21 16l-6-6-5 5-2-2-5 5" />
    </svg>
  );
}

function CameraIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l2-2h8l2 2h3a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

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
    setFiles((prev) => ({ ...prev, [kind]: [...prev[kind], ...arr] }));
  }

  function onDrop(kind: "before" | "after", dropped: File[]) {
    if (!dropped.length) return;
    setFiles((prev) => ({ ...prev, [kind]: [...prev[kind], ...dropped] }));
  }

  function removeOne(kind: "before" | "after", index: number) {
    setFiles((prev) => {
      const next = [...prev[kind]];
      next.splice(index, 1);
      return { ...prev, [kind]: next };
    });
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

  const totalCount = files.before.length + files.after.length;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <ImageIcon />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Order Photos</h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Unggah foto <span className="font-semibold text-slate-900">Before</span> dan{" "}
                <span className="font-semibold text-slate-900">After</span>.{" "}
                {isMobile ? "Kamera tersedia di perangkat Anda." : "Dukung drag-drop & pilih file."}
              </p>
            </div>
          </div>
        </div>

        <div className="hidden sm:block text-xs text-slate-500">
          Total: <span className="font-semibold text-slate-900">{totalCount}</span> file
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <UploadPanel
          title="Before"
          subtitle="PNG/JPG, ≤ 5MB"
          kind="before"
          busy={busy}
          isMobile={isMobile}
          files={files.before}
          onPick={() => pick("before")}
          onDropFiles={(arr) => onDrop("before", arr)}
          onRemove={(i) => removeOne("before", i)}
        />

        <UploadPanel
          title="After"
          subtitle="PNG/JPG, ≤ 5MB"
          kind="after"
          busy={busy}
          isMobile={isMobile}
          files={files.after}
          onPick={() => pick("after")}
          onDropFiles={(arr) => onDrop("after", arr)}
          onRemove={(i) => removeOne("after", i)}
        />
      </div>

      {/* Hidden inputs */}
      <input
        ref={beforeRef}
        type="file"
        accept="image/*"
        capture={isMobile ? "environment" : undefined}
        multiple
        className="hidden"
        onChange={(e) => onChange("before", e.target.files)}
      />
      <input
        ref={afterRef}
        type="file"
        accept="image/*"
        capture={isMobile ? "environment" : undefined}
        multiple
        className="hidden"
        onChange={(e) => onChange("after", e.target.files)}
      />

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-slate-500 sm:hidden">
          Total: <span className="font-semibold text-slate-900">{totalCount}</span> file
        </div>

        <div className="flex items-center gap-2 sm:ml-auto">
          <button
            type="button"
            className="
              inline-flex items-center justify-center rounded-lg
              bg-slate-900 px-4 py-2 text-sm font-semibold text-white
              hover:bg-slate-800 active:bg-slate-950
              disabled:cursor-not-allowed disabled:opacity-60
            "
            onClick={onUpload}
            disabled={busy || totalCount === 0}
            aria-live="polite"
          >
            {busy ? "Mengunggah..." : "Upload"}
          </button>

          <button
            type="button"
            className="
              inline-flex items-center justify-center rounded-lg
              border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900
              hover:bg-slate-50
              disabled:cursor-not-allowed disabled:opacity-60
            "
            onClick={() => setFiles({ before: [], after: [] })}
            disabled={busy || totalCount === 0}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------
   Presentational sub-components
------------------------- */

function UploadPanel(props: {
  title: string;
  subtitle: string;
  kind: "before" | "after";
  busy: boolean;
  isMobile: boolean;
  files: File[];
  onPick: () => void;
  onDropFiles: (arr: File[]) => void;
  onRemove: (index: number) => void;
}) {
  const { title, subtitle, busy, isMobile, files, onPick, onDropFiles, onRemove } = props;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <div className="text-[11px] text-slate-500">{subtitle}</div>
      </div>

      <div
        className="
          rounded-xl border border-dashed border-slate-300 bg-slate-50
          p-4 text-center
          hover:bg-slate-50/60
          transition-colors
        "
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const dropped = Array.from(e.dataTransfer.files || []);
          onDropFiles(dropped);
        }}
        aria-label={`Drop zone foto ${title.toLowerCase()}`}
      >
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 ring-1 ring-slate-200">
          {isMobile ? <CameraIcon /> : <ImageIcon />}
        </div>

        {isMobile ? (
          <>
            <div className="text-xs font-medium text-slate-700">Ambil foto dari kamera</div>
            <div className="mt-1 text-xs text-slate-500">Klik tombol untuk membuka kamera.</div>
            <button
              type="button"
              className="
                mt-3 inline-flex items-center justify-center rounded-lg
                bg-slate-900 px-3 py-2 text-xs font-semibold text-white
                hover:bg-slate-800 active:bg-slate-950
                disabled:cursor-not-allowed disabled:opacity-60
              "
              onClick={onPick}
              disabled={busy}
            >
              Buka Kamera
            </button>
          </>
        ) : (
          <>
            <div className="text-xs font-medium text-slate-700">Tarik & letakkan file</div>
            <div className="mt-1 text-xs text-slate-500">Atau pilih file dari perangkat Anda.</div>
            <button
              type="button"
              className="
                mt-3 inline-flex items-center justify-center rounded-lg
                border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900
                hover:bg-slate-50
                disabled:cursor-not-allowed disabled:opacity-60
              "
              onClick={onPick}
              disabled={busy}
            >
              Pilih File
            </button>
          </>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
          <div className="flex items-center justify-between bg-slate-50 px-3 py-2">
            <div className="text-xs font-semibold text-slate-700">
              Dipilih: <span className="text-slate-900">{files.length}</span> file
            </div>
            <div className="text-[11px] text-slate-500">Klik ✕ untuk hapus</div>
          </div>

          <ul className="divide-y divide-slate-100">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`} className="flex items-center gap-2 px-3 py-2">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-medium text-slate-900">{f.name}</div>
                  <div className="text-[11px] text-slate-500">{bytesToKB(f.size)} KB</div>
                </div>

                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  disabled={busy}
                  className="
                    inline-flex h-8 w-8 items-center justify-center rounded-md
                    text-slate-600 hover:bg-slate-100
                    disabled:cursor-not-allowed disabled:opacity-60
                  "
                  aria-label={`Hapus file ${f.name}`}
                  title="Hapus"
                >
                  <XIcon />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

```
</details>

### src/components/orders/OrderStatusStepper.tsx

- SHA: `eafe158a6bc8`  
- Ukuran: 3 KB
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
      className="flex flex-wrap items-center gap-2 text-xs select-none"
      role="list"
      aria-label="Order progress"
    >
      {UI_FLOW.map((s, idx) => {
        const isCurrent = idx === activeIdx;
        const isDone = idx < activeIdx;

        // Container pill
        const pillBase =
          'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition-colors motion-reduce:transition-none';
        const pillState = isCurrent
          ? 'bg-slate-900 text-white border-slate-900'
          : isDone
          ? 'bg-slate-50 text-slate-900 border-slate-200'
          : 'bg-white text-slate-500 border-slate-200';

        // Dot / icon
        const dotBase =
          'grid place-items-center h-5 w-5 rounded-full border text-[10px] font-semibold';
        const dotState = isCurrent
          ? 'bg-white text-slate-900 border-white'
          : isDone
          ? 'bg-slate-900 text-white border-slate-900'
          : 'bg-white text-slate-500 border-slate-200';

        // Label
        const labelBase = 'text-[11px] font-semibold tracking-wide';
        const labelState = isCurrent ? 'text-white' : isDone ? 'text-slate-900' : 'text-slate-500';

        // Connector (line) between pills
        const barBase = 'h-[2px] w-6 rounded-full sm:w-10';
        const barState = idx < activeIdx ? 'bg-slate-900' : 'bg-slate-200';

        return (
          <React.Fragment key={s}>
            <div
              className={`${pillBase} ${pillState}`}
              role="listitem"
              aria-current={isCurrent ? 'step' : undefined}
              aria-label={s}
            >
              <span className={`${dotBase} ${dotState}`} aria-hidden="true">
                {isDone ? (
                  // check icon for done
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : (
                  idx + 1
                )}
              </span>
              <span className={`${labelBase} ${labelState}`}>{s}</span>
            </div>

            {idx < UI_FLOW.length - 1 && (
              <div className={`${barBase} ${barState}`} aria-hidden="true" />
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

- SHA: `779d74137fff`  
- Ukuran: 7 KB
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

export default function CartPanel({ items, onChangeQty, onChangeNote, onRemove }: Props): ReactElement {
  const subtotal = useMemo(() => items.reduce((s, it) => s + it.price * it.qty, 0), [items]);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900">Keranjang</div>
          <div className="mt-0.5 text-xs text-slate-500">
            {items.length > 0 ? 'Atur qty, catatan, lalu simpan transaksi.' : 'Tambah layanan dari pencarian.'}
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700 ring-1 ring-slate-100">
          {items.length} item
        </span>
      </div>

      {/* Empty */}
      {items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center">
          <div className="text-sm font-semibold text-slate-900">Belum ada item</div>
          <div className="mt-1 text-xs text-slate-500">Cari layanan, lalu tekan Enter untuk menambahkan.</div>
        </div>
      )}

      {/* List */}
      {items.length > 0 && (
        <>
          <ul className="space-y-2">
            {items.map((it) => (
              <li
                key={it.service_id}
                className="rounded-2xl border border-slate-200 bg-white p-3"
              >
                <div className="flex items-start gap-3">
                  {/* Main */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-900">{it.name}</div>
                        <div className="mt-1 inline-flex items-center rounded-full bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700 ring-1 ring-slate-100">
                          {it.unit}
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <div className="text-[11px] text-slate-500">Total</div>
                        <div className="text-sm font-extrabold tracking-tight text-slate-900">
                          {toIDR(it.price * it.qty)}
                        </div>
                        <div className="text-[11px] text-slate-500">{toIDR(it.price)} / item</div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="sr-only" htmlFor={`note-${it.service_id}`}>
                        Catatan untuk {it.name}
                      </label>
                      <input
                        id={`note-${it.service_id}`}
                        className="
                          w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900
                          placeholder:text-slate-400 focus:border-slate-900 focus:outline-none
                        "
                        placeholder="Catatan item (opsional)"
                        value={it.note ?? ''}
                        onChange={(e) => onChangeNote(it.service_id, e.target.value)}
                        aria-label={`Catatan untuk ${it.name}`}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <QtyStepper
                      value={it.qty}
                      onChange={(v) => onChangeQty(it.service_id, Math.max(1, v))}
                      label={`Kuantitas ${it.name}`}
                    />
                    <button
                      type="button"
                      className="
                        inline-flex items-center justify-center rounded-xl
                        border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700
                        hover:bg-red-100 active:bg-red-200
                      "
                      onClick={() => onRemove(it.service_id)}
                      aria-label={`Hapus ${it.name}`}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Subtotal */}
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">Subtotal</span>
              <span className="text-sm font-extrabold text-slate-900">{toIDR(subtotal)}</span>
            </div>
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
    <div className="inline-flex items-center overflow-hidden rounded-xl border border-slate-200 bg-white">
      <button
        type="button"
        className="h-10 w-10 text-base font-semibold text-slate-900 hover:bg-slate-50 active:bg-slate-100"
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
        className="
          h-10 w-14 border-x border-slate-200 bg-white text-center text-sm font-semibold text-slate-900
          focus:outline-none
        "
        aria-label={label ?? 'Jumlah'}
      />

      <button
        type="button"
        className="h-10 w-10 text-base font-semibold text-slate-900 hover:bg-slate-50 active:bg-slate-100"
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

- SHA: `c676b47ec039`  
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
import type { AxiosError } from 'axios';

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
      const resp = await createOrderPayment(order.id, payload);
      const updated = (resp as any)?.order ?? (resp as any)?.data?.order ?? resp;
      onPaid(updated as Order);
      onPaid(updated);
      onClose();
    } catch (ex: unknown) {
      const ax = ex as AxiosError<any>;
      if (ax?.response) {
        if (ax.response.status === 403) {
          setErr(ax.response.data?.message ?? 'Forbidden: Anda tidak diizinkan melakukan pembayaran untuk order ini.');
        } else if (ax.response.status === 422) {
          setErr(ax.response.data?.message ?? 'Validasi gagal (422). Periksa nominal dan syarat pembayaran.');
        } else {
          setErr(ax.message ?? 'Gagal menyimpan pembayaran');
        }
      } else {
        setErr((ex as Error)?.message ?? 'Gagal menyimpan pembayaran');
      }
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
      onKeyDown={(e) => { if (e.key === 'Escape' && !loading) onClose(); }}
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
                    className={`px-3 py-1.5 text-sm transition-colors ${active
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

- SHA: `7352f1af018f`  
- Ukuran: 8 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/components/pos/ProductSearch.tsx
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import type { Service } from '../../types/services';
import { listServices } from '../../api/services';
import { listServicePricesByService, computeEffectivePrice } from '../../api/servicePrices';
import type { ServicePrice } from '../../types/services';
import { useAuth } from '../../store/useAuth';

type Props = {
  onPick: (row: Service & { price_effective: number }) => void;
};

type Row = Service & { price_effective: number };

function formatIDR(n: number): string {
  return n.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.2-3.2" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="h-4 w-40 rounded bg-slate-200" />
          <div className="mt-2 h-3 w-24 rounded bg-slate-200" />
        </div>
        <div className="h-4 w-20 rounded bg-slate-200" />
      </div>
      <div className="mt-3 h-3 w-32 rounded bg-slate-200" />
    </div>
  );
}

export default function ProductSearch({ onPick }: Props): React.ReactElement {
  const user = useSyncExternalStore(useAuth.subscribe, () => useAuth.user);
  const branchId: string | null = user?.branch_id != null ? String(user.branch_id) : null;

  const [q, setQ] = useState('');
  const [base, setBase] = useState<Service[]>([]);
  const [priceMap, setPriceMap] = useState<Record<string, ServicePrice[]>>({});
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listServices({ q, is_active: true, per_page: 10, page: 1 });
      const list = (res.data ?? []) as Service[];
      setBase(list);

      const entries = await Promise.all(
        list.map(async (s) => [String(s.id), (await listServicePricesByService(String(s.id))).data] as const)
      );

      const map: Record<string, ServicePrice[]> = {};
      for (const [sid, prices] of entries) map[sid] = prices ?? [];
      setPriceMap(map);

      const computed: Row[] = list.map((s) => ({
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
    const computed: Row[] = base.map((s) => ({
      ...s,
      price_effective: computeEffectivePrice(priceMap[String(s.id)], branchId, s.price_default),
    }));
    setRows(computed);
  }, [branchId, base, priceMap]);

  const hintText = useMemo(() => {
    // Hint singkat, tidak mengubah logic (hanya copy)
    return 'Enter untuk cari · Klik kartu layanan untuk menambah ke keranjang';
  }, []);

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="flex items-stretch gap-2">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            <SearchIcon />
          </span>

          <input
            className="
              w-full rounded-xl border border-slate-200 bg-white
              py-2.5 pl-10 pr-10 text-sm text-slate-900
              placeholder:text-slate-400
              focus:border-slate-900 focus:outline-none
            "
            placeholder="Cari layanan… (mis. Cuci Sepatu, Fast Clean)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') void refresh(); }}
            aria-label="Cari layanan"
          />

          {q.trim().length > 0 && (
            <button
              type="button"
              className="
                absolute right-2 top-1/2 -translate-y-1/2
                rounded-lg p-2 text-slate-600 hover:bg-slate-100
                focus:outline-none focus:ring-2 focus:ring-slate-200
              "
              onClick={() => setQ('')}
              aria-label="Hapus pencarian"
            >
              <XIcon />
            </button>
          )}
        </div>

        <button
          type="button"
          className="
            inline-flex items-center justify-center gap-2
            rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white
            hover:bg-slate-800 active:bg-slate-950
            disabled:cursor-not-allowed disabled:opacity-60
          "
          onClick={() => void refresh()}
          disabled={loading}
          aria-label="Cari"
        >
          <SearchIcon className="text-white/90" />
          Cari
        </button>
      </div>

      <div className="text-[11px] text-slate-500">{hintText}</div>

      {/* States */}
      {loading && (
        <div className="grid gap-2 sm:grid-cols-2" aria-live="polite">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert" aria-live="polite">
          {error}
        </div>
      )}

      {/* Results */}
      {!loading && !error && rows.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {rows.map((r) => (
            <button
              key={r.id}
              type="button"
              className="
                group w-full rounded-2xl border border-slate-200 bg-white p-3 text-left
                shadow-[0_14px_40px_-34px_rgba(0,0,0,.35)]
                transition hover:-translate-y-[1px] hover:border-slate-300 hover:bg-slate-50
                focus:outline-none focus:ring-2 focus:ring-slate-200
              "
              onClick={() => onPick(r)}
              title="Klik untuk menambah ke keranjang"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-900">{r.name}</div>
                  <div className="mt-0.5 text-xs text-slate-500">{r.unit}</div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="text-sm font-semibold tracking-tight text-slate-900 tabular-nums">
                    {formatIDR(r.price_effective)}
                  </div>
                  <div className="mt-1 inline-flex rounded-full bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100">
                    + Tambah
                  </div>
                </div>
              </div>

              <div className="mt-3 text-[11px] text-slate-500">
                Klik untuk menambah ke keranjang.
              </div>
            </button>
          ))}
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-center">
          <div className="text-sm font-semibold text-slate-900">Tidak ada hasil</div>
          <div className="mt-1 text-xs text-slate-500">Coba kata kunci lain, atau kosongkan pencarian lalu tekan Cari.</div>
        </div>
      )}
    </div>
  );
}

```
</details>

### src/components/ReceiptPreview.tsx

- SHA: `18bf2c4f8876`  
- Ukuran: 7 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/components/ReceiptPreview.tsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";

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
  /** Judul dokumen saat print */
  printTitle?: string;
};

type PreviewWidth = "auto" | "58" | "80";

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
  const [previewWidth, setPreviewWidth] = useState<PreviewWidth>("auto");
  const STYLE_ID = "__receipt_preview_print_style";

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

  useEffect(() => {
    setLoaded(false);
  }, [html]);

  // Injeksi / update style ukuran kertas di dalam iframe
  const applyPaperStyles = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    // Hapus style lama (jika ada)
    const prev = doc.getElementById(STYLE_ID);
    if (prev && prev.parentNode) prev.parentNode.removeChild(prev);
    // Auto: biarkan CSS dari server/HTML apa adanya
    if (previewWidth === "auto") return;
    const mm = previewWidth === "58" ? 58 : 80;
    const style = doc.createElement("style");
    style.id = STYLE_ID;
    style.type = "text/css";
    // Minimal & non-intrusif: hanya set ukuran kertas & margin nol saat print
    // Tidak mengubah layout screen/preview server.
    style.textContent = `
      @media print {
        @page { size: ${mm}mm auto; margin: 0; }
        html, body { width: ${mm}mm !important; }
      }
    `;
    doc.head.appendChild(style);
  }, [previewWidth]);

  const handleLoad = () => {
    setLoaded(true);
    onLoaded?.();
    try { applyPaperStyles(); } catch { /* no-op */ }

    if (autoPrint) {
      // delay kecil supaya layout stabil sebelum print
      setTimeout(() => {
        const frameWin = iframeRef.current?.contentWindow;
        try {
          if (printTitle && frameWin?.document) frameWin.document.title = printTitle;
        } catch { /* no-op */ }
        frameWin?.focus();
        frameWin?.print();
      }, 50);
    }
  };

  useEffect(() => {
    if (!loaded) return;
    try { applyPaperStyles(); } catch { /* no-op */ }
  }, [loaded, applyPaperStyles]);

  const doPrint = () => {
    onPrint?.();
    const frameWin = iframeRef.current?.contentWindow;
    try {
      if (printTitle && frameWin?.document) frameWin.document.title = printTitle;
    } catch { /* no-op */ }
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

  // Lebar pratinjau (tidak memengaruhi hasil cetak), hanya untuk membantu lihat 58/80mm.
  const previewWidthClass =
    previewWidth === "58"
      ? "w-[240px]" // kira-kira 58mm untuk pratinjau layar
      : previewWidth === "80"
        ? "w-[320px]" // kira-kira 80mm untuk pratinjau layar
        : "w-full";

  return (
    <div
      className={`card border border-[color:var(--color-border)] rounded-lg shadow-elev-1 bg-[var(--color-surface)] ${className}`}
      aria-busy={html ? (loaded ? "false" : "true") : "false"}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[color:var(--color-border)]">
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold">Receipt Preview</div>
          <span className="text-xs text-gray-500 hidden sm:inline">
            Pratinjau tidak memengaruhi hasil print
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Preview width */}
          <label className="hidden sm:flex items-center gap-2 text-xs text-gray-600">
            <span>Preview Width</span>
            <select
              value={previewWidth}
              onChange={(e) => setPreviewWidth(e.target.value as PreviewWidth)}
              className="input py-1 px-2 h-8"
              aria-label="Lebar pratinjau"
            >
              <option value="auto">Auto</option>
              <option value="58">58mm</option>
              <option value="80">80mm</option>
            </select>
          </label>

          <button
            type="button"
            className="btn-outline"
            onClick={openInNewTab}
            disabled={!html}
            aria-disabled={!html}
            title="Buka di tab baru"
          >
            Open
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={doPrint}
            disabled={!loaded}
            aria-disabled={!loaded}
            title={loaded ? "Print" : "Menunggu render…"}
          >
            Print
          </button>
        </div>
      </div>

      {/* Body */}
      {!html ? (
        <div className="p-4 text-sm text-gray-500">Tidak ada HTML struk.</div>
      ) : (
        <div className="p-3">
          <div className="mx-auto">
            <div className={`mx-auto ${previewWidthClass}`}>
              {/* Skeleton overlay saat loading */}
              {!loaded && (
                <div
                  className="mb-2 h-8 w-28 rounded bg-black/10 animate-pulse"
                  aria-hidden="true"
                />
              )}
              <div className="rounded border border-[color:var(--color-border)] overflow-hidden bg-white">
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

```
</details>

### src/components/receivables/SettleReceivableDialog.tsx

- SHA: `b2b34e1e2b79`  
- Ukuran: 8 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/components/receivables/SettleReceivableDialog.tsx
import { useEffect, useMemo, useState } from "react";
import type { Receivable, ReceivableSettleResult } from "../../types/receivables";
import type { PaymentMethod } from "../../types/payments";
import { settleReceivable } from "../../api/receivables";
import { toIDR } from "../../utils/money";
import { openOrderReceipt } from "../../api/orders";
import type { Order } from "../../types/orders";
import { buildWhatsAppLink } from "../../utils/wa";

type Props = {
  open: boolean;
  receivable: Receivable | null;
  onClose: () => void;
  onSettled?: (r: Receivable) => void;
};

const METHODS: PaymentMethod[] = ["CASH", "QRIS", "TRANSFER"];

function extractOrderId(
  order: Order | { order: Order; [k: string]: unknown } | undefined
): string | null {
  if (!order) return null;
  if ("id" in order && typeof (order as Order).id === "string") {
    return (order as Order).id;
  }
  if ("order" in (order as { order: Order })) {
    return (order as { order: Order }).order?.id ?? null;
  }
  return null;
}

function buildReceiptMessage(receivable: Receivable, receiptUrl: string): string {
  const inv = receivable.order?.invoice_no ?? "-";
  const total = toIDR(receivable.order?.grand_total ?? 0);
  return [
    "Terima kasih atas pembayarannya.",
    `Kwitansi: ${receiptUrl}`,
    `No: ${inv}`,
    `Total: ${total}`,
    "— Salve Laundry",
  ].join("\n");
}

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

  const customerPhone =
    receivable?.order?.customer?.phone ||
    receivable?.order?.customer?.whatsapp ||
    "";
  const canWhatsApp = Boolean(customerPhone);

  if (!open || !receivable) return null;

  const onSubmit = async (withWA = false) => {
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
      const payload = res.data.data as ReceivableSettleResult;
      const next = payload.receivable;

      if (next.status === "SETTLED") {
        const orderId = payload.order_id ?? extractOrderId(payload.order as any);
        if (orderId && !withWA) {
          await openOrderReceipt(orderId, true);
        }
        const receiptUrl =
          payload.share_url /* prioritas: link publik */ ??
          payload.receipt_url ??
          (orderId ? `${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}/receipt` : "");

        if (withWA && receiptUrl && customerPhone) {
          const msg = buildReceiptMessage(receivable, receiptUrl);
          const wa = buildWhatsAppLink(customerPhone, msg);
          window.open(wa, "_blank");
        }
      }

      onSettled?.(next);
      onClose();
    } catch {
      setErr("Gagal memproses pelunasan. Periksa nominal/metode, atau coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settle-title"
    >
      <div className="w-full max-w-md rounded-lg border border-[color:var(--color-border)] bg-[var(--color-surface)] p-6 shadow-elev-2">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 id="settle-title" className="text-lg font-semibold tracking-tight">
              Pelunasan Piutang
            </h3>
            <p className="text-xs text-gray-600">Lengkapi detail pembayaran di bawah ini</p>
          </div>
        </div>

        {/* Info ringkas */}
        <div className="mb-4 grid grid-cols-2 gap-2 rounded-md border border-[color:var(--color-border)] bg-white p-3 text-sm">
          <div>
            <div className="text-gray-600">Invoice</div>
            <div className="font-medium">{receivable.order?.invoice_no ?? "-"}</div>
          </div>
          <div className="text-right">
            <div className="text-gray-600">Total</div>
            <div className="font-semibold">{toIDR(receivable.order?.grand_total ?? 0)}</div>
          </div>
          <div>
            <div className="text-gray-600">Terbayar</div>
            <div className="tabular-nums">{toIDR(receivable.order?.paid_amount ?? 0)}</div>
          </div>
          <div className="text-right">
            <div className="text-gray-600">Sisa</div>
            <span className="chip chip--subtle font-semibold">
              {toIDR(receivable.remaining_amount)}
            </span>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-3">
          <label className="block text-sm" htmlFor="amount">
            Nominal Pelunasan
            <input
              id="amount"
              type="number"
              min={0}
              max={receivable.remaining_amount}
              step="100"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="input mt-1"
              autoFocus
              inputMode="numeric"
            />
          </label>

          <label className="block text-sm" htmlFor="method">
            Metode
            <select
              id="method"
              className="input mt-1"
              value={method}
              onChange={(e) => setMethod(e.target.value as PaymentMethod)}
            >
              {METHODS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </label>

          <label className="block text-sm" htmlFor="paid_at">
            Tanggal Bayar
            <input
              id="paid_at"
              type="datetime-local"
              value={paidAt}
              onChange={(e) => setPaidAt(e.target.value)}
              className="input mt-1"
            />
          </label>

          <label className="block text-sm" htmlFor="note">
            Catatan (opsional)
            <input
              id="note"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="input mt-1"
            />
          </label>

          {err ? (
            <p role="alert" aria-live="polite" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {err}
            </p>
          ) : null}
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="btn-outline" type="button">
            Batal
          </button>

          <button
            onClick={() => onSubmit(false)}
            disabled={disabled}
            className="btn-primary disabled:opacity-50"
            type="button"
          >
            {loading ? "Memproses..." : "Lunasi"}
          </button>

          {canWhatsApp && (
            <button
              onClick={() => onSubmit(true)}
              disabled={disabled}
              title="Lunasi dan kirim link kwitansi via WhatsApp"
              type="button"
              className="btn text-[color:var(--color-brand-on)] disabled:opacity-50"
              style={{ background: "var(--color-status-success)" }}
            >
              {loading ? "Memproses..." : "Lunasi & Kirim WA"}
            </button>
          )}
        </div>
      </div>
    </div>
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

- SHA: `62d2f1a2ad8c`  
- Ukuran: 8 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/branches/BranchForm.tsx
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
      const withResp = err as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } };
      const fe = withResp.response?.data?.errors ?? {};
      if (fe && typeof fe === 'object') setFieldErrors(fe);
      setError(withResp.response?.data?.message ?? 'Gagal menyimpan');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <header>
        <h1 className="text-lg font-semibold tracking-tight">
          {editing ? 'Edit Branch' : 'New Branch'}
        </h1>
        <p className="text-xs text-gray-600">
          Lengkapi informasi cabang untuk penomoran invoice & identitas struk.
        </p>
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

      {/* Form Card */}
      <form onSubmit={onSubmit} className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1 max-w-xl">
        <div className="p-4 grid gap-4">
          {/* Kode */}
          <div className="grid gap-1">
            <label htmlFor="code" className="text-xs font-medium">
              Kode <span className="text-red-600">*</span>
            </label>
            <input
              id="code"
              className="input"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              aria-invalid={Boolean(fieldErrors.code)}
              aria-describedby={fieldErrors.code ? 'err-code' : undefined}
            />
            {fieldErrors.code && (
              <p id="err-code" className="text-xs text-red-600">{fieldErrors.code.join(', ')}</p>
            )}
          </div>

          {/* Nama */}
          <div className="grid gap-1">
            <label htmlFor="name" className="text-xs font-medium">
              Nama <span className="text-red-600">*</span>
            </label>
            <input
              id="name"
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? 'err-name' : undefined}
            />
            {fieldErrors.name && (
              <p id="err-name" className="text-xs text-red-600">{fieldErrors.name.join(', ')}</p>
            )}
          </div>

          {/* Alamat */}
          <div className="grid gap-1">
            <label htmlFor="address" className="text-xs font-medium">Alamat</label>
            <input
              id="address"
              className="input"
              value={form.address ?? ''}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          {/* Prefix Invoice */}
          <div className="grid gap-1">
            <label htmlFor="prefix" className="text-xs font-medium">
              Prefix Invoice (max 8) <span className="text-red-600">*</span>
            </label>
            <input
              id="prefix"
              className="input"
              value={form.invoice_prefix}
              maxLength={8}
              onChange={(e) => setForm({ ...form, invoice_prefix: e.target.value.toUpperCase() })}
              aria-invalid={Boolean(fieldErrors.invoice_prefix)}
              aria-describedby={fieldErrors.invoice_prefix ? 'err-prefix' : undefined}
            />
            {fieldErrors.invoice_prefix && (
              <p id="err-prefix" className="text-xs text-red-600">{fieldErrors.invoice_prefix.join(', ')}</p>
            )}
            <p className="text-[11px] text-gray-500">
              Contoh: <span className="font-mono">SLV</span>, <span className="font-mono">BRN</span>. Gunakan huruf/angka tanpa spasi.
            </p>
          </div>

          {/* Kebijakan Reset */}
          <div className="grid gap-1">
            <label htmlFor="reset" className="text-xs font-medium">
              Kebijakan Reset <span className="text-red-600">*</span>
            </label>
            <select
              id="reset"
              className="input"
              value={form.reset_policy}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setForm({ ...form, reset_policy: toResetPolicy(e.target.value) })
              }
              aria-invalid={Boolean(fieldErrors.reset_policy)}
              aria-describedby={fieldErrors.reset_policy ? 'err-reset' : undefined}
            >
              {POLICIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {fieldErrors.reset_policy && (
              <p id="err-reset" className="text-xs text-red-600">{fieldErrors.reset_policy.join(', ')}</p>
            )}
            <p className="text-[11px] text-gray-500">
              <span className="font-medium">monthly</span>: penomoran invoice direset setiap bulan. <span className="font-medium">never</span>: tidak pernah direset.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-[color:var(--color-border)] px-4 py-3 flex items-center gap-2">
          <button
            disabled={loading}
            className="btn-primary disabled:opacity-60"
            aria-busy={loading ? 'true' : 'false'}
          >
            {loading ? 'Menyimpan…' : 'Simpan'}
          </button>
          <button
            type="button"
            className="btn-outline"
            onClick={() => history.back()}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}

```
</details>

### src/pages/branches/BranchIndex.tsx

- SHA: `7b8bc435f5cc`  
- Ukuran: 8 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/branches/BranchIndex.tsx
import { useCallback, useEffect, useState } from 'react';
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

  useEffect(() => { void fetchPage(page); }, [fetchPage, page]);

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
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Branches</h1>
          <p className="text-xs text-gray-500">Kelola cabang & konfigurasi penomoran faktur.</p>
        </div>
        {canManage && (
          <div className="space-x-2">
            <button className="btn-primary" onClick={() => nav('/branches/new')}>
              New Branch
            </button>
          </div>
        )}
      </header>

      {/* Toolbar (search) */}
      <section
        className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1"
        aria-label="Toolbar pencarian cabang"
      >
        <div className="p-3 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
          <label className="sr-only" htmlFor="search-branch">Pencarian</label>
          <div className="relative">
            <input
              id="search-branch"
              className="input w-full pl-9 py-2"
              placeholder="Cari nama/kode…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Cari cabang"
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
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
      {!loading && !error && rows.length === 0 && (
        <div className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1 p-6 text-sm text-gray-500">
          Belum ada data cabang.
        </div>
      )}

      {/* Table (konsisten dengan Customers) */}
      <section aria-busy={loading ? 'true' : 'false'}>
        <div className="card overflow-hidden border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#E6EDFF] sticky top-0 z-10">
                <tr className="divide-x divide-[color:var(--color-border)]">
                  <Th>Kode</Th>
                  <Th>Nama</Th>
                  <Th>Prefix Invoice</Th>
                  <Th>Reset</Th>
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
                  </>
                ) : (
                  rows.map((b) => (
                    <tr key={b.id} className="hover:bg-black/5 transition-colors">
                      <Td><span className="font-medium">{b.code}</span></Td>
                      <Td><span className="line-clamp-1">{b.name}</span></Td>
                      <Td>{b.invoice_prefix ?? '—'}</Td>
                      <Td className="uppercase">{b.reset_policy ?? '—'}</Td>
                      <Td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="btn-outline px-2 py-1 text-xs"
                            onClick={() => nav(`/branches/${b.id}/edit`)}
                            aria-label={`Edit cabang ${b.name}`}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-outline px-2 py-1 text-xs"
                            onClick={() => nav(`/branches/${b.id}/invoice-settings`)}
                            aria-label={`Pengaturan invoice cabang ${b.name}`}
                          >
                            Invoice
                          </button>
                          {canManage && (
                            <button
                              className="btn-outline px-2 py-1 text-xs text-red-600"
                              onClick={async () => {
                                if (!confirm(`Hapus cabang ${b.name}?`)) return;
                                try {
                                  await deleteBranch(b.id);
                                  await fetchPage(page);
                                } catch {
                                  alert('Gagal menghapus');
                                }
                              }}
                              aria-label={`Hapus cabang ${b.name}`}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pagination (konsisten) */}
      {!loading && meta && meta.last_page > 1 && (
        <nav className="flex items-center gap-2 justify-end" aria-label="Navigasi halaman">
          <button
            disabled={(meta.current_page ?? 1) <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="btn-outline disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm">
            Page {meta.current_page} / {meta.last_page}
          </span>
          <button
            disabled={meta.current_page >= meta.last_page}
            onClick={() => setPage((p) => p + 1)}
            className="btn-outline disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}

/* ---------- Subcomponents (konsisten dgn Customers) ---------- */
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
      <td className="px-3 py-3"><div className="h-4 w-24 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-40 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-28 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-16 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3 text-right">
        <div className="inline-block h-8 w-28 rounded bg-black/10 animate-pulse" />
      </td>
    </tr>
  );
}

```
</details>

### src/pages/branches/InvoiceSettings.tsx

- SHA: `f26e77ae11b8`  
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
        seq: (res.data?.[0]?.seq ?? 0),
      }));
      setPreview(null);
    } catch {
      setError('Gagal memuat konfigurasi invoice');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { void refresh(); }, [refresh]);

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
    <div className="space-y-4 max-w-4xl">
      {/* Header */}
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Invoice Settings</h1>
          <p className="text-xs text-gray-600">
            Branch: <strong>{branch?.code}</strong> — {branch?.name}
          </p>
        </div>
        <div className="text-xs text-gray-500">
          Prefix default: <span className="font-mono">{branch?.invoice_prefix ?? '—'}</span>
        </div>
      </header>

      {/* Error & Loading */}
      {error && (
        <div role="alert" aria-live="polite" className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
          {error}
        </div>
      )}
      {loading && !rows.length && (
        <div className="text-sm text-gray-500">Memuat…</div>
      )}

      {/* Daftar Counter */}
      <section className="space-y-2">
        <h2 className="font-medium">Daftar Counter</h2>

        <div className="card overflow-hidden border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#E6EDFF] sticky top-0 z-10">
                <tr className="divide-x divide-[color:var(--color-border)]">
                  <Th>Prefix</Th>
                  <Th>Reset</Th>
                  <Th>Sequence</Th>
                  <Th>Last Month</Th>
                  <Th className="text-right pr-4">Aksi</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color:var(--color-border)]">
                {loading && rows.length === 0 ? (
                  <>
                    <RowSkeleton />
                    <RowSkeleton />
                    <RowSkeleton />
                  </>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-4 text-center text-gray-500">Belum ada counter</td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id} className="hover:bg-black/5 transition-colors">
                      <Td><span className="font-medium">{r.prefix}</span></Td>
                      <Td className="uppercase">{r.reset_policy}</Td>
                      <Td className="tabular-nums">{r.seq}</Td>
                      <Td>{r.last_reset_month ?? '-'}</Td>
                      <Td className="text-right">
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          <button
                            className="btn-outline text-xs"
                            onClick={async () => {
                              const raw = prompt('Prefix baru (2–8 huruf kapital A–Z):', r.prefix) ?? r.prefix;
                              const prefix = (raw || '').toUpperCase().slice(0, 8);
                              if (!/^[A-Z]{2,8}$/.test(prefix)) { alert('Prefix tidak valid'); return; }
                              try {
                                await updateInvoiceCounter(r.id, { prefix, reset_policy: r.reset_policy, seq: r.seq });
                                await refresh();
                              } catch { alert('Gagal update'); }
                            }}
                          >
                            Ubah Prefix
                          </button>
                          <button
                            className="btn-outline text-xs"
                            onClick={async () => {
                              const policy = (prompt('Reset policy (monthly/never):', r.reset_policy) ?? r.reset_policy) as ResetPolicy;
                              if (!['monthly', 'never'].includes(policy)) { alert('Reset policy tidak valid'); return; }
                              try {
                                await updateInvoiceCounter(r.id, { prefix: r.prefix, reset_policy: policy, seq: r.seq });
                                await refresh();
                              } catch { alert('Gagal update'); }
                            }}
                          >
                            Ubah Reset
                          </button>
                          <button
                            className="btn-outline text-xs"
                            onClick={async () => {
                              const v = prompt('Sequence baru (0–999999):', String(r.seq));
                              if (v == null) return;
                              const n = Number(v);
                              if (!Number.isFinite(n) || n < 0 || n > 999999) { alert('Sequence tidak valid'); return; }
                              try {
                                await updateInvoiceCounter(r.id, { prefix: r.prefix, reset_policy: r.reset_policy, seq: Math.floor(n) });
                                await refresh();
                              } catch { alert('Gagal update sequence'); }
                            }}
                          >
                            Ubah Sequence
                          </button>
                          <button
                            className="btn-outline text-xs"
                            onClick={async () => { await onResetNow(r.id); }}
                          >
                            Reset Now
                          </button>
                          <button
                            className="btn-outline text-xs !text-red-600"
                            onClick={async () => {
                              if (!confirm('Hapus counter ini?')) return;
                              try { await deleteInvoiceCounter(r.id); await refresh(); } catch { alert('Gagal hapus'); }
                            }}
                          >
                            Hapus
                          </button>
                        </div>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Tambah Counter */}
      <section className="space-y-2">
        <h2 className="font-medium">Tambah Counter</h2>

        <form className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1 p-3 grid sm:grid-cols-4 gap-3 items-end" onSubmit={onSaveNew}>
          <div className="grid gap-1">
            <label className="text-xs" htmlFor="prefix">Prefix *</label>
            <input
              id="prefix"
              className="input font-mono uppercase"
              value={form.prefix}
              onChange={(e) => setForm({ ...form, prefix: e.target.value.toUpperCase().slice(0, 8) })}
              placeholder="INV"
              aria-invalid={!valid}
            />
          </div>

          <div className="grid gap-1">
            <label className="text-xs" htmlFor="reset">Reset *</label>
            <select
              id="reset"
              className="input"
              value={form.reset_policy}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setForm({ ...form, reset_policy: toResetPolicy(e.target.value) })
              }
            >
              {POLICIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="grid gap-1">
            <label className="text-xs" htmlFor="seq">Sequence *</label>
            <input
              id="seq"
              type="number"
              min={0}
              max={999999}
              step={1}
              className="input font-mono"
              value={form.seq ?? 0}
              onChange={(e) => {
                const n = Number(e.target.value);
                const v = Number.isFinite(n) ? Math.max(0, Math.min(999999, Math.floor(n))) : 0;
                setForm({ ...form, seq: v });
              }}
            />
          </div>

          <div className="flex items-end gap-2">
            <button className="btn-primary" disabled={!valid}>Tambah</button>
            <button
              type="button"
              onClick={onPreview}
              className="btn-outline text-xs"
              disabled={loading}
            >
              Preview nomor berikutnya
            </button>
          </div>
        </form>

        {preview && (
          <div className="text-xs">
            Next <code>number</code>: <strong className="font-mono">{preview.number}</strong>
            {' '}— <code>invoice_no</code>: <strong className="font-mono">{preview.invoice_no}</strong>
          </div>
        )}

        <p className="text-xs text-gray-500">
          Kombinasi <code>branch_id + prefix</code> harus unik (constraint DB). Sequence bertambah saat invoice dipakai.
        </p>
      </section>
    </div>
  );
}

/* ---------- Subcomponents (konsisten dengan Customers) ---------- */
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
      <td className="px-3 py-3"><div className="h-4 w-24 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-20 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-16 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-24 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3 text-right"><div className="inline-block h-8 w-40 rounded bg-black/10 animate-pulse" /></td>
    </tr>
  );
}

```
</details>

### src/pages/customers/CustomerDetail.tsx

- SHA: `789a9690795f`  
- Ukuran: 19 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/customers/CustomerDetail.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { createCustomer, getCustomer, updateCustomer } from "../../api/customers";
import type { Customer, CustomerUpsertPayload, SingleResponse } from "../../types/customers";
import { useAuth } from "../../store/useAuth";

function IconArrowLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function IconUser(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M20 21a8 8 0 1 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function IconCopy(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <rect x="2" y="2" width="13" height="13" rx="2" opacity=".5" />
    </svg>
  );
}
function IconSave(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
      <path d="M17 21v-8H7v8" />
      <path d="M7 3v5h8" />
    </svg>
  );
}
function initials(name?: string) {
  const n = (name ?? "").trim();
  if (!n) return "C";
  const parts = n.split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "C";
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (a + b).toUpperCase();
}

export default function CustomerDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const isNew = !params.id || params.id === "new";
  const { hasRole, user } = useAuth;

  const canEdit = hasRole("Superadmin") || hasRole("Admin Cabang") || hasRole("Kasir");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CustomerUpsertPayload>({
    name: "",
    whatsapp: "",
    address: "",
    notes: "",
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
                address: res.data.address ?? "",
                notes: res.data.notes ?? "",
              });
            }
          }
        } catch {
          if (!cancelled) setError("Gagal memuat detail pelanggan.");
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
    }
    return () => {
      cancelled = true;
    };
  }, [isNew, params.id]);

  function normalizeWa(input: string): string {
    const s = (input || "").trim();
    return s.replace(/[^\d]/g, "");
  }

  // buang key undefined & konversi "" => null
  function clean<T extends Record<string, unknown>>(obj: T): Partial<T> {
    const out: Partial<T> = {};
    Object.entries(obj).forEach(([k, v]) => {
      if (v === undefined) return;
      if (typeof v === "string") {
        const t = v.trim();
        (out as Record<string, unknown>)[k] = t === "" ? null : t;
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
        if (hasRole("Superadmin")) {
          finalBranchId = form.branch_id && form.branch_id.trim() !== "" ? form.branch_id.trim() : undefined;
        } else {
          finalBranchId = user?.branch_id ? String(user.branch_id) : undefined;
          if (!finalBranchId) {
            setError("Akun Anda belum terikat ke cabang. Hubungi admin pusat.");
            setSaving(false);
            return;
          }
        }

        const payloadCreate: CustomerUpsertPayload = {
          name: String(cleanedBase.name ?? ""),
          whatsapp: String(cleanedBase.whatsapp ?? ""),
          address: (cleanedBase.address as string | null | undefined) ?? null,
          notes: (cleanedBase.notes as string | null | undefined) ?? null,
          ...(finalBranchId ? { branch_id: finalBranchId } : {}),
        };
        res = await createCustomer(payloadCreate);
      } else {
        if (!params.id) {
          setError("ID pelanggan tidak valid.");
          setSaving(false);
          return;
        }
        const cleanedUpdate = clean({
          name: form.name,
          whatsapp: normalizeWa(form.whatsapp),
          address: form.address,
          notes: form.notes,
          ...(hasRole("Superadmin") && form.branch_id && String(form.branch_id).trim() !== ""
            ? { branch_id: String(form.branch_id).trim() }
            : {}),
        });
        const payloadUpdate: Partial<CustomerUpsertPayload> = {
          ...(cleanedUpdate.name !== undefined ? { name: String(cleanedUpdate.name) } : {}),
          ...(cleanedUpdate.whatsapp !== undefined ? { whatsapp: String(cleanedUpdate.whatsapp) } : {}),
          ...(cleanedUpdate.address !== undefined ? { address: cleanedUpdate.address as string | null } : {}),
          ...(cleanedUpdate.notes !== undefined ? { notes: cleanedUpdate.notes as string | null } : {}),
          ...(hasRole("Superadmin") && cleanedUpdate.branch_id !== undefined ? { branch_id: String(cleanedUpdate.branch_id) } : {}),
        };
        res = await updateCustomer(params.id, payloadUpdate);
      }

      if (res?.data?.id) {
        navigate(`/customers/${String(res.data.id)}`);
      } else {
        setError("Gagal menyimpan data pelanggan.");
      }
    } catch (err) {
      const anyErr = err as { response?: { data?: unknown }; message?: string };
      const srv = (anyErr.response?.data as { message?: string; errors?: unknown } | undefined) || undefined;
      const msg = srv?.message ?? (srv?.errors ? JSON.stringify(srv.errors) : undefined) ?? anyErr.message;
      setError(msg ?? "Gagal menyimpan data pelanggan.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-7 w-56 rounded bg-black/10 animate-pulse" />
        <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_-18px_rgba(0,0,0,.35)] space-y-4">
          <div className="h-10 w-full rounded bg-black/10 animate-pulse" />
          <div className="h-10 w-full rounded bg-black/10 animate-pulse" />
          <div className="h-10 w-full rounded bg-black/10 animate-pulse" />
          <div className="h-24 w-full rounded bg-black/10 animate-pulse" />
          <div className="flex gap-2">
            <div className="h-10 w-32 rounded bg-black/10 animate-pulse" />
            <div className="h-10 w-28 rounded bg-black/10 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const title = isNew ? "Buat Customer" : "Detail Customer";
  const subtitle = "Data identitas pelanggan untuk transaksi, penjemputan, dan histori.";

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
            <IconUser />
          </div>
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs text-slate-500">
              <Link to="/customers" className="hover:underline">
                Customers
              </Link>
              <span className="text-slate-300">/</span>
              <span className="text-slate-700">{isNew ? "New" : "Detail"}</span>
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h1>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/customers"
            className="
              inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2
              text-sm font-semibold text-slate-900 hover:bg-slate-50 active:bg-slate-100
            "
            aria-label="Kembali ke daftar pelanggan"
          >
            <IconArrowLeft />
            Back
          </Link>

          {!isNew && entity && (
            <button
              type="button"
              className="
                inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2
                text-sm font-semibold text-slate-900 hover:bg-slate-50 active:bg-slate-100
              "
              onClick={() => navigator.clipboard.writeText(entity.whatsapp)}
              aria-label="Salin nomor WhatsApp"
            >
              <IconCopy />
              Copy WA
            </button>
          )}
        </div>
      </header>

      {/* Error global */}
      {error && (
        <div role="alert" aria-live="polite" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Card + Form */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <form
          onSubmit={onSubmit}
          aria-busy={saving ? "true" : "false"}
          className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_10px_30px_-18px_rgba(0,0,0,.35)]"
        >
          {/* top strip */}
          <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="text-sm font-semibold text-slate-900">Informasi Customer</div>
              <div className="mt-1 text-xs text-slate-500">Lengkapi data agar transaksi dan pengiriman lebih cepat.</div>
            </div>

            <button
              disabled={saving || !canEdit}
              className="
                inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5
                text-sm font-semibold text-white shadow-sm
                hover:bg-slate-800 active:bg-slate-950
                disabled:cursor-not-allowed disabled:opacity-70
              "
              type="submit"
              aria-label="Simpan pelanggan"
            >
              <IconSave />
              {saving ? "Menyimpan…" : "Simpan"}
            </button>
          </div>

          {/* Cabang */}
          <div className="mt-5">
            {hasRole("Superadmin") ? (
              <label className="grid gap-1">
                <span className="text-sm font-medium text-slate-700">Branch ID (Superadmin)</span>
                <input
                  placeholder="CTH: 019aa7... (opsional)"
                  className="
                    w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm
                    text-slate-900 placeholder:text-slate-400
                    focus:border-slate-900 focus:outline-none
                  "
                  value={form.branch_id ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      branch_id: e.target.value.trim() ? e.target.value.trim() : undefined,
                    }))
                  }
                />
                <span className="text-xs text-slate-500">Kosongkan untuk tidak mengubah cabang.</span>
              </label>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
                Cabang: <span className="font-semibold text-slate-900">{user?.branch_id ?? "-"}</span>
              </div>
            )}
          </div>

          {/* Fields */}
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-700">Nama</span>
              <input
                placeholder="Nama pelanggan"
                className="
                  w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm
                  text-slate-900 placeholder:text-slate-400
                  focus:border-slate-900 focus:outline-none
                "
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                autoComplete="name"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm font-medium text-slate-700">WhatsApp</span>
              <input
                placeholder="08xxxxxxxxxx"
                className="
                  w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm
                  text-slate-900 placeholder:text-slate-400
                  focus:border-slate-900 focus:outline-none
                "
                value={form.whatsapp}
                onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                required
                inputMode="tel"
                autoComplete="tel"
              />
              <span className="text-xs text-slate-500">Hanya angka. Akan dinormalisasi saat simpan.</span>
            </label>

            <label className="grid gap-1 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">Alamat</span>
              <input
                placeholder="Alamat lengkap (opsional)"
                className="
                  w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm
                  text-slate-900 placeholder:text-slate-400
                  focus:border-slate-900 focus:outline-none
                "
                value={form.address ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                autoComplete="street-address"
              />
            </label>

            <label className="grid gap-1 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">Catatan</span>
              <textarea
                placeholder="Instruksi khusus, preferensi, atau catatan lain"
                className="
                  min-h-[110px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm
                  text-slate-900 placeholder:text-slate-400
                  focus:border-slate-900 focus:outline-none
                "
                value={form.notes ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </label>
          </div>

          {/* bottom actions (secondary, for consistency) */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button
              disabled={saving || !canEdit}
              className="
                inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2.5
                text-sm font-semibold text-slate-900 hover:bg-slate-50 active:bg-slate-100
                disabled:cursor-not-allowed disabled:opacity-70
              "
              type="submit"
            >
              {saving ? "Menyimpan…" : "Simpan"}
            </button>

            {!isNew && entity && (
              <button
                type="button"
                className="
                  inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5
                  text-sm font-semibold text-slate-900 hover:bg-slate-50 active:bg-slate-100
                "
                onClick={() => navigator.clipboard.writeText(entity.whatsapp)}
                aria-label="Salin nomor WhatsApp"
              >
                <IconCopy />
                Salin WA
              </button>
            )}
          </div>
        </form>

        {/* Side card (ringkasan) */}
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_-18px_rgba(0,0,0,.35)]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
              {initials(form.name)}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-slate-900">{form.name?.trim() || "Customer"}</div>
              <div className="truncate text-xs text-slate-500">{isNew ? "Draft (belum tersimpan)" : `ID: ${String(entity?.id ?? "-")}`}</div>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-sm">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <div className="text-xs text-slate-500">WhatsApp</div>
              <div className="mt-0.5 font-semibold tabular-nums text-slate-900">{form.whatsapp || "-"}</div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <div className="text-xs text-slate-500">Cabang</div>
              <div className="mt-0.5 font-semibold text-slate-900">
                {hasRole("Superadmin") ? form.branch_id ?? "-" : user?.branch_id ?? "-"}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              <div className="text-xs text-slate-500">Alamat</div>
              <div className="mt-0.5 text-slate-700">{form.address?.trim() ? form.address : "-"}</div>
            </div>
          </div>

          {!canEdit && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Anda tidak memiliki izin untuk mengubah data customer.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

```
</details>

### src/pages/customers/CustomersIndex.tsx

- SHA: `e4cf8f6c2eb4`  
- Ukuran: 19 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/customers/CustomersIndex.tsx
import { useEffect, useMemo, useState } from "react";
import type { Customer, CustomerQuery, Paginated } from "../../types/customers";
import { listCustomers } from "../../api/customers";
import { useAuth, useHasRole } from "../../store/useAuth";
import { Link } from "react-router-dom";

function IconSearch(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.2-3.2" />
        </svg>
    );
}
function IconUsers(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path d="M20 21a7 7 0 0 0-14 0" />
            <circle cx="13" cy="7" r="4" />
            <path d="M6 21a6 6 0 0 1 7-5.7" opacity=".6" />
            <path d="M4 21a6 6 0 0 1 6-6" opacity=".35" />
        </svg>
    );
}
function IconChevron(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
            <path d="M9 6l6 6-6 6" />
        </svg>
    );
}

function initials(name?: string) {
    const n = (name ?? "").trim();
    if (!n) return "C";
    const parts = n.split(/\s+/).filter(Boolean);
    const a = parts[0]?.[0] ?? "C";
    const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
    return (a + b).toUpperCase();
}

function formatWaLink(raw?: string) {
    if (!raw) return null;
    const cleaned = raw.replace(/[^\d]/g, "");
    if (!cleaned) return null;

    // jika mulai dengan 0 → ganti ke 62
    const normalized =
        cleaned.startsWith("0")
            ? "62" + cleaned.slice(1)
            : cleaned.startsWith("62")
                ? cleaned
                : cleaned;

    return `https://wa.me/${normalized}`;
}

function mapsUrl(address?: string | null) {
    const a = (address ?? "").trim();
    if (!a) return null;
    // Google Maps search query (paling stabil untuk alamat teks bebas)
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a)}`;
}

export default function CustomersIndex() {
    // Snapshot auth store (sesuai pola Anda)
    function useAuthSnapshot() {
        const store = useAuth;
        const [, force] = useState(0);
        useEffect(() => {
            const unsubscribe = store.subscribe(() => force((x) => x + 1));
            return () => {
                unsubscribe();
            };
        }, [store]);
        return store;
    }

    const auth = useAuthSnapshot();
    const user = auth.user;
    const canManage = useHasRole(["Superadmin", "Admin Cabang", "Kasir"]);
    const isSuperadmin = useHasRole("Superadmin");

    const [query, setQuery] = useState<CustomerQuery>({ page: 1, per_page: 10 });
    const [rows, setRows] = useState<Paginated<Customer> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    const branchIdForScope = useMemo(() => {
        if (isSuperadmin) return query.branch_id ?? undefined;
        const id = user?.branch_id as string | number | undefined;
        if (typeof id === "string") return id;
        if (typeof id === "number") return String(id);
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
                if (!cancelled) setError("Gagal memuat data pelanggan.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [query, search, branchIdForScope]);

    const currentPage = rows?.meta.current_page ?? 1;
    const lastPage = rows?.meta.last_page ?? 1;
    const perPage = query.per_page ?? 10;
    const total = rows?.meta.total ?? 0;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                        <IconUsers />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Customers</h1>
                        <p className="mt-1 text-sm text-slate-500">Kelola data pelanggan dan akses detail histori.</p>
                    </div>
                </div>

                {canManage && (
                    <Link
                        to="/customers/new"
                        className="
              inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5
              text-sm font-semibold text-white shadow-sm
              hover:bg-slate-800 active:bg-slate-950
            "
                        aria-label="Tambah pelanggan baru"
                    >
                        New Customer
                    </Link>
                )}
            </div>

            {/* Toolbar */}
            <section
                className="rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_10px_30px_-18px_rgba(0,0,0,.35)]"
                aria-label="Toolbar pencarian pelanggan"
            >
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div className="relative">
                        <label className="sr-only" htmlFor="cari">
                            Pencarian
                        </label>
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <IconSearch />
                        </span>
                        <input
                            id="cari"
                            placeholder="Cari nama / WhatsApp / alamat…"
                            className="
                w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-2.5 text-sm
                text-slate-900 placeholder:text-slate-400
                focus:border-slate-900 focus:outline-none
              "
                            value={search}
                            onChange={(e) => {
                                setQuery((q) => ({ ...q, page: 1 }));
                                setSearch(e.target.value);
                            }}
                            aria-label="Cari pelanggan"
                        />
                    </div>

                    <div className="flex items-center justify-between gap-2 sm:justify-end">
                        <div className="text-xs text-slate-500">
                            {loading ? "Memuat…" : total ? `${total} pelanggan` : "0 pelanggan"}
                        </div>

                        <div className="relative">
                            <label className="sr-only" htmlFor="perpage">
                                Per page
                            </label>
                            <select
                                id="perpage"
                                className="
                  appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm
                  text-slate-900 focus:border-slate-900 focus:outline-none
                "
                                value={perPage}
                                onChange={(e) => setQuery((q) => ({ ...q, per_page: Number(e.target.value), page: 1 }))}
                                aria-label="Jumlah baris per halaman"
                            >
                                <option value={10}>10 / page</option>
                                <option value={25}>25 / page</option>
                                <option value={50}>50 / page</option>
                            </select>
                            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                                <IconChevron />
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Error */}
            {error && (
                <div role="alert" aria-live="polite" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Empty */}
            {!loading && !error && rows && rows.data.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-[0_10px_30px_-18px_rgba(0,0,0,.35)]">
                    Belum ada data pelanggan.
                </div>
            )}

            {/* Table */}
            <section aria-busy={loading ? "true" : "false"}>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_-18px_rgba(0,0,0,.35)]">
                    <div className="overflow-auto">
                        <table className="min-w-full text-sm">
                            <thead className="sticky top-0 z-10 bg-white">
                                <tr className="border-b border-slate-200">
                                    <Th className="pl-4">Customer</Th>
                                    <Th>WhatsApp</Th>
                                    <Th>Alamat</Th>
                                    <Th className="pr-4 text-right">Aksi</Th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
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
                                        <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                                            <Td className="pl-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                                                        {initials(c.name)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="truncate font-medium text-slate-900">{c.name}</div>
                                                        <div className="truncate text-xs text-slate-500">ID: {String(c.id)}</div>
                                                    </div>
                                                </div>
                                            </Td>

                                            <Td>
                                                {formatWaLink(c.whatsapp) ? (
                                                    <a
                                                        href={formatWaLink(c.whatsapp) ?? "#"}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="
         tabular-nums font-medium text-emerald-600
         hover:underline hover:text-emerald-700
       "
                                                        aria-label={`Hubungi ${c.name} via WhatsApp`}
                                                    >
                                                        {c.whatsapp}
                                                    </a>
                                                ) : (
                                                    <span className="tabular-nums text-slate-800">
                                                        {c.whatsapp ?? "-"}
                                                    </span>
                                                )}
                                            </Td>

                                            <Td>
                                                {mapsUrl(c.address) ? (
                                                    <a
                                                        href={mapsUrl(c.address)!}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="
         line-clamp-2 max-w-[56ch] text-slate-700
         hover:text-slate-900 hover:underline
       "
                                                        title="Buka di Google Maps"
                                                        aria-label={`Buka alamat ${c.name} di Google Maps`}
                                                    >
                                                        {c.address}
                                                    </a>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </Td>

                                            <Td className="pr-4 text-right">
                                                <Link
                                                    to={`/customers/${String(c.id)}`}
                                                    className="
                            inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2
                            text-xs font-semibold text-slate-900
                            hover:bg-slate-50 active:bg-slate-100
                          "
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

                    {/* footer summary */}
                    <div className="flex flex-col gap-2 border-t border-slate-200 px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            {total ? (
                                <>
                                    Menampilkan{" "}
                                    <span className="font-semibold text-slate-700">
                                        {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, total)}
                                    </span>{" "}
                                    dari <span className="font-semibold text-slate-700">{total}</span>
                                </>
                            ) : (
                                "Tidak ada data untuk ditampilkan"
                            )}
                        </div>

                        {/* Pagination */}
                        {!loading && rows && rows.meta.last_page > 1 && (
                            <nav className="flex items-center gap-2 justify-end" aria-label="Navigasi halaman">
                                <button
                                    disabled={currentPage <= 1}
                                    onClick={() => setQuery((q) => ({ ...q, page: (q.page ?? 1) - 1 }))}
                                    className="
                    rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900
                    hover:bg-slate-50 active:bg-slate-100
                    disabled:cursor-not-allowed disabled:opacity-50
                  "
                                >
                                    Prev
                                </button>

                                <span className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                                    Page <span className="font-semibold text-slate-900">{currentPage}</span> / {lastPage}
                                </span>

                                <button
                                    disabled={currentPage >= lastPage}
                                    onClick={() => setQuery((q) => ({ ...q, page: (q.page ?? 1) + 1 }))}
                                    className="
                    rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900
                    hover:bg-slate-50 active:bg-slate-100
                    disabled:cursor-not-allowed disabled:opacity-50
                  "
                                >
                                    Next
                                </button>
                            </nav>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

/* ---------- Subcomponents ---------- */
function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <th className={`text-left px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${className}`}>
            {children}
        </th>
    );
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <td className={`px-3 py-3 align-top ${className}`}>{children}</td>;
}
function RowSkeleton() {
    return (
        <tr>
            <td className="px-3 py-4 pl-4">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-black/10 animate-pulse" />
                    <div className="space-y-2">
                        <div className="h-4 w-40 rounded bg-black/10 animate-pulse" />
                        <div className="h-3 w-20 rounded bg-black/10 animate-pulse" />
                    </div>
                </div>
            </td>
            <td className="px-3 py-4">
                <div className="h-4 w-32 rounded bg-black/10 animate-pulse" />
            </td>
            <td className="px-3 py-4">
                <div className="h-4 w-64 rounded bg-black/10 animate-pulse" />
            </td>
            <td className="px-3 py-4 pr-4 text-right">
                <div className="inline-block h-9 w-20 rounded bg-black/10 animate-pulse" />
            </td>
        </tr>
    );
}

```
</details>

### src/pages/dashboard/DashboardHome.tsx

- SHA: `bf13b07751f2`  
- Ukuran: 15 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/dashboard/DashboardHome.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { listBranches } from "../../api/branches";
import { getDashboardSummary } from "../../api/dashboard";
import type { Branch } from "../../types/branches";
import type { DashboardSummary, DashboardSummaryMeta } from "../../types/dashboard";
import { toIDR } from "../../utils/money";
import { useAuth, useHasRole } from "../../store/useAuth";

type Meta = DashboardSummaryMeta;

function today(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}
function firstDayThisMonth(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-01`;
}

export default function DashboardHome() {
  const me = useAuth.user;
  const isSuperadmin = useHasRole(["Superadmin"]);

  // filter
  const [branchList, setBranchList] = useState<Branch[]>([]);
  const [branchId, setBranchId] = useState<string>(() => {
    if (!isSuperadmin && me?.branch_id) return String(me.branch_id);
    return "";
  });
  const [from, setFrom] = useState<string>(firstDayThisMonth());
  const [to, setTo] = useState<string>(today());

  // data
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>("");

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
    setErr("");
    try {
      if (isSuperadmin && branchList.length === 0) {
        const br = await listBranches({ per_page: 100 });
        setBranchList(br.data ?? []);
      }
      const res = await getDashboardSummary(q);
      setData(res.data ?? null);
      setMeta((res.meta as Meta) ?? null);
    } catch (e) {
      setErr("Gagal memuat ringkasan dashboard");
      if (import.meta.env.DEV) console.error("[DashboardHome] load error", e);
    } finally {
      setLoading(false);
    }
  }, [q, isSuperadmin, branchList.length]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-base sm:text-lg font-semibold tracking-tight text-[color:var(--color-text-default)]">
            Dashboard
          </h1>
          <p className="text-xs text-gray-600">Ringkasan kinerja & laporan</p>
        </div>

        <div className="text-xs text-gray-500">
          {meta?.from ?? from} — {meta?.to ?? to}
          {meta?.branch_id ? ` • Cabang: ${meta.branch_id}` : ""}
        </div>
      </header>

      {/* FilterBar */}
      <section
        className="bg-[var(--color-surface)] border border-[color:var(--color-border)] rounded-xl shadow-elev-1"
        aria-label="Filter ringkas dashboard"
      >
        <div className="p-3 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {isSuperadmin && (
              <label className="grid gap-1 text-sm">
                <span className="text-[color:var(--color-text-default)]">Cabang</span>
                <select
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className="input px-3 py-2 bg-white text-[color:var(--color-text-default)]"
                >
                  <option value="">Semua Cabang</option>
                  {branchList.map((b) => (
                    <option key={b.id} value={String(b.id)}>
                      {b.name}
                    </option>
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
                className="input px-3 py-2 bg-white"
              />
            </label>

            <label className="grid gap-1 text-sm">
              <span className="text-[color:var(--color-text-default)]">Sampai Tanggal</span>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="input px-3 py-2 bg-white"
              />
            </label>

            <div className={`${isSuperadmin ? "lg:col-span-2" : "lg:col-span-3"} flex items-end gap-2`}>
              <button
                type="button"
                onClick={() => load()}
                className="btn-primary w-full sm:w-auto"
                aria-label="Terapkan filter"
              >
                Terapkan
              </button>
              <button
                type="button"
                onClick={() => {
                  setFrom(firstDayThisMonth());
                  setTo(today());
                }}
                className="btn-outline w-full sm:w-auto"
                aria-label="Reset tanggal"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Error */}
      {err ? (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2"
        >
          {err}
        </div>
      ) : null}

      {/* KPI Cards (mobile: horizontal scroll) */}
      <section aria-busy={loading ? "true" : "false"}>
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-6 gap-3">
          <KpiCard title="Omzet" value={toIDR(Number(data?.omzet_total ?? 0))} loading={loading} />
          <KpiCard title="Transaksi" value={String(data?.orders_count ?? 0)} loading={loading} />
          <KpiCard
            title="Voucher Terpakai"
            value={`${data?.vouchers_used_count ?? 0} (${toIDR(Number(data?.vouchers_used_amount ?? 0))})`}
            loading={loading}
          />
          <KpiCard title="Ongkir" value={toIDR(Number(data?.delivery_shipping_fee ?? 0))} loading={loading} />
          <KpiCard
            title="Piutang Terbuka"
            value={`${data?.receivables_open_count ?? 0} (${toIDR(Number(data?.receivables_open_amount ?? 0))})`}
            loading={loading}
          />
          <KpiCard
            title="Outstanding DP"
            value={`${data?.dp_outstanding_count ?? 0} (${toIDR(Number(data?.dp_outstanding_amount ?? 0))})`}
            loading={loading}
          />
        </div>

        <div className="md:hidden -mx-4 px-4 overflow-x-auto">
          <div className="flex gap-3 min-w-max pb-1">
            <KpiCard title="Omzet" value={toIDR(Number(data?.omzet_total ?? 0))} loading={loading} compact />
            <KpiCard title="Transaksi" value={String(data?.orders_count ?? 0)} loading={loading} compact />
            <KpiCard
              title="Voucher"
              value={`${data?.vouchers_used_count ?? 0} (${toIDR(Number(data?.vouchers_used_amount ?? 0))})`}
              loading={loading}
              compact
            />
            <KpiCard title="Ongkir" value={toIDR(Number(data?.delivery_shipping_fee ?? 0))} loading={loading} compact />
            <KpiCard
              title="Piutang"
              value={`${data?.receivables_open_count ?? 0} (${toIDR(Number(data?.receivables_open_amount ?? 0))})`}
              loading={loading}
              compact
            />
            <KpiCard
              title="DP"
              value={`${data?.dp_outstanding_count ?? 0} (${toIDR(Number(data?.dp_outstanding_amount ?? 0))})`}
              loading={loading}
              compact
            />
          </div>
        </div>
      </section>

      {/* Top Layanan */}
      <section className="space-y-2">
        <div className="flex items-end justify-between">
          <h2 className="text-sm font-semibold text-[color:var(--color-text-default)]">Top Layanan</h2>
          <span className="text-xs text-gray-500">Top layanan berdasarkan pendapatan</span>
        </div>

        <div className="bg-[var(--color-surface)] rounded-xl border border-[color:var(--color-border)] shadow-elev-1 overflow-hidden">
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
                  <tr>
                    <td colSpan={3} className="px-3 py-4 text-center text-gray-500">
                      Belum ada data
                    </td>
                  </tr>
                ) : (
                  (data?.top_services ?? []).map((r) => (
                    <tr key={`${r.service_id}-${r.name}`} className="hover:bg-black/5 transition-colors">
                      <Td className="font-medium">{r.name}</Td>
                      <Td className="text-right tabular-nums">{r.qty}</Td>
                      <Td className="text-right tabular-nums">{toIDR(Number(r.amount))}</Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Omzet harian & bulanan */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <SimpleTable
          title="Omzet Harian"
          subtitle="Ringkasan omzet per tanggal"
          cols={[
            { label: "Tanggal", align: "left" },
            { label: "Omzet", align: "right" },
          ]}
          loading={loading}
          empty={(data?.omzet_daily?.length ?? 0) === 0}
        >
          {(data?.omzet_daily ?? []).map((d) => (
            <tr key={d.date} className="hover:bg-black/5 transition-colors">
              <Td className="tabular-nums">{d.date}</Td>
              <Td className="text-right tabular-nums">{toIDR(Number(d.amount))}</Td>
            </tr>
          ))}
        </SimpleTable>

        <SimpleTable
          title="Omzet Bulanan"
          subtitle="Ringkasan omzet per bulan"
          cols={[
            { label: "Bulan", align: "left" },
            { label: "Omzet", align: "right" },
          ]}
          loading={loading}
          empty={(data?.omzet_monthly?.length ?? 0) === 0}
        >
          {(data?.omzet_monthly ?? []).map((m) => (
            <tr key={m.month} className="hover:bg-black/5 transition-colors">
              <Td className="tabular-nums">{m.month}</Td>
              <Td className="text-right tabular-nums">{toIDR(Number(m.amount))}</Td>
            </tr>
          ))}
        </SimpleTable>
      </section>

      {/* Meta (bottom) */}
      <footer className="text-xs text-gray-500">
        Rentang data: {meta?.from ?? from} s.d. {meta?.to ?? to}
        {meta?.branch_id ? ` • Cabang: ${meta.branch_id}` : ""}
      </footer>
    </div>
  );
}

/* ------------------------
   Subcomponents (UI only)
------------------------ */

function KpiCard(props: { title: string; value: string; loading?: boolean; compact?: boolean }) {
  return (
    <div
      className={[
        "bg-[var(--color-surface)] rounded-xl border border-[color:var(--color-border)] shadow-elev-1",
        props.compact ? "p-3 w-[240px] shrink-0" : "p-3",
      ].join(" ")}
    >
      <div className="text-[11px] uppercase tracking-wide text-gray-500">{props.title}</div>
      <div className="mt-1 text-lg font-semibold min-h-[28px] text-[color:var(--color-text-default)]">
        {props.loading ? <span className="inline-block h-5 w-24 rounded bg-black/10 animate-pulse" /> : props.value}
      </div>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`text-left px-3 py-2 text-[11px] font-semibold uppercase tracking-wide ${className}`}>
      {children}
    </th>
  );
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
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
  subtitle?: string;
  cols: { label: string; align?: "left" | "right" }[];
  loading: boolean;
  empty: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[color:var(--color-text-default)]">{props.title}</h2>
          {props.subtitle ? <p className="text-xs text-gray-500">{props.subtitle}</p> : null}
        </div>
      </div>

      <div className="bg-[var(--color-surface)] rounded-xl border border-[color:var(--color-border)] shadow-elev-1 overflow-hidden">
        <div className="overflow-auto">
          <table className="min-w-[420px] w-full text-sm">
            <thead className="bg-[#E6EDFF] text-[color:var(--color-text-default)] sticky top-0 z-10">
              <tr className="divide-x divide-[color:var(--color-border)]">
                {props.cols.map((c) => (
                  <Th key={c.label} className={c.align === "right" ? "text-right" : "text-left"}>
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

- SHA: `8c04c5408bb6`  
- Ukuran: 10 KB
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
            let photo: File | null = null;
            if (status === 'HANDOVER' && file) {
                if (file.size > 4 * 1024 * 1024) { // 4MB
                    dbg.warn('blocked: file too large (>4MB)');
                    return;
                }
                photo = file;
            }
            await updateDeliveryStatus(row.id, { status, note: null, photo });
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
            {/* Header */}
            <header className="flex items-start justify-between">
                <div>
                    <h1 className="text-lg font-semibold tracking-tight">Delivery Detail</h1>
                    <div className="text-xs text-gray-600">ID: {row.id}</div>
                </div>
                <span className={statusChipClass(row.status)} aria-label={`Status: ${row.status}`}>
                    {row.status}
                </span>
            </header>

            {/* Card: Info utama */}
            <section className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1">
                <div className="p-4 grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                        <InfoLine label="Order">
                            <span className="font-medium">{row.order_id}</span>
                        </InfoLine>
                        <InfoLine label="Tipe">
                            <span>{row.type}</span>
                        </InfoLine>
                        <InfoLine label="Fee">
                            <span className="tabular-nums">
                                {Number(row.fee).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                            </span>
                        </InfoLine>
                    </div>

                    <div className="grid gap-2">
                        <label className="text-xs text-gray-600">Kurir</label>
                        <AssignCourierSelect
                            value={row.assigned_to ?? null}
                            onChange={onAssign}
                            disabled={!canAssign}
                        />
                    </div>
                </div>
            </section>

            {/* Card: Progress & aksi */}
            <section className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1">
                <div className="p-4 space-y-3">
                    <DeliveryStatusStepper status={row.status} />

                    <div className="grid gap-3 md:grid-cols-[240px_1fr] items-center">
                        <div className="grid gap-1">
                            <label htmlFor="status" className="text-xs text-gray-600">Ubah status</label>
                            <select
                                id="status"
                                className="input py-2"
                                value={row.status}
                                onChange={(e) => {
                                    const next = e.target.value as DeliveryStatus;
                                    dbg.log('status select changed', { from: row.status, to: next });
                                    void onUpdateStatus(next);
                                }}
                                disabled={!canUpdate}
                            >
                                {(['CREATED', 'ASSIGNED', 'ON_THE_WAY', 'PICKED', 'HANDOVER', 'COMPLETED', 'FAILED', 'CANCELLED'] as DeliveryStatus[])
                                    .map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        <div className="grid gap-1">
                            <label htmlFor="proof" className="text-xs text-gray-600">
                                Bukti serah-terima (opsional; digunakan saat HANDOVER, maks. 4MB)
                            </label>
                            <input
                                id="proof"
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                className="input py-1.5"
                                onChange={() => {
                                    const f = fileRef.current?.files?.[0] ?? null;
                                    dbg.log('file selected', f ? { name: f.name, size: f.size, type: f.type } : '(none)');
                                }}
                            />
                            {row.handover_photo && (
                                <div className="pt-1">
                                    <a
                                        href={(import.meta.env.VITE_FILES_BASE_URL || '').replace(/\/+$/, '') + '/' + String(row.handover_photo).replace(/^\/+/, '')}
                                        target="_blank" rel="noopener noreferrer"
                                        className="btn-outline inline-flex"
                                        onClick={() => dbg.log('open proof clicked', { url: row.handover_photo })}
                                    >
                                        Lihat bukti serah-terima
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

/* ---------- Sub UI ---------- */
function InfoLine({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-gray-600">{label}</span>
            <div className="text-sm">{children}</div>
        </div>
    );
}

function statusChipClass(s: DeliveryStatus) {
    // Progress aktif = solid brand; selesai = subtle; batal/error = danger
    if (s === 'COMPLETED') return 'chip chip--subtle';
    if (s === 'FAILED' || s === 'CANCELLED') return 'chip chip--danger';
    return 'chip chip--solid';
}

```
</details>

### src/pages/deliveries/DeliveryIndex.tsx

- SHA: `3e5ebb43f20a`  
- Ukuran: 13 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/deliveries/DeliveryIndex.tsx
import { useCallback, useEffect, useState } from 'react';
// import DataTable from '../../components/DataTable'; // tidak dipakai karena menggunakan tabel konsisten Customers
import AssignCourierSelect from '../../components/delivery/AssignCourierSelect';
import { listDeliveries, assignCourier, updateDeliveryStatus } from '../../api/deliveries';
import type { Delivery, DeliveryStatus } from '../../types/deliveries';
import { useHasRole } from '../../store/useAuth';
import { Link } from 'react-router-dom';
import { getOrder } from '../../api/orders';

const STATUSES: DeliveryStatus[] = [
  'CREATED',
  'ASSIGNED',
  'ON_THE_WAY',
  'PICKED',
  'HANDOVER',
  'COMPLETED',
  'FAILED',
  'CANCELLED',
];

const FLOW: DeliveryStatus[] = ['CREATED', 'ASSIGNED', 'ON_THE_WAY', 'PICKED', 'HANDOVER', 'COMPLETED'];
const TERMINALS = new Set<DeliveryStatus>(['COMPLETED', 'FAILED', 'CANCELLED']);

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

      // Hydrate label order
      try {
        const ids = Array.from(new Set(list.map(d => d.order_id).filter(Boolean)));
        if (ids.length) {
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

  useEffect(() => { dbg.log('mount'); return () => { dbg.log('unmount'); }; }, []);
  useEffect(() => { dbg.log('effect load() — dependencies changed', { status, courier }); void load(); }, [load, status, courier]);

  const onAssign = useCallback(async (d: Delivery, user_id: string | number | null) => {
    dbg.group('onAssign');
    dbg.log('attempt', { delivery_id: d.id, user_id, canAssign });
    try {
      if (!canAssign) { dbg.warn('blocked: no permission to assign'); return; }
      if (!user_id) { dbg.warn('skipped: user_id is null/empty'); return; }
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
      if (!canUpdate) { dbg.warn('blocked: no permission to update status'); return; }
      if (TERMINALS.has(d.status)) { dbg.warn('no-op: terminal status'); return; }
      const i = Math.max(0, FLOW.indexOf(d.status));
      const next = FLOW[Math.min(i + 1, FLOW.length - 1)];
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
  type DeliveryWithOrderRef = Delivery & { order_invoice_no?: string | null; order_number?: string | null; };
  const getOrderLabel = (d: Delivery): string => {
    const dx = d as DeliveryWithOrderRef;
    const cached = orderMap[d.order_id];
    return cached?.invoice_no ?? cached?.number ?? dx.order_invoice_no ?? dx.order_number ?? d.order_id;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Deliveries</h1>
          <p className="text-xs text-gray-600">Auto-assign & tracking</p>
        </div>
      </header>

      {/* FilterBar */}
      <section className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1" aria-label="Filter deliveries">
        <div className="p-3 grid grid-cols-1 sm:grid-cols-[repeat(3,minmax(0,1fr))_auto] gap-3">
          <label className="grid gap-1 text-sm">
            <span className="text-[color:var(--color-text-default)]">Status</span>
            <select
              className="input py-2"
              value={status}
              onChange={(e) => { dbg.log('filter change: status →', e.target.value || '(all)'); setStatus(e.target.value as DeliveryStatus | ''); }}
              aria-label="Filter status"
            >
              <option value="">— Semua —</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-[color:var(--color-text-default)]">Kurir</span>
            <AssignCourierSelect
              value={courier || null}
              onChange={(v) => { dbg.log('filter change: courier →', v ?? '(all)'); setCourier(v ?? ''); }}
            />
          </label>

          <div className="flex items-end">
            <button
              type="button"
              className="btn-outline"
              onClick={() => { dbg.log('filters reset'); setStatus(''); setCourier(''); }}
              aria-label="Reset filter"
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* Error */}
      {err && (
        <div role="alert" aria-live="polite" className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
          {err}
        </div>
      )}

      {/* Empty state */}
      {!loading && !err && rows.length === 0 && (
        <div className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1 p-6 text-sm text-gray-500">
          Belum ada data.
        </div>
      )}

      {/* Table (konsisten dengan Customers) */}
      <section aria-busy={loading ? 'true' : 'false'}>
        <div className="card overflow-hidden border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#E6EDFF] sticky top-0 z-10">
                <tr className="divide-x divide-[color:var(--color-border)]">
                  <Th>ID</Th>
                  <Th>Order</Th>
                  <Th>Tipe</Th>
                  <Th className="text-right">Fee</Th>
                  <Th>Kurir</Th>
                  <Th>Status</Th>
                  <Th>Dibuat</Th>
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
                  </>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id} className="hover:bg-black/5 transition-colors">
                      <Td><span className="font-mono">{r.id}</span></Td>
                      <Td>
                        <Link className="underline" to={`/orders/${r.order_id}`}>
                          {getOrderLabel(r)}
                        </Link>
                      </Td>
                      <Td>{r.type}</Td>
                      <Td className="text-right">
                        {Number(r.fee).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                      </Td>
                      <Td>
                        <AssignCourierSelect
                          value={r.assigned_to ?? null}
                          onChange={(v) => onAssign(r, v)}
                          disabled={!canAssign}
                        />
                      </Td>
                      <Td>
                        <div className="flex items-center gap-2">
                          <span className={chipClass(r.status)}>{r.status}</span>
                          <button
                            type="button"
                            className="btn-outline text-xs px-2 py-1"
                            onClick={() => void advance(r)}
                            disabled={!canUpdate || TERMINALS.has(r.status)}
                            title="Majukan status"
                          >
                            Next
                          </button>
                        </div>
                      </Td>
                      <Td>{r.created_at}</Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- Subcomponents & helpers (konsisten dengan Customers) ---------- */
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
      <td className="px-3 py-3"><div className="h-4 w-24 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-40 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-20 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3 text-right"><div className="inline-block h-4 w-24 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-8 w-36 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-6 w-24 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-28 rounded bg-black/10 animate-pulse" /></td>
    </tr>
  );
}

/** Map status ke gaya chip konsisten */
function chipClass(s: DeliveryStatus) {
  if (s === 'FAILED' || s === 'CANCELLED') {
    return 'inline-flex items-center rounded-full px-2.5 py-1 text-xs text-white bg-[color:var(--color-status-danger)]';
  }
  if (s === 'COMPLETED') {
    return 'inline-flex items-center rounded-full px-2.5 py-1 text-xs text-[color:var(--color-brand-primary)] bg-[#E6EDFF]';
  }
  // progress statuses
  return 'inline-flex items-center rounded-full px-2.5 py-1 text-xs text-[color:var(--color-brand-on)] bg-[color:var(--color-brand-primary)]';
}

```
</details>

### src/pages/expenses/ExpenseForm.tsx

- SHA: `a1c3f7d6344a`  
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
          <p className="text-xs text-gray-600">Catat pengeluaran operasional dengan bukti pendukung</p>
        </div>
      </div>

      {/* Alert error */}
      {err && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2"
        >
          {err}
        </div>
      )}

      {/* Loading info */}
      {loading && <div className="text-sm text-gray-500">Memuat…</div>}

      {/* Form Card */}
      {!loading && (
        <div className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1 max-w-2xl">
          <form onSubmit={onSubmit}>
            <div className="p-4 grid gap-3">
              {isSuperadmin && (
                <label className="grid gap-1 text-sm">
                  <span>Cabang</span>
                  <select
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    required
                    className="input py-2"
                  >
                    <option value="">-- pilih cabang --</option>
                    {branchList.map(b => <option key={b.id} value={String(b.id)}>{b.name}</option>)}
                  </select>
                </label>
              )}

              <label className="grid gap-1 text-sm">
                <span>Kategori</span>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="input py-2"
                  placeholder="Contoh: Listrik / Sewa / Operasional lain"
                />
              </label>

              <label className="grid gap-1 text-sm">
                <span>Nominal</span>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="input py-2"
                  inputMode="numeric"
                />
                <span className="text-xs text-gray-500">{toIDR(Number(amount || 0))}</span>
              </label>

              <label className="grid gap-1 text-sm">
                <span>Catatan</span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="input py-2"
                  rows={3}
                  placeholder="Opsional"
                />
              </label>

              <label className="grid gap-1 text-sm">
                <span>Bukti (foto/struk/PDF)</span>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="input py-2"
                />
                {existingProof && (
                  <a
                    href={fileUrl(existingProof) ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs underline"
                  >
                    Lihat bukti saat ini
                  </a>
                )}
              </label>
            </div>

            <div className="p-4 border-t border-[color:var(--color-border)] flex items-center gap-3">
              <button
                type="submit"
                disabled={loading || !canManage}
                className="btn-primary disabled:opacity-50"
              >
                {editing ? 'Simpan Perubahan' : 'Simpan'}
              </button>
              <button
                type="button"
                onClick={() => nav('/expenses')}
                className="btn-outline"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

```
</details>

### src/pages/expenses/ExpensesIndex.tsx

- SHA: `51d043f5920a`  
- Ukuran: 12 KB
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Biaya Operasional</h1>
          <p className="text-xs text-gray-600">Catatan pengeluaran per cabang & periode</p>
        </div>
        {canManage && (
          <button
            className="btn-primary"
            onClick={() => nav('/expenses/new')}
            aria-label="Tambah pengeluaran"
          >
            Tambah
          </button>
        )}
      </div>

      {/* Toolbar (FilterBar) */}
      <section
        className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1"
        aria-label="Filter data pengeluaran"
      >
        <div className="p-3 grid grid-cols-1 md:grid-cols-5 gap-2">
          {isSuperadmin && (
            <label className="grid gap-1 text-sm">
              <span className="text-[color:var(--color-text-default)]">Cabang</span>
              <select
                value={branchId}
                onChange={(e) => { setBranchId(e.target.value); setPage(1); }}
                className="input py-2"
                aria-label="Pilih cabang"
              >
                <option value="">Semua Cabang</option>
                {branchList.map(b => <option key={b.id} value={String(b.id)}>{b.name}</option>)}
              </select>
            </label>
          )}

          <label className="grid gap-1 text-sm">
            <span className="text-[color:var(--color-text-default)]">Dari Tanggal</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
              className="input py-2"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-[color:var(--color-text-default)]">Sampai Tanggal</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
              className="input py-2"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="text-[color:var(--color-text-default)]">Per halaman</span>
            <select
              value={perPage}
              onChange={(e) => { setPerPage(parseInt(e.target.value, 10)); setPage(1); }}
              className="input py-2"
              aria-label="Jumlah baris per halaman"
            >
              {[10, 15, 25, 50, 100].map(n => <option key={n} value={n}>{n}/hal</option>)}
            </select>
          </label>

          <div className="flex items-end">
            <button
              onClick={() => { setPage(1); load(); }}
              className="btn-outline"
            >
              Terapkan
            </button>
          </div>
        </div>
      </section>

      {/* Alerts */}
      {err && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2"
        >
          {err}
        </div>
      )}

      {/* Empty state */}
      {!loading && !err && rows.length === 0 && (
        <div className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1 p-6 text-sm text-gray-500">
          Belum ada data.
        </div>
      )}

      {/* Table (sama gaya dengan Customers) */}
      <section aria-busy={loading ? 'true' : 'false'}>
        <div className="card overflow-hidden border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-[#E6EDFF] sticky top-0 z-10">
                <tr className="divide-x divide-[color:var(--color-border)]">
                  <Th>Tanggal</Th>
                  {isSuperadmin && <Th>Cabang</Th>}
                  <Th>Kategori</Th>
                  <Th className="text-right">Nominal</Th>
                  <Th>Catatan</Th>
                  <Th>Bukti</Th>
                  {canManage && <Th className="text-right pr-4">Aksi</Th>}
                </tr>
              </thead>

              <tbody className="divide-y divide-[color:var(--color-border)]">
                {loading ? (
                  <>
                    <RowSkeleton showBranch={isSuperadmin} showAction={canManage} />
                    <RowSkeleton showBranch={isSuperadmin} showAction={canManage} />
                    <RowSkeleton showBranch={isSuperadmin} showAction={canManage} />
                    <RowSkeleton showBranch={isSuperadmin} showAction={canManage} />
                    <RowSkeleton showBranch={isSuperadmin} showAction={canManage} />
                  </>
                ) : (
                  rows.map(r => (
                    <tr key={r.id} className="hover:bg-black/5 transition-colors">
                      <Td>{r.created_at ? new Date(r.created_at).toLocaleString('id-ID') : '-'}</Td>
                      {isSuperadmin && <Td>{r.branch?.name ?? r.branch_id}</Td>}
                      <Td><span className="font-medium">{r.category}</span></Td>
                      <Td className="text-right tabular-nums">{toIDR(Number(r.amount))}</Td>
                      <Td><span className="line-clamp-2 max-w-[48ch]">{r.note ?? '-'}</span></Td>
                      <Td>
                        {r.proof_path ? (
                          <a
                            className="text-[color:var(--brand)] underline"
                            target="_blank" rel="noopener noreferrer"
                            href={fileUrl(r.proof_path) ?? '#'}
                          >
                            Lihat
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </Td>
                      {canManage && (
                        <Td className="text-right">
                          <div className="inline-flex items-center gap-2">
                            <Link
                              to={`/expenses/${encodeURIComponent(r.id)}/edit`}
                              className="btn-outline"
                              aria-label={`Edit pengeluaran ${r.category}`}
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => onDelete(r)}
                              className="btn-outline text-red-600"
                              aria-label={`Hapus pengeluaran ${r.category}`}
                            >
                              Hapus
                            </button>
                          </div>
                        </Td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <nav className="flex items-center gap-2 justify-end" aria-label="Navigasi halaman">
          <button
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
            className="btn-outline disabled:opacity-50"
          >
            Prev
          </button>
          <div className="text-sm">
            Hal {page} / {meta.last_page} • {meta.total} data
          </div>
          <button
            disabled={page >= meta.last_page}
            onClick={() => setPage(p => p + 1)}
            className="btn-outline disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}

/* ---------- Subcomponents (konsisten dengan Customers) ---------- */
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
function RowSkeleton({ showBranch, showAction }: { showBranch: boolean; showAction: boolean }) {
  return (
    <tr>
      <td className="px-3 py-3"><div className="h-4 w-40 rounded bg-black/10 animate-pulse" /></td>
      {showBranch && <td className="px-3 py-3"><div className="h-4 w-28 rounded bg-black/10 animate-pulse" /></td>}
      <td className="px-3 py-3"><div className="h-4 w-32 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-24 rounded bg-black/10 animate-pulse ml-auto" /></td>
      <td className="px-3 py-3"><div className="h-4 w-64 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-8 w-16 rounded bg-black/10 animate-pulse" /></td>
      {showAction && <td className="px-3 py-3 text-right"><div className="inline-block h-8 w-28 rounded bg-black/10 animate-pulse" /></td>}
    </tr>
  );
}

```
</details>

### src/pages/Login.tsx

- SHA: `3b9a0d80dfab`  
- Ukuran: 10 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/Login.tsx
import { useState, type FormEvent } from "react";
import type { AxiosError } from "axios";
import { useAuth, homePathByRole } from "../store/useAuth";
import { useNavigate, useLocation } from "react-router-dom";

/** Ikon mata (show) */
function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  );
}
/** Ikon mata tertutup (hide) */
function EyeOffIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      {...props}
    >
      <path d="M1 12s4-7 11-7a12 12 0 0 1 5.6 1.4" />
      <path d="M23 12s-4 7-11 7A12 12 0 0 1 6.4 18.6" />
      <line x1="3" y1="3" x2="21" y2="21" />
    </svg>
  );
}

function BrandStar() {
  return (
    <svg viewBox="0 0 64 64" className="h-10 w-10 text-white/95">
      <path
        fill="currentColor"
        d="M32 4c2.2 0 4 1.8 4 4v16h16c2.2 0 4 1.8 4 4s-1.8 4-4 4H36v16c0 2.2-1.8 4-4 4s-4-1.8-4-4V36H12c-2.2 0-4-1.8-4-4s1.8-4 4-4h16V8c0-2.2 1.8-4 4-4z"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.2-1.4 3.6-5.5 3.6-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C17.8 3.2 15.2 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.8 0 9.6-4.1 9.6-9.8 0-.7-.1-1.2-.2-1.7H12z"
      />
      <path
        fill="#34A853"
        d="M3.6 7.3l3.2 2.3C7.7 7.7 9.7 6.3 12 6.3c1.9 0 3.1.8 3.8 1.5l2.6-2.5C17.8 3.2 15.2 2 12 2 8.2 2 4.9 4.1 3.6 7.3z"
        opacity=".001"
      />
      <path
        fill="#FBBC05"
        d="M12 22c3.1 0 5.7-1 7.6-2.8l-3.5-2.9c-.9.6-2 1-4.1 1-3.3 0-6-2.7-6-6 0-.6.1-1.2.3-1.7L3 7.2C2.4 8.7 2 10.3 2 12c0 5.5 4.5 10 10 10z"
      />
      <path
        fill="#4285F4"
        d="M21.6 12.2c0-.7-.1-1.2-.2-1.7H12v3.9h5.5c-.3 1.4-1.6 3.6-5.5 3.6v4c5.8 0 9.6-4.1 9.6-9.8z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const nav = useNavigate();
  const loc = useLocation();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const me = await useAuth.login({ login: loginId.trim(), password });
      const profile = await useAuth.fetchMe();
      const from = (loc.state as { from?: { pathname?: string } } | undefined)?.from?.pathname;
      const fallback = homePathByRole(profile?.roles ?? me?.roles ?? []);
      nav(from ?? fallback, { replace: true });
    } catch (err: unknown) {
      const ax = err as AxiosError<{ errors?: Record<string, string[]>; message?: string }>;
      const msg = ax.response?.data?.errors?.auth?.[0] ?? ax.response?.data?.message ?? "Login gagal";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-dvh w-full bg-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-dvh max-w-6xl items-center justify-center px-4 py-8">
        <section className="grid w-full overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_-30px_rgba(0,0,0,.35)] md:grid-cols-2">
          {/* LEFT PANEL (visual) */}
          <div className="relative hidden min-h-[560px] md:block">
            {/* gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-blue-700 to-indigo-950" />

            {/* subtle line pattern */}
            <svg
              aria-hidden
              className="absolute inset-0 h-full w-full opacity-20"
              viewBox="0 0 800 800"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                  <stop stopColor="#ffffff" stopOpacity="0.35" offset="0" />
                  <stop stopColor="#ffffff" stopOpacity="0" offset="1" />
                </linearGradient>
              </defs>
              <path d="M80,760 C200,560 300,520 520,420 C650,360 720,260 760,80" stroke="url(#g)" strokeWidth="2" fill="none" />
              <path d="M40,720 C200,520 320,480 520,380 C660,310 720,220 740,60" stroke="url(#g)" strokeWidth="2" fill="none" />
              <path d="M120,800 C220,590 340,540 520,450 C640,390 720,290 800,120" stroke="url(#g)" strokeWidth="2" fill="none" />
            </svg>

            <div className="relative z-10 flex h-full flex-col justify-between p-10">
              <div className="flex items-center gap-3">
                <img
                  src="/logo-salve.png"
                  alt="Logo Salve"
                  className="h-10 w-auto object-contain"
                />
              </div>

              <div className="max-w-sm">
                <h2 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-white">
                  Hello
                  <br />
                  Salve! <span className="align-middle">👋</span>
                </h2>
                <p className="mt-5 text-sm leading-6 text-white/80">
                  Kelola transaksi, kas, stok, dan operasional cabang dengan workflow yang rapi, cepat, dan terukur.
                </p>
              </div>

              <div className="text-xs tracking-wide text-white/60">© {new Date().getFullYear()} Galuh. All rights reserved.</div>
            </div>
          </div>

          {/* RIGHT PANEL (form) */}
          <div className="flex min-h-[560px] flex-col justify-center px-6 py-10 sm:px-10">
            <div className="mx-auto w-full max-w-sm">
              {/* top small brand (mobile) */}
              <div className="mb-8 flex items-center justify-between">
                <div className="font-semibold text-slate-900">Salve</div>
                <div className="text-xs text-slate-500 md:hidden">Login</div>
              </div>

              <h1 className="text-2xl font-semibold text-slate-900">Welcome!</h1>

              {error && (
                <div
                  role="alert"
                  className="mt-6 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              <form onSubmit={onSubmit} aria-busy={loading} className="mt-7 space-y-5">
                {/* Email / Username */}
                <div>
                  <label htmlFor="login" className="sr-only">
                    Email / Username
                  </label>
                  <input
                    id="login"
                    required
                    type="text"
                    placeholder="Email / Username"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    autoComplete="username"
                    disabled={loading}
                    aria-invalid={!!error}
                    className="
                      w-full border-0 border-b border-slate-300 bg-transparent px-0 py-3 text-sm
                      text-slate-900 placeholder:text-slate-400
                      focus:border-slate-900 focus:outline-none
                      disabled:opacity-70
                    "
                  />
                </div>

                {/* Password + toggle */}
                <div className="relative">
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    required
                    type={showPwd ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    disabled={loading}
                    aria-invalid={!!error}
                    className="
                      w-full border-0 border-b border-slate-300 bg-transparent px-0 py-3 text-sm
                      text-slate-900 placeholder:text-slate-400
                      focus:border-slate-900 focus:outline-none
                      disabled:opacity-70
                    "
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    disabled={loading}
                    aria-label={showPwd ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                    aria-pressed={showPwd}
                    className="
                      absolute right-0 top-1/2 -translate-y-1/2
                      rounded-md p-2 text-slate-600 hover:bg-slate-100
                      focus:outline-none focus:ring-2 focus:ring-slate-300
                      disabled:opacity-60
                    "
                  >
                    {showPwd ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>

                {/* Login button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    mt-2 w-full rounded-md bg-slate-900 py-3 text-sm font-semibold text-white
                    hover:bg-slate-800 active:bg-slate-950
                    disabled:cursor-not-allowed disabled:opacity-70
                  "
                >
                  {loading ? "Memproses…" : "Login Now"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

```
</details>

### src/pages/orders/OrderDetail.tsx

- SHA: `5723fcdd404b`  
- Ukuran: 43 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/orders/OrderDetail.tsx
import React, { useCallback, useEffect, useState } from 'react';
import {
  getOrder,
  updateOrderStatus,
  getOrderReceiptHtml,
  openOrderReceipt,
  updateOrder,
  createOrderShareLink,
} from '../../api/orders';
import type { OrderUpdatePayload } from '../../types/orders';
import CustomerPicker from '../../components/customers/CustomerPicker';
import ProductSearch from '../../components/pos/ProductSearch';
import ReceiptPreview from '../../components/ReceiptPreview';
import type { Order, OrderBackendStatus } from '../../types/orders';
import OrderStatusStepper from '../../components/orders/OrderStatusStepper';
import OrderPhotosGallery from '../../components/orders/OrderPhotosGallery';
import OrderPhotosUpload from '../../components/orders/OrderPhotosUpload';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAllowedNext } from '../../utils/order-status';
import { isAxiosError } from 'axios';
import { buildWhatsAppLink } from '../../utils/wa';
import { buildReceiptMessage } from '../../utils/receipt-wa';
import { useHasRole } from '../../store/useAuth';
import { createDelivery, listDeliveries } from '../../api/deliveries';
import type { DeliveryType } from '../../types/deliveries';

type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[] | string>;
};

// Helpers konversi datetime-local <-> ISO string
function toLocalInputValue(v?: string | null): string {
  if (!v) return '';
  const s = String(v).trim();
  if (s.includes('T')) return s.replace('Z', '').slice(0, 16);
  return s.replace(' ', 'T').slice(0, 16);
}
function fromLocalInputValue(v: string): string | null {
  if (!v) return null;
  const s = v.trim();
  return s.replace('T', ' ') + ':00';
}

type DraftItem = {
  id?: string;
  service_id: string;
  service_name?: string;
  price?: number;
  qty: number;
  note?: string | null;
};
type Draft = {
  customer_id: string | null;
  notes: string | null;
  discount?: number;
  items: DraftItem[];
  received_at?: string | null;
  ready_at?: string | null;
};

function money(v: unknown): string {
  const n = Number(v ?? 0);
  return n.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
}

function statusBadgeClass(status: OrderBackendStatus): string {
  const base = 'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset';
  const cls =
    status === 'CANCELED'
      ? 'bg-red-50 text-red-700 ring-red-200'
      : status === 'READY'
        ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
        : status === 'PICKED_UP'
          ? 'bg-slate-900 text-white ring-slate-900'
          : status === 'DELIVERING'
            ? 'bg-blue-50 text-blue-700 ring-blue-200'
            : status === 'WASHING' || status === 'DRYING' || status === 'IRONING'
              ? 'bg-amber-50 text-amber-700 ring-amber-200'
              : 'bg-slate-50 text-slate-700 ring-slate-200';
  return `${base} ${cls}`;
}

export default function OrderDetail(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [row, setRow] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fieldErr, setFieldErr] = useState<Record<string, string>>({});
  const canEdit = useHasRole(['Superadmin', 'Admin Cabang']);
  const canCreateDelivery = useHasRole(['Superadmin', 'Admin Cabang', 'Kasir']);

  const [draft, setDraft] = useState<Draft>({ customer_id: null, notes: null, items: [] });

  // Delivery UI
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [deliverySaving, setDeliverySaving] = useState(false);
  const [deliveryErr, setDeliveryErr] = useState<string | null>(null);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('delivery');
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [deliveryZoneId, setDeliveryZoneId] = useState<string>('');
  const [existingDeliveryId, setExistingDeliveryId] = useState<string | null>(null);

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

  useEffect(() => {
    const orderId = row?.id;
    if (!orderId) return;
    let alive = true;
    (async () => {
      try {
        const res = await listDeliveries({ q: orderId, per_page: 1 });
        const latest = (res.data && res.data.length > 0) ? (res.data[0] as any) : null;
        if (!alive) return;
        setExistingDeliveryId(latest?.id ?? null);
      } catch {
        if (!alive) return;
        setExistingDeliveryId(null);
      }
    })();
    return () => { alive = false; };
  }, [row?.id]);

  useEffect(() => {
    if (!row) return;
    setDraft({
      customer_id: row.customer?.id ?? row.customer_id ?? null,
      notes: row.notes ?? null,
      received_at: row.received_at ?? null,
      ready_at: row.ready_at ?? null,
      items: (row.items ?? []).map(it => ({
        id: it.id,
        service_id: it.service_id,
        service_name: it.service?.name,
        price: Number(it.price),
        qty: Number(it.qty),
        note: it.note ?? null,
      })),
    });
  }, [row]);

  const changeQty = useCallback((serviceId: string, qty: number) => {
    setDraft(d => ({
      ...d,
      items: d.items.map(it => it.service_id === serviceId ? { ...it, qty: Math.max(1, qty) } : it),
    }));
  }, []);
  const changeNote = useCallback((serviceId: string, note: string) => {
    setDraft(d => ({
      ...d,
      items: d.items.map(it => it.service_id === serviceId ? { ...it, note } : it),
    }));
  }, []);
  const removeItem = useCallback((serviceId: string) => {
    setDraft(d => ({ ...d, items: d.items.filter(it => it.service_id !== serviceId) }));
  }, []);
  const addItemFromSearch = useCallback((svc: { id: string; name: string; unit: string; price_effective: number }) => {
    setDraft(d => {
      const found = d.items.find(it => it.service_id === svc.id);
      if (found) {
        return {
          ...d,
          items: d.items.map(it => it.service_id === svc.id ? { ...it, qty: it.qty + 1, price: svc.price_effective } : it),
        };
      }
      return {
        ...d,
        items: [...d.items, { service_id: svc.id, service_name: svc.name, price: svc.price_effective, qty: 1, note: null }],
      };
    });
  }, []);

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

  const onSendWA = useCallback(async () => {
    if (!row) return;
    const wa =
      (row as any)?.customer?.whatsapp ||
      (row as any)?.customer?.phone ||
      '';
    if (!wa) {
      alert('Nomor WhatsApp pelanggan belum tersedia.');
      return;
    }
    try {
      const link = await createOrderShareLink(row.id);
      const shareUrl =
        typeof link === 'string' ? link : (link as any)?.share_url || (link as any)?.url || '';
      if (!shareUrl) {
        alert('Gagal menghasilkan tautan kwitansi.');
        return;
      }
      const msg = buildReceiptMessage(row as unknown as Order, shareUrl);
      const url = buildWhatsAppLink(wa, msg);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      alert('Gagal menyiapkan pesan WhatsApp.');
    }
  }, [row]);

  const previewSubtotal = row
    ? draft.items.reduce((s, it) => {
      const harga = Number(
        it.price ??
        (row.items ?? []).find(r => r.service_id === it.service_id)?.price ??
        0
      );
      return s + Number(it.qty || 0) * harga;
    }, 0)
    : 0;

  return (
    <div className="space-y-4">
      {loading && (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          Memuat…
        </div>
      )}

      {err && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {err}
        </div>
      )}

      {!loading && !row && !err && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)]">
          <div className="text-sm font-medium text-slate-900">Tidak ditemukan</div>
          <div className="mt-1 text-sm text-slate-500">Order tidak tersedia atau sudah dihapus.</div>
          <div className="mt-4">
            <Link to="/orders" className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50">
              Kembali
            </Link>
          </div>
        </div>
      )}

      {/* Create Delivery Modal */}
      {row && deliveryOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 sm:items-center"
          onClick={() => { if (!deliverySaving) setDeliveryOpen(false); }}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-slate-200 px-4 py-3">
              <div className="text-sm font-semibold text-slate-900">Buat Pengiriman</div>
              <div className="mt-0.5 text-xs text-slate-500">
                Order: {row.invoice_no ?? row.number}
              </div>
            </div>

            <div className="space-y-3 px-4 py-4">
              {deliveryErr && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {deliveryErr}
                </div>
              )}

              <div>
                <div className="text-xs font-semibold text-slate-600">Tipe</div>
                <select
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                  value={deliveryType}
                  onChange={(e) => setDeliveryType(e.target.value as DeliveryType)}
                  disabled={deliverySaving}
                >
                  <option value="delivery">delivery</option>
                  <option value="pickup">pickup</option>
                  <option value="return">return</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-xs font-semibold text-slate-600">Ongkir (fee)</div>
                  <input
                    type="number"
                    min={0}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
                    value={Number.isFinite(deliveryFee) ? deliveryFee : 0}
                    onChange={(e) => setDeliveryFee(Number(e.target.value || 0))}
                    disabled={deliverySaving}
                  />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-600">Zone ID (opsional)</div>
                  <input
                    type="text"
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
                    placeholder="UUID zone (jika dipakai)"
                    value={deliveryZoneId}
                    onChange={(e) => setDeliveryZoneId(e.target.value)}
                    disabled={deliverySaving}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-4 py-3">
              <button
                type="button"
                className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
                onClick={() => setDeliveryOpen(false)}
                disabled={deliverySaving}
              >
                Batal
              </button>

              <button
                type="button"
                className="inline-flex rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 active:bg-slate-950 disabled:opacity-60"
                disabled={deliverySaving}
                onClick={async () => {
                  if (!row?.id) return;
                  setDeliverySaving(true);
                  setDeliveryErr(null);
                  try {
                    const payload: any = {
                      order_id: row.id,
                      type: deliveryType,
                      fee: Math.max(0, Number(deliveryFee || 0)),
                      zone_id: deliveryZoneId.trim() ? deliveryZoneId.trim() : null,
                    };

                    // Backend store() mengembalikan: { data: { delivery: ... }, meta: { idempotent } }
                    const res = await createDelivery(payload as any);
                    const created = (res as any)?.data?.delivery ?? (res as any)?.data ?? null;
                    const did = created?.id as string | undefined;
                    if (!did) throw new Error('Delivery tidak terbaca dari response.');

                    setExistingDeliveryId(did);
                    setDeliveryOpen(false);
                    navigate(`/deliveries/${encodeURIComponent(did)}`);
                  } catch (e: unknown) {
                    let msg = 'Gagal membuat pengiriman';
                    if (isAxiosError<ApiErrorResponse>(e)) {
                      const api = e.response?.data;
                      const errMap = api?.errors;
                      const firstKey = errMap ? Object.keys(errMap)[0] : null;
                      const firstVal = firstKey ? errMap?.[firstKey] : null;
                      const detail =
                        typeof firstVal === 'string' ? firstVal :
                          Array.isArray(firstVal) ? firstVal[0] :
                            undefined;
                      msg = api?.message ?? detail ?? msg;
                    } else if (e instanceof Error && e.message) {
                      msg = e.message;
                    }
                    setDeliveryErr(msg);
                  } finally {
                    setDeliverySaving(false);
                  }
                }}
              >
                {deliverySaving ? 'Membuat…' : 'Buat'}
              </button>
            </div>
          </div>
        </div>
      )}


      {row && (
        <>
          {/* Top header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold text-slate-900">
                  Order {row.invoice_no ?? row.number}
                </h1>
                <span className={statusBadgeClass(row.status)}>{row.status}</span>
              </div>
              <div className="mt-1 text-sm text-slate-500">
                Customer: <span className="font-medium text-slate-900">{row.customer?.name ?? '-'}</span>
              </div>
              <div className="mt-2">
                <OrderStatusStepper backendStatus={row.status} />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2">
              {canCreateDelivery && (
                <>
                  {typeof existingDeliveryId === 'string' && existingDeliveryId.length > 0 ? (
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 active:bg-slate-950"
                      onClick={() => navigate(`/deliveries/${encodeURIComponent(existingDeliveryId)}`)}
                      title="Lihat pengiriman yang sudah dibuat"
                    >
                      Lihat Pengiriman
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 active:bg-slate-950"
                      onClick={() => { setDeliveryErr(null); setDeliveryOpen(true); }}
                      title="Buat pengiriman untuk order ini"
                    >
                      Buat Pengiriman
                    </button>
                  )}
                </>
              )}
              {!isEditing && canEdit && (
                <button
                  type="button"
                  className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                  onClick={() => setIsEditing(true)}
                  title="Edit order"
                >
                  Edit
                </button>
              )}

              {isEditing && canEdit && (
                <>
                  <button
                    type="button"
                    className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                    onClick={() => { setIsEditing(false); setFieldErr({}); }}
                    title="Batalkan perubahan"
                  >
                    Batal
                  </button>

                  <button
                    type="button"
                    className="inline-flex rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 active:bg-slate-950 disabled:opacity-60"
                    onClick={async () => {
                      if (!id) return;
                      setSaving(true); setFieldErr({});
                      try {
                        const payload: OrderUpdatePayload = {
                          customer_id: draft.customer_id ?? null,
                          notes: (draft.notes ?? '') || null,
                          items: draft.items.map(it => ({
                            service_id: it.service_id,
                            qty: it.qty,
                            note: (it.note ?? '') || null,
                          })),
                          received_at: draft.received_at ?? null,
                          ready_at: draft.ready_at ?? null,
                        };
                        await updateOrder(id, payload);
                        await refresh();
                        setIsEditing(false);
                      } catch (e: unknown) {
                        let msg = 'Gagal menyimpan';
                        if (isAxiosError<ApiErrorResponse>(e)) {
                          const api = e.response?.data;
                          msg = api?.message ?? msg;
                          const map: Record<string, string> = {};
                          const errMap = api?.errors;
                          if (errMap) {
                            Object.entries(errMap).forEach(([k, v]) => {
                              map[k] = Array.isArray(v) ? String(v[0]) : String(v ?? '');
                            });
                            setFieldErr(map);
                          }
                        }
                        alert(msg);
                      } finally {
                        setSaving(false);
                      }
                    }}
                    disabled={saving || (draft.items.length === 0)}
                    title="Simpan perubahan"
                  >
                    {saving ? 'Menyimpan…' : 'Simpan'}
                  </button>
                </>
              )}

              <button
                type="button"
                className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                onClick={() => openOrderReceipt(row.id)}
                title="Buka struk di tab baru"
              >
                Receipt
              </button>

              <button
                type="button"
                className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                onClick={async () => {
                  setReceiptOpen(true);
                  if (!receiptHtml) await loadReceipt();
                }}
                title="Preview struk"
              >
                Preview
              </button>

              <button
                type="button"
                className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                onClick={onSendWA}
                title="Kirim kwitansi via WhatsApp"
              >
                Kirim WA
              </button>

              {(row.due_amount ?? 0) > 0 && (
                <button
                  type="button"
                  className="inline-flex rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 active:bg-slate-950"
                  onClick={() => navigate(`/receivables?q=${encodeURIComponent(row.invoice_no ?? row.number ?? '')}`)}
                  title="Menuju halaman Piutang untuk pelunasan"
                >
                  Pelunasan
                </button>
              )}
            </div>
          </div>

          {/* Main layout */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* Left column */}
            <div className="space-y-4 lg:col-span-8">
              {/* Editing fields */}
              {isEditing && (
                <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)]">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-900">Edit Order</div>
                    <div className="text-xs text-slate-500">Perubahan akan disimpan setelah klik “Simpan”.</div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <div className="text-xs font-semibold text-slate-600">Pelanggan</div>
                      <div className="mt-1">
                        <CustomerPicker
                          value={draft.customer_id ?? ''}
                          onChange={(cid) => setDraft(d => ({ ...d, customer_id: cid || null }))}
                        />
                      </div>
                      {fieldErr['customer_id'] && <div className="mt-1 text-[11px] text-red-600">{fieldErr['customer_id']}</div>}
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-slate-600">Catatan</div>
                      <textarea
                        className="
                          mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900
                          placeholder:text-slate-400 focus:border-slate-900 focus:outline-none
                        "
                        placeholder="Catatan order (opsional)"
                        value={draft.notes ?? ''}
                        onChange={(e) => setDraft(d => ({ ...d, notes: e.target.value }))}
                        disabled={!canEdit}
                      />
                      {fieldErr['notes'] && <div className="mt-1 text-[11px] text-red-600">{fieldErr['notes']}</div>}
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-slate-600">Tanggal Masuk</div>
                      <input
                        type="datetime-local"
                        className="
                          mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900
                          focus:border-slate-900 focus:outline-none
                        "
                        value={toLocalInputValue(draft.received_at ?? null)}
                        onChange={(e) => setDraft(d => ({ ...d, received_at: fromLocalInputValue(e.target.value) }))}
                        disabled={!canEdit}
                      />
                      {fieldErr['received_at'] && <div className="mt-1 text-[11px] text-red-600">{fieldErr['received_at']}</div>}
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-slate-600">Tanggal Selesai</div>
                      <input
                        type="datetime-local"
                        className="
                          mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900
                          focus:border-slate-900 focus:outline-none
                        "
                        value={toLocalInputValue(draft.ready_at ?? null)}
                        onChange={(e) => setDraft(d => ({ ...d, ready_at: fromLocalInputValue(e.target.value) }))}
                        disabled={!canEdit}
                      />
                      {fieldErr['ready_at'] && <div className="mt-1 text-[11px] text-red-600">{fieldErr['ready_at']}</div>}
                    </div>
                  </div>
                </section>
              )}

              {/* Items (read-only view when not editing) */}
              {!isEditing && (
                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)]">
                  <div className="flex items-center justify-between px-4 py-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Items</div>
                      <div className="text-xs text-slate-500">Rincian layanan pada order ini.</div>
                    </div>
                  </div>

                  <div className="overflow-auto">
                    <table className="min-w-full text-sm">
                      <thead className="sticky top-0 z-10 bg-slate-50 text-slate-600">
                        <tr className="border-b border-slate-200">
                          <Th>Layanan</Th>
                          <Th>Qty</Th>
                          <Th>Harga</Th>
                          <Th className="text-right">Total</Th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(row.items ?? []).map((it) => (
                          <tr key={it.id} className="hover:bg-slate-50/60 transition-colors">
                            <Td className="font-medium text-slate-900">{it.service?.name ?? it.service_id}</Td>
                            <Td className="text-slate-700">{it.qty}</Td>
                            <Td className="text-slate-700">{money(it.price)}</Td>
                            <Td className="text-right font-medium text-slate-900">{money(it.total)}</Td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="border-t border-slate-200 px-4 py-3">
                    <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
                      <Kpi label="Subtotal" value={money(row.subtotal)} />
                      <Kpi label="Diskon" value={money(row.discount)} />
                      <Kpi label="Grand Total" value={money(row.grand_total)} strong />
                      <Kpi label="Sisa" value={money(row.due_amount)} strong />
                    </div>
                  </div>
                </section>
              )}

              {/* Items editor */}
              {isEditing && canEdit && (
                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)]">
                  <div className="px-4 py-3">
                    <div className="text-sm font-semibold text-slate-900">Edit Items</div>
                    <div className="mt-1 text-xs text-slate-500">
                      Tambahkan layanan, ubah qty/catatan, atau hapus item. Total final tetap dihitung backend.
                    </div>
                  </div>

                  <div className="px-4 pb-4">
                    <ProductSearch onPick={addItemFromSearch} />
                    {fieldErr['items'] && <div className="mt-1 text-[11px] text-red-600">{fieldErr['items']}</div>}
                  </div>

                  <div className="overflow-auto">
                    <table className="min-w-full text-sm">
                      <thead className="sticky top-0 z-10 bg-slate-50 text-slate-600">
                        <tr className="border-b border-slate-200">
                          <Th>Layanan</Th>
                          <Th className="w-[140px]">Qty</Th>
                          <Th>Harga</Th>
                          <Th className="text-right">Total</Th>
                          <Th className="text-right">Aksi</Th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {draft.items.length === 0 && (
                          <tr>
                            <td className="px-4 py-5 text-sm text-slate-500" colSpan={5}>
                              Belum ada item. Tambahkan layanan di atas.
                            </td>
                          </tr>
                        )}

                        {draft.items.map((it) => {
                          const harga = Number(
                            it.price ??
                            (row.items ?? []).find(r => r.service_id === it.service_id)?.price ??
                            0
                          );
                          const total = harga * Number(it.qty || 0);

                          return (
                            <tr key={it.service_id} className="hover:bg-slate-50/60 transition-colors">
                              <Td className="align-top">
                                <div className="font-medium text-slate-900">{it.service_name ?? it.service_id}</div>
                                <input
                                  className="
                                    mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900
                                    placeholder:text-slate-400 focus:border-slate-900 focus:outline-none
                                  "
                                  placeholder="Catatan item (opsional)"
                                  value={it.note ?? ''}
                                  onChange={(e) => changeNote(it.service_id, e.target.value)}
                                  disabled={!canEdit}
                                />
                              </Td>

                              <Td className="align-top">
                                <input
                                  type="number"
                                  min={1}
                                  className="
                                    w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900
                                    focus:border-slate-900 focus:outline-none
                                  "
                                  value={it.qty}
                                  onChange={(e) => changeQty(it.service_id, Number(e.target.value || 1))}
                                  disabled={!canEdit}
                                />
                              </Td>

                              <Td className="align-top text-slate-700">{harga ? money(harga) : '—'}</Td>

                              <Td className="align-top text-right font-medium text-slate-900">{money(total)}</Td>

                              <Td className="align-top text-right">
                                <button
                                  type="button"
                                  className="
                                    inline-flex rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900
                                    hover:bg-slate-50 disabled:opacity-60
                                  "
                                  onClick={() => removeItem(it.service_id)}
                                  title="Hapus item"
                                  disabled={!canEdit}
                                >
                                  Hapus
                                </button>
                              </Td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="border-t border-slate-200 px-4 py-3">
                    <div className="flex flex-wrap items-center justify-end gap-3 text-sm">
                      <div className="text-slate-600">
                        Subtotal (preview): <span className="font-semibold text-slate-900">{money(previewSubtotal)}</span>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Photos */}
              <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Foto Order</div>
                    <div className="text-xs text-slate-500">Dokumentasi sebelum/sesudah proses.</div>
                  </div>
                </div>

                <div className="mt-3">
                  <OrderPhotosGallery
                    key={`${row.id}:${row.photos?.length ?? 0}`}
                    photos={row.photos ?? []}
                  />
                </div>

                {canEdit && (
                  <div className="mt-4">
                    <OrderPhotosUpload
                      orderId={row.id}
                      onUploaded={async () => { await refresh(); }}
                    />
                  </div>
                )}
              </section>
            </div>

            {/* Right column */}
            <div className="space-y-4 lg:col-span-4">
              {/* Summary */}
              <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)]">
                <div className="text-sm font-semibold text-slate-900">Ringkasan</div>

                <div className="mt-3 grid gap-2 text-sm">
                  <RowLine label="Nomor" value={row.invoice_no ?? row.number ?? '-'} />
                  <RowLine label="Customer" value={row.customer?.name ?? '-'} />
                  <RowLine label="Total" value={money(row.grand_total)} strong />
                  <RowLine label="Dibayar" value={money((row as any)?.paid_amount ?? 0)} />
                  <RowLine label="Sisa" value={money(row.due_amount)} strong />
                </div>

                <div className="mt-4 grid gap-2 text-sm">
                  <RowLine label="Tanggal Masuk" value={row.received_at ? String(row.received_at).replace('T', ' ').slice(0, 16) : '—'} />
                  <RowLine label="Tanggal Selesai" value={row.ready_at ? String(row.ready_at).replace('T', ' ').slice(0, 16) : '—'} />
                </div>

                {(row.due_amount ?? 0) > 0 && (
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 active:bg-slate-950"
                      onClick={() => navigate(`/receivables?q=${encodeURIComponent(row.invoice_no ?? row.number ?? '')}`)}
                    >
                      Proses Pelunasan
                    </button>
                  </div>
                )}
              </section>

              {/* Status transitions */}
              <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)]">
                <div className="text-sm font-semibold text-slate-900">Ubah Status</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {getAllowedNext(row.status).map((s) => (
                    <button
                      key={s}
                      className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50"
                      onClick={() => void onTransit(s)}
                      title={`Set status ke ${s}`}
                    >
                      Set {s}
                    </button>
                  ))}

                  {getAllowedNext(row.status).length === 0 && (
                    <span className="text-xs text-slate-500">
                      Status terminal — tidak ada transisi.
                    </span>
                  )}
                </div>
              </section>
            </div>
          </div>

          {/* Receipt Preview Modal */}
          {receiptOpen && (
            <div
              className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 sm:items-center"
              onClick={() => setReceiptOpen(false)}
              role="dialog"
              aria-modal="true"
            >
              <div
                className="w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
                  <div className="text-sm font-semibold text-slate-900">Receipt Preview</div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
                      onClick={loadReceipt}
                      disabled={receiptLoading}
                      title="Muat ulang HTML struk"
                    >
                      {receiptLoading ? 'Memuat…' : 'Reload'}
                    </button>

                    <button
                      type="button"
                      className="inline-flex rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 active:bg-slate-950"
                      onClick={() => openOrderReceipt(row.id, true)}
                      title="Buka & print"
                    >
                      Open & Print
                    </button>

                    <button
                      type="button"
                      className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50"
                      onClick={() => setReceiptOpen(false)}
                      title="Tutup"
                    >
                      Tutup
                    </button>
                  </div>
                </div>

                {receiptErr && (
                  <div className="px-4 py-3 text-sm text-red-700">
                    {receiptErr}
                  </div>
                )}

                {!receiptErr && receiptLoading && (
                  <div className="px-4 py-3 text-sm text-slate-600">
                    Memuat struk…
                  </div>
                )}

                {!receiptErr && !receiptLoading && !receiptHtml && (
                  <div className="px-4 py-3 text-sm text-slate-600">
                    Belum ada HTML struk.
                  </div>
                )}

                {!receiptErr && !!receiptHtml && (
                  <div className="p-4">
                    <ReceiptPreview html={receiptHtml} height="70vh" />
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ------------------------
   Presentational helpers (UI-only)
------------------------- */

function Th({
  children,
  className = '',
  ...rest
}: React.ComponentProps<'th'>) {
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${className}`}
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
    <td className={`px-4 py-3 align-middle ${className}`} {...rest}>
      {children}
    </td>
  );
}

function Kpi({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
      <div className="text-xs text-slate-500">{label}</div>
      <div className={`mt-0.5 text-sm ${strong ? 'font-semibold text-slate-900' : 'text-slate-800'}`}>{value}</div>
    </div>
  );
}

function RowLine({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="text-slate-500">{label}</div>
      <div className={`text-right ${strong ? 'font-semibold text-slate-900' : 'text-slate-800'}`}>{value}</div>
    </div>
  );
}

```
</details>

### src/pages/orders/OrderReceipt.tsx

- SHA: `c54d446a320c`  
- Ukuran: 19 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/orders/OrderReceipt.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderReceiptHtml, getOrder, createOrderShareLink } from '../../api/orders';
import { buildWhatsAppLink } from '../../utils/wa';
import type { Order } from '../../types/orders';
import { toIDR } from '../../utils/money';

type Paper = '58' | '80' | 'A4';

// 1 mm ≈ 3.77953 px (CSS 96dpi)
const MM_TO_PX = 3.7795275591;
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

function IconPrinter(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M6 9V3h12v6" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <path d="M6 14h12v7H6z" />
    </svg>
  );
}
function IconExternal(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M14 3h7v7" />
      <path d="M10 14 21 3" />
      <path d="M21 14v6a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6" />
    </svg>
  );
}
function IconLink(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M10 13a5 5 0 0 1 0-7l1.5-1.5a5 5 0 0 1 7 7L17 13" />
      <path d="M14 11a5 5 0 0 1 0 7L12.5 19.5a5 5 0 0 1-7-7L7 11" />
    </svg>
  );
}
function IconWA(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" width="18" height="18" {...props}>
      <path
        fill="currentColor"
        d="M19.11 17.48c-.28-.14-1.64-.81-1.9-.9-.25-.1-.44-.14-.63.14-.18.28-.72.9-.88 1.09-.16.18-.32.21-.6.07-.28-.14-1.17-.43-2.23-1.37-.82-.73-1.37-1.64-1.53-1.91-.16-.28-.02-.43.12-.57.12-.12.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.35-.02-.49-.07-.14-.63-1.51-.87-2.06-.23-.56-.47-.48-.63-.49-.16-.01-.35-.01-.53-.01-.18 0-.49.07-.74.35-.25.28-.98.96-.98 2.35s1 2.73 1.14 2.92c.14.18 1.97 3.01 4.77 4.22.67.29 1.19.46 1.6.59.67.21 1.29.18 1.77.11.54-.08 1.64-.67 1.87-1.32.23-.65.23-1.21.16-1.32-.07-.11-.25-.18-.53-.32z"
      />
      <path
        fill="currentColor"
        d="M26.67 5.33A14.62 14.62 0 0 0 16.02 1C8.07 1 1.61 7.46 1.61 15.41c0 2.54.66 5.03 1.92 7.23L1 31l8.56-2.49a14.4 14.4 0 0 0 6.46 1.65h.01c7.95 0 14.41-6.46 14.41-14.41 0-3.85-1.5-7.46-4.17-10.42zM16.02 27.6h-.01c-2.14 0-4.24-.57-6.08-1.64l-.43-.26-5.08 1.48 1.36-4.95-.28-.51a12.03 12.03 0 0 1-1.86-6.31c0-6.66 5.42-12.08 12.09-12.08 3.22 0 6.25 1.25 8.53 3.52a12 12 0 0 1 3.56 8.56c0 6.66-5.42 12.19-12.08 12.19z"
      />
    </svg>
  );
}

export default function OrderReceipt(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const [html, setHtml] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [waPhone, setWaPhone] = useState<string>('');
  const [order, setOrder] = useState<Order | null>(null);
  const [shareUrl, setShareUrl] = useState<string>('');

  const [paper, setPaper] = useState<Paper>('58');
  const [zoom, setZoom] = useState<number>(1); // 1 = 100%

  // ====== Data fetch ======
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
        } catch { /* lanjutkan */ }

        try {
          const link = await createOrderShareLink(id);
          setShareUrl(link);
        } catch { /* abaikan, tetap bisa cetak manual */ }
      } catch (e: unknown) {
        setError((e as Error).message || 'Gagal memuat struk');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // ====== Derived UI state ======
  const isReceivableOpen = useMemo(() => Number(order?.due_amount ?? 0) > 0, [order?.due_amount]);
  const statusLabel = isReceivableOpen ? 'Piutang' : 'Lunas';

  const statusPillClass = isReceivableOpen
    ? 'bg-amber-50 text-amber-700 ring-amber-200'
    : 'bg-emerald-50 text-emerald-700 ring-emerald-200';

  const paperLabel = paper === '58' ? '58mm' : paper === '80' ? '80mm' : 'A4';
  const previewWidthPx = useMemo(() => {
    if (paper === '58') return Math.round(58 * MM_TO_PX);     // ≈ 219 px
    if (paper === '80') return Math.round(80 * MM_TO_PX);     // ≈ 302 px
    return Math.round(210 * MM_TO_PX);                        // A4 ≈ 794 px
  }, [paper]);

  // ====== Print helpers ======
  const buildPrintDoc = (content: string, pageSize: string, title: string, autoPrint = true) => {
    return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${title}</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  html,body{ margin:0; padding:0; }
  body{ font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial; background:#fff; }
  *{ box-sizing: border-box; }
  @media print { @page { size: ${pageSize}; margin: 0; } }
</style>
</head>
<body>
  <div id="receipt-root">${content}</div>
  <script>${autoPrint ? 'window.onload=()=>{window.print();setTimeout(()=>window.close(),400);}' : ''}</script>
</body>
</html>`;
  };

  const onPrint = () => {
    const nomor = order?.invoice_no ?? order?.number ?? 'Receipt';
    const pageSize = paper === 'A4' ? 'A4 portrait' : paper === '58' ? '58mm auto' : '80mm auto';
    const doc = buildPrintDoc(html, pageSize, `Receipt ${nomor}`, true);
    const w = window.open('', '_blank', 'noopener,noreferrer');
    if (!w) return window.print();
    w.document.open(); w.document.write(doc); w.document.close();
  };

  const onOpenNewTab = () => {
    const nomor = order?.invoice_no ?? order?.number ?? 'Receipt';
    const pageSize = paper === 'A4' ? 'A4 portrait' : paper === '58' ? '58mm auto' : '80mm auto';
    const doc = buildPrintDoc(html, pageSize, `Receipt ${nomor}`, false);
    const w = window.open('', '_blank', 'noopener,noreferrer');
    if (!w) return;
    w.document.open(); w.document.write(doc); w.document.close();
  };

  // ====== WhatsApp helpers ======
  const buildWAMessage = () => {
    const nomor = order?.invoice_no ?? order?.number ?? '-';
    const total = toIDR(Number(order?.grand_total ?? 0));
    const kwitansi = shareUrl || '';
    const name = order?.customer?.name ?? 'Pelanggan';
    const isUnpaid = Number(order?.due_amount ?? 0) > 0;

    if (isUnpaid) {
      return [
        `Halo ${name},`,
        'Berikut tagihan laundry Anda.',
        `Kwitansi: ${kwitansi}`,
        `No: ${nomor}`,
        `Total: ${total}`,
        'Mohon melakukan pembayaran.',
        'Salve Laundry',
      ].join('\n');
    }

    return [
      `Halo ${name},`,
      'Terima kasih atas pembayarannya.',
      `Kwitansi: ${kwitansi}`,
      `No: ${nomor}`,
      `Total: ${total}`,
      'Terima Kasih Sudah Menggunakan Layanan.',
      'Salve Laundry',
    ].join('\n');
  };

  const onSendWA = () => {
    if (!waPhone || !shareUrl) return;
    window.open(buildWhatsAppLink(waPhone, buildWAMessage()), '_blank');
  };

  const onCopyWAText = async () => {
    try {
      await navigator.clipboard?.writeText(shareUrl || '');
    } catch { /* abaikan */ }
  };

  const onCopyShareLink = async () => {
    try {
      await navigator.clipboard?.writeText(shareUrl || '');
    } catch { /* abaikan */ }
  };

  // ====== Iframe preview (isolated) ======
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [frameKey, setFrameKey] = useState(0);
  const [frameHeight, setFrameHeight] = useState<number>(320);

  const previewDoc = useMemo(() => {
    return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  html,body{ margin:0; padding:0; }
  body{ font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial; background:#fff; color:#000; }
  *{ box-sizing: border-box; }
  pre{ white-space: pre-wrap; word-wrap: break-word; }
</style>
</head>
<body>
  <div id="receipt-root">${html}</div>
</body>
</html>`;
  }, [html]);

  // Remount iframe saat ukuran/zoom berubah
  useEffect(() => { setFrameKey((k) => k + 1); }, [previewDoc, previewWidthPx, zoom]);

  const onFrameLoad = () => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    const h = Math.max(
      doc.body?.scrollHeight || 0,
      doc.documentElement?.scrollHeight || 0,
      280
    );
    setFrameHeight(h);
  };

  // ====== UI states ======
  if (loading) {
    return (
      <div className="mx-auto max-w-5xl p-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)]">
          <div className="h-5 w-48 rounded bg-slate-200/70 animate-pulse mb-4" />
          <div className="h-3 w-full rounded bg-slate-200/70 animate-pulse mb-2" />
          <div className="h-3 w-5/6 rounded bg-slate-200/70 animate-pulse mb-2" />
          <div className="h-3 w-4/6 rounded bg-slate-200/70 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl p-4">
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  // ====== Render ======
  const nomor = order?.invoice_no ?? order?.number ?? '';
  const customer = order?.customer?.name ?? '-';
  const total = toIDR(Number(order?.grand_total ?? 0));

  return (
    <div className="mx-auto max-w-[1200px] p-4 space-y-4">
      {/* Header */}
      <header className="print:hidden flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-slate-900 truncate">
            Receipt {nomor}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
            <span className="truncate">{customer}</span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-slate-900">{total}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusPillClass}`}>
            {statusLabel}
          </span>
        </div>
      </header>

      {/* Top actions */}
      <section className="print:hidden rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)]">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end">
          {/* Actions */}
          <div className="lg:col-span-4">
            <div className="text-xs font-medium text-slate-600 mb-2">Aksi</div>
            <div className="flex flex-wrap gap-2">
              <button
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 active:bg-slate-950"
                onClick={onPrint}
                aria-label="Cetak struk"
              >
                <IconPrinter className="text-white" />
                Print
              </button>

              <button
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                onClick={onOpenNewTab}
                aria-label="Buka tab baru"
              >
                <IconExternal className="text-slate-700" />
                Open tab
              </button>
            </div>
          </div>

          {/* Paper */}
          <div className="lg:col-span-3">
            <div className="text-xs font-medium text-slate-600 mb-2">Ukuran kertas</div>
            <div className="inline-flex w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
              <button
                className={`flex-1 px-3 py-2 text-sm font-semibold ${paper === '58' ? 'bg-slate-900 text-white' : 'text-slate-900 hover:bg-slate-50'}`}
                onClick={() => setPaper('58')}
                aria-pressed={paper === '58'}
              >
                58mm
              </button>
              <button
                className={`flex-1 border-l border-slate-200 px-3 py-2 text-sm font-semibold ${paper === '80' ? 'bg-slate-900 text-white' : 'text-slate-900 hover:bg-slate-50'}`}
                onClick={() => setPaper('80')}
                aria-pressed={paper === '80'}
              >
                80mm
              </button>
              <button
                className={`flex-1 border-l border-slate-200 px-3 py-2 text-sm font-semibold ${paper === 'A4' ? 'bg-slate-900 text-white' : 'text-slate-900 hover:bg-slate-50'}`}
                onClick={() => setPaper('A4')}
                aria-pressed={paper === 'A4'}
              >
                A4
              </button>
            </div>
            <div className="mt-1 text-[11px] text-slate-500">Aktif: {paperLabel}</div>
          </div>

          {/* Zoom */}
          <div className="lg:col-span-3">
            <div className="text-xs font-medium text-slate-600 mb-2">Zoom</div>
            <div className="flex items-center gap-2">
              <button
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                onClick={() => setZoom((z) => clamp(Number((z - 0.1).toFixed(2)), 0.8, 2))}
                aria-label="Zoom out"
              >
                −
              </button>

              <input
                type="range"
                min={0.8}
                max={2}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full"
                aria-label="Zoom pratinjau"
              />

              <button
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                onClick={() => setZoom((z) => clamp(Number((z + 0.1).toFixed(2)), 0.8, 2))}
                aria-label="Zoom in"
              >
                +
              </button>

              <div className="w-14 text-right text-xs font-semibold text-slate-900">
                {Math.round(zoom * 100)}%
              </div>

              <button
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-slate-50"
                onClick={() => setZoom(1)}
                aria-label="Reset zoom"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Share + WA */}
          <div className="lg:col-span-2">
            <div className="text-xs font-medium text-slate-600 mb-2">Bagikan</div>
            <div className="flex flex-wrap gap-2">
              <button
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none"
                onClick={onCopyShareLink}
                disabled={!shareUrl}
                aria-label="Salin link kwitansi"
                title={shareUrl ? shareUrl : 'Link belum tersedia'}
              >
                <IconLink className="text-slate-700" />
                Copy
              </button>
            </div>
          </div>
        </div>

        {/* WhatsApp row */}
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-12 md:items-end">
          <div className="md:col-span-6">
            <label className="block text-xs font-medium text-slate-600">
              Nomor WhatsApp
            </label>
            <input
              type="tel"
              placeholder="No. WA (62…/08…)"
              value={waPhone}
              onChange={(e) => setWaPhone(e.target.value)}
              className="
                mt-1 w-full rounded-lg border border-slate-200 bg-white
                px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400
                focus:border-slate-900 focus:outline-none
              "
              aria-label="Nomor WhatsApp"
            />
          </div>

          <div className="md:col-span-6 flex flex-wrap gap-2 md:justify-end">
            <button
              className="
                inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2
                text-sm font-semibold text-white hover:bg-slate-800 active:bg-slate-950
                disabled:opacity-50 disabled:pointer-events-none
              "
              onClick={onSendWA}
              disabled={!waPhone || !shareUrl}
              aria-label="Kirim WhatsApp"
            >
              <IconWA className="text-white" />
              Kirim WA
            </button>

            <button
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              onClick={onCopyWAText}
              aria-label="Salin (link) untuk WA"
              title="Menyalin link kwitansi"
            >
              Salin
            </button>
          </div>

          <div className="md:col-span-12 text-xs text-slate-500">
            {shareUrl ? (
              <span>Link kwitansi siap dibagikan.</span>
            ) : (
              <span>Link kwitansi belum tersedia (tetap bisa print & open tab).</span>
            )}
          </div>
        </div>
      </section>

      {/* Preview canvas */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)] print:shadow-none print:border-0">
        <div
          className="w-full overflow-auto"
          style={{
            backgroundImage:
              'linear-gradient(0deg, rgba(2,6,23,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(2,6,23,0.05) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        >
          <div className="min-h-[360px] py-6 grid place-items-start justify-center">
            <iframe
              key={frameKey}
              ref={iframeRef}
              title="Receipt preview"
              srcDoc={previewDoc}
              onLoad={onFrameLoad}
              style={{
                width: `${previewWidthPx * zoom}px`,
                height: `${frameHeight}px`,
                background: '#fff',
                border: '1px solid rgba(15,23,42,0.12)',
                borderRadius: '14px',
                boxShadow: '0 18px 42px -26px rgba(0,0,0,.45)',
                margin: '0 auto'
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

```
</details>

### src/pages/orders/OrdersIndex.tsx

- SHA: `e69eee6f8929`  
- Ukuran: 15 KB
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

  const toWaLink = (raw?: string | null): string | null => {
    if (!raw) return null;

    // ambil hanya angka
    let digits = raw.replace(/\D/g, '');

    // jika diawali 0 → ubah ke 62 (Indonesia)
    if (digits.startsWith('0')) {
      digits = '62' + digits.slice(1);
    }

    return digits ? `https://wa.me/${digits}` : null;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-slate-900">Orders</h1>
          <p className="mt-1 text-sm text-slate-500">
            Kelola daftar pesanan, lihat detail, dan cetak struk.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/pos"
            className="
              inline-flex items-center justify-center
              rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white
              hover:bg-slate-800 active:bg-slate-950
            "
            aria-label="Buat transaksi baru"
          >
            Buat Transaksi
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <section
        className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)]"
        aria-label="Filter orders"
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-end">
          <div className="md:col-span-6">
            <label className="block text-xs font-medium text-slate-600">
              Pencarian
            </label>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                {/* search icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.2-3.2" />
                </svg>
              </span>
              <input
                className="
                  w-full rounded-lg border border-slate-200 bg-white
                  pl-10 pr-3 py-2 text-sm text-slate-900
                  placeholder:text-slate-400
                  focus:border-slate-900 focus:outline-none
                "
                placeholder="Cari nomor (INV…)/nama/phone…"
                value={q}
                onChange={(e) => { dlog('q input', e.target.value); setQ(e.target.value); }}
                aria-label="Cari pesanan"
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-slate-600">
              Status
            </label>
            <select
              className="
                mt-1 w-full rounded-lg border border-slate-200 bg-white
                px-3 py-2 text-sm text-slate-900
                focus:border-slate-900 focus:outline-none
              "
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
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <button
              className="
                inline-flex w-full items-center justify-center
                rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white
                hover:bg-slate-800 active:bg-slate-950
              "
              onClick={onApply}
            >
              Terapkan
            </button>
          </div>
        </div>
      </section>

      {/* Loading / Error / Empty */}
      {loading && (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          Memuat…
        </div>
      )}

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)]">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h10" />
            </svg>
          </div>
          <div className="text-sm font-medium text-slate-900">Data kosong</div>
          <div className="mt-1 text-sm text-slate-500">Coba ubah filter atau kata kunci pencarian.</div>
        </div>
      )}

      {/* Table */}
      {rows.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_10px_30px_-22px_rgba(0,0,0,.35)]">
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50 text-slate-600">
                <tr className="border-b border-slate-200">
                  <Th>Nomor</Th>
                  <Th>Customer</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Total</Th>
                  <Th className="text-right">Aksi</Th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {rows.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/60 transition-colors">
                    <Td className="font-medium text-slate-900 max-w-[180px] truncate" title={(o.invoice_no ?? o.number) ?? ''}>
                      {shortOrderNo(o.number, o.invoice_no)}
                    </Td>

                    <Td className="max-w-[240px] truncate" title={o.customer?.name ?? ''}>
                      <div className="flex flex-col">
                        <span className="text-slate-900">{o.customer?.name ?? '—'}</span>

                        {o.customer?.whatsapp && toWaLink(o.customer.whatsapp) ? (
                          <a
                            href={toWaLink(o.customer.whatsapp)!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-emerald-600 hover:underline truncate"
                          >
                            {o.customer.whatsapp}
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </div>
                    </Td>

                    <Td>
                      <StatusBadge status={o.status} />
                    </Td>

                    <Td className="text-right font-medium text-slate-900">
                      {Number(o.grand_total).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                    </Td>

                    <Td className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          to={`/orders/${o.id}`}
                          className="
                            inline-flex items-center justify-center
                            rounded-md border border-slate-200 bg-white px-3 py-1.5
                            text-xs font-semibold text-slate-900
                            hover:bg-slate-50
                          "
                        >
                          Detail
                        </Link>

                        <button
                          type="button"
                          className="
                            inline-flex items-center justify-center
                            rounded-md bg-slate-900 px-3 py-1.5
                            text-xs font-semibold text-white
                            hover:bg-slate-800 active:bg-slate-950
                          "
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

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="flex flex-col gap-2 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-slate-500">
                Menampilkan halaman <span className="font-semibold text-slate-900">{meta.current_page}</span> dari{' '}
                <span className="font-semibold text-slate-900">{meta.last_page}</span>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  disabled={page <= 1}
                  className="
                    inline-flex items-center justify-center rounded-md
                    border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900
                    hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none
                  "
                  onClick={onPrev}
                >
                  Prev
                </button>

                <button
                  disabled={page >= meta.last_page}
                  className="
                    inline-flex items-center justify-center rounded-md
                    border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900
                    hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none
                  "
                  onClick={onNext}
                >
                  Next
                </button>
              </div>
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
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${className}`}
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
    <td className={`px-4 py-3 align-middle ${className}`} {...rest}>
      {children}
    </td>
  );
}

function StatusBadge({ status }: { status: OrderBackendStatus }) {
  // Presentasi saja (badge), tidak mengubah logika data
  const base =
    'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset';

  // mapping warna (jelas dibaca, kontras aman)
  const cls =
    status === 'CANCELED'
      ? 'bg-red-50 text-red-700 ring-red-200'
      : status === 'READY'
        ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
        : status === 'PICKED_UP'
          ? 'bg-slate-900 text-white ring-slate-900'
          : status === 'DELIVERING'
            ? 'bg-blue-50 text-blue-700 ring-blue-200'
            : status === 'WASHING' || status === 'DRYING' || status === 'IRONING'
              ? 'bg-amber-50 text-amber-700 ring-amber-200'
              : 'bg-slate-50 text-slate-700 ring-slate-200';

  return <span className={`${base} ${cls}`}>{status}</span>;
}

```
</details>

### src/pages/pos/POSPage.tsx

- SHA: `067fb3d946b6`  
- Ukuran: 46 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/pos/POSPage.tsx
import React, { useEffect, useMemo, useState, useRef } from 'react';
import ProductSearch from '../../components/pos/ProductSearch';
import CartPanel, { type CartItem } from '../../components/pos/CartPanel';
import { createOrder, getOrder, createOrderPayment } from '../../api/orders';
import type { OrderCreatePayload } from '../../types/orders';
import type { PaymentCreatePayload, PaymentMethod } from '../../types/payments';
import type { RoleName } from '../../api/client';
import CustomerPicker from '../../components/customers/CustomerPicker';
import { createCustomer } from '../../api/customers';
import { uploadOrderPhotos } from '../../api/orderPhotos';
import { applyVoucherToOrder } from '../../api/vouchers';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/useAuth';
import { toIDR } from '../../utils/money';
import { getLoyaltySummary } from '../../api/loyalty';
import type { LoyaltySummary } from '../../types/loyalty';
import { getBranch } from '../../api/branches';
import type { Branch } from '../../types/branches';

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

/* ------------------------
   Small UI helpers
------------------------ */

function Card({
  title,
  subtitle,
  right,
  children,
  className = '',
}: {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={[
        'rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_-35px_rgba(0,0,0,.35)]',
        className,
      ].join(' ')}
    >
      {(title || subtitle || right) && (
        <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <div className="min-w-0">
            {title && <div className="text-sm font-semibold text-slate-900">{title}</div>}
            {subtitle && <div className="mt-0.5 text-xs text-slate-500">{subtitle}</div>}
          </div>
          {right && <div className="shrink-0">{right}</div>}
        </header>
      )}
      <div className="px-4 py-4">{children}</div>
    </section>
  );
}

function Badge({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode;
  tone?: 'neutral' | 'good' | 'warn' | 'bad' | 'brand';
}) {
  const cls =
    tone === 'good'
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
      : tone === 'warn'
        ? 'bg-amber-50 text-amber-700 ring-amber-100'
        : tone === 'bad'
          ? 'bg-red-50 text-red-700 ring-red-100'
          : tone === 'brand'
            ? 'bg-slate-900 text-white ring-slate-900/10'
            : 'bg-slate-50 text-slate-700 ring-slate-100';
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-medium ring-1 ${cls}`}>
      {children}
    </span>
  );
}

function PrimaryButton({
  children,
  disabled,
  onClick,
  className = '',
  type = 'button',
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        'inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white',
        'hover:bg-slate-800 active:bg-slate-950',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function OutlineButton({
  children,
  disabled,
  onClick,
  className = '',
  type = 'button',
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        'inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900',
        'hover:bg-slate-50 active:bg-slate-100',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function Input({
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900',
        'placeholder:text-slate-400',
        'focus:border-slate-900 focus:outline-none',
        'disabled:opacity-70',
        className,
      ].join(' ')}
    />
  );
}

function Textarea({
  className = '',
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={[
        'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900',
        'placeholder:text-slate-400',
        'focus:border-slate-900 focus:outline-none',
        'disabled:opacity-70',
        className,
      ].join(' ')}
    />
  );
}

export default function POSPage() {
  const nav = useNavigate();
  const { user, hasRole } = useAuth;
  const branchId = user?.branch_id ? String(user.branch_id) : '';
  const [branchName, setBranchName] = useState<string | null>(null);
  const branchNameFromUser =
    (user as any)?.branch?.name ??
    (user as any)?.branch_name ??
    null;

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
  const [modePickerOpen, setModePickerOpen] = useState(false);

  // voucher
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [voucherMsg, setVoucherMsg] = useState<string | null>(null);

  // branch name (display)
  useEffect(() => {
    if (!branchId) {
      setBranchName(null);
      return;
    }

    // isi dulu dari payload user jika ada (lebih cepat & tidak tergantung permission getBranch)
    setBranchName(branchNameFromUser);

    let alive = true;
    (async () => {
      try {
        const res = await getBranch(branchId);
        const raw = (res as any)?.data?.data ?? (res as any)?.data ?? null;
        const b = raw as Branch | null;
        if (alive) setBranchName(b?.name ?? branchNameFromUser ?? null);
      } catch {
        if (alive) setBranchName(branchNameFromUser ?? null);
      }
    })();

    return () => {
      alive = false;
    };
  }, [branchId, branchNameFromUser]);

  // quick add customer (POS)
  const [openCustomerCreate, setOpenCustomerCreate] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerWa, setNewCustomerWa] = useState('');
  const [newCustomerAddress, setNewCustomerAddress] = useState('');
  const [savingCustomer, setSavingCustomer] = useState(false);
  const [customerError, setCustomerError] = useState<string | null>(null);

  // Loyalty (preview stamp)
  const [loyRefreshKey, setLoyRefreshKey] = useState(0);
  const [loy, setLoy] = useState<LoyaltySummary | null>(null);
  useEffect(() => {
    if (!customerId) {
      setLoy(null);
      return;
    }
    getLoyaltySummary(customerId, branchId)
      .then((r: any) => {
        const data: LoyaltySummary = 'data' in r ? r.data : r;
        setLoy(data);
      })
      .catch(() => setLoy(null));
  }, [customerId, branchId, loyRefreshKey]);

  // Tanggal masuk & selesai
  const pad = (n: number) => String(n).padStart(2, '0');
  const nowLocal = () => {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
  };
  const [receivedAt, setReceivedAt] = useState<string>(() => nowLocal());
  const [readyAt, setReadyAt] = useState<string | null>(null);

  function toLocalInputValue(v?: string | null): string {
    if (!v) return '';
    const s = String(v).trim();
    if (s.includes('T')) return s.replace('Z', '').slice(0, 16);
    return s.replace(' ', 'T').slice(0, 16);
  }
  function fromLocalInputValue(v: string): string | null {
    if (!v) return null;
    return v.trim().replace('T', ' ') + ':00';
  }

  const normalizeWa = (input: string) => (input || '').replace(/[^\d]/g, '');

  // totals
  const subtotal = useMemo(() => items.reduce((s, it) => s + it.price * it.qty, 0), [items]);
  const total = useMemo(() => Math.max(0, subtotal - discount), [subtotal, discount]);
  const payableNow = useMemo(() => {
    if (mode === 'PENDING') return 0;
    if (mode === 'DP') return Math.max(0, Math.min(dpAmount, total));
    return total;
  }, [mode, dpAmount, total]);
  const grand = useMemo(() => Math.max(0, subtotal - (discount || 0)), [subtotal, discount]);

  const loyaltyPreview = useMemo(() => {
    if (!loy || subtotal <= 0) return { reward: 'NONE' as 'NONE' | 'DISC25' | 'FREE100', discount: 0, next: 1, stamps: 0 };
    const next = loy.next;
    let disc = 0;
    if (next === 5) disc = subtotal * 0.25;
    if (next === 10) disc = subtotal;
    return { reward: next === 5 ? 'DISC25' : next === 10 ? 'FREE100' : 'NONE', discount: disc, next, stamps: loy.stamps };
  }, [loy, subtotal]);

  const predictedGrand = useMemo(
    () => Math.max(0, subtotal - (discount || 0) - (loyaltyPreview.discount || 0)),
    [subtotal, discount, loyaltyPreview.discount]
  );

  const canSubmit = useMemo(() => items.length > 0 && !!customerId && !loading, [items.length, customerId, loading]);

  const parseForCompare = (s?: string | null) => {
    if (!s) return NaN;
    const t = s.includes('T') ? s : s.replace(' ', 'T');
    return Date.parse(t);
  };
  const dateErr = useMemo(() => {
    if (!readyAt) return null;
    return parseForCompare(readyAt) >= parseForCompare(receivedAt) ? null : 'Tanggal selesai harus ≥ tanggal masuk.';
  }, [receivedAt, readyAt]);

  // logs
  useEffect(() => {
    dlog('mount');
    return () => dlog('unmount');
  }, []);
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

  // submit (LOGIC UNCHANGED)
  async function onSubmit() {
    dlog('onSubmit start');
    if (items.length === 0) return setError('Keranjang kosong');
    if (hasRole(['Kasir', 'Admin Cabang']) && !branchId) return setError('Akun Anda belum terikat ke cabang. Hubungi admin pusat.');
    if (!customerId) return setError('Pelanggan wajib dipilih.');
    if (dateErr) return setError(dateErr);
    if (mode === 'DP' && (payableNow <= 0 || payableNow > total)) return setError('Nominal DP tidak valid (≤ 0 atau melebihi grand total).');
    if (mode === 'FULL' && payableNow <= 0) return setError('Nominal pembayaran harus > 0 untuk mode FULL.');

    setLoading(true); setError(null);
    try {
      const payload: OrderCreatePayload = {
        customer_id: customerId,
        items: items.map((it) => ({ service_id: it.service_id, qty: it.qty, note: it.note ?? null })),
        discount: discount || 0,
        notes: notes || null,
        received_at: receivedAt || null,
        ready_at: readyAt || null,
      };
      dlog('createOrder payload', payload);
      const res = await createOrder(payload);
      let order = res.data!;

      if (voucherCode.trim()) {
        try {
          setVoucherMsg(null);
          await applyVoucherToOrder(String(order.id), { code: voucherCode.trim().toUpperCase() });
          const refreshed = await getOrder(String(order.id));
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

      const adjustedPayNow = Math.min(payableNow, Number(order?.grand_total ?? payableNow));
      if (canPay && mode !== 'PENDING') {
        const payPayload: PaymentCreatePayload =
          mode === 'DP'
            ? { method: 'DP', amount: adjustedPayNow, paid_at: nowLocal() }
            : { method, amount: adjustedPayNow, paid_at: nowLocal() };

        dlog('createOrderPayment payload', payPayload);
        const payRes = await createOrderPayment(order.id, payPayload);
        order = payRes.order;
      }

      try {
        if (beforeFiles.length || afterFiles.length) {
          dlog('uploadOrderPhotos start', { before: beforeFiles.length, after: afterFiles.length });
          await uploadOrderPhotos(order.id, beforeFiles, afterFiles);
          dlog('uploadOrderPhotos done');
        }
      } catch (e) {
        console.warn('[POSPage] upload photos failed', e);
      }

      setLoyRefreshKey((v) => v + 1);
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

  const itemsCount = useMemo(() => items.reduce((n, it) => n + it.qty, 0), [items]);

  return (
    <div className="min-h-dvh bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-[1280px] px-3 py-4 sm:px-6 sm:py-6">
        {/* Header */}
        <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-lg font-semibold">Point of Sale</h1>
              <Badge tone={branchId ? 'brand' : 'warn'}>
                {branchId
                  ? `Cabang: ${branchName ?? branchNameFromUser ?? `#${branchId}`}`
                  : 'Cabang belum terikat'}
              </Badge>
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Alur cepat: cari layanan → pilih customer → set pembayaran → simpan & cetak.
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="neutral">Enter tambah</Badge>
            <Badge tone="neutral">Del hapus</Badge>

            {/* Icon keranjang (popup) */}
            <button
              type="button"
              onClick={() => setMobileCartOpen(true)}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100"
              aria-label="Buka keranjang"
            >
              {/* icon cart (inline svg, tanpa file baru) */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 6H21L20 13H7L6 6Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 6L5 3H2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M7 13L6.5 16H19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M9 20a1 1 0 100-2 1 1 0 000 2Z"
                  fill="currentColor"
                />
                <path
                  d="M18 20a1 1 0 100-2 1 1 0 000 2Z"
                  fill="currentColor"
                />
              </svg>

              {itemsCount > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex min-w-[20px] items-center justify-center rounded-full bg-slate-900 px-1.5 py-0.5 text-[11px] font-bold text-white">
                  {itemsCount}
                </span>
              )}
            </button>

            <OutlineButton
              onClick={() => {
                dlog('cancel/back clicked');
                history.back();
              }}
            >
              Kembali
            </OutlineButton>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid gap-4 lg:grid-cols-[1fr_440px]">
          {/* LEFT */}
          <section className="space-y-4">
            <Card
              title="Cari Layanan"
              subtitle="Gunakan pencarian untuk menambah item ke keranjang."
              right={<Badge tone="neutral">{itemsCount} item</Badge>}
            >
              <ProductSearch onPick={addItem} />
            </Card>

            <Card
              title="Foto Pesanan"
              subtitle="Opsional. Drop file di desktop, atau buka kamera di mobile."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <UploadBox
                  title="Before"
                  isMobile={isMobile}
                  inputRef={beforeRef}
                  files={beforeFiles}
                  onFiles={(f) => setBeforeFiles((prev) => [...prev, ...f])}
                />
                <UploadBox
                  title="After"
                  isMobile={isMobile}
                  inputRef={afterRef}
                  files={afterFiles}
                  onFiles={(f) => setAfterFiles((prev) => [...prev, ...f])}
                />
              </div>
            </Card>

            <Card
              title="Detail Order"
              subtitle="Customer wajib dipilih. Voucher diterapkan saat simpan."
              right={
                <PrimaryButton
                  onClick={() => {
                    setCustomerError(null);
                    setOpenCustomerCreate(true);
                  }}
                >
                  + Customer
                </PrimaryButton>
              }
            >
              <div className="space-y-4">
                {/* Customer */}
                <div className="grid gap-1">
                  <label className="text-xs font-medium text-slate-700">
                    Pelanggan <span className="text-red-600">*</span>
                  </label>
                  <CustomerPicker
                    value={customerId}
                    onChange={setCustomerId}
                    placeholder="Ketik nama/WA/alamat pelanggan…"
                    requiredText="Pelanggan wajib dipilih dari data terdaftar."
                  />
                </div>

                {/* Dates */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="grid gap-1">
                    <label className="text-xs font-medium text-slate-700">Tanggal Masuk</label>
                    <Input
                      type="datetime-local"
                      value={toLocalInputValue(receivedAt)}
                      onChange={(e) => setReceivedAt(fromLocalInputValue(e.target.value) || nowLocal())}
                    />
                  </div>
                  <div className="grid gap-1">
                    <label className="text-xs font-medium text-slate-700">Tanggal Selesai (opsional)</label>
                    <Input
                      type="datetime-local"
                      value={toLocalInputValue(readyAt)}
                      onChange={(e) => setReadyAt(fromLocalInputValue(e.target.value))}
                    />
                    {dateErr && <div className="text-[11px] text-red-600">{dateErr}</div>}
                  </div>
                </div>

                {/* Voucher */}
                <div className="grid gap-1">
                  <label className="text-xs font-medium text-slate-700">Kode Voucher</label>
                  <Input
                    placeholder="MASUKKAN-KODE"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                  />
                  <div className="text-[11px] text-slate-500">Voucher diproses saat “Simpan & Cetak”.</div>
                  {voucherMsg && (
                    <div className="text-xs text-slate-700">
                      <Badge tone={voucherMsg.toLowerCase().includes('berhasil') ? 'good' : 'warn'}>{voucherMsg}</Badge>
                    </div>
                  )}
                </div>

                {/* Discount + notes */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="grid gap-1">
                    <label className="text-xs font-medium text-slate-700">Diskon (Rp)</label>
                    <Input
                      type="number"
                      min={0}
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                    />
                  </div>
                  <div className="grid gap-1">
                    <label className="text-xs font-medium text-slate-700">Catatan (opsional)</label>
                    <Input
                      placeholder="Mis. warna, kondisi, permintaan khusus…"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-1">
                  <label className="text-xs font-medium text-slate-700">Catatan Tambahan (lebih panjang)</label>
                  <Textarea
                    className="min-h-[92px]"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Tulis catatan detail jika diperlukan…"
                  />
                </div>
              </div>
            </Card>

            {/* Customer modal */}
            {openCustomerCreate && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3"
                role="dialog"
                aria-modal="true"
                onClick={() => { if (!savingCustomer) setOpenCustomerCreate(false); }}
              >
                <div
                  className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-[0_28px_70px_-40px_rgba(0,0,0,.5)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3">
                    <div>
                      <div className="text-base font-semibold">Tambah Customer</div>
                      <div className="text-xs text-slate-500">Tanpa keluar dari POS</div>
                    </div>
                    <OutlineButton disabled={savingCustomer} onClick={() => setOpenCustomerCreate(false)} className="px-3 py-2">
                      Tutup
                    </OutlineButton>
                  </div>

                  <div className="px-4 py-4">
                    {customerError && (
                      <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {customerError}
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="grid gap-1">
                        <label className="text-xs font-medium text-slate-700">
                          Nama <span className="text-red-600">*</span>
                        </label>
                        <Input
                          value={newCustomerName}
                          onChange={(e) => setNewCustomerName(e.target.value)}
                          placeholder="Nama pelanggan"
                          disabled={savingCustomer}
                        />
                      </div>

                      <div className="grid gap-1">
                        <label className="text-xs font-medium text-slate-700">
                          WhatsApp <span className="text-red-600">*</span>
                        </label>
                        <Input
                          value={newCustomerWa}
                          onChange={(e) => setNewCustomerWa(e.target.value)}
                          placeholder="08123456789"
                          inputMode="numeric"
                          disabled={savingCustomer}
                        />
                      </div>

                      <div className="grid gap-1">
                        <label className="text-xs font-medium text-slate-700">Alamat (opsional)</label>
                        <Textarea
                          className="min-h-[84px]"
                          value={newCustomerAddress}
                          onChange={(e) => setNewCustomerAddress(e.target.value)}
                          placeholder="Alamat pelanggan"
                          disabled={savingCustomer}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                      <OutlineButton disabled={savingCustomer} onClick={() => setOpenCustomerCreate(false)}>
                        Batal
                      </OutlineButton>
                      <PrimaryButton
                        disabled={savingCustomer}
                        onClick={async () => {
                          if (!newCustomerName.trim() || !newCustomerWa.trim()) {
                            setCustomerError('Nama dan WhatsApp wajib diisi.');
                            return;
                          }
                          if (hasRole(['Kasir', 'Admin Cabang']) && !branchId) {
                            setCustomerError('Akun Anda belum terikat ke cabang. Hubungi admin pusat.');
                            return;
                          }

                          try {
                            setSavingCustomer(true);
                            setCustomerError(null);

                            const res = await createCustomer({
                              name: newCustomerName.trim(),
                              whatsapp: normalizeWa(newCustomerWa),
                              address: newCustomerAddress.trim() ? newCustomerAddress.trim() : null,
                              notes: null,
                            });

                            const created = (res as any)?.data?.data ?? (res as any)?.data ?? null;
                            if (!created || !created.id) {
                              setCustomerError('Gagal: server tidak mengembalikan data customer (id kosong).');
                              return;
                            }
                            setCustomerId(String(created.id));

                            setNewCustomerName('');
                            setNewCustomerWa('');
                            setNewCustomerAddress('');

                            setOpenCustomerCreate(false);
                          } catch (err: any) {
                            setCustomerError(err?.response?.data?.message || 'Gagal menambahkan customer.');
                          } finally {
                            setSavingCustomer(false);
                          }
                        }}
                      >
                        {savingCustomer ? 'Menyimpan…' : 'Simpan'}
                      </PrimaryButton>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* RIGHT */}
          <aside className="space-y-4 lg:sticky lg:top-6 lg:h-[calc(100dvh-3rem)] lg:overflow-auto">
            <Card
              title="Checkout"
              subtitle="Ringkasan total dan pembayaran."
              right={<Badge tone={canPay ? 'good' : 'warn'}>{canPay ? 'Bisa bayar' : 'Tidak bisa bayar'}</Badge>}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500">Subtotal</div>
                  <div className="text-sm font-semibold">{toIDR(subtotal)}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500">Diskon</div>
                  <div className="text-sm font-semibold">{toIDR(discount || 0)}</div>
                </div>
                <div className="h-px bg-slate-200" />
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Grand Total</div>
                  <div className="text-lg font-extrabold tracking-tight">{toIDR(grand)}</div>
                </div>

                {!!(loyaltyPreview.discount > 0) && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">Perkiraan setelah loyalti</span>
                      <span className="font-semibold text-slate-900">{toIDR(predictedGrand)}</span>
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500">
                      {loyaltyPreview.reward === 'DISC25' && 'Reward next: diskon 25%'}
                      {loyaltyPreview.reward === 'FREE100' && 'Reward next: gratis 100%'}
                      {loyaltyPreview.reward === 'NONE' && 'Reward next: -'}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <Card
              title="Stamp Loyalty"
              subtitle={loy ? `Stamp ${loy.stamps}/10 · Next ${loy.next}` : 'Pilih customer untuk melihat stamp.'}
              right={<Badge tone={loy ? 'neutral' : 'warn'}>{loy ? 'Aktif' : 'Belum dipilih'}</Badge>}
            >
              <div className="grid grid-cols-10 gap-1" aria-label="Loyalty stamps">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2.5 rounded-full ${loy && i < loy.stamps ? 'bg-slate-900' : 'bg-slate-200'}`}
                    title={`Stamp ${i + 1}`}
                  />
                ))}
              </div>
              <div className="mt-2 text-[11px] text-slate-600">
                {loyaltyPreview.reward === 'DISC25' && 'Transaksi berikutnya mendapat diskon 25%.'}
                {loyaltyPreview.reward === 'FREE100' && 'Transaksi berikutnya GRATIS (100%).'}
                {loyaltyPreview.reward === 'NONE' && 'Belum ada benefit pada transaksi berikutnya.'}
              </div>
            </Card>

            <Card title="Pembayaran" subtitle="Pilih mode pembayaran (Pending/DP/Full).">
              <div className="space-y-3">
                {/* Mode (ringkas -> buka popup) */}
                <div>
                  <div className="mb-1 text-xs font-semibold text-slate-700">Mode Pembayaran</div>
                  <button
                    type="button"
                    onClick={() => setModePickerOpen(true)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm font-semibold text-slate-900 hover:bg-slate-50"
                  >
                    <div className="flex items-center justify-between">
                      <span>{mode}</span>
                      <span className="text-xs text-slate-500">Ubah</span>
                    </div>
                    <div className="mt-0.5 text-[11px] text-slate-500">
                      {mode === 'PENDING' && 'Order disimpan tanpa pembayaran.'}
                      {mode === 'DP' && 'Bayar sebagian (DP) sekarang.'}
                      {mode === 'FULL' && 'Bayar lunas dengan metode Cash/QRIS/Transfer.'}
                    </div>
                  </button>
                </div>

                {mode === 'FULL' && (
                  <div>
                    <div className="mb-1 text-xs font-semibold text-slate-700">Metode</div>
                    <div className="flex flex-wrap gap-2">
                      {(['CASH', 'QRIS', 'TRANSFER'] as PaymentMethod[]).map((pm) => {
                        const active = method === pm;
                        return (
                          <button
                            key={pm}
                            onClick={() => setMethod(pm)}
                            className={[
                              'rounded-xl border px-3 py-2 text-sm font-semibold transition-colors',
                              active ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white hover:bg-slate-50',
                            ].join(' ')}
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
                    <div className="mb-1 text-xs font-semibold text-slate-700">Nominal DP</div>
                    <Input
                      type="number"
                      min={0}
                      max={total}
                      value={dpAmount}
                      onChange={(e) => setDpAmount(Number(e.target.value) || 0)}
                      placeholder="Masukkan nominal DP"
                    />
                    <div className="mt-1 text-xs text-slate-600">
                      Dibayar sekarang: <span className="font-semibold text-slate-900">{toIDR(payableNow)}</span>
                    </div>
                  </div>
                )}

                {error && (
                  <div role="alert" aria-live="polite" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="grid gap-2 sm:grid-cols-2">
                  <PrimaryButton disabled={loading || !canSubmit} onClick={() => void onSubmit()}>
                    {loading ? 'Menyimpan…' : 'Simpan & Cetak'}
                  </PrimaryButton>
                  <OutlineButton
                    disabled={loading}
                    onClick={() => {
                      dlog('cancel/back clicked');
                      history.back();
                    }}
                  >
                    Batal
                  </OutlineButton>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>

      {/* Popup Keranjang (via icon) */}
      {mobileCartOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-3"
          onClick={() => setMobileCartOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div>
                <div className="text-sm font-semibold text-slate-900">Keranjang</div>
                <div className="mt-0.5 text-xs text-slate-500">
                  {itemsCount} item · Subtotal {toIDR(subtotal)} · Grand {toIDR(grand)}
                </div>
              </div>
              <button
                type="button"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                onClick={() => setMobileCartOpen(false)}
              >
                Tutup
              </button>
            </div>

            <div className="max-h-[70dvh] overflow-auto p-4">
              <CartPanel
                items={items}
                onChangeQty={onChangeQty}
                onChangeNote={onChangeNote}
                onRemove={onRemove}
              />
            </div>
          </div>
        </div>
      )}

      {/* Popup pilih mode pembayaran */}
      {modePickerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-3"
          onClick={() => setModePickerOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-200">
              <div className="text-sm font-semibold text-slate-900">Pilih Mode Pembayaran</div>
              <div className="text-xs text-slate-500 mt-0.5">Mode akan mengatur alur DP/Full saat checkout.</div>
            </div>

            <div className="p-3 space-y-2">
              {(['PENDING', 'DP', 'FULL'] as const).map((m) => {
                const active = mode === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setMode(m);
                      if (m !== 'DP') setDpAmount(0);
                      if (m === 'FULL') setMethod('CASH');
                      setModePickerOpen(false);
                    }}
                    className={[
                      'w-full rounded-xl border px-3 py-2 text-left transition-colors',
                      active
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-900',
                    ].join(' ')}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{m}</span>
                      {active && <span className="text-xs opacity-90">Aktif</span>}
                    </div>
                    <div className={['mt-0.5 text-[11px]', active ? 'text-white/80' : 'text-slate-500'].join(' ')}>
                      {m === 'PENDING' && 'Simpan order tanpa pembayaran sekarang.'}
                      {m === 'DP' && 'Bayar sebagian sekarang, sisanya jadi piutang/sisa tagihan.'}
                      {m === 'FULL' && 'Bayar lunas sekarang (Cash/QRIS/Transfer).'}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                onClick={() => setModePickerOpen(false)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------
   Subcomponents (UI) - unchanged logic
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
  inputRef: React.RefObject<HTMLInputElement> | React.MutableRefObject<HTMLInputElement | null>;
  files: File[];
  onFiles: (f: File[]) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs font-semibold text-slate-800">{title}</div>
        <Badge tone={files.length ? 'good' : 'neutral'}>{files.length ? `${files.length} file` : 'Kosong'}</Badge>
      </div>

      <div
        className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const dropped = Array.from(e.dataTransfer.files || []);
          onFiles(dropped);
        }}
      >
        {isMobile ? (
          <PrimaryButton onClick={() => inputRef.current?.click()} className="w-full">
            Buka Kamera
          </PrimaryButton>
        ) : (
          <div className="space-y-2">
            <div className="text-xs text-slate-600">Drop file ke sini atau pilih file.</div>
            <OutlineButton onClick={() => inputRef.current?.click()} className="w-full">
              Pilih File
            </OutlineButton>
          </div>
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
        <ul className="mt-3 space-y-1 text-xs text-slate-700">
          {files.slice(0, 4).map((f, i) => (
            <li key={i} className="truncate">
              • {f.name}
            </li>
          ))}
          {files.length > 4 && <li className="text-slate-500">+{files.length - 4} file lainnya…</li>}
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
      <div className="fixed inset-x-0 bottom-0 z-30 lg:hidden">
        <div className="mx-auto max-w-[1280px] px-3 pb-[env(safe-area-inset-bottom)]">
          <div className="rounded-t-2xl border border-slate-200 bg-white shadow-[0_-18px_45px_-35px_rgba(0,0,0,.35)] p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs font-semibold">{itemsCount} item</div>
                <div className="text-xs text-slate-500 truncate">Total {toIDR(total)}</div>
              </div>
              <PrimaryButton onClick={() => setOpen(true)} aria-expanded={open} aria-controls="mobile-cart-sheet">
                Buka Keranjang
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>

      {/* bottom sheet */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-cart-title"
          onClick={() => setOpen(false)}
        >
          <div
            id="mobile-cart-sheet"
            className="absolute inset-x-0 bottom-0 max-h-[82dvh] overflow-auto rounded-t-3xl border border-slate-200 bg-white shadow-[0_-28px_70px_-40px_rgba(0,0,0,.55)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <div id="mobile-cart-title" className="text-sm font-semibold">
                Keranjang
              </div>
              <OutlineButton className="px-3 py-2" onClick={() => setOpen(false)}>
                Tutup
              </OutlineButton>
            </div>
            <div className="px-4 py-4">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}

```
</details>

### src/pages/receivables/ReceivablesIndex.tsx

- SHA: `9d7d05f047f7`  
- Ukuran: 11 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/receivables/ReceivablesIndex.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Receivable, ReceivableQuery, ReceivableStatus } from "../../types/receivables";
import { listReceivables } from "../../api/receivables";
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
      setRows(res.data ?? []);
      setMeta((res.meta as Meta) ?? null);
    } catch {
      setError("Gagal memuat data piutang.");
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Receivables</h1>
          <p className="text-xs text-gray-600">Daftar piutang & status pelunasan</p>
        </div>
      </div>

      {/* Toolbar (FilterBar) */}
      <section
        className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1"
        aria-label="Toolbar filter piutang"
      >
        <div className="p-3 grid grid-cols-1 lg:grid-cols-[1fr_auto_auto_auto] gap-3">
          {/* Search */}
          <div className="relative">
            <label className="sr-only" htmlFor="cari">Cari</label>
            <input
              id="cari"
              value={q}
              onChange={(e) => { setPage(1); setQ(e.target.value); }}
              className="input w-full pl-9 py-2"
              placeholder="Cari invoice/customer…"
              aria-label="Cari invoice atau nama pelanggan"
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm text-gray-600" htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => { setPage(1); setStatus(e.target.value as ReceivableStatus | ""); }}
              className="input w-full py-2"
            >
              {STATUS.map((s) => (
                <option key={s || "ALL"} value={s}>
                  {s || "ALL"}
                </option>
              ))}
            </select>
          </div>

          {/* Due before */}
          <div>
            <label className="text-sm text-gray-600" htmlFor="dueBefore">Jatuh Tempo ≤</label>
            <input
              id="dueBefore"
              type="date"
              value={dueBefore}
              onChange={(e) => { setPage(1); setDueBefore(e.target.value); }}
              className="input w-full py-2"
            />
          </div>

          {/* Per page */}
          <div>
            <label className="text-sm text-gray-600" htmlFor="perPage">Per halaman</label>
            <select
              id="perPage"
              value={perPage}
              onChange={(e) => { setPage(1); setPerPage(Number(e.target.value)); }}
              className="input w-full py-2"
            >
              {[10, 15, 25, 50].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Error */}
      {error ? (
        <div role="alert" aria-live="polite" className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
          {error}
        </div>
      ) : null}

      {/* Table (konsisten dengan Customers) */}
      <section aria-busy={loading ? "true" : "false"}>
        <div className="card overflow-hidden border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
          <div className="overflow-auto">
            <table className="min-w-[900px] w-full text-sm">
              <thead className="bg-[#E6EDFF] sticky top-0 z-10">
                <tr className="divide-x divide-[color:var(--color-border)]">
                  <Th>Invoice</Th>
                  <Th>Customer</Th>
                  <Th>Jatuh Tempo</Th>
                  <Th className="text-right">Total</Th>
                  <Th className="text-right">Terbayar</Th>
                  <Th className="text-right">Sisa</Th>
                  <Th>Status</Th>
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
                  </>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-3 py-4 text-center text-gray-500">Belum ada data</td>
                  </tr>
                ) : (
                  rows.map((r) => {
                    const dueText = r.due_date
                      ? new Date(r.due_date).toLocaleDateString("id-ID")
                      : "-";
                    const isOverdue = r.status === "OVERDUE";
                    return (
                      <tr key={r.id} className="hover:bg-black/5 transition-colors">
                        <Td>{r.order?.invoice_no ?? "-"}</Td>
                        <Td><span className="line-clamp-1">{r.order?.customer?.name ?? "-"}</span></Td>
                        <Td>
                          <span className={isOverdue ? "text-red-600 font-semibold" : ""}>
                            {dueText}
                          </span>
                        </Td>
                        <Td className="text-right tabular-nums">{toIDR(r.order?.grand_total ?? 0)}</Td>
                        <Td className="text-right tabular-nums">{toIDR(r.order?.paid_amount ?? 0)}</Td>
                        <Td className="text-right">
                          <span className="chip chip--subtle">{toIDR(r.remaining_amount)}</span>
                        </Td>
                        <Td>{renderStatusChip(r.status)}</Td>
                        <Td className="text-right">
                          {r.remaining_amount > 0 ? (
                            <button
                              className="btn-primary"
                              onClick={() => { setSelected(r); setDialogOpen(true); }}
                              aria-label={`Pelunasan untuk ${r.order?.invoice_no ?? 'invoice'}`}
                            >
                              Pelunasan
                            </button>
                          ) : null}
                        </Td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer / Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {meta ? `Hal ${meta.current_page}/${meta.last_page} — ${meta.total} data` : null}
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={!meta || page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="btn-outline disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={!meta || (meta && page >= meta.last_page)}
            onClick={() => setPage((p) => (meta ? Math.min(meta.last_page, p + 1) : p))}
            className="btn-outline disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Dialog Pelunasan */}
      <SettleReceivableDialog
        open={dialogOpen}
        receivable={selected}
        onClose={() => setDialogOpen(false)}
        onSettled={() => load()}
      />
    </div>
  );
}

/* ---------- Subcomponents: konsisten dengan Customers ---------- */
function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`text-left px-3 py-2 text-xs font-medium uppercase tracking-wide ${className}`}>
      {children}
    </th>
  );
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-2 ${className}`}>{children}</td>;
}
function RowSkeleton() {
  return (
    <tr>
      <td className="px-3 py-3"><div className="h-4 w-28 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-40 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-24 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-20 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-20 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-6 w-24 rounded-full bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-24 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3 text-right"><div className="inline-block h-8 w-24 rounded bg-black/10 animate-pulse" /></td>
    </tr>
  );
}

/* ---------- Status chip ---------- */
function renderStatusChip(s?: ReceivableStatus) {
  const base = "chip";
  switch (s) {
    case "OPEN":
      return <span className={`${base} chip--subtle`}>OPEN</span>;
    case "PARTIAL":
      return <span className={`${base} chip--subtle`}>PARTIAL</span>;
    case "OVERDUE":
      return <span className={`${base} chip--danger`}>OVERDUE</span>;
    case "SETTLED":
      return <span className={`${base} chip--solid`}>SETTLED</span>;
    default:
      return <span className="text-gray-600">-</span>;
  }
}

```
</details>

### src/pages/reports/ReportsIndex.tsx

- SHA: `2683dbc5b2ff`  
- Ukuran: 12 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/reports/ReportsIndex.tsx
import { useEffect, useMemo, useState } from 'react';
import { getReportPreview, exportReport, type ReportKind } from '../../api/reports';
import { listBranches } from '../../api/branches';

type Branch = { id: string; name: string };

const KINDS: ReportKind[] = ['sales', 'orders', 'receivables', 'expenses', 'services'];

export default function ReportsIndex() {
    const [kind, setKind] = useState<ReportKind>('sales');
    const [from, setFrom] = useState<string>(() => new Date().toISOString().slice(0, 10));
    const [to, setTo] = useState<string>(() => new Date().toISOString().slice(0, 10));
    const [branchId, setBranchId] = useState<string | null>(null);
    const [method, setMethod] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [page, setPage] = useState<number>(1);

    const [columns, setColumns] = useState<string[]>([]);
    const [rows, setRows] = useState<any[]>([]);
    const [pageInfo, setPageInfo] = useState({ current_page: 1, last_page: 1, per_page: 20, total: 0 });
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        listBranches({ per_page: 100 })
            .then((res) => {
                const list = Array.isArray(res.data) ? res.data : [];
                setBranches(list.map((b: any) => ({ id: b.id, name: b.name })));
            })
            .catch(() => { });
    }, []);

    const params = useMemo(
        () => ({
            from,
            to,
            branch_id: branchId || undefined,
            method: kind === 'sales' && method ? method : undefined,
            status: (kind === 'orders' || kind === 'receivables') && status ? status : undefined,
            per_page: 20,
            page,
        }),
        [from, to, branchId, method, status, kind, page]
    );

    async function load() {
        setLoading(true);
        setError(null);
        try {
            const resp = await getReportPreview(kind, params);
            setColumns(resp.meta.columns ?? []);
            setRows(resp.data ?? []);
            setPageInfo({
                current_page: resp.meta.current_page,
                last_page: resp.meta.last_page,
                per_page: resp.meta.per_page,
                total: resp.meta.total,
            });
        } catch {
            setError('Gagal memuat pratinjau laporan.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load(); // auto-load saat mount / filter berubah
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [kind, params]);

    async function onExport(format: 'csv' | 'xlsx' = 'csv') {
        const blob = await exportReport(kind, { ...params, format, delimiter: 'semicolon' });
        const fname = `${kind}_${from.replaceAll('-', '')}-${to.replaceAll('-', '')}_${branchId ? 'branch' : 'all'}.${format}`;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fname;
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="space-y-4">
            <header className="flex items-center justify-between">
                <h1 className="text-lg font-semibold tracking-tight">Reports</h1>
            </header>

            {/* Tabs (segmented) */}
            <div className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1 p-2 w-max">
                <div className="flex gap-1">
                    {KINDS.map((k) => {
                        const active = k === kind;
                        return (
                            <button
                                key={k}
                                onClick={() => {
                                    setKind(k);
                                    setPage(1);
                                    // Reset filter khusus agar tidak “nempel” saat pindah tab
                                    setMethod('');
                                    setStatus('');
                                }}
                                className={active ? 'btn-primary' : 'btn-outline'}
                                aria-current={active ? 'page' : undefined}
                            >
                                {k.toUpperCase()}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Filter bar */}
            <section className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
                <div className="p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 items-end">
                    <label className="grid gap-1 text-sm">
                        <span>Dari Tanggal</span>
                        <input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(1); }} className="input py-2" />
                    </label>
                    <label className="grid gap-1 text-sm">
                        <span>Sampai Tanggal</span>
                        <input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(1); }} className="input py-2" />
                    </label>
                    <label className="grid gap-1 text-sm">
                        <span>Cabang</span>
                        <select
                            value={branchId ?? ''}
                            onChange={(e) => { setBranchId(e.target.value || null); setPage(1); }}
                            className="input py-2"
                        >
                            <option value="">(Semua)</option>
                            {branches.map((b) => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                    </label>

                    {kind === 'sales' && (
                        <label className="grid gap-1 text-sm">
                            <span>Metode</span>
                            <select value={method} onChange={(e) => { setMethod(e.target.value); setPage(1); }} className="input py-2">
                                <option value="">(Semua)</option>
                                <option value="CASH">CASH</option>
                                <option value="QRIS">QRIS</option>
                                <option value="TRANSFER">TRANSFER</option>
                                <option value="PENDING">PENDING</option>
                            </select>
                        </label>
                    )}

                    {(kind === 'orders' || kind === 'receivables') && (
                        <label className="grid gap-1 text-sm">
                            <span>Status</span>
                            <input
                                value={status}
                                onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                                className="input py-2"
                                placeholder="cth: OPEN / PARTIAL / ..."
                            />
                        </label>
                    )}

                    <div className="flex gap-2">
                        <button onClick={() => { setPage(1); load(); }} className="btn-primary">Terapkan</button>
                        <button onClick={() => onExport('csv')} className="btn-outline">Export CSV</button>
                        <button onClick={() => onExport('xlsx')} className="btn-outline">Export XLSX</button>
                    </div>
                </div>
            </section>

            {/* Error */}
            {error && (
                <div role="alert" aria-live="polite" className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
                    {error}
                </div>
            )}

            {/* Preview table — gaya konsisten dengan CustomersIndex */}
            <section aria-busy={loading ? 'true' : 'false'}>
                <div className="card overflow-hidden border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
                    <div className="overflow-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-[#E6EDFF] sticky top-0 z-10">
                                <tr className="divide-x divide-[color:var(--color-border)]">
                                    {columns.map((c) => (
                                        <Th key={c}>{c}</Th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[color:var(--color-border)]">
                                {loading ? (
                                    <>
                                        <RowSkeleton cols={Math.max(columns.length, 3)} />
                                        <RowSkeleton cols={Math.max(columns.length, 3)} />
                                        <RowSkeleton cols={Math.max(columns.length, 3)} />
                                        <RowSkeleton cols={Math.max(columns.length, 3)} />
                                        <RowSkeleton cols={Math.max(columns.length, 3)} />
                                    </>
                                ) : rows.length === 0 ? (
                                    <tr>
                                        <td className="px-3 py-4 text-center text-gray-500" colSpan={Math.max(columns.length, 1)}>
                                            Tidak ada data
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map((r, i) => (
                                        <tr key={i} className="hover:bg-black/5 transition-colors">
                                            {columns.map((col) => {
                                                const key = col.toLowerCase().replaceAll(' ', '_');
                                                return <Td key={col}>{String(r[key] ?? '')}</Td>;
                                            })}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Pagination */}
            {!loading && pageInfo.last_page > 1 && (
                <nav className="flex items-center gap-2 justify-end" aria-label="Navigasi halaman">
                    <button
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="btn-outline disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="text-sm">
                        Page {pageInfo.current_page} / {pageInfo.last_page} • Total {pageInfo.total}
                    </span>
                    <button
                        disabled={page >= pageInfo.last_page}
                        onClick={() => setPage((p) => Math.min(pageInfo.last_page, p + 1))}
                        className="btn-outline disabled:opacity-50"
                    >
                        Next
                    </button>
                </nav>
            )}
        </div>
    );
}

/* ---------- Subcomponents (tabel konsisten) ---------- */
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
function RowSkeleton({ cols }: { cols: number }) {
    return (
        <tr>
            {Array.from({ length: cols }).map((_, idx) => (
                <td key={idx} className="px-3 py-3">
                    <div className="h-4 w-full max-w-[220px] rounded bg-black/10 animate-pulse" />
                </td>
            ))}
        </tr>
    );
}

```
</details>

### src/pages/services/CategoryIndex.tsx

- SHA: `a862a3868d1c`  
- Ukuran: 15 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/services/CategoryIndex.tsx
import { useEffect, useState, useCallback } from "react";
import type { ServiceCategory, PaginationMeta } from "../../types/services";
import {
  listServiceCategories,
  createServiceCategory,
  updateServiceCategory,
  deleteServiceCategory,
} from "../../api/serviceCategories";

export default function CategoryIndex() {
  const [rows, setRows] = useState<ServiceCategory[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [q, setQ] = useState("");
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
        setError("Gagal memuat kategori");
      } finally {
        setLoading(false);
      }
    },
    [q, perPage],
  );

  useEffect(() => {
    void refresh(page);
  }, [page, refresh]);

  useEffect(() => {
    const t = setTimeout(() => {
      void refresh(1);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [q, refresh]);

  const total = meta?.total ?? rows.length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs text-slate-500">Services</div>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
            Service Categories
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Kelola kategori untuk mengelompokkan layanan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-1">
              Total: <span className="ml-1 font-semibold text-slate-900">{total}</span>
            </span>
          </div>

          <button
            className="
              inline-flex items-center justify-center gap-2
              rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white
              hover:bg-slate-800 active:bg-slate-950
              focus:outline-none focus:ring-2 focus:ring-slate-300
            "
            onClick={async () => {
              const name = prompt("Nama kategori:")?.trim();
              if (!name) return;
              try {
                await createServiceCategory({ name, is_active: true });
                await refresh(page);
              } catch {
                alert("Gagal membuat kategori");
              }
            }}
            aria-label="Tambah kategori layanan"
          >
            <PlusIcon />
            New Category
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <section
        className="rounded-xl border border-slate-200 bg-white shadow-[0_10px_30px_-24px_rgba(0,0,0,.35)]"
        aria-label="Toolbar filter kategori"
      >
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xl">
            <label htmlFor="search-cat" className="sr-only">
              Cari kategori
            </label>
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="search-cat"
              className="
                w-full rounded-md border border-slate-200 bg-white
                pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400
                focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200
              "
              placeholder="Cari nama kategori…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Cari nama kategori"
            />
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <div className="text-xs text-slate-500">
              Menampilkan{" "}
              <span className="font-semibold text-slate-900">{rows.length}</span>{" "}
              item{meta?.total ? <> dari <span className="font-semibold text-slate-900">{meta.total}</span></> : null}
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-1">
                Ketik untuk mencari (auto)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && rows.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
          Belum ada kategori.
        </div>
      )}

      {/* Table */}
      <section aria-busy={loading ? "true" : "false"}>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_10px_30px_-24px_rgba(0,0,0,.35)]">
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="border-b border-slate-200">
                  <Th>Nama</Th>
                  <Th>Status</Th>
                  <Th className="text-right pr-4">Aksi</Th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <>
                    <RowSkeleton />
                    <RowSkeleton />
                    <RowSkeleton />
                    <RowSkeleton />
                    <RowSkeleton />
                  </>
                ) : (
                  rows.map((r, idx) => (
                    <tr
                      key={r.id}
                      className={[
                        "transition-colors",
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50/40",
                        "hover:bg-slate-100/60",
                      ].join(" ")}
                    >
                      <Td>
                        <div className="flex items-center gap-3">
                          <div className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700">
                            <TagIcon />
                          </div>
                          <div className="min-w-0">
                            <div className="line-clamp-1 font-semibold text-slate-900">
                              {r.name}
                            </div>
                            <div className="mt-0.5 text-xs text-slate-500">
                              ID: {r.id}
                            </div>
                          </div>
                        </div>
                      </Td>

                      <Td>
                        {r.is_active ? (
                          <Pill tone="success">Active</Pill>
                        ) : (
                          <Pill tone="danger">Inactive</Pill>
                        )}
                      </Td>

                      <Td className="pr-4">
                        <div className="flex justify-end gap-2">
                          <button
                            className="
                              inline-flex items-center gap-2 rounded-md
                              border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700
                              hover:bg-slate-50 active:bg-slate-100
                              focus:outline-none focus:ring-2 focus:ring-slate-200
                            "
                            onClick={async () => {
                              const name = prompt("Ubah nama kategori:", r.name)?.trim();
                              if (!name) return;
                              try {
                                await updateServiceCategory(r.id, { name });
                                await refresh(page);
                              } catch {
                                alert("Gagal update");
                              }
                            }}
                            aria-label={`Ubah kategori ${r.name}`}
                          >
                            <EditIcon />
                            Edit
                          </button>

                          <button
                            className="
                              inline-flex items-center gap-2 rounded-md
                              border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700
                              hover:bg-red-50 active:bg-red-100/60
                              focus:outline-none focus:ring-2 focus:ring-red-200
                            "
                            onClick={async () => {
                              if (!confirm(`Hapus kategori ${r.name}?`)) return;
                              try {
                                await deleteServiceCategory(r.id);
                                await refresh(page);
                              } catch {
                                alert("Gagal hapus");
                              }
                            }}
                            aria-label={`Hapus kategori ${r.name}`}
                          >
                            <TrashIcon />
                            Delete
                          </button>
                        </div>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer pagination (inside card) */}
          <div className="flex flex-col gap-3 border-t border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-slate-500">
              Hal{" "}
              <span className="font-semibold text-slate-900">
                {meta?.current_page ?? page}
              </span>{" "}
              /{" "}
              <span className="font-semibold text-slate-900">
                {meta?.last_page ?? 1}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="
                  inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white
                  px-3 py-2 text-sm font-semibold text-slate-700
                  hover:bg-slate-50 active:bg-slate-100
                  disabled:cursor-not-allowed disabled:opacity-50
                  focus:outline-none focus:ring-2 focus:ring-slate-200
                "
              >
                <ChevronLeftIcon />
                Prev
              </button>

              <button
                disabled={!!meta && page >= (meta.last_page ?? 1)}
                onClick={() => setPage((p) => p + 1)}
                className="
                  inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white
                  px-3 py-2 text-sm font-semibold text-slate-700
                  hover:bg-slate-50 active:bg-slate-100
                  disabled:cursor-not-allowed disabled:opacity-50
                  focus:outline-none focus:ring-2 focus:ring-slate-200
                "
              >
                Next
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- Subcomponents (UI only) ---------- */
function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={[
        "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500",
        className,
      ].join(" ")}
    >
      {children}
    </th>
  );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={["px-4 py-3 align-middle", className].join(" ")}>{children}</td>;
}

function RowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-slate-200" />
          <div className="space-y-2">
            <div className="h-4 w-44 rounded bg-slate-200" />
            <div className="h-3 w-24 rounded bg-slate-200" />
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="h-6 w-20 rounded-full bg-slate-200" />
      </td>
      <td className="px-4 py-4">
        <div className="ml-auto h-9 w-44 rounded bg-slate-200" />
      </td>
    </tr>
  );
}

function Pill({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "success" | "danger";
}) {
  const cls =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-red-200 bg-red-50 text-red-700";
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}>
      {children}
    </span>
  );
}

/* ---------- Icons (inline, no deps) ---------- */
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 21l-4.3-4.3" />
      <circle cx="11" cy="11" r="7" />
    </svg>
  );
}
function TagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.6 13.5 12 22 2 12 10.5 3.4H20V13.5Z" />
      <circle cx="16.5" cy="7.5" r="1.2" />
    </svg>
  );
}
function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}
function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

```
</details>

### src/pages/services/PricePerBranchInput.tsx

- SHA: `96f776c3fd42`  
- Ukuran: 11 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/services/PricePerBranchInput.tsx
import { useEffect, useRef, useState } from "react";
import type { Branch } from "../../types/branches";
import type { ServicePrice, ServicePriceSetPayload } from "../../types/services";
import { listBranches } from "../../api/branches";
import { listServicePricesByService, setServicePrice } from "../../api/servicePrices";

interface Props {
  serviceId: string;
  defaultPrice: number;
}
type Row = Branch & { override?: ServicePrice | null; effective: number };

function toStr(x: unknown) {
  return x == null ? "" : String(x);
}
function toNum(x: unknown, fallback = 0) {
  const n = Number(x);
  return Number.isFinite(n) ? n : fallback;
}
function toIDR(n: number) {
  return n.toLocaleString("id-ID", { style: "currency", currency: "IDR" });
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
      try {
        const branchesRes = await listBranches({ per_page: 100 });
        const branchesRaw: unknown = branchesRes?.data ?? branchesRes;
        const branches: Branch[] = Array.isArray(branchesRaw) ? branchesRaw : [];

        const overridesRes = await listServicePricesByService(serviceId);
        const overridesData: unknown = overridesRes?.data ?? overridesRes;
        const overrides: ServicePrice[] = Array.isArray(overridesData) ? overridesData : [];

        const map = new Map<string, ServicePrice>(
          overrides.map((p) => [toStr(p.branch_id), p])
        );

        const merged: Row[] = branches.map((b) => {
          const key = toStr(b.id);
          const ov = map.get(key) ?? null;
          const eff = ov ? toNum(ov.price, Number(defaultPrice)) : Number(defaultPrice);
          return { ...b, override: ov, effective: eff };
        });

        setRows(merged);
      } catch {
        setError("Gagal memuat harga per cabang.");
      } finally {
        setLoading(false);
      }
    })();
  }, [serviceId, defaultPrice]);

  async function onSaveOne(branch_id_raw: string | number, price_raw: number) {
    const branch_id = toStr(branch_id_raw);
    const price = toNum(price_raw);

    if (!Number.isFinite(price) || price <= 0) {
      setNotice(null);
      setError("Harga tidak valid.");
      return;
    }

    const payload: ServicePriceSetPayload = { service_id: serviceId, branch_id, price };

    try {
      setSaving(branch_id);
      setError(null);
      setNotice(null);

      const res = await setServicePrice(payload);
      const updated: ServicePrice = (res && (res as any).data ? (res as any).data : res) as ServicePrice;

      if (updated?.id) {
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

      setNotice("Harga cabang diperbarui.");
    } catch {
      setError("Gagal menyimpan harga cabang.");
    } finally {
      setSaving(null);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
          Memuat harga cabang…
        </div>
      </div>
    );
  }

  if (error && !rows.length) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        Belum ada cabang.
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-[0_12px_32px_-20px_rgba(0,0,0,.35)]">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Harga Per Cabang
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Atur harga override untuk setiap cabang.
          </p>
        </div>

        <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm">
          <div className="text-xs text-slate-500">Default Price</div>
          <div className="font-semibold text-slate-900">
            {toIDR(Number(defaultPrice))}
          </div>
        </div>
      </div>

      {notice && (
        <div className="mx-6 mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {notice}
        </div>
      )}
      {error && (
        <div className="mx-6 mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-white sticky top-0 border-b border-slate-200">
            <tr>
              <Th>Cabang</Th>
              <Th className="text-right">Harga Efektif</Th>
              <Th className="text-right">Override</Th>
              <Th className="text-right pr-6">Aksi</Th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map((r, idx) => {
              const key = toStr(r.id);
              const isSaving = saving === key;

              return (
                <tr
                  key={key}
                  className={[
                    idx % 2 === 0 ? "bg-white" : "bg-slate-50/40",
                    "hover:bg-slate-100/60 transition-colors",
                  ].join(" ")}
                >
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700">
                        {r.code}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">
                          {r.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          Branch ID: {r.id}
                        </div>
                      </div>
                    </div>
                  </Td>

                  <Td className="text-right font-semibold text-slate-900">
                    {toIDR(r.effective)}
                  </Td>

                  <Td className="text-right">
                    <input
                      type="number"
                      min={0}
                      step="100"
                      className="
                        w-44 rounded-md border border-slate-200 bg-white
                        px-3 py-2 text-right text-sm text-slate-900
                        placeholder:text-slate-400
                        focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200
                      "
                      defaultValue={r.override?.price ?? ""}
                      placeholder={`Default ${toIDR(Number(defaultPrice))}`}
                      ref={(el) => { inputRefs.current[key] = el; }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const raw = inputRefs.current[key]?.value;
                          const val = toNum(raw, NaN);
                          if (!Number.isFinite(val) || val <= 0) {
                            setError("Harga tidak valid.");
                            setNotice(null);
                            return;
                          }
                          void onSaveOne(key, val);
                        }
                      }}
                    />
                  </Td>

                  <Td className="text-right pr-6">
                    <div className="flex justify-end gap-2">
                      <button
                        className="
                          inline-flex items-center rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white
                          hover:bg-slate-800 disabled:opacity-50
                        "
                        disabled={isSaving}
                        onClick={() => {
                          const raw = inputRefs.current[key]?.value;
                          const val = toNum(raw, NaN);
                          if (!Number.isFinite(val) || val <= 0) {
                            setError("Harga tidak valid.");
                            setNotice(null);
                            return;
                          }
                          void onSaveOne(key, val);
                        }}
                      >
                        {isSaving ? "Menyimpan…" : "Simpan"}
                      </button>

                      <button
                        className="
                          inline-flex items-center rounded-md border border-slate-200 bg-white
                          px-3 py-2 text-xs font-semibold text-slate-700
                          hover:bg-slate-50
                        "
                        onClick={() => {
                          const ref = inputRefs.current[key];
                          if (ref) ref.value = "";
                          setRows((prev) =>
                            prev.map((x) =>
                              toStr(x.id) === key
                                ? { ...x, override: null, effective: Number(defaultPrice) }
                                : x
                            )
                          );
                          setNotice("Override dihapus (kembali ke default). Belum tersimpan ke server.");
                        }}
                      >
                        Reset
                      </button>
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-200 px-6 py-3 text-xs text-slate-500">
        Tekan <kbd className="rounded border px-1 py-0.5">Enter</kbd> pada kolom harga untuk menyimpan cepat.
      </div>
    </section>
  );
}

/* Subcomponents */
function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 ${className}`}>
      {children}
    </th>
  );
}
function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-6 py-4 align-middle ${className}`}>{children}</td>;
}

```
</details>

### src/pages/services/ServiceForm.tsx

- SHA: `dbc99cf68411`  
- Ukuran: 19 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/customers/ServiceForm.tsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Service, ServiceUpsertPayload, ServiceCategory } from '../../types/services';
import { createService, getService, updateService } from '../../api/services';
import { listServiceCategories } from '../../api/serviceCategories';
import PricePerBranchInput from './PricePerBranchInput';

const UNIT_PRESETS = ['ITEM', 'PASANG', 'KG'] as const;

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

  // Keyboard shortcuts: Ctrl/Cmd+S submit, Esc back
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        const el = document.getElementById('btn-submit') as HTMLButtonElement | null;
        el?.click();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        nav(-1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nav]);

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

  const errorList = useMemo(() => {
    const all = Object.entries(fieldErrors).flatMap(([k, v]) => v.map((msg) => `${k}: ${msg}`));
    return all;
  }, [fieldErrors]);

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
    <div className="space-y-5">
      {/* Header */}
      <header className="space-y-1">
        <div className="text-xs text-slate-500">
          <span className="font-medium text-slate-700">Master Data</span>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-slate-600">Services</span>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-slate-600">{editing ? 'Edit' : 'New'}</span>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              {editing ? 'Edit Service' : 'New Service'}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Definisikan layanan, unit, dan harga default. Tekan <kbd className="kbd">Ctrl</kbd>/<kbd className="kbd">⌘</kbd>+<kbd className="kbd">S</kbd> untuk simpan.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => nav(-1)}
              className="
                inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
                font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100
              "
              aria-label="Kembali"
            >
              <IconArrowLeft />
              Back
            </button>
          </div>
        </div>
      </header>

      {/* Error global */}
      {error && (
        <div role="alert" aria-live="polite" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <div className="flex items-start gap-2">
            <div className="mt-0.5 text-red-600">
              <IconAlert />
            </div>
            <div className="flex-1">
              <div className="font-semibold">{error}</div>
              {errorList.length > 0 && (
                <ul className="mt-2 list-disc space-y-1 ps-5">
                  {errorList.map((e, i) => (
                    <li key={i} className="text-red-700/90">
                      {e}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Form utama */}
      <form
        className="
          max-w-2xl rounded-xl border border-slate-200 bg-white p-5
          shadow-[0_18px_50px_-40px_rgba(0,0,0,.45)]
          space-y-5
        "
        onSubmit={onSubmit}
        aria-busy={loading ? 'true' : 'false'}
      >
        {/* Section title */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="text-sm font-semibold text-slate-900">Informasi Layanan</div>
            <div className="mt-0.5 text-xs text-slate-500">Field bertanda * wajib diisi.</div>
          </div>
          <div className="text-xs text-slate-500">{loading ? 'Memproses…' : null}</div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4">
          {/* Kategori */}
          <Field
            label="Kategori"
            required
            htmlFor="category_id"
            hint="Pilih kategori agar layanan mudah dikelompokkan."
            error={fieldErrors.category_id?.join(', ')}
          >
            <div className="relative">
              <select
                id="category_id"
                className={inputClass(Boolean(fieldErrors.category_id))}
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                disabled={loading}
                aria-required="true"
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
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <IconChevronDown />
              </span>
            </div>
            {fieldErrors.category_id && (
              <p id="err-category_id" className="mt-1 text-xs text-red-600">
                {fieldErrors.category_id.join(', ')}
              </p>
            )}
          </Field>

          {/* Nama */}
          <Field
            label="Nama"
            required
            htmlFor="name"
            hint="Gunakan nama jelas, mis. “Cuci Sepatu Premium”."
            error={fieldErrors.name?.join(', ')}
          >
            <input
              id="name"
              className={inputClass(Boolean(fieldErrors.name))}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={loading}
              aria-required="true"
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? 'err-name' : undefined}
              placeholder="Contoh: Cuci Sepatu Premium"
              autoFocus
            />
            {fieldErrors.name && (
              <p id="err-name" className="mt-1 text-xs text-red-600">
                {fieldErrors.name.join(', ')}
              </p>
            )}
          </Field>

          {/* Unit */}
          <Field
            label="Unit"
            required
            htmlFor="unit"
            hint={!fieldErrors.unit ? 'Klik preset atau ketik unit kustom (otomatis UPPERCASE).' : undefined}
            error={fieldErrors.unit?.join(', ')}
          >
            <div className="flex flex-wrap gap-2">
              {UNIT_PRESETS.map((u) => {
                const active = form.unit.toUpperCase() === u;
                return (
                  <button
                    type="button"
                    key={u}
                    onClick={() => setForm({ ...form, unit: u })}
                    className={
                      active
                        ? 'rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white'
                        : 'rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100'
                    }
                    aria-pressed={active}
                    disabled={loading}
                  >
                    {u}
                  </button>
                );
              })}
            </div>

            <input
              id="unit"
              className={inputClass(Boolean(fieldErrors.unit))}
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value.toUpperCase() })}
              disabled={loading}
              aria-required="true"
              aria-invalid={Boolean(fieldErrors.unit)}
              aria-describedby={fieldErrors.unit ? 'err-unit' : 'hint-unit'}
              placeholder="ITEM / PASANG / KG"
            />

            {!fieldErrors.unit && (
              <p id="hint-unit" className="mt-1 text-xs text-slate-500">
                Pilih salah satu atau ketik unit kustom (akan otomatis UPPERCASE).
              </p>
            )}
            {fieldErrors.unit && (
              <p id="err-unit" className="mt-1 text-xs text-red-600">
                {fieldErrors.unit.join(', ')}
              </p>
            )}
          </Field>

          {/* Harga Default */}
          <Field
            label="Harga Default"
            required
            htmlFor="price_default"
            hint={!fieldErrors.price_default ? 'Gunakan kelipatan 100 agar kasir cepat input.' : undefined}
            error={fieldErrors.price_default?.join(', ')}
          >
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500 select-none">
                Rp
              </span>
              <input
                id="price_default"
                type="number"
                min={0}
                step="100"
                className={inputClass(Boolean(fieldErrors.price_default), 'pl-10')}
                value={form.price_default}
                onChange={(e) => setForm({ ...form, price_default: Number(e.target.value) })}
                disabled={loading}
                aria-required="true"
                aria-invalid={Boolean(fieldErrors.price_default)}
                aria-describedby={fieldErrors.price_default ? 'err-price_default' : 'hint-price_default'}
                placeholder="Contoh: 25000"
                inputMode="numeric"
              />
            </div>

            {!fieldErrors.price_default && (
              <p id="hint-price_default" className="mt-1 text-xs text-slate-500">
                Gunakan kelipatan 100 agar kasir cepat input.
              </p>
            )}
            {fieldErrors.price_default && (
              <p id="err-price_default" className="mt-1 text-xs text-red-600">
                {fieldErrors.price_default.join(', ')}
              </p>
            )}
          </Field>

          {/* Active switch (checkbox tetap) */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">Status</div>
              <div className="mt-0.5 text-xs text-slate-500">Jika nonaktif, layanan tidak tampil/terpakai.</div>
            </div>

            <label className="relative inline-flex cursor-pointer items-center">
              <input
                id="is_active"
                type="checkbox"
                className="peer sr-only"
                checked={!!form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                disabled={loading}
              />
              <span
                className="
                  h-6 w-11 rounded-full border border-slate-200 bg-white
                  peer-checked:bg-slate-900 peer-checked:border-slate-900
                  transition-colors
                "
              />
              <span
                className="
                  absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-slate-200
                  peer-checked:translate-x-5 peer-checked:bg-white
                  transition-transform
                "
              />
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            id="btn-submit"
            disabled={loading}
            className="
              inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white
              hover:bg-slate-800 active:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-60
            "
            aria-label="Simpan layanan"
          >
            <IconSave />
            {loading ? 'Menyimpan…' : 'Simpan'}
          </button>

          <button
            type="button"
            className="
              inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm
              font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100
            "
            onClick={() => nav(-1)}
            aria-label="Batalkan dan kembali"
            disabled={loading}
          >
            <IconX />
            Batal
          </button>
        </div>
      </form>

      {/* Harga per cabang (override) — hanya saat edit */}
      {editing && service && (
        <section className="max-w-4xl rounded-xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_-40px_rgba(0,0,0,.45)] space-y-2">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Harga per Cabang</h2>
              <p className="mt-1 text-xs text-slate-500">
                Harga efektif = override <code className="rounded bg-slate-100 px-1">service_prices</code> per cabang, jika tidak ada akan memakai{' '}
                <code className="rounded bg-slate-100 px-1">price_default</code>.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <PricePerBranchInput serviceId={service.id} defaultPrice={Number(form.price_default)} />
          </div>
        </section>
      )}

      {/* tiny styles for kbd (optional, local) */}
      <style>{`
        .kbd{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding:0 .35rem;
          height:1.35rem;
          border:1px solid rgb(226 232 240);
          border-bottom-width:2px;
          border-radius:.4rem;
          background:white;
          font-size:.75rem;
          font-weight:600;
          color:rgb(51 65 85);
          line-height:1;
        }
      `}</style>
    </div>
  );
}

/* ---------- Helpers UI (no logic change) ---------- */
function Field({
  label,
  required,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-slate-900">
        {label} {required ? <span className="text-red-600">*</span> : null}
      </label>
      {children}
      {!error && hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

function inputClass(invalid: boolean, extra: string = '') {
  return `
    w-full rounded-lg border bg-white py-2.5 px-3 text-sm text-slate-900 placeholder:text-slate-400
    focus:outline-none focus:ring-2
    ${invalid ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-slate-300 focus:ring-slate-200'}
    ${extra}
  `;
}

/* ---------- Icons (inline SVG) ---------- */
function IconChevronDown() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
function IconArrowLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M15 18l-6-6 6-6" />
      <path d="M21 12H9" />
    </svg>
  );
}
function IconSave() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M19 21H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2Z" />
      <path d="M17 21v-8H7v8" />
      <path d="M7 3v4h8" />
    </svg>
  );
}
function IconX() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}
function IconAlert() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.3 4.3h3.4L22 18.6a2 2 0 0 1-1.7 3H3.7a2 2 0 0 1-1.7-3L10.3 4.3Z" />
    </svg>
  );
}

```
</details>

### src/pages/services/ServiceIndex.tsx

- SHA: `ff98dfa02347`  
- Ukuran: 19 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/services/ServiceIndex.tsx
import { useEffect, useState, useCallback } from 'react';
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

  const total = (meta?.total ?? rows?.length ?? 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="text-xs text-slate-500">
            <span className="font-medium text-slate-700">Master Data</span>
            <span className="mx-2 text-slate-300">/</span>
            <span className="text-slate-600">Services</span>
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">Services</h1>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-600">
              {loading ? 'Loading…' : `${total} items`}
            </span>
          </div>

          <p className="text-sm text-slate-500">
            Kelola layanan dan harga default. Gunakan filter untuk mempercepat pencarian.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/service-categories"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100"
            aria-label="Kelola kategori"
          >
            <IconTag />
            Categories
          </Link>

          <button
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 active:bg-slate-950 disabled:opacity-60"
            onClick={() => nav('/services/new')}
            aria-label="Tambah layanan baru"
          >
            <IconPlus />
            New Service
          </button>
        </div>
      </header>

      {/* FilterBar */}
      <section
        className="rounded-xl border border-slate-200 bg-white shadow-[0_18px_50px_-40px_rgba(0,0,0,.45)]"
        aria-label="Filter layanan"
      >
        <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-[1fr_240px_auto] md:items-center">
          {/* Search */}
          <div className="relative">
            <label htmlFor="q" className="sr-only">
              Pencarian layanan
            </label>
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <IconSearch />
            </span>
            <input
              id="q"
              className="
                w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm
                text-slate-900 placeholder:text-slate-400
                focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200
              "
              placeholder="Cari nama layanan…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Cari layanan"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="cat" className="sr-only">
              Filter kategori
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <IconFilter />
              </span>
              <select
                id="cat"
                className="
                  w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm
                  text-slate-900
                  focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200
                "
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
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <IconChevronDown />
              </span>
            </div>
          </div>

          {/* Reset */}
          <div className="flex justify-end">
            <button
              type="button"
              className="
                inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5
                text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100
              "
              onClick={() => {
                setQ('');
                setCategoryId('');
              }}
              aria-label="Reset filter"
            >
              <IconRotate />
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
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && rows && rows.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-[0_18px_50px_-40px_rgba(0,0,0,.45)]">
          <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-600">
            <IconBox />
          </div>
          <div className="text-sm font-semibold text-slate-900">Belum ada layanan</div>
          <div className="mt-1 text-sm text-slate-500">Klik “New Service” untuk menambahkan layanan baru.</div>
        </div>
      )}

      {/* Table */}
      <section aria-busy={loading ? 'true' : 'false'}>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_18px_50px_-40px_rgba(0,0,0,.45)]">
          {/* table top hint */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
            <div className="text-sm font-semibold text-slate-900">Daftar Layanan</div>
            <div className="text-xs text-slate-500">
              Hal {meta?.current_page ?? page} / {meta?.last_page ?? 1}
            </div>
          </div>

          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="border-b border-slate-100">
                  <Th>Nama</Th>
                  <Th>Kategori</Th>
                  <Th>Unit</Th>
                  <Th className="text-right">Harga Default</Th>
                  <Th className="text-right">Status</Th>
                  <Th className="text-right pr-4">Aksi</Th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
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
                  rows.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      <Td>
                        <div className="min-w-[220px]">
                          <div className="line-clamp-1 font-semibold text-slate-900">{s.name}</div>
                          <div className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                            ID: <span className="tabular-nums">{s.id}</span>
                          </div>
                        </div>
                      </Td>

                      <Td>
                        <span className="line-clamp-1 text-slate-700">{s.category?.name ?? '-'}</span>
                      </Td>

                      <Td>
                        <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700">
                          {s.unit}
                        </span>
                      </Td>

                      <Td className="text-right tabular-nums font-semibold text-slate-900">
                        {toIDR(Number(s.price_default))}
                      </Td>

                      <Td className="text-right">
                        <StatusPill active={!!s.is_active} />
                      </Td>

                      <Td className="text-right pr-4">
                        <div className="inline-flex items-center justify-end gap-2">
                          <button
                            className="
                              inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2
                              text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100
                            "
                            onClick={() => nav(`/services/${s.id}/edit`)}
                            aria-label={`Edit layanan ${s.name}`}
                          >
                            <IconPencil />
                            Edit
                          </button>

                          <button
                            className="
                              inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2
                              text-sm font-semibold text-red-600 hover:bg-red-50 active:bg-red-100
                            "
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
                            <IconTrash />
                            Delete
                          </button>
                        </div>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination bottom */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
            <div className="text-xs text-slate-500">
              Menampilkan <span className="font-semibold text-slate-700">{rows?.length ?? 0}</span> data / halaman
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="
                  inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
                  font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100
                  disabled:cursor-not-allowed disabled:opacity-50
                "
              >
                <IconChevronLeft />
                Prev
              </button>

              <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm tabular-nums text-slate-700">
                {meta?.current_page ?? page} / {meta?.last_page ?? 1}
              </div>

              <button
                disabled={!!meta && page >= (meta.last_page ?? 1)}
                onClick={() => setPage((p) => p + 1)}
                className="
                  inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
                  font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100
                  disabled:cursor-not-allowed disabled:opacity-50
                "
              >
                Next
                <IconChevronRight />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- UI Subcomponents (TIDAK ubah logika) ---------- */
function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 ${className}`}
    >
      {children}
    </th>
  );
}
function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>;
}

function StatusPill({ active }: { active: boolean }) {
  return active ? (
    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
      Inactive
    </span>
  );
}

function RowSkeleton() {
  return (
    <tr>
      <td className="px-4 py-4">
        <div className="space-y-2">
          <div className="h-4 w-52 animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
      </td>
      <td className="px-4 py-4">
        <div className="h-7 w-16 animate-pulse rounded bg-slate-200" />
      </td>
      <td className="px-4 py-4">
        <div className="ml-auto h-4 w-28 animate-pulse rounded bg-slate-200" />
      </td>
      <td className="px-4 py-4 text-right">
        <div className="ml-auto h-7 w-24 animate-pulse rounded bg-slate-200" />
      </td>
      <td className="px-4 py-4 text-right">
        <div className="ml-auto h-9 w-40 animate-pulse rounded bg-slate-200" />
      </td>
    </tr>
  );
}

/* ---------- Small Icons (inline SVG, no dependency) ---------- */
function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}
function IconFilter() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 6h16" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  );
}
function IconChevronDown() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
function IconPlus() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}
function IconTag() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20.59 13.41 12 22l-10-10V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" />
      <circle cx="7" cy="7" r="1.5" />
    </svg>
  );
}
function IconPencil() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </svg>
  );
}
function IconTrash() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}
function IconRotate() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <path d="M21 3v6h-6" />
    </svg>
  );
}
function IconChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function IconChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
function IconBox() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 8l-9-5-9 5 9 5 9-5Z" />
      <path d="M3 8v10l9 5 9-5V8" />
      <path d="M12 13v10" />
    </svg>
  );
}

```
</details>

### src/pages/users/UserForm.tsx

- SHA: `80265b6573a7`  
- Ukuran: 25 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/users/UserForm.tsx
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
  return isAxiosError<ApiErrBody>(err) && err.response?.data?.errors ? err.response.data.errors : {};
}
function getMessage(err: unknown, fallback = 'Terjadi kesalahan'): string {
  return isAxiosError<ApiErrBody>(err) && err.response?.data?.message ? err.response.data.message : fallback;
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
    username: '',
    email: '',
    branch_id: isSuperadmin ? null : (me?.branch_id ? String(me.branch_id) : ('' as unknown as null)),
    is_active: true,
    roles: [],
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // debug awal (dipertahankan)
  console.log('[UserForm] mount:', { editing, id, me, isSuperadmin, isAdminCabang, canManage });

  const v = useMemo(
    () => ({
      name: form.name ?? '',
      username: form.username ?? '',
      email: form.email ?? '',
      password: form.password ?? '',
      branch_id: form.branch_id === null ? '' : (form.branch_id ?? ''),
      is_active: !!form.is_active,
      roles: Array.isArray(form.roles) ? form.roles : [],
    }),
    [form]
  );

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
            username: u?.username ?? '',
            email: u?.email ?? '',
            branch_id: (u?.branch_id ?? null),
            is_active: typeof u?.is_active === 'boolean' ? u.is_active : true,
            roles: Array.isArray(u?.roles) ? (u.roles as RoleName[]) : [],
            password: '',
          });
        } catch (err: unknown) {
          console.error('[UserForm] gagal load user:', err);
          const status = getHttpStatus(err);
          if (status === 403) setError('Anda tidak berhak melihat user ini (beda cabang).');
          else if (status === 404) setError('User tidak ditemukan.');
          else setError(getMessage(err, 'Gagal memuat user'));
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
          username: v.username,
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
          username: v.username,
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

  const pageTitle = editing ? 'Edit User' : 'New User';
  const pageDesc = 'Kelola identitas, peran (multi-role), dan status aktif';

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs text-slate-500">Settings / Users</div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{pageTitle}</h1>
          <p className="mt-1 text-sm text-slate-500">{pageDesc}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => nav('/users')}
            aria-label="Kembali ke daftar users"
          >
            <ArrowLeftIcon />
            Back
          </button>
        </div>
      </header>

      {/* Loading / Error */}
      {loading && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
          Memuat…
        </div>
      )}

      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Form card */}
      <form
        className="rounded-xl border border-slate-200 bg-white shadow-[0_14px_40px_-30px_rgba(0,0,0,.35)]"
        onSubmit={onSubmit}
      >
        <div className="border-b border-slate-200 px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <UserIcon />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  {editing ? 'Perbarui data user' : 'Buat user baru'}
                </div>
                <div className="text-xs text-slate-500">
                  {isSuperadmin ? 'Superadmin mode' : me?.branch_id ? `Branch scope #${String(me.branch_id)}` : 'Branch scope'}
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <span
                className={[
                  'inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold border',
                  v.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200',
                ].join(' ')}
                title="Status user"
              >
                <span className={['h-2 w-2 rounded-full', v.is_active ? 'bg-emerald-500' : 'bg-slate-400'].join(' ')} />
                {v.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 sm:px-6 sm:py-6 space-y-6">
          {/* Section: Identity */}
          <Section
            title="Identity"
            subtitle="Informasi dasar akun (nama, username, email)."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                label="Nama *"
                htmlFor="name"
                error={fieldErrors.name}
              >
                <input
                  id="name"
                  className={inputClass(!!fieldErrors.name)}
                  value={v.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  aria-invalid={!!fieldErrors.name}
                  aria-describedby={fieldErrors.name ? 'err-name' : undefined}
                />
              </Field>

              <Field
                label={`Username${!editing ? ' *' : ''}`}
                htmlFor="username"
                hint="3–50 karakter: huruf kecil, angka, underscore (_), atau titik (.)"
                error={fieldErrors.username}
              >
                <input
                  id="username"
                  type="text"
                  className={inputClass(!!fieldErrors.username)}
                  value={v.username}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      username: e.target.value.toLowerCase(), // normalisasi ringan
                    })
                  }
                  autoComplete="username"
                  pattern="^[a-z0-9_.]{3,50}$"
                  title="3–50 karakter: huruf kecil, angka, underscore (_), atau titik (.)"
                  required={!editing}
                  aria-invalid={!!fieldErrors.username}
                  aria-describedby={fieldErrors.username ? 'err-username' : undefined}
                />
              </Field>

              <Field
                label="Email *"
                htmlFor="email"
                error={fieldErrors.email}
              >
                <input
                  id="email"
                  type="email"
                  className={inputClass(!!fieldErrors.email)}
                  value={v.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? 'err-email' : undefined}
                />
              </Field>

              {!editing && (
                <Field
                  label="Password *"
                  htmlFor="password"
                  hint="Gunakan password kuat (minimal 8 karakter)."
                  error={fieldErrors.password}
                >
                  <input
                    id="password"
                    type="password"
                    className={inputClass(!!fieldErrors.password)}
                    value={v.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? 'err-password' : undefined}
                  />
                </Field>
              )}
            </div>
          </Section>

          {/* Section: Assignment */}
          <Section
            title="Assignment"
            subtitle="Cabang dan status aktif user."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Branch" htmlFor="branch" error={fieldErrors.branch_id}>
                <select
                  id="branch"
                  className={inputClass(!!fieldErrors.branch_id)}
                  value={v.branch_id} // '' == null
                  onChange={(e) =>
                    setForm({
                      ...form,
                      branch_id: isSuperadmin ? (e.target.value || null) : (me?.branch_id ? String(me.branch_id) : null),
                    })
                  }
                  disabled={!isSuperadmin} // Admin Cabang tidak boleh ganti cabang
                  aria-invalid={!!fieldErrors.branch_id}
                  aria-describedby={fieldErrors.branch_id ? 'err-branch' : undefined}
                >
                  {isSuperadmin && <option value="">(Tanpa branch)</option>}
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.code} — {b.name}
                    </option>
                  ))}
                </select>

                {!isSuperadmin && (
                  <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 border border-slate-200">
                    <LockIcon />
                    Admin Cabang tidak dapat mengubah branch user.
                  </div>
                )}
              </Field>

              <div className="grid gap-2">
                <div className="text-xs font-semibold text-slate-700">Status</div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    className={[
                      'inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold',
                      v.is_active
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50',
                    ].join(' ')}
                    onClick={() => setForm({ ...form, is_active: true })}
                    aria-pressed={v.is_active}
                  >
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Active
                  </button>

                  <button
                    type="button"
                    className={[
                      'inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold',
                      !v.is_active
                        ? 'bg-slate-100 text-slate-700 border-slate-200'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50',
                    ].join(' ')}
                    onClick={() => setForm({ ...form, is_active: false })}
                    aria-pressed={!v.is_active}
                  >
                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                    Inactive
                  </button>

                  {/* checkbox tetap ada (aksesibilitas/compat), tapi visualnya pakai tombol */}
                  <label className="sr-only">
                    <input
                      type="checkbox"
                      checked={v.is_active}
                      onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    />
                    Aktif
                  </label>
                </div>

                <div className="text-xs text-slate-500">
                  Nonaktifkan jika user tidak lagi bertugas. User nonaktif tidak seharusnya bisa login (tergantung backend rule).
                </div>
              </div>
            </div>
          </Section>

          {/* Section: Roles */}
          {canManage && (
            <Section
              title="Roles"
              subtitle="Multi-role: pilih minimal satu. Role pertama akan jadi primary saat create."
            >
              <div className="grid grid-cols-1 gap-3">
                <Field label="Roles *" htmlFor="roles" error={fieldErrors.roles} hint="Tahan Ctrl / Cmd untuk memilih lebih dari satu.">
                  <select
                    id="roles"
                    multiple
                    className={[
                      inputClass(!!fieldErrors.roles),
                      'min-h-32 py-2',
                    ].join(' ')}
                    value={v.roles}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions)
                        .map((o) => (o.value || '').trim() as RoleName)
                        .filter(Boolean);
                      const uniq = Array.from(new Set(values)) as RoleName[];
                      setForm({ ...form, roles: uniq });
                    }}
                    required
                    aria-invalid={!!fieldErrors.roles}
                    aria-describedby={fieldErrors.roles ? 'err-roles' : undefined}
                  >
                    {allowedRoles(isSuperadmin).map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </Field>

                {v.roles.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {v.roles.map((r) => (
                      <span
                        key={r}
                        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs font-semibold text-slate-700"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                )}

                {Object.keys(fieldErrors).length > 0 && (
                  <details className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                    <summary className="cursor-pointer font-semibold">Detail error (debug)</summary>
                    <pre className="mt-2 whitespace-pre-wrap">{JSON.stringify(fieldErrors, null, 2)}</pre>
                  </details>
                )}
              </div>
            </Section>
          )}
        </div>

        {/* Actions */}
        <div className="border-t border-slate-200 px-4 py-3 sm:px-6 flex flex-wrap items-center gap-2 justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              disabled={saving}
              className="
                inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2
                text-sm font-semibold text-white hover:bg-slate-800 active:bg-slate-950
                disabled:cursor-not-allowed disabled:opacity-70
              "
            >
              <SaveIcon />
              {saving ? 'Menyimpan…' : 'Simpan'}
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => nav('/users')}
            >
              Batal
            </button>
          </div>

          {editing && (
            <button
              type="button"
              className="
                inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2
                text-sm font-semibold text-red-600 hover:bg-red-50 active:bg-red-100
              "
              onClick={async () => {
                if (!isSuperadmin && !isAdminCabang) return;
                const p1 = prompt('Password baru (min 8, mix-case+angka)'); if (!p1) return;
                const p2 = prompt('Konfirmasi password baru'); if (p2 !== p1) { alert('Konfirmasi tidak cocok'); return; }
                try { await resetUserPassword(id!, p1); alert('Password direset'); }
                catch { alert('Gagal reset password'); }
              }}
            >
              <KeyIcon />
              Reset Password
            </button>
          )}
        </div>

        {/* local UI-only helper styles */}
        <style>
          {`
            .btn-secondary{
              display:inline-flex; align-items:center; gap:8px;
              border:1px solid rgb(226 232 240);
              background:#fff;
              color: rgb(15 23 42);
              border-radius:10px;
              padding:8px 12px;
              font-size:14px;
              font-weight:600;
            }
            .btn-secondary:hover{ background: rgb(248 250 252); }
            .btn-secondary:active{ background: rgb(241 245 249); }
          `}
        </style>
      </form>
    </div>
  );
}

/* ---------- UI helpers (no logic) ---------- */
function inputClass(isError: boolean): string {
  return [
    'w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900',
    'placeholder:text-slate-400 focus:outline-none focus:border-slate-900',
    isError ? 'border-red-300 focus:border-red-500' : 'border-slate-200',
    'disabled:opacity-70 disabled:cursor-not-allowed',
  ].join(' ');
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        {subtitle && <div className="mt-1 text-xs text-slate-500">{subtitle}</div>}
      </div>
      <div className="px-4 py-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string[];
  children: React.ReactNode;
}) {
  const errId = error?.length ? `err-${htmlFor}` : undefined;

  return (
    <div className="grid gap-1.5">
      <label className="text-xs font-semibold text-slate-700" htmlFor={htmlFor}>
        {label}
      </label>

      {children}

      {hint && <div className="text-[11px] text-slate-500">{hint}</div>}

      {error?.length ? (
        <p id={errId} className="text-xs text-red-600">
          {error.join(', ')}
        </p>
      ) : null}
    </div>
  );
}

/* ---------- Icons (pure visual) ---------- */
function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="4" />
      <path d="M20 21a8 8 0 1 0-16 0" />
    </svg>
  );
}
function ArrowLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function SaveIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <path d="M17 21v-8H7v8" />
      <path d="M7 3v5h8" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </svg>
  );
}
function KeyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 2l-2 2m-3 3l-2 2" />
      <path d="M7 14a5 5 0 1 1 4-8l2 2 3 3-2 2-2-2" />
      <path d="M7 14l-5 5v3h3l5-5" />
    </svg>
  );
}

```
</details>

### src/pages/users/UsersList.tsx

- SHA: `ce24659c2c35`  
- Ukuran: 20 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/users/UsersList.tsx
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
      const sameBranch = String(row.branch_id ?? '') === String(me?.branch_id ?? '');
      const rowHasSuperadmin = (row.roles ?? []).includes('Superadmin');
      return sameBranch && !rowHasSuperadmin;
    },
    [isSuperadmin, me?.branch_id]
  );

  const canToggleActive = canEditRow;
  const canDeleteRow = useCallback(
    (row: User) => {
      if (isSuperadmin) return true;
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
        if (!isSuperadmin && me?.branch_id) query.branch_id = String(me.branch_id);
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
      if (!confirm(`Hapus user ${u.username || u.email}?`)) return;
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

  const totalUsers = meta?.total ?? rows.length;
  const showingFrom = meta ? (rows.length ? (meta.current_page - 1) * perPage + 1 : 0) : rows.length ? 1 : 0;
  const showingTo = meta ? (rows.length ? (meta.current_page - 1) * perPage + rows.length : 0) : rows.length;


  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs text-slate-500">Settings / Users</div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Users</h1>
          <p className="mt-1 text-sm text-slate-500">Kelola akun, role, dan status aktif.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block text-xs text-slate-500">
            Total: <span className="font-semibold text-slate-700">{totalUsers}</span>
          </div>

          {canManage && (
            <Link
              to="/users/new"
              className="
                inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2
                text-sm font-semibold text-white hover:bg-slate-800 active:bg-slate-950
              "
              aria-label="Tambah user baru"
            >
              <PlusIcon />
              New User
            </Link>
          )}
        </div>
      </header>

      {/* Toolbar */}
      <section
        className="rounded-xl border border-slate-200 bg-white shadow-[0_14px_40px_-30px_rgba(0,0,0,.35)]"
        aria-label="Toolbar pencarian user"
      >
        <div className="p-3 sm:p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="relative">
              <label htmlFor="q" className="sr-only">
                Pencarian
              </label>
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <SearchIcon />
              </span>
              <input
                id="q"
                className="
                  w-full rounded-lg border border-slate-200 bg-white
                  py-2.5 pl-10 pr-3 text-sm text-slate-900
                  placeholder:text-slate-400
                  focus:border-slate-900 focus:outline-none
                "
                placeholder="Cari nama / username / email…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Cari user"
              />
            </div>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <div className="text-xs text-slate-500">
                {meta ? (
                  <>
                    Menampilkan <span className="font-semibold text-slate-700">{showingFrom}</span>–
                    <span className="font-semibold text-slate-700">{showingTo}</span> dari{" "}
                    <span className="font-semibold text-slate-700">{meta.total ?? totalUsers}</span>
                  </>
                ) : (
                  <>
                    Menampilkan <span className="font-semibold text-slate-700">{rows.length}</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="per" className="text-xs font-medium text-slate-600">
                  Per page
                </label>
                <select
                  id="per"
                  className="
                    rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm
                    focus:border-slate-900 focus:outline-none
                  "
                  value={perPage}
                  onChange={(e) => setPerPage(Number(e.target.value))}
                  aria-label="Jumlah baris per halaman"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alerts */}
      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {isEmpty && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
          Belum ada user.
        </div>
      )}

      {/* Table */}
      <section aria-busy={loading ? 'true' : 'false'}>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_14px_40px_-30px_rgba(0,0,0,.35)]">
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50">
                <tr className="border-b border-slate-200">
                  <Th className="pl-4">User</Th>
                  <Th>Username</Th>
                  <Th>Email</Th>
                  <Th>Branch</Th>
                  <Th>Roles</Th>
                  <Th>Status</Th>
                  <Th className="pr-4 text-right">Aksi</Th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
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
                  rows.map((u) => {
                    const allowEdit = canEditRow(u);
                    const allowToggle = canToggleActive(u);
                    const allowDelete = canDeleteRow(u);

                    return (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        {/* User */}
                        <Td className="pl-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={u.name || u.username || u.email || '?'} />
                            <div className="min-w-0">
                              <div className="truncate font-semibold text-slate-900">{u.name || '-'}</div>
                              <div className="truncate text-xs text-slate-500">ID: {String(u.id)}</div>
                            </div>
                          </div>
                        </Td>

                        <Td className="text-slate-700">{u.username || '-'}</Td>
                        <Td className="text-slate-700">
                          <span className="break-all">{u.email || '-'}</span>
                        </Td>
                        <Td className="text-slate-700">{u.branch_id ?? '-'}</Td>

                        <Td>
                          <div className="flex flex-wrap gap-1.5">
                            {(u.roles ?? []).length ? (
                              (u.roles ?? []).map((r) => (
                                <span
                                  key={r}
                                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs font-semibold text-slate-700"
                                >
                                  {r}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-400 text-xs">-</span>
                            )}
                          </div>
                        </Td>

                        <Td>
                          <span
                            className={[
                              'inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold',
                              u.is_active
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200',
                            ].join(' ')}
                          >
                            <span
                              className={[
                                'h-2 w-2 rounded-full',
                                u.is_active ? 'bg-emerald-500' : 'bg-slate-400',
                              ].join(' ')}
                            />
                            {u.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </Td>

                        {/* Actions */}
                        <Td className="pr-4">
                          <div className="flex justify-end gap-1">
                            {allowEdit && (
                              <Link
                                className="icon-btn"
                                to={`/users/${String(u.id)}/edit`}
                                aria-label={`Edit user ${u.username ?? u.email}`}
                                title="Edit"
                              >
                                <EditIcon />
                              </Link>
                            )}

                            {canManage && (
                              <>
                                <button
                                  className={`icon-btn ${allowToggle ? '' : 'opacity-40 cursor-not-allowed'}`}
                                  disabled={!allowToggle}
                                  onClick={() => handleToggleActive(u)}
                                  aria-label={u.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                  title={u.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                >
                                  {u.is_active ? <PauseIcon /> : <PlayIcon />}
                                </button>

                                <button
                                  className={`icon-btn text-red-600 hover:bg-red-50 ${allowDelete ? '' : 'opacity-40 cursor-not-allowed'
                                    }`}
                                  disabled={!allowDelete}
                                  onClick={() => handleDelete(u)}
                                  aria-label="Delete"
                                  title="Delete"
                                >
                                  <TrashIcon />
                                </button>
                              </>
                            )}
                          </div>
                        </Td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer mini */}
          <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 text-xs text-slate-500">
            <div>
              {meta ? (
                <>
                  Halaman <span className="font-semibold text-slate-700">{meta.current_page}</span> dari{' '}
                  <span className="font-semibold text-slate-700">{meta.last_page}</span>
                </>
              ) : (
                <>—</>
              )}
            </div>
            <div className="hidden sm:block">
              {me?.branch_id ? (
                <>Scope: Branch #{String(me.branch_id)}</>
              ) : (
                <>Scope: All</>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <nav className="flex items-center justify-end gap-2" aria-label="Navigasi halaman">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="page-btn disabled:opacity-50"
          >
            <ChevronLeftIcon />
            Prev
          </button>

          <span className="text-sm text-slate-600">
            Hal <span className="font-semibold text-slate-900">{meta.current_page}</span> / {meta.last_page}
          </span>

          <button
            disabled={page >= meta.last_page}
            onClick={() => setPage((p) => p + 1)}
            className="page-btn disabled:opacity-50"
          >
            Next
            <ChevronRightIcon />
          </button>
        </nav>
      )}

      {/* Small local styles via Tailwind utility classnames (no logic change) */}
      <style>
        {`
          .icon-btn{
            display:inline-flex; align-items:center; justify-content:center;
            width:36px; height:36px;
            border:1px solid rgb(226 232 240);
            border-radius:10px;
            background:#fff;
            color: rgb(15 23 42);
          }
          .icon-btn:hover{ background: rgb(248 250 252); }
          .icon-btn:active{ background: rgb(241 245 249); }
          .page-btn{
            display:inline-flex; align-items:center; gap:8px;
            border:1px solid rgb(226 232 240);
            background:#fff;
            color: rgb(15 23 42);
            border-radius:10px;
            padding:8px 12px;
            font-size:14px;
            font-weight:600;
          }
          .page-btn:hover{ background: rgb(248 250 252); }
        `}
      </style>
    </div>
  );
}

/* ---------- Subcomponents (UI only) ---------- */
function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500 ${className}`}>
      {children}
    </th>
  );
}

function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-3 py-3 align-middle ${className}`}>{children}</td>;
}

function RowSkeleton() {
  return (
    <tr>
      <td className="px-3 py-4 pl-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-slate-200 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-44 rounded bg-slate-200 animate-pulse" />
            <div className="h-3 w-24 rounded bg-slate-200 animate-pulse" />
          </div>
        </div>
      </td>
      <td className="px-3 py-4"><div className="h-4 w-28 rounded bg-slate-200 animate-pulse" /></td>
      <td className="px-3 py-4"><div className="h-4 w-56 rounded bg-slate-200 animate-pulse" /></td>
      <td className="px-3 py-4"><div className="h-4 w-16 rounded bg-slate-200 animate-pulse" /></td>
      <td className="px-3 py-4"><div className="h-4 w-36 rounded bg-slate-200 animate-pulse" /></td>
      <td className="px-3 py-4"><div className="h-6 w-24 rounded bg-slate-200 animate-pulse" /></td>
      <td className="px-3 py-4 pr-4 text-right"><div className="inline-block h-9 w-28 rounded bg-slate-200 animate-pulse" /></td>
    </tr>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = useMemo(() => {
    const clean = (name || '').trim();
    if (!clean) return '?';
    const parts = clean.split(/\s+/).slice(0, 2);
    return parts.map(p => p[0]?.toUpperCase()).join('') || '?';
  }, [name]);

  return (
    <div className="h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
      {initials}
    </div>
  );
}

/* ---------- Icons (pure visual) ---------- */
function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.2-3.2" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function EditIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5z" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}
function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 5l12 7-12 7V5z" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8 5v14M16 5v14" />
    </svg>
  );
}
function ChevronLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function ChevronRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

```
</details>

### src/pages/vouchers/VoucherForm.tsx

- SHA: `937798c10c4c`  
- Ukuran: 8 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/vouchers/VoucherForm.tsx
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
    <form className="space-y-4 max-w-2xl" onSubmit={onSubmit} aria-busy={loading ? 'true' : 'false'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            {editing ? 'Edit Voucher' : 'Buat Voucher'}
          </h1>
          <p className="text-xs text-gray-600">
            Atur kode, tipe, nilai, periode, dan status voucher.
          </p>
        </div>
      </div>

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

      {/* Card form */}
      <div className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Kode */}
          <label className="md:col-span-2">
            <div className="text-xs text-gray-600 mb-1">Kode</div>
            <input
              className="input w-full"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              required
              placeholder="Contoh: NEWUSER-10"
              aria-invalid={!!fieldErrors.code}
              aria-describedby={fieldErrors.code ? 'err-code' : undefined}
            />
            <div className="text-[10px] text-gray-500 mt-1">
              Hanya huruf besar, angka, dan strip. Contoh: <span className="font-mono">SALVE-25</span>
            </div>
            {fieldErrors.code && (
              <div id="err-code" className="text-xs text-red-600 mt-1">
                {fieldErrors.code.join(', ')}
              </div>
            )}
          </label>

          {/* Tipe */}
          <label>
            <div className="text-xs text-gray-600 mb-1">Tipe</div>
            <select
              className="input w-full"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as VoucherType })}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>

          {/* Nilai */}
          <label>
            <div className="text-xs text-gray-600 mb-1">Nilai</div>
            <input
              type="number"
              className="input w-full"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
              required
              aria-invalid={!!fieldErrors.value}
              aria-describedby={fieldErrors.value ? 'err-value' : undefined}
            />
            <div className="text-[10px] text-gray-500 mt-1">
              {form.type === 'PERCENT' ? '0–100 (%)' : 'Nominal rupiah'}
            </div>
            {fieldErrors.value && (
              <div id="err-value" className="text-xs text-red-600 mt-1">
                {fieldErrors.value.join(', ')}
              </div>
            )}
          </label>

          {/* Min Total */}
          <label>
            <div className="text-xs text-gray-600 mb-1">Min Total</div>
            <input
              type="number"
              className="input w-full"
              value={form.min_total ?? 0}
              onChange={(e) => setForm({ ...form, min_total: Number(e.target.value) })}
            />
          </label>

          {/* Usage Limit */}
          <label>
            <div className="text-xs text-gray-600 mb-1">Usage Limit</div>
            <input
              type="number"
              className="input w-full"
              value={form.usage_limit ?? 0}
              onChange={(e) =>
                setForm({ ...form, usage_limit: e.target.value ? Number(e.target.value) : null })
              }
            />
            <div className="text-[10px] text-gray-500 mt-1">Kosongkan untuk tidak dibatasi.</div>
          </label>

          {/* Start At */}
          <label>
            <div className="text-xs text-gray-600 mb-1">Start At</div>
            <input
              type="datetime-local"
              className="input w-full"
              value={form.start_at ?? ''}
              onChange={(e) => setForm({ ...form, start_at: e.target.value || null })}
            />
          </label>

          {/* End At */}
          <label>
            <div className="text-xs text-gray-600 mb-1">End At</div>
            <input
              type="datetime-local"
              className="input w-full"
              value={form.end_at ?? ''}
              onChange={(e) => setForm({ ...form, end_at: e.target.value || null })}
            />
          </label>

          {/* Aktif */}
          <label className="md:col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            <span className="text-sm">Aktif</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button disabled={loading} className="btn-primary disabled:opacity-50">
          {loading ? 'Menyimpan…' : 'Simpan'}
        </button>
        <button
          type="button"
          className="btn-outline"
          onClick={() => history.back()}
        >
          Batal
        </button>
      </div>
    </form>
  );
}

```
</details>

### src/pages/vouchers/VouchersIndex.tsx

- SHA: `108bf6b6088f`  
- Ukuran: 10 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/vouchers/VouchersIndex.tsx
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

  const queryActive = useMemo(
    () => (active === 'all' ? undefined : active === 'active'),
    [active]
  );

  const fetchPage = useCallback(
    async (p = 1) => {
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
    },
    [q, queryActive]
  );

  useEffect(() => { void fetchPage(page); }, [fetchPage, page]);

  useEffect(() => {
    const t = setTimeout(() => { void fetchPage(1); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [fetchPage, q, active]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Vouchers</h1>
          <p className="text-xs text-gray-500">Kelola kode promo dan periode aktif.</p>
        </div>
        {canManage && (
          <button
            className="btn-primary"
            onClick={() => nav('/vouchers/new')}
            aria-label="Tambah voucher baru"
          >
            New Voucher
          </button>
        )}
      </header>

      {/* Toolbar */}
      <section
        className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1"
        aria-label="Toolbar pencarian voucher"
      >
        <div className="p-3 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
          <div className="relative">
            <input
              className="input w-full pl-9 py-2"
              placeholder="Cari kode…"
              value={q}
              onChange={(e) => { setQ(e.target.value); }}
              aria-label="Cari voucher"
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
          </div>

          <div className="flex items-center justify-end gap-2">
            <label htmlFor="filter-active" className="text-sm text-gray-600">Status</label>
            <select
              id="filter-active"
              className="input py-2"
              value={active}
              onChange={(e) => setActive(e.target.value as 'all' | 'active' | 'inactive')}
              aria-label="Filter status voucher"
            >
              <option value="all">Semua</option>
              <option value="active">Aktif</option>
              <option value="inactive">Nonaktif</option>
            </select>
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
      <section aria-busy={loading ? 'true' : 'false'}>
        <div className="card overflow-hidden border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#E6EDFF] sticky top-0 z-10">
                <tr className="divide-x divide-[color:var(--color-border)] text-left">
                  <Th>Kode</Th>
                  <Th>Tipe</Th>
                  <Th className="text-right">Nilai</Th>
                  <Th className="text-right">Min Total</Th>
                  <Th>Periode</Th>
                  <Th className="text-right">Limit</Th>
                  <Th>Status</Th>
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
                  </>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-3 py-4 text-center text-gray-500">
                      Belum ada voucher
                    </td>
                  </tr>
                ) : (
                  rows.map((v) => (
                    <tr key={v.id} className="hover:bg-black/5 transition-colors">
                      <Td><span className="font-mono">{v.code}</span></Td>
                      <Td>{v.type}</Td>
                      <Td className="text-right">
                        {v.type === 'PERCENT'
                          ? `${v.value}%`
                          : new Intl.NumberFormat('id-ID').format(v.value)}
                      </Td>
                      <Td className="text-right">
                        {new Intl.NumberFormat('id-ID').format(v.min_total ?? 0)}
                      </Td>
                      <Td>
                        {(v.start_at && v.end_at)
                          ? `${v.start_at?.slice(0, 16)} — ${v.end_at?.slice(0, 16)}`
                          : '—'}
                      </Td>
                      <Td className="text-right">{v.usage_limit ?? '—'}</Td>
                      <Td>{v.active ? 'Aktif' : 'Nonaktif'}</Td>
                      <Td className="text-right">
                        <div className="inline-flex gap-2">
                          <button
                            className="btn-outline"
                            onClick={() => nav(`/vouchers/${v.id}/edit`)}
                            aria-label={`Edit voucher ${v.code}`}
                          >
                            Edit
                          </button>
                          {canManage && (
                            <button
                              className="btn-outline text-red-600"
                              onClick={async () => {
                                if (!confirm(`Hapus voucher ${v.code}?`)) return;
                                try {
                                  await deleteVoucher(v.id);
                                  await fetchPage(page);
                                } catch {
                                  alert('Gagal menghapus');
                                }
                              }}
                              aria-label={`Hapus voucher ${v.code}`}
                            >
                              Delete
                            </button>
                          )}
                        </div>
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
      {meta && meta.last_page > 1 && (
        <nav className="flex items-center gap-2 justify-end" aria-label="Navigasi halaman voucher">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="btn-outline disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm">Hal {meta.current_page} / {meta.last_page}</span>
          <button
            disabled={page >= meta.last_page}
            onClick={() => setPage((p) => p + 1)}
            className="btn-outline disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}

/* ---------- Subcomponents (konsisten dgn Customers) ---------- */
function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-3 py-2 text-xs font-medium uppercase tracking-wide ${className}`}>
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
      <td className="px-3 py-3"><div className="h-4 w-24 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-20 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-16 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-20 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-40 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-14 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-16 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3 text-right">
        <div className="inline-block h-8 w-28 rounded bg-black/10 animate-pulse" />
      </td>
    </tr>
  );
}

```
</details>

### src/pages/wash-notes/WashNoteForm.tsx

- SHA: `7c0a2815aa78`  
- Ukuran: 24 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/wash-notes/WashNoteForm.tsx
import { useEffect, useMemo, useState } from 'react';
import { createWashNote, updateWashNote, getWashNote, searchOrderCandidates, listWashNotes } from '../../api/washNotes';
import { useNavigate, useParams } from 'react-router-dom';
import { todayLocalYMD, toLocalYMD } from '../../utils/date';

type ItemDraft = {
    order_id: string;
    number: string;
    customer?: string;
    qty: number;
    process_status?: 'QUEUE' | 'WASH' | 'DRY' | 'FINISHING' | 'COMPLETED' | 'PICKED_UP';
    started_at?: string | null;
    finished_at?: string | null;
    note?: string | null;
};

function InfoTipsForm({ noteDate }: { noteDate: string }) {
    const [open, setOpen] = useState(true);
    return (
        <aside className="card rounded-lg border border-[color:var(--color-border)] bg-[var(--color-surface)] shadow-elev-1">
            <div className="flex items-center justify-between p-3">
                <strong className="text-sm">Tips / Keterangan</strong>
                <button
                    type="button"
                    onClick={() => setOpen(o => !o)}
                    className="text-xs underline"
                    aria-expanded={open}
                    aria-controls="wash-tips-form"
                >
                    {open ? 'Sembunyikan' : 'Tampilkan'}
                </button>
            </div>
            {open && (
                <div id="wash-tips-form" className="px-3 pb-3 text-sm leading-relaxed">
                    <ul className="list-disc ml-5 space-y-1">
                        <li>Catatan dibuat per <strong>Petugas Cuci</strong> per <strong>tanggal</strong>. Tanggal aktif: <b>{noteDate}</b>.</li>
                        <li>Gunakan <em>rentang tanggal</em> di bagian pencarian untuk menyaring order yang akan ditambahkan.</li>
                        <li>Ketik lengkap <strong>huruf atau nomor order</strong> pada kolom “Cari Order”, lalu <strong>Tambah</strong> untuk memasukkan ke daftar.</li>
                        <li>Isi <code>qty</code>, pilih status proses, dan (opsional) jam mulai–selesai. Jam selesai harus ≥ jam mulai bila keduanya diisi.</li>
                        <li>Duplikasi order pada catatan yang sama akan otomatis dicegah.</li>
                        <li>Tekan <strong>Simpan</strong> setelah minimal satu order terisi.</li>
                        <li>Bila <em>Auto-isi qty</em> aktif, kolom qty terisi otomatis dari total item pada order; Anda tetap dapat mengubahnya.</li>
                    </ul>
                </div>
            )}
        </aside>
    );
}

export default function WashNoteForm() {
    const nav = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [noteDate, setNoteDate] = useState(() => todayLocalYMD());
    const [items, setItems] = useState<ItemDraft[]>([]);
    const [q, setQ] = useState('');
    const [candidates, setCandidates] = useState<any[]>([]);
    const today = todayLocalYMD();
    const [from, setFrom] = useState<string>(today);
    const [to, setTo] = useState<string>(today);
    const [loading, setLoading] = useState(false);
    const [autoQty, setAutoQty] = useState<boolean>(true);

    const hhmm = (t?: string | null) => (t ? String(t).slice(0, 5) : null);

    const loadDetail = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await getWashNote(id);
            const n = res.data;
            setNoteDate(toLocalYMD(n.note_date));
            const mapped = (n.items ?? []).map((it: any) => ({
                order_id: it.order_id,
                number: it.order?.number ?? it.order_id,
                customer: it.order?.customer?.name ?? '',
                qty: Number(it.qty ?? 0),
                process_status: it.process_status ?? undefined,
                started_at: it.started_at ?? null,
                finished_at: it.finished_at ?? null,
                note: it.note ?? null,
            }));
            setItems(mapped);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadDetail(); }, [id]);

    const norm = (v?: string) => (v ?? '').trim().toLowerCase();
    const selectedIds = useMemo<Set<string>>(
        () => new Set(items.map(i => norm(i.order_id))),
        [items]
    );
    const selectedNumbers = useMemo<Set<string>>(
        () => new Set(items.map(i => norm(i.number))),
        [items]
    );

    const search = async () => {
        setLoading(true);
        try {
            const od = toLocalYMD(noteDate);
            const res = await searchOrderCandidates({
                query: q,
                date_from: from,
                date_to: to,
                on_date: od,
                exclude_note_id: id || undefined,
            });
            const rows = (res.data ?? []) as any[];
            const filtered = rows.filter(o => {
                const oid = norm(String(o.id));
                const onum = norm(String(o.number));
                return !selectedIds.has(oid) && !selectedNumbers.has(onum);
            });
            setCandidates(filtered);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (q.length >= 2) search(); else setCandidates([]);
    }, [q, from, to, noteDate, items]);

    const addItem = (o: any) => {
        const oid = norm(String(o.id));
        const onum = norm(String(o.number));
        if (items.some(x => norm(x.order_id) === oid || norm(x.number) === onum)) return;
        const dqty = Number(o?.default_qty ?? 0);
        setItems(prev => [...prev, {
            order_id: o.id,
            number: o.number,
            customer: o.customer?.name ?? '',
            qty: autoQty ? dqty : 0,
            process_status: 'WASH',
        }]);
        setCandidates(prev => prev.filter(c => norm(String(c.id)) !== oid && norm(String(c.number)) !== onum));
    };

    const removeItem = (order_id: string) => {
        setItems(prev => prev.filter(x => x.order_id !== order_id));
        if (q.length >= 2) { void search(); }
    };

    const clearSelected = () => setItems([]);

    const invalidQty = useMemo(
        () => items.some(it => isNaN(it.qty as any) || (it.qty as number) < 0),
        [items]
    );
    const invalidTime = useMemo(() => {
        const cmp = (a?: string | null, b?: string | null) => (a && b) ? (a <= b) : true;
        const anyInvalid = items.some(it => {
            const s = it.started_at ?? '';
            const f = it.finished_at ?? '';
            if (!s || !f) return false;
            return !(cmp(s, f));
        });
        return anyInvalid;
    }, [items]);

    const disableSave = items.length === 0 || invalidQty || invalidTime || loading;

    const selectedSummary = useMemo(() => {
        const totalQty = items.reduce((acc, it) => acc + (Number(it.qty) || 0), 0);
        return { count: items.length, totalQty };
    }, [items]);

    const submit = async () => {
        const payload = {
            note_date: noteDate,
            items: items.map(it => ({
                order_id: it.order_id,
                qty: it.qty,
                process_status: it.process_status,
                started_at: it.started_at || null,
                finished_at: it.finished_at || null,
                note: it.note || null,
            })),
        };

        setLoading(true);
        try {
            if (id) {
                await updateWashNote(id, payload);
            } else {
                await createWashNote(payload);
            }
            nav('/wash-notes');
        } catch (err: any) {
            const resp = err?.response;
            const status = resp?.status;
            const data = resp?.data;

            if (status === 422) {
                const existingId = data?.meta?.existing_id;
                if (existingId) {
                    return nav(`/wash-notes/${existingId}/edit`);
                }
                try {
                    const res = await listWashNotes({ date_from: noteDate, date_to: noteDate, page: 1, per_page: 1 });
                    const existing = res?.data?.[0];
                    if (existing?.id) {
                        return nav(`/wash-notes/${existing.id}/edit`);
                    }
                } catch { }
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const resetSearchDates = () => { setFrom(today); setTo(today); };

    return (
        <div className="space-y-4">
            {/* Header + Save */}
            <div className="flex items-end gap-3">
                <div>
                    <label className="block text-xs mb-1" htmlFor="noteDate">Tanggal catatan</label>
                    <input
                        id="noteDate"
                        type="date"
                        className="input py-2"
                        value={noteDate}
                        onChange={e => setNoteDate(e.target.value)}
                    />
                </div>
                <button
                    type="button"
                    className="btn-outline"
                    onClick={() => setNoteDate(todayLocalYMD())}
                    title="Set ke hari ini"
                >
                    Hari ini
                </button>
                <button
                    onClick={submit}
                    disabled={disableSave}
                    className={`ml-auto ${disableSave ? 'btn-outline opacity-60 cursor-not-allowed' : 'btn-primary'}`}
                    title={disableSave ? 'Lengkapi data agar dapat disimpan' : 'Simpan catatan'}
                >
                    {id ? 'Simpan Perubahan' : 'Simpan'}
                </button>
            </div>

            <InfoTipsForm noteDate={noteDate} />

            {(invalidQty || invalidTime) && (
                <div className="rounded-md border border-red-200 bg-red-50 text-red-700 p-3 text-sm" role="alert" aria-live="polite">
                    {invalidQty && <div>Qty tidak boleh negatif.</div>}
                    {invalidTime && <div>Jam selesai harus lebih besar atau sama dengan jam mulai.</div>}
                </div>
            )}

            {/* Toolbar Pencarian */}
            <section className="card rounded-lg border border-[color:var(--color-border)] shadow-elev-1" aria-label="Pencarian order kandidat">
                <div className="p-3 grid grid-cols-1 lg:grid-cols-[1fr_auto_auto_auto_auto] gap-2">
                    <div className="relative">
                        <label className="sr-only" htmlFor="q">Cari Order</label>
                        <input
                            id="q"
                            value={q}
                            onChange={e => { setQ(e.target.value); }}
                            placeholder="Cari Order (nomor / pelanggan)… (min 2 huruf)"
                            className="input w-full pl-9 py-2"
                        />
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
                    </div>

                    <div>
                        <label className="block text-xs mb-1" htmlFor="from">Dari</label>
                        <input
                            id="from"
                            type="date"
                            className="input py-2"
                            value={from}
                            onChange={e => setFrom(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs mb-1" htmlFor="to">Sampai</label>
                        <input
                            id="to"
                            type="date"
                            className="input py-2"
                            value={to}
                            onChange={e => setTo(e.target.value)}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={resetSearchDates}
                        className="btn-outline h-10 self-end"
                        title="Kembalikan rentang ke hari ini"
                    >
                        Reset
                    </button>

                    <div className="flex items-center gap-2 self-end">
                        <input
                            id="auto-qty"
                            type="checkbox"
                            className="h-4 w-4"
                            checked={autoQty}
                            onChange={e => setAutoQty(e.target.checked)}
                        />
                        <label htmlFor="auto-qty" className="text-sm">Auto-isi qty dari order</label>
                    </div>
                </div>
            </section>

            {/* Kandidat (TABLE – gaya sama dengan CustomersIndex) */}
            <section aria-busy={loading ? 'true' : 'false'}>
                <div className="card overflow-hidden border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
                    <div className="overflow-auto">
                        <table className="min-w-[720px] w-full text-sm">
                            <thead className="bg-[#E6EDFF] sticky top-0 z-10">
                                <tr className="divide-x divide-[color:var(--color-border)]">
                                    <Th>Kode Order</Th>
                                    <Th>Pelanggan</Th>
                                    <Th className="text-right">Default Qty</Th>
                                    <Th className="text-right pr-4">Aksi</Th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[color:var(--color-border)]">
                                {loading ? (
                                    <>
                                        <RowSkeleton cols={[160, 240, 80, 100]} />
                                        <RowSkeleton cols={[160, 240, 80, 100]} />
                                        <RowSkeleton cols={[160, 240, 80, 100]} />
                                    </>
                                ) : candidates.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-3 py-4 text-center text-gray-500">Tidak ada kandidat. Ketik minimal 2 huruf untuk mencari.</td>
                                    </tr>
                                ) : (
                                    candidates
                                        .filter(o => !selectedIds.has(norm(String(o.id))) && !selectedNumbers.has(norm(String(o.number))))
                                        .map(o => (
                                            <tr key={o.id} className="hover:bg-black/5 transition-colors">
                                                <Td className="font-medium">{o.number}</Td>
                                                <Td>{o.customer?.name ?? '-'}</Td>
                                                <Td className="text-right tabular-nums">{Number(o?.default_qty ?? 0)}</Td>
                                                <Td className="text-right">
                                                    <button
                                                        onClick={() => addItem(o)}
                                                        disabled={selectedIds.has(norm(String(o.id))) || selectedNumbers.has(norm(String(o.number)))}
                                                        className="btn-outline disabled:opacity-50"
                                                    >
                                                        Tambah
                                                    </button>
                                                </Td>
                                            </tr>
                                        ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Ringkas pilihan */}
            <div className="flex items-center justify-between text-sm">
                <div>
                    Terpilih: <b>{selectedSummary.count}</b> order • total qty <b>{selectedSummary.totalQty}</b>
                </div>
                {items.length > 0 && (
                    <button type="button" onClick={clearSelected} className="underline text-gray-700">
                        Hapus semua pilihan
                    </button>
                )}
            </div>

            {/* Items terpilih (TABLE – gaya sama dengan CustomersIndex) */}
            <section>
                <div className="card overflow-hidden border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
                    <div className="overflow-auto">
                        <table className="min-w-[980px] w-full text-sm">
                            <thead className="bg-[#E6EDFF] sticky top-0 z-10">
                                <tr className="divide-x divide-[color:var(--color-border)]">
                                    <Th>Order</Th>
                                    <Th>Pelanggan</Th>
                                    <Th className="text-right">Qty</Th>
                                    <Th>Status</Th>
                                    <Th>Mulai</Th>
                                    <Th>Selesai</Th>
                                    <Th>Catatan</Th>
                                    <Th className="text-right pr-4">Aksi</Th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[color:var(--color-border)]">
                                {items.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-3 py-4 text-center text-gray-500">Belum ada order terpilih.</td>
                                    </tr>
                                ) : (
                                    items.map((it, idx) => (
                                        <tr key={it.order_id} className="hover:bg-black/5 transition-colors">
                                            <Td className="font-medium">{it.number}</Td>
                                            <Td><span className="line-clamp-1 max-w-[40ch]">{it.customer || '-'}</span></Td>
                                            <Td className="text-right">
                                                <input
                                                    className="input w-24 text-right"
                                                    type="number"
                                                    min={0}
                                                    step={1}               // integer agar tidak muncul .00
                                                    value={it.qty}
                                                    onChange={e => {
                                                        const v = parseFloat(e.target.value || '0');
                                                        setItems(prev => prev.map((x, i) => i === idx ? { ...x, qty: isNaN(v) ? 0 : v } : x));
                                                    }}
                                                />
                                            </Td>
                                            <Td>
                                                <select
                                                    className="input"
                                                    value={it.process_status ?? ''}
                                                    onChange={e => setItems(prev => prev.map((x, i) => i === idx ? { ...x, process_status: (e.target.value || undefined) as any } : x))}
                                                >
                                                    <option value="">(kosong)</option>
                                                    <option value="QUEUE">QUEUE</option>
                                                    <option value="WASH">WASH</option>
                                                    <option value="DRY">DRY</option>
                                                    <option value="FINISHING">FINISHING</option>
                                                    <option value="COMPLETED">COMPLETED</option>
                                                    <option value="PICKED_UP">PICKED_UP</option>
                                                </select>
                                            </Td>
                                            <Td>
                                                <input
                                                    className="input w-28"
                                                    type="time"
                                                    value={it.started_at ?? ''}
                                                    onChange={e => {
                                                        const v = hhmm(e.target.value);
                                                        setItems(prev => prev.map((x, i) => i === idx ? { ...x, started_at: v || null } : x));
                                                    }}
                                                />
                                            </Td>
                                            <Td>
                                                <input
                                                    className="input w-28"
                                                    type="time"
                                                    value={it.finished_at ?? ''}
                                                    onChange={e => {
                                                        const v = hhmm(e.target.value);
                                                        setItems(prev => prev.map((x, i) => i === idx ? { ...x, finished_at: v || null } : x));
                                                    }}
                                                />
                                            </Td>
                                            <Td>
                                                <input
                                                    className="input w-[24rem] max-w-[48ch]"
                                                    placeholder="Catatan singkat"
                                                    value={it.note ?? ''}
                                                    onChange={e => setItems(prev => prev.map((x, i) => i === idx ? { ...x, note: e.target.value || null } : x))}
                                                />
                                            </Td>
                                            <Td className="text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(it.order_id)}
                                                    className="btn-outline text-red-600 border-red-300"
                                                    title="Hapus dari daftar"
                                                >
                                                    Hapus
                                                </button>
                                            </Td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
}

/* ---------- Subcomponents (tabel konsisten) ---------- */
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
function RowSkeleton({ cols = [160, 240, 100, 100] }: { cols?: number[] }) {
    return (
        <tr>
            {cols.map((w, i) => (
                <td key={i} className="px-3 py-3">
                    <div className="h-4 rounded bg-black/10 animate-pulse" style={{ width: `${w}px` }} />
                </td>
            ))}
        </tr>
    );
}

```
</details>

### src/pages/wash-notes/WashNotesIndex.tsx

- SHA: `1599f0b5e4bb`  
- Ukuran: 9 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/wash-notes/WashNotesIndex.tsx
import { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { listWashNotes, deleteWashNote } from '../../api/washNotes';
import { useHasRole } from '../../store/useAuth';
import { todayLocalYMD } from '../../utils/date';

function InfoTips() {
  const [open, setOpen] = useState(true);
  return (
    <aside className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
      <div className="flex items-center justify-between p-3">
        <strong className="text-sm">Tips / Keterangan</strong>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="text-xs underline"
          aria-expanded={open}
          aria-controls="wash-tips"
        >
          {open ? 'Sembunyikan' : 'Tampilkan'}
        </button>
      </div>
      {open && (
        <div id="wash-tips" className="px-3 pb-3 text-sm leading-relaxed">
          <ul className="list-disc ml-5 space-y-1">
            <li>Pilih <em>rentang tanggal</em> untuk menampilkan catatan cuci pada periode tersebut.</li>
            <li>Tekan <strong>Tambah</strong> untuk membuat catatan cuci harian (default tanggal hari ini).</li>
            <li><strong>Rekap</strong> menunjukkan jumlah order dan total <code>qty</code> yang dicuci pada tiap catatan.</li>
            <li>Hanya <strong>Superadmin</strong> dan <strong>Admin Cabang</strong> yang bisa menghapus catatan.</li>
            <li>Gunakan tombol <strong>Detail</strong> untuk melihat item/order, dan <strong>Ubah</strong> untuk memperbarui.</li>
          </ul>
        </div>
      )}
    </aside>
  );
}

export default function WashNotesIndex() {
  const today = todayLocalYMD();
  const [from, setFrom] = useState<string>(today);
  const [to, setTo] = useState<string>(today);
  const [rows, setRows] = useState<any[]>([]);
  const [meta, setMeta] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const canDelete = useHasRole(['Superadmin', 'Admin Cabang']);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await listWashNotes({ date_from: from, date_to: to });
      setRows(res.data ?? []);
      setMeta(res.meta ?? null);
    } catch {
      setErr('Gagal memuat catatan cuci.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [from, to]);

  const recap = useMemo(
    () => meta?.recap ?? { orders_count: 0, total_qty: 0 },
    [meta]
  );

  const resetDates = () => {
    const t = todayLocalYMD(); // hitung ulang saat tombol ditekan (jika lewat tengah malam)
    setFrom(t);
    setTo(t);
  };

  return (
    <div className="space-y-4">
      {/* Header + CTA */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Catatan Cuci Harian</h1>
          <p className="text-xs text-gray-600">Rekap order & qty yang dicuci per tanggal</p>
        </div>
        <NavLink to="/wash-notes/new" className="btn-primary">Tambah</NavLink>
      </div>

      {/* FilterBar */}
      <section className="card border border-[color:var(--color-border)] rounded-lg shadow-elev-1" aria-label="Filter catatan cuci">
        <div className="p-3 grid grid-cols-1 sm:grid-cols-[repeat(3,auto)_1fr] gap-3 items-end">
          <label className="grid gap-1 text-sm">
            <span>Dari Tanggal</span>
            <input
              type="date"
              className="input px-2 py-2 bg-white"
              value={from}
              onChange={e => setFrom(e.target.value)}
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span>Sampai Tanggal</span>
            <input
              type="date"
              className="input px-2 py-2 bg-white"
              value={to}
              onChange={e => setTo(e.target.value)}
            />
          </label>
          <button
            type="button"
            onClick={resetDates}
            className="btn-outline"
            disabled={loading}
            title="Kembalikan ke hari ini"
          >
            Reset
          </button>
          <div className="sm:ml-auto text-sm text-gray-700">
            <strong>Rekap:</strong> {recap.orders_count} order • {recap.total_qty} qty
          </div>
        </div>
      </section>

      {/* Info Tips */}
      <InfoTips />

      {/* Error */}
      {err && (
        <div role="alert" aria-live="polite" className="rounded-md border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
          {err}
        </div>
      )}

      {/* Tabel konsisten seperti CustomersIndex */}
      <section aria-busy={loading ? 'true' : 'false'}>
        <div className="card overflow-hidden border border-[color:var(--color-border)] rounded-lg shadow-elev-1">
          <div className="overflow-auto">
            <table className="min-w-[720px] w-full text-sm">
              <thead className="bg-[#E6EDFF] sticky top-0 z-10">
                <tr className="divide-x divide-[color:var(--color-border)]">
                  <Th>Tanggal</Th>
                  <Th>Petugas</Th>
                  <Th className="text-right">Order</Th>
                  <Th className="text-right">Total Qty</Th>
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
                  </>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-4 text-center text-gray-500">
                      Tidak ada data pada rentang tanggal ini.{' '}
                      <NavLink className="underline" to="/wash-notes/new">Buat catatan cuci baru</NavLink>.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id} className="hover:bg-black/5 transition-colors">
                      <Td>{r.note_date}</Td>
                      <Td><span className="line-clamp-1">{r.user?.name ?? r.user_id}</span></Td>
                      <Td className="text-right tabular-nums">{r.orders_count}</Td>
                      <Td className="text-right tabular-nums">{r.total_qty}</Td>
                      <Td className="text-right">
                        <div className="inline-flex items-center gap-2">
                          <NavLink className="btn-outline" to={`/wash-notes/${r.id}`}>Detail</NavLink>
                          <NavLink className="btn-outline" to={`/wash-notes/${r.id}/edit`}>Ubah</NavLink>
                          {canDelete && (
                            <button
                              onClick={async () => {
                                if (confirm('Hapus catatan ini?')) {
                                  await deleteWashNote(r.id);
                                  load();
                                }
                              }}
                              className="btn-outline text-red-600 border-red-300"
                            >
                              Hapus
                            </button>
                          )}
                        </div>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
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
      <td className="px-3 py-3"><div className="h-4 w-28 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3"><div className="h-4 w-40 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3 text-right"><div className="ml-auto h-4 w-10 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3 text-right"><div className="ml-auto h-4 w-12 rounded bg-black/10 animate-pulse" /></td>
      <td className="px-3 py-3 text-right"><div className="inline-block h-8 w-28 rounded bg-black/10 animate-pulse" /></td>
    </tr>
  );
}

```
</details>



## Pages (src/utils)

### src/utils/date.ts

- SHA: `68b1716f3273`  
- Ukuran: 742 B
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/utils/date.ts
export function todayLocalYMD(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`; // selalu tanggal lokal (bukan UTC)
}

export function toLocalYMD(input?: string): string {
  if (!input) return '';
  if (input.length >= 10 && input[4] === '-' && input[7] === '-') return input.slice(0, 10);
  const ms = Date.parse(input);
  if (Number.isNaN(ms)) return String(input).slice(0, 10);
  const d = new Date(ms);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

```
</details>

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

### src/utils/receipt-wa.ts

- SHA: `2a1968aa5ccb`  
- Ukuran: 1 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/utils/receipt-wa.ts
import type { Order } from '../types/orders';

export function formatIDR(n: number): string {
    try {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(n ?? 0);
    } catch {
        return `Rp ${Math.round(n ?? 0).toLocaleString('id-ID')}`;
    }
}

export function buildReceiptMessage(order: Order, shareUrl: string): string {
    const name = order?.customer?.name || 'Pelanggan';
    const nomor = (order as any)?.invoice_no || (order as any)?.number || '';
    const total = formatIDR(Number((order as any)?.grand_total ?? (order as any)?.total ?? 0));

    const status = (order as any)?.payment_status;
    const isLunas = status === 'PAID' || status === 'SETTLED';

    const lines = isLunas
        ? [
            `Halo ${name},`,
            'Terima kasih atas pembayarannya.',
            `Kwitansi: ${shareUrl}`,
            `No: ${nomor}`,
            `Total: ${total}`,
            'Terima Kasih Sudah Menggunakan Layanan.',
            'Salve Laundry',
        ]
        : [
            `Halo ${name},`,
            'Berikut tagihan laundry Anda.',
            `Kwitansi: ${shareUrl}`,
            `No: ${nomor}`,
            `Total: ${total}`,
            'Mohon melakukan pembayaran.',
            'Salve Laundry',
        ];

    return lines.join('\n');
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

- SHA: `2d7fbbae0f1e`  
- Ukuran: 443 B
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
// src/utils/wa.ts
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
