'use client';

import Link from 'next/link';
import Image from 'next/image';
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
  ChevronRight
} from 'lucide-react';

const countries = [
  {
    slug: 'portugal',
    name: 'Portugal',
    description: 'Explore opportunities in Lisbon, Porto, and the Algarve. Golden Visa and NHR friendly.',
    yield: '5.2%',
    investors: '12k+',
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?q=80&w=2070&auto=format&fit=crop',
    status: 'Active',
    color: 'border-[#B55D3E]/20'
  },
  {
    slug: 'spain',
    name: 'Spain',
    description: 'Market analysis for Madrid, Barcelona, and the Costa del Sol. Institutional beta access.',
    yield: '4.8%',
    investors: '8.5k+',
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=2070&auto=format&fit=crop', 
    status: 'Active',
    color: 'border-zinc-200'
  },
  {
    slug: 'greece',
    name: 'Greece (Coming Soon)',
    description: 'High-yield opportunities in Athens and the Greek Islands. Low entry investment points.',
    yield: '6.1%',
    investors: 'Under Prep',
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2070&auto=format&fit=crop',
    status: 'Coming Soon',
    color: 'border-zinc-200'
  },
];


export default function GlobalHomePage() {
  return (
    <div className="flex flex-col gap-0 min-h-screen hero-gradient font-outfit">

      {/* Global Hero */}
      <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="section-tag mb-8">
              <Globe className="size-4" />
              Institutional Market Intelligence
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tight text-stone-900 leading-[0.95] mb-10 max-w-5xl mx-auto uppercase">
                The Data-Driven <br /><span className="gradient-text">Horizon for Investors.</span>
            </h1>
            <p className="text-xl md:text-2xl text-stone-500 max-w-3xl mx-auto leading-relaxed mb-12 font-bold italic">
                “Our mission is to provide transparent real estate data for investment decisions.”
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/calculator" className="btn-primary flex items-center gap-3">
                <TrendingUp className="size-5" /> Start Investment Analysis
              </Link>
              <a href="#market-selection" className="btn-secondary flex items-center gap-3">
                Explore Global Markets <Globe className="size-5 text-[#B55D3E]" />
              </a>
            </div>
          </motion.div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#B55D3E]/5 blur-[120px] rounded-full -z-10" />
      </section>

      {/* Mission & Problem Section */}
      <section className="py-24 bg-stone-50 border-y border-stone-100">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                  <div className="section-tag">Core Objective</div>
                  <h2 className="text-4xl md:text-6xl font-black text-stone-900 leading-tight uppercase">Solving Data <span className="text-[#B55D3E]">Fragmentation.</span></h2>
                  <p className="text-lg text-stone-500 font-bold leading-relaxed">
                      Real estate data is fragmented across multiple platforms, local tax codes, and opaque regional trends. We unify institutional-grade analytics into a single, high-fidelity source of truth.
                  </p>
                  <div className="flex items-center gap-4 py-4">
                      <div className="size-12 rounded-2xl bg-[#B55D3E] text-white flex items-center justify-center shadow-lg shadow-[#B55D3E]/20">
                          <CheckCircle2 className="size-6" />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest text-stone-400">Integrated European Data Engine</span>
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-6 relative">
                  <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-stone-200/50 border border-stone-100 space-y-4 transform hover:-translate-y-2 transition-transform">
                      <div className="text-4xl font-black text-[#B55D3E]">12+</div>
                      <div className="text-xs font-black uppercase tracking-widest text-stone-400">Verified Markets</div>
                  </div>
                  <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-stone-200/50 border border-stone-100 space-y-4 mt-12 transform hover:-translate-y-2 transition-transform">
                      <div className="text-4xl font-black text-[#D4A373]">85ms</div>
                      <div className="text-xs font-black uppercase tracking-widest text-stone-400">Data Response Time</div>
                  </div>
              </div>
          </div>
      </section>


      {/* Market Selection Grid */}
      <section id="market-selection" className="max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Choose Your Destination</h2>
            <p className="text-slate-500 text-lg">Click on a country to access specialized investment tools, local tax calculators, and curated property catalogs.</p>
          </div>
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
            <button className="px-4 py-2 bg-white text-slate-900 font-bold rounded-lg shadow-sm text-sm">All Markets</button>
            <button className="px-4 py-2 text-slate-500 font-bold text-sm hover:text-slate-900">Western Europe</button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {countries.map((country, idx) => (
            <motion.div
              key={country.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative h-full cursor-pointer"
            >
              <motion.div
                initial={{ y: 0, borderColor: 'rgba(241, 245, 249, 1)', scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className={`flex flex-col h-full glass-card rounded-[40px] overflow-hidden border-2 relative z-0 cursor-pointer ${country.status !== 'Active' && 'opacity-90 grayscale-[0.3]'
                  }`}
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={country.image}
                    alt={country.name}
                    fill
                    priority={idx === 0}
                    loading={idx === 0 ? "eager" : "lazy"}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 flex items-center gap-3">
                    <div className={`size-3 rounded-full ${country.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                    <span className="text-white text-sm font-bold uppercase tracking-widest">{country.status}</span>
                  </div>
                </div>

                <div className="p-8 flex-grow">
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">{country.name}</h3>
                  <p className="text-slate-500 leading-relaxed mb-8 text-sm line-clamp-2">{country.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Avg Yield</span>
                      <span className="text-xl font-bold text-slate-900">{country.yield}</span>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Investors</span>
                      <span className="text-xl font-bold text-slate-900">{country.investors}</span>
                    </div>
                  </div>

                  {country.status === 'Active' ? (
                    <Link
                      href={`/countries/${country.slug}`}
                      className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 group/btn transition-colors hover:bg-blue-600"
                    >
                      Open Market Portal <ChevronRight className="size-5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  ) : (
                    <button className="w-full py-4 bg-slate-100 text-slate-400 font-bold rounded-2xl cursor-not-allowed">
                      Launching Q3 2026
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Use Our Data? */}
      <section className="bg-slate-950 py-32 text-white relative flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="section-tag !bg-white/5 !text-white !border-white/10 uppercase font-black">
              Why Institutional Trust?
            </div>
            <h2 className="text-5xl md:text-7xl font-bold leading-tight">Data That Drives <span className="text-blue-500">Decisions.</span></h2>
            <div className="space-y-8">
              {[
                { title: 'Tax-Inclusive yields', desc: 'Every yield we show includes IMT, Stamp Duty, and regional taxes calculations.', icon: ShieldCheck },
                { title: 'Verified Ownership', desc: 'Every property listed undergoes a blockchain-backed title check.', icon: Search },
                { title: 'Predictive ROI', desc: 'Our AI models project 5-year appreciation based on historical and infrastructure data.', icon: TrendingUp }
              ].map(item => (
                <div key={item.title} className="flex gap-6 group">
                  <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
                    <item.icon className="size-7 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                    <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-[80px] blur-[120px] -z-10" />
            <div className="glass-card !bg-white/5 !border-white/10 p-1 rounded-[60px]">
              <div className="bg-slate-900 rounded-[58px] p-12 overflow-hidden relative">
                <div className="text-sm font-bold text-blue-500 mb-6 uppercase tracking-widest">Growth Forecast 2026</div>
                <div className="text-4xl font-bold mb-12">+12.4% <span className="text-slate-500 text-lg font-medium">Avg Equity Growth</span></div>
                <div className="space-y-4">
                  {[
                    { label: 'Braga, Portugal', bar: '88%', val: '9.2%' },
                    { label: 'Malaga, Spain', bar: '72%', val: '7.8%' },
                    { label: 'Athens, Greece', bar: '95%', val: '11.4%' }
                  ].map(row => (
                    <div key={row.label} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                        <span>{row.label}</span>
                        <span>{row.val}</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: row.bar }}
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
