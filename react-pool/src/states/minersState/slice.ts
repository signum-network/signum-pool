import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type miner = {
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
    pocBoost: number;
    pocBostPool: number;
    confirmedDeadlines: number;
    currentRoundBestDeadline: string;
    poolShare: number;
    minimumPayout: string;
    minerAgent?: string;
};

interface minersState {
    loading: boolean;
    miners: miner[];
}

const initialState: minersState = {
    loading: true,
    miners: [],
};

export const minersSlice = createSlice({
    name: "miners",
    initialState,
    reducers: {
        setMinersData: (state, action: PayloadAction<minersState>) => {
            state = action.payload;
        },
    },
});

export const { actions } = minersSlice;
