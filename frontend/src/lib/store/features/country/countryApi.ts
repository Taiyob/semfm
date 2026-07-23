import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/lib/store/axiosBaseQuery';

export interface MarketInsight {
  id: string;
  regionName: string;
  description: string | null;
  averageYield: number;
  averageAppreciation: number;
  availableProperties: number;
  vacancyRate: number | null;
  indicators: string[];
  image: string | null;
}

export interface Country {
  id: string;
  name: string;
  slug: string;
  continent: string | null;
  imageUrl: string | null;
  isActive: boolean;
  description: string;
  yield: string;
  grossYield: string;
  investors: string;
  region: string;
  availableProperties: number;
  insights?: MarketInsight[];
}

interface CountriesResponse {
  success: boolean;
  message: string;
  data: Country[];
}

interface CountryResponse {
  success: boolean;
  message: string;
  data: Country;
}

export interface Neighborhood {
  id: string;
  name: string;
  regionId: string;
  isActive: boolean;
}

export interface Region {
  id: string;
  name: string;
  countryId: string;
  country: Country;
  baseRent: number;
  isActive: boolean;
  neighborhoods: Neighborhood[];
}

export const countryApi = createApi({
  reducerPath: 'countryApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Country', 'Region'],
  endpoints: (builder) => ({
    getCountries: builder.query<Country[], void>({
      query: () => ({
        url: '/countries?limit=100&includeInactive=true',
        method: 'GET',
      }),
      transformResponse: (response: CountriesResponse) => response.data,
      providesTags: ['Country'],
    }),
    getCountryBySlug: builder.query<Country, string>({
      query: (slug) => ({
        url: `/countries/slug/${slug}`,
        method: 'GET',
      }),
      transformResponse: (response: CountryResponse) => response.data,
      providesTags: (result, error, slug) => [{ type: 'Country', id: slug }],
    }),
    getRegions: builder.query<{ success: boolean; data: Region[] }, void>({
      query: () => ({
        url: '/regions',
        method: 'GET',
      }),
      providesTags: ['Region'],
    }),
    createCountry: builder.mutation<{ success: boolean; data: Country }, Partial<Country>>({
      query: (body) => ({
        url: '/countries',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Country'],
    }),
    deleteCountry: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/countries/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Country'],
    }),
    createRegion: builder.mutation<{ success: boolean; data: Region }, Partial<Region>>({
      query: (body) => ({
        url: '/regions',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Region'],
    }),
    deleteRegion: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/regions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Region'],
    }),
    createNeighborhood: builder.mutation<{ success: boolean; data: Neighborhood }, Partial<Neighborhood>>({
      query: (body) => ({
        url: '/regions/neighborhoods',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Region'],
    }),
    deleteNeighborhood: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/regions/neighborhoods/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Region'],
    }),
  }),
});

export const { 
  useGetCountriesQuery, 
  useGetCountryBySlugQuery, 
  useGetRegionsQuery,
  useCreateCountryMutation,
  useDeleteCountryMutation,
  useCreateRegionMutation,
  useDeleteRegionMutation,
  useCreateNeighborhoodMutation,
  useDeleteNeighborhoodMutation
} = countryApi;
