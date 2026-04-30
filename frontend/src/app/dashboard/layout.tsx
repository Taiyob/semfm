'use client';

import { Sidebar } from '@/components/dashboard/Sidebar';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    // Simple protection: Redirect to login if not authenticated
    // Note: In production, you might want to wait for the 'getMe' query to finish
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex min-h-screen bg-stone-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto max-h-screen custom-scrollbar">
        <div className="p-10">
          <header className="mb-10 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-[#2C3E50]">
                Welcome back, {user?.firstName || user?.name || 'User'}
              </h1>
              <p className="text-stone-400 font-bold text-sm">
                Here's what's happening with your portfolio today.
              </p>
            </div>
            <div className="flex items-center gap-4">
               {/* Search or notifications can go here */}
               <div className="size-12 bg-white rounded-2xl shadow-sm border border-stone-100 flex items-center justify-center">
                  <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
               </div>
            </div>
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}
