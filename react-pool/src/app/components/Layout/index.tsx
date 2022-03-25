import { Fragment, FC } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Sidebar } from "./Sidebar";
import { LanguageDialog } from "./components/LanguageDialog";

export const Layout: FC = ({ children }) => {
    return (
        <Fragment>
            <Sidebar />
            <LanguageDialog />
            <Header />
            {children}
            <Footer />
        </Fragment>
    );
};
