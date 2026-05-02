'use client';

import { motion } from 'motion/react';
import { 
  Calculator, 
  Euro, 
  TrendingUp, 
  Info,
  Save,
  RotateCcw,
  ChevronRight,
  Loader2,
  History,
  Trash2,
  Calendar
} from 'lucide-react';
import { useState } from 'react';
import { 
  useSaveCalculationMutation, 
  useGetMyCalculationsQuery,
  useDeleteCalculationMutation 
} from '@/lib/store/features/calculations/calculationApi';
import Swal from 'sweetalert2';

export default function DashboardCalculator() {
  const [inputs, setInputs] = useState({
    price: 320000,
    rentalIncome: 1800,
    expenses: 400,
    years: 20, // Dynamic years
  });

  const { data: historyData, isLoading: isLoadingHistory } = useGetMyCalculationsQuery();
  const [saveCalculation, { isLoading: isSaving }] = useSaveCalculationMutation();
  const [deleteCalculation] = useDeleteCalculationMutation();

  const netMonthly = inputs.rentalIncome - inputs.expenses;
  const annualProfit = netMonthly * 12;
  const yieldValue = ((annualProfit / inputs.price) * 100).toFixed(2);
  
  // Dynamic projection: Price * (1 + 0.045)^years (assuming 4.5% avg appreciation)
  const projectionValue = Math.round(inputs.price * Math.pow(1.045, inputs.years));

  const handleSave = async () => {
    const { value: name } = await Swal.fire({
      title: 'Save Calculation',
      input: 'text',
      inputLabel: 'Give this calculation a name',
      inputPlaceholder: 'e.g. Lisbon Villa Strategy',
      showCancelButton: true,
      confirmButtonColor: '#34495E',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!'
        }
      }
    });

    if (name) {
      try {
        await saveCalculation({
          name,
          inputData: inputs,
          resultsData: {
            yield: yieldValue,
            annualProfit,
            projectionValue,
            years: inputs.years
          }
        }).unwrap();

        Swal.fire({
          title: 'Saved!',
          text: 'Your calculation has been stored in your profile.',
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
      } catch (error) {
        Swal.fire('Error', 'Failed to save calculation', 'error');
      }
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Delete Calculation?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E74C3C',
      cancelButtonColor: '#34495E',
      confirmButtonText: 'Yes, delete'
    });

    if (result.isConfirmed) {
      await deleteCalculation(id);
    }
  };

  return (
    <div className="max-w-5xl space-y-12 pb-20">
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
                     <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px]">Projection Period (Years)</label>
                     <span className="text-sm font-black text-emerald-600">{inputs.years} Years</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="30" 
                    step="1"
                    value={inputs.years}
                    onChange={(e) => setInputs({...inputs, years: Number(e.target.value)})}
                    className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
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
               <button 
                 onClick={handleSave}
                 disabled={isSaving}
                 className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#34495E] text-white font-black rounded-2xl text-sm shadow-xl shadow-[#34495E]/20 hover:scale-[1.02] transition-all disabled:opacity-50"
               >
                  {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                  Save Calculation
               </button>
               <button 
                 onClick={() => setInputs({ price: 320000, rentalIncome: 1800, expenses: 400, years: 20 })}
                 className="px-6 py-4 bg-stone-50 text-stone-400 hover:text-stone-600 rounded-2xl transition-all"
               >
                  <RotateCcw className="size-5" />
               </button>
            </div>
          </motion.div>
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
                      <span className="font-black">€{annualProfit.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                      <span className="text-xs font-bold text-white/60">{inputs.years}-Year Value Projection</span>
                      <span className="font-black text-emerald-400">€{projectionValue.toLocaleString()}</span>
                   </div>
                </div>

                <button className="w-full mt-8 flex items-center justify-center gap-2 py-4 bg-white text-[#34495E] font-black rounded-2xl text-sm hover:bg-stone-50 transition-all">
                   Full PDF Report
                   <ChevronRight className="size-4" />
                </button>
              </div>

              <div className="absolute -bottom-20 -right-20 size-64 bg-white/5 rounded-full blur-3xl" />
           </motion.div>

           <div className="bg-blue-50 p-6 rounded-[32px] border border-blue-100 flex gap-4">
             <div className="size-10 bg-blue-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                <Info className="size-5" />
             </div>
             <p className="text-xs font-bold text-blue-700 leading-relaxed">
                Your saved calculations can be shared with agents for faster verification of property ROI potential.
             </p>
          </div>
        </div>
      </div>

      {/* Saved History Section */}
      <section className="space-y-6 pt-12 border-t border-stone-100">
         <div className="flex items-center gap-3">
            <div className="size-10 bg-stone-100 rounded-xl flex items-center justify-center text-[#34495E]">
               <History className="size-5" />
            </div>
            <h3 className="text-lg font-black text-[#2C3E50]">Saved Calculations</h3>
         </div>

         {isLoadingHistory ? (
           <div className="flex justify-center p-12"><Loader2 className="size-6 animate-spin text-stone-200" /></div>
         ) : historyData?.data?.calculations?.length === 0 ? (
           <div className="p-12 text-center bg-stone-50 rounded-[32px] border border-dashed border-stone-200">
              <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">No saved calculations yet</p>
           </div>
         ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {historyData?.data?.calculations.map((calc: any) => (
                <motion.div 
                  key={calc.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm hover:shadow-md transition-all group"
                >
                   <div className="flex justify-between items-start mb-4">
                      <h4 className="font-black text-[#2C3E50]">{calc.name}</h4>
                      <button 
                        onClick={() => handleDelete(calc.id)}
                        className="p-2 text-stone-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                      >
                         <Trash2 className="size-4" />
                      </button>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-stone-50 p-3 rounded-2xl">
                         <p className="text-[8px] font-black text-stone-400 uppercase mb-1">Yield</p>
                         <p className="text-sm font-black text-[#34495E]">{calc.resultsData.yield}%</p>
                      </div>
                      <div className="bg-stone-50 p-3 rounded-2xl">
                         <p className="text-[8px] font-black text-stone-400 uppercase mb-1">Profit/Yr</p>
                         <p className="text-sm font-black text-emerald-600">€{calc.resultsData.annualProfit.toLocaleString()}</p>
                      </div>
                   </div>

                   <div className="flex items-center justify-between pt-4 border-t border-stone-50">
                      <div className="flex items-center gap-2 text-stone-400">
                         <Calendar className="size-3" />
                         <span className="text-[9px] font-bold">{new Date(calc.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span className="text-[9px] font-black text-stone-400 uppercase tracking-wider">{calc.resultsData.years || 20}Y PLAN</span>
                   </div>
                </motion.div>
              ))}
           </div>
         )}
      </section>
    </div>
  );
}
