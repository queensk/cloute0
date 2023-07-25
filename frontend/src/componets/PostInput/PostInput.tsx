import React, { useState, useRef } from "react";
import { RiImageAddLine, RiVideoAddLine } from "react-icons/ri";
import { FaRegSmile } from "react-icons/fa";
import { GrFormClose } from "react-icons/gr";
import { IconContext } from "react-icons";
import "./PostInput.css";
import { useCreatePostMutation } from "../../features/auth/authApi";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import storage from "../../config/firebaseconfig.tsx";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

const PostInput: React.FC = () => {
  const [content, setContent] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [createPost] = useCreatePostMutation();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const storageRef = ref(storage, `${userId}/posts`);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
  };

  const handleClearInput = () => {
    setContent("");
    setSelectedEmoji("");
    setFile(null);
  };

  const handlePost = async () => {
    try {
      let imageUrl = "";
      let videoUrl = "";

      if (file) {
        const fileRef = ref(storageRef, file.name);
        await uploadBytes(fileRef, file);
        if (file.type.startsWith("image")) {
          imageUrl = await getDownloadURL(fileRef);
        } else {
          videoUrl = await getDownloadURL(fileRef);
        }
      }

      const postObject = {
        userId: userId,
        post: content + selectedEmoji,
        postImage: imageUrl,
        postVideo: videoUrl,
      };

      const data = await createPost(postObject);
      console.log(data);
      handleClearInput();
    } catch (error) {
      console.log("Error uploading file:", error);
    }
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
      setFile(file);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  const handleEmojiSelect = (emojiObject: EmojiClickData) => {
    const emoji = (emojiObject.emoji as string).trim();
    setContent((content) => content + emoji);
    setSelectedEmoji(emoji);
  };
  const handleEmojiToggle = () => {
    setShowEmojiPicker(!showEmojiPicker);
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
      {showEmojiPicker && (
        <div className="emoji-picker">
          <EmojiPicker onEmojiClick={handleEmojiSelect} />
        </div>
      )}
      <div className="post-input-icons">
        <IconContext.Provider value={{ className: "post-input-icon" }}>
          <RiImageAddLine onClick={handleImageUpload} />
          <RiVideoAddLine onClick={handleFileUpload} />
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
