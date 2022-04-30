import { useTranslation } from "react-i18next";
import { BookMarkedMiner as BookMarkedMinerTable } from "../../../../app/components/Tables/BookMarkedMiner";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

export const BookmarkedMiner = () => {
    const { t } = useTranslation();

    return (
        <Grid
            container
            mx="auto"
            maxWidth={760}
            mt={1}
            p={2}
            direction="row"
            alignItems="center"
        >
            <Typography variant="h6" gutterBottom>
                {t("bookmarkedMiner")}
            </Typography>

            <BookMarkedMinerTable />
        </Grid>
    );
};
