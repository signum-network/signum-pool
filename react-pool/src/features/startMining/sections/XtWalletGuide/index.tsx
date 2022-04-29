import { useTranslation } from "react-i18next";
import { requestWalletConnection } from "../../../../app/utils/requestWalletConnection";
import { useAppSelector } from "../../../../states/hooks";
import { selectIsWalletConnected } from "../../../../states/appState";

import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export const XtWalletGuide = () => {
    const { t } = useTranslation();
    const isWalletConnected = useAppSelector(selectIsWalletConnected);

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
                {isWalletConnected ? (
                    <Typography align="center">Wallet is connected!</Typography>
                ) : (
                    <Button
                        variant="contained"
                        onClick={requestWalletConnection}
                    >
                        Connect!
                    </Button>
                )}
            </AppBar>
        </Grid>
    );
};
