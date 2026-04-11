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
      <div className={blur ? "blur-lg select-none grayscale opacity-30" : ""}>
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Link 
            href="/login" 
            className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl whitespace-nowrap hover:bg-[#B55D3E] transition-colors"
        >
            <Lock className="size-3" />
            Clear for Analysis
        </Link>
      </div>
      {!isLoggedIn && !blur && (
         <div className="flex items-center gap-1 mt-1 text-[9px] font-black text-[#B55D3E] uppercase tracking-widest">
            <Zap className="size-3 fill-current" />
            Unlock High Fidelity Metrics
         </div>
      )}
    </div>
  );
}

