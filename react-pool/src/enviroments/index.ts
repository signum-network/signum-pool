import * as devProperties from "./enviroment.dev";
import * as prodProperties from "./enviroment.prod";

const isDevelopmentMode = process.env.NODE_ENV === "development";

const isTestNet = process.env.NODE_ENV === "development";

const dAppNetwork = isTestNet ? "Signum-TESTNET" : "Signum";

const {
    poolName,
    dAppName,
    colors,
    poolNodeUrl,
    miningUrl,
    discordUrl,
    explorerUrl,
    faucetUrl,
    walletUrl,
    signumPriceUrl,
    tradingEmbedsUrl,
    googleTrackingID,
    additionalLinks,
} = isDevelopmentMode ? devProperties : prodProperties;

export {
    isDevelopmentMode,
    isTestNet,
    poolName,
    dAppName,
    dAppNetwork,
    colors,
    poolNodeUrl,
    miningUrl,
    discordUrl,
    explorerUrl,
    faucetUrl,
    walletUrl,
    signumPriceUrl,
    tradingEmbedsUrl,
    googleTrackingID,
    additionalLinks,
};
