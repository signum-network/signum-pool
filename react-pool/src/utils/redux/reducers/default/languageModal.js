// Redux actions
import * as actionsType from "../../actions/actionTypes";

const initialState = {
  show: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionsType.OPEN_LANGUAGE_MODAL:
      return {
        ...state,
        show: true,
      };

    case actionsType.CLOSE_LANGUAGE_MODAL:
      return {
        ...state,
        show: false,
      };

    default:
      return state;
  }
};

export default reducer;
