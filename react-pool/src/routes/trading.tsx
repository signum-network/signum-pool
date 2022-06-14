import { useTranslation } from "react-i18next";
import { TradingPage } from "../features/trading";

import { poolName } from "../enviroments";
// @ts-ignore
import Helmet from "react-helmet";

export const Trading = () => {
    const { t } = useTranslation();

    return (
        <>
            <Helmet>
                <title>{`${t("trading")} • ${poolName}`}</title>
            </Helmet>

            <TradingPage />
        </>
    );
};
