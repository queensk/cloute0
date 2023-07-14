import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false, user: null, token: null },
  reducers: {
    login(state, action: PayloadAction<any>) {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logOut(state) {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
    },
  },
});

export const { login, logOut } = authSlice.actions;
export default authSlice.reducer;

export const selectIsLoggedIn = (state: any) => state.auth.isLoggedIn;
export const selectUser = (state: any) => state.auth.user;
export const selectToken = (state: any) => state.auth.token;
