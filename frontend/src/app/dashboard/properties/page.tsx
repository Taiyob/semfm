'use client';

import { motion } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Euro, 
  Heart,
  ArrowRight,
  Loader2,
  Building2
} from 'lucide-react';
import Link from 'next/link';
import { useGetSavedPropertiesQuery, useToggleSavePropertyMutation } from '@/lib/store/features/property/propertyApi';
import Swal from 'sweetalert2';

export default function MyPropertiesPage() {
  const { data: response, isLoading, isError } = useGetSavedPropertiesQuery();
  const [toggleSave] = useToggleSavePropertyMutation();

  const properties = response?.data || [];

  const handleUnsave = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleSave(id).unwrap();
      Swal.fire({
        title: 'Removed!',
        text: 'Property removed from your saved list.',
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } catch (error) {
      Swal.fire('Error', 'Failed to remove property', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="size-8 text-[#34495E] animate-spin" />
        <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">Loading saved properties...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-black text-[#2C3E50]">My Saved Properties</h2>
          <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">Tracking {properties.length} Listings</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
          <input 
            type="text" 
            placeholder="Search saved..." 
            className="pl-12 pr-4 py-3 bg-white border border-stone-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-[#34495E]/5 outline-none transition-all w-full md:w-64 shadow-sm"
          />
        </div>
      </header>

      {properties.length === 0 ? (
        <div className="bg-white p-16 rounded-[48px] border border-dashed border-stone-200 flex flex-col items-center justify-center text-center space-y-6">
          <div className="size-20 bg-stone-50 rounded-full flex items-center justify-center text-stone-200">
            <Building2 className="size-10" />
          </div>
          <div>
            <h3 className="text-xl font-black text-[#2C3E50]">No saved properties yet</h3>
            <p className="text-stone-400 text-sm font-medium max-w-sm mx-auto mt-2">
              Explore our inventory and click the heart icon to save properties you are interested in.
            </p>
          </div>
          <Link href="/properties" className="px-8 py-4 bg-[#34495E] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-[#34495E]/20">
            Browse Inventory
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property: any, i: number) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[32px] overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl hover:shadow-stone-200/50 transition-all group"
            >
              <div className="relative h-56 w-full overflow-hidden">
                 {property.image ? (
                   <img 
                     src={property.image} 
                     alt={property.title}
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                   />
                 ) : (
                   <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                     <Building2 className="size-12 text-stone-200" />
                   </div>
                 )}
                 <button 
                  onClick={(e) => handleUnsave(property.id, e)}
                  className="absolute top-4 right-4 size-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-red-500 shadow-xl hover:scale-110 active:scale-90 transition-all"
                 >
                    <Heart className="size-6 fill-current" />
                 </button>
                 <div className="absolute bottom-4 left-4 px-4 py-2 bg-[#2C3E50]/90 backdrop-blur-md text-white text-[10px] font-black rounded-xl uppercase tracking-widest">
                    {property.yield}% Yield
                 </div>
              </div>

              <div className="p-8">
                <h3 className="text-lg font-black text-[#2C3E50] mb-2 group-hover:text-[#D4A373] transition-colors truncate">
                  {property.title}
                </h3>
                <div className="flex items-center gap-2 text-stone-400 text-[10px] font-black uppercase tracking-widest mb-6">
                   <MapPin className="size-3 text-[#D4A373]" />
                   {property.location}
                </div>
                
                <div className="h-px bg-stone-50 mb-6" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-black text-stone-300 uppercase tracking-tighter mb-1">Total Value</p>
                    <p className="text-xl font-black text-[#2C3E50]">€{property.price.toLocaleString()}</p>
                  </div>
                  <Link 
                    href={`/properties/${property.id}`}
                    className="size-12 bg-stone-50 rounded-2xl flex items-center justify-center text-[#2C3E50] hover:bg-[#2C3E50] hover:text-white transition-all shadow-sm"
                  >
                    <ArrowRight className="size-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
