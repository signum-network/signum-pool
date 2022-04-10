import { WelcomeSection } from "./sections/WelcomeSection";
import { PoolInfo } from "./sections/PoolInfo";
import { BookmarkedMiner } from "./sections/BookmarkedMiner";

import Grid from "@mui/material/Grid";

export const HomePage = () => {
    return (
        <Grid container direction="column">
            <WelcomeSection />
            <PoolInfo />
            <BookmarkedMiner />
        </Grid>
    );
};
