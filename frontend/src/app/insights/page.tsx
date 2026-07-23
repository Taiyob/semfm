'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2,
  Calendar,
  Sparkles,
  Mail
} from 'lucide-react';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import { useSubscribeNewsletterMutation } from '@/lib/store/features/newsletter/newsletterApi';
import { useGetBlogsQuery } from '@/lib/store/features/blog/blogApi';

const DUMMY_ARTICLES = [
  {
    id: 1,
    slug: 'lisbon-real-estate-forecast-2026',
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
    slug: 'new-tax-laws-imt',
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
    slug: 'post-nhr-era',
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
    slug: 'spain-rental-law-updates-2026',
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
const sortOptions = ['Newest to Oldest', 'Oldest to Newest'];

export default function InsightsPage() {
  const [selectedCountry, setSelectedCountry] = useState('All Countries');
  const [selectedCategory, setSelectedCategory] = useState('All Insights');
  const [sortOrder, setSortOrder] = useState('Newest to Oldest');
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [articles, setArticles] = useState<any[]>(DUMMY_ARTICLES);
  const [isLoading, setIsLoading] = useState(true);

  const { data: blogsResponse, isLoading: isBlogsLoading, isSuccess } = useGetBlogsQuery({});
  const [subscribeNewsletter] = useSubscribeNewsletterMutation();

  const [subEmail, setSubEmail] = useState('');
  const [subMarkets, setSubMarkets] = useState<string[]>([]);
  const [subTopics, setSubTopics] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleMarket = (market: string) => {
      setSubMarkets(prev => prev.includes(market) ? prev.filter(m => m !== market) : [...prev, market]);
  };

  const toggleTopic = (topic: string) => {
      setSubTopics(prev => prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]);
  };

  const handleSubscribe = async () => {
      if (!subEmail) return Swal.fire({ title: 'Error', text: 'Please enter your email', icon: 'error', confirmButtonColor: '#2C3E50' });
      setIsSubmitting(true);
      try {
          const res = await subscribeNewsletter({ email: subEmail, markets: subMarkets, topics: subTopics }).unwrap();
          if (res.success) {
              Swal.fire({ title: 'Success!', text: 'Thanks for subscribing to Horizon Intelligence!', icon: 'success', confirmButtonColor: '#2C3E50' });
              setShowSubscribe(false);
              setSubEmail('');
              setSubMarkets([]);
              setSubTopics([]);
          } else {
              Swal.fire({ title: 'Error', text: res.message || 'Failed to subscribe', icon: 'error', confirmButtonColor: '#2C3E50' });
          }
      } catch (error: any) {
          Swal.fire({ title: 'Error', text: error?.data?.message || 'An error occurred. Please try again later.', icon: 'error', confirmButtonColor: '#2C3E50' });
      } finally {
          setIsSubmitting(false);
      }
  };

  useEffect(() => {
    if (isBlogsLoading) {
      setIsLoading(true);
      return;
    }
    
    if (isSuccess && blogsResponse?.data && blogsResponse.data.length > 0) {
      const formattedBlogs = blogsResponse.data.map((blog: any) => ({
        id: blog.id,
        slug: blog.slug,
        title: blog.title,
        excerpt: blog.excerpt || blog.content.substring(0, 100) + '...',
        author: blog.author,
        date: format(new Date(blog.createdAt), 'MMMM d, yyyy'),
        readTime: blog.readTime || '5 min read',
        category: blog.category,
        country: blog.country || 'Global',
        image: blog.imageUrl || '/assets/portugal_market_insights_thumbnail_1775343038691.png',
        featured: blog.isFeatured || false,
      }));
      setArticles(formattedBlogs);
    } else {
      setArticles(DUMMY_ARTICLES);
    }
    setIsLoading(false);
  }, [blogsResponse, isBlogsLoading, isSuccess]);

  const filteredArticles = useMemo(() => {
    let result = articles.filter(a => {
        const matchesCountry = selectedCountry === 'All Countries' || a.country === selectedCountry;
        const matchesCategory = selectedCategory === 'All Insights' || a.category === selectedCategory;
        return matchesCountry && matchesCategory;
    });

    result.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (sortOrder === 'Newest to Oldest') {
            return dateB - dateA;
        } else {
            return dateA - dateB;
        }
    });

    return result;
  }, [selectedCountry, selectedCategory, sortOrder, articles]);

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
        <div className="lg:col-span-12 space-y-12">
            
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
                <div className="flex-1 min-w-[200px]">
                    <select 
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="w-full bg-stone-50 rounded-2xl px-6 py-4 text-[10px] font-black tracking-widest text-[#2C3E50] outline-none cursor-pointer"
                    >
                        {sortOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="py-20 text-center font-black text-[#D4A373] uppercase tracking-widest animate-pulse">Loading Intelligence Signals...</div>
            ) : (
                <div className="grid md:grid-cols-1 gap-12">
                    {filteredArticles.length > 0 ? filteredArticles.map((article, idx) => (
                        <Link 
                            href={`/insights/${article.slug}`} 
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
            )}
        </div>

        {/* Sidebar removed as per client request */}
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
                                        <button 
                                            key={c} 
                                            onClick={() => toggleMarket(c)}
                                            className={`py-4 border-2 rounded-2xl text-[10px] font-black uppercase transition-all ${subMarkets.includes(c) ? 'border-[#2C3E50] text-white bg-[#2C3E50]' : 'border-stone-100 text-stone-400 hover:border-[#2C3E50] hover:text-[#2C3E50]'}`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#D4A373]">Signal Category</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {categories.slice(1).map(c => (
                                        <button 
                                            key={c} 
                                            onClick={() => toggleTopic(c)}
                                            className={`py-4 border-2 rounded-2xl text-[10px] font-black uppercase transition-all ${subTopics.includes(c) ? 'border-[#2C3E50] text-white bg-[#2C3E50]' : 'border-stone-100 text-stone-400 hover:border-[#2C3E50] hover:text-[#2C3E50]'}`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4 pt-4">
                                <input 
                                    type="email" 
                                    value={subEmail}
                                    onChange={(e) => setSubEmail(e.target.value)}
                                    placeholder="Enter your email address" 
                                    className="w-full bg-stone-50 rounded-2xl p-5 text-sm font-bold outline-none border-2 border-transparent focus:border-[#D4A373] transition-all" 
                                />
                                <button 
                                    onClick={handleSubscribe}
                                    disabled={isSubmitting}
                                    className="w-full py-6 bg-[#2C3E50] text-white rounded-[24px] font-black uppercase text-[11px] tracking-[0.2em] hover:bg-[#D4A373] transition-all shadow-xl shadow-[#2C3E50]/20 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Activating...' : 'Activate My Intelligence'}
                                </button>
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
