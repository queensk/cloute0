import React, { useState, useEffect, useRef } from "react";
import "./ChatInput.css";
import { MdSend, MdImage, MdInsertEmoticon, MdClear } from "react-icons/md";
import Picker, { EmojiClickData } from "emoji-picker-react";
import { Socket } from "socket.io-client";
import { RootState } from "../../Redux/store";
import { useSelector } from "react-redux";

type ChatInputProps = {
  socket: Socket; // the socket object
};

const ChatInput: React.FC<ChatInputProps> = ({ socket }) => {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const { receiverId, roomId, senderId } = useSelector(
    (state: RootState) => state.userChart
  );

  useEffect(() => {
    if (message.trim()) {
      socket.emit("typing", { senderId, roomId });
    }
  }, [message, socket, senderId, roomId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSend = () => {
    if (message.trim()) {
      const msg = {
        senderId: senderId,
        receiverId: receiverId,
        roomId: roomId,
        message: message,
      };

      socket.emit("chartMessage", msg);
      setMessage("");
    }
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        const preview = document.getElementById(
          "image-preview"
        ) as HTMLImageElement;
        preview.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmojiSelect = (emojiObject: EmojiClickData) => {
    const emoji = (emojiObject.emoji as string).trim();
    setMessage((message) => message + emoji);
  };

  const togglePicker = () => {
    setShowPicker(!showPicker);
  };

  const clearInput = () => {
    setMessage("");
  };

  return (
    <div className="chat-input">
      <input
        type="file"
        id="image-input"
        accept="image/*"
        hidden
        onChange={handleImageChange}
      />
      <div className="input-container">
        <div className="message-input-container">
          <input
            type="text"
            value={message}
            onChange={handleChange}
            onKeyPress={handleEnter}
            placeholder="Type a message"
            required
            className="message-input"
          />
          <button onClick={handleSend} className="send-button">
            <MdSend />
          </button>
        </div>
        <div className="additional-controls">
          <div className="icon-container">
            <label htmlFor="image-input" className="image-label">
              <MdImage />
            </label>
          </div>
          <div className="icon-container">
            <button onClick={togglePicker} className="emoji-button">
              <MdInsertEmoticon />
            </button>
            {showPicker && <Picker onEmojiClick={handleEmojiSelect} />}
          </div>
          <div className="icon-container">
            {message && (
              <button onClick={clearInput} className="clear-button">
                <MdClear />
              </button>
            )}
          </div>
        </div>
      </div>
      {image && (
        <img id="image-preview" alt="preview" className="image-preview" />
      )}
    </div>
  );
};

export default ChatInput;
