import { useTranslation } from "react-i18next";
import { PoolInfoPage } from "../features/poolInfo";
import { poolName } from "../enviroments";

// @ts-ignore
import Helmet from "react-helmet";

export const PoolInfo = () => {
    const { t } = useTranslation();

    return (
        <>
            <Helmet>
                <title>{`${t("poolInfo")} • ${poolName}`}</title>
            </Helmet>
            <PoolInfoPage />
        </>
    );
};
