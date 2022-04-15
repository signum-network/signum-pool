import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    getSystemTheme,
    themeModeAction,
} from "../../app/utils/functions/systemTheme";
import { getBookmarkedMiner } from "../../app/utils/functions/bookmarkMiner";

export type SnackBarState = {
    show?: boolean;
    label: string;
    severity: "" | "error" | "warning" | "info" | "success";
};

export interface AppState {
    themeMode: themeModeAction;
    snackBar: SnackBarState;
    isOpenLanguageDialog: boolean;
    isOpenSidebar: boolean;
    bookmarkedMiner: string;
    searchMiner: string;
}

const initialState: AppState = {
    themeMode: getSystemTheme(),
    snackBar: { show: false, label: "", severity: "" },
    isOpenLanguageDialog: false,
    isOpenSidebar: false,
    bookmarkedMiner: getBookmarkedMiner(),
    searchMiner: "",
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
        setBookmarkedMiner: (state, action: PayloadAction<string>) => {
            state.bookmarkedMiner = action.payload;
        },
        setSearchMiner: (state, action: PayloadAction<string>) => {
            state.searchMiner = action.payload;
        },
    },
});

export const { actions } = appSlice;
