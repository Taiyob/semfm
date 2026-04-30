'use client';

import { motion } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  TrendingUp, 
  Euro, 
  MoreHorizontal,
  PlusCircle,
  Eye,
  Edit2
} from 'lucide-react';
import Image from 'next/image';

const myListings = [
  {
    id: 1,
    title: 'Modern Apartment in Madrid',
    location: 'Madrid, Spain',
    price: '€320,000',
    yield: '5.8%',
    status: 'Published',
    views: 124,
    leads: 8,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 2,
    title: 'Luxury Villa with Sea View',
    location: 'Costa del Sol, Spain',
    price: '€1,200,000',
    yield: '4.2%',
    status: 'Pending',
    views: 0,
    leads: 0,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800',
  },
];

export default function MyListingsPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#2C3E50]">My Property Listings</h2>
          <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">Managing 2 Properties</p>
        </div>
        <button onClick={() => window.location.href = '/dashboard/listings/add'} className="px-6 py-3 bg-[#34495E] text-white font-black rounded-2xl text-xs shadow-lg shadow-[#34495E]/20 hover:scale-[1.02] transition-all flex items-center gap-2">
          <PlusCircle className="size-4" />
          Add New Listing
        </button>
      </header>

      <div className="bg-white rounded-[40px] shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50/50">
                <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Property</th>
                <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Price / Yield</th>
                <th className="px-8 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest">Performance</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {myListings.map((listing, i) => (
                <motion.tr 
                  key={listing.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="hover:bg-stone-50/50 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="size-16 rounded-xl overflow-hidden border border-stone-100 flex-shrink-0">
                        <img src={listing.image} alt={listing.title} className="size-full object-cover" />
                      </div>
                      <div>
                        <span className="text-sm font-black text-[#2C3E50] block">{listing.title}</span>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-stone-400 mt-1">
                           <MapPin className="size-3" />
                           {listing.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                      listing.status === 'Published' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-black text-[#2C3E50] block">{listing.price}</span>
                    <span className="text-[10px] font-black text-stone-400 uppercase">{listing.yield} Net Yield</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-6">
                       <div className="flex items-center gap-2">
                          <Eye className="size-4 text-stone-300" />
                          <span className="text-sm font-bold text-stone-600">{listing.views}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <TrendingUp className="size-4 text-emerald-400" />
                          <span className="text-sm font-bold text-stone-600">{listing.leads} Leads</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 text-stone-400 hover:text-[#34495E] hover:bg-white rounded-xl transition-all shadow-sm">
                          <Edit2 className="size-4" />
                       </button>
                       <button className="p-2 text-stone-400 hover:text-[#34495E] hover:bg-white rounded-xl transition-all shadow-sm">
                          <MoreHorizontal className="size-4" />
                       </button>
                    </div>
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
