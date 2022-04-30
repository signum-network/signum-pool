import { useTranslation } from "react-i18next";
import { StartMiningPage } from "../features/startMining";
import { poolName } from "../enviroments";

// @ts-ignore
import Helmet from "react-helmet";

export const StartMining = () => {
    const { t } = useTranslation();

    return (
        <>
            <Helmet>
                <title>{`${t("startMining")} • ${poolName}`}</title>
            </Helmet>

            <StartMiningPage />
        </>
    );
};
