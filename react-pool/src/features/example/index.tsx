import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "../../states/hooks";
import { selectIsDarkMode, actions } from "../../states/appState";

import i18next from "i18next";

// THIS PAGE WAS MADE ONLY FOR EXAMPLE PURPOSES

export const ExamplePage = () => {
    const { t, i18n } = useTranslation();
    const { t: ct } = useTranslation("custom");
    const { setTheme } = actions;

    const dispatch = useAppDispatch();
    const isDarkMode = useAppSelector(selectIsDarkMode);

    const toggleThemeMode = () => {
        dispatch(setTheme(isDarkMode ? "light" : "dark"));
    };

    const switchLanguage = () => {
        i18next.changeLanguage(i18n.language === "en" ? "es" : "en");
    };

    return (
        <>
            <h2>{t("main")}</h2>
            <h2>{ct("main")}</h2>
            <button onClick={toggleThemeMode}>Switch color</button>
            <button onClick={switchLanguage}>Switch language</button>
            <Link to="/pool-info">Visit POOL INFO</Link>
        </>
    );
};
