import React, { useContext } from "react";
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
  MdAddCircleOutline,
  MdLogout,
} from "react-icons/md";
import { Link } from "react-router-dom";
import { RootState } from "../../Redux/store";
import { Context } from "../../Context/inputContext";
import { clearAuth } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const SideNav: React.FC = () => {
  const ui = useSelector((state: RootState) => state?.ui?.ui);
  const dispatch = useDispatch();
  const { setShowPostInput } = useContext(Context);
  const navigate = useNavigate();

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

  const handleNewPostClick = () => {
    setShowPostInput(true);
  };
  const handleLogout = () => {
    dispatch(clearAuth());
    navigate("/login", { replace: true });
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
                  <span
                    className={
                      ui === option ? "active side-nav-icon" : "side-nav-icon"
                    }
                  >
                    {option === "Home" && <AiOutlineHome />}
                    {option === "Notification" && (
                      <MdOutlineNotificationsActive />
                    )}
                    {option === "Messages" && <MdChat />}
                    {option === "Friends" && <MdPeople />}
                    {option === "Profile" && <MdPerson />}
                  </span>
                  <span
                    className={
                      ui === option ? "side-nav-text active" : "side-nav-text"
                    }
                  >
                    {option}
                  </span>
                </Link>
              </button>
            </li>
          )
        )}
        <li className="new-post-btn">
          <button onClick={handleNewPostClick}>
            <span className="new-post-text">New Post</span>
            <span>
              <MdAddCircleOutline />
            </span>
          </button>
        </li>
        <li className="logout-btn">
          <button onClick={handleLogout}>
            <span className="new-post-text">Log Out</span>
            <span>
              <MdLogout />
            </span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SideNav;
