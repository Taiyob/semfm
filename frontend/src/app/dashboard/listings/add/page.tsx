'use client';

import { motion } from 'motion/react';
import { 
  Building2, 
  Euro, 
  MapPin, 
  TrendingUp, 
  Camera,
  Layout,
  FileText,
  Save,
  ArrowRight
} from 'lucide-react';
import { useState } from 'react';

export default function AddPropertyPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    yield: '',
    location: '',
    type: 'Apartment',
    sqm: '',
    bedrooms: '1'
  });

  return (
    <div className="max-w-4xl space-y-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="size-16 bg-[#34495E] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#34495E]/20">
              <Building2 className="size-8" />
           </div>
           <div>
              <h2 className="text-xl font-black text-[#2C3E50]">List New Property</h2>
              <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">Marketplace Inventory</p>
           </div>
        </div>
      </header>

      {/* Steps Indicator */}
      <div className="flex gap-4">
         {[1, 2, 3].map((s) => (
           <div key={s} className="flex-1 h-2 rounded-full overflow-hidden bg-stone-100">
              <div className={`h-full transition-all duration-500 ${step >= s ? 'bg-[#34495E]' : 'bg-transparent'}`} />
           </div>
         ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-[40px] shadow-sm border border-stone-100"
      >
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          {step === 1 && (
            <div className="space-y-8">
              <h3 className="text-lg font-black text-[#2C3E50]">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px]">Property Title</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-[#2C3E50] focus:bg-white focus:border-[#34495E] outline-none transition-all"
                    placeholder="e.g., Luxury Studio in Lisbon Center"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px]">Price (€)</label>
                  <input 
                    type="number" 
                    className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-[#2C3E50] focus:bg-white focus:border-[#34495E] outline-none transition-all"
                    placeholder="320000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px]">Expected Yield (%)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-[#2C3E50] focus:bg-white focus:border-[#34495E] outline-none transition-all"
                    placeholder="5.4"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <h3 className="text-lg font-black text-[#2C3E50]">Location & Specs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px]">Location</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-[#2C3E50] focus:bg-white focus:border-[#34495E] outline-none transition-all"
                    placeholder="Madrid, Spain"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px]">Property Type</label>
                  <select className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-[#2C3E50] outline-none appearance-none cursor-pointer">
                    <option>Apartment</option>
                    <option>Villa</option>
                    <option>Studio</option>
                    <option>Commercial</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
               <h3 className="text-lg font-black text-[#2C3E50]">Images & Media</h3>
               <div className="border-4 border-dashed border-stone-50 rounded-[32px] p-20 flex flex-col items-center justify-center text-stone-300 hover:text-[#34495E] hover:border-[#34495E]/20 transition-all cursor-pointer bg-stone-50/30">
                  <Camera className="size-16 mb-4" />
                  <p className="font-black text-sm uppercase tracking-widest text-stone-400">Drag images here</p>
                  <p className="text-[10px] font-bold mt-1">Minimum 3 photos required</p>
               </div>
            </div>
          )}

          <div className="h-px bg-stone-50 my-10" />

          <div className="flex items-center justify-between">
             <button 
               type="button"
               disabled={step === 1}
               onClick={() => setStep(step - 1)}
               className="px-8 py-4 text-stone-400 font-black text-xs uppercase tracking-widest disabled:opacity-0 transition-all"
             >
                Back
             </button>
             
             {step < 3 ? (
               <button 
                 type="button"
                 onClick={() => setStep(step + 1)}
                 className="flex items-center gap-3 px-10 py-5 bg-[#34495E] text-white font-black rounded-[24px] text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#34495E]/20"
               >
                  Next Step
                  <ArrowRight className="size-5" />
               </button>
             ) : (
               <button 
                 type="submit"
                 className="flex items-center gap-3 px-10 py-5 bg-[#34495E] text-white font-black rounded-[24px] text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#34495E]/20"
               >
                  <Save className="size-5" />
                  Publish Listing
               </button>
             )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
