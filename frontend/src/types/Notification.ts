export enum NotificationType {
  Like = "like",
  Comment = "comment",
  Follow = "follow",
}

export interface NotificationData {
  // id: string;
  senderId: string;
  senderName: string;
  type: string;
  // message: string;
  receiverId: string;
  read: boolean;
}

export interface NotificationManager {
  notificationMessage: string;
  setNotificationMessage: React.Dispatch<React.SetStateAction<string>>;
  sendNotification: (type: NotificationType, data: NotificationData) => void;
}
