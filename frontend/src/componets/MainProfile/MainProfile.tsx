import "./MainProfile.css";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { usePatchUserMutation } from "../../features/auth/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/auth/authSlice";
import { UserData } from "../../types/user";
import {
  MdLocationOn,
  MdAddPhotoAlternate,
  MdLink,
  MdCalendarMonth,
} from "react-icons/md";
import { Link } from "react-router-dom";
import ProfilePosts from "../ProfilePosts/ProfilePosts";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import storage from "../../config/firebaseconfig.tsx";

export default function MainProfile() {
  const userData = useSelector((state: RootState) => state.auth.user);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(userData.name || "");
  const [username, setUsername] = useState(userData.userName || "");
  const [bio, setBio] = useState(userData.bio || "");
  const [location, setLocation] = useState(userData.location || "");
  const [website, setWebsite] = useState(userData.website || "");
  const [patchUser] = usePatchUserMutation();
  const dispatch = useDispatch();
  const profileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const storageRef = ref(storage, `${userData.id}/profile`);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const dummyData = {
    name: "John Doe", // a dummy name
    username: "johndoe", // a dummy username
    bio: "I'm a web developer and a twitter enthusiast.", // a dummy bio
    location: "New York, USA", // a dummy location
    website: "https://johndoe.com", // a dummy website
    joined: "January 2020", // a dummy joined date
    following: 123, // a dummy following count
    followers: 456, // a dummy followers count
    tweets: 789, // a dummy tweets count
  };

  const handleEdit = () => {
    setEditMode(!editMode);
  };

  const handleSave = async () => {
    const data = {
      name: name,
      userName: username,
      bio: bio,
      location: location,
      website: website,
    };
    let profilePic: string = userData.profilePic || "";
    let bannerPic: string = userData.bannerPic || "";

    if (bannerImage) {
      const bannerFileRef = ref(storageRef, "bannerImage");
      await uploadBytes(bannerFileRef, bannerImage);
      bannerPic = await getDownloadURL(bannerFileRef);
    }
    if (profileImage) {
      const profileFileRef = ref(storageRef, "profileImage");
      await uploadBytes(profileFileRef, profileImage);
      profilePic = await getDownloadURL(profileFileRef);
    }
    const updatedData = { ...data, profilePic, bannerPic };

    const response = await patchUser({
      id: userData.id,
      user: updatedData,
    });

    if ("data" in response && "data" in response.data) {
      const updatedUserData: UserData = response.data.data;
      dispatch(setUser(updatedUserData));
      setEditMode(false);
      setBannerImage(null);
      setProfileImage(null);
    } else if ("error" in response && response.error) {
      console.error(response.error);
    } else {
      console.error("Invalid response format");
    }
  };

  const handleProfileUpload = () => {
    if (profileInputRef.current) {
      profileInputRef.current.click();
    }
  };

  const handleBannerUpload = () => {
    if (bannerInputRef.current) {
      bannerInputRef.current.click();
    }
  };

  return (
    <div className="main-container">
      <div className="user-profile">
        <img
          src={
            userData.bannerPic
              ? userData.bannerPic
              : "https://picsum.photos/id/237/200/300"
          }
          alt="User Banner"
          className="user-banner"
        />
        {editMode && (
          <>
            <button
              className="upload-user-banner-button"
              onClick={handleBannerUpload}
            >
              <MdAddPhotoAlternate />
            </button>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) =>
                setBannerImage(e.target.files ? e.target.files[0] : null)
              }
              ref={bannerInputRef}
            />
          </>
        )}

        <div className="user-info">
          <img
            src={
              userData.profilePic
                ? userData.profilePic
                : "https://picsum.photos/id/237/200/300"
            }
            alt="User Avatar"
            className="user-avatar"
          />
          {editMode && (
            <>
              <button
                className="upload-user-avatar-button"
                onClick={handleProfileUpload}
              >
                <MdAddPhotoAlternate />
              </button>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) =>
                  setProfileImage(e.target.files ? e.target.files[0] : null)
                }
                ref={profileInputRef}
              />
            </>
          )}
          <button
            className="edit-button"
            onClick={editMode ? handleSave : handleEdit}
          >
            {editMode ? "Save" : "Edit Profile"}
          </button>
          <div className="user-details-container">
            {editMode ? (
              <div className="user-details-inputs">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="user-name-input"
                  placeholder="John Doe"
                />
                <label htmlFor="username">User Name</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="user-username-input"
                  placeholder="johndoe"
                />
                <label htmlFor="bio">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="user-bio-input"
                  placeholder="I'm a web developer and a twitter enthusiast."
                />
              </div>
            ) : (
              <div className="user-details-inputs">
                <h1 className="user-name">{userData.name || `Your Name`}</h1>
                <p className="user-username">@{userData.userName || `user`}</p>
                <p className="user-bio">{userData.bio || `create a bio`}</p>
              </div>
            )}
            <div className="user-details">
              {editMode ? (
                <div className="user-details-input-location-website">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="user-location-input"
                    placeholder="New York, USA"
                  />
                  <label htmlFor="website">Website</label>{" "}
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="user-website-input"
                    placeholder="https://johndoe.com"
                  />
                </div>
              ) : (
                <>
                  <span className="user-location">
                    <MdLocationOn />
                    {userData.location || "add locations"}
                  </span>
                  <Link to={userData.website ? userData.website : "/"}>
                    <span className="user-website">
                      <MdLink />
                      {userData.website || "add website"}
                    </span>
                  </Link>
                  <span className="user-joined">
                    <MdCalendarMonth /> Joined{" "}
                    {new Date(userData.createAt).toLocaleString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </>
              )}
            </div>
            <div className="user-stats">
              {!editMode && (
                <>
                  <span className="user-tweets">
                    {dummyData.tweets} <strong>Clout</strong>
                  </span>
                  <span className="user-following">
                    {dummyData.following} <strong>Following</strong>
                  </span>
                  <span className="user-followers">
                    {dummyData.followers} <strong>Followers</strong>
                  </span>
                </>
              )}
            </div>
            <ProfilePosts />
          </div>
        </div>
      </div>
    </div>
  );
}
