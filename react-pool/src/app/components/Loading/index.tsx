import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";

export const Loading = () => (
    <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100vh" }}
    >
        <CircularProgress size={110} />
    </Grid>
);
