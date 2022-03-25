import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface signumState {
    loading: boolean;
    price: number;
}

const initialState: signumState = {
    loading: true,
    price: 0,
};

export const signumSlice = createSlice({
    name: "signum",
    initialState,
    reducers: {},
});

export const { actions } = signumSlice;
