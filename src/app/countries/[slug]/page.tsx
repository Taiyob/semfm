'use client';

import { use, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  Mail,
  MapPin,
  TrendingUp,
  Calculator
} from 'lucide-react';
import { MARKET_REGISTRY } from '@/lib/market-data';

export default function CountryMarketPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  
  // Lookup data for the specific country
  const data = useMemo(() => MARKET_REGISTRY[slug.toLowerCase()], [slug]);

  // If country doesn't exist in registry, show "Coming Soon" or fallback
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center font-outfit hero-gradient px-6">
        <div className="text-center max-w-2xl space-y-10">
           <div className="section-tag mx-auto">Market Under Prep</div>
           <h1 className="text-5xl md:text-8xl font-black text-stone-900 uppercase">Coming <br /><span className="gradient-text">Soon.</span></h1>
           <p className="text-xl text-stone-500 font-bold italic">“Our institutional data engine is currently verifying the title deeds and occupancy codes for this market.”</p>
           <Link href="/" className="btn-primary inline-flex">Return to Global Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-32 pb-32 font-outfit hero-gradient min-h-screen">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="section-tag mb-8">
              <Star className="size-4 fill-current" />
              Institutional Market Leader
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-stone-900 leading-[0.95] tracking-tight mb-10 uppercase">
                {data.name} Market <br /><span className="gradient-text">Analysis Dashboard.</span>
            </h1>
            <p className="text-xl md:text-2xl text-stone-500 leading-relaxed mb-12 max-w-3xl mx-auto font-bold italic">
              “{data.heroQuote}”
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/calculator" className="btn-primary">
                Run Investment Calculation
              </Link>
              <Link href="/properties" className="btn-secondary">
                View Local Listings
              </Link>
            </div>

            <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-12 border-t border-stone-200 pt-10">
              {data.stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-4xl font-black text-stone-900 mb-2">{stat.value}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-stone-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Regional Exploration - Dynamic Matrix */}
      <section className="max-w-7xl mx-auto px-6 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div className="max-w-2xl">
                  <div className="section-tag mb-4">Market Granularity</div>
                  <h2 className="text-4xl md:text-6xl font-black text-stone-900 uppercase leading-tight tracking-tighter">{data.name} → <span className="text-[#B55D3E]">Region Matrix.</span></h2>
                  <p className="text-stone-500 text-lg font-bold italic mt-4">Select a region to drill down into city-level investment indicators.</p>
              </div>
          </div>

          <div className="space-y-12">
              {data.regions.map((region, idx) => (
                  <motion.div 
                    key={region.name}
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="group bg-white rounded-[48px] border border-stone-100 p-8 md:p-12 shadow-2xl shadow-stone-200/50 flex flex-col lg:flex-row gap-12 items-center hover:border-[#B55D3E]/20 transition-all duration-500"
                  >
                      <div className="w-full lg:w-2/5 aspect-[4/3] relative rounded-[32px] overflow-hidden shadow-2xl">
                          <Image 
                              src={region.image} 
                              alt={region.name} 
                              fill 
                              priority={idx === 0} 
                              loading={idx === 0 ? "eager" : "lazy"}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                              className="object-cover group-hover:scale-105 transition-transform duration-700" 
                          />
                          <div className="absolute inset-0 bg-stone-950/20" />
                      </div>
                      
                      <div className="w-full lg:w-3/5 space-y-8">
                          <div className="flex flex-col md:flex-row justify-between md:items-start gap-6 pb-8 border-b border-stone-100">
                              <div>
                                  <h3 className="text-3xl md:text-4xl font-black text-stone-900 uppercase tracking-tight mb-4">{region.name}</h3>
                                  <p className="text-stone-500 font-bold leading-relaxed max-w-md">{region.description}</p>
                              </div>
                              <div className="flex gap-4">
                                  <div className="p-4 bg-stone-50 rounded-2xl text-center min-w-[100px]">
                                      <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Avg Yield</div>
                                      <div className="text-2xl font-black text-[#B55D3E]">{region.yield}</div>
                                  </div>
                                  <div className="p-4 bg-stone-50 rounded-2xl text-center min-w-[100px]">
                                      <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Vacancy</div>
                                      <div className="text-2xl font-black text-stone-900">{region.vacancy}</div>
                                  </div>
                              </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-8">
                              <div className="space-y-4">
                                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#D4A373]">City Level Focus</h4>
                                  <div className="flex flex-wrap gap-2">
                                      {region.cities.map(city => (
                                          <span key={city} className="px-3 py-1 bg-stone-100 text-stone-700 text-xs font-black rounded-lg uppercase tracking-tight border border-stone-200">{city}</span>
                                      ))}
                                  </div>
                              </div>
                              <div className="space-y-4">
                                  <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-400 italic">Key Performance Indicators</h4>
                                  <ul className="space-y-2">
                                      {region.indicators.map(ind => (
                                          <li key={ind} className="flex items-center gap-2 text-xs font-bold text-stone-500">
                                              <CheckCircle2 className="size-3 text-[#B55D3E]" /> {ind}
                                          </li>
                                      ))}
                                  </ul>
                              </div>
                          </div>

                          <div className="flex flex-wrap gap-4 pt-4">
                              <Link href="/calculator" className="px-6 py-3 bg-stone-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#B55D3E] transition-colors shadow-lg shadow-stone-900/10">
                                  Run Regional Calculation
                              </Link>
                              <Link href="/properties" className="px-6 py-3 border border-stone-200 text-stone-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-stone-50 transition-colors">
                                  View Segment Listings
                              </Link>
                          </div>
                      </div>
                  </motion.div>
              ))}
          </div>
      </section>

      {/* Institutional Gating Preview */}
      <section className="bg-stone-950 py-32 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10 relative z-10">
            <div className="section-tag !bg-white/5 !text-white !border-white/10">Verified Data Engine</div>
            <h2 className="text-5xl md:text-7xl font-black uppercase leading-tight">Institutional <br /><span className="text-[#B55D3E]">High-Fidelity.</span></h2>
            <p className="text-stone-500 text-xl font-bold leading-relaxed italic">
                “Every {data.name} listing undergoes a proprietary 48-point verification and blockchain-backed title check.”
            </p>
            <div className="flex flex-col gap-6">
                {[
                  { title: 'Tax Integrated', desc: `Pre-calculated regional ${data.name} taxes.` },
                  { title: 'Off-Market', desc: 'Direct access to institutional banking portfolios.' },
                  { title: 'Legal Vetting', desc: 'Integrated legal and title deed support.' }
                ].map(item => (
                    <div key={item.title} className="flex items-start gap-6 p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="size-12 rounded-2xl bg-[#B55D3E] flex items-center justify-center shrink-0">
                            <ShieldCheck className="size-6 text-white" />
                        </div>
                        <div>
                            <h4 className="text-lg font-black uppercase mb-1 tracking-tight">{item.title}</h4>
                            <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
          </div>
          <div className="relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-[#B55D3E]/20 rounded-full blur-[120px] -z-10" />
              <Image src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2070&auto=format&fit=crop" alt="Institutional Review" width={800} height={1000} className="rounded-[80px] border border-white/10 shadow-2xl grayscale hover:grayscale-0 transition-all duration-700" />
          </div>
        </div>
      </section>

      {/* Updated Universal Newsletter Intake */}
      <section id="newsletter" className="max-w-7xl mx-auto px-6 w-full">
        <div className="rounded-[64px] bg-stone-100 p-12 md:p-24 border border-stone-200">
           <div className="grid lg:grid-cols-2 gap-16 items-center">
               <div className="space-y-8">
                   <div className="section-tag">Market Pulse</div>
                   <h2 className="text-4xl md:text-6xl font-black text-stone-900 uppercase leading-[0.9]">{data.name} <br /><span className="gradient-text">Weekly Yields.</span></h2>
                   <p className="text-stone-500 text-xl font-bold italic">
                       “Updates on new developments in the international real estate market.”
                   </p>
               </div>
               <form className="space-y-4">
                  <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-stone-400" />
                      <input type="email" placeholder="Institutional Email" className="w-full bg-white border border-stone-200 rounded-[28px] py-6 pl-16 pr-8 text-stone-900 focus:ring-2 focus:ring-[#B55D3E] outline-none transition-all font-bold" />
                  </div>
                  <button className="w-full py-6 bg-stone-900 text-white font-black rounded-[28px] hover:bg-[#B55D3E] transition-all uppercase tracking-widest text-xs shadow-xl shadow-stone-900/10">
                      Join Global Intelligence Network
                  </button>
               </form>
           </div>
        </div>
      </section>
    </div>
  );
}
