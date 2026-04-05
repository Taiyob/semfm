'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { 
  Building2, 
  ArrowRight, 
  Home, 
  Euro,
  ShieldCheck,
  ChevronRight,
  Star,
  Layout,
  Search,
  Filter,
  MapPin,
  TrendingUp
} from 'lucide-react';
import { fetchProperties, Property } from '@/lib/airtable';

const filters = ['All Type', 'Apartment', 'Villa', 'Commercial', 'Land'];
const sortOptions = ['Newest', 'Highest Yield', 'Lowest Price', 'Capital Growth'];

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
        const data = await fetchProperties('portugal');
        setProperties(data);
        setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 font-outfit hero-gradient min-h-screen">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-10">
        <div className="max-w-3xl space-y-6">
            <div className="section-tag w-fit">
                <Search className="size-4" />
                Verified Market Listings
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight">Europe's Top <span className="gradient-text">Yield Assets.</span></h1>
            <p className="text-xl text-slate-500 font-bold leading-relaxed max-w-2xl">
                Browse our curated selection of properties across Lisbon, Porto, and Algarve with pre-calculated institutional data.
            </p>
        </div>
        <div className="flex items-center gap-4 p-2 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                    <div key={i} className="size-10 rounded-full bg-slate-200 border-2 border-white overflow-hidden shadow-sm flex items-center justify-center font-bold text-[10px] text-slate-500">
                        {i === 4 ? '+12k' : ''}
                    </div>
                ))}
            </div>
            <div className="text-xs font-black uppercase tracking-widest text-slate-400">Trusted by Global Investors</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-24 z-30 mb-12">
        <div className="glass p-4 rounded-[32px] flex flex-wrap items-center justify-between gap-6 shadow-2xl shadow-slate-200/50">
            <div className="flex-grow max-w-md relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search Lisbon, Porto, or Property ID..." 
                    className="w-full bg-slate-50 border-transparent rounded-2xl py-4 pl-12 pr-6 outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-bold text-slate-600"
                />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {filters.map(filter => (
                    <button key={filter} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === 'All Type' ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>
                        {filter}
                    </button>
                ))}
            </div>

            <button className="px-6 py-3 bg-white border border-slate-200 text-slate-900 font-black text-xs uppercase tracking-widest rounded-xl flex items-center gap-2 hover:bg-slate-50">
                <Filter className="size-4" />
                Advanced Filters
            </button>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {loading ? (
            Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-[500px] bg-slate-100 rounded-[40px] animate-pulse" />
            ))
        ) : properties.map((property, idx) => (
          <motion.div
            key={property.id}
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
            className="glass-card rounded-[40px] overflow-hidden group cursor-pointer flex flex-col border-2 relative z-0 hover:z-10"
          >
            {/* Image Section */}
            <div className="relative h-72">
              <Image 
                src={property.image} 
                alt={property.title} 
                fill 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform group-hover:scale-105 duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                    <TrendingUp className="size-3 text-blue-600" />
                    High Yield
                </span>
                <span className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Verified Data</span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <div className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest">
                      View Details
                  </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 space-y-6 flex-grow flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-blue-600 mb-3">
                    <MapPin className="size-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">{property.location}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight mb-4 line-clamp-1">{property.title}</h3>
                
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-400 border border-slate-100">
                        <Building2 className="size-3" />
                        {property.type}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-400 border border-slate-100">
                        <Layout className="size-3" />
                        {property.sqm} Sqm
                    </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-8">
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Purchase price</span>
                    <div className="text-2xl font-black text-slate-900 tracking-tight">€{property.price.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Estimated Yield</span>
                    <div className="text-2xl font-black text-emerald-500 tracking-tight">{property.yield}%</div>
                  </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Off-Market CTA */}
      <div className="mt-32 p-12 md:p-24 bg-slate-950 rounded-[64px] text-white relative overflow-hidden text-center">
            <div className="relative z-10 max-w-3xl mx-auto space-y-10">
                <div className="section-tag !bg-white/5 !text-white !border-white/10 uppercase font-black mx-auto">Exclusive Insights</div>
                <h2 className="text-4xl md:text-6xl font-black leading-tight">Access <span className="text-blue-500">Off-Market</span> Opportunity.</h2>
                <p className="text-slate-500 text-xl font-bold leading-relaxed">Agent/Agency level account gives you access to pre-listed institutional assets before they go pubic.</p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Link href="/pricing" className="btn-primary !bg-white !text-slate-900">Get Agent Access</Link>
                    <button className="flex items-center gap-2 font-bold text-slate-400 hover:text-white transition-colors mx-auto sm:mx-0">
                        Explore Legal Requirements <ArrowRight className="size-5" />
                    </button>
                </div>
            </div>
            <div className="absolute top-0 right-0 size-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 size-[400px] bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
