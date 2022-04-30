import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import SvgIcon from "@mui/material/SvgIcon";

import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const Custom404 = () => {
    const { t } = useTranslation();

    return (
        <Grid
            container
            maxWidth={1000}
            mx="auto"
            my={8}
            direction="column"
            justifyContent="center"
            alignItems="center"
        >
            <Grid item width="80%">
                <NotFoundIcon />
            </Grid>

            <Grid item>
                <Typography component="h1" variant="h2" align="center">
                    {t("notFoundPageFirstLine")}
                </Typography>

                <Typography
                    variant="h6"
                    align="center"
                    color="textSecondary"
                    gutterBottom
                >
                    {t("notFoundPageSecondLine")}
                </Typography>

                <Link to="/">
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ color: "white" }}
                    >
                        {t("notFoundPageGoHome")}
                    </Button>
                </Link>
            </Grid>
        </Grid>
    );
};

const NotFoundIcon = () => (
    <SvgIcon
        color="primary"
        sx={{ width: "100%", height: { xs: 100, xl: 200 } }}
        viewBox="0 0 197.9 73.4"
    >
        <path d="M41.9,42.8H49v9.7h-7.1v13.6H29.4V52.5H3.8L3.2,45l26-41.6h12.7V42.8z M14.9,42.8h14.5V20.2l-0.3-0.1l-1,1.8L14.9,42.8z" />

        <path d="M188.1,42.8h7.1v9.7h-7.1v13.6h-12.5V52.5H150l-0.6-7.5l26-41.6h12.7L188.1,42.8z M161.1,42.8h14.4V20.2l-0.3-0.1l-1,1.8L161.1,42.8z" />

        <path
            d="M100.7,70c-18.3,0-33.1-14.8-33.1-33.1S82.4,3.8,100.7,3.8s33.1,14.8,33.1,33.1c0,18.3-14.8,33.1-33,33.1C100.7,70,100.7,70,100.7,70z M100.7,8.9c-15.5,0-28,12.5-28,28s12.5,28,28,28s28-12.5,28-28C128.6,21.4,116.1,8.9,100.7,8.9
	L100.7,8.9z"
        />

        <path
            d="M101.2,40.8c6.5,0.3,11.3,3,14.3,8.7c0.3,0.4,0.4,1,0.4,1.5c-0.1,0.8-0.8,1.5-1.6,1.6c-0.8,0.1-1.7-0.3-2-1.1c-0.5-1.2-1.2-2.2-2.1-3.1c-2.3-2.5-5.7-3.9-9.1-3.7c-3.6,0-7.1,1.6-9.3,4.5c-0.5,0.8-1,1.6-1.4,2.4c-0.4,0.8-1.3,1.2-2.2,1
	c-0.9-0.2-1.5-1.1-1.3-2c0.1-0.4,0.2-0.7,0.4-1.1c2.1-4.4,6.2-7.4,10.9-8.3C99.1,41,100.2,40.9,101.2,40.8z"
        />

        <path
            d="M109.7,24.4c3,0,5.4,2.3,5.5,5.3c0.1,0.9-0.6,1.6-1.4,1.7c0,0,0,0-0.1,0c-0.9,0.1-1.6-0.6-1.7-1.4c0,0,0-0.1,0-0.1c0-0.9-0.5-1.7-1.3-2.1c-0.7-0.4-1.6-0.3-2.3,0.2c-0.6,0.4-1,1.2-1,1.9c-0.1,0.9-0.8,1.5-1.7,1.4
	c-0.8-0.1-1.4-0.7-1.4-1.4c0-0.3,0-0.7,0.1-1C104.8,26.3,107,24.4,109.7,24.4z"
        />

        <path
            d="M87,29.6c0.2-3,2.7-5.3,5.7-5.1c2.8,0.2,5.1,2.4,5.1,5.3c0,0.9-0.6,1.6-1.5,1.6c-0.9,0-1.6-0.6-1.6-1.5c0-1.1-0.9-2.1-2-2.3c-1.1-0.2-2.2,0.5-2.5,1.5c-0.1,0.2-0.1,0.5-0.1,0.7c0.1,0.9-0.5,1.6-1.4,1.7c-0.9,0.1-1.6-0.5-1.7-1.4
	C86.9,29.9,87,29.7,87,29.6z"
        />
    </SvgIcon>
);

export default Custom404;
