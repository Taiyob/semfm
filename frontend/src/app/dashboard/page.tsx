'use client';

import { motion } from 'motion/react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  Building2, 
  Wallet, 
  Activity,
  Users,
  Eye,
  MessageSquare
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';

const investorStats = [
  { name: 'Portfolio Value', value: '€425,000', change: '+12.5%', icon: Wallet, color: 'bg-blue-500' },
  { name: 'Active Properties', value: '12', change: '+2', icon: Building2, color: 'bg-purple-500' },
  { name: 'Avg. Yield', value: '6.4%', change: '+0.4%', icon: TrendingUp, color: 'bg-emerald-500' },
];

const agentStats = [
  { name: 'Total Listings', value: '24', change: '+3', icon: Building2, color: 'bg-blue-500' },
  { name: 'Total Leads', value: '156', change: '+12%', icon: Users, color: 'bg-purple-500' },
  { name: 'Active Inquiries', value: '18', change: '+4', icon: MessageSquare, color: 'bg-emerald-500' },
];

export default function DashboardHome() {
  const { user } = useSelector((state: RootState) => state.auth);
  const isAgent = user?.role?.name?.toLowerCase() === 'agent' || user?.role?.name?.toLowerCase() === 'admin';
  const stats = isAgent ? agentStats : investorStats;
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[32px] shadow-sm border border-stone-100 group hover:shadow-xl hover:shadow-stone-200/50 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`size-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-opacity-20`}>
                <stat.icon className="size-6" />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 font-black text-xs bg-emerald-50 px-2 py-1 rounded-lg">
                <ArrowUpRight className="size-3" />
                {stat.change}
              </div>
            </div>
            <p className="text-stone-400 font-bold text-xs uppercase tracking-wider">{stat.name}</p>
            <h3 className="text-2xl font-black text-[#2C3E50] mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Main Graph Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-8 rounded-[40px] shadow-sm border border-stone-100"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-black text-[#2C3E50]">Investment Growth</h3>
            <p className="text-stone-400 font-bold text-xs">Portfolio performance over the last 12 months</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-stone-50 text-stone-600 font-bold rounded-xl text-xs hover:bg-stone-100 transition-all">Month</button>
            <button className="px-4 py-2 bg-[#34495E] text-white font-bold rounded-xl text-xs shadow-lg shadow-[#34495E]/20 transition-all">Year</button>
          </div>
        </div>

        {/* Mock Graph with Framer Motion */}
        <div className="h-64 w-full relative flex items-end justify-between gap-2 px-4">
          {[40, 70, 45, 90, 65, 80, 50, 95, 75, 100, 85, 110].map((height, i) => (
            <div key={i} className="flex-1 group relative">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: 0.5 + i * 0.05, duration: 1, ease: "circOut" }}
                className={`w-full rounded-t-xl transition-all duration-300 ${
                  i === 11 ? 'bg-[#34495E]' : 'bg-[#34495E]/10 group-hover:bg-[#34495E]/30'
                }`}
              />
              {/* Tooltip on hover */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#2C3E50] text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                €{(height * 4.25).toFixed(1)}k
              </div>
            </div>
          ))}
          {/* Grid lines */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-stone-100 -z-10" />
          <div className="absolute inset-x-0 top-1/2 h-px bg-stone-50 -z-10" />
        </div>
        
        <div className="flex justify-between mt-4 px-4 text-[10px] font-black text-stone-300 uppercase tracking-widest">
           <span>Jan</span>
           <span>Jun</span>
           <span>Dec</span>
        </div>
      </motion.div>

      {/* Secondary Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white p-8 rounded-[40px] shadow-sm border border-stone-100">
            <div className="flex items-center gap-3 mb-6">
               <div className="size-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Activity className="size-5" />
               </div>
               <h3 className="text-lg font-black text-[#2C3E50]">Recent Alerts</h3>
            </div>
            <div className="space-y-4">
               {[
                 { title: 'New insight in Spain', time: '2 hours ago', type: 'Insight' },
                 { title: 'Price drop: Villa Mar', time: '5 hours ago', type: 'Property' },
                 { title: 'Calculation saved', time: 'Yesterday', type: 'Calculator' },
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-stone-50 transition-all cursor-pointer border border-transparent hover:border-stone-100">
                    <div>
                       <p className="text-sm font-bold text-stone-700">{item.title}</p>
                       <p className="text-[10px] font-black text-stone-400 uppercase">{item.time}</p>
                    </div>
                    <span className="text-[10px] font-black px-2 py-1 bg-stone-100 text-stone-500 rounded-lg">{item.type}</span>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
