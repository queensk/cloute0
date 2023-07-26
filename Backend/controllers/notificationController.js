import { sqlConfig } from "../utils/db.js";
import mssql from "mssql";
import { v4 as uuidv4 } from "uuid";

const notificationHandler = async (io) => {
  io.on("connection", (socket) => {
    const receiverId = socket.handshake.query.receiverId;
    socket.join(receiverId);

    socket.on("sendNotification", async (notification) => {
      const receiverSocketId = notification.data.receiverId;
      const pool = await mssql.connect(sqlConfig);
      const id = uuidv4();
      try {
        const result = await pool
          .request()
          .input("id", mssql.UniqueIdentifier, id)
          .input("senderId", mssql.UniqueIdentifier, notification.data.senderId)
          .input(
            "receiverId",
            mssql.UniqueIdentifier,
            notification.data.receiverId
          )
          .input("message", mssql.NVarChar, notification.data.message)
          .input("seen", mssql.Bit, false)
          .input("type", mssql.VarChar, notification.type)
          .input("createdAt", mssql.DateTime, new Date())
          .input("updatedAt", mssql.DateTime, new Date())
          .query(
            `INSERT INTO socialClout.notification (id, senderId, receiverId, message, seen, type, createdAt, updatedAt) VALUES (@id, @senderId, @receiverId, @message, @seen, @type, @createdAt, @updatedAt) SELECT * FROM socialClout.notification WHERE id = @id`
          );
        if (result.rowsAffected[0] === 1) {
          const newComment = await pool
            .request()
            .input("id", mssql.UniqueIdentifier, id)
            .query(`SELECT * FROM socialClout.notification WHERE id = @id`);
          io.to(receiverSocketId).emit("notification", newComment.recordset);
        }
      } catch (err) {
        console.error(err);
      } finally {
        pool.close();
      }
    });

    socket.on("getNotifications", async (receiverId) => {
      console.log(receiverId);
      const pool = await mssql.connect(sqlConfig);
      try {
        const result = await pool
          .request()
          .input("receiverId", mssql.UniqueIdentifier, receiverId)
          .query(
            `SELECT * FROM socialClout.notification WHERE receiverId = @receiverId ORDER BY createdAt DESC`
          );
        socket.emit("notification", result.recordset);
      } catch (err) {
        console.error(err);
      } finally {
        pool.close();
      }
    });

    socket.on("seenNotificationRead", async (notificationId) => {
      const pool = await mssql.connect(sqlConfig);
      try {
        const result = await pool
          .request()
          .input("id", mssql.UniqueIdentifier, notificationId)
          .query(`UPDATE socialClout.notification SET seen = 1 WHERE id = @id`);
        if (result.rowsAffected[0] === 1) {
          const newComment = await pool
            .request()
            .input("id", mssql.UniqueIdentifier, notificationId)
            .query(`SELECT * FROM socialClout.notification WHERE id = @id`);
          socket.emit("notification", newComment.recordset);
        }
      } catch (err) {
        console.error(err);
      } finally {
        pool.close();
      }
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};

export default notificationHandler;
