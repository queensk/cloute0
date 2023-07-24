import Nav from "../../componets/Nav/Nav";
import SideNav from "../../componets/SideNav/SideNav";
import "./Messages.css";
import MainMessages from "../../componets/MainMessages/MainMessages";
import ChatUsers from "../../componets/ChatUsers/ChatUsers";

export default function Messages() {
  return (
    <div className="home-container">
      <Nav />
      <div className="home-main">
        <SideNav />
        <MainMessages />
        <ChatUsers />
      </div>
    </div>
  );
}
