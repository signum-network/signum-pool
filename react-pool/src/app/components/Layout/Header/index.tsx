import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { poolName } from "../../../../enviroments";
import { useAppSelector, useAppDispatch } from "../../../../states/hooks";
import { actions, selectIsDarkMode } from "../../../../states/appState";
import { Links } from "../links";
import { NavigationMenu } from "./components/NavigationMenu";
import { ToggleLanguageBtn } from "../components/ToggleLanguageBtn";
import { ToggleThemeBtn } from "../components/ToggleThemeBtn";
import {
    truncateText,
    openExternalUrl,
} from "../../../utils/functions/stringMethods";

import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import styles from "./header.module.css";

export const Header = () => {
    const { t } = useTranslation();
    const { setIsOpenSidebar } = actions;
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();

    const isDarkMode = useAppSelector(selectIsDarkMode);
    const imgLogo = `/assets/${isDarkMode ? "light" : "dark"}Logo.png`;

    const shownContentDesktop = {
        width: "auto",
        display: { xs: "none", lg: "flex" },
    };

    const shownContentMobile = {
        width: "auto",
        display: { xs: "flex", lg: "none" },
    };

    const openSideDrawer = () => dispatch(setIsOpenSidebar(true));

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
                            borderRight: { xs: 0, lg: 1 },
                            borderColor: { xs: "transparent", lg: "divider" },
                        }}
                    >
                        <Link
                            to="/"
                            className={styles.linkContainer}
                            title="Go home"
                        >
                            <img src={imgLogo} alt="Pool Logo" />
                            <Typography variant="h6">
                                {truncateText(poolName, 20)}
                            </Typography>
                        </Link>
                    </Grid>

                    <Grid
                        container
                        item
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        sx={shownContentDesktop}
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

                <Grid item>
                    <Grid
                        container
                        item
                        direction="row"
                        alignItems="center"
                        columnSpacing={2}
                        sx={shownContentDesktop}
                    >
                        <Grid item>
                            <Stack direction="row" spacing={1}>
                                <ToggleLanguageBtn />
                                <ToggleThemeBtn />
                            </Stack>
                        </Grid>

                        <Grid item>
                            <Link to="/start-mining">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        textTransform: "none",
                                        px: 5,
                                        py: 1.2,
                                        borderColor: "divider",
                                        fontSize: 16,
                                        borderRadius: 1,
                                        color: "white",
                                    }}
                                >
                                    {t("startMining")}
                                </Button>
                            </Link>
                        </Grid>
                    </Grid>

                    <Grid
                        item
                        sx={{
                            ...shownContentMobile,
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <IconButton
                            onClick={openSideDrawer}
                            edge="start"
                            sx={{ border: 1, borderColor: "divider", my: 1 }}
                        >
                            <MenuIcon fontSize="large" />
                        </IconButton>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    );
};
