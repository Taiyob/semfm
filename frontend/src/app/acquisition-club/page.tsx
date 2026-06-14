"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Lock, Globe, Users, Target, Building2, Briefcase, ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AcquisitionClubPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        country: '',
        reason: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030';
            const response = await fetch(`${apiUrl}/api/v1/club/apply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                setStatus('success');
                setTimeout(() => {
                    setIsModalOpen(false);
                    setStatus('idle');
                    setFormData({ name: '', email: '', country: '', reason: '' });
                }, 3000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-24 font-montserrat hero-gradient relative">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto mb-24 space-y-8">
                    <h1 className="text-5xl md:text-7xl font-black text-[#2C3E50] leading-[0.9] tracking-tight uppercase">
                        Move Beyond <span className="text-[#D4A373]">Analysis.</span> <br />Start <span className="text-[#D4A373]">Acquiring.</span>
                    </h1>
                    <p className="text-xl text-stone-500 font-bold leading-relaxed italic max-w-2xl mx-auto">
                        The platform subscriptions give you the tools to analyse and evaluate real estate investments. 
                        The Acquisition Club is where investors take action.
                    </p>
                    <p className="text-sm font-bold text-[#2C3E50] uppercase tracking-widest max-w-3xl mx-auto bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-stone-100">
                        This is a private, exclusive community for serious investors who want access to opportunities, relationships, and real-world deal flow beyond software.
                    </p>
                    
                    <div className="pt-8 flex flex-col items-center gap-4">
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-[#2C3E50] text-white px-12 py-5 rounded-[24px] font-black uppercase tracking-widest text-sm hover:bg-[#D4A373] transition-all shadow-xl shadow-[#2C3E50]/20 flex items-center gap-3"
                        >
                            Request Access <ArrowRight className="size-5" />
                        </button>
                        <p className="text-[#D4A373] font-bold text-[10px] uppercase tracking-[0.2em]">
                            Limited spots. Priority access. Serious investors only.
                        </p>
                    </div>
                </div>

                {/* Why Join Section */}
                <div className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-[#2C3E50] uppercase tracking-tighter">Why Join?</h2>
                        <p className="text-stone-400 font-bold text-sm uppercase tracking-widest mt-2">
                            Subscriptions help you analyse deals. The Acquisition Club helps you execute them.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Event */}
                        <div className="bg-white p-10 rounded-[48px] border border-stone-100 shadow-xl shadow-stone-200/20 hover:border-[#D4A373]/30 transition-all">
                            <div className="size-16 bg-stone-50 rounded-2xl flex items-center justify-center mb-8">
                                <Globe className="size-8 text-[#D4A373]" />
                            </div>
                            <h3 className="text-2xl font-black text-[#2C3E50] uppercase tracking-tighter mb-4">Exclusive Investor Events</h3>
                            <p className="text-stone-400 font-bold text-xs italic mb-6">Private investor events hosted internationally.</p>
                            <ul className="space-y-3">
                                {[
                                    'Meet active investors and operators',
                                    'Discover new markets',
                                    'Learn from experienced professionals',
                                    'Build long-term investing relationships'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="size-1.5 bg-[#D4A373] rounded-full mt-1.5" />
                                        <span className="text-sm font-bold text-stone-600">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Buying Groups */}
                        <div className="bg-white p-10 rounded-[48px] border border-stone-100 shadow-xl shadow-stone-200/20 hover:border-[#D4A373]/30 transition-all">
                            <div className="size-16 bg-stone-50 rounded-2xl flex items-center justify-center mb-8">
                                <Users className="size-8 text-[#D4A373]" />
                            </div>
                            <h3 className="text-2xl font-black text-[#2C3E50] uppercase tracking-tighter mb-4">Buying Groups</h3>
                            <p className="text-stone-400 font-bold text-xs italic mb-6">Invest together with other members on real opportunities.</p>
                            <ul className="space-y-3">
                                {[
                                    'Access larger deals',
                                    'Reduce individual capital requirements',
                                    'Share due diligence',
                                    'Diversify risk',
                                    'Learn through live acquisitions'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="size-1.5 bg-[#D4A373] rounded-full mt-1.5" />
                                        <span className="text-sm font-bold text-stone-600">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Investor Network */}
                        <div className="bg-white p-10 rounded-[48px] border border-stone-100 shadow-xl shadow-stone-200/20 hover:border-[#D4A373]/30 transition-all">
                            <div className="size-16 bg-stone-50 rounded-2xl flex items-center justify-center mb-8">
                                <Target className="size-8 text-[#D4A373]" />
                            </div>
                            <h3 className="text-2xl font-black text-[#2C3E50] uppercase tracking-tighter mb-4">Investor Network</h3>
                            <p className="text-stone-400 font-bold text-xs italic mb-6">Join a curated network of serious real estate investors.</p>
                            <ul className="space-y-3">
                                {[
                                    'Share deals and strategies',
                                    'Find investment partners',
                                    'Discuss opportunities',
                                    'Learn from peers',
                                    'Build international connections'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="size-1.5 bg-[#D4A373] rounded-full mt-1.5" />
                                        <span className="text-sm font-bold text-stone-600">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Opportunity Access */}
                        <div className="bg-white p-10 rounded-[48px] border border-stone-100 shadow-xl shadow-stone-200/20 hover:border-[#D4A373]/30 transition-all">
                            <div className="size-16 bg-stone-50 rounded-2xl flex items-center justify-center mb-8">
                                <Briefcase className="size-8 text-[#D4A373]" />
                            </div>
                            <h3 className="text-2xl font-black text-[#2C3E50] uppercase tracking-tighter mb-4">Opportunity Access</h3>
                            <p className="text-stone-400 font-bold text-xs italic mb-6">Access selected investment opportunities through the network.</p>
                            <ul className="space-y-3">
                                {[
                                    'Off-market deals',
                                    'Group acquisitions',
                                    'International opportunities',
                                    'Club-sourced deals'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="size-1.5 bg-[#D4A373] rounded-full mt-1.5" />
                                        <span className="text-sm font-bold text-stone-600">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="bg-[#2C3E50] rounded-[48px] p-16 text-center relative overflow-hidden mb-24">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#D4A373]/10 to-transparent"></div>
                    <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">
                            Position Yourself for Success
                        </h2>
                        <p className="text-stone-300 font-bold text-sm italic">
                            This is not just a platform feature. It is an investor community for people who want to move from analysing deals to actively participating in them.
                        </p>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-[#D4A373] text-[#2C3E50] px-12 py-5 rounded-[24px] font-black uppercase tracking-widest text-sm hover:bg-white transition-all shadow-xl shadow-[#D4A373]/20"
                        >
                            Apply for Access
                        </button>
                    </div>
                </div>

                <div className="text-center opacity-30 grayscale flex justify-center gap-8">
                    <ShieldCheck className="size-8" />
                    <Lock className="size-8" />
                    <Globe className="size-8" />
                </div>
            </div>

            {/* Application Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-[40px] p-8 md:p-12 max-w-md w-full relative shadow-2xl"
                        >
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 text-stone-400 hover:text-[#2C3E50] transition-colors"
                            >
                                <X className="size-6" />
                            </button>

                            <div className="mb-8 text-center">
                                <h3 className="text-2xl font-black text-[#2C3E50] uppercase tracking-tighter">Request Access</h3>
                                <p className="text-[#D4A373] font-bold text-[10px] uppercase tracking-widest mt-2">The Acquisition Club</p>
                            </div>

                            {status === 'success' ? (
                                <div className="text-center py-8">
                                    <div className="size-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ShieldCheck className="size-8" />
                                    </div>
                                    <h4 className="text-xl font-black text-[#2C3E50] mb-2">Application Received</h4>
                                    <p className="text-stone-500 font-bold text-sm">We will review your application and get back to you shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 pl-4">Full Name</label>
                                        <input 
                                            required
                                            type="text" 
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full bg-stone-50 border border-stone-200 rounded-[20px] px-6 py-4 text-sm font-bold text-[#2C3E50] focus:outline-none focus:border-[#D4A373]"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 pl-4">Email Address</label>
                                        <input 
                                            required
                                            type="email" 
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full bg-stone-50 border border-stone-200 rounded-[20px] px-6 py-4 text-sm font-bold text-[#2C3E50] focus:outline-none focus:border-[#D4A373]"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 pl-4">Country</label>
                                        <input 
                                            required
                                            type="text" 
                                            value={formData.country}
                                            onChange={(e) => setFormData({...formData, country: e.target.value})}
                                            className="w-full bg-stone-50 border border-stone-200 rounded-[20px] px-6 py-4 text-sm font-bold text-[#2C3E50] focus:outline-none focus:border-[#D4A373]"
                                            placeholder="United Kingdom"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 pl-4">Why should you be in this club?</label>
                                        <textarea 
                                            required
                                            rows={3}
                                            value={formData.reason}
                                            onChange={(e) => setFormData({...formData, reason: e.target.value})}
                                            className="w-full bg-stone-50 border border-stone-200 rounded-[20px] px-6 py-4 text-sm font-bold text-[#2C3E50] focus:outline-none focus:border-[#D4A373] resize-none"
                                            placeholder="Tell us about your investing experience and goals..."
                                        />
                                    </div>

                                    {status === 'error' && (
                                        <p className="text-red-500 text-xs font-bold text-center">Something went wrong. Please try again.</p>
                                    )}

                                    <button 
                                        type="submit"
                                        disabled={status === 'submitting'}
                                        className="w-full bg-[#2C3E50] text-white py-5 rounded-[20px] font-black uppercase tracking-widest text-sm hover:bg-[#D4A373] transition-all disabled:opacity-50 mt-4"
                                    >
                                        {status === 'submitting' ? 'Submitting...' : 'Apply for Access'}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
