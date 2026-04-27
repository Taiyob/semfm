'use client';

import { use, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import {
  Star,
  CheckCircle2,
  ShieldCheck,
  Mail,
  MapPin,
  TrendingUp,
  Calculator,
  ArrowRight,
  Search,
  Coins,
  Building2
} from 'lucide-react';
import { DynamicCountryMap } from '@/components/country-map';
import { MARKET_REGISTRY } from '@/lib/market-data';

export default function CountryMarketPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  // Lookup data for the specific country
  const data = useMemo(() => MARKET_REGISTRY[slug.toLowerCase()], [slug]);

  // If country doesn't exist in registry, show "Coming Soon" or fallback
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center font-montserrat hero-gradient px-6">
        <div className="text-center max-w-2xl space-y-10">
          <div className="section-tag mx-auto">Market Under Prep</div>
          <h1 className="text-5xl md:text-7xl font-black text-[#2C3E50]">Coming <br /><span className="gradient-text">Soon</span></h1>
          <p className="text-xl text-stone-500 font-bold italic">“Our data engine is currently verifying the title deeds and occupancy codes for this market”</p>
          <Link href="/" className="btn-primary inline-flex">Return to Global Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-32 pb-32 font-montserrat hero-gradient min-h-screen">

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-[#2C3E50] leading-[0.95] tracking-tight mb-10">
              Discover <br /><span className="gradient-text">{data.name}</span>
            </h1>
            <p className="text-xl md:text-2xl text-stone-500 leading-relaxed mb-12 max-w-3xl mx-auto font-bold italic">
              “Explore regional non-biased market insights, transparent return calculations, and verified property data”
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/calculator" className="btn-primary flex items-center gap-3">
                Run Investment Calculation <Calculator className="size-5" />
              </Link>
              <Link href="/properties" className="btn-secondary flex items-center gap-3">
                View Local Listings <Building2 className="size-5 text-[#34495E]" />
              </Link>
            </div>

            <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-12 border-t border-stone-200 pt-10">
              {data.stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-4xl font-black text-[#2C3E50] mb-2">{stat.value}</div>
                  <div className="text-xs font-bold text-stone-400 tracking-tight uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden select-none">
           <DynamicCountryMap countrySlug={slug} />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#34495E]/5 blur-[120px] rounded-full -z-20" />
      </section>

      {/* Regional Exploration - Dynamic Matrix */}
      <section className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-7xl font-black text-[#2C3E50] leading-[0.95] tracking-tight mb-4">Area-specific insights</h2>
            <p className="text-stone-500 text-lg font-bold italic">Discover our selected areas below to find the best property investments and to calculate transparent returns</p>
          </div>
        </div>

        <div className="space-y-12">
          {data.regions.map((region, idx) => (
            <motion.div
              key={region.name}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group bg-white rounded-[48px] border border-stone-100 p-8 md:p-12 shadow-2xl shadow-stone-200/50 flex flex-col lg:flex-row gap-12 items-center hover:border-[#D4A373]/20 transition-all duration-500"
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
                <div className="space-y-6 pb-8 border-b border-stone-100 text-left">
                  <h3 className="text-3xl md:text-5xl font-black text-[#2C3E50] tracking-tight leading-[0.95]">{region.name}</h3>
                  <p className="text-stone-500 font-bold leading-relaxed max-w-2xl text-lg italic">“{region.description}”</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                  {[
                    { label: 'Avg yield', value: region.yield },
                    { label: 'Avg appreciation', value: region.appreciation },
                    { label: 'Available properties', value: region.availableProperties },
                    { label: 'Avg Vacancy Rate', value: region.vacancy }
                  ].map((stat) => {
                    const parts = stat.value.split(' ');
                    const mainVal = parts[0];
                    const subVal = parts.slice(1).join(' ');

                    return (
                      <div key={stat.label} className="p-6 bg-stone-50 rounded-[32px] flex flex-col items-center text-center group/stat hover:bg-[#F8F9FA] transition-colors border border-transparent hover:border-stone-200">
                        <div className="text-[10px] font-black text-stone-400 uppercase tracking-[0.15em] mb-4 h-8 flex items-center justify-center">
                          {stat.label}
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="text-3xl font-black text-[#2C3E50] tracking-tight">
                            {mainVal}
                          </div>
                          {subVal && (
                            <div className="text-[10px] font-black text-[#34495E] uppercase tracking-widest mt-1">
                              {subVal}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col md:flex-row items-center gap-12 pt-8">
                  {/* Action Buttons */}
                  <div className="flex flex-col gap-4 w-full md:w-auto">
                    <Link href="/properties" className="px-8 py-4 border-2 border-stone-100 text-[#34495E] text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-stone-50 transition-all flex items-center justify-center gap-3 shadow-sm whitespace-nowrap">
                      View local listings <Building2 className="size-4" />
                    </Link>
                    <Link href="/calculator" className="px-8 py-4 bg-[#34495E] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-[#2C3E50] transition-all shadow-xl shadow-[#34495E]/20 flex items-center justify-center gap-3 whitespace-nowrap">
                      Check my potential investment <ArrowRight className="size-4" />
                    </Link>
                  </div>

                  {/* Key Performance Indicators */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black tracking-tight text-stone-400 italic text-left uppercase">Key performance indicators</h4>
                    <ul className="space-y-2">
                      {region.indicators.map(ind => (
                        <li key={ind} className="flex items-center gap-2 text-xs font-bold text-stone-500">
                          <CheckCircle2 className="size-3 text-[#D4A373]" /> {ind}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Data Section - Standardized */}
      <section className="bg-slate-950 py-32 text-white relative">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <h2 className="text-5xl md:text-7xl font-black leading-tight">Data you <br /><span className="text-[#34495E]">can trust</span></h2>
            <div className="space-y-8">
              {[
                { title: 'Data-driven rent estimates', desc: 'Based on 10+ key data points, including location, property condition, and market dynamics, to deliver highly accurate rental estimates.', icon: ShieldCheck },
                { title: 'Validated by local real estate experts', desc: 'Calculation methods are regularly reviewed and verified to ensure accuracy and strong alignment with local market conditions.', icon: Search },
                { title: 'Smarter than generic tools', desc: 'Includes taxes, fees, and regional costs', icon: TrendingUp }
              ].map(item => (
                <div key={item.title} className="flex gap-6 group">
                  <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#34495E]/20 transition-colors">
                    <item.icon className="size-7 text-[#D4A373]" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xl font-black mb-2 tracking-tight">{item.title}</h4>
                    <p className="text-stone-500 font-bold leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-[80px] blur-[120px] -z-10" />
            <div className="glass-card !bg-white/5 !border-white/10 p-1 rounded-[60px]">
              <div className="bg-stone-900 rounded-[58px] p-12 overflow-hidden relative space-y-12 text-left">
                <div className="space-y-2">
                  <div className="text-[10px] font-black text-[#D4A373] uppercase tracking-[0.2em]">Market Accuracy</div>
                  <div className="text-4xl font-black text-white">95% <span className="text-lg text-slate-500 font-bold ml-2">Cross-validation accuracy</span></div>
                  <p className="text-sm text-slate-400 font-medium">Benchmarked against verified rental listings.</p>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-black text-[#D4A373] uppercase tracking-[0.2em]">Live Calibration</div>
                  <div className="text-4xl font-black text-white">Weekly <span className="text-lg text-slate-500 font-bold ml-2">Real-time recalibration</span></div>
                  <p className="text-sm text-slate-400 font-medium">Continuously aligned with new market trends.</p>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-black text-[#D4A373] uppercase tracking-[0.2em]">Data Breadth</div>
                  <div className="text-4xl font-black text-white">30+ <span className="text-lg text-slate-500 font-bold ml-2">Verified datasets</span></div>
                  <p className="text-sm text-slate-400 font-medium">Grounded in validated rental, transaction, and market data.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Redesigned Newsletter Intake */}
      <section id="newsletter" className="max-w-7xl mx-auto px-6 w-full">
        <div className="rounded-[80px] bg-stone-100 p-12 md:p-24 border border-stone-200 relative overflow-hidden group">
          <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
            <div className="space-y-10">
              <h2 className="text-4xl md:text-6xl font-black text-[#2C3E50] leading-[0.9] tracking-tighter text-left">Stay ahead of <br /><span className="gradient-text">the market</span></h2>
              <div className="space-y-8 text-left">
                {[
                  { title: 'Tax & Regulatory Updates', desc: 'Stay compliant with evolving regional tax laws and property regulations.', icon: ShieldCheck },
                  { title: 'Market Trends & Economic Signals', desc: 'Get early signals on heating neighborhoods and macroeconomic shifts.', icon: TrendingUp },
                  { title: 'Investment & Portfolio Strategies', desc: 'Professional grade strategies to optimize your real estate yields.', icon: Coins },
                  { title: 'Local Market Spotlights', desc: 'Deep dives into specific cities and emerging high-growth districts.', icon: MapPin }
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="size-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                      <item.icon className="size-5 text-[#D4A373]" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-lg font-black text-[#2C3E50] block leading-tight">{item.title}</span>
                      <p className="text-sm font-bold text-stone-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-10 md:p-14 rounded-[56px] shadow-2xl shadow-stone-200/50 space-y-10 border border-white">
              <div className="space-y-8 text-left">
                {/* Market Selection */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2">Personalize Your Markets</label>
                  <div className="flex flex-wrap gap-2">
                    {['All Countries', 'Portugal', 'Spain', 'Greece'].map((loc, i) => (
                      <button
                        key={loc}
                        className={cn(
                          "py-3 px-5 rounded-2xl border-2 text-[10px] font-black transition-all uppercase tracking-tight",
                          loc.toLowerCase() === slug.toLowerCase() || (i === 0 && !['portugal', 'spain', 'greece'].includes(slug.toLowerCase()))
                            ? "bg-[#D4A373] border-[#D4A373] text-white"
                            : "border-stone-50 text-[#2C3E50] hover:border-[#D4A373]/20 hover:bg-stone-50"
                        )}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Topic Filters */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2">Select Your Topics</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-2">
                    {['Tax & Regulatory', 'Market Trends', 'Portfolio Strategy', 'Local Spotlights'].map(pref => (
                      <label key={pref} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative size-5">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="peer appearance-none size-5 rounded-md border-2 border-stone-200 checked:bg-[#D4A373] checked:border-[#D4A373] transition-all cursor-pointer"
                          />
                          <CheckCircle2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                        <span className="text-[10px] font-black text-stone-500 group-hover:text-[#2C3E50] transition-colors uppercase tracking-widest">{pref}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="relative pt-4">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full bg-stone-50 border-2 border-transparent rounded-[24px] py-5 px-8 text-sm font-black text-[#2C3E50] focus:ring-2 focus:ring-[#D4A373]/20 focus:bg-white focus:border-[#D4A373]/20 outline-none transition-all"
                  />
                </div>
              </div>

              <button className="w-full py-6 bg-[#2C3E50] text-white font-black rounded-[24px] hover:bg-[#D4A373] transition-all tracking-[0.1em] text-xs uppercase shadow-xl shadow-[#2C3E50]/10 flex items-center justify-center gap-3 group">
                Activate your market insights for free <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <div className="absolute -top-24 -right-24 size-[500px] bg-[#D4A373]/5 rounded-full blur-[120px] -z-0" />
          <div className="absolute -bottom-24 -left-24 size-[500px] bg-[#D4A373]/5 rounded-full blur-[120px] -z-0" />
        </div>
      </section>
    </div>
  );
}
