// ########################################
// # DO NOT PUT SENSIBLE INFORMATION HERE #
// # CLIENT SIDE VARIABLES                #
// ########################################

// SSR variables
// @ts-ignore
const prodVariable = window.reactInit;

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
export const explorerUrl = prodVariable.explorerUrl;

// The faucet link
export const faucetUrl = prodVariable.faucetUrl;

// The online wallet link
export const walletUrl = prodVariable.walletUrl;

// Signum price API
export const signumPriceUrl =
    "https://api.coingecko.com/api/v3/simple/price?ids=signum&vs_currencies=usd";

// Trading embed links
export const tradingEmbedsUrl = {
    mini: "https://s.tradingview.com/embed-widget/tickers/?locale=en#{%22symbols%22:[{%22description%22:%22BTC/SIGNA%22,%22proName%22:%22BITTREX:SIGNABTC%22},{%22description%22:%22SIGNA/USD%22,%22proName%22:%22BITTREX:SIGNAUSD%22}],%22colorTheme%22:%22dark%22,%22isTransparent%22:false,%22showSymbolLogo%22:true,%22width%22:%22100%25%22,%22height%22:104,%22utm_source%22:%22www.tradingview.com%22,%22utm_medium%22:%22widget_new%22,%22utm_campaign%22:%22tickers%22}",
    large: "https://www.tradingview.com/widgetembed/?frameElementId=tradingview_846da&symbol=BITTREX:SIGNAUSD&interval=D&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=[]&theme=dark&style=1&timezone=Etc/UTC&withdateranges=1&showpopupbutton=1&studies_overrides={}&overrides={}&enabled_features=[]&disabled_features=[]&showpopupbutton=1&locale=en&utm_source=www.tradingview.com&utm_medium=widget_new&utm_campaign=chart&utm_term=BITTREX:SIGNAUSD",
};

// Google Analytics Tracking id
// Example of Tracking ID: G-XXXXXX
// DO NOT USE THE DEPRECATED UNIVERSAL ANALYTICS PROPERTY, EXAMPLE: UA-XXXXX
export const googleTrackingID = prodVariable.googleTrackingID;

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
        ? `{ "links" :${prodVariable.extraPoolUrl} }`
        : null;
