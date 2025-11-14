# Dokumentasi Frontend (FULL Source)

_Dihasilkan otomatis: 2025-11-09 17:56:00_  
**Root:** `G:\.galuh\latihanlaravel\A-Portfolio-Project\2025\apk-web-salve\Projek Salve\prjk-salve\frontend`


## Daftar Isi

- [API (src/api)](#api-srcapi)
  - [src\api\branches.ts](#file-srcapibranchests)
  - [src\api\client.ts](#file-srcapiclientts)
  - [src\api\customers.ts](#file-srcapicustomersts)
  - [src\api\deliveries.ts](#file-srcapideliveriests)
  - [src\api\invoiceCounters.ts](#file-srcapiinvoicecountersts)
  - [src\api\orderPhotos.ts](#file-srcapiorderphotosts)
  - [src\api\orders.ts](#file-srcapiordersts)
  - [src\api\receivables.ts](#file-srcapireceivablests)
  - [src\api\serviceCategories.ts](#file-srcapiservicecategoriests)
  - [src\api\servicePrices.ts](#file-srcapiservicepricests)
  - [src\api\services.ts](#file-srcapiservicests)
  - [src\api\users.ts](#file-srcapiusersts)
  - [src\api\vouchers.ts](#file-srcapivouchersts)

- [Store (src/store)](#store-srcstore)
  - [src\store\useAuth.ts](#file-srcstoreuseauthts)

- [layouts (src/layouts)](#layouts-srclayouts)
  - [src\layouts\GuestLayout.tsx](#file-srclayoutsguestlayouttsx)
  - [src\layouts\ProtectedLayout.tsx](#file-srclayoutsprotectedlayouttsx)

- [router (src/reouter)](#router-srcreouter)
  - [src\router\Guarded.tsx](#file-srcrouterguardedtsx)
  - [src\router\index.tsx](#file-srcrouterindextsx)

- [Types (src/types)](#types-srctypes)
  - [src\types\branches.ts](#file-srctypesbranchests)
  - [src\types\customers.ts](#file-srctypescustomersts)
  - [src\types\deliveries.ts](#file-srctypesdeliveriests)
  - [src\types\orders.ts](#file-srctypesordersts)
  - [src\types\payments.ts](#file-srctypespaymentsts)
  - [src\types\receivables.ts](#file-srctypesreceivablests)
  - [src\types\services.ts](#file-srctypesservicests)
  - [src\types\users.ts](#file-srctypesusersts)
  - [src\types\vouchers.ts](#file-srctypesvouchersts)

- [Components (src/components)](#components-srccomponents)
  - [src\components\ConfirmDialog.tsx](#file-srccomponentsconfirmdialogtsx)
  - [src\components\customers\CustomerPicker.tsx](#file-srccomponentscustomerscustomerpickertsx)
  - [src\components\DataTable.tsx](#file-srccomponentsdatatabletsx)
  - [src\components\delivery\AssignCourierSelect.tsx](#file-srccomponentsdeliveryassigncourierselecttsx)
  - [src\components\delivery\DeliveryStatusStepper.tsx](#file-srccomponentsdeliverydeliverystatussteppertsx)
  - [src\components\Dropzone.tsx](#file-srccomponentsdropzonetsx)
  - [src\components\FilterBar.tsx](#file-srccomponentsfilterbartsx)
  - [src\components\orders\OrderPhotos.tsx](#file-srccomponentsordersorderphotostsx)
  - [src\components\orders\OrderPhotosGallery.tsx](#file-srccomponentsordersorderphotosgallerytsx)
  - [src\components\orders\OrderPhotosUpload.tsx](#file-srccomponentsordersorderphotosuploadtsx)
  - [src\components\orders\OrderStatusStepper.tsx](#file-srccomponentsordersorderstatussteppertsx)
  - [src\components\pos\CartPanel.tsx](#file-srccomponentsposcartpaneltsx)
  - [src\components\pos\CheckoutDialog.tsx](#file-srccomponentsposcheckoutdialogtsx)
  - [src\components\pos\ProductSearch.tsx](#file-srccomponentsposproductsearchtsx)
  - [src\components\ReceiptPreview.tsx](#file-srccomponentsreceiptpreviewtsx)
  - [src\components\receivables\SettleReceivableDialog.tsx](#file-srccomponentsreceivablessettlereceivabledialogtsx)
  - [src\components\Toast.tsx](#file-srccomponentstoasttsx)

- [Pages (src/pages)](#pages-srcpages)
  - [src\pages\branches\BranchForm.tsx](#file-srcpagesbranchesbranchformtsx)
  - [src\pages\branches\BranchIndex.tsx](#file-srcpagesbranchesbranchindextsx)
  - [src\pages\branches\InvoiceSettings.tsx](#file-srcpagesbranchesinvoicesettingstsx)
  - [src\pages\customers\CustomerDetail.tsx](#file-srcpagescustomerscustomerdetailtsx)
  - [src\pages\customers\CustomersIndex.tsx](#file-srcpagescustomerscustomersindextsx)
  - [src\pages\deliveries\DeliveryDetail.tsx](#file-srcpagesdeliveriesdeliverydetailtsx)
  - [src\pages\deliveries\DeliveryIndex.tsx](#file-srcpagesdeliveriesdeliveryindextsx)
  - [src\pages\Login.tsx](#file-srcpageslogintsx)
  - [src\pages\orders\OrderDetail.tsx](#file-srcpagesordersorderdetailtsx)
  - [src\pages\orders\OrderReceipt.tsx](#file-srcpagesordersorderreceipttsx)
  - [src\pages\orders\OrdersIndex.tsx](#file-srcpagesordersordersindextsx)
  - [src\pages\pos\POSPage.tsx](#file-srcpagespospospagetsx)
  - [src\pages\receivables\ReceivablesIndex.tsx](#file-srcpagesreceivablesreceivablesindextsx)
  - [src\pages\services\CategoryIndex.tsx](#file-srcpagesservicescategoryindextsx)
  - [src\pages\services\PricePerBranchInput.tsx](#file-srcpagesservicespriceperbranchinputtsx)
  - [src\pages\services\ServiceForm.tsx](#file-srcpagesservicesserviceformtsx)
  - [src\pages\services\ServiceIndex.tsx](#file-srcpagesservicesserviceindextsx)
  - [src\pages\users\UserForm.tsx](#file-srcpagesusersuserformtsx)
  - [src\pages\users\UsersList.tsx](#file-srcpagesusersuserslisttsx)
  - [src\pages\vouchers\VoucherForm.tsx](#file-srcpagesvouchersvoucherformtsx)
  - [src\pages\vouchers\VouchersIndex.tsx](#file-srcpagesvouchersvouchersindextsx)

- [Pages (src/utils)](#pages-srcutils)
  - [src\utils\files.ts](#file-srcutilsfilests)
  - [src\utils\money.ts](#file-srcutilsmoneyts)
  - [src\utils\order-status.ts](#file-srcutilsorder-statusts)
  - [src\utils\wa.ts](#file-srcutilswats)

- [Entry Files](#entry-files)
  - [src\App.tsx](#file-srcapptsx)
  - [src\main.tsx](#file-srcmaintsx)



## API (src/api)

### src\api\branches.ts

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

### src\api\client.ts

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

### src\api\customers.ts

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

### src\api\deliveries.ts

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

### src\api\invoiceCounters.ts

- SHA: `227c44293a22`  
- Ukuran: 1 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
import { api } from './client';
import type { ApiEnvelope } from './client';
import type {
    InvoiceCounter, InvoiceCounterUpsertPayload, InvoiceCounterQuery, PaginationMeta,
} from '../types/branches';

export async function listInvoiceCounters(params: InvoiceCounterQuery = {}) {
    const { data } = await api.get<ApiEnvelope<InvoiceCounter[], PaginationMeta | null>>('/invoice-counters', { params });
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

```
</details>

### src\api\orderPhotos.ts

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

### src\api\orders.ts

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

### src\api\receivables.ts

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

### src\api\serviceCategories.ts

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

### src\api\servicePrices.ts

- SHA: `9be7e31c1cd8`  
- Ukuran: 1014 B
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
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

/** Helper: ambil harga efektif (override jika ada, selain itu fallback ke price_default) */
export async function getEffectivePrice(service: { id: string; price_default: number }, branch_id: string): Promise<number> {
  const res = await listServicePricesByService(service.id, branch_id);
  const row = (res.data ?? []).find((p) => p.branch_id === branch_id);
  return row ? Number(row.price) : Number(service.price_default);
}

```
</details>

### src\api\services.ts

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

### src\api\users.ts

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

### src\api\vouchers.ts

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

### src\store\useAuth.ts

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

### src\layouts\GuestLayout.tsx

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

### src\layouts\ProtectedLayout.tsx

- SHA: `ed232c872107`  
- Ukuran: 4 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/layouts/ProtectedLayout.tsx
import { Navigate, Outlet, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { useAuth, useHasRole } from '../store/useAuth';
import type { RoleName } from '../api/client';

export default function ProtectedLayout() {
    const me = useAuth.user;
    const location = useLocation();
    const nav = useNavigate();
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
        { label: 'Dashboard', to: '/', roles: ['Superadmin', 'Admin Cabang', 'Kasir', 'Petugas Cuci', 'Kurir'] },
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

    return (
        <div className="flex min-h-dvh">
            <aside className="w-64 border-r p-4 space-y-4">
                <div>
                    <div className="font-semibold">POS Salve</div>
                    <div className="text-xs text-gray-600">
                        {me.name}<br />{me.roles.join(', ')}
                    </div>
                </div>
                <nav className="space-y-1">
                    {MENU.filter((m) => (m.show ?? true) && (me.roles ?? []).some((r) => m.roles.includes(r)))
                        .map((m) => (
                            <NavLink
                                key={m.to}
                                to={m.to}
                                className={({ isActive }) =>
                                    `block rounded px-3 py-2 text-sm ${isActive ? 'bg-black text-white' : 'hover:bg-gray-100'}`
                                }
                            >
                                {m.label}
                            </NavLink>
                        ))}
                </nav>
                <button
                    onClick={async () => { await useAuth.logout(); nav('/login', { replace: true }); }}
                    className="rounded border px-3 py-2 text-sm"
                >
                    Logout
                </button>
            </aside>
            <section className="flex-1 p-6">
                <Outlet />
            </section>
        </div>
    );
}

/** Komponen guard untuk tombol/aksi dalam halaman */
export function RequireRole(props: { roles: RoleName[]; children: React.ReactNode; fallback?: React.ReactNode }) {
    const allowed = useHasRole(props.roles);
    if (!allowed) return (props.fallback ?? null);
    return <>{props.children}</>;
}
```
</details>



## router (src/reouter)

### src\router\Guarded.tsx

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

### src\router\index.tsx

- SHA: `49bb2ecee04c`  
- Ukuran: 12 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/router/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import GuestLayout from '../layouts/GuestLayout';
import ProtectedLayout from '../layouts/ProtectedLayout';
import LoginPage from '../pages/Login';
import { lazy, Suspense } from 'react';
import Guarded from './Guarded';
// import DashboardHome from '../pages/DashboardHome';

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
                element: <div className="text-sm text-gray-600">Dashboard</div>,
            },
            {
                path: '/customers',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <CustomersIndex />
                        </Suspense>
                    </Guarded>
                ),
            },
            {
                path: '/customers/:id',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <CustomerDetail />
                        </Suspense>
                    </Guarded>
                ),
            },
            {
                path: '/service-categories',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <CategoryIndex />
                        </Suspense>
                    </Guarded>
                )
            },
            {
                path: '/services',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <ServiceIndex />
                        </Suspense>
                    </Guarded>
                )
            },
            {
                path: '/services/new',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <ServiceForm />
                        </Suspense>
                    </Guarded>
                )
            },
            {
                path: '/services/:id/edit',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <ServiceForm />
                        </Suspense>
                    </Guarded>
                )
            },
            {
                path: '/users',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <UsersList />
                        </Suspense>
                    </Guarded>
                )
            },
            {
                path: '/users/new',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <UserForm />
                        </Suspense>
                    </Guarded>
                )
            },
            {
                path: '/users/:id/edit',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <UserForm />
                        </Suspense>
                    </Guarded>
                )
            },
            {
                path: '/branches',
                element: (
                    <Guarded roles={['Superadmin']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <BranchIndex />
                        </Suspense>
                    </Guarded>
                )
            },
            {
                path: '/branches/new',
                element: (
                    <Guarded roles={['Superadmin']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <BranchForm />
                        </Suspense>
                    </Guarded>
                )
            },
            {
                path: '/branches/:id/edit',
                element: (
                    <Guarded roles={['Superadmin']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <BranchForm />
                        </Suspense>
                    </Guarded>
                )
            },
            {
                path: '/branches/:id/invoice-settings',
                element: (
                    <Guarded roles={['Superadmin']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <InvoiceSettings />
                        </Suspense>
                    </Guarded>
                )
            },
            {
                path: '/pos',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <POSPage />
                        </Suspense>
                    </Guarded>
                ),
            },
            {
                path: '/orders',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <OrdersIndex />
                        </Suspense>
                    </Guarded>
                ),
            },
            {
                path: '/orders/:id',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <OrderDetail />
                        </Suspense>
                    </Guarded>
                ),
            },
            {
                path: '/orders/:id/receipt',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <OrderReceipt />
                        </Suspense>
                    </Guarded>
                ),
            },
            {
                path: '/deliveries',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir', 'Kurir']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <DeliveryIndex />
                        </Suspense>
                    </Guarded>
                )
            },
            {
                path: '/deliveries/:id',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir', 'Kurir']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <DeliveryDetail />
                        </Suspense>
                    </Guarded>
                )
            },
            {
                path: '/expenses',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang']}>
                        <div>Expenses (placeholder)</div>
                    </Guarded>
                )
            },
            {
                path: '/receivables',
                element: (
                    <Guarded roles={['Superadmin', 'Admin Cabang', 'Kasir']}>
                        <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                            <ReceivablesIndex />
                        </Suspense>
                    </Guarded>
                )
            },
            ...(import.meta.env.VITE_FEATURE_VOUCHER === 'true'
                ? [
                    {
                        path: '/vouchers',
                        element: (
                            <Guarded roles={['Superadmin', 'Admin Cabang']}>
                                <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                                    <VouchersIndex />
                                </Suspense>
                            </Guarded>
                        ),
                    },
                    {
                        path: '/vouchers/new',
                        element: (
                            <Guarded roles={['Superadmin', 'Admin Cabang']}>
                                <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                                    <VoucherForm />
                                </Suspense>
                            </Guarded>
                        ),
                    },
                    {
                        path: '/vouchers/:id/edit',
                        element: (
                            <Guarded roles={['Superadmin', 'Admin Cabang']}>
                                <Suspense fallback={<div className="text-sm text-gray-500">Memuat…</div>}>
                                    <VoucherForm />
                                </Suspense>
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

### src\types\branches.ts

- SHA: `217e8d700496`  
- Ukuran: 1 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
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
}

export interface InvoiceCounterQuery {
  branch_id?: string;
  page?: number;
  per_page?: number;
}

```
</details>

### src\types\customers.ts

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

### src\types\deliveries.ts

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

### src\types\orders.ts

- SHA: `7bb455ee5cab`  
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

### src\types\payments.ts

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

### src\types\receivables.ts

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

### src\types\services.ts

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

### src\types\users.ts

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

### src\types\vouchers.ts

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

### src\components\ConfirmDialog.tsx

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

### src\components\customers\CustomerPicker.tsx

- SHA: `b8fa7535e8e2`  
- Ukuran: 7 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
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

    const boxRef = useRef<HTMLDivElement | null>(null);
    const timerRef = useRef<number | null>(null);

    function isCustomerLite(u: unknown): u is CustomerLite {
        if (!u || typeof u !== "object") return false;
        const o = u as UnknownObj;
        return typeof o.id === "string" && typeof o.name === "string";
    }

    function extractRows(u: unknown): unknown[] {
        if (Array.isArray(u)) return u;
        if (u && typeof u === "object") {
            const o = u as UnknownObj;
            // bentuk umum: { data: [...] } atau { items: [...] } atau { data: { data: [...] } }
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
            return;
        }
        timerRef.current = window.setTimeout(async () => {
            setLoading(true);
            try {
                const res = await listCustomers({ q: query, per_page: 8 });

                // Normalisasi bentuk respons tanpa any
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
            } catch {
                setList([]);
                setOpen(false);
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

    function pick(c: CustomerLite) {
        setSelectedLabel(c.name);
        setQuery(c.name);
        onChange(c.id);
        setOpen(false);
    }

    function clearSelection() {
        setSelectedLabel("");
        setQuery("");
        onChange("");
        setList([]);
        setOpen(false);
    }

    const displayText = selectedLabel || query;

    return (
        <div className="relative" ref={boxRef}>
            <div className="flex items-center gap-2">
                <input
                    className="border rounded px-3 py-2 w-full"
                    value={displayText}
                    onChange={(e) => {
                        setSelectedLabel("");
                        onChange(""); // reset id saat user mulai mengetik lagi
                        setQuery(e.target.value);
                    }}
                    placeholder={placeholder}
                    onFocus={() => {
                        if (list.length > 0) setOpen(true);
                    }}
                />
                {value && (
                    <button
                        type="button"
                        className="text-xs border rounded px-2 py-1"
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
                <div className="absolute z-20 mt-1 w-full rounded border bg-white shadow">
                    {loading && <div className="px-3 py-2 text-sm opacity-70">Mencari…</div>}
                    {!loading && list.length === 0 && (
                        <div className="px-3 py-2 text-sm opacity-70">Tidak ada hasil</div>
                    )}
                    {!loading &&
                        list.map((c) => (
                            <button
                                key={c.id}
                                type="button"
                                className="w-full text-left px-3 py-2 hover:bg-gray-50"
                                onClick={() => pick(c)}
                            >
                                <div className="text-sm font-medium">{c.name}</div>
                                {(c.whatsapp || c.address) && (
                                    <div className="text-[11px] opacity-70">
                                        {c.whatsapp ? `WA: ${c.whatsapp}` : ""}
                                        {c.whatsapp && c.address ? " • " : ""}
                                        {c.address ? `${c.address}` : ""}
                                    </div>
                                )}
                            </button>
                        ))}
                </div>
            )}
        </div>
    );
}

```
</details>

### src\components\DataTable.tsx

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

### src\components\delivery\AssignCourierSelect.tsx

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

### src\components\delivery\DeliveryStatusStepper.tsx

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

### src\components\Dropzone.tsx

- SHA: `1ea7e5280ea4`  
- Ukuran: 51 B
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
export default function Dropzone() { return null; }
```
</details>

### src\components\FilterBar.tsx

- SHA: `3605319a8f83`  
- Ukuran: 52 B
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
export default function FilterBar() { return null; }
```
</details>

### src\components\orders\OrderPhotos.tsx

- SHA: `7a8dcb82fbd4`  
- Ukuran: 7 KB
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
        <div className="rounded-2xl border p-4">
            <div className="text-sm font-semibold mb-3">Order Photos</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <section className="border rounded-xl p-3">
                    <div className="text-xs font-medium mb-2">Before</div>

                    {/* PC: drag & drop; Mobile: tombol kamera */}
                    <div
                        className="border rounded-lg p-4 text-center text-xs"
                        onDragOver={e => e.preventDefault()}
                        onDrop={e => {
                            e.preventDefault();
                            const dropped = Array.from(e.dataTransfer.files || []);
                            setFiles(prev => ({ ...prev, before: [...prev.before, ...dropped] }));
                        }}
                    >
                        {isMobile ? (
                            <button
                                type="button"
                                className="px-3 py-2 rounded-lg border"
                                onClick={() => pick("before")}
                            >
                                Buka Kamera
                            </button>
                        ) : (
                            <>
                                <div className="mb-2">Drop file ke sini atau</div>
                                <button
                                    type="button"
                                    className="px-3 py-2 rounded-lg border"
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
                        // KUNCI untuk kamera HP:
                        // capture="environment" akan memicu kamera belakang di banyak mobile browser.
                        // Di desktop, ini diabaikan dan akan buka file chooser.
                        capture={isMobile ? "environment" : undefined}
                        multiple
                        className="hidden"
                        onChange={e => onChange("before", e.target.files)}
                    />

                    {/* Preview ringkas */}
                    {files.before.length > 0 && (
                        <ul className="mt-2 text-xs list-disc pl-5">
                            {files.before.map((f, i) => (
                                <li key={i}>{f.name}</li>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="border rounded-xl p-3">
                    <div className="text-xs font-medium mb-2">After</div>

                    <div
                        className="border rounded-lg p-4 text-center text-xs"
                        onDragOver={e => e.preventDefault()}
                        onDrop={e => {
                            e.preventDefault();
                            const dropped = Array.from(e.dataTransfer.files || []);
                            setFiles(prev => ({ ...prev, after: [...prev.after, ...dropped] }));
                        }}
                    >
                        {isMobile ? (
                            <button
                                type="button"
                                className="px-3 py-2 rounded-lg border"
                                onClick={() => pick("after")}
                            >
                                Buka Kamera
                            </button>
                        ) : (
                            <>
                                <div className="mb-2">Drop file ke sini atau</div>
                                <button
                                    type="button"
                                    className="px-3 py-2 rounded-lg border"
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
                        <ul className="mt-2 text-xs list-disc pl-5">
                            {files.after.map((f, i) => (
                                <li key={i}>{f.name}</li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>

            <div className="mt-3 flex gap-2">
                <button
                    type="button"
                    className="px-3 py-2 rounded-lg border"
                    onClick={onUpload}
                    disabled={busy || (files.before.length === 0 && files.after.length === 0)}
                >
                    {busy ? "Mengunggah..." : "Upload"}
                </button>
                <button
                    type="button"
                    className="px-3 py-2 rounded-lg border"
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

### src\components\orders\OrderPhotosGallery.tsx

- SHA: `65fde62d6968`  
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
            <div className="rounded-2xl border p-3">
                <div className="text-sm font-semibold mb-1">Order Photos</div>
                <div className="text-xs text-muted-foreground">Belum ada foto.</div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border p-3 space-y-4">
            <div className="text-sm font-semibold">Order Photos</div>
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
            <div className="text-xs font-medium mb-2">{label}</div>
            {!items.length ? (
                <div className="text-xs text-muted-foreground">-</div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {items.map(p => {
                        const url = fileUrl(p.path);
                        return (
                            <a key={p.id} href={url} target="_blank" rel="noopener noreferrer"
                                title={resolveCreatedAt(p)}
                                className="border rounded-lg overflow-hidden bg-muted/30">
                                <img
                                    src={url}
                                    alt={`${label} photo`}
                                    loading="lazy"
                                    className="w-full h-32 object-cover"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src =
                                            "data:image/svg+xml;utf8," +
                                            encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 140'><rect width='100%' height='100%' fill='#eee'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='10' fill='#999'>image not found</text></svg>");
                                    }}
                                />
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

### src\components\orders\OrderPhotosUpload.tsx

- SHA: `abd285ec6a67`  
- Ukuran: 5 KB
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
    <div className="rounded-2xl border p-4">
      <div className="text-sm font-semibold mb-3">Order Photos</div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <section className="border rounded-xl p-3">
          <div className="text-xs font-medium mb-2">Before</div>
          <div
            className="border rounded-lg p-4 text-center text-xs"
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault();
              const dropped = Array.from(e.dataTransfer.files || []);
              setFiles(prev => ({ ...prev, before: [...prev.before, ...dropped] }));
            }}
          >
            {isMobile ? (
              <button type="button" className="px-3 py-2 rounded-lg border" onClick={() => pick("before")}>
                Buka Kamera
              </button>
            ) : (
              <>
                <div className="mb-2">Drop file ke sini atau</div>
                <button type="button" className="px-3 py-2 rounded-lg border" onClick={() => pick("before")}>
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
            <ul className="mt-2 text-xs list-disc pl-5">
              {files.before.map((f, i) => <li key={i}>{f.name}</li>)}
            </ul>
          )}
        </section>

        <section className="border rounded-xl p-3">
          <div className="text-xs font-medium mb-2">After</div>
          <div
            className="border rounded-lg p-4 text-center text-xs"
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              e.preventDefault();
              const dropped = Array.from(e.dataTransfer.files || []);
              setFiles(prev => ({ ...prev, after: [...prev.after, ...dropped] }));
            }}
          >
            {isMobile ? (
              <button type="button" className="px-3 py-2 rounded-lg border" onClick={() => pick("after")}>
                Buka Kamera
              </button>
            ) : (
              <>
                <div className="mb-2">Drop file ke sini atau</div>
                <button type="button" className="px-3 py-2 rounded-lg border" onClick={() => pick("after")}>
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
            <ul className="mt-2 text-xs list-disc pl-5">
              {files.after.map((f, i) => <li key={i}>{f.name}</li>)}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className="px-3 py-2 rounded-lg border"
          onClick={onUpload}
          disabled={busy || (files.before.length === 0 && files.after.length === 0)}
        >
          {busy ? "Mengunggah..." : "Upload"}
        </button>
        <button
          type="button"
          className="px-3 py-2 rounded-lg border"
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

### src\components\orders\OrderStatusStepper.tsx

- SHA: `b53ef33ff2af`  
- Ukuran: 1004 B
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

  return (
    <div className="flex items-center gap-2 text-xs">
      {UI_FLOW.map((s, idx) => {
        const activeIdx = UI_FLOW.indexOf(current);
        const active = idx <= activeIdx;
        return (
          <React.Fragment key={s}>
            <div className={`px-2 py-1 rounded ${active ? 'bg-black text-white' : 'border'}`}>{s}</div>
            {idx < UI_FLOW.length - 1 && <div className="w-6 h-px bg-muted" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

```
</details>

### src\components\pos\CartPanel.tsx

- SHA: `59c5ea9a2040`  
- Ukuran: 3 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/components/pos/CartPanel.tsx
import { useMemo } from 'react';

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

export default function CartPanel({ items, onChangeQty, onChangeNote, onRemove }: Props): React.ReactElement {
    const subtotal = useMemo(
        () => items.reduce((s, it) => s + (it.price * it.qty), 0),
        [items]
    );

    return (
        <div className="rounded-2xl border p-3 space-y-2">
            <div className="text-sm font-semibold">Keranjang</div>
            {items.length === 0 && <div className="text-sm text-muted-foreground">Belum ada item</div>}

            {items.length > 0 && (
                <div className="space-y-2">
                    {items.map((it) => (
                        <div key={it.service_id} className="flex items-start gap-2 border-b pb-2">
                            <div className="flex-1">
                                <div className="font-medium">{it.name}</div>
                                <div className="text-xs text-muted-foreground">{it.unit}</div>
                                <div className="text-sm mt-1">{(it.price * it.qty).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</div>
                                <input
                                    className="mt-1 border rounded px-2 py-1 w-full"
                                    placeholder="Catatan item (opsional)"
                                    value={it.note ?? ''}
                                    onChange={(e) => onChangeNote(it.service_id, e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min={1}
                                    className="border rounded px-2 py-1 w-20"
                                    value={it.qty}
                                    onChange={(e) => onChangeQty(it.service_id, Math.max(1, Number(e.target.value)))}
                                />
                                <button className="text-xs underline" onClick={() => onRemove(it.service_id)}>Hapus</button>
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-between text-sm font-semibold">
                        <span>Subtotal</span>
                        <span>{subtotal.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

```
</details>

### src\components\pos\CheckoutDialog.tsx

- SHA: `0fccdb776dc4`  
- Ukuran: 10 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/components/pos/CheckoutDialog.tsx
import { useEffect, useMemo, useState } from "react";
import { createOrderPayment } from "../../api/orders";
import type { PaymentCreatePayload, PaymentMethod } from "../../types/payments";
import { applyVoucherToOrder } from "../../api/vouchers";
import type { Order } from "../../types/orders";
import { toIDR } from "../../utils/money";

type PayMode = 'PENDING' | PaymentMethod;

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

    useEffect(() => {
        if (!open) return;
        setMode('PENDING');
        setDpAmount(0);
        setPayAmount(due);
        setErr(null);
        setVoucherCode('');
        setApplyMsg(null);
        setApplyErr(null);
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
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                <div className="p-4 border-b">
                    <div className="text-lg font-semibold">Pembayaran</div>
                    <div className="text-xs text-gray-500">Tagihan: {toIDR(order.grand_total)} · Sudah bayar: {toIDR(order.paid_amount)} · Sisa: {toIDR(due)}</div>
                </div>

                <div className="p-4 space-y-3">
                    {/* Voucher apply */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Voucher</label>
                        <div className="flex items-center gap-2">
                            <input
                                className="w-full border rounded px-3 py-2 text-sm"
                                placeholder="MASUKKAN-KODE"
                                value={voucherCode}
                                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                            />
                            <button
                                type="button"
                                className="border rounded px-3 py-2 text-sm disabled:opacity-50"
                                disabled={applyLoading || voucherCode.trim().length === 0}
                                onClick={async () => {
                                    setApplyLoading(true);
                                    setApplyMsg(null);
                                    setApplyErr(null);
                                    try {
                                        const res = await applyVoucherToOrder(String(order.id), { code: voucherCode.trim().toUpperCase() });
                                        const updated = res.order as Order;
                                        onPaid(updated);
                                        const pot = typeof res.applied_amount === 'number' ? res.applied_amount : 0;
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
                    <label className="block text-sm font-medium">Mode</label>
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            type="button"
                            className={`border rounded px-3 py-2 ${mode === 'PENDING' ? 'bg-gray-900 text-white' : ''}`}
                            onClick={() => setMode('PENDING')}
                        >Pending</button>

                        <button
                            type="button"
                            className={`border rounded px-3 py-2 ${mode === 'DP' ? 'bg-gray-900 text-white' : ''}`}
                            onClick={() => setMode('DP')}
                        >DP</button>

                        {METHODS.map(m => (
                            <button
                                key={m}
                                type="button"
                                className={`border rounded px-3 py-2 ${mode === m ? 'bg-gray-900 text-white' : ''}`}
                                onClick={() => setMode(m)}
                            >{m}</button>
                        ))}
                    </div>

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
                                className="w-full border rounded px-3 py-2"
                            />
                            <div className="text-xs text-gray-500 mt-1">Maksimal {toIDR(due)}</div>
                        </div>
                    )}

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
                                className="w-full border rounded px-3 py-2"
                            />
                            <div className="text-xs text-gray-500 mt-1">Sisa tagihan: {toIDR(due)}</div>
                        </div>
                    )}

                    {err && <div className="text-sm text-red-600">{err}</div>}
                </div>

                <div className="p-4 border-t flex items-center justify-end gap-2">
                    <button type="button" className="px-3 py-2 border rounded" onClick={onClose} disabled={loading}>Batal</button>
                    <button
                        type="button"
                        className="px-3 py-2 border rounded bg-gray-900 text-white disabled:opacity-50"
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

### src\components\pos\ProductSearch.tsx

- SHA: `628d180f0602`  
- Ukuran: 3 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/components/pos/ProductSearch.tsx
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import type { Service } from '../../types/services';
import { listServices } from '../../api/services';
import { getEffectivePrice } from '../../api/servicePrices';
import { useAuth } from '../../store/useAuth';

type Props = {
    onPick: (row: Service & { price_effective: number }) => void;
};

export default function ProductSearch({ onPick }: Props): React.ReactElement {
    const user = useSyncExternalStore(useAuth.subscribe, () => useAuth.user);
    const branchId: string = user?.branch_id != null ? String(user.branch_id) : '';
    const [q, setQ] = useState('');
    const [rows, setRows] = useState<(Service & { price_effective: number })[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        setLoading(true); setError(null);
        try {
            const res = await listServices({ q, is_active: true, per_page: 10, page: 1 });
            const base = (res.data ?? []);
            const withPrice = await Promise.all(
                base.map(async (s) => ({
                    ...s,
                    price_effective: branchId ? await getEffectivePrice({ id: s.id, price_default: s.price_default }, branchId) : Number(s.price_default),
                }))
            );
            setRows(withPrice);
        } catch {
            setError('Gagal memuat layanan');
        } finally {
            setLoading(false);
        }
    }, [q, branchId]);

    useEffect(() => { void refresh(); }, [refresh]);

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <input
                    className="border rounded px-3 py-2 w-full"
                    placeholder="Cari layanan…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') void refresh(); }}
                />
                <button className="border rounded px-3 py-2" onClick={() => void refresh()}>Cari</button>
            </div>

            {loading && <div className="text-sm text-gray-500">Memuat…</div>}
            {error && <div className="text-sm text-red-600">{error}</div>}

            {!loading && !error && rows.length > 0 && (
                <div className="grid md:grid-cols-2 gap-2">
                    {rows.map((r) => (
                        <button
                            key={r.id}
                            className="border rounded p-3 text-left hover:bg-muted"
                            onClick={() => onPick(r)}
                        >
                            <div className="font-medium">{r.name}</div>
                            <div className="text-xs text-muted-foreground">{r.unit}</div>
                            <div className="text-sm mt-1">{r.price_effective.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</div>
                        </button>
                    ))}
                </div>
            )}

            {!loading && !error && rows.length === 0 && <div className="text-sm text-muted-foreground">Tidak ada hasil</div>}
        </div>
    );
}

```
</details>

### src\components\ReceiptPreview.tsx

- SHA: `476ee2223353`  
- Ukuran: 3 KB
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
};

export default function ReceiptPreview({
  html,
  height = "70vh",
  autoPrint = false,
  className = "",
  onLoaded,
  onPrint,
}: Props): React.ReactElement {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);

  // srcDoc bekerja di browser modern; fallback ke Blob URL kalau perlu
  const blobUrl = useMemo(() => {
    // kalau html kosong, tidak usah buat blob
    if (!html) return "";
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    return URL.createObjectURL(blob);
  }, [html]);

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
        const win = iframeRef.current?.contentWindow;
        win?.focus();
        win?.print();
      }, 50);
    }
  };

  const doPrint = () => {
    onPrint?.();
    const win = iframeRef.current?.contentWindow;
    win?.focus();
    win?.print();
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
          srcDoc={html}
          src={undefined /* mencegah warning React; kita set via srcDoc */}
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

### src\components\receivables\SettleReceivableDialog.tsx

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

### src\components\Toast.tsx

- SHA: `6a7bcbf0b950`  
- Ukuran: 102 B
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
export type ToastKind = 'success' | 'error' | 'info';
export default function Toast() { return null; }
```
</details>



## Pages (src/pages)

### src\pages\branches\BranchForm.tsx

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

### src\pages\branches\BranchIndex.tsx

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

### src\pages\branches\InvoiceSettings.tsx

- SHA: `92fbc8ed8cf7`  
- Ukuran: 8 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
import { useEffect, useMemo, useState, useCallback } from 'react';
import { listInvoiceCounters, createInvoiceCounter, updateInvoiceCounter, deleteInvoiceCounter } from '../../api/invoiceCounters';
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

    const [form, setForm] = useState<InvoiceCounterUpsertPayload>({
        branch_id: id!,
        prefix: '',
        reset_policy: 'monthly',
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
            setForm((f) => ({ ...f, prefix: (b.data as Branch).invoice_prefix, branch_id: id! }));
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
        try {
            await createInvoiceCounter(form);
            alert('Counter ditambahkan');
            await refresh();
        } catch {
            alert('Gagal menambah counter');
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
                                                const prefix = prompt('Prefix baru (max 8):', r.prefix) ?? r.prefix;
                                                if (!prefix || prefix.length > 8) { alert('Prefix tidak valid'); return; }
                                                try { await updateInvoiceCounter(r.id, { prefix }); await refresh(); } catch { alert('Gagal update'); }
                                            }}
                                        >
                                            Ubah Prefix
                                        </button>
                                        <button
                                            className="underline text-xs mr-2"
                                            onClick={async () => {
                                                const policy = (prompt('Reset policy (monthly/never):', r.reset_policy) ?? r.reset_policy) as ResetPolicy;
                                                if (!['monthly', 'never'].includes(policy)) { alert('Reset policy tidak valid'); return; }
                                                try { await updateInvoiceCounter(r.id, { reset_policy: policy }); await refresh(); } catch { alert('Gagal update'); }
                                            }}
                                        >
                                            Ubah Reset
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
                            onChange={(e) => setForm({ ...form, prefix: e.target.value.toUpperCase() })} />
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
                    <button className="rounded bg-black text-white px-3 py-2" disabled={!valid}>Tambah</button>
                </form>
                <p className="text-xs text-gray-500">
                    Kombinasi <code>branch_id + prefix</code> harus unik (lihat constraint DB). Sequence akan bertambah saat invoice dipakai.
                </p>
            </section>
        </div>
    );
}

```
</details>

### src\pages\customers\CustomerDetail.tsx

- SHA: `bed56e59faa3`  
- Ukuran: 10 KB
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
        return () => {
            cancelled = true;
        };
    }, [isNew, params.id]);

    function normalizeWa(input: string): string {
        // Minimal-normalize: hilangkan spasi dan non-digit ( dibiarkan kalau perlu)
        const s = (input || '').trim();
        // Contoh ringan: hilangkan spasi/tanda baca umum
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
                // SUSUN PAYLOAD MINIMAL & BERSIH — persis seperti contoh Postman
                const basePayload = {
                    name: form.name,
                    whatsapp: normalizeWa(form.whatsapp),
                    address: form.address,
                    notes: form.notes,
                };
                const cleanedBase = clean(basePayload);

                // HANYA superadmin boleh mengirim branch_id secara eksplisit
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
                    // Jangan kirim branch_id saat update kecuali superadmin memang mengubah cabang (kalau backendmu izinkan)
                    ...(hasRole('Superadmin') && form.branch_id && String(form.branch_id).trim() !== ''
                        ? { branch_id: String(form.branch_id).trim() }
                        : {}),
                });
                const payloadUpdate: Partial<CustomerUpsertPayload> = {
                    ...(cleanedUpdate.name !== undefined ? { name: String(cleanedUpdate.name) } : {}),
                    ...(cleanedUpdate.whatsapp !== undefined ? { whatsapp: String(cleanedUpdate.whatsapp) } : {}),
                    ...(cleanedUpdate.address !== undefined
                        ? { address: cleanedUpdate.address as string | null }
                        : {}),
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
            // tampilkan pesan server jika ada untuk memudahkan debug
            const anyErr = err as { response?: { data?: unknown }; message?: string };
            const srv = (anyErr.response?.data as { message?: string; errors?: unknown } | undefined) || undefined;
            const msg = srv?.message ?? (srv?.errors ? JSON.stringify(srv.errors) : undefined) ?? anyErr.message;
            setError(msg ?? 'Gagal menyimpan data pelanggan.');
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="p-4">Loading…</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-xl font-semibold">{isNew ? 'Buat Pelanggan' : 'Detail Pelanggan'}</h1>
            <form onSubmit={onSubmit} className="space-y-3 max-w-xl">
                {hasRole('Superadmin') && (
                    <input
                        placeholder="Branch ID (Superadmin)"
                        className="border rounded-xl px-3 py-2 w-full"
                        value={form.branch_id ?? ''}
                        onChange={(e) =>
                            setForm((f) => ({
                                ...f,
                                branch_id: e.target.value.trim() ? e.target.value.trim() : undefined,
                            }))
                        }
                    />
                )}
                <input
                    placeholder="Nama"
                    className="border rounded-xl px-3 py-2 w-full"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                />
                <input
                    placeholder="WhatsApp (08xxxxxxxxxx)"
                    className="border rounded-xl px-3 py-2 w-full"
                    value={form.whatsapp}
                    onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                    required
                />
                <input
                    placeholder="Alamat"
                    className="border rounded-xl px-3 py-2 w-full"
                    value={form.address ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                />
                <textarea
                    placeholder="Catatan"
                    className="border rounded-xl px-3 py-2 w-full"
                    value={form.notes ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
                {error && <div className="text-sm text-red-600">{error}</div>}
                <div className="flex gap-2">
                    <button
                        disabled={saving || !canEdit}
                        className="px-4 py-2 rounded-xl border shadow disabled:opacity-50"
                        type="submit"
                    >
                        {saving ? 'Menyimpan…' : 'Simpan'}
                    </button>
                    {!isNew && entity && (
                        <button
                            type="button"
                            className="px-4 py-2 rounded-xl border"
                            onClick={() => navigator.clipboard.writeText(entity.whatsapp)}
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

### src\pages\customers\CustomersIndex.tsx

- SHA: `c8d40334c515`  
- Ukuran: 6 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/customers/CustomersIndex.tsx
import { useEffect, useMemo, useState } from 'react';
import type { Customer, CustomerQuery, Paginated } from '../../types/customers';
import { listCustomers } from '../../api/customers';
import { useAuth, useHasRole } from '../../store/useAuth';
import { Link } from 'react-router-dom';

export default function CustomersIndex() {
    function useAuthSnapshot() {
        const store = useAuth;
        const [, force] = useState(0);
        useEffect(() => {
            // subscribe() mengembalikan function yg saat dipanggil return boolean.
            // Cleanup React wajib kembalikan void, jadi bungkus dulu.
            const unsubscribe = store.subscribe(() => force((x) => x + 1));
            return () => {
                // panggil, tapi JANGAN return nilai boolean-nya
                unsubscribe();
            };
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
        return () => {
            cancelled = true;
        };
    }, [query, search, branchIdForScope]);

    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Customers</h1>
                {canManage && (
                    <Link to="/customers/new" className="px-3 py-2 rounded-xl shadow border text-sm">New Customer</Link>
                )}
            </div>

            <div className="flex gap-2">
                <input
                    placeholder="Cari nama/WA/alamat…"
                    className="border rounded-xl px-3 py-2 w-full"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className="border rounded-xl px-3 py-2"
                    value={query.per_page ?? 10}
                    onChange={(e) => setQuery((q) => ({ ...q, per_page: Number(e.target.value), page: 1 }))}
                >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                </select>
            </div>

            {loading && <div className="animate-pulse text-sm text-gray-500">Loading…</div>}
            {error && <div className="text-sm text-red-600">{error}</div>}
            {!loading && !error && rows && rows.data.length === 0 && (
                <div className="text-sm text-gray-500">Belum ada data pelanggan.</div>
            )}

            {!loading && !error && rows && rows.data.length > 0 && (
                <div className="overflow-auto rounded-xl border">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left p-3">Nama</th>
                                <th className="text-left p-3">WhatsApp</th>
                                <th className="text-left p-3">Alamat</th>
                                <th className="text-left p-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.data.map((c) => (
                                <tr key={c.id} className="border-t">
                                    <td className="p-3">{c.name}</td>
                                    <td className="p-3">{c.whatsapp}</td>
                                    <td className="p-3">{c.address ?? '-'}</td>
                                    <td className="p-3">
                                        <Link to={`/customers/${String(c.id)}`} className="underline">Detail</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && rows && rows.meta.last_page > 1 && (
                <div className="flex items-center gap-2 justify-end">
                    <button
                        disabled={(rows.meta.current_page ?? 1) <= 1}
                        onClick={() => setQuery((q) => ({ ...q, page: (q.page ?? 1) - 1 }))}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="text-sm">
                        Page {rows.meta.current_page} / {rows.meta.last_page}
                    </span>
                    <button
                        disabled={rows.meta.current_page >= rows.meta.last_page}
                        onClick={() => setQuery((q) => ({ ...q, page: (q.page ?? 1) + 1 }))}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

```
</details>

### src\pages\deliveries\DeliveryDetail.tsx

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

### src\pages\deliveries\DeliveryIndex.tsx

- SHA: `d03dc5586fe3`  
- Ukuran: 7 KB
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

const STATUSES: DeliveryStatus[] = ['CREATED', 'ASSIGNED', 'PICKED_UP', 'ON_ROUTE', 'DELIVERED', 'FAILED', 'CANCELLED'];

/* eslint-disable no-console */
const TAG = '[DeliveryIndex]';
const dbg = {
  log: (...args: unknown[]) => { if (import.meta.env.DEV) console.log(TAG, ...args); },
  warn: (...args: unknown[]) => { if (import.meta.env.DEV) console.warn(TAG, ...args); },
  err:  (...args: unknown[]) => { if (import.meta.env.DEV) console.error(TAG, ...args); },
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

  const columns = useMemo(() => {
    dbg.log('columns memo recalculated');
    return [
      { key: 'id', header: 'ID' },
      {
        key: 'order_id', header: 'Order',
        render: (r: Delivery) => <Link className="underline" to={`/orders/${r.order_id}`}>{r.order_id}</Link>,
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
  }, [canAssign, canUpdate, onAssign, advance]);

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

### src\pages\Login.tsx

- SHA: `11145de7569b`  
- Ukuran: 2 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
import { useState } from 'react';
import type { FormEvent } from 'react';
import type { AxiosError } from 'axios';
import { useAuth, homePathByRole } from '../store/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LoginPage() {
    const nav = useNavigate();
    const loc = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: FormEvent) {
        e.preventDefault();
        setLoading(true); setError(null);
        try {
            const me = await useAuth.login({ email, password });
            // refresh /auth/me agar branch/roles pasti sesuai presentasi backend
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
        <form onSubmit={onSubmit} className="grid gap-3">
            <h1 className="text-xl font-semibold">Masuk</h1>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border rounded px-3 py-2" />
            <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border rounded px-3 py-2" />
            <button disabled={loading} className="rounded bg-black text-white px-3 py-2">
                {loading ? 'Memproses…' : 'Login'}
            </button>
        </form>
    );
}
```
</details>

### src\pages\orders\OrderDetail.tsx

- SHA: `ef1231b373be`  
- Ukuran: 12 KB
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
        <div className="space-y-3">
            {loading && <div className="text-sm text-gray-500">Memuat…</div>}
            {err && <div className="text-sm text-red-600">{err}</div>}
            {!loading && !row && !err && <div className="text-sm text-muted-foreground">Tidak ditemukan</div>}
            {row && (
                <>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-semibold">Order #{row.id}</div>
                            <div className="text-xs text-muted-foreground">{row.customer?.name ?? '-'}</div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Tombol buka struk di tab baru */}
                            <button
                                type="button"
                                className="px-3 py-1.5 text-xs border rounded"
                                onClick={() => openOrderReceipt(row.id)}             // GET /orders/{id}/receipt -> tab baru
                                title="Buka struk di tab baru"
                            >
                                Receipt
                            </button>

                            {/* Toggle preview di halaman */}
                            <button
                                type="button"
                                className="px-3 py-1.5 text-xs border rounded"
                                onClick={async () => {
                                    const next = !receiptOpen;
                                    setReceiptOpen(next);
                                    if (next && !receiptHtml) {
                                        await loadReceipt();
                                    }
                                }}
                                title="Tampilkan/ sembunyikan preview struk"
                            >
                                {receiptOpen ? 'Tutup Preview' : 'Preview Receipt'}
                            </button>

                            {/* Shortcut ke halaman Piutang (F10) bila masih ada sisa */}
                            {(row.due_amount ?? 0) > 0 && (
                                <button
                                    type="button"
                                    className="px-3 py-1.5 text-xs rounded bg-black text-white"
                                    onClick={() => navigate(`/receivables?q=${encodeURIComponent(row.invoice_no ?? '')}`)}
                                    title="Menuju halaman Piutang untuk pelunasan"
                                >
                                    Pelunasan
                                </button>
                            )}

                            <OrderStatusStepper backendStatus={row.status} />
                        </div>
                    </div>

                    <div className="rounded-2xl border p-3 overflow-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-2 text-left">Layanan</th>
                                    <th className="px-3 py-2 text-left">Qty</th>
                                    <th className="px-3 py-2 text-left">Harga</th>
                                    <th className="px-3 py-2 text-left">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(row.items ?? []).map((it) => (
                                    <tr key={it.id} className="border-t">
                                        <td className="px-3 py-2">{it.service?.name ?? it.service_id}</td>
                                        <td className="px-3 py-2">{it.qty}</td>
                                        <td className="px-3 py-2">{Number(it.price).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                                        <td className="px-3 py-2">{Number(it.total).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex justify-end gap-6 mt-3 text-sm">
                            <div><span className="text-muted-foreground">Subtotal</span> <b>{Number(row.subtotal).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</b></div>
                            <div><span className="text-muted-foreground">Diskon</span> <b>{Number(row.discount).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</b></div>
                            <div><span className="text-muted-foreground">Grand</span> <b>{Number(row.grand_total).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</b></div>
                            <div><span className="text-muted-foreground">Sisa</span> <b>{Number(row.due_amount).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</b></div>
                        </div>
                    </div>

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

                    {/* RECEIPT PREVIEW */}
                    {receiptOpen && (
                        <div className="rounded-2xl border">
                            <div className="flex items-center justify-between px-3 py-2 border-b">
                                <div className="text-sm font-semibold">Receipt Preview</div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        className="px-3 py-1.5 text-xs border rounded"
                                        onClick={loadReceipt}
                                        disabled={receiptLoading}
                                    >
                                        {receiptLoading ? 'Memuat…' : 'Reload'}
                                    </button>
                                    <button
                                        type="button"
                                        className="px-3 py-1.5 text-xs border rounded"
                                        onClick={() => openOrderReceipt(row.id, true)} // auto-print di tab baru (opsional)
                                        title="Buka & print"
                                    >
                                        Open & Print
                                    </button>
                                </div>
                            </div>

                            {receiptErr && <div className="p-3 text-xs text-red-600">{receiptErr}</div>}
                            {!receiptErr && receiptLoading && (
                                <div className="p-3 text-xs text-muted-foreground">Memuat struk…</div>
                            )}
                            {!receiptErr && !receiptLoading && !receiptHtml && (
                                <div className="p-3 text-xs text-muted-foreground">Belum ada HTML struk.</div>
                            )}
                            {!receiptErr && !!receiptHtml && (
                                <ReceiptPreview html={receiptHtml} height="70vh" />
                            )}
                        </div>
                    )}

                    <div className="rounded-2xl border p-3 flex flex-wrap gap-2">
                        {getAllowedNext(row.status).map((s) => (
                            <button
                                key={s}
                                className="border rounded px-2 py-1 text-xs"
                                onClick={() => void onTransit(s)}
                                title={`Set status ke ${s}`}
                            >
                                Set {s}
                            </button>
                        ))}

                        {getAllowedNext(row.status).length === 0 && (
                            <span className="text-xs text-muted-foreground">
                                Status terminal — tidak ada transisi.
                            </span>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

```
</details>

### src\pages\orders\OrderReceipt.tsx

- SHA: `9532cbdbe580`  
- Ukuran: 2 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderReceiptHtml, getOrder } from '../../api/orders';
import { buildWhatsAppLink } from '../../utils/wa';

export default function OrderReceipt(): React.ReactElement {
    const { id } = useParams<{ id: string }>();
    const [html, setHtml] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [waPhone, setWaPhone] = useState<string>('');

    useEffect(() => {
        (async () => {
            try {
                if (!id) return;
                const h = await getOrderReceiptHtml(id);
                setHtml(h);

                try {
                    const orderRes = await getOrder(id);
                    const wa = orderRes?.data?.customer?.whatsapp ?? '';
                    if (wa) setWaPhone(wa);
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

    if (loading) return <div className="p-4">Memuat struk…</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;

    const onPrint = () => window.print();
    const onSendWA = () => {
        const url = buildWhatsAppLink(waPhone, 'Halo, berikut struk transaksi Anda. Terima kasih 🙏');
        window.open(url, '_blank');
    };

    return (
        <div className="p-3 space-y-3">
            <div className="flex items-center gap-2 print:hidden">
                <button className="px-3 py-2 rounded border" onClick={onPrint}>Print</button>
                <input
                    type="tel"
                    placeholder="No. WA (62…/08…)"
                    value={waPhone}
                    onChange={(e) => setWaPhone(e.target.value)}
                    className="px-3 py-2 rounded border"
                />
                <button className="px-3 py-2 rounded bg-black text-white dark:bg-white dark:text-black" onClick={onSendWA} disabled={!waPhone}>
                    Kirim WhatsApp
                </button>
            </div>
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    );
}

```
</details>

### src\pages\orders\OrdersIndex.tsx

- SHA: `3741069e8269`  
- Ukuran: 6 KB
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
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          className="border rounded px-3 py-2"
          placeholder="Cari kode/nama/phone…"
          value={q}
          onChange={(e) => { dlog('q input', e.target.value); setQ(e.target.value); }}
        />
        <select
          className="border rounded px-3 py-2"
          value={status}
          onChange={(e) => { const v = e.target.value as OrderBackendStatus | ''; dlog('status select', v); setStatus(v); }}
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
        <button className="border rounded px-3 py-2" onClick={onApply}>Terapkan</button>
        <Link to="/pos" className="ml-auto rounded bg-black text-white px-3 py-2">Buat Transaksi</Link>
      </div>

      {loading && <div className="text-sm text-gray-500">Memuat…</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      {!loading && !error && rows.length === 0 && <div className="text-sm text-muted-foreground">Data kosong</div>}

      {rows.length > 0 && (
        <div className="overflow-auto rounded border">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Kode</th>
                <th className="px-3 py-2 text-left">Customer</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Total</th>
                <th className="px-3 py-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="px-3 py-2">{o.id}</td>
                  <td className="px-3 py-2">{o.customer?.name ?? '-'}</td>
                  <td className="px-3 py-2">{o.status}</td>
                  <td className="px-3 py-2">{Number(o.grand_total).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Link to={`/orders/${o.id}`} className="underline text-xs">Detail</Link>
                      <button
                        type="button"
                        className="text-xs border rounded px-2 py-1"
                        onClick={() => void onOpenReceipt(o.id)}
                        title="Lihat/Cetak struk"
                      >
                        Receipt
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {meta && meta.last_page > 1 && (
            <div className="flex items-center justify-end gap-2 p-2">
              <button disabled={page <= 1} className="border rounded px-2 py-1" onClick={onPrev}>Prev</button>
              <div className="text-xs">Page {meta.current_page} / {meta.last_page}</div>
              <button disabled={page >= meta.last_page} className="border rounded px-2 py-1" onClick={onNext}>Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

```
</details>

### src\pages\pos\POSPage.tsx

- SHA: `3d31976c9837`  
- Ukuran: 18 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
// src/pages/pos/POSPage.tsx
import { useEffect, useMemo, useState, useRef } from 'react';
import ProductSearch from '../../components/pos/ProductSearch';
import CartPanel, { type CartItem } from '../../components/pos/CartPanel';
import { createOrder } from '../../api/orders';
import type { OrderCreatePayload } from '../../types/orders';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/useAuth';
import type { RoleName } from '../../api/client';
import { createOrderPayment } from '../../api/orders';
import type { PaymentCreatePayload, PaymentMethod } from '../../types/payments';
import CustomerPicker from "../../components/customers/CustomerPicker";
import { uploadOrderPhotos } from "../../api/orderPhotos";
import { toIDR } from '../../utils/money';
import { getOrder } from '../../api/orders';
import { applyVoucherToOrder } from '../../api/vouchers';

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

export default function POSPage(): React.ReactElement {
  const nav = useNavigate();
  const { user, hasRole } = useAuth;
  const branchId = user?.branch_id ? String(user.branch_id) : '';
  const [items, setItems] = useState<CartItem[]>([]);
  const [customerId, setCustomerId] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const PAY_ROLES: RoleName[] = ['Superadmin', 'Admin Cabang', 'Kasir'];
  const canPay = hasRole(PAY_ROLES);

  const [beforeFiles, setBeforeFiles] = useState<File[]>([]);
  const [afterFiles, setAfterFiles] = useState<File[]>([]);
  const beforeRef = useRef<HTMLInputElement>(null);
  const afterRef = useRef<HTMLInputElement>(null);
  const isMobile = useMemo(() => /android|iphone|ipad|ipod/i.test(navigator.userAgent), []);

  type PayMode = 'PENDING' | 'DP' | 'FULL';
  const [mode, setMode] = useState<PayMode>('PENDING');
  const [method, setMethod] = useState<PaymentMethod>('CASH');
  const [dpAmount, setDpAmount] = useState<number>(0);
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [voucherMsg, setVoucherMsg] = useState<string | null>(null);

  const subtotal = useMemo(() => items.reduce((s, it) => s + (it.price * it.qty), 0), [items]);
  const total = useMemo(() => Math.max(0, subtotal - discount), [subtotal, discount]);
  const payableNow = useMemo(() => {
    if (mode === 'PENDING') return 0;
    if (mode === 'DP') return Math.max(0, Math.min(dpAmount, total));
    return total;
  }, [mode, dpAmount, total]);
  const grand = useMemo(() => Math.max(0, subtotal - (discount || 0)), [subtotal, discount]);
  const canSubmit = useMemo(() => {
    return items.length > 0 && !!customerId && !loading;
  }, [items.length, customerId, loading]);

  useEffect(() => { dlog('mount'); return () => dlog('unmount'); }, []);
  useEffect(() => { dlog('items changed', items); }, [items]);
  useEffect(() => { dlog('discount changed', discount); }, [discount]);
  useEffect(() => { dlog('notes changed', notes); }, [notes]);
  useEffect(() => { dlog('totals', { subtotal, grand }); }, [subtotal, grand]);

  function addItem(svc: { id: string; name: string; unit: string; price_effective: number }) {
    dlog('addItem clicked', svc);
    setItems((prev) => {
      const found = prev.find((p) => p.service_id === svc.id);
      if (found) {
        const next = prev.map((p) => p.service_id === svc.id ? { ...p, qty: p.qty + 1 } : p);
        dlog('increment qty', { service_id: svc.id, nextQty: (found.qty + 1) });
        return next;
      }
      const next = [...prev, { service_id: svc.id, name: svc.name, unit: svc.unit, price: svc.price_effective, qty: 1 }];
      dlog('push new cart item', next[next.length - 1]);
      return next;
    });
  }

  const onChangeQty = (id: string, qty: number) => {
    dlog('onChangeQty', { id, qty });
    setItems((prev) => prev.map((p) => p.service_id === id ? { ...p, qty } : p));
  };

  const onChangeNote = (id: string, note: string) => {
    dlog('onChangeNote', { id, note });
    setItems((prev) => prev.map((p) => p.service_id === id ? { ...p, note } : p));
  };

  const onRemove = (id: string) => {
    dlog('onRemove', { id });
    setItems((prev) => prev.filter((p) => p.service_id !== id));
  };

  async function onSubmit() {
    dlog('onSubmit start');
    if (items.length === 0) {
      setError('Keranjang kosong');
      dlog('onSubmit blocked: empty cart');
      return;
    }
    if (hasRole(['Kasir', 'Admin Cabang']) && !branchId) {
      setError('Akun Anda belum terikat ke cabang. Hubungi admin pusat.');
      dlog('onSubmit blocked: no branch_id for Kasir');
      return;
    }
    if (!customerId) {
      setError('Pelanggan wajib dipilih.');
      return;
    }
    if (mode === 'DP') {
      if (payableNow <= 0 || payableNow > total) {
        setError('Nominal DP tidak valid (≤ 0 atau melebihi grand total).');
        return;
      }
    }
    if (mode === 'FULL' && payableNow <= 0) {
      setError('Nominal pembayaran harus > 0 untuk mode FULL.');
      return;
    }

    setLoading(true); setError(null);
    try {
      const payload: OrderCreatePayload = {
        branch_id: branchId || undefined,
        customer_id: customerId,
        items: items.map((it) => ({
          service_id: it.service_id,
          qty: it.qty,
          note: it.note ?? null
        })),
        discount: discount || 0,
        notes: notes || null,
      };
      dlog('createOrder payload', payload);

      const res = await createOrder(payload);
      dlog('createOrder response', res);
      let order = res.data!;

      if (voucherCode.trim()) {
        try {
          setVoucherMsg(null);
          await applyVoucherToOrder(String(order.id), { code: voucherCode.trim().toUpperCase() });

          // Ambil ulang order agar total/discount sinkron dengan backend
          const refreshed = await getOrder(String(order.id));
          order = refreshed.data!;
          setVoucherMsg('Voucher berhasil diterapkan.');
        } catch (ex: unknown) {
          const ax = ex as HttpError;
          const msg = extractServerMessage(ax.response?.data)
            ?? (ax.response?.status === 422
              ? 'Voucher tidak valid / syarat tidak terpenuhi'
              : ax.response?.status === 404
                ? 'Kode voucher tidak ditemukan'
                : 'Gagal menerapkan voucher');
          setVoucherMsg(msg);
        }
      }

      const adjustedPayNow = Math.min(
        payableNow,
        Number((order)?.grand_total ?? payableNow)
      );

      if (canPay && mode !== 'PENDING') {
        const payPayload: PaymentCreatePayload =
          mode === 'DP'
            ? { method: 'DP', amount: adjustedPayNow, paid_at: new Date().toISOString() }
            : { method, amount: adjustedPayNow, paid_at: new Date().toISOString() };

        dlog('createOrderPayment payload', payPayload);
        const payRes = await createOrderPayment(order.id, payPayload);
        dlog('createOrderPayment response', payRes);
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

      alert('Transaksi tersimpan');
      dlog('navigate to receipt', { orderId: order.id });
      nav(`/orders/${order.id}/receipt`, { replace: true });
    } catch (e: unknown) {
      dlog('createOrder error', e);
      const ax = e as HttpError;
      if (ax.response?.status === 403) {
        const msg = extractServerMessage(ax.response.data)
          ?? 'Forbidden: Anda tidak diizinkan melakukan pembayaran untuk order ini.';
        setError(msg);
      } else if (ax.response?.status === 422) {
        // tampilkan pesan + rincian field dari server
        const data = ax.response.data as { message?: string; errors?: Record<string, string[]> } | undefined;
        const msg = data?.message ?? 'Validasi gagal (422)';
        console.error('[POSPage] 422 detail:', data?.errors);
        setError(msg);
      } else {
        const msg = (e as Error)?.message ?? 'Gagal menyimpan transaksi';
        setError(msg);
      }
    } finally {
      setLoading(false);
      dlog('onSubmit finally: loading=false');
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-3">
        <ProductSearch onPick={addItem} />
      </div>

      <div className="space-y-3">
        {/* Info cabang (read-only) agar kasir paham kontek transaksi */}
        <div className="rounded-2xl border p-3">
          <div className="text-xs text-muted-foreground">Cabang</div>
          <div className="text-sm font-semibold">{branchId || '-'}</div>
        </div>

        <CartPanel
          items={items}
          onChangeQty={onChangeQty}
          onChangeNote={onChangeNote}
          onRemove={onRemove}
        />

        {/* Order Photos */}
        <div className="rounded-2xl border p-3 space-y-3">
          <div className="text-sm font-semibold">Order Photos</div>
          <div className="grid gap-3 md:grid-cols-2">
            {/* BEFORE */}
            <div className="border rounded-xl p-3">
              <div className="text-xs font-medium mb-2">Before</div>
              <div
                className="border rounded-lg p-4 text-center text-xs"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const dropped = Array.from(e.dataTransfer.files || []);
                  setBeforeFiles(prev => [...prev, ...dropped]);
                }}
              >
                {isMobile ? (
                  <button type="button" className="px-3 py-2 rounded-lg border" onClick={() => beforeRef.current?.click()}>
                    Buka Kamera
                  </button>
                ) : (
                  <>
                    <div className="mb-2">Drop file ke sini atau</div>
                    <button type="button" className="px-3 py-2 rounded-lg border" onClick={() => beforeRef.current?.click()}>
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
                onChange={(e) => {
                  const list = e.target.files ? Array.from(e.target.files) : [];
                  setBeforeFiles(prev => [...prev, ...list]);
                }}
              />
              {beforeFiles.length > 0 && (
                <ul className="mt-2 text-xs list-disc pl-5">
                  {beforeFiles.map((f, i) => <li key={i}>{f.name}</li>)}
                </ul>
              )}
            </div>

            {/* AFTER */}
            <div className="border rounded-xl p-3">
              <div className="text-xs font-medium mb-2">After</div>
              <div
                className="border rounded-lg p-4 text-center text-xs"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const dropped = Array.from(e.dataTransfer.files || []);
                  setAfterFiles(prev => [...prev, ...dropped]);
                }}
              >
                {isMobile ? (
                  <button type="button" className="px-3 py-2 rounded-lg border" onClick={() => afterRef.current?.click()}>
                    Buka Kamera
                  </button>
                ) : (
                  <>
                    <div className="mb-2">Drop file ke sini atau</div>
                    <button type="button" className="px-3 py-2 rounded-lg border" onClick={() => afterRef.current?.click()}>
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
                onChange={(e) => {
                  const list = e.target.files ? Array.from(e.target.files) : [];
                  setAfterFiles(prev => [...prev, ...list]);
                }}
              />
              {afterFiles.length > 0 && (
                <ul className="mt-2 text-xs list-disc pl-5">
                  {afterFiles.map((f, i) => <li key={i}>{f.name}</li>)}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border p-3 space-y-2">
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
          {/* Voucher */}
          <div className="grid gap-1">
            <label className="text-xs">Kode Voucher</label>
            <div className="flex gap-2">
              <input
                className="border rounded px-3 py-2 flex-1"
                placeholder="MASUKKAN-KODE"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
              />
              <span className="text-[10px] text-gray-500 self-center">
                Voucher diterapkan saat “Simpan & Cetak”
              </span>
            </div>
            {voucherMsg && <div className="text-xs text-gray-600">{voucherMsg}</div>}
          </div>
          <div className="grid gap-1">
            <label className="text-xs">Diskon</label>
            <input
              type="number"
              min={0}
              className="border rounded px-3 py-2"
              value={discount}
              onChange={(e) => {
                const v = Number(e.target.value) || 0;
                dlog('discount input', v);
                setDiscount(v);
              }}
            />
          </div>
          <div className="grid gap-1">
            <label className="text-xs">Catatan</label>
            <textarea
              className="border rounded px-3 py-2"
              value={notes}
              onChange={(e) => { dlog('notes input', e.target.value); setNotes(e.target.value); }}
            />
          </div>

          <div className="flex justify-between text-sm pt-2">
            <span>Grand Total</span>
            <span className="font-semibold">{toIDR(grand)}</span>
          </div>

          {/* Pembayaran */}
          <div className="pt-2 space-y-2">
            <div className="text-xs font-medium">Mode Pembayaran</div>
            <div className="flex gap-2">
              {(['PENDING', 'DP', 'FULL'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-3 py-1 rounded border ${mode === m ? 'bg-black text-white dark:bg-white dark:text-black' : ''}`}
                >
                  {m}
                </button>
              ))}
            </div>

            {mode === 'FULL' && (
              <div>
                <div className="text-xs font-medium mb-1">Metode</div>
                {(['CASH', 'QRIS', 'TRANSFER'] as PaymentMethod[]).map(pm => (
                  <button
                    key={pm}
                    onClick={() => setMethod(pm)}
                    className={`mr-2 mb-2 px-3 py-1 rounded border ${method === pm ? 'bg-black text-white dark:bg-white dark:text-black' : ''}`}
                  >
                    {pm}
                  </button>
                ))}
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
                  className="border rounded px-3 py-2 w-full"
                  placeholder="Masukkan nominal DP"
                />
                <div className="text-xs mt-1">Dibayar sekarang: <b>{toIDR(payableNow)}</b></div>
              </div>
            )}
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex gap-2">
            <button
              disabled={loading || !canSubmit}   // <<< pakai canSubmit
              className="rounded bg-black text-white px-3 py-2 disabled:opacity-50"
              onClick={() => void onSubmit()}
            >
              {loading ? 'Menyimpan…' : 'Simpan & Cetak'}
            </button>

            <button
              type="button"
              className="rounded border px-3 py-2"
              onClick={() => { dlog('cancel/back clicked'); history.back(); }}
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

```
</details>

### src\pages\receivables\ReceivablesIndex.tsx

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

### src\pages\services\CategoryIndex.tsx

- SHA: `29d11020eb4d`  
- Ukuran: 4 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
import { useEffect, useState, useCallback } from 'react';
import DataTable from '../../components/DataTable';
import type { ServiceCategory, PaginationMeta } from '../../types/services';
import { listServiceCategories, createServiceCategory, updateServiceCategory, deleteServiceCategory } from '../../api/serviceCategories';

export default function CategoryIndex() {
    const [rows, setRows] = useState<ServiceCategory[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [q, setQ] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const perPage = 10;

    const refresh = useCallback(async (p = 1) => {
        setLoading(true); setError(null);
        try {
            const res = await listServiceCategories({ q, page: p, per_page: perPage });
            setRows(res.data ?? []);
            setMeta((res.meta as PaginationMeta) ?? null);
        } catch {
            setError('Gagal memuat kategori');
        } finally {
            setLoading(false);
        }
    }, [q, perPage]);

    useEffect(() => { void refresh(page); }, [page, refresh]);
    useEffect(() => {
        const t = setTimeout(() => { void refresh(1); setPage(1); }, 300);
        return () => clearTimeout(t);
    }, [q, refresh]);

    return (
        <div className="space-y-4">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold">Service Categories</h1>
                    <p className="text-xs text-gray-500">Kelola kategori untuk mengelompokkan layanan.</p>
                </div>
                <button
                    className="rounded border px-3 py-2 text-sm"
                    onClick={async () => {
                        const name = prompt('Nama kategori:')?.trim();
                        if (!name) return;
                        try { await createServiceCategory({ name, is_active: true }); await refresh(page); } catch { alert('Gagal membuat kategori'); }
                    }}
                >
                    New Category
                </button>
            </header>

            <div className="flex items-center gap-2">
                <input className="border rounded px-3 py-2 text-sm" placeholder="Cari nama…" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <DataTable<ServiceCategory>
                columns={[
                    { key: 'name', header: 'Nama' },
                    { key: 'is_active', header: 'Status', render: (r) => (r.is_active ? 'Active' : 'Inactive') },
                    {
                        key: 'actions', header: 'Aksi', render: (r) => (
                            <div className="flex gap-2">
                                <button className="underline text-xs" onClick={async () => {
                                    const name = prompt('Ubah nama kategori:', r.name)?.trim();
                                    if (!name) return;
                                    try { await updateServiceCategory(r.id, { name }); await refresh(page); } catch { alert('Gagal update'); }
                                }}>Edit</button>
                                <button className="underline text-xs text-red-600" onClick={async () => {
                                    if (!confirm(`Hapus kategori ${r.name}?`)) return;
                                    try { await deleteServiceCategory(r.id); await refresh(page); } catch { alert('Gagal hapus'); }
                                }}>Delete</button>
                            </div>
                        )
                    },
                ]}
                rows={rows}
                loading={loading}
                emptyText="Belum ada kategori"
            />

            <div className="flex items-center gap-2">
                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded border px-2 py-1 text-xs">Prev</button>
                <div className="text-xs text-gray-600">Hal {meta?.current_page ?? page} / {meta?.last_page ?? 1}</div>
                <button disabled={!!meta && page >= (meta.last_page ?? 1)} onClick={() => setPage((p) => p + 1)} className="rounded border px-2 py-1 text-xs">Next</button>
            </div>
        </div>
    );
}

```
</details>

### src\pages\services\PricePerBranchInput.tsx

- SHA: `f3e11cfefab2`  
- Ukuran: 5 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
import { useEffect, useRef, useState } from 'react';
import type { Branch } from '../../types/branches';
import type { ServicePrice, ServicePriceSetPayload } from '../../types/services';
import { listBranches } from '../../api/branches';
import { listServicePricesByService, setServicePrice } from '../../api/servicePrices';

interface Props {
    serviceId: string;
    defaultPrice: number;
}
type Row = Branch & { override?: ServicePrice | null; effective: number; };

export default function PricePerBranchInput({ serviceId, defaultPrice }: Props) {
    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    useEffect(() => {
        (async () => {
            setLoading(true); setError(null);
            try {
                const branches = await listBranches({ per_page: 100 });
                const overrides = await listServicePricesByService(serviceId);
                const map = new Map((overrides.data ?? []).map((p) => [p.branch_id, p]));
                const merged: Row[] = (branches.data ?? []).map((b) => {
                    const ov = map.get(b.id) ?? null;
                    return { ...b, override: ov, effective: ov ? Number(ov.price) : Number(defaultPrice) };
                });
                setRows(merged);
            } catch {
                setError('Gagal memuat harga per cabang');
            } finally {
                setLoading(false);
            }
        })();
    }, [serviceId, defaultPrice]);

    async function onSaveOne(branch_id: string, price: number) {
        const payload: ServicePriceSetPayload = { service_id: serviceId, branch_id, price };
        try {
            await setServicePrice(payload);
            // refresh baris lokal
            setRows((prev) => prev.map((r) => r.id === branch_id ? { ...r, override: { id: r.override?.id ?? 'tmp', service_id: serviceId, branch_id, price } as ServicePrice, effective: price } : r));
            alert('Harga cabang diperbarui');
        } catch {
            alert('Gagal menyimpan harga cabang');
        }
    }

    if (loading) return <div className="text-sm text-gray-500">Memuat harga cabang…</div>;
    if (error) return <div className="text-sm text-red-600">{error}</div>;
    if (!rows.length) return <div className="text-sm text-gray-500">Belum ada cabang</div>;

    return (
        <div className="overflow-auto rounded border">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-3 py-2 text-left">Cabang</th>
                        <th className="px-3 py-2 text-left">Harga Efektif</th>
                        <th className="px-3 py-2 text-left">Override</th>
                        <th className="px-3 py-2 text-left">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r) => (
                        <tr key={r.id} className="border-t">
                            <td className="px-3 py-2">{r.code} — {r.name}</td>
                            <td className="px-3 py-2">{r.effective.toLocaleString('id-ID')}</td>
                            <td className="px-3 py-2">
                                <input
                                    type="number"
                                    min={0}
                                    step="100"
                                    className="border rounded px-2 py-1 w-36"
                                    defaultValue={r.override?.price ?? ''}
                                    placeholder={`Default ${defaultPrice}`}
                                    ref={(el) => { inputRefs.current[r.id] = el; }}
                                />
                            </td>
                            <td className="px-3 py-2">
                                <button
                                    className="underline text-xs"
                                    onClick={() => {
                                        const val = Number(inputRefs.current[r.id]?.value ?? NaN);
                                        if (!Number.isFinite(val) || val <= 0) { alert('Harga tidak valid'); return; }
                                        void onSaveOne(r.id, val);
                                    }}
                                >
                                    Simpan
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

```
</details>

### src\pages\services\ServiceForm.tsx

- SHA: `796b9554cd71`  
- Ukuran: 6 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
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
            setLoading(true); setError(null);
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
        setLoading(true); setError(null); setFieldErrors({});
        if (!form.category_id || !form.name.trim() || !form.unit.trim() || Number(form.price_default) <= 0) {
            setLoading(false); setError('Kategori, Nama, Unit, dan Harga Default wajib diisi'); return;
        }
        try {
            if (editing) await updateService(id!, form);
            else await createService(form);
            alert('Tersimpan'); nav('/services', { replace: true });
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
            <form className="max-w-xl space-y-3" onSubmit={onSubmit}>
                <h1 className="text-lg font-semibold">{editing ? 'Edit Service' : 'New Service'}</h1>
                {error && <div className="text-sm text-red-600">{error}</div>}

                <div className="grid gap-1">
                    <label className="text-xs">Kategori *</label>
                    <select className="border rounded px-3 py-2" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                        <option value="">Pilih kategori</option>
                        {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    {fieldErrors.category_id && <p className="text-xs text-red-600">{fieldErrors.category_id.join(', ')}</p>}
                </div>

                <div className="grid gap-1">
                    <label className="text-xs">Nama *</label>
                    <input className="border rounded px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    {fieldErrors.name && <p className="text-xs text-red-600">{fieldErrors.name.join(', ')}</p>}
                </div>

                <div className="grid gap-1">
                    <label className="text-xs">Unit *</label>
                    <input className="border rounded px-3 py-2" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value.toUpperCase() })} />
                    {fieldErrors.unit && <p className="text-xs text-red-600">{fieldErrors.unit.join(', ')}</p>}
                </div>

                <div className="grid gap-1">
                    <label className="text-xs">Harga Default *</label>
                    <input type="number" min={0} step="100" className="border rounded px-3 py-2" value={form.price_default}
                        onChange={(e) => setForm({ ...form, price_default: Number(e.target.value) })} />
                    {fieldErrors.price_default && <p className="text-xs text-red-600">{fieldErrors.price_default.join(', ')}</p>}
                </div>

                <div className="flex items-center gap-2">
                    <input id="is_active" type="checkbox" checked={!!form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                    <label htmlFor="is_active" className="text-sm">Active</label>
                </div>

                <div className="flex gap-2">
                    <button disabled={loading} className="rounded bg-black text-white px-3 py-2">{loading ? 'Menyimpan…' : 'Simpan'}</button>
                    <button type="button" className="rounded border px-3 py-2" onClick={() => history.back()}>Batal</button>
                </div>
            </form>

            {/* Harga per cabang (override) — tampil saat edit atau saat new sudah tersimpan */}
            {editing && service && (
                <section className="max-w-3xl space-y-2">
                    <h2 className="font-medium">Harga per Cabang</h2>
                    <p className="text-xs text-gray-500">
                        Harga efektif = override `service_prices` per cabang, jika tidak ada → pakai `price_default`.
                    </p>
                    <PricePerBranchInput serviceId={service.id} defaultPrice={Number(service.price_default)} />
                </section>
            )}
        </div>
    );
}

```
</details>

### src\pages\services\ServiceIndex.tsx

- SHA: `ae6636c59a1e`  
- Ukuran: 5 KB
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
import { useEffect, useState, useCallback } from 'react';
import DataTable from '../../components/DataTable';
import type { Service, PaginationMeta, ServiceCategory } from '../../types/services';
import { listServices, deleteService } from '../../api/services';
import { listServiceCategories } from '../../api/serviceCategories';
import { useNavigate, Link } from 'react-router-dom';

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

    const refresh = useCallback(async (p = 1) => {
        setLoading(true); setError(null);
        try {
            const res = await listServices({
                q,
                category_id: category_id || undefined,
                page: p,
                per_page: perPage
            });
            setRows(res.data ?? []);
            setMeta((res.meta as PaginationMeta) ?? null);
        } catch {
            setError('Gagal memuat layanan');
        } finally {
            setLoading(false);
        }
    }, [q, category_id, perPage]);

    useEffect(() => { if (!cats.length) void loadCats(); }, [cats.length, loadCats]);
    useEffect(() => { void refresh(page); }, [page, refresh]);
    useEffect(() => {
        const t = setTimeout(() => { void refresh(1); setPage(1); }, 300);
        return () => clearTimeout(t);
    }, [q, category_id, refresh]);

    return (
        <div className="space-y-4">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold">Services</h1>
                    <p className="text-xs text-gray-500">Kelola layanan & harga per cabang.</p>
                </div>
                <div className="space-x-2">
                    <Link to="/service-categories" className="rounded border px-3 py-2 text-sm">Categories</Link>
                    <button className="rounded border px-3 py-2 text-sm" onClick={() => nav('/services/new')}>New Service</button>
                </div>
            </header>

            <div className="flex flex-wrap items-center gap-2">
                <input className="border rounded px-3 py-2 text-sm" placeholder="Cari nama…" value={q} onChange={(e) => setQ(e.target.value)} />
                <select className="border rounded px-3 py-2 text-sm" value={category_id} onChange={(e) => setCategoryId(e.target.value)}>
                    <option value="">Semua kategori</option>
                    {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <DataTable<Service>
                columns={[
                    { key: 'name', header: 'Nama' },
                    { key: 'category', header: 'Kategori', render: (s) => s.category?.name ?? '-' },
                    { key: 'unit', header: 'Unit' },
                    { key: 'price_default', header: 'Harga Default', render: (s) => Number(s.price_default).toLocaleString('id-ID') },
                    { key: 'is_active', header: 'Status', render: (s) => s.is_active ? 'Active' : 'Inactive' },
                    {
                        key: 'actions', header: 'Aksi', render: (s) => (
                            <div className="flex gap-2">
                                <button className="underline text-xs" onClick={() => nav(`/services/${s.id}/edit`)}>Edit</button>
                                <button className="underline text-xs text-red-600" onClick={async () => {
                                    if (!confirm(`Hapus layanan ${s.name}?`)) return;
                                    try { await deleteService(s.id); await refresh(page); } catch { alert('Gagal hapus'); }
                                }}>Delete</button>
                            </div>
                        )
                    },
                ]}
                rows={rows}
                loading={loading}
                emptyText="Belum ada layanan"
            />

            <div className="flex items-center gap-2">
                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded border px-2 py-1 text-xs">Prev</button>
                <div className="text-xs text-gray-600">Hal {meta?.current_page ?? page} / {meta?.last_page ?? 1}</div>
                <button disabled={!!meta && page >= (meta.last_page ?? 1)} onClick={() => setPage((p) => p + 1)} className="rounded border px-2 py-1 text-xs">Next</button>
            </div>
        </div>
    );
}

```
</details>

### src\pages\users\UserForm.tsx

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

### src\pages\users\UsersList.tsx

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

### src\pages\vouchers\VoucherForm.tsx

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

### src\pages\vouchers\VouchersIndex.tsx

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

### src\utils\files.ts

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

### src\utils\money.ts

- SHA: `9de3e1039356`  
- Ukuran: 169 B
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```ts
export function toIDR(n: number): string {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n ?? 0);
}

```
</details>

### src\utils\order-status.ts

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

### src\utils\wa.ts

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

### src\App.tsx

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

### src\main.tsx

- SHA: `4d4e93b6e5e1`  
- Ukuran: 233 B
<details><summary><strong>Lihat Kode Lengkap</strong></summary>

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

```
</details>
