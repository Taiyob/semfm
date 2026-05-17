import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/lib/store/axiosBaseQuery';
import { setCredentials, logout } from './authSlice';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Auth', 'User', 'Profile'] as const,
  endpoints: (builder) => ({
    getMe: builder.query<any, void>({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({
              user: (data as any).data.user,
            })
          );
        } catch (error) {
          dispatch(logout());
        }
      },
      providesTags: ['User', 'Profile'],
    }),

    login: builder.mutation<any, any>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        data: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({
              user: (data as any).data.user,
            })
          );
        } catch (error) {
          console.warn('Login failed:', error);
        }
      },
      invalidatesTags: ['Auth', 'User'],
    }),

    register: builder.mutation<any, any>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        data: userData,
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    logout: builder.mutation<any, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.warn('Server logout failed:', error);
        } finally {
          dispatch(logout());
        }
      },
      invalidatesTags: ['Auth', 'User', 'Profile'],
    }),

    updateProfile: builder.mutation<any, any>({
      query: (userData) => ({
        url: '/users/profile',
        method: 'PATCH',
        data: userData,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({
              user: (data as any).data.user,
            })
          );
        } catch (error) {
          console.warn('Update profile failed:', error);
        }
      },
      invalidatesTags: ['User', 'Profile'],
    }),
  }),
});

export const {
  useGetMeQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
} = authApi;
