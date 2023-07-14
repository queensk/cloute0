import Nav from "../../componets/Nav/Nav";
import SideNav from "../../componets/SideNav/SideNav";
import "./Home.css";
import Main from "../../componets/Main/Main";
import Suggestions from "../../componets/Suggestions/Suggestions";
import { ContextProvider } from "../../Context/inputContext";

export default function Home() {
  return (
    <ContextProvider>
      <div className="home-container">
        <Nav />
        <div className="home-main">
          <SideNav />
          <Main />
          <Suggestions />
        </div>
      </div>
    </ContextProvider>
  );
}
