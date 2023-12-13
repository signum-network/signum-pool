import { Suspense } from "react";
import { AppRoutes } from "./routes/AppRoutes";
import { ThemeContextProvider } from "./app/contexts/ThemeContext";
import { Layout } from "./app/components/Layout";
import { Loading } from "./app/components/Loading";
import { AppInitializer } from "./app/components/AppInitializer";
import "./app/i18n";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource-variable/montserrat";

const App = () => {
    return (
        <Suspense fallback={<Loading />}>
            <ThemeContextProvider>
                <Layout>
                    <AppInitializer />
                    <AppRoutes />
                </Layout>
            </ThemeContextProvider>
        </Suspense>
    );
};

export default App;
