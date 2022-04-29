import { Fragment, FC } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Sidebar } from "./Sidebar";
import { LanguageDialog } from "./components/LanguageDialog";
import { AppSnackBar } from "./components/AppSnackBar";
import { PoolDataFetcher } from "./components/PoolDataFetcher";
import { SearchMinerDialog } from "./components/SearchMinerDialog";
import { WalletWrongNetworkModal } from "./components/Modals/WalletWrongNetworkModal";
import { SetupWalletModal } from "./components/Modals/SetupWalletModal";
import { SignTransactionModal } from "./components/Modals/SignTransactionModal";

export const Layout: FC = ({ children }) => {
    return (
        <Fragment>
            <PoolDataFetcher />
            <Sidebar />
            <AppSnackBar />
            <LanguageDialog />
            <SearchMinerDialog />

            <WalletWrongNetworkModal />
            <SetupWalletModal />
            <SignTransactionModal />

            <Header />
            {children}
            <Footer />
        </Fragment>
    );
};
