import { useTranslation } from "react-i18next";
import { AllMiners } from "../../features/miners/allMiners";
import { poolName } from "../../enviroments";

// @ts-ignore
import Helmet from "react-helmet";

export const Miners = () => {
    const { t } = useTranslation();

    return (
        <>
            <Helmet>
                <title>{`${t("miner_other")} • ${poolName}`}</title>
            </Helmet>

            <AllMiners />
        </>
    );
};
