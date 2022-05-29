import { t } from "i18next";
import { useEffect, useRef } from "react";
import {
    ExtensionWalletError,
    GenericExtensionWallet,
    WalletConnection,
} from "@signumjs/wallets";
import { useAppContext } from "../../hooks/useAppContext";
import { useSnackbar } from "../../hooks/useSnackbar";
import { requestWalletConnection } from "../../utils/requestWalletConnection";
import { actions, selectIsWalletConnected } from "../../../states/appState";
import { useAppDispatch, useAppSelector } from "../../../states/hooks";

const rememberWalletConnectionKey = "rememberWalletConnection";

export const WalletInitializer = () => {
    const dispatch = useAppDispatch();
    const { Ledger, Wallet, DAppName } = useAppContext();
    const { showWarning } = useSnackbar();
    const {
        setIsWalletConnected,
        setWalletNodeHost,
        setWalletPublicKey,
        setSignTransactionModal,
        setWalletModal,
        setWalletWrongNetworkModal,
    } = actions;
    const isWalletConnected = useAppSelector(selectIsWalletConnected);
    const connectionRef = useRef<WalletConnection | null>(null);
    const rememberConnection = !!(
        localStorage.getItem(rememberWalletConnectionKey) &&
        localStorage.getItem(rememberWalletConnectionKey) === "yes"
    );

    const addRememberStatus = () =>
        localStorage.setItem(rememberWalletConnectionKey, "yes");

    const removeRememberStatus = () =>
        localStorage.removeItem(rememberWalletConnectionKey);

    const onWalletConnected = (connection: WalletConnection) => {
        dispatch(setIsWalletConnected(true));
        dispatch(setWalletNodeHost(connection.currentNodeHost));
        dispatch(setWalletPublicKey(connection.publicKey || ""));
        addRememberStatus();
    };

    useEffect(() => {
        let listener: any = null;

        const handleDisconnectWallet = () => {
            listener && listener.unlisten();
            connectionRef.current = null;
            dispatch(setIsWalletConnected(false));
            dispatch(setWalletNodeHost(""));
            dispatch(setWalletPublicKey(""));
            removeRememberStatus();
            Wallet.Extension = new GenericExtensionWallet();
        };

        const onNetworkChange = (args: any) => {
            if (args.networkName === Ledger.Network) {
                dispatch(setWalletNodeHost(args.networkHost));
                if (isWalletConnected) requestWalletConnection();
                return;
            }

            showWarning(t("xtWalletNetworkChangedWarning"));
        };

        const onAccountChange = (args: any) => {
            dispatch(setWalletPublicKey(args.accountPublicKey));
            showWarning(t("xtWalletAccountChangedWarning"));
        };

        const onPermissionOrAccountRemoval = () => {
            showWarning(t("xtWalletPermissionAccountRemovedWarning"));
            handleDisconnectWallet();
        };

        const handleExtensionErrors = (e: ExtensionWalletError) => {
            switch (e.name) {
                case "NotFoundWalletError":
                    dispatch(setWalletModal(true));
                    break;
                case "InvalidNetworkError":
                    dispatch(setWalletWrongNetworkModal(true));
                    break;
                case "NotGrantedWalletError":
                    showWarning(t("xtWalletActionDeclined"));
                    removeRememberStatus();
                    break;
                default:
                    // unexpected error
                    console.error(e);
                    break;
            }
        };

        const handleStartSigning = () => {
            dispatch(setSignTransactionModal(true));
        };

        const handleEndSigning = () => {
            dispatch(setSignTransactionModal(false));
        };

        const handleConnectWallet = async () => {
            if (connectionRef.current) return;

            try {
                const connection = await Wallet.Extension.connect({
                    appName: DAppName,
                    networkName: Ledger.Network,
                });

                onWalletConnected(connection);

                listener = connection.listen({
                    onNetworkChanged: onNetworkChange,
                    onAccountChanged: onAccountChange,
                    onPermissionRemoved: onPermissionOrAccountRemoval,
                    onAccountRemoved: onPermissionOrAccountRemoval,
                });

                connectionRef.current = connection;
            } catch (e) {
                if (e instanceof ExtensionWalletError) {
                    handleExtensionErrors(e);
                } else {
                    console.error(e);
                }
            }
        };

        window.addEventListener("connect-wallet", handleConnectWallet);
        window.addEventListener("disconnect-wallet", handleDisconnectWallet);
        window.addEventListener("wallet-sign-start", handleStartSigning);
        window.addEventListener("wallet-sign-end", handleEndSigning);

        if (rememberConnection) {
            requestWalletConnection();
        }

        return () => {
            listener && listener.unlisten();
            window.removeEventListener("connect-wallet", handleConnectWallet);
            window.removeEventListener(
                "disconnect-wallet",
                handleDisconnectWallet
            );
            window.removeEventListener("wallet-sign-start", handleStartSigning);
            window.removeEventListener("wallet-sign-end", handleEndSigning);
        };
    }, [rememberConnection]);

    return null;
};
