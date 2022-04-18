import { MiningInfo } from "./sections/MiningInfo";
import { PoolExtraTabsInfo } from "./sections/PoolExtraTabsInfo";
import Grid from "@mui/material/Grid";

export const PoolInfoPage = () => (
    <Grid container direction="column">
        <MiningInfo />
        <PoolExtraTabsInfo />
    </Grid>
);
