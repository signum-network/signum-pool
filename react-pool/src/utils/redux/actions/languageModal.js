// Basic functions
import * as actionsType from "./actionTypes";

// Open language modal
export const openLanguageModal = () => async (dispatch) => {
  return dispatch({
    type: actionsType.OPEN_LANGUAGE_MODAL,
  });
};

// Close language modal
export const closeLanguageModal = () => async (dispatch) => {
  return dispatch({
    type: actionsType.CLOSE_LANGUAGE_MODAL,
  });
};
