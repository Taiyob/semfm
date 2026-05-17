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
  Calendar,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useState } from 'react';
import { 
  useSaveCalculationMutation, 
  useGetMyCalculationsQuery,
  useDeleteCalculationMutation 
} from '@/lib/store/features/calculations/calculationApi';
import { useGetPropertiesQuery } from '@/lib/store/features/property/propertyApi';
import { useCreateLeadMutation } from '@/lib/store/features/leads/leadsApi';
import Swal from 'sweetalert2';

export default function DashboardCalculator() {
  const [inputs, setInputs] = useState({
    price: 320000,
    rentalIncome: 1800,
    expenses: 400,
    years: 20, // Dynamic years
  });
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');

  const { data: propertiesData } = useGetPropertiesQuery({ page: 1, limit: 100 });
  const { data: historyData, isLoading: isLoadingHistory } = useGetMyCalculationsQuery();
  const [saveCalculation, { isLoading: isSaving }] = useSaveCalculationMutation();
  const [deleteCalculation] = useDeleteCalculationMutation();
  const [createLead, { isLoading: isCreatingLead }] = useCreateLeadMutation();

  const handleInquire = async () => {
    if (!selectedPropertyId) {
      Swal.fire('Info', 'Please select a property to inquire about.', 'info');
      return;
    }

    try {
      // 1. Save the calculation first to get an ID
      const savedCalc = await saveCalculation({
        name: `Inquiry: ${propertiesData?.data?.find((p: any) => p.id === selectedPropertyId)?.title}`,
        inputData: inputs,
        resultsData: {
          yield: yieldValue,
          annualProfit,
          projectionValue,
          years: inputs.years
        },
        propertyId: selectedPropertyId
      }).unwrap();

      // 2. Create the lead with the calculationId
      await createLead({
        propertyId: selectedPropertyId,
        calculationId: savedCalc.data.id,
        message: `I have performed a yield analysis for this property with an estimated net yield of ${yieldValue}%.`
      }).unwrap();

      Swal.fire({
        title: 'Inquiry Sent!',
        text: 'Your calculation has been attached and sent to the agent.',
        icon: 'success',
        confirmButtonColor: '#34495E'
      });
    } catch (error) {
      Swal.fire('Error', 'Failed to send inquiry.', 'error');
    }
  };

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

  const [selectedForComparison, setSelectedForComparison] = useState<any[]>([]);
  const [isCompareMode, setIsCompareMode] = useState(false);

  const toggleCompare = (calc: any) => {
    if (selectedForComparison.find(c => c.id === calc.id)) {
      setSelectedForComparison(selectedForComparison.filter(c => c.id !== calc.id));
    } else {
      if (selectedForComparison.length < 3) {
        setSelectedForComparison([...selectedForComparison, calc]);
      } else {
        Swal.fire({
          title: 'Limit reached',
          text: 'You can compare up to 3 calculations at once.',
          icon: 'info',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
      }
    }
  };

  const GOLD_COLOR = '#D4AF37';

  return (
    <div className="max-w-6xl space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
           <div className="size-16 rounded-2xl flex items-center justify-center text-white shadow-xl" style={{ backgroundColor: GOLD_COLOR }}>
              <Calculator className="size-8" />
           </div>
           <div>
              <h2 className="text-xl font-black text-[#2C3E50]">Investment Calculator</h2>
              <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">Premium Yield Analysis</p>
           </div>
        </div>

      </header>

      {isCompareMode ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {selectedForComparison.map((calc) => (
            <div key={calc.id} className="bg-white rounded-[40px] border-2 border-stone-100 overflow-hidden shadow-xl">
              <div className="p-8 border-b border-stone-50" style={{ backgroundColor: GOLD_COLOR + '05' }}>
                <h4 className="text-lg font-black text-[#2C3E50] mb-1">{calc.name}</h4>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  {new Date(calc.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="p-8 space-y-8">
                <div className="text-center">
                  <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-2">Net Yield</p>
                  <h5 className="text-5xl font-black text-[#2C3E50]">
                    {Number(calc.resultsData.grossYield ?? calc.resultsData.yield ?? 0).toFixed(1)}%
                  </h5>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-stone-50 rounded-2xl flex justify-between items-center">
                    <span className="text-[10px] font-black text-stone-400 uppercase">Annual Profit</span>
                    <span className={`font-black ${
                      (calc.resultsData.profitAfterMortgage ?? calc.resultsData.annualProfit ?? 0) >= 0 
                        ? 'text-emerald-600' 
                        : 'text-rose-600'
                    }`}>
                      €{(calc.resultsData.profitAfterMortgage ?? calc.resultsData.annualProfit ?? 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-2xl flex justify-between items-center">
                    <span className="text-[10px] font-black text-stone-400 uppercase">{calc.resultsData.years ?? 20}-Year Projection</span>
                    <span className="font-black text-emerald-600">€{(calc.resultsData.projectionValue ?? 0).toLocaleString()}</span>
                  </div>
                  <div className="p-4 bg-stone-50 rounded-2xl flex justify-between items-center">
                    <span className="text-[10px] font-black text-stone-400 uppercase">Purchase Price</span>
                    <span className="font-black text-stone-600">
                      {(calc.inputData?.price || calc.inputData?.purchasePrice) 
                        ? `€${(calc.inputData?.price || calc.inputData?.purchasePrice).toLocaleString()}` 
                        : '€N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      ) : (
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
                      className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer"
                      style={{ accentColor: GOLD_COLOR }}
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
                      className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer"
                      style={{ accentColor: GOLD_COLOR }}
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
                      className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer"
                      style={{ accentColor: GOLD_COLOR }}
                    />
                 </div>
              </div>

              <div className="h-px bg-stone-50" />

              <div className="flex gap-4">
                 <button 
                   onClick={handleSave}
                   disabled={isSaving}
                   className="flex-1 flex items-center justify-center gap-2 py-4 text-white font-black rounded-2xl text-sm shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                   style={{ backgroundColor: GOLD_COLOR }}
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
               className="p-10 rounded-[40px] shadow-2xl text-white relative overflow-hidden"
               style={{ backgroundColor: '#2C3E50' }}
             >
                <div className="relative z-10">
                  <p className="text-white/60 font-bold text-xs uppercase tracking-[2px] mb-2">Estimated Net Yield</p>
                  <h3 className="text-7xl font-black mb-8" style={{ color: GOLD_COLOR }}>{yieldValue}<span className="text-4xl text-white/30">%</span></h3>
                  
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

                  <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                     <p className="text-[9px] font-black uppercase text-white/40 tracking-widest">Inquire with Agent</p>
                     <select 
                       value={selectedPropertyId}
                       onChange={(e) => setSelectedPropertyId(e.target.value)}
                       className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white outline-none cursor-pointer"
                     >
                        <option value="" className="bg-[#2C3E50]">Select Property...</option>
                        {propertiesData?.data?.map((p: any) => (
                          <option key={p.id} value={p.id} className="bg-[#2C3E50]">{p.title}</option>
                        ))}
                     </select>
                     <button 
                       onClick={handleInquire}
                       disabled={isCreatingLead || !selectedPropertyId}
                       className="w-full py-4 bg-[#D4A373] text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-[#D4A373]/20 hover:opacity-90 transition-all disabled:opacity-50 disabled:bg-stone-600"
                     >
                        {isCreatingLead ? <Loader2 className="size-4 animate-spin mx-auto" /> : "Send Analysis to Agent"}
                     </button>
                  </div>
                </div>

                <div className="absolute -bottom-20 -right-20 size-64 bg-white/5 rounded-full blur-3xl" />
             </motion.div>

             <div className="bg-stone-50 p-6 rounded-[32px] border border-stone-100 flex gap-4">
               <div className="size-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0" style={{ color: GOLD_COLOR }}>
                  <Info className="size-5" />
               </div>
               <p className="text-xs font-bold text-stone-500 leading-relaxed">
                  Your saved calculations can be shared with agents for faster verification of property ROI potential.
               </p>
            </div>
          </div>
        </div>
      )}

      {/* Saved History Section */}
      <section className="space-y-6 pt-12 border-t border-stone-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
               <div className="size-10 bg-stone-100 rounded-xl flex items-center justify-center text-[#34495E]">
                  <History className="size-5" />
               </div>
               <h3 className="text-lg font-black text-[#2C3E50]">Saved Calculations</h3>
            </div>
            
            {selectedForComparison.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 bg-stone-50 p-1.5 pl-4 rounded-2xl border border-stone-100 shadow-sm"
              >
                <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">{selectedForComparison.length} Selected</span>
                <button 
                  onClick={() => setIsCompareMode(!isCompareMode)}
                  className="px-5 py-2.5 bg-[#34495E] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#2C3E50] transition-all shadow-lg shadow-[#34495E]/20"
                >
                  {isCompareMode ? 'Close Comparison' : 'Compare Now'}
                </button>
                <button 
                  onClick={() => setSelectedForComparison([])}
                  className="p-2 text-stone-300 hover:text-rose-500 transition-all"
                >
                  <Trash2 className="size-4" />
                </button>
              </motion.div>
            ) : (
              (historyData?.data?.calculations?.length ?? 0) > 0 && (
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Select up to 3 to compare</p>
              )
            )}
          </div>

         {isLoadingHistory ? (
           <div className="flex justify-center p-12"><Loader2 className="size-6 animate-spin text-stone-200" /></div>
         ) : historyData?.data?.calculations?.length === 0 ? (
           <div className="p-12 text-center bg-stone-50 rounded-[40px] border border-dashed border-stone-200">
              <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">No saved calculations yet</p>
           </div>
         ) : (
           <div className="overflow-x-auto rounded-[32px] border border-stone-100 bg-white shadow-sm">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-stone-50/50 border-b border-stone-100">
                    <th className="p-5 text-[10px] font-black text-stone-400 uppercase tracking-widest w-20">Select</th>
                    <th className="p-5 text-[10px] font-black text-stone-400 uppercase tracking-widest">Name</th>
                    <th className="p-5 text-[10px] font-black text-stone-400 uppercase tracking-widest">Yield</th>
                    <th className="p-5 text-[10px] font-black text-stone-400 uppercase tracking-widest">Annual Profit</th>
                    <th className="p-5 text-[10px] font-black text-stone-400 uppercase tracking-widest">Purchase Price</th>
                    <th className="p-5 text-[10px] font-black text-stone-400 uppercase tracking-widest">Period</th>
                    <th className="p-5 text-[10px] font-black text-stone-400 uppercase tracking-widest">Date</th>
                    <th className="p-5 text-[10px] font-black text-stone-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {historyData?.data?.calculations?.map((calc: any) => {
                    const isSelected = !!selectedForComparison.find(c => c.id === calc.id);
                    return (
                      <motion.tr 
                        key={calc.id}
                        layout
                        onClick={() => toggleCompare(calc)}
                        className={`group cursor-pointer transition-all hover:bg-stone-50/50 ${
                          isSelected ? 'bg-[#D4AF37]/5' : ''
                        }`}
                      >
                        <td className="p-5">
                           <div className={`size-5 rounded-lg border-2 transition-all flex items-center justify-center ${
                             isSelected ? 'bg-[#D4AF37] border-[#D4AF37] scale-110 shadow-lg shadow-[#D4AF37]/20' : 'border-stone-100 bg-stone-50'
                           }`}>
                              {isSelected && <div className="size-2 bg-white rounded-full" />}
                           </div>
                        </td>
                        <td className="p-5">
                           <h4 className="font-black text-[#2C3E50] text-sm group-hover:text-[#D4AF37] transition-colors">{calc.name}</h4>
                        </td>
                        <td className="p-5">
                           <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-50 rounded-full border border-stone-100">
                              <span className="text-xs font-black text-[#34495E]">
                                {Number(calc.resultsData.grossYield ?? calc.resultsData.yield ?? 0).toFixed(1)}%
                              </span>
                           </div>
                        </td>
                        <td className="p-5">
                           <span className="text-sm font-black text-emerald-600">
                             €{Math.round(calc.resultsData.profitAfterMortgage ?? calc.resultsData.annualProfit ?? 0).toLocaleString()}
                           </span>
                        </td>
                        <td className="p-5">
                           <span className="text-sm font-bold text-stone-500">
                             €{(calc.inputData?.price ?? calc.inputData?.purchasePrice)?.toLocaleString() ?? 'N/A'}
                           </span>
                        </td>
                        <td className="p-5">
                           <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider">
                              {calc.resultsData.years || 20} Years
                           </span>
                        </td>
                        <td className="p-5">
                           <div className="flex items-center gap-2 text-stone-400">
                              <Clock className="size-3" />
                              <span className="text-[10px] font-bold">{new Date(calc.createdAt).toLocaleDateString()}</span>
                           </div>
                        </td>
                        <td className="p-5 text-right">
                           <button 
                             onClick={(e) => { e.stopPropagation(); handleDelete(calc.id); }}
                             className="p-2.5 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                           >
                              <Trash2 className="size-4" />
                           </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
           </div>
         )}
      </section>
    </div>
  );
}
