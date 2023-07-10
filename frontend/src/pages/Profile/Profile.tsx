import Nav from "../../componets/Nav/Nav";
import SideNav from "../../componets/SideNav/SideNav";
import "./Profile.css";
import Suggestions from "../../componets/Suggestions/Suggestions";
import MainProfile from "../../componets/MainProfile/MainProfile";

export default function Profile() {
  return (
    <div className="home-container">
      <Nav />
      <div className="home-main">
        <SideNav />
        <MainProfile />
        <Suggestions />
      </div>
    </div>
  );
}
