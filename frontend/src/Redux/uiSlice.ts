import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UIState = {
  ui: "Home" | "Notification" | "Messages" | "Friends" | "Profile" | "";
};

const initialState: UIState = {
  ui: "",
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    changeUI: (state, action: PayloadAction<UIState["ui"]>) => {
      state.ui = action.payload;
    },
    resetUI: () => initialState,
  },
});

export const { changeUI, resetUI } = uiSlice.actions;
export const selectUI = (state: { ui: UIState }) => state.ui.ui;

export default uiSlice.reducer;
