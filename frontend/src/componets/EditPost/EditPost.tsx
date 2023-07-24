import React, { useState, useRef } from "react";
import "./EditPost.css";
import Logo from "./_2332e6e9-f74e-4fb8-8bff-d6bd53e9602f.jpg";
import { MdFavorite, MdThumbUpOffAlt, MdComment, MdSend } from "react-icons/md";
import moment from "moment";
import {
  useGetPosCommentsQuery,
  useCreatePostCommentsMutation,
  useCreateLikeMutation,
  useDeleteLikeMutation,
  useUpdatePostMutation, // Import this hook
} from "../../features/auth/authApi";
import { RiImageAddLine, RiVideoAddLine } from "react-icons/ri";
import { FaRegSmile } from "react-icons/fa";
import { GrFormClose } from "react-icons/gr";
import { IconContext } from "react-icons";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface PostProps {
  id: string;
  userId: string;
  name: string;
  userName: string;
  profilePic: string | null;
  bio: string;
  post: string;
  postImage: string;
  postVideo: string;
  createdAt: string;
  updatedAt: string;
  liked: number;
  likeCount: number;
}

export default function EditPost({
  id,
  userId,
  name,
  userName,
  profilePic,
  bio,
  post,
  postImage,
  postVideo,
  createdAt,
  updatedAt,
  liked,
  likeCount,
}: PostProps) {
  const [editMode, setEditMode] = useState(false);
  const [postInput, setPostInput] = useState(post);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const [updatePost] = useUpdatePostMutation({
    invalidatesTags: ["Posts"],
  });
  const toggleEditMode = () => {
    setEditMode(!editMode);
    setFile(null);
    setShowEmojiPicker(!showEmojiPicker);
  };

  // Add this function to handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPostInput(event.target.value);
  };

  // Add this function to handle update submit
  const handleUpdateSubmit = async () => {
    if (postInput) {
      await updatePost({ id, post: postInput });
      setEditMode(false);
      setFile(null);
    }
  };
  const handleEmojiSelect = (emojiObject: EmojiClickData) => {
    const emoji = (emojiObject.emoji as string).trim();
    setPostInput((postInput) => postInput + emoji);
    setSelectedEmoji(emoji);
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

  const handleEmojiToggle = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
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

  return (
    <div className="main-post-container">
      <div className="post-header">
        <div className="post-header-left">
          <div className="post-header-left-img">
            <img src={profilePic || Logo} alt="" />
          </div>
          <div className="post-header-left-name-user">
            <h3>{name}</h3>
            <p>@{userName}</p>
          </div>
        </div>
        <div className="post-header-right">
          <p>{moment(createdAt).fromNow()}</p>
          <button className="post-input-button" onClick={toggleEditMode}>
            {editMode ? "Cancel" : "Edit"}
          </button>
          {editMode && (
            <button className="post-input-button" onClick={handleUpdateSubmit}>
              Save
            </button>
          )}
        </div>
      </div>
      <div className="post-body">
        {!editMode && <p>{post}</p>}
        {editMode && (
          <div className="Edit-post-input-container">
            <textarea
              type="text"
              className="post-input"
              value={postInput}
              onChange={handleInputChange}
            />
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
            {showEmojiPicker && (
              <div className="emoji-picker">
                <EmojiPicker onEmojiClick={handleEmojiSelect} />
              </div>
            )}
            {file && (
              <div className="post-input-file">
                {file.type.startsWith("image") ? (
                  <img src={URL.createObjectURL(file)} alt="uploaded image" />
                ) : (
                  <video src={URL.createObjectURL(file)} controls />
                )}
              </div>
            )}
          </div>
        )}
        <div className="Edit-post-image-video">
          {!postVideo && <img src={postImage || Logo} alt="" />}
          {postVideo && <video src={postVideo || Logo} controls />}
        </div>
      </div>
    </div>
  );
}
