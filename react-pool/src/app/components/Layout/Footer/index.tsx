import { useTranslation } from "react-i18next";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

export const Footer = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <Grid
            container
            mt={4}
            mb={1}
            py={2}
            sx={{ borderTop: 1, borderColor: "divider" }}
            justifyContent="center"
            alignItems="center"
        >
            <Typography variant="body2" align="center">
                <Typography
                    component="a"
                    href="https://github.com/signum-network/signum-pool"
                    target="_blank"
                    rel="noreferrer"
                >
                    <u>Github repo</u>
                </Typography>{" "}
                - {t("footerLabel")} @ (2019-
                {currentYear})
            </Typography>
        </Grid>
    );
};
