// Redux actions
import * as actionsType from "../../actions/actionTypes";

const initialState = {
  list: [],
  topTen: [],
  poolCapacity: null,
  maxSubmissions: 0,
  quantity: 0,
  loadingData: true,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionsType.MINING_DATA_FETCHED:
      // Get data
      const { payload } = action;

      return {
        ...state,
        list: payload.miners,
        topTen: payload.topTen,
        poolCapacity: payload.poolCapacity,
        quantity: payload.minerCount,
        loadingData: false,
      };

    case actionsType.SUBMITTED_MAX_SUBMISSION:
      return {
        ...state,
        maxSubmissions: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;
