import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "../../../../states/hooks";
import { actions } from "../../../../states/appState";
import { miner } from "../../../../states/minersState";
import { selectPoolConfig } from "../../../../states/poolConfigState";
import { viewAccountInExplorer } from "../../../utils/explorer";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { formatCapacity } from "../../../utils/functions/formatCapacity";
import { formatTime } from "../../../utils/functions/formatTime";
import { asRSAddress } from "../../../utils/functions/accountAddress";
import { removeBookmarkedMiner } from "../../../utils/functions/bookmarkMiner";
import { MinerDeadlinesGraph } from "./components/MinerDeadlinesGraph";
import { SpecificRow } from "../components/SpecificRow";

import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import BlurOnIcon from "@mui/icons-material/BlurOn";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export interface deadlines {
    deadlines: number[];
    heights: number[];
    boost: number[];
}

export interface SpecificMinerProps extends miner {
    bookmarkedMiner?: boolean;
    showExplorerButton?: boolean;
    showDeleteBookmarkButton?: boolean;
    deadlineData?: deadlines;
}

export const SpecificMiner = ({
    accountId,
    name,
    pendingBalance,
    physicalCapacity,
    effectiveCapacity,
    sharedCapacity,
    shareModel,
    donationPercent,
    totalCommitment,
    commitmentPerTiB,
    pocBoost,
    confirmedDeadlines,
    poolShare,
    minimumPayout,
    minerAgent,
    currentRoundBestDeadline,
    bookmarkedMiner = false,
    showDeleteBookmarkButton = false,
    showExplorerButton = false,
    deadlineData,
}: SpecificMinerProps) => {
    const { t } = useTranslation();
    const { showSuccess } = useSnackbar();
    const { blocksForAverage, processLag } = useAppSelector(selectPoolConfig);
    const { setBookmarkedMiner } = actions;
    const dispatch = useAppDispatch();

    const maxSubmissions = blocksForAverage + processLag;

    const openAccountInExplorer = () => {
        viewAccountInExplorer(accountId);
    };

    const deleteBookmarkedMiner = () => {
        removeBookmarkedMiner();
        dispatch(setBookmarkedMiner(""));
        showSuccess(t("bookmarkDeleted") + " ⚒️");
    };

    return (
        <Grid container direction="column">
            {showExplorerButton && (
                <Grid
                    item
                    container
                    py={2}
                    sx={{ borderBottom: 1, borderColor: "divider" }}
                >
                    <Button
                        color="primary"
                        variant="contained"
                        startIcon={<BlurOnIcon />}
                        onClick={openAccountInExplorer}
                        sx={{
                            width: "90%",
                            mx: "auto",
                            textTransform: "none",
                            color: "white",
                        }}
                    >
                        {t("viewMinerInExplorer")}
                    </Button>
                </Grid>
            )}

            {name && (
                <SpecificRow
                    title={t("name")}
                    value={name}
                    onClick={openAccountInExplorer}
                />
            )}

            {accountId && (
                <SpecificRow
                    title={t("minerAddress")}
                    value={asRSAddress(accountId)}
                    onClick={openAccountInExplorer}
                />
            )}

            {!bookmarkedMiner && (
                <SpecificRow
                    title={t("accountId")}
                    value={accountId}
                    onClick={openAccountInExplorer}
                />
            )}

            {pendingBalance && (
                <SpecificRow
                    title={t("pendingBalance")}
                    value={pendingBalance}
                />
            )}

            {bookmarkedMiner && currentRoundBestDeadline && (
                <SpecificRow
                    title={t("currentDeadline")}
                    // @ts-ignore
                    value={formatTime(currentRoundBestDeadline)}
                />
            )}

            {bookmarkedMiner && !currentRoundBestDeadline && (
                <SpecificRow
                    title={t("currentDeadline")}
                    value={t("waiting") + "..."}
                />
            )}

            {bookmarkedMiner &&
                deadlineData &&
                deadlineData.boost.length &&
                deadlineData.deadlines.length &&
                deadlineData.heights.length && (
                    <SpecificRow title={t("pastDeadline_other")}>
                        <MinerDeadlinesGraph
                            boost={deadlineData.boost}
                            deadlines={deadlineData.deadlines}
                            heights={deadlineData.heights}
                        />
                    </SpecificRow>
                )}

            <SpecificRow
                title={t("confirmedDeadline_other")}
                value={confirmedDeadlines + "/" + maxSubmissions}
            />

            {!!physicalCapacity && (
                <SpecificRow
                    title={t("physicalCapacity")}
                    // @ts-ignore
                    value={formatCapacity(physicalCapacity)}
                />
            )}

            {!!pocBoost && (
                <SpecificRow
                    title={t("pocBoost")}
                    value={pocBoost.toFixed(3)}
                />
            )}

            {!!effectiveCapacity && (
                <SpecificRow
                    title={t("effectiveCapacity")}
                    // @ts-ignore
                    value={formatCapacity(effectiveCapacity)}
                />
            )}

            {totalCommitment && (
                <SpecificRow
                    title={t("committedBalance")}
                    value={totalCommitment}
                />
            )}

            {commitmentPerTiB && (
                <SpecificRow
                    title={t("commitmentSlashTiB")}
                    value={commitmentPerTiB}
                />
            )}

            {minimumPayout && (
                <SpecificRow title={t("minimumPayout")} value={minimumPayout} />
            )}

            {!!shareModel && (
                <SpecificRow title={t("shareModel")} value={shareModel + "%"} />
            )}

            {!!sharedCapacity && (
                <SpecificRow
                    title={t("sharedCapacity")}
                    // @ts-ignore
                    value={formatCapacity(sharedCapacity)}
                />
            )}

            {!!donationPercent && (
                <SpecificRow
                    title={t("donationPercent")}
                    value={donationPercent + "%"}
                />
            )}

            {!!poolShare && (
                <SpecificRow
                    title={t("poolShare")}
                    value={(poolShare * 100).toFixed(3) + "%"}
                />
            )}

            {minerAgent && (
                <SpecificRow title={t("software")} value={minerAgent} />
            )}

            {showDeleteBookmarkButton && (
                <Grid item container mt={2}>
                    <Button
                        color="error"
                        variant="contained"
                        startIcon={<DeleteForeverIcon />}
                        onClick={deleteBookmarkedMiner}
                        sx={{
                            width: "90%",
                            mx: "auto",
                            textTransform: "none",
                            color: "white",
                        }}
                    >
                        {t("deleteBookmark")}
                    </Button>
                </Grid>
            )}
        </Grid>
    );
};
