import { Suspense } from "react";
import { AppRoutes } from "./routes/AppRoutes";
import { ThemeContextProvider } from "./app/contexts/ThemeContext";
import { Loading } from "./app/components/Loading";

import "./app/i18n";

const App = () => {
    return (
        <Suspense fallback={<Loading />}>
            <ThemeContextProvider>
                <AppRoutes />
            </ThemeContextProvider>
        </Suspense>
    );
};

export default App;
