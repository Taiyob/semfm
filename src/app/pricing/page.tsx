'use client';

import { useState } from 'react';
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
  Building2
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
    <div className="min-h-screen pt-32 pb-24 font-outfit hero-gradient">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <div className="section-tag">
                <ShieldCheck className="size-4" />
                Institutional Pricing
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight">Data Access <span className="gradient-text">Plans for All.</span></h1>
            <p className="text-xl text-slate-500 font-bold leading-relaxed">
                Whether you're a single investor or a multinational agency, InvesTerra provides the high-fidelity data you need to win.
            </p>

            {/* Toggle Billing */}
            <div className="flex items-center justify-center gap-6 pt-6">
                <span className={`text-sm font-black ${billing === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
                <button 
                  onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
                  className="w-14 h-8 bg-slate-900 rounded-full p-1 relative transition-colors"
                >
                    <div className={`size-6 bg-blue-500 rounded-full transition-all duration-300 ${billing === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
                <div className="flex items-center gap-2">
                    <span className={`text-sm font-black ${billing === 'yearly' ? 'text-slate-900' : 'text-slate-400'}`}>Yearly</span>
                    <span className="text-[10px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-md uppercase tracking-tighter">Save 20%</span>
                </div>
            </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {plans.map((plan) => (
                <div 
                    key={plan.id}
                    className={`relative p-10 lg:p-14 rounded-[48px] bg-white border-2 transition-all flex flex-col ${
                        plan.popular ? 'border-blue-600 shadow-2xl shadow-blue-500/10 scale-105 z-10' : 'border-slate-100'
                    }`}
                >
                    {plan.popular && (
                        <div className="absolute top-0 right-10 -translate-y-1/2 px-6 py-2 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg">
                            Most Selected
                        </div>
                    )}
                    
                    <div className="mb-10">
                        <div className="size-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8">
                            <plan.icon className="size-8 text-blue-600" />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">{plan.name}</h3>
                        <p className="text-slate-500 text-base font-bold leading-relaxed">{plan.description}</p>
                    </div>

                    <div className="mb-10">
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl font-black text-slate-900 tracking-tighter">{plan.price}</span>
                            <span className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">{plan.period}</span>
                        </div>
                    </div>

                    <div className="space-y-4 mb-12 flex-grow">
                        {plan.features.map(feature => (
                            <div key={feature} className="flex gap-3">
                                <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
                                <span className="text-sm font-bold text-slate-600">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <button className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 group ${
                        plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-600/20' : 'bg-slate-900 text-white hover:bg-black'
                    }`}>
                        {plan.cta} <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            ))}
        </div>

        {/* Global Access Proof */}
        <div className="mt-32 p-10 md:p-20 bg-slate-950 rounded-[64px] text-white relative overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
                <div className="space-y-8">
                    <h2 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">Expand Your Reach with <span className="text-blue-500">Global API.</span></h2>
                    <p className="text-slate-500 text-xl font-bold italic">"Integrating InvesTerra data into my agency portal doubled my lead conversion for non-EU investors."</p>
                    <div className="flex items-center gap-4">
                        <div className="size-14 rounded-full bg-slate-800" />
                        <div>
                            <div className="font-bold">Sofia Mendes</div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">CEO, Mendes Properties</div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="p-8 bg-white/5 rounded-3xl border border-white/10 flex flex-col gap-4">
                        <Zap className="size-8 text-blue-500" />
                        <div className="text-4xl font-black">20ms</div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global API Response</div>
                    </div>
                    <div className="p-8 bg-white/5 rounded-3xl border border-white/10 flex flex-col gap-4">
                        <Globe className="size-8 text-blue-500" />
                        <div className="text-4xl font-black">12+</div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">European Markets</div>
                    </div>
                </div>
            </div>
            <div className="absolute top-0 right-0 size-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
        </div>
      </div>
    </div>
  );
}
