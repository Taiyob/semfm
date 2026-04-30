'use client';

import { useGetMeQuery } from '@/lib/store/features/auth/authApi';
import { 
  UserCircle2, 
  Mail, 
  ShieldCheck, 
  Lock,
  User,
  Globe,
  Save,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const { data, isLoading, error } = useGetMeQuery();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    displayName: '',
    role: ''
  });

  useEffect(() => {
    if (data?.data?.user) {
      const u = data.data.user;
      setFormData({
        firstName: u.firstName || '',
        lastName: u.lastName || '',
        email: u.email || '',
        displayName: u.displayName || '',
        role: u.role?.name || 'Investor'
      });
    }
  }, [data]);
  
  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin size-10 text-[#34495E]" />
      </div>
    );
  }

  if (error || !data?.data?.user) {
    return (
      <div className="bg-white p-12 rounded-[40px] shadow-sm text-center border border-stone-100">
        <h2 className="text-2xl font-black text-[#2C3E50] mb-2">Profile Not Found</h2>
        <p className="text-stone-500 font-bold text-sm">Unable to load profile data.</p>
      </div>
    );
  }

  const user = data.data.user;

  return (
    <div className="max-w-4xl space-y-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="size-16 bg-[#34495E] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#34495E]/20">
              <UserCircle2 className="size-8" />
           </div>
           <div>
              <h2 className="text-xl font-black text-[#2C3E50]">Account Settings</h2>
              <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">Personal Information</p>
           </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black border border-emerald-100">
          <ShieldCheck className="size-4" />
          Verified Account
        </div>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-[40px] shadow-sm border border-stone-100"
      >
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* First Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px] ml-1">First Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-stone-400 group-focus-within:text-[#34495E] transition-colors" />
                <input 
                  type="text" 
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-stone-700 focus:bg-white focus:border-[#34495E] focus:ring-4 focus:ring-[#34495E]/5 outline-none transition-all"
                  placeholder="Enter first name"
                />
              </div>
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px] ml-1">Last Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-stone-400 group-focus-within:text-[#34495E] transition-colors" />
                <input 
                  type="text" 
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-stone-700 focus:bg-white focus:border-[#34495E] focus:ring-4 focus:ring-[#34495E]/5 outline-none transition-all"
                  placeholder="Enter last name"
                />
              </div>
            </div>

            {/* Email (Disabled for safety) */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px] ml-1">Email Address</label>
              <div className="relative group opacity-60">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
                <input 
                  type="email" 
                  value={formData.email}
                  disabled
                  className="w-full pl-12 pr-4 py-4 bg-stone-100 border border-stone-200 rounded-2xl text-sm font-bold text-stone-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Account Role */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px] ml-1">Account Role</label>
              <div className="relative group opacity-60">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
                <input 
                  type="text" 
                  value={formData.role}
                  disabled
                  className="w-full pl-12 pr-4 py-4 bg-stone-100 border border-stone-200 rounded-2xl text-sm font-bold text-stone-500 cursor-not-allowed capitalize"
                />
              </div>
            </div>

            {/* Region */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px] ml-1">Primary Region</label>
              <div className="relative group">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-stone-400 group-focus-within:text-[#34495E] transition-colors" />
                <select className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-stone-700 focus:bg-white focus:border-[#34495E] outline-none appearance-none cursor-pointer">
                  <option>Global / European Markets</option>
                  <option>Spain (ES)</option>
                  <option>Portugal (PT)</option>
                  <option>Greece (GR)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="h-px bg-stone-100 my-10" />

          <div className="flex items-center justify-between gap-4">
             <div className="text-stone-400 text-xs font-bold max-w-xs">
                Your email address is used for login and cannot be changed here. Contact support for email updates.
             </div>
             <button 
               type="submit"
               className="flex items-center gap-3 px-10 py-5 bg-[#34495E] text-white font-black rounded-[24px] text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#34495E]/20"
             >
                <Save className="size-5" />
                Save Changes
             </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
