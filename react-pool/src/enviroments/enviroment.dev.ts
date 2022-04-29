// ########################################
// # DO NOT PUT SENSIBLE INFORMATION HERE #
// # CLIENT SIDE VARIABLES                #
// ########################################

// The name of the pool
export const poolName = "My Testnet Pool";

// The name of the dApp
export const dAppName = "My Testnet Pool";

// The URL of the pool in order to consume its API endpoints
export const poolNodeUrl = "https://signumpool.com/";

// The URL miners should use in order to send deadlines
export const miningUrl = "http://testnet.btfg.space:9000";

// The URL of the discord
export const discordUrl = "https://discord.gg/VagTTaKM2j";

// The explorer link
export const explorerUrl = "https://testnet.explorer.signum.network";

// The faucet link
export const faucetUrl = "http://nivbox.co.uk:7777";

// The online wallet link
export const walletUrl = "https://europe3.testnet.signum.network";

// Signum price API
export const signumPriceUrl =
    "https://api.coingecko.com/api/v3/simple/price?ids=signum&vs_currencies=usd";

// Trading embed links
export const tradingEmbedsUrl = {
    mini: "https://s.tradingview.com/embed-widget/tickers/?locale=en#{%22symbols%22:[{%22description%22:%22BTC/SIGNA%22,%22proName%22:%22BITTREX:SIGNABTC%22},{%22description%22:%22SIGNA/USD%22,%22proName%22:%22BITTREX:SIGNAUSD%22}],%22colorTheme%22:%22dark%22,%22isTransparent%22:false,%22showSymbolLogo%22:true,%22width%22:%22100%25%22,%22height%22:104,%22utm_source%22:%22www.tradingview.com%22,%22utm_medium%22:%22widget_new%22,%22utm_campaign%22:%22tickers%22}",
    large: "https://www.tradingview.com/widgetembed/?frameElementId=tradingview_846da&symbol=BITTREX:SIGNAUSD&interval=D&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=[]&theme=dark&style=1&timezone=Etc/UTC&withdateranges=1&showpopupbutton=1&studies_overrides={}&overrides={}&enabled_features=[]&disabled_features=[]&showpopupbutton=1&locale=en&utm_source=www.tradingview.com&utm_medium=widget_new&utm_campaign=chart&utm_term=BITTREX:SIGNAUSD",
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
export const additionalLinks = JSON.parse(`{
    "links": [{"label":"Example #1 (Signum)", "url":"https://www.signum.network", "newTab": true  },
     {"label":"Example #2 (BTDEX)", "url":"https://btdex.trade", "newTab": true  },
     {"label":"Example #3 (Local page)", "url":"/miners", "newTab": false  }]
    }`);
