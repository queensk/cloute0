import { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";

import {
  NotificationType,
  NotificationData,
  NotificationManager,
} from "../../types/Notification";

const ENDPOINT = "http://localhost:8085";

const useNotificationManager = (receiverId: string): NotificationManager => {
  const [notificationMessage, setNotificationMessage] = useState("");
  const socket = socketIOClient(ENDPOINT);

  useEffect(() => {
    socket.emit("notificationConnect", { receiverId });
  }, [receiverId]);

  const sendNotification = (type: NotificationType, data: NotificationData) => {
    let message = "";
    switch (type) {
      case NotificationType.Like:
        console.log(data);
        message = `${data.senderName} liked your post.`;
        break;
      case NotificationType.Follow:
        message = `${data.senderName} started following you.`;
        break;
      case NotificationType.Comment:
        message = `${data.senderName} commented on your post.`;
        break;
      default:
        message = "";
        break;
    }

    socket.emit("notification", { type, data: { ...data, message } });
  };

  return {
    notificationMessage,
    setNotificationMessage,
    sendNotification,
  };
};

export default useNotificationManager;
