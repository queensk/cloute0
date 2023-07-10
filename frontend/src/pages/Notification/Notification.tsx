import Nav from "../../componets/Nav/Nav";
import SideNav from "../../componets/SideNav/SideNav";
import "./Notification.css";
import MainNotification from "../../componets/MainNotification/MainNotification";
import Suggestions from "../../componets/Suggestions/Suggestions";
export default function Notification() {
  return (
    <div className="home-container">
      <Nav />
      <div className="home-main">
        <SideNav />
        <MainNotification />
        <Suggestions />
      </div>
    </div>
  );
}
