import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface poolConfigState {
    isLoading: boolean;
    poolAccount: string;
    blocksForAverage: number;
    blocksToShowAMiner: number;
    maxDeadline: number;
    processLag: number;
    graceDeadlines: number;
    feeRecipient: string;
    poolFeePercentage: number;
    poolSoloFeePercentage: number;
    donationRecipient: string;
    donationPercent: number;
    defaultPoolShare: number;
    defaultMinimumPayout: number;
    minimumPayoutAllowed: number;
    minimumPayoutsPerTransaction: number;
    poolPayoutTransactionFee: string;
    version: string;
}

const initialState: poolConfigState = {
    isLoading: true,
    poolAccount: "",
    blocksForAverage: 0,
    blocksToShowAMiner: 0,
    maxDeadline: 0,
    processLag: 0,
    graceDeadlines: 0,
    feeRecipient: "",
    poolFeePercentage: 0,
    poolSoloFeePercentage: 0,
    donationRecipient: "",
    donationPercent: 0,
    defaultPoolShare: 0,
    defaultMinimumPayout: 0,
    minimumPayoutAllowed: 0,
    minimumPayoutsPerTransaction: 0,
    poolPayoutTransactionFee: "",
    version: "",
};

export const poolConfigSlice = createSlice({
    name: "poolConfig",
    initialState,
    reducers: {
        setPoolConfigData: (state, action: PayloadAction<poolConfigState>) => {
            return action.payload;
        },
    },
});

export const { actions } = poolConfigSlice;
