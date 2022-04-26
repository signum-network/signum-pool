import { useTranslation } from "react-i18next";
import { TableContainer } from "../components/TableContainer";
import { LoadingData } from "../components/LoadingData";
import { SpecificMiner } from "../SpecificMiner";
import { useAppContext } from "../../../hooks/useAppContext";
import { poolNodeUrl } from "../../../../enviroments";
import { useAppSelector } from "../../../../states/hooks";
import { selectBookmarkedMiner } from "../../../../states/appState";

import useSWR from "swr";
import Typography from "@mui/material/Typography";

export const BookMarkedMiner = () => {
    const { t } = useTranslation();
    const { Fetcher } = useAppContext();
    const bookmarkedMinerID = useAppSelector(selectBookmarkedMiner);

    const defaultSWRSettings = {
        refreshInterval: 60000,
        dedupingInterval: 50000,
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    };

    const fetchLink = bookmarkedMinerID
        ? poolNodeUrl + "api/getMiner/" + bookmarkedMinerID
        : undefined;

    const { data, isValidating, error } = useSWR(
        fetchLink,
        Fetcher,
        defaultSWRSettings
    );

    if ((!data && !isValidating) || error)
        return (
            <TableContainer>
                <Typography align="center" variant="h6" color="textSecondary">
                    {t("noMinerBookmarked")}
                </Typography>
            </TableContainer>
        );

    return (
        <TableContainer>
            {!data && isValidating && <LoadingData />}

            {data && (
                <SpecificMiner
                    bookmarkedMiner
                    showDeleteBookmarkButton
                    accountId={data.address}
                    name={data.name}
                    pendingBalance={data.pendingBalance}
                    physicalCapacity={data.totalCapacity || 0}
                    effectiveCapacity={data.totalEffectiveCapacity || 0}
                    sharedCapacity={data.sharedCapacity || 0}
                    shareModel={data.sharePercent || 0}
                    donationPercent={data.donationPercent || 0}
                    totalCommitment={data.committedBalance || ""}
                    commitmentPerTiB={data.commitment || ""}
                    pocBoost={0}
                    pocBostPool={0}
                    confirmedDeadlines={data.nConf || 0}
                    currentRoundBestDeadline={
                        data.currentRoundBestDeadline || ""
                    }
                    poolShare={data.share || 0}
                    minimumPayout={data.minimumPayout || ""}
                    minerAgent={data.userAgent || ""}
                    deadlineData={{
                        deadlines: data.deadlines,
                        boost: data.boost,
                        heights: data.heights,
                    }}
                />
            )}
        </TableContainer>
    );
};
