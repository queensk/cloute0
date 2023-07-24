import React from "react";
import "./ChatUsers.css";
import Logo from "./Frame 7.png";
import { MdChat } from "react-icons/md";
import { RootState } from "../../Redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetUserActiveChartQuery,
  useUseMessageUserMutation,
} from "../../features/auth/authApi";
import moment from "moment";
import { setMessage } from "../../features/chatSlice/chatSlice";

export default function ChatUsers() {
  const [messageUser] = useUseMessageUserMutation();
  const userId = useSelector((state: RootState) => state.auth.user.id);
  const dispatch = useDispatch();
  const { data, isLoading, isError, error } = useGetUserActiveChartQuery({
    userId,
  });
  const handleChartUser = async (receiverId) => {
    const userRoom = await messageUser({
      senderId: userId,
      receiverId: receiverId,
    });
    dispatch(
      setMessage({
        senderId: userId,
        receiverId: receiverId,
        roomId: userRoom.data.data[0].id,
      })
    );
  };
  return (
    <div className="user-chat">
      <div className="user-chat-header">
        <h3>chats</h3>
      </div>
      <div className="user-chat-container">
        {data?.data.length > 0 &&
          data?.data.map((item) => (
            <div key={item.id} className="user-chat-card">
              <div className="user-chat-card-info">
                <img src={Logo} alt="" />
                <div>
                  <p>{item.name}</p>
                  <p>{moment(item.lastMessageTime).fromNow()}</p>
                </div>
              </div>
              <span
                onClick={() => handleChartUser(item.id)}
                className="user-chat-btn"
              >
                <MdChat />
              </span>
            </div>
          ))}

        {/* <button className="follow-btn">message</button> */}
      </div>
    </div>
  );
}
