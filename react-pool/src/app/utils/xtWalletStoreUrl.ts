import { isFirefox } from "react-device-detect";

export const xtWalletStoreUrl = isFirefox
    ? "https://addons.mozilla.org/en-US/firefox/addon/signum-xt-wallet/"
    : "https://chrome.google.com/webstore/detail/signum-xt-wallet/kdgponmicjmjiejhifbjgembdcaclcib";
