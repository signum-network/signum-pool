import { useTranslation } from "react-i18next";
import { tradingEmbedsUrl } from "../../enviroments";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

export const TradingPage = () => {
    const { t } = useTranslation();
    const { mini, large } = tradingEmbedsUrl;

    return (
        <Grid
            container
            direction="column"
            px={2}
            maxWidth={1350}
            mx="auto"
            mt={6}
        >
            <Grid item>
                <Typography component="h1" variant="h4" gutterBottom>
                    {t("tradingViewer")}
                </Typography>
            </Grid>

            <Grid item mb={2}>
                <iframe
                    scrolling="no"
                    frameBorder={0}
                    title="Mini widget"
                    src={mini}
                    style={{
                        boxSizing: "border-box",
                        height: "calc(72px)",
                        width: "100%",
                    }}
                />
            </Grid>

            <Grid
                item
                mb={1}
                sx={{ height: { xs: "400px", md: "500px", xl: "60vh" } }}
            >
                <iframe
                    scrolling="no"
                    frameBorder={0}
                    title="Large widget"
                    // Shortened link
                    src={large}
                    style={{
                        boxSizing: "border-box",
                        height: "100%",
                        width: "100%",
                    }}
                />
            </Grid>
        </Grid>
    );
};
