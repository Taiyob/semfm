import Link from 'next/link';
import { cn } from '@/lib/utils';

export { Logo as LogoIcon };

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-1 group cursor-pointer", className)}>
      <div className="relative w-24 h-6 flex items-end justify-center">
        {/* The Horizon Arc */}
        <svg
          viewBox="0 0 100 40"
          className="w-full h-full text-[#D4A373] drop-shadow-sm group-hover:scale-105 transition-transform duration-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M10 38 Q 50 0, 90 38" strokeLinecap="round" />
        </svg>
      </div>
      <div className="flex flex-col items-center -space-y-1">
        <span className="text-xl font-black text-stone-900 tracking-[0.1em] uppercase font-outfit">
            HOFMAN <span className="text-[#B55D3E]">HORIZON</span>
        </span>
        <div className="w-full h-px bg-stone-900/10 mt-1 self-stretch" />
      </div>
    </div>
  );
}

