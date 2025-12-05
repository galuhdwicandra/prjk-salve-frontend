// src/types/loyalty.ts
export interface LoyaltySummary {
  stamps: number;   // 0..9
  cycle: number;    // 10
  next: number;     // 1..10
}
