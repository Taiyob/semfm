import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/lib/store/axiosBaseQuery';

export const planApi = createApi({
  reducerPath: 'planApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Plan'],
  endpoints: (builder) => ({
    getPlans: builder.query<any, void>({
      query: () => ({
        url: '/plans',
        method: 'GET',
      }),
      providesTags: ['Plan'],
    }),
  }),
});

export const { useGetPlansQuery } = planApi;
