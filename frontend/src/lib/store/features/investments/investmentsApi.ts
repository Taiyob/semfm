import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../../axiosBaseQuery';

export const investmentsApi = createApi({
  reducerPath: 'investmentsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Investment'],
  endpoints: (builder) => ({
    getInvestments: builder.query<any, void>({
      query: () => ({
        url: '/investments',
        method: 'GET',
      }),
      providesTags: ['Investment'],
    }),
    addInvestment: builder.mutation({
      query: (data) => ({
        url: '/investments',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Investment'],
    }),
    deleteInvestment: builder.mutation({
      query: (id) => ({
        url: `/investments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Investment'],
    }),
  }),
});

export const {
  useGetInvestmentsQuery,
  useAddInvestmentMutation,
  useDeleteInvestmentMutation,
} = investmentsApi;
