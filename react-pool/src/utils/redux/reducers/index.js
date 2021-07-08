// Redux
import { combineReducers } from "redux";

// Default reducer's reducers
import basicInfo from "./default/basicInfo.js";
import bookMarkedMiner from "./default/bookmarkedMiner.js";
import blocksWon from "./default/blocksWon.js";
import miners from "./default/miners.js";
import poolConfig from "./default/poolConfig";
import pricing from "./default/price.js";
import minerModal from "./default/minerModal.js";
import languageModal from "./default/languageModal.js";

export default combineReducers({
  basicInfo,
  bookMarkedMiner,
  blocksWon,
  miners,
  poolConfig,
  pricing,
  minerModal,
  languageModal,
});
