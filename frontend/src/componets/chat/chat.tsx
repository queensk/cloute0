// Import React and other modules
import React, { useState, useEffect, useRef } from "react";
import "./chart.css";
import { Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import moment from "moment";

type MessageProps = {
  senderId: string;
  receiverId: string;
  message: string;
  seen: boolean;
  image: string | null;
  audioURL: string | null;
  videoURL: string | null;
  fileURL: string | null;
  status: "sent" | "delivered" | "read";
  createAt: Date;
  updatedAt: Date;
  name: string;
  profilePic: string;
};

type MessageListProps = {
  socket: Socket; // the socket object
};

// Define the typing indicator component
const TypingIndicator: React.FC = () => {
  return (
    <div className="typing-indicator">
      <div className="dot" />
      <div className="dot" />
      <div className="dot" />
    </div>
  );
};

// Define the message component
const Message: React.FC<MessageProps> = ({
  senderId: messageSenderId,
  receiverId: messageReceiverId,
  message,
  seen,
  image,
  audioURL,
  videoURL,
  fileURL,
  status,
  createAt,
  updatedAt,
  name,
  profilePic,
}) => {
  const { receiverId, roomId, senderId } = useSelector(
    (state: RootState) => state.userChart
  );
  // console.log("user chart" + senderId);
  // console.log("user chart" + receiverId);
  // console.log("user chart" + roomId);
  // console.log(messageSenderId === senderId);
  // console.log("message" + messageSenderId);
  return (
    <div className="message">
      <div
        className={
          messageSenderId === senderId ? "message-right" : "message-left"
        }
      >
        {profilePic ? (
          <img src={profilePic} alt={name} />
        ) : (
          <div className="avatar-placeholder" />
        )}{" "}
        <p className="message-sender">{name}</p>
        <p className="message-text">{message}</p>
        {audioURL && <audio src={audioURL} controls />}
        {videoURL && <video src={videoURL} controls />}
        {fileURL && (
          <a href={fileURL} download>
            Download file
          </a>
        )}{" "}
        {status && <p className="message-status">{status}</p>}
        <p className="message-time">{moment(createAt).fromNow()}</p>
      </div>
    </div>
  );
};

const MessageList: React.FC<MessageListProps> = ({ socket }) => {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [newMessage, setNewMessage] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const { receiverId, roomId, senderId } = useSelector(
    (state: RootState) => state.userChart
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.on("chartMessage", (msg) => {
      console.log("message");
      setNewMessage(msg);
      // setMessages((messages) => [...messages, msg]);
    });
    socket.on("typing", (data) => {
      if (data.senderId === receiverId && data.roomId === roomId) {
        setIsTyping(true);
      }
    });
    setTimeout(() => {
      setIsTyping(false);
    }, 3000);
  }, [socket]);

  useEffect(() => {
    if (roomId && senderId && receiverId) {
      socket.emit("room", { roomId, senderId, receiverId });
    }
    socket.on("roomMessages", (msgs) => {
      console.log("room messages");
      setMessages(msgs);
    });
  }, [socket, roomId, senderId, receiverId, newMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <Message key={index} {...message} />
      ))}
      {/* Render the typing indicator component if the typing status is true */}
      {isTyping && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
