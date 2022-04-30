import { useTranslation } from "react-i18next";
import { formatCapacity } from "../../../../app/utils/functions/formatCapacity";
import { formatAmount } from "../../../../app/utils/functions/formatAmount";
import { useAppSelector } from "../../../../states/hooks";
import { selectMiners } from "../../../../states/minersState";
import { selectCurrentRound } from "../../../../states/currentRoundState";
import { selectSignumState } from "../../../../states/signumState";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

export const PoolInfo = () => {
    const { t } = useTranslation();

    const miningData = useAppSelector(selectMiners);
    const {
        isLoading: isLoadingMiningData,
        miners,
        totalPhysicalCapacity,
    } = miningData;

    const currentRound = useAppSelector(selectCurrentRound);
    const { isLoading: isLoadingCurrentRound, networkInfo } = currentRound;

    const signumState = useAppSelector(selectSignumState);
    const { isLoading: isLoadingSignumState, price } = signumState;

    return (
        <Grid
            container
            mx="auto"
            maxWidth={760}
            mt={1}
            p={2}
            pb={0}
            sx={{ borderBottom: 1, borderColor: "divider" }}
            direction="row"
            alignItems="center"
        >
            <PoolStat
                title={t("poolPhysical")}
                // @ts-ignore
                value={formatCapacity(totalPhysicalCapacity)}
                loading={isLoadingMiningData}
            />

            <PoolStat
                title={t("miner", { count: miners.length })}
                value={`${miners.length}`}
                loading={isLoadingMiningData}
            />

            <PoolStat
                title={t("blockHeight")}
                value={formatAmount(networkInfo.blockHeight)}
                loading={isLoadingCurrentRound}
            />

            <PoolStat
                title={t("priceUSD")}
                value={"$" + formatAmount(price)}
                loading={isLoadingSignumState}
            />

            <PoolStat
                title={t("networkSize")}
                value={networkInfo.difficulty}
                loading={isLoadingCurrentRound}
                fullLength
            />
        </Grid>
    );
};

interface PoolStatProps {
    title: string;
    value: string;
    fullLength?: boolean;
    loading?: boolean;
}

export const PoolStat = ({
    title,
    value,
    fullLength = false,
    loading = false,
}: PoolStatProps) => {
    return (
        <Grid
            item
            sx={{
                width: fullLength ? "100%" : { xs: "50%", lg: "25%" },
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                mb: 2,
            }}
        >
            <Grid item container>
                <Typography
                    variant="h6"
                    color="textSecondary"
                    align="center"
                    width="100%"
                >
                    {title}
                </Typography>
            </Grid>

            {loading && (
                <Grid item sx={{ justifyContent: "center", display: "flex" }}>
                    <CircularProgress size={38} />
                </Grid>
            )}

            {!loading && (
                <Grid item>
                    <Typography
                        variant="h5"
                        gutterBottom
                        width="100%"
                        align="center"
                        fontWeight={800}
                    >
                        {value}
                    </Typography>
                </Grid>
            )}
        </Grid>
    );
};
