import React from "react";
import "./SideNav.css";
import Logo from "./Frame 7.png";
import { useSelector, useDispatch } from "react-redux";
import { changeUI, UIState } from "../../Redux/uiSlice";
import { AiOutlineHome } from "react-icons/ai";
import {
  MdOutlineNotificationsActive,
  MdChat,
  MdPerson,
  MdPeople,
} from "react-icons/md";
import { Link } from "react-router-dom";
import { RootState } from "../../Redux/store";

const SideNav: React.FC = () => {
  const ui = useSelector((state: RootState) => state.ui.ui);
  const dispatch = useDispatch();
  const handleUIChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    const value = e.currentTarget.value as UIState["ui"];
    switch (value) {
      case "Home":
        dispatch(changeUI("Home"));
        break;
      case "Notification":
        dispatch(changeUI("Notification"));
        break;
      case "Messages":
        dispatch(changeUI("Messages"));
        break;
      case "Friends":
        dispatch(changeUI("Friends"));
        break;
      case "Profile":
        dispatch(changeUI("Profile"));
        break;
      default:
        break;
    }
  };

  return (
    <div className="side-nav">
      <div className="side-nav-logo">
        <img src={Logo} alt="" />{" "}
      </div>
      <ul className="side-nav-list">
        {["Home", "Notification", "Messages", "Friends", "Profile"].map(
          (option) => (
            <li key={option}>
              <button value={option} onClick={handleUIChange}>
                <Link to={option === "Home" ? "/" : `/${option.toLowerCase()}`}>
                  <span className={ui === option ? "active" : ""}>
                    {option === "Home" && <AiOutlineHome />}
                    {option === "Notification" && (
                      <MdOutlineNotificationsActive />
                    )}
                    {option === "Messages" && <MdChat />}
                    {option === "Friends" && <MdPeople />}
                    {option === "Profile" && <MdPerson />}
                  </span>
                  <span>{option}</span>
                </Link>
              </button>
            </li>
          )
        )}
        <li>New Post </li>
      </ul>
    </div>
  );
};

export default SideNav;
