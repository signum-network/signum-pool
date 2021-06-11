// Redux actions
import * as actionsType from "../../actions/actionTypes";

const initialState = {
  blockHeight: null,
  baseTarget: null,
  averageCommitmentNQT: null,
  roundStart: null,

  // Text variables
  networkDifficulty: null,
  bestMiner: null,
  loadingData: true,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionsType.BASIC_INFO_FETCHED:
      // Get data
      const { payload } = action;

      // Return new data
      return {
        ...state,
        blockHeight: payload.blockHeight,
        baseTarget: payload.baseTarget,
        averageCommitmentNQT: payload.averageCommitmentNQT,
        roundStart: payload.roundStart,

        // Text variables
        networkDifficulty: payload.networkDifficulty,
        bestMiner: payload.bestMiner,
        loadingData: false,
      };

    default:
      return state;
  }
};

export default reducer;
