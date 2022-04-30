import { useState, SyntheticEvent } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { WelcomeSection } from "./sections/WelcomeSection";
import { XtWalletGuide } from "./sections/XtWalletGuide";
import { ManualGuide } from "./sections/ManualGuide";

import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

enum miningInfoTabs {
    xtWallet = "xtWallet",
    manual = "manual",
}

export const StartMiningPage = () => {
    const { t } = useTranslation();

    const [currentTab, setCurrentTab] = useState<miningInfoTabs>(
        !isMobile ? miningInfoTabs.xtWallet : miningInfoTabs.manual
    );

    const handleChange = (event: SyntheticEvent, newValue: miningInfoTabs) =>
        setCurrentTab(newValue);

    const defaultContainerStyle = {
        px: { xs: 0, lg: 2 },
        pt: { xs: 0, lg: 2 },
        mb: 2,
        maxWidth: 800,
        mx: "auto",
    };

    return (
        <TabContext value={currentTab}>
            <WelcomeSection />

            <Grid
                container
                sx={{
                    px: 2,
                    maxWidth: 550,
                    mx: "auto",
                    mt: { xs: 0, lg: -4 },
                }}
            >
                {!isMobile && (
                    <AppBar
                        position="static"
                        sx={{
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 1,
                            bgcolor: "background.paper",
                            mb: 2,
                        }}
                    >
                        <TabList
                            onChange={handleChange}
                            variant="fullWidth"
                            scrollButtons="auto"
                        >
                            <Tab
                                icon={<AccountBalanceWalletIcon />}
                                iconPosition="start"
                                label={t("quickJoinOption")}
                                value={miningInfoTabs.xtWallet}
                            />

                            <Tab
                                icon={<AutoStoriesIcon />}
                                iconPosition="start"
                                label={t("manualJoinOption")}
                                value={miningInfoTabs.manual}
                            />
                        </TabList>
                    </AppBar>
                )}
            </Grid>

            {currentTab === miningInfoTabs.xtWallet && (
                <Grid container sx={defaultContainerStyle}>
                    <XtWalletGuide />
                </Grid>
            )}

            {currentTab === miningInfoTabs.manual && (
                <Grid container sx={defaultContainerStyle}>
                    <ManualGuide />
                </Grid>
            )}
        </TabContext>
    );
};
