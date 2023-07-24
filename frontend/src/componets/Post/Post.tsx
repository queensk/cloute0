import { useState } from "react";
import "./Post.css";
import Logo from "./_2332e6e9-f74e-4fb8-8bff-d6bd53e9602f.jpg";
import { MdFavorite, MdThumbUpOffAlt, MdComment, MdSend } from "react-icons/md";
import moment from "moment";
import {
  useGetPosCommentsQuery,
  useCreatePostCommentsMutation,
  useCreateLikeMutation,
  useDeleteLikeMutation,
} from "../../features/auth/authApi";
import { NotificationData, NotificationType } from "../../types/Notification";
import useNotificationManager from "../customHooks/useNotificationManager";
import { RootState } from "../../Redux/store";
import { useSelector } from "react-redux";

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

export default function Post({
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
  const [showComments, setShowComments] = useState(false);
  const [createLike] = useCreateLikeMutation();
  const [deleteLike] = useDeleteLikeMutation();
  const { id: senderId, name: senderName } = useSelector(
    (state: RootState) => state.auth.user
  );
  const { sendNotification } = useNotificationManager(userId);

  const [createPostComments] = useCreatePostCommentsMutation({
    invalidatesTags: ["Comments"],
  });

  const [commentInput, setCommentInput] = useState("");

  const { data, error, isLoading } = useGetPosCommentsQuery(
    {
      id,
    },
    {
      skip: !showComments,
    }
  );

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleCreateComment = async (
    postId: string,
    userId: string,
    comment: string
  ) => {
    const resultData = await createPostComments({ postId, userId, comment });
    // console.log(resultData);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentInput(event.target.value);
  };

  const handleCommentSubmit = async () => {
    if (commentInput) {
      // console.log(id, userId, commentInput);
      const results = await handleCreateComment(id, userId, commentInput);
      setCommentInput("");
    }
  };

  const handleCreateLike = async (postId: string, userId: string) => {
    const result = await createLike({ postId, userId });
    if (result?.data.status === 200) {
      console.log("Created like successfully");
    } else if (result?.data.status !== 200) {
      console.error("Failed to create like");
    }
  };

  const handleDeleteLike = async (postId: string, userId: string) => {
    const result = await deleteLike({ postId, userId });
    if (result?.data.status === 200) {
      console.log("Deleted like successfully");
    } else if (result?.data.status !== 200) {
      console.error("Failed to delete like");
    }
  };

  const toggleLike = async () => {
    if (!liked) {
      await handleCreateLike(id, userId);
      const data: NotificationData = {
        // id: ,
        senderId: senderId,
        senderName: senderName,
        receiverId: userId,
        type: "Like",
        read: false,
      };
      // Pass the receiver ID to the useNotificationManager hook
      sendNotification(NotificationType.Like, data);
    } else {
      await handleDeleteLike(id, userId);
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
        </div>
      </div>
      <div className="post-body">
        <p>{post}</p>
        <div className="post-body-bottom">
          {!postVideo && <img src={postImage || Logo} alt="" />}
          {postVideo && <video src={postVideo || Logo} controls />}
        </div>

        <div className="post-footer">
          <span
            className={
              liked ? "post-footer-like user-liked" : " post-footer-like "
            }
            onClick={toggleLike}
          >
            <MdFavorite />
          </span>
          <span>{likeCount}</span>
          {/* <span><MdThumbUpOffAlt /></span> */}
          <span onClick={toggleComments} className="post-footer-comment">
            <MdComment />
          </span>
        </div>
        {showComments && (
          <div className="post-comments">
            {isLoading ? (
              <p>Loading comments...</p>
            ) : error ? (
              <p>Error: {error.message}</p>
            ) : (
              data?.data.map((comment) => (
                <div className="comment" key={comment.id}>
                  <div className="comment-user">
                    <div>
                      <img src={comment.profilePic || Logo} alt="" />
                      <p>@{comment.userName}</p>
                    </div>
                    <p className="comment-date">
                      {moment(comment.createdAt).fromNow()}
                    </p>
                  </div>
                  <div className="comment-content">
                    <p className="comment-text">{comment.comment}</p>
                  </div>
                </div>
              ))
            )}
            {isLoading && <p>Fetching more comments...</p>}
            <div className="comment-input">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentInput}
                onChange={handleInputChange}
              />
              <MdSend onClick={handleCommentSubmit} />
            </div>
          </div>
        )}
      </div>
      <div className="post-border-bottom"></div>
    </div>
  );
}
