import * as devProperties from "./enviroment.dev";
import * as prodProperties from "./enviroment.prod";

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
} = isTestNet ? devProperties : prodProperties;

export {
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
