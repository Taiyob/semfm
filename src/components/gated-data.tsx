'use client';

import { useState, ReactNode } from 'react';
import { Lock, Zap } from 'lucide-react';
import Link from 'next/link';

interface GatedDataProps {
  children: ReactNode;
  isPremium?: boolean;
  blur?: boolean;
}

export function GatedData({ children, blur = true }: GatedDataProps) {
  // Simulate auth state (In production, use a real useAuth hook)
  const [isLoggedIn] = useState(false); 

  if (isLoggedIn) {
    return <>{children}</>;
  }

  return (
    <div className="relative group cursor-help">
      <div className={blur ? "blur-md select-none grayscale opacity-50" : ""}>
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Link 
            href="/login" 
            className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xl whitespace-nowrap"
        >
            <Lock className="size-3" />
            Unlock Pro Data
        </Link>
      </div>
      {!isLoggedIn && !blur && (
         <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-blue-600 uppercase tracking-tight">
            <Zap className="size-3 fill-current" />
            Sign in to access ROI details
         </div>
      )}
    </div>
  );
}
