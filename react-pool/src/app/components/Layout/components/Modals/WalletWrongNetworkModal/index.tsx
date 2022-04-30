import { useTranslation } from "react-i18next";
import { isMobile } from "react-device-detect";
import { useAppContext } from "../../../../../hooks/useAppContext";
import { requestWalletConnection } from "../../../../../utils/requestWalletConnection";
import { useAppDispatch, useAppSelector } from "../../../../../../states/hooks";
import {
    actions,
    selectIsOpenWalletWrongNetworkModal,
} from "../../../../../../states/appState";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import NetworkIcon from "@mui/icons-material/Podcasts";

export const WalletWrongNetworkModal = () => {
    const { t } = useTranslation();
    const { Ledger } = useAppContext();
    const { setWalletWrongNetworkModal } = actions;
    const dispatch = useAppDispatch();
    const isOpen = useAppSelector(selectIsOpenWalletWrongNetworkModal);

    const handleClose = () => dispatch(setWalletWrongNetworkModal(false));

    const handleConnection = () => {
        requestWalletConnection();
        handleClose();
    };

    if (isMobile) return <></>;

    return (
        <Dialog
            onClose={handleClose}
            open={isOpen}
            sx={{ maxWidth: 500, mx: "auto" }}
        >
            <DialogTitle sx={{ textAlign: "center" }}>
                {t("xtWalletInvalidNetworkDialogTitle")}
            </DialogTitle>

            <DialogContent dividers>
                <DialogContentText sx={{ textAlign: "center" }}>
                    {t("xtWalletInvalidNetworkDialogHint")}
                </DialogContentText>

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                        textTransform: "none",
                        my: 1,
                        py: 1,
                        color: "#ffffff",
                    }}
                    startIcon={<AccountBalanceWalletIcon />}
                    onClick={handleConnection}
                >
                    {t("connectWallet")}
                </Button>

                <DialogContentText sx={{ textAlign: "center" }}>
                    {t("xtWalletChooseAnotherNetwork")}
                </DialogContentText>
            </DialogContent>

            <DialogContent>
                <Alert
                    severity="info"
                    icon={<NetworkIcon fontSize="inherit" />}
                    sx={{
                        mb: 1,
                        "& .MuiAlert-message": {
                            width: "100%",
                        },
                    }}
                >
                    <Box sx={{ textAlign: "center" }}>
                        <Typography variant="caption">
                            {t("xtWalletRequiredNetwork")}
                        </Typography>
                        <Box
                            sx={{
                                mt: 1,
                                border: 1,
                                borderRadius: 1,
                                borderColor: "divider",
                                textAlign: "center",
                            }}
                        >
                            <Typography variant="body1">
                                {Ledger.Network}
                            </Typography>
                        </Box>
                    </Box>
                </Alert>
            </DialogContent>
        </Dialog>
    );
};
