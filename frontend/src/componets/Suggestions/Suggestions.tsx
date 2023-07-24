import React, { useState } from "react";
import "./Suggestions.css";
import Logo from "./Frame 7.png";
import {
  useSuggestUsersDataQuery,
  useUserCreateFollowMutation,
  useUsersDataQuery,
} from "../../features/auth/authApi";
import { RootState } from "../../Redux/store";
import { useSelector } from "react-redux";

export default function Suggestions() {
  const [showMore, setShowMore] = useState({});
  const userId = useSelector((state: RootState) => state.auth.user.id);
  // const { data, isLoading, isError, error } = useUsersDataQuery({});
  // const { data, isLoading, isError, error } = useSuggestUsersDataQuery({
  //   userId,
  // });
  const { data, isLoading, isError, error } = useSuggestUsersDataQuery({
    userId,
  });

  console.log("suggested users");
  console.log(data);

  const [createFollow] = useUserCreateFollowMutation();

  const toggleShowMore = (id) => {
    setShowMore((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const handleFollow = async (id) => {
    const userdata = await createFollow({
      followerId: id,
      userId: userId,
    });
  };

  return (
    <div className="user-suggestions">
      <div className="user-suggestions-header">
        <h3>Suggestions</h3>
      </div>
      <div className="user-suggestions-container">
        {data?.data?.map((user) => (
          <div key={user?.id} className="user-suggestions-card">
            <img src={user.profilePic ? user.profilePic : Logo} alt="" />
            <div className="user-suggestions-card-info">
              <p>{user?.name}</p>
              {showMore[user?.id] ? (
                <p>
                  {user?.bio}{" "}
                  <span
                    className="less"
                    onClick={() => toggleShowMore(user?.id)}
                  >
                    Show less
                  </span>
                </p>
              ) : (
                <p>
                  {user?.bio?.slice(0, 10)}...{" "}
                  <span
                    className="more"
                    onClick={() => toggleShowMore(user?.id)}
                  >
                    Read more
                  </span>
                </p>
              )}
            </div>
            <button
              className="follow-btn"
              onClick={() => handleFollow(user?.id)}
            >
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
