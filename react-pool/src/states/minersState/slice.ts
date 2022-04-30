import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type miner = {
    accountId: string;
    name?: string;
    pendingBalance: string;
    physicalCapacity: number;
    effectiveCapacity: number;
    sharedCapacity: number;
    shareModel: number;
    donationPercent: number;
    totalCommitment: string;
    commitmentPerTiB: string;
    pocBoost?: number;
    pocBostPool?: number;
    confirmedDeadlines: number;
    currentRoundBestDeadline: string;
    poolShare: number;
    minimumPayout: string;
    minerAgent?: string;
};

export interface minersState {
    isLoading: boolean;
    miners: miner[];
    totalPhysicalCapacity: number;
    totalSharedCapacity: number;
    totalEffectiveCapacity: number;
}

const initialState: minersState = {
    isLoading: true,
    miners: [],
    totalPhysicalCapacity: 0,
    totalSharedCapacity: 0,
    totalEffectiveCapacity: 0,
};

export const minersSlice = createSlice({
    name: "miners",
    initialState,
    reducers: {
        setMinersData: (state, action: PayloadAction<minersState>) => {
            return action.payload;
        },
    },
});

export const { actions } = minersSlice;
