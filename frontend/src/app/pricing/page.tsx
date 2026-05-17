"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  UserCircle2,
  Building2,
  Lock,
  Globe,
  MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGetPropertiesQuery } from '@/lib/store/features/property/propertyApi';
import { useGetPlansQuery } from '@/lib/store/features/plan/planApi';
import { useCreateCheckoutSessionMutation, useCreatePortalSessionMutation } from '@/lib/store/features/subscription/subscriptionApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { useRouter } from 'next/navigation';

type UserType = 'investor' | 'agent';

export default function PricingPage() {
  const [userType, setUserType] = useState<UserType>('investor');
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const { data: plansData, isLoading: plansLoading } = useGetPlansQuery();
  const [createCheckout, { isLoading: isRedirecting }] = useCreateCheckoutSessionMutation();
  const [createPortal, { isLoading: isPortalLoading }] = useCreatePortalSessionMutation();

  const handlePlanSelect = async (plan: any) => {
    if (!user) {
      router.push('/login');
      return;
    }

    const hasActiveSubscription = user?.subscriptions?.length > 0;

    try {
      if (hasActiveSubscription) {
        // If already has a plan, open customer portal for upgrade/downgrade
        const response = await createPortal().unwrap();
        if (response?.data?.url) {
          window.location.href = response.data.url;
        }
      } else {
        // New subscription
        const response = await createCheckout({ planId: plan.id }).unwrap();
        const checkoutUrl = response?.data?.url;
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        }
      }
    } catch (error) {
      console.error('Failed to initiate checkout/portal:', error);
    }
  };

  // Determine user type based on role if logged in
  const effectiveUserType = user 
    ? (user.role?.name?.toLowerCase() === 'agent' ? 'agent' : 'investor')
    : userType;

  const allPlans = plansData?.data || [];
  
  const investorPlans = allPlans.filter((p: any) => 
    p.name.toLowerCase().includes('investor') || p.name === 'Free'
  ).sort((a: any, b: any) => a.price - b.price);

  const agentPlans = allPlans.filter((p: any) => 
    p.name.toLowerCase().includes('agent') || p.name.includes('listing')
  ).sort((a: any, b: any) => a.price - b.price);

  const activePlans = effectiveUserType === 'investor' ? investorPlans : agentPlans;

  return (
    <div className="min-h-screen pt-32 pb-24 font-montserrat hero-gradient">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-20 space-y-8">
            <h1 className="text-5xl md:text-8xl font-black text-[#2C3E50] leading-[0.9] tracking-tight">Access your <span className="text-[#D4A373]">investment</span> horizon</h1>
            <p className="text-xl text-stone-500 font-bold leading-relaxed italic">
                “Select the intelligence layer that matches your deployment strategy. From individual scouts to multinational agencies.”
            </p>

            {/* Toggle User Type - Hidden if logged in */}
            {!user && (
                <div className="flex items-center justify-center pt-10">
                    <div className="bg-white p-2 rounded-[32px] border border-stone-100 shadow-xl flex gap-2">
                        <button 
                            onClick={() => setUserType('investor')}
                            className={cn(
                                "px-10 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                                userType === 'investor' ? "bg-[#2C3E50] text-white shadow-lg" : "text-stone-400 hover:text-[#2C3E50]"
                            )}
                        >
                            <UserCircle2 className="size-4" /> Investor
                        </button>
                        <button 
                            onClick={() => setUserType('agent')}
                            className={cn(
                                "px-10 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                                userType === 'agent' ? "bg-[#2C3E50] text-white shadow-lg" : "text-stone-400 hover:text-[#2C3E50]"
                            )}
                        >
                            <Building2 className="size-4" /> Agent
                        </button>
                    </div>
                </div>
            )}

            {user && (
                <div className="pt-10">
                    <span className="px-6 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                        Tailored for your {effectiveUserType} account
                    </span>
                </div>
            )}
        </div>

        {/* Pricing Cards Grid */}
        <div className={cn(
            "grid gap-8 transition-all duration-500",
            activePlans.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-4"
        )}>
            {plansLoading ? (
                // Skeleton loading
                [1, 2, 3, 4].map(i => (
                    <div key={i} className="h-[600px] bg-white rounded-[48px] animate-pulse border border-stone-100" />
                ))
            ) : (
                <AnimatePresence mode="wait">
                    {activePlans.map((plan: any, index: number) => {
                        const isCurrentPlan = user?.subscriptions?.some((sub: any) => sub.planId === plan.id);

                        return (
                            <motion.div 
                                key={plan.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative p-8 rounded-[48px] bg-white border border-stone-100 transition-all duration-500 h-full flex flex-col hover:border-[#D4A373]/20 hover:shadow-2xl hover:shadow-stone-200/50`}
                            >
                                <div className="mb-10 text-left">
                                    <h3 className="text-xl font-black text-[#2C3E50] mb-2 tracking-tighter uppercase">{plan.name}</h3>
                                    <p className="text-stone-400 text-[10px] font-bold leading-relaxed italic line-clamp-2">{plan.description}</p>
                                </div>

                                <div className="mb-10 text-left">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-6xl font-black text-[#2C3E50] tracking-tighter self-start">€{plan.price}</span>
                                        <div className="flex flex-col">
                                            <span className="text-stone-300 font-black uppercase tracking-widest text-[9px]">EUR</span>
                                            <span className="text-[#D4A373] font-black uppercase tracking-widest text-[9px] truncate">
                                                {plan.interval === 'month' ? 'per month' : plan.interval || 'one time'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-10 flex-grow">
                                    {plan.features?.map((feature: string) => (
                                        <div key={feature} className="flex gap-3 items-start">
                                            <CheckCircle2 className="size-4 text-[#D4A373] shrink-0 mt-0.5" />
                                            <span className="text-[11px] font-bold text-stone-600 leading-tight">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <button 
                                    onClick={() => !isCurrentPlan && handlePlanSelect(plan)}
                                    disabled={isRedirecting || isPortalLoading || isCurrentPlan}
                                    className={cn(
                                        "w-full py-5 rounded-[20px] font-black transition-all flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest",
                                        "cursor-pointer active:scale-95 disabled:active:scale-100",
                                        isCurrentPlan 
                                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-not-allowed"
                                            : (plan.name.includes('Premium') || plan.name.includes('Pro')
                                                ? 'bg-[#2C3E50] text-white hover:bg-[#D4A373] shadow-xl shadow-[#2C3E50]/10' 
                                                : 'bg-stone-50 text-[#2C3E50] hover:bg-stone-100 border border-stone-100 hover:border-[#D4A373]/30'),
                                        (isRedirecting || isPortalLoading) && "opacity-50 cursor-wait"
                                    )}
                                >
                                    {isRedirecting || isPortalLoading 
                                        ? 'Processing...' 
                                        : (isCurrentPlan 
                                            ? 'Current Plan' 
                                            : (user?.subscriptions?.length > 0 
                                                ? 'Upgrade / Manage' 
                                                : (plan.price === 0 ? 'Get Started' : 'Subscribe Now')))} 
                                    {!isCurrentPlan && <ArrowRight className="size-4" />}
                                    {isCurrentPlan && <CheckCircle2 className="size-4" />}
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            )}
        </div>

        {/* Market Preview Section */}
        <div className="mt-40 space-y-12">
            <div className="text-center">
                <h2 className="text-3xl font-black text-[#2C3E50] uppercase tracking-tighter">Verified Market Opportunities</h2>
                <p className="text-stone-400 font-bold text-sm uppercase tracking-widest mt-2">Glimpse of current high-yield assets in our network</p>
            </div>

            <PropertyPreviewList />
        </div>

        {/* Confidence Footer */}
        <div className="mt-32 text-center">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-[0.3em]">
                Secure payments processed via secure gateway
            </p>
            <div className="flex justify-center gap-8 mt-6 opacity-30 grayscale items-center">
                <ShieldCheck className="size-8" />
                <Lock className="size-8" />
                <Globe className="size-8" />
            </div>
        </div>
      </div>
    </div>
  );
}

function PropertyPreviewList() {
    const { data: propertiesData, isLoading } = useGetPropertiesQuery({ page: 1, limit: 3 });
    const properties = propertiesData?.data || [];

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-[400px] bg-stone-50 rounded-[48px] animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {properties.map((property: any, index: number) => (
                <motion.div 
                    key={property.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white rounded-[48px] overflow-hidden border border-stone-100 shadow-xl shadow-stone-200/20 flex flex-col hover:border-[#D4A373]/20 transition-all"
                >
                    <div className="h-56 relative overflow-hidden">
                        {property.image ? (
                            <img src={property.image} alt={property.title} className="size-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                            <div className="size-full bg-stone-50 flex items-center justify-center">
                                <Building2 className="size-10 text-stone-200" />
                            </div>
                        )}
                        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black text-[#2C3E50] uppercase tracking-widest shadow-xl">
                            {property.type}
                        </div>
                    </div>
                    
                    <div className="p-8 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-black text-[#2C3E50] leading-tight line-clamp-1">{property.title}</h3>
                        </div>
                        
                        <div className="flex items-center gap-2 text-stone-400 font-bold text-[10px] uppercase tracking-widest mb-6">
                            <MapPin className="size-3" /> {property.location}
                        </div>

                        <div className="mt-auto pt-6 border-t border-stone-50 flex items-center justify-between">
                            <div>
                                <span className="block text-[9px] font-black text-stone-300 uppercase tracking-widest">Entry Price</span>
                                <span className="text-xl font-black text-[#2C3E50]">€{property.price?.toLocaleString()}</span>
                            </div>
                            <div className="text-right">
                                <span className="block text-[9px] font-black text-stone-300 uppercase tracking-widest">Net Yield</span>
                                <span className="text-xl font-black text-emerald-500">{property.yield}%</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

