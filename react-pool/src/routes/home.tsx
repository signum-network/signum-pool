import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../states/hooks";
import { selectIsDarkMode, actions } from "../states/appState";

export const Home = () => {
    const dispatch = useAppDispatch();
    const isDarkMode = useAppSelector(selectIsDarkMode);
    const { setTheme } = actions;

    const toggleThemeMode = () => {
        dispatch(setTheme(isDarkMode ? "light" : "dark"));
    };

    return (
        <>
            <h1>Welcome to the home page!</h1>
            <button onClick={toggleThemeMode}>Switch color</button>
            <Link to="/pool-info">Visit POOL INFO</Link>
        </>
    );
};
