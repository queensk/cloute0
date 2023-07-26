import { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";

import {
  NotificationType,
  NotificationData,
  NotificationManager,
} from "../../types/Notification";
import { RootState } from "../../Redux/store";
import { useSelector } from "react-redux";

const useNotificationManager = (receiverId: string): NotificationManager => {
  const [notificationMessage, setNotificationMessage] = useState("");
  const socket = useSelector((state: RootState) => state.socket.socket);

  useEffect(() => {
    if (socket) {
      socket.emit("notificationConnect", { receiverId });
      socket.on("notification", (notification) => {
        setNotificationMessage(notification.message);
      });
    }
  }, [receiverId]);

  const sendNotification = (type: NotificationType, data: NotificationData) => {
    let message = "";
    switch (type) {
      case NotificationType.Like:
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

    if (socket) {
      socket.emit("sendNotification", { type, data: { ...data, message } });
    }
  };

  return {
    notificationMessage,
    setNotificationMessage,
    sendNotification,
  };
};

export default useNotificationManager;
