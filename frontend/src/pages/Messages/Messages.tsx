import Nav from "../../componets/Nav/Nav";
import SideNav from "../../componets/SideNav/SideNav";
import "./Messages.css";
import Suggestions from "../../componets/Suggestions/Suggestions";
import MainMessages from "../../componets/MainMessages/MainMessages";

export default function Messages() {
  return (
    <div className="home-container">
      <Nav />
      <div className="home-main">
        <SideNav />
        <MainMessages />
        <Suggestions />
      </div>
    </div>
  );
}
