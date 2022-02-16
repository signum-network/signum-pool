import LinkIcon from "@mui/icons-material/Link";
import BarChartIcon from "@mui/icons-material/BarChart";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

interface LinkProps {
    label: string;
    url: string;
    icon: any;
    newWindow?: boolean;
}

export const Links: LinkProps[] = [
    { label: "home", url: "/", icon: <LinkIcon /> },
    {
        label: "poolInfo",
        url: "/pool-info",
        icon: <LinkIcon />,
    },
    {
        label: "miner_other",
        url: "/miners",
        icon: <LinkIcon />,
    },
    {
        label: "discord",
        url: "https://discord.com/invite/aKbdwJ9",
        icon: <LinkIcon />,
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
        url: "https://europe3.testnet.signum.network",
        icon: <AccountBalanceWalletIcon />,
        newWindow: true,
    },
];
