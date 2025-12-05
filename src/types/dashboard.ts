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
