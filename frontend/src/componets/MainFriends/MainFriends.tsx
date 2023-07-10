import "./MainFriends.css";
import FriendData from "../FriendData/FriendData";

export default function MainFriends() {
  return (
    <div className="main-container">
      <div className="main-friends-title">
        <h1>Friends</h1>
        <div className="main-messages-tittle-about">
          <div>
            <img src="https://picsum.photos/200/300" alt="message" />
          </div>
          <div className="main-messages-tittle-about-name">
            <p>name</p>
            <p>status</p>
          </div>
        </div>
      </div>
      <FriendData />
    </div>
  );
}
