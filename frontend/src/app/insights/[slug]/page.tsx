'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Share2, 
  Bookmark, 
  Mail,
  CheckCircle2
} from 'lucide-react';
import { format } from 'date-fns';

const MOCK_ARTICLES: Record<string, any> = {
  'lisbon-real-estate-forecast-2026': {
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
      <p>The 2026 tax reforms have introduced new exemptions for first-time buyers, significantly lowering the entry barrier for portfolios under €2M. Our yield calculators have been fully updated to reflect these regional shifts.</p>
      
      <p>Investors are advised to look specifically at the Beato and Arroios regions, where infrastructure development is projected to drive a 15% equity growth over the next 24 months.</p>
    `,
  },
  'new-tax-laws-imt': {
    title: 'New Tax Laws (IMT) and Their Impact on Investors',
    category: 'Tax & Regulation',
    author: 'Legal Desk',
    role: 'Legal Team',
    date: 'March 28, 2026',
    readTime: '12 min read',
    image: '/assets/portugal_market_insights_thumbnail_1775343038691.png',
    body: '<p>Detailed breakdown of the recent changes to the Portuguese property transfer tax and stamp duty exemptions for first-time investors.</p>',
  },
  'post-nhr-era': {
    title: 'Post-NHR Era: Why Portugal Still Wins',
    category: 'Regional Guide',
    author: 'Hofman Horizon Team',
    role: 'Advisors',
    date: 'March 15, 2026',
    readTime: '6 min read',
    image: '/assets/portugal_market_insights_thumbnail_1775343038691.png',
    body: '<p>Exploring the new tax regimes and why the destination remains the #1 choice for European remote workers.</p>',
  },
  'spain-rental-law-updates-2026': {
    title: 'Spain Rental Law Updates 2026',
    category: 'Tax & Regulation',
    author: 'Carlos Ruiz',
    role: 'Market Expert',
    date: 'April 10, 2026',
    readTime: '10 min read',
    image: '/assets/spain-map-bg.png',
    body: '<p>How the new nationwide rent controls are affecting prime markets in Madrid and Barcelona.</p>',
  }
};

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/v1/blog/post/${slug}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        
        if (data.success && data.data) {
          setArticle({
            title: data.data.title,
            category: data.data.category,
            author: data.data.author,
            role: 'Author',
            date: format(new Date(data.data.createdAt), 'MMMM d, yyyy'),
            readTime: data.data.readTime || '5 min read',
            image: data.data.imageUrl || '/assets/portugal_market_insights_thumbnail_1775343038691.png',
            body: data.data.content,
          });
        } else {
          // Fallback to dummy
          setArticle(MOCK_ARTICLES[slug as string] || null);
        }
      } catch (error) {
        console.error('Failed to fetch article:', error);
        setArticle(MOCK_ARTICLES[slug as string] || null);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center font-montserrat hero-gradient">
        <div className="text-xl font-black text-[#D4A373] animate-pulse tracking-widest uppercase">Loading Insight...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center font-montserrat hero-gradient space-y-6">
        <div className="text-2xl font-black text-[#2C3E50] tracking-widest uppercase">Insight Not Found</div>
        <Link href="/insights" className="px-8 py-4 bg-[#2C3E50] text-white font-black rounded-2xl hover:bg-[#D4A373] transition-all text-xs uppercase tracking-widest">
          Back to Knowledge Base
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 font-montserrat hero-gradient">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Navigation */}
        <Link href="/insights" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#34495E] font-bold text-xs uppercase tracking-widest mb-12 transition-colors">
          <ArrowLeft className="size-4" /> Back to Knowledge Base
        </Link>
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex items-center gap-4 text-[10px] font-black text-[#34495E] uppercase tracking-widest">
                <span>{article.category}</span>
                <span className="size-1 bg-slate-200 rounded-full" />
                <span>{article.date}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-[#2C3E50] leading-tight tracking-tight">{article.title}</h1>
            
            <div className="flex flex-wrap items-center justify-between gap-8 pt-4 pb-8 border-b border-slate-200">
                <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <User className="size-6 text-slate-400" />
                    </div>
                    <div>
                        <div className="text-sm font-black text-[#2C3E50]">{article.author}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{article.role}</div>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <Clock className="size-4" /> {article.readTime}
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
                <Image src={article.image} alt={article.title} fill className="object-cover" />
            </div>
            
            <div className="prose prose-lg max-w-none prose-slate prose-headings:font-black prose-p:font-bold prose-p:text-slate-500 prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.body }}
            />
        </div>

        {/* Action / Newsletter Gating */}
        <div className="mt-24 p-12 bg-slate-950 rounded-[48px] text-white overflow-hidden relative group">
            <div className="relative z-10 max-w-xl space-y-8">
                <div className="section-tag !bg-white/10 !text-white !border-white/20">Market Insider</div>
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
