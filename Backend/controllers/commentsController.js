import { sqlConfig } from "../utils/db.js";
import mssql from "mssql";
import apiJSON from "../utils/apiJson.js";
import { v4 as uuidv4 } from "uuid";

/**
 * A controller for get post comments
 *@param {Object} req - The request object
 *@param {Object} res - The response object
 */
export const getPostComments = async (req, res) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const result = await pool
      .request()
      .query("SELECT * FROM socialClout.comments ORDER BY createAt DESC");
    res.json(apiJSON(result.recordset, "success", 200));
  } catch (error) {
    res.json(apiJSON(null, error.message, 400));
  } finally {
    mssql.close();
  }
};

/**
 * A controller for post comments by id
 *@param {Object} req - The request object
 *@param {Object} res - The response object
 */
export const getPostCommentsById = async (req, res) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const result = await pool
      .request()
      .input("id", mssql.UniqueIdentifier, req.params.id)
      .query(
        "SELECT * FROM socialClout.comments WHERE id = @id ORDER BY createAt DESC"
      );
    res.json(apiJSON(result.recordset, "success", 200));
  } catch (error) {
    res.json(apiJSON(null, error.message, 400));
  } finally {
    mssql.close();
  }
};

/**
 * A controller for post comments by post id
 *@param {Object} req - The request object
 *@param {Object} res - The response object
 */
export const getPostCommentsByPostId = async (req, res) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const result = await pool
      .request()
      .input("id", mssql.UniqueIdentifier, req.params.id)
      .query(
        "SELECT u.name, u.userName, u.profilePic, u.bio, c.* FROM socialClout.comments c JOIN socialClout.users u ON c.userId = u.id WHERE c.postId = @id ORDER BY c.createAt DESC"
      );
    res.json(apiJSON(result.recordset, "success", 200));
  } catch (error) {
    res.json(apiJSON(null, error.message, 400));
  } finally {
    mssql.close();
  }
};

/**
 * A controller for create post comment
 *@param {Object} req - The request object
 *@param {Object} res - The response object
 */
export const createPostComment = async (req, res) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const result = await pool
      .request()
      .input("id", mssql.UniqueIdentifier, uuidv4())
      .input("userId", mssql.UniqueIdentifier, req.body.userId)
      .input("postId", mssql.UniqueIdentifier, req.body.postId)
      .input("comment", mssql.VarChar, req.body.comment)
      .input("createAt", mssql.DateTime, new Date())
      .input("updatedAt", mssql.DateTime, new Date())
      .query(
        "INSERT INTO socialClout.comments (id, userId, postId, comment, createAt, updatedAt) VALUES (@id, @userId, @postId, @comment, @createAt, @updatedAt)"
      );
    res.json(apiJSON(result.recordset, "success", 200));
  } catch (error) {
    console.log(error);
    res.json(apiJSON(null, error.message, 400));
  } finally {
    mssql.close();
  }
};

/**
 * A controller for update post comment
 *@param {Object} req - The request object
 *@param {Object} res - The response object
 */
export const updatePostComment = async (req, res) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const result = await pool
      .request()
      .input("id", mssql.UniqueIdentifier, req.params.id)
      .input("comment", mssql.VarChar, req.body.comment)
      .input("updatedAt", mssql.DateTime, new Date())
      .query(
        "UPDATE socialClout.comments SET comment = @comment, updatedAt = @updatedAt WHERE id = @id"
      );
    res.json(apiJSON(result.recordset, "success", 200));
  } catch (error) {
    res.json(apiJSON(null, error.message, 400));
  } finally {
    mssql.close();
  }
};

/**
 * A controller to patch a post comment
 *@param {Object} req - The request object
 *@param {Object} res - The response object
 */

export const patchPostComment = async (req, res) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const result = await pool
      .request()
      .input("id", mssql.UniqueIdentifier, req.params.id)
      .input("comment", mssql.VarChar, req.body.comment)
      .input("updatedAt", mssql.DateTime, new Date())
      .query(
        "UPDATE socialClout.comments SET comment = COALESCE(@comment, comment), updatedAt = @updatedAt WHERE id = @id"
      );
    res.json(apiJSON(result.recordset, "success", 200));
  } catch (error) {
    res.json(apiJSON(null, error.message, 400));
  } finally {
    mssql.close();
  }
};
