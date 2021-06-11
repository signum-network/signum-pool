// Basic functions
import * as actionsType from "./actionTypes";

// Handle miners modal
export const toggleModal =
  (data = null) =>
  async (dispatch) => {
    try {
      // See if user wants to close the miner modal
      if (data === null) {
        throw "close modal";
      }

      // Response to send
      let responseData = data;

      dispatch({
        type: actionsType.OPEN_MINER_MODAL,
        payload: responseData,
      });
    } catch (error) {
      dispatch({
        type: actionsType.CLOSE_MINER_MODAL,
      });
    }
  };
