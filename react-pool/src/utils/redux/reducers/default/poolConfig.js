// Redux actions
import * as actionsType from "../../actions/actionTypes";

const initialState = {
  data: null,
  loadingData: true,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionsType.POOL_INFO_FETCHED:
      // Get data
      const { payload } = action;

      return {
        ...state,
        data: payload,
        loadingData: false,
      };

    default:
      return state;
  }
};

export default reducer;
