import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

// Multiples reducers
import rootReducer from "./reducers/index";

// Only use this module in dev mode
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";

const initialState = {};

const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,

  // Only use this module in production mode
  // applyMiddleware(...middleware)

  // Only use this module in dev mode
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
