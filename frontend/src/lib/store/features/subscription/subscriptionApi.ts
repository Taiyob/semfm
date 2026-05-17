import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/lib/store/axiosBaseQuery';

export const subscriptionApi = createApi({
  reducerPath: 'subscriptionApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Subscription'],
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation<{ success: boolean; data: { url: string } }, { planId: string }>({
      query: (data) => ({
        url: '/subscriptions/create-checkout-session',
        method: 'POST',
        data,
      }),
    }),
    createPortalSession: builder.mutation<{ success: boolean; data: { url: string } }, void>({
      query: () => ({
        url: '/subscriptions/create-portal-session',
        method: 'POST',
      }),
    }),
    getSubscription: builder.query<any, void>({
      query: () => ({
        url: '/subscriptions/me', // Need to implement this in backend
        method: 'GET',
      }),
      providesTags: ['Subscription'],
    }),
  }),
});

export const { 
  useCreateCheckoutSessionMutation,
  useCreatePortalSessionMutation,
  useGetSubscriptionQuery 
} = subscriptionApi;
