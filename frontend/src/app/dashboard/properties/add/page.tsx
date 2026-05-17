'use client';

import { motion } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  Euro, 
  TrendingUp, 
  Save, 
  ArrowLeft,
  Image as ImageIcon,
  Plus,
  Calculator,
  Wallet
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

const GOLD_COLOR = '#D4AF37';

export default function AddPropertyPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    purchasePrice: '',
    currentValue: '',
    monthlyRent: '',
    monthlyExpenses: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Logic to save property to portfolio would go here
    
    Swal.fire({
      title: 'Success!',
      text: 'Property added to your portfolio tracking.',
      icon: 'success',
      confirmButtonColor: GOLD_COLOR
    }).then(() => {
      router.push('/dashboard/properties');
    });
  };

  return (
    <div className="max-w-4xl space-y-8 pb-20">
      <header className="flex items-center gap-4">
        <Link href="/dashboard" className="p-3 bg-white border border-stone-100 rounded-2xl text-stone-400 hover:text-[#2C3E50] transition-all shadow-sm">
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-[#2C3E50]">Add Portfolio Property</h1>
          <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">Track your existing investments</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 rounded-[48px] shadow-xl shadow-stone-200/20 border border-stone-50"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Property Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-stone-300" />
                    <input 
                      type="text" 
                      placeholder="e.g. Lisbon Coastal Apartment"
                      className="w-full pl-14 pr-6 py-4 bg-stone-50 border-none rounded-3xl text-sm font-bold focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-stone-300" />
                    <input 
                      type="text" 
                      placeholder="Full Address or City"
                      className="w-full pl-14 pr-6 py-4 bg-stone-50 border-none rounded-3xl text-sm font-bold focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Purchase Price (€)</label>
                    <div className="relative">
                      <Euro className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-stone-300" />
                      <input 
                        type="number" 
                        placeholder="0.00"
                        className="w-full pl-14 pr-6 py-4 bg-stone-50 border-none rounded-3xl text-sm font-bold focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                        value={formData.purchasePrice}
                        onChange={e => setFormData({...formData, purchasePrice: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Current Market Value (€)</label>
                    <div className="relative">
                      <TrendingUp className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-stone-300" />
                      <input 
                        type="number" 
                        placeholder="0.00"
                        className="w-full pl-14 pr-6 py-4 bg-stone-50 border-none rounded-3xl text-sm font-bold focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                        value={formData.currentValue}
                        onChange={e => setFormData({...formData, currentValue: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Monthly Rental Income (€)</label>
                    <div className="relative">
                      <Wallet className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-stone-300" />
                      <input 
                        type="number" 
                        placeholder="0.00"
                        className="w-full pl-14 pr-6 py-4 bg-stone-50 border-none rounded-3xl text-sm font-bold focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                        value={formData.monthlyRent}
                        onChange={e => setFormData({...formData, monthlyRent: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Monthly Expenses (€)</label>
                    <div className="relative">
                      <Calculator className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-stone-300" />
                      <input 
                        type="number" 
                        placeholder="0.00"
                        className="w-full pl-14 pr-6 py-4 bg-stone-50 border-none rounded-3xl text-sm font-bold focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
                        value={formData.monthlyExpenses}
                        onChange={e => setFormData({...formData, monthlyExpenses: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Additional Notes</label>
                  <textarea 
                    rows={4}
                    placeholder="Describe your strategy or any key details..."
                    className="w-full px-6 py-4 bg-stone-50 border-none rounded-3xl text-sm font-bold focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all resize-none"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-6">
                <button 
                  type="submit"
                  className="flex-1 py-5 text-white font-black rounded-3xl text-sm uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                  style={{ backgroundColor: GOLD_COLOR }}
                >
                  <Save className="size-5" />
                  Save to Portfolio
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-[#2C3E50] p-8 rounded-[40px] text-white space-y-6">
            <div className="size-16 rounded-2xl flex items-center justify-center bg-white/10 border border-white/10">
              <ImageIcon className="size-8 text-white/40" />
            </div>
            <div>
              <h4 className="text-lg font-black mb-2">Property Photo</h4>
              <p className="text-white/40 text-xs font-bold leading-relaxed mb-6">
                Upload a cover photo for your property to easily identify it in your dashboard.
              </p>
              <button className="w-full py-4 bg-white/10 border border-dashed border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                <Plus className="size-4" />
                Upload Image
              </button>
            </div>
          </div>

          <div className="bg-stone-50 p-8 rounded-[40px] border border-stone-100">
            <h4 className="text-sm font-black text-[#2C3E50] mb-4">Why track your portfolio?</h4>
            <ul className="space-y-4">
              {[
                'Real-time ROI calculation',
                'Performance benchmarking',
                'Tax-ready expense tracking',
                'Appreciation monitoring'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-[10px] font-bold text-stone-400">
                  <div className="size-1.5 rounded-full" style={{ backgroundColor: GOLD_COLOR }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
