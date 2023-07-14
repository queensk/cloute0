import { useContext } from "react";
import "./Main.css";
import Post from "../Post/Post";
import { Context } from "../../Context/inputContext";
import PostInput from "../PostInput/PostInput";

export default function Main() {
  const { showPostInput } = useContext(Context);

  return (
    <div className="main-container">
      {showPostInput && <PostInput />}
      <Post />
      <Post />
      <Post />
      <Post />
      <Post />
      <Post />
    </div>
  );
}
