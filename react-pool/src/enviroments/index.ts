import * as devProperties from "./enviroment.dev";
import * as prodProperties from "./enviroment.prod";

const isDevelopmentMode = process.env.NODE_ENV === "development";

const isTestNet = process.env.NODE_ENV === "development";

const {
    poolName,
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
    isTestNet,
    poolName,
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
