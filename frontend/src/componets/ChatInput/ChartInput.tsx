import React, { useState } from "react";
import "./ChatInput.css";
import { MdSend } from "react-icons/md";

type ChatInputProps = {
  onSend: (message: string) => void;
};

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSend = () => {
    if (message.trim()) {
      // onSend(message);

      setMessage("");
    }
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        value={message}
        onChange={handleChange}
        onKeyPress={handleEnter}
        placeholder="Type a message"
      />
      <button onClick={handleSend}>
        <MdSend />
      </button>
    </div>
  );
};

export default ChatInput;
