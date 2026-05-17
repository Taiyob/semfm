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
          {children}
        </div>
      </main>
    </div>
  );
}
