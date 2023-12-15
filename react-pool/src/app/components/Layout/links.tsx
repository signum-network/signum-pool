import { ReactElement } from "react";
import { xtWalletStoreUrl } from "../../utils/xtWalletStoreUrl";
import { discordUrl, walletUrl } from "../../../enviroments";

import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import DnsRoundedIcon from "@mui/icons-material/DnsRounded";
import GroupIcon from "@mui/icons-material/Group";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import ExtensionIcon from "@mui/icons-material/Extension";

interface LinkProps {
    label: string;
    url: string;
    icon: ReactElement;
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
        label: "Signum XT Wallet",
        url: xtWalletStoreUrl,
        icon: <ExtensionIcon />,
        newWindow: true,
    },
    {
        label: "wallet",
        url: walletUrl,
        icon: <AccountBalanceWalletIcon />,
        newWindow: true,
    },
];
