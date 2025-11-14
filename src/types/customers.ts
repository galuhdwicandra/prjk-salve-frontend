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
