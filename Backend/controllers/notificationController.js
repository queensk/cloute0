const socketIds = new Map();

const notificationHandler = (io) => {
  io.on("connection", (socket) => {
    const receiverId = socket.handshake.query.receiverId;
    socketIds.set(receiverId, socket.id);

    socket.on("notification", (notification) => {
      console.log(notification);

      // Emit the notification back to the receiver
      const receiverSocketId = socketIds.get(receiverId);
      console.log(receiverSocketId);
      io.to(receiverSocketId).emit("notification", notification);

      // Disconnect the socket after sending the notification
      socket.disconnect(true);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
      socketIds.delete(receiverId);
    });
  });
};

export default notificationHandler;
