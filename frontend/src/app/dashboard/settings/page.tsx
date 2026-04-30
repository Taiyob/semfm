'use client';

import { motion } from 'motion/react';
import { 
  Settings, 
  Bell, 
  Shield, 
  CreditCard, 
  Globe, 
  ChevronRight,
  Eye,
  Smartphone
} from 'lucide-react';

const sections = [
  { 
    title: 'Notifications', 
    icon: Bell, 
    color: 'text-blue-500', 
    bg: 'bg-blue-50',
    items: ['Price Alert Emails', 'New Insight Notifications', 'Market Report Weekly']
  },
  { 
    title: 'Security', 
    icon: Shield, 
    color: 'text-emerald-500', 
    bg: 'bg-emerald-50',
    items: ['Two-Factor Authentication', 'Change Password', 'Login History']
  },
  { 
    title: 'Billing', 
    icon: CreditCard, 
    color: 'text-purple-500', 
    bg: 'bg-purple-50',
    items: ['Current Plan: Investor Free', 'Payment Methods', 'Invoices']
  },
];

export default function SettingsPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="size-16 bg-[#34495E] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#34495E]/20">
              <Settings className="size-8" />
           </div>
           <div>
              <h2 className="text-xl font-black text-[#2C3E50]">Settings</h2>
              <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">Manage your preferences</p>
           </div>
        </div>
      </header>

      <div className="space-y-6">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[32px] shadow-sm border border-stone-100 overflow-hidden"
          >
            <div className="p-8 border-b border-stone-50 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className={`size-10 ${section.bg} ${section.color} rounded-xl flex items-center justify-center`}>
                     <section.icon className="size-5" />
                  </div>
                  <h3 className="font-black text-[#2C3E50]">{section.title}</h3>
               </div>
               <button className="text-xs font-black text-[#34495E] uppercase tracking-widest">Manage All</button>
            </div>
            <div className="divide-y divide-stone-50">
               {section.items.map((item, j) => (
                 <div key={j} className="p-6 flex items-center justify-between hover:bg-stone-50 transition-colors cursor-pointer group">
                    <span className="text-sm font-bold text-stone-600">{item}</span>
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-6 bg-stone-100 rounded-full relative transition-colors group-hover:bg-emerald-100">
                          <div className="absolute left-1 top-1 size-4 bg-white rounded-full shadow-sm group-hover:translate-x-4 transition-transform" />
                       </div>
                       <ChevronRight className="size-4 text-stone-300 group-hover:text-[#34495E] transition-all" />
                    </div>
                 </div>
               ))}
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-rose-50 p-8 rounded-[32px] border border-rose-100 flex items-center justify-between"
        >
           <div>
              <h4 className="text-sm font-black text-rose-700">Danger Zone</h4>
              <p className="text-xs font-bold text-rose-500 mt-1">Permanently delete your account and all associated data.</p>
           </div>
           <button className="px-6 py-3 bg-rose-500 text-white font-black rounded-xl text-xs hover:bg-rose-600 transition-all shadow-lg shadow-rose-200">
              Delete Account
           </button>
        </motion.div>
      </div>
    </div>
  );
}
