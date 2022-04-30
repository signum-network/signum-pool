import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../../states/hooks";
import { selectMiners } from "../../../../states/minersState";
import { selectCurrentRound } from "../../../../states/currentRoundState";
import { formatTime } from "../../../../app/utils/functions/formatTime";
import { formatCapacity } from "../../../../app/utils/functions/formatCapacity";
import { formatAmount } from "../../../../app/utils/functions/formatAmount";
import { InfoCard } from "./components/InfoCard";
import { useBlockTimeout } from "./components/useBlockTimeout";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

export const MiningInfo = () => {
    const { t } = useTranslation();

    const miningData = useAppSelector(selectMiners);
    const {
        isLoading: isLoadingMiningData,
        miners,
        totalPhysicalCapacity,
    } = miningData;

    const currentRound = useAppSelector(selectCurrentRound);
    const {
        isLoading: isLoadingCurrentRound,
        roundStart,
        networkInfo,
        bestDeadline,
    } = currentRound;

    const formattedTimeout = useBlockTimeout(roundStart);

    return (
        <Grid
            container
            sx={{
                maxWidth: 1000,
                mx: "auto",
                px: 2,
                mt: { xs: 5, lg: 8 },
                mb: 3,
            }}
        >
            <Typography component="h1" variant="h4" gutterBottom>
                {t("poolInfo")}
            </Typography>

            <Grid
                container
                item
                direction="row"
                alignItems="stretch"
                justifyContent="space-between"
                wrap="wrap"
                spacing={3}
            >
                <Grid item xs={12} md={3}>
                    <InfoCard
                        title={t("blockHeight")}
                        value={formatAmount(networkInfo.blockHeight)}
                        loading={isLoadingCurrentRound}
                    />
                </Grid>

                <Grid item xs={12} md={3}>
                    <InfoCard
                        title={t("elapsedTime")}
                        value={formattedTimeout}
                        loading={
                            isLoadingCurrentRound || formattedTimeout === "..."
                        }
                    />
                </Grid>

                <Grid item xs={12} md={3}>
                    <InfoCard
                        title={t("miner", { count: miners.length })}
                        value={`${miners.length}`}
                        loading={isLoadingMiningData}
                    />
                </Grid>

                <Grid item xs={12} md={3}>
                    <InfoCard
                        title={t("poolPhysical")}
                        // @ts-ignore
                        value={formatCapacity(totalPhysicalCapacity)}
                        loading={isLoadingMiningData}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <InfoCard
                        title={t("bestMiner")}
                        value={
                            formatTime(bestDeadline.deadline) +
                            " | " +
                            bestDeadline.miner
                        }
                        loading={isLoadingCurrentRound}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <InfoCard
                        title={t("networkSize")}
                        value={networkInfo.difficulty}
                        loading={isLoadingCurrentRound}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};
