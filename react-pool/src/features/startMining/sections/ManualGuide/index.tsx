import { useTranslation } from "react-i18next";
import { openExternalUrl } from "../../../../app/utils/functions/stringMethods";
import { asRSAddress } from "../../../../app/utils/functions/accountAddress";
import { SpecificRow } from "../../../../app/components/Tables/components/SpecificRow";
import { useAppSelector } from "../../../../states/hooks";
import { selectPoolConfig } from "../../../../states/poolConfigState";
import { miningUrl, walletUrl } from "../../../../enviroments";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import LanguageIcon from "@mui/icons-material/Language";

export const ManualGuide = () => {
    const { t, i18n } = useTranslation();
    const { resolvedLanguage } = i18n;
    const { poolAccount } = useAppSelector(selectPoolConfig);

    const openMiningGuide = () => {
        let url = "";

        switch (resolvedLanguage) {
            case "es":
                url =
                    "https://medium.com/signum-network/c%C3%B3mo-empezar-a-minar-signa-con-su-disco-duro-tutorial-completo-%EF%B8%8F-511ae600dec9";
                break;

            default:
                url = "https://www.signum.network/mining.html";
                break;
        }

        openExternalUrl(url);
    };

    const openBtdexWallet = () => openExternalUrl("https://btdex.trade/");
    const openOnlineWallet = () => openExternalUrl(walletUrl);
    const openPhoenixWallet = () =>
        openExternalUrl("https://phoenix-wallet.rocks/");

    const btnStyling = { color: "white", textTransform: "none" };

    return (
        <Grid container direction="column">
            <Grid item px={2} mb={2}>
                <Paper
                    elevation={4}
                    sx={{
                        width: "100%",
                        px: 2,
                        py: 1,
                        maxWidth: 525,
                        mx: "auto",
                        background: "#121212",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        color: "white",
                    }}
                >
                    <Typography align="center" sx={{ whiteSpace: "pre-line" }}>
                        {t("manualJoinOptionGuideTitle")} ❤️
                    </Typography>

                    <Typography
                        align="center"
                        onClick={openMiningGuide}
                        sx={{ cursor: "pointer" }}
                    >
                        <u>{t("manualJoinOptionGuideSecondTitle")}</u>
                    </Typography>
                </Paper>
            </Grid>

            <Grid item px={2}>
                <SpecificRow title={t("manualOptionFirstStepTitle")} bigTitle>
                    <Typography sx={{ whiteSpace: "pre-line", mb: 2 }}>
                        {t("manualOptionFirstStepDescription")}
                    </Typography>

                    <Grid container item spacing={2} mb={1}>
                        <Grid item>
                            <Button
                                startIcon={<AccountBalanceWalletIcon />}
                                variant="contained"
                                color="primary"
                                sx={btnStyling}
                                onClick={openPhoenixWallet}
                            >
                                Phoenix Wallet
                            </Button>
                        </Grid>

                        <Grid item>
                            <Button
                                startIcon={<SelectAllIcon />}
                                variant="contained"
                                color="error"
                                sx={btnStyling}
                                onClick={openBtdexWallet}
                            >
                                BTDEX
                            </Button>
                        </Grid>

                        <Grid item>
                            <Button
                                startIcon={<LanguageIcon />}
                                variant="contained"
                                color="secondary"
                                sx={btnStyling}
                                onClick={openOnlineWallet}
                            >
                                {t("onlineWallet")}
                            </Button>
                        </Grid>
                    </Grid>

                    <Typography color="textSecondary">
                        {t("manualOptionFirstStepReminder")}
                    </Typography>
                </SpecificRow>

                <SpecificRow title={t("manualOptionSecondStepTitle")} bigTitle>
                    <Typography gutterBottom>
                        {t("manualOptionSecondStepDescription")}
                    </Typography>

                    {poolAccount && (
                        <Typography gutterBottom variant="h6">
                            {asRSAddress(poolAccount)}
                        </Typography>
                    )}

                    <Typography color="textSecondary">
                        {t("manualOptionSecondStepReminder")}
                    </Typography>
                </SpecificRow>

                <SpecificRow title={t("manualOptionThirdStepTitle")} bigTitle>
                    <Typography>
                        {t("manualOptionThirdStepDescription")}
                    </Typography>
                </SpecificRow>

                <SpecificRow title={t("manualOptionForthStepTitle")} bigTitle>
                    <Typography gutterBottom>
                        {t("manualOptionForthStepDescription")}
                    </Typography>

                    {miningUrl && (
                        <Typography gutterBottom variant="h6">
                            {miningUrl}
                        </Typography>
                    )}

                    <Typography color="textSecondary">
                        {t("manualOptionForthStepReminder")}
                    </Typography>
                </SpecificRow>
            </Grid>
        </Grid>
    );
};
