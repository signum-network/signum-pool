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
    reducers: {},
});

export const { actions } = signumSlice;
