import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { TableContainer } from "../../app/components/Tables/components/TableContainer";
import { LoadingData } from "../../app/components/Tables/components/LoadingData";
import { SpecificMiner } from "../../app/components/Tables/SpecificMiner";
import { useAppContext } from "../../app/hooks/useAppContext";
import { poolNodeUrl } from "../../enviroments";

import useSWR from "swr";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

export const SpecificMinerPage = () => {
    const { t } = useTranslation();
    const { Fetcher } = useAppContext();
    const params = useParams();
    const minerId = params?.accountId || "";

    const defaultSWRSettings = {
        refreshInterval: 60000,
        dedupingInterval: 50000,
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    };

    // For just preventing a unnecessary request
    // Check if the query parameter accountId has any letter
    const idContainsLetter = minerId && /[a-zA-Z]/g.test(minerId);

    const fetchLink =
        minerId && !idContainsLetter
            ? poolNodeUrl + "api/getMiner/" + minerId
            : undefined;

    const { data, isValidating, error } = useSWR(
        fetchLink,
        Fetcher,
        defaultSWRSettings
    );

    if ((!data && !isValidating) || error || !minerId)
        return (
            <Grid container mx="auto" maxWidth={760} mt={5} px={2}>
                <Typography variant="h6" gutterBottom>
                    {t("miner") + " #" + minerId}
                </Typography>

                <TableContainer>
                    <Typography align="center" variant="h6">
                        {t("minerNotFound")}
                    </Typography>
                </TableContainer>
            </Grid>
        );

    return (
        <Grid
            container
            mx="auto"
            maxWidth={760}
            mt={4}
            p={2}
            direction="row"
            alignItems="center"
        >
            <TableContainer>
                {!data && isValidating && <LoadingData />}

                {data && (
                    <SpecificMiner
                        bookmarkedMiner
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
        </Grid>
    );
};
