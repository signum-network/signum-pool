// Redux actions
import * as actionsType from "../../actions/actionTypes";

const initialState = {
  data: null,
  found: false,
  deadlineData: null,
  loadingData: true,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionsType.FOUND_BOOKMARKED_MINER:
      const { payload, deadlineData } = action;

      return {
        ...state,
        data: payload,
        found: true,
        deadlineData: deadlineData || null,
        loadingData: false,
      };

    case actionsType.NOT_FOUND_BOOKMARKED_MINER:
      return {
        ...state,
        data: null,
        found: false,
        deadlineData: null,
        loadingData: false,
      };

    default:
      return state;
  }
};

export default reducer;
