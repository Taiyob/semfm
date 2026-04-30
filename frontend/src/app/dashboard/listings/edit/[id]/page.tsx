'use client';

import { 
  useGetPropertyByIdQuery, 
  useUpdatePropertyMutation 
} from '@/lib/store/features/property/propertyApi';
import { 
  Building2, 
  Euro, 
  MapPin, 
  TrendingUp, 
  Camera,
  Layout,
  FileText,
  Save,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'motion/react';
import Swal from 'sweetalert2';

export default function EditPropertyPage() {
  const router = useRouter();
  const { id } = useParams();
  const [step, setStep] = useState(1);
  
  const { data: propertyResponse, isLoading: isFetching } = useGetPropertyByIdQuery(id as string);
  const [updateProperty, { isLoading: isUpdating }] = useUpdatePropertyMutation();
  
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    yield: '',
    appreciation: '4.5',
    location: '',
    type: 'Apartment',
    sqm: '',
    bedrooms: '1',
    region: '',
    condition: 'Standard',
    locationType: 'CENTRE',
    outdoorSpace: 'NONE',
    energyLabel: 'C',
  });

  // Populate form data when property data is fetched
  useEffect(() => {
    if (propertyResponse?.data) {
        const p = propertyResponse.data;
        setFormData({
            title: p.title || '',
            description: p.description || '',
            price: p.price !== undefined && p.price !== null ? String(p.price) : '',
            yield: p.yield !== undefined && p.yield !== null ? String(p.yield) : '',
            appreciation: p.appreciation !== undefined && p.appreciation !== null ? String(p.appreciation) : '4.5',
            location: p.location || '',
            type: p.type || 'Apartment',
            sqm: p.sqm !== undefined && p.sqm !== null ? String(p.sqm) : '',
            bedrooms: p.bedrooms !== undefined && p.bedrooms !== null ? String(p.bedrooms) : '1',
            region: p.region || '',
            condition: p.condition || 'Standard',
            locationType: p.locationType || 'CENTRE',
            outdoorSpace: p.outdoorSpace || 'NONE',
            energyLabel: p.energyLabel || 'C',
        });
    }
  }, [propertyResponse]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    setStatus('idle');
    try {
      const payload = {
        id: id as string,
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        yield: parseFloat(formData.yield) || 0,
        appreciation: parseFloat(formData.appreciation) || 0,
        location: formData.location,
        type: formData.type,
        sqm: parseFloat(formData.sqm) || 0,
        bedrooms: parseInt(formData.bedrooms) || 0,
        region: formData.region,
        condition: formData.condition,
        locationType: formData.locationType,
        outdoorSpace: formData.outdoorSpace,
        energyLabel: formData.energyLabel,
      };

      await updateProperty(payload).unwrap();

      setStatus('success');
      
      Swal.fire({
        title: 'Updated!',
        text: 'Property has been updated successfully.',
        icon: 'success',
        confirmButtonColor: '#34495E',
        customClass: {
            popup: 'rounded-[40px] font-montserrat',
            title: 'text-2xl font-black text-[#2C3E50] uppercase tracking-tighter',
            confirmButton: 'px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest',
        }
      });

      setTimeout(() => {
        router.push('/dashboard/listings');
      }, 2000);
    } catch (err: any) {
      console.error('Update Error Details:', {
        message: err.message,
        data: err.data,
        status: err.status
      });
      setStatus('error');
      setErrorMessage(err?.data?.error?.message || err?.data?.message || 'Failed to update property listing. Please check your inputs.');
    }
  };

  if (isFetching) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <Loader2 className="size-12 text-[#34495E] animate-spin" />
        <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">Loading Asset Data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 pb-20">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="size-16 bg-[#34495E] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#34495E]/20">
              <Edit2 className="size-8" />
           </div>
           <div>
              <h2 className="text-xl font-black text-[#2C3E50]">Edit Property</h2>
              <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">Update Asset Parameters</p>
           </div>
        </div>
      </header>

      {/* Steps Indicator */}
      <div className="flex gap-4">
         {[1, 2, 3, 4].map((s) => (
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
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* STEP 1: CORE DETAILS */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                 <div className="size-8 bg-[#34495E]/10 rounded-lg flex items-center justify-center">
                    <FileText className="size-4 text-[#34495E]" />
                 </div>
                 <h3 className="text-lg font-black text-[#2C3E50]">Core Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px]">Property Title</label>
                  <input required name="title" value={formData.title} onChange={handleChange} className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-[#2C3E50] focus:bg-white focus:border-[#34495E] outline-none transition-all" placeholder="e.g., Luxury Studio in Lisbon Center" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px]">Investment description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-[#2C3E50] focus:bg-white focus:border-[#34495E] outline-none transition-all" placeholder="Investment case, renovation potential, neighborhood highlights..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px]">Asking Price (€)</label>
                  <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-[#2C3E50] focus:bg-white focus:border-[#34495E] outline-none transition-all" placeholder="320000" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px]">Property Type</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-[#2C3E50] outline-none appearance-none cursor-pointer">
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Studio">Studio</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Penthouse">Penthouse</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px]">Net Yield (%)</label>
                  <input required type="number" step="0.1" name="yield" value={formData.yield} onChange={handleChange} className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-[#2C3E50] focus:bg-white focus:border-[#34495E] outline-none transition-all" placeholder="5.4" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px]">Appreciation (%)</label>
                  <input required type="number" step="0.1" name="appreciation" value={formData.appreciation} onChange={handleChange} className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-[#2C3E50] focus:bg-white focus:border-[#34495E] outline-none transition-all" placeholder="4.5" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION & SPECS */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                 <div className="size-8 bg-[#34495E]/10 rounded-lg flex items-center justify-center">
                    <MapPin className="size-4 text-[#34495E]" />
                 </div>
                 <h3 className="text-lg font-black text-[#2C3E50]">Location & Specs</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px]">City Context</label>
                  <input required type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-[#2C3E50] focus:bg-white focus:border-[#34495E] outline-none transition-all" placeholder="Lisbon, Portugal" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px]">Region / Neighborhood</label>
                  <input type="text" name="region" value={formData.region} onChange={handleChange} className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-[#2C3E50] focus:bg-white focus:border-[#34495E] outline-none transition-all" placeholder="Alcantara" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px]">Net Area (sqm)</label>
                  <input required type="number" name="sqm" value={formData.sqm} onChange={handleChange} className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-[#2C3E50] focus:bg-white focus:border-[#34495E] outline-none transition-all" placeholder="85" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px]">Bedrooms</label>
                  <input required type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-[#2C3E50] focus:bg-white focus:border-[#34495E] outline-none transition-all" placeholder="2" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ADVANCED ATTRIBUTES */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                 <div className="size-8 bg-[#34495E]/10 rounded-lg flex items-center justify-center">
                    <Layout className="size-4 text-[#34495E]" />
                 </div>
                 <h3 className="text-lg font-black text-[#2C3E50]">Advanced Attributes</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px]">Property Condition</label>
                  <select name="condition" value={formData.condition} onChange={handleChange} className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-[#2C3E50] outline-none appearance-none cursor-pointer">
                    <option value="Renovation Needed">Renovation Needed</option>
                    <option value="Outdated">Outdated</option>
                    <option value="Basic">Basic</option>
                    <option value="Standard">Standard</option>
                    <option value="Good">Good</option>
                    <option value="Premium">Premium</option>
                    <option value="High-End">High-End</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px]">Location Context</label>
                  <select name="locationType" value={formData.locationType} onChange={handleChange} className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-[#2C3E50] outline-none appearance-none cursor-pointer">
                    <option value="CENTRE">City Centre</option>
                    <option value="SEMI_CENTRE">Semi-Centre</option>
                    <option value="OUTSIDE_CENTRE">Outside Centre</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px]">Outdoor Space</label>
                  <select name="outdoorSpace" value={formData.outdoorSpace} onChange={handleChange} className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-[#2C3E50] outline-none appearance-none cursor-pointer">
                    <option value="NONE">None</option>
                    <option value="BALCONY">Balcony</option>
                    <option value="GARDEN">Garden</option>
                    <option value="TERRACE">Terrace</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px]">Energy Label</label>
                  <select name="energyLabel" value={formData.energyLabel} onChange={handleChange} className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-[#2C3E50] outline-none appearance-none cursor-pointer">
                    {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & SAVE */}
          {step === 4 && (
            <div className="space-y-8">
               <h3 className="text-lg font-black text-[#2C3E50]">Review Updates</h3>
               <div className="p-8 bg-stone-50 rounded-[32px] border border-stone-100 space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-400 text-xs font-bold uppercase tracking-widest">Update Summary</span>
                    <span className="px-3 py-1 bg-[#34495E] text-white rounded-full text-[10px] font-black uppercase">Modified Asset</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-black text-[#2C3E50] leading-none">{formData.title || 'Untitled Asset'}</h4>
                    <p className="text-stone-400 text-sm font-bold italic">{formData.location} — {formData.region}</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-stone-200">
                    <div>
                      <p className="text-[9px] font-black text-stone-400 uppercase tracking-tighter">Price</p>
                      <p className="text-sm font-black text-[#2C3E50]">€{Number(formData.price).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-stone-400 uppercase tracking-tighter">Yield</p>
                      <p className="text-sm font-black text-[#2C3E50]">{formData.yield}%</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-stone-400 uppercase tracking-tighter">Appreciation</p>
                      <p className="text-sm font-black text-[#D4A373]">{formData.appreciation}%</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-stone-400 uppercase tracking-tighter">Specs</p>
                      <p className="text-sm font-black text-[#2C3E50]">{formData.bedrooms}B / {formData.sqm}m²</p>
                    </div>
                  </div>
               </div>

               {status === 'success' && (
                 <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3 p-6 bg-emerald-50 text-emerald-600 rounded-3xl border border-emerald-100">
                    <CheckCircle2 className="size-6" />
                    <div className="font-bold">
                      <p className="text-sm">Changes saved successfully!</p>
                      <p className="text-[10px] opacity-80">Redirecting to your listings...</p>
                    </div>
                 </motion.div>
               )}

               {status === 'error' && (
                 <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3 p-6 bg-rose-50 text-rose-600 rounded-3xl border border-rose-100">
                    <AlertCircle className="size-6" />
                    <div className="font-bold">
                      <p className="text-sm">Error saving changes</p>
                      <p className="text-[10px] opacity-80">{errorMessage}</p>
                    </div>
                 </motion.div>
               )}
            </div>
          )}

          <div className="h-px bg-stone-50 my-10" />

          <div className="flex items-center justify-between">
             <button 
               type="button"
               disabled={step === 1 || isUpdating}
               onClick={() => setStep(step - 1)}
               className="px-8 py-4 text-stone-400 font-black text-xs uppercase tracking-widest disabled:opacity-0 transition-all hover:text-[#34495E]"
             >
                Back
             </button>
             
             {step < 4 ? (
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
                 disabled={isUpdating}
                 className="flex items-center gap-3 px-10 py-5 bg-[#34495E] disabled:bg-stone-300 text-white font-black rounded-[24px] text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#34495E]/20"
               >
                  {isUpdating ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <Save className="size-5" />
                  )}
                  {isUpdating ? 'Saving Changes...' : 'Save Changes'}
               </button>
             )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// Reuse Edit2 icon
function Edit2({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
            <path d="m15 5 4 4"/>
        </svg>
    )
}
