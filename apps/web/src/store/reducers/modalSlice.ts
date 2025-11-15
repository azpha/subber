import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  activeModal: string | null;
}
const initialState: ModalState = {
  activeModal: null,
};

export const modalSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    setActiveModal: (state, action: PayloadAction<string>) => {
      state.activeModal = action.payload;
    },
    closeActiveModal: (state) => {
      state.activeModal = null;
    },
  },
});

export const { setActiveModal, closeActiveModal } = modalSlice.actions;
export default modalSlice.reducer;
