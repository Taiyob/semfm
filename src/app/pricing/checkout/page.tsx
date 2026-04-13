'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  Zap,
  Building2,
  UserCircle2,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'investor';
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 hero-gradient font-montserrat">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-16 rounded-[64px] shadow-2xl text-center max-w-xl border-2 border-emerald-100">
                <div className="size-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl shadow-emerald-500/20">
                    <CheckCircle2 className="size-10" />
                </div>
                <h1 className="text-4xl font-black text-slate-900 mb-6">Payment Successful</h1>
                <p className="text-slate-500 font-bold text-lg mb-10 leading-relaxed">Welcome to the Pro Tier. Your institutional data access is now active for all European markets.</p>
                <Link href="/" className="btn-primary inline-flex items-center gap-3">
                    Go to Dashboard <ArrowRight className="size-5" />
                </Link>
            </motion.div>
        </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 font-montserrat hero-gradient">
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-12 gap-16">
        
        {/* Left: Summary */}
        <div className="lg:col-span-5 space-y-12">
            <Link href="/pricing" className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-[#34495E] transition-colors">← Back to Plans</Link>
            <div className="space-y-6">
                <div className="section-tag w-fit">Secure Checkout</div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Complete Your <br /><span className="gradient-text">Pro Activation.</span></h1>
            </div>

            <div className="bg-slate-900 p-10 rounded-[48px] text-white space-y-10 relative overflow-hidden">
                <div className="flex items-center gap-4 relative z-10">
                    <div className="size-14 bg-white/10 rounded-2xl flex items-center justify-center">
                        {plan === 'agent' ? <Building2 className="size-7 text-[#34495E]" /> : <UserCircle2 className="size-7 text-[#34495E]" />}
                    </div>
                    <div>
                        <div className="text-sm font-black uppercase tracking-widest text-slate-400">Selected Plan</div>
                        <div className="text-2xl font-black">{plan === 'agent' ? 'Agency Pro' : 'Investor Pro'}</div>
                    </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/10 relative z-10">
                    <div className="flex justify-between text-sm font-bold text-slate-400">
                        <span>Base Subscription</span>
                        <span>{plan === 'agent' ? '€199' : '€49'}.00</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-slate-400">
                        <span>Platform Tax (6%)</span>
                        <span>{plan === 'agent' ? '€11.94' : '€2.94'}</span>
                    </div>
                    <div className="pt-4 flex justify-between items-end border-t border-white/10">
                        <span className="text-xl font-black">Total Due</span>
                        <div className="text-4xl font-black text-[#34495E]">€{plan === 'agent' ? '210.94' : '51.94'}</div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 size-64 bg-[#34495E]/10 rounded-full blur-[80px]" />
            </div>

            <div className="space-y-6 px-4">
                {[
                    { label: 'Instant Data Activation', icon: Zap },
                    { label: 'Institutional Grade Encryption', icon: Shield },
                    { label: 'Cancel Subscription Anytime', icon: Clock }
                ].map(item => (
                    <div key={item.label} className="flex gap-4 items-center">
                        <item.icon className="size-5 text-[#34495E]" />
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Right: Payment Method */}
        <div className="lg:col-span-7">
            <div className="bg-white p-10 md:p-14 rounded-[56px] shadow-2xl shadow-slate-200/50 border border-slate-100 space-y-12">
                <div className="space-y-2">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Payment Details</h3>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Powered by Stripe Global Infrastructure</p>
                </div>

                <div className="space-y-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Cardholder Name</label>
                        <input type="text" placeholder="Full name as on card" className="w-full bg-slate-50 rounded-2xl py-4.5 px-6 font-bold outline-none border-2 border-transparent focus:border-[#34495E] focus:bg-white transition-all" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Card Details</label>
                        <div className="relative">
                            <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                            <input type="text" placeholder="4242 4242 4242 4242" className="w-full bg-slate-50 rounded-2xl py-4.5 pl-14 pr-6 font-bold outline-none border-2 border-transparent focus:border-[#34495E] focus:bg-white transition-all tracking-[0.2em]" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Expiry Date</label>
                            <input type="text" placeholder="MM / YY" className="w-full bg-slate-50 rounded-2xl py-4.5 px-6 font-bold outline-none border-2 border-transparent focus:border-[#34495E] focus:bg-white transition-all" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">CVV</label>
                            <input type="password" placeholder="•••" className="w-full bg-slate-50 rounded-2xl py-4.5 px-6 font-bold outline-none border-2 border-transparent focus:border-[#34495E] focus:bg-white transition-all" />
                        </div>
                    </div>
                </div>

                <button 
                  onClick={handlePay}
                  disabled={loading}
                  className="w-full py-5 bg-[#34495E] text-white font-black rounded-2xl hover:bg-[#2C3E50] transition-all shadow-xl shadow-[#34495E]/20 uppercase tracking-widest text-xs flex items-center justify-center gap-3"
                >
                    {loading ? "Processing Encryption..." : `Verify & Pay €${plan === 'agent' ? '210.94' : '51.94'}`}
                    {!loading && <ShieldCheck className="size-5" />}
                </button>

                <div className="flex items-center justify-center gap-4 py-8 border-t border-slate-50">
                    <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">PCI Level 1 Certified</div>
                    <div className="size-1.5 bg-slate-200 rounded-full" />
                    <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">GDPR Compliant</div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-montserrat font-black text-[#34495E] uppercase tracking-widest">Securing Session...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
