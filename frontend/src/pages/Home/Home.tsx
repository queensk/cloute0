import Nav from "../../componets/Nav/Nav";
import SideNav from "../../componets/SideNav/SideNav";
import "./Home.css";
import Main from "../../componets/Main/Main";
import Suggestions from "../../componets/Suggestions/Suggestions";

export default function Home() {
  return (
    <div className="home-container">
      <Nav />
      <div className="home-main">
        <SideNav />
        <Main />
        <Suggestions />
      </div>
    </div>
  );
}
