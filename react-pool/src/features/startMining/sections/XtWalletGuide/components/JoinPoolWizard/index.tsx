import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LoadingData } from "./components/LoadingData";
import { useAppSelector } from "../../../../../../states/hooks";
import { useAccount } from "../../../../../../app/hooks/useAccount";
import { useAppContext } from "../../../../../../app/hooks/useAppContext";
import { selectIsWalletConnected } from "../../../../../../states/appState";
import { selectPoolConfig } from "../../../../../../states/poolConfigState";
import { walletUrl } from "../../../../../../enviroments";

import useSWR from "swr";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

export const JoinPoolWizard = () => {
    const { t } = useTranslation();
    const { accountId } = useAccount();
    const { Fetcher } = useAppContext();
    const { isLoading, poolAccount } = useAppSelector(selectPoolConfig);
    const isWalletConnected = useAppSelector(selectIsWalletConnected);

    const [successfullTx, setSuccessfullTx] = useState(false);
    const [minerJoinedPool, setMinerJoinedPool] = useState(false);

    const defaultSWRSettings = {
        refreshInterval: 60000,
        dedupingInterval: 50000,
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    };

    const fetchLink =
        isWalletConnected && accountId
            ? walletUrl +
              "/burst?requestType=getRewardRecipient&account=" +
              accountId
            : undefined;

    const { data, isValidating, error } = useSWR(
        fetchLink,
        Fetcher,
        defaultSWRSettings
    );

    const checkIfMinerIsInPool = () => {
        if (data && poolAccount && !isLoading && !error) {
            const minersRewardRecipient = data?.rewardRecipient || "";

            setMinerJoinedPool(minersRewardRecipient === poolAccount);
        } else {
            setMinerJoinedPool(false);
        }
    };

    useEffect(() => {
        checkIfMinerIsInPool();
    }, [data, poolAccount, isLoading]);

    const joinPool = () => {};

    if (!successfullTx)
        return (
            <Typography variant="h6" align="center">
                SuccessfullTransaction
            </Typography>
        );

    return (
        <>
            {isValidating && !data && <LoadingData />}

            {!isValidating && minerJoinedPool && (
                <Grid container direction="column" alignItems="center">
                    <Grid item>
                        <Typography align="center" fontWeight={700}>
                            {t("joinedSuccess")}
                        </Typography>
                    </Grid>

                    <Divider sx={{ my: 1, width: "100%" }} />

                    <Grid item>
                        <CheckCircleIcon
                            sx={{ fontSize: 42 }}
                            color="success"
                        />
                    </Grid>

                    <Grid item>
                        <Typography align="center" color="textSecondary">
                            {t("joinedSuccessDescription")}
                        </Typography>
                    </Grid>
                </Grid>
            )}

            {!isValidating && !minerJoinedPool && (
                <Grid container direction="column" alignItems="center">
                    <Grid item>
                        <Typography align="center" fontWeight={700}>
                            {t("joinPool")}
                        </Typography>
                    </Grid>

                    <Divider sx={{ mt: 1, mb: 2, width: "100%" }} />

                    <Grid item px={4} mb={2}>
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ color: "white" }}
                            onClick={joinPool}
                            startIcon={<ManageAccountsIcon />}
                        >
                            {t("joinPoolNow")}
                        </Button>
                    </Grid>

                    <Grid item>
                        <Typography
                            align="center"
                            color="textSecondary"
                            whiteSpace="pre-line"
                        >
                            {t("joinPoolDescription")}
                        </Typography>
                    </Grid>
                </Grid>
            )}
        </>
    );
};
