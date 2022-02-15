import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { counterSlice } from "./counterState/counterSlice";
import { appSlice } from "./appState";

export const store = configureStore({
    reducer: {
        appState: appSlice.reducer,

        // State used only for example purposes, you can go to folder /counter
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
