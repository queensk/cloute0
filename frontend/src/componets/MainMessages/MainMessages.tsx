import "./MainMessages.css";
import MessageList from "../chat/chat";
import ChatInput from "../ChatInput/ChatInput";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { useMessageUserDataQuery } from "../../features/auth/authApi";

export default function MainMessages() {
  const { receiverId, roomId, senderId } = useSelector(
    (state: RootState) => state.userChart
  );
  const socket = io("http://localhost:8085", { query: { roomId: roomId } });
  const { data, isLoading, isError, error } = useMessageUserDataQuery({
    receiverId,
  });

  return (
    <div className="main-container">
      <div className="main-messages-tittle">
        <h3>Message</h3>
        <div className="main-messages-tittle-about">
          <div>
            <img src="https://picsum.photos/200/300" alt="message" />
          </div>
          <div className="main-messages-tittle-about-name">
            <p>{data?.data.name}</p>
            <p>online</p>
          </div>
        </div>
      </div>
      <MessageList socket={socket} />
      <ChatInput socket={socket} />
    </div>
  );
}
