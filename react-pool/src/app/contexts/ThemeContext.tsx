import { useMemo, ReactNode, createContext } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useAppSelector } from "../../states/hooks";
import { selectThemeMode } from "../../states/appState/selectors";
import { saveSystemTheme } from "../utils/functions/systemTheme";
import { colors } from "../../enviroments";

import CssBaseline from "@mui/material/CssBaseline";

export interface ThemeContextType {
    themeMode: "dark" | "light";
}

export const ThemeContext = createContext<ThemeContextType>({
    themeMode: "dark",
});

interface Props {
    children: ReactNode;
}

export const ThemeContextProvider = ({ children }: Props) => {
    const themeMode = useAppSelector(selectThemeMode);
    if (themeMode) saveSystemTheme(themeMode);

    const contrastText =
        themeMode === "light" ? "rgba(0, 0, 0, 0.87)" : "#ffffff";

    const theme = useMemo(() => {
        return createTheme({
            palette: {
                mode: themeMode,
                primary: {
                    main: colors.primary.main,
                    light: colors.primary.light,
                    dark: colors.primary.dark,
                    contrastText,
                },
                secondary: {
                    main: colors.secondary.main,
                    light: colors.secondary.light,
                    dark: colors.secondary.dark,
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
