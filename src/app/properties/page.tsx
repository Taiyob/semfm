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
  TrendingUp,
  Calculator
} from 'lucide-react';

import { fetchProperties, Property } from '@/lib/airtable';
import { GatedData } from '@/components/gated-data';

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
                Institutional Market Access
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-stone-900 leading-[0.95] tracking-tight uppercase">Top Yield <span className="gradient-text">Asset Inventory.</span></h1>
            <p className="text-xl text-stone-500 font-bold leading-relaxed max-w-2xl italic">
                “Access regional inventory with pre-calculated institutional data metrics, tax overheads, and verified titles.”
            </p>
        </div>
        <div className="flex items-center gap-4 p-4 bg-white rounded-3xl shadow-xl shadow-stone-200/50 border border-stone-100">
            <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                    <div key={i} className="size-10 rounded-full bg-stone-100 border-2 border-white overflow-hidden shadow-sm flex items-center justify-center font-black text-[10px] text-stone-400 uppercase">
                        {i === 4 ? '+12k' : ''}
                    </div>
                ))}
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-stone-400">Institutional Trust Registry</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-24 z-30 mb-12">
        <div className="glass p-4 rounded-[32px] flex flex-wrap items-center justify-between gap-6 shadow-2xl shadow-stone-200/50 border border-white/40">
            <div className="flex-grow max-w-md relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-stone-400" />
                <input 
                    type="text" 
                    placeholder="Search Lisbon, Porto, or Property ID..." 
                    className="w-full bg-stone-50 border-stone-100 rounded-2xl py-4.5 pl-14 pr-6 outline-none focus:ring-2 focus:ring-[#B55D3E] focus:bg-white transition-all font-bold text-stone-600"
                />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {filters.map(filter => (
                    <button key={filter} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'All Type' ? 'bg-stone-900 text-white shadow-xl shadow-stone-900/20' : 'bg-stone-50 text-stone-500 hover:bg-stone-100'}`}>
                        {filter}
                    </button>
                ))}
            </div>

            <button className="px-6 py-3 bg-white border border-stone-200 text-stone-900 font-black text-[10px] uppercase tracking-widest rounded-xl flex items-center gap-2 hover:bg-stone-50 transition-colors">
                <Filter className="size-4 text-[#B55D3E]" />
                Matrix Filters
            </button>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
        {loading ? (
            Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-[520px] bg-stone-100 rounded-[48px] animate-pulse" />
            ))
        ) : properties.map((property, idx) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group bg-white rounded-[48px] overflow-hidden border border-transparent hover:border-[#B55D3E]/20 hover:shadow-2xl hover:shadow-stone-200/50 transition-all duration-500 flex flex-col relative"
          >
            {/* Image Section */}
            <div className="relative h-72 m-2 rounded-[40px] overflow-hidden">
              <Image 
                src={property.image} 
                alt={property.title} 
                fill 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform group-hover:scale-105 duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <span className="px-4 py-2 bg-[#B55D3E] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                    <TrendingUp className="size-3" />
                    Premium Yield
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 pb-10 space-y-8 flex-grow flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#D4A373] mb-4">
                    <MapPin className="size-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{property.location}</span>
                </div>
                <h3 className="text-2xl font-black text-stone-900 group-hover:text-[#B55D3E] transition-colors leading-[0.95] mb-6 line-clamp-2 uppercase tracking-tight">{property.title}</h3>
                
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-stone-50 rounded-lg text-[9px] font-black text-stone-400 border border-stone-100 uppercase">
                        <Building2 className="size-3" />
                        {property.bedrooms} Bed Units
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-stone-50 rounded-lg text-[9px] font-black text-stone-400 border border-stone-100 uppercase">
                        <Layout className="size-3" />
                        {property.sqm} Sqm
                    </div>
                </div>
              </div>

              <div className="pt-8 border-t border-stone-100 grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase text-stone-400 tracking-widest block mb-1">Acquisition Price</span>
                    <div className="text-2xl font-black text-stone-900 tracking-tight">€{property.price.toLocaleString()}</div>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-[9px] font-black uppercase text-stone-400 tracking-widest block mb-1">Horizon Yield</span>
                    <GatedData>
                        <div className="text-2xl font-black text-[#B55D3E] tracking-tight">{property.yield}%</div>
                    </GatedData>
                  </div>
              </div>

              <Link 
                href="/calculator"
                className="w-full py-4 bg-stone-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#B55D3E] transition-all shadow-xl shadow-stone-950/10 active:scale-[0.98]"
              >
                  Calculate Net Profit <Calculator className="size-4" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Off-Market CTA */}
      <div className="mt-32 px-12 py-24 md:p-32 bg-stone-950 rounded-[80px] text-white relative overflow-hidden text-center border-b-8 border-[#B55D3E]">
            <div className="relative z-10 max-w-3xl mx-auto space-y-10">
                <div className="section-tag !bg-white/5 !text-white !border-white/10 uppercase font-black mx-auto">Asset Pipeline</div>
                <h2 className="text-4xl md:text-7xl font-black uppercase leading-[0.9]">Access <span className="text-[#B55D3E]">Off-Market</span> <br />Pipeline.</h2>
                <p className="text-stone-500 text-xl font-bold leading-relaxed italic">“Institutional access grants you visibility into high-yield assets before they hit the retail matrix.”</p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                    <Link href="/pricing" className="btn-primary !bg-[#FAF9F6] !text-stone-900">Unlock Agent Matrix</Link>
                    <button className="flex items-center gap-3 font-black text-[10px] uppercase tracking-widest text-stone-400 hover:text-white transition-colors mx-auto sm:mx-0">
                        View Analytics Protocol <ArrowRight className="size-5 text-[#B55D3E]" />
                    </button>
                </div>
            </div>
            <div className="absolute top-0 right-0 size-[600px] bg-[#B55D3E]/10 rounded-full blur-[140px]" />
      </div>
    </div>
  );
}

