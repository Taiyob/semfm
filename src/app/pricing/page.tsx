'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  Globe, 
  MapPin, 
  Zap,
  ArrowRight,
  UserCircle2,
  Building2,
  Clock
} from 'lucide-react';

const plans = [
  {
    id: 'investor',
    name: 'Investor Pro',
    description: 'Perfect for individual investors looking for high-yield residential assets.',
    price: '€49',
    period: 'per month',
    features: [
      'Access to all Western Europe Yield Data',
      'Professional ROI/IMT Calculator',
      'Weekly Off-Market Property Alerts',
      'Legal & Tax Overview Documents',
      'Portfolio Analytics Suite',
    ],
    cta: 'Start Investing',
    icon: UserCircle2,
    popular: true
  },
  {
    id: 'agent',
    name: 'Agent/Agency',
    description: 'The ultimate tool for top-performing real estate advisors and agencies.',
    price: '€199',
    period: 'per month',
    features: [
      'List Unlimited Verified Properties',
      'Lead Generation & CRM Dashboard',
      'API Access for Site Integration',
      'Institutional Data Feeds',
      'Brand Placement in Country Hails',
      'Dedicated Account Manager'
    ],
    icon: Building2,
    cta: 'Scale Your Agency',
    popular: false
  }
];

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-screen pt-32 pb-24 font-montserrat hero-gradient">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-20 space-y-8">
            <div className="section-tag mx-auto">
                <ShieldCheck className="size-4" />
                Institutional Data Protocol
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-[#2C3E50] leading-[0.9] tracking-tight">High fidelity analysis access</h1>
            <p className="text-xl text-stone-500 font-bold leading-relaxed italic">
                “Whether you are a solo high-net-worth investor or a multinational institutional desk, Hofman Horizon provides the verified data matrix you need to deploy capital with confidence.”
            </p>

            {/* Toggle Billing */}
            <div className="flex items-center justify-center gap-6 pt-10">
                <span className={`text-xs font-bold uppercase tracking-widest ${billing === 'monthly' ? 'text-[#34495E]' : 'text-stone-400'}`}>Monthly matrix</span>
                <button 
                  onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
                  className="w-16 h-9 bg-stone-900 rounded-full p-1.5 relative transition-all"
                >
                    <div className={`size-6 bg-[#34495E] rounded-full transition-all duration-300 shadow-lg ${billing === 'yearly' ? 'translate-x-7' : 'translate-x-0'}`} />
                </button>
                <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold uppercase tracking-widest ${billing === 'yearly' ? 'text-[#D4A373]' : 'text-stone-400'}`}>Annual protocol</span>
                    <span className="text-[10px] font-black bg-[#34495E] text-white px-3 py-1 rounded-lg uppercase tracking-widest animate-pulse">Save 20%</span>
                </div>
            </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {plans.map((plan) => (
                <div 
                    key={plan.id}
                    className={`relative p-10 lg:p-16 rounded-[64px] bg-white border border-stone-100 transition-all duration-500 h-full flex flex-col ${
                        plan.popular ? 'ring-4 ring-[#34495E]/10 shadow-3xl shadow-stone-200/50 scale-105 z-10' : 'hover:border-stone-200'
                    }`}
                >
                    {plan.popular && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-8 py-3 bg-stone-900 text-white text-xs font-bold rounded-2xl shadow-2xl border border-white/10 uppercase tracking-widest">
                            Institutional choice
                        </div>
                    )}
                    
                    <div className="mb-12">
                        <div className="size-16 bg-stone-50 rounded-[20px] flex items-center justify-center mb-10 group-hover:bg-[#34495E] transition-colors">
                            <plan.icon className="size-8 text-[#34495E]" />
                        </div>
                        <h3 className="text-3xl font-black text-[#2C3E50] mb-4 tracking-tighter">{plan.name}</h3>
                        <p className="text-stone-500 text-sm font-bold leading-relaxed italic">{plan.description}</p>
                    </div>

                    <div className="mb-12">
                        <div className="flex items-baseline gap-3">
                            <span className="text-7xl font-black text-[#2C3E50] tracking-tighter">{plan.price}</span>
                            <div className="flex flex-col">
                                <span className="text-stone-400 font-black uppercase tracking-widest text-[10px]">EUR</span>
                                <span className="text-[#34495E] font-black uppercase tracking-widest text-[10px] tracking-tight">{plan.period}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 mb-16 flex-grow">
                        {plan.features.map(feature => (
                            <div key={feature} className="flex gap-4 items-start">
                                <CheckCircle2 className="size-5 text-[#D4A373] shrink-0 mt-0.5" />
                                <span className="text-sm font-medium text-stone-600 leading-relaxed">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <Link 
                        href={`/pricing/checkout?plan=${plan.id}`}
                        className={`w-full py-6 rounded-[24px] font-black transition-all flex items-center justify-center gap-4 text-xs shadow-2xl ${
                            plan.popular 
                            ? 'bg-stone-900 text-white hover:bg-[#34495E] shadow-stone-900/20' 
                            : 'bg-stone-100 text-[#2C3E50] hover:bg-stone-200'
                        }`}
                    >
                        Initialize {plan.name} <ArrowRight className="size-4" />
                    </Link>
                </div>
            ))}
        </div>

        {/* Global Access Proof */}
        <div className="mt-32 p-12 md:p-24 bg-stone-950 rounded-[80px] text-white relative overflow-hidden border-b-8 border-[#34495E]">
            <div className="grid lg:grid-cols-2 gap-24 items-center relative z-10 text-left">
                <div className="space-y-10">
                    <div className="section-tag !bg-white/5 !text-white !border-white/10">External Integration</div>
                    <h2 className="text-4xl md:text-7xl font-black leading-[0.9] tracking-tight">High velocity global API</h2>
                    <p className="text-stone-500 text-xl font-bold italic leading-relaxed">"Integrating Hofman Horizon data into our institutional trading desk reduced analysis latency by 40%."</p>
                    <div className="flex items-center gap-6">
                        <div className="size-16 rounded-[24px] bg-stone-800" />
                        <div>
                            <div className="font-black uppercase tracking-tight text-lg">Sofia Mendes</div>
                            <div className="text-xs font-bold text-[#34495E] uppercase tracking-widest">Managing Director, Mendes Global</div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                    <div className="p-10 bg-white/5 rounded-[40px] border border-white/5 flex flex-col gap-6 hover:bg-white/10 transition-colors">
                        <Zap className="size-10 text-[#34495E]" />
                        <div className="text-5xl font-black tracking-tighter">20ms</div>
                        <div className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Global Response Node</div>
                    </div>
                    <div className="p-10 bg-white/5 rounded-[40px] border border-white/5 flex flex-col gap-6 hover:bg-white/10 transition-colors">
                        <Globe className="size-10 text-[#D4A373]" />
                        <div className="text-5xl font-black tracking-tighter">12+</div>
                        <div className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Active Trade Zones</div>
                    </div>
                </div>
            </div>
            <div className="absolute top-0 right-0 size-[600px] bg-[#34495E]/10 rounded-full blur-[140px]" />
        </div>
      </div>
    </div>
  );
}

