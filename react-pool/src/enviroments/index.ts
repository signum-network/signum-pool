import * as devProperties from "./enviroment.dev";
import * as prodProperties from "./enviroment.prod";

const isDevelopmentMode = process.env.NODE_ENV === "development";

const {
    NetworkName,
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

const isTestNet = NetworkName === "Signum-TESTNET";

export {
    isDevelopmentMode,
    isTestNet,
    poolName,
    dAppName,
    NetworkName,
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
