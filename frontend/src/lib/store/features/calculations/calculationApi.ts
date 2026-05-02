import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/lib/store/axiosBaseQuery';

export interface SavedCalculation {
  id: string;
  name: string;
  inputData: any;
  resultsData: any;
  propertyId: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  property?: {
    title: string;
    location: string;
  };
}

export const calculationApi = createApi({
  reducerPath: 'calculationApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Calculation'],
  endpoints: (builder) => ({
    getMyCalculations: builder.query<{ status: string; data: { calculations: SavedCalculation[] } }, void>({
      query: () => ({
        url: '/calculations/my',
        method: 'GET',
      }),
      providesTags: ['Calculation'],
    }),
    
    saveCalculation: builder.mutation<any, { name: string; inputData: any; resultsData: any; propertyId?: string }>({
      query: (data) => ({
        url: '/calculations',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Calculation'],
    }),

    deleteCalculation: builder.mutation<any, string>({
      query: (id) => ({
        url: `/calculations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Calculation'],
    }),
  }),
});

export const {
  useGetMyCalculationsQuery,
  useSaveCalculationMutation,
  useDeleteCalculationMutation,
} = calculationApi;
