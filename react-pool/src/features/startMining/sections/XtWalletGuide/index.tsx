import { useTranslation } from "react-i18next";
import { requestWalletConnection } from "../../../../app/utils/requestWalletConnection";
import { useAppSelector } from "../../../../states/hooks";
import { useAppContext } from "../../../../app/hooks/useAppContext";
import { selectIsWalletConnected } from "../../../../states/appState";
import { JoinPoolWizard } from "./components/JoinPoolWizard";

import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

export const XtWalletGuide = () => {
    const { t } = useTranslation();
    const { isUnsafeWebsite } = useAppContext();
    const isWalletConnected = useAppSelector(selectIsWalletConnected);

    const unsafeSiteContent = (
        <Alert severity="warning">
            <AlertTitle>{t("warning")}</AlertTitle>
            {t("websiteMustBeHttps")}
        </Alert>
    );

    const walletSetupContent = isWalletConnected ? (
        <JoinPoolWizard />
    ) : (
        <Grid item container direction="column">
            <Typography align="center" gutterBottom variant="h6">
                {t("tryTheXtWallet")}
            </Typography>

            <Button
                variant="contained"
                onClick={requestWalletConnection}
                startIcon={<AccountBalanceWalletIcon />}
                sx={{ color: "white", textTransform: "none" }}
            >
                {t("connectWallet")}
            </Button>
        </Grid>
    );

    return (
        <Grid
            container
            direction="column"
            sx={{
                px: 2,
                maxWidth: 550,
                mx: "auto",
            }}
        >
            <AppBar
                position="static"
                sx={{
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    bgcolor: "background.paper",
                    mb: 2,
                    padding: 2,
                }}
            >
                {isUnsafeWebsite ? unsafeSiteContent : walletSetupContent}
            </AppBar>
        </Grid>
    );
};
