import { createApi } from "@reduxjs/toolkit/query/react";
import type { CommentType } from "../type/comment";
import { authAxiosBaseQuery, axiosBaseQuery } from "./axiosBaseQuery";

export const commentApi = createApi({
  reducerPath: "commentApi",
  tagTypes: ["Comment"],
  baseQuery: authAxiosBaseQuery({
    baseUrl:
      "https://port-0-tripmatch-1b5xkk2fldeum3x7.gksl2.cloudtype.app/api/",
  }),
  endpoints: (builder) => ({
    // id에 해당하는 댓글을 업데이트
    updateComment: builder.mutation<
      CommentType,
      { commentId: string; content: string }
    >({
      query: ({ commentId, ...content }) => ({
        url: `main/comment/${commentId}`,
        method: "put",
        data: content,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Comment", id: arg.commentId },
      ],
    }),
    // 댓글 추가
    createComment: builder.mutation<
      null,
      { content: string; communityId?: string; postId?: string }
    >({
      query: (newComment) => ({
        url: "main/comment",
        method: "post",
        data: newComment, // body:{content:string,(communityId || postId):string}
      }),
      invalidatesTags: ["Comment"],
    }),
    // id에 해당하는 댓글 삭제
    deleteComment: builder.mutation<null, string>({
      query: (commentId) => ({
        url: `main/comment/${commentId}`,
        method: "delete",
      }),
      invalidatesTags: ["Comment"],
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentApi;
