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
  },
});

export const { changeUI } = uiSlice.actions;
export const selectUI = (state: UIState) => state.ui;

export default uiSlice.reducer;
