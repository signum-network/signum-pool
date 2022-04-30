import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../../../../states/hooks";
import { selectIsOpenSignTransactionModal } from "../../../../../../states/appState";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

export const SignTransactionModal = () => {
    const { t } = useTranslation();
    const isOpen = useAppSelector(selectIsOpenSignTransactionModal);

    return (
        <Dialog open={isOpen} sx={{ maxWidth: 500, mx: "auto" }}>
            <DialogContent>
                <Grid
                    container
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="center"
                >
                    <AccountBalanceWalletIcon fontSize="large" />
                    <Typography variant="h5" align="center" fontWeight={800}>
                        {t("signTransactionTitle")}
                    </Typography>

                    <Typography align="center">
                        {t("signTransactionDescription")}
                    </Typography>

                    <CircularProgress
                        size={40}
                        sx={{ my: 2, color: "inherit" }}
                    />

                    <Alert severity="info">
                        {t("signTransactionSecondDescription")}
                    </Alert>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};
