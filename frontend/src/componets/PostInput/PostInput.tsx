// PostInput.tsx
import React, { useState, useRef } from "react";
import { RiImageAddLine, RiVideoAddLine } from "react-icons/ri";
import { FaRegSmile } from "react-icons/fa";
import { GrFormClose } from "react-icons/gr";
import { IconContext } from "react-icons";
import "./PostInput.css";
import { useCreatePostMutation } from "../../features/auth/authApi";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";

// Import the emoji function from react-easy-emoji
import emoji from "react-easy-emoji";

const PostInput: React.FC = () => {
  const [content, setContent] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [createPost] = useCreatePostMutation();
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const handleClearInput = () => {
    setContent("");
    setSelectedEmoji("");
    setFile(null);
  };

  const handlePost = async () => {
    const data = await createPost({
      userId: userId,
      post: content + selectedEmoji,
      postImage: "",
      postVideo: "",
    });
    console.log(data);
    handleClearInput();
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
      setFile(file);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file);
      setFile(file);
    }
  };

  // Create a handler function to append the selected emoji to the content state and the selected emoji state
  const handleEmojiSelect = (event: React.MouseEvent) => {
    const emoji = (event.target as HTMLImageElement).alt;
    setContent((content) => content + emoji);
    setSelectedEmoji(emoji);
  };

  return (
    <div className="post-input-container">
      <textarea
        className="post-input"
        placeholder="What's happening?"
        value={content}
        onChange={handleInputChange}
      >
        {file && (
          <div className="post-input-file">
            {file.type.startsWith("image") ? (
              <img src={URL.createObjectURL(file)} alt="uploaded image" />
            ) : (
              <video src={URL.createObjectURL(file)} controls />
            )}
          </div>
        )}
      </textarea>
      <div className="emoji-picker" onClick={handleEmojiSelect}>
        {emoji(
          "😀 😁 😂 🤣 😃 😄 😅 😆 😉 😊 😋 😎 😍 😘 🥰 😗 😙 😚 ☺️ 🙂 🤗 🤩 🤔 🤨 😐 😑 😶 🙄 😏 😣"
        )}
      </div>
      <div className="post-input-icons">
        <IconContext.Provider value={{ className: "post-input-icon" }}>
          <RiImageAddLine onClick={handleImageUpload} />
          <RiVideoAddLine onClick={handleFileUpload} />
          {/* Remove the onClick handler from the smile icon */}
          <FaRegSmile />
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
          accept="video/*"
          onChange={handleFileChange}
        />
      </div>
      <div className="post-input-actions">
        {(content.length > 0 || selectedEmoji.length > 0 || file) && (
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
