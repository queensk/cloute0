import "./MainNotification.css";
import Logo from "./Frame 7.png";
export default function MainNotification() {
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
          <p>queens</p>
          <p>
            We would like to inform you that your account has been successfully
            created. You can now log in using your credentials and acced
            .....more
          </p>
        </div>
      </div>
    </div>
  );
}
