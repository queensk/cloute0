import React from "react";
import "./chart.css";

type MessageProps = {
  sender: string; // the name of the sender
  text: string; // the text of the message
  isMine: boolean; // a flag to indicate if the message is sent by me or not
};

type MessageListProps = {
  messages: MessageProps[]; // an array of messages
};

const Message: React.FC<MessageProps> = ({ sender, text, isMine }) => {
  return (
    <div className="message">
      <div className={isMine ? "message-right" : "message-left"}>
        <p className="message-sender">{sender}</p>
        <p className="message-text">{text}</p>
      </div>
    </div>
  );
};

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <Message key={index} {...message} />
      ))}
    </div>
  );
};

const dummyMessages: MessageProps[] = [
  {
    sender: "Alice",
    text: "Hi Bob, how are you?",
    isMine: false,
  },
  {
    sender: "Bob",
    text: "I'm fine, thanks. How about you?",
    isMine: true,
  },
  {
    sender: "Alice",
    text: "I'm good too. Just working on a project.",
    isMine: false,
  },
  {
    sender: "Bob",
    text: "Oh, what kind of project?",
    isMine: true,
  },
];

export default MessageList;

export { dummyMessages };
