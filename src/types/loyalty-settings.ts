export type LoyaltyRewardDiscount = {
    on: boolean;
    mode: 'rp' | 'pct';
    amount: number;
    basis: 'before' | 'after';
};

export type LoyaltyReward = {
    at: number;
    free: { on: boolean; products: string[] };
    disc: LoyaltyRewardDiscount;
};

export type LoyaltySetting = {
    id: string;
    branch_id: string | null;
    target: number;
    stamp_per: 'transaksi' | 'kunjungan';
    rewards: LoyaltyReward[] | null;
};

export type LoyaltySettingPayload = {
    target: number;
    stamp_per: 'transaksi' | 'kunjungan';
    rewards: LoyaltyReward[];
};
