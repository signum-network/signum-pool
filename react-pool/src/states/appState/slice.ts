import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    getSystemTheme,
    themeModeAction,
} from "../../app/utils/functions/systemTheme";

export type SnackBarState = {
    label: string;
    severity: "" | "error" | "warning" | "info" | "success";
};

export interface AppState {
    themeMode: themeModeAction;
    snackBar: SnackBarState;
    isOpenLanguageDialog: boolean;
    isOpenSidebar: boolean;
}

const initialState: AppState = {
    themeMode: getSystemTheme(),
    snackBar: { label: "", severity: "" },
    isOpenLanguageDialog: false,
    isOpenSidebar: false,
};

export const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<themeModeAction>) => {
            state.themeMode = action.payload;
        },
        setSnackbar: (state, action: PayloadAction<SnackBarState>) => {
            state.snackBar = action.payload;
        },
        setIsOpenLanguageDialog: (state, action: PayloadAction<boolean>) => {
            state.isOpenLanguageDialog = action.payload;
        },
        setIsOpenSidebar: (state, action: PayloadAction<boolean>) => {
            state.isOpenSidebar = action.payload;
        },
    },
});

export const { actions } = appSlice;
