import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/lib/store/axiosBaseQuery';

export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Blog'],
  endpoints: (builder) => ({
    getBlogs: builder.query({
      query: (params) => ({
        url: '/v1/blog',
        method: 'GET',
        params,
      }),
      providesTags: ['Blog'],
    }),
    getBlogBySlug: builder.query({
      query: (slug) => ({
        url: `/v1/blog/post/${slug}`,
        method: 'GET',
      }),
      providesTags: ['Blog'],
    }),
  }),
});

export const { useGetBlogsQuery, useGetBlogBySlugQuery } = blogApi;
