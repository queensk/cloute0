import React, { useState, useEffect } from "react";
import "./MainNotification.css";
import Logo from "./Frame 7.png";
import socketIOClient from "socket.io-client";

export default function MainNotification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const ENDPOINT = "http://localhost:8085"; // Replace with your server's endpoint

    // Establish a WebSocket connection with the server
    const socket = socketIOClient(ENDPOINT, {
      query: {
        receiverId: "YOUR_RECEIVER_ID", // Replace with the receiver's ID (e.g., user ID)
      },
    });

    // Listen for incoming notifications from the server
    socket.on("notification", (notification) => {
      console.log("New notification received:", notification);
      setNotifications((prevNotifications) => [
        notification,
        ...prevNotifications,
      ]);
    });

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="main-notification-container">
      <div className="main-notification-header">
        <h3>Notifications</h3>
      </div>
      <div className="main-notification-body">
        <div className="main-notification-logo">
          <img src={Logo} alt="" />
        </div>
        <div className="main-notification-content">
          {/* Map through the notifications and render each one */}
          {notifications.map((notification, index) => (
            <div key={index}>
              <p>{notification.senderId}</p>
              <p>{notification.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
