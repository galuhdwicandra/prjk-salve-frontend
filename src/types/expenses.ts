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
