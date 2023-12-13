import { formatUrl } from "../app/utils/functions/formatUrl";

// ########################################
// # DO NOT PUT SENSIBLE INFORMATION HERE #
// # CLIENT SIDE VARIABLES                #
// ########################################

// SSR variables
// @ts-expect-error value provided by the node SSR
const prodVariable = window.reactInit;

// Selected Network to mine on
// Signum-TESTNET (Testnet)
// Signum (Mainnet)
export const NetworkName = prodVariable.networkName || "Signum";

// The name of the pool
export const poolName = prodVariable.poolName;

// The name of the dApp
export const dAppName = poolName;

// The URL of the pool in order to consume its API endpoints
// Axios will have an instance based on this URL, so by default this is empty
export const poolNodeUrl = "";

// The URL miners should use in order to send deadlines
export const miningUrl = prodVariable.miningUrl;

// The URL of the discord
export const discordUrl = prodVariable.discordUrl;

// The explorer link
export const explorerUrl = formatUrl(prodVariable.explorerUrl);

// The faucet link
export const faucetUrl = prodVariable.faucetUrl;

// The online wallet link
export const walletUrl = formatUrl(prodVariable.walletUrl);

// Pool palette
export const colors = {
    primary: {
        main: prodVariable.primary,
        light: prodVariable.primaryLight,
        dark: prodVariable.primaryDark,
    },
    secondary: {
        main: prodVariable.secondary,
        light: prodVariable.secondaryLight,
        dark: prodVariable.secondaryDark,
    },
    graph: prodVariable.graphColor,
};

// Extra url's
export const additionalLinks =
    prodVariable.extraPoolUrl &&
    prodVariable.extraPoolUrl.trim() !== "" &&
    prodVariable.extraPoolUrl.trim() !== "{}" &&
    prodVariable.extraPoolUrl.trim() !== "[]" &&
    prodVariable.extraPoolUrl.trim() !== "{EXTRAPOOLURL}"
        ? JSON.parse(`{ "links" :${prodVariable.extraPoolUrl} }`)
        : null;
