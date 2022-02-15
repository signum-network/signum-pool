import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    getSystemTheme,
    themeModeAction,
} from "../../app/utils/functions/systemTheme";

export interface AppState {
    themeMode: themeModeAction;
}

const initialState: AppState = {
    themeMode: getSystemTheme(),
};

export const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<themeModeAction>) => {
            state.themeMode = action.payload;
        },
    },
});

export const { actions } = appSlice;
