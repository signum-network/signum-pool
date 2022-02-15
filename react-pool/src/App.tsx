import { AppRoutes } from "./routes/AppRoutes";
import { ThemeContextProvider } from "./app/contexts/ThemeContext";

const App = () => {
    return (
        <ThemeContextProvider>
            <AppRoutes />
        </ThemeContextProvider>
    );
};

export default App;
