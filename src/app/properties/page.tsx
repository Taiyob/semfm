'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
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
  Calculator,
  ArrowUpDown,
  Lock
} from 'lucide-react';

import { fetchProperties, Property } from '@/lib/airtable';
import { GatedData } from '@/components/gated-data';
import { cn } from '@/lib/utils';

type SortType = 'price-asc' | 'price-desc' | 'yield-desc' | 'yield-asc';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('All');
  const [type, setType] = useState('All');
  const [priceRange, setPriceRange] = useState(5000000);
  const [yieldRange, setYieldRange] = useState(0);
  const [sortBy, setSortBy] = useState<SortType>('yield-desc');

  useEffect(() => {
    async function loadData() {
      const data = await fetchProperties('portugal');
      setProperties(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredProperties = useMemo(() => {
    return properties
      .filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
        const matchesCity = city === 'All' || p.location.includes(city);
        const matchesType = type === 'All' || p.type === type;
        const matchesPrice = p.price <= priceRange;
        const matchesYield = p.yield >= yieldRange;
        return matchesSearch && matchesCity && matchesType && matchesPrice && matchesYield;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'yield-desc') return b.yield - a.yield;
        if (sortBy === 'yield-asc') return a.yield - b.yield;
        return 0;
      });
  }, [properties, search, city, type, priceRange, yieldRange, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 font-montserrat hero-gradient min-h-screen">

      {/* Page Header */}
      <div className="mb-20">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-5xl md:text-8xl font-black text-[#2C3E50] leading-[0.85] tracking-tighter uppercase">Market <span className="text-[#D4A373]">Inventory</span></h1>
          <p className="text-xl text-stone-500 font-bold leading-relaxed max-w-2xl italic">
            Access pre-calculated institutional assets with verified titles and yield projections.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-16">
        
        {/* Main Content: Properties Grid */}
        <div className="lg:col-span-8 space-y-12">
            
            {/* Search and Sort Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-grow max-w-md w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-stone-400" />
                    <input
                        type="text"
                        placeholder="Search by location or ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white border border-stone-100 rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-2 focus:ring-[#D4A373] transition-all font-bold text-[#2C3E50] shadow-sm"
                    />
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest whitespace-nowrap">Sort by:</span>
                    <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortType)}
                        className="bg-white border border-stone-100 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-[#2C3E50] outline-none cursor-pointer hover:border-[#D4A373] transition-all"
                    >
                        <option value="yield-desc">Highest Yield</option>
                        <option value="yield-asc">Lowest Yield</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                    </select>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
                {loading ? (
                Array(4).fill(0).map((_, i) => (
                    <div key={i} className="h-[500px] bg-stone-100 rounded-[48px] animate-pulse" />
                ))
                ) : filteredProperties.length > 0 ? (
                    filteredProperties.map((property) => (
                    <motion.div
                        key={property.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="group bg-white rounded-[48px] overflow-hidden border border-transparent hover:border-[#D4A373]/20 hover:shadow-2xl hover:shadow-[#D4A373]/5 transition-all duration-500 relative flex flex-col"
                    >
                        <div className="relative h-64 m-2 rounded-[40px] overflow-hidden bg-stone-100">
                        <Image
                            src={property.image}
                            alt={property.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 33vw"
                            className="object-cover transition-transform group-hover:scale-105 duration-1000"
                        />
                        <div className="absolute top-6 left-6">
                            <span className="px-4 py-2 bg-white/90 backdrop-blur-md text-[#2C3E50] rounded-xl text-[10px] font-black shadow-lg flex items-center gap-2 uppercase tracking-widest">
                                <TrendingUp className="size-3 text-[#D4A373]" />
                                {property.locationType}
                            </span>
                        </div>
                        </div>

                        <div className="p-8 space-y-6 flex-grow flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-[#D4A373] mb-4">
                                <MapPin className="size-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{property.location}</span>
                            </div>
                            <Link href={`/properties/${property.id}`}>
                                <h3 className="text-2xl font-black text-[#2C3E50] group-hover:text-[#D4A373] transition-colors leading-[0.95] mb-6 line-clamp-1 tracking-tighter uppercase">{property.title}</h3>
                            </Link>

                            <div className="flex gap-3">
                                <div className="px-3 py-1 bg-stone-50 rounded-lg text-[9px] font-black text-stone-400 border border-stone-100 uppercase">{property.bedrooms} Bed Units</div>
                                <div className="px-3 py-1 bg-stone-50 rounded-lg text-[9px] font-black text-stone-400 border border-stone-100 uppercase">{property.sqm} Sqm</div>
                                <div className="px-3 py-1 bg-[#D4A373]/5 rounded-lg text-[9px] font-black text-[#D4A373] border border-[#D4A373]/10 uppercase">{property.energyLabel} Label</div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-stone-50 grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest block">Entry Price</span>
                                <div className="text-xl font-black text-[#2C3E50]">€{property.price.toLocaleString()}</div>
                            </div>
                            <div className="text-right space-y-1">
                                <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest block">Gross Yield</span>
                                <GatedData><div className="text-xl font-black text-[#D4A373]">{property.yield}%</div></GatedData>
                            </div>
                        </div>

                        <Link
                            href={`/properties/${property.id}`}
                            className="w-full py-4 bg-[#2C3E50] text-white rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-[#D4A373] transition-all shadow-xl shadow-[#2C3E50]/10"
                        >
                            Analyze Assets <ArrowRight className="size-4" />
                        </Link>
                        </div>
                    </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center font-black text-stone-300 uppercase tracking-[0.3em]">No Assets match filtered criteria</div>
                )}
            </div>
        </div>

        {/* Sidebar: Advanced Filters */}
        <aside className="lg:col-span-4">
            <div className="sticky top-32 space-y-8 bg-white p-10 rounded-[48px] border border-stone-100 shadow-2xl shadow-stone-200/50">
                <div className="flex items-center gap-3 mb-8">
                    <div className="size-10 bg-[#2C3E50] rounded-xl flex items-center justify-center">
                        <Filter className="size-5 text-white" />
                    </div>
                    <h3 className="text-xl font-black text-[#2C3E50] uppercase tracking-tight">Advanced Logic</h3>
                </div>

                <div className="space-y-8">
                    {/* City Selection */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2">Location Context</label>
                        <div className="flex flex-wrap gap-2">
                            {['All', 'Lisbon', 'Porto', 'Madrid'].map(c => (
                                <button key={c} onClick={() => setCity(c)} className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all", city === c ? "bg-[#2C3E50] text-white shadow-lg" : "bg-stone-50 text-stone-400 hover:bg-stone-100")}>
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Property Type */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2">Asset Class</label>
                        <div className="flex flex-wrap gap-2">
                            {['All', 'Apartment', 'Studio', 'Villa', 'Penthouse'].map(t => (
                                <button key={t} onClick={() => setType(t)} className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all", type === t ? "bg-[#2C3E50] text-white shadow-lg" : "bg-stone-50 text-stone-400 hover:bg-stone-100")}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                            <span className="text-stone-400">Max Purchase Price</span>
                            <span className="text-[#2C3E50]">€{(priceRange/1000).toFixed(0)}k</span>
                        </div>
                        <input type="range" min={100000} max={5000000} step={50000} value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} className="w-full accent-[#2C3E50]" />
                    </div>

                    {/* Yield Range */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                            <span className="text-stone-400">Min Net/Gross Yield</span>
                            <span className="text-[#D4A373]">{yieldRange}%</span>
                        </div>
                        <input type="range" min={0} max={12} step={0.5} value={yieldRange} onChange={(e) => setYieldRange(Number(e.target.value))} className="w-full accent-[#D4A373]" />
                    </div>

                    <button onClick={() => {setCity('All'); setType('All'); setPriceRange(5000000); setYieldRange(0); setSearch('');}} 
                        className="w-full py-4 text-[9px] font-black uppercase tracking-[0.2em] text-stone-400 hover:text-[#2C3E50] transition-colors flex items-center justify-center gap-2"
                    >
                        <ArrowUpDown className="size-3" /> Reset Optimization Filters
                    </button>
                </div>

                <div className="pt-10 border-t border-stone-50">
                    <div className="p-6 bg-[#D4A373]/5 rounded-3xl border border-[#D4A373]/10">
                        <p className="text-[10px] font-bold text-stone-500 leading-relaxed italic">
                            Horizon logic filters inventory by institutional grade metrics. Only "Premium" and "Prime" assets are shown.
                        </p>
                    </div>
                </div>
            </div>
        </aside>
      </div>

    </div>
  );
}

