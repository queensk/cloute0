import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import SignIn from "./pages/Login/SignIn";
import Home from "./pages/Home/Home";
import SignUp from "./pages/Register/SignUp";
import Notification from "./pages/Notification/Notification";
import Messages from "./pages/Messages/Messages";
import Friends from "./pages/Friends/Friends";
import Profile from "./pages/Profile/Profile";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./Redux/store";
import RequireAuth from "./features/RequireAuth/RequireAuth";
import { connectSocket, disconnectSocket } from "./features/socketSlice/socket";

function App() {
  const ui = useSelector((state: RootState) => state?.ui?.ui);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { roomId } = useSelector((state: RootState) => state.userChart);
  const userId = useSelector((state: RootState) => state.auth.user.id);
  useEffect(() => {
    if (ui) {
      const uiValue = ui;
      switch (uiValue) {
        case "Home":
          navigate("/", { replace: true });
          break;
        case "Notification":
          navigate("/notification", { replace: true });
          break;
        case "Messages":
          navigate("/messages", { replace: true });
          break;
        case "Friends":
          navigate("/friends", { replace: true });
          break;
        case "Profile":
          navigate("/profile", { replace: true });
          break;
        default:
          break;
      }
    }
  }, [ui]);
  useEffect(() => {
    if (roomId) {
      connectSocket(dispatch, roomId, userId);
    }
    return () => {
      disconnectSocket(dispatch);
    };
  }, [roomId, userId]);
  return (
    <>
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Home />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* <Route path="/about" element={<Home />} /> */}
        {/* <Route path="/contact" element={<Home />} /> */}
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        {/* <Route path="/dashboard" element={<Home />} /> */}
      </Routes>
    </>
  );
}

export default App;
