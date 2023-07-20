// import the necessary modules
import { sqlConfig } from "../utils/db.js";
import mssql from "mssql";
import apiJSON from "../utils/apiJson.js";
import { v4 as uuidv4 } from "uuid";

// create the posts controller
/**
 * A controller for getting all posts
 *@param {Object} req - The request object
 *@param {Object} res - The response object
 */
export const getPosts = async (req, res) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const request = await pool
      .request()
      .query("SELECT * FROM socialClout.posts");
    const results = request.recordset;
    res.status(200).json(apiJSON(results, "Posts fetched successfully", 200));
  } catch (err) {
    res.status(500).json(apiJSON({}, err, 500));
  } finally {
    mssql.close();
  }
};

/**
 *
 * A controller for getting a pagination posts
 *@param {Object} req - The request object
 *@param {Object} res - The response object
 */

export const getPaginationPosts = async (req, res) => {
  try {
    const { page, limit, userId } = req.query;
    const pool = await mssql.connect(sqlConfig);
    const request = await pool
      .request()
      .input("page", mssql.Int, page)
      .input("limit", mssql.Int, limit)
      .input("userId", mssql.UniqueIdentifier, userId)
      .query(
        `SELECT u.name, u.userName, u.profilePic, u.bio, p.*,
          (SELECT COUNT(*) FROM socialClout.likes l
          WHERE l.postId = p.id AND l.userId = @userId) AS liked,
          (SELECT COUNT(*) FROM socialClout.likes l
          WHERE l.postId = p.id) AS likeCount
        FROM socialClout.posts p
        JOIN socialClout.users u ON p.userId = u.id
        ORDER BY p.createdAt DESC
        OFFSET (@page - 1) * @limit ROWS
        FETCH NEXT @limit ROWS ONLY`
      );
    const results = request.recordset;
    res.status(200).json(apiJSON(results, "Posts fetched successfully", 200));
  } catch (err) {
    res.status(500).json(apiJSON({}, err, 500));
  } finally {
    mssql.close();
  }
};

/**
 *
 * A controller for getting a single post by id
 *@param {Object} req - The request object
 *@param {Object} res - The response object
 */
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await mssql.connect(sqlConfig);
    const request = await pool
      .request()
      .input("id", mssql.UniqueIdentifier, id)
      .query("SELECT * FROM socialClout.posts WHERE id = @id");
    const results = request.recordset;
    if (results.length === 0) {
      res.status(404).json(apiJSON({}, "Post not found", 404));
    } else {
      res
        .status(200)
        .json(apiJSON(results[0], "Post fetched successfully", 200));
    }
  } catch (err) {
    res.status(500).json(apiJSON({}, err, 500));
  } finally {
    mssql.close();
  }
};

/**
*
A controller for getting a new post
*@param {Object} req - The request object
*@param {Object} res - The response object
*/

/**
*
A controller for creating a new post
*@param {Object} req - The request object
*@param {Object} res - The response object
*/

export const createPost = async (req, res) => {
  try {
    const { userId, post, postImage, postVideo } = req.body;
    const id = uuidv4();
    const createdAt = new Date();
    const updatedAt = new Date();
    const pool = await mssql.connect(sqlConfig);
    const request = await pool
      .request()
      .input("id", mssql.UniqueIdentifier, id)
      .input("userId", mssql.UniqueIdentifier, userId)
      .input("post", mssql.NVarChar, post)
      .input("postImage", mssql.VarChar, postImage)
      .input("postVideo", mssql.VarChar, postVideo)
      .input("createdAt", mssql.DateTime, createdAt)
      .input("updatedAt", mssql.DateTime, updatedAt)
      .query(
        "INSERT INTO socialClout.posts (id, userId, post, postImage, postVideo, createdAt, updatedAt) VALUES (@id, @userId, @post, @postImage, @postVideo, @createdAt, @)"
      );
    if (request.rowsAffected[0] === 1) {
      const postRequest = await pool
        .request()
        .input("id", mssql.UniqueIdentifier, id)
        .query("SELECT * FROM socialClout.posts WHERE id = @id");
      const results = postRequest.recordset;
      res
        .status(201)
        .json(apiJSON(results[0], "Post created successfully", 201));
    } else {
      res.status(400).json(apiJSON({}, "Post creation failed", 400));
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(apiJSON({}, err, 500));
  } finally {
    mssql.close();
  }
};

/**
 *
 *A controller for updating a post by id
 *@param {Object} req - The request object
 *@param {Object} res - The response object
 */
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { post } = req.body;
    const updatedAt = new Date();
    const pool = await mssql.connect(sqlConfig);
    const request = await pool
      .request()
      .input("id", mssql.UniqueIdentifier, id)
      .input("post", mssql.VarChar, post)
      .input("updatedAt", mssql.DateTime, updatedAt)
      .query(
        "UPDATE socialClout.posts SET post = @post, updatedAt = @updatedAt WHERE id = @id"
      );
    if (request.rowsAffected[0] === 1) {
      const postRequest = await pool
        .request()
        .input("id", mssql.UniqueIdentifier, id)
        .query("SELECT * FROM socialClout.posts WHERE id = @id");
      const results = postRequest.recordset;
      res
        .status(200)
        .json(apiJSON(results[0], "Post updated successfully", 200));
    } else {
      res.status(404).json(apiJSON({}, "Post not found", 404));
    }
  } catch (err) {
    res.status(500).json(apiJSON({}, err, 500));
  } finally {
    mssql.close();
  }
};

/**
 *
 *A controller for deleting a post by id
 *@param {Object} req - The request object
 *@param {Object} res - The response object
 */
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    if (id === undefined) {
      res.status(400).json(apiJSON({}, "Post id is required", 400));
    }
    const pool = await mssql.connect(sqlConfig);
    const request = await pool
      .request()
      .input("id", mssql.UniqueIdentifier, id)
      .query("DELETE FROM socialClout.posts WHERE id = @id");
    if (request.rowsAffected[0] === 1) {
      res.status(200).json(apiJSON({}, "Post deleted successfully", 200));
    } else {
      res.status(404).json(apiJSON({}, "Post not found", 404));
    }
  } catch (err) {
    res.status(500).json(apiJSON({}, err, 500));
  } finally {
    mssql.close();
  }
};

/**
 * A controller for updating a post by id
 *@param {Object} req - The request object
 *@param {Object} res - The response object
 */
export const updatePostById = async (req, res) => {
  try {
    const { id } = req.params;
    const { post, postImage, postVideo } = req.body;
    const updatedAt = new Date();
    const pool = await mssql.connect(sqlConfig);
    const request = await pool
      .request()
      .input("id", mssql.UniqueIdentifier, id)
      .input("post", mssql.NVarChar, post)
      .input("postImage", mssql.VarChar, postImage)
      .input("postVideo", mssql.VarChar, postVideo)
      .input("updatedAt", mssql.DateTime, updatedAt)
      .query(
        "UPDATE socialClout.posts SET post = COALESCE(@post, post), postImage = COALESCE(@postImage, postImage), postVideo = COALESCE(@postVideo, postVideo), updatedAt = COALESCE(@updatedAt, updatedAt) WHERE id = @id"
      );
    if (request.rowsAffected[0] === 1) {
      const postRequest = await pool
        .request()
        .input("id", mssql.UniqueIdentifier, id)
        .query("SELECT * FROM socialClout.posts WHERE id = @id");
      const results = postRequest.recordset;
      updatedAt;
      res
        .status(200)
        .json(apiJSON(results[0], "Post updated successfully", 200));
    } else {
      res.status(404).json(apiJSON({}, "Post not found", 404));
    }
  } catch (err) {
    res.status(500).json(apiJSON({}, err, 500));
  } finally {
    mssql.close();
  }
};
