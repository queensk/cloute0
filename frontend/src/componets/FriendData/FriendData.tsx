import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import "./FriendData.css";
import { FaRegEnvelope, FaUserMinus, FaComment } from "react-icons/fa";
import {
  useUseMessageUserMutation,
  useUserUnFollowMutation,
} from "../../features/auth/authApi";
import { useNavigate } from "react-router-dom";
import { setMessage } from "../../features/chatSlice/chatSlice";
import { changeUI } from "../../Redux/uiSlice";
import { MdCalendarMonth, MdLocationOn } from "react-icons/md";

interface FriendDataProps {
  id: string;
  name: string;
  email: string;
  profilePic: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  joined: string;
  createAt: string;
  updatedAt: string;
}

export default function FriendData({
  id,
  name,
  email,
  profilePic,
  bio,
  location,
  createAt,
}: FriendDataProps) {
  // useUserUnFollowMutation;
  const userId = useSelector((state: RootState) => state.auth.user.id);
  const [unFollow] = useUserUnFollowMutation();
  const [messageUser] = useUseMessageUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleUnFollow = () => {
    unFollow({
      userId: userId,
      followerId: id,
    });
  };
  const handleChartFriend = async (receiverId) => {
    const userRoom = await messageUser({
      senderId: userId,
      receiverId: receiverId,
    });
    dispatch(
      setMessage({
        senderId: userId,
        receiverId: receiverId,
        roomId: userRoom.data.data[0].id,
      })
    );
    navigate("/messages", { replace: true });
    dispatch(changeUI("Messages"));
  };
  return (
    <div className="friend-data">
      <img src={profilePic || "https://picsum.photos/200/300"} alt="" />
      <div className="friend-data-info">
        <p>{name}</p>
        {/* use the FaUserMinus icon for unfollow */}
        <span className="chart-friend-unFollow" onClick={handleUnFollow}>
          <FaUserMinus />
        </span>
        <span className="chart-friend" onClick={() => handleChartFriend(id)}>
          <FaComment />
        </span>
        <a href={`mailto:${email}`}>
          <FaRegEnvelope />
        </a>
      </div>
      <div>
        <p>{bio}</p>
        <div className="friend-data-info-extra">
          {location && (
            <span className="friend-data-info-extra-icon">
              <MdLocationOn />
              <span>{location}</span>
            </span>
          )}
          <span className="friend-data-info-extra-icon">
            <MdCalendarMonth /> Joined{" "}
            {new Date(createAt).toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
