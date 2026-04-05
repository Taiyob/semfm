'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Calculator, 
  Globe, 
  Layout, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  Mail,
  ChevronRight,
  ShieldCheck,
  Building2,
  MapPin
} from 'lucide-react';

const stats = [
  { label: 'Avg. Yield', value: '5.2%', icon: TrendingUp },
  { label: 'Market Growth', value: '+8.4%', icon: Globe },
  { label: 'Active Listings', value: '12.5k+', icon: Layout },
];

const features = [
  {
    title: 'Precision Calculator',
    description: 'Estimate rental income, property taxes, and net ROI with our 2026-updated Portuguese tax engine.',
    icon: Calculator,
    link: '/calculator',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'Regional Insights',
    description: 'Detailed investment guides for Lisbon, Porto, the Algarve, and emerging silver coast markets.',
    icon: Globe,
    link: '/insights',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    title: 'Verified Listings',
    description: 'Direct access to institutional and private listings with pre-calculated yield metrics.',
    icon: Search,
    link: '/properties',
    color: 'bg-amber-50 text-amber-600',
  },
];

export default function PortugalPage() {
  return (
    <div className="flex flex-col gap-24 pb-24 font-outfit">
      
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center pt-20 overflow-hidden bg-slate-50">
        <div className="absolute inset-0 z-0 opacity-10">
          <Image
            src="/assets/portugal_real_estate_hero_1775342926518.png"
            alt="Modern Portuguese Villa"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <div className="section-tag mb-8">
              <Star className="size-3 fill-current" />
              #1 Portugal Investment Portal
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-slate-900 leading-[1.05] tracking-tight mb-10">
              Capture the High Yields in <span className="gradient-text">Portugal Market.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 leading-relaxed mb-12 max-w-2xl font-medium">
              Access institutional-grade analysis for Lisbon, Porto, and Algarve property markets.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <Link
                href="/calculator"
                className="btn-primary"
              >
                Analyze a Property
              </Link>
              <Link
                href="/properties"
                className="btn-secondary"
              >
                Browse Listings
              </Link>
            </div>

            <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-12 border-t border-slate-200 pt-10">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-4xl font-bold text-slate-900 mb-2">{stat.value}</div>
                  <div className="text-sm font-bold uppercase tracking-widest text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Floating Decoration */}
        <div className="absolute right-[-10%] top-[20%] size-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
      </section>

      {/* Feature Section Grid */}
      <section className="max-w-7xl mx-auto px-6 w-full py-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">Built for Serious Investors</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-xl font-medium">
            From yield estimation to tax optimization, we provide everything you need to make data-backed decisions in Portugal.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-10 rounded-[32px] group relative"
            >
              <div className={`size-14 rounded-2xl flex items-center justify-center mb-8 ${feature.color}`}>
                <feature.icon className="size-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-500 leading-relaxed font-bold text-sm mb-8">
                {feature.description}
              </p>
              <Link
                href={feature.link}
                className="inline-flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest"
              >
                Learn More <ChevronRight className="size-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Proof / Institutional Badge Section */}
      <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-10">
                  <h2 className="text-4xl md:text-5xl font-bold text-slate-900">Institutional <span className="text-blue-600">Trust</span> In Every Transaction</h2>
                  <p className="text-slate-500 text-lg leading-relaxed font-bold">LusaInvest operates under the InvesTerra global framework, ensuring that every Portuguese listing follows strict transparency and data-modeling standards.</p>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                      {[
                        { title: 'Tax Accurate', desc: 'Updated for 2026 IMT/Stamp Duty ranges.', icon: ShieldCheck },
                        { title: 'Legal Vetting', desc: 'Direct access to Lisbon lawyer network.', icon: Building2 },
                        { title: 'Regional Data', desc: 'Precise neighborhood yield maps.', icon: MapPin },
                        { title: 'Market Trends', desc: 'Predictive ROI Modeling.', icon: TrendingUp },
                      ].map(item => (
                        <div key={item.title} className="flex gap-4">
                            <item.icon className="size-6 text-blue-600 shrink-0" />
                            <div>
                                <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">{item.desc}</p>
                            </div>
                        </div>
                      ))}
                  </div>
              </div>
              <div className="relative p-2 glass-card rounded-[48px]">
                  <Image 
                    src="/assets/lisbon_apartment_thumbnail_1775342996672.png" 
                    alt="Property View" 
                    width={800} 
                    height={1000} 
                    className="rounded-[44px] shadow-2xl"
                  />
                  <div className="absolute -bottom-10 -right-10 glass p-10 rounded-[32px] shadow-xl border-slate-200">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Lisbon Avg Yield</div>
                      <div className="text-5xl font-black text-slate-900">5.4%<span className="text-blue-600">+</span></div>
                  </div>
              </div>
          </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" className="max-w-7xl mx-auto px-6 w-full">
        <div className="rounded-[48px] bg-slate-900 p-12 md:p-24 relative overflow-hidden shadow-2xl shadow-blue-500/10">
          <div className="max-w-2xl relative z-10">
            <div className="section-tag !bg-white/10 !text-white !border-white/20 mb-8">
                Official Newsletter
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">Portugal Weekly <span className="text-blue-500">Yield Report.</span></h2>
            <p className="text-slate-400 text-xl font-bold mb-12">
              Join 12,000+ serious investors receiving off-market properties and market deep dives.
            </p>
            <form className="flex flex-col sm:flex-row gap-5">
              <div className="relative flex-grow">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-slate-500" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4.5 pl-14 pr-6 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600 font-bold"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-10 py-4.5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 uppercase tracking-widest text-xs"
              >
                Join Global List
              </button>
            </form>
            <p className="mt-8 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <CheckCircle2 className="size-4 text-emerald-500" />
              Verified high-fidelity data only.
            </p>
          </div>
          {/* Background Graphic */}
          <div className="absolute right-[-10%] top-[-10%] size-[600px] bg-blue-600/10 rounded-full blur-[140px] -z-0" />
        </div>
      </section>
    </div>
  );
}
