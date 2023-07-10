import Nav from "../../componets/Nav/Nav";
import SideNav from "../../componets/SideNav/SideNav";
import "./Friends.css";
import Suggestions from "../../componets/Suggestions/Suggestions";
import MainFriends from "../../componets/MainFriends/MainFriends";

export default function Friends() {
  return (
    <div className="home-container">
      <Nav />
      <div className="home-main">
        <SideNav />
        <MainFriends />
        <Suggestions />
      </div>
    </div>
  );
}
