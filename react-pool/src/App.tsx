import { Suspense } from "react";
import { AppRoutes } from "./routes/AppRoutes";
import { ThemeContextProvider } from "./app/contexts/ThemeContext";
import { Layout } from "./app/components/Layout";
import { Loading } from "./app/components/Loading";
import "./app/i18n";

const App = () => {
    return (
        <Suspense fallback={<Loading />}>
            <ThemeContextProvider>
                <Layout>
                    <AppRoutes />
                </Layout>
            </ThemeContextProvider>
        </Suspense>
    );
};

export default App;
