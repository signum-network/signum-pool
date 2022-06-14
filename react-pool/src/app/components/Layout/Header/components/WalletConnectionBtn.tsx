import { useMemo, useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "../../../../../states/hooks";
import { useAccount } from "../../../../hooks/useAccount";
import { useAppContext } from "../../../../hooks/useAppContext";
import {
    requestWalletConnection,
    requestWalletDisconnection,
} from "../../../../utils/requestWalletConnection";
import {
    actions,
    selectIsWalletConnected,
} from "../../../../../states/appState";
import { viewAccountInExplorer } from "../../../../utils/explorer";

// @ts-ignore
import hashicon from "hashicon";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LogoutIcon from "@mui/icons-material/Logout";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";

export const WalletConnectionBtn = () => {
    const { t } = useTranslation();
    const { accountId } = useAccount();
    const { isUnsafeWebsite } = useAppContext();
    const { setSearchMiner } = actions;
    const dispatch = useAppDispatch();
    const isWalletConnected = useAppSelector(selectIsWalletConnected);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        if (!isWalletConnected || !accountId) {
            requestWalletConnection();
            return;
        }

        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => setAnchorEl(null);

    const iconUrl = useMemo(() => {
        if (!accountId) return "";
        return hashicon(accountId, { size: 36 }).toDataURL();
    }, [accountId]);

    const searchMyMiner = () => {
        if (accountId) dispatch(setSearchMiner(accountId));
    };

    const seeMinerInExplorer = () => {
        if (accountId) viewAccountInExplorer(accountId);
    };

    const iconStyling = { margin: { xs: 0.5, md: 0 } };
    const menuOptionStyling = { alignItems: "flex-start", py: 1.7 };

    if (isUnsafeWebsite) return null;

    return (
        <Fragment>
            <Tooltip
                title={`${t(
                    isWalletConnected ? "option_other" : "connectWallet"
                )}`}
                arrow
            >
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{
                        marginLeft: 1.5,
                        border: "1px solid",
                        borderColor: "divider",
                        p: 1,
                    }}
                    onClick={handleClick}
                >
                    {isWalletConnected ? (
                        <img
                            width={24}
                            height={24}
                            src={iconUrl}
                            alt="User avatar"
                        />
                    ) : (
                        <AccountBalanceWalletIcon sx={{ ...iconStyling }} />
                    )}
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={isMenuOpen}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        "&:before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <MenuItem onClick={searchMyMiner} sx={{ ...menuOptionStyling }}>
                    <ListItemIcon>
                        <AccountBoxIcon />
                    </ListItemIcon>
                    <ListItemText primary={t("viewMinerDetails")} />
                </MenuItem>

                <MenuItem
                    onClick={seeMinerInExplorer}
                    sx={{ ...menuOptionStyling }}
                >
                    <ListItemIcon>
                        <TravelExploreIcon />
                    </ListItemIcon>
                    <ListItemText primary={t("viewAccountInExplorer")} />
                </MenuItem>

                <MenuItem
                    onClick={requestWalletDisconnection}
                    sx={{ ...menuOptionStyling }}
                >
                    <ListItemIcon>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary={t("signOut")} />
                </MenuItem>
            </Menu>
        </Fragment>
    );
};
