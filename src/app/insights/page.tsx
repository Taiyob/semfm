'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
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
  CheckCircle2,
  Lock,
  Search,
  Filter,
  Sparkles,
  Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';

const articles = [
  {
    id: 1,
    title: 'Lisbon Real Estate Forecast 2026: Trends & Pricing',
    excerpt: 'Deep dive into why prices in Arroios and Beato continue to outpace the national average despite interest rate fluctuations.',
    author: 'Elena Rossi',
    date: 'April 4, 2026',
    readTime: '8 min read',
    category: 'Market Trends',
    country: 'Portugal',
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
    category: 'Tax & Regulation',
    country: 'Portugal',
    image: '/assets/portugal_market_insights_thumbnail_1775343038691.png',
  },
  {
    id: 3,
    title: 'Post-NHR Era: Why Portugal Still Wins',
    excerpt: 'Exploring the new tax regimes and why the destination remains the #1 choice for European remote workers.',
    author: 'Hofman Horizon Team',
    date: 'March 15, 2026',
    readTime: '6 min read',
    category: 'Regional Guide',
    country: 'Portugal',
    image: '/assets/portugal_market_insights_thumbnail_1775343038691.png',
  },
  {
    id: 4,
    title: 'Spain Rental Law Updates 2026',
    excerpt: 'How the new nationwide rent controls are affecting prime markets in Madrid and Barcelona.',
    author: 'Carlos Ruiz',
    date: 'April 10, 2026',
    readTime: '10 min read',
    category: 'Tax & Regulation',
    country: 'Spain',
    image: '/assets/spain-map-bg.png',
  }
];

const countries = ['All Countries', 'Portugal', 'Spain', 'Greece'];
const categories = ['All Insights', 'Tax & Regulation', 'Market Trends', 'Investment Strategy', 'Regional Guide'];

export default function InsightsPage() {
  const [selectedCountry, setSelectedCountry] = useState('All Countries');
  const [selectedCategory, setSelectedCategory] = useState('All Insights');
  const [showSubscribe, setShowSubscribe] = useState(false);

  const filteredArticles = useMemo(() => {
    return articles.filter(a => {
        const matchesCountry = selectedCountry === 'All Countries' || a.country === selectedCountry;
        const matchesCategory = selectedCategory === 'All Insights' || a.category === selectedCategory;
        return matchesCountry && matchesCategory;
    });
  }, [selectedCountry, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 font-montserrat hero-gradient min-h-screen">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-10">
        <div className="max-w-3xl space-y-6">
            <div className="section-tag">
                <BookOpen className="size-4" />
                Horizon Intelligence
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-[#2C3E50] tracking-tighter leading-[0.85]">Market <span className="text-[#D4A373]">Signals</span></h1>
            <p className="text-xl text-slate-500 font-bold leading-relaxed max-w-xl italic">
                Data-backed analysis and legal updates for the sophisticated European investor.
            </p>
        </div>
        
        <button 
            onClick={() => setShowSubscribe(true)}
            className="px-10 py-6 bg-[#2C3E50] text-white rounded-[24px] font-black text-[11px] tracking-[0.2em] shadow-2xl shadow-[#2C3E50]/20 hover:bg-[#D4A373] transition-all flex items-center gap-3 group"
        >
            <Mail className="size-4 group-hover:scale-110 transition-transform" />
            Become a Subscriber
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-16">
        
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-12">
            
            {/* Filter Bar */}
            <div className="flex flex-wrap gap-4 p-4 bg-white rounded-[32px] border border-stone-100 shadow-xl shadow-stone-200/40">
                <div className="flex-1 min-w-[200px]">
                    <select 
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="w-full bg-stone-50 rounded-2xl px-6 py-4 text-[10px] font-black tracking-widest text-[#2C3E50] outline-none cursor-pointer"
                    >
                        {countries.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                    <select 
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full bg-stone-50 rounded-2xl px-6 py-4 text-[10px] font-black tracking-widest text-[#2C3E50] outline-none cursor-pointer"
                    >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid md:grid-cols-1 gap-12">
                {filteredArticles.length > 0 ? filteredArticles.map((article, idx) => (
                    <Link 
                        href={`/insights/${article.id}`} 
                        key={article.id}
                        className="block group relative transition-all duration-700"
                    >
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-[48px] overflow-hidden border border-stone-100 hover:border-[#D4A373]/30 transition-all shadow-xl shadow-stone-200/30 flex flex-col md:flex-row h-full md:h-80"
                        >
                            <div className="relative w-full md:w-80 h-64 md:h-auto shrink-0 overflow-hidden">
                                <Image 
                                    src={article.image} 
                                    alt={article.title}
                                    fill
                                    sizes="400px"
                                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                />
                                {idx === 0 && (
                                    <div className="absolute inset-0 bg-[#2C3E50]/40 flex items-center justify-center">
                                        <Sparkles className="size-12 text-[#D4A373] animate-pulse" />
                                    </div>
                                )}
                            </div>
                            <div className="p-10 flex flex-col justify-between flex-grow">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-[9px] font-black text-[#D4A373] uppercase tracking-[0.2em]">
                                        <span className="px-2 py-1 bg-[#D4A373]/10 rounded-lg">{article.country}</span>
                                        <span className="text-stone-300">•</span>
                                        <span>{article.category}</span>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-black text-[#2C3E50] leading-tight tracking-tighter group-hover:text-[#D4A373] transition-colors">{article.title}</h2>
                                    <p className="text-stone-500 font-bold leading-relaxed line-clamp-2 italic">{article.excerpt}</p>
                                </div>
                                <div className="flex items-center justify-between pt-6 border-t border-stone-50">
                                    <div className="flex items-center gap-3 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                                        <Calendar className="size-4" />
                                        <span>{article.date}</span>
                                    </div>
                                    <div className="text-[10px] font-black text-[#2C3E50] uppercase tracking-[0.2em] flex items-center gap-2 group-hover:gap-3 transition-all">
                                        Read Analysis <ArrowRight className="size-4 text-[#D4A373]" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                )) : (
                    <div className="py-20 text-center font-black text-stone-300 uppercase tracking-widest">No Intelligence signals found for this segment</div>
                )}
            </div>

        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-10">
            {/* Structured Insights Info */}
            <div className="bg-[#2C3E50] p-10 rounded-[40px] text-white space-y-8">
                <div className="size-14 bg-white/5 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="size-7 text-[#D4A373]" />
                </div>
                <h4 className="text-3xl font-black leading-tight tracking-tighter">Institutional <br /><span className="text-[#D4A373]">Archives</span></h4>
                <p className="text-stone-400 text-xs font-bold leading-relaxed italic">
                    Filtering and softening systems are designed to foster exploration of the full data archive and verified market benchmarks.
                </p>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest">
                        <CheckCircle2 className="size-4 text-[#D4A373]" /> 
                        <span>Legal Compliance</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest">
                        <CheckCircle2 className="size-4 text-[#D4A373]" /> 
                        <span>Market Alpha</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest">
                        <CheckCircle2 className="size-4 text-[#D4A373]" /> 
                        <span>Regional Signal</span>
                    </div>
                </div>
            </div>

            {/* Newsletter CTA */}
            <div className="bg-white border border-stone-100 p-10 rounded-[48px] shadow-2xl shadow-stone-200/50 space-y-8">
                <div className="space-y-2">
                    <h3 className="text-xl font-black text-[#2C3E50]">Signal Alerts</h3>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Get notified 48h before public release.</p>
                </div>
                <div className="space-y-4">
                    <input type="email" placeholder="Institutional Email..." className="w-full bg-stone-50 border-stone-100 rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-[#D4A373] transition-all" />
                    <button className="w-full py-5 bg-[#2C3E50] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#D4A373] transition-all">Enable My Signal</button>
                </div>
            </div>
        </aside>
      </div>

      {/* Subscription Preference Popup */}
      <AnimatePresence>
        {showSubscribe && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSubscribe(false)} className="absolute inset-0 bg-[#2C3E50]/80 backdrop-blur-md" />
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white w-full max-w-xl rounded-[48px] p-12 lg:p-16 shadow-2xl overflow-hidden">
                    <div className="relative z-10 space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black text-[#2C3E50] tracking-tighter uppercase">Become a <br /><span className="text-[#D4A373]">Subscriber</span></h2>
                            <p className="text-stone-500 font-bold italic leading-relaxed">Choose your intelligence segments to receive tailored market signals (Free forever).</p>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#D4A373]">Monitor Country</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {countries.slice(1).map(c => (
                                        <button key={c} className="py-4 border-2 border-stone-100 rounded-2xl text-[10px] font-black uppercase text-stone-400 hover:border-[#2C3E50] hover:text-[#2C3E50] transition-all">{c}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#D4A373]">Signal Category</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {categories.slice(1).map(c => (
                                        <button key={c} className="py-4 border-2 border-stone-100 rounded-2xl text-[10px] font-black uppercase text-stone-400 hover:border-[#2C3E50] hover:text-[#2C3E50] transition-all">{c}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4 pt-4">
                                <input type="email" placeholder="Enter your email address" className="w-full bg-stone-50 rounded-2xl p-5 text-sm font-bold outline-none border-2 border-transparent focus:border-[#D4A373] transition-all" />
                                <button className="w-full py-6 bg-[#2C3E50] text-white rounded-[24px] font-black uppercase text-[11px] tracking-[0.2em] hover:bg-[#D4A373] transition-all shadow-xl shadow-[#2C3E50]/20">Activate My Intelligence</button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

    </div>
  );
}
