import { sqlConfig } from "../utils/db.js";
import mssql from "mssql";
import apiJSON from "../utils/apiJson.js";
import { v4 as uuidv4 } from "uuid";

// get all likes
/**
 * A controller for getting all likes
 *@param {Object} req - The request object
 *@param {Object} res - The response object
 */

export const getLikes = async (req, res) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const result = await pool
      .request()
      .query("SELECT * FROM socialClout.likes");
    res.json(apiJSON(result.recordset, "success", 200));
  } catch (error) {
    res.json(apiJSON(error, "error", 500));
  } finally {
    mssql.close();
  }
};

// get all likes by id
/**
 * A controller for getting all likes by id
 *@param {Object} req - The request object
 *@param {Object} res - The response object
 */

export const getLikesById = async (req, res) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const result = await pool
      .request()
      .input("id", mssql.UniqueIdentifier, req.params.id)
      .query("SELECT * FROM socialClout.likes WHERE id = @id");
    res.json(apiJSON(result.recordset, "success", 200));
  } catch (error) {
    res.json(apiJSON(error, "error", 500));
  } finally {
    mssql.close();
  }
};

// get all likes by userId

/**
 * get all likes by userId
 * A controller for getting all likes by id
 *@param {Object} req - The request object
 *@param {Object} res - The response object
 */

export const getLikesByUserId = async (req, res) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const result = await pool
      .request()
      .input("userId", mssql.UniqueIdentifier, req.params.userId)
      .query("SELECT * FROM socialClout.likes WHERE userId = @userId");
    res.json(apiJSON(result.recordset, "success", 200));
  } catch (error) {
    res.json(apiJSON(error, "error", 500));
  } finally {
    mssql.close();
  }
};

/**
 * get all likes by postId
 *@param {Object} req - The request object
 *@param {Object} res - The response object
 */
export const getLikesByPostId = async (req, res) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const result = await pool
      .request()
      .input("postId", mssql.UniqueIdentifier, req.params.postId)
      .query("SELECT * FROM socialClout.likes WHERE postId = @postId");
    res.json(apiJSON(result.recordset, "success", 200));
  } catch (error) {
    res.json(apiJSON(error, "error", 500));
  } finally {
    mssql.close();
  }
};

// create a like
/**
 * create a like for a user id
 *@param {Object} req - The request object
 *@param {Object} res - The response object
 */

export const createLike = async (req, res) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const result = await pool
      .request()
      .input("id", mssql.UniqueIdentifier, uuidv4())
      .input("userId", mssql.UniqueIdentifier, req.body.userId)
      .input("postId", mssql.UniqueIdentifier, req.body.postId)
      .input("createAt", mssql.DateTime, new Date())
      .input("updatedAt", mssql.DateTime, new Date())
      .query(
        "INSERT INTO socialClout.likes (id, userId, postId, createAt, updatedAt) VALUES (@id, @userId, @postId, @createAt, @updatedAt)"
      );
    res.json(apiJSON(result.recordset, "success", 200));
  } catch (error) {
    res.json(apiJSON(error, "error", 500));
  } finally {
    mssql.close();
  }
};

// delete a like

/**
 * delete  a post like
 *@param {Object} req - The request object
 *@param {Object} res - The response object
 */
export const deleteLike = async (req, res) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const result = await pool
      .request()
      .input("id", mssql.UniqueIdentifier, req.params.id)
      .query("DELETE FROM socialClout.likes WHERE id = @id");
    if (result.rowsAffected[0] === 0) {
      res.json(apiJSON("no like found", "error", 500));
    } else {
      res.json(apiJSON(result.recordset, "success", 200));
    }
  } catch (error) {
    res.json(apiJSON(error, "error", 500));
  } finally {
    mssql.close();
  }
};

/**
 * delete  a post by userId and postId
 *@param {Object} req - The request object
 *@param {Object} res - The response object
 */
export const deleteLikeByUserIdAndPostId = async (req, res) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const result = await pool
      .request()
      .input("userId", mssql.UniqueIdentifier, req.body.userId)
      .input("postId", mssql.UniqueIdentifier, req.body.postId)
      .query(
        "DELETE FROM socialClout.likes WHERE userId = @userId AND postId = @postId"
      );
    if (result.rowsAffected[0] === 0) {
      res.json(apiJSON("no like found", "error", 500));
    } else {
      res.json(apiJSON(result.recordset, "success", 200));
    }
  } catch (error) {
    res.json(apiJSON(error, "error", 500));
  } finally {
    mssql.close();
  }
};
