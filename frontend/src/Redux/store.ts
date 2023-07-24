import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { authApi } from "../features/auth/authApi";
import { authReducer } from "../features/auth/authSlice";
import uiReducer from "./uiSlice";
import chatSlice from "../features/chatSlice/chatSlice";
import socketSlice from "../features/socketSlice/socketSlice";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  auth: persistReducer(persistConfig, authReducer),
  [authApi.reducerPath]: authApi.reducer,
  ui: persistReducer(persistConfig, uiReducer),
  userChart: persistReducer(persistConfig, chatSlice),
  socket: socketSlice,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(authApi.middleware),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof rootReducer>;
