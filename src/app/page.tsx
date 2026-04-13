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
    color: 'border-[#34495E]/20'
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
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-[#2C3E50] leading-[0.95] mb-10 max-w-5xl mx-auto">
                The data-driven <br /><span className="gradient-text">Horizon for investors</span>
            </h1>
            <p className="text-xl md:text-2xl text-stone-500 max-w-3xl mx-auto leading-relaxed mb-12 font-bold italic">
                “Our mission is to make sure you invest with clarity, not guesswork”
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/calculator" className="btn-primary flex items-center gap-3">
                <TrendingUp className="size-5" /> Got a property? Analyze it
              </Link>
              <a href="#market-selection" className="btn-secondary flex items-center gap-3">
                Need a property? Find one <Globe className="size-5 text-[#34495E]" />
              </a>
            </div>
          </motion.div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#34495E]/5 blur-[120px] rounded-full -z-10" />
      </section>

      {/* Mission & Problem Section */}
      <section className="py-24 bg-stone-50 border-y border-stone-100">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
              <div className="section-tag">Our mission</div>
              <h2 className="text-4xl md:text-6xl font-black text-[#2C3E50] leading-tight">Connecting the dots in <span className="text-[#34495E]">real estate investing</span></h2>
              <p className="text-lg text-stone-500 font-bold leading-relaxed">
                  Real estate data is fragmented across platforms, tax systems, and local markets. We unify it into one clear, reliable source of truth.
              </p>
              <div className="space-y-4 pt-4">
                  {[
                    { text: 'Analyze your property', href: '/calculator' },
                    { text: 'Discover properties', href: '/properties' },
                    { text: 'Stay a head of the market', href: '#newsletter' }
                  ].map(item => (
                    <Link key={item.text} href={item.href} className="flex items-center gap-3 group/item w-fit">
                        <div className="size-6 rounded-full bg-[#34495E]/10 flex items-center justify-center group-hover/item:bg-[#34495E]/20 transition-colors">
                            <CheckCircle2 className="size-4 text-[#34495E]" />
                        </div>
                        <span className="text-sm font-bold text-stone-600 group-hover/item:text-[#34495E] transition-colors">{item.text}</span>
                    </Link>
                  ))}
              </div>
              </div>
                  <div className="flex flex-col gap-6 w-full">
                      <div className="section-tag w-fit">The Workflow</div>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative">
                          {[
                              { step: '01', label: 'Find', icon: Search },
                              { step: '02', label: 'Analyze', icon: TrendingUp },
                              { step: '03', label: 'Buy', icon: ShieldCheck },
                              { step: '04', label: 'Rent', icon: Building2 },
                          ].map((item, i) => (
                              <div key={item.step} className="bg-white p-6 rounded-3xl border border-stone-100 shadow-xl shadow-stone-200/50 space-y-4 relative group hover:-translate-y-1 transition-all">
                                  <div className="text-2xl font-black text-[#34495E]">{item.step}</div>
                                  <div className="text-sm font-bold text-stone-600">{item.label}</div>
                                  {i < 3 && (
                                    <div className="absolute -right-8 top-1/2 -translate-y-1/2 hidden lg:block z-10 w-12 pointer-events-none">
                                       <svg viewBox="0 0 48 24" fill="none" className="w-full text-[#34495E]/40 h-auto">
                                          <path d="M2 14C8 14 12 4 24 12C36 20 40 10 46 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 4" />
                                          <path d="M42 8L46 12L42 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                       </svg>
                                    </div>
                                  )}
                              </div>
                          ))}
                      </div>
                  </div>
          </div>
      </section>


      {/* Market Selection Grid */}
      <section id="market-selection" className="max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black text-[#2C3E50] mb-6 leading-tight tracking-tighter">Choose your <span className="text-[#34495E]">location</span></h2>
            <p className="text-stone-500 text-lg font-bold">Click on a country to access specialized investment tools and local market insights.</p>
          </div>
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
            <button className="px-4 py-2 bg-white text-[#2C3E50] font-bold rounded-lg shadow-sm text-sm">All Markets</button>
            <button className="px-4 py-2 text-slate-500 font-bold text-sm hover:text-[#2C3E50]">Western Europe</button>
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
                    <span className="text-white text-sm font-bold tracking-tight">{country.status}</span>
                  </div>
                </div>

                <div className="p-8 flex-grow">
                  <h3 className="text-3xl font-bold text-[#2C3E50] mb-4">{country.name}</h3>
                  <p className="text-slate-500 leading-relaxed mb-8 text-sm line-clamp-2">{country.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-stone-50 rounded-2xl">
                      <span className="text-[10px] font-bold text-stone-400 tracking-tight block mb-1">Avg appreciation</span>
                      <span className="text-xl font-bold text-[#2C3E50]">{country.yield}</span>
                    </div>
                    <div className="p-4 bg-stone-50 rounded-2xl">
                      <span className="text-[10px] font-bold text-stone-400 tracking-tight block mb-1">Available properties</span>
                      <span className="text-xl font-bold text-[#2C3E50]">142</span>
                    </div>
                  </div>

                  {country.status === 'Active' ? (
                       <Link
                        href={`/countries/${country.slug}`}
                        className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 group/btn transition-colors hover:bg-[#34495E]"
                      >
                        Discover {country.name} <ChevronRight className="size-5 group-hover/btn:translate-x-1 transition-transform" />
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
            <div className="section-tag !bg-white/5 !text-white !border-white/10 font-bold">
              Verification protocol
            </div>
            <h2 className="text-5xl md:text-7xl font-black leading-tight">Data you <br /><span className="text-[#34495E]">can trust</span></h2>
            <div className="space-y-8">
              {[
                { title: 'Data-driven rent estimates', desc: 'Based on 10 + data points including regional seasonality', icon: ShieldCheck },
                { title: 'Validated by local real estate experts', desc: 'Every calculation is verified for absolute accuracy', icon: Search },
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
              <div className="bg-stone-900 rounded-[58px] p-12 overflow-hidden relative">
                <div className="text-sm font-bold text-[#34495E] mb-6 tracking-widest">Growth Forecast 2026</div>
                <div className="text-4xl font-bold mb-12">+12.4% <span className="text-stone-500 text-lg font-medium">Avg equity growth</span></div>
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
                          className="h-full bg-gradient-to-r from-[#34495E] to-stone-400"
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
      
      {/* Newsletter Intake */}
      <section id="newsletter" className="max-w-7xl mx-auto px-6 py-32 w-full">
        <div className="rounded-[80px] bg-stone-100 p-12 md:p-24 border border-stone-200 relative overflow-hidden">
                <div className="space-y-8">
                   <div className="section-tag font-bold">Market Intelligence</div>
                   <h2 className="text-4xl md:text-6xl font-black text-[#2C3E50] leading-[0.9]">Join the <br /><span className="gradient-text">mailing list</span></h2>
                   <div className="space-y-4">
                      {['Weekly alpha reports', 'Regional yield shifts', 'New market deep-dives'].map(item => (
                        <div key={item} className="flex items-center gap-3">
                            <CheckCircle2 className="size-4 text-[#34495E]" />
                            <span className="text-sm font-medium text-stone-500">{item}</span>
                        </div>
                      ))}
                   </div>
                </div>
               <div className="space-y-4">
                  <div className="flex flex-col gap-4">
                      <select className="bg-white border border-stone-200 rounded-[24px] py-4 px-6 text-sm font-bold text-[#2C3E50] outline-none focus:ring-2 focus:ring-[#34495E]">
                          <option>Preferred Region</option>
                          <option>Portugal - Lisbon</option>
                          <option>Portugal - Algarve</option>
                          <option>Spain - Malaga</option>
                          <option>Greece - Athens</option>
                      </select>
                      <div className="flex gap-4 px-2">
                         {['Yield Alerts', 'Market Reports'].map(pref => (
                           <label key={pref} className="flex items-center gap-2 cursor-pointer group">
                              <input type="checkbox" className="size-4 accent-[#34495E]" />
                              <span className="text-[10px] font-bold text-stone-500 group-hover:text-[#2C3E50] transition-colors uppercase tracking-tight">{pref}</span>
                           </label>
                         ))}
                      </div>
                      <input type="email" placeholder="Institutional Email" className="bg-white border border-stone-200 rounded-[24px] py-4 px-6 text-sm font-bold text-[#2C3E50] focus:ring-2 focus:ring-[#34495E] outline-none w-full" />
                  </div>
                  <button className="w-full py-6 bg-stone-900 text-white font-black rounded-[40px] hover:bg-[#34495E] transition-all tracking-tight text-sm shadow-xl shadow-stone-900/10">
                      Join the mailing list
                  </button>
               </div>
           </div>
           <div className="absolute top-0 right-0 size-96 bg-[#34495E]/5 rounded-full blur-[100px]" />
      </section>

    </div>

  );
}
