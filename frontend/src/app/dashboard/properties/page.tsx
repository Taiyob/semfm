'use client';

import { motion } from 'motion/react';
import { 
  Search, 
  MapPin, 
  TrendingUp, 
  Euro, 
  Heart,
  ArrowRight
} from 'lucide-react';
import Image from 'next/image';

const savedProperties = [
  {
    id: 1,
    title: 'Modern Apartment in Madrid',
    location: 'Madrid, Spain',
    price: '€320,000',
    yield: '5.8%',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 2,
    title: 'Luxury Villa with Sea View',
    location: 'Costa del Sol, Spain',
    price: '€1,200,000',
    yield: '4.2%',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 3,
    title: 'Renovated Studio in Lisbon',
    location: 'Lisbon, Portugal',
    price: '€185,000',
    yield: '6.5%',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
  },
];

export default function MyPropertiesPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#2C3E50]">My Saved Properties</h2>
          <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">Tracking 3 Listings</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
          <input 
            type="text" 
            placeholder="Search saved..." 
            className="pl-12 pr-4 py-3 bg-white border border-stone-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-[#34495E]/5 outline-none transition-all w-64 shadow-sm"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {savedProperties.map((property, i) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[32px] overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl hover:shadow-stone-200/50 transition-all group"
          >
            <div className="relative h-48 w-full overflow-hidden">
               <img 
                 src={property.image} 
                 alt={property.title}
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
               />
               <button className="absolute top-4 right-4 size-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-red-500 shadow-lg">
                  <Heart className="size-5 fill-current" />
               </button>
               <div className="absolute bottom-4 left-4 px-3 py-1 bg-[#34495E]/90 backdrop-blur-md text-white text-[10px] font-black rounded-lg uppercase">
                  {property.yield} Yield
               </div>
            </div>

            <div className="p-6">
              <h3 className="font-black text-[#2C3E50] mb-2 group-hover:text-[#34495E] transition-colors">{property.title}</h3>
              <div className="flex items-center gap-2 text-stone-400 text-xs font-bold mb-4">
                 <MapPin className="size-3" />
                 {property.location}
              </div>
              
              <div className="h-px bg-stone-50 my-4" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-stone-300 uppercase">List Price</p>
                  <p className="text-lg font-black text-[#34495E]">{property.price}</p>
                </div>
                <button className="size-10 bg-stone-50 rounded-xl flex items-center justify-center text-[#34495E] hover:bg-[#34495E] hover:text-white transition-all">
                  <ArrowRight className="size-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
