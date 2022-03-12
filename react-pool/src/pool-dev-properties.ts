// ########################################
// # DO NOT PUT SENSIBLE INFORMATION HERE #
// # CLIENT SIDE VARIABLES                #
// ########################################

// The name of the pool
export const poolName = "Future Pool";

// The URL of the pool in order to consume its API endpoints
export const poolNodeUrl = "https://signumpool.com";

// The URL miners should use in order to send deadlines
export const miningUrl = "http://testnet.btfg.space:9000";

// The URL of the discord
export const discordUrl = "https://discord.gg/VagTTaKM2j";

// The explorer link
export const explorerUrl = "https://explorer.signum.network";

// The faucet link
export const faucetUrl = "http://nivbox.co.uk:7777";

// The online wallet link
export const walletUrl = "https://europe3.testnet.signum.network";

// Signum price API
export const signumPriceUrl =
    "https://min-api.cryptocompare.com/data/price?fsym=SIGNA&tsyms=USD";

// Trading embed links
export const tradingEmbedsUrl = {
    mini: "https://bit.ly/2UEd4RB",
    large: "https://bit.ly/3A5BIep",
};

// Google Analytics Tracking id
export const googleTrackingID = "";

// Pool palette
export const colors = {
    primary: { main: "#0099ff", light: "#5fb8ff", dark: "#0066ff" },
    secondary: { main: "#183173", light: "#274187", dark: "#021851" },
    graph: "#2451B7",
};

// Extra url's
export const extraRoutes = JSON.parse(`{
    "links": [{"label":"Example #1 (Signum)", "url":"https://www.signum.network", "newTab": true  },
     {"label":"Example #2 (BTDEX)", "url":"https://btdex.trade", "newTab": true  },
     {"label":"Example #3 (Local page)", "url":"/miners", "newTab": false  }]
    }`);
