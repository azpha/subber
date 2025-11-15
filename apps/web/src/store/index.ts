import { configureStore, combineReducers } from "@reduxjs/toolkit";

import itemReducer from "./reducers/itemSlice";
import modalReducer from "./reducers/modalSlice";

const reducer = combineReducers({
  item: itemReducer,
  modals: modalReducer,
});

export const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
