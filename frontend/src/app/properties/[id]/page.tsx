'use client';

import { use, useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
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
  Lock,
  Compass,
  Wind,
  Sun,
  Hammer,
  TreePine,
  FileText,
  Star,
  HelpCircle,
  BarChart3
} from 'lucide-react';
import { 
  useGetPropertyByIdQuery, 
  useIncrementViewsMutation,
} from '@/lib/store/features/property/propertyApi';
import { useCreateLeadMutation } from '@/lib/store/features/leads/leadsApi';
import Swal from 'sweetalert2';
import { GatedData } from '@/components/gated-data';
import { calculateAcquisitionBreakdown } from '@/lib/calculations';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/lib/store/hooks';
import { useRouter } from 'next/navigation';

type Scenario = 'investor' | 'resident' | 'exemption';

// Simple Tooltip Component
function Tooltip({ text, active }: { text: string; active?: boolean }) {
  return (
    <div className="group relative inline-block ml-1">
      <HelpCircle className={cn("size-3 cursor-help transition-colors", active ? "text-white/80" : "text-stone-400")} />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-stone-900 text-white text-[10px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl font-medium leading-relaxed">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-stone-900" />
      </div>
    </div>
  );
}

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { data: propertyResponse, isLoading: loading } = useGetPropertyByIdQuery(id);
  const [incrementViews] = useIncrementViewsMutation();
  const [createLead, { isLoading: isCreatingLead }] = useCreateLeadMutation();
  const [scenario, setScenario] = useState<Scenario>('investor');

  const property = propertyResponse?.data;

  useEffect(() => {
    if (id) {
      // Session-based tracking: check if this property has already been viewed in this session
      const viewedProperties = JSON.parse(sessionStorage.getItem('viewed_properties') || '[]');
      
      if (!viewedProperties.includes(id)) {
        incrementViews(id);
        // Add to session storage so we don't count it again in this session
        sessionStorage.setItem('viewed_properties', JSON.stringify([...viewedProperties, id]));
      }
    }
  }, [id, incrementViews]);

  const handleContactAgent = async () => {
    if (!id) return;

    // Check if user is logged in
    if (!currentUser) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please sign in to contact the agent about this property.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#34495E',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sign In Now'
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/login');
        }
      });
      return;
    }

    try {
      await createLead({ propertyId: id }).unwrap();
      
      Swal.fire({
        title: 'Interest Registered!',
        text: 'The agent has been notified and will contact you shortly.',
        icon: 'success',
        background: '#ffffff',
        color: '#2C3E50',
        confirmButtonColor: '#34495E',
        confirmButtonText: 'GREAT',
        buttonsStyling: true,
        customClass: {
          popup: 'rounded-[32px] border-none shadow-2xl',
          confirmButton: 'rounded-xl px-8 py-3 font-black uppercase tracking-widest text-[10px]'
        },
        showClass: {
          popup: 'animate__animated animate__fadeInUp animate__faster'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutDown animate__faster'
        }
      });
    } catch (error: any) {
      Swal.fire({
        title: 'Oops!',
        text: error?.data?.message || 'Something went wrong while sending your inquiry.',
        icon: 'error',
        confirmButtonColor: '#E74C3C'
      });
    }
  };

  const costs = useMemo(() => {
    if (!property) return null;
    return calculateAcquisitionBreakdown(property.price, scenario);
  }, [property, scenario]);

  if (loading) return <div className="min-h-screen flex items-center justify-center hero-gradient"><div className="size-12 border-4 border-[#34495E] border-t-transparent rounded-full animate-spin" /></div>;
  if (!property || !costs) return <div className="min-h-screen flex items-center justify-center hero-gradient font-black text-stone-400 uppercase tracking-widest">Asset Not Found</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 font-montserrat hero-gradient min-h-screen">
      <Link href="/properties" className="inline-flex items-center gap-2 text-stone-500 hover:text-[#34495E] font-black text-[10px] uppercase tracking-widest mb-12 transition-colors group">
        <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" /> Back to Inventory
      </Link>

      <div className="grid lg:grid-cols-12 gap-16">
        {/* Left: Visuals and Description */}
        <div className="lg:col-span-7 space-y-12">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative aspect-[16/10] rounded-[64px] overflow-hidden shadow-2xl border-4 border-white bg-stone-100">
                {property.image ? (
                    <Image src={property.image} alt={property.title} fill priority sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" />
                ) : (
                    <div className="size-full flex items-center justify-center bg-stone-50">
                        <Building2 className="size-20 text-stone-200" />
                    </div>
                )}
            </motion.div>

            <div className="space-y-8 p-10 bg-white rounded-[48px] border border-stone-100 shadow-xl shadow-stone-200/40">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-stone-50 rounded-xl flex items-center justify-center">
                            <FileText className="size-5 text-[#D4A373]" />
                        </div>
                        <h3 className="text-xl font-black text-[#2C3E50] uppercase tracking-tight">Description</h3>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Rental Estimate</span>
                        <div className="text-lg font-black text-[#D4A373]">€{Math.round((property.yield * property.price) / 1200).toLocaleString()}/mo</div>
                    </div>
                </div>
                <p className="text-stone-600 font-bold leading-relaxed text-lg italic">
                   {property.description}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-stone-50">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-stone-500">
                             <Building2 className="size-3.5 text-stone-400" />
                             <span className="text-[9px] font-black uppercase tracking-widest">Bedrooms</span>
                        </div>
                        <div className="text-sm font-black text-[#2C3E50]">{property.bedrooms} Bedrooms</div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-stone-500">
                             <Layout className="size-3.5 text-stone-400" />
                             <span className="text-[9px] font-black uppercase tracking-widest">Sq.meters</span>
                        </div>
                        <div className="text-sm font-black text-[#2C3E50]">{property.sqm} Net Sqm</div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-stone-500">
                             <Compass className="size-3.5 text-stone-400" />
                             <span className="text-[9px] font-black uppercase tracking-widest">Location Zone</span>
                        </div>
                        <div className="text-sm font-black text-[#2C3E50]">{property.locationType}</div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-stone-500">
                             <TreePine className="size-3.5 text-stone-400" />
                             <span className="text-[9px] font-black uppercase tracking-widest">Outdoor Space</span>
                        </div>
                        <div className="text-sm font-black text-[#2C3E50]">{property.outdoorSpace}</div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-stone-500">
                             <Zap className="size-3.5 text-stone-400" />
                             <span className="text-[9px] font-black uppercase tracking-widest">Energy</span>
                        </div>
                        <div className="text-sm font-black text-[#2C3E50]">Label {property.energyLabel}</div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-stone-500">
                             <Hammer className="size-3.5 text-stone-400" />
                             <span className="text-[9px] font-black uppercase tracking-widest">Property Condition</span>
                        </div>
                        <div className="text-sm font-black text-[#2C3E50]">{property.condition}</div>
                    </div>
                </div>
            </div>
        </div>

        {/* Right: Financial Intelligence */}
        <div className="lg:col-span-5 space-y-10">
            <div className="space-y-6">
                <div className="flex items-center gap-2 text-[#D4A373]">
                    <MapPin className="size-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{property.location}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-[#2C3E50] leading-[0.95] uppercase tracking-tighter">{property.title}</h1>
            </div>

            {/* Purchase Scenarios */}
            <div className="bg-[#2C3E50] p-10 rounded-[56px] text-white shadow-2xl shadow-[#2C3E50]/20 space-y-10">
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-6">Purchase Scenarios</h4>
                    <div className="flex bg-white/5 p-2 rounded-2xl gap-2">
                        {(['investor', 'resident', 'exemption'] as Scenario[]).map(s => (
                            <button 
                                key={s} 
                                onClick={() => setScenario(s)} 
                                className={cn(
                                    "flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5", 
                                    scenario === s ? "bg-[#D4A373] text-white shadow-lg" : "text-stone-300 hover:text-white"
                                )}
                            >
                                {s === 'exemption' && <Star className="size-3 fill-current" />}
                                {s === 'exemption' ? 'Preferred Scenario' : s}
                                {s === 'investor' && <Tooltip active={scenario === s} text="Buying a property not as your primary and permanent residence (HPP). Includes non-residents and Portuguese residents purchasing a second home or rental property." />}
                                {s === 'resident' && <Tooltip active={scenario === s} text="Buying a property as your primary and permanent home in Portugal. Requires Portuguese tax residency and declaring it as main residence." />}
                                {s === 'exemption' && <Tooltip active={scenario === s} text="Applies when rented within 6 months, below €2,300/month, for 36 months within the first 5 years." />}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex justify-between items-end border-b border-white/5 pb-6">
                        <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase text-stone-500">Total Investment</span>
                            <div className="text-5xl font-black text-white">€{costs.totalPrice.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-[9px] font-black text-[#D4A373] uppercase mb-1">Scenario Cost</div>
                            <div className="text-xl font-black text-[#D4A373]">€{costs.totalCosts.toLocaleString()}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-sm font-bold">
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-stone-400 uppercase text-[9px] tracking-widest">IMT (Tax)</span> 
                            <span className="text-white font-black">€{costs.imt.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-stone-400 uppercase text-[9px] tracking-widest">Stamp Duty</span> 
                            <span className="text-white font-black">€{costs.stampDuty.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-stone-400 uppercase text-[9px] tracking-widest">Legal Fee</span> 
                            <span className="text-white font-black">€{costs.legalFees.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-stone-400 uppercase text-[9px] tracking-widest">Registry</span> 
                            <span className="text-white font-black">€{costs.notaryFees.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-2">
                    <p className="text-[9px] font-bold text-stone-400 leading-relaxed italic">
                       {scenario === 'investor' && "Investor Baseline: Standard 7.5% IMT applied as standard ceiling."}
                       {scenario === 'resident' && "Resident Scenario: Progressive IMT Table applied for owner-occupied logic."}
                       {scenario === 'exemption' && "Moderate rent exemption applied: 0% IMT Exemption based on strategic rental contract conditions."}
                    </p>
                </div>
            </div>

            {/* Metrics Section */}
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="p-8 bg-white rounded-[40px] border border-stone-100 shadow-xl shadow-stone-200/40 space-y-2">
                        <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest block">Gross Yield</span>
                        <div className="text-4xl font-black text-[#2C3E50]">{property.yield}%</div>
                    </div>
                    <div className="p-8 bg-[#D4A373]/5 rounded-[40px] border border-[#D4A373]/10 space-y-2">
                        <span className="text-[10px] font-black text-[#D4A373] uppercase tracking-widest block">Estimated Net Profit</span>
                        <GatedData><div className="text-4xl font-black text-[#2C3E50]">€1,420<span className="text-xs ml-1">/mo</span></div></GatedData>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="p-8 bg-white rounded-[40px] border border-stone-100 shadow-xl shadow-stone-200/40 space-y-2">
                        <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest block">Cash ROI</span>
                        <GatedData><div className="text-4xl font-black text-[#2C3E50]">8.4%</div></GatedData>
                    </div>
                    <div className="p-8 bg-[#D4A373]/5 rounded-[40px] border border-[#D4A373]/10 space-y-2 text-center flex flex-col justify-center">
                         <span className="text-[10px] font-black text-[#D4A373] uppercase tracking-widest block mb-1">20Y Horizon Projection</span>
                         <GatedData blur={true}><div className="text-4xl font-black text-[#2C3E50] tracking-tighter uppercase">+245%</div></GatedData>
                    </div>
                </div>
            </div>

            {/* Contact Agent Action */}
            <button 
                onClick={handleContactAgent}
                disabled={isCreatingLead || (propertyResponse?.data as any)?.hasActiveInquiry}
                className={cn(
                  "w-full py-6 rounded-[32px] text-xs font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3",
                  (propertyResponse?.data as any)?.hasActiveInquiry 
                    ? "bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200" 
                    : "bg-[#D4A373] text-white shadow-2xl shadow-[#D4A373]/20 hover:scale-[1.02] active:scale-[0.98]"
                )}
            >
                {(propertyResponse?.data as any)?.hasActiveInquiry ? (
                  <>Inquiry Sent <CheckCircle2 className="size-4" /></>
                ) : (
                  isCreatingLead ? "Sending..." : "Contact Agent for Details"
                )}
            </button>
        </div>
      </div>
    </div>
  );
}
