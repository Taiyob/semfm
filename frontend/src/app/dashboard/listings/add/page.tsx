'use client';

import { useCreatePropertyMutation } from '@/lib/store/features/property/propertyApi';
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
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import Swal from 'sweetalert2';

export default function AddPropertyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [createProperty, { isLoading }] = useCreatePropertyMutation();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    estimatedRent: '', // New
    yield: '0', // Calculated
    appreciation: '4.5', // System-controlled
    location: '',
    type: 'Apartment',
    sqm: '',
    bedrooms: '1',
    bathrooms: '1', // New
    exteriorSize: '', // New
    plotSize: '', // New
    yearBuilt: new Date().getFullYear().toString(), // New
    region: '',
    countryId: undefined,
    condition: 'Standard',
    locationType: 'CENTRE',
    outdoorSpace: 'NONE',
    energyLabel: 'C',
    features: [] as string[], // New
    photos: [] as string[], // New
  });

  const [isYieldOverride, setIsYieldOverride] = useState(false);
  const [isRentOverride, setIsRentOverride] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState('');

  // Photo management
  const addPhoto = () => {
    if (photoUrlInput && photoUrlInput.startsWith('http')) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, photoUrlInput]
      }));
      setPhotoUrlInput('');
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  // Auto-calculation logic
  const calculateMetrics = (price: number, rent: number) => {
    if (!price || price <= 0) return { yieldValue: 0 };
    const annualRent = rent * 12;
    const yieldValue = (annualRent / price) * 100;
    return { yieldValue: yieldValue.toFixed(2) };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Auto-calculate rent if price changes and rent hasn't been overridden
      if (name === 'price' && !isRentOverride) {
        const autoRent = Math.round(Number(value) * 0.005); // 0.5% rule of thumb
        newData.estimatedRent = autoRent.toString();
      }

      // Auto-calculate yield if price or rent changes and yield hasn't been overridden
      if ((name === 'price' || name === 'estimatedRent') && !isYieldOverride) {
        const { yieldValue } = calculateMetrics(Number(newData.price), Number(newData.estimatedRent));
        newData.yield = yieldValue.toString();
      }

      return newData;
    });
  };

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature) 
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const isStepValid = () => {
    if (step === 1) {
      return formData.title.length >= 3 && Number(formData.price) > 0;
    }
    if (step === 2) {
      return formData.location.length >= 2 && Number(formData.sqm) > 0;
    }
    // Step 3 and 4 have defaults, so they are generally valid
    return true;
  };

  const nextStep = () => {
    if (isStepValid()) {
      setStep(step + 1);
    } else {
      Swal.fire({
        title: 'Missing Information',
        text: 'Please fill in all required fields for this step correctly before proceeding.',
        icon: 'warning',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      nextStep();
      return;
    }

    if (!isStepValid()) return;

    setStatus('idle');
    try {
      await createProperty({
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        estimatedRent: Number(formData.estimatedRent),
        yield: Number(formData.yield),
        appreciation: Number(formData.appreciation),
        location: formData.location,
        type: formData.type,
        sqm: Number(formData.sqm),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        exteriorSize: Number(formData.exteriorSize),
        plotSize: Number(formData.plotSize),
        yearBuilt: Number(formData.yearBuilt),
        region: formData.region,
        condition: formData.condition,
        locationType: formData.locationType,
        outdoorSpace: formData.outdoorSpace,
        energyLabel: formData.energyLabel,
        features: formData.features,
        photos: formData.photos,
        image: formData.photos.length > 0 ? formData.photos[0] : '', // Use first photo as main image
      }).unwrap();

      setStatus('success');
      setTimeout(() => {
        router.push('/dashboard/listings');
      }, 2000);
    } catch (err: any) {
      // Better logging for debugging
      console.error('Failed to create property. Full error:', JSON.stringify(err, null, 2));
      console.dir(err); 
      
      setStatus('error');
      
      // Extract error message from backend standard response
      const backendError = err?.data?.error?.message || err?.data?.message || err?.message;
      const validationDetails = err?.data?.error?.details?.issues 
        ? `: ${err.data.error.details.issues.map((i: any) => i.message).join(', ')}`
        : '';
        
      setErrorMessage(backendError ? `${backendError}${validationDetails}` : 'An unexpected error occurred. Please check your inputs and try again.');
    }
  };

  return (
    <div className="max-w-4xl space-y-8 pb-20">
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
          {/* STEP 1: IDENTITY & PRICING */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                 <div className="size-8 bg-[#34495E]/10 rounded-lg flex items-center justify-center">
                    <FileText className="size-4 text-[#34495E]" />
                 </div>
                 <h3 className="text-lg font-black text-[#2C3E50]">Identity & Pricing</h3>
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
              </div>
            </div>
          )}

          {/* STEP 2: PHYSICAL SPECS */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                 <div className="size-8 bg-[#34495E]/10 rounded-lg flex items-center justify-center">
                    <MapPin className="size-4 text-[#34495E]" />
                 </div>
                 <h3 className="text-lg font-black text-[#2C3E50]">Physical Specs</h3>
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
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px]">Interior Area (sqm)</label>
                  <input required type="number" name="sqm" value={formData.sqm} onChange={handleChange} className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-[#2C3E50] focus:bg-white focus:border-[#34495E] outline-none transition-all" placeholder="85" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px]">Exterior Size (sqm)</label>
                  <input type="number" name="exteriorSize" value={formData.exteriorSize} onChange={handleChange} className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-[#2C3E50] focus:bg-white focus:border-[#34495E] outline-none transition-all" placeholder="20" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px]">Plot Size (sqm)</label>
                  <input type="number" name="plotSize" value={formData.plotSize} onChange={handleChange} className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-[#2C3E50] focus:bg-white focus:border-[#34495E] outline-none transition-all" placeholder="500" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px]">Bedrooms</label>
                  <input required type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-[#2C3E50] focus:bg-white focus:border-[#34495E] outline-none transition-all" placeholder="2" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px]">Bathrooms</label>
                  <input required type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-[#2C3E50] focus:bg-white focus:border-[#34495E] outline-none transition-all" placeholder="1" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px]">Year Built</label>
                  <input type="number" name="yearBuilt" value={formData.yearBuilt} onChange={handleChange} className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-[#2C3E50] focus:bg-white focus:border-[#34495E] outline-none transition-all" placeholder="2015" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ATTRIBUTES & FEATURES */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                 <div className="size-8 bg-[#34495E]/10 rounded-lg flex items-center justify-center">
                    <Layout className="size-4 text-[#34495E]" />
                 </div>
                 <h3 className="text-lg font-black text-[#2C3E50]">Attributes & Features</h3>
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
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px]">Energy Label</label>
                  <select name="energyLabel" value={formData.energyLabel} onChange={handleChange} className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-[#2C3E50] outline-none appearance-none cursor-pointer">
                    {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px]">Location Type</label>
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
                
                <div className="md:col-span-2 space-y-4">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px]">Features & Amenities</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Swimming Pool', 'Garage', 'Garden', 'Security', 'AC', 'Elevator', 'Gym', 'Sea View'].map(feature => (
                      <button
                        key={feature}
                        type="button"
                        onClick={() => toggleFeature(feature)}
                        className={`px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
                          formData.features.includes(feature)
                            ? 'bg-[#34495E] text-white border-[#34495E]'
                            : 'bg-stone-50 text-stone-400 border-stone-100 hover:border-[#34495E]/30'
                        }`}
                      >
                        {feature}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-[2px]">Property Photos</label>
                  
                  <div className="flex gap-4">
                    <input 
                      type="text" 
                      value={photoUrlInput}
                      onChange={(e) => setPhotoUrlInput(e.target.value)}
                      placeholder="Paste image URL here (e.g. https://...)" 
                      className="flex-1 px-6 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm font-bold text-[#2C3E50] focus:bg-white focus:border-[#34495E] outline-none transition-all"
                    />
                    <button 
                      type="button"
                      onClick={addPhoto}
                      className="px-8 py-4 bg-[#34495E] text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:opacity-90 transition-all"
                    >
                      Add URL
                    </button>
                  </div>

                  {formData.photos.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      {formData.photos.map((url, idx) => (
                        <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden border border-stone-100 group">
                          <img src={url} alt={`Property ${idx}`} className="size-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => removePhoto(idx)}
                            className="absolute top-2 right-2 size-6 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                          {idx === 0 && (
                            <div className="absolute bottom-0 inset-x-0 bg-[#34495E]/80 text-white text-[8px] font-black uppercase tracking-tighter text-center py-1">
                              Featured
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="aspect-video bg-stone-50 border-2 border-dashed border-stone-200 rounded-[32px] flex flex-col items-center justify-center gap-4 text-stone-400">
                      <Camera className="size-10" />
                      <div className="text-center">
                        <p className="text-sm font-black">No photos added yet</p>
                        <p className="text-[10px] font-bold">Add at least one URL to showcase the property</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: FINANCIALS & REVIEW */}
          {step === 4 && (
            <div className="space-y-8">
               <div className="flex items-center gap-3">
                 <div className="size-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="size-4 text-emerald-600" />
                 </div>
                 <h3 className="text-lg font-black text-[#2C3E50]">Financial Projections</h3>
              </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-stone-50 rounded-[32px] border border-stone-100 space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Est. Monthly Rent</label>
                      <button 
                        type="button"
                        onClick={() => setIsRentOverride(!isRentOverride)}
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${isRentOverride ? 'bg-amber-100 text-amber-600' : 'bg-stone-200 text-stone-500'}`}
                      >
                        {isRentOverride ? 'Override On' : 'Override'}
                      </button>
                    </div>
                    <div className="relative">
                      <Euro className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-stone-300" />
                      <input 
                        type="number" 
                        name="estimatedRent"
                        readOnly={!isRentOverride}
                        value={formData.estimatedRent} 
                        onChange={handleChange}
                        className={`w-full pl-10 pr-6 py-4 bg-white border border-stone-200 rounded-2xl text-lg font-black text-[#2C3E50] focus:outline-none focus:border-[#34495E] transition-all ${!isRentOverride && 'opacity-60 cursor-not-allowed'}`}
                      />
                    </div>
                  </div>

                  <div className="p-6 bg-stone-50 rounded-[32px] border border-stone-100 space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Gross Yield (%)</label>
                      <button 
                        type="button"
                        onClick={() => setIsYieldOverride(!isYieldOverride)}
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${isYieldOverride ? 'bg-amber-100 text-amber-600' : 'bg-stone-200 text-stone-500'}`}
                      >
                        {isYieldOverride ? 'Override On' : 'Override'}
                      </button>
                    </div>
                    <div className="relative">
                      <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-stone-300" />
                      <input 
                        type="number" 
                        name="yield"
                        step="0.01"
                        readOnly={!isYieldOverride}
                        value={formData.yield} 
                        onChange={handleChange}
                        className={`w-full pl-10 pr-6 py-4 bg-white border border-stone-200 rounded-2xl text-lg font-black text-[#2C3E50] focus:outline-none focus:border-[#34495E] transition-all ${!isYieldOverride && 'opacity-60 cursor-not-allowed'}`}
                      />
                    </div>
                  </div>

                  <div className="p-6 bg-[#34495E] rounded-[32px] space-y-4">
                    <label className="text-[10px] font-black text-stone-300/60 uppercase tracking-widest">Avg. Appreciation (%)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        readOnly
                        value={formData.appreciation} 
                        className="w-full px-6 py-4 bg-white/10 border border-white/10 rounded-2xl text-lg font-black text-white focus:outline-none opacity-80 cursor-not-allowed"
                      />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-stone-300 uppercase">Fixed</span>
                    </div>
                  </div>
               </div>

               <div className="h-px bg-stone-100" />

               <div className="p-8 bg-emerald-50/30 rounded-[40px] border border-emerald-100 space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-600/60 text-xs font-bold uppercase tracking-widest">Final Listing Summary</span>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase">Asset Ready</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                      <p className="text-[9px] font-black text-stone-400 uppercase tracking-tighter">Asking Price</p>
                      <p className="text-base font-black text-[#2C3E50]">€{Number(formData.price).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-stone-400 uppercase tracking-tighter">Net Area</p>
                      <p className="text-base font-black text-[#2C3E50]">{formData.sqm}m²</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-stone-400 uppercase tracking-tighter">Yield / Rent</p>
                      <p className="text-base font-black text-[#2C3E50]">{formData.yield}% / €{formData.estimatedRent}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-stone-400 uppercase tracking-tighter">Appreciation</p>
                      <p className="text-base font-black text-[#D4A373]">{formData.appreciation}%</p>
                    </div>
                  </div>
               </div>

               {status === 'success' && (
                 <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3 p-6 bg-emerald-50 text-emerald-600 rounded-3xl border border-emerald-100">
                    <CheckCircle2 className="size-6" />
                    <div className="font-bold">
                      <p className="text-sm">Listing published successfully!</p>
                      <p className="text-[10px] opacity-80">Redirecting to your listings...</p>
                    </div>
                 </motion.div>
               )}

               {status === 'error' && (
                 <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3 p-6 bg-rose-50 text-rose-600 rounded-3xl border border-rose-100">
                    <AlertCircle className="size-6" />
                    <div className="font-bold">
                      <p className="text-sm">Error publishing listing</p>
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
               disabled={step === 1 || isLoading}
               onClick={() => setStep(step - 1)}
               className="px-8 py-4 text-stone-400 font-black text-xs uppercase tracking-widest disabled:opacity-0 transition-all hover:text-[#34495E]"
             >
                Back
             </button>
             
             {step < 4 ? (
               <button 
                 type="button"
                 onClick={nextStep}
                 className="flex items-center gap-3 px-10 py-5 bg-[#34495E] text-white font-black rounded-[24px] text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#34495E]/20"
               >
                  Next Step
                  <ArrowRight className="size-5" />
               </button>
             ) : (
               <button 
                 type="submit"
                 disabled={isLoading}
                 className="flex items-center gap-3 px-10 py-5 bg-[#34495E] disabled:bg-stone-300 text-white font-black rounded-[24px] text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#34495E]/20"
               >
                  {isLoading ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <Save className="size-5" />
                  )}
                  {isLoading ? 'Publishing...' : 'Publish Listing'}
               </button>
             )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}


