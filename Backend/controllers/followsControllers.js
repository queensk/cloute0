import { sqlConfig } from "../utils/db.js";
import mssql from "mssql";
import apiJSON from "../utils/apiJson.js";
import { v4 as uuidv4 } from "uuid";

/**
 * A controller for getting all followers
 *@param {Object} req - The request object
 *@param {Object} res - The response object
 */

export const getAllFollowers = async (req, res) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const result = await pool
      .request()
      .query("SELECT * FROM socialClout.follows");
    res.json(apiJSON(result.recordset, "success", 200));
  } catch (err) {
    res.json(apiJSON([], "error", 500));
  } finally {
    mssql.close();
  }
};

/**
 * A controller for all followers by userid
 *@param {Object} req - The request object
 *@param {Object} res - The response object
 */

export const getAllFollowersByUserId = async (req, res) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const result = await pool
      .request()
      .input("userId", mssql.UniqueIdentifier, req.params.userId)
      .query("SELECT * FROM socialClout.follows WHERE userId = @userId");
    res.json(apiJSON(result.recordset, "success", 200));
  } catch (err) {
    res.json(apiJSON([], "error", 500));
  } finally {
    mssql.close();
  }
};

/**
 * A controller for getting all followers by followerId
 *@param {Object} req - The request object
 *@param {Object} res - The response object
 */

export const getAllFollowersByFollowerId = async (req, res) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const result = await pool
      .request()
      .input("followerId", mssql.UniqueIdentifier, req.params.followerId)
      .query(
        "SELECT * FROM socialClout.follows WHERE followerId = @followerId"
      );
    res.json(apiJSON(result.recordset, "success", 200));
  } catch (err) {
    res.json(apiJSON([], "error", 500));
  } finally {
    mssql.close();
  }
};

/**
 * A controller for creating a follow
 *@param {Object} req - The request object
 *@param {Object} res - The response object
 */
export const createFollow = async (req, res) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const result = await pool
      .request()
      .input("id", mssql.UniqueIdentifier, uuidv4())
      .input("userId", mssql.UniqueIdentifier, req.body.userId)
      .input("followerId", mssql.UniqueIdentifier, req.body.followerId)
      .input("createAt", mssql.DateTime, new Date())
      .input("updatedAt", mssql.DateTime, new Date())
      .query(
        "INSERT INTO socialClout.follows VALUES (@id, @userId, @followerId, @createAt, @updatedAt)"
      );
    res.json(apiJSON(result.recordset, "success", 200));
  } catch (err) {
    res.json(apiJSON([], "error", 500));
  } finally {
    mssql.close();
  }
};

/**
 * A controller for deleting
 *@param {Object} req - The request object
 *@param {Object} res - The response object
 */

export const deleteFollow = async (req, res) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const result = await pool
      .request()
      .input("id", mssql.UniqueIdentifier, req.params.id)
      .query("DELETE FROM socialClout.follows WHERE id = @id");
    res.json(apiJSON(result.recordset, "success", 200));
  } catch (err) {
    res.json(apiJSON([], "error", 500));
  } finally {
    mssql.close();
  }
};
