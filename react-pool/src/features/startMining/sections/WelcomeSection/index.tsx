import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../../states/hooks";
import { selectIsDarkMode } from "../../../../states/appState";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

export const WelcomeSection = () => {
    const { t } = useTranslation();
    const isDarkMode = useAppSelector(selectIsDarkMode);

    return (
        <Grid container>
            <Paper
                sx={{
                    mb: 2,
                    width: "100%",
                    pt: 5,
                    pb: 4,
                    borderRadius: 0,
                    overflow: "hidden",
                }}
                variant={isDarkMode ? "elevation" : "outlined"}
            >
                <Typography
                    component="h1"
                    variant="h3"
                    align="center"
                    fontWeight={300}
                    width="100%"
                    sx={{ whiteSpace: "pre-line" }}
                >
                    {t("quickJoinGuide")}
                </Typography>

                <Grid container direction="column" alignItems="center">
                    <Grid item>
                        <Typography
                            align="center"
                            variant="h6"
                            fontWeight={400}
                            sx={{ whiteSpace: "pre-line" }}
                            gutterBottom
                        >
                            {t("quickJoinGuideDescription")}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    );
};
