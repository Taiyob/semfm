'use client';

import { motion } from 'motion/react';
import { Logo } from '@/components/logo';
import { Mail, Lock, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { FaGithub, FaGoogle } from 'react-icons/fa6';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 hero-gradient font-outfit">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white p-10 md:p-14 rounded-[48px] shadow-2xl shadow-slate-200/50 border border-slate-100">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-8">
              <Logo />
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">Welcome Back</h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Access your global investment dashboard</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                <input 
                  type="email" 
                  placeholder="name@company.com"
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4.5 pl-14 pr-6 outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-bold text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                <a href="#" className="text-xs font-black text-blue-600 hover:underline uppercase tracking-tight">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4.5 pl-14 pr-6 outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-bold text-slate-600"
                />
              </div>
            </div>

            <button className="w-full py-4.5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 group uppercase tracking-widest text-xs">
                Sign In <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center"><span className="bg-white px-4 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400 rounded-full">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="py-3.5 rounded-2xl flex items-center justify-center gap-3 border-2 border-slate-50 hover:bg-slate-50 transition-all font-black text-slate-600 text-xs uppercase tracking-tight">
                <FaGoogle className="size-5 text-blue-600" />
                Google
            </button>
            <button className="py-3.5 rounded-2xl flex items-center justify-center gap-3 border-2 border-slate-50 hover:bg-slate-50 transition-all font-black text-slate-600 text-xs uppercase tracking-tight">
                <FaGithub className="size-5 text-slate-900" />
                GitHub
            </button>
          </div>

          <p className="mt-12 text-center text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-tight">
            Don't have an account? <a href="/register" className="text-blue-600 font-black hover:underline ml-1">Create one free</a>
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 py-3 bg-blue-50 rounded-xl border border-blue-100">
             <ShieldCheck className="size-4 text-blue-600" />
             <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Institutional Encryption Active</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
