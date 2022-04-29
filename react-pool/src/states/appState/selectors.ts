import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { SnackBarState } from "./slice";

export const selectThemeMode = (state: RootState): "dark" | "light" =>
    state.appState.themeMode;

export const selectIsDarkMode = createSelector(
    selectThemeMode,
    (mode) => mode === "dark"
);

export const selectAppSnackbar = (state: RootState): SnackBarState =>
    state.appState.snackBar;

export const selectIsOpenLanguageDialog = (state: RootState): boolean =>
    state.appState.isOpenLanguageDialog;

export const selectIsOpenSidebar = (state: RootState): boolean =>
    state.appState.isOpenSidebar;

export const selectBookmarkedMiner = (state: RootState): string =>
    state.appState.bookmarkedMiner;

export const selectSearchedMiner = (state: RootState): string =>
    state.appState.searchMiner;

export const selectIsWalletConnected = (state: RootState): boolean =>
    state.appState.isWalletConnected;

export const selectIsOpenWalletModal = (state: RootState): boolean =>
    state.appState.isOpenWalletModal;

export const selectIsOpenWalletWrongNetworkModal = (
    state: RootState
): boolean => state.appState.isOpenWalletWrongNetworkModal;

export const selectIsOpenSignTransactionModal = (state: RootState): boolean =>
    state.appState.isOpenSignTransactionModal;

export const selectWalletNodeHost = (state: RootState): string =>
    state.appState.walletNodeHost;

export const selectWalletPublicKey = (state: RootState): string =>
    state.appState.walletPublicKey;

export const selectWalletError = (state: RootState): string =>
    state.appState.walletPublicKey;
