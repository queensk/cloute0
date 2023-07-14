import React, { useState } from "react";
import "./Post.css";
import Logo from "./_2332e6e9-f74e-4fb8-8bff-d6bd53e9602f.jpg";
import { MdFavorite, MdThumbUpOffAlt, MdComment, MdSend } from "react-icons/md";

export default function Post() {
  const [showComments, setShowComments] = useState(false);

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className="main-post-container">
      <div className="post-header">
        <div className="post-header-left">
          <div className="post-header-left-img">
            <img src={Logo} alt="" />
          </div>
          <div className="post-header-left-name-user">
            <p>queens</p>
            <p>@queensk</p>
          </div>
        </div>
        <div className="post-header-right">
          <p>8 hours ago</p>
        </div>
      </div>
      <div className="post-body">
        <p>
          🎉 Happy Independence Day! 🇺🇸 Celebrating freedom, unity, and the
          indomitable spirit of our great nation. Let's come together, shoulder
          to shoulder, to cherish the values that make us who we are. Today, we
          honor those who fought for our liberties and remember that our
          strength lies in diversity and equality. Enjoy the fireworks, parades,
          and BBQs, but let's also take a moment to reflect on the progress
          we've made and the work that lies ahead. #IndependenceDay
          #ProudAmerican 🗽✨
        </p>
        <img src={Logo} alt="" />
        <div className="post-footer">
          <span className="">
            <MdFavorite />
          </span>
          <span>
            <MdThumbUpOffAlt />
          </span>
          <span onClick={toggleComments}>
            <MdComment />
          </span>
        </div>
        {showComments && (
          <div className="post-comments">
            <div className="comment">
              <div className="comment-user">
                <img src={Logo} alt="" />
                <p>@john</p>
              </div>
              <p className="comment-text">Great post! 🎉</p>
            </div>
            <div className="comment">
              <div className="comment-user">
                <img src={Logo} alt="" />
                <p>@mary</p>
              </div>
              <p className="comment-text">Happy Independence Day! 🇺🇸</p>
            </div>
            {/* Add more comments as needed */}
            <div className="comment-input">
              <input type="text" placeholder="Write a comment..." />
              <MdSend />
            </div>
          </div>
        )}
      </div>
      <div className="post-border-bottom"></div>
    </div>
  );
}
