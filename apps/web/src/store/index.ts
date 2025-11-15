import { configureStore, combineReducers } from "@reduxjs/toolkit";

import itemReducer from "./reducers/itemSlice";
import settingsReducer from "./reducers/settingsSlice";

const reducer = combineReducers({
  item: itemReducer,
  settings: settingsReducer,
});

export const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
