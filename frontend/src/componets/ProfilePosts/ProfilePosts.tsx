import React, { useState } from "react";
import { useGetPostsQuery } from "../../features/auth/authApi";
import { RootState } from "../../Redux/store";
import { useSelector } from "react-redux";
import EditPost from "../EditPost/EditPost";

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

export default function ProfilePosts() {
  const userId = useSelector((state: RootState) => state.auth.user.id);
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, error, isLoading, isFetching, meta } = useGetPostsQuery({
    page,
    limit,
    userId,
  });
  return (
    <div className="user-posts">
      {/* {showPostInput && <PostInput />} */}
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error?.message}</p>
      ) : (
        data.data &&
        data.data.map((post: PostProps) => <EditPost key={post.id} {...post} />)
      )}
      {isFetching && <p>Fetching more posts...</p>}
      {!meta?.hasMore && <h3>No Posts</h3>}
    </div>
  );
}
