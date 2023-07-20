/**
 * chart message controller module
 */
import { sqlConfig } from "../utils/db.js";
import mssql from "mssql";
import { v4 as uuidv4 } from "uuid";

const chartMessage = (io) => {
  io.on("connection", (socket) => {
    console.log("connected");
    const roomId = socket.handshake.query.roomId;
    socket.join(roomId);

    socket.on("typing", async (data) => {
      socket.to(data.roomId).emit("typing", data);
    });

    socket.on("room", async (data) => {
      let pool;
      try {
        pool = await mssql.connect(sqlConfig);
        const result = await pool
          .request()
          .input("roomId", mssql.UniqueIdentifier, data.roomId)
          .input("senderId", mssql.UniqueIdentifier, data.senderId)
          .input("receiverId", mssql.UniqueIdentifier, data.receiverId)
          .query(
            `SELECT um.*, u.name AS senderName, u.profilePic AS senderProfilePic, 
                (SELECT name FROM socialClout.users WHERE id = um.receiverId) AS receiverName,
                (SELECT profilePic FROM socialClout.users WHERE id = um.receiverId) AS receiverProfilePic
                FROM socialClout.user_messages um
                JOIN socialClout.users u ON um.senderId = u.id
                WHERE (um.senderId = @senderId AND um.receiverId = @receiverId) OR (um.senderId = @receiverId AND um.receiverId = @senderId) AND um.roomId = @roomId
                ORDER BY um.createAt ASC;`
          );
        // console.log("room data");
        // console.log(result.recordset);

        socket.emit("roomMessages", result.recordset);
      } catch (err) {
        console.error(err);
      } finally {
        await pool.close();
      }
    });

    socket.on("chartMessage", async (data) => {
      const { senderId, receiverId, roomId, message } = data;
      const id = uuidv4();
      const pool = await mssql.connect(sqlConfig);
      try {
        const insertResult = await pool
          .request()
          .input("id", mssql.UniqueIdentifier, id)
          .input("senderId", mssql.UniqueIdentifier, senderId)
          .input("receiverId", mssql.UniqueIdentifier, receiverId)
          .input("roomId", mssql.UniqueIdentifier, roomId)
          .input("message", mssql.NVarChar, message)
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
        if (insertResult.rowsAffected[0] === 1) {
          const selectResult = await pool
            .request()
            .input("roomId", mssql.UniqueIdentifier, roomId)
            .input("senderId", mssql.UniqueIdentifier, senderId)
            .input("receiverId", mssql.UniqueIdentifier, receiverId)
            .query(
              "SELECT * FROM socialClout.user_messages WHERE roomId = @roomId AND senderId = @senderId AND receiverId = @receiverId ORDER BY createAt DESC"
            );
          const newChat = selectResult.recordset[0];
          socket.to(roomId).emit("chartMessage", newChat);
        }
      } catch (err) {
        console.error(err);
      } finally {
        await pool.close();
      }
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
      socket.leave(roomId);
    });
  });
};
export default chartMessage;
