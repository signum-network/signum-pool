// Global variables related to pool node connection
// Test-net - pool node connection
const TEST_NODE = "http://nivbox.co.uk:9000";

// Production - pool node connection
const NODE = "";

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Test-net - pool name connection
const TEST_POOL_NAME = "Future Pool";

// Production - pool name connection
const POOL_NAME = window.reactInit.globalPoolName;

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Test-net - explorer link
const TEST_EXPLORER_LINK = "https://testnet.explorer.burstcoin.network/";

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
const TEST_MINI_WIDGET_TRADING_LINK = "https://bit.ly/2SzLZyx";

// Production - mini widget trading guide url
const MINI_WIDGET_TRADING_LINK = window.reactInit.miniWidgetLink;

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Test-net - large widget trading guide url
const TEST_LARGE_WIDGET_TRADING_LINK = "https://bit.ly/2UhNuSo";

// Production - large widget trading guide url
const LARGE_WIDGET_TRADING_LINK = window.reactInit.largeWidgetLink;

// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Global variables that are going to be used by the website

// Set true or false if you wanna use the test-net (demo enviroment) or main-net enviroment of the pool node
export const useTestNet = true;

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

// Genesis Base Target
export const genesisBaseTarget = 4398046511104 / 240;

// User bookmark key
export const userKeyBook = "userKeyBook";

// Max submissions key
export const maxSubMissionsKey = "maxSubMissionsKey";
