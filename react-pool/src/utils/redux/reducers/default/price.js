// Redux actions
import * as actionsType from "../../actions/actionTypes";

const initialState = {
  usdPrice: 0,
  loadingData: true,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionsType.SIGNA_PRICE_FETCHED:
      const { payload } = action;

      return { ...state, usdPrice: payload, loadingData: false };

    default:
      return state;
  }
};

export default reducer;
