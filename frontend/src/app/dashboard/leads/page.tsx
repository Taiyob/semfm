'use client';

import { motion } from 'motion/react';
import { 
  Users, 
  MessageSquare, 
  Clock, 
  CheckCircle2,
  Phone,
  Mail,
  ArrowRight
} from 'lucide-react';

const leads = [
  { id: 1, name: 'Robert Fox', property: 'Modern Apartment in Madrid', date: '2 hours ago', status: 'New', email: 'robert@example.com' },
  { id: 2, name: 'Jane Cooper', property: 'Valencia Residential Apt', date: '5 hours ago', status: 'Contacted', email: 'jane@example.com' },
  { id: 3, name: 'Cody Fisher', property: 'Luxury Villa with Sea View', date: 'Yesterday', status: 'Closed', email: 'cody@example.com' },
];

export default function LeadsPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#2C3E50]">Buyer Leads & Inquiries</h2>
          <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">Active Conversations</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black">
          <CheckCircle2 className="size-4" />
          85% Response Rate
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {leads.map((lead, i) => (
          <motion.div
            key={lead.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[32px] shadow-sm border border-stone-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-xl hover:shadow-stone-200/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-6 w-full md:w-auto">
               <div className="size-16 bg-stone-50 rounded-2xl flex items-center justify-center text-[#34495E] font-black text-xl border border-stone-100">
                  {lead.name.charAt(0)}
               </div>
               <div>
                  <h3 className="text-lg font-black text-[#2C3E50]">{lead.name}</h3>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-1">Interested in: <span className="text-[#34495E]">{lead.property}</span></p>
               </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
               <div className="flex items-center gap-2 px-4 py-2 bg-stone-50 rounded-xl text-stone-500">
                  <Clock className="size-4" />
                  <span className="text-[10px] font-black uppercase">{lead.date}</span>
               </div>
               <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${
                  lead.status === 'New' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                  lead.status === 'Contacted' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                  'bg-emerald-50 text-emerald-600 border border-emerald-100'
               }`}>
                  {lead.status}
               </span>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-stone-50">
               <button className="flex-1 md:flex-none p-4 bg-stone-50 text-[#34495E] rounded-2xl hover:bg-[#34495E] hover:text-white transition-all">
                  <Phone className="size-5" />
               </button>
               <button className="flex-1 md:flex-none p-4 bg-stone-50 text-[#34495E] rounded-2xl hover:bg-[#34495E] hover:text-white transition-all">
                  <Mail className="size-5" />
               </button>
               <button className="flex-1 md:flex-none px-6 py-4 bg-[#34495E] text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-[1.02] transition-all">
                  Chat <ArrowRight className="size-4" />
               </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
