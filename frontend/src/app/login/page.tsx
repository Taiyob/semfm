'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Logo } from '@/components/logo';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { FaGithub, FaGoogle } from 'react-icons/fa6';
import { useLoginMutation } from '@/lib/store/features/auth/authApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const auth = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    if (auth.isAuthenticated) {
      router.replace('/');
    }
  }, [auth.isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setError('');
    setSuccess('');

    try {
      await login({ email, password }).unwrap();
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (err: any) {
      setError(err.data?.error?.message || err.message || 'Login failed');
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-6 hero-gradient font-montserrat">
      
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
            <h1 className="text-3xl font-black text-[#2C3E50] mb-2">Welcome back</h1>
            <p className="text-stone-400 font-bold text-xs">Access your global dashboard</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm font-bold rounded-2xl border border-red-100">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 text-sm font-bold rounded-2xl border border-emerald-100">
              {success}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 ml-1">Email address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full bg-stone-50 border-2 border-transparent rounded-2xl py-4.5 pl-14 pr-6 outline-none focus:ring-2 focus:ring-[#34495E] focus:bg-white transition-all font-bold text-stone-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-stone-400">Password</label>
                <a href="#" className="text-xs font-black text-[#34495E] hover:underline">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-stone-50 border-2 border-transparent rounded-2xl py-4.5 pl-14 pr-6 outline-none focus:ring-2 focus:ring-[#34495E] focus:bg-white transition-all font-bold text-stone-600"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-[#34495E] text-white font-black rounded-2xl hover:bg-[#2C3E50] disabled:bg-stone-300 disabled:cursor-not-allowed transition-all shadow-xl shadow-stone-900/20 flex items-center justify-center gap-3 group text-sm"
            >
                {isLoading ? 'Signing in...' : 'Sign in'} <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* 
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center"><span className="bg-white px-4 py-1 text-xs font-bold text-slate-400 rounded-full">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="py-4 rounded-2xl flex items-center justify-center gap-3 border-2 border-stone-50 hover:bg-stone-50 transition-all font-bold text-stone-600 text-xs">
                <FaGoogle className="size-5 text-[#34495E]" />
                Google
            </button>
            <button className="py-4 rounded-2xl flex items-center justify-center gap-3 border-2 border-stone-50 hover:bg-stone-50 transition-all font-bold text-stone-600 text-xs">
                <FaGithub className="size-5 text-[#2C3E50]" />
                GitHub
            </button>
          </div>
          */}

          <p className="mt-12 text-center text-xs font-bold text-slate-400 leading-relaxed">
            Don't have an account? <a href="/register" className="text-[#34495E] font-black hover:underline ml-1">Create one free</a>
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 py-3 bg-stone-100 rounded-2xl border border-stone-200">
             <ShieldCheck className="size-4 text-[#34495E]" />
             <span className="text-[10px] font-black text-[#34495E]">Verified encryption active</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
