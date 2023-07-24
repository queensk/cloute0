import { useContext } from "react";
import "./Main.css";
import Post from "../Post/Post";
import { Context } from "../../Context/inputContext";
import PostInput from "../PostInput/PostInput";
import { useGetPostsQuery } from "../../features/auth/authApi";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";

interface PostProps {
  id: string;
  userId: string;
  name: string;
  userName: string;
  profilePic: string | null;
  bio: string;
  post: string;
  postImage: string;
  postVideo: string;
  createdAt: string;
  updatedAt: string;
  liked: number;
  likeCount: number;
}

export default function Main() {
  const { showPostInput } = useContext(Context);
  const userId = useSelector((state: RootState) => state.auth.user.id);
  const [page, setPage] = useState(1);
  const limit = 100;
  const { data, error, isLoading, isFetching } = useGetPostsQuery({
    page,
    limit,
    userId,
  });
  const handleScroll = () => {
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const windowHeight =
      document.documentElement.scrollHeight ||
      document.body.scrollHeight ||
      window.innerHeight;
    if (windowHeight - scrollTop - window.innerHeight < 50) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div className="main-container">
      {showPostInput && <PostInput />}
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error?.message}</p>
      ) : (
        data.data &&
        data.data.map((post: PostProps) => <Post key={post.id} {...post} />)
      )}
      {isFetching && <p>Fetching more posts...</p>}
      {/* {!meta?.hasMore && <p>No more posts to show.</p>} */}
    </div>
  );
}
