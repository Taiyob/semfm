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

type SortType = 'price-asc' | 'price-desc' | 'yield-desc' | 'yield-asc' | 'appreciation-desc' | 'appreciation-asc';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('All');
  const [type, setType] = useState('All');
  const [priceRange, setPriceRange] = useState(2500000);
  const [yieldRange, setYieldRange] = useState(0);
  const [sortBy, setSortBy] = useState<SortType>('yield-desc');
  const [country, setCountry] = useState('All');
  const [bedrooms, setBedrooms] = useState('All');
  const [sqmRange, setSqmRange] = useState(500);
  const [condition, setCondition] = useState('All');

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
        const matchesCountry = country === 'All' || p.location.toLowerCase().includes(country.toLowerCase());
        const matchesType = type === 'All' || p.type === type;
        const matchesPrice = p.price <= priceRange;
        const matchesYield = p.yield >= yieldRange;
        const matchesBedrooms = bedrooms === 'All' || (bedrooms === '5+' ? p.bedrooms >= 5 : p.bedrooms === Number(bedrooms));
        const matchesSqm = p.sqm <= sqmRange;
        const matchesCondition = condition === 'All' || p.condition === condition;

        return matchesSearch && matchesCity && matchesCountry && matchesType && matchesPrice && matchesYield && matchesBedrooms && matchesSqm && matchesCondition;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'yield-desc') return b.yield - a.yield;
        if (sortBy === 'yield-asc') return a.yield - b.yield;
        if (sortBy === 'appreciation-desc') return b.appreciation - a.appreciation;
        if (sortBy === 'appreciation-asc') return a.appreciation - b.appreciation;
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
             Access pre-calculated properties with rent estimates and yield predictions
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-16">
        

        {/* Sidebar: Filters */}
        <aside className="lg:col-span-4">
            <div className="sticky top-32 space-y-8 bg-white p-10 rounded-[48px] border border-stone-100 shadow-2xl shadow-stone-200/50">
                <div className="flex items-center gap-3 mb-8">
                    <div className="size-10 bg-[#2C3E50] rounded-xl flex items-center justify-center">
                        <Filter className="size-5 text-white" />
                    </div>
                    <h3 className="text-xl font-black text-[#2C3E50] uppercase tracking-tight">Filters</h3>
                </div>

                <div className="space-y-8">
                    {/* Country filter */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2">Market Country</label>
                        <select 
                            value={country} 
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full bg-stone-50 border-2 border-transparent rounded-2xl py-4 px-5 outline-none focus:border-[#D4A373] transition-all font-bold text-[#2C3E50] text-sm"
                        >
                            {['All', 'Portugal', 'Spain', 'Greece'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* City Selection */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2">Location Context</label>
                        <div className="flex flex-wrap gap-2">
                            {['All', 'Lisbon', 'Porto', 'Braga', 'Faro'].map(c => (
                                <button key={c} onClick={() => setCity(c)} className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all", city === c ? "bg-[#2C3E50] text-white shadow-lg" : "bg-stone-50 text-stone-400 hover:bg-stone-100")}>
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Property Type */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2">Property Type</label>
                        <div className="flex flex-wrap gap-2">
                            {['All', 'Apartment', 'Studio', 'Villa', 'Penthouse'].map(t => (
                                <button key={t} onClick={() => setType(t)} className={cn("px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all", type === t ? "bg-[#2C3E50] text-white shadow-lg" : "bg-stone-50 text-stone-400 hover:bg-stone-100")}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bedrooms Selection */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2">Bedrooms</label>
                        <div className="flex flex-wrap gap-2">
                            {['All', '0', '1', '2', '3', '4', '5+'].map(b => (
                                <button key={b} onClick={() => setBedrooms(b)} className={cn("px-3 py-2 min-w-10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all", bedrooms === b ? "bg-[#2C3E50] text-white shadow-lg" : "bg-stone-50 text-stone-400 hover:bg-stone-100")}>
                                    {b === '0' ? 'S' : b}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                            <span className="text-stone-400">Max Asking Price</span>
                            <span className="text-[#2C3E50]">€{(priceRange/1000).toLocaleString()}k</span>
                        </div>
                        <input type="range" min={100000} max={2500000} step={50000} value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} className="w-full accent-[#2C3E50]" />
                    </div>

                    {/* SQM filter */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                            <span className="text-stone-400">Max Sqm Area</span>
                            <span className="text-[#2C3E50]">{sqmRange} m²</span>
                        </div>
                        <input type="range" min={20} max={500} step={5} value={sqmRange} onChange={(e) => setSqmRange(Number(e.target.value))} className="w-full accent-[#2C3E50]" />
                    </div>

                    {/* Property Condition filter */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-2">Property Condition</label>
                        <select 
                            value={condition} 
                            onChange={(e) => setCondition(e.target.value)}
                            className="w-full bg-stone-50 border-2 border-transparent rounded-2xl py-4 px-5 outline-none focus:border-[#D4A373] transition-all font-bold text-[#2C3E50] text-sm"
                        >
                            <option value="All">All Conditions</option>
                            {['In need of renovation', 'Outdated', 'Basic', 'Standard', 'Good', 'Premium', 'High-End'].map(cond => <option key={cond} value={cond}>{cond}</option>)}
                        </select>
                    </div>

                    {/* Yield Range */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                            <span className="text-stone-400">Min Net/Gross Yield</span>
                            <span className="text-[#D4A373]">{yieldRange}%</span>
                        </div>
                        <input type="range" min={0} max={12} step={0.5} value={yieldRange} onChange={(e) => setYieldRange(Number(e.target.value))} className="w-full accent-[#D4A373]" />
                    </div>

                    <button onClick={() => {
                        setCity('All'); 
                        setType('All'); 
                        setPriceRange(2500000); 
                        setYieldRange(0); 
                        setSearch('');
                        setCountry('All');
                        setBedrooms('All');
                        setSqmRange(500);
                        setCondition('All');
                      }} 
                        className="w-full py-4 text-[9px] font-black uppercase tracking-[0.2em] text-stone-400 hover:text-[#2C3E50] transition-colors flex items-center justify-center gap-2"
                    >
                        <ArrowUpDown className="size-3" /> Remove filters
                    </button>
                </div>
            </div>
        </aside>

        {/* Main Content: Properties Grid */}
        <div className="lg:col-span-8 space-y-12">
            
            {/* Search and Sort Toolbar */}
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="relative flex-grow max-w-md w-full">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 size-5 text-stone-400" />
                      <input
                          type="text"
                          placeholder="Search by location..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="w-full bg-white border border-stone-100 rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-2 focus:ring-[#D4A373] transition-all font-bold text-[#2C3E50] shadow-sm"
                      />
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-auto bg-white p-3 rounded-2xl border border-stone-100 shadow-sm">
                      <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest whitespace-nowrap ml-2">Standard Sort:</span>
                      <select 
                          value={sortBy.includes('price') ? sortBy : 'price-asc'}
                          onChange={(e) => setSortBy(e.target.value as SortType)}
                          className="bg-stone-50 border-none rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#2C3E50] outline-none cursor-pointer hover:bg-stone-100 transition-all"
                      >
                          <option value="price-asc">Price: Low to High</option>
                          <option value="price-desc">Price: High to Low</option>
                      </select>
                  </div>
              </div>

              {/* Investor Metric Sorting - Locked/Premium UI */}
              <div className="relative group">
                <div className="bg-[#D4A373]/5 border border-[#D4A373]/20 rounded-[32px] p-6 flex flex-col lg:flex-row items-center justify-between gap-6 overflow-hidden relative">
                  {/* Shiny Shimmer Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4A373]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                  
                  <div className="flex items-center gap-8 blur-[1.5px] opacity-40 select-none pointer-events-none transition-all group-hover:blur-[0.5px] group-hover:opacity-60 overflow-hidden">
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="size-8 bg-[#D4A373] rounded-lg flex items-center justify-center shadow-lg shadow-[#D4A373]/20">
                        <TrendingUp className="size-4 text-white" />
                      </div>
                      <span className="text-[10px] font-black text-[#D4A373] uppercase tracking-widest whitespace-nowrap">Investor Metrics:</span>
                    </div>
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                      {[
                        'Highest Gross Yield', 
                        'Highest Rental Estimate', 
                        'Highest Appreciation'
                      ].map(opt => (
                        <div key={opt} className="px-5 py-2 bg-white rounded-xl text-[9px] font-black uppercase tracking-tight text-[#2C3E50] border border-[#D4A373]/20 whitespace-nowrap shadow-sm">
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-6 relative z-10">
                    <div className="text-right hidden sm:block">
                      <div className="text-[10px] font-black text-[#D4A373] uppercase tracking-widest">Premium Sorting</div>
                      <div className="text-[9px] font-bold text-stone-400 italic">Premium access required</div>
                    </div>
                    <Link href="/pricing" className="px-6 py-3 bg-[#D4A373] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-[#D4A373]/20 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all">
                      <Lock className="size-4" /> Unlock Metrics
                    </Link>
                  </div>
                </div>
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
                            <span className="px-5 py-3 bg-[#D4A373] text-white rounded-2xl text-xs font-black shadow-xl flex items-center gap-2 uppercase tracking-widest border border-white/20">
                                <TrendingUp className="size-4" />
                                {property.yield}% Yield
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

                            <div className="flex flex-wrap gap-3">
                                <div className="px-3 py-1 bg-stone-50 rounded-lg text-[9px] font-black text-stone-400 border border-stone-100 uppercase">{property.bedrooms === 0 ? 'Studio' : (property.bedrooms + ' Bed')} Units</div>
                                <div className="px-3 py-1 bg-stone-50 rounded-lg text-[9px] font-black text-stone-400 border border-stone-100 uppercase">{property.sqm} Sqm</div>
                                <div className="px-3 py-1 bg-stone-50 rounded-lg text-[9px] font-black text-stone-400 border border-stone-100 uppercase">{property.locationType}</div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-stone-50 grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest block">Asking Price</span>
                                <div className="text-xl font-black text-[#2C3E50]">€{property.price.toLocaleString()}</div>
                            </div>
                            <div className="text-right space-y-1">
                                <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest block">Rental Estimate</span>
                                <div className="text-xl font-black text-[#D4A373]">€{Math.round((property.yield * property.price) / 1200).toLocaleString()}/mo</div>
                            </div>
                        </div>

                        <Link
                            href={`/properties/${property.id}`}
                            className="w-full py-4 bg-[#2C3E50] text-white rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-[#D4A373] transition-all shadow-xl shadow-[#2C3E50]/10"
                        >
                            Analyze property <ArrowRight className="size-4" />
                        </Link>
                        </div>
                    </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center font-black text-stone-300 uppercase tracking-[0.3em]">No Assets match filtered criteria</div>
                )}
            </div>
        </div>
      </div>

    </div>
  );
}

