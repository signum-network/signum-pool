import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectThemeMode = (state: RootState): "dark" | "light" =>
    state.appState.themeMode;

export const selectIsDarkMode = createSelector(
    selectThemeMode,
    (mode) => mode === "dark"
);

export const selectIsOpenLanguageDialog = (state: RootState): boolean =>
    state.appState.isOpenLanguageDialog;

export const selectIsOpenSidebar = (state: RootState): boolean =>
    state.appState.isOpenSidebar;
