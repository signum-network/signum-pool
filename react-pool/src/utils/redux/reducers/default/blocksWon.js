// Redux actions
import * as actionsType from "../../actions/actionTypes";

const initialState = {
  list: [],
  quantity: 0,
  loadingData: true,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionsType.BLOCK_DATA_FETCHED:
      const { payload } = action;

      return {
        ...state,
        list: payload.wonBlocks,
        quantity: payload.quantity,
        loadingData: false,
      };

    case actionsType.BLOCK_DATA_ERROR:
      return initialState;

    default:
      return state;
  }
};

export default reducer;
