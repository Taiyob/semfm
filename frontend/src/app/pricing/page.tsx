"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  Globe, 
  Zap,
  ArrowRight,
  UserCircle2,
  Building2,
  Layout,
  FileText,
  PieChart,
  Target,
  BarChart3,
  Lock,
  Search,
  ArrowUpDown,
  Laptop
} from 'lucide-react';
import { cn } from '@/lib/utils';

type UserType = 'investor' | 'agent';

interface Plan {
  id: string;
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
}

const investorPlans: Plan[] = [
  {
    id: 'investor-free',
    name: 'Free',
    price: '0',
    description: 'Essential data for market explorers.',
    features: [
      'Rent estimates',
      'Gross yield',
      'Properties overview',
      '5 saved listings (only if you make an account)',
      'No Property match alerts',
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    id: 'investor-basic',
    name: 'Investor Basic',
    price: '20',
    description: 'Deeper insights for active searchers.',
    features: [
      'Net profit insights',
      'Sort by investor metrics',
      '20 saved listings',
      '1 match alert / month',
    ],
    cta: 'Select Basic',
    popular: false
  },
  {
    id: 'investor-pro',
    name: 'Investor Pro',
    price: '30',
    description: 'The strategy engine for professional investors.',
    features: [
      'All calculator tools',
      'Compare up to 5 listings',
      'Portfolio simulator (up to 5 properties)',
      'Export to PDF',
      'Up to 15 match alerts',
    ],
    cta: 'Upgrade to Pro',
    popular: false
  },
  {
    id: 'investor-premium',
    name: 'Investor Premium',
    price: '50',
    description: 'Full portfolio intelligence platform.',
    features: [
      'Everything from Free, Basic, and Pro',
      'Unlimited saved properties',
      'Portfolio simulator (up to 25 properties)',
      'Unlimited match alerts',
    ],
    cta: 'Go Premium',
    popular: false
  }
];

const agentPlans: Plan[] = [
  {
    id: 'agent-listing',
    name: 'Pay-per-listing',
    price: '50',
    period: 'per listing',
    description: 'Post verified listings on demand.',
    features: [
      'Verified listing placement',
      'Regional reach',
      'Basic lead notifications',
    ],
    cta: 'Post Now',
    popular: false
  },
  {
    id: 'agent-unlimited',
    name: 'Agent Unlimited',
    price: '200',
    description: 'Scale your inventory without limits.',
    features: [
      'Unlimited listings',
      'Up to 3 team members',
      'Basic analytics (views, leads)',
    ],
    cta: 'Select Unlimited',
    popular: false
  },
  {
    id: 'agent-pro',
    name: 'Agent Pro',
    price: '350',
    description: 'Professional-grade agency tools.',
    features: [
      'Everything in Unlimited',
      '5 boosts/month (48 hours)',
      'Up to 10 team members',
      'Listing performance insights:',
      '• Best-performing cities',
      '• Most viewed listings',
    ],
    cta: 'Get Pro',
    popular: false
  },
  {
    id: 'agent-premium',
    name: 'Agent Premium',
    price: '500',
    description: 'Full network dominance platform.',
    features: [
      'Everything in Pro',
      '15 boosts/month (48 hours)',
      'Priority support',
      'Up to 20 team members',
      'Scheduled price changes',
      'Lead export (CSV)',
    ],
    cta: 'Go Premium',
    popular: false
  }
];

export default function PricingPage() {
  const [userType, setUserType] = useState<UserType>('investor');

  const activePlans = userType === 'investor' ? investorPlans : agentPlans;

  return (
    <div className="min-h-screen pt-32 pb-24 font-montserrat hero-gradient">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-20 space-y-8">
            <h1 className="text-5xl md:text-8xl font-black text-[#2C3E50] leading-[0.9] tracking-tight">Access your <span className="text-[#D4A373]">investment</span> horizon</h1>
            <p className="text-xl text-stone-500 font-bold leading-relaxed italic">
                “Select the intelligence layer that matches your deployment strategy. From individual scouts to multinational agencies.”
            </p>

            {/* Toggle User Type */}
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
        </div>

        {/* Pricing Cards Grid */}
        <div className={cn(
            "grid gap-8 transition-all duration-500",
            userType === 'investor' ? "lg:grid-cols-4" : "lg:grid-cols-4"
        )}>
            <AnimatePresence mode="wait">
                {activePlans.map((plan, index) => (
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
                            <p className="text-stone-400 text-[10px] font-bold leading-relaxed italic">{plan.description}</p>
                        </div>

                        <div className="mb-10 text-left">
                            <div className="flex items-baseline gap-2">
                                <span className="text-6xl font-black text-[#2C3E50] tracking-tighter self-start">€{plan.price}</span>
                                <div className="flex flex-col">
                                    <span className="text-stone-300 font-black uppercase tracking-widest text-[9px]">EUR</span>
                                    <span className="text-[#D4A373] font-black uppercase tracking-widest text-[9px] truncate">
                                        {plan.period || 'per month'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 mb-10 flex-grow">
                            {plan.features.map(feature => (
                                <div key={feature} className="flex gap-3 items-start">
                                    <CheckCircle2 className="size-4 text-[#D4A373] shrink-0 mt-0.5" />
                                    <span className="text-[11px] font-bold text-stone-600 leading-tight">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <button 
                            className={cn(
                                "w-full py-5 rounded-[20px] font-black transition-all flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest",
                                plan.id.includes('premium') || plan.id.includes('pro')
                                ? 'bg-[#2C3E50] text-white hover:bg-[#D4A373] shadow-xl shadow-[#2C3E50]/10' 
                                : 'bg-stone-50 text-[#2C3E50] hover:bg-stone-100'
                            )}
                        >
                            {plan.cta} <ArrowRight className="size-4" />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>

        {/* Confidence Footer */}
        <div className="mt-24 text-center">
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

