'use client';

import { motion } from 'motion/react';
import { 
  Calculator, 
  Euro, 
  TrendingUp, 
  Info,
  Save,
  RotateCcw,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

export default function DashboardCalculator() {
  const [inputs, setInputs] = useState({
    price: 320000,
    rentalIncome: 1800,
    expenses: 400,
  });

  const yieldValue = (((inputs.rentalIncome * 12) - (inputs.expenses * 12)) / inputs.price * 100).toFixed(2);

  return (
    <div className="max-w-5xl space-y-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="size-16 bg-[#34495E] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#34495E]/20">
              <Calculator className="size-8" />
           </div>
           <div>
              <h2 className="text-xl font-black text-[#2C3E50]">Investment Calculator</h2>
              <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">Advanced Yield Analysis</p>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Controls */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-10 rounded-[40px] shadow-sm border border-stone-100 space-y-8"
          >
            <div className="space-y-6">
               <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px]">Purchase Price</label>
                     <span className="text-sm font-black text-[#34495E]">€{inputs.price.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="50000" 
                    max="2000000" 
                    step="5000"
                    value={inputs.price}
                    onChange={(e) => setInputs({...inputs, price: Number(e.target.value)})}
                    className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-[#34495E]"
                  />
               </div>

               <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px]">Monthly Rental Income</label>
                     <span className="text-sm font-black text-[#34495E]">€{inputs.rentalIncome.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="500" 
                    max="10000" 
                    step="50"
                    value={inputs.rentalIncome}
                    onChange={(e) => setInputs({...inputs, rentalIncome: Number(e.target.value)})}
                    className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-[#34495E]"
                  />
               </div>

               <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px]">Estimated Monthly Expenses</label>
                     <span className="text-sm font-black text-[#34495E]">€{inputs.expenses.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="3000" 
                    step="50"
                    value={inputs.expenses}
                    onChange={(e) => setInputs({...inputs, expenses: Number(e.target.value)})}
                    className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-[#34495E]"
                  />
               </div>
            </div>

            <div className="h-px bg-stone-50" />

            <div className="flex gap-4">
               <button className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#34495E] text-white font-black rounded-2xl text-sm shadow-xl shadow-[#34495E]/20 hover:scale-[1.02] transition-all">
                  <Save className="size-4" />
                  Save Calculation
               </button>
               <button 
                 onClick={() => setInputs({ price: 320000, rentalIncome: 1800, expenses: 400 })}
                 className="px-6 py-4 bg-stone-50 text-stone-400 hover:text-stone-600 rounded-2xl transition-all"
               >
                  <RotateCcw className="size-5" />
               </button>
            </div>
          </motion.div>

          <div className="bg-blue-50 p-6 rounded-[32px] border border-blue-100 flex gap-4">
             <div className="size-10 bg-blue-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                <Info className="size-5" />
             </div>
             <p className="text-xs font-bold text-blue-700 leading-relaxed">
                As a logged-in member, your saved calculations will be visible in the 'Insights' portal and can be shared with agents for faster verification.
             </p>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 space-y-6">
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="bg-[#34495E] p-10 rounded-[40px] shadow-2xl text-white relative overflow-hidden"
           >
              <div className="relative z-10">
                <p className="text-white/60 font-bold text-xs uppercase tracking-[2px] mb-2">Estimated Net Yield</p>
                <h3 className="text-7xl font-black mb-8">{yieldValue}<span className="text-4xl text-white/30">%</span></h3>
                
                <div className="space-y-4">
                   <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                      <span className="text-xs font-bold text-white/60">Annual Net Profit</span>
                      <span className="font-black">€{((inputs.rentalIncome - inputs.expenses) * 12).toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                      <span className="text-xs font-bold text-white/60">20-Year Value Projection</span>
                      <span className="font-black text-emerald-400">€{(inputs.price * 2.4).toLocaleString()}</span>
                   </div>
                </div>

                <button className="w-full mt-8 flex items-center justify-center gap-2 py-4 bg-white text-[#34495E] font-black rounded-2xl text-sm hover:bg-stone-50 transition-all">
                   Full PDF Report
                   <ChevronRight className="size-4" />
                </button>
              </div>

              {/* Decorative background element */}
              <div className="absolute -bottom-20 -right-20 size-64 bg-white/5 rounded-full blur-3xl" />
           </motion.div>
        </div>
      </div>
    </div>
  );
}
