'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import Link from 'next/link';
import { 
  BookOpen, 
  Clock, 
  User, 
  ArrowRight, 
  TrendingUp, 
  Globe, 
  ShieldCheck, 
  ChevronRight,
  Bookmark,
  Share2,
  Calendar,
  Lock,
  Search
} from 'lucide-react';

const articles = [
  {
    id: 1,
    title: 'Lisbon Real Estate Forecast 2026: Trends & Pricing',
    excerpt: 'Deep dive into why prices in Arroios and Beato continue to outpace the national average despite interest rate fluctuations.',
    author: 'Elena Rossi',
    date: 'April 4, 2026',
    readTime: '8 min read',
    category: 'Market Trends',
    image: '/assets/portugal_market_insights_thumbnail_1775343038691.png',
    featured: true,
  },
  {
    id: 2,
    title: 'New Tax Laws (IMT) and Their Impact on Investors',
    excerpt: 'Detailed breakdown of the recent changes to the Portuguese property transfer tax and stamp duty exemptions for first-time investors.',
    author: 'Legal Desk',
    date: 'March 28, 2026',
    readTime: '12 min read',
    category: 'Taxes & Law',
    image: '/assets/portugal_market_insights_thumbnail_1775343038691.png',
  },
  {
    id: 3,
    title: 'Post-NHR Era: Why Portugal Still Wins',
    excerpt: 'Exploring the new tax regimes and why the destination remains the #1 choice for European remote workers.',
    author: 'InvesTerra Team',
    date: 'March 15, 2026',
    readTime: '6 min read',
    category: 'Regional Guide',
    image: '/assets/portugal_market_insights_thumbnail_1775343038691.png',
  },
];

const categories = [
  { name: 'All Insights', count: 42 },
  { name: 'Market Trends', count: 18 },
  { name: 'Taxes & Law', count: 7 },
  { name: 'Regional Guides', count: 12 },
  { name: 'Investor Case Studies', count: 5 },
];

export default function InsightsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 font-outfit hero-gradient min-h-screen">
      
      {/* Page Header */}
      <div className="max-w-3xl mb-20 space-y-6">
        <div className="section-tag">
            <BookOpen className="size-4" />
            Knowledge Base
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight">Market <span className="gradient-text">Intelligence.</span></h1>
        <p className="text-xl text-slate-500 font-bold leading-relaxed">
            Data-backed analysis, legal updates, and deep dives into the European real estate landscape.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-16">
        
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-16">
            
            {/* Featured Article */}
            {articles.filter(a => a.featured).map(article => (
                <motion.div 
                    key={article.id}
                    initial={{ opacity: 0, y: 20, scale: 1, borderColor: 'rgba(241, 245, 249, 0)' }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ 
                        y: -15, 
                        scale: 1.01,
                        borderColor: 'rgba(59, 130, 246, 0.4)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.12)'
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="glass-card rounded-[48px] overflow-hidden group cursor-pointer border-2 relative z-0 hover:z-10"
                >
                    <div className="relative h-[450px]">
                        <Image 
                            src={article.image} 
                            alt={article.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 800px"
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                        <div className="absolute top-8 left-8 flex gap-2">
                             <div className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-500/20">Featured Insight</div>
                        </div>
                    </div>
                    <div className="p-10 lg:p-14 -mt-16 relative z-10 bg-white rounded-t-[48px]">
                        <div className="flex items-center gap-4 text-xs font-black text-blue-600 uppercase tracking-widest mb-6">
                            <span>{article.category}</span>
                            <span className="size-1 bg-slate-200 rounded-full" />
                            <span className="text-slate-400">{article.date}</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 group-hover:text-blue-600 transition-colors leading-tight">{article.title}</h2>
                        <p className="text-slate-500 text-lg leading-relaxed mb-10 font-bold">{article.excerpt}</p>
                        <div className="flex items-center justify-between border-t border-slate-100 pt-8">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full bg-slate-50 flex items-center justify-center">
                                    <User className="size-5 text-slate-400" />
                                </div>
                                <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{article.author}</span>
                            </div>
                            <div className="flex items-center gap-2 font-black text-blue-600 uppercase tracking-widest text-xs group-hover:gap-3 transition-all">
                                Read Full Report <ArrowRight className="size-5" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}

            {/* Grid for Smaller Articles */}
            <div className="grid md:grid-cols-2 gap-10">
                {articles.filter(a => !a.featured).map((article, idx) => (
                    <motion.div 
                        key={article.id}
                        initial={{ opacity: 0, y: 20, scale: 1, borderColor: 'rgba(241, 245, 249, 0)' }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ 
                            y: -12, 
                            scale: 1.02,
                            borderColor: 'rgba(59, 130, 246, 0.4)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.12)'
                        }}
                        viewport={{ once: true }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className="glass-card rounded-[40px] overflow-hidden group cursor-pointer border-2 relative z-0 hover:z-10"
                    >
                        <div className="relative h-56">
                            <Image src={article.image} alt={article.title} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover transition-transform group-hover:scale-105 duration-700" />
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-900">{article.category}</span>
                            </div>
                        </div>
                        <div className="p-8 space-y-6">
                            <h3 className="text-xl font-black text-slate-900 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors">{article.title}</h3>
                            <p className="text-slate-500 text-sm font-bold line-clamp-3 mb-8 leading-relaxed">{article.excerpt}</p>
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-black uppercase tracking-widest border-t border-slate-50 pt-6">
                                <div className="flex items-center gap-2">
                                     <Calendar className="size-3.5" />
                                     <span>{article.readTime}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Bookmark className="size-4 hover:text-blue-600 transition-colors" />
                                    <Share2 className="size-4 hover:text-blue-600 transition-colors" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-10">
            
            {/* Search Insight */}
            <div className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-2xl shadow-slate-200/50">
                <h4 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-tight">Search Reports</h4>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Topics, keywords..." 
                        className="w-full bg-slate-50 border-transparent rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-bold text-slate-600"
                    />
                </div>
            </div>

            {/* Popular Categories */}
            <div className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-2xl shadow-slate-200/50">
                <h4 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-tight">Popular Topics</h4>
                <div className="space-y-4">
                    {categories.map(cat => (
                        <button key={cat.name} className="w-full flex items-center justify-between group px-2">
                            <span className="text-slate-500 group-hover:text-blue-600 transition-colors font-bold text-sm tracking-tight">{cat.name}</span>
                            <span className="size-6 rounded-lg bg-slate-50 text-[10px] font-black flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                {cat.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Premium CTA Sidebar */}
            <div className="bg-slate-950 p-10 rounded-[40px] text-white overflow-hidden relative group">
                <div className="relative z-10 space-y-8">
                    <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center">
                        <TrendingUp className="size-7 text-blue-500" />
                    </div>
                    <h4 className="text-3xl font-black leading-tight">Get Exclusive <span className="text-blue-500">Off-Market</span> Intelligence.</h4>
                    <p className="text-slate-500 text-sm font-bold leading-relaxed">
                        Our premium subscribers get notified 48 hours before specific Lisbon & Porto listings go public.
                    </p>
                    <Link href="/pricing" className="btn-primary !bg-white !text-slate-900 w-full flex items-center justify-center gap-2 !py-4 text-xs font-black uppercase tracking-widest">
                        Join Premium List <ArrowRight className="size-4" />
                    </Link>
                </div>
                {/* Background Detail */}
                <div className="absolute -right-10 -bottom-10 size-48 bg-blue-600/10 rounded-full blur-[80px]" />
            </div>

            {/* Market Snapshot Sidebar */}
            <div className="bg-white border border-slate-100 p-8 rounded-[32px] shadow-2xl shadow-slate-200/50 space-y-8">
                <h4 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3 uppercase tracking-tight">
                    <Globe className="size-5 text-blue-600" />
                    Market Snapshot
                </h4>
                <div className="space-y-6">
                    {[
                        { label: 'Lisat Median Yield', val: '5.4%', color: 'text-emerald-500' },
                        { label: 'Interest Rate Avg', val: '3.8%', color: 'text-blue-600' },
                        { label: 'Demand Index', val: '9.2/10', color: 'text-slate-900' }
                    ].map(stat => (
                        <div key={stat.label} className="flex justify-between items-center pb-4 border-b border-slate-50">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                            <span className={`text-lg font-black ${stat.color}`}>{stat.val}</span>
                        </div>
                    ))}
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                    <ShieldCheck className="size-5 text-blue-600 shrink-0" />
                    <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed">Verified by InvesTerra proprietary market engine.</p>
                </div>
            </div>

        </aside>

      </div>
    </div>
  );
}
