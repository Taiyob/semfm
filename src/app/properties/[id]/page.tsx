'use client';

import { use, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  TrendingUp, 
  Calculator,
  ArrowLeft,
  Layout,
  Euro,
  CheckCircle2,
  Zap,
  Lock
} from 'lucide-react';
import { fetchProperties, Property } from '@/lib/airtable';
import { GatedData } from '@/components/gated-data';

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
        const all = await fetchProperties('portugal');
        const found = all.find(p => p.id === id);
        setProperty(found || null);
        setLoading(false);
    }
    loadData();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center hero-gradient"><div className="size-12 border-4 border-[#B55D3E] border-t-transparent rounded-full animate-spin" /></div>;
  if (!property) return <div className="min-h-screen flex items-center justify-center hero-gradient font-black text-stone-400 uppercase tracking-widest">Asset Not Found in Horizon Registry</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 font-outfit hero-gradient min-h-screen">
      <Link href="/properties" className="inline-flex items-center gap-2 text-stone-400 hover:text-[#B55D3E] font-black text-[10px] uppercase tracking-widest mb-12 transition-colors group">
        <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" /> Back to Inventory
      </Link>

      <div className="grid lg:grid-cols-2 gap-20">
        {/* Left: Visuals */}
        <div className="space-y-8">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative aspect-[4/3] rounded-[64px] overflow-hidden shadow-2xl border-2 border-white">
                <Image src={property.image} alt={property.title} fill className="object-cover" />
                <div className="absolute top-8 left-8">
                    <div className="section-tag !bg-white !text-stone-900 !border-white/20 shadow-xl">Verified Asset ID: {property.id}</div>
                </div>
            </motion.div>
            <div className="grid grid-cols-3 gap-6">
                {[1,2,3].map(i => (
                    <div key={i} className="aspect-square bg-stone-100 rounded-3xl border border-stone-200 overflow-hidden relative grayscale hover:grayscale-0 transition-all cursor-pointer">
                        <Image src={property.image} alt="Thumbnail" fill className="object-cover opacity-50" />
                    </div>
                ))}
            </div>
        </div>

        {/* Right: Data Analysis */}
        <div className="space-y-12">
            <div className="space-y-6">
                <div className="flex items-center gap-2 text-[#D4A373]">
                    <MapPin className="size-5" />
                    <span className="text-xs font-black uppercase tracking-widest">{property.location}</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-stone-900 leading-[0.95] uppercase tracking-tighter">{property.title}</h1>
                <p className="text-stone-500 font-bold italic leading-relaxed text-lg">
                    “A high-fidelity institutional asset with pre-calculated yield maps and tax-inclusive acquisition metrics.”
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-12 border-b border-stone-100">
                <div className="p-8 bg-white rounded-[40px] border border-stone-50 shadow-xl shadow-stone-200/40">
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-1">Acquisition Price</span>
                    <div className="text-3xl font-black text-stone-900 tracking-tight">€{property.price.toLocaleString()}</div>
                </div>
                <div className="p-8 bg-stone-900 rounded-[40px] text-white">
                    <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest block mb-1">Horizon Yield</span>
                    <GatedData><div className="text-3xl font-black text-[#D4A373] tracking-tight">{property.yield}%</div></GatedData>
                </div>
            </div>

            <div className="space-y-8">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 pb-4 border-b border-stone-100">Property Matrix</h3>
                <div className="grid grid-cols-3 gap-8">
                    <div className="space-y-1">
                        <Building2 className="size-5 text-[#B55D3E] mb-2" />
                        <span className="text-xs font-black text-stone-900 uppercase">{property.bedrooms} Bed Units</span>
                        <p className="text-[9px] font-bold text-stone-400 uppercase">Occupancy Ready</p>
                    </div>
                    <div className="space-y-1">
                        <Layout className="size-5 text-[#B55D3E] mb-2" />
                        <span className="text-xs font-black text-stone-900 uppercase">{property.sqm} Sqm Area</span>
                        <p className="text-[9px] font-bold text-stone-400 uppercase">Gross Build</p>
                    </div>
                    <div className="space-y-1">
                        <ShieldCheck className="size-5 text-[#B55D3E] mb-2" />
                        <span className="text-xs font-black text-stone-900 uppercase">Verified Registry</span>
                        <p className="text-[9px] font-bold text-stone-400 uppercase">Institutional Trust</p>
                    </div>
                </div>
            </div>

            <div className="p-8 bg-[#B55D3E]/5 rounded-[40px] border border-[#B55D3E]/10 space-y-6">
                <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#B55D3E]">Estimated Monthly Rent</span>
                    <GatedData blur={true}><span className="text-xl font-black text-stone-900">€{(property.price * (property.yield / 100) / 12).toFixed(0)}/mo</span></GatedData>
                </div>
                <div className="h-px bg-stone-100" />
                <div className="space-y-4">
                    <p className="text-xs font-bold text-stone-500 italic">
                        Unlock the full financial breakdown including net cash flow, mortgage leverage, and 20-year equity projections.
                    </p>
                    <Link href="/calculator" className="btn-primary w-full flex items-center justify-center gap-3 py-5 text-[10px] tracking-widest">
                        Calculate Net Profit <Calculator className="size-4" />
                    </Link>
                </div>
            </div>
        </div>
      </div>

      {/* Institutional Trust Footer */}
      <div className="mt-32 p-16 bg-white border border-stone-100 rounded-[64px] shadow-2xl shadow-stone-200/50 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl space-y-4">
              <div className="section-tag">Transparency Protocol</div>
              <h4 className="text-3xl font-black text-stone-900 uppercase">Every asset undergoes a 48-point verification.</h4>
              <p className="text-stone-500 font-bold italic">“Our data engine ensures title deeds, tax codes, and regional trends are verified before listing arrival.”</p>
          </div>
          <Link href="/pricing" className="btn-secondary whitespace-nowrap group">
              Unlock Full Asset Intelligence <Zap className="size-4 ml-2 inline group-hover:scale-110 transition-transform text-[#B55D3E]" />
          </Link>
      </div>
    </div>
  );
}
