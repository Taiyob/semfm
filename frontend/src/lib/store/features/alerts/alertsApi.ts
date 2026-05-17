import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/lib/store/axiosBaseQuery';

export const alertsApi = createApi({
  reducerPath: 'alertsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Alerts'],
  endpoints: (builder) => ({
    getAlerts: builder.query<any, void>({
      query: () => ({
        url: '/alerts',
        method: 'GET',
      }),
      providesTags: ['Alerts'],
    }),
    createAlert: builder.mutation<any, any>({
      query: (data) => ({
        url: '/alerts',
        method: 'POST',
        data: data,
      }),
      invalidatesTags: ['Alerts'],
    }),
    toggleAlert: builder.mutation<any, string>({
      query: (id) => ({
        url: `/alerts/${id}/toggle`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Alerts'],
    }),
    deleteAlert: builder.mutation<any, string>({
      query: (id) => ({
        url: `/alerts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Alerts'],
    }),
    updateAlert: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/alerts/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['Alerts'],
    }),
  }),
});

export const {
  useGetAlertsQuery,
  useCreateAlertMutation,
  useToggleAlertMutation,
  useDeleteAlertMutation,
  useUpdateAlertMutation,
} = alertsApi;
