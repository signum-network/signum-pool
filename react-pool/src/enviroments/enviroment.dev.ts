// ########################################
// # DO NOT PUT SENSIBLE INFORMATION HERE #
// # CLIENT SIDE VARIABLES                #
// ########################################

// Selected Network to mine on
// Signum-TESTNET (Testnet)
// Signum (Mainnet)
export const NetworkName = "Signum-TESTNET";

// The name of the pool
export const poolName = "My Pool";

// The name of the dApp
export const dAppName = poolName;

// The URL of the pool in order to consume its API endpoints
export const poolNodeUrl = "https://opensignumpooltestnet.ddns.net:8139";

// The URL miners should use in order to send deadlines
export const miningUrl = "https://opensignumpooltestnet.ddns.net:8139";

// The URL of the discord
export const discordUrl = "https://discord.gg/VagTTaKM2j";

// The explorer link
export const explorerUrl = "https://testnet.explorer.signum.network";

// The faucet link
export const faucetUrl = "";

// The online wallet link
export const walletUrl = "https://europe3.testnet.signum.network";

// Pool palette
export const colors = {
    primary: { main: "#0099ff", light: "#5fb8ff", dark: "#0066ff" },
    secondary: { main: "#183173", light: "#274187", dark: "#021851" },
    graph: "#2451B7",
};

// Extra url's
export const additionalLinks = JSON.parse(`{
    "links": [{"label":"Example #1 (Signum)", "url":"https://www.signum.network", "newTab": true  },
     {"label":"Example #2 (BTDEX)", "url":"https://btdex.trade", "newTab": true  },
     {"label":"Example #3 (Local page)", "url":"/miners", "newTab": false  }]
    }`);
