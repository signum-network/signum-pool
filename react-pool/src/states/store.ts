import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { counterSlice } from "./counterState/counterSlice";
import { appSlice } from "./appState";
import { currentRoundSlice } from "./currentRoundState";
import { poolConfigSlice } from "./poolConfigState";
import { minersSlice } from "./minersState";
import { signumSlice } from "./signumState";

export const store = configureStore({
    reducer: {
        appState: appSlice.reducer,
        currentRoundState: currentRoundSlice.reducer,
        poolConfigState: poolConfigSlice.reducer,
        minersState: minersSlice.reducer,
        signumState: signumSlice.reducer,

        // State used only for example purposes, you can go to folder /counterState
        counter: counterSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
