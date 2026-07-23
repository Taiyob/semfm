import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/lib/store/axiosBaseQuery';

export const newsletterApi = createApi({
  reducerPath: 'newsletterApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Newsletter'],
  endpoints: (builder) => ({
    subscribeNewsletter: builder.mutation({
      query: (data) => ({
        url: '/v1/newsletter/subscribe',
        method: 'POST',
        data,
      }),
    }),
  }),
});

export const { useSubscribeNewsletterMutation } = newsletterApi;
