import "./MainFriends.css";
import FriendData from "../FriendData/FriendData";
import { useUserFollowerDataQuery } from "../../features/auth/authApi";
import { RootState } from "../../Redux/store";
import { useSelector } from "react-redux";

export default function MainFriends() {
  const { id: userId, name } = useSelector(
    (state: RootState) => state.auth.user
  );
  const { data, isLoading, isError, error } = useUserFollowerDataQuery({
    userId,
  });

  console.log(data);
  return (
    <div className="main-container">
      <div className="main-friends-title">
        <h1>Friends</h1>

        <div className="main-messages-tittle-about">
          <div>
            <img src="https://picsum.photos/200/300" alt="message" />
          </div>
          <div className="main-messages-tittle-about-name">
            <p>{name}</p>
            <p>online</p>
          </div>
        </div>
      </div>
      {(data?.data?.length ?? 0) > 0 &&
        data?.data.map((item) => <FriendData key={item.id} {...item} />)}
    </div>
  );
}
