import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { NavigationLinks } from "./components/NavigationLinks";
import { SocialMedia } from "./components/SocialMedia";
import { useAppSelector, useAppDispatch } from "../../../../states/hooks";
import { actions, selectIsOpenSidebar } from "../../../../states/appState";
import { ToggleLanguageBtn } from "../components/ToggleLanguageBtn";
import { ToggleThemeBtn } from "../components/ToggleThemeBtn";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";

export const Sidebar = () => {
    const { t } = useTranslation();
    const { setIsOpenSidebar } = actions;
    const dispatch = useAppDispatch();
    const isOpenSidebar = useAppSelector(selectIsOpenSidebar);
    const closeSideDrawer = () => dispatch(setIsOpenSidebar(false));

    const bottomStyling = {
        borderBottom: 1,
        borderColor: "divider",
    };

    return (
        <Drawer anchor="top" open={isOpenSidebar} onClose={closeSideDrawer}>
            <Grid container sx={{ height: "100%", p: 2 }} role="presentation">
                <Grid
                    item
                    container
                    direction="column"
                    justifyContent="flex-end"
                    alignItems="flex-start"
                    pb={1}
                    mb={2}
                    sx={bottomStyling}
                >
                    <Grid
                        item
                        container
                        direction="row"
                        alignItems="center"
                        mb={2}
                        justifyContent="space-between"
                    >
                        <Grid item container justifyContent="flex-start" xs={8}>
                            <Grid item>
                                <ToggleLanguageBtn />
                            </Grid>

                            <Grid item>
                                <ToggleThemeBtn />
                            </Grid>
                        </Grid>

                        <Grid item container justifyContent="flex-end" xs={4}>
                            <IconButton
                                edge="start"
                                aria-label="close"
                                size="medium"
                                onClick={closeSideDrawer}
                                sx={{ border: 1, borderColor: "divider" }}
                            >
                                <CloseIcon style={{ fontSize: 37 }} />
                            </IconButton>
                        </Grid>
                    </Grid>

                    <Grid item width="100%">
                        <Typography
                            align="center"
                            variant="body1"
                            color="textPrimary"
                            sx={{ width: "100%", whiteSpace: "pre-line" }}
                        >
                            {t("sideBarTitle")}
                        </Typography>
                    </Grid>
                </Grid>

                <Grid item container sx={bottomStyling}>
                    <NavigationLinks />
                </Grid>

                <Grid item container sx={bottomStyling}>
                    <Link to="/start-mining" style={{ width: "100%" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={closeSideDrawer}
                            sx={{
                                textTransform: "none",
                                px: 5,
                                py: 1.2,
                                borderColor: "divider",
                                fontSize: 16,
                                borderRadius: 1,
                                color: "white",
                                my: 2,
                            }}
                        >
                            {t("startMining")}
                        </Button>
                    </Link>
                </Grid>

                <SocialMedia />
            </Grid>
        </Drawer>
    );
};
