import React, { useEffect, useState } from "react";
import "./MainNotification.css";
import Logo from "./Frame 7.png";
import { RootState } from "../../Redux/store";
import { useSelector } from "react-redux";
import { NotificationType } from "../../types/Notification";
import moment from "moment";

interface Notification {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  seen: boolean;
  type: NotificationType;
  createdAt: string;
  updatedAt: string;
}

export default function MainNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const userId = useSelector((state: RootState) => state.auth.user.id);
  const socket = useSelector((state: RootState) => state.socket.socket);

  useEffect(() => {
    if (socket) {
      socket.emit("getNotifications", userId);

      socket.on("notification", (notifications: Notification[]) => {
        setNotifications((prevNotifications) => [
          ...notifications,
          ...prevNotifications,
        ]);
      });
    }
  }, [socket, userId]);

  const handleNotificationClick = (index: number) => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = [...prevNotifications];
      updatedNotifications[index].seen = true;
      return updatedNotifications;
    });
  };

  const getNotificationStyle = (type: NotificationType, read: boolean) => {
    let baseStyle = "main-notification-item";
    if (read) {
      baseStyle += " read";
    }

    switch (type) {
      case NotificationType.Like:
        return baseStyle + " like";
      case NotificationType.Comment:
        return baseStyle + " comment";
      case NotificationType.Follow:
        return baseStyle + " follow";
      default:
        return baseStyle;
    }
  };

  return (
    <div className="main-notification-container">
      <div className="main-notification-header">
        <h3>Notifications</h3>
      </div>
      <div className="main-notification-body">
        <div className="main-notification-body-container">
          {notifications.length > 0 &&
            notifications.map((notification, index) => (
              <div
                key={notification.id}
                className={getNotificationStyle(
                  notification.type,
                  notification.seen
                )}
                onClick={() => handleNotificationClick(index)}
              >
                <div className="main-notification-avatar">
                  <div className="main-notification-logo">
                    <img src={Logo} alt="" />
                  </div>
                  <div className="main-notification-content">
                    <div>
                      {!notification.seen && (
                        <>
                          <p>{`New ${notification.type} Notification`}</p>
                          {notification.seen && (
                            <div>
                              <p>{notification.message}</p>
                              <p>{moment(notification.createdAt).fromNow()}</p>
                              {/* Add other additional information as needed */}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
