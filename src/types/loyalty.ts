// src/types/loyalty.ts
export interface LoyaltySummary {
  stamps: number;
  cycle: number;
  next: number;
}

export interface LoyaltyHistoryItem {
  id: string;
  order_id?: string | null;
  customer_id: string;
  branch_id: string;
  action: string;
  note?: string | null;
  before: number;
  after: number;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface LoyaltyHistoryMeta {
  current_page: number;
  last_page: number;
}

export type LoyaltyManualAdjustType = 'add' | 'subtract' | 'set';

export interface LoyaltyManualAdjustPayload {
  type: LoyaltyManualAdjustType;
  amount: number;
  note?: string | null;
  branch_id?: string;
}