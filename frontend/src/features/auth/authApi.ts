import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../Redux/store";

const showComments = true;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8085",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (user) => ({
        url: "/auth/register",
        method: "POST",
        body: user,
      }),
    }),
    patchUser: builder.mutation({
      query: ({ id, user }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: user,
      }),
    }),
    createPost: builder.mutation({
      query: (post) => ({
        url: "/posts",
        method: "POST",
        body: post,
      }),
      invalidatesTags: ["Posts"],
    }),
    patchPost: builder.mutation({
      query: ({ id, post }) => ({
        url: `/posts/${id}`,
        method: "PATCH",
        body: post,
      }),
      invalidatesTags: ["Posts"],
    }),
    getPosts: builder.query({
      queryFn: async (arg, api, extraOptions, baseQuery) => {
        const { page, limit, userId } = arg;
        console.log(page, limit, userId);
        const result = await baseQuery({
          url: "/page/posts",
          params: { page, limit, userId },
        });
        return { ...result };
      },
      providesTags: ["Posts"],
      keepUnusedDataFor: 60,
    }),
    getUserPosts: builder.query({
      queryFn: async (arg, api, extraOptions, baseQuery) => {
        const { page, limit, userId } = arg;
        const result = await baseQuery({
          url: "/page/posts",
          params: { page, limit, userId },
        });
        const hasMore = result?.data?.data.length === limit;
        console.log(hasMore);
        return { ...result, hasMore };
      },
    }),
    getPosComments: builder.query({
      queryFn: async (arg, api, extraOptions, baseQuery) => {
        const { id } = arg;
        const result = await baseQuery({
          url: `/post/${id}/comments/`,
          params: id,
        });
        return { ...result };
      },
      // Use the variable
      enabled: showComments,
      providesTags: (result, error, arg) => [{ type: "Comments", id: arg.id }],
    }),
    createPostComments: builder.mutation({
      query: ({ postId, userId, comment }) => ({
        url: `/post/comments`,
        method: "POST",
        body: { comment: comment, postId: postId, userId: userId },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Comments", id: arg.postId },
      ],
    }),
    createLike: builder.mutation({
      query: ({ postId, userId }) => ({
        url: `/like/post`,
        method: "POST",
        body: { postId: postId, userId: userId },
      }),
      invalidatesTags: ["Posts"],
    }),
    deleteLike: builder.mutation({
      query: ({ postId, userId }) => ({
        url: `/like/post`,
        method: "DELETE",
        body: { postId: postId, userId: userId },
      }),
      invalidatesTags: ["Posts"],
    }),
    getLikes: builder.query({
      queryFn: async (arg, api, extraOptions, baseQuery) => {
        const { id } = arg;
        const result = await baseQuery({
          url: `/post/${id}/likes`,
          params: id,
        });
        return { ...result };
      },
      providesTags: (result, error, arg) => [{ type: "Likes", id: arg.id }],
    }),
    searchUser: builder.query({
      queryFn: async (arg, api, extraOptions, baseQuery) => {
        const { userName } = arg;
        console.log(arg);
        console.log(userName);
        const result = await baseQuery({
          url: `/search/user`,
          body: arg,
          method: "POST",
        });
        return { ...result };
      },
    }),
    useMessageUser: builder.mutation({
      query: ({ senderId, receiverId }) => ({
        url: `/chart/room`,
        method: "POST",
        body: { senderId, receiverId },
      }),
    }),
    messageUserData: builder.query({
      queryFn: async (arg, api, extraOptions, baseQuery) => {
        const { receiverId } = arg;
        return baseQuery({
          url: `/users/${receiverId}`,
        });
      },
    }),
    usersData: builder.query({
      queryFn: async (arg, api, extraOptions, baseQuery) => {
        return baseQuery({
          url: `/users`,
          method: "GET",
        });
      },
    }),
    suggestUsersData: builder.query({
      queryFn: async (arg, api, extraOptions, baseQuery) => {
        const { userId } = arg;
        return baseQuery({
          url: `/suggested/users/${userId}`,
          method: "GET",
        });
      },
      providesTags: (result, error, arg) => {
        const { userId } = arg;
        return [{ type: "SuggestUsers", id: userId }];
      },
    }),
    userFollowerData: builder.query({
      queryFn: async (arg, api, extraOptions, baseQuery) => {
        const { userId } = arg;
        return baseQuery({
          url: `/following/user/${userId}`,
          method: "GET",
        });
      },
      providesTags: (result, error, arg) => {
        const { userId } = arg;
        return [{ type: "UserFollower", id: userId }];
      },
    }),
    userCreateFollow: builder.mutation({
      query: ({ userId, followerId }) => ({
        url: `/follower`,
        method: "POST",
        body: { followerId, userId },
      }),
      invalidatesTags: (result, error, arg) => {
        const { userId } = arg;
        return [
          { type: "SuggestUsers", id: userId },
          { type: "UserFollower", id: userId },
        ];
      },
    }),
    userUnFollow: builder.mutation({
      query: ({ userId, followerId }) => ({
        url: `/followers/${userId}/${followerId}`,
        method: "DELETE",
        body: { followerId, userId },
      }),
      invalidatesTags: (result, error, arg) => {
        const { userId } = arg;
        return [
          { type: "SuggestUsers", id: userId },
          { type: "UserFollower", id: userId },
        ];
      },
    }),
    getUserActiveChart: builder.query({
      queryFn: async (arg, api, extraOptions, baseQuery) => {
        const { userId } = arg;
        return baseQuery({
          url: `/chart/user/${userId}`,
          method: "GET",
        });
      },
    }),
    updatePost: builder.mutation({
      query: ({ id, post }) => ({
        url: `/posts/${id}`,
        method: "PATCH",
        body: { post },
      }),
      invalidatesTags: ["Posts"],
    }),
  }),
});
// useGetUserActiveChartQuery,
// useUseMessageUserMutation,
export const { useLoginMutation, useRegisterMutation } = authApi;
export const { useCreatePostMutation, usePatchPostMutation } = authApi;
export const { usePatchUserMutation } = authApi;
export const { useGetPostsQuery } = authApi;
export const { useGetPosCommentsQuery, useCreatePostCommentsMutation } =
  authApi;
export const {
  useCreateLikeMutation,
  useDeleteLikeMutation,
  useGetLikesQuery,
} = authApi;
export const { useSearchUserQuery, useUseMessageUserMutation } = authApi;
export const { useMessageUserDataQuery, useUsersDataQuery } = authApi;
export const { useUserCreateFollowMutation } = authApi;
export const { useSuggestUsersDataQuery } = authApi;
export const { useUserFollowerDataQuery } = authApi;
export const { useUserUnFollowMutation } = authApi;
export const { useGetUserActiveChartQuery } = authApi;
export const { useUpdatePostMutation } = authApi;
export const { useGetUserPostsQuery } = authApi;
// useSuggestUsersDataQuery;
// useUserCreateFollowMutation;
// useUserFollowerDataQuery;

// useGetPosCommentsQuery;
// useGetPostsQuery;
