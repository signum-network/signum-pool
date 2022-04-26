import { useState } from "react";
import { useTranslation } from "react-i18next";
import { isMobile } from "react-device-detect";
import { PoolBasicInfo } from "../../../../app/components/Tables/PoolBasicInfo";
import { PoolWonBlocks } from "../../../../app/components/Tables/PoolWonBlocks";

import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
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
        mb: 2,
        maxWidth: 1000,
        mx: "auto",
        px: 2,
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
                            label={t("basicInfo")}
                            value={poolInfoTabs.basicInfo}
                        />

                        <Tab
                            icon={<WidgetsIcon />}
                            iconPosition="start"
                            label={t("blockWon_other")}
                            value={poolInfoTabs.blocksWon}
                        />

                        <Tab
                            icon={<SettingsIcon />}
                            iconPosition="start"
                            label={t("minerOption_other")}
                            value={poolInfoTabs.minerOptions}
                        />

                        <Tab
                            icon={<LeaderboardIcon />}
                            iconPosition="start"
                            label={t("topTenMiners")}
                            value={poolInfoTabs.topMiners}
                        />
                    </TabList>
                </AppBar>
            </Grid>

            {currentTab === poolInfoTabs.basicInfo && (
                <Grid container sx={defaultContainerStyle}>
                    <PoolBasicInfo />
                </Grid>
            )}

            {currentTab === poolInfoTabs.blocksWon && (
                <Grid container sx={defaultContainerStyle}>
                    <PoolWonBlocks />
                </Grid>
            )}

            {currentTab === poolInfoTabs.minerOptions && (
                <Grid container sx={defaultContainerStyle}>
                    Item Three
                </Grid>
            )}

            {currentTab === poolInfoTabs.topMiners && (
                <Grid container>Item topMiners</Grid>
            )}
        </TabContext>
    );
};
