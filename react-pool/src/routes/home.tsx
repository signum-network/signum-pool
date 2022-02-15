import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "../states/hooks";
import { selectIsDarkMode, actions } from "../states/appState";

import i18next from "i18next";

export const Home = () => {
    const { t, i18n } = useTranslation();

    const dispatch = useAppDispatch();
    const isDarkMode = useAppSelector(selectIsDarkMode);
    const { setTheme } = actions;

    const toggleThemeMode = () => {
        dispatch(setTheme(isDarkMode ? "light" : "dark"));
    };

    const switchLanguage = () => {
        i18next.changeLanguage(i18n.language === "en" ? "es" : "en");
    };

    return (
        <>
            <h1>Welcome to the home page!</h1>
            <h2>{t("main")}</h2>
            <h2>{t("main", { ns: "custom" })}</h2>
            <button onClick={toggleThemeMode}>Switch color</button>
            <button onClick={switchLanguage}>Switch language</button>
            <Link to="/pool-info">Visit POOL INFO</Link>
        </>
    );
};
