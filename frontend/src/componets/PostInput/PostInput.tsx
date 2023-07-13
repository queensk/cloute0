// PostInput.tsx
import React, { useState, useRef } from "react";
import { RiImageAddLine, RiVideoAddLine } from "react-icons/ri";
import { FaRegSmile } from "react-icons/fa";
import { GrFormClose } from "react-icons/gr";
import { IconContext } from "react-icons";
import "./PostInput.css";

// Import the emoji picker component from emoji-picker-react
import EmojiPicker from "emoji-picker-react";

const PostInput: React.FC = () => {
  const [content, setContent] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create a state variable to store the emoji picker visibility
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const handleClearInput = () => {
    setContent("");
  };

  const handlePost = () => {
    // Logic to handle post
    console.log("Post content:", content);
  };

  const handleImageUpload = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Logic to handle the selected image file
      console.log("Selected image:", file);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Logic to handle the selected file
      console.log("Selected file:", file);
    }
  };

  // Create a handler function to toggle the emoji picker visibility
  const handleEmojiToggle = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  // Create a handler function to append the selected emoji to the content state
  // Use the emojiObject parameter instead of the emoji parameter
  const handleEmojiSelect = (event: any, emoji) => {
    console.log(emoji.unified);
    setContent((content) => content + emoji.unified);
    setShowEmojiPicker(false);
  };

  return (
    <div className="post-input-container">
      <textarea
        className="post-input"
        placeholder="What's happening?"
        value={content}
        onChange={handleInputChange}
      ></textarea>
      {/* Render the emoji picker component using EmojiPicker instead of Picker */}
      {/* Pass the handleEmojiSelect function as the onEmojiClick prop */}
      {showEmojiPicker && (
        <div className="emoji-picker">
          <EmojiPicker onEmojiClick={handleEmojiSelect} native={true} />
        </div>
      )}
      <div className="post-input-icons">
        <IconContext.Provider value={{ className: "post-input-icon" }}>
          <RiImageAddLine onClick={handleImageUpload} />
          <RiVideoAddLine onClick={handleFileUpload} />
          {/* Add an onClick handler to the smile icon to trigger the handleEmojiToggle function */}
          <FaRegSmile onClick={handleEmojiToggle} />
        </IconContext.Provider>
        <input
          type="file"
          ref={imageInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleImageFileChange}
        />
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      <div className="post-input-actions">
        {content.length > 0 && (
          <div className="post-input-action" onClick={handleClearInput}>
            <GrFormClose />
          </div>
        )}
        <button className="post-input-button" onClick={handlePost}>
          Post
        </button>
      </div>
    </div>
  );
};

export default PostInput;
