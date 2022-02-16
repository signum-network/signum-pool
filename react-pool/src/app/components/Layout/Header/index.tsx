import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../../../states/hooks";
import { selectIsDarkMode } from "../../../../states/appState";
import { Links, NativeMenuLinks } from "../links";
import { NavigationMenu } from "./components/NavigationMenu";
import {
    truncateText,
    openExternalUrl,
} from "../../../utils/functions/stringMethods";

import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import styles from "./header.module.css";

export const Header = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const isDarkMode = useAppSelector(selectIsDarkMode);
    const imgLogo = `/assets/${isDarkMode ? "light" : "dark"}Logo.png`;

    return (
        <AppBar
            position="sticky"
            className={isDarkMode ? styles.darkHeader : styles.lightHeader}
            sx={{
                top: 0,
                transition: "top 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                backdropFilter: "blur(20px)",
                zIndex: 100,
            }}
        >
            <Toolbar
                className={styles.toolbar}
                sx={{
                    flexGrow: 1,
                    width: "100%",
                    maxWidth: "1600px",
                    mx: "auto",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Grid
                    item
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "stretch",
                        justifyContent: "flex-start",
                    }}
                >
                    <Grid
                        container
                        item
                        sx={{
                            width: "auto",
                            pr: 2,
                            mr: 2,
                            borderRight: 1,
                            borderColor: "divider",
                        }}
                    >
                        <Link
                            to="/"
                            className={styles.linkContainer}
                            title="Go home"
                        >
                            <img src={imgLogo} alt="Pool Logo" />
                            <Typography variant="h6">
                                {truncateText("Pool.SignumCoin.ro", 20)}
                            </Typography>
                        </Link>
                    </Grid>

                    <Grid
                        container
                        item
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        sx={{ width: "auto" }}
                    >
                        {Links.map((link) => {
                            const visitPage = () => {
                                if (link.newWindow) {
                                    return openExternalUrl(link.url);
                                }
                                navigate(link.url);
                            };

                            const isActiveLink = location.pathname === link.url;

                            return (
                                <Grid item key={link.url}>
                                    <Button
                                        onClick={visitPage}
                                        color={
                                            isActiveLink ? "primary" : "inherit"
                                        }
                                        sx={{
                                            textTransform: "none",
                                            px: 2,
                                            fontSize: 15,
                                            border: 1,
                                            borderColor: isActiveLink
                                                ? "primary"
                                                : "transparent",
                                        }}
                                    >
                                        {t(link.label)}
                                    </Button>
                                </Grid>
                            );
                        })}

                        <NavigationMenu />
                    </Grid>
                </Grid>

                <Grid item>RIGHT SIDE</Grid>
            </Toolbar>
        </AppBar>
    );
};
