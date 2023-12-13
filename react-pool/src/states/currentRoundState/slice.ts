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
    difficulty: string;
};

export interface currentRoundState {
    isLoading: boolean;
    roundStart: number;
    bestDeadline: bestDeadline;
    networkInfo: networkInfo;
}

const initialState: currentRoundState = {
    isLoading: true,
    roundStart: 0,
    bestDeadline: { miner: "", deadline: 0 },
    networkInfo: {
        baseTarget: 0,
        blockHeight: 0,
        averageCommitmentNQT: 0,
        timestamp: 0,
        difficulty: "",
    },
};

export const currentRoundSlice = createSlice({
    name: "currentRound",
    initialState,
    reducers: {
        setCurrentRoundData: (
            _state,
            action: PayloadAction<currentRoundState>
        ) => {
            return action.payload;
        },
    },
});

export const { actions } = currentRoundSlice;
