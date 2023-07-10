import React from "react";
import "./Suggestions.css";
import Logo from "./Frame 7.png";

export default function Suggestions() {
  return (
    <div className="user-suggestions">
      <div className="user-suggestions-header">
        <h3>Suggestions</h3>
      </div>
      <div className="user-suggestions-container">
        <div className="user-suggestions-card">
          <img src={Logo} alt="" />
          <div className="user-suggestions-card-info">
            <p>Name</p>
            <p>Description</p>
          </div>
        </div>
        <button className="follow-btn">Follow</button>
      </div>
    </div>
  );
}
