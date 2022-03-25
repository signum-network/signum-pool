import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    getSystemTheme,
    themeModeAction,
} from "../../app/utils/functions/systemTheme";

export interface AppState {
    themeMode: themeModeAction;
    isOpenLanguageDialog: boolean;
    isOpenSidebar: boolean;
}

const initialState: AppState = {
    themeMode: getSystemTheme(),
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
        setIsOpenLanguageDialog: (state, action: PayloadAction<boolean>) => {
            state.isOpenLanguageDialog = action.payload;
        },
        setIsOpenSidebar: (state, action: PayloadAction<boolean>) => {
            state.isOpenSidebar = action.payload;
        },
    },
});

export const { actions } = appSlice;
