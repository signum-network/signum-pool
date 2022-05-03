import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Amount } from "@signumjs/util";
import { Address, UnsignedTransaction } from "@signumjs/core";
import { LoadingData } from "./components/LoadingData";
import { useAppSelector } from "../../../../../../states/hooks";
import { useAccount } from "../../../../../../app/hooks/useAccount";
import { useSnackbar } from "../../../../../../app/hooks/useSnackbar";
import { useLedger } from "../../../../../../app/hooks/useLedger";
import { useExtensionWallet } from "../../../../../../app/hooks/useExtensionWallet";
import { useAppContext } from "../../../../../../app/hooks/useAppContext";
import { selectIsWalletConnected } from "../../../../../../states/appState";
import { selectPoolConfig } from "../../../../../../states/poolConfigState";
import { walletUrl, miningUrl } from "../../../../../../enviroments";
import { viewTransactionInExplorer } from "../../../../../../app/utils/explorer";

import useSWR from "swr";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";

export const JoinPoolWizard = () => {
    const { t } = useTranslation();
    const { accountId } = useAccount();
    const { Fetcher } = useAppContext();
    const { showError, showInfo } = useSnackbar();
    const { isLoading, poolAccount } = useAppSelector(selectPoolConfig);
    const isWalletConnected = useAppSelector(selectIsWalletConnected);
    const wallet = useExtensionWallet();
    const ledger = useLedger();

    const [successfullTx, setSuccessfullTx] = useState("");
    const [minerJoinedPool, setMinerJoinedPool] = useState(false);

    const defaultSWRSettings = {
        refreshInterval: 120000,
        dedupingInterval: 110000,
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
        if (data && poolAccount && accountId && !isLoading && !error) {
            const minersRewardRecipient = data?.rewardRecipient || "";

            if (minersRewardRecipient === poolAccount) {
                setMinerJoinedPool(true);
                setSuccessfullTx("");
                return;
            }

            if (successfullTx) return;

            resetParams();
        } else {
            if (successfullTx) return;
            resetParams();
        }
    };

    useEffect(() => {
        checkIfMinerIsInPool();
    }, [data, poolAccount, isLoading, accountId]);

    const resetParams = () => {
        setMinerJoinedPool(false);
        setSuccessfullTx("");
    };

    const openTransaction = () =>
        successfullTx && viewTransactionInExplorer(successfullTx);

    const joinPool = async () => {
        if (!ledger || !wallet || !wallet.connection) return;

        try {
            setSuccessfullTx("");

            const address = Address.fromPublicKey(
                wallet.connection?.publicKey || ""
            );

            const { unsignedTransactionBytes } =
                (await ledger.account.setRewardRecipient({
                    feePlanck: Amount.fromSigna(0.01).getPlanck(),
                    senderPublicKey: address.getPublicKey(),
                    recipientId: poolAccount,
                })) as UnsignedTransaction;

            window.dispatchEvent(new Event("wallet-sign-start"));
            const { transactionId: txId } = await wallet.confirm(
                unsignedTransactionBytes
            );

            setSuccessfullTx(txId);
        } catch (e: any) {
            switch (e?.name || e?.data?.errorCode) {
                case "NotGrantedWalletError":
                    showError(t("xtWalletActionDeclined"));
                    break;

                // Error expected from the node
                // "Cannot reassign reward recipient before previous goes into effect"
                case 4:
                    showInfo(t("cannotReassignUntilPreviousInEffect"));
                    break;

                // Error expected from the node
                // "Not enough funds"
                case 6:
                    showInfo(t("notEnoughFunds"));
                    break;

                default:
                    // unexpected error
                    console.error(e.data);
                    break;
            }

            console.error(e.data);
            resetParams();
        } finally {
            window.dispatchEvent(new Event("wallet-sign-end"));
        }
    };

    if (!isValidating && minerJoinedPool) {
        return (
            <Grid container direction="column" alignItems="center">
                <Grid item>
                    <Typography align="center" fontWeight={700}>
                        {t("joinedSuccess")}
                    </Typography>
                </Grid>

                <Divider sx={{ my: 1, width: "100%" }} />

                <Grid item>
                    <CheckCircleIcon sx={{ fontSize: 42 }} color="success" />
                </Grid>

                <Grid item>
                    <Typography align="center" color="textSecondary">
                        {t("joinedSuccessDescription")}
                    </Typography>
                </Grid>
            </Grid>
        );
    }

    if (successfullTx)
        return (
            <Grid container direction="column" alignItems="center">
                <Grid item>
                    <Typography align="center" fontWeight={700}>
                        {t("txSuccesfull")} ❤️
                    </Typography>
                </Grid>

                <Divider sx={{ mt: 1, mb: 2, width: "100%" }} />

                <Grid item px={4} mb={2}>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ color: "white", textTransform: "none" }}
                        onClick={openTransaction}
                        startIcon={<TravelExploreIcon />}
                    >
                        {t("seeTransactionInExplorer")}
                    </Button>
                </Grid>

                <Grid item>
                    <Typography align="center" color="textSecondary">
                        {t("txSuccesfullDescription")}
                    </Typography>

                    <Divider sx={{ my: 2, width: "100%" }} />

                    <Typography
                        gutterBottom
                        align="center"
                        color="textSecondary"
                    >
                        {t("txSuccesfullSecondDescription")}
                    </Typography>

                    <Typography align="center">{miningUrl}</Typography>
                </Grid>
            </Grid>
        );

    return (
        <>
            {isValidating && !data && <LoadingData />}

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
