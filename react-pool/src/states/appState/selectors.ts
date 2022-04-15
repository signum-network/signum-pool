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
