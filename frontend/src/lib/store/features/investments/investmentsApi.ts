import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/lib/store/axiosBaseQuery';

export const investmentsApi = createApi({
  reducerPath: 'investmentsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Investments'],
  endpoints: (builder) => ({
    getInvestments: builder.query<any, void>({
      query: () => ({
        url: '/investments',
        method: 'GET',
      }),
      providesTags: ['Investments'],
    }),
    addInvestment: builder.mutation<any, any>({
      query: (data) => ({
        url: '/investments',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Investments'],
    }),
    deleteInvestment: builder.mutation<any, string>({
      query: (id) => ({
        url: `/investments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Investments'],
    }),
  }),
});

export const { 
  useGetInvestmentsQuery, 
  useAddInvestmentMutation, 
  useDeleteInvestmentMutation 
} = investmentsApi;
