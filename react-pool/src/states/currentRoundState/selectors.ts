import { RootState } from "../store";

export const selectCurrentRound = (state: RootState) => state.currentRoundState;
