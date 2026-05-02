import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/lib/store/axiosBaseQuery';

export const propertyApi = createApi({
  reducerPath: 'propertyApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Property', 'SavedProperties'],
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
    getSavedProperties: builder.query<any, void>({
      query: () => ({
        url: '/properties/saved',
        method: 'GET',
      }),
      providesTags: ['SavedProperties'],
    }),
    toggleSaveProperty: builder.mutation({
      query: (id) => ({
        url: `/properties/${id}/save`,
        method: 'POST',
      }),
      // Optimistic Update Logic
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        // 1. Update the Properties List cache optimistically
        const patchResult = dispatch(
          propertyApi.util.updateQueryData('getProperties', { page: 1, limit: 100 }, (draft: any) => {
            const property = draft.data.find((p: any) => p.id === id);
            if (property) {
              property.isSaved = !property.isSaved;
            }
          })
        );

        // 2. Update the Single Property Detail cache optimistically
        const patchResultDetail = dispatch(
          propertyApi.util.updateQueryData('getPropertyById', id, (draft: any) => {
            if (draft?.data) {
              draft.data.isSaved = !draft.data.isSaved;
            }
          })
        );

        // 3. Update the Saved Properties List cache optimistically (for Dashboard)
        const patchResultSaved = dispatch(
          propertyApi.util.updateQueryData('getSavedProperties', undefined, (draft: any) => {
            if (draft?.data) {
              const index = draft.data.findIndex((p: any) => p.id === id);
              if (index !== -1) {
                // If it's already in the list, remove it (Unsave)
                draft.data.splice(index, 1);
              } else {
                // If NOT in the list, try to find it from the main list and add it (Save)
                const state = getState() as any;
                // Look into getProperties cache to find the property details
                const propertiesList = propertyApi.endpoints.getProperties.select({ page: 1, limit: 100 })(state);
                const propertyDetails = (propertiesList as any).data?.data?.find((p: any) => p.id === id);
                
                if (propertyDetails) {
                  draft.data.unshift({ ...propertyDetails, isSaved: true });
                }
              }
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          // If the API call fails, roll back the changes
          patchResult.undo();
          patchResultDetail.undo();
          patchResultSaved.undo();
        }
      },
      invalidatesTags: (result, error, id) => [
        { type: 'Property', id }, 
        'Property', 
        'SavedProperties'
      ],
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
  useDeletePropertyMutation,
  useGetSavedPropertiesQuery,
  useToggleSavePropertyMutation
} = propertyApi;
