import { useRef } from "react";
import { Link } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { poolName } from "../../../../enviroments";
import { truncateText } from "../../../../app/utils/functions/stringMethods";

import { useAppSelector, useAppDispatch } from "../../../../states/hooks";
import {
    actions,
    selectBookmarkedMiner,
    selectIsDarkMode,
} from "../../../../states/appState";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";

export const WelcomeSection = () => {
    const { t } = useTranslation();
    const { setSearchMiner } = actions;
    const isDarkMode = useAppSelector(selectIsDarkMode);
    const bookmarkedMinerID = useAppSelector(selectBookmarkedMiner);
    const dispatch = useAppDispatch();
    const searchBoxRef = useRef(null);

    const onSubmit = (e: any) => {
        e.preventDefault();
        // @ts-ignore
        const value = searchBoxRef.current.value.trim();
        if (!value) return;

        dispatch(setSearchMiner(value));
    };

    return (
        <Grid container>
            <Paper
                sx={{
                    mb: 2,
                    width: "100%",
                    pb: 4,
                    pt: 5,
                    borderRadius: 0,
                    overflow: "hidden",
                }}
                variant={isDarkMode ? "elevation" : "outlined"}
            >
                <Typography
                    component="h1"
                    variant="h3"
                    align="center"
                    fontWeight={300}
                    width="100%"
                    sx={{ whiteSpace: "pre-line" }}
                >
                    {isMobile
                        ? truncateText(
                              t("welcomePoolMessage", { poolName }),
                              25
                          )
                        : poolName}
                </Typography>

                {!bookmarkedMinerID && (
                    <Grid container direction="column" alignItems="center">
                        <Grid item>
                            <Typography
                                align="center"
                                variant="h6"
                                fontWeight={400}
                                sx={{ whiteSpace: "pre-line" }}
                                gutterBottom
                            >
                                {t("welcomePoolMessageDescription")}
                            </Typography>
                        </Grid>

                        <Grid item>
                            <Link to="/start-mining">
                                <Typography
                                    color="primary"
                                    fontWeight={800}
                                    fontSize={18}
                                >
                                    {t("startMining")}
                                </Typography>
                            </Link>
                        </Grid>
                    </Grid>
                )}
            </Paper>

            <Grid
                container
                item
                mx="auto"
                maxWidth={600}
                sx={{ mt: { xs: 0, lg: -4 }, px: 2 }}
            >
                <Paper
                    component="form"
                    onSubmit={onSubmit}
                    elevation={5}
                    sx={{
                        width: "100%",
                        px: { xs: 1, lg: 2 },
                        py: 1,
                        display: "flex",
                        alignItems: "center",
                        border: 1,
                        borderColor: "divider",
                    }}
                >
                    <InputBase
                        inputRef={searchBoxRef}
                        sx={{
                            fontSize: { xs: 14, lg: 18 },
                            ml: 1,
                            flex: 1,
                        }}
                        placeholder={t("yourSignumAddressOrAccountName")}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            p: 1,
                            height: "100%",
                            borderRadius: 1,
                            color: "white",
                        }}
                        aria-label="search"
                    >
                        <SearchIcon fontSize="large" />
                    </Button>
                </Paper>
            </Grid>
        </Grid>
    );
};
