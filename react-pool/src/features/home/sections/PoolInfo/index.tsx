import { useTranslation } from "react-i18next";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

export const PoolInfo = () => {
    const { t } = useTranslation();

    return (
        <Grid
            container
            mx="auto"
            maxWidth={760}
            mt={2}
            p={2}
            pb={0}
            sx={{ borderBottom: 1, borderColor: "divider" }}
            direction="row"
            alignItems="center"
        >
            <PoolStat title="Pool Physical" value="7.853 PiB" />
            <PoolStat title="Pool Physical" value="7.853 PiB" />
            <PoolStat title="Pool Physical" value="7.853 PiB" />
            <PoolStat title="Pool Physical" value="7.853 PiB" />
            <PoolStat
                title="Pool Physical"
                value="27.469 PiB + 3,580.00 SIGNA/TiB"
                fullLength
            />
        </Grid>
    );
};

interface PoolStatProps {
    title: string;
    value: string;
    fullLength?: boolean;
    loading?: boolean;
}

export const PoolStat = ({
    title,
    value,
    fullLength = false,
    loading = false,
}: PoolStatProps) => {
    return (
        <Grid
            item
            sx={{
                width: fullLength ? "100%" : { xs: "50%", lg: "25%" },
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                mb: 2,
            }}
        >
            <Grid item container>
                <Typography
                    variant="h6"
                    color="textSecondary"
                    gutterBottom
                    align="center"
                    width="100%"
                >
                    {title}
                </Typography>
            </Grid>

            {loading && (
                <Grid item sx={{ justifyContent: "center", display: "flex" }}>
                    <CircularProgress size={33} />
                </Grid>
            )}

            {!loading && (
                <Grid item>
                    <Typography
                        variant="h5"
                        gutterBottom
                        width="100%"
                        align="center"
                        fontWeight={800}
                    >
                        {value}
                    </Typography>
                </Grid>
            )}
        </Grid>
    );
};
