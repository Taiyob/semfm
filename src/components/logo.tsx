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
          className="w-full h-full text-[#D4A373] group-hover:text-[#B55D3E] transition-colors duration-700"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <path 
            d="M5 38 Q 50 -10, 95 38" 
            strokeLinecap="round" 
            className="drop-shadow-[0_2px_4px_rgba(181,93,62,0.2)]"
          />
        </svg>
      </div>
      <div className="flex flex-col items-center -mt-1">
        <span className="text-xl font-black text-stone-900 tracking-[0.2em] uppercase font-outfit leading-none">
            HOFMAN <span className="text-[#B55D3E]">HORIZON</span>
        </span>
        <div className="flex items-center gap-2 w-full mt-2">
            <div className="h-[1px] flex-grow bg-stone-200" />
            <span className="text-[7px] font-black uppercase tracking-[0.4em] text-stone-400 whitespace-nowrap">Institutional Intelligence</span>
            <div className="h-[1px] flex-grow bg-stone-200" />
        </div>
      </div>
    </div>
  );
}


