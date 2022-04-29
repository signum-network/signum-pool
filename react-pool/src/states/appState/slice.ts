import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExtensionWalletError } from "@signumjs/wallets";
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
    isWalletConnected: boolean;
    isOpenWalletModal: boolean;
    isOpenWalletWrongNetworkModal: boolean;
    isOpenSignTransactionModal: boolean;
    walletNodeHost: string;
    walletPublicKey: string;
    walletError?: ExtensionWalletError;
}

const initialState: AppState = {
    themeMode: getSystemTheme(),
    snackBar: { show: false, label: "", severity: "" },
    isOpenLanguageDialog: false,
    isOpenSidebar: false,
    bookmarkedMiner: getBookmarkedMiner(),
    searchMiner: "",
    isWalletConnected: false,
    isOpenWalletModal: false,
    isOpenWalletWrongNetworkModal: false,
    isOpenSignTransactionModal: false,
    walletNodeHost: "",
    walletPublicKey: "",
    walletError: undefined,
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
        setIsWalletConnected: (state, action: PayloadAction<boolean>) => {
            state.isWalletConnected = action.payload;
        },
        setWalletModal: (state, action: PayloadAction<boolean>) => {
            state.isOpenWalletModal = action.payload;
        },
        setWalletWrongNetworkModal: (state, action: PayloadAction<boolean>) => {
            state.isOpenWalletWrongNetworkModal = action.payload;
        },
        setSignTransactionModal: (state, action: PayloadAction<boolean>) => {
            state.isOpenSignTransactionModal = action.payload;
        },
        setWalletNodeHost: (state, action: PayloadAction<string>) => {
            state.walletNodeHost = action.payload;
        },
        setWalletPublicKey: (state, action: PayloadAction<string>) => {
            state.walletPublicKey = action.payload;
        },
        setWalletError: (
            state,
            action: PayloadAction<ExtensionWalletError>
        ) => {
            state.walletError = action.payload;
        },
    },
});

export const { actions } = appSlice;
