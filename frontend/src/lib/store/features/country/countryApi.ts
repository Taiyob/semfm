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

export const countryApi = createApi({
  reducerPath: 'countryApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Country'],
  endpoints: (builder) => ({
    getCountries: builder.query<Country[], void>({
      query: () => ({
        url: '/countries?limit=100',
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
    getRegions: builder.query<{ success: boolean; data: any[] }, void>({
      query: () => ({
        url: '/regions',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetCountriesQuery, useGetCountryBySlugQuery, useGetRegionsQuery } = countryApi;
