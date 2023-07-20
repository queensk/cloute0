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
      .query("SELECT * FROM socialClout.user_messages");
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
    console.log(req.params.roomId, req.body.senderId, req.body.receiverId);
    const result = await pool
      .request()
      .input("senderId", mssql.UniqueIdentifier, req.body.senderId)
      .input("receiverId", mssql.UniqueIdentifier, req.body.receiverId)
      .input("roomId", mssql.UniqueIdentifier, req.params.roomId)
      .query(
        `SELECT um.*, u.name, u.profilePic FROM socialClout.user_messages um
          JOIN socialClout.users u ON um.senderId = u.id OR um.receiverId = u.id
          WHERE um.senderId = @senderId AND um.receiverId = @receiverId AND um.roomId = @roomId`
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
    let roomId = req.body.roomId;
    const pool = await mssql.connect(sqlConfig);
    if (!roomId) {
      roomId = uuidv4();
    }
    const existingRoom = await pool
      .request()
      .input("roomId", mssql.UniqueIdentifier, roomId)
      .query("SELECT * FROM socialClout.message_user_room WHERE id = @roomId");
    if (existingRoom.recordset.length === 0) {
      let id = uuidv4();
      await pool
        .request()
        .input("id", mssql.UniqueIdentifier, id)
        .input("room", mssql.UniqueIdentifier, roomId)
        .input("createdAt", mssql.DateTime, new Date())
        .input("updatedAt", mssql.DateTime, new Date())
        .query(
          "INSERT INTO socialClout.message_user_room VALUES (@id, @room, @createdAt, @updatedAt)"
        );
    }
    const result = await pool
      .request()
      .input("id", mssql.UniqueIdentifier, uuidv4())
      .input("senderId", mssql.UniqueIdentifier, req.body.senderId)
      .input("receiverId", mssql.UniqueIdentifier, req.body.receiverId)
      .input("roomId", mssql.UniqueIdentifier, id)
      .input("message", mssql.VarChar, req.body.message)
      .input("createdAt", mssql.DateTime, new Date())
      .input("updatedAt", mssql.DateTime, new Date())
      .query(
        "INSERT INTO socialClout.user_messages VALUES (@id, @senderId, @receiverId, @roomId, @message, @createdAt, @updatedAt)"
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
      .query("DELETE FROM socialClout.user_messages WHERE id = @id");
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
