export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface ContactCategory {
  id: string;
  name: string;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Contact {
  id: string;
  code: string | null;
  name: string;
  phone: string | null;
  address: string | null;
  is_active: boolean;
  categories?: ContactCategory[];
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ContactUpsertPayload {
  name: string;
  phone?: string | null;
  address?: string | null;
  is_active?: boolean;
  category_ids?: string[];
}

export interface ContactQuery {
  q?: string;
  is_active?: boolean;
  category_id?: string;
  sort_by?: 'name' | 'phone' | 'code' | 'address';
  sort_dir?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export interface ContactCategoryUpsertPayload {
  name: string;
}
