import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type bestDeadline = {
    miner: string;
    deadline: number;
};

type networkInfo = {
    baseTarget: number;
    blockHeight: number;
    averageCommitmentNQT: number;
    timestamp: number;
};

export interface currentRoundState {
    loading: boolean;
    roundStart: number;
    bestDeadline: bestDeadline;
    networkInfo: networkInfo;
}

const initialState: currentRoundState = {
    loading: true,
    roundStart: 0,
    bestDeadline: { miner: "", deadline: 0 },
    networkInfo: {
        baseTarget: 0,
        blockHeight: 0,
        averageCommitmentNQT: 0,
        timestamp: 0,
    },
};

export const currentRoundSlice = createSlice({
    name: "currentRound",
    initialState,
    reducers: {
        setCurrentRoundData: (
            state,
            action: PayloadAction<currentRoundState>
        ) => {
            state = action.payload;
        },
    },
});

export const { actions } = currentRoundSlice;
