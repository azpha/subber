import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Settings } from "@/lib/types";

interface ModalState {
  settings: Settings | null;
}
const initialState: ModalState = {
  settings: null,
};

export const modalSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<Settings>) => {
      state.settings = action.payload;
    },
  },
});

export const { updateSettings } = modalSlice.actions;
export default modalSlice.reducer;
