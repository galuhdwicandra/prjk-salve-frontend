export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}


export interface ServiceCategory {
  id: string;
  name: string;
  is_active: boolean;
  services_count?: number;
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

export interface Service {
  id: string;
  category_id: string;
  parent_id: string | null;
  name: string;
  unit: string;
  price_default: number;
  is_active: boolean;
  category?: ServiceCategory;
  variants?: Service[];
  prices?: ServicePrice[];
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ServiceUpsertPayload {
  category_id: string;
  parent_id: string | null;
  name: string;
  unit: string;
  price_default: number;
  is_active?: boolean;
}

export interface ServiceQuery {
  q?: string;
  category_id?: string;
  branch_id?: string;
  is_active?: boolean;
  tree?: boolean;
  leaf?: boolean;
  root?: boolean;
  page?: number;
  per_page?: number;
}

export interface ServicePrice {
  id: string;
  service_id: string;
  branch_id: string;
  price: number;
  sla_days: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ServicePriceSetPayload {
  service_id: string;
  branch_id: string;
  price: number;
  sla_days?: number | null;
}
