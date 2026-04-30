import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/lib/store/axiosBaseQuery';

export const propertyApi = createApi({
  reducerPath: 'propertyApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Property'],
  endpoints: (builder) => ({
    getProperties: builder.query({
      query: (params) => ({
        url: '/properties',
        method: 'GET',
        params,
      }),
      providesTags: ['Property'],
    }),
    getPropertyById: builder.query({
      query: (id) => ({
        url: `/properties/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Property', id }],
    }),
    getMyProperties: builder.query({
      query: (params) => ({
        url: '/properties/my',
        method: 'GET',
        params,
      }),
      providesTags: ['Property'],
    }),
    createProperty: builder.mutation({
      query: (propertyData) => ({
        url: '/properties',
        method: 'POST',
        data: propertyData,
      }),
      invalidatesTags: ['Property'],
    }),
    incrementViews: builder.mutation({
      query: (id) => ({
        url: `/properties/${id}/view`,
        method: 'PATCH',
      }),
      // We don't necessarily need to invalidate here as it's a silent update, 
      // but if we want the dashboard to update in real-time, we could.
    }),
    incrementLeads: builder.mutation({
      query: (id) => ({
        url: `/properties/${id}/lead`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Property'],
    }),
    updateProperty: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/properties/${id}`,
        method: 'PATCH',
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Property', id },
        'Property'
      ],
    }),
    deleteProperty: builder.mutation({
      query: (id) => ({
        url: `/properties/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Property'],
    }),
  }),
});

export const { 
  useGetPropertiesQuery, 
  useGetMyPropertiesQuery, 
  useGetPropertyByIdQuery,
  useCreatePropertyMutation,
  useIncrementViewsMutation,
  useIncrementLeadsMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation
} = propertyApi;
