import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/lib/store/axiosBaseQuery';

export interface Lead {
  id: string;
  message: string | null;
  status: 'NEW' | 'CONTACTED' | 'CLOSED';
  propertyId: string;
  userId: string;
  agentId: string;
  createdAt: string;
  updatedAt: string;
  property: {
    title: string;
    location: string;
  };
  user: {
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
  };
}

export const leadsApi = createApi({
  reducerPath: 'leadsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Lead'],
  endpoints: (builder) => ({
    getMyLeads: builder.query<{ status: string; data: { leads: Lead[] } }, void>({
      query: () => ({
        url: '/leads/my',
        method: 'GET',
      }),
      providesTags: ['Lead'],
    }),
    
    updateLeadStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/leads/${id}/status`,
        method: 'PATCH',
        data: { status },
      }),
      invalidatesTags: ['Lead'],
    }),

    createLead: builder.mutation<any, { propertyId: string; message?: string }>({
      query: (data) => ({
        url: '/leads',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Lead'],
    }),

    deleteLead: builder.mutation<any, string>({
      query: (id) => ({
        url: `/leads/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Lead'],
    }),
  }),
});

export const { 
  useGetMyLeadsQuery, 
  useUpdateLeadStatusMutation,
  useCreateLeadMutation,
  useDeleteLeadMutation
} = leadsApi;
