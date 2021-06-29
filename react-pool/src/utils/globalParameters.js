// Global variables related to pool node connection
// Test-net - pool node connection
const TEST_NODE = "https://signumpool.com";

// Production - pool node connection
const NODE = "";

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Test-net - pool name
const TEST_POOL_NAME = "Future Pool";

// Production - pool name
const POOL_NAME = window.reactInit.globalPoolName;

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Test-net - home welcome title, first line
const TEST_HOME_TITLE_FIRST_LINE =
  "We are part of the community driven technology - Signum Blockchain";

// Production - home welcome title, first line
const HOME_TITLE_FIRST_LINE = window.reactInit.homeFirstLineTitle;

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Test-net - home welcome title, second line
const TEST_HOME_TITLE_SECOND_LINE = "Let’s keep growing and start to mine now!";

// Production - home welcome title, second line
const HOME_TITLE_SECOND_LINE = window.reactInit.homeSecondLineTitle;

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Test-net - explorer link
const TEST_EXPLORER_LINK = "https://testnet.explorer.signum.network/";

// Production - explorer link
const EXPLORER_LINK = window.reactInit.globalExplorerLink;

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Test-net - discord link
const TEST_DISCORD_LINK = "https://discord.gg/VagTTaKM2j";

// Production - discord link
const DISCORD_LINK = window.reactInit.globalDiscordLink;

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Test-net - faucet link
const TEST_FAUCET_LINK = "http://nivbox.co.uk:7777/";

// Production - faucet link
const FAUCET_LINK = window.reactInit.globalFaucetLink;

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Test-net - online wallet link
const TEST_ONLINE_WALLET_LINK = "http://nivbox.co.uk:6876/index.html";

// Production - online wallet link
const ONLINE_WALLET_LINK = window.reactInit.globalNodeLink;

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Test-net - signa price api
const TEST_PRICE_ENDPOINT_LINK =
  "https://min-api.cryptocompare.com/data/price?fsym=BURST&tsyms=USD";

// Production - signa price api
const PRICE_ENDPOINT_LINK = window.reactInit.signaPriceEndpoint;

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Test-net - pool url
const TEST_MINING_ADDRESS = "http://nivbox.co.uk:9000";

// Production - pool url
const MINING_ADDRESS = window.reactInit.globalMiningAddress;

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Test-net - mining guide url
const TEST_MINING_GUIDE_LINK = "https://signum.network/mining.html";

// Production - mining guide url
const MINING_GUIDE_LINK = window.reactInit.miningGuideLink;

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Test-net - trading guide url
const TEST_TRADING_LINK = "YES";

// Production - trading guide url
const TRADING_LINK = window.reactInit.tradingGuideLink;

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Test-net - mini widget trading guide url
const TEST_MINI_WIDGET_TRADING_LINK = "https://bit.ly/2UEd4RB";

// Production - mini widget trading guide url
const MINI_WIDGET_TRADING_LINK = window.reactInit.miniWidgetLink;

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Test-net - large widget trading guide url
const TEST_LARGE_WIDGET_TRADING_LINK = "https://bit.ly/3A5BIep";

// Production - large widget trading guide url
const LARGE_WIDGET_TRADING_LINK = window.reactInit.largeWidgetLink;

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Test-net - Google Analytics Tracking id
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

// Pool home title, first line which website will use
export const HOMETITLEFIRSTLINETOUSE =
  useTestNet && useTestNet === true
    ? TEST_HOME_TITLE_FIRST_LINE
    : HOME_TITLE_FIRST_LINE;

// Pool home title, first line which website will use
export const HOME_TITLE_FIRST_LINE_TOUSE =
  useTestNet && useTestNet === true
    ? TEST_HOME_TITLE_FIRST_LINE
    : HOME_TITLE_FIRST_LINE;

// Pool home title, second line which website will use
export const HOME_TITLE_SECOND_LINE_TOUSE =
  useTestNet && useTestNet === true
    ? TEST_HOME_TITLE_SECOND_LINE
    : HOME_TITLE_SECOND_LINE;

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
