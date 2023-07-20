import { sqlConfig } from "../utils/db.js";
import mssql from "mssql";
import apiJSON from "../utils/apiJson.js";
import { v4 as uuidv4 } from "uuid";

// Create a controller for getting all message rooms
export const getMessageRooms = async (req, res) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const result = await pool
      .request()
      .query("SELECT * FROM socialClout.message_user_room");
    res.json(apiJSON(result.recordset, "success", 200));
  } catch (err) {
    res.json(apiJSON([], "error", 500));
  } finally {
    mssql.close();
  }
};

// Create a controller for getting a message room by id
export const getMessageRoomById = async (req, res) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const result = await pool
      .request()
      .input("id", mssql.UniqueIdentifier, req.params.id)
      .query("SELECT * FROM socialClout.message_user_room WHERE id = @id");
    res.json(apiJSON(result.recordset, "success", 200));
  } catch (err) {
    res.json(apiJSON([], "error", 500));
  } finally {
    mssql.close();
  }
};

// Create a controller for creating a new message room
export const createMessageRoom = async (req, res) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const roomId = uuidv4();
    let id = uuidv4();
    const checkRoomResult = await pool
      .request()
      .input("senderId", mssql.UniqueIdentifier, req.body.senderId)
      .input("receiverId", mssql.UniqueIdentifier, req.body.receiverId)
      .query(
        "SELECT roomId FROM socialClout.user_messages WHERE senderId = @senderId AND receiverId = @receiverId OR senderId=@receiverId  AND receiverId= @senderId"
      );
    if (checkRoomResult.recordset.length > 0) {
      const existingRoomId = checkRoomResult.recordset[0].roomId;
      const existingRoomResult = await pool
        .request()
        .input("id", mssql.UniqueIdentifier, existingRoomId)
        .query("SELECT * FROM socialClout.message_user_room WHERE id = @id");
      res.json(
        apiJSON(existingRoomResult.recordset, "Room already exists", 200)
      );
    } else {
      const result = await pool
        .request()
        .input("id", mssql.UniqueIdentifier, id)
        .input("room", mssql.UniqueIdentifier, roomId)
        .input("createdAt", mssql.DateTime, new Date())
        .input("updatedAt", mssql.DateTime, new Date())
        .query(
          "INSERT INTO socialClout.message_user_room VALUES (@id, @room, @createdAt, @updatedAt)"
        );
      if (result.rowsAffected[0] > 0) {
        const createInitMessage = await pool
          .request()
          .input("id", mssql.UniqueIdentifier, uuidv4())
          .input("senderId", mssql.UniqueIdentifier, req.body.senderId)
          .input("receiverId", mssql.UniqueIdentifier, req.body.receiverId)
          .input("roomId", mssql.UniqueIdentifier, id)
          .input("message", mssql.NVarChar, "Hello")
          .input("seen", mssql.Bit, false)
          .input("image", mssql.VarChar, "")
          .input("audioURL", mssql.VarChar, "")
          .input("videoURL", mssql.VarChar, "")
          .input("fileURL", mssql.VarChar, "")
          .input("status", mssql.VarChar, "")
          .input("createAt", mssql.DateTime, new Date())
          .input("updatedAt", mssql.DateTime, new Date())
          .query(
            "INSERT INTO socialClout.user_messages (id, senderId, receiverId, roomId, message, seen, image, audioURL, videoURL, fileURL, status, createAt, updatedAt) VALUES (@id, @senderId, @receiverId, @roomId, @message, @seen, @image, @audioURL, @videoURL, @fileURL, @status, @createAt, @updatedAt)"
          );
        if (createInitMessage.rowsAffected[0] > 0) {
          const messageRoom = await pool
            .request()
            .input("id", mssql.UniqueIdentifier, id)
            .query(
              "SELECT * FROM socialClout.message_user_room WHERE id = @id"
            );
          res.json(apiJSON(messageRoom.recordset, "success", 200));
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.json(apiJSON([], "error", 500));
  } finally {
    mssql.close();
  }
};

// Create a controller for deleting a message room by id
export const deleteMessageRoom = async (req, res) => {
  try {
    const pool = await mssql.connect(sqlConfig);
    const result = await pool
      .request()
      .input("id", mssql.UniqueIdentifier, req.params.id)
      .query("DELETE FROM socialClout.message_user_room WHERE id = @id");
    res.json(apiJSON(result.recordset, "success", 200));
  } catch (err) {
    res.json(apiJSON([], "error", 500));
  } finally {
    mssql.close();
  }
};

export default {
  getMessageRooms,
  getMessageRoomById,
  createMessageRoom,
  deleteMessageRoom,
};
