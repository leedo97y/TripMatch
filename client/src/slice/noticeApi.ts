import { createApi } from "@reduxjs/toolkit/query/react";
import type { NoticeType } from "../type/notice";
import { authAxiosBaseQuery } from "./axiosBaseQuery";

export const noticeApi = createApi({
  reducerPath: "noticeApi",
  tagTypes: ["Notice"],
  baseQuery: authAxiosBaseQuery({
    baseUrl:
      "https://port-0-tripmatch-1b5xkk2fldeum3x7.gksl2.cloudtype.app/api/",
  }),
  endpoints: (builder) => ({
    // 전체 동행게시글을 불러옴
    // query params 로 page, region, status를 보냄
    // 예시 : useGetAllFreePostQuery({page: 0})
    // get 요청 이외에는 토큰이 필요해서 인터셉터를 먼저 구현해봐야 테스트할 수 있습니다!
    getAllNotice: builder.query<
      Array<{ noticeId: string; title: string; createdAt: string }>,
      string
    >({
      query: () => {
        return {
          url: "main/notices",
          method: "get",
        };
      },
      providesTags: (result, error, arg) =>
        result
          ? [
              "Notice",
              ...result.map((post) => ({
                type: "Notice" as const,
                id: post.noticeId,
              })),
            ]
          : ["Notice"],
    }),
    // id에 해당하는 게시글을 불러옴
    getNotice: builder.query<NoticeType, string | undefined>({
      query: (noticeId) => ({
        url: `main/notices/${noticeId}`,
        method: "get",
      }),
      providesTags: (result, error, arg) => [{ type: "Notice", id: arg }],
    }),
    // id에 해당하는 게시글을 업데이트
    updateNotice: builder.mutation<NoticeType, NoticeType>({
      query: ({ noticeId, ...post }) => ({
        url: `admin/notices/${noticeId}`,
        method: "put",
        data: post,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Notice", id: arg.noticeId },
      ],
    }),
    // 게시글 추가
    createNotice: builder.mutation<NoticeType, NoticeType>({
      query: (newPost) => ({
        url: "admin/notices/notice",
        method: "post",
        data: newPost,
      }),
      invalidatesTags: ["Notice"],
    }),
    // id에 해당하는 게시글 삭제
    deleteNotice: builder.mutation<NoticeType, string | undefined>({
      query: (noticeId) => ({
        url: `admin/notices/${noticeId}`,
        method: "delete",
      }),
      invalidatesTags: ["Notice"],
    }),
  }),
});

export const {
  useGetAllNoticeQuery,
  useGetNoticeQuery,
  useCreateNoticeMutation,
  useDeleteNoticeMutation,
  useUpdateNoticeMutation,
} = noticeApi;
