import { discordUrl, walletUrl } from "../../../enviroments";

import BarChartIcon from "@mui/icons-material/BarChart";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import DnsRoundedIcon from "@mui/icons-material/DnsRounded";
import GroupIcon from "@mui/icons-material/Group";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

interface LinkProps {
    label: string;
    url: string;
    icon: any;
    newWindow?: boolean;
}

export const Links: LinkProps[] = [
    { label: "home", url: "/", icon: <HomeRoundedIcon /> },
    {
        label: "poolInfo",
        url: "/pool-info",
        icon: <DnsRoundedIcon />,
    },
    {
        label: "miner_other",
        url: "/miners",
        icon: <GroupIcon />,
    },
    {
        label: "discord",
        url: discordUrl,
        icon: <QuestionAnswerIcon />,
        newWindow: true,
    },
];

export const NativeMenuLinks: LinkProps[] = [
    {
        label: "trading",
        url: "/trading-view",
        icon: <BarChartIcon />,
    },
    {
        label: "wallet",
        url: walletUrl,
        icon: <AccountBalanceWalletIcon />,
        newWindow: true,
    },
];
