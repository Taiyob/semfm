"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const success = searchParams.get('success');

    useEffect(() => {
        if (success !== 'true') {
            router.push('/pricing');
        }
    }, [success, router]);

    return (
        <div className="min-h-screen flex items-center justify-center hero-gradient font-montserrat">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white p-12 rounded-[48px] shadow-2xl border border-stone-100 text-center space-y-8"
            >
                <div className="flex justify-center">
                    <div className="bg-emerald-50 p-6 rounded-full">
                        <CheckCircle2 className="size-16 text-emerald-500" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-black text-[#2C3E50] tracking-tighter uppercase">Payment Successful</h1>
                    <p className="text-stone-400 font-bold text-sm leading-relaxed italic">
                        “Your journey into the elite intelligence layer has begun. Your account has been upgraded.”
                    </p>
                </div>

                <div className="pt-8 space-y-4">
                    <Link 
                        href="/dashboard"
                        className="w-full py-5 bg-[#2C3E50] text-white rounded-[20px] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#D4A373] transition-all shadow-xl shadow-[#2C3E50]/10"
                    >
                        Go to Dashboard <LayoutDashboard className="size-4" />
                    </Link>
                    
                    <Link 
                        href="/"
                        className="w-full py-5 bg-stone-50 text-[#2C3E50] rounded-[20px] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-stone-100 transition-all"
                    >
                        Return Home <ArrowRight className="size-4" />
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
