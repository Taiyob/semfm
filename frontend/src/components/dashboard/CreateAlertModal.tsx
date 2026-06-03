'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, Save, MapPin, Euro, Bed, Bath, TrendingUp, BarChart3, Search, Info } from 'lucide-react';
import { useState, useEffect } from 'react';

const GOLD_COLOR = '#D4AF37';

interface CreateAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (alertData: any) => void;
  initialData?: any;
}

export default function CreateAlertModal({ isOpen, onClose, onSave, initialData }: CreateAlertModalProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    location: initialData?.criteria?.location || '',
    minPrice: initialData?.criteria?.minPrice?.toString() || '',
    maxPrice: initialData?.criteria?.maxPrice?.toString() || '',
    bedrooms: initialData?.criteria?.bedrooms?.toString() || '',
    bathrooms: initialData?.criteria?.bathrooms?.toString() || '',
    minYield: initialData?.criteria?.minYield?.toString() || '',
    minROI: initialData?.criteria?.minROI?.toString() || '',
    keywords: initialData?.criteria?.keywords || ''
  });

  // Sync state if initialData changes (e.g. when opening for a different alert)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        location: initialData.criteria?.location || '',
        minPrice: initialData.criteria?.minPrice?.toString() || '',
        maxPrice: initialData.criteria?.maxPrice?.toString() || '',
        bedrooms: initialData.criteria?.bedrooms?.toString() || '',
        bathrooms: initialData.criteria?.bathrooms?.toString() || '',
        minYield: initialData.criteria?.minYield?.toString() || '',
        minROI: initialData.criteria?.minROI?.toString() || '',
        keywords: initialData.criteria?.keywords || ''
      });
    } else {
       setFormData({
        name: '',
        location: '',
        minPrice: '',
        maxPrice: '',
        bedrooms: '',
        bathrooms: '',
        minYield: '',
        minROI: '',
        keywords: ''
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: initialData?.id });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden border border-stone-100"
          >
            <div className="p-8 border-b border-stone-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: GOLD_COLOR }}>
                  <Bell className="size-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#2C3E50]">{initialData ? 'Update Search Alert' : 'Create Search Alert'}</h3>
                  <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">{initialData ? 'Refine your notification criteria' : 'Get notified of matching deals'}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-stone-50 rounded-xl transition-all">
                <X className="size-6 text-stone-300" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Alert Name</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-stone-300" />
                      <input 
                        type="text" 
                        placeholder="e.g. Lisbon High Yield"
                        className="w-full pl-11 pr-4 py-3 bg-stone-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-stone-300" />
                      <input 
                        type="text" 
                        placeholder="City, Region or Country"
                        className="w-full pl-11 pr-4 py-3 bg-stone-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all peer"
                        value={formData.location}
                        onChange={e => setFormData({...formData, location: e.target.value})}
                      />
                      <div className="absolute bottom-full left-0 mb-2 w-52 bg-[#2C3E50] text-white text-[10px] font-bold rounded-xl px-3 py-2 shadow-xl opacity-0 peer-focus:opacity-100 pointer-events-none transition-opacity duration-200 z-10 leading-relaxed">
                        Enter a city, region, or country to filter alerts by location. e.g. Lisbon, Algarve, Portugal
                        <div className="absolute top-full left-4 border-4 border-transparent border-t-[#2C3E50]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 px-1">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Price Range (€)</label>
                      <div className="relative group/priceinfo">
                        <Info className="size-3 text-stone-300 cursor-pointer hover:text-[#D4AF37] transition-colors" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-[#2C3E50] text-white text-[10px] font-bold rounded-xl px-3 py-2 shadow-xl opacity-0 group-hover/priceinfo:opacity-100 pointer-events-none transition-opacity duration-200 z-10 leading-relaxed">
                          Set a minimum and maximum purchase price in euros. Leave blank to include all price ranges.
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2C3E50]" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative w-full group/min">
                        <input 
                          type="number" 
                          placeholder="Min"
                          className="w-full px-4 py-3 bg-stone-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all peer"
                          value={formData.minPrice}
                          onChange={e => setFormData({...formData, minPrice: e.target.value})}
                        />
                        <div className="absolute bottom-full left-0 mb-2 w-48 bg-[#2C3E50] text-white text-[10px] font-bold rounded-xl px-3 py-2 shadow-xl opacity-0 peer-focus:opacity-100 pointer-events-none transition-opacity duration-200 z-10 leading-relaxed">
                          Minimum purchase price (€). e.g. 50,000
                          <div className="absolute top-full left-4 border-4 border-transparent border-t-[#2C3E50]" />
                        </div>
                      </div>
                      <span className="text-stone-300 font-black shrink-0">-</span>
                      <div className="relative w-full">
                        <input 
                          type="number" 
                          placeholder="Max"
                          className="w-full px-4 py-3 bg-stone-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all peer"
                          value={formData.maxPrice}
                          onChange={e => setFormData({...formData, maxPrice: e.target.value})}
                        />
                        <div className="absolute bottom-full left-0 mb-2 w-48 bg-[#2C3E50] text-white text-[10px] font-bold rounded-xl px-3 py-2 shadow-xl opacity-0 peer-focus:opacity-100 pointer-events-none transition-opacity duration-200 z-10 leading-relaxed">
                          Maximum purchase price (€). e.g. 500,000
                          <div className="absolute top-full left-4 border-4 border-transparent border-t-[#2C3E50]" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Bedrooms</label>
                      <select 
                        className="w-full px-4 py-3 bg-stone-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all appearance-none"
                        value={formData.bedrooms}
                        onChange={e => setFormData({...formData, bedrooms: e.target.value})}
                      >
                        <option value="">Any</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Bathrooms</label>
                      <select 
                        className="w-full px-4 py-3 bg-stone-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all appearance-none"
                        value={formData.bathrooms}
                        onChange={e => setFormData({...formData, bathrooms: e.target.value})}
                      >
                        <option value="">Any</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 px-1">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Min Yield (%)</label>
                      <div className="relative group/yieldinfo">
                        <Info className="size-3 text-stone-300 cursor-pointer hover:text-[#D4AF37] transition-colors" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-[#2C3E50] text-white text-[10px] font-bold rounded-xl px-3 py-2 shadow-xl opacity-0 group-hover/yieldinfo:opacity-100 pointer-events-none transition-opacity duration-200 z-10 leading-relaxed">
                          Gross rental yield = annual rent ÷ purchase price × 100. A yield of 5%+ is generally considered strong in most European markets.
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2C3E50]" />
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-stone-300" />
                      <input 
                        type="number" 
                        step="0.1"
                        placeholder="e.g. 5.5"
                        className="w-full pl-11 pr-4 py-3 bg-stone-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all peer"
                        value={formData.minYield}
                        onChange={e => setFormData({...formData, minYield: e.target.value})}
                      />
                      <div className="absolute bottom-full left-0 mb-2 w-52 bg-[#2C3E50] text-white text-[10px] font-bold rounded-xl px-3 py-2 shadow-xl opacity-0 peer-focus:opacity-100 pointer-events-none transition-opacity duration-200 z-10 leading-relaxed">
                        Only show properties with a gross rental yield at or above this percentage.
                        <div className="absolute top-full left-4 border-4 border-transparent border-t-[#2C3E50]" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 px-1">
                      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Min ROI (%)</label>
                      <div className="relative group/roiinfo">
                        <Info className="size-3 text-stone-300 cursor-pointer hover:text-[#D4AF37] transition-colors" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-[#2C3E50] text-white text-[10px] font-bold rounded-xl px-3 py-2 shadow-xl opacity-0 group-hover/roiinfo:opacity-100 pointer-events-none transition-opacity duration-200 z-10 leading-relaxed">
                          ROI accounts for all costs (taxes, fees, maintenance) against total net profit. Higher than yield — a 10%+ ROI signals a strong investment.
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2C3E50]" />
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <BarChart3 className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-stone-300" />
                      <input 
                        type="number" 
                        step="0.1"
                        placeholder="e.g. 10.0"
                        className="w-full pl-11 pr-4 py-3 bg-stone-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all peer"
                        value={formData.minROI}
                        onChange={e => setFormData({...formData, minROI: e.target.value})}
                      />
                      <div className="absolute bottom-full left-0 mb-2 w-52 bg-[#2C3E50] text-white text-[10px] font-bold rounded-xl px-3 py-2 shadow-xl opacity-0 peer-focus:opacity-100 pointer-events-none transition-opacity duration-200 z-10 leading-relaxed">
                        Only show properties with a net ROI at or above this percentage.
                        <div className="absolute top-full left-4 border-4 border-transparent border-t-[#2C3E50]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Keywords</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Pool, Renovated, Sea View"
                    className="w-full px-4 py-3 bg-stone-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                    value={formData.keywords}
                    onChange={e => setFormData({...formData, keywords: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 bg-stone-50 text-stone-400 font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-stone-100 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl transition-all hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ backgroundColor: GOLD_COLOR, boxShadow: `0 20px 25px -5px ${GOLD_COLOR}33` }}
                >
                  <Save className="size-4" />
                  Save Alert
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
