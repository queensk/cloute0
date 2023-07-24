import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type MessageState = {
  senderId: string | null;
  receiverId: string | null;
  roomId: string | null;
};

type MessagePayload = {
  senderId: string;
  receiverId: string;
  roomId: string;
};

const initialState: MessageState = {
  senderId: null,
  receiverId: null,
  roomId: null,
};

const chatSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessage(state, action: PayloadAction<MessagePayload>) {
      const { senderId, receiverId, roomId } = action.payload;
      return {
        ...state,
        senderId,
        receiverId,
        roomId,
      };
    },
  },
});

export const { setMessage } = chatSlice.actions;
export default chatSlice.reducer;
