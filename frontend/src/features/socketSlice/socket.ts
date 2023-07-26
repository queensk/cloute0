import io, { Socket } from "socket.io-client";
import { setSocket } from "./socketSlice";

let socket: Socket | null = null;
function connectSocket(dispatch: Function, roomId: string, receiverId: string) {
  console.log(roomId, receiverId);
  socket = io("http://localhost:8085", {
    reconnect: true,
    transports: ["websocket"],
    query: { roomId: roomId, receiverId: receiverId },
  });
  dispatch(setSocket(socket));
}
function disconnectSocket(dispatch: Function) {
  if (socket) {
    socket.close();
  }
  dispatch(setSocket(null));
}
export { connectSocket, disconnectSocket };
