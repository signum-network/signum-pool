import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../states/hooks";
import { selectIsDarkMode, actions } from "../states/appState";

export const PoolInfo = () => {
    const dispatch = useAppDispatch();
    const isDarkMode = useAppSelector(selectIsDarkMode);
    const { setTheme } = actions;

    const toggleThemeMode = () => {
        dispatch(setTheme(isDarkMode ? "light" : "dark"));
    };

    return (
        <>
            <h1>Welcome to the pool info!</h1>
            <button onClick={toggleThemeMode}>Switch color</button>

            <Link to="/">
                <button>Visit home</button>
            </Link>
        </>
    );
};
