// Global variables related to pool node connection
// development enviroment - pool node connection
const TEST_NODE = "http://nivbox.co.uk:9000";

// Production - pool node connection
// It is empty because the axios instance already has the BASE URL
// If you wanna use a different url, you can just type the complete url there (Just like the example above)
const NODE = "";

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// development enviroment - pool name
const TEST_POOL_NAME = "Future Pool";

// Production - pool name
const POOL_NAME = window.reactInit.globalPoolName;

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// development enviroment - explorer link
const TEST_EXPLORER_LINK = "https://testnet.explorer.signum.network/";

// Production - explorer link
const EXPLORER_LINK = window.reactInit.globalExplorerLink;

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// development enviroment - discord link
const TEST_DISCORD_LINK = "https://discord.gg/VagTTaKM2j";

// Production - discord link
const DISCORD_LINK = window.reactInit.globalDiscordLink;

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// development enviroment - faucet link
const TEST_FAUCET_LINK = "http://nivbox.co.uk:7777/";

// Production - faucet link
const FAUCET_LINK = window.reactInit.globalFaucetLink;

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// development enviroment - online wallet link
const TEST_ONLINE_WALLET_LINK = "http://nivbox.co.uk:6876/index.html";

// Production - online wallet link
const ONLINE_WALLET_LINK = window.reactInit.globalNodeLink;

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// development enviroment - signa price api
const TEST_PRICE_ENDPOINT_LINK =
  "https://min-api.cryptocompare.com/data/price?fsym=SIGNA&tsyms=USD";

// Production - signa price api
const PRICE_ENDPOINT_LINK = window.reactInit.signaPriceEndpoint;

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// development enviroment - pool url
const TEST_MINING_ADDRESS = "http://nivbox.co.uk:9000";

// Production - pool url
const MINING_ADDRESS = window.reactInit.globalMiningAddress;

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// development enviroment - mining guide url
const TEST_MINING_GUIDE_LINK = "https://signum.network/mining.html";

// Production - mining guide url
const MINING_GUIDE_LINK = window.reactInit.miningGuideLink;

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// development enviroment - trading guide url
const TEST_TRADING_LINK = "YES";

// Production - trading guide url
const TRADING_LINK = window.reactInit.tradingGuideLink;

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// development enviroment - mini widget trading guide url
const TEST_MINI_WIDGET_TRADING_LINK = "https://bit.ly/2UEd4RB";

// Production - mini widget trading guide url
const MINI_WIDGET_TRADING_LINK = window.reactInit.miniWidgetLink;

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// development enviroment - large widget trading guide url
const TEST_LARGE_WIDGET_TRADING_LINK = "https://bit.ly/3A5BIep";

// Production - large widget trading guide url
const LARGE_WIDGET_TRADING_LINK = window.reactInit.largeWidgetLink;

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// development enviroment - Google Analytics Tracking id
const TEST_googleTrackingID = "";

// Production - Google Analytics Tracking id
const googleTrackingID = window.reactInit.googleTrackingID || "";

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Global variables that are going to be used by the website

// This is the variable which sets if this projects is going to fetch data from a demo pool
// If this variable is equal to true, it will fetch data from the pool demo assigned with the variable TEST_NODE, you can change the url pool node, in order to fetch data from your pool
// If this variable is equal to false, it will use the data you assign from the java file configuration (pool.properties)
// You do not need to change the following value, because it will detect if the project is in a development or production enviroment
export const useTestNet = process.env.NODE_ENV === "development";

// Pool node which website will use
export const NODEToUse = useTestNet && useTestNet === true ? TEST_NODE : NODE;

// Pool name which website will use
export const POOLNameToUse =
  useTestNet && useTestNet === true ? TEST_POOL_NAME : POOL_NAME;

// Explorer which website will use
export const EXPLORERToUse =
  useTestNet && useTestNet === true ? TEST_EXPLORER_LINK : EXPLORER_LINK;

// Discord link which website will use
export const DISCORDToUse =
  useTestNet && useTestNet === true ? TEST_DISCORD_LINK : DISCORD_LINK;

// Faucet link which website will use
export const FAUCETToUse =
  useTestNet && useTestNet === true ? TEST_FAUCET_LINK : FAUCET_LINK;

// Online wallet link which website will use
export const WALLETToUse =
  useTestNet && useTestNet === true
    ? TEST_ONLINE_WALLET_LINK
    : ONLINE_WALLET_LINK;

// Online wallet link which website will use
export const ENDPOINTToUse =
  useTestNet && useTestNet === true
    ? TEST_PRICE_ENDPOINT_LINK
    : PRICE_ENDPOINT_LINK;

// Pool mining address link(URL) which website will use
export const MINING_ADDRESSToUse =
  useTestNet && useTestNet === true ? TEST_MINING_ADDRESS : MINING_ADDRESS;

// Mining guide link(URL) which website will use
export const MINING_GUIDEToUse =
  useTestNet && useTestNet === true
    ? TEST_MINING_GUIDE_LINK
    : MINING_GUIDE_LINK;

// Check if pool operator wants to show the trading link in header and mobile sidebar
export const SHOW_TRADING_LINK =
  useTestNet && useTestNet === true ? TEST_TRADING_LINK : TRADING_LINK;

// Link for mini widget in trading viewer which website will use
export const MINI_WIDGET_TRADING_LINKToUse =
  useTestNet && useTestNet === true
    ? TEST_MINI_WIDGET_TRADING_LINK
    : MINI_WIDGET_TRADING_LINK;

// Link for large widget in trading viewer which website will use
export const LARGE_WIDGET_TRADING_LINKToUse =
  useTestNet && useTestNet === true
    ? TEST_LARGE_WIDGET_TRADING_LINK
    : LARGE_WIDGET_TRADING_LINK;

// Google analytics tracking id which website will use
export const googleTrackingID_ToUse =
  useTestNet && useTestNet === true ? TEST_googleTrackingID : googleTrackingID;

// Genesis Base Target
export const genesisBaseTarget = 4398046511104 / 240;

// User bookmark key
export const userKeyBook = "userKeyBook";

// Max submissions key
export const maxSubMissionsKey = "maxSubMissionsKey";
