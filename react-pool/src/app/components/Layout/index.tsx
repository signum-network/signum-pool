import { Fragment, FC } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Sidebar } from "./Sidebar";
import { LanguageDialog } from "./components/LanguageDialog";
import { AppSnackBar } from "./components/AppSnackBar";
import { PoolDataFetcher } from "./components/PoolDataFetcher";

export const Layout: FC = ({ children }) => {
    return (
        <Fragment>
            <Sidebar />
            <AppSnackBar />
            <LanguageDialog />
            <PoolDataFetcher />
            <Header />
            {children}
            <Footer />
        </Fragment>
    );
};
