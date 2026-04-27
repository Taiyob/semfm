'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import {
  Globe,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Search,
  Building2,
  Navigation,
  CheckCircle2,
  ChevronRight,
  Calculator,
  Coins,
  Home,
  MapPin
} from 'lucide-react';

const countries = [
  {
    name: 'Portugal',
    slug: 'portugal',
    description: 'Premium yields in Lisbon and Porto. Strategic golden visa opportunities.',
    yield: '+5.2%',
    grossYield: '6.4%',
    availableProperties: 184,
    region: 'Western Europe',
    investors: '12k+',
    image: '/assets/portugal_real_estate_hero_1775342926518.png',
    status: 'Active',
    color: 'border-zinc-200'
  },
  {
    name: 'Spain',
    slug: 'spain',
    description: 'Market analysis for Valencia, Alicante, Málaga, and Las Palmas. Beta access.',
    yield: '+5.9%',
    grossYield: '7.2%',
    availableProperties: 142,
    region: 'Western Europe',
    investors: '8.5k+',
    image: '/assets/spain_market_hero.png',
    status: 'Active',
    color: 'border-zinc-200'
  },
  {
    name: 'Greece',
    slug: 'greece',
    description: 'High-growth potential in Athens and the Islands. EU residency pathway.',
    yield: '+6.1%',
    grossYield: '7.2%',
    availableProperties: 96,
    region: 'Southern Europe',
    investors: '5k+',
    image: '/assets/greece_market_hero.png',
    status: 'Active',
    color: 'border-zinc-200'
  },
];


export default function GlobalHomePage() {
  const [selectedRegion, setSelectedRegion] = React.useState('All Markets');
  const [newsletterCountry, setNewsletterCountry] = React.useState('All Countries');

  const regions = [
    'All Markets',
    'Eastern Europe',
    'Western Europe',
    'Northern Europe',
    'Southern Europe'
  ];

  const filteredCountries = selectedRegion === 'All Markets'
    ? countries
    : countries.filter(c => c.region === selectedRegion);

  return (
    <div className="flex flex-col gap-0 min-h-screen hero-gradient font-montserrat">

      {/* Global Hero */}
      <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-[#2C3E50] leading-[0.95] mb-10 max-w-5xl mx-auto">
              The data-driven <br /><span className="gradient-text">Horizon for investors</span>
            </h1>
            <p className="text-xl md:text-2xl text-stone-500 max-w-3xl mx-auto leading-relaxed mb-12 font-bold italic">
              “Our mission is to make sure you invest with clarity, not guesswork”
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/calculator" className="btn-primary flex items-center gap-3">
                Found a property? Analyze returns <Calculator className="size-5" />
              </Link>
              <a href="#market-selection" className="btn-secondary flex items-center gap-3">
                Still searching? Find one <Building2 className="size-5 text-[#34495E]" />
              </a>
            </div>
          </motion.div>
        </div>
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden select-none">
          <div className="relative w-full h-full opacity-[0.4]">
            <Image
              src="/assets/europe-map-bg.png"
              alt="Europe Map Background"
              fill
              className="object-cover mix-blend-multiply"
              priority
            />
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#34495E]/5 blur-[120px] rounded-full -z-20" />
      </section>

      {/* Mission & Problem Section */}
      <section className="py-24 bg-[#F9F7F4] border-y border-stone-200/50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Headline & Features Row */}
          <div className="grid lg:grid-cols-2 gap-16 items-start mb-24">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#2C3E50] leading-tight">
                Connecting the dots in <br />
                <span className="text-[#34495E]">real estate investing</span>
              </h2>
              <p className="text-lg text-stone-500 font-bold leading-relaxed max-w-xl">
                Real estate data is fragmented across platforms, tax systems, and local markets. We unify it into one clear, reliable source of truth.
              </p>
            </div>

            <div className="grid gap-6">
              {[
                {
                  title: 'Analyze your property',
                  label: 'Run a full investment analysis in seconds',
                  desc: 'From gross yield and cash flow projections to long-term investment horizon — get the numbers you need to confidently validate any deal.',
                  href: '/calculator'
                },
                {
                  title: 'Discover properties',
                  label: 'Find properties that match your strategy',
                  desc: 'Explore properties with advanced filters for yield, price, and estimated rental income, and find undervalued opportunities early to stay ahead of the market.',
                  href: '/properties'
                },
                {
                  title: 'Stay ahead of the market',
                  label: 'Follow real-time insights and move with confidence',
                  desc: 'Track market shifts, rental trends, and regulatory changes. Receive early signals on neighborhoods heating up or cooling down, so you can adjust your strategy proactively.',
                  href: '#newsletter'
                }
              ].map(item => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="flex items-start gap-6 p-6 bg-white rounded-[32px] border-2 border-transparent hover:border-[#D4A373]/30 hover:shadow-2xl hover:shadow-[#D4A373]/10 transition-all group/item shadow-sm"
                >
                  <div className="relative size-8 shrink-0 mt-1">
                    <input
                      type="checkbox"
                      readOnly
                      checked
                      className="peer appearance-none size-8 rounded-lg border-2 border-stone-200 checked:bg-[#D4A373] checked:border-[#D4A373] transition-all cursor-pointer"
                    />
                    <CheckCircle2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-black text-[#2C3E50] group-hover/item:text-[#D4A373] transition-colors mb-1">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-bold text-[#D4A373] uppercase tracking-widest mb-3">
                      {item.label}
                    </span>
                    <p className="text-sm text-stone-500 font-bold leading-relaxed max-w-lg">
                      {item.desc}
                    </p>
                  </div>
                  <ArrowRight className="size-5 ml-auto mt-1 text-stone-300 group-hover/item:text-[#D4A373] group-hover/item:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>


      {/* Market Selection Grid */}
      <section id="market-selection" className="max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-black text-[#2C3E50] tracking-tight">Choose your <span className="text-[#34495E]">location</span></h2>
            <p className="text-stone-500 text-lg font-bold">Click on a country to access available properties, specialized investment tools, and local market insights.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-stone-100 rounded-2xl w-fit">
            {regions.map(region => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={cn(
                  "px-4 py-2 font-bold rounded-xl text-sm transition-all whitespace-nowrap",
                  selectedRegion === region
                    ? "bg-white text-[#2C3E50] shadow-sm"
                    : "text-stone-500 hover:text-[#2C3E50] hover:bg-white/50"
                )}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {filteredCountries.map((country, idx) => (
            <motion.div
              key={country.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-white rounded-[40px] overflow-hidden border border-stone-200 shadow-xl shadow-stone-200/50 hover:shadow-2xl hover:shadow-[#D4A373]/10 transition-all duration-500 hover:-translate-y-1 flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={country.image}
                  alt={country.name}
                  fill
                  priority={idx === 0}
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-8 flex items-center gap-3">
                  <div className="size-10 rounded-full border-2 border-white/30 backdrop-blur-md flex items-center justify-center p-2 overflow-hidden">
                    <Image
                      src={`https://flagcdn.com/w80/${country.slug === 'portugal' ? 'pt' : country.slug === 'spain' ? 'es' : 'gr'}.png`}
                      alt={country.name}
                      width={40}
                      height={30}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-2xl font-black text-white">{country.name}</span>
                </div>
                {country.status === 'Testing' && (
                  <div className="absolute top-6 right-8 px-4 py-1.5 bg-[#D4A373]/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                    Beta Access
                  </div>
                )}
              </div>

              <div className="p-10 flex flex-col flex-grow space-y-8">
                <p className="text-stone-500 font-bold leading-relaxed min-h-[80px] line-clamp-3">{country.description}</p>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 bg-stone-50 rounded-2xl flex flex-col items-center justify-center text-center h-full">
                    <div className="min-h-[24px] flex items-center justify-center mb-2">
                      <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest whitespace-nowrap">Gross Yield</span>
                    </div>
                    <span className="text-lg font-black text-[#2C3E50]">{country.grossYield}</span>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-2xl flex flex-col items-center justify-center text-center h-full">
                    <div className="min-h-[24px] flex items-center justify-center mb-2">
                      <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest whitespace-nowrap">Appreciation</span>
                    </div>
                    <span className="text-lg font-black text-[#2C3E50]">{country.yield}</span>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-2xl flex flex-col items-center justify-center text-center h-full">
                    <div className="min-h-[24px] flex items-center justify-center mb-2">
                      <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest whitespace-nowrap">Properties</span>
                    </div>
                    <span className="text-lg font-black text-[#2C3E50]">{country.availableProperties}</span>
                  </div>
                </div>

                {country.status === 'Active' ? (
                  <Link
                    href={`/countries/${country.slug}`}
                    className="w-full mt-auto py-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 group/btn transition-colors hover:bg-[#D4A373] shadow-lg hover:shadow-[#D4A373]/20"
                  >
                    Discover {country.name} <ChevronRight className="size-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <button className="w-full mt-auto py-4 bg-slate-100 text-slate-400 font-bold rounded-2xl cursor-not-allowed">
                    Launching Q3 2026
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Use Our Data? */}
      <section className="bg-slate-950 py-32 text-white relative flex-shrink-0">
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
                    <item.icon className="size-7 text-[#34495E]" />
                  </div>
                  <div>
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
              <div className="bg-stone-900 rounded-[58px] p-12 overflow-hidden relative space-y-12">
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

      {/* Newsletter Intake */}
      <section id="newsletter" className="max-w-7xl mx-auto px-6 py-32 w-full">
        <div className="rounded-[80px] bg-stone-100 p-12 md:p-24 border border-stone-200 relative overflow-hidden group">
          <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
            <div className="space-y-10">
              <h2 className="text-4xl md:text-6xl font-black text-[#2C3E50] leading-[0.9] tracking-tighter">Stay ahead of <br /><span className="gradient-text">the market</span></h2>
              <div className="space-y-8">
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
              <div className="space-y-8">
                {/* Market Selection */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2">Personalize Your Markets</label>
                  <div className="flex flex-wrap gap-2">
                    {['All Countries', 'Portugal', 'Spain', 'Greece'].map((loc) => (
                      <button
                        key={loc}
                        onClick={() => setNewsletterCountry(loc)}
                        className={cn(
                          "py-3 px-5 rounded-2xl border-2 text-[10px] font-black transition-all uppercase tracking-tight",
                          newsletterCountry === loc
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

              <button className="w-full py-6 bg-[#2C3E50] text-white font-black rounded-[24px] hover:bg-[#D4A373] transition-all tracking-[0.1em] text-xs uppercase shadow-xl shadow-[#2C3E50]/10 flex items-center justify-center gap-3">
                Activate your market insights for free
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
