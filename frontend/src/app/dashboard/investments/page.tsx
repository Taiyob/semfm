'use client';

import { motion } from 'motion/react';
import { 
  Briefcase, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreHorizontal,
  Calendar,
  PieChart
} from 'lucide-react';

const investments = [
  { id: 1, name: 'Valencia Residential Apt', amount: '€180,000', profit: '+€12,400', status: 'Growing', return: '6.8%' },
  { id: 2, name: 'Porto Luxury Studio', amount: '€95,000', profit: '+€3,200', status: 'Stable', return: '5.2%' },
  { id: 3, name: 'Malaga Beach Villa', amount: '€450,000', profit: '-€1,500', status: 'Market Correction', return: '-0.3%' },
];

export default function InvestmentsPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#2C3E50]">Investment Portfolio</h2>
          <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">Active Assets Tracking</p>
        </div>
        <button className="px-6 py-3 bg-[#34495E] text-white font-black rounded-2xl text-xs shadow-lg shadow-[#34495E]/20 hover:scale-[1.02] transition-all">
          + Add Investment
        </button>
      </header>

      {/* Portfolio Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-stone-100">
            <div className="flex items-center gap-3 mb-8">
               <div className="size-10 bg-[#34495E]/5 rounded-xl flex items-center justify-center text-[#34495E]">
                  <PieChart className="size-5" />
               </div>
               <h3 className="text-lg font-black text-[#2C3E50]">Portfolio Distribution</h3>
            </div>
            <div className="h-12 w-full bg-stone-50 rounded-2xl overflow-hidden flex">
               <div className="h-full bg-[#34495E] w-[60%] border-r border-white/10" />
               <div className="h-full bg-[#34495E]/40 w-[25%] border-r border-white/10" />
               <div className="h-full bg-stone-200 w-[15%]" />
            </div>
            <div className="flex gap-6 mt-6">
               <div className="flex items-center gap-2">
                  <div className="size-2 bg-[#34495E] rounded-full" />
                  <span className="text-[10px] font-black text-stone-500 uppercase">Residential (60%)</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="size-2 bg-[#34495E]/40 rounded-full" />
                  <span className="text-[10px] font-black text-stone-500 uppercase">Luxury (25%)</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="size-2 bg-stone-200 rounded-full" />
                  <span className="text-[10px] font-black text-stone-500 uppercase">Other (15%)</span>
               </div>
            </div>
         </div>

         <div className="bg-[#34495E] p-8 rounded-[40px] shadow-xl text-white">
            <div className="flex items-center gap-3 mb-6">
               <div className="size-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="size-5" />
               </div>
               <h3 className="text-lg font-black">Performance</h3>
            </div>
            <p className="text-white/60 font-bold text-xs uppercase tracking-widest">Total Unrealized Profit</p>
            <h4 className="text-4xl font-black mt-2">€14,100</h4>
            <div className="mt-6 flex items-center gap-2 text-emerald-400 font-black text-sm">
               <ArrowUpRight className="size-4" />
               +3.4% this quarter
            </div>
         </div>
      </div>

      {/* Asset Table */}
      <div className="bg-white rounded-[40px] shadow-sm border border-stone-100 overflow-hidden">
        <div className="p-8 border-b border-stone-50">
           <h3 className="text-lg font-black text-[#2C3E50]">Active Assets</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50/50">
                <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Asset Name</th>
                <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Growth</th>
                <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {investments.map((asset, i) => (
                <motion.tr 
                  key={asset.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="hover:bg-stone-50/50 transition-colors cursor-pointer group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="size-10 bg-stone-100 rounded-xl flex items-center justify-center text-[#34495E]">
                        <Briefcase className="size-5" />
                      </div>
                      <span className="text-sm font-black text-[#2C3E50]">{asset.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-stone-600">{asset.amount}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`flex items-center gap-1 text-sm font-black ${asset.return.startsWith('-') ? 'text-rose-500' : 'text-emerald-500'}`}>
                       {asset.return.startsWith('-') ? <ArrowDownRight className="size-4" /> : <ArrowUpRight className="size-4" />}
                       {asset.profit} ({asset.return})
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      asset.status === 'Growing' ? 'bg-emerald-50 text-emerald-600' : 
                      asset.status === 'Stable' ? 'bg-blue-50 text-blue-600' : 
                      'bg-rose-50 text-rose-500'
                    }`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-stone-300 hover:text-[#34495E] transition-colors">
                       <MoreHorizontal className="size-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
