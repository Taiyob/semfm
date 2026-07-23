import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/lib/store/axiosBaseQuery';

export const clubApi = createApi({
  reducerPath: 'clubApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Club'],
  endpoints: (builder) => ({
    applyForClub: builder.mutation<any, { name: string; email: string; country: string; reason: string }>({
      query: (data) => ({
        url: '/v1/club/apply',
        method: 'POST',
        data,
      }),
    }),
  }),
});

export const { useApplyForClubMutation } = clubApi;
