import Link from 'next/link';
import { cn } from '@/lib/utils';

export { Logo as LogoIcon };

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5 group cursor-pointer", className)}>
      <div className="relative size-10 flex items-center justify-center shrink-0">
        <div className="absolute inset-0 bg-blue-600/10 rounded-xl blur-lg group-hover:bg-blue-600/20 transition-all duration-500" />
        <div className="relative size-9 bg-slate-900 rounded-xl shadow-lg flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500 overflow-hidden border border-white/10">
          <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <svg
            className="size-5 text-white relative z-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col -space-y-1">
        <span className="text-xl font-black text-slate-900 tracking-tight uppercase font-outfit">
            Inves<span className="text-blue-600">Terra</span>
        </span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Global Hub</span>
      </div>
    </div>
  );
}
