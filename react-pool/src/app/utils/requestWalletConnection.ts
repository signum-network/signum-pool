export const requestWalletConnection = () => {
    window.dispatchEvent(new Event("connect-wallet"));
};

export const requestWalletDisconnection = () => {
    window.dispatchEvent(new Event("disconnect-wallet"));
};
