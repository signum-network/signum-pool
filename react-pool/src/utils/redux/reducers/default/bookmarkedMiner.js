// Redux actions
import * as actionsType from "../../actions/actionTypes";

const initialState = {
  data: null,
  found: false,
  loadingData: true,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionsType.FOUND_BOOKMARKED_MINER:
      const { payload } = action;

      return {
        ...state,
        data: payload,
        found: true,
        loadingData: false,
      };

    case actionsType.NOT_FOUND_BOOKMARKED_MINER:
      return {
        ...state,
        data: null,
        found: false,
        loadingData: false,
      };

    default:
      return state;
  }
};

export default reducer;
