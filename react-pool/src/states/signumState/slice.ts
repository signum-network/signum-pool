import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface signumState {
    isLoading: boolean;
    price: number;
}

const initialState: signumState = {
    isLoading: true,
    price: 0,
};

export const signumSlice = createSlice({
    name: "signum",
    initialState,
    reducers: {
        setSignumData: (_state, action: PayloadAction<signumState>) => {
            return action.payload;
        },
    },
});

export const { actions } = signumSlice;
