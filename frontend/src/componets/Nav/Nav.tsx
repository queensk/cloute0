import React from "react";
import { Link } from "react-router-dom";
import "./Nav.css";
import logo from "./Frame 7.png";
import SearchForm from "../SearchForm/SearchForm";

const NavBar: React.FC = () => {
  //   const handleLogOut = () => {
  //     localStorage.removeItem("token");
  //     window.location.reload();
  //   };
  return (
    <nav>
      <div className="nav_log">
        <Link to="/">
          <img src={logo} />
        </Link>
      </div>
      <SearchForm />
    </nav>
  );
};

export default NavBar;
