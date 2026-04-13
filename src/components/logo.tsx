import Link from 'next/link';
import { cn } from '@/lib/utils';

export { Logo as LogoIcon };

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-0 group cursor-pointer", className)}>
      <div className="relative w-32 h-8 flex items-end justify-center overflow-hidden">
        {/* The Horizon Arc - Refined for Premium Feel */}
        <svg
          viewBox="0 0 100 40"
          className="w-full h-full text-[#C5A572] transition-colors duration-700"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path 
            d="M2 38 Q 50 -5, 98 38" 
            strokeLinecap="round" 
            className="drop-shadow-[0_2px_4px_rgba(197,165,114,0.3)]"
          />
        </svg>
      </div>
      <div className="flex flex-col items-center -mt-1">
        <span className="text-xl font-black text-[#2C3E50] tracking-[0.1em] font-montserrat leading-none">
            Hofman <span className="text-[#34495E]">Horizon</span>
        </span>

        <div className="flex items-center gap-2 w-full mt-2">
            <div className="h-[1px] flex-grow bg-[#34495E]/30" />
            <span className="text-[8px] font-bold text-stone-400 whitespace-nowrap tracking-wide">Institutional intelligence</span>
            <div className="h-[1px] flex-grow bg-[#34495E]/30" />
        </div>
      </div>
    </div>
  );
}


