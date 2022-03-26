import { useTranslation } from "react-i18next";
import { WelcomeSection } from "./sections/WelcomeSection";
import { PoolInfo } from "./sections/PoolInfo";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

export const HomePage = () => {
    const { t } = useTranslation();

    return (
        <Grid container direction="column">
            <WelcomeSection />
            <PoolInfo />
        </Grid>
    );
};
