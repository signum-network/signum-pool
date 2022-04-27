import { useTranslation } from "react-i18next";
import { MinersList } from "../../app/components/Tables/MinersList";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

export const AllMiners = () => {
    const { t } = useTranslation();

    return (
        <Grid container direction="column">
            <Grid item>
                <Typography
                    component="h1"
                    variant="h4"
                    gutterBottom
                    sx={{
                        maxWidth: 1000,
                        mx: "auto",
                        px: 2,
                        mt: { xs: 5, lg: 8 },
                        mb: 2,
                    }}
                >
                    {t("minersList")}
                </Typography>
            </Grid>

            <Grid item px={2}>
                <MinersList />
            </Grid>
        </Grid>
    );
};
