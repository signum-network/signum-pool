import { useTranslation } from "react-i18next";
import { selectIsDarkMode, actions } from "../../../../../states/appState";
import { useAppSelector, useAppDispatch } from "../../../../../states/hooks";

import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export const ToggleThemeBtn = () => {
    const { t } = useTranslation();
    const { setTheme } = actions;
    const isDarkMode = useAppSelector(selectIsDarkMode);
    const dispatch = useAppDispatch();

    const toggleThemeMode = () =>
        dispatch(setTheme(isDarkMode ? "light" : "dark"));

    const iconStyling = { margin: { xs: 0.5, md: 0 } };

    return (
        <Tooltip title={t("switchTheme") || "Switch Theme"} arrow>
            <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{
                    marginLeft: 1.5,
                    border: "1px solid",
                    borderColor: "divider",
                    p: 1,
                }}
                onClick={toggleThemeMode}
            >
                {isDarkMode ? (
                    <Brightness4Icon sx={{ ...iconStyling }} />
                ) : (
                    <Brightness7Icon sx={{ ...iconStyling }} />
                )}
            </IconButton>
        </Tooltip>
    );
};
