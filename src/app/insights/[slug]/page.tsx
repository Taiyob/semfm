'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock, 
  Share2, 
  Bookmark, 
  ShieldCheck, 
  TrendingUp,
  Mail,
  CheckCircle2
} from 'lucide-react';

const mockArticleContent = {
  title: 'Lisbon Real Estate Forecast 2026: Trends & Pricing',
  category: 'Market Trends',
  author: 'Elena Rossi',
  role: 'Global Market Analyst',
  date: 'April 4, 2026',
  readTime: '8 min read',
  image: '/assets/portugal_market_insights_thumbnail_1775343038691.png',
  body: `
    <p>The Portuguese property market continues to show remarkable resilience despite the broader European economic slowdown. As we approach the mid-point of 2026, several key trends are emerging that define the next generation of investment opportunities in Lisbon.</p>
    
    <h3>1. The Rise of the Silver Coast</h3>
    <p>While Lisbon and Porto have historical prestige, the Silver Coast is seeing a 12% year-over-year growth in demand from international investors seeking lifestyle-first assets with high rental yield potential.</p>
    
    <h3>2. Impact of New IMT Regulations</h3>
    <p>The 2026 tax reforms have introduced new exemptions for first-time institutional buyers, significantly lowering the entry barrier for portfolios under €2M. Our yield calculators have been fully updated to reflect these regional shifts.</p>
    
    <p>Investors are advised to look specifically at the Beato and Arroios regions, where infrastructure development is projected to drive a 15% equity growth over the next 24 months.</p>
  `,
};

export default function ArticlePage() {
  const { slug } = useParams();

  return (
    <div className="min-h-screen pt-32 pb-24 font-outfit hero-gradient">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Navigation */}
        <Link href="/insights" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#34495E] font-bold text-xs uppercase tracking-widest mb-12 transition-colors">
          <ArrowLeft className="size-4" /> Back to Knowledge Base
        </Link>
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex items-center gap-4 text-[10px] font-black text-[#34495E] uppercase tracking-widest">
                <span>{mockArticleContent.category}</span>
                <span className="size-1 bg-slate-200 rounded-full" />
                <span>{mockArticleContent.date}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-[#2C3E50] leading-tight tracking-tight">{mockArticleContent.title}</h1>
            
            <div className="flex flex-wrap items-center justify-between gap-8 pt-4 pb-8 border-b border-slate-200">
                <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <User className="size-6 text-slate-400" />
                    </div>
                    <div>
                        <div className="text-sm font-black text-[#2C3E50]">{mockArticleContent.author}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{mockArticleContent.role}</div>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <Clock className="size-4" /> {mockArticleContent.readTime}
                    </div>
                    <div className="h-4 w-px bg-slate-200" />
                    <div className="flex items-center gap-4 text-slate-400">
                        <Share2 className="size-5 hover:text-[#34495E] cursor-pointer" />
                        <Bookmark className="size-5 hover:text-[#34495E] cursor-pointer" />
                    </div>
                </div>
            </div>
        </motion.div>

        {/* Content */}
        <div className="py-16">
            <div className="relative h-[450px] rounded-[48px] overflow-hidden mb-16 shadow-2xl">
                <Image src={mockArticleContent.image} alt={mockArticleContent.title} fill className="object-cover" />
            </div>
            
            <div className="prose prose-lg max-w-none prose-slate prose-headings:font-black prose-p:font-bold prose-p:text-slate-500 prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: mockArticleContent.body }}
            />
        </div>

        {/* Action / Newsletter Gating */}
        <div className="mt-24 p-12 bg-slate-950 rounded-[48px] text-white overflow-hidden relative group">
            <div className="relative z-10 max-w-xl space-y-8">
                <div className="section-tag !bg-white/10 !text-white !border-white/20">Institutional Insider</div>
                <h2 className="text-3xl font-black leading-tight">Get the full 2026 <span className="text-[#34495E]">Yield Report</span> PDF.</h2>
                <p className="text-slate-500 text-sm font-bold leading-relaxed">Join 12,000+ investors receiving our proprietary market analysis and off-market deals.</p>
                <form className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-500" />
                        <input type="email" placeholder="name@company.com" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#34495E] outline-none transition-all font-bold" required />
                    </div>
                    <button className="px-8 py-4 bg-[#34495E] text-white font-black rounded-2xl hover:bg-[#2C3E50] shadow-xl shadow-[#34495E]/20 text-xs uppercase tracking-widest">Send Report</button>
                </form>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <CheckCircle2 className="size-4 text-emerald-500" /> Free market guide included.
                </div>
            </div>
            <div className="absolute top-0 right-0 size-64 bg-[#34495E]/10 rounded-full blur-[100px]" />
        </div>

      </div>
    </div>
  );
}
