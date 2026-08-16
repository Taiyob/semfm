'use client';

import React from 'react';
import { useGetCampaignsQuery } from '@/lib/store/features/newsletter/newsletterApi';
import Link from 'next/link';
import { format } from 'date-fns';

export default function NewslettersPage() {
  const { data: response, isLoading, error } = useGetCampaignsQuery();

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Our Newsletters
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Stay updated with our latest insights and market reports.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-10">
            Failed to load newsletters. Please try again later.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {response?.data?.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-10">
                No newsletters found yet. Subscribe to get our first issue!
              </div>
            ) : (
              response?.data?.map((campaign: any) => (
                <div 
                  key={campaign.id} 
                  className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col"
                >
                  <div className="p-6 flex-grow">
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <time dateTime={campaign.send_time}>
                        {campaign.send_time ? format(new Date(campaign.send_time), 'MMMM d, yyyy') : 'Unknown date'}
                      </time>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {campaign.settings?.title || campaign.settings?.subject_line || 'Newsletter Update'}
                    </h3>
                    <p className="text-gray-600 line-clamp-3">
                      {campaign.settings?.preview_text || 'Click below to read our latest update and insights.'}
                    </p>
                  </div>
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <Link
                      href={campaign.long_archive_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-800 font-medium inline-flex items-center"
                    >
                      Read full newsletter
                      <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
