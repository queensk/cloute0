import { sqlConfig } from "../utils/db.js";
import mssql from "mssql";
import apiJSON from "../utils/apiJson.js";
import { v4 as uuidv4 } from "uuid";

/**
 * A controller for getting all messages
 *@param {Object} req - The request object
 *@param {Object} res - The response object
 */
export const getMessages = async (req, res) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const result = await pool
      .request()
      .query("SELECT * FROM socialClout.messages");
    res.json(apiJSON(result.recordset, "success", 200));
  } catch (err) {
    res.json(apiJSON([], "error", 500));
  } finally {
    mssql.close();
  }
};

/**
 * A controller for getting message by senderid and receiverid
 *@param {Object} req - The request object
 *@param {Object} res - The response object
 */

export const getMessageBySenderIdAndReceiverId = async (req, res) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const result = await pool
      .request()
      .input("senderId", mssql.UniqueIdentifier, req.params.senderId)
      .input("receiverId", mssql.UniqueIdentifier, req.params.receiverId)
      .query(
        "SELECT * FROM socialClout.messages WHERE senderId = @senderId AND receiverId = @receiverId"
      );
    res.json(apiJSON(result.recordset, "success", 200));
  } catch (err) {
    res.json(apiJSON([], "error", 500));
  } finally {
    mssql.close();
  }
};

/**
 * A controller for create messages
 *@param {Object} req - The request object
 *@param {Object} res - The response object
 */

export const createMessage = async (req, res) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const result = await pool
      .request()
      .input("id", mssql.UniqueIdentifier, uuidv4())
      .input("senderId", mssql.UniqueIdentifier, req.body.senderId)
      .input("receiverId", mssql.UniqueIdentifier, req.body.receiverId)
      .input("message", mssql.VarChar, req.body.message)
      .input("createdAt", mssql.DateTime, new Date())
      .input("updatedAt", mssql.DateTime, new Date())
      .query(
        "INSERT INTO socialClout.messages VALUES (@id, @senderId, @receiverId, @message, @createdAt, @updatedAt)"
      );
    res.json(apiJSON(result.recordset, "success", 200));
    if (result.rowsAffected[0] === 0) {
      res.json(apiJSON([], "message not found ", 500));
    } else {
      res.json(apiJSON(result.recordset, "success", 200));
    }
  } catch (err) {
    res.json(apiJSON([], "error", 500));
  } finally {
    mssql.close();
  }
};

/**
 * A controller for delete messages
 *@param {Object} req - The request object
 *@param {Object} res - The response object
 */

export const deleteMessage = async (req, res) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const result = await pool
      .request()
      .input("id", mssql.UniqueIdentifier, req.params.id)
      .query("DELETE FROM socialClout.messages WHERE id = @id");
    res.json(apiJSON(result.recordset, "success", 200));
    if (result.rowsAffected[0] === 0) {
      res.json(apiJSON([], "message not found", 500));
    } else {
      res.json(apiJSON(result.recordset, "success", 200));
    }
  } catch (err) {
    res.json(apiJSON([], "error", 500));
  } finally {
    mssql.close();
  }
};
