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

    const theme = useMemo(() => {
        const contrastText =
            themeMode === "light" ? "rgba(0, 0, 0, 0.87)" : "#ffffff";

        return createTheme({
            palette: {
                mode: themeMode,
                primary: {
                    light: "#80e27e",
                    main: "#4caf50",
                    dark: "#087f23",
                    contrastText,
                },
                secondary: {
                    light: "#69c9ff",
                    main: "#0099ff",
                    dark: "#006ccb",
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
