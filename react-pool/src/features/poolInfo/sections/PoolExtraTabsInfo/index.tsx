import { useState } from "react";
import { useTranslation } from "react-i18next";
import { isMobile } from "react-device-detect";

import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import InfoIcon from "@mui/icons-material/Info";
import WidgetsIcon from "@mui/icons-material/Widgets";
import SettingsIcon from "@mui/icons-material/Settings";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";

enum poolInfoTabs {
    basicInfo = "basicInfo",
    blocksWon = "blocksWon",
    minerOptions = "minerOptions",
    topMiners = "topMiners",
}

export const PoolExtraTabsInfo = () => {
    const { t } = useTranslation();

    const [currentTab, setCurrentTab] = useState<poolInfoTabs>(
        poolInfoTabs.basicInfo
    );

    const handleChange = (
        event: React.SyntheticEvent,
        newValue: poolInfoTabs
    ) => setCurrentTab(newValue);

    const defaultContainerStyle = {
        maxWidth: 1000,
        mx: "auto",
        px: 2,
        mb: 2,
    };

    return (
        <TabContext value={currentTab}>
            <Grid container sx={defaultContainerStyle}>
                <AppBar
                    position="static"
                    sx={{
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 1,
                        bgcolor: "background.paper",
                    }}
                >
                    <TabList
                        onChange={handleChange}
                        variant={isMobile ? "scrollable" : "fullWidth"}
                        scrollButtons="auto"
                    >
                        <Tab
                            icon={<InfoIcon />}
                            iconPosition="start"
                            label="Item One"
                            value={poolInfoTabs.basicInfo}
                        />

                        <Tab
                            icon={<WidgetsIcon />}
                            iconPosition="start"
                            label="Item Two"
                            value={poolInfoTabs.blocksWon}
                        />

                        <Tab
                            icon={<SettingsIcon />}
                            iconPosition="start"
                            label="Item Three"
                            value={poolInfoTabs.minerOptions}
                        />

                        <Tab
                            icon={<LeaderboardIcon />}
                            iconPosition="start"
                            label="Item Four"
                            value={poolInfoTabs.topMiners}
                        />
                    </TabList>
                </AppBar>
            </Grid>

            <TabPanel value={poolInfoTabs.basicInfo}>Item One</TabPanel>
            <TabPanel value={poolInfoTabs.blocksWon}>Item Two</TabPanel>
            <TabPanel value={poolInfoTabs.minerOptions}>Item Three</TabPanel>
            <TabPanel value={poolInfoTabs.topMiners}>Item Four</TabPanel>
        </TabContext>
    );
};
