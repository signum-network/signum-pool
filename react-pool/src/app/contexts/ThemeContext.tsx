import { useMemo, FC, createContext } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useAppSelector } from "../../states/hooks";
import { selectThemeMode } from "../../states/appState/selectors";
import { saveSystemTheme } from "../utils/functions/systemTheme";

import CssBaseline from "@mui/material/CssBaseline";

export interface ThemeContextType {
    themeMode: "dark" | "light";
}

export const ThemeContext = createContext<ThemeContextType>({
    themeMode: "dark",
});

export const ThemeContextProvider: FC = ({ children }) => {
    const themeMode = useAppSelector(selectThemeMode);
    if (themeMode) saveSystemTheme(themeMode);

    const contrastText =
        themeMode === "light" ? "rgba(0, 0, 0, 0.87)" : "#ffffff";

    const theme = useMemo(() => {
        return createTheme({
            palette: {
                mode: themeMode,
                primary: {
                    main: "#0099ff",
                    light: "#5fb8ff",
                    dark: "#0066ff",
                    contrastText,
                },
                secondary: {
                    main: "#183173",
                    light: "#274187",
                    dark: "#021851",
                    contrastText,
                },
            },
            shape: {
                borderRadius: 6,
            },
        });
    }, [themeMode]);

    return (
        <ThemeContext.Provider value={{ themeMode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline enableColorScheme />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};
