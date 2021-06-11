// Redux actions
import * as actionsType from "../../actions/actionTypes";

const initialState = {
  data: {},
  show: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionsType.OPEN_MINER_MODAL:
      return {
        ...state,
        data: action.payload || {},
        show: true,
      };

    case actionsType.CLOSE_MINER_MODAL:
      return {
        ...state,
        data: {},
        show: false,
      };

    default:
      return state;
  }
};

export default reducer;
