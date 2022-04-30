import { Fragment, FC } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
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
import { poolName } from "../../../enviroments";

// @ts-ignore
import Helmet from "react-helmet";

export const Layout: FC = ({ children }) => {
    const { t } = useTranslation();

    const [searchParams] = useSearchParams();

    const isEmbedMode = !!(
        searchParams.get("embedMode") &&
        searchParams.get("embedMode") === "true"
    );

    return (
        <Fragment>
            <Helmet>
                <title>{`${t("HOMETAG")} • ${poolName}`}</title>
            </Helmet>

            <PoolDataFetcher />
            <Sidebar />
            <AppSnackBar />
            <LanguageDialog />
            <SearchMinerDialog />

            <WalletWrongNetworkModal />
            <SetupWalletModal />
            <SignTransactionModal />

            {!isEmbedMode && <Header />}

            {children}
            <Footer />
        </Fragment>
    );
};
