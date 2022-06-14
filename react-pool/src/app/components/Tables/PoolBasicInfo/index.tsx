import { useTranslation } from "react-i18next";
import { TableContainer } from "../components/TableContainer";
import { LoadingData } from "../components/LoadingData";
import { SpecificRow } from "../components/SpecificRow";
import { useAppSelector } from "../../../../states/hooks";
import { selectPoolConfig } from "../../../../states/poolConfigState";
import { poolName } from "../../../../enviroments/";
import { asRSAddress } from "../../../utils/functions/accountAddress";
import { formatAmount } from "../../../utils/functions/formatAmount";
import { viewAccountInExplorer } from "../../../utils/explorer";

import Grid from "@mui/material/Grid";

export const PoolBasicInfo = () => {
    const { t } = useTranslation();
    const {
        isLoading,
        poolAccount,
        blocksForAverage,
        blocksToShowAMiner,
        maxDeadline,
        graceDeadlines,
        processLag,
        feeRecipient,
        poolFeePercentage,
        poolSoloFeePercentage,
        donationPercent,
        donationRecipient,
        defaultPoolShare,
        defaultMinimumPayout,
        minimumPayoutsPerTransaction,
        poolPayoutTransactionFee,
        version,
    } = useAppSelector(selectPoolConfig);

    return (
        <TableContainer>
            {isLoading && <LoadingData />}

            {!isLoading && (
                <Grid container item direction="column">
                    <SpecificRow title={t("poolName")} value={poolName} />

                    <SpecificRow
                        title={t("poolAccount")}
                        value={asRSAddress(poolAccount)}
                        onClick={() => {
                            viewAccountInExplorer(poolAccount);
                        }}
                    />

                    <SpecificRow
                        title={t("poolFee")}
                        secondTitle={
                            poolFeePercentage < 0
                                ? t("enjoyTheBonus")
                                : undefined
                        }
                        value={(poolFeePercentage * 100).toFixed(2) + " %"}
                    />

                    <SpecificRow
                        title={t("poolSoloFee")}
                        secondTitle={t("minerSharingLess", {
                            percentage: "20%",
                        })}
                        value={(poolSoloFeePercentage * 100).toFixed(2) + " %"}
                    />

                    <SpecificRow
                        title={t("donationRecipient")}
                        value={asRSAddress(donationRecipient)}
                        onClick={() => {
                            viewAccountInExplorer(donationRecipient);
                        }}
                    />

                    <SpecificRow
                        title={t("defaultDonation")}
                        secondTitle={t("configurable")}
                        value={donationPercent.toFixed(2) + " %"}
                    />

                    <SpecificRow
                        title={t("defaultPoolShare")}
                        secondTitle={t("configurable")}
                        value={(100 - defaultPoolShare * 100).toFixed(2) + " %"}
                    />

                    <SpecificRow
                        title={t("numberBlockAvg")}
                        value={blocksForAverage}
                    />

                    <SpecificRow
                        title={t("numberBlockShowMiner")}
                        value={blocksToShowAMiner}
                    />

                    <SpecificRow
                        title={t("maxDeadline")}
                        value={formatAmount(maxDeadline)}
                    />

                    <SpecificRow
                        title={t("graceDeadlines")}
                        value={formatAmount(graceDeadlines)}
                    />

                    <SpecificRow
                        title={t("processLag")}
                        value={
                            formatAmount(processLag) + " " + t("block_other")
                        }
                    />

                    <SpecificRow
                        title={t("feeRecipient")}
                        value={asRSAddress(feeRecipient)}
                        onClick={() => {
                            viewAccountInExplorer(feeRecipient);
                        }}
                    />

                    <SpecificRow
                        title={t("defaultMinimumPayout")}
                        secondTitle={t("configurable")}
                        value={defaultMinimumPayout + " SIGNA"}
                    />

                    <SpecificRow
                        title={t("minimumPayoutsAtOnce")}
                        value={minimumPayoutsPerTransaction}
                    />

                    <SpecificRow
                        title={t("payoutTxFee")}
                        value={poolPayoutTransactionFee + " SIGNA"}
                    />

                    <SpecificRow
                        title={t("poolSoftwareVersion")}
                        value={version}
                    />
                </Grid>
            )}
        </TableContainer>
    );
};
