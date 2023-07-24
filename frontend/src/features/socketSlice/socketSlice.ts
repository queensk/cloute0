import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:8085";

export interface SocketState {
  socket: SocketIOClient.Socket | null;
}

const initialState: SocketState = {
  socket: socketIOClient(ENDPOINT) || null,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    initializeSocket(state, action: PayloadAction<string>) {
      state.socket = socketIOClient(ENDPOINT, {
        query: {
          receiverId: action.payload,
        },
      });
    },
  },
});

export const { initializeSocket } = socketSlice.actions;

export default socketSlice.reducer;
