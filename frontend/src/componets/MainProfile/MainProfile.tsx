import React from "react";
import "./MainProfile.css";
import { useState } from "react";

type UserProfileProps = {
  name: string; // the name of the user
  username: string; // the username of the user
  bio: string; // the bio of the user
  location: string; // the location of the user
  website: string; // the website of the user
  joined: string; // the date when the user joined
  following: number; // the number of users that the user is following
  followers: number; // the number of users that are following the user
  tweets: number; // the number of tweets that the user has posted
};

export default function MainProfile() {
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
  const [editMode, setEditMode] = useState(false);
  const handleEdit = () => {
    setEditMode(!editMode);
  };

  return (
    <div className="main-container">
      <div className="user-profile">
        <img
          src="https://picsum.photos/id/237/200/300"
          alt="User Banner"
          className="user-banner"
        />

        <div className="user-info">
          <img
            src="https://picsum.photos/id/237/200/300"
            alt="User Avatar"
            className="user-avatar"
          />
          <button className="edit-button" onClick={handleEdit}>
            {editMode ? "Save" : "Edit Profile"}
          </button>
          <div className="user-details-container">
            {editMode ? (
              <>
                <input
                  type="text"
                  value={dummyData.name}
                  onChange={(e) => {
                    dummyData.name = e.target.value;
                  }}
                  className="user-name-input"
                />
                <input
                  type="text"
                  value={dummyData.username}
                  onChange={(e) => {
                    // update the username with the input value
                    dummyData.username = e.target.value;
                  }}
                  className="user-username-input"
                />
                <input
                  type="text"
                  value={dummyData.bio}
                  onChange={(e) => {
                    // update the bio with the input value
                    dummyData.bio = e.target.value;
                  }}
                  className="user-bio-input"
                />
              </>
            ) : (
              <>
                <h1 className="user-name">{dummyData.name}</h1>
                <p className="user-username">@{dummyData.username}</p>
                <p className="user-bio">{dummyData.bio}</p>
              </>
            )}

            <div className="user-details">
              {editMode ? (
                <>
                  <input
                    type="text"
                    value={dummyData.location}
                    onChange={(e) => {
                      // update the location with the input value
                      dummyData.location = e.target.value;
                    }}
                    className="user-location-input"
                  />
                  <input
                    type="text"
                    value={dummyData.website}
                    onChange={(e) => {
                      // update the website with the input value
                      dummyData.website = e.target.value;
                    }}
                    className="user-website-input"
                  />
                </>
              ) : (
                <>
                  <span className="user-location">{dummyData.location}</span>
                  <span className="user-website">{dummyData.website}</span>
                  <span className="user-joined">Joined {dummyData.joined}</span>
                </>
              )}
            </div>
            <div className="user-stats">
              {!editMode && (
                <>
                  <span className="user-tweets">
                    {dummyData.tweets} <strong>Tweets</strong>
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
            <div className="user-posts">
              <h3>No Posts</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
