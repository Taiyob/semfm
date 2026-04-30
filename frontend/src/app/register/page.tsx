'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Logo } from '@/components/logo';
import { Mail, Lock, ArrowRight, User, ShieldCheck, TrendingUp, Building2, UserCircle2, CheckCircle2 } from 'lucide-react';
import { useRegisterMutation } from '@/lib/store/features/auth/authApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const auth = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [accountType, setAccountType] = useState<'investor' | 'agent'>('investor');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [register, { isLoading }] = useRegisterMutation();

  useEffect(() => {
    if (auth.isAuthenticated) {
      router.replace('/');
    }
  }, [auth.isAuthenticated, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
        setError('Please fill in all fields');
        return;
    }
    
    setError('');
    setSuccess('');

    try {
      const response = await register({ name, email, password, accountType }).unwrap();

      setSuccess(response.data?.message || 'Registration successful! Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err: any) {
      setError(err.data?.error?.message || err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 hero-gradient font-montserrat">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-5xl"
      >
        <div className="bg-white p-8 md:p-16 rounded-[64px] shadow-2xl shadow-slate-200/50 border border-slate-100 grid md:grid-cols-2 gap-20">
          
          {/* Left Column: Info */}
          <div className="space-y-12 hidden md:block border-r border-slate-100 pr-20">
            <Logo />
            <div className="space-y-10">
              <div className="flex gap-6">
                 <div className="size-14 rounded-[20px] bg-stone-50 flex items-center justify-center shrink-0 border-2 border-stone-100">
                    <TrendingUp className="size-7 text-[#34495E]" />
                 </div>
                 <div className="space-y-2">
                    <h4 className="font-extrabold text-[#2C3E50] tracking-tight">Strategic intelligence</h4>
                    <p className="text-stone-500 text-sm leading-relaxed font-bold">Access real-time yield analysis for Western Europe's top cities.</p>
                 </div>
              </div>
              <div className="flex gap-6">
                 <div className="size-14 rounded-[20px] bg-stone-50 flex items-center justify-center shrink-0 border-2 border-stone-100">
                    <ShieldCheck className="size-7 text-stone-400" />
                 </div>
                 <div className="space-y-2">
                    <h4 className="font-extrabold text-[#2C3E50] tracking-tight">Verified listings</h4>
                    <p className="text-stone-500 text-sm leading-relaxed font-bold">Every property is vetted for legal compliance and yield accuracy.</p>
                 </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-[32px] border-2 border-slate-100 mt-12 relative overflow-hidden">
                <p className="text-base font-black text-slate-400 italic mb-6 leading-relaxed relative z-10">"The most transparent data-driven platform I've used for my European portfolio."</p>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="size-10 rounded-full bg-slate-200" />
                    <div>
                        <div className="text-sm font-black text-[#2C3E50]">Elena Rossi</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Investor</div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 size-32 bg-blue-500/5 rounded-full blur-2xl" />
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="space-y-10">
            <div className="md:hidden flex justify-center mb-10">
                <Logo />
            </div>
            <div className="text-center md:text-left space-y-4">
                <div className="section-tag w-fit mx-auto md:mx-0">Join Hofman Horizon</div>
                <h1 className="text-4xl md:text-5xl font-black text-[#2C3E50] tracking-tight leading-tight">Create account</h1>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Select your membership role below</p>
            </div>

            {/* Account Type Toggle */}
            <div className="flex p-2 bg-slate-50 rounded-[24px] border-2 border-slate-100">
                <button 
                  onClick={() => setAccountType('investor')}
                  className={`flex-grow py-3.5 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest flex items-center justify-center gap-3 ${
                    accountType === 'investor' ? 'bg-[#34495E] text-white shadow-xl shadow-stone-900/20' : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                    <UserCircle2 className="size-4" />
                    Individual Investor
                </button>
                <button 
                  onClick={() => setAccountType('agent')}
                  className={`flex-grow py-3.5 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest flex items-center justify-center gap-3 ${
                    accountType === 'agent' ? 'bg-[#34495E] text-white shadow-xl shadow-stone-900/20' : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                    <Building2 className="size-4" />
                    Agent / Agency
                </button>
            </div>

            <form className="space-y-6" onSubmit={handleRegister}>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name / Entity</label>
                    <div className="relative">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                        <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={accountType === 'investor' ? "John Doe" : "Agency Name"}
                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4.5 pl-14 pr-6 focus:ring-2 focus:ring-[#34495E] focus:bg-white transition-all font-bold text-slate-600"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Work Email</label>
                    <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                        <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4.5 pl-14 pr-6 focus:ring-2 focus:ring-[#34495E] focus:bg-white transition-all font-bold text-slate-600"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Secret Password</label>
                    <div className="relative">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                        <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4.5 pl-14 pr-6 focus:ring-2 focus:ring-[#34495E] focus:bg-white transition-all font-bold text-slate-600"
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100 flex items-center gap-2">
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="p-3 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-xl border border-emerald-100 flex items-center gap-2">
                        {success}
                    </div>
                )}

                <div className="flex items-center gap-2 px-1">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">By joining you agree to our Investor Terms</span>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-5 bg-[#34495E] text-white font-black rounded-2xl hover:bg-[#34495E] transition-all shadow-xl shadow-stone-900/20 flex items-center justify-center gap-3 group mt-6 uppercase tracking-widest text-[10px] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Creating Account...' : `Create ${accountType} Account`} 
                    {!isLoading && <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />}
                </button>
            </form>

            <p className="text-center text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-tight">
                Already have an account? <a href="/login" className="text-[#34495E] font-black hover:underline ml-1">Log in here</a>
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
