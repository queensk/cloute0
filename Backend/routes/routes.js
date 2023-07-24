/**
 * A module that handles authentication routes.
 * @module auth
 */
import { authLogin, authRegister } from "../controllers/authController.js";
import {
  createPostComment,
  getPostComments,
  getPostCommentsById,
  getPostCommentsByPostId,
  patchPostComment,
  updatePostComment,
} from "../controllers/commentsController.js";
import {
  createFollow,
  deleteFollow,
  deleteFollowerByUserIdAndFollowerId,
  getAllFollowers,
  getAllFollowersByFollowerId,
  getAllFollowersByUserId,
} from "../controllers/followsControllers.js";
import {
  createLike,
  deleteLike,
  deleteLikeByUserIdAndPostId,
  getLikes,
  getLikesById,
  getLikesByPostId,
  getLikesByUserId,
} from "../controllers/likescontroller.js";
import {
  createMessage,
  deleteMessage,
  getMessageBySenderIdAndReceiverId,
  getMessages,
} from "../controllers/messagesController.js";
import {
  createPost,
  deletePost,
  getPaginationPosts,
  getPostById,
  getPosts,
  updatePost,
  updatePostById,
} from "../controllers/postsControllers.js";
import {
  createUser,
  getAllUsersNotFollowingAUser,
  getPreviousCharts,
  getUserById,
  getUsers,
  patchUser,
  searchUser,
  updateUser,
} from "../controllers/user.js";
import { Router } from "express";
import { requireLogin } from "../utils/authMiddleware.js";
import { createMessageRoom } from "../controllers/MessageRoomController.js";

// Create a router object
const routes = Router();
/**
 * Registers a new user with the given credentials.
 * @name auth/register
 */
routes.post("/auth/register", authRegister);

/**
 * Logs in an existing user with the given credentials.
 * @name auth/login
 */
routes.post("/auth/login", authLogin);

/**
 * Gets all users from the database.
 * @name users/
 */
routes.get("/users", getUsers);

/**
 * Gets a single user by id from the database.
 * @name users/:id
 */
routes.get("/users/:id", getUserById);

/**
 * Creates a new user with the given data in the database.
 * @name users/
 */
routes.post("/users", createUser);

/**
 * Updates an existing user by id with the given data in the database.
 * @name users/:id
 */
routes.put("/users/:id", updateUser);

/**
 * patch an existing user by id with the given data in the database.
 * @name users/:id
 */
// requireLogin;
routes.patch("/users/:id", patchUser);

/**
 * suggested following users
 * @name /suggested/users
 */
routes.get("/suggested/users/:userId", getAllUsersNotFollowingAUser);

/**
 * Get a all posts from the database.
 * @name posts/
 */
routes.get("/posts", getPosts);

/**
 * Get paginated posts from the database.
 * @name posts/
 */
routes.get("/page/posts", getPaginationPosts);

/**
 * Get a single post by id from the database.
 * @name posts/:id
 */
routes.get("/posts/:id", getPostById);

/**
 * Creates a new post with the given data in the database.
 * @name posts/
 */
routes.post("/posts", createPost);

/**
 * Updates an existing post by id with the given data in the database.
 * @name posts/:id
 */
routes.put("/posts/:id", updatePost);
// updatePostById;

/**
 * patch an existing post by id with the given data in the database.
 * @name posts/:id
 */
routes.patch("/posts/:id", updatePostById);

/**
 * Deletes an existing post by id from the database.
 * @name posts/:id
 */
routes.delete("/posts/:id", deletePost);

/**
 * Get all messages from the database.
 * @name messages/
 */
routes.get("/messages", getMessages);

// /**
//  * Get a single message by id from the database.
//  * @name messages/:id
//  */
// routes.get("/messages/:id", get);

/**
 * Get message by sender and receiver ids from the database.
 * @name messages/senders/:senderId/receivers/:receiverId/
 */
routes.get("/messages/:roomId", getMessageBySenderIdAndReceiverId);

/**
 * Create user message
 * @name messages/
 */
routes.post("/messages", createMessage);

/**
 * Delete user message
 * @name messages/:id
 */
routes.delete("/messages/:id", deleteMessage);

/**
 * Get all likes
 * @name likes/
 */
routes.get("/like", getLikes);

/**
 * Get a single like by id from the database.
 * @name likes/:id
 */
routes.get("/like/:id", getLikesById);

/**
 * Get likes by user id
 * @name likes/users/:id
 */
routes.get("/like/user/:id", getLikesByUserId);

/**
 * Get likes by post id
 * @name likes/posts/:id
 */
routes.get("/like/post/:id", getLikesByPostId);

/**
 * create likes for a post
 * @name likes/posts/:id
 */
routes.post("/like/post/", createLike);

/**
 * delete likes for a post
 * @name likes/posts/:id
 */
routes.delete("/like/posts/:id", deletePost);

/**
 * delete likes for a post
 * @name likes/posts/:id
 */
routes.delete("/like/post", deleteLikeByUserIdAndPostId);
// /page/posts
// /**
//  * create likes for a post
//  * @name likes/posts/:id
//  */
// routes.post("/like/users/:id", createLike);

/**
 * delete likes for a post
 * @name likes/posts/:id
 */
routes.delete("/likes/:id", deleteLike);

/**
 * get followers
 * @name followers/
 */
routes.get("/followers/", getAllFollowers);

/**
 * get followers by userid
 * @name following/user/:userId
 */
routes.get("/following/user/:userId", getAllFollowersByUserId);

/**
 * get followers by followerId
 * @name followers/follower/:Id
 */
routes.get("followers/follower/:Id", getAllFollowersByFollowerId);

/**
 * crete following
 * @name following
 */
routes.post("/follower", createFollow);

/**
 * delete follower
 * @name followers/:id
 */
routes.delete("/followers/:id", deleteFollow);

/**
 * delete follower by user id and follower id
 * @name followers/:userId/:followerId
 */
routes.delete(
  "/followers/:userId/:followerId",
  deleteFollowerByUserIdAndFollowerId
);

/**
 * get post comments
 * @name post/comments
 */
routes.get("/post/comments", getPostComments);

/**
 * get post comment by id
 * @name post/comments/:id
 */
routes.get("/post/comments/:id", getPostCommentsById);

/**
 * get post comment by post id
 * @name post/comments/:id
 */
routes.get("/post/:id/comments/", getPostCommentsByPostId);

/**
 * create post comment
 * @name post/comments
 */
routes.post("/post/comments", createPostComment);

/**
 * update post comment
 * @name post/comments/:id
 */
routes.put("/post/comments/:id", updatePostComment);

/**
 * patch post comment
 * @name post/comments/:id
 */
routes.patch("/post/comments/:id", patchPostComment);

/**
 *  post comment
 * @name search/user
 */
routes.post("/search/user", searchUser);

/**
 *  post comment
 * @name /user/room
 */
routes.post("/chart/room", createMessageRoom);

/**
 *  Chart users
 * @name /user/room
 */
routes.get("/chart/user/:userId", getPreviousCharts);

/**
 * Exports the router object.
 * @name module:auth/routes
 * @type {Router}
 */

export default routes;
