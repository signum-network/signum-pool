import { isClientSide } from "./isClientSide";

export type themeModeAction = "dark" | "light";

const localStorageThemeKEY = "theme";

export const getSystemTheme = (): themeModeAction => {
    if (!isClientSide()) return "dark";

    const storedValue = localStorage.getItem(localStorageThemeKEY);
    if (storedValue && (storedValue === "light" || storedValue === "dark"))
        return storedValue;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
};

export const saveSystemTheme = (theme: themeModeAction) => {
    localStorage.setItem(localStorageThemeKEY, theme);
};
